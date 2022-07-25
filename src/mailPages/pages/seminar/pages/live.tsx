import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Image,Video,ScrollView} from '@tarojs/components'
import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import Tabs from '../../../../components/Tabs'
import { subNumTxt, liveday, time_ms, learnNum, percent2percent25, formatTimeStampToTime, encryNumber } from '../../../../utils/common'
import '../home.less'
import './live.less'



type PageState = {
    lives:Array<any>,
    livess:Array<any>,
    status:number,
    page:number,
    user:any,
    pages:number,
    refush:boolean
}


class live extends Component<{}, PageState> {
    config = {
        navigationStyle: 'custom',
    }
    page: number
    pages: number


    constructor(props) {
        super(props)

        this.page = 0;
        this.pages = 0;

        this.state = {
            lives: [],
            livess: [],
            status: 0,
            user:{},
            page:0,
            pages:0,
            refush:false
        }

    }

    componentDidMount() {
        api.get(inter.User)
		.then(res=>{
			this.setState({
				user:res.data.data
			})
		})
        this.onHeaderRefresh()
    }

    componentDidShow() {
        
    }
    onHeaderRefresh = () => {
        api.get(inter.CourseLive,{
			status:1,
			page:0,
            ctype:51
		})
		.then(res=>{
			if (res.data.status) {

                let arr = res.data.data;
                if (this.page === 0) {
                    this.page = arr.page
                    this.pages = arr.pages
                    var tList = arr.items
                } else {
                    var tList: any = this.state.livess.concat(arr.items)
                }

                this.setState({
                    livess: tList,
                    page: arr.page,
                    pages: arr.pages,
                    refush:false,
                })

            }
		})
		api.get(inter.CourseLive,{
			status:0,
			sort:0,
			page:0,
            ctype:51
		})
		.then(res=>{
			if (res.data.status) {

                let arr = res.data.data;
                if (this.page === 0) {
                    this.page = arr.page
                    this.pages = arr.pages
                    var tList = arr.items
                } else {
                    var tList: any = this.state.lives.concat(arr.items)
                }

                this.setState({
                    lives: tList,
                    page: arr.page,
                    pages: arr.pages,
                    refush:false,
                })

            }
		})
    }
    top=()=>{
        var that = this;

        Taro.showNavigationBarLoading();
        that.setState({refush:true})
        that.page = 0;

        that.setState({
            lives: [],
            livess: [],
        }, () => {
            that.onHeaderRefresh()
        })

        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }
    foot=()=>{
        var self = this;
        const { page, pages} = this.state
        if (page < pages-1) {
            this.page=this.page+1
            self.onHeaderRefresh()
        }
    }
    onChange = (e) => {
        if (this.state.status != e) {
            this.setState({ status: e ,page:0,pages:0})
        }
    }
     onReservation = (val) =>{
        const {user} = this.state;
        var page = this.page
        var that = this
        if(user.userId>0){
            console.log(val)
            let tmpId = 'bH2whf7pY40T4COena9BrTi3jPQDM4Ls9CRaEW7ycqU'
            Taro.requestSubscribeMessage({
                tmplIds: [tmpId],
                success(res){
                    api.post(inter.bookCourse+val.courseId,{
                        form_id:'wxapp',
                    }).then(res=>{
                        that.onHeaderRefresh()
                        // api.get(inter.CourseLive,{
                        //     status:1,
                        //     page:0
                        // })
                        // .then(res=>{
                        //     this.setState({
                        //         livess:res.data.data.items
                        //     })
                        // })
                        // api.get(inter.CourseLive,{
                        //     status:0,
                        //     sort:0,
                        //     page:0
                        // })
                        // .then(res=>{
                        //     this.setState({
                        //         lives:res.data.data.items
                        //     })
                        // })
                    })
                }
            })
        }
    }
    onRoom=(val)=>{
        if(val.ctype==53){
            Taro.navigateTo({ url: menu.actveLive+'?courseId='+val.courseId })
        }else{
            Taro.navigateTo({
                url:menu.liveDesc+ '?courseId=' + val.courseId + '&liveStatus=' + val.liveStatus + '&liveName=' + val.courseName+'&typs=2'
            })
        }
		
	}
    _livedesc(item) {
        Taro.navigateTo({
            url: menu.courseDesc + `?course_id=${item.courseId}` + '&courseName=' + percent2percent25(`${item.courseName}`) + '&isback=1'
        })
    }
    handleStop(e) {
		e.stopPropagation()
	}
    render() {

        const items = ['直播预告', '直播回放']
        const { lives, status, livess, user} = this.state
        return (
            <View className='box row col mb_50'>
                    <View className='box row jc_ad bg_white'>
                        {
                            items.map((item, index) => {
                                return (
                                    <View className='row col' onClick={this.onChange.bind(this, index)}>
                                        {
                                            index == status ?
                                                <View className='label_14 font_bold'>{item}</View>
                                                :
                                                <View className='label_gray label_14'>{item}</View>
                                        }
                                        <View className='row jc_ct mt_5'>
                                            {
                                                index == status ?
                                                    <View className='tip bg_orange'></View>
                                                    :
                                                    <View className='tip'></View>
                                            }
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                    <ScrollView
                    scrollY
                    className={'scrollStyle'}
                    refresherEnabled={true}
                    refresherTriggered={refush}

                    onRefresherRefresh={(e) => {
                        this.top()
                    }}

                    onScrollToLower={(e) => {
                        this.foot()
                    }}
                    >
                    {
                        status == 0 ?
                            <View className='live_box row jc_ct mt_5'>
                                <View className='le_box row col'>
                                    {
                                        lives.map((item, index) => {
                                            return (
                                                <View className='fe_box row col bg_white mt_15' onClick={this.onRoom.bind(this,item)}>
                                                    <View className='time_box row jc_sb ai_ct pb_10'>
                                                        <View className='label_gray label_12'>{item.beginTimeFt}开播</View>
                                                        {
                                                            item.liveStatus === 0 && item.roomStatus === 0 ?
                                                                <Text className='label_light label_12'>{item.bookNum}人已预约</Text>
                                                                :
                                                                <Text className='label_light label_12'>{item.hit}在上课</Text>
                                                        }
                                                    </View>
                                                    <View className='label_three label_16 font_bold mt_5'>{item.courseName}</View>
                                                    <View className='row jc_sb ai_ct'>
                                                        <View className='label_gray label_12'>{item.summary}</View>
                                                        {
                                                            item.liveStatus == 0 && item.roomStatus == 0 ?
                                                            <View onClick={this.handleStop.bind(this)}>
                                                                {
                                                                    item.book?
                                                                    <View className='btn_into label_orange' onClick={this.onRoom.bind(this,item)}>进入</View>
                                                                    :
                                                                    <View className='btn label_white' onClick={this.onReservation.bind(this,item)}>预约</View>
                                                                }
                                                            </View>
                                                            :
                                                            <View className='btn_into label_orange' onClick={this.onRoom.bind(this,item)}>进入</View>
                                                        }  
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                            :
                            <View className='live_box row jc_ct mt_5'>
                                <View className='row col'>
                                    {
                                        livess.map((item, index) => {
                                            return (
                                                <View className='re_box row mt_15' onClick={this._livedesc.bind(this, item)}>
                                                    <View className='live_pic bg_yellow'>
                                                        <Image src={item.courseImg} className='picture' />
                                                    </View>
                                                    <View className='row col ml_8'>
                                                        <View className='label_three label_14 font_bold with_172'>{item.courseName}</View>
                                                        <View className='label_light label_13 lg'>{item.summary}</View>
                                                        <View className='label_gray label_12 mt_25'>{item.hit}人已学</View>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                    }
                    </ScrollView>
                </View>
        )

    }
}

export default live as ComponentClass