import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Swiper, SwiperItem, LivePlayer, Video, Button, Input, CoverView, CoverImage, WebView } from '@tarojs/components'


import { connect } from '@tarojs/redux'
import { homeType } from '../../constants/homeType'
import Tabs from '../../components/Tabs'
import asset from '../../config/asset';
import inter from '../../config/inter'
import api from '../../services/api'
import Auth from '../../components/Auth'
import DateTime from '../../components/DateTime'
import { getExactTime, subNumTxt, time_ms, chatTime, percent2percent25, getExactTimes } from '../../utils/common';
import { emojis, emojiToPath, textToEmoji } from '../../utils/emoji';

import ModalPannel from '../../components/ModalPannel'

import menu from '../../config/menu';

import { liveroom } from '../../config'


import '../../config/theme.css';
import './liveDesc.less'


import {
    getConfigGift
} from '../../actions/home'

type PageStateProps = {
    home: homeType,
}

type PageDispatchProps = {
    getConfigGift: (object) => any
}

type PageOwnProps = {}

type PageState = {
    Jcurrent: number,
    comeList: Array<string | undefined>,
    rewardList: Array<string | undefined>,
    bookStatus: boolean,
    load: boolean,
    kicked: boolean,
    courseId: number,
    keyword: string,
    userCount: number,
    giftName: string,
    speakerList: Array<{
        type: string,
        user: {
            uid: string,
            admin: number,
            name: string,
            avatar: string,
            status: number,
            id: number
        },
        timestamp: number,
        msg: {
            mtype: string,
            msg: string,
        },
        userCount: number,
    }>,
    interactList: Array<{
        type: string,
        user: {
            uid: string,
            admin: number,
            name: string,
            avatar: string,
            status: number,
            id: number
        },
        timestamp: number,
        msg: {
            mtype: string,
            msg: string,
        },
        userCount: number,
    }>,
    type: number,
    status: number,
    gfIntegral: number,
    typegift: boolean,
    gfId: number,
    publishGift: boolean,
    gifttImg: string,
    userintegral: number,
    userId: number,
    isAuth: number,
    userAvatar: string,
    userName: string,
    liveStatus: number,
    roomStatus: number,
    mediaId: string,
    videom38u: string,
    videoDuration: number,
    courseBack: boolean,
  
    courseDesc: any,
    goodsList: Array<{}>,
   
    gooddesc: any,
    gooddescType: boolean,
    fullScreenFlag: boolean,
    isLogin: boolean,
    isMobile: boolean,
    isValid: Boolean,
    fuser: number,
    inVideos: Array<{}>,
    endVideos: Array<{}>,
    preVideos: Array<{}>,
    videoUrl: string,
    videoList: any,
    adImgtype: number,
    chatId0: any,
    chatId1: any,
    goodlayer: boolean,
    cartList: Array<{}>,
    liveResetTime: number,
    show_pannel: boolean,
    chatIds: Array<any>,
    inputBottom: number,
    Typeline: boolean,
    emojiList: Array<{}>,
    typeEmjio: boolean,
    pushGoods: boolean,
    romNumber: number,
    isToback: boolean,
    msgTipType: boolean,
    integral: number,
    isCollect: boolean,
    collectNum: number,
    c_integral: number,


    canBuy: boolean,
    payType: number,
    show_pan: boolean,
    beginTime: string,
    endTime: string,
    day: number,
    coursewareList: any,
    canShare: number,
    ctype: number,
    typs: any,
    questionActivityDTOs: any,
    askList: Array<any>,
    pages: number,
    attyps: number,
    optionId: number,
    answers: any,
    asklst: Array<any>,
    activityDTO: any,
    lottery: Array<any>,
    lotteryList: Array<any>,
    activityId: number,
    l_name: string,
    l_mobile: string,
    l_address: string,
    rewardId: number,
    ttime: number,
    open: number,
    prize_type: number,
    minutes: any,
    seconds: any,
    liveUrl: any,
    canSend:boolean,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface liveDesc {
    props: IProps;
}


@connect(({ home }) => ({
    home: home,
}), (dispatch) => ({
    getConfigGift(object) {
        dispatch(getConfigGift(object))
    }
}))



class liveDesc extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '直播间'
    }
    PlayerCtx: Taro.LivePlayerContext;
    sockets: Promise<void>;
    pingObj: NodeJS.Timeout;
    recontnum: number;
    tims: any;

    constructor() {
        super(...arguments)

        this.recontnum = 0;
        this.tims = null;
        this.state = {
            Jcurrent: 0,
            load: false,
            keyword: '',
            bookStatus: false,
            courseDesc: {},
            liveStatus: 0,
            roomStatus: 0,
            courseId: 0,
            type: 0,
            status: 0,
            gfIntegral: 0,
            typegift: false,
            gfId: 0,
            publishGift: false,
            gifttImg: '',
            userintegral: 0,
            userId: 0,
            isAuth: 0,
            userAvatar: '',
            userName: '',
            speakerList: [],
            interactList: [],

            courseBack: true,
            mediaId: '',
            videom38u: '',
            videoDuration: 0,
            userCount: 0,
            giftName: '',
            goodsList: [],
            fullScreenFlag: false,
            isLogin: false,
            isMobile: false,
            isValid: false,
            fuser: 0,
            videoUrl: '',
            endVideos: [],
            preVideos: [],
            inVideos: [],
            videoList: [],
            adImgtype: 0,
            chatId0: '',
            chatId1: '',
            goodlayer: false,
            cartList: [],
            liveResetTime: 0,
            show_pannel: false,
            chatIds: [],
            inputBottom: 0,
            Typeline: true,
            kicked: false,

            emojiList: [],
            typeEmjio: false,
            pushGoods: true,
            comeList: [],
            rewardList: [],
            romNumber: 0,
            gooddesc: {},
            gooddescType: false,
            isToback: true,
            msgTipType: false,
            integral: 0,
            isCollect: false,
            collectNum: 0,
            c_integral: 0,

            canBuy: false,
            payType: 0,
            show_pan: true,
            beginTime: '',
            endTime: '',
            day: 0,
            coursewareList: [],
            canShare: 1,
            ctype: 0,
            typs: 0,
            questionActivityDTOs: {},
            askList: [],
            pages: 0,
            attyps: 1,
            optionId: 0,
            answers: {},
            asklst: [],
            activityDTO: null,
            lottery: [],
            lotteryList: [],
            activityId: 0,
            l_name: '',
            l_mobile: '',
            l_address: '',
            rewardId: 0,
            ttime: 0,
            open: 0,
            prize_type: 0,
            seconds: '00',
            minutes: '00',
            liveUrl: '',
            canSend:true,
        }

        this._netstatus = this._netstatus.bind(this);
        this._datecall = this._datecall.bind(this);
        this.onEnded = this.onEnded.bind(this);
        this._getVideoUrl = this._getVideoUrl.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
        this._onTypeline = this._onTypeline.bind(this);
    }

    socketTask: Taro.SocketTask


    componentWillMount() {
        var that = this;
        const { courseId, liveStatus, liveName, fromuser, scene, roomStatus, typs } = that.$router.params
        api.post('/user/log', {
            log_type: 4,
            type: 1,
            contentId: parseInt(courseId)
        }).then(res => { })
        api.post(inter.userHistory, {
            cctype: 1,
            etype: 120,
            ctype: 3,
            content_id: parseInt(courseId)
        }).then(res => { })
        
        if (typs) {
            this.setState({
            })
        }
        Taro.setNavigationBarTitle({
            title: liveName,
        })

        if (scene) {
            const fuser = decodeURIComponent(scene).split('=');
            if (fuser && fuser.length > 1) {
                Taro.setStorageSync('fuser', fuser[1]);
            }
        }
        if (fromuser) {
            Taro.setStorageSync('fuser', fromuser);
        }



        this.setState({
            courseId: parseInt(courseId),
            liveStatus: parseInt(liveStatus),
            roomStatus: parseInt(roomStatus)
        })
        // Taro.setStorageSync('live'+ courseId, [])
    }
    componentDidMount() {
        var that = this;
        const { liveStatus, roomStatus, userId, courseId, comeList } = that.state;
        this.PlayerCtx = Taro.createLivePlayerContext('liverPlayer', that.$scope);
        let lst = Taro.getStorageSync('liveask')
        if (lst) {
            this.setState({
                asklst: lst
            })
        }
        that.getCourseDesc();
        that._getLiveGoods(0, 0);
        that.getConfigGift();
        let dat = new Date().getTime()

        if (liveStatus === 2) {
            this._getVideo();
        }


        let chatids = Taro.getStorageSync("live" + courseId);
        if (chatids == '') {
            chatids = []
        }


        // 获取表情包
        const emojiList = Object.keys(emojis).map(key => ({
            key: key,
            img: emojiToPath(key)
        }))



        that.setState({
            chatIds: chatids,
            emojiList: emojiList,
            day: dat
        })
        api.get(inter.CourseDesc + courseId)
            .then((res) => {
                if (res.data.status) {
                    let courseData = res.data.data;
                    that.setState({
                        canBuy: courseData.canBuy
                    })
                    if (res.data.message) {
                        Taro.showModal({
                            title: '提示',
                            content: res.data.message,
                            success: function (res) {
                                if (res.confirm) {
                                    Taro.switchTab({
                                        url: '/pages/index/index'
                                    })
                                } else if (res.cancel) {
                                    Taro.switchTab({
                                        url: '/pages/index/index'
                                    })
                                }
                            }
                        })
                        setTimeout(() => {
                            Taro.switchTab({
                                url: '/pages/index/index'
                            })
                        }, 3000);
                    }
                }
            })
            api.get('/course/live/activity/'+courseId,{
                type:0,
            }).then(res=>{
                if(res.data.status){
                    let activityDTOs = res.data.data
                    if (activityDTOs&&activityDTOs.length > 0) {
                        var ttime = new Date().getTime()
                        let list =activityDTOs
    
                        list = list.filter(item => item.endTime * 1000 + 180000 >= ttime)
    
                        if (list&&list.length > 0) {
                            var act = Math.min.apply(Math, list.map((e) => { return e.endTime }))
                            list = list.filter(itm => itm.endTime == act)
    
                            if(that.state.activityId!==list[0].activityId){
                                this.setState({
                                    activityDTO: list[0],
                                    activityId: list[0].activityId,
                                })
                            }
                        }  else{
                            this.setState({
                                activityDTO: null,
                                activityId: 0,
                            })
                        }
    
                    }
                }
            })
            api.get('/course/live/activity/'+courseId,{
                type:1,
            }).then(res=>{
                if(res.data.status){
                    let questionActivityDTOs = res.data.data
                    if (questionActivityDTOs&&questionActivityDTOs.length > 0) {
                        that.setState({
                            questionActivityDTOs: questionActivityDTOs[0]
                        })
                        api.get('/activity/' + questionActivityDTOs[0].activityId + '/paper')
                            .then(ress => {
                                that.setState({
                                    askList: ress.data.data
                                })
                            })
                    }
                }
            })
        this.tims = setInterval(() => {
            let myDate = new Date();
            let seconds = myDate.getSeconds();
            let ttime = myDate.getTime()
            this.activityLst()
            if(ttime==59){
                this.actAsk()
            }
            this.setState({
                ttime: ttime
            }, () => {
                this.forTimes()
            })
        }, 1000)
    }
    activityLst=()=>{
        let that = this
        const{courseId}=this.state
        if(courseId){
            api.get('/course/live/activity/'+courseId,{
                type:0,
            }).then(res=>{
                if(res.data.status){
                    let activityDTOs = res.data.data
                    if (activityDTOs&&activityDTOs.length > 0) {
                        var ttime = new Date().getTime()
                        let list =activityDTOs
    
                        list = list.filter(item => item.endTime * 1000 + 180000 >= ttime)
    
                        if (list&&list.length > 0) {
                            var act = Math.min.apply(Math, list.map((e) => { return e.endTime }))
                            list = list.filter(itm => itm.endTime == act)
    
                            if(that.state.activityId!==list[0].activityId){
                                this.setState({
                                    activityDTO: list[0],
                                    activityId: list[0].activityId,
                                })
                            }
                        }  else{
                            this.setState({
                                activityDTO: null,
                                activityId: 0,
                            })
                        }
    
                    }
                }
            })
        }
    }
    actAsk=()=>{
        let that = this
        const { courseId } = this.state
        if(courseId){
            api.get('/course/live/activity/' + courseId, {
                type: 1,
            }).then(res => {
                if (res.data.status) {
                    let questionActivityDTOs = res.data.data
                    if (questionActivityDTOs && questionActivityDTOs.length > 0) {
                        that.setState({
                            questionActivityDTOs: questionActivityDTOs[0]
                        })
                        api.get('/activity/' + questionActivityDTOs[0].activityId + '/paper')
                            .then(ress => {
                                that.setState({
                                    askList: ress.data.data
                                })
                            })
                    }
                }
            })
        }
    }
    componentWillUnmount() {
        Taro.closeSocket();
        if (this.socketTask) {
            this.socketTask.close({});
        }
        const { courseId } = this.state
        api.post(inter.leaveRoom, {
            cctype: 1,
            content_id: courseId,
        }).then(res => { })
        clearInterval(this.tims)
    }
    componentDidShow() {
        var that = this;
        const { kicked, courseId } = that.state

        if (kicked) {
            Taro.showModal({
                title: '直播提示',
                content: '很抱歉,当前直播暂时\n无法观看,请观看其他\n精彩内容',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        Taro.switchTab({
                            url: menu.index
                        })
                    }
                }
            })
            setTimeout(() => {
                Taro.switchTab({
                    url: menu.index
                })
            }, 5000);
        }
        that.getUser(1);

    }
    forTimes = () => {
        const { activityDTO, ttime } = this.state
        
        if (activityDTO) {
            let minutes: any = 0
            let seconds: any = 0
            minutes = parseInt(((activityDTO.endTime * 1000 - ttime) % (1000 * 60 * 60)) / (1000 * 60))
            seconds = parseInt(((activityDTO.endTime * 1000 - ttime) % (1000 * 60)) / 1000)
            if (minutes < 10) {
                minutes = '0' + minutes
            }
            if (seconds < 10) {
                seconds = '0' + seconds
            }
            this.setState({
                minutes: minutes,
                seconds: seconds
            })
            if (minutes == '00' && seconds == '0-1' || minutes == '00' && seconds == '00') {
                this.setState({
                    prize_type: 1
                }, () => {
                    setTimeout(() => {
                        this.forLottery()
                    }, 2000);
                })
            }
            if ((ttime - activityDTO.endTime * 1000) / 1000 == 0 || (ttime - activityDTO.endTime * 1000) / 1000 == 1) {
                this.setState({
                    open: 1,
                })
            }
        }
       
    }
    componentDidHide() { 
        api.post(inter.leaveRoom, {
            cctype: 1,
            content_id: this.state.courseId,
        }).then(res => {
        })
        clearInterval(this.tims)
    }

    //分享课程
    onShareAppMessage = (res) => {
        var that = this;
        const { courseDesc, userId, courseId } = that.state

        api.post(inter.userLog, {
            log_type: 1,
            type: 1,
            device_id: 0,
            intro: '分享直播课程',
            content_id: courseDesc.courseId,
            param: JSON.stringify({ name: courseDesc.courseName, cctype: 2, ttype: 2 }),
            from: 0,
        }).then((res) => {
            console.log('ee')
        })
        api.post(inter.shareCourses + courseDesc.courseId)
            .then(res => {
            })
        if (res.from === 'button') {
            // 来自页面内转发按钮
        }
        return {
            title: courseDesc.courseName,
            path: menu.liveDesc + '?courseId=' + courseId + + '&liveName=' + percent2percent25(courseDesc.courseName) + '&liveStatus=0' + '&fromuser=' + userId,
            imageUrl: courseDesc.courseImg + '?x-oss-process=image/resize,w_500,h_380,m_pad'
        }
    }
    onShareTimeline=(res)=>{
        const { courseDesc, userId, courseId } = this.state;
        if (res.from === 'button') {
            // 来自页面内转发按钮
        }
        return {
            title: courseDesc.courseName,
            query: menu.liveDesc + '?courseId=' + courseId + + '&liveName=' + percent2percent25(courseDesc.courseName) + '&liveStatus=0' + '&fromuser=' + userId,
            imageUrl: courseDesc.courseImg + '?x-oss-process=image/resize,w_500,h_380,m_pad'
        }
    }
    // 获取个人信息
    getUser(type) {
        var that = this
        const { courseId, } = that.$router.params
        const { liveStatus } = that.state

        api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    let userData = res.data.data
                    let ads = res.data.data.addressList[0]
                    if (userData && userData.addressList && userData.addressList.length > 0) {
                        this.setState({
                            l_name: ads.realname,
                            l_mobile: ads.mobile,
                            l_address: ads.province + ads.city + ads.district + ads.address
                        })
                    }
                    api.get(inter.CourseDesc + parseInt(courseId))
                        .then((res) => {
                            if (res.data.status) {
                                let courseData = res.data.data;
                                if (courseData.canPlay) {
                                } else {
                                    Taro.showModal({
                                        title: '直播提示',
                                        content: '该课程仅对特定用户可见',
                                        showCancel: false,
                                        success: function (res) {
                                            if (res.confirm) {
                                                Taro.switchTab({
                                                    url: menu.index
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })

                    that.setState({
                        userintegral: userData.integral + userData.rintegral,
                        userId: userData.userId,
                        userAvatar: userData.avatar,
                        userName: userData.nickname,
                        isAuth: userData.isAuth
                    }, () => {
                        api.post(inter.leaveRoom, {
                            content_id: parseInt(courseId),
                            type: 1
                        }).then(res => { })
                        if (type === 1) {
                            this._onChat();
                        }
                    })
                } else {
                    that.setState({
                        isLogin: true
                    })
                }
            })
    }

    _onSelect = (index) => {
        var that = this;
        const { coursewareList } = this.state
        if (coursewareList.length > 0) {
            that.setState({
                status: index
            })
        } else {
            if (index != 1) {
                that.setState({
                    status: index
                })
            }
        }

    }

    // 得到礼物
    getConfigGift() {
        this.props.getConfigGift({
            gtype: 1
        })
    }

    //选择打赏礼物
    _onSelectGift(gf) {
        var that = this
        that.setState({
            gfIntegral: gf.integral,
            gfId: gf.giftId,
            gifttImg: gf.giftImg,
            giftName: gf.giftName
        })
    }

    // 商品货架
    _getLiveGoods(type, goodsId) {
        var that = this;
        const { courseId, cartList } = that.state;
        var goods: any = {};

        api.get(inter.LiveGoods, {
            course_id: courseId
        }).then((res) => {
            if (res.data.status) {
                let goodslist = res.data.data;
                that.setState({
                    goodsList: goodslist,
                })
                if (type === 1) {
                    for (let i = 0; i < goodslist.length; i++) {
                        if (goodslist[i].goodsId === goodsId) {
                            goods = goodslist[i];
                        }
                    }

                    if (goods.goodsName != undefined) {
                        if (goods.goodsName.length > 0) {

                            for (let j = 0; j < cartList.length; j++) {
                                if (cartList[j].goodsId === goodsId) {
                                    cartList.splice(j, 1)
                                }
                            }

                            cartList.unshift(goods);

                            that.setState({
                                cartList: cartList
                            })
                        }
                    }
                }

            }
        })
    }

    _pushGoods(g_Id) {
        var that = this;
        const { courseId } = that.state;
        var gooddesc: any = {};

        api.get(inter.LiveGoods, {
            course_id: courseId
        }).then((res) => {
            if (res.data.status) {
                let goodslist = res.data.data;

                for (let i = 0; i < goodslist.length; i++) {
                    if (goodslist[i].goodsId === g_Id) {
                        gooddesc = goodslist[i];
                    }
                }
                if (gooddesc.goodsName != undefined) {
                    that.setState({
                        gooddescType: true,
                        gooddesc: gooddesc,
                    }, () => {
                        setTimeout(() => {
                            that.setState({
                                gooddescType: false
                            })
                        }, 4000)
                    })
                }
            }
        })
    }

    // 直播详情
    getCourseDesc() {
        var that = this
        var { courseId, isAuth, userId } = that.state

        api.get(inter.CourseDesc + courseId)
            .then((res) => {
                if (res.data.status && res.data.data) {
                    let courseData = res.data.data;
                    if (that.state.liveUrl !== courseData.liveUrl) {
                        that.setState({
                            liveUrl: courseData.liveUrl
                        })
                    }
                    if (that.state.courseDesc !== courseData) {
                        Taro.setNavigationBarTitle({
                            title: courseData.courseName,
                        })
                        if (courseData.canShare == 0) {
                            Taro.hideShareMenu()
                        } else {
                            wx.showShareMenu({

                                withShareTicket: true,

                                menus: ['shareAppMessage', 'shareTimeline']
                            })
                        }
                        that.setState({
                            beginTime: courseData.beginTimeFt,
                            endTime: courseData.endTimeFt,
                            liveStatus: courseData.liveStatus,
                            roomStatus: courseData.roomStatus,
                            courseDesc: courseData,
                            bookStatus: courseData.book,
                            mediaId: courseData.mediaId,
                            liveResetTime: courseData.resetTime,
                            load: true,
                            inVideos: courseData.inVideos,
                            endVideos: courseData.endVideos,
                            preVideos: courseData.preVideos,
                            integral: courseData.integral,
                            isCollect: courseData.collect,
                            collectNum: courseData.collectNum,
                            c_integral: courseData.integral,
                            coursewareList: courseData.coursewareList,
                            canShare: courseData.canShare,
                            ctype: courseData.ctype,
                            canBuy: courseData.canBuy,
                        }, () => {
                            if (courseData.liveStatus === 2 && courseData.roomStatus === 3) {
                                Taro.showModal({
                                    title: '提示',
                                    content: '该直播间已关闭',
                                    success: function (res) {
                                        if (res.confirm) {
                                            Taro.switchTab({
                                                url: menu.index
                                            })
                                        } else if (res.cancel) {
                                            Taro.switchTab({
                                                url: menu.index
                                            })
                                        }
                                    }
                                })
                            }
                            if (this.state.courseDesc.status == 0) {
                                Taro.showModal({
                                    title: '提示',
                                    content: '该直播间已下架',
                                    success: function (res) {
                                        if (res.confirm) {
                                            Taro.switchTab({
                                                url: menu.index
                                            })
                                        } else if (res.cancel) {
                                            Taro.switchTab({
                                                url: menu.index
                                            })
                                        }
                                    }
                                })
                            }
                            if (res.data.message) {
                                Taro.showModal({
                                    title: '直播提示',
                                    content: res.data.message,
                                    showCancel: false,
                                    success: function (res) {
                                        if (res.confirm) {
                                            Taro.switchTab({
                                                url: menu.index
                                            })
                                        }
                                    }
                                })
                                setTimeout(() => {
                                    Taro.switchTab({
                                        url: menu.index
                                    })
                                }, 3000);
                            }
                            this._getVideos()
                        })
                    }
                }
            })
    }


    // 广告视频
    _getVideos() {
        var that = this;
        const { liveStatus, roomStatus, preVideos, inVideos, endVideos } = that.state;
        if ((liveStatus === 0 && roomStatus === 0) || (liveStatus === 2 && roomStatus === 0)) {
            that.setState({
                videoList: preVideos,
            }, () => {
                that._getVideoUrl();
            })
        } else if (liveStatus === 2 && roomStatus === 1) {
            that.setState({
                videoList: inVideos,
            }, () => {
                that._getVideoUrl();
            })
        } else if (liveStatus === 2 && roomStatus === 3) {
            that.setState({
                videoList: endVideos,
            }, () => {
                that._getVideoUrl();
            })
        } else if (liveStatus === 2 && roomStatus === 4) {
            Taro.showModal({
                title: '直播提示',
                content: '直播结束',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        Taro.switchTab({
                            url: menu.index
                        })
                    }
                }
            })
        }

    }


    // 播放 视频链接
    _getVideoUrl() {
        var that = this;
        const { videoList, romNumber } = that.state;
        if (videoList.length > 1) {

            let idxarr: any = [];

            for (let i = 0; i < videoList.length; i++) {
                idxarr.push(i);
            }

            if (idxarr.indexOf(romNumber) > - 1) {
                idxarr.splice(idxarr.indexOf(romNumber), 1);
            }

            let index = Math.floor((Math.random() * idxarr.length));

            index = idxarr[index]

            that.setState({
                romNumber: index
            })

            if (videoList[index].mtype === 0) {
                that.setState({
                    adImgtype: 0,
                    videoUrl: videoList[index].mediaUrl
                })
            } else {
                that.setState({
                    adImgtype: 1,
                    videoUrl: videoList[index].mediaUrl
                })
            }
        } else if (videoList.length === 1) {

            if (videoList[0].mtype === 0) {
                that.setState({
                    adImgtype: 0,
                    videoUrl: videoList[0].mediaUrl
                })
            } else {
                that.setState({
                    adImgtype: 1,
                    videoUrl: videoList[0].mediaUrl
                })
            }
        }



    }


    // 广告视频 结束后 执行
    onEnded(e) {
        var that = this;
        that._getVideoUrl()
    }


    // 是否打赏礼物
    _onTypegift() {
        var that = this
        const { userId } = that.state
        that.setState({
            typeEmjio: false,
        })

        if (userId > 0) {
            that.setState({
                typegift: true
            })
        } else {
            this.refs.auth.doLogin();
        }
    }


    //  登录回调
    _onLoadCallBack() {
        var that = this
        that.getUser(1);

    }


    _statechange = (e) => {
        // console.log(e);
    }

    _netstatus(e) {
        // console.log(e,);
    }

    _makelive() {
        var that = this;
        const { courseId } = that.state

        let tmpId = 'bH2whf7pY40T4COena9BrTi3jPQDM4Ls9CRaEW7ycqU'
        Taro.requestSubscribeMessage({
            tmplIds: [tmpId],
            success(res) {
                if (res[tmpId] === 'accept') {
                    api.post(inter.bookCourse + courseId, {
                        form_id: 'wxapp'
                    }).
                        then((res) => {
                            if (res.data.status) {
                                that.setState({
                                    bookStatus: true,
                                    show_pannel: true
                                })

                            }
                        })
                } else {
                    console.log(' jijue')
                }

            }
        })

    }

    _getVideo() {
        const that = this
        const { mediaId } = that.state

        api.post(inter.CourseVideo, {
            media_id: mediaId
        }).then((res) => {
            if (res.data.status) {
                const videodesc = res.data.data

                that.setState({
                    videoDuration: videodesc.duration,
                    videom38u: videodesc.m38u,
                })
                Taro.showToast({
                    title: '加载中',
                    icon: 'loading',
                    duration: 2000
                })
            }
        })
    }

    _onChat() {
        var that = this;
        const { userId, userName, userAvatar, courseId } = that.state
        // console.log(liveroom+  courseId + '?name=' + userName + '&avatar=' + encodeURI(userAvatar) +'&uid='+ userId,);

        if (this.socketTask == null || this.socketTask.readyState != 1) {
            Taro.connectSocket({
                url: liveroom + courseId + '?name=' + encodeURI(userName) + '&avatar=' + encodeURI(userAvatar) + '&uid=' + userId,
            }).then(task => {
                that.socketTask = task;
                that.handleCallback();
            })
        }
    }


    handleCallback() {
        var that = this;
        const { socketTask } = that
        const { speakerList, interactList, fullScreenFlag, comeList, rewardList, userId, courseId } = that.state;

        const timestape = Date.parse(new Date());

        socketTask.onOpen(() => {
            console.log('onOpen');

            this.pingObj = setInterval(() => {
                // console.info('ping')

                let data = {
                    mtype: 'ping',
                    msg: ''
                }

                Taro.sendSocketMessage({
                    data: JSON.stringify(data),
                })
            }, 10 * 1000)
        })

        socketTask.onMessage(async ({ data }) => {
            let chatList = JSON.parse(data)

            if (chatList.type === 'event-msg') {
                let g_Id = parseInt(chatList.msg.msg);
                if (chatList.msg.mtype === 'goods') {
                    this._getLiveGoods(1, g_Id);
                }

                if (chatList.timestamp * 1000 > timestape) {

                    if (chatList.msg.mtype === 'goods') {
                        this._pushGoods(g_Id);
                    }


                    if (chatList.msg.mtype === "gift") {
                        if (rewardList.length >= 1) {
                            rewardList.shift();
                        }
                        rewardList.push(chatList.msg.msg);

                        this.setState({
                            rewardList: rewardList,
                        })
                    }
                }



                if (chatList.user.admin === 0) {
                    if (chatList.msg.mtype === 'goods' || chatList.msg.mtype === 'gift') {
                        // console.log(chatList);
                    } else {
                        // if(chatList.user.id === userId){
                        //     that.setState({
                        //         isToback:true,
                        //         msgTipType:false
                        //     })
                        // } else {
                        //     that.setState({
                        //         isToback:false,
                        //         msgTipType:true
                        //     })
                        // }

                        interactList.push(JSON.parse(data))
                    }
                }
                if (chatList.type === 'event-msg') {
                    if (chatList.user.admin === 1) {
                        if (chatList.msg.mtype === 'goods' || chatList.msg.mtype === 'gift') {
                        } else {
                            // that.setState({
                            //     isToback:false,
                            //     msgTipType:true
                            // })
                            speakerList.push(JSON.parse(data))
                        }
                    }
                }

                speakerList.slice(-50)
                interactList.slice(-50)

                that.setState({
                    speakerList: speakerList,
                    interactList: interactList,
                    chatId0: 'chat0' + (speakerList.length - 1),
                    chatId1: 'chat1' + (interactList.length - 1)
                })
            } else if (chatList.type === 'event-leave') {
            } else if (chatList.type === 'event-join') {
                if (comeList.length >= 1) {
                    comeList.shift();
                }
                comeList.push(chatList.user.name);

                this.setState({
                    comeList: comeList,
                })
            } else if (chatList.type === 'event-mute') {
                this._eventKeyword(chatList.msg.msg);
            } else if (chatList.type === 'event-restore') {
                this._eventKeyword(chatList.msg.msg);
            } else if (chatList.type === 'event-system') {
                if (chatList.totalCount > 0) {
                    that.setState({
                        userCount: chatList.userCount
                    })
                }
            } else if (chatList.type === 'event-kick-user') {
                this._eventkick();
            } else if (chatList.type === 'event-live') {
                that.setState({
                    liveStatus: chatList.liveStatus,
                    roomStatus: chatList.roomStatus,
                }, () => {
                    this._getVideos();
                    if (fullScreenFlag) {
                        this.PlayerCtx.exitFullScreen({
                            success: res => {
                                that.setState({
                                    fullScreenFlag: false,
                                })
                            },
                            fail: res => {
                                // console.log('exit fullscreen success');
                            }
                        });
                    }

                })
            } else if (chatList.type === "event-cancel") {
                this._getChatId(chatList.msg.msg);
            } else if (chatList.type === "event-keyword") {
                this._eventKeyword(chatList.msg.msg);
            }
        })

        socketTask.onError(() => {
            console.log('Error!')
            if (this.pingObj) clearInterval(this.pingObj)

            this.setState({
                interactList: [],
                speakerList: [],
                cartList: [],
            }, () => {
                this.recontnum++;
                if (this.recontnum < 6) {
                    setTimeout(() => {
                        this._onChat();
                    }, 3000)
                } else {
                    api.post(inter.inuserLogs, {
                        content_id: courseId,
                        log_type: 3,
                        type: 5,
                        from: 0
                    }).then(res => { })
                    Taro.showModal({
                        title: '直播提示',
                        content: '您当前网络不稳定， 请退出后检查您的网络。',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                Taro.switchTab({
                                    url: menu.index
                                })
                            }
                        }
                    })
                }
            })
        })

        socketTask.onClose((ev) => {
            console.info(ev)
            if (this.pingObj) clearInterval(this.pingObj)

            if (ev.code == 1006 && !this.state.kicked) {

                let min = parseInt((Math.random() * 300).toFixed(0)) + 3000

                this.setState({
                    interactList: [],
                    speakerList: [],
                    cartList: [],
                }, () => {
                    this.recontnum++;

                    if (this.recontnum < 6) {
                        setTimeout(() => {
                            this._onChat();
                        }, 3000)
                    } else {
                        api.post(inter.inuserLogs, {
                            content_id: courseId,
                            log_type: 3,
                            type: 5,
                            from: 0
                        }).then(res => { })
                        Taro.showModal({
                            title: '直播提示',
                            content: '您当前网络不稳定， 请退出后检查您的网络。',
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    Taro.switchTab({
                                        url: menu.index
                                    })
                                }
                            }
                        })
                    }

                })
            }
        })

    }

    // 撤回消息
    _getChatId(chatid) {
        var that = this;
        const { chatIds, courseId, interactList, speakerList } = that.state
        if (chatIds.indexOf(chatid) === -1) {
            chatIds.push(chatid);
        }

        that.setState({
            chatIds: chatIds,
            interactList: interactList,
            speakerList: speakerList,
        }, () => {
            Taro.setStorageSync('live' + courseId, chatIds)
        })
    }

    // 敏感词  禁言 解禁
    _eventKeyword(keyword) {
        Taro.showToast({
            icon: 'none',
            title: keyword,
            duration: 2000,
        })
    }

    // 踢出房间
    _eventkick() {
        this.setState({
            kicked: true,
        })

        Taro.showModal({
            title: '直播提示',
            content: '很抱歉,当前直播暂时\n无法观看,请观看其他\n精彩内容',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    Taro.switchTab({
                        url: menu.index
                    })
                }
            }
        })
        setTimeout(() => {
            Taro.switchTab({
                url: menu.index
            })
        }, 5000);
    }



    // 发送消息图片
    _onSend(type) {
        var that = this
        const { keyword, courseId,userCount,canSend } = that.state;
        that.setState({
            status: 2
        })


        if (this.socketTask.readyState != 1) {
            Taro.showToast({
                icon: 'none',
                title: '请重新进入直播间'
            });
            return;
        }
        if(!canSend){
            Taro.showToast({
                icon: 'none',
                title: '您发送消息过于频繁，请稍后再发',
                duration:1500
            });
            return;
        }
        if (type === 1) {
            if (keyword.length > 0) {
                let data = {
                    mtype: "text",
                    msg: keyword
                }
                api.post(inter.liveCheck, {
                    content: keyword,
                    courseId: courseId
                }).then(res => { })
                Taro.sendSocketMessage({
                    data: JSON.stringify(data),
                })
                that.setState({
                    keyword: '',
                    typeEmjio: false,
                })
                if(userCount>30&&userCount<200){
                    that.setState({
                        canSend:false
                    },()=>{
                        setTimeout(() => {
                            that.setState({
                                canSend:true
                            })
                        }, 5000);
                    })
                }else if(userCount>=200&&userCount<500){
                    that.setState({
                        canSend:false
                    },()=>{
                        setTimeout(() => {
                            that.setState({
                                canSend:true
                            })
                        }, 10000);
                    })
                }else if(userCount>=500&&userCount<800){
                    that.setState({
                        canSend:false
                    },()=>{
                        setTimeout(() => {
                            that.setState({
                                canSend:true
                            })
                        }, 15000);
                    })
                }else if(userCount>=800&&userCount<1000){
                    that.setState({
                        canSend:false
                    },()=>{
                        setTimeout(() => {
                            that.setState({
                                canSend:true
                            })
                        }, 20000);
                    })
                }else if(userCount>=1000){
                    that.setState({
                        canSend:false
                    },()=>{
                        setTimeout(() => {
                            that.setState({
                                canSend:true
                            })
                        }, 25000);
                    })
                }
            } else {
                Taro.showToast({
                    icon: 'none',
                    title: '消息不能为空'
                })
            }
        } else {
            Taro.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
                success: function (res) {
                    Taro.getFileSystemManager().readFile({
                        filePath: res.tempFilePaths[0], // 选择图片返回的相对路径
                        encoding: 'base64', // 编码格式
                        success: res => { // 成功的回调
                            api.post(inter.UploadSite, {
                                file: 'data:image/png;base64,' + res.data,
                            }).then(res => {
                                let data = {
                                    mtype: "img",
                                    msg: res.data.data
                                }
                                Taro.sendSocketMessage({
                                    data: JSON.stringify(data),
                                })
                                if(userCount>30&&userCount<200){
                                    that.setState({
                                        canSend:false
                                    },()=>{
                                        setTimeout(() => {
                                            that.setState({
                                                canSend:true
                                            })
                                        }, 5000);
                                    })
                                }else if(userCount>=200&&userCount<500){
                                    that.setState({
                                        canSend:false
                                    },()=>{
                                        setTimeout(() => {
                                            that.setState({
                                                canSend:true
                                            })
                                        }, 10000);
                                    })
                                }else if(userCount>=500&&userCount<800){
                                    that.setState({
                                        canSend:false
                                    },()=>{
                                        setTimeout(() => {
                                            that.setState({
                                                canSend:true
                                            })
                                        }, 15000);
                                    })
                                }else if(userCount>=800&&userCount<1000){
                                    that.setState({
                                        canSend:false
                                    },()=>{
                                        setTimeout(() => {
                                            that.setState({
                                                canSend:true
                                            })
                                        }, 20000);
                                    })
                                }else if(userCount>=1000){
                                    that.setState({
                                        canSend:false
                                    },()=>{
                                        setTimeout(() => {
                                            that.setState({
                                                canSend:true
                                            })
                                        }, 25000);
                                    })
                                }
                        },
                        fail: msg => {

                        }
                    })
                },
                fail: function (errmsg) {

                }
            })
        }


    }


    //查看聊天图片
    onViewImgs(interactList, imgurl) {
        let urls: string[] = new Array();
        for (let i = 0; i < interactList.length; i++) {
            if (interactList[i].type === "event-msg") {
                if (interactList[i].msg.mtype === "img") {
                    urls.push(interactList[i].msg.msg)
                }
            }
        }

        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: imgurl, // 当前显示图片的http链接，默认是第一个
        }).then(res => {
            // console.log(res)
        })
    }



    // 打赏
    _reward = () => {
        var that = this
        const { courseId, gfId, userName, giftName } = that.state
        if (gfId > 0) {
            api.post(inter.PublishReward + gfId, {
                course_id: courseId,
            }).then((res) => {
                if (res.data.status) {
                    this.getUser(0)
                    this.setState({
                        typegift: false,
                        gfId: 0,
                        gfIntegral: 0
                    }, () => {
                        let data = {
                            mtype: "gift",
                            msg: userName + '&' + gfId
                        }
                        Taro.sendSocketMessage({
                            data: JSON.stringify(data),
                        })
                    })
                }
            })
        } else {
            Taro.showToast({
                title: '请选择打赏礼物',
                icon: 'none'
            })
        }


    }

    _switchGift() {
        var that = this;
        that.setState({
            typegift: false,
            gfId: 0,
            gfIntegral: 0
        })
    }

    //登录
    _onLogin() {
        this.refs.auth.doLogin();
    }

    _datecall() {
        this.getCourseDesc();
    }


    //全屏
    _fullScreen() {
        var that = this;
        const { fullScreenFlag } = that.state;
        // const PlayerCtx = Taro.createLivePlayerContext('liverPlayer', that.$scope);
        // var liveHeight = Taro.getSystemInfoSync().windowHeight;

        if (!fullScreenFlag) {
            this.PlayerCtx.requestFullScreen({
                direction: 90,
                success: res => { },
                fail: res => {
                    //   console.log('fullscreen fail');
                }
            })
        } else {
            this.PlayerCtx.exitFullScreen({
                success: res => { },
                fail: res => {
                    //   console.log('exit fullscreen success');
                }
            });
        }

        that.setState({
            fullScreenFlag: !fullScreenFlag
        })

    }

    //获取个人信息
    getUserInfo = (userInfo) => {

        const that = this;
        const { fuser } = that.state
        wx.getUserProfile({
            lang: 'zh_CN',
            desc: '用户登录',
            success: (res) => {
                let userInfo = res
                if (userInfo.errMsg === 'getUserProfile:ok') {
                    Taro.login({
                        success: res => {
                            let iv = encodeURIComponent(userInfo.iv)
                            let encryptedData = encodeURIComponent(userInfo.encryptedData)
                            api.post(inter.wxpro, {
                                iv: iv,
                                encryptedData: encryptedData,
                                fuser: 0,
                                code: res.code,
                                nickName: userInfo.userInfo.nickName,
                                avatar: userInfo.userInfo.avatarUrl,
                                sex: userInfo.userInfo.gender,
                            }).then((res) => {
                                if (res.data.status) {
                                    Taro.setStorageSync('token', res.data.data.token);
                                    that.props.success && this.props.success();

                                    this.getUser(1);

                                    let authdata = res.data.data;
                                    this.setState({
                                        isValid: authdata.valid
                                    })

                                    if (authdata.new) {
                                        this.setState({
                                            isMobile: true
                                        })
                                    } else {
                                        if (!authdata.valid) {
                                            this._realAuth();
                                        }
                                    }
                                } else {
                                    Taro.showModal({
                                        title: '登录',
                                        content: '账户已禁用',
                                        showCancel: false
                                    }).then(res => console.log(res.confirm, res.cancel))
                                }
                            })
                        },
                        fail: res => {
                            console.log('拒绝')
                        }
                    })
                }


            }
        })

        this.setState({
            isLogin: false
        })

    }

    //认证
    _realAuth() {
        Taro.showModal({
            content: "还未实名认证",
            // showCancel: false,
            confirmText: '去认证',
            success: res => {
                if (res.cancel) {
                    this.setState({
                        isMobile: false,
                        isLogin: false
                    })
                }
                if (res.confirm) {
                    this.setState({
                        isMobile: false,
                        isLogin: false
                    })
                    Taro.navigateTo({ url: menu.realAuth })
                }
            }
        })
    }

    //获取手机号
    getPhoneNumber = (e) => {
        const { isValid, liveStatus } = this.state
        if (e.detail.errMsg == 'getPhoneNumber:ok') {

            let data = JSON.stringify({
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData,
            })

            api.post(inter.OuthMobile, {
                data: data
            }).then(res => {
                if (res.data.status) {
                    this.getUser(1);
                    if (!isValid) {
                        this._realAuth();
                    } else {
                        this.setState({
                            isMobile: false,
                            isLogin: false
                        })
                    }


                }
            })
        } else {
            if (!isValid) {
                this._realAuth();
            } else {
                this.setState({
                    isMobile: false
                })
            }
        }
    }

    //不获取手机号
    _noMbile() {
        var that = this
        const { isValid, liveStatus } = that.state
        if (!isValid) {

            Taro.showModal({
                content: "还未实名认证",
                // showCancel: false,
                confirmText: '去认证',
                success: res => {
                    if (res.cancel) {
                        this.setState({
                            isMobile: false,
                            isLogin: false
                        })
                    }
                    if (res.confirm) {
                        this.setState({
                            isMobile: false,
                            isLogin: false
                        })
                        Taro.navigateTo({ url: menu.realAuth })
                    }
                }
            })
        } else {
            this.getUser(1);

            this.setState({
                isMobile: false
            })
        }
    }


    _goodsCart() {
        var that = this;
        that.setState({
            goodlayer: true
        })
    }

    //购物车遮罩层
    _goodslayer() {
        var that = this;
        that.setState({
            goodlayer: false
        })
    }

    //进入商城页面

    _onMail(goods) {
        let adlink = goods.goodsLink
        if (adlink.substring(0, 4) == 'http') {
            api.post(inter.userHistory, {
                cctype: 1,
                etype: 107,
                ctype: 3,
                content_id: this.state.courseId
            }).then(res => { })
            Taro.navigateTo({ url: menu.adWebView + '?link=' + `${goods.goodsLink}` + '&mail=1' })
        } else if (adlink.substring(1, 5) == 'mail') {
            api.post(inter.userHistory, {
                etype: 107,
                ctype: 3,
                content_id: this.state.courseId,
                cctype: 1
            }).then(res => { })
            Taro.navigateTo({ url: adlink })
        } else {

            api.post(inter.userYcToken, {})
                .then((res) => {
                    if (res.data.status) {
                        let data = res.data.data;

                        // if(data.code === 4006){
                        //     Taro.showToast({
                        //         title:data.msg,
                        //         icon:'none',
                        //         duration:2000,
                        //     })
                        // } else if(data.code === 4031){
                        //     Taro.showToast({
                        //         title:data.msg,
                        //         icon:'none',
                        //         duration:2000,
                        //     })
                        // } else if(data.code === 4032){
                        //     Taro.showToast({
                        //         title:data.msg,
                        //         icon:'none',
                        //         duration:2000,
                        //     })
                        // } else if(data.code === 200){
                        //     Taro.navigateToMiniProgram({
                        //         appId: 'wxf2bb2960b32a82c3',
                        //         path: ad.link,
                        //         envVersion: 'develop',
                        //         extraData: {
                        //             token: data.msg,
                        //         },
                        //         success(res){
                        //             console.info(res);
                        //         }
                        //     });
                        // }

                        Taro.navigateToMiniProgram({
                            appId: 'wxf2bb2960b32a82c3',
                            path: adlink,
                            envVersion: 'release',
                            extraData: {
                                token: data.msg,
                            },
                            success(res) {
                                console.info(res);
                            }
                        });
                    }
                })
        }

    }

    /**
     * input 的 事件
     */

    _onBlur(e) {
        var that = this;
        that.setState({
            inputBottom: 0
        })
    }

    _onFocus(e) {
        var that = this;
        that.setState({
            typeEmjio: false
        })
        setTimeout(function () {
            //执行ajax请求后停止下拉
            that.setState({
                inputBottom: e.detail.height
            })
        }, 100);
    }


    //点击切换显示隐藏
    _onTypeline() {
        var that = this;
        const { Typeline } = that.state;

        that.setState({
            Typeline: !Typeline
        })
    }


    // 选择表情
    _clickEmoji(item, index) {
        var that = this;
        const { keyword } = that.state;
        that.setState({
            keyword: keyword + item.key
        })
    }


    // 显示和隐藏表情
    _typeEmjio() {
        var that = this;
        const { typeEmjio } = that.state;
        that.setState({
            typegift: false
        })
        if (typeEmjio) {
            that.setState({
                // inputBottom:0,
                typeEmjio: !typeEmjio
            })
        } else {
            that.setState({
                // inputBottom:152,
                typeEmjio: true
            })
        }


    }

    _onSwiper(e) {
        var that = this;
        that.setState({
            Jcurrent: e.detail.current
        })
    }
    _onFinish(e) {
        var that = this;
        const { comeList } = that.state;


        comeList.shift();

        that.setState({
            comeList: comeList
        })
    }

    _onFinishReward(e) {
        var that = this;
        const { rewardList } = that.state;

        rewardList.shift();

        that.setState({
            rewardList: rewardList
        })
    }

    //
    // _msgTip(){
    //     var that = this;
    //     that.setState({
    //         isToback:true,
    //         msgTipType:false
    //     })
    // }

    //取消收藏
    _offCollect() {
        var that = this
        const { courseId, collectNum, userId } = that.state
        let colletN = collectNum - 1

        if (userId > 0) {
            api.post(inter.removeCollect + courseId)
                .then((res) => {
                    if (res.data.status) {
                        Taro.showToast({
                            title: '取消成功',
                            icon: 'success',
                            duration: 2000
                        })
                        that.setState({
                            isCollect: false,
                            collectNum: colletN
                        })
                    } else {
                        Taro.showToast({
                            title: '取消失败',
                            icon: 'flied',
                            duration: 2000
                        })
                    }
                })
        } else {
            this.refs.auth.doLogin();
        }
    }

    // 收藏
    _onCollect() {
        var that = this
        const { courseId, collectNum, userId } = that.state

        if (userId > 0) {
            api.post(inter.PublishCollect + courseId)
                .then((res) => {
                    let colletN = collectNum + 1
                    if (res.data.status) {
                        Taro.showToast({
                            title: '收藏成功',
                            icon: 'success',
                            duration: 2000
                        })
                        that.setState({
                            isCollect: true,
                            collectNum: colletN
                        })
                    } else {
                        Taro.showToast({
                            title: '收藏失败',
                            icon: 'flied',
                            duration: 2000
                        })
                    }
                })
        } else {
            this.refs.auth.doLogin();
        }
    }
    onViews = (val) => {
        const { coursewareList } = this.state
        let lst = []
        coursewareList.map(item => {
            lst = lst.concat(item.fpath)
        })
        Taro.previewImage({
            current: val.fpath,
            urls: lst
        })
    }
    // 去购买
    _buyCourse() {
        var that = this

        const { userId, courseId, courseDesc } = that.state

        if (userId > 0) {
            Taro.navigateTo({
                url: menu.buyCourse + '?courseId=' + courseId + '&coursename=' + percent2percent25(courseDesc.courseName) + '&courseImg=' + courseDesc.courseImg +
                    '&summary=' + percent2percent25(courseDesc.summary) + '&courseintegral=' + courseDesc.integral + '&teacherName=' + courseDesc.teacher.teacherName + '&honer=' +
                    courseDesc.teacher.honor + '&courseType=2' + '&payType=1'
            })

        } else {
            this.refs.auth.doLogin();
        }
    }

    _onOpen = (val) => {
        console.log(val)
        const { ctype } = this.state
        let list = this.state.videoList.filter(item => item.mediaUrl == val ? item : null)
        if (list && list.length > 0) {
            api.post(inter.userHistory, {
                etype: 107,
                ctype: 3,
                content_id: this.state.courseId,
                cctype: 1
            }).then(res => { })
            if(list[0].link&&list[0].link.length>0){
                if (ctype == 51) {
                    Taro.navigateTo({ url: menu.adWebView + '?link=' + encodeURIComponent(list[0].link) })
                } else {
                    Taro.navigateTo({ url: menu.adWebView + '?link=' + encodeURIComponent(list[0].link) })
                }
            }

        }

    }
    ontips = (val) => {
        const { askList, pages, questionActivityDTOs, answers, asklst } = this.state
        console.log(val)
        let lst = answers
        let vas = []
        vas = vas.concat(val.optionId)
        lst[askList[pages].topicId] = vas
        this.setState({
            optionId: val.optionId,
            answers: lst
        }, () => {
            if (askList.length > pages + 1) {
                setTimeout(() => {
                    this.setState({
                        pages: pages + 1,
                        optionId: 0
                    })
                }, 800);
            } else {
                api.post('/activity/' + questionActivityDTOs.activityId + '/answer', {
                    answer: JSON.stringify(this.state.answers)
                }).then(res => {
                    if (res.data.message == '请勿重复提交') {
                        Taro.showToast({
                            title: '您已提交答过回答,不再记录',
                            icon: 'none',
                            duration: 1500
                        })
                    } else {
                        let lst = asklst
                        lst.push(questionActivityDTOs.activityId)
                        Taro.setStorageSync('liveask', lst)
                    }
                })
                setTimeout(() => {
                    this.setState({
                        attyps: 0,
                        optionId: 0
                    })
                }, 800);
            }
        })
    }
    forLottery = () => {
        var that = this
        const { activityDTO, userId } = this.state
        Taro.showLoading()
        api.post('/activity/live/lottery/' + activityDTO.activityId, {
            index: 0
        }).then(res => {
            if (res.data.status && res.data.data) {
                this.setState({
                    lottery: res.data.data,
                })
                let lst = res.data.data.filter(item => item.userId == userId)
                if (lst && lst.length > 0) {
                    this.setState({
                        rewardId: lst[0].rewardId
                    })
                }

            }
            Taro.hideLoading()
            that.setState({
                open: 2
            })
        })
    }
    onWatch = () => {
        const { activityDTO } = this.state
        api.get('/activity/lottery/reward/', {
            activity_id: activityDTO.activityId,
            page: 0,
            user_id: this.state.userId
        }).then(res => {
            if (res.data.status && res.data.data) {
                this.setState({
                    lotteryList: res.data.data.items,
                    open: 3
                })
            }
        })
    }
    onAdresse = () => {
        const { rewardId, l_address, l_name, l_mobile } = this.state
        api.post('/activity/lottery/receive/' + rewardId, {
            address: l_address,
            mobile: l_mobile,
            realname: l_name
        }).then(res => {
            Taro.showToast({
                title: '填写成功',
                icon: 'success',
                duration: 1500
            })
            this.setState({
                open: 0,
                prize_type: 0
            })
        })
    }
    render() {
        if (!this.state.load) return null;
        const { msgTipType, coursewareList, endTime, gooddescType, gooddesc, videoList, Jcurrent, rewardList, comeList, typeEmjio, emojiList, Typeline, inputBottom, chatIds, adImgtype, show_pannel, liveResetTime, cartList, goodlayer, chatId0, chatId1, videoUrl, roomStatus, isLogin, isMobile, fullScreenFlag, goodsList, userCount, userId, interactList, speakerList, keyword, bookStatus, liveStatus, courseDesc, typegift, status, userintegral, gfIntegral, gfId, isToback, isAuth, integral, isCollect, collectNum, c_integral, canBuy, questionActivityDTOs, askList, pages, attyps, optionId, asklst, activityDTO, lottery, lotteryList, l_address, l_mobile, l_name, open, ttime, prize_type, userAvatar, userName, minutes, seconds, liveUrl } = this.state

        const { home } = this.props
        const { giftList } = home
        //礼物8个人一组
        let giftst: any[] = new Array()
        for (let i = 0; i < giftList.length; i += 8) {
            giftst.push(giftList.slice(i, i + 8));
        }


        //视频的品读款度
        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {

        }

        let chatMsgWidth = Math.floor(windowWidth * 0.65 - 24) * 2;

        // let chatIdx:any = '';
        // if(isToback){
        //     if(status === 0){
        //         chatIdx = chatId0
        //     } else {
        //         chatIdx = chatId1
        //     }
        // }
        let interactLists = interactList.slice(-50)
        return (
            <View className='wrap'>
                {
                    activityDTO&&(activityDTO.beginTime * 1000) - ttime <= 0 && ttime <= (activityDTO.endTime * 1000) ?
                        <View className='prizs ml_10 row col'>
                            <Image src={asset.prize_ic} className='size_60' onClick={() => { this.setState({ open: 1 }) }} />
                            {
                                ttime <= (activityDTO.endTime * 1000) ?
                                    <View className='label_16 ml_8 mt_5'>{minutes ? minutes : '00'}:{seconds ? seconds : '00'}</View>
                                    : null
                            }

                        </View>
                        : null
                }
                {
                    activityDTO&&ttime > (activityDTO.endTime * 1000) && ttime <= (activityDTO.endTime * 1000 + 180000) ?
                        <View className='prizs ml_10 row col'>
                            <Image src={asset.prize_ic} className='size_60' onClick={this.forLottery} />
                            <View className='label_16 ml_8 mt_5'>已开奖</View>
                        </View>
                        : null
                }
                <View>
                    <View className='wrapHead' style={liveStatus === 0 && roomStatus === 0 ? { height: 596 + 'rpx' } : { height: 520 + 'rpx' }}>
                        {
                            !(c_integral > 0 && canBuy) ?
                                <View className='wraplive' style={liveStatus === 0 && roomStatus === 0 ? { height: 488 + 'rpx' } : { height: 420 + 'rpx' }}>
                                    {
                                        (liveStatus === 0 && roomStatus === 0) || (liveStatus === 2 && roomStatus === 1) || (liveStatus === 2 && roomStatus === 3) || (liveStatus === 2 && roomStatus === 0) ?
                                            <View className="cover_video" >
                                                {
                                                    videoList.length > 1 && videoUrl.length > 0 && adImgtype === 0 ?
                                                        <Video
                                                            src={videoUrl}
                                                            className='cover_vd'
                                                            autoplay
                                                            id='video'
                                                            showPlayBtn={false}
                                                            showFullscreenBtn={false}
                                                            showProgress={false}
                                                            onEnded={this.onEnded}
                                                            autoPauseIfNavigate={true}
                                                        >
                                                            {!(liveStatus === 0 && roomStatus === 0) ?
                                                                <CoverView className='v_cover_desc d_flex fd_r ai_ct jc_fe pt_10 pb_10'>
                                                                    <CoverView className='white_label sm_label pr_10'>{userCount}人在线</CoverView>
                                                                </CoverView>
                                                                : null}
                                                        </Video>
                                                        : null}
                                                {
                                                    videoList.length === 1 && videoUrl.length > 0 && adImgtype === 0 ?
                                                        <Video
                                                            src={videoUrl}
                                                            className='cover_vd'
                                                            autoplay
                                                            id='video'
                                                            loop
                                                            showPlayBtn={false}
                                                            showFullscreenBtn={false}
                                                            showProgress={false}
                                                            autoPauseIfNavigate={true}
                                                        >
                                                            {!(liveStatus === 0 && roomStatus === 0) ?
                                                                <CoverView className='v_cover_desc d_flex fd_r ai_ct jc_fe pt_10 pb_10'>
                                                                    <CoverView className='white_label sm_label pr_10'>{userCount}人在线</CoverView>
                                                                </CoverView>
                                                                : null}
                                                        </Video>
                                                        : null}
                                                {
                                                    videoUrl.length > 0 && adImgtype === 1 ?
                                                        <View className='cover_vd'>
                                                            <Image className='cover_Img' src={videoUrl} onClick={this._onOpen.bind(this, videoUrl)} />
                                                            {!(liveStatus === 0 && roomStatus === 0) ?
                                                                <View className='v_cover_desc d_flex fd_r ai_ct jc_fe pt_10 pb_10'>
                                                                    <View className='white_label sm_label pr_10'>{userCount}人在线</View>
                                                                </View>
                                                                : null}
                                                        </View>
                                                        : null}
                                                {
                                                    videoUrl.length === 0 ?
                                                        <View className='cover_vd'>
                                                            <Image className='cover_Img' src={courseDesc.courseImg} />
                                                            {!(liveStatus === 0 && roomStatus === 0) ?
                                                                <View className='v_cover_desc d_flex fd_r ai_ct jc_fe pt_10 pb_10'>
                                                                    <View className='white_label sm_label pr_10'>{userCount}人在线</View>
                                                                </View>
                                                                : null}
                                                        </View>
                                                        : null}
                                            </View>
                                            :

                                            <View className='liveBox_dd' onClick={this._onTypeline}>
                                                <LivePlayer
                                                    src={liveUrl}
                                                    mode='live'
                                                    className='liveBox'
                                                    autoplay={true}
                                                    id='liverPlayer'
                                                    objectFit="contain"
                                                    orientation="vertical"
                                                    onStateChange={this._statechange}
                                                    onNetstatus={this._netstatus}
                                                    picture-in-picture-mode={['push','pop']}
                                                    minCache={0.1}
                                                    maxCache={0.3}
                                                >
                                                    {
                                                        Typeline ?
                                                            <CoverView className='cover_desc d_flex fd_r ai_ct jc_fe pt_10 pb_10' style={fullScreenFlag ? { bottom: 0 + 'px' } : { top: 360 + 'rpx' }}>
                                                                <CoverView className='white_label sm_label pr_10'>{userCount}人在线</CoverView>
                                                                <CoverImage src={fullScreenFlag ? asset.smallScreen : asset.fullScreen} className='liveSwitch pr_10' onClick={this._fullScreen} />
                                                            </CoverView>
                                                            : null}
                                                </LivePlayer>
                                            </View>

                                    }
                                    {
                                        liveStatus === 0 && roomStatus === 0 && fullScreenFlag === false ?
                                            <View className='live_desc d_flex fd_r ai_ct jc_sb pt_5 pb_5'>
                                                <View className='pl_15 d_flex fd_r ai_ct'>
                                                    <View className='default_label white_label'>即将开始</View>
                                                    <DateTime refs={courseDesc.beginTime} datecall={this._datecall} />
                                                </View>
                                                <View className='d_flex fd_r ai_ct'>
                                                    <Text className='sm_label white_label mr_10'>{courseDesc.bookNum}人已预约</Text>
                                                    {
                                                        bookStatus ?
                                                            <View className='liveBtn ml_10 mr_10'>
                                                                <View className='sm_label white_label'>已预约</View>
                                                            </View>
                                                            :
                                                            <View onClick={this._makelive} className='liveBtn mr_10'>
                                                                <Text className=" sm_label white_label">预约</Text>
                                                            </View>
                                                    }
                                                </View>
                                            </View>
                                            : null}
                                </View>
                                :
                                <View className='wraplive' style={liveStatus === 0 && roomStatus === 0 ? { height: 488 + 'rpx' } : { height: 420 + 'rpx' }}>
                                    <View className="cover_video">
                                        <View className='cover_vd'>
                                            <Image className='cover_Img' src={videoUrl} />
                                            <View className='v_cover_free' onClick={this._buyCourse}>
                                                <View className='v_cover_free_btn'>
                                                    <Text className='sm_label white_label'>收费观看</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    {
                                        liveStatus === 0 && roomStatus === 0 && fullScreenFlag === false ?
                                            <View className='live_desc d_flex fd_r ai_ct jc_sb pt_5 pb_5'>
                                                <View className='pl_15 d_flex fd_r ai_ct'>
                                                    <View className='default_label white_label'>即将开始</View>
                                                    <DateTime refs={courseDesc.beginTime} datecall={this._datecall} />
                                                </View>
                                                <View className='d_flex fd_r ai_ct'>
                                                    <Text className='sm_label white_label mr_10'>{courseDesc.bookNum}人已预约</Text>
                                                    {
                                                        bookStatus ?
                                                            <View className='liveBtn ml_10 mr_10'>
                                                                <View className='sm_label white_label'>已预约</View>
                                                            </View>
                                                            :
                                                            <View onClick={this._makelive} className='liveBtn mr_10'>
                                                                <Text className=" sm_label white_label">预约</Text>
                                                            </View>
                                                    }
                                                </View>
                                            </View>
                                            : null}
                                </View>
                        }
                        <View className='atabs'>
                            {
                                coursewareList.length > 0 ?
                                    <Tabs items={['主讲', '讲义', '互动']} selected={status} onSelect={this._onSelect} />
                                    :
                                    <Tabs items={['主讲', '', '互动']} selected={status} onSelect={this._onSelect} />
                            }

                        </View>
                    </View>
                    <ScrollView
                        scrollY
                        className={liveStatus === 0 && roomStatus === 0 ? ' d_flex col_1 scroll_box_d ' : ' d_flex col_1 scroll_box'}
                        scrollIntoView={status === 0 ? chatId0 : chatId1}
                    // scrollIntoView={chatIdx}
                    >
                        {
                            status === 0 ?
                                <View className='chatLists pl_12 pb_50'>

                                    {
                                        speakerList.map((chat: any, index) => {
                                            let on = chatIds.indexOf(chat.id) > -1

                                            let chatSpekList: any[] = textToEmoji(chat.msg.msg)
                                            let timeShow: boolean = true;

                                            if (index !== 0) {
                                                let preTime = speakerList[index - 1].timestamp;
                                                let nextTime = speakerList[index].timestamp;
                                                if (nextTime - preTime < 600) {
                                                    timeShow = false
                                                }
                                            }

                                            return (
                                                <View key={'chat' + index} id={'chat0' + index}>
                                                    {
                                                        !on ?
                                                            <View className='chatList' >
                                                                {
                                                                    timeShow ?
                                                                        <View className='d_flex fd_r jc_ct pt_10 pb_10'>
                                                                            <Text className='sm_label gray_label'>{chatTime(chat.timestamp)}</Text>
                                                                        </View>
                                                                        : null}

                                                                <View className='d_flex fd_r pt_10 pb_10' >
                                                                    <Image src={chat.user.avatar && chat.user.avatar.length > 0 ? chat.user.avatar : 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/header.png'} className='chatCover' />
                                                                    {
                                                                        chat.msg.mtype === "img" ?
                                                                            <View className='ml_15 chatmsgCover' onClick={this.onViewImgs.bind(this, speakerList, chat.msg.msg)}
                                                                                style={{ width: windowWidth * 0.6 + 'px' }}
                                                                            >
                                                                                <Text className='red_label sm_label'>{chat.user.name}</Text>
                                                                                <Image src={chat.msg.msg + '?x-oss-process=image/resize,w_180'} className='msgCover mt_5' mode='scaleToFill'
                                                                                    style={{ width: windowWidth * 0.6 + 'px' }}
                                                                                />
                                                                            </View>
                                                                            : null}

                                                                    {
                                                                        chat.msg.mtype === "text" || chat.msg.mtype === "url" ?
                                                                            <View className='d_flex fd_c chatdesc ml_15'>
                                                                                <Text className='red_label sm_label'>{chat.user.name}</Text>
                                                                                <View className="d_flex fd_r ai_ct mt_5">
                                                                                    <View className='dot_box'>
                                                                                        <View className='dot'></View>
                                                                                    </View>

                                                                                    {
                                                                                        chat.msg.mtype === "url" ?
                                                                                            <View className='bg_white chatdesc_txt mt_5' style={{ maxWidth: chatMsgWidth + 'rpx' }}>
                                                                                                <Text className='lh20_label default_label_label'>{chat.msg.msg}</Text>
                                                                                            </View>
                                                                                            :
                                                                                            <View className='bg_white chatdesc_txt mt_5' style={{ maxWidth: chatMsgWidth + 'rpx' }}>
                                                                                                {
                                                                                                    chatSpekList.map((emjio: any, index) => {
                                                                                                        return (
                                                                                                            <View key={'emjio' + index} className='chatmsg_txt'>
                                                                                                                {
                                                                                                                    emjio.msgType === 'text' ?
                                                                                                                        <Text className='default_label c33_label'>{emjio.msgCont}</Text>
                                                                                                                        :
                                                                                                                        <Image src={emjio.msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                                                                }
                                                                                                            </View>
                                                                                                        )
                                                                                                    })
                                                                                                }
                                                                                            </View>
                                                                                    }
                                                                                </View>
                                                                            </View>
                                                                            : null}
                                                                </View>
                                                            </View>
                                                            : null}
                                                </View>

                                            )
                                        })
                                    }
                                </View>
                                :
                                status == 2 ?
                                    <View className='pl_12 pr_12 chatBoxs pb_50' >
                                        {
                                            interactLists.map((chat: any, index) => {

                                                let on = chatIds.indexOf(chat.id) > -1

                                                let chatMsgList: any[] = textToEmoji(chat.msg.msg)

                                                let timeShow: boolean = true;

                                                if (index !== 0) {
                                                    let preTime = interactList[index - 1].timestamp;
                                                    let nextTime = interactList[index].timestamp;
                                                    if (nextTime - preTime < 600) {
                                                        timeShow = false
                                                    }
                                                }
                                                let width = 0
                                                let height = 0

                                               
                                                return (
                                                    <View key={'chat' + index} id={'chat1' + index}>
                                                        {
                                                            !on ?
                                                                <View>
                                                                    {
                                                                        chat.type === "event-msg" && chat.msg.msg && chat.msg.msg.length > 0 ?
                                                                            <View >
                                                                                {
                                                                                    timeShow ?
                                                                                        <View className='d_flex fd_r jc_ct pt_10 pb_10'>
                                                                                            <Text className='sm_label gray_label'>{chatTime(chat.timestamp)}</Text>
                                                                                        </View>
                                                                                        : null}

                                                                                {
                                                                                    chat.user.id === userId ?
                                                                                        <View className='chatRight pt_10 pb_10'>
                                                                                            {
                                                                                                chat.msg.mtype === "img" ?
                                                                                                    <View className='mr_5 chatmsgCover' onClick={this.onViewImgs.bind(this, interactList, chat.msg.msg)} >
                                                                                                        <View style={{ width: windowWidth * 0.6 + 'px', height: '260rpx' }} >
                                                                                                            <Image src={chat.msg.msg + '?x-oss-process=image/resize,w_180'} onLoad={(e) => { console.log(e) }}
                                                                                                                // className='msgCover mt_5'
                                                                                                                mode='aspectFit'
                                                                                                                style={{ maxWidth: windowWidth * 0.6 + 'px' }}
                                                                                                            />
                                                                                                        </View>

                                                                                                    </View>
                                                                                                    : null}
                                                                                            {
                                                                                                chat.msg.mtype === "text" || chat.msg.mtype === "url" ?
                                                                                                    <View className='d_flex fd_c mr_5'>
                                                                                                        <View className=' d_flex fd_r ai_ct ml_15'>
                                                                                                            {
                                                                                                                chat.msg.mtype === "url" ?
                                                                                                                    <View className='chatmsg mt_5' style={{ maxWidth: chatMsgWidth + 'rpx' }}>
                                                                                                                        <Text className='default_label white_label'>{chat.msg.msg}</Text>
                                                                                                                    </View>
                                                                                                                    :
                                                                                                                    <View className='chatmsg mt_5' style={{ maxWidth: chatMsgWidth + 'rpx' }}>
                                                                                                                        {
                                                                                                                            chatMsgList.map((emjio: any, index) => {
                                                                                                                                return (
                                                                                                                                    <View key={'emjio' + index} className='chatmsg_txt'>
                                                                                                                                        {
                                                                                                                                            emjio.msgType === 'text' ?
                                                                                                                                                <Text className='default_label white_label'>{emjio.msgCont}</Text>
                                                                                                                                                :
                                                                                                                                                <Image src={emjio.msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                                                                                        }
                                                                                                                                    </View>
                                                                                                                                )
                                                                                                                            })
                                                                                                                        }

                                                                                                                    </View>
                                                                                                            }
                                                                                                            <View className='dot'></View>
                                                                                                        </View>
                                                                                                    </View>

                                                                                                    : null}
                                                                                            <Image src={chat.user.avatar && chat.user.avatar.length > 0 ? chat.user.avatar : 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/header.png'} className='chatLeft_cover' />

                                                                                        </View>
                                                                                        :
                                                                                        <View className='chatLeft pt_10 pb_10'>
                                                                                            <Image src={chat.user.avatar && chat.user.avatar.length > 0 ? chat.user.avatar : 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/header.png'} className='chatLeft_cover' />
                                                                                            {
                                                                                                chat.msg.mtype === "img" ?
                                                                                                    <View className='ml_10 chatmsgCover' onClick={this.onViewImgs.bind(this, interactList, chat.msg.msg)}
                                                                                                        style={{ width: windowWidth * 0.6 + 'px' }}
                                                                                                    >
                                                                                                        <Text className='tip_label sm_label'>{chat.user.name}</Text>
                                                                                                        <Image src={chat.msg.msg + '?x-oss-process=image/resize,w_180'}
                                                                                                            className='msgCover mt_5' mode='aspectFit'
                                                                                                            style={{ width: windowWidth * 0.6 + 'px' }}
                                                                                                        />
                                                                                                    </View>
                                                                                                    : null}
                                                                                            {
                                                                                                chat.msg.mtype === "text" ?
                                                                                                    <View className='d_flex fd_c ml_5'>
                                                                                                        <Text className='tip_label sm_label'>{chat.user.name}</Text>
                                                                                                        <View className='d_flex fd_r ai_ct mt_5 '>
                                                                                                            <View className='dot_box'>
                                                                                                                <View className='dot'></View>
                                                                                                            </View>
                                                                                                            <View className='chatmsg' style={{ maxWidth: chatMsgWidth + 'rpx' }}>
                                                                                                                {
                                                                                                                    chatMsgList.map((emjio: any, index) => {
                                                                                                                        return (
                                                                                                                            <View key={'emjio' + index} className='chatmsg_txt'>
                                                                                                                                {
                                                                                                                                    emjio.msgType === 'text' ?
                                                                                                                                        <Text className='default_label c33_label'>{emjio.msgCont}</Text>
                                                                                                                                        :
                                                                                                                                        <Image src={emjio.msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                                                                                }
                                                                                                                            </View>
                                                                                                                        )
                                                                                                                    })
                                                                                                                }

                                                                                                            </View>
                                                                                                        </View>
                                                                                                    </View>

                                                                                                    : null}
                                                                                            {
                                                                                                chat.msg.mtype === "url" ?
                                                                                                    <View className='d_flex fd_c ml_5'>
                                                                                                        <View className='d_flex fd_r jc_end'>
                                                                                                            <Text className='red_label sm_label'>{chat.user.name}</Text>
                                                                                                        </View>
                                                                                                        <View className='d_flex fd_r ai_ct mt_5'>
                                                                                                            <View className='dot_box'>
                                                                                                                <View className='dot'></View>
                                                                                                            </View>
                                                                                                            <View className='chatmsg' style={{ maxWidth: chatMsgWidth + 'rpx' }}>
                                                                                                                <Text className='default_label c33_label'>{chat.msg.msg}</Text>
                                                                                                            </View>
                                                                                                        </View>
                                                                                                    </View>
                                                                                                    : null}
                                                                                        </View>
                                                                                }
                                                                            </View>
                                                                            :
                                                                            <View className='chatCtxts mt_5 mb_5'>
                                                                                <Text className='sm_label tip_label'>{chat.user.name + chat.msg.msg}</Text>
                                                                            </View>
                                                                    }
                                                                </View>
                                                                : null}
                                                    </View>

                                                )
                                            })
                                        }
                                    </View>
                                    :
                                    <View className='pdf'>
                                        <View className='clum'>
                                            {
                                                coursewareList.map(item => {
                                                    return (
                                                        <View className='itm'>
                                                            <Image src={item.fpath} className='pic' onClick={this.onViews.bind(this, item)} />
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                        }
                    </ScrollView>
                </View>


                {/* 留言 */}
                {
                    status === 2 ?
                        <View className='comt_box' style={{ bottom: inputBottom + 'px' }}>

                            {
                                c_integral > 0 && canBuy ?
                                    <View className='comments d_flex fd_r ai_ct' >
                                        <Image src={asset.gift} className='gift ml_10' onClick={this._onTypegift} />
                                        <View className='countBox' onClick={isCollect ? this._offCollect : this._onCollect}>
                                            <Image src={isCollect ? asset.collected : asset.heart_icon} className='heart_icon' />
                                            <View className='count'>
                                                <Text className='sm9_label white_label'>{collectNum > 999 ? '999+' : collectNum}</Text>
                                            </View>
                                        </View>
                                        <View className='buyBtn mr_20' onClick={this._buyCourse}>
                                            <Text className='white_label default_label'>{integral}学分</Text>
                                        </View>
                                    </View>
                                    :
                                    <View className='comments d_flex fd_r ai_ct' >
                                        <Image src={asset.emjio_icon} className='uppic ' onClick={this._typeEmjio} />
                                        <Image src={asset.uppic} className='uppic ml_10' onClick={this._onSend.bind(this, 0)} />
                                        {
                                            !goodlayer && status === 2 ?
                                                <View className='d_flex fd_r ai_ct col_1'>
                                                    <Input
                                                        className='input ml_15 mr_10 default_label'
                                                        placeholder='写留言，发表看法'
                                                        value={keyword}
                                                        adjustPosition={false}
                                                        onFocus={this._onFocus}
                                                        onBlur={this._onBlur}
                                                        onConfirm={this._onSend.bind(this, 1)}
                                                        onInput={(e) => this.setState({ keyword: e.detail.value })}
                                                    />
                                                    <View onClick={this._onSend.bind(this, 1)}>
                                                        <Text className='default_label gray_label'>发送</Text>
                                                    </View>
                                                </View>
                                                : null}
                                    </View>
                            }

                            {
                                typeEmjio ?
                                    <View className='bg_fa d_flex fd_r jc_ct'>
                                        <View className=' emojiBox'>
                                            {
                                                emojiList.map((item: any, index) => {
                                                    return (
                                                        <View className='emoji_wrap' key={'item' + index}>
                                                            <Image src={item.img} className='emojiBox_cover' onClick={this._clickEmoji.bind(this, item, index)} />
                                                        </View>

                                                    )
                                                })
                                            }
                                        </View>
                                    </View>

                                    : null}
                        </View>

                        : null}


                {
                    comeList && comeList.length > 0 ?
                        <View className='layerJointip' style={gooddescType ? { bottom: 416 + 'rpx' } : { bottom: 280 + 'rpx' }}>
                            <Swiper
                                className='joinItems'
                                indicatorDots={false}
                                vertical
                                autoplay
                                duration={500}
                                interval={5000}
                                onChange={(e) => this._onSwiper(e)}
                                easingFunction={'easeOutCubic'}
                                onAnimationFinish={this._onFinish}
                            >
                                {
                                    comeList.map((join, index) => {
                                        const on = Jcurrent == index
                                        return (
                                            <SwiperItem className={on ? 'joinItem active' : 'joinItem'} key={'join' + index} >
                                                <View className='jionIt'>
                                                    <Text className='white_label sm_label jionIt_txt'>{subNumTxt(join, 5)}来了</Text>
                                                </View>
                                            </SwiperItem>
                                        )
                                    })
                                }

                                <SwiperItem>
                                    <Text className='white_label sm_label pl_5'></Text>
                                </SwiperItem>
                            </Swiper>
                        </View>
                        : null}


                {/* {
                    msgTipType ?
                    <View className='msgTip' onClick={this._msgTip} >
                        <Text className=' smm_label white_label'>新消息</Text>
                    </View>
                :null} */}



                <View className='layerReward' onClick={this._onTypegift}>
                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/gift.png'} className='layerReward_cover' />
                </View>


                {
                    courseDesc.isShop === 1 || cartList && cartList.length > 0 ?
                        <View className='d_flex fd_c layCons'>
                            <View className='goodsBoxs' onClick={this._goodsCart}>
                                <View className='goodsCart'>
                                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/cart.png'} className='goodsCart_icon' />
                                </View>
                                {
                                    cartList && cartList.length > 0 ?
                                        <View className='goodsCart_tip'>
                                            <Text className='white_label sm_label'>{cartList.length}</Text>
                                        </View>
                                        : null}
                            </View>
                        </View>
                        : null}


                {
                    gooddescType ?
                        <View className='goodBox d_flex fd_r ' onClick={this._onMail.bind(this, gooddesc)}>
                            <View className='d_flex fd_r goodItem'>
                                <Image src={gooddesc.goodsImg} className='goodBox_cover' />
                                <View className='d_flex fd_c jc_sb'>
                                    <Text className='sm_label c33_label'>{subNumTxt(gooddesc.goodsName, 9)}</Text>
                                    <View className='d_flex fd_r ai_end'>
                                        <Text className='sred_label sm_label' style={{ marginBottom: 4 + 'rpx' }}>￥</Text>
                                        <Text className='lg_label sred_label'>{gooddesc.goodsPrice}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : null}



                {
                    goodlayer ?
                        <View className='goods'>
                            <View className='goodslayer' onClick={this._goodslayer}></View>
                            <View className='goodsCons'>
                                <ScrollView scrollY className='goodsCon'>
                                    <View className='goodsItems'>
                                        {
                                            cartList.map((cart: any, index) => {
                                                return (
                                                    <View className='goodsItem mt_10 border_bt' key={'cart' + index}>
                                                        <Image src={cart.goodsImg} className='goodsItem_Cover' />
                                                        <View className='goods_right pl_10 d_flex fd_c jc_sb col_1'>
                                                            <Text className='sm_label c33_label fw_label'>{cart.goodsName}</Text>
                                                            <View className='d_flex fd_r ai_ct jc_sb '>
                                                                <View className='d_flex fd_r ai_ct'>
                                                                    <Text className='sred_label sm_label mt_2'>￥</Text>
                                                                    <Text className='sred_label lg18_label'>{cart.goodsPrice}</Text>
                                                                </View>
                                                                <View className='mailBtn' onClick={this._onMail.bind(this, cart)}>
                                                                    <Text className='default_label white_label'>马上抢</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                        }

                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                        : null}

                {
                    rewardList && rewardList.length > 0 ?
                        <View className='layerRewardtip' style={gooddescType ? { bottom: 472 + 'rpx' } : { bottom: 340 + 'rpx' }}>
                            <Swiper
                                className='giftItems'
                                indicatorDots={false}
                                vertical
                                autoplay
                                duration={500}
                                interval={5000}
                                onChange={(e) => this._onSwiper(e)}
                                easingFunction={'easeOutCubic'}
                                onAnimationFinish={this._onFinishReward}
                            >
                                {
                                    rewardList.map((reward: any, index) => {
                                        let reward_arr = reward.split('&');
                                        let imgurl = ''
                                        let gifttxt = ''
                                        for (let i = 0; i < giftList.length; i++) {
                                            if (giftList[i].giftId === parseInt(reward_arr[1])) {
                                                imgurl = giftList[i].giftImg
                                                gifttxt = giftList[i].giftName
                                            }
                                        }
                                        return (
                                            <SwiperItem className='gifeItem d_flex fd_r ai_ct' key={'reward' + index}>
                                                <View className='d_flex fd_c pl_15'>
                                                    <Text className='white_label lg_label '>{subNumTxt(reward_arr[0], 5)}</Text>
                                                    <View className='d_flex fd_r ai_ct'>
                                                        <Text className='white_label lg_label '>赠送</Text>
                                                        <Text className='lg_label' style={{ color: '#FFF56E' }}>{gifttxt}</Text>
                                                    </View>
                                                </View>
                                                <Image src={imgurl} className='giftCover' />
                                            </SwiperItem>
                                        )
                                    })
                                }
                                <SwiperItem>
                                    <Text className='white_label sm_label pl_5'></Text>
                                </SwiperItem>
                            </Swiper>
                        </View>
                        : null}

                {
                    typegift ?
                        <View className='layer' style={status === 0 ? { bottom: 6 + 'rpx' } : { bottom: 100 + 'rpx' }} >
                            <View className='col_1 layertop' onClick={this._switchGift}></View>
                            <View className='layer_cons'>
                                <View className='layer_con'>
                                    <Swiper
                                        className='swiper'
                                        indicatorColor='#c5c5c5'
                                        indicatorActiveColor='rgba(84,84,84,1)'
                                        vertical={false}
                                        circular
                                        indicatorDots
                                        autoplay={false}
                                    >
                                        {
                                            giftst.map((item, index) => {
                                                return (
                                                    <SwiperItem key={'item' + index}>
                                                        <View className='pt_20 pb_20' >
                                                            {
                                                                item.map((gf: any, i) => {
                                                                    const on = gfId == gf.giftId
                                                                    return (
                                                                        <View className='layer_box_item ' key={'gift' + i}
                                                                            onClick={this._onSelectGift.bind(this, gf)}
                                                                        >
                                                                            <View className={on ? 'layer_box_onItem' : 'layer_box_offItem'}>
                                                                                <Image src={gf.giftImg} className='layer_item_cover' />
                                                                                <Text className='sm_label c33_label'>{gf.giftName}</Text>
                                                                                <Text className='sm_label tip_label'>{gf.integral}</Text>
                                                                            </View>
                                                                        </View>
                                                                    )
                                                                })
                                                            }
                                                        </View>
                                                    </SwiperItem>
                                                )

                                            })
                                        }
                                    </Swiper>
                                    <View className='d_flex ai_ct jc_sb pt_5 pb_5 pl_30 pr_20 reward_box'>
                                        <View className='d_flex fd_r ai_ct'>
                                            <Image src={asset.gold_icon} className="gold_icon" />
                                            <Text className='sm_label c33_label ml_10'>{(userintegral - gfIntegral) > 0 ? (userintegral - gfIntegral) : '学分不足'}</Text>
                                        </View>
                                        {
                                            (userintegral - gfIntegral) > 0 ?
                                                <View className='reward d_flex fd_r ai_ct jc_ct' onClick={this._reward}>
                                                    <Text className='white_label sm_label'>打赏</Text>
                                                </View>
                                                :
                                                <View className='offreward d_flex fd_r ai_ct jc_ct'>
                                                    <Text className='white_label sm_label'>打赏</Text>
                                                </View>
                                        }

                                    </View>
                                </View>
                            </View>
                        </View>
                        : null}

                {
                    isLogin ?
                        <View className='usershow'>
                            <View className='ctypelayer'></View>
                            <View className='dialog'>
                                <View className='wrappost'>
                                    <Text className='c33_label lg20_label mt_10'>登录</Text>
                                    <Text className='c33_label mt_10 mb_10 lg18_label  pl_15 pr_15'>该操作将会授权操作，是否确认进行登录。</Text>
                                    <View className='d_flex fd_r ai_ct wrapbtns'>
                                        <Button className='btn lred_label' onClick={this.getUserInfo}>确定登录</Button>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : null}
                {
                    isMobile ?
                        <View className='usershow'>
                            <View className='ctypelayer'></View>
                            <View className='dialog'>
                                <View className='wrappost'>
                                    <Text className='c33_label lg20_label mt_10'>获取手机号</Text>
                                    <Text className='c33_label mt_10  lg18_label pl_15 pr_15'>该操作将会获取你手机号操作，是否确认进行登录。</Text>
                                    <View className='d_flex fd_r ai_ct wrapbtns'>
                                        <Button className='btn gray_label' onClick={this._noMbile.bind(this)} >暂不获取</Button>
                                        <Button openType='getPhoneNumber' className='btn lred_label' onGetPhoneNumber={this.getPhoneNumber}>获取手机号</Button>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : null}
                <ModalPannel title={'预约成功'} content={time_ms(liveResetTime)} visible={show_pannel} onClose={() => { this.setState({ show_pannel: false }) }}></ModalPannel>

                {
                    status == 1 ?
                        <View>

                        </View>
                        : null
                }

                <Auth ref={'auth'} type={1} success={() => {
                    this._onLoadCallBack()
                }} />
                {
                    attyps == 1 && askList && askList.length > 0 && questionActivityDTOs.beginTime * 1000 <= ttime && (questionActivityDTOs.beginTime * 1000 + 300 * 1000) >= ttime && asklst.indexOf(questionActivityDTOs.activityId) == -1 ?
                        <View className='askbox'>
                            <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/8b2904a6-8d75-4d53-aa5a-3d9a68927b15.png'} className='backs' onClick={() => { this.setState({ attyps: 0 }) }} />
                            <View className='asktop'>{askList[pages].title}</View>
                            <View className='askbody'>
                                {
                                    askList[pages].optionList.map((item, index) => {
                                        return (
                                            <View className={optionId == item.optionId ? 'asktips' : 'asktip'} onClick={this.ontips.bind(this, item)}>{item.optionLabel}</View>
                                        )
                                    })
                                }

                            </View>
                        </View>
                        : null
                }
                {
                    open != 0 ?
                        <View className={open == 1 ? 'prize height' : open == 2 || open == 3 || open == 4 ? 'prize heights' : null}>
                            <View className='row ai_ct jc_sb mtl'>
                                {
                                    open == 4 ?
                                        null
                                        :
                                        <Image src={asset.close_w} className='closed ml_15' onClick={() => { this.setState({ open: 0 }) }} />
                                }
                                {
                                    open == 3 || open == 4 ?
                                        null :
                                        <View className='label_white label_14  mr_15' onClick={this.onWatch}>中奖记录</View>
                                }
                            </View>
                            {
                                open == 1 ?
                                    <View className='prize_body row col mt_10'>
                                        <View className='label_white label_14 font_l row jc_ct'>{activityDTO?activityDTO.title:''} 抽{activityDTO?activityDTO.num:'0'}人</View>
                                        <View className='row jc_ct mt_8'>
                                            <Image src={asset.prize_ic} className='prize_ic' />
                                        </View>
                                        {
                                            prize_type == 1 ?
                                                <View className='label_16 bg_ye row jc_ct mt_15'>开奖中...</View>
                                                :
                                                <View className='label_16 bg_ye row jc_ct mt_15'>开奖倒计时</View>
                                        }
                                        {
                                            prize_type == 1 ?
                                                null
                                                :
                                                <View className='label_white label_36 row jc_ct mt_5'>{minutes}:{seconds}</View>
                                        }
                                        <View className='label_white label_12 font_l row jc_ct mt_20'>耐心等待主播开奖</View>
                                    </View>
                                    : open == 2 ?
                                        <View className='prize_body row col mt_10'>
                                            <View className='label_white label_14 font_l row jc_ct'>{activityDTO?activityDTO.title:''} 抽{activityDTO?activityDTO.num:'0'}人</View>
                                            <View className='row jc_ct mt_8'>
                                                <View className='tipss'>
                                                    <Image src={userAvatar} className='picture' />
                                                </View>
                                            </View>
                                            {
                                                lottery && lottery.length > 0 && lottery.filter(item => item.userId == userId).length > 0 ?
                                                    <View className='label_16 bg_ye row jc_ct mt_15'>{userName}，恭喜中奖！</View>
                                                    :
                                                    <View className='label_16 bg_ye row jc_ct mt_15'>很遗憾，没有中奖！</View>
                                            }
                                            {
                                                lottery && lottery.length > 0 && lottery.filter(item => item.userId == userId).length > 0 ?
                                                    <View className='label_white row jc_ct mt_15'>
                                                        {
                                                            lottery.filter(item => item.userId == userId).length > 0 && !lottery.filter(item => item.userId == userId)[0].address ?
                                                                <View className='adress row jc_ct ai_ct label_12' onClick={() => { this.setState({ open: 4 }) }}>填写地址</View>
                                                                :
                                                                <View className='adress row jc_ct ai_ct label_12'>已填写</View>
                                                        }
                                                    </View>
                                                    : null
                                            }
                                            <View className='row jc_ct mt_20'>
                                                <View className='lig'></View>
                                            </View>
                                            <View className='row jc_ct mt_20'>
                                                <View className='prize_list'>
                                                    <View className='label_white label_bold label_14'>获奖名单</View>
                                                    <View className='mt_10 sens'>
                                                        <ScrollView className='sens' scrollY>
                                                            {
                                                                lottery.map((item, index) => {
                                                                    return (
                                                                        <View className='row ai_ct mt_10'>
                                                                            <View className='lists'>
                                                                                <Image src={item.userDTO.avatar} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                                                            </View>
                                                                            <View className='label_14 label_white font_l ml_10'>{item.nickname}</View>
                                                                        </View>
                                                                    )
                                                                })
                                                            }
                                                        </ScrollView>

                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        : open == 3 ?
                                            <View className='prize_body row col mt_10'>
                                                <View className='label_white label_16 label_bold row jc_ct'>中奖记录</View>
                                                <View className='row jc_ct mt_15'>
                                                    {
                                                        lotteryList && lotteryList.length > 0 ?
                                                            <View className='prize_list'>
                                                                {
                                                                    lotteryList.map((item, index) => {
                                                                        return (
                                                                            <View className={index == lotteryList.length - 1 ? 'row col prize_list mt_10' : 'row col prize_list bod mt_10'}>
                                                                                <View className='label_14 label_white label_bold'>{item.itemName}</View>
                                                                                <View className='row jc_sb ai_ct mt_5'>
                                                                                    <View className='label_14 label_white lighter'>{getExactTimes(item.pubTime)}</View>
                                                                                    <View className='label_14 bg_ye label_bold' onClick={() => { this.setState({ open: 4, activityId: item.activityId }) }}>中奖</View>
                                                                                </View>
                                                                            </View>
                                                                        )
                                                                    })
                                                                }
                                                            </View>
                                                            : null
                                                    }
                                                </View>
                                            </View>
                                            : open == 4 ?
                                                <View>
                                                    <View className='row jc_ct label_26 label_white mt_15'>中奖啦</View>
                                                    <View className='row jc_ct mt_20'>
                                                        <View className='intp'>
                                                            <Input type='text' placeholder='姓名' value={l_name} onInput={(e) => { this.setState({ l_name: e.detail.value }) }} className='inpt bg_white pl_10 label_14' />
                                                        </View>
                                                    </View>
                                                    <View className='row jc_ct mt_12'>
                                                        <View className='intp'>
                                                            <Input type='text' placeholder='手机' value={l_mobile} onInput={(e) => { this.setState({ l_mobile: e.detail.value }) }} className='inpt bg_white pl_10 label_14' />
                                                        </View>
                                                    </View>
                                                    <View className='row jc_ct mt_12'>
                                                        <View className='intp'>
                                                            <Input type='text' placeholder='默认个人中心地址' value={l_address} onInput={(e) => { this.setState({ l_address: e.detail.value }) }} className='inpt bg_white pl_10 label_14' />
                                                        </View>
                                                    </View>
                                                    <View className='row jc_ct mt_20'>
                                                        <View className='ok_btn row jc_ct ai_ct label_white label_14' onClick={this.onAdresse}>确定</View>
                                                    </View>
                                                </View>
                                                : null
                            }
                        </View>
                        : null
                }
            </View>
        )
    }
}

export default liveDesc as ComponentClass