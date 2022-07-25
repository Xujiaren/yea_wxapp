import { ComponentClass } from 'react'
import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text, Video, ScrollView, Image, Swiper, SwiperItem, CoverView, Button, Radio } from '@tarojs/components'

import { connect } from '@tarojs/redux'

import { usersType } from '../../constants/usersType'
import { homeType } from '../../constants/homeType'
import Auth from '../../components/Auth'
import Star from '../../components/Star'
import Eval from '../../components/Eval'
import Comt from '../../components/General/Comt'
import Poster from '../../components/Canvas/Poster'

// import CoursePaper from '../../components/CoursePaper'
import Tabs from '../../components/Tabs'
import Menu from '../../components/Menu';
import Coursescore from '../../components/Coursescore'
import GrapTmp from '../../pages/index/grapTmp'
import asset from '../../config/asset';
import menus from '../../config/menu';

import '../../config/theme.css';
import './courseDesc.less'
import GetInt from '../../components/GetInt'


import { logHistory, forTimes, percent2percent25 } from '../../utils/common';

import {
    getCourseDesc,
    getCourseCommt,
    getConfigGift,
} from '../../actions/home'


import {
    getExanPaper,
} from '../../actions/user'

import inter from '../../config/inter'
import api from '../../services/api'

type PageStateProps = {
    home: homeType,
    user: usersType,
    goodsInfo: Array<{}>,
    getCourseCommt: Array<{}>,
    getConfigGift: Array<{}>,
    getExanPaper: Array<{}>
}

type PageDispatchProps = {
    getCourseDesc: (object) => any,
    getCourseCommt: (object) => any,
    getConfigGift: (object) => any,
    getExanPaper: (object) => any
}

type PageOwnProps = {}

type PageState = {
    course_id: number,
    status: number,
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
        courseId: number,
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
    courseName: string,
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
        isLeaderRecomm: number,
    },
    score: number,
    content: string,
    collectNum: number,
    teacherId: number,
    tteacherId: number,
    chapter: number,
    learn: number,
    isSeries: number,
    index: number,
    cindex: number,
    username: string,
    isLogin: boolean,
    userintegral: number,
    userMobile: number,
    layerMobile: boolean,
    courseImg: string,
    load: boolean,
    networkType: boolean,
    courseRecord: Array<{
        mediaId: string,
        duration: number
    }>,
    rds_duration: number,
    now_time: any,
    end_time: any,
    rds_initTime: number,
    hit: number,
    play: boolean,
    userId: number,
    UA: string,
    canPlay: boolean,
    evalType: boolean,
    techScore: number,
    courseScore: number,
    levelId: number,
    c_integral: number,

    canBuy: boolean,
    payType: number,
    ltype: number,
    paperId: number,
    isback: string,
    showModal: boolean,

    loginMobile: number,

    beginWjUrl: string,
    endKsUrl: string,
    beginKsUrl: string,
    endWjUrl: string,
    ts: number,

    finishWatch: boolean,

    goodsList: Array<any>,

    beginUrl: string, // 课前外链
    endUrl: string,  // 课后外链
    beginUrlType: number, // 0  无 1 问卷  2 试卷  课前外链类型
    endUrlType: number, // 0  无 1 问卷  2 试卷  课后外链类型

    isShow: boolean, // 海报 分享
    ctypes: number,
    mainVideo: string,
    prePaperList: Array<any>,
    endPaperList: Array<any>,
    summary: string,
    thisTeacher: boolean,
    freeChapter: number,
    chapt: number,
    fromuser: string,
    free: boolean,
    again: number,
    text: any,
    ons: boolean,
    tip: boolean,
    iftext: string,
    agree: number,
    tipp: number,
    show: boolean,
    integral: number,
    leave: number,
    lltype: number,
    initialTime: number,
    ccpid:number,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface courseDesc {
    props: IProps;
}


@connect(({ home, user }) => ({
    home: home,
    user: user
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
    getExanPaper(object) {
        dispatch(getExanPaper(object))
    }
}))

