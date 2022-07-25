import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, RadioGroup, Label, Radio, CheckboxGroup, Checkbox, Textarea, Canvas } from '@tarojs/components'


import asset from '../../../config/asset';

import inter from '../../../config/inter'
import api from '../../../services/api'
import '../../../config/theme.css';
import './questSurvey.less'



type PageState = {
    load: boolean,
    activityId: number,
    itemIndex: number,
    itemName: string,
    itemIntegral: number,
    isReceive: boolean,
    isNotaward: boolean,
    haveChance: boolean,

    answer_list: any,
    answer_lists: any,
    paperList: Array<{
        analysis: string,
        answer: string,
        categoryId: number,
        cchapterId: number,
        chapterId: number,
        courseId: number,
        isAnswer: false,
        mtype: number,
        optionList: Array<{}>,
        title: string,
        topicId: number,
        ttype: number,
        url: string,
        userAnswer: object,
        userId: number,
    }>,
    content: string,
    scratch: boolean,
    avatar: string,
    isScroll: boolean,
    courseId: number,
    itemImg: string,
    stype:number,
}


class questSurvey extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '问卷调查'
    }
    r: number;
    lastY: number;
    minX: any;
    minY: any;
    maxX: any;
    maxY: any;
    isStart: boolean;
    width: number;
    height: number;
    rpx: number
    lastX: number;

    constructor() {
        super(...arguments)

        this.r = 8;
        this.lastX = 0
        this.lastY = 0
        this.minX = ''
        this.minY = ''
        this.maxX = ''
        this.maxY = ''
        this.isStart = false

        this.state = {
            load: false,
            activityId: 0,
            itemIndex: 0,
            itemName: '',
            itemIntegral: 0,
            haveChance: false,
            isReceive: false,
            isNotaward: false,
            paperList: [],
            answer_list: {},
            answer_lists: {},
            content: '',
            scratch: false,
            avatar: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/07f54c7a-fbf2-4820-bef5-2f0aa5f1d8e0.png',
            isScroll: false,
            courseId: 0,
            itemImg: '',
            stype:3,
        }

        this._drawScratch = this._drawScratch.bind(this);
        this.touchStart = this.touchStart.bind(this)
        this.touchMove = this.touchMove.bind(this)
        this.touchEnd = this.touchEnd.bind(this)
    }

    componentWillMount() {

        var that = this;
        const { activityId, courseId,stype } = that.$router.params
        that.setState({
            activityId: parseInt(activityId),
            courseId: parseInt(courseId),
            stype:parseInt(stype)
        })
    }

    componentDidMount() {
        var that = this;
        that._getPaper();
        // that._drawPic();
        // that._drawScratch();
        this.rpx = 3;
        Taro.getSystemInfo({
            success: function (res: { windowWidth: number; }) {
                this.rpx = res.windowWidth / 375
            }
        })

        this.width = 250;
        this.height = 125;


        this.context = Taro.createCanvasContext('Scratch', that);

        this.isStart = true
    }

    componentWillUnmount() {

    }

    componentDidShow() { }
    componentDidHide() { }


    _getPaper() {
        var that = this;
        const { activityId, courseId,stype } = that.state
        Taro.showLoading({
            title: '加载中',
          })
        if (activityId == 0) {
            api.get('/course/' + courseId + '/paper',{
                stype:stype
            }).then(res => {
                    if (res.data.status) {
                        that.setState({
                            paperList: res.data.data,
                            load: true
                        })
                        Taro.hideLoading()
                    }
                })
        } else {
            api.get(inter.ActivityPaper + activityId + '/paper')
                .then((res) => {
                    if (res.data.status) {
                        that.setState({
                            paperList: res.data.data,
                            load: true
                        })
                        Taro.hideLoading()
                    }
                })
        }
    }



    // 单选多选 答题
    _onAnswer(type, item, label, index) {

        var that = this
        const { answer_list, answer_lists } = that.state

        // answer_list[label.topicId] = null

        if (type === 0) {

            let answer_arr_num = (label.optionId + '').split(",").map(Number)
            answer_list[parseInt(label.topicId)] = (label.optionId + '').split(",")
            answer_lists[parseInt(label.topicId)] = answer_arr_num


        } else if (type === 1) {
            if (answer_list[label.topicId] === undefined || answer_list[label.topicId] === "" || answer_list[label.topicId] === null) {

                let answer_ids: Array<any> = []
                if (answer_ids.indexOf(label.optionId + '') > -1) {

                    answer_ids.splice(answer_ids.indexOf(label.optionId + ''), 1)

                } else {

                    answer_ids.push(label.optionId + '')

                }

                let answer_str: string = answer_ids.join(",")

                answer_list[label.topicId] = answer_str
                answer_lists[label.topicId] = answer_ids.map(Number)

            } else {

                let answer_ids = answer_list[label.topicId].split(",")
                if (answer_ids.indexOf(label.optionId + '') > -1) {

                    answer_ids.splice(answer_ids.indexOf(label.optionId + ''), 1)

                } else {
                    answer_ids.push(label.optionId + '')
                }
                let answer_str = answer_ids.join(",")
                let answer_ar = answer_ids.map(Number)

                answer_list[label.topicId] = answer_str
                answer_lists[label.topicId] = answer_ar

            }
        }

        that.setState({
            answer_list: answer_list,
            answer_lists: answer_lists
        })
    }


    // 输入框 输入性 答题
    _content = (item, e) => {

        var that = this
        const { answer_list, answer_lists } = that.state

        answer_list[parseInt(item.topicId)] = e.detail.value
        answer_lists[parseInt(item.topicId)] = e.detail.value.split(",][;")

        that.setState({
            answer_list: answer_list,
            answer_lists: answer_lists
        })

    }

    // 表单提交
    _onScratch() {
        var that = this;

        const { answer_lists, activityId, paperList, courseId } = that.state

        if (Object.keys(answer_lists).length < paperList.length) {

            Taro.showToast({
                title: '请完成问卷再提交',
                icon: 'none',
                duration: 1000,
            })

        } else {
            if(courseId||courseId!=0){
                api.post(inter.userHistory,{
                    ctype:22,
                    etype:38,
                    cctype:1,
                    content_id:courseId
                }).then(res=>{})
            }else{
                api.post(inter.userHistory,{
                    ctype:2,
                    etype:38,
                    cctype:1,
                    content_id:activityId
                }).then(res=>{})
            }
           
            if (activityId == 0) {
                api.post('/course/' + courseId + '/answer', {
                    answer: JSON.stringify(answer_lists),
                }).then(res => {
                    if (res.data.status) {
                        //提交成功 执行刮刮卡
                        that._drawPic();
                    } else {
                        Taro.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 1000
                        })
                    }
                })
            } else {
                api.post(inter.ActivityAnswer + activityId + '/answer', {
                    answer: JSON.stringify(answer_lists),
                }).then((res) => {
                    if (res.data.status) {
                        //提交成功 执行刮刮卡
                        that._drawPic();
                    } else {
                        Taro.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 1000
                        })
                    }
                })
            }
        }

    }


    //  点击刮卡
    _scratchBtn() {
        var that = this;
        const { activityId } = that.state
        api.get(inter.lotteryInfo, {
            activity_id: 18,
            ctype: 2,
            content_id: activityId
        }).then((res) => {
            if (res.data.status) {
                let info = res.data.data
                that.setState({
                    itemName: info.itemName,
                    itemIndex: info.itemIndex,
                    itemIntegral: info.integral,
                    haveChance: true,
                    itemImg: info.itemImg
                })
            }
        })

    }



    drawRect(x, y) {
        const { r, minX, minY, maxX, maxY } = this


        const x1 = x - r > 0 ? x - r : 0
        const y1 = y - r > 0 ? y - r : 0
        if ('' != minX) {
            this.minX = minX > x1 ? x1 : minX
            this.minY = minY > y1 ? y1 : minY
            this.maxX = maxX > x1 ? maxX : x1
            this.maxY = maxY > y1 ? maxY : y1
        } else {
            this.minX = x1
            this.minY = y1
            this.maxX = x1
            this.maxY = y1
        }
        this.lastX = x1
        this.lastY = y1

        return [x1, y1, 2 * r]
    }

    //  生成刮刮卡画布
    _drawPic() {
        let that = this;
        Taro.showLoading({
            title: '准备中'
        });

        Taro.getImageInfo({
            src: that.state.avatar + '?x-oss-process=image/resize,w_250',
        }).then((res) => {
            Taro.setStorageSync('pic_img', {
                path: res.path,
                width: res.width,
                height: res.height
            });
            Taro.hideLoading();
            that._drawScratch();
        })
    }

    //  生成刮刮卡画布
    _drawScratch() {

        var that = this
        // console.log(that.width, that.rpx , that.height);

        let picObj = Taro.getStorageSync('pic_img');

        // let context = Taro.createCanvasContext('Scratch',that);

        // 生成背景图片
        that.context.drawImage(picObj.path, 0, 0, 280, 136); // 推进去图片
        that.context.draw();
        that.setState({
            scratch: true
        })
    }

    touchStart(e) {
        var that = this;

        if (!that.isStart) return
        const pos = that.drawRect(e.touches[0].x, e.touches[0].y)

        console.log(pos);
        that.context.clearRect(pos[0], pos[1], pos[2], pos[2])
        that.context.draw(true)


    }

    touchMove(e) {
        if (!this.isStart) return
        const pos = this.drawRect(e.touches[0].x, e.touches[0].y)
        this.context.clearRect(pos[0], pos[1], pos[2], pos[2])
        this.context.draw(true)
    }


    touchEnd(e) {
        if (!this.isStart) return
        // 自动清楚采用点范围值方式判断
        const { width, height, minX, minY, maxX, maxY } = this
        const { itemIntegral } = this.state

        console.log(width, height, minX, minY, maxX, maxY)

        if (maxX - minX > .7 * width && maxY - minY > .7 * height) {
            this.context.draw()
            this.endCallBack && this.endCallBack()
            this.isStart = false

            if (itemIntegral > 0) {
                this.setState({
                    isScroll: true,
                    isReceive: true
                })
            } else {
                this.setState({
                    isScroll: true,
                })
            }
        }
    }

    // 刮刮卡 中奖
    endCallBack() {
        var that = this;
        const { itemName, itemIntegral } = that.state

        Taro.showToast({
            title: itemName,
            icon: 'success',
            duration: 1000,
        })

        if (itemIntegral === 0) {
            that.setState({
                isNotaward: true,
            })
        }
    }

    disMove(e) {
        e.preventDefault();
        e.stopPropagation();
        return;
    }


    // 领取奖品
    _receive() {
        var that = this;
        const { itemIndex, activityId } = that.state

        api.post(inter.getLottery, {
            activityId: 18,
            itemIndex: itemIndex,
        }).then((res) => {
            if (res.data.status) {
                Taro.showToast({
                    title: '领取成功',
                    icon: 'success',
                    duration: 1000,
                })

                setTimeout(() => {
                    Taro.navigateBack();
                }, 1000)

            }
        })


    }

    _notAward() {
        Taro.navigateBack();
    }

    render() {
        if (!this.state.load) return null;


        const { scratch, paperList, answer_list, haveChance, isReceive, itemName, isNotaward, itemImg } = this.state

        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {

        }

        // console.log(paperList,'paperList')

        return (
            <View className='wrap' style={scratch ? { height: 100 + 'vh' } : {}}>

                <View className='from pb_30' hidden={scratch}>
                    {
                        paperList.map((item, index) => {
                            return (
                                <View key={'item' + index}>

                                    {
                                        item.ttype === 0 ?
                                            <View className='fromItem'>
                                                <View className='fromhead'>
                                                    <Text className='black_label default_label fw_label'>{index + 1}.{item.title}</Text>
                                                </View>
                                                <View className='qustList'>
                                                    {
                                                        item.optionList.map((label: any, i) => {

                                                            const on = answer_list[label.topicId] == label.optionId;

                                                            return (
                                                                <View className='item' key={'label' + i} onClick={this._onAnswer.bind(this, 0, item, label, i)}>
                                                                    <Image src={on ? asset.select_full : asset.select} className='radio_cover' />
                                                                    <Text className='default_label c33_label ml_10 col_1'>{label.optionLabel}</Text>
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            </View>
                                            : null}

                                    {
                                        item.ttype === 3 ?
                                            <View className='fromItem'>
                                                <View className='fromhead d_flex fd_r ai_ct'>
                                                    <Text className='black_label default_label fw_label col_1'>{index + 1}.{item.title}</Text>
                                                    <Text className='tip_label sm_label'>（多选）</Text>
                                                </View>
                                                <View className='qustList'>
                                                    {
                                                        item.optionList.map((label: any, i) => {

                                                            let on: boolean = false;
                                                            if (answer_list[label.topicId] !== undefined) {
                                                                on = (answer_list[label.topicId]).indexOf(label.optionId) > -1;
                                                            }

                                                            return (
                                                                <View className='item' key={'label' + i} onClick={this._onAnswer.bind(this, 1, item, label, i)}>
                                                                    <Image src={on ? asset.check_full : asset.check} className='check_cover' />
                                                                    <Text className='default_label c33_label ml_10 col_1'>{label.optionLabel}</Text>
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            </View>
                                            : null}

                                    {
                                        item.ttype === 4 ?
                                            <View className='fromItem'>
                                                <View className='fromhead'>
                                                    <Text className='black_label default_label fw_label'>{index + 1}.{item.title}</Text>
                                                </View>
                                                <View className='qustList'>
                                                    <Textarea
                                                        style={{ width: (windowWidth - 100) + 'px' }}
                                                        className='writecons'
                                                        maxlength={1000}
                                                        placeholder='说说你的看法'
                                                        placeholderStyle='fize-size:28rpx'
                                                        value={answer_list[item.topicId]}
                                                        onInput={this._content.bind(this, item)}
                                                    />
                                                </View>
                                            </View>
                                            : null}

                                </View>
                            )
                        })
                    }

                    {
                        paperList.length > 0 ?
                            <View className='onSumbit' onClick={this._onScratch}>
                                <Text className='white_label default_label'>提交</Text>
                            </View>

                            : null}

                </View>


                <View className='layer' hidden={!scratch} onTouchMove={e => this.disMove(e)}>
                    <View className='layerBox'>
                        <View className='layerDesc d_flex fd_c ai_ct'>
                            <Image className='modal_img' mode='widthFix' src={"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/573f0f5c-8e9f-4d9b-b1c2-f3ae79b45326.png"} />
                            <View className='layerCons'>

                                {
                                    haveChance ?
                                        <Canvas canvasId='Scratch'
                                            onTouchStart={this.touchStart}
                                            onTouchMove={this.touchMove}
                                            onTouchEnd={this.touchEnd}
                                            style={{ width: '500rpx', height: '250rpx', zIndex: 99, marginTop: 100 + 'rpx' }} >
                                        </Canvas>
                                        :
                                        <View style={{ width: '500rpx', height: '250rpx', zIndex: 99, marginTop: 100 + 'rpx' }} >
                                        </View>
                                }

                                <View className='drawBox'>
                                    <View className={isReceive ? 'jcct mts' : 'jcct mt_200'}>
                                        <Text className='c33_label default_label'>{itemName}</Text>
                                    </View>

                                    {
                                        isReceive ?
                                            <View className='jcct'>
                                                <Image src={itemImg} className='ws_60' />
                                            </View>

                                            : null
                                    }
                                </View>
                                {
                                    !haveChance ?
                                        <View className='drawBox_lay d_flex jc_ct ai_ct' >
                                            <Text className='lg_label fw_label' style={{ color: '#949494' }}>获得一张刮刮卡</Text>
                                        </View>
                                        : null}

                                {
                                    !haveChance ?
                                        <View className='scratchBtn' onClick={this._scratchBtn}>
                                            <Text className='white_label default_label'>点击刮卡</Text>
                                        </View>
                                        : null}

                                {
                                    isReceive ?
                                        <View className='scratchBtn' onClick={this._receive}>
                                            <Text className='white_label default_label'>点击领取</Text>
                                        </View>
                                        : null}

                                {
                                    isNotaward ?
                                        <View className='scratchBtn' onClick={this._notAward}>
                                            <Text className='white_label default_label'>再接再厉</Text>
                                        </View>
                                        : null}

                            </View>
                        </View>
                        <View onClick={() => this.setState({ scratch: false })} className='dete_box'>
                            <Image src={asset.dete_icon} style={{ width: 50 + 'rpx', height: 50 + 'rpx' }} />
                        </View>
                    </View>
                </View>


            </View>
        )
    }
}

export default questSurvey as ComponentClass