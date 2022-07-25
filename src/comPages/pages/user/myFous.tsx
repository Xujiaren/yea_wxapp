import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import menu from '../../../config/menu';
import Tabs from '../../../components/Tabs'
import { formatTimeStampToTime, percent2percent25 } from '../../../utils/common'

import asset1 from '../../config/asset'

import inter from '../../../config/inter'
import api from '../../../services/api'
import '../../../config/theme.css';
import './myFous.less'

type PageState = {
    status: number,
    isFollow: boolean,
    lecture: Array<number>,
    focustList: Array<{
        content: string,
        course: number,
        follow: number,
        galleryList: Array<{}>,
        hit: number,
        honor: string,
        isFollow: false
        level: number,
        teacherId: number,
        teacherImg: string,
        teacherName: string,
        userId: number,
        userImg: string,
    }>,
    focusaList: Array<{
        activityId: number,
        activityImg: string,
        atype: number,
        beginTime: number,
        beginTimeFt: string,
        content: string,
        contentId: number,
        ctype: number,
        endTime: number,
        endTimeFt: string,
        flag: string,
        follow: number,
        hit: number,
        integral: number,
        isDelete: number,
        num: number,
        pubTime: number,
        pubTimeFt: string,
        rule: string,
        signendTime: number,
        signendTimeFt: string,
        status: number,
        title: string,
        voteendTime: number,
        voteendTimeFt: string,
    }>,
    ctype: number, // 1老师 活动
    page: number,
    pages: number,
    total: number,
    nowdate: number,
    focusqList: Array<any>,
}

