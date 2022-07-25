import { ComponentClass } from 'react'
import Taro, { Component, getApp, getStorageInfoSync } from '@tarojs/taro'
import { View, Image, Text, Slider, SwiperItem, Swiper, Picker, ScrollView, Progress, Icon, Radio } from '@tarojs/components'


import Tabs from '../../components/Tabs'
import Menu from '../../components/Menu';
import Coursescore from '../../components/Coursescore'
import Eval from '../../components/Eval'
import Auth from '../../components/Auth'
import Star from '../../components/Star'
import Comt from '../../components/General/Comt'

import menus from '../../config/menu';
import asset from '../../config/asset';
import inter from '../../config/inter'

import api from '../../services/api'

import { connect } from '@tarojs/redux'
import { homeType } from '../../constants/homeType'
import GetInt from '../../components/GetInt'
import { forTimer, percent2percent25, forTime, subNumTxt } from '../../utils/common';

import {
    getCourseDesc,
    getCourseCommt,
    getConfigGift,
    updatePlayStatus
} from '../../actions/home'




import '../../config/theme.css';
import './audioDesc.less'

const app = getApp();

// const backgroundAudioManager = Taro.getBackgroundAudioManager()

type PageStateProps = {
    home: homeType,
    goodsInfo: Array<{}>,
    getCourseCommt: Array<{}>,
    getConfigGift: Array<{}>,
}

type PageDispatchProps = {
    getCourseDesc: (object) => any,
    getCourseCommt: (object) => any,
    getConfigGift: (object) => any,
    updatePlayStatus: (object) => any;
}

type PageOwnProps = {}

