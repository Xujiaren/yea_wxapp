import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Picker } from '@tarojs/components'
import Tabs from '../../../components/Tabs'

import api from '../../../services/api'
import inter from '../../../config/inter'
import { subNumTxt, learnNum, percent2percent25 } from '../../../utils/common'
import menu from '../../../config/menu';

import '../../../config/theme.css';
import './liveBack.less'
import asset from '../../../config/asset'

type PageState = {
    status: number,
    liveList: Array<{}>,
    page: number,
    pages: number,
    total: number,
    sort: number,
    live_list: Array<any>,
    refush: boolean,
    select_a: Array<any>,
    select_b: Array<any>,
    select_c: Array<any>,
    user:any,
    type:number,
    region:Array<any>,
    regionId:number,
    areas:Array<any>,
    areaName:string,
    field:any
}

class liveBack extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '直播回放',
        enablePullDownRefresh: true
    }
    page: number;
    pages: number;

    constructor() {
        super(...arguments)

        this.page = 0;
        this.pages = 0;

        this.state = {
            refush: false,
            status: 0,
            liveList: [],
            page: 0,
            pages: 0,
            total: 0,
            sort: 0,
            live_list: ['', '', ''],
            select_a: [],
            select_b: ['课程回放','活动回放'],
            select_c: ['最新', '最热'],
            user:{},
            type:0,
            region:[],
            regionId:0,
            areas:[],
            areaName:'全国',
            field:{},
        }
    }

    componentWillMount() {
    }
    componentDidMount() {
        api.get(inter.User)
		.then(res=>{
			this.setState({
				user:res.data.data
			})
		})
        this.getCourseLive();
        this.getCourseLives()
        this.getRegion()
    }
    componentWillUnmount() { }
    componentDidShow() { }
    componentDidHide() { }

    //直播数据
    getCourseLive() {
        var that = this;
        const { liveList, sort ,type,regionId} = that.state;
        if(type==0){
            api.get(inter.CourseLive, {
                status: 1,
                sort: sort,
                page: this.page,
                region_id:regionId,
            }).then((res) => {
                if (res.data.status) {
                    if (res.data.status) {
                        let liveLists = res.data.data
                        if (this.page === 0) {
                            var tList = liveLists.items
                        } else {
                            var tList: any = liveList.concat(liveLists.items)
                        }
    
                        this.setState({
                            liveList: tList,
                            page: liveLists.page,
                            pages: liveLists.pages,
                            total: liveLists.total
                        })
                    }
                }
            })
        }else{
            api.get(inter.CourseLive, {
                status: 1,
                sort: sort,
                page: this.page,
                region_id:regionId,
                ctype:52,
            }).then((res) => {
                if (res.data.status) {
                    if (res.data.status) {
                        let liveLists = res.data.data
                        if (this.page === 0) {
                            var tList = liveLists.items
                        } else {
                            var tList: any = liveList.concat(liveLists.items)
                        }
    
                        this.setState({
                            liveList: tList,
                            page: liveLists.page,
                            pages: liveLists.pages,
                            total: liveLists.total
                        })
                    }
                }
            })
        }
       
    }
    getCourseLives() {
        var that = this;
        api.get(inter.CourseLive, {
            status: 0,
            sort: 0,
            page: 0,
            ctype:-1,
        }).then((res) => {
            if (res.data.status) {
                that.setState({
                    live_list: res.data.data.items
                })
            }
        })
    }
    _onSelect = (index) => {
        var that = this;
        that.page = 0;
        that.setState({
            status: index,
            sort: index,
            page: 0,
            liveList: []
        }, () => {
            this.getCourseLive();
        })
    }

    // 下拉
    onPullDownRefresh() {
        var self = this


        this.page = 0;
        self.setState({
            page: 0,
            liveList: []
        }, () => {
            this.getCourseLive();

            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }

    //上拉
    onReachBottom() {
        var self = this;

        const { page, pages } = self.state

        if (page < pages) {
            this.page = this.page + 1
            this.getCourseLive();
        }
    }
    _onChange = (val) => {
        this.setState({
            status: parseInt(val.target.value),
            sort: parseInt(val.target.value),
            page: 0
        }, () => {
            this.getCourseLive();
        })
    }
    onReservation = (val) =>{
        var that =this
        const {user} = that.state;
        var page = that.page
        if(user.userId>0){
            console.log(val)
            let tmpId = 'bH2whf7pY40T4COena9BrTi3jPQDM4Ls9CRaEW7ycqU'
            Taro.requestSubscribeMessage({
                tmplIds: [tmpId],
                success(res){ 
                    api.post(inter.bookCourse+val.courseId,{
                        form_id:'wxapp',
                    }).then(res=>{
                        that.getCourseLives()
                        that.getCourseLive()
                    })
                }
            })
        }
    }
    onType=(e)=>{
        this.setState({
            type:parseInt(e.detail.value)
        },()=>{
            this.getCourseLive()
        })
    }
    getRegion=()=>{
        api.get(inter.getAdress)
        .then(res=>{
            if(res.data.status){
                let list = ['全国']
                res.data.data.map(item=>{
                    list=list.concat(item.regionName)
                })
                this.setState({
                    region:res.data.data,
                    areas:list
                })
            }
        })
    }
    onPick=(val)=>{
        const{areas,region}=this.state
        console.log(val)
        let ids = 0
        let ars = '全国'
        if(val.detail.value!=0){
            let idx = areas[parseInt(val.detail.value)]
            ids = region.filter(item=>item.regionName==idx)[0].regionId
            ars = region.filter(item=>item.regionName==idx)[0].regionName
        }
        this.setState({
            regionId:ids,
            areaName:ars
        },()=>{
            this.getCourseLive()
        })
    }
    onRoom=(val)=>{
		Taro.navigateTo({
			url:menu.liveDesc+ '?courseId=' + val.courseId + '&liveStatus=' + val.liveStatus + '&liveName=' + val.courseName
		})
	}
    render() {
        const { status, liveList, live_list, refush, select_a, select_b, select_c,type } = this.state
        console.log(live_list)
        return (
            <View className='wrap'>
                {/* <View className='atabs'>
                    <Tabs items={['最新', '最热']} atype={1} selected={status} onSelect={this._onSelect} />
                </View> */}
                {/* <View className='swip mt_20 ml_20'> */}
                {
                    live_list.length > 0 ?
                        <ScrollView
                            scrollX={true}
                            className='row rol wid mt_20'
                        >
                            <View className='row ai_ct jc_ct wids' style={{ width: live_list.length * 660 + 40 + 'rpx' }}>
                                {
                                    live_list.map((item, index) => {
                                        return (
                                            <View className='live_body ml_20' onClick={this.onRoom.bind(this,item)}>
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
                                                    <View className='text font_blod label_16'>{subNumTxt(item.courseName, 12)}</View>
                                                    <View className='row jc_sb ai_ct mt_5'>
                                                        <Text className='label_gray label_12'>{subNumTxt(item.summary, 15)}</Text>
                                                        {
                                                            item.liveStatus == 0 && item.roomStatus == 0 ?
                                                                <View>
                                                                    {
                                                                        item.book ?
                                                                            <View className='btn_into label_orange label_11' onClick={this.onRoom.bind(this,item)}>进入</View>
                                                                            :
                                                                            <View className='live_btn label_white label_11' onClick={this.onReservation.bind(this, item)}>预约</View>
                                                                    }
                                                                </View>
                                                                :
                                                                <View className='btn_into label_orange' onClick={this.onRoom.bind(this,item)}>进入</View>
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                        : null
                }

                {/* </View> */}
                <View className='head pl_20 pr_20 mt_20'>
                    <View>
                        <Picker mode='selector'  range={this.state.areas} onChange={this.onPick}>
                            <View className='btn'>
                                <View className='words'>{this.state.areaName}</View>
                                <Image src={asset.arrow_right} className='pic' />
                            </View>
                        </Picker>
                    </View>
                    <View>
                        <Picker mode='selector' range={select_b} onChange={this.onType}>
                            <View className='btns ml_10'>
                                <View className='words'>{select_b[type]}</View>
                                <Image src={asset.arrow_right} className='pic' />
                            </View>
                        </Picker>
                    </View>
                    <View>
                        <Picker mode='selector' range={select_c} onChange={this._onChange}>
                            <View className='btn ml_10'>
                                <View className='words'>{select_c[status]}</View>
                                <Image src={asset.arrow_right} className='pic' />
                            </View>
                        </Picker>
                    </View>
                </View>
                <View className='pt_20 pl_20 pr_20'>
                    {
                        liveList.map((lives: any, index) => {
                            return (
                                <View className='liveBoxs d_flex fd_r mb_15' key={'item' + index}
                                    onClick={() => Taro.navigateTo({
                                        url: menu.courseDesc + `?course_id=${lives.courseId}` + '&courseName=' + percent2percent25(`${lives.courseName}`) + '&isback=1'
                                    })}
                                >
                                    <Image src={lives.courseImg} className='liveCover' />
                                    <View className='d_flex fd_c jc_sb ml_10 col_1'>
                                        <View className='d_flex fd_c'>
                                            <Text className='default_label c33_label fw_label'>{subNumTxt(lives.courseName, 12)}</Text>
                                            <View className='recom_bg'>
                                                <Text className='sm_label tip_label'>{lives.teacherName}{lives.teacher.honor.length > 0 && lives.teacher.honor !== undefined ? '·' : ''}{lives.teacher.honor}</Text>
                                            </View>
                                        </View>
                                        <View className='d_flex fd_r jc_sb ai_ct'>
                                            {
                                                lives.integral > 0 ?
                                                    <Text className='red_label sm_label'>{lives.integral}学分</Text>
                                                    :
                                                    <Text className='red_label sm_label'>免费</Text>
                                            }
                                            <Text className='sm_label tip_label'>{learnNum(lives.hit)}</Text>
                                        </View>

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

export default liveBack as ComponentClass