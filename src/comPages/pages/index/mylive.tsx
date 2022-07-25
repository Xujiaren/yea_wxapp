import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text} from '@tarojs/components'

import api from '../../../services/api'
import inter from '../../../config/inter'
import menu from '../../../config/menu';
import '../../../config/theme.css';
import './activeLive.less'
import './mylive.less';


type PageState = {
    status: number,
    live: Array<any>,
    select_a: Array<any>,
    select_b: Array<any>,
    sort: number,
    live_list: Array<any>
    page: number,
    pages: number,
    total: number,
    refush: boolean,
    user: any,
    type: number,
    region: Array<any>,
    regionId: number,
    areas: Array<any>,
    areaName: string,
}

class mylive extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '我的直播'
    }
    page: number;
    pages: number;

    constructor() {
        super(...arguments)

        this.page = 0;
        this.pages = 0;

        this.state = {
            status: 0,
            live: ['', '', ''],
            select_a: [],
            select_b: ['全部', '课程直播', '活动直播'],
            sort: 0,
            live_list: [],
            page: 0,
            pages: 0,
            total: 0,
            refush: false,
            user: {},
            type: 0,
            region: [],
            regionId: 0,
            areas: [],
            areaName: '全国'
        }
    }

    componentWillMount() {
    }
    componentDidMount() {
        this.getLive()
        api.get(inter.User)
        .then(res=>{
            if (res.data.status){
                this.setState({
                    user:res.data.data
                })
            }
        })
    }
   
    getLive=()=>{
       const{teacherId} = this.$router.params
        api.get('/user/teacher/owner/lives',{
            teacher_id:teacherId
        }).then(res=>{
            this.setState({
                live_list:res.data.data
            })
        })
    }

    componentWillUnmount() { }
    componentDidShow() { }
    componentDidHide() { }
  
    //直播数据
    onReservation(val){
        const { user } = this.state;
        var page = this.page
        var that = this
        if (user.userId > 0) {
            let tmpId = 'bH2whf7pY40T4COena9BrTi3jPQDM4Ls9CRaEW7ycqU'
            Taro.requestSubscribeMessage({
                tmplIds: [tmpId],
                success(res) {
                    api.post(inter.bookCourse + val.courseId, {
                        form_id: 'wxapp',
                    }).then(res => {
                        that. getLive()
                    })
                }
            })
        }
    }
    onIntoRoom = (val) => {
        const { type } = this.state
        if (val.ctype != 52) {
            Taro.navigateTo({ url: menu.liveDesc + '?courseId=' + val.courseId + '&liveStatus=' + val.liveStatus + '&liveName=' + val.courseName })
        } else {
            Taro.navigateTo({ url: menu.actveLive + '?courseId=' + val.courseId })
        }

    }
    handleStop(e) {
        e.stopPropagation()
    }
    
    render() {
        const { live, select_a, select_b, live_list, type, areaName, areas } = this.state
        return (
            <View className='boxs'>
                {
                    live_list.length > 0 ?
                        <View>
                            {
                                live_list.map((item, index) => {
                                    return (
                                        <View className='live_body mt_15' onClick={this.onIntoRoom.bind(this.setState, item)}>
                                            <View className='live_top row jc_sb as_ct pb_10'>
                                                <Text className='label_gray label_12'>{item.beginTimeFt}开播</Text>
                                                {
                                                    item.liveStatus === 0 && item.roomStatus === 0 ?
                                                        <Text className='label_light label_12'>{item.bookNum}人已预约</Text>
                                                        :
                                                        <Text className='label_light label_12'>{item.hit}在上课</Text>
                                                }
                                            </View>
                                            <View className='live_auto row col mt_10'>
                                                <View className='text font_blod label_16'>{item.courseName}</View>
                                                <View className='row jc_sb ai_ct mt_5'>
                                                    <Text className='label_gray label_12'>{item.summary}</Text>
                                                    {
                                                        item.liveStatus == 0 && item.roomStatus == 0 ?
                                                            <View onClick={this.handleStop.bind(this)}>
                                                                {
                                                                    item.book ?
                                                                        <View className='btn_into label_orange' onClick={this.onIntoRoom.bind(this.setState, item)}>进入</View>
                                                                        :
                                                                        <View className='live_btn label_white label_11' onClick={this.onReservation.bind(this, item)}>预约</View>
                                                                }
                                                            </View>
                                                            :
                                                            <View className='btn_into label_orange' onClick={this.onIntoRoom.bind(this.setState, item)}>进入</View>
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        : null
                }

            </View>
        )
    }
}

export default mylive as ComponentClass