type PageState = {
    course_id: number,
    status: number,
    atype: number,
    comment: Array<{
        avatar: string,
        childList: Array<{}>,
        commentId: number,
        content: string,
        contentId: number,
        ctype: string,
        galleryList: Array<{}>,
        isAdmin: number,
        parentId: number,
        praise: number,
        pubIp: string,
        pubTime: number,
        pubTimeFt: string,
        score: number,
        userId: number,
        username: string,
        like: boolean
    }>,

    topComms: Array<{
        avatar: string,
        childList: Array<{}>,
        commentId: number,
        content: string,
        contentId: number,
        ctype: string,
        galleryList: Array<{}>,
        isAdmin: number,
        parentId: number,
        praise: number,
        pubIp: string,
        pubTime: number,
        pubTimeFt: string,
        score: number,
        userId: number,
        username: string,
        like: boolean
    }>,

    commend_total: number,
    gfIntegral: number,
    chapterList: Array<{
        chapterId: number,
        chapterName: number,
        child: Array<{}>,
        content: string,
        course_id: number,
        duration: number,
        isDelete: number,
        mediaId: string,
        parentId: number,
        pubTime: number,
        status: number
    }>,
    typegift: boolean,
    gfId: number,
    mediaId: string,
    videoCover: string,
    videoDuration: number,
    videom38u: string,
    chapterId: number,
    cchapterId: number,
    cchapterName: string
    isCollect: boolean,
    isFollow: boolean,
    publishGift: boolean,
    gifttImg: string,
    teacher: {
        content: string,
        course: number,
        follow: number,
        galleryList: Array<{}>,
        hit: number,
        honor: string,
        isFollow: boolean,
        level: number,
        teacherId: number,
        teacherImg: string,
        teacherName: string,
        userId: number,
    },
    collectNum: number,
    teacherId: number,
    learn: number,
    isSeries: number,
    index: number,
    cindex: number,
    username: string,
    loginStatus: boolean,
    isLogin: boolean,
    userintegral: number,
    courseImg: string,
    load: boolean,
    networkType: boolean,
    courseRecord: Array<{
        mediaId: string,
        duration: number
    }>,
    rds_duration: number,
    play: boolean,
    userId: number,
    canPlay: boolean,

    audioUrl: string,
    audioStatus: boolean,
    current: number,
    duration: number,
    preTime: number,
    rateList: Array<string>,
    rateIndex: number,
    rateValue: number,
    tipList: Array<string>,
    techScore: number,
    courseScore: number,
    evalType: boolean,
    audioType: boolean,
    score: number,
    auduotitle: string,
    audioImg: string,
    verfyUrl: Array<string>,
    audiohas: boolean,
    courseDesc: any,
    audioRdList: Array<{
        duration: string,
        courseId: number,
        cchapterIds: number,
    }>,
    cmic_type: number,
    c_integral: number,
    is_Free: boolean,

    canBuy: boolean,
    payType: number,
    goodsList: Array<any>,
    freeChapter: number,
    thisTeacher: boolean,
    fromuser: string,
    again: number,
    text: any,
    ons: boolean,
    tip: boolean,
    iftext: string,
    agree: number,
    tipp: number,
    show: boolean,
    integral: number,
    levelId: number,
    leave: number,
    ltype: number,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface audioDesc {
    props: IProps;
}



@connect(({ home }) => ({
    home: home,

}), (dispatch) => ({
    getCourseDesc(object) {
        dispatch(getCourseDesc(object))
    },
    getCourseCommt(object) {
        dispatch(getCourseCommt(object))
    },
    getConfigGift(object) {
        dispatch(getConfigGift(object))
    },
    updatePlayStatus(object) {
        dispatch(updatePlayStatus(object));
    },
}))

// // const myaudio = Taro.createInnerAudioContext();



class audioDesc extends Component<PageDispatchProps & PageStateProps, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '课程名称',
        enablePullDownRefresh: false
    }
    backgroundAudioManager: any;
    ts: number;
    audioidx: any;
    audio: any;

    constructor() {
        super(...arguments);
        this.audioidx = [];
        this.ts = 0;
        this.state = {
            load: false,
            atype: 0,
            chapterList: [],
            course_id: 0,
            status: 0,
            cchapterName: '',
            comment: [],
            topComms: [],
            commend_total: 0,
            typegift: false,
            gfIntegral: 0,
            gfId: 0,
            mediaId: '',
            videoCover: '',
            videoDuration: 0,
            videom38u: '',
            play: false,
            chapterId: 0,
            cchapterId: 0,
            index: 0,
            cindex: 0,
            isCollect: false,
            isFollow: false,
            publishGift: false,
            gifttImg: '',
            teacher: {
                content: '',
                course: 0,
                follow: 0,
                galleryList: [],
                hit: 0,
                honor: '',
                isFollow: false,
                level: 0,
                teacherId: 0,
                teacherImg: '',
                teacherName: '',
                userId: 0,
            },
            collectNum: 0,
            teacherId: 0,
            learn: 0,
            isSeries: 0,
            username: '',
            loginStatus: false,
            isLogin: false,
            userintegral: 0,
            courseImg: '',
            networkType: false,
            rds_duration: 0,
            userId: 0,
            canPlay: false,
            audioUrl: '',
            audioStatus: false,  // false 未开播
            current: 0,
            duration: 200,
            preTime: 0,
            rateList: ['0.5', '1', '1.5', '2'],
            rateIndex: 1,
            rateValue: 0,
            tipList: ['讲师评分', '课程内容'],
            techScore: 0,
            courseScore: 0,
            evalType: false,
            courseRecord: [],
            audioType: false,
            score: 0,
            auduotitle: '',
            audioImg: '',
            verfyUrl: [],
            audiohas: false,
            courseDesc: {},
            audioRdList: [],
            cmic_type: 0,
            c_integral: 0,
            is_Free: true,

            canBuy: false, // false  已购买 true 未购买
            payType: 0,  // 
            goodsList: [], //课程带货
            freeChapter: 0,
            thisTeacher: false,
            fromuser: '0',
            again: 0,
            text: [],
            tip: false,
            iftext: '',
            agree: 0,
            ons: false,
            tipp: 0,
            show: false,
            integral: 0,
            levelId: 0,
            leave: 0,
            ltype: 0,
        }

        this.onShareAppMessage = this.onShareAppMessage.bind(this);
        this._whiteCommt = this._whiteCommt.bind(this);
        this._onLoadCallBack = this._onLoadCallBack.bind(this);
        this._onCourse = this._onCourse.bind(this);
        this._onPlayer = this._onPlayer.bind(this);
        this._onStar2 = this._onStar2.bind(this);
        this._onStar1 = this._onStar1.bind(this);
        this._onPlaying = this._onPlaying.bind(this);
        this._parse = this._parse.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { home } = nextProps
        const { courseCommt } = home

        if (home !== this.props.home) {
            this.setState({
                load: true,
                comment: courseCommt.items,
                commend_total: courseCommt.total,
            })
        }

    }

    componentWillMount() {
        const that = this
        const { course_id, audioName, fromuser, scene, levelId, ltype } = that.$router.params;
        if (levelId !== undefined) {
            that.setState({
                levelId: parseInt(levelId)
            })
        }
        api.post('/user/log', {
            log_type: 4,
            type: 0,
            contentId: parseInt(course_id)
        }).then(res => { })
        that.setState({
            course_id: parseInt(course_id)
        }, () => {
            that.getCourseDesc();
        })
        Taro.setNavigationBarTitle({
            title: audioName,
        })
        if (scene) {
            const fuser = decodeURIComponent(scene).split('=');
            if (fuser.length > 1) {
                Taro.setStorageSync('fuser', fuser[1]);
            }
        }
        if (fromuser) {
            Taro.setStorageSync('fuser', fromuser);
            this.setState({
                fromuser: fromuser
            })
        }

        let record = Taro.getStorageSync("audioRd");

        if (Array.isArray(record)) {
            that.setState({
                audioRdList: record
            })
        }
        if (ltype && ltype == '1') {
            this.setState({
                ltype: 1
            })
        }

        this.backgroundAudioManager = app.globalData.backgroundPlayer;
        that.setState({
            preTime: this.backgroundAudioManager.currentTime !== undefined ? this.backgroundAudioManager.currentTime : 0,
            audioUrl: this.backgroundAudioManager.src! == undefined ? this.backgroundAudioManager.src : ''
        })


    }
    //onBack
    onBack = () => {

        const { levelId } = this.state

        if (levelId)
            api.get(inter.LevelStatus, {
                levelId: levelId
            })
    }
    componentDidMount() {
        var that = this;
        that.getCourseCommt();
        that.getConfigGift();
        that.getUser();
        that._getAllComment();
        that.getConfigs();
        that.getusers()
    }
    getusers = () => {
        var that = this
        api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    // api.get('/user/learn/lock', {
                    //     action: 0
                    // }).then(res => {
                    //     if (res.data.message) {
                    //         this.setState({
                    //             leave: 1
                    //         })
                    //         Taro.showModal({
                    //             title: '提示',
                    //             content: res.data.message,
                    //             success: function (res) {
                    //                 if (res.confirm) {
                    //                     Taro.switchTab({
                    //                         url: '/pages/index/index'
                    //                     })
                    //                 } else if (res.cancel) {
                    //                     Taro.switchTab({
                    //                         url: '/pages/index/index'
                    //                     })
                    //                 }
                    //             }
                    //         })
                    //         setTimeout(() => {
                    //             Taro.switchTab({
                    //                 url: '/pages/index/index'
                    //             })
                    //         }, 3000);
                    //     }
                    // })
                }
            })
    }
    componentDidShow() {
        var that = this;
        const { course_id } = that.state

        const token = Taro.getStorageSync('token')

        that.setState({
            loginStatus: token != ''
        })

        if (token != '') {
            api.get(inter.User)
                .then(res => {
                    if (res.data.status) {
                        let userData = res.data.data
                        that.setState({
                            userintegral: userData.integral,
                            userId: userData.userId,
                        })
                    }
                })
        }

        that._getCourse()
        that._getAllComment()

        api.get(inter.CourseDesc + course_id)
            .then((res) => {
                if (res.data.status) {
                    let courseDesc = res.data.data

                    that.setState({
                        canBuy: courseDesc.canBuy
                    })
                }
            })
    }

    componentWillUnmount() {
        const { leave, chapterList, is_Free, canBuy, c_integral, payType, freeChapter, course_id, index, cindex, current } = this.state
        // this.backgroundAudioManager.pause();
        this.audioidx = [];
        this.setState({ atype: 0 })
        this._onPause()
        this.backgroundAudioManager.seek(0)
        this.backgroundAudioManager.stop()
        if (leave === 0) {
            api.get('/user/learn/lock', {
                action: 1
            }).then(res => { })
        }


        let chapter = chapterList[index];
        let cchapter = chapter.child[cindex];
        let auduotitle = chapter.child[cindex].chapterName + ' ' + chapter.child[cindex].content
        this.ts = 0;
        Taro.setStorageSync('a' + course_id.toString(), {
            index: index,
            cindex: cindex,
            mediaId: cchapter.mediaId,
            chapterId: cchapter.parentId,
            cchapterId: cchapter.chapterId,
            duration: cchapter.duration,
            auduotitle: auduotitle,
            cchapterName: cchapter.chapterName,
            current: current,
        })
    }
    componentDidHide() {
        const { leave, chapterList, is_Free, canBuy, c_integral, payType, freeChapter, course_id, index, cindex } = this.state
        if (this.state.leave === 0) {
            api.get('/user/learn/lock', {
                action: 1
            }).then(res => { })
        }
        let chapter = chapterList[index];
        let cchapter = chapter.child[cindex];
        let auduotitle = chapter.child[cindex].chapterName + ' ' + chapter.child[cindex].content
        this.ts = 0;
        // Taro.setStorageSync('a' + course_id.toString(), {
        //     index: index,
        //     cindex: cindex,
        //     mediaId: cchapter.mediaId,
        //     chapterId: cchapter.parentId,
        //     cchapterId: cchapter.chapterId,
        //     duration: cchapter.duration,
        //     auduotitle: auduotitle,
        //     cchapterName: cchapter.chapterName,
        // })
    }
    // 得到课程详情
    getCourseDesc() {
        var that = this
        const { course_id } = that.state
        api.get(inter.CourseDesc + course_id)
            .then(res => {

                if (res.data.status) {
                    let courseDesc = res.data.data;
                    if (courseDesc.canShare == 0) {
                        Taro.hideShareMenu()
                    } else {
                        wx.showShareMenu({

                            withShareTicket: true,

                            menus: ['shareAppMessage', 'shareTimeline']
                        })
                    }
                    this.setState({
                        load: true,
                        courseDesc: courseDesc,
                        chapterList: courseDesc.chapterList,
                        isCollect: courseDesc.collect,
                        isFollow: courseDesc.teacher.isFollow,
                        teacher: courseDesc.teacher,
                        collectNum: courseDesc.collectNum,
                        teacherId: courseDesc.teacherId,
                        learn: courseDesc.learn,
                        isSeries: courseDesc.isSeries,
                        courseImg: courseDesc.courseImg,
                        canPlay: courseDesc.canPlay,
                        score: courseDesc.score,
                        audioImg: courseDesc.courseImg,
                        c_integral: courseDesc.integral,
                        canBuy: courseDesc.canBuy,
                        payType: courseDesc.payType,
                        goodsList: courseDesc.goodsList,
                        cchapterName: courseDesc.chapterList[0].child[0].chapterName,
                        freeChapter: courseDesc.freeChapter,
                        thisTeacher: courseDesc.thisTeacher,
                    }, () => {
                        this._getinitAudio();
                    })
                    if (res.data.message) {
                        if (res.data.message == '您尚未实名认证，请认证后再来！') {
                            Taro.showModal({
                                title: '提示',
                                content: res.data.message,
                                success: function (res) {
                                    if (res.confirm) {
                                        Taro.navigateTo({ url: menus.realAuth })
                                    } else if (res.cancel) {
                                        Taro.navigateTo({ url: menus.realAuth })
                                    }
                                }
                            })
                        } else if (res.data.message == '您不属于本内容的特定开放对象，其他内容同样精彩！') {
                            Taro.showModal({
                                title: '提示',
                                content: res.data.message,
                                success: function (res) {
                                    if (res.confirm) {
                                        Taro.navigateTo({ url: menus.searchList + '?ctype=1&btype=0' + '&keyword=' })
                                    } else if (res.cancel) {
                                        Taro.navigateTo({ url: menus.searchList + '?ctype=1&btype=0' + '&keyword=' })
                                    }
                                }
                            })
                            setTimeout(() => {
                                Taro.navigateTo({ url: menus.searchList + '?ctype=1&btype=0' + '&keyword=' })
                            }, 3000);
                        } else if (res.data.message == '请先登录！') {
                            Taro.showToast({
                                title: res.data.message,
                                icon: 'none',
                                duration: 4000,
                            })
                            setTimeout(() => {
                                getApp().globalData.showLogs = 1
                                Taro.switchTab({
                                    url: '/pages/user/user'
                                })
                            }, 4000);
                        } else {
                            Taro.showModal({
                                title: '提示',
                                content: res.data.message,
                                success: function (res) {
                                    if (res.confirm) {
                                        Taro.navigateTo({ url: menus.searchList + '?ctype=1&btype=0' + '&keyword=' })
                                    } else if (res.cancel) {
                                        Taro.navigateTo({ url: menus.searchList + '?ctype=1&btype=0' + '&keyword=' })
                                    }
                                }
                            })
                            setTimeout(() => {
                                Taro.navigateTo({ url: menus.searchList + '?ctype=1&btype=0' + '&keyword=' })
                            }, 3000);
                        }
                    }
                } else {
                    if (res.data.message == '请先登录！') {
                        Taro.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 4000,
                        })
                        setTimeout(() => {
                            getApp().globalData.showLogs = 1
                            Taro.switchTab({
                                url: '/pages/user/user'
                            })
                        }, 4000);
                    }
                }
            })
    }


    //  初始 获取音频
    _getinitAudio() {
        var that = this
        const { chapterList } = that.state


        const currentPlayerId = Taro.getStorageSync('currentPlayerId');

        if (this.backgroundAudioManager.src) {
            if (currentPlayerId) {
                for (let i = 0; i < chapterList.length; i++) {
                    for (let j = 0; j < chapterList[i].child.length; j++) {

                        if (this.audioidx.indexOf(parseInt(chapterList[i].child[j].chapterId)) == -1) {
                            this.audioidx.push(parseInt(chapterList[i].child[j].chapterId))
                        }
                    }
                }

                if (this.audioidx.indexOf(currentPlayerId) > -1) {

                    Taro.getBackgroundAudioPlayerState({
                        success: res => {
                            if (res.status === 1) {
                                that.setState({
                                    audioStatus: true
                                })
                            } else {
                                that.setState({
                                    audioStatus: false
                                })
                            }
                            that.setState({
                                current: res.currentPosition,
                                duration: res.duration,
                                audioUrl: res.dataUrl,
                                cchapterId: currentPlayerId,
                                audiohas: true,
                            }, () => {
                                that._initPlaying();
                            })

                        }

                    })
                } else {
                    that.setState({
                        audioStatus: false
                    })
                    that._noneChapter();
                }
            }
        } else {
            that.setState({
                audioStatus: false
            })
            that._noneChapter();
        }
    }


    // 播放音乐 不在  这个章节中
    _noneChapter() {
        var that = this
        const { chapterList, audioRdList, course_id } = that.state;

        let courseRdId: any = []; // 记忆 课程  

        for (let z = 0; z < audioRdList.length; z++) {
            courseRdId.push(audioRdList[z].courseId)
        }


        if (chapterList.length > 0) {
            const child = chapterList[0].child || [];
            if (child.length > 0) {
                let mediaId = child[0].mediaId
                let chapterId = chapterList[0].chapterId
                let cchapterId = child[0].chapterId
                let duration = child[0].duration
                let auduotitle = child[0].chapterName + ' ' + child[0].content

                this.setState({
                    mediaId: mediaId,
                    chapterId: chapterId,
                    cchapterId: cchapterId,
                    auduotitle: auduotitle,
                    duration: duration,
                    preTime: 0,
                }, () => {
                    that._getAudioUrl();
                })
            }
        }
    }

    _getAudioUrl() {

        var that = this
        const { mediaId } = that.state
        api.post(inter.CourseVideo, {
            media_id: mediaId
        }).then((res) => {
            if (res.data.status) {
                const videodesc = res.data.data
                that.setState({
                    courseImg: videodesc.cover,
                    duration: videodesc.duration,
                    audioUrl: videodesc.m38u,
                })
                Taro.showToast({
                    title: '加载中',
                    icon: 'loading',
                    duration: 2000
                })
            }
        })

    }
    getConfigs = () => {
        api.get(inter.FundConfig, {
            keyy: 'rewards_text',
            section: 'teacher'
        }).then(res => {
            if (res.data.status) {
                let val = res.data.data
                this.setState({
                    agree: val.agree,
                    again: val.again,
                    text: val.text.split(';'),
                    iftext: val.agreeText
                })
            }
        })
    }
    _onCloses = () => {
        const { ons, agree, userId } = this.state
        var that = this
        if (agree == 1) {
            if (ons) {
                let time = new Date().getTime().toString()
                time = time.slice(0, time.length - 3)
                api.post(inter.userHistory, {
                    etype: 117,
                    ctype: 0,
                    cctype: 1,
                    content_id: parseInt(time)
                })
                Taro.setStorageSync('tippss', 1)
                that.setState({
                    tip: false,
                    tipp: 1,
                }, () => {
                    if (userId > 0) {
                        that.setState({
                            typegift: true
                        })
                    } else {
                        this.refs.auth.doLogin();
                    }
                })
            } else {
                Taro.showToast({
                    title: '请同意后点击',
                    icon: 'none',
                    duration: 1500,
                })
            }
        } else {
            Taro.setStorageSync('tippss', 1)
            that.setState({
                tip: false,
                tipp: 1,
            }, () => {
                if (userId > 0) {
                    that.setState({
                        typegift: true
                    })
                } else {
                    this.refs.auth.doLogin();
                }
            })
        }
    }
    onOpen = () => {
        const { ons, agree, userId } = this.state
        var that = this
        if (agree == 1) {
            if (ons) {
                let time = new Date().getTime().toString()
                time = time.slice(0, time.length - 3)
                api.post(inter.userHistory, {
                    etype: 117,
                    ctype: 0,
                    cctype: 0,
                    content_id: parseInt(time)
                })
                this.setState({ tip: false },
                    () => {
                        if (userId > 0) {
                            that.setState({
                                typegift: true
                            })
                        } else {
                            this.refs.auth.doLogin();
                        }
                    })
            } else {
                this.setState({ tip: false })
            }
        } else {
            this.setState({ tip: false },
                () => {
                    if (userId > 0) {
                        that.setState({
                            typegift: true
                        })
                    } else {
                        this.refs.auth.doLogin();
                    }
                })
        }
    }

    //获得音频
    _getAudio(mediaId) {
        var that = this
        // const {mediaId} = that.state

        api.post(inter.CourseVideo, {
            media_id: mediaId
        }).then((res) => {
            if (res.data.status) {
                const videodesc = res.data.data
                that.setState({
                    courseImg: videodesc.cover,
                    duration: videodesc.duration,
                    audioUrl: videodesc.m38u,
                }, () => {
                    that._onPlaying();
                })
                // setTimeout(()=>{
                //     that._onPlaying();
                // },1000)

                Taro.showToast({
                    title: '加载中',
                    icon: 'loading',
                    duration: 2000
                })
            }
        })
    }

    _initPlaying() {
        var that = this;
        const { preTime, audiohas } = that.state;

        if (audiohas) {
            setTimeout(function () {
                if (preTime != 0) {
                    that.currentTimeChange();
                }
            }, 50)
            const lst = Taro.getStorageSync('a' + this.state.course_id.toString())
            if (lst.current) {
                setTimeout(() => {
                    this._onPlayer(lst.index, lst.cindex);
                    setTimeout(() => {
                        this.backgroundAudioManager.play();
                        this.backgroundAudioManager.seek(Math.floor(lst.current));
                        that.setState({
                            current: lst.current
                        })
                    }, 3000)
                }, 1000);
            }
        }
    }

    // 音频 播放 
    _onPlaying() {
        var that = this;
        const { audioUrl, preTime, auduotitle, audioImg, teacher, cchapterId, course_id, duration, is_Free, canBuy, c_integral, payType, freeChapter, thisTeacher, index, cindex, chapterId } = that.state;

        if (!(payType > 0 && canBuy)) {

            if (that.backgroundAudioManager.src !== audioUrl) {
                this.backgroundAudioManager.coverImgUrl = audioImg;
                this.backgroundAudioManager.src = audioUrl;
                this.backgroundAudioManager.title = auduotitle;
                this.backgroundAudioManager.singer = teacher.teacherName;
            }
            Taro.setStorageSync('currentPlayerId', cchapterId)

            that.setState({
                audiohas: true,
                cmic_type: 1,
                atype: 1,
            })

            let updateData = {
                isPlaying: true,
                cmic_audioName: auduotitle,
                cmic_audioId: course_id,
                cmic_audioImg: audioImg,
                cmic_siger: teacher.teacherName,
                cmic_duration: duration,
                isCMusic: false
            }

            that.props.updatePlayStatus({
                updateData: updateData
            })
            setTimeout(function () {
                if (preTime !== 0) {
                    this.backgroundAudioManager.seek(Math.floor(preTime));
                    that.currentTimeChange();
                } else {
                    that.currentTimeChange();
                }
            }, 3000)

            this.backgroundAudioManager.play();


            that.setState({
                audioStatus: true
            })
            this.backgroundAudioManager.onPrev(() => {
                that._onPremusic()  //直接调用上一首 / 下一首的方法即可
            });

            this.backgroundAudioManager.onNext(() => {
                that._onNextmusic()  //直接调用上一首 / 下一首的方法即可
            });

            //播放结束
            this.backgroundAudioManager.onEnded(() => {

                that.setState({
                    current: 0,
                    audioStatus: false,
                    preTime: 0,
                })
                //播放自然结束时更新进度
                // that.updateViewTime();
                // 音频结束后，执行下一节音频
                that._onNextmusic();

            })

            this.backgroundAudioManager.onError(() => {
                Taro.showToast({
                    title: '播放出错',
                    icon: 'none',
                    duration: 1000,
                })
            })
        } else {
            if (freeChapter > 0 || thisTeacher) {
                if (that.backgroundAudioManager.src !== audioUrl) {
                    this.backgroundAudioManager.coverImgUrl = audioImg;
                    this.backgroundAudioManager.src = audioUrl;
                    this.backgroundAudioManager.title = auduotitle;
                    this.backgroundAudioManager.singer = teacher.teacherName;
                }

                Taro.setStorageSync('currentPlayerId', cchapterId)

                that.setState({
                    audiohas: true,
                    cmic_type: 1,
                    atype: 1,
                })

                let updateData = {
                    isPlaying: true,
                    cmic_audioName: auduotitle,
                    cmic_audioId: course_id,
                    cmic_audioImg: audioImg,
                    cmic_siger: teacher.teacherName,
                    cmic_duration: duration,
                    isCMusic: false
                }

                that.props.updatePlayStatus({
                    updateData: updateData
                })

                setTimeout(function () {
                    if (preTime !== 0) {
                        this.backgroundAudioManager.seek(Math.floor(preTime));
                        that.currentTimeChange();
                    } else {
                        that.currentTimeChange();
                    }
                }, 3000)

                this.backgroundAudioManager.play();


                that.setState({
                    audioStatus: true
                })
                this.backgroundAudioManager.onPrev(() => {
                    that._onPremusic()  //直接调用上一首 / 下一首的方法即可
                });

                this.backgroundAudioManager.onNext(() => {
                    that._onNextmusic()  //直接调用上一首 / 下一首的方法即可
                });

                //播放结束
                this.backgroundAudioManager.onEnded(() => {

                    that.setState({
                        current: 0,
                        audioStatus: false,
                        preTime: 0,
                    })
                    //播放自然结束时更新进度
                    // that.updateViewTime();
                    // 音频结束后，执行下一节音频
                    that._onNextmusic();

                })

                this.backgroundAudioManager.onError(() => {
                    Taro.showToast({
                        title: '播放出错',
                        icon: 'none',
                        duration: 1000,
                    })
                })
            } else {
                Taro.showToast({
                    title: '购买后才能收听',
                    icon: 'none',
                    duration: 1000
                })
            }

        }

    }

    // 音频 暂停
    _onPause() {
        var that = this;

        const { auduotitle, audioImg, teacher, course_id, duration } = that.state;

        this.backgroundAudioManager.pause();

        let updateData = {
            isPlaying: false,
            cmic_audioName: 'auduotitle',
            cmic_audioId: course_id,
            cmic_audioImg: audioImg,
            cmic_siger: teacher.teacherName,
            cmic_duration: duration,
            isCMusic: true
        }

        that.props.updatePlayStatus({
            updateData: updateData
        })

        that.setState({
            audioStatus: false,
            cmic_type: 0,
        })
    }


    //切换到上一首
    _onPremusic() {
        const { index, cindex, chapterList } = this.state;
        //index == 0 // 大目录 cindex 小节
        let _index = index;
        let _cindex = cindex;

        if (_index === 0 && _cindex === 0) {
        } else {
            if ((_index === 0 && _cindex !== 0)) {
                _cindex--;
            } else if (_index !== 0 && _cindex === 0) {
                _index--;
                _cindex = chapterList[index - 1].child.length - 1;
            } else if (_index !== 0 && _cindex !== 0) {
                _cindex--;
            }
            this._onPlayer(_index, _cindex);
        }
    }


    // 切换到下一首
    _onNextmusic() {
        const { index, cindex, chapterList, levelId } = this.state;

        let _index = index;
        let _cindex = cindex;


        if (chapterList[index].child.length == (cindex + 1)) {
            if ((_index + 1) == chapterList.length) {
                _index = 0;
                if (levelId != 0) {
                    Taro.navigateBack({
                        delta: 1
                    })
                }
            } else {
                _index++;
            }

            _cindex = 0;
        } else {
            _cindex++;
        }

        if (_index == 0 && _cindex == 0) {

        } else {
            this._onPlayer(_index, _cindex);

        }

    }

    // 更新时间
    currentTimeChange() {


        this.backgroundAudioManager.onTimeUpdate(() => {
            var that = this;
            const { cchapterId, course_id, audioUrl, chapterId, courseDesc, levelId, chapterList, index, cindex } = that.state;
    
    
            let chapter = chapterList[index];
            let cchapter = chapter.child[cindex];
            let auduotitle = chapter.child[cindex].chapterName + ' ' + chapter.child[cindex].content
            that.ts++;
            if (that.ts % 10 == 0) {
                if (that.backgroundAudioManager.src === audioUrl) {
                    const rd_audio = { duration: parseInt(this.backgroundAudioManager.currentTime).toFixed(0), courseId: course_id, cchapterIds: cchapterId }
                    that._getAudioRecord(rd_audio);
                }
                let learnTime = (this.ts / 4).toFixed(0);
                this.ts = 0;
                
                api.post(inter.LearnCourse + course_id, {
                    course_id: course_id,
                    course_name: courseDesc.courseName,
                    chapter_id: chapterId,
                    cchapter_id: cchapterId,
                    duration: learnTime,
                    levelId: levelId
                }).then((res) => {
                    // console.log(res)
                })

                Taro.setStorageSync('a' + course_id.toString(), {
                    index: index,
                    cindex: cindex,
                    mediaId: cchapter.mediaId,
                    chapterId: cchapter.parentId,
                    cchapterId: cchapter.chapterId,
                    duration: cchapter.duration,
                    auduotitle: auduotitle,
                    cchapterName: cchapter.chapterName,
                })
            }


            that.setState({
                current: this.backgroundAudioManager.currentTime,
                duration: this.backgroundAudioManager.duration,
                preTime: this.backgroundAudioManager.currentTime,
            })


        })

    }

    _getAudioRecord(rd_audio: any) {
        let record = Taro.getStorageSync("audioRd");

        if (Array.isArray(record)) {
            for (let i = 0; i < record.length; i++) {
                if (record[i].courseId == rd_audio.courseId) {
                    record.splice(i, 1);
                }
            }
            record.push(rd_audio)
        } else {
            record = []
            record.push(rd_audio)
        }

        Taro.setStorageSync('audioRd', record)

    }

    // _sliderChange 拖动更新
    _sliderChange(e) {
        var that = this;
        const { audioStatus } = that.state;
        let current = parseInt(e.detail.value);
        //播放状态
        if (audioStatus) {
            this.backgroundAudioManager.play();
            //进度条拖动，音乐进度也要改变
            this.backgroundAudioManager.seek(Math.floor(current));
            //更新进度
            // that.updateViewTime();
        } else {
            this.backgroundAudioManager.seek(Math.floor(current));
            this.backgroundAudioManager.pause();
            that.setState({
                current: current
            })
        }


    }

    // 记录时间时长
    // updateViewTime(){

    // }



    // 速率 选择音频
    _onRate = e => {
        // var that = this ;
        // const {rateList} = that.state;

        // let rateValue = rateList[e.detail.value];

        // that.setState({
        //     rateIndex:e.detail.value,
        //     rateList:rateList,
        //     rateValue:parseInt(rateValue),
        // },()=>{
        //     // backgroundAudioManager
        // })
    }

    // 评分
    _onStar1(score) {
        var that = this;
        that.setState({
            techScore: score
        })

    }
    _onStar2(score) {
        var that = this;
        that.setState({
            courseScore: score
        })
    }

    _evalSubmit() {
        var that = this;
        const { techScore, courseScore, course_id } = that.state;

        api.post(inter.PublishComment + course_id, {
            content: '',
            gallery: '',
            score: courseScore,
            teacher_score: techScore,
        }).then(res => {
            if (res.data.status) {
                that._getCourse();
                that.setState({
                    evalType: false
                }, () => {
                    Taro.showToast({
                        title: '评分成功',
                        icon: 'success',
                        duration: 2000
                    })
                })
            }
        })
    }

    _getCourse() {
        var that = this;
        const { course_id } = that.state

        api.get(inter.CourseDesc + course_id)
            .then((res) => {
                if (res.data.status) {
                    let courseDesc = res.data.data;
                    this.setState({
                        score: courseDesc.score,
                        isCollect: courseDesc.collect,
                        isFollow: courseDesc.teacher.isFollow,
                        collectNum: courseDesc.collectNum,
                        learn: courseDesc.learn,
                        isSeries: courseDesc.isSeries,
                        courseImg: courseDesc.courseImg,
                        canPlay: courseDesc.canPlay,
                        audioImg: courseDesc.courseImg,
                        c_integral: courseDesc.integral
                    })
                }
            })
    }



    // 获取个人信息
    getUser() {
        var that = this
        api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    let userData = res.data.data
                    that.setState({
                        username: userData.nickname,
                        userintegral: userData.integral,
                        userId: userData.userId,
                    })
                }
            })
    }

    //分享课程
    onShareAppMessage = (res) => {

        const { userId, courseDesc, course_id } = this.state;
        var that = this
        api.post(inter.userLog, {
            log_type: 1,
            type: 1,
            device_id: 0,
            intro: '分享音频课程',
            content_id: courseDesc.courseId,
            param: JSON.stringify({ name: courseDesc.courseName, cctype: 2, ttype: 1 }),
            from: 0,
        }).then((res) => {

        })
        api.post(inter.shareCourses + course_id)
            .then(res => {
            })
        if (res.from === 'button') {
            // 来自页面内转发按钮
        }
        return {
            title: courseDesc.courseName,
            path: menus.audioDesc + '?course_id=' + this.state.course_id + '&fromuser=' + userId,
            imageUrl: courseDesc.courseImg + '?x-oss-process=image/resize,w_500,h_380,m_pad',
            success: function (res) {
                setTimeout(() => {
                    api.get(inter.checkEvents)
                        .then(res => {
                            if (res.data.data) {
                                that.setState({
                                    integral: parseInt(res.data.data),
                                    show: true
                                })
                            }
                        })
                }, 500);
            },
        }
    }
    onShareTimeline() {
        const { userId, courseDesc, course_id } = this.state;
        return {
            title: courseDesc.courseName,
            query: menus.audioDesc + '?course_id=' + course_id + '&courseName=' + percent2percent25(`${courseDesc.courseName}`) + '&fromuser=' + userId,
            imageUrl: courseDesc.courseImg,
        }
    }


    // 得到课程评论
    getCourseCommt() {
        var that = this
        const { course_id } = that.state
        this.props.getCourseCommt({
            course_id: course_id,
            sort: 1,
            page: 1,
        })
    }

    // 得到 全部评论
    _getAllComment() {
        var that = this
        const { course_id } = that.state
        api.get(inter.CourseCommt + course_id, {
            sort: 2,
            page: 0,
        }).then(res => {
            if (res.data.status) {
                let topComms = res.data.data
                that.setState({
                    topComms: topComms.items
                })
            }
        })
    }

    // 得到礼物
    getConfigGift() {
        this.props.getConfigGift({
            gtype: 0
        })
    }

    // 选择tab
    _onSelect = (index) => {
        var that = this

        that.setState({
            status: index
        })

    }

    // 跳转到老师主页
    _onCourse(teacher) {
        Taro.navigateTo({
            url: menus.teachZone + '?teacher_id=' + `${teacher.teacherId}`
        })
    }

    //关注老师
    _offFollow(isFollow) {
        const that = this
        const { teacher, userId } = that.state

        if (userId > 0) {
            api.post(inter.RemoveFollow + teacher.teacherId).then((res) => {
                if (res.data.status) {
                    Taro.showToast({
                        title: '取消成功',
                        icon: 'none'
                    })
                    that.setState({
                        isFollow: false
                    })
                } else {
                    Taro.showToast({
                        title: '取消失败',
                        icon: 'none'
                    })
                }
            })
        } else {
            this.refs.auth.doLogin();
        }

    }


    //取消关注
    _onFollow(isFollow) {
        const that = this
        const { teacher, userId } = that.state

        if (userId > 0) {
            api.post(inter.PublishFollow + teacher.teacherId).then((res) => {
                if (res.data.status) {
                    Taro.showToast({
                        title: '关注成功',
                        icon: 'none'
                    })
                    that.setState({
                        isFollow: true
                    })
                } else {
                    Taro.showToast({
                        title: '关注失败',
                        icon: 'none'
                    })
                }
            })
        } else {
            this.refs.auth.doLogin();
        }

    }

    // 是否打赏礼物
    _onTypegift() {
        var that = this
        const { userId } = that.state
        let vas = Taro.getStorageSync('tippss')
        if (vas == 1) {
            if (userId > 0) {
                that.setState({
                    typegift: true
                })
            } else {
                this.refs.auth.doLogin();
            }
        } else {
            that.setState({
                tip: true
            })
        }

    }

    // 写评论
    _whiteCommt() {
        var that = this
        const { course_id, userId } = that.state
        if (userId) {
            Taro.navigateTo({
                url: menus.writeCommt + '?course_id=' + `${course_id}` + '&whitetip=' + Taro.getStorageSync('whiteTip') + '&type=0&ctype=1&isStar=0'
            })
        } else {
            this.refs.auth.doLogin();
        }

    }

    // 收藏课程
    _onCollect() {
        var that = this
        const { course_id, collectNum, userId } = that.state

        if (userId > 0) {
            api.post(inter.PublishCollect + course_id)
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
                        api.get(inter.checkEvents)
                            .then(res => {
                                if (res.data.data) {
                                    that.setState({
                                        integral: parseInt(res.data.data),
                                        show: true
                                    })
                                }
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

    // 取消收藏
    _offCollect() {
        var that = this
        const { course_id, collectNum, userId } = that.state
        let colletN = collectNum - 1

        if (userId > 0) {
            api.post(inter.removeCollect + course_id)
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

    // 点赞
    _parse(val, comIdx) {
        var that = this
        const { topComms, userId } = that.state

        if (userId > 0) {
            if (val.like) {
                api.post(inter.RemoveLike + val.commentId).then((res) => {
                    if (res.data.status) {
                        topComms[comIdx].like = !topComms[comIdx].like
                        topComms[comIdx].praise = topComms[comIdx].praise - 1
                        that.setState({
                            topComms: topComms
                        })
                    }
                })
            } else {
                api.post(inter.PublishLike + val.commentId).then((res) => {
                    if (res.data.status) {
                        topComms[comIdx].like = !topComms[comIdx].like
                        topComms[comIdx].praise = topComms[comIdx].praise + 1
                        that.setState({
                            topComms: topComms
                        })
                    }
                })
            }
        } else {
            this.refs.auth.doLogin();
        }

    }

    //选择打赏礼物
    _onSelectGift(gf) {
        var that = this
        that.setState({
            gfIntegral: gf.integral,
            gfId: gf.giftId,
            gifttImg: gf.giftImg
        })
    }

    // 打赏
    _reward = () => {
        var that = this
        const { course_id, gfId } = that.state
        if (gfId > 0) {
            api.post(inter.PublishReward + gfId, {
                course_id: course_id,
            }).then((res) => {
                if (res.data.status) {
                    this.getUser()
                    this.setState({
                        typegift: false,
                        publishGift: true
                    }, () => {
                        setTimeout(() => that.setState({ publishGift: false }), 5000)
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

    // 点击图片放大
    onViewImg(galleryList, index) {
        let urls: string[] = new Array();
        for (let i = 0; i < galleryList.length; i++) {
            urls.push(galleryList[i].fpath)
        }

        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: urls[index], // 当前显示图片的http链接，默认是第一个
        }).then((res) => {
            // console.log(res)
        })
    }

    // 点击章节播放
    _onPlayer = (index, cindex) => {
        var that = this
        const { chapterList, is_Free, canBuy, c_integral, payType, freeChapter, course_id } = that.state;

        if (!(payType > 0 && canBuy)) {
            let chapter = chapterList[index];
            let cchapter = chapter.child[cindex];
            let auduotitle = chapter.child[cindex].chapterName + ' ' + chapter.child[cindex].content
            this.ts = 0;

            that.setState({
                index: index,
                cindex: cindex,
                mediaId: cchapter.mediaId,
                chapterId: cchapter.parentId,
                cchapterId: cchapter.chapterId,
                duration: cchapter.duration,
                auduotitle: auduotitle,
                cchapterName: cchapter.chapterName,
            }, () => {
                Taro.setStorageSync('currentPlayerId', cchapter.chapterId);
                Taro.setStorageSync('currentPlayerIdS', cchapter.parentId);
                this._getAudio(cchapter.mediaId);
            })


        } else {
            if (freeChapter > 0) {
                let chapter = chapterList[index];
                let cchapter = chapter.child[cindex];
                let auduotitle = chapter.child[cindex].chapterName + ' ' + chapter.child[cindex].content
                this.ts = 0;
                api.post(inter.userHistory, {
                    ctype: 3,
                    etype: 119,
                    cctype: 1,
                    content_id: course_id
                }).then(res => { })

                that.setState({
                    index: index,
                    cindex: cindex,
                    mediaId: cchapter.mediaId,
                    chapterId: cchapter.parentId,
                    cchapterId: cchapter.chapterId,
                    duration: cchapter.duration,
                    auduotitle: auduotitle,
                    cchapterName: cchapter.chapterName,
                }, () => {
                    Taro.setStorageSync('currentPlayerId', cchapter.chapterId);
                    Taro.setStorageSync('currentPlayerIdS', cchapter.parentId);
                    this._getAudio(cchapter.mediaId);
                })
            } else {
                Taro.showToast({
                    title: '购买后才能收听',
                    icon: 'none',
                    duration: 1000
                })
            }


        }


    }

    // 登录回调
    _onLoadCallBack() {
        var that = this

        api.get(inter.User)
            .then(res => {
                if (res.data.status) {
                    let userData = res.data.data
                    that.setState({
                        userintegral: userData.integral,
                        userId: userData.userId,
                    })
                }
            })
        that._getAllComment();
        that._getCourse();
        this.setState({
            loginStatus: true
        })
    }

    _coursePf() {
        var that = this;
        const { userId } = that.state
        if (userId > 0) {
            that.setState({
                evalType: true
            })
        } else {
            this.refs.auth.doLogin();
        }
    }


    // 立即购买
    _buyCourse() {

        var that = this
        const { courseDesc, fromuser } = that.state


        Taro.navigateTo({
            url: menus.buyCourse + '?courseId=' + courseDesc.courseId + '&coursename=' + percent2percent25(courseDesc.courseName) + '&courseImg=' + courseDesc.courseImg +
                '&summary=' + percent2percent25(courseDesc.summary) + '&courseintegral=' + courseDesc.integral + '&fromuser=' + fromuser + '&teacherName=' + courseDesc.teacher.teacherName + '&honer=' +
                courseDesc.teacher.honor + '&courseType=1' + '&payType=' + courseDesc.payType + '&courseCash=' + courseDesc.courseCash
        })

    }

    _toMail = (item) => {

        let adlink = item.goodsLink;

        if (adlink.substring(0, 4) == 'http') {
            Taro.navigateTo({ url: menus.adWebView + '?link=' + `${item.goodsLink}` + '&ad=' + `${JSON.stringify(item)}` })
        } else {

            api.post(inter.userYcToken, {})
                .then((res) => {
                    if (res.data.status) {
                        let data = res.data.data;

                        Taro.navigateToMiniProgram({
                            appId: 'wxf2bb2960b32a82c3',
                            path: item.goodsLink,
                            envVersion: 'release',
                            extraData: {
                                token: data.msg,
                            },
                            success(res) {

                            }
                        });
                    }
                })


        }

    }
    _onClose = () => {
        this.setState({ atype: 0 })
        this._onPause()
        this.backgroundAudioManager.seek(0)
        this.backgroundAudioManager.stop()
    }
    onOkeys = () => {
        this.setState({
            show: false
        })
    }
    render() {

        if (!this.state.load) return null;

        const { home } = this.props
        const { giftList } = home

        const { atype, goodsList, courseDesc, score, audioType, evalType, tipList, rateIndex, rateList, audioStatus, teacher, current, duration, status, comment, gfIntegral, userintegral, typegift, course_id, gfId, chapterId, cchapterId, chapterList, isCollect, isFollow, gifttImg, publishGift, collectNum, teacherId, isSeries, username, commend_total, topComms, userId, canPlay, cmic_type, c_integral, is_Free, canBuy, cchapterName, freeChapter, payType, tip, text, again, ons, agree, iftext, show, integral } = this.state


        // tab页 展示 根据 isSeries 判断   等于0 不显示课程大纲
        let tabites: string[] = new Array()
        let total = topComms.filter(item => item.isTop == 1 ? item : null)
        if (isSeries == 0) {
            tabites = ['课程简介', `评论(${courseDesc.comment})`]
        } else if (isSeries == 1) {
            tabites = ['课程简介', '课程大纲', `评论(${courseDesc.comment})`]
        }


        //礼物8个人一组
        let giftst: any[] = new Array()
        for (let i = 0; i < giftList.length; i += 8) {
            giftst.push(giftList.slice(i, i + 8));
        }


        let autoplay: boolean = false;
        if (userId > 0 && canPlay) {
            autoplay = true
        }


        if (payType > 0 && canBuy && current > freeChapter) {
            this._onPause()
            // this.backgroundAudioManager.seek(0)
            this.backgroundAudioManager.pause()
            this.setState({
                current: 0
            })
            setTimeout(() => {
                Taro.showToast({
                    title: '请购买后继续收听',
                    icon: 'none',
                    duration: 1500
                })
            }, 200);

        }

        return (
            <View className='wrap pb_50'>
                <View className='d_flex fd_c wrapHead'>
                    <View className='d_flex ai_ct fd_r jc_ct mt_10'>
                        <Image src={courseDesc.courseImg} className='wrapPicture' mode="aspectFit" style={{ width: 416 + 'rpx', height: 416 + 'rpx', }} />
                    </View>
                    <View className='audioBox d_flex fd_c pl_15 pr_15'>
                        <View className='d_flex fd_c mb_15'>
                            <Slider
                                // disabled
                                max={duration} value={current} className='audSliber' backgroundColor='#FFE0D9' activeColor='#F4623F' blockColor='#F4623F' blockSize={1}
                                onChange={this._sliderChange}
                            />
                            <View className='d_flex fd_r jc_sb'>
                                <Text className='sm_label tip_label'>{forTimer(current)}</Text>
                                <Text className='sm_label tip_label'>{forTimer(duration)}</Text>
                            </View>
                        </View>
                        <View className='audcons d_flex fd_r ai_ct jc_sb'>
                            <View className='d_flex fd_c ai_ct' onClick={() => this.setState({ audioType: true })}>
                                <Image src={asset.aud_list} className='aud_list' />
                                <Text className='smm_label c33_label mt_5'>播放列表</Text>
                            </View>
                            <View className='d_flex fd_r ai_ct audioPlay'>
                                <Image src={asset.aud_pre} className='aud_pre' onClick={this._onPremusic} />
                                <Image src={audioStatus ? asset.aud_pause : asset.aud_pay} className='aud_pause pl_50 pr_50' onClick={audioStatus ? this._onPause : this._onPlaying} />
                                <Image src={asset.aud_next} className='aud_next' onClick={this._onNextmusic} />
                            </View>
                            {/* <Picker  
                                mode='selector' 
                                range={rateList} onChange={this._onRate}>
                                    <View className='rateCons'>
                                        <View className='rateBox d_flex fd_c ai_ct'>
                                            <Image src={asset.aud_speed}  className='aud_speed'/>
                                            <Text className='smm_label c33_label mt_5'>倍速播放</Text>
                                        </View>
                                        <View className='rateTips'>
                                            <Text className='smm_label white_label'>x{rateList[rateIndex]}</Text>
                                        </View>
                                    </View>
                            </Picker> */}
                            <View className='rateCons' style={{ width: '80rpx', height: '20rpx' }}>

                            </View>
                        </View>
                    </View>
                    <View className='atabs'>
                        <Tabs items={tabites} selected={status} onSelect={this._onSelect} />
                    </View>
                </View>


                {
                    status === 0 ?
                        <View className='pt_15 '>
                            <View className='pb_15 pl_15 pr_15 audioTitle' >
                                <Text className='lg20_label c33_label fw_label'>{courseDesc.courseName}</Text>
                                <View className='d_flex ai_ct fd_r mt_10 jc_sb'>
                                    <View className="d_flex fd_r ai_ct">
                                        <Coursescore val={score} />
                                        <Text className='sm_label gray_label ml_10'>综合评分 {score}</Text>
                                    </View>
                                    <View className='d_flex fd_r ai_ct'>
                                        <View className='title_btn ml_10 d_flex ai_ct jc_ct' onClick={this._coursePf}>
                                            <Text className='sred_label sm_label'>课程评分</Text>
                                        </View>
                                    </View>
                                </View>
                                <View className='d_flex ai_ct fd_r mt_10 jc_sb'>
                                    <View className="d_flex fd_r ai_ct">
                                        {
                                            this.state.payType > 0 ?
                                                <Text className='red_label lg_label fw_label'>{c_integral}学分</Text>
                                                :
                                                <Text className='red_label lg_label fw_label'>免费</Text>
                                        }

                                    </View>
                                    <View className='d_flex fd_r ai_ct'>
                                        <Text className='sm_label gray_label'>共计{courseDesc.chapter}讲 <Text className='ml_5'>{courseDesc.hit}人已学</Text></Text>
                                    </View>
                                </View>
                                {
                                    this.state.ltype == 1 ?
                                        <View className='mt_10'>
                                            <Text className='default_label fw_label'>完成规则：学习时长需达到课程总时长的100%，拖动进度条将不能解锁课程</Text>
                                        </View>
                                        : null
                                }
                            </View>
                            {
                                teacherId == 0 ?
                                    null
                                    :
                                    <View className='teachinfo border_bt  ml_15 mr_15 '>
                                        <View className='item d_flex fd_c p_12' >
                                            <View className='d_flex fd_r ai_ct jc_sb'>
                                                <View className='d_flex fd_r ai_ct' onClick={this._onCourse.bind(this, teacher)}>
                                                    <Image src={teacher.teacherImg} className='teach_cover' />
                                                    <View className='ml_10 ' >
                                                        <Text className='default_label c33_label fw_label'>讲师：{teacher.teacherName}</Text>
                                                        <View className='d_flex fd_r ai_ct' >
                                                            <Text className='sm_label  tip_label'>全部课程</Text>
                                                            <Image src={asset.arrow_right} className='arrow_right' />
                                                        </View>
                                                    </View>
                                                </View>
                                                {
                                                    isFollow ?
                                                        <View className='focuson d_flex jc_ct ai_ct ml_5'
                                                            onClick={this._offFollow.bind(this, isFollow)}
                                                        >
                                                            <Text className='red_label sm_label'>已关注</Text>
                                                        </View>
                                                        :
                                                        <View className='focuson d_flex jc_ct ai_ct ml_5'
                                                            onClick={this._onFollow.bind(this, isFollow)}
                                                        >
                                                            <Text className='red_label sm_label'>+关注</Text>
                                                        </View>
                                                }
                                            </View>
                                            <Text className='sm_label lh17_label pt_10 gray_label'>{teacher.content}</Text>
                                        </View>
                                    </View>
                            }

                            <View className='pl_15 pr_15'>
                                <View className='border_bt pb_15 pt_15 d_flex fd_c '>
                                    <Text className='lg18_label c33_label fw_label'>课程简介</Text>
                                    <Text className='default_label lh20_label pt_10 gray_label'>{courseDesc.content}</Text>
                                </View>
                            </View>
                        </View>
                        : null}


                <View>
                    {
                        isSeries === 0 && status === 0 ?
                            <Menu chapterList={chapterList} chapterId={cchapterId} atype={1} clickPress={this._onPlayer} />
                            : null}
                </View>

                {
                    isSeries === 1 && (status === 0 || status === 1) ?
                        <View >
                            <View className='d_flex fd_r ai_ct jc_sb pt_15 pl_15 pr_15'>
                                <Text className='lg18_label c33_label fw_label'>课程大纲</Text>
                                <Text className='sm_label c33_label fw_label'>共{courseDesc.chapter}节</Text>
                            </View>

                            <Menu chapterList={chapterList} chapterId={cchapterId} atype={1} clickPress={this._onPlayer} />
                        </View>
                        : null}

                {
                    goodsList.length > 0 ?
                        <View className='goodsBox'>
                            <Text className='lg_label black_label fw_label'>相关产品</Text>
                            <View className='popularItem'>
                                <View
                                    // scrollX
                                    style={{ height: '320rpx', overflowY: 'auto' }}
                                >
                                    <View className='popu_items d_flex mt_15 '>
                                        {
                                            goodsList.map((item: any, index) => {
                                                return (
                                                    <View className='popu_item d_flex fd_c '
                                                        key={'item' + index}

                                                        onClick={this._toMail.bind(this, item)}
                                                    >
                                                        <Image className='popu_cover' src={item.goodsImg} />
                                                        <Text className='c33_label sm_label per_txt  mt_5'>{item.goodsName}</Text>
                                                        <Text className='sred_label sm_label fw_label mt_5'>{'¥' + item.goodsPrice}</Text>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                        : null}

                {
                    isSeries === 0 ?
                        <View>
                            {
                                status === 0 || status === 1 ?
                                    <View className={status === 0 ? 'm_15 pt_15 border_tp' : 'm_15 pt_15 '}>
                                        <Text className='lg18_label c33_label fw_label'>精选评论</Text>
                                        {
                                            topComms.length > 0 ?
                                                <View>
                                                    {
                                                        topComms.map((comm, index) => {
                                                            return (
                                                                <View key={'comm' + index}>
                                                                    <Eval
                                                                        comIdx={index}
                                                                        val={comm}
                                                                        type={1}
                                                                        onParse={this._parse}
                                                                    />
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </View>
                                                :
                                                <Comt />
                                        }

                                        {/* {
                                        topComms.length>0 ?  */}
                                        <View className='pt_12 pb_12 d_flex fd_r ai_ct jc_ct border_tp'
                                            onClick={() => Taro.navigateTo({ url: menus.allComment + '?course_id=' + `${course_id}` + '&type=0' + '&ctype=0' })}
                                        >
                                            <Text className='gray_label sm_label'>查看全部评论 &gt;</Text>
                                        </View>
                                        {/* :null} */}
                                    </View>
                                    : null}
                        </View>
                        :
                        <View>
                            {
                                status === 0 || status === 2 ?
                                    <View className={status === 0 ? 'm_15 pt_15 border_tp' : 'm_15 pt_15'} >
                                        <Text className='lg18_label c33_label fw_label'>精选评论</Text>
                                        {
                                            topComms.length > 0 ?
                                                <View>
                                                    {
                                                        topComms.map((comm, index) => {
                                                            return (
                                                                <View key={'comm' + index}>
                                                                    <Eval
                                                                        comIdx={index}
                                                                        val={comm}
                                                                        type={1}
                                                                        onParse={this._parse}
                                                                    />
                                                                </View>

                                                            )
                                                        })
                                                    }
                                                </View>
                                                :
                                                <Comt />
                                        }
                                        {/* {
                                         topComms.length > 0?  */}
                                        <View className='pt_12 pb_12 d_flex fd_r ai_ct jc_ct border_tp'
                                            onClick={() => Taro.navigateTo({ url: menus.allComment + '?course_id=' + `${course_id}` + '&type=0' + 'ctype=0' })}
                                        >
                                            <Text className='gray_label sm_label'>查看全部评论 &gt;</Text>
                                        </View>

                                    </View>
                                    : null}
                        </View>
                }



                {
                    c_integral > 0 && canBuy ?
                        <View className='comments d_flex fd_r ai_ct' >
                            <Image src={asset.gift} className='gift ml_10' onClick={this._onTypegift} />
                            <Image src={asset.eval_icon} className='gift ml_10' onClick={this._whiteCommt} />
                            <View className='countBox' onClick={isCollect ? this._offCollect : this._onCollect}>
                                <Image src={isCollect ? asset.collected : asset.heart_icon} className='heart_icon' />
                                <View className='count'>
                                    <Text className='sm9_label white_label'>{collectNum > 999 ? '999+' : collectNum}</Text>
                                </View>
                            </View>
                            <View className='buyBtn mr_20' onClick={this._buyCourse}>
                                <Text className='white_label default_label'>立即购买</Text>
                            </View>
                        </View>
                        :
                        <View className='comments d_flex ai_ct' >
                            <View className='d_flex fd_r ai_ct col_1 ml_20'>
                                <Image src={asset.gift} className='gift' onClick={this._onTypegift} />
                                <Image src={asset.eval_icon} className='gift ml_10' onClick={this._whiteCommt} />
                                <View className='countBox' onClick={isCollect ? this._offCollect : this._onCollect}>
                                    <Image src={isCollect ? asset.collected : asset.heart_icon} className='heart_icon' />
                                    <View className='count'>
                                        <Text className='sm9_label white_label'>{collectNum > 999 ? '999+' : collectNum}</Text>
                                    </View>
                                </View>
                                <View className='input col_1 mr_10' onClick={this._onPlaying}>
                                    <Text className='white_label default_label'>立即学习</Text>
                                </View>
                            </View>
                        </View>

                }





                <View>
                    {
                        typegift ?
                            <View className='layer'  >
                                <View className='col_1 layertop' onClick={() => this.setState({ typegift: false })}></View>
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
                                                                            <View className='layer_box_item ' key={'gift' + i} onClick={this._onSelectGift.bind(this, gf)}>
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
                </View>

                {
                    publishGift ?
                        <View className='goldbox' >
                            <View className='goldbox_item d_flex fd_r ai_ct'>
                                <Text className='sm_label white_label'>{username} 送出  </Text>
                                <Image src={gifttImg} className="giftimg m l" />
                            </View>
                        </View>
                        : null}

                {
                    evalType ?
                        <View className='layer_eval'>
                            <View className='evalBox'>
                                <Image className='modal_img' mode='widthFix' src={"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/573f0f5c-8e9f-4d9b-b1c2-f3ae79b45326.png"} />
                                <View className='d_flex fd_c pl_30'>
                                    <View className='d_flex fd_r pt_12'>
                                        <Text className='lg_label black_label pr_15'>讲师评分</Text>
                                        <Star onChoose={this._onStar1} fontSize={28} />
                                    </View>
                                    <View className='d_flex fd_r pt_12'>
                                        <Text className='lg_label black_label pr_15'>课程评分</Text>
                                        <Star onChoose={this._onStar2} fontSize={28} />
                                    </View>
                                </View>
                                <View className='d_flex fd_r  mt_30 eval_btns'>
                                    <View className='col_1 d_flex ai_ct jc_ct eval_btns_left pt_12 pb_12' onClick={() => this.setState({ evalType: false })}>
                                        <Text className='lg18_label tip_label'>取消</Text>
                                    </View>
                                    <View className='col_1 d_flex ai_ct jc_ct pt_12 pb_12' onClick={this._evalSubmit}>
                                        <Text className='lg18_label c33_label'>提交</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : null}


                {
                    audioType ?
                        <View className='layeradList'>
                            <View className='adiolayer' onClick={() => this.setState({ audioType: false })}></View>
                            <View className={audioType ? 'adioCons openBG' : 'adioCons closeBG'}>
                                <ScrollView scrollY className='adioCon'>
                                    <View className='adioItems'>
                                        <View className='adioTxt'>
                                            <Text className='lg_label c33_label'>播放列表（{courseDesc.chapter}）</Text>
                                        </View>
                                        {
                                            chapterList.map((chitem, index) => {
                                                return (
                                                    <View key={'chitem' + index} className='item'>
                                                        {
                                                            chitem.child.map((chapter: any, idx) => {
                                                                let on = cchapterId === chapter.chapterId
                                                                return (
                                                                    <View key={'chapter' + idx} className='chapitem' onClick={this._onPlayer.bind(this, index, idx)}>
                                                                        <Text className={on ? 'sred_label default_label' : 'gray_label default_label'}>{chapter.chapterName + ' '}{chapter.content}</Text>
                                                                        <View className='d_flex fd_r ai_ct'>
                                                                            <Text className='sm_label tip_label'>{forTimer(chapter.duration)}</Text>
                                                                            <Text className='sm_label tip_label'>{chitem.chapterName + ' ' + chitem.content}</Text>
                                                                        </View>
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                )
                                            })
                                        }
                                        <View className='audiBtn' onClick={() => this.setState({ audioType: false })}>
                                            <Text className='lg_label c33_label'>关闭</Text>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                        : null}
                {
                    atype == 1 ?
                        <View className='audio_box'>
                            <View className='audio_picture'>
                                <Image src={courseDesc.courseImg} className='picture' />
                            </View>
                            <View className='audio_body'>
                                <View className='audio_title'>
                                    <View className='a_title'>{subNumTxt(cchapterName, 10)}</View>
                                    <View className='a_msg'>
                                        <Text className=''>时长</Text>
                                        <Text className='ml_2'>{forTime(duration)}</Text>
                                        <Text className='ml_8'>主讲人:</Text>
                                        <Text className=''>{courseDesc.teacherName}</Text>
                                    </View>
                                </View>
                                <View className='audio_tab'>
                                    <View className='a_tab'>
                                        <View className='b_tab'>
                                            {
                                                audioStatus ?
                                                    <Image src={asset.cmic_beg} className='picture' onClick={this._onPause} />
                                                    :
                                                    <Image src={asset.cmic_parse} className='picture ml_3' onClick={this._onPlaying} />
                                            }
                                        </View>
                                    </View>
                                    <View className='a_close' onClick={this._onClose}>
                                        <Image src={asset.dete_icon} className='picture' />
                                    </View>
                                </View>
                            </View>
                            <View className='a_Sliber'>
                                <Progress color='#F4623F' activeColor='#F4623F' backgroundColor='#FFFFFF' percent={(current / duration) * 100} className='a_progress width' />
                            </View>

                        </View>
                        :
                        null
                }
                <View>
                    {
                        tip ?
                            <View className='layerss'>
                                <View className='commt_layer pt_12  '>
                                    <View className='d_flex fd_c mb_15 pl_20 pr_20'>
                                        <View className='d_flex ai_ct jc_ct'>
                                            <Text className='lg18_label pt_10 black_label'>准入提示</Text>
                                        </View>

                                    </View>
                                    <View className='pl'>
                                        <Text className='default_label pt_10 c33_label'>{text}</Text>
                                    </View>
                                    {
                                        agree == 1 ?
                                            <View className='checked'>
                                                <Radio checked={ons} onClick={() => {
                                                    if (!ons) { this.setState({ ons: true }) } else {
                                                        this.setState({ ons: false })
                                                    }
                                                }} />
                                                {/* <View className='oks'></View> */}
                                                <View onClick={() => {
                                                    if (!ons) { this.setState({ ons: true }) } else {
                                                        this.setState({ ons: false })
                                                    }
                                                }} >{iftext}</View>
                                            </View>
                                            : null
                                    }

                                    <View className='layer_btns pl_20 pr_20 d_flex jc_sb ai_ct mt_30' >
                                        {
                                            again == 1 ?
                                                <View className='layer_btn d_flex jc_ct ai_ct' onClick={this._onCloses.bind(this)}>
                                                    <Text className='lg_label c33_label'>不再提示</Text>
                                                </View>
                                                :
                                                <View className='layer_btn d_flex jc_ct ai_ct'>
                                                    <Text className='lg_label tip_label'>不再提示</Text>
                                                </View>
                                        }
                                        <View className='layer_btn d_flex d_flex jc_ct ai_ct' onClick={this.onOpen}>
                                            <Text className='lg_label c33_label'>关闭</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            : null}
                </View>


                <Auth ref={'auth'} type={1} success={() => {
                    this._onLoadCallBack()
                }} />
                <GetInt show={show} integral={integral} onOkeys={this.onOkeys}></GetInt>
            </View>
        )
    }
}


export default audioDesc as ComponentClass