class myFous extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '我的关注',
        enablePullDownRefresh: true
    }

    page: number;
    pages: number;

    constructor() {
        super(...arguments)

        this.page = 1;
        this.pages = 1;

        this.state = {
            status: 0,
            isFollow: false,
            lecture: [1, 2, 3, 4, 5],
            focustList: [],
            focusaList: [],
            focusqList: [],
            ctype: 1, // 1老师 活动
            page: 1,
            pages: 1,
            total: 0,
            nowdate: 0,
        }
    }

    componentWillMount() {
        var nowTime = new Date();
        this.setState({
            nowdate: nowTime.getTime()
        })
    }

    componentDidMount() {
        var that = this;
        that.getFocus();
    }

    componentWillUnmount() {

    }

    componentDidShow() {
        var that = this
        that.getFocus();
    }

    componentDidHide() { }


    getFocus() {

        var that = this;
        const { focustList, focusaList, focusqList, ctype, status } = that.state


        api.get(inter.follow, {
            ctype: ctype,
            page: this.page
        }).then((res) => {
            if (res.data.status) {
                let fLists = res.data.data;


                if (status === 0) {
                    if (this.page === 1) {
                        var tList = fLists.items
                    } else {
                        var tList: any = focustList.concat(fLists.items)
                    }
                    that.setState({
                        focustList: tList,
                        page: fLists.page,
                        pages: fLists.pages,
                        total: fLists.total
                    })
                } else if (status === 1) {
                    if (this.page === 1) {
                        var tList = fLists.items
                    } else {
                        var tList: any = focusaList.concat(fLists.items)
                    }
                    that.setState({
                        focusaList: tList,
                        page: fLists.page,
                        pages: fLists.pages,
                        total: fLists.total
                    })
                } else if (status === 2) {
                    if (this.page === 1) {
                        var tList = fLists.items
                    } else {
                        var tList: any = focusqList.concat(fLists.items)
                    }
                    that.setState({
                        focusqList: tList,
                        page: fLists.page,
                        pages: fLists.pages,
                        total: fLists.total
                    })
                }

            }
        })
    }

    _onSelect = (index) => {
        var that = this;
        that.page = 1;

        let idx = 0;

        if (index === 0 || index === 1) {
            idx = index + 1;
        } else if (index === 2) {
            idx = 10
        }

        that.setState({
            status: index,
            ctype: idx,
            focusqList: [],
            focusaList: [],
            focustList: [],
            page: 1,
            pages: 1,
        }, () => {
            that.getFocus();
        })
    }


    // 下拉
    onPullDownRefresh() {
        var self = this
        const { status } = self.state;

        this.page = 1;

        if(status === 0){

            self.setState({
                page:1,
                focustList:[]
            },()=>{
                self.getFocus();
            })

        } else if(status === 1) {

            self.setState({
                page:1,
                focusaList:[]
            },()=>{
                self.getFocus();
            })

        } else if(status === 2){

            self.setState({
                page:1,
                focusqList:[]
            },()=>{
                self.getFocus();
            })
        }

    }


    //上拉
    onReachBottom() {
        var self = this;

        const { page, pages, status } = self.state

        if (page < pages) {
            this.page = this.page + 1
            self.getFocus();
        }
    }

    handleStop(e) {
        e.stopPropagation()
    }

    _offFollow(item) {
        const that = this
        api.post(inter.RemoveFollow + item.teacherId).then((res) => {
            if (res.data.status) {
                Taro.showToast({
                    title: '取消成功',
                    icon: 'none'
                })
                this.page = 1;
                that.getFocus();
            } else {
                Taro.showToast({
                    title: '取消失败',
                    icon: 'none'
                })
            }
        })
    }

    artDesc(item) {
        Taro.navigateTo({
            url: menu.activityDesc + '?activityId=' + item.activityId + '&articleName=' + percent2percent25(item.title)
        })
    }


    render() {
        const { status, focusaList, focustList, nowdate, focusqList } = this.state;

        return (
            <View className='focus'>
                <View className='headbox'>
                    <View className='atabs pl_30 pr_30 bg_white'>
                        <Tabs items={['讲师', '活动','问题']}  selected={status} onSelect={this._onSelect} />
                    </View>
                </View>

                <View className='wrap'>
                    {
                        status === 0 ?
                        <View className='items'>
                            {
                                focustList.map((item,index)=>{
                                    
                                    let lectArray:string [] = new Array()
                                    let lectString:string = item.honor
                                    if(lectString.indexOf('&') != -1){
                                        lectArray.push(lectString.split('&')[0],lectString.split('&')[1])
                                    } else {
                                        lectArray.push(item.honor)
                                    }
                                    return(
                                        <View className='item' key={'item' + index} 
                                            onClick={()=>Taro.navigateTo({url:menu.teachZone+ '?teacher_id=' +`${item.teacherId}`})}
                                        >
                                            <View className='d_flex item_right '>                                                                                                           
                                                <View className='item_cover'> 
                                                    <Image className='item_cover'  src={item.teacherImg} />
                                                </View>
                                                <View className='d_flex fd_c jc_sb ml_10 col_1'>
                                                    <View>
                                                        <View className='d_flex fd_r jc_sb ai_ct'>
                                                            <Text className='lg_label black_label fw_label'>{item.teacherName}</Text>
                                                            <View onClick={this.handleStop.bind(this)}>
                                                                <View className='focuson d_flex jc_ct ai_ct' 
                                                                    onClick={this._offFollow.bind(this,item,index)}
                                                                >
                                                                    <Text className='red_label sm_label'>取消关注</Text>
                                                                </View>
                                                            </View>
                                                                
                                                        </View>
                                                        <View className='d_flex fd_c'>
                                                            {
                                                                lectArray.map((lectstr:any,index)=>{
                                                                    return(
                                                                        <Text className='default_label gray_label mt_5' style={{lineHeight:'30rpx',}} key={'lectstr'+index}>{lectstr}</Text>
                                                                     )
                                                                })
                                                            } 
                                                        </View>
                                                    </View>
                                                    <Text className='sm_label tip_label' style={{lineHeight:'24rpx',}}>共 {item.course} 课</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    :null}
                    {
                        status === 1 ?
                            <View className='article'>
                                {
                                    focusaList.map((item, index) => {
                                        console.log(item)
                                        const on = focusaList.length === index + 1
                                        let tip = '';
                                        if (item.beginTime * 1000 > nowdate) {
                                            tip = '未开始';
                                        } else if (item.beginTime * 1000 < nowdate && item.endTime * 1000 > nowdate) {
                                            tip = '进行中';
                                        } else {
                                            tip = '已结束';
                                        }
                                        return (
                                            <View className='articleItems' onClick={this.artDesc.bind(this, item)} key={'item' + index}
                                                style={on ? { borderBottom: 0 + 'rpx' } : {}}
                                            >
                                                <View className='arthead'>
                                                    <Image className='arthead_cover' src={item.activityImg} />
                                                    <View className='topright'>
                                                        <Text className='toptxt'>{tip}</Text>
                                                    </View>
                                                    <View className='artbottom'>
                                                        <Text className='artbot'>{formatTimeStampToTime(item.beginTime * 1000)} - {formatTimeStampToTime(item.endTime * 1000)}</Text>
                                                    </View>
                                                </View>
                                                <View className='d_flex fd_r ai_ct jc_sb mt_15'>
                                                    <Text className='lg_label c33_label'>{item.title}</Text>
                                                    <Text className='tip_label sm_label'>{item.num}人参与</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            : null}
                    {
                        status === 2 ?
                            <View className='quest'>
                                {
                                    focusqList.map((item, index) => {
                                        let on = focusqList.length - 1 === index;
                                        return (
                                            <View key={'item' + index} className={on ? ' pb_15 d_flex fd_c ' : ' pb_15 d_flex fd_c border_bt'}
                                                onClick={() => Taro.navigateTo({ url: menu.question + '?askId=' + item.askId })}
                                            >

                                                <View className='d_flex fd_r ai_ct '>
                                                    {
                                                        item.avatar.length > 0 ?
                                                            <Image src={item.avatar} className='q_cover' />
                                                            : null}

                                                    <Text className='c33_label default_label fw_label ml_10'>{item.nickname}</Text>
                                                </View>

                                                <Text className='c33_label lg_label mt_15'>{item.title}</Text>
                                                <Text className='c33_label sm_label mt_10'>{item.content}</Text>

                                                <View className='d_flex fd_r ai_ct mt_10'>
                                                    <View className='d_flex fd_r ai_ct '>
                                                        <Image src={asset1.parse} mode='aspectFit' className='icon_cover' />
                                                        <Text className='sm_label tip_label ml_5'>{`${item.approval}赞同`}</Text>
                                                    </View>
                                                    <View className='d_flex fd_r ai_ct ml_30'>
                                                        <Image src={asset1.comt} mode='aspectFit' className='icon_cover' />
                                                        <Text className='sm_label tip_label ml_5'>{item.comment}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            : null}
                </View>
            </View>
        )
    }
}

export default myFous as ComponentClass