import { ComponentClass } from 'react'
import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text, Image, WebView, CoverView, ScrollView, Swiper, SwiperItem, Radio, Progress } from '@tarojs/components'



import { connect } from '@tarojs/redux'
import { homeType } from '../../constants/homeType'

import Auth from '../../components/Auth'
import Eval from '../../components/Eval'
import Comt from '../../components/General/Comt'

import inter from '../../config/inter'
import api from '../../services/api'
import asset from '../../config/asset';
import menus from '../../config/menu';

import GrapTmp from './grapTmp'

import '../../config/theme.css';
import './grapWbdesc.less';
import GetInt from '../../components/GetInt'
import {
    getCourseDesc,
    getConfigGift
} from '../../actions/home'

type PageStateProps = {
    home: homeType,
}

type PageDispatchProps = {
    getCourseDesc: (object) => any,
    getConfigGift: (object) => any
}

type PageOwnProps = {}

type PageState = {

    course_id: number,
    article: any,
    isCollect: boolean,
    collectNum: number,
    courseImg: string,
    courseName: string,
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
        like: boolean,
    }>,
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
    load: boolean,
    loginStatus: boolean,
    userId: number,
    teacherId: number,
    pubTimeFt: string,
    galleryList: Array<{}>,
    hit: number,
    typegift: boolean,
    gfId: number,
    userintegral: number,
    gfIntegral: number,
    gifttImg: string,
    publishGift: boolean,
    username: string,
    comment: number,
    goodsList: Array<any>,
    canShare: number,
    again: number,
    text: any,
    ons: boolean,
    tip: boolean,
    iftext: string,
    agree: number,
    tipp: number,
    beginUrl: string,
    audioStatus: number,
    url: string,
    show: boolean,
    integral: number,
    levelId: number,
    leave: number,
    lltype: number,
    ts:any,
    tim:any,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface GrapWbdesc {
    props: IProps;
}
const backgroundAudioManager = Taro.createInnerAudioContext()
@connect(({ home }) => ({
    home: home,
}), (dispatch) => ({
    getCourseDesc(object) {
        dispatch(getCourseDesc(object))
    },
    getConfigGift(object) {
        dispatch(getConfigGift(object))
    }
}))