class courseDesc extends Component<PageDispatchProps & PageStateProps, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '课程详情',
        enablePullDownRefresh: false
    }
    videoContext: any;
    ts: number;
    pop_count: number = 0;

    constructor() {
        super(...arguments);

        this.ts = 0;
        this.videoContext = null;
        this.state = {
            UA: '',
            load: false,
            chapter: 0,
            chapterList: [],
            course_id: 0,
            status: 0,
            comment: [],
            topComms: [],
            commend_total: 0,
            typegift: false,
            gfIntegral: 0,
            gfId: 0,
            mediaId: '0',
            videoCover: '',
            videoDuration: 0,
            videom38u: '',
            play: false,

            chapterId: 0,
            cchapterId: 0,

            index: 0,
            cindex: 0,
            score: 0,
            courseName: '',
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
                isLeaderRecomm: 0, // 1 领导
            },
            content: '',
            collectNum: 0,
            teacherId: 0,
            tteacherId: 0,
            learn: 0,
            isSeries: 0,
            username: '',
            isLogin: false,
            userintegral: 0,
            userMobile: 0,
            layerMobile: false,
            courseImg: '',
            networkType: false,
            rds_duration: 0,
            now_time: '',
            end_time: '',
            rds_initTime: 0,
            hit: 0,
            userId: 0,
            canPlay: false,
            evalType: false,
            techScore: 0,
            courseScore: 0,
            levelId: 0,
            c_integral: 0,


            canBuy: false, // false  已购买 true 未购买
            payType: 0,  // 

            ltype: 0,//试卷前或者后
            paperId: 0,
            isback: '0',
            showModal: false,

            loginMobile: 0, // 0 显示  1 不显示

            ts: 0,

            finishWatch: false, // false 未看完 true 看完 可以考试

            goodsList: [], //课程带货

            beginUrl: '', // 课前外链
            endUrl: '',  // 课后外链
            beginUrlType: 0, // 0  无 1 问卷  2 试卷  课前外链类型
            endUrlType: 0, // 0  无 1 问卷  2 试卷  课后外链类型
            isShow: false,
            ctypes: 0,
            mainVideo: '',
            prePaperList: [],
            endPaperList: [],
            summary: '',
            thisTeacher: false,
            freeChapter: 0,
            chapt: 0,
            fromuser: '0',
            free: false,
            again: 0,
            text: [],
            tip: false,
            iftext: '',
            agree: 0,
            ons: false,
            tipp: 0,
            show: false,
            integral: 0,
            leave: 0,
            lltype: 0,
            initialTime: 0,
            ccpid:0,
        }

        this._onPlayer = this._onPlayer.bind(this);
        this.onShareAppMessage = this.onShareAppMessage.bind(this);
        this._whiteCommt = this._whiteCommt.bind(this);
        this._onLoadCallBack = this._onLoadCallBack.bind(this);
        this._onCourse = this._onCourse.bind(this);
        this.onEnded = this.onEnded.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onPause = this.onPause.bind(this);
        this._getCourseRecord = this._getCourseRecord.bind(this);
        this._coverplay = this._coverplay.bind(this);
        this._onStar2 = this._onStar2.bind(this);
        this._onStar1 = this._onStar1.bind(this);
        this._parse = this._parse.bind(this);
        this._onPreCourse = this._onPreCourse.bind(this);
        this._onNextCourse = this._onNextCourse.bind(this);

        this._juageExam = this._juageExam.bind(this);
        this._juageToast = this._juageToast.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { home, user } = nextProps
        const { courseDesc, courseCommt } = home
        let chapterList = []
        if (courseDesc) {
            chapterList = courseDesc.chapterList
        }
        const { isback, levelId } = this.$router.params

        if (home !== this.props.home && courseDesc) {
            const { endPaperList, prePaperList } = courseDesc
            let paperId = 0
            let ltype = 0
            if (prePaperList || endPaperList) {
                if (prePaperList.length > 0) {
                    prePaperList.map(ele => { paperId = ele['paperId'] })
                }
                if (endPaperList.length > 0) {
                    ltype = 1
                    endPaperList.map(ele => { paperId = ele['paperId'] })
                }
            }

            if (courseDesc.canShare == 0) {
                Taro.hideShareMenu()
            } else {
                wx.showShareMenu({

                    withShareTicket: true,

                    menus: ['shareAppMessage', 'shareTimeline']
                })
            }
            Taro.setNavigationBarTitle({
                title: courseDesc.courseName === undefined ? '课程详情' : courseDesc.courseName,
            })
            this.setState({
                paperId,
                ltype,
                load: true,
                comment: courseCommt.items,
                commend_total: courseCommt.total,
                chapterList: chapterList,
                courseName: courseDesc.courseName,
                isCollect: courseDesc.collect,
                isFollow: courseDesc.teacher.isFollow,
                teacher: courseDesc.teacher,
                content: courseDesc.content,
                collectNum: courseDesc.collectNum,
                teacherId: courseDesc.teacherId,
                chapter: courseDesc.chapter,
                learn: courseDesc.learn,
                isSeries: courseDesc.isSeries,
                courseImg: courseDesc.courseImg,
                hit: courseDesc.hit,
                canPlay: courseDesc.canPlay,
                score: courseDesc.score,
                c_integral: courseDesc.integral,
                canBuy: courseDesc.canBuy,
                payType: courseDesc.payType,
                finishWatch: courseDesc.finishWatch,

                beginUrl: courseDesc.beginUrl,
                endUrl: courseDesc.endUrl,
                beginUrlType: courseDesc.beginUrlType,
                endUrlType: courseDesc.endUrlType,

                goodsList: courseDesc.goodsList,
                ctypes: courseDesc.ctype,
                mainVideo: courseDesc.mediaId,
                prePaperList: courseDesc.prePaperList,
                endPaperList: courseDesc.endPaperList,
                summary: courseDesc.summary,
                thisTeacher: courseDesc.thisTeacher,
                freeChapter: courseDesc.freeChapter,
            })

            if (chapterList.length > 0) {
                const child = chapterList[0].child || [];
                if (child.length > 0) {
                    let mediaId = child[0].mediaId
                    let chapterId = chapterList[0].chapterId
                    let cchapterId = child[0].chapterId
                    let cduration = child[0].duration
                    let plant = parseInt(courseDesc.plant)
                    let initialTime = 0
                    let lst = Taro.getStorageSync('v' + courseDesc.courseId.toString())
                    if (lst.initialTime) {
                        mediaId = lst.mediaId
                        chapterId = lst.chapter_id
                        cchapterId = lst.cchapter_id
                        cduration = lst.end_time,
                        initialTime = lst.initialTime
                    }
                    this.setState({
                        mediaId: mediaId,
                        chapterId: chapterId,
                        cchapterId: cchapterId,
                        end_time: cduration,
                        initialTime: initialTime,
                        ccpid:cchapterId,
                    }, () => {
                        if (paperId !== 0 && ltype == 0 && isback !== '1' && !levelId && plant !== 2&&courseDesc.endUrlType>0) {
                            //课程推试卷
                            this.setState({ ltype, paperId }, () => { this.getVideo() })
                        } else {
                            if (plant !== 2) {
                                // this.getVideo();
                                this._judgVideo();
                            }
                        }
                    })
                }
            }
        }

    }

    componentWillMount() {
        const that = this
        const { course_id, courseName, fromuser, scene, levelId, isback, ltype } = that.$router.params;

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
            course_id: parseInt(course_id),
            courseName: courseName || '',
            isback: isback || '0'
        }, () => {
            that.getCourseDesc();
            that.getCourseCommt();
            that.getConfigGift();
            that._getAllComment()
            that.getConfigs()
            this.videoContext = Taro.createVideoContext('video')
            Taro.getSystemInfo({
                success: function (res) {
                    that.setState({ UA: res.platform })
                }
            })
        })
        if (ltype && ltype == '1') {
            this.setState({
                lltype: 1
            })
        }
        Taro.setNavigationBarTitle({
            title: courseName === undefined ? '课程详情' : courseName,
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

    }

    componentDidMount() {
        var that = this;
        const { course_id } = that.$router.params
        that.getUser();
        api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    api.get('/user/learn/lock', {
                        action: 0
                    }).then(res => {
                        if (res.data.message) {
                            this.setState({
                                leave: 1
                            })
                            Taro.showModal({
                                title: '提示',
                                content: res.data.message,
                                success: function (res) {
                                    if (res.confirm) {
                                        Taro.navigateTo({ url: menus.searchList + '?ctype=0&btype=0' + '&keyword=' })
                                    } else if (res.cancel) {
                                        Taro.navigateTo({ url: menus.searchList + '?ctype=0&btype=0' + '&keyword=' })
                                    }
                                }
                            })
                            setTimeout(() => {
                                Taro.navigateTo({ url: menus.searchList + '?ctype=0&btype=0' + '&keyword=' })
                            }, 3000);
                        }
                    })
                }
            })
        api.get(inter.CourseDesc + course_id)
            .then((res) => {
                if (res.data.status) {
                    let courseDesc = res.data.data
                    let { plant } = courseDesc

                    if (plant == 2) {
                        that.setState({ showModal: true })
                    }
                    that.setState({
                        canBuy: courseDesc.canBuy
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
                                        Taro.navigateTo({ url: menus.searchList + '?ctype=0&btype=0' + '&keyword=' })
                                    } else if (res.cancel) {
                                        Taro.navigateTo({ url: menus.searchList + '?ctype=0&btype=0' + '&keyword=' })
                                    }
                                }
                            })
                            setTimeout(() => {
                                Taro.navigateTo({ url: menus.searchList + '?ctype=0&btype=0' + '&keyword=' })
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
                                        Taro.navigateTo({ url: menus.searchList + '?ctype=0&btype=0' + '&keyword=' })
                                    } else if (res.cancel) {
                                        Taro.navigateTo({ url: menus.searchList + '?ctype=0&btype=0' + '&keyword=' })
                                    }
                                }
                            })
                            setTimeout(() => {
                                Taro.navigateTo({ url: menus.searchList + '?ctype=0&btype=0' + '&keyword=' })
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

    componentDidShow() {
        var that = this
        const token = Taro.getStorageSync('token')


        if (token != '') {
            api.get(inter.User)
                .then(res => {
                    if (res.data.status) {
                        let userData = res.data.data
                        this.setState({
                            userintegral: userData.integral,
                            userId: userData.userId,
                            userMobile: userData.mobile,
                            tteacherId: userData.teacher.teacherId,
                        })
                    }
                })
        }

    }
    componentWillUnmount() {
        const { leave } = this.state
        if (leave === 0) {
            api.get('/user/learn/lock', {
                action: 1
            }).then(res => { })
        }
    }
    componentDidHide() {
        if (this.state.leave === 0) {
            api.get('/user/learn/lock', {
                action: 1
            }).then(res => { })
        }
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
                    text: val.text,
                    iftext: val.agreeText
                })
            }
        })
    }
    _onClose = () => {
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
                Taro.setStorageSync('tipps', 1)
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
            Taro.setStorageSync('tipps', 1)
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
    _onPanelClose = () => {
        Taro.navigateBack()
    }
    //onBack
    onBack = () => {

        const { levelId } = this.state

        if (levelId)
            api.get(inter.LevelStatus, {
                levelId: levelId
            })
    }
    // 视频记录
    _getCourseRecord(rd_course: any) {

        const { play } = this.state;
        if (!play) return;

        let record = Taro.getStorageSync("courseRd");

        if (record == '') {
            record = {};
        }

        const rd_mediaId = rd_course.mediaId;


        record[rd_mediaId] = parseInt(rd_course.duration);

        Taro.setStorageSync('courseRd', record)
    }
    //前往习题
    toPaperPage = () => {
        const { paperId, course_id, courseName,finishWatch, userId, endUrl, endUrlType, prePaperList,endPaperList } = this.state
        const that = this
        if (this.pop_count < 1) {
            this.pop_count++
            Taro.showModal({
                title: '提示',
                content: '是否前往练习或问卷页面？',
                showCancel: true,
                success: function (res) {
                    if (res.confirm) {
                        // const url = `${menus.coursePaper}?paper_id=${paperId}&course_id=${course_id}&courseName=${courseName}`
                        if(endUrlType==1){
                            if (endUrl) {
                                api.post(inter.userHistory, {
                                    ctype: 22,
                                    etype: 106,
                                    cctype: 1,
                                    content_id: course_id
                                }).then(res => { })
                                if (endUrl.slice(0, 4) != 'http') {
                                    var end = 'pages/wjxqList/wjxqList?activityId=' + endUrl
                                    if (userId > 0) {
                
                
                                        if (finishWatch) {
                
                                            Taro.navigateToMiniProgram({
                                                appId: 'wxd947200f82267e58',
                                                path: end,
                                                success(res) {
                                                    console.info(res);
                                                }
                                            })
                
                                        }
                
                                    } else {
                                        this.refs.auth.doLogin();
                                    }
                                } else {
                                    if (userId > 0) {
                                        Taro.navigateTo({
                                            url: menus.annualBill + '?status=2' + '&link=' + encodeURIComponent(endUrl)
                                        })
                                    } else {
                                        this.refs.auth.doLogin();
                                    }
                
                                }
                            } else {
                                api.post(inter.userHistory, {
                                    ctype: 22,
                                    etype: 106,
                                    cctype: 1,
                                    content_id: course_id
                                }).then(res => { })
                                api.get('/course/' + course_id + '/paper',{
                                    stype:4
                                }).then(res => {
                                        console.log(res)
                                        let list = res.data.data
                                        if (list.length > 0) {
                                            Taro.navigateTo({ url: menus.questSurvey + '?courseId=' + course_id + '&activityId=0'+'&stype=4' })
                                        } else {
                                            if (endUrl.slice(0, 4) != 'http') {
                                                var end = 'pages/wjxqList/wjxqList?activityId=' + endUrl
                                                if (userId > 0) {
                
                
                                                    if (finishWatch) {
                
                                                        Taro.navigateToMiniProgram({
                                                            appId: 'wxd947200f82267e58',
                                                            path: end,
                                                            success(res) {
                                                                console.info(res);
                                                            }
                                                        })
                
                                                    }
                
                                                } else {
                                                    this.refs.auth.doLogin();
                                                }
                                            } else {
                                                if (userId > 0) {
                                                    Taro.navigateTo({
                                                        url: menus.annualBill + '?status=2' + '&link=' + encodeURIComponent(endUrl)
                                                    })
                                                } else {
                                                    this.refs.auth.doLogin();
                                                }
                
                                            }
                                        }
                                    })
                            }
                        }else{
                            if (endPaperList.length==0) {
                                api.post(inter.userHistory, {
                                    ctype: 22,
                                    etype: 106,
                                    cctype: 1,
                                    content_id: course_id
                                }).then(res => { })
                                if (endUrl.slice(0, 4) != 'http') {
                                    var end = 'pages/wjxqList/wjxqList?activityId=' + endUrl
                                    if (userId > 0) {
                
                
                                        if (finishWatch) {
                
                                            Taro.navigateToMiniProgram({
                                                appId: 'wxd947200f82267e58',
                                                path: end,
                                                success(res) {
                                                    console.info(res);
                                                }
                                            })
                
                                        }
                
                                    } else {
                                        this.refs.auth.doLogin();
                                    }
                                } else {
                                    if (userId > 0) {
                                        Taro.navigateTo({
                                            url: menus.annualBill + '?status=2' + '&link=' + encodeURIComponent(endUrl)
                                        })
                                    } else {
                                        this.refs.auth.doLogin();
                                    }
                
                                }
                            }else{
                                if(endPaperList[0].isSubmit==1){
                                    Taro.showToast({
                                        title: '该试卷已填写',
                                        icon: 'none',
                                        duration: 2000
                                    });
                                    return;
                                }
                                api.post(inter.userHistory, {
                                    ctype: 22,
                                    etype: 106,
                                    cctype: 1,
                                    content_id: endPaperList[0].paperId
                                }).then(res => { })
                                api.get(inter.examPaper + endPaperList[0].paperId, {
                                    lessDuration: 3600
                                }).then(res => {
                                    console.log(res)
                                    let val = res.data.data
                                    Taro.navigateTo({
                                        url: menus.doingExam + '?paper_id=' + val.paperId + '&e_duration=' + val.duration + '&paperName=' + percent2percent25(val.paperName) + '&lessDuration=' + val.lessDuration + '&ttyp=1'
                                    })
                                })
                            }
                        }
                
                    } else if (res.cancel) {
                        that.getVideo()
                    }
                }
            })
        }

    }

    //获取习题
    getPaperById = (paper_id) => {
        this.props.getExanPaper({
            paper_id,
            levelId: 0
        })
    }
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
                        userMobile: userData.mobile,
                    })
                }

            })
    }



    _judgVideo() {
        var that = this;
        const { userMobile, userId, loginMobile } = that.state


        that.getVideo();
        if (userId > 0) {
            if (userMobile > 0) {
            } else {
                if (loginMobile === 0) {
                    that.setState({
                        layerMobile: true
                    })
                }
            }
        }
    }

    //
    getVideo() {
        var that = this
        const { mediaId, end_time, c_integral, canBuy, free, mainVideo, ctypes, payType, chapterList, cchapterId, chapterId, thisTeacher, freeChapter, chapt } = that.state

        let record = Taro.getStorageSync("courseRd");
        if (record == '') record = {};

        let rds_initTime = record[mediaId] || 0;
        if (end_time - rds_initTime < 10) {
            rds_initTime = 0;
        }

        // if (ctypes == 48) {
        //     api.post(inter.CourseVideo, {
        //         media_id: mainVideo
        //     }).then((res) => {
        //         if (res.data.status) {
        //             const videodesc = res.data.data

        //             that.setState({
        //                 videoCover: videodesc.cover,
        //                 videoDuration: videodesc.duration,
        //                 rds_initTime: rds_initTime,
        //                 // videom38u:videodesc.m38u,
        //             })

        //             if (!(c_integral > 0 && canBuy)) {
        //                 that.setState({
        //                     videom38u: videodesc.m38u,
        //                 })
        //             }


        //             Taro.showToast({
        //                 title: '加载中',
        //                 icon: 'loading',
        //                 duration: 2000
        //             })
        //         }
        //     })
        // } else {
        api.post(inter.CourseVideo, {
            media_id: mediaId
        }).then((res) => {

            if (res.data.status) {
                const videodesc = res.data.data

                that.setState({
                    videoCover: videodesc.cover,
                    videoDuration: videodesc.duration,
                    rds_initTime: rds_initTime,
                    // videom38u:videodesc.m38u,
                })
                if (!(payType > 0 && canBuy)) {
                    that.setState({
                        videom38u: videodesc.m38u,
                    })
                }
                if (payType > 0 && canBuy && freeChapter > 0) {
                    that.setState({
                        videom38u: videodesc.m38u,
                    })
                }
                if (thisTeacher == true && payType > 0 && canBuy) {
                    that.setState({
                        videom38u: videodesc.m38u,
                    })
                }
                if (free == true && payType > 0 && canBuy) {
                    that.setState({
                        videom38u: videodesc.m38u,
                    })
                }

                Taro.showToast({
                    title: '加载中',
                    icon: 'loading',
                    duration: 2000
                })
            }
        })
        // }
    }

    //记录学习人数

    onTimeUpdate = (e) => {
        this.ts++;
        var that = this

        const { course_id, chapterId, cchapterId, networkType, mediaId, courseName, levelId, finishWatch,index,cindex } = that.state

        var nowTime = parseInt(e.detail.currentTime).toFixed(0);

        that.setState({
            now_time: nowTime,
            ts: this.ts
        })

        function extend(target, source) {
            for (var obj in source) {
                target[obj] = source[obj];
            } return target;
        }

        //判断网络情况
        if (!networkType) {
            Taro.getNetworkType({
                success: (res) => {
                    var networkType = res.networkType

                    if (networkType !== 'wifi') {
                        Taro.showToast({
                            title: '流量观看中',
                            icon: 'none',
                            duration: 2000
                        })
                        that.setState({
                            networkType: true
                        })
                    }
                }
            })
        }

        if (this.ts % 12 == 0) {

            const rd_mediaId = { mediaId: mediaId }
            const rd_duration = { duration: parseInt(e.detail.currentTime).toFixed(0) }
            const rd_course = extend(rd_mediaId, rd_duration);
            this._getCourseRecord(rd_course)

            let learnTime = (this.ts / 4).toFixed(0);

            api.post(inter.LearnCourse + course_id, {
                course_id: course_id,
                course_name: courseName,
                chapter_id: chapterId,
                cchapter_id: cchapterId,
                duration: learnTime,
                levelId: levelId,
            }).then((res) => {
                // console.log(res)
            })
            Taro.setStorageSync('v' + course_id.toString(), {
                initialTime: e.detail.currentTime,
                chapter_id: chapterId,
                cchapter_id: cchapterId,
                mediaId: mediaId,
                end_time: this.state.end_time,
                index:index,
                cindex:cindex
            })
        }

        if (this.ts % 12 == 0) {
            if (!finishWatch) {
                that._juageExam();
            }
        }
    }

    _onPlayer(index, cindex) {
        var that = this
        const { chapterList, cchapterId, courseRecord, canBuy, c_integral, payType, chapt, freeChapter, thisTeacher, course_id } = that.state;

        let chapter = chapterList[index];
        let cchapter = chapter.child[cindex];

        this.ts = 0;
        if (!(payType > 0 && canBuy)) {
            that.setState({
                index: index,
                cindex: cindex,
                mediaId: cchapter.mediaId,
                chapterId: cchapter.parentId,
                cchapterId: cchapter.chapterId,
                end_time: cchapter.duration,
                courseRecord: courseRecord,
                free: false
            }, () => {
                that.getVideo();
            })
        } else {
            if (freeChapter > 0 && index == 0 && cindex < freeChapter) {
                that.setState({
                    index: index,
                    cindex: cindex,
                    mediaId: cchapter.mediaId,
                    chapterId: cchapter.parentId,
                    cchapterId: cchapter.chapterId,
                    end_time: cchapter.duration,
                    courseRecord: courseRecord,
                    free: false
                }, () => {
                    that.getVideo();
                })
            } else if (cchapter.isFree == 1) {
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
                    end_time: cchapter.duration,
                    courseRecord: courseRecord,
                    free: true
                }, () => {
                    that.getVideo();
                })
            } else if (thisTeacher == true) {
                that.setState({
                    index: index,
                    cindex: cindex,
                    mediaId: cchapter.mediaId,
                    chapterId: cchapter.parentId,
                    cchapterId: cchapter.chapterId,
                    end_time: cchapter.duration,
                    courseRecord: courseRecord,
                    free: false
                }, () => {
                    that.getVideo();
                })
            } else {
                Taro.showToast({
                    title: '购买后才能观看',
                    icon: 'none',
                    duration: 1000
                })
            }
        }

    }



    onEnded(e) {
        var that = this
        const { index, cindex, chapterList, levelId, paperId, ltype,endUrlType } = this.state;
        const { isback } = this.$router.params

        let _index = index;
        let _cindex = cindex;

        if (chapterList[index].child.length == (cindex + 1)) {

            if ((_index + 1) == chapterList.length) {
                _index = 0;
                if (levelId > 0) {
                    api.get(inter.LevelStatus, {
                        levelId: levelId
                    }).then((res) => {

                        if (res.data.status) {
                            let levelData = res.data.data
                            if (levelData.levelStatus === 0) {
                                if (levelData.type === 'Paper') {
                                    Taro.redirectTo({
                                        url: menus.studyAnswer + '?paper_id=' + levelData.nextId + '&levelId=' + levelId
                                    })

                                } else {
                                    Taro.showToast({
                                        title: '观看完成',
                                        icon: 'none',
                                        duration: 1000
                                    })
                                    setTimeout(() => {
                                        Taro.navigateBack({ complete: that.onBack })
                                    }, 1000)
                                }
                            } else {
                                Taro.showToast({
                                    title: '观看完成',
                                    icon: 'none',
                                    duration: 1000
                                })
                                setTimeout(() => {
                                    Taro.navigateBack({ complete: that.onBack })
                                }, 1000)
                            }
                        }
                    })
                } else {
                    if (isback !== '1'&&endUrlType!=0) {
                        setTimeout(() => {
                            this.toPaperPage()
                        }, 1000);
                    }
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

    onPlay(e) {
        this.setState({
            play: true
        })
    }

    onPause(e) {
        this.setState({
            play: false
        })
    }
    onShareTimeline() {
        const { home } = this.props
        const { courseDesc } = home
        const { courseName, courseImg } = courseDesc
        const { userId, course_id } = this.state
        return {
            title: courseName,
            query: '/pages/index/courseDesc?course_id=' + course_id + '&courseName=' + percent2percent25(`${courseName}`) + '&fromuser=' + userId,
            imageUrl: courseImg,
        }
    }
    //分享课程
    onShareAppMessage = (res) => {
        const { home } = this.props
        const { courseDesc } = home
        const { courseName, courseImg } = courseDesc
        const { userId, course_id } = this.state
        var that = this
        api.post(inter.userLog, {
            log_type: 1,
            type: 1,
            device_id: 0,
            intro: '分享点播课程',
            content_id: courseDesc.courseId,
            param: JSON.stringify({ name: courseName, cctype: 2, ttype: 0 }),
            from: 0,
        }).then((res) => {
            console.log('ee')
        })
        api.post(inter.shareCourses + course_id)
            .then(res => {
            })
        if (res.from === 'button') {
            // 来自页面内转发按钮
        }
        return {
            title: courseName,
            path: menus.courseDesc + '?course_id=' + this.state.course_id + '&fromuser=' + userId,
            imageUrl: courseImg + '?x-oss-process=image/resize,w_500,h_380,m_pad',
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

    // 得到课程详情
    getCourseDesc() {
        var that = this
        const { course_id } = that.state
        logHistory(course_id);
        this.props.getCourseDesc({
            course_id
        })
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

    // 选择
    _onSelect = (index) => {
        var that = this

        that.setState({
            status: index
        })

    }

    _onCourse(teacher) {
        Taro.navigateTo({
            url: menus.teachZone + '?teacher_id=' + `${teacher.teacherId}`
        })
    }

    //关注老师
    _offFollow(isFollow) {
        const that = this
        const { teacher } = that.state
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
    }


    //取消关注
    _onFollow(isFollow) {
        const that = this
        const { teacher } = that.state

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
    }

    // 是否打赏礼物
    _onTypegift() {
        var that = this
        const { userId } = that.state
        let vas = Taro.getStorageSync('tipps')
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
        const { course_id, userId, ctypes } = that.state
        if (userId > 0) {
            Taro.navigateTo({
                url: menus.writeCommt + '?course_id=' + `${course_id}` + '&whitetip=' + Taro.getStorageSync('whiteTip') + '&type=0&isStar=0' + '&ctype=' + ctypes
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

    _onLoadCallBack() {
        var that = this
        const { course_id } = that.state
        this.props.getCourseDesc({
            course_id
        })
        api.get(inter.User)
            .then(res => {
                if (res.data.status) {
                    let userData = res.data.data
                    that.setState({
                        userintegral: userData.integral,
                        userId: userData.userId,
                        userMobile: userData.mobile
                    })
                }
            })
        this.setState({
            loginMobile: 1
        })


    }

    _coverplay() {
        var that = this;
        const { userId, canPlay, userMobile } = that.state;


        if (userId > 0) {
            if (userMobile > 0) {
                if (canPlay) {
                    that.setState({
                        play: true
                    })
                } else {
                    Taro.showToast({
                        title: '该课程仅对特定用户可见，\n请认证',
                        icon: 'none'
                    })
                }
            } else {

                that.setState({
                    layerMobile: true,
                })
            }


        } else {
            that.refs.auth.doLogin();
        }
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
                api.get(inter.CourseDesc + course_id)
                    .then((res) => {
                        if (res.data.status) {
                            let c_desc = res.data.data
                            that.setState({
                                score: c_desc.score
                            })
                        }
                    })
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

    _coursePf() {
        var that = this;
        const { userId } = that.state;
        if (userId > 0) {
            that.setState({
                evalType: true
            })
        } else {
            this.refs.auth.doLogin();
        }
    }

    // 课程购买
    _buyCourse() {
        var that = this
        const { home } = this.props
        const { courseDesc } = home

        const { userId, fromuser } = that.state

        if (userId > 0) {
            this.videoContext.stop()

            Taro.navigateTo({
                url: menus.buyCourse + '?courseId=' + courseDesc.courseId + '&coursename=' + percent2percent25(courseDesc.courseName) + '&courseImg=' + courseDesc.courseImg +
                    '&summary=' + percent2percent25(courseDesc.summary) + '&courseintegral=' + courseDesc.integral + '&fromuser=' + fromuser + '&teacherName=' + courseDesc.teacher.teacherName + '&honer=' +
                    courseDesc.teacher.honor + '&payType=' + courseDesc.payType + '&courseType=0' + '&courseCash=' + courseDesc.courseCash
            })

        } else {
            this.refs.auth.doLogin();
        }


    }
    _buyCourses = () => {
        var that = this
        const { home } = this.props
        const { courseDesc } = home

        const { userId, fromuser } = that.state

        if (userId > 0) {
            this.videoContext.stop()

            Taro.navigateTo({
                url: menus.buyCourse + '?courseId=' + courseDesc.courseId + '&coursename=' + percent2percent25(courseDesc.courseName) + '&courseImg=' + courseDesc.courseImg +
                    '&summary=' + percent2percent25(courseDesc.summary) + '&courseintegral=' + courseDesc.integral + '&fromuser=' + fromuser + '&teacherName=' + courseDesc.teacher.teacherName + '&honer=' +
                    courseDesc.teacher.honor + '&payType=' + courseDesc.payType + '&courseType=0' + '&courseCash=' + courseDesc.courseCash
            })

        } else {
            this.refs.auth.doLogin();
        }
    }

    getPhoneNumber = (e) => {
        var that = this;
        if (e.detail.errMsg == 'getPhoneNumber:ok') {

            let data = JSON.stringify({
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData,
            })


            api.post(inter.OuthMobile, {
                data: data
            }).then(res => {
                if (res.data.status) {

                    Taro.showToast({
                        title: '手机号绑定成功！',
                        icon: 'none',
                        duration: 1000
                    })

                    that.getUser();

                    that.setState({
                        layerMobile: false
                    })
                }
            })

        } else {
            that.setState({
                layerMobile: false
            })
        }
    }


    // 课前
    _onPreCourse() {
        // beginUrlType 1 问卷  2 考试 
        var that = this;
        const { userId, beginUrl, beginUrlType, prePaperList, course_id } = that.state;
        if(beginUrlType==1){
            if (beginUrl) {
                api.post(inter.userHistory, {
                    ctype: 22,
                    etype: 106,
                    cctype: 1,
                    content_id: course_id
                }).then(res => { })
                if (beginUrl.slice(0, 4) != 'http') {
                    var begin = 'pages/wjxqList/wjxqList?activityId=' + beginUrl
                    if (userId > 0) {
                        Taro.navigateToMiniProgram({
                            appId: 'wxd947200f82267e58',
                            path: begin,
                            success(res) {
                                console.info(res);
                            }
                        });
                    } else {
                        this.refs.auth.doLogin();
                    }
                } else {
                    if (userId > 0) {
                        Taro.navigateTo({
                            url: menus.annualBill + '?status=2' + '&link=' + encodeURIComponent(beginUrl)
                        })
                    } else {
                        this.refs.auth.doLogin();
                    }
                }
            } else {
                api.post(inter.userHistory, {
                    ctype: 22,
                    etype: 106,
                    cctype: 1,
                    content_id: course_id
                }).then(res => { })
                api.get('/course/' + course_id + '/paper',{
                    stype:3
                }).then(res => {
                        console.log(res)
                        let list = res.data.data
                        if (list.length > 0) {
                            Taro.navigateTo({ url: menus.questSurvey + '?courseId=' + course_id + '&activityId=0'+'&stype=3' })
                        } else {
                            if (beginUrl.slice(0, 4) != 'http') {
                                var begin = 'pages/wjxqList/wjxqList?activityId=' + beginUrl
                                if (userId > 0) {
                                    Taro.navigateToMiniProgram({
                                        appId: 'wxd947200f82267e58',
                                        path: begin,
                                        success(res) {
                                            console.info(res);
                                        }
                                    });
                                } else {
                                    this.refs.auth.doLogin();
                                }
                            } else {
                                if (userId > 0) {
                                    Taro.navigateTo({
                                        url: menus.annualBill + '?status=2' + '&link=' + encodeURIComponent(beginUrl)
                                    })
                                } else {
                                    this.refs.auth.doLogin();
                                }
                            }
                        }
                    })
            }
        }
        if(beginUrlType==2){
            if (prePaperList.length==0) {
                api.post(inter.userHistory, {
                    ctype: 22,
                    etype: 106,
                    cctype: 1,
                    content_id: course_id
                }).then(res => { })
                if (beginUrl.slice(0, 4) != 'http') {
                    var begin = 'pages/wjxqList/wjxqList?activityId=' + beginUrl
                    if (userId > 0) {
                        Taro.navigateToMiniProgram({
                            appId: 'wxd947200f82267e58',
                            path: begin,
                            success(res) {
                                console.info(res);
                            }
                        });
                    } else {
                        this.refs.auth.doLogin();
                    }
                } else {
                    if (userId > 0) {
                        Taro.navigateTo({
                            url: menus.annualBill + '?status=2' + '&link=' + encodeURIComponent(beginUrl)
                        })
                    } else {
                        this.refs.auth.doLogin();
                    }
                }
            }else{
                if(prePaperList[0].isSubmit==1){
                    Taro.showToast({
                        title: '该试卷已填写',
                        icon: 'none',
                        duration: 2000
                    });
                    return;
                }
                api.post(inter.userHistory, {
                    ctype: 27,
                    etype: 106,
                    cctype: 1,
                    content_id: prePaperList[0].paperId
                }).then(res => { })
                api.get(inter.examPaper + prePaperList[0].paperId, {
                    lessDuration: 3600
                }).then(res => {
                    console.log(res)
                    let val = res.data.data
                    Taro.navigateTo({
                        url: menus.doingExam + '?paper_id=' + val.paperId + '&e_duration=3600'  + '&paperName=' + percent2percent25(val.paperName) + '&lessDuration=' + val.lessDuration + '&ttyp=1'
                    })
                }) 
            }
        }
       
        
    }

    // 课后
    _onNextCourse() {
        // endUrlType 1 问卷  2 考试 
        var that = this;
        const { finishWatch, userId, endUrl, endUrlType, prePaperList, course_id, endPaperList } = that.state;
        if(endUrlType==1){
            if (endUrl) {
                api.post(inter.userHistory, {
                    ctype: 22,
                    etype: 106,
                    cctype: 1,
                    content_id: course_id
                }).then(res => { })
                if (endUrl.slice(0, 4) != 'http') {
                    var end = 'pages/wjxqList/wjxqList?activityId=' + endUrl
                    if (userId > 0) {


                        if (finishWatch) {

                            Taro.navigateToMiniProgram({
                                appId: 'wxd947200f82267e58',
                                path: end,
                                success(res) {
                                    console.info(res);
                                }
                            })

                        }

                    } else {
                        this.refs.auth.doLogin();
                    }
                } else {
                    if (userId > 0) {
                        Taro.navigateTo({
                            url: menus.annualBill + '?status=2' + '&link=' + encodeURIComponent(endUrl)
                        })
                    } else {
                        this.refs.auth.doLogin();
                    }

                }
            } else {
                api.post(inter.userHistory, {
                    ctype: 22,
                    etype: 106,
                    cctype: 1,
                    content_id: course_id
                }).then(res => { })
                api.get('/course/' + course_id + '/paper',{
                    stype:4
                }).then(res => {
                        let list = res.data.data
                        if (list.length > 0) {
                            Taro.navigateTo({ url: menus.questSurvey + '?courseId=' + course_id + '&activityId=0'+'&stype=4' })
                        } else {
                            if (endUrl.slice(0, 4) != 'http') {
                                var end = 'pages/wjxqList/wjxqList?activityId=' + endUrl
                                if (userId > 0) {


                                    if (finishWatch) {

                                        Taro.navigateToMiniProgram({
                                            appId: 'wxd947200f82267e58',
                                            path: end,
                                            success(res) {
                                                console.info(res);
                                            }
                                        })

                                    }

                                } else {
                                    this.refs.auth.doLogin();
                                }
                            } else {
                                if (userId > 0) {
                                    Taro.navigateTo({
                                        url: menus.annualBill + '?status=2' + '&link=' + encodeURIComponent(endUrl)
                                    })
                                } else {
                                    this.refs.auth.doLogin();
                                }

                            }
                        }
                    })
            }
        }else{
            if (endPaperList.length==0) {
                api.post(inter.userHistory, {
                    ctype: 22,
                    etype: 106,
                    cctype: 1,
                    content_id: course_id
                }).then(res => { })
                if (endUrl.slice(0, 4) != 'http') {
                    var end = 'pages/wjxqList/wjxqList?activityId=' + endUrl
                    if (userId > 0) {


                        if (finishWatch) {

                            Taro.navigateToMiniProgram({
                                appId: 'wxd947200f82267e58',
                                path: end,
                                success(res) {
                                    console.info(res);
                                }
                            })

                        }

                    } else {
                        this.refs.auth.doLogin();
                    }
                } else {
                    if (userId > 0) {
                        Taro.navigateTo({
                            url: menus.annualBill + '?status=2' + '&link=' + encodeURIComponent(endUrl)
                        })
                    } else {
                        this.refs.auth.doLogin();
                    }

                }
            }else{
                if(endPaperList[0].isSubmit==1){
                    Taro.showToast({
                        title: '该试卷已填写',
                        icon: 'none',
                        duration: 2000
                    });
                    return;
                }
                api.post(inter.userHistory, {
                    ctype: 22,
                    etype: 106,
                    cctype: 1,
                    content_id: endPaperList[0].paperId
                }).then(res => { })
                api.get(inter.examPaper + endPaperList[0].paperId, {
                    lessDuration: 3600
                }).then(res => {
                    console.log(res)
                    let val = res.data.data
                    Taro.navigateTo({
                        url: menus.doingExam + '?paper_id=' + val.paperId + '&e_duration=' + val.duration + '&paperName=' + percent2percent25(val.paperName) + '&lessDuration=' + val.lessDuration + '&ttyp=1'
                    })
                })
            }
        }
        

    }


    // 判断 课程是否完成
    _juageExam() {

        var that = this
        const { course_id } = that.state

        api.get(inter.CourseDesc + course_id)
            .then((res) => {
                if (res.data.status) {
                    let courseDesc = res.data.data

                    that.setState({
                        finishWatch: courseDesc.finishWatch
                    })
                }
            })
    }

    _juageToast() {
        var that = this;
        const { finishWatch, endUrl, } = that.state;
        if (!finishWatch) {
            Taro.showToast({
                title: '请学完本次课程，再来考试 ',
                icon: 'none',
                duration: 2000,
            })
        }

    }


    // _onshare = () => {
    //     var that = this;

    //     that.setState({
    //         isShow:true
    //     })
    // }

    _toMail = (item) => {

        let adlink = item.goodsLink;
        api.post('/user/save/shop/jump/history', {})
            .then(res => {
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
                                        console.info(res);
                                    }
                                });
                            }
                        })


                }
            })

    }
    onOkeys = () => {
        this.setState({
            show: false
        })
    }
    render() {

        if (!this.state.load) return null;

        const { home } = this.props
        const { courseDesc, giftList } = home
        const { teacher } = courseDesc

        const { tteacherId, score, evalType, content, free, status, payType, thisTeacher, courseName, comment, gfIntegral, userintegral, typegift, course_id, gfId, videom38u, cchapterId, chapterList, isCollect, isFollow, gifttImg, publishGift, collectNum, teacherId, chapter, isSeries, username, courseImg, commend_total, topComms, rds_initTime, hit, userId, canPlay, c_integral, canBuy, userMobile, layerMobile, ts, finishWatch, beginUrl, endUrl, beginUrlType, endUrlType, goodsList, isShow, freeChapter, chapt, tip, text, again, ons, agree, iftext, show, integral, initialTime,ccpid } = this.state;


        // tab页 展示 根据 isSeries 判断   等于0 不显示课程大纲
        let tabites: string[] = new Array()
        let total = topComms.filter(item => item.isTop == 1 ? item : null)
        if (isSeries == 0) {
            tabites = ['课程简介', `评论(${courseDesc.comment})`]
        } else if (isSeries == 1) {
            tabites = ['课程简介', '课程大纲', `评论(${courseDesc.comment})`]
        }
        var rpx;
        Taro.getSystemInfo({
            success: function (res) {
                rpx = res.windowWidth / 375
            }
        })

        //视频的品读款度
        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {

        }

        //礼物8个人一组
        let giftst: any[] = new Array()
        for (let i = 0; i < giftList.length; i += 8) {
            giftst.push(giftList.slice(i, i + 8));
        }


        let autoplay: boolean = false;
        if (userId > 0 && canPlay && userMobile > 0) {
            autoplay = true
        }
        if (freeChapter > 0) {
            autoplay = true
        }
        // console.log(autoplay, videom38u, '////')
        let poster = {
            title: courseName,
            summary: courseDesc.summary,
            hit,
            score,
            posterImg: courseImg,
        }
        return (
            <View className='coursewrap'>
                {/* <CoursePaper value={this.state.examPaper}/> */}
                <View className='course_head'>
                    {
                        payType > 0 && canBuy && thisTeacher == false && freeChapter == 0 && free == false ?
                            <Image src={courseImg} style={{ width: '100%', height: (windowWidth * 0.56).toFixed(0) + 'px', display: 'flex', justifyContent: 'center' }} />
                            :
                            <Video
                                src={videom38u}
                                poster={courseImg}
                                className='video'
                                style={{ width: '100%', height: (windowWidth * 0.56).toFixed(0) + 'px', display: 'flex', justifyContent: 'center' }}
                                autoplay={autoplay}
                                // initialTime={rds_initTime}
                                custom-cache={false}
                                id='video'
                                loop={false}
                                muted={false}
                                initialTime={ccpid==cchapterId?initialTime:0}
                                onTimeUpdate={this.onTimeUpdate}
                                onEnded={this.onEnded}
                                onPlay={this.onPlay}
                                onPause={this.onPause}
                                autoPauseIfNavigate={true}
                            >
                                {
                                    autoplay ?
                                        // <CoverView className="coverBox" >
                                        //     {forTimes(now_time)+"/"+forTimes(end_time)}
                                        // </CoverView>
                                        null
                                        :
                                        <CoverView className="coverPlay" style={{ width: '100%', height: (windowWidth * 0.56).toFixed(0) + 'px' }}>
                                            <CoverView className="coverbutton" onClick={this._coverplay}></CoverView>
                                        </CoverView>
                                }

                            </Video>
                    }

                    <View className='atabs'>
                        <Tabs items={tabites} selected={status} onSelect={this._onSelect} />
                    </View>
                </View>
                <ScrollView className='d_flex col_1 ' style={{ paddingBottom: '70rpx', paddingTop: '510rpx' }}>
                    {
                        status == 0 ?
                            <View className='pt_15 pb_15'>
                                <View className='pb_15 pl_15 pr_15'>
                                    <Text className='lg20_label c33_label fw_label'>{courseName}</Text>
                                    <View className='d_flex ai_ct fd_r mt_10 jc_sb'>
                                        <View className="d_flex fd_r ai_ct">
                                            <Coursescore val={score} />
                                            <Text className='sm_label gray_label ml_10'>评分{' ' + score}</Text>
                                        </View>
                                        {/* <View className='title_btn ml_10 d_flex ai_ct jc_ct'  onClick={()=>this.setState({evalType:true})}> */}
                                        <View className='title_btn ml_10 d_flex ai_ct jc_ct' onClick={this._coursePf}>
                                            <Text className='sred_label sm_label'>课程评分</Text>
                                        </View>
                                    </View>
                                    <View className='d_flex fd_r jc_sb ai_ct mt_10'>
                                        <View className="d_flex fd_r ai_ct">
                                            {
                                                this.state.payType > 0 ?
                                                    <Text className='red_label lg_label fw_label'>{c_integral}学分</Text>
                                                    :
                                                    <Text className='red_label lg_label fw_label'>免费</Text>
                                            }
                                        </View>
                                        <Text className='sm_label gray_label'>共计{chapter}讲 <Text className='ml_5'>{hit}</Text></Text>
                                    </View>
                                    {
                                        this.state.lltype == 1 ?
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
                                                        <View className='ml_10 '>
                                                            <Text className='default_label c33_label fw_label'>{teacher.isLeaderRecomm !== 0 ? '' : '讲师：'}{teacher.teacherName}</Text>
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

                                    <View className='border_bt pb_15 pt_10 d_flex fd_c '>
                                        <Text className='lg18_label c33_label fw_label'>课程简介</Text>
                                        {/* {
                                            this.state.ctypes == 48 ? */}
                                        <View className='default_label lh20_label pt_10 gray_label'>
                                            <GrapTmp content={content} ></GrapTmp>
                                        </View>
                                        {/* :
                                                <Text className='default_label lh20_label pt_10 gray_label'>{content}</Text>
                                        } */}
                                    </View>

                                </View>


                                <View className='d_flex fd_r ai_ct jc_sb pt_15 pl_15 pr_15'>
                                    <Text className='lg18_label c33_label fw_label'>课程大纲</Text>
                                    <Text className='sm_label c33_label fw_label'>共{chapter}节</Text>
                                </View>

                                {/* 
                                {
                                    this.state.ctypes == 48 ?
                                        null
                                        : */}
                                <Menu chapterList={chapterList} chapterId={cchapterId} atype={0} clickPress={this._onPlayer} />

                                {/* } */}



                                {
                                    beginUrlType === 0 && endUrlType === 0 ?
                                        null :
                                        <View className='d_flex fd_r jc_sb pt_20 ml_15 mr_15 testBtns'>
                                            {
                                                beginUrlType === 0 ?
                                                    null :
                                                    <View style={{ width: (windowWidth - 44) / 2 + 'px' }}>
                                                        <View className='testBtn' style={{ backgroundColor: '#F4623F' }}
                                                            onClick={this._onPreCourse.bind(this, 0)}
                                                        >
                                                            <Text className='lg_label white_label'>{beginUrlType === 1 ? '问卷' : '考试'}</Text>
                                                        </View>
                                                    </View>
                                            }

                                            {
                                                endUrlType === 0 ?
                                                    null :
                                                    <View style={{ width: (windowWidth - 44) / 2 + 'px' }}>
                                                        {
                                                            finishWatch ?
                                                                <View className='testBtn' style={{ backgroundColor: '#F4623F' }}
                                                                    onClick={this._onNextCourse.bind(this, 1)}
                                                                >
                                                                    <Text className='lg_label white_label'>{endUrlType === 1 ? '问卷' : '考试'}</Text>
                                                                </View>
                                                                :
                                                                <View className='testBtn' style={{ backgroundColor: '#999999' }}
                                                                    onClick={this._juageToast}
                                                                // onClick={this._onNextCourse.bind(this, 1)}
                                                                >
                                                                    <Text className='lg_label white_label'>{endUrlType === 1 ? '问卷' : '考试'}</Text>
                                                                </View>
                                                        }

                                                    </View>
                                            }
                                        </View>
                                }


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



                                <View className='m_15 pt_15 border_tp'>
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

                                </View>
                                {
                                    comment.length > 0 ?
                                        <View className='pt_12 pb_12 d_flex fd_r ai_ct jc_ct border_tp'
                                            onClick={() => Taro.navigateTo({ url: menus.allComment + '?course_id=' + `${course_id}` + '&type=0' + '&ctype=3' })}
                                        >
                                            <Text className='gray_label sm_label'>查看全部评论 &gt;</Text>
                                        </View>
                                        : null}

                            </View>
                            : null}

                    <View>
                        {
                            isSeries == 0 ?

                                <View>
                                    {
                                        status == 1 ?
                                            <View className='p_15'>
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
                                                {
                                                    comment.length > 0 ?
                                                        <View className='pt_12 pb_12 d_flex fd_r ai_ct jc_ct border_tp'
                                                            onClick={() => Taro.navigateTo({ url: menus.allComment + '?course_id=' + `${course_id}` + '&type=0' + 'ctype=3' })}
                                                        >
                                                            <Text className='gray_label sm_label'>查看全部评论 &gt;</Text>
                                                        </View>
                                                        : null}
                                            </View>

                                            : null}


                                </View>
                                :
                                <View className='pb_15'>
                                    {
                                        status == 1 ?
                                            // 如果只有一节，直接显示一节，不用显示章节
                                            <Menu chapterList={chapterList} chapterId={cchapterId} atype={0} clickPress={this._onPlayer} />
                                            : null}
                                    {
                                        status == 2 ?
                                            <View className='p_15'>
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

                                                {
                                                    comment.length > 0 ?
                                                        <View className='pt_12 pb_12 d_flex fd_r ai_ct jc_ct border_tp'
                                                            onClick={() => Taro.navigateTo({ url: menus.allComment + '?course_id=' + `${course_id}` + '&type=0' + 'ctype=0' })}
                                                        >
                                                            <Text className='gray_label sm_label'>查看全部评论 &gt;</Text>
                                                        </View>
                                                        : null}
                                            </View>

                                            : null}
                                </View>


                        }
                    </View>





                    {
                        publishGift ?
                            <View className='goldbox' >
                                <View className='goldbox_item d_flex fd_r ai_ct'>
                                    <Text className='sm_label white_label'>{username} 送出  </Text>
                                    <Image src={gifttImg} className="giftimg m l" />
                                    <Text className='sm_label white_label'> X1</Text>
                                </View>
                            </View>
                            : null}

                </ScrollView>


                {

                    // (c_integral > 0 && canBuy) ?
                    (this.state.payType > 0 && canBuy && !thisTeacher) ?
                        <View className='comments d_flex fd_r ai_ct' >
                            <Image src={asset.gift} className='gift ' onClick={this._onTypegift} />
                            <Image src={asset.eval_icon} className='gift ml_10' onClick={this._whiteCommt} />
                            <View className='countBox' onClick={isCollect ? this._offCollect : this._onCollect} style={{ marginLeft: '20rpx', marginRight: '30rpx' }}>
                                <Image src={isCollect ? asset.collected : asset.heart_icon} className='heart_icon' />
                                <View className='count'>
                                    <Text className='sm9_label white_label'>{collectNum > 999 ? '999+' : collectNum}</Text>
                                </View>
                            </View>
                            {
                                this.state.payType == 4 ?
                                    <View className='buyBtn mr_20' onClick={this._buyCourses}>
                                        <Text className='white_label default_label'>立即兑换</Text>
                                    </View>
                                    :
                                    <View className='buyBtn mr_20' onClick={this._buyCourse}>
                                        <Text className='white_label default_label'>立即购买</Text>
                                    </View>
                            }
                        </View>
                        :
                        <View className='comments d_flex fd_r ai_ct' >
                            <View className='input' onClick={this._whiteCommt}  >
                                <Text className='tip_label default_label'>写留言，发表看法</Text>
                            </View>
                            <Image src={asset.gift} className='gift ml_20' onClick={this._onTypegift} />
                            <View className='countBox' onClick={isCollect ? this._offCollect : this._onCollect}>
                                <Image src={isCollect ? asset.collected : asset.heart_icon} className='heart_icon' />
                                <View className='count'>
                                    <Text className='sm9_label white_label'>{collectNum > 999 ? '999+' : collectNum}</Text>
                                </View>
                            </View>
                        </View>
                }


                <Poster poster={poster} isShow={isShow} />


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
                <Auth ref={'auth'} type={1} success={() => {
                    this._onLoadCallBack()
                }} />

                {/* {
                    layerMobile ?
                    <View className='show_modal modal'>
                        <View className='pannel'>
                            <Image className='modal_img' mode='widthFix' src={"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/box-live.png"}/>
                            <View className='pannel_cons'>
                                <Text className='modal_txt'>绑定手机号</Text>
                                <Text className='modal_sum'>需要绑定手机号后才能学习该课程。</Text>
                                <View className='d_flex fd_r ai_ct wrapbtns'>
                                    <Button openType='getPhoneNumber' className='btn lred_label'  onGetPhoneNumber={this.getPhoneNumber}>获取手机号</Button>
                                </View>
                            </View>
                        </View>
                    </View>
                :null} */}

                {
                    layerMobile ?
                        <View className='usershow'>
                            <View className='ctypelayer'></View>
                            <View className='dialog'>
                                <View className='wrappost'>
                                    <Text className='c33_label lg20_label mt_10'>获取手机号</Text>
                                    <Text className='c33_label mt_10  lg18_label pl_15 pr_15'>需要绑定手机号后才能学习该课程。</Text>
                                    <View className='d_flex fd_r ai_ct wrapbtns'>
                                        <Button openType='getPhoneNumber' className='btn lred_label' onGetPhoneNumber={this.getPhoneNumber}>获取手机号</Button>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : null}

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
                                                <View className='layer_btn d_flex jc_ct ai_ct' onClick={this._onClose.bind(this)}>
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
                <GetInt show={show} integral={integral} onOkeys={this.onOkeys}></GetInt>
            </View>
        )
    }
}


export default courseDesc as ComponentClass