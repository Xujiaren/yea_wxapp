import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Picker } from '@tarojs/components'
import Tabs from '../../../components/Tabs'

import api from '../../../services/api'
import inter from '../../../config/inter'
import { subNumTxt, learnNum, percent2percent25 } from '../../../utils/common'
import menu from '../../../config/menu';
import asset from '../../../config/asset';
import '../../../config/theme.css';
import './activeLive.less'
import './liveNotice.less';


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

class liveNotice extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '直播预告'
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
        this.getRegion();
        this.getCourseLive()
    }
    getRegion = () => {
        api.get(inter.getAdress)
            .then(res => {
                if (res.data.status) {
                    let list = ['全国']
                    res.data.data.map(item => {
                        list = list.concat(item.regionName)
                    })
                    this.setState({
                        region: res.data.data,
                        areas: list
                    })
                }
            })
    }
    getCourseLive = () => {
        var that = this;
        const { sort, live_list, regionId } = this.state
        api.get(inter.CourseLive, {
            region_id: regionId,
            status: 0,
            sort: sort,
            page: this.page,
            ctype: -1,
        }).then((res) => {
            console.log(res)
            if (res.data.status) {
                let arr = res.data.data;
                if (this.page === 0) {
                    this.page = arr.page
                    this.pages = arr.pages
                    var tList = arr.items
                } else {
                    var tList: any = live_list.concat(arr.items)
                }

                this.setState({
                    live_list: tList,
                    page: arr.page,
                    pages: arr.pages,
                    refush: false,
                })
            }
        })
        api.get(inter.User)
            .then(res => {
                this.setState({
                    user: res.data.data
                })
            })
    }
    Live = () => {
        const { sort, live_list, regionId } = this.state
        api.get(inter.CourseLive, {
            region_id: regionId,
            page: this.page,
            plant: 0,
            sort: sort,
            status: 0
        }).then(res => {
            console.log(res)
            if (res.data.status) {
                let arr = res.data.data;
                if (this.page === 0) {
                    this.page = arr.page
                    this.pages = arr.pages
                    var tList = arr.items
                } else {
                    var tList: any = live_list.concat(arr.items)
                }

                this.setState({
                    live_list: tList,
                    page: arr.page,
                    pages: arr.pages,
                    refush: false,
                })
            }
        })
        api.get(inter.User)
            .then(res => {
                this.setState({
                    user: res.data.data
                })
            })
    }
    active = () => {
        const { sort, live_list } = this.state
        api.get(inter.CourseLive, {
            page: this.page,
            plant: 0,
            sort: sort,
            status: 0,
            ctype: 52,
        }).then(res => {
            console.log(res)
            if (res.data.status) {
                let arr = res.data.data;
                if (this.page === 0) {
                    this.page = arr.page
                    this.pages = arr.pages
                    var tList = arr.items
                } else {
                    var tList: any = live_list.concat(arr.items)
                }

                this.setState({
                    live_list: tList,
                    page: arr.page,
                    pages: arr.pages,
                    refush: false,
                })
            }
        })
        api.get(inter.User)
            .then(res => {
                this.setState({
                    user: res.data.data
                })
            })
    }
    componentWillUnmount() { }
    componentDidShow() { }
    componentDidHide() { }
    onPullDownRefresh() {
        const { type } = this.state
        var that = this;

        Taro.showNavigationBarLoading();
        that.setState({ refush: true })
        that.page = 0;

        that.setState({
            live_list: []
        }, () => {
            if (type == 0) {
                that.getCourseLive()
            } else if (type == 1) {
                that.Live()
            } else if (type == 2) {
                that.active()
            }

        })

        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }
    onReachBottom() {
        var self = this;
        const { page, pages, type } = this.state
        if (page < pages - 1) {
            this.page = this.page + 1
            if (type == 0) {
                self.getCourseLive()
            } else if (type == 1) {
                self.Live()
            } else if (type == 2) {
                self.active()
            }

        }
    }

    //直播数据
    onReservation = (val) => {
        const { user } = this.state;
        var page = this.page
        var that = this
        if (user.userId > 0) {
            console.log(val)
            let tmpId = 'bH2whf7pY40T4COena9BrTi3jPQDM4Ls9CRaEW7ycqU'
            Taro.requestSubscribeMessage({
                tmplIds: [tmpId],
                success(res) {
                    api.post(inter.bookCourse + val.courseId, {
                        form_id: 'wxapp',
                    }).then(res => {
                        that. onPullDownRefresh()
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
    onType = (e) => {
        const { type } = this.state
        console.log(e)
        this.page = 0
        this.setState({
            type: parseInt(e.detail.value)
        })
        if (parseInt(e.detail.value) == 0) {
            this.getCourseLive()
        } if (parseInt(e.detail.value) == 1) {
            this.Live()
        } else if (parseInt(e.detail.value) == 2) {
            this.active()
        }
    }
    onPick = (val) => {
        const { areas, region } = this.state
        console.log(val)
        let ids = 0
        let ars = '全国'
        if (val.detail.value != 0) {
            let idx = areas[parseInt(val.detail.value)]
            ids = region.filter(item => item.regionName == idx)[0].regionId
            ars = region.filter(item => item.regionName == idx)[0].regionName
        }
        this.setState({
            regionId: ids,
            areaName: ars
        }, () => {
            this.Live()
        })
    }
    render() {
        const { live, select_a, select_b, live_list, type, areaName, areas } = this.state
        return (
            <View className='boxs'>
                <View className='head row ai_ct jc_sb'>
                    <View>
                        <Picker mode='selector' range={areas} onChange={this.onPick}>
                            <View className='label_gray label_14 head_box bg_white row ai_ct jc_sb'>
                                <View className='ml_15'>{areaName}</View>
                                <Image src={asset.arrow_right} className='right mr_10' />
                            </View>
                        </Picker>
                    </View>
                    <View>
                        <Picker mode='selector' range={select_b} onChange={this.onType}>
                            <View className='label_gray label_14 head_box bg_white row ai_ct jc_sb'>
                                <View className='ml_15'>{select_b[type]}</View>
                                <Image src={asset.arrow_right} className='right mr_10' />
                            </View>
                        </Picker>
                    </View>
                </View>
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

export default liveNotice as ComponentClass