class GrapWbdesc extends Component<PageDispatchProps & PageStateProps, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '图文课程详情',
        enablePullDownRefresh: true
    }
    ts: any;
    tim: any;
    constructor() {
        super(...arguments)
        this.ts = 0;
        this.tim = 0;
        this.state = {
            course_id: 0,
            article: "",
            isCollect: false,
            collectNum: 0,
            courseImg: '',
            courseName: '',
            topComms: [],
            load: false,
            loginStatus: false,
            userId: 0,
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
            galleryList: [],
            teacherId: 0,
            pubTimeFt: '',
            hit: 0,
            typegift: false,
            gfId: 0,
            userintegral: 0,
            gfIntegral: 0,
            gifttImg: '',
            publishGift: false,
            username: '',
            comment: 0,
            goodsList: [], //课程带货
            canShare: 0,
            again: 0,
            text: [],
            tip: false,
            iftext: '',
            agree: 0,
            ons: false,
            tipp: 0,
            beginUrl: '',
            audioStatus: 0,
            url: '',
            show: false,
            integral: 0,
            levelId: 0,
            leave: 0,
            lltype: 0,
            ts:'00',
            tim:'0',
        }

        this._whiteCommt = this._whiteCommt.bind(this);
        this._onLoadCallBack = this._onLoadCallBack.bind(this);
        this._parse = this._parse.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        var that = this;
        const { home } = nextProps
        const { courseDesc } = home

        if (home !== this.props.home) {

            Taro.hideNavigationBarLoading()
            Taro.stopPullDownRefresh()
            if (courseDesc.canShare == 0) {
                Taro.hideShareMenu()
            } else {
                wx.showShareMenu({

                    withShareTicket: true,

                    menus: ['shareAppMessage', 'shareTimeline']
                })
            }
            that.setState({
                article: courseDesc.content,
                isCollect: courseDesc.collect,
                collectNum: courseDesc.collectNum,
                courseImg: courseDesc.courseImg,
                courseName: courseDesc.courseName,
                teacher: courseDesc.teacher,
                teacherId: courseDesc.teacherId,
                pubTimeFt: courseDesc.pubTimeFt,
                galleryList: courseDesc.galleryList,
                load: true,
                hit: courseDesc.hit,
                comment: courseDesc.comment,
                goodsList: courseDesc.goodsList,
                canShare: courseDesc.canShare,
                beginUrl: courseDesc.beginUrl
            })
        }

    }


    componentWillMount() {
        const that = this
        const { course_id, courseName, fromuser, scene, levelId, ltype } = that.$router.params;
        if (levelId !== undefined) {
            that.setState({
                levelId: parseInt(levelId)
            })
            setTimeout(() => {
                api.post('/user/learn/article/' + parseInt(course_id), {
                    levelId: parseInt(levelId)
                }).then(res => {
                    setTimeout(() => {
                        Taro.navigateBack({
                            delta: 1
                        })
                    }, 2000);
                })
            }, 60000);
        }
        api.post('/user/log', {
            log_type: 4,
            type: 0,
            contentId: parseInt(course_id)
        }).then(res => { })
        that.setState({
            course_id: parseInt(course_id)
        })
        Taro.setNavigationBarTitle({
            title: courseName,
        })
        if (ltype && ltype == '1') {
            this.setState({
                lltype: 1
            })
        }
        if (scene) {
            const fuser = decodeURIComponent(scene).split('=');
            if (fuser.length > 1) {
                Taro.setStorageSync('fuser', fuser[1]);
            }
        }
        if (fromuser) {
            Taro.setStorageSync('fuser', fromuser);
        }
    }

    onPullDownRefresh() {
        var that = this;

        Taro.showNavigationBarLoading()
        that.getCourseDesc();
        that._getAllComment();
        that.getConfigGift();
        that.getUser();

    }

    componentDidMount() {
        var that = this;
        that.getCourseDesc();
        that._getAllComment();
        that.getConfigGift();
        that.getUser();
        that.getusers();
        that.getConfigs()
        const { course_id } = that.$router.params
        api.get(inter.CourseDesc + course_id)
            .then((res) => {
                if (res.data.status) {
                    if (res.data.message) {
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
                        }else{
                            Taro.showModal({
                                title: '提示',
                                content: res.data.message,
                                success: function (res) {
                                    if (res.confirm) {
                                        Taro.navigateTo({ url: menus.courseCate })
                                    } else if (res.cancel) {
                                        Taro.navigateTo({ url: menus.courseCate })
                                    }
                                }
                            })
                            setTimeout(() => {
                                Taro.navigateTo({ url: menus.courseCate })
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
    getusers=()=>{
        var that = this
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
                                            Taro.navigateTo({ url: menus.courseCate })
                                        } else if (res.cancel) {
                                            Taro.navigateTo({ url: menus.courseCate })
                                        }
                                    }
                                })
                                setTimeout(() => {
                                    Taro.navigateTo({ url: menus.courseCate })
                                }, 3000);
                            } else {
                                Taro.showModal({
                                    title: '提示',
                                    content: res.data.message,
                                    success: function (res) {
                                        if (res.confirm) {
                                            Taro.navigateTo({ url: menus.courseCate })
                                        } else if (res.cancel) {
                                            Taro.navigateTo({ url: menus.courseCate })
                                        }
                                    }
                                })
                                setTimeout(() => {
                                    Taro.navigateTo({ url: menus.courseCate })
                                }, 3000);
                            }
                        }
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
                Taro.setStorageSync('tippsss', 1)
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
            Taro.setStorageSync('tippsss', 1)
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
    componentWillUnmount() {
        const { leave } = this.state
        if (this.state.beginUrl) {
            backgroundAudioManager.pause()
            backgroundAudioManager.onPause(() => {
                this.setState({
                    url: ''
                })
            })
        }
        if (leave === 0) {
            api.get('/user/learn/lock', {
                action: 1
            }).then(res => { })
        }

    }
    componentDidShow() {

        api.get(inter.User)
            .then(res => {
                if (res.data.status) {
                    let userData = res.data.data
                    this.setState({
                        userId: userData.userId,
                        loginStatus: true
                    })
                }
            })

    }

    componentDidHide() {
        if (this.state.leave === 0) {
            api.get('/user/learn/lock', {
                action: 1
            }).then(res => { })
        }
    }

    componentDidUpdate() {
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
            intro: '分享图文课程',
            content_id: courseDesc.courseId,
            param: JSON.stringify({ name: courseName, cctype: 2, ttype: 3 }),
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
            path: menus.grapWbdesc + '?course_id=' + course_id + '&fromuser=' + userId,
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

    // 得到礼物
    getConfigGift() {
        this.props.getConfigGift({
            gtype: 0
        })
    }

    // 得到课程详情
    getCourseDesc() {
        var that = this
        const { course_id } = that.state
        // logHistory(course_id);
        this.props.getCourseDesc({
            course_id
        })
    }

    // 写评论
    _whiteCommt() {
        var that = this
        const { course_id, loginStatus } = that.state
        if (loginStatus) {
            Taro.navigateTo({
                url: menus.writeCommt + '?course_id=' + `${course_id}` + '&whitetip=' + Taro.getStorageSync('whiteTip') + '&type=0&ctype=3&isStar=0'
            })
        } else {
            this.refs.auth.doLogin();
        }

    }


    //课程评论
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

    _parse(val, comIdx) {
        var that = this
        const { topComms, loginStatus } = that.state

        if (loginStatus) {
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

    //取消收藏
    _offCollect() {
        var that = this
        const { course_id, collectNum, loginStatus } = that.state;

        if (loginStatus) {
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
                            collectNum: collectNum - 1
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

    _onCollect() {
        var that = this
        const { course_id, collectNum, loginStatus } = that.state;

        if (loginStatus) {
            api.post(inter.PublishCollect + course_id)
                .then((res) => {
                    if (res.data.status) {
                        Taro.showToast({
                            title: '收藏成功',
                            icon: 'success',
                            duration: 2000
                        })
                        that.setState({
                            isCollect: true,
                            collectNum: collectNum + 1
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
                        userId: userData.userId,
                        userintegral: userData.integral,
                    })
                }
            })
        this.setState({
            loginStatus: true
        })
    }


    // 是否打赏礼物
    _onTypegift() {
        var that = this
        const { loginStatus } = that.state
        let vas = Taro.getStorageSync('tippsss')
        if (vas == 1) {
            if (loginStatus) {
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

    _toMail = (item) => {

        let adlink = item.goodsLink;
        api.post('/user/save/shop/jump/history', {})
            .then(res => {
                if (adlink.substring(0, 4) == 'http') {
                    Taro.navigateTo({ url: menus.adWebView + '?link=' + `${item.goodsLink}` + '&ad=' + `${JSON.stringify(item)}` })
                } else {

                    api.post(inter.userYcToken, {})
                        .then((res) => {
                            console.log(res)
                            if (res.data.status) {
                                let data = res.data.data;

                                wx.navigateToMiniProgram({
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
    onShareTimeline() {
        const { courseImg, courseName, course_id, userId } = this.state
        return {
            title: courseName,
            query: '/pages/index/grapWbdesc?course_id=' + course_id + '&courseName=' + percent2percent25(`${courseName}`) + '&fromuser=' + userId,
            imageUrl: courseImg,
        }
    }
    _onPlaying = () => {
        const { beginUrl, audioStatus, url } = this.state
        var that = this ;
        wx.setInnerAudioOption({
            obeyMuteSwitch: false
        })
        if (url !== beginUrl) {
            backgroundAudioManager.stop();
            // backgroundAudioManager.coverImgUrl = link.poster;
            backgroundAudioManager.src = beginUrl;
            // backgroundAudioManager.title = link.title;
            // backgroundAudioManager.singer = 'perfect';

            backgroundAudioManager.play();
            backgroundAudioManager.onPlay(() => {
                this.setState({
                    url: beginUrl,
                    audioStatus: 1
                })
                backgroundAudioManager.onTimeUpdate(()=>{
                    that.ts++;
                    if(that.ts % 2 == 0){
                        let  learnTime = (this.ts / 2).toFixed(0);
                        if(parseInt(learnTime)%60>0){
                            this.setState({
                                ts:(parseInt(learnTime)%60).toString(),
                            })
                        }else{
                            this.setState({
                                ts:(parseInt(learnTime)%60).toString(),
                                tim:(parseInt(this.state.tim)+1).toString(),
                            })
                        }
                        
                    }
                })
            })

        } else {

            backgroundAudioManager.stop();
            backgroundAudioManager.onStop(() => {
                this.ts=0
                this.setState({
                    url: '',
                    audioStatus: 0,
                    ts:'00',
                    tim:'0',
                })
            })
        }
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
        const { goodsList, comment, publishGift, userintegral, gfIntegral, gifttImg, gfId, isCollect, collectNum, topComms, course_id, hit, courseImg, courseName, teacherId, teacher, pubTimeFt, galleryList, typegift, username, canShare, tip, text, again, ons, agree, iftext, beginUrl, audioStatus, show, integral, userId } = this.state;

        //礼物8个人一组
        let giftst: any[] = new Array()
        for (let i = 0; i < giftList.length; i += 8) {
            giftst.push(giftList.slice(i, i + 8));
        }
        return (
            <View className='grapwrap'>
                <ScrollView className='pb_50'>
                    <View className=' graphead'>
                        <View className='grapCovers'>
                            <Image src={courseImg} className='grapImg' />
                        </View>
                        <Text className=' lg_label c33_label fw_label pt_10 pb_10'>{courseName}</Text>
                        <View className='d_flex fd_r ai_ct jc_sb '>
                            <View className='d_flex fd_r pt_10'>
                                {
                                    teacherId === 0 ?
                                        null :
                                        <Image src={teacher.teacherImg} className='teacherImg mr_10' />
                                }
                                {
                                    teacherId === 0 ?
                                        null :
                                        <Text className='default_label c33_label mr_15'>{teacher.teacherName}</Text>
                                }
                                <Text className='default_label tip_label'>{pubTimeFt}</Text>
                            </View>
                            <Text className='sm_label gray_label pt_10'>{hit}人已阅</Text>
                        </View>
                        {
                            this.state.lltype == 1 ?
                                <View className='mt_10'>
                                    <Text className='default_label fw_label'>完成规则：学习时长需达到课程总时长的100%，拖动进度条将不能解锁课程</Text>
                                </View>
                                : null
                        }
                    </View>

                    <View className='p_15'>
                        <GrapTmp content={this.state.article} ></GrapTmp>
                        {
                            beginUrl ?
                                <View className='audios'>
                                    <View className='pis'>
                                        <Image src={courseImg} style={{ width: '100%', height: '100%' }} />
                                        <View className='wds'>
                                            {
                                                audioStatus == 1 ?
                                                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/20f88a92-5d88-49b9-8e1d-48af3a2880e7.png'} className='wdss' onClick={this._onPlaying} />
                                                    :
                                                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/30fad6fc-5574-4fb4-b117-11051e63f3f6.png'}  className='wdss' onClick={this._onPlaying} />
                                            }
                                        </View>
                                    </View>
                                    <View className='ml_20 wordss'>
                                        <Text className='wors'>{beginUrl.split('/')[beginUrl.split('/').length-1]}</Text>
                                    </View>
                                    <View className='ml_20 tis'>
                                            {this.state.tim.length<2?'0'+this.state.tim:this.state.tim}:{this.state.ts.length<2?'0'+this.state.ts:this.state.ts}
                                    </View>
                                </View>
                                : null
                        }
                    </View>
                    {/* {
                        beginUrl ?
                            <View className='p_15'>
                                <View className='audio_box'>
                                    <View className='pics'>

                                    </View>
                                    <View className='bdy'>

                                    </View>
                                    <View className='controls'>
                                    {
                                        audioStatus ?
                                            <Image src={asset.cmic_beg} className='picture' onClick={this._onPlaying} />
                                            :
                                            <Image src={asset.cmic_parse} className='picture' onClick={this._onPlaying} />
                                    }
                                    </View>
                                </View>
                            </View>
                            : null
                    } */}

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

                    <View>
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
                                                            type={1}
                                                            val={comm}
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
                            comment > 0 ?
                                <View className='pt_12 pb_12 d_flex fd_r ai_ct jc_ct border_tp'
                                    onClick={() => Taro.navigateTo({ url: menus.allComment + '?course_id=' + `${course_id}` + '&type=0' + '&ctype=0' })}
                                >
                                    <Text className='gray_label sm_label'>查看全部评论 &gt;</Text>
                                </View>
                                : null}

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
                <View className='comments d_flex fd_r ai_ct' >
                    <View className='input' onClick={this._whiteCommt}  >
                        <Text className='tip_label default_label'>写留言，发表看法</Text>
                    </View>
                    <Image
                        src={asset.gift}
                        className='gift ml_20'
                        onClick={this._onTypegift}
                    />
                    <View className='countBox' onClick={isCollect ? this._offCollect : this._onCollect}>
                        <Image src={isCollect ? asset.collected : asset.heart_icon} className='heart_icon' />
                        <View className='count'>
                            <Text className='sm9_label white_label'>{collectNum > 999 ? '999+' : collectNum}</Text>
                        </View>
                    </View>
                </View>

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
                <Auth ref={'auth'} type={1} success={() => {
                    this._onLoadCallBack()
                }} />
                <GetInt show={show} integral={integral} onOkeys={this.onOkeys}></GetInt>
            </View>
        )
    }
}

export default GrapWbdesc as ComponentClass
