/**
 * @wang
 */
import { ComponentClass } from 'react'
import Taro, { Component, Config, getApp } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem, Video } from '@tarojs/components'

import { countDown } from '../../../../utils/common'

import '../../../../config/theme.css';
import './doingExam.less'
import menu from '../../../../config/menu'
import api from '../../../../services/api';
import inter from '../../../../config/inter';

import { connect } from '@tarojs/redux'
import { usersType } from '../../../../constants/usersType'

import asset from '../../../../config/asset'

import {
    getExanPaper
} from '../../../../actions/user'

const app = getApp();

type PageStateProps = {
    user: usersType,
}

type PageDispatchProps = {
    getExanPaper: (object) => any
}

type PageOwnProps = {}

type PageState = {
    isAnswer: boolean,
    status: number,
    topicNum: number,
    categoryId: number,
    topic_index: number,
    answer_list: any,
    answer_lists: any,
    topicList: Array<{
        answer: string,
        categoryId: number,
        cchapterId: number,
        chapterId: number,
        courseId: number,
        mtype: number,
        url: string,
        optionList: Array<{
            num: number,
            optionId: number,
            optionLabel: string,
            optionType: number,
            topicId: number,
        }>,
        title: string,
        topicId: number,
        ttype: number,
        userAnswer: {
            answer: string,
            isCorrect: number,
            testId: number,
            topicAnswer: string,
            topicId: number,
            userId: number,
        },
        userId: number,
    }>,
    duration: number,
    page: number,
    paper_id: number,
    ttype: number,
    testId: number,
    paperIsExam: boolean,
    topicStaus: number,
    isAudio: boolean,
    percentage: number,
    paperName: string,
    exerciseStatus: boolean,
    squadId: number,
    examTitle: string,
    examImg: string,
    initduration: number,
    de:number,
    ttyp:number,
}


type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface DoingExam {
    props: IProps;
}

@connect(({ user }) => ({
    user: user
}), (dispatch) => ({
    getExanPaper(object) {
        dispatch(getExanPaper(object))
    }
}))

class DoingExam extends Component<{}, PageState>  {

    // eslint-disable-next-line react/sort-comp
    config: Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '试卷一',
        navigationBarBackgroundColor: '#ffffff',
        backgroundColor: '#FAFAFA'
    }
    timer: null;

    static card_icon: string = "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/9ae54da2-cec8-4a4d-9f48-5dad17d8d1af.png"
    backgroundAudioManager: any;

    constructor() {
        super(...arguments)


        this.state = {
            status: 2,
            topicNum: 0,
            isAnswer: true,
            categoryId: 0,
            paper_id: 0,
            topic_index: 0,
            answer_list: {},
            answer_lists: {},
            duration: 0,
            topicList: [],
            page: 0,
            ttype: 0, // 0 单选  3 多选
            testId: 0,
            paperIsExam: true,
            topicStaus: 0, // 考试中
            isAudio: false,
            percentage: 0,
            paperName: '',
            exerciseStatus: false,
            squadId: 0,
            examTitle: '',
            examImg: '',
            initduration: 0,
            de:0,
            ttyp:0
        }

        this._onCountDown = this._onCountDown.bind(this);
    }
    
    componentDidShow () {
        var that = this;
        const { categoryId, paper_id, paperIsExam, e_duration, e_percentage, paperName, squadId, examTitle, lessDuration, examImg ,ttyp} = this.$router.params
        let de = 0
        this.setState({ttyp:parseInt(ttyp)})
            Taro.getStorage({
                key:'id',
                 success:(res) {
                     if(res.data==paper_id){
                        Taro.getStorage({
                            key: 'duration',
                            success:(e) {
                              console.log(e)
                              de=e.data
                               if (de!=0) {
                                that.setState({
                                    categoryId: parseInt(categoryId),
                                    paper_id: parseInt(paper_id),
                                    duration: de,
                                    initduration: de,
                                    percentage: parseInt(e_percentage),
                                    squadId: parseInt(squadId),
                                    examTitle: examTitle,
                                    examImg: examImg
                                })
                            } 
                            }
                          }) 
                     }else{
                        that.setState({
                            categoryId: parseInt(categoryId),
                            paper_id: parseInt(paper_id),
                            duration: parseInt(e_duration),
                            initduration: parseInt(e_duration),
                            percentage: parseInt(e_percentage),
                            squadId: parseInt(squadId),
                            examTitle: examTitle,
                            examImg: examImg
                        })
                     }
                    
                 },
                 fail:(err){
                    that.setState({
                        categoryId: parseInt(categoryId),
                        paper_id: parseInt(paper_id),
                        duration: parseInt(e_duration),
                        initduration: parseInt(e_duration),
                        percentage: parseInt(e_percentage),
                        squadId: parseInt(squadId),
                        examTitle: examTitle,
                        examImg: examImg
                    })
                 }
            })

       
       
       
       
        Taro.setNavigationBarTitle({
            title: paperName,
        })
        this.backgroundAudioManager = app.globalData.backgroundPlayer;
    }
    componentWillReceiveProps(nextProps) {

        const { user } = nextProps
        const { examPaper } = user

        const { topicStaus } = this.state
        
        if (user !== this.props.user) {

            let answer_list = {}
            let answer_lists = {}

            examPaper.topicList.map((topic, index) => {


                answer_list[topic.topicId] = null
                answer_lists[topic.topicId] = null

                answer_list[topic.topicId] = ''
                answer_lists[topic.topicId] = ''

            })


            this.setState({
                topicList: examPaper.topicList,
                topicNum: examPaper.topicNum,
                status: examPaper.status,
                testId: examPaper.testId,
                answer_list: answer_list,
                answer_lists: answer_lists
            }, () => {
                if (topicStaus === 0) {
                    this.timer = setInterval(() => this._onCountDown(), 1000);
                }
            })
        }
    }


    componentWillMount() {

        
    }

    componentDidMount() {

        var that = this
        const { paper_id } = that.state
        that.props.getExanPaper({
            paper_id:paper_id,
            levelId: 0
        })
    }

    componentWillUnmount() {
        // var that = this
        // const { paper_id, duration, squadId } = that.state
        // console.log(paper_id, duration)
        // api.get(inter.newExam, {
        //     squadId: squadId,
        //     lessDuration: duration,
        //     paperId: paper_id
        // }).then(res => {
            // console.log(res)
        // })
        clearInterval(this.timer);
        // that._parseAudio();
        // let pages = Taro.getCurrentPages();
        // let prevPage = pages[pages.length - 2]; //  获取上一页面
        // prevPage.setData({ //设置上一个页面的值
        //     less: duration,
        //     id:paper_id
        // });
        Taro.setStorage({
            key:'duration',
            data:duration
          })
          Taro.setStorage({
            key:'id',
            data:paper_id
          })
    }

    componentDidHide() { }


    _onCountDown() {
        var that = this;
        let { duration } = that.state

        duration--;

        if (duration === 0) {
            that.setState({
                topicStaus: 1
            })
            clearInterval(this.timer);

            Taro.showModal({
                title: '考试',
                content: '考试时间到',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        that._onSubmit()
                    }
                }
            })
        }

        that.setState({
            duration: duration
        })
    }

    swiper_box = (props) => {
        return
    }




    // 上一题
    _onPrev() {
        var that = this;
        let { topic_index } = that.state;

        if (topic_index > 0) {
            topic_index--;
        }

        this.setState({
            topic_index: topic_index
        })

        that._parseAudio();
    }


    //  下一题
    _onNext() {
        var that = this;
        let { topic_index, topicList,answer_list,ttyp } = that.state;
        if(ttyp==1){
            if(!Object.values(answer_list)[topic_index]){
                Taro.showToast({
                    title:'请完成该题',
                    icon:'none',
                    duration:2000
                });
                return;
            }
        }
        if (topic_index < (topicList.length - 1)) {
            topic_index++;

            this.setState({
                topic_index: topic_index
            })
        } else if (topic_index == (topicList.length - 1)) {
            Taro.showToast({
                title: '已是最后一题',
                icon: 'none',
                duration: 1000
            })
        }

        that._parseAudio();

    }

    // 答题

    _onAnswer(ttype, topic_id, ctopic_id, index, optionId) {

        var that = this
        const { answer_list, answer_lists } = that.state

        if (ttype === 0 || ttype === 1) {
            let answer_arr_num = (optionId + '').split(",").map(Number)
            answer_list[parseInt(topic_id)] = (optionId + '').split(",")
            answer_lists[parseInt(topic_id)] = answer_arr_num


        } else if (ttype === 3) {
            if (answer_list[topic_id] === undefined || answer_list[topic_id] === "") {
                let answer_ids: Array<any> = []

                if (answer_ids.indexOf(optionId + '') > -1) {
                    answer_ids.splice(answer_ids.indexOf(optionId + ''), 1)
                } else {
                    answer_ids.push(optionId + '')
                }
                let answer_str: string = answer_ids.join(",")

                answer_list[topic_id] = answer_str
                answer_lists[topic_id] = answer_ids.map(Number)

            } else {
                let answer_ids = answer_list[topic_id].split(",")
                if (answer_ids.indexOf(optionId + '') > -1) {
                    answer_ids.splice(answer_ids.indexOf(optionId + ''), 1)
                } else {
                    answer_ids.push(optionId + '')
                }
                let answer_str = answer_ids.join(",")

                let answer_ar = answer_ids.map(Number)

                answer_list[topic_id] = answer_str
                answer_lists[topic_id] = answer_ar


            }
        }



        that.setState({
            answer_list: answer_list,
            answer_lists: answer_lists
        })



    }


    // 选择答题卡中题目
    _selectCard(index, topic) {

        var that = this;
        that.setState({
            topic_index: index,
            isAnswer: true,
        })
    }

    //音频开始
    _playAudio() {
        var that = this
        const { topicList, topic_index } = that.state
        this.backgroundAudioManager.coverImgUrl = '1';
        this.backgroundAudioManager.src = topicList[topic_index].url;
        this.backgroundAudioManager.title = '考题音频';
        this.backgroundAudioManager.singer = '未知';

        this.backgroundAudioManager.play();

        that.setState({
            isAudio: true
        })

    }


    // 音频暂停
    _parseAudio() {
        var that = this
        that.backgroundAudioManager.pause();
        that.setState({
            isAudio: false
        })
    }


    //提交答案
    _onSubmit() {
        var that = this;
        const { duration, testId, paper_id, answer_lists, percentage, squadId, examImg, examTitle, initduration,ttyp } = that.state
        if(ttyp==1){
            let lst = Object.values(answer_lists)
            for(var i =0;i<lst.length;i++){
                if(!lst[i]){
                    Taro.showToast({
                        title:'您还有题目没有完成',
                        icon:'none',
                        duration:2000
                    });
                    return;
                }
            }
        }
        api.post(inter.userHistory,{
            ctype:27,
            etype:38,
            cctype:1,
            content_id:paper_id
        }).then(res=>{})
        api.post(inter.UserExam + testId, {
            answer: JSON.stringify(answer_lists),
            duration: initduration - duration
        }).then((res) => {
            console.log(res)
            if (res.data.status) {
                Taro.showToast({
                    title: '提交成功',
                    icon: 'none',
                    duration: 1000
                })

                Taro.navigateTo({ url: menu.exerciseResult + '?type=exam' + '&paper_id=' + paper_id + '&e_percentage=' + percentage + '&squadId=' + squadId + '&examTitle=' + examTitle +'&ttyp='+ttyp+ '&examImg=' + examImg })
            }
        })
    }


    onPullDownRefresh() {
        Taro.showNavigationBarLoading()
        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }

    _renderTopic() {
        var that = this;
        const { topic_index, answer_list, topicList, isAudio } = that.state;
        let qust = topicList[topic_index]


        if (qust.ttype === 0 || qust.ttype === 1) {
            return (
                <View className='topic_content_wrap' >
                    <View className='topic_type'>
                        <Text className='topic_type_title'>{qust.ttype === 0 ? '单选' : '判断'}</Text>
                        <Text className='topic_type_num'><Text className='text_bold'>{topic_index + 1}</Text>/{topicList.length}</Text>
                    </View>
                    <View className='topic_content'>
                        <View className='topic_title'><Text>{qust.title}</Text></View>

                        <View className='topic_box'>
                            {
                                qust.mtype === 1 ?
                                    <Image src={qust.url} className='topic_box_pic' />
                                    : null}
                            {
                                qust.mtype === 2 ?
                                    <Video
                                        src={qust.url}
                                        className='topic_box_vid'
                                        id='video'
                                    />
                                    : null}
                            {
                                qust.mtype === 3 ?
                                    <View className='topic_box_aud d_flex fd_r ai_ct'>
                                        <View className='cmic_cover' onClick={isAudio ? this._parseAudio : this._playAudio}>
                                            <Image src={isAudio ? asset.cmic_beg : asset.cmic_parse} className='cmic_parse' />
                                        </View>
                                        <Text className='default_label c33_label pl_10'>音频</Text>
                                    </View>
                                    : null}
                        </View>
                        {
                            topicList[topic_index].optionList.map((qustion, index) => {

                                const on = answer_list[topicList[topic_index].topicId] == qustion.optionId;

                                return (
                                    <View className='choosen_item' key={index + '_index'} onClick={this._onAnswer.bind(this, qust.ttype, qust.topicId, 0, index, qustion.optionId)}>
                                        <View className={on ? 'item_onicon' : 'item_icon'}><Text>{String.fromCodePoint(index + 65)}</Text></View>
                                        <View className='viewEword'  >
                                            <Text className={on ? 'item_ontxt' : 'item_txt'}>{qustion.optionLabel}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            )
        } else if (qust.ttype === 3) {
            return (
                <View className='topic_content_wrap' >
                    <View className='topic_type'>
                        <Text className='topic_type_title'>{'多选'}</Text>
                        <Text className='topic_type_num'><Text className='text_bold'>{topic_index + 1}</Text>/{topicList.length}</Text>
                    </View>
                    <View className='topic_content'>
                        <View className='topic_title'><Text>{qust.title}</Text></View>

                        <View className='topic_box'>
                            {
                                qust.mtype === 1 ?
                                    <Image src={qust.url} className='topic_box_pic' />
                                    : null}
                            {
                                qust.mtype === 2 ?
                                    <Video
                                        src={qust.url}
                                        className='topic_box_vid'
                                        id='video'
                                    />
                                    : null}
                            {
                                qust.mtype === 3 ?
                                    <View className='topic_box_aud d_flex fd_r ai_ct'>
                                        <View className='cmic_cover' onClick={isAudio ? this._parseAudio : this._playAudio}>
                                            <Image src={isAudio ? asset.cmic_beg : asset.cmic_parse} className='cmic_parse' />
                                        </View>
                                        <Text className='default_label c33_label pl_10'>音频</Text>
                                    </View>
                                    : null}
                        </View>
                        {
                            topicList[topic_index].optionList.map((qustion, index) => {
                                let on: boolean = false;
                                if (answer_list[topicList[topic_index].topicId] !== undefined) {
                                    on = (answer_list[topicList[topic_index].topicId]).indexOf(qustion.optionId) > -1;
                                }
                                return (
                                    <View className='choosen_item' key={index + '_index'} onClick={this._onAnswer.bind(this, qust.ttype, qust.topicId, 0, index, qustion.optionId)}>
                                        <View className={on ? 'item_onicon' : 'item_icon'}><Text>{String.fromCodePoint(index + 65)}</Text></View>
                                        <View className='viewEword' >
                                            <Text className={on ? 'item_ontxt' : 'item_txt'}>{qustion.optionLabel}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }



                    </View>
                </View>
            )
        }
    }




    render() {
        const { duration, topicList, isAnswer, status, answer_lists, topic_index,ttyp } = this.state
        let outside_box: any[] = new Array()
        for (let i = 0; i < topicList.length; i += 15) {
            outside_box.push(topicList.slice(i, i + 15));
        }
        console.log(outside_box)
        return (
            <View className='root'>

                <View className='head  d_flex fd_r ai_ct'>
                    <View className='d_flex fd_r ai_ct'>
                        <View className='col_1 text_c ' onClick={this._onNext}>
                            <Text>下一题</Text>
                        </View>
                        <View className='col_1 pl_20' onClick={this._onPrev}>
                            <Text className='col_1 text_c'>上一题</Text>
                        </View>
                    </View>
                    <View className='time_cost'>
                        <Text>{countDown(duration)}</Text>
                    </View>
                </View>
                {
                    status === 0||this.state.ttyp===1 ?
                        <View className='topic_wrap pl_20 pr_20 pb_20'>
                            {this._renderTopic()}
                        </View>
                        : null}

                {/* 底部 */}
                <View className='topic_menu'>
                    <View className='btn_wrap'>
                        <View className='submit_btn'
                            onClick={this._onSubmit}
                        >
                            <Text>交卷</Text>
                        </View>
                        <View className='card_btn'
                            onClick={() => { this.setState({ isAnswer: false }) }}
                        >
                            <Image className='card_icon' mode='aspectFit' src={asset.sheet} />
                            <Text>答题卡</Text>
                        </View>
                    </View>
                </View>

                {/* 弹窗显示答题情况 */}


                <View className='answer_pannel_wrap'
                    hidden={isAnswer}
                >
                    <View className='layerpannel' onClick={() => this.setState({ isAnswer: true })}></View>
                    <View className='pannel'
                        onClick={(e) => { e.stopPropagation() }}
                    >
                        <View className='pannel_head'>
                            <Text className='pannel_head_title'>答题卡</Text>
                            {/* <Text space='nbsp' className='pannel_tips'>未做  20</Text> */}
                            <View className='tips_wrap'>
                                <View className='disc'></View>
                                <Text className='pannel_tips' space='nbsp'>已做  {Object.keys(answer_lists).length}</Text>
                            </View>
                            <View className='tips_wrap'>
                                <View className='disc item_icon bg_orange'></View>
                                <Text className='pannel_tips' space='nbsp'>未做  {topicList.length - Object.keys(answer_lists).length}</Text>
                            </View>
                            <Text className='gray_label'>{topic_index}/{topicList.length}</Text>
                        </View>
                        <View className='swiper_wrap'>
                            <Swiper
                                className='swiper'
                                easing-function='linear'
                                interval={1000}
                                indicatorDots
                                displayMultipleItems={1}
                                autoplay={false}
                                vertical={false}
                                indicatorColor='#f0f0f0'
                                indicatorActiveColor='#c3c3c3'
                            >
                                {outside_box.map((ele, index) => (
                                    <SwiperItem key={ele + '_swiper_item'}>
                                        <View className='swiper_single_box'>
                                            {
                                                ele.map((_ele, idx) => {
                                                    let on: boolean = false
                                                    if (Object.keys(answer_lists).length > 0) {
                                                        on = answer_lists[_ele.topicId] !== undefined
                                                    }

                                                    return (
                                                        <View className='w_20' key={'ele' + idx}>
                                                            {
                                                                on ?
                                                                    <View className='swiper_item_wrap bg_green'
                                                                        onClick={this._selectCard.bind(this, 15 * index + idx, _ele)}
                                                                    >
                                                                        <Text>{index * 15 + idx + 1}</Text>
                                                                    </View>
                                                                    :
                                                                    <View className='swiper_item_wrap bg_white'
                                                                        onClick={this._selectCard.bind(this, 15 * index + idx, _ele)}
                                                                    >
                                                                        <Text>{index * 15 + idx + 1}</Text>
                                                                    </View>
                                                            }
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </SwiperItem>
                                ))}
                            </Swiper>
                        </View>
                    </View>
                </View>

            </View>
        )
    }
}

export default DoingExam as ComponentClass
