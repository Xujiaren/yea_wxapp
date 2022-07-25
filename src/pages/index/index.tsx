import { ComponentClass } from 'react'
import Taro, { Component, Config, getApp } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image, ScrollView, Input, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { homeType } from '../../constants/homeType'
import { subNumTxt, liveday, time_ms, learnNum, percent2percent25, formatTimeStampToTime, encryNumber } from '../../utils/common'
import Auth from '../../components/Auth'
import Tabs from '../../components/Tabs'
import Course from '../../components/Course'
import GrapCourse from '../../components/GrapCourse'
import ConsultCourse from '../../components/ConsultCourse'
import ModalPannel from '../../components/ModalPannel'



import {
    getConfig,
    getUserMsgUread,
    getConfigAd,
    getSiteIndex,
    getSiteMenu,
    updatePlayStatus,
    getTeacherLeader,
    getTeacherRecom,
    getSite
} from '../../actions/home'

import api from '../../services/api'

import menu from '../../config/menu';
import asset from '../../config/asset';
import inter from '../../config/inter'

import '../../config/theme.css';
import './index.less'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion


const app = getApp();


type PageStateProps = {
    home: homeType,
    getConfig: Array<{}>,
    getSite: Array<{}>,
    getUserMsgUread: object,
    getConfigAd: Array<{}>,
}

type PageDispatchProps = {
    getUserMsgUread: () => any,
    getConfig: () => any,
    getConfigAd: () => any,
    getSiteIndex: () => any,
    getSiteMenu: (object) => any,
    updatePlayStatus: (object) => any;
    getTeacherLeader: () => any,
    getTeacherRecom: () => any,
    getSite: () => any
}

type PageOwnProps = {}

type recom = {
    categoryId: number,
    chapter: number,
    chapterList: Array<{}>,
    collect: false
    content: string,
    courseId: number,
    courseImg: string,
    courseName: string,
    ctype: number,
    galleryList: Array<{}>,
    hit: number,
    integral: number,
    isRecomm: number,
    learn: number,
    pubTime: number,
    roomId: string,
    score: number,
    sortOrder: number,
    study: null
    summary: string,
    teacher: null
    teacherId: number,
    teacherName: string,
    ttype: number,
}


type PageState = {
    tstatus: number,
    message: number,
    remind: number,
    courseRemind: number,
    ad_type: boolean,
    topNum: number,
    teacherRecomm: Array<{}>,
    adList: Array<{}>,
    adpopups: Array<{}>,
    Spopup: number,
    recommList: Array<recom>,
    keyword: string,
    keywords: string,
    config: {},
    isLogin: boolean,
    isMobile: boolean,
    loginStatus: boolean,
    isTopShow: boolean,
    navHeight: number,//刘海高度
    capHeight: number,//胶囊高度
    current: number,
    teachLeader: Array<{
        content: string,
        course: number,
        follow: number,
        galleryList: Array<string>,
        hit: number,
        honor: string,
        isFollow: boolean,
        level: number,
        teacherId: number,
        teacherImg: string,
        teacherName: string,
        userId: number,
        userImg: string,
    }>,
    consultRecomm: Array<{
        articleId: number,
        articleImg: string,
        atype: number,
        canShare: number,
        categoryId: number,
        comment: number,
        content: string,
        contentId: number,
        ctype: number,
        gallery: Array<string>,
        hit: number,
        isTop: number,
        like: false,
        likeNum: number,
        pubTime: number,
        pubTimeFt: string,
        summary: string,
        teacherId: number,
        title: string,
        ttype: number,
    }>,
    userStatus: number,
    liveList: Array<{}>,
    userId: number,
    show_pannel: boolean,
    liveResetTime: number,
    liveSlist: Array<{}>,

    tabStatus: number,
    cmic_type: number,
    cmic_duration: number,

    IndexSortList: Array<{
        type: string,
        data: any
    }>,
    indexMenu: Array<{
        mark: string,
        name: string,
        type: string,
    }>,
    MenuList: Array<{
        item: Array<{}>,
        page: number,
        pages: number,
        total: number
    }>,

    page: number,
    pages: number,
    total: number,
    // updateData:{
    //     isPlaying:false,
    //     cmic_audioName:string,
    //     cmic_audioId:number,
    //     cmic_audioImg:string,
    //     cmic_siger:string,
    //     cmic_duration:number,
    //     isCMusic:boolean
    // }

    IndexMenuTab: Array<string>,
    consultList: Array<any>,

    course_icon: string,
    live_icon: string,
    mall_icon: string,
    forum_icon: string,
    pk_icon: string,
    squad_icon: string,

    snpwdType: boolean,
    snpwd_sn: string,
    snpwd_pwd: string,
    searchdefult: any,
    num: number,
    ttyp: number,
    coupons: Array<any>,
    tip: any,
    region: Array<any>,
    regionId: number,
    areas: Array<any>,
    areaName: string,
    field: any,
    isAuth: number,
    qiandao: number,
    qian_img: string,
    statuss: number,
    mon:string,
    date:string,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
    props: IProps;
}


@connect(({ home }) => ({
    home: home
}), (dispatch) => ({
    getUserMsgUread() {
        dispatch(getUserMsgUread())
    },
    getConfig() {
        dispatch(getConfig())
    },
    getConfigAd() {
        dispatch(getConfigAd())
    },
    getSiteIndex() {
        dispatch(getSiteIndex())
    },
    getSiteMenu(object) {
        dispatch(getSiteMenu(object))
    },
    updatePlayStatus(object) {
        dispatch(updatePlayStatus(object));
    },
    getTeacherLeader() {
        dispatch(getTeacherLeader());
    },
    getSite() {
        dispatch(getSite())
    },
    getTeacherRecom() {
        dispatch(getTeacherRecom())
    }
}))




class Index extends Component<{}, PageState> {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    config: Config = {
        navigationBarTitleText: '油葱学堂',
        enablePullDownRefresh: true,
        navigationStyle: "custom",
    }
    ts: any
    backgroundAudioManager: any
    page: number
    pages: number
    isHomePage: boolean

    constructor() {
        super(...arguments)

        this.ts = 0;

        this.page = 0;
        this.pages = 0;
        this.isHomePage = true

        this.state = {
            tstatus: 0,
            message: 0,
            remind: 0,
            courseRemind: 0,
            ad_type: false,
            topNum: 0, //滚动条的位置
            teacherRecomm: [],
            adList: [],
            adpopups: [],
            recommList: [],
            keyword: '',
            keywords: '',
            config: {},
            loginStatus: false,
            isLogin: false,
            isMobile: false,
            isTopShow: false,
            navHeight: 44,
            capHeight: 20,
            current: 0,
            Spopup: 0,
            teachLeader: [],
            consultRecomm: [],
            liveList: [],
            userId: 0,
            show_pannel: false,
            liveResetTime: 0,
            liveSlist: [],
            userStatus: 0,

            tabStatus: 0,
            cmic_type: 2,
            cmic_duration: 0,
            IndexSortList: [],
            indexMenu: [],
            MenuList: [],
            page: 0,
            pages: 0,
            total: 0,
            IndexMenuTab: [],
            consultList: [],

            course_icon: '',
            live_icon: '',
            mall_icon: '',
            forum_icon: '',
            pk_icon: '',
            squad_icon: '',

            snpwdType: false, // 输入会员密码弹窗
            snpwd_sn: '', // 会员 卡号
            snpwd_pwd: '', // 会员 密码 
            searchdefult: [],
            num: 0,
            ttyp: 0,
            coupons: [],
            tip: [],
            region: [],
            regionId: 0,
            areas: [],
            areaName: '全国',
            field: {},
            isAuth: 0,
            qiandao: 0,
            qian_img: '',
            statuss: 0,
            mon:'',
            date:''
        }

        this._onRefresh = this._onRefresh.bind(this);
        this._onLoadCallBack = this._onLoadCallBack.bind(this);
        this.onAdLink = this.onAdLink.bind(this);
        this.getRecomm = this.getRecomm.bind(this);
        this._update_recom = this._update_recom.bind(this);
        this._setbatHeight = this._setbatHeight.bind(this);
        this._onSwiper = this._onSwiper.bind(this);
        this.adpopup = this.adpopup.bind(this);
        this._offAdtip = this._offAdtip.bind(this);
        this.onAdPopupLink = this.onAdPopupLink.bind(this);
        this._makelive = this._makelive.bind(this);

        this._snpwd = this._snpwd.bind(this);
        this._pwdSnpwd = this._pwdSnpwd.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        const { home } = nextProps
        const { userMsguRead, teacherRecomm, num, adList, config, teachLeader, siteListIndex, siteListMenu } = home
        const { tstatus } = this.state;

        let searchdefult: string[] = new Array()

        if (Object.keys(config).length !== 0) {
            searchdefult = config.search_def.split("|")
            this.setState({
                qiandao: parseInt(config.user_day_checkin_img_status),
                qian_img: config.user_day_checkin_button_img
            })
        }

        // let inputtxt:string = searchdefult[Math.floor(Math.random()*searchdefult.length)]

        let inputtxt: string = searchdefult[0]

        if (home !== this.props.home) {

            if (userMsguRead) {
                this.setState({
                    message: userMsguRead.message,
                    remind: userMsguRead.remind,
                    courseRemind: userMsguRead.courseRemind
                })
            }

            let IndexMenuTab: string[] = new Array();
            if (siteListMenu.menu.length > 0) {
                for (let j = 0; j < siteListMenu.menu.length; j++) {
                    IndexMenuTab.push(siteListMenu.menu[j].type)
                }
            }

            let IndexSortList: any[] = new Array();
            siteListIndex.map((ele) => {
                if (ele.data === null || ele.data === '' || ele.data === undefined) {

                } else {
                    IndexSortList.push(ele)
                }
            })


            // if(tstatus === 0){
            //     this.setState({
            //         keyword:inputtxt,
            //         tstatus:1
            //     })
            // }

            this.setState({
                IndexSortList: IndexSortList,
                teacherRecomm: teacherRecomm,
                adList: adList,
                keyword: inputtxt,
                config: config,
                teachLeader: teachLeader,
                indexMenu: siteListMenu.menu,
                IndexMenuTab: IndexMenuTab,
                searchdefult: searchdefult,

            })


        }
        if (config !== this.props.home.config && this.isHomePage) {
            try {
                const ui = JSON.parse(config['ui_choose_field'])
                this.setState({
                    course_icon: ui['course'] || '',
                    live_icon: ui['live'] || '',

                    mall_icon: ui['mall_icon'] || '',
                    forum_icon: ui['forum'] || '',
                    pk_icon: ui['pk'] || '',
                    squad_icon: ui['squad'] || '',
                }, () => {
                    const the_page = Taro.getCurrentPages()[0]
                    if (the_page.route == "pages/index/index") {
                        Taro.setTabBarItem({
                            index: 0,
                            iconPath: ui['index_dark'] || '',
                            selectedIconPath: ui['index_light'] || ''
                        })
                        Taro.setTabBarItem({
                            index: 1,
                            iconPath: ui['discover_dark'] || '',
                            selectedIconPath: ui['discover_light'] || ''
                        })
                        Taro.setTabBarItem({
                            index: 2,
                            iconPath: ui['study_dark'] || '',
                            selectedIconPath: ui['study_light'] || ''
                        })
                        Taro.setTabBarItem({
                            index: 3,
                            iconPath: ui['my_dark'] || '',
                            selectedIconPath: ui['my_light'] || ''
                        })
                    }
                })

            } catch (e) {

            }
        }
    }

    componentWillMount() {

        const { scene, fromuser } = this.$router.params;
        this._setbatHeight();

        const Spopup = Taro.getStorageSync('adpopup')
        const popID = Spopup.length == 0 ? 0 : Spopup;

        this.setState({
            Spopup: popID
        })

        if (scene) {
            const fuser = decodeURIComponent(scene).split('=');
            if (fuser.length > 1) {
                Taro.setStorageSync('fuser', fuser[1]);
            }
        }
        if (fromuser) {
            Taro.setStorageSync('fuser', fromuser);
        }

        if (global.msgParams !== undefined && Object.keys(global.msgParams).length > 0) {
            this._snpwd(global.msgParams);
        }

    }

    componentDidMount() {
        var that = this;

        // that._onRefresh();
        that.adpopup();
        this.getRegion();
        that.getSigins();
        // Taro.navigateTo({
        //     url:menu.s_Map
        // })
    }
    getSigins = () => {
        Date.prototype.format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1,                 //月份 
                "d+": this.getDate(),                    //日 
                "h+": this.getHours(),                   //小时 
                "m+": this.getMinutes(),                 //分 
                "s+": this.getSeconds(),                 //秒 
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                "S": this.getMilliseconds()             //毫秒 
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        }
        let dates = new Date().format("yyyy-MM-dd");
        let mon = dates.split('-')[1];
        let date = dates.split('-')[2];
        this.setState({
            mon:mon,
            date:date
        })
        api.get(inter.getSigns)
            .then(res => {
                let time = res.data.data.filter(item => item.date == dates)
                this.setState({ statuss: time[0].status })
            })
    }
    componentWillUnmount() {
        this.isHomePage = false;
        global.updateMsgParams();

    }

    componentDidShow() {
        var that = this;
        const token = Taro.getStorageSync('token')
        const tips = Taro.getStorageSync('comps')
        let cmic_type = 2

        this.setState({
            loginStatus: token != '',
            keyword: '',
            tip: tips
        })
        that.getConfigs()
        that.getUser();
        //Ets.trigger('test', 'aaaa');
        that.isHomePage = true;
        // that.getRead();
        // that.getAdBanner();
        // that.getCourseLive();
        // that.getSite();
        // that.getSiteIndex();
        // that.getSiteMenu();
        // that.getUserMsgUread()
        that._onRefresh()
        // that._snpwd('tt');


        // that.backgroundAudioManager = app.globalData.backgroundPlayer;

        // if(that.backgroundAudioManager.src !== undefined){

        //     Taro.getBackgroundAudioPlayerState({
        //         success: res=>{
        //             if(res.errMsg === 'getBackgroundAudioPlayerState:ok'){
        //                 if(res.status === 0){
        //                     cmic_type = 0
        //                 } else if(res.status === 1){
        //                     cmic_type = 1
        //                 } else if(res.status === 2){
        //                     cmic_type = 2
        //                 }

        //                 that.setState({
        //                     cmic_type:cmic_type,
        //                     cmic_duration:res.duration
        //                 })
        //             }
        //         }
        //     })
        // }
        let pages = Taro.getCurrentPages();
        let currPage = pages[pages.length - 1]; // 获取当前页面
        if (currPage.__data__.keyword) { // 获取值
            this.setState({ keywords: currPage.__data__.keywords })
        }

    }
    getConfigs = () => {
        api.get(inter.Config)
            .then(res => {
                let lst = res.data.data.ui_choose_field
                let field = JSON.parse(lst)
                this.setState({
                    field: field
                })

            })
    }
    componentDidHide() { }

    _onRefresh() {
        var that = this;

        that.getAdBanner()
        that.getSite();
        that.getTeacherLeader()
        that.getTeacherRecom()

        that.getSiteIndex();
        that.getSiteMenu();
        that.getBackLive();
        that.getCourseLive()
        that.getArticlerecomm()
        that.getUserMsgUread()
        that.getConfig()
        that.getRecomm()
        that.getRead()

        // that._snpwd('2332');

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

    getUser() {
        var that = this
        api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    let userData = res.data.data
                    that.setState({
                        userId: userData.userId,
                        userStatus: userData.status,
                        isAuth: userData.isAuth,
                    })
                    that.getCoupon()
                }
            })
    }
    getCoupon = () => {
        api.get('/user/coupon/login')
            .then(res => {
                // console.log(res)
                if (res.data.status) {
                    if (res.data.data.length > 0) {
                        this.setState({
                            ttyp: 1,
                            coupons: res.data.data,
                        })
                    }
                }
            })
    }

    // 从另一个小程序 接受   登录
    _snpwd(msgParams) {

        var that = this;

        Taro.showModal({
            title: msgParams.sn,
            content: msgParams.sn
        })

        api.post(inter.snpwd, {
            sn: msgParams.sn
        }).then((res) => {
            if (res.data.status) {
                let data = res.data.data;
                if (data.reqType === 'login') {
                    Taro.setStorageSync('token', data.token);
                    that.getUser();
                    Taro.showModal({
                        title: msgParams.sn,
                        content: data.token
                    })
                    Taro.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 2000,
                    })

                } else if (data.reqType === 'pwd') {
                    this.setState({
                        snpwd_sn: data.token,
                        snpwdType: true,
                    })
                } else if (data.reqType === 'auth') {
                    Taro.setStorageSync('snpwd_sn', data.token);
                    Taro.showModal({
                        title: '提示',
                        content: '需要先登录',
                        showCancel: false,
                        confirmText: '确认登录',
                        success: res => {
                            if (res.confirm) {
                                that.refs.auth.doLogin();
                            }
                        }
                    })
                }
            }
        })
    }


    //  输入密码 再次登录
    _pwdSnpwd() {

        var that = this;
        const { snpwd_sn, snpwd_pwd } = that.state;

        api.post(inter.snpwd, {
            sn: snpwd_sn,
            pwd: snpwd_pwd,
        }).then((res) => {
            if (res.data.status) {

                let data = res.data.data;
                if (data.reqType === 'pwd') {

                    Taro.showToast({
                        title: '密码错误',
                        icon: 'none',
                        duration: 2000,
                    })

                } else if (data.reqType === 'login') {

                    Taro.setStorageSync('token', data.token);
                    that.getUser();

                    this.setState({
                        snpwdType: false
                    })

                    Taro.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 2000,
                    })
                }

            }
        })
    }


    // 顶部高度适应
    _setbatHeight() {
        var that = this
        var sysinfo = Taro.getSystemInfoSync()
        var navHeight: number = 44
        var cpHeight: number = 40
        var isiOS = sysinfo.system.indexOf('iOS') > -1
        if (!isiOS) {
            cpHeight = 48
            navHeight = sysinfo.statusBarHeight;
        } else {
            cpHeight = 40
            navHeight = sysinfo.statusBarHeight;
        }

        that.setState({
            navHeight: navHeight,
            capHeight: cpHeight
        })
    }


    //首页分享
    onShareAppMessage(res) {
        // console.log(res);


        api.post(inter.userLog, {
            log_type: 1,
            type: 1,
            device_id: 0,
            intro: '分享首页',
            content_id: 0,
            param: JSON.stringify({ name: '首页', cctype: 0, ttype: 0 }),
            from: 0,
        }).then((res) => {

        })
        if (res.from === 'button') {
            // 来自页面内转发按钮

        }
        return {
            title: '油葱学堂',
            path: '/pages/index/index',
            // success:function(res){
            //     console.log(res);
            // }

        }
    }

    getSite() {
        var that = this;
        that.props.getSite()
    }

    getTeacherRecom() {
        var that = this
        that.props.getTeacherRecom()
    }


    getSiteIndex() {
        var that = this;
        that.props.getSiteIndex();
    }

    getSiteMenu() {
        var that = this;
        that.props.getSiteMenu({
            type: '',
            mark: '',
            page: ''
        });
    }



    //直播数据
    getCourseLive = () => {
        const { regionId } = this.state
        var that = this;
        api.get(inter.CourseLive, {
            region_id: regionId,
            status: 0,
            sort: 0,
            page: 0,
            ctype: -1,
        }).then((res) => {
            if (res.data.status) {
                that.setState({
                    liveList: res.data.data.items
                })
            }
        })
    }

    //猜你喜欢
    getRecomm() {
        api.get(inter.CourseRecomm, {
            limit: 8
        }).then((res) => {
            this.setState({
                recommList: res.data.data
            })
        })
    }


    adpopup() {
        api.get(inter.ConfigAdpop)
            .then((res) => {
                if (res.data.status) {
                    this.setState({
                        adpopups: res.data.data,
                    }, () => {
                        if (res.data.data.length > 0) {
                            this._tipPopup()
                        }
                    })
                }
            })
    }

    getTeacherLeader() {
        var that = this;
        that.props.getTeacherLeader()
    }

    getUserMsgUread() {
        var that = this;
        that.props.getUserMsgUread()
    }

    getConfig() {
        var that = this
        that.props.getConfig()
    }

    getArticlerecomm() {

        var that = this

        api.get(inter.Articlerecomm)
            .then((res) => {
                if (res.data.status) {
                    that.setState({
                        consultList: res.data.data
                    })
                }
            })
    }

    getAdBanner = () => {
        var that = this
        that.props.getConfigAd()
    }



    _onMessage() {
        var that = this
        const { userId } = that.state
        if (userId > 0) {
            Taro.navigateTo({
                url: menu.message
            })
        } else {
            that.refs.auth.doLogin();
        }

    }

    getBackLive() {
        var that = this;

        api.get(inter.CourseLive, {
            status: 1,
            sort: 0,
            page: 0,
        }).then((res) => {
            if (res.data.status) {
                let liveLists = res.data.data.items
                liveLists.slice(0, 5);
                that.setState({
                    liveSlist: liveLists,
                })
            }
        })
    }

    //详情页
    _oncourseDesc(recom) {
        if (recom.ctype === 3) {
            Taro.navigateTo({
                url: menu.grapWbdesc + `?course_id=${recom.courseId}` + '&courseName=' + percent2percent25(`${recom.courseName}`)
            })
        } else if (recom.ctype === 0) {
            Taro.navigateTo({
                url: menu.courseDesc + `?course_id=${recom.courseId}` + '&courseName=' + percent2percent25(`${recom.courseName}`) + '&isback=0'
            })
        } else if (recom.ctype === 1) {
            Taro.navigateTo({ url: menu.audioDesc + '?course_id=' + recom.courseId + '&audioName=' + percent2percent25(recom.courseName) })
        }
    }

    // //课程图文列表
    _oncourseList(item) {

        if (item.data.ctype === 3) {
            Taro.navigateTo({
                url: menu.indexGraphic + '?channel_id=' + `${item.data.channelId}` + '&channelName=' + percent2percent25(`${item.data.channelName}`)
            })
        } else if (item.data.ctype === 0 || item.data.ctype === 1) {
            Taro.navigateTo({
                url: menu.indexCourse + '?channel_id=' + `${item.data.channelId}` + '&channelName=' + percent2percent25(`${item.data.channelName}`)
            })
        }
    }

    //课程图文列表
    // _oncourseList(item){
    //     if(item.ctype === 3){
    //         Taro.navigateTo({
    //             url:menu.indexGraphic+'?channel_id='+`${item.data.channelId}` + '&channelName=' + `${item.data.channelName}`
    //         })
    //     } else {
    //         Taro.navigateTo({
    //             url:menu.indexCourse+'?channel_id='+`${item.data.channelId}` + '&channelName=' + `${item..data.channelName}`
    //         })
    //     }
    // }

    _onGrapDesc(grap) {
        Taro.navigateTo({
            url: menu.grapWbdesc + `?course_id=${grap.courseId}` + '&courseName=' + percent2percent25(`${grap.courseName}`)
        })
    }

    _onAudioDesc(recomm) {
        Taro.navigateTo({ url: menu.audioDesc + '?course_id=' + recomm.courseId + '&audioName=' + percent2percent25(recomm.courseName) })
    }

    _livedesc(item) {
        Taro.navigateTo({
            url: menu.courseDesc + `?course_id=${item.courseId}` + '&courseName=' + percent2percent25(`${item.courseName}`) + '&isback=1'
        })
    }

    // 活动
    artDesc(article) {
        Taro.navigateTo({
            url: menu.activityDesc + '?activityId=' + article.activityId + '&articleName=' + percent2percent25(article.title) + '&atype=' + article.atype
        })
    }

    // 专题
    columnDesc(article) {
        Taro.navigateTo({
            url: menu.projectDesc + '?articleId=' + article.articleId + '&articleName=' + percent2percent25(article.title)
        })
    }

    // 资讯详情
    _consultDesc(art) {

        if (art.isLink === 1) {
            Taro.navigateTo({ url: menu.adWebView + '?link=' + `${encodeURIComponent(art.link)}` + '&ad=""' })
        } else {
            Taro.navigateTo({ url: menu.consultDesc + '?articleId=' + art.articleId + '&cousultName=' + percent2percent25(art.title) })
        }

    }

    getRead() {
        api.get(inter.MessageUnRead)
            .then(res => {
                if (res.data.status) {
                    let msgread = res.data.data
                    this.setState({
                        message: msgread.message,
                        remind: msgread.remind,
                        courseRemind: msgread.courseRemind
                    })
                } else {
                    this.setState({
                        message: 0,
                        remind: 0,
                        courseRemind: 0,
                    })
                }
            })
    }

    //广告位判断
    onAdLink(ad) {
        let adlink = ad.link
        api.post(inter.saveHistory, {
            type: 1,
            billboard_id: ad.billboardId
        })
            .then(res => {
                // console.log(res)
            })
        if (adlink !== '') {
            if (adlink.substring(0, 4) == 'http') {
                let adl = encodeURIComponent(ad.link)
                let dl = decodeURIComponent(adl)
                Taro.navigateTo({ url: menu.adWebView + '?link=' + `${adl}` })
            } else {
                Taro.navigateTo({
                    url: adlink
                })
            }
        }

    }



    //换一批
    _update_recom() {
        api.get(inter.CourseRecomm, {
            limit: 8
        }).then((res) => {
            this.setState({
                recommList: res.data.data
            })
        })
    }

    // 回到顶部
    _toTop() {
        Taro.pageScrollTo({
            scrollTop: 0
        })
    }


    //超一屏显示火箭按钮
    onPageScroll(e) {
        // 获取滚动条当前位置
        var that = this
        let windowHeight: number = 667
        Taro.getSystemInfo({
            success: function (res) {
                windowHeight = res.windowHeight
            }
        })

        if (e.scrollTop > windowHeight) {
            that.setState({
                isTopShow: true
            })
        } else {
            that.setState({
                isTopShow: false
            })
        }
    }

    _onSwiper(e) {
        var that = this
        that.setState({
            current: e.detail.current
        })
        that.ts++;
        if (that.ts % 10 === 0) {

            that.getCourseLive();
        }
    }

    _offAdtip() {
        var that = this
        const { adpopups } = this.state;

        const popupidx = adpopups.length
        const popuID = adpopups[popupidx - 1].billboardId;
        Taro.setStorageSync('adpopup', popuID);
        api.post(inter.saveHistory, {
            type: 0,
            billboard_id: popuID
        })
            .then(res => {
                // console.log(res)
            })
        that.setState({
            ad_type: false
        })
    }

    onAdPopupLink(popup) {
        var that = this;
        let adlink = popup.link;

        if (adlink.length > 0) {
            that.setState({
                ad_type: false,
            })
            if (adlink.substring(0, 4) == 'http') {
                Taro.navigateTo({ url: menu.adWebView + '?link=' + `${popup.link}` })
            } else {
                Taro.navigateTo({
                    url: adlink
                })
            }
        }
    }

    _tipPopup() {
        var that = this;

        const { adpopups, Spopup } = that.state;
        const popupidx = adpopups.length
        const popuID = adpopups[popupidx - 1].billboardId;

        // console.log(popuID,'popuID',Spopup);

        if (Spopup !== popuID) {
            that.setState({
                ad_type: true
            })
        }

    }

    //排序
    compare(prop) {
        return function (obj1, obj2) {
            var val1 = obj1[prop];
            var val2 = obj2[prop];
            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                val1 = Number(val1);
                val2 = Number(val2);
            }
            if (val1 > val2) {
                return -1;
            } else if (val1 < val2) {
                return 1;
            } else {
                return 0;
            }
        }
    }


    // 去商城
    _toMail() {

        var that = this;
        const { userId } = that.state
        api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    Taro.navigateTo({ url: menu.mailIndex })
                } else {
                    this.refs.auth.doLogin();
                }
            })
    }

    handleStop(e) {
        e.stopPropagation()
    }

    // 预约
    _makelive(lives) {
        var that = this;
        const { userId } = that.state;
        that.setState({
            liveResetTime: lives.resetTime
        })
        if (userId > 0) {
            let tmpId = 'bH2whf7pY40T4COena9BrTi3jPQDM4Ls9CRaEW7ycqU'
            Taro.requestSubscribeMessage({
                tmplIds: [tmpId],
                success(res) {
                    if (res[tmpId] === 'accept') {
                        api.post(inter.bookCourse + lives.courseId, {
                            form_id: 'wxapp'
                        }).then((res) => {
                            if (res.data.status) {
                                that.getCourseLive();
                                that.setState({
                                    show_pannel: true
                                })
                            }
                        })
                    } else {
                        console.log(' jijue')
                    }
                }
            })

        } else {
            that.refs.auth.doLogin();
        }
    }

    //登录回调
    _onLoadCallBack() {
        this.getRead();

        this.getCourseLive();
        api.get(inter.User)
            .then(res => {
                if (res.data.status) {
                    let userData = res.data.data
                    this.setState({
                        userId: userData.userId,
                    })
                    Taro.showToast({
                        title: '登录成功'
                    })
                }
            })
        this.setState({
            loginStatus: true
        })
    }



    _onSelect = (index) => {

        var that = this;

        this.page = 0;
        that.setState({
            tabStatus: index,
            MenuList: [],
            page: 0
        }, () => {
            if (index === 0) {
                that.getSiteIndex()
            } else {
                that._getIndexTabList()
            }

        })

    }

    _getIndexTabList() {
        var that = this;
        const { indexMenu, tabStatus, MenuList, page } = that.state
        if (tabStatus > 0) {
            api.get(inter.IndexTabList, {
                type: indexMenu[tabStatus - 1].type,
                mark: indexMenu[tabStatus - 1].mark,
                page: this.page
            }).then((res) => {
                if (res.data.status) {

                    let mList = res.data.data.data

                    if (this.page === 0) {
                        var tList = mList.items
                    } else {
                        var tList: any = MenuList.concat(mList.items)
                    }

                    that.setState({
                        MenuList: tList,
                        page: mList.page,
                        pages: mList.pages,
                        total: mList.total,
                    })
                }
            })
        }

    }


    //关注老师
    _onFollow(lect, index) {
        const that = this
        const { MenuList } = that.state
        api.post(inter.PublishFollow + lect.teacherId).then((res) => {
            if (res.data.status) {
                Taro.showToast({
                    title: '关注成功',
                    icon: 'none'
                })
                MenuList[index].isFollow = !MenuList[index].isFollow
                that.setState({
                    MenuList: MenuList
                })
            } else {
                Taro.showToast({
                    title: '关注失败',
                    icon: 'none'
                })
            }
        })
    }

    //取消关注
    _offFollow(lect, index) {
        const that = this
        const { MenuList } = that.state
        api.post(inter.RemoveFollow + lect.teacherId).then((res) => {
            if (res.data.status) {
                Taro.showToast({
                    title: '取消成功',
                    icon: 'none'
                })
                MenuList[index].isFollow = !MenuList[index].isFollow
                that.setState({
                    MenuList: MenuList
                })
            } else {
                Taro.showToast({
                    title: '取消失败',
                    icon: 'none'
                })
            }
        })
    }

    //下啦
    onPullDownRefresh() {
        var that = this;
        const { tabStatus } = that.state



        if (tabStatus === 0) {
            that.props.getSite()
            that.props.getConfigAd()
            that.props.getConfig()
            that.props.getUserMsgUread()
            that.getRecomm();
            that.getCourseLive()
            that._onRefresh()
        } else {
            this.page = 0;

            that.setState({
                page: 0,
                MenuList: []
            }, () => {
                that._getIndexTabList();
            })
        }


        setTimeout(function () {
            //执行ajax请求后停止下拉
            Taro.stopPullDownRefresh();
        }, 1000);
    }

    //上啦
    onReachBottom() {
        var self = this;

        const { page, pages, tabStatus, IndexMenuTab } = self.state



        if (tabStatus > 0 && IndexMenuTab[tabStatus - 1] !== 'channel' && IndexMenuTab[tabStatus - 1] !== 'leader' && IndexMenuTab[tabStatus - 1] !== 'teacher') {
            if (page < pages) {
                this.page = this.page + 1
                let page_p = page + 1
                self.setState({
                    page: page_p
                })
                self._getIndexTabList()
            }
        }

    }


    _onSwitchTab(status) {

        Taro.setStorageSync("findStatus", status);
        Taro.switchTab({ url: menu.find })
    }

    onCloses = () => {
        const { coupons } = this.state
        var that = this
        Taro.setStorageSync('comps', coupons[0].couponId)
        that.setState({
            ttyp: 0,
        })
    }
    onPick = (val) => {
        const { areas, region } = this.state
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
            this.getCourseLive()
        })
    }
    onMap = () => {
        const { userId, isAuth } = this.state
        if (userId > 0) {
            if (isAuth === 1) {
                Taro.navigateTo({
                    url: menu.s_Map
                })
            } else {
                Taro.showToast({
                    title: '学习地图仅对特定对象可见',
                    icon: 'none',
                    duration: 1000,
                })
            }
        } else {
            this.refs.auth.doLogin();
        }
    }
    // 签到
    _signIn = () => {
        var that = this
        if(this.state.userId){
            api.post(inter.signIn).then((res)=>{
                that.getSigins()
                if(res.data.status){
                    Taro.showToast({
                        title:'签到成功',
                        icon:'none',
                        duration:1000
                    })
                    that.getUser()
                    api.get('/config/day/check/img')
                    .then(ress => {
                        // wx.downloadFile({
                        //     url:ress.data.data,
                        //     success: (resss) => {
                        //       wx.showShareImageMenu({
                        //         path: resss.tempFilePath
                        //       })
                        //     }
                        //   })
                        Taro.navigateTo({url:menu.qiandaoImg+'?path='+ress.data.data})
                    })
                    
                } else {
                    Taro.showToast({
                        title:'已经签到',
                        icon:'none',
                        duration:1000
                    })
                }
            })
        }else{
            Taro.showToast({
                title:'请先登录',
                icon:'none',
                duration:1000
            })
        }
    }
    _signIns=()=>{
        Taro.showToast({
            title:'已经签到',
            icon:'none',
            duration:1000
        })
    }
    render() {
        const { home } = this.props
        const { updateData, siteList } = home

        const { userId, live_icon, mall_icon, course_icon, keyword, keywords, liveSlist, num, liveResetTime, show_pannel, liveList, recommList, adpopups, ad_type, topNum, remind, message, courseRemind, searchdefult, teacherRecomm, adList, isTopShow, navHeight, capHeight, current, tabStatus, cmic_type, cmic_duration, IndexSortList, indexMenu, MenuList, IndexMenuTab, teachLeader, consultList, snpwdType, snpwd_pwd, snpwd_sn, ttyp, coupons, tip, region, field } = this.state;

        teacherRecomm.sort(this.compare("follow"))
        let consultReList = consultList.slice(0, 3)
        let recommReList = recommList.slice(0, 4)

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

        let IndexSort: any = [] //  首页模版排序
        let IndexMenus: string[] = new Array("全部")

        for (let j = 0; j < indexMenu.length; j++) {
            if (indexMenu[j].name === 'teacher') {
                IndexMenus.push('讲师专区')
            } else if (indexMenu[j].name === 'leader') {
                IndexMenus.push('领导风采')
            } else if (indexMenu[j].name === 'article') {
                IndexMenus.push('资讯专栏')
            } else if (indexMenu[j].name === 'activity') {
                IndexMenus.push('活动')
            } else if (indexMenu[j].name === 'column') {
                IndexMenus.push('专题')
            } else {
                IndexMenus.push(indexMenu[j].name)
            }
        }

        setTimeout(() => {
            if (num < searchdefult.length - 1) {
                this.setState({
                    num: num + 1
                })
            } else {
                this.setState({
                    num: 0
                })
            }
        }, 5000);
        return (
            <View className='indexwrap'>
                <View className=''>
                    <View className="indexHead">
                        <View style={{ height: navHeight + 'px', width: '100%' }}></View>
                        <View style={{ height: capHeight + 'px', width: '100%' }} className='d_flex jc_ct ai_ct'>
                            <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/headertit.png'} style={{ width: '174rpx', height: '40rpx' }} />
                        </View>
                        <View className='searchbox d_flex fd_r pt_12  ai_ct pl_10 pr_15'>
                            <View className='search_action mr_10'
                                onClick={this._onMessage.bind(this)}
                            >
                                <Image src={asset.msg_icon} className='msg_icon' />
                                {
                                    remind + message + courseRemind > 0 ?
                                        <View className='search_tip'>
                                            <Text className='sm9_label white_label'>{remind + message + courseRemind > 99 ? 99 + "+" : remind + message + courseRemind}</Text>
                                        </View>
                                        : null}
                            </View>
                            <View className='search_input d_flex fd_r ai_ct col_1 pl_12'
                                onClick={() => { Taro.navigateTo({ url: menu.search + '?keyword=' + keyword }) }}
                            >
                                <Image src={asset.search} className='search_icon' />
                                <View className='search_text pl_5'>
                                    {
                                        !keywords || keywords == searchdefult[0] ?
                                            <Text className='default_label  tip_label'>{searchdefult[num]}</Text>
                                            :
                                            <Text className='default_label  tip_label'>{keywords}</Text>
                                    }
                                </View>
                            </View>
                            {/* <View className='search_action' 
                                onClick={this._onMessage.bind(this)}
                            >
                                <Image src={asset.msg_icon} className='msg_icon'  />
                                {
                                    remind+message+courseRemind > 0  ?
                                    <View className='search_tip'>
                                        <Text className='sm9_label white_label'>{remind+message+courseRemind > 99 ? 99+"+" : remind+message+courseRemind}</Text>
                                    </View>
                                :null}
                            </View> */}

                            <View className='ml_10' onClick={() => Taro.navigateTo({ url: menu.courseCate })}>
                                <Image src={asset.cate_h_icon} className='cate_h_icon' />
                            </View>
                        </View>
                        {
                            IndexMenus.length > 1 ?
                                <View className='tabbox pb_10'>
                                    <Tabs items={IndexMenus} atype={0} type={0} selected={tabStatus} onSelect={this._onSelect} />
                                </View>
                                : null}

                    </View>
                    <ScrollView
                        scrollY
                        scrollTop={topNum}
                        scrollWithAnimation
                        enableBackToTop={true}
                        scrollIntoView='C'
                        className='indexCons'
                        style={{ paddingTop: (navHeight + capHeight + 65 + 30) * 2 + 'rpx' }}
                    >
                        {
                            tabStatus === 0 ?
                                <View className='' style={ttyp == 1 && tip != coupons[0].couponId ? { height: '78vh', overflow: 'hidden' } : null}>
                                    {
                                        this.state.qiandao ?
                                            <View className='mt_15'>
                                                <View className='qiandao' onClick={this.state.statuss == 0 ?this._signIn:this._signIns}>
                                                    <Image src={this.state.qian_img} style={{ width: '100%', height: '100%' }} />
                                                    {
                                                        this.state.statuss == 0 ?
                                                            <View className='qd_btn'>立即签到</View>
                                                            :
                                                            <View className='qd_btns'>已签到</View>
                                                    }
                                                    <View className='datess'>
                                                        <View className='das'>{this.state.mon}</View>
                                                        <View className='white_label sm_label ml_2'>月</View>
                                                        <View  className='das ml_2'>{this.state.date}</View>
                                                        <View className='white_label sm_label ml_2'>日</View>
                                                    </View>
                                                </View>
                                            </View>
                                            : null
                                    }

                                    <View className='swiper_cons mt_15'>
                                        <Swiper
                                            className='swiper3D'
                                            indicatorColor='rgba(255,255,355,0.49)'
                                            indicatorActiveColor='#ffffff'
                                            vertical={false}
                                            circular
                                            indicatorDots
                                            autoplay
                                            duration={1000}
                                            interval={5000}
                                            previous-margin='50rpx'
                                            next-margin='50rpx'
                                            onChange={(e) => this._onSwiper(e)}
                                        >
                                            {
                                                adList.map((ad: any, index) => {
                                                    const on = current == index

                                                    return (
                                                        <SwiperItem className={on ? 'active' : 'normal'} key={'ad' + index} >
                                                            <View className={'swiper_item'}>
                                                                <Image
                                                                    className={'swiper_img'}
                                                                    src={ad.fileUrl}
                                                                    onClick={this.onAdLink.bind(this, ad)}
                                                                />
                                                            </View>
                                                        </SwiperItem>
                                                    )
                                                })
                                            }
                                        </Swiper>
                                    </View>
                                    <View className='cateList'>
                                        {/* <View className='cateItem'
                                            style={{ width: ((windowWidth - 72) / 5).toFixed(0) + 'px' }}
                                            onClick={() => Taro.navigateTo({ url: menu.liveNotice })}
                                        // onClick={()=>{Taro.showToast({title:'功能暂未开发',icon:'none',duration:1500})}}
                                        >
                                            <View className='cateCover'>
                                                <Image src={field.live} style={{ width: 110 + 'rpx', height: 110 + 'rpx' }} />
                                            </View>
                                            <Text className='block_label sm_label'>直播</Text>
                                        </View> */}
                                        <View className='cateItem'
                                            style={{ width: ((windowWidth - 72) / 5).toFixed(0) + 'px' }}
                                            onClick={this.onMap}
                                        >
                                            <View className='cateCover'>
                                                <Image src={field.map} style={{ width: 110 + 'rpx', height: 110 + 'rpx' }} />
                                            </View>
                                            <Text className='block_label sm_label '>学习地图</Text>
                                        </View>
                                        <View className='cateItem'
                                            style={{ width: ((windowWidth - 72) / 5).toFixed(0) + 'px' }}
                                            onClick={() => Taro.navigateTo({ url: menu.courseCate })}
                                        >
                                            <View className='cateCover'>
                                                <Image src={field.cate} style={{ width: 110 + 'rpx', height: 110 + 'rpx' }} />
                                            </View>
                                            <Text className='block_label sm_label '>全部课程</Text>
                                        </View>
                                        <View className='cateItem'
                                            style={{ width: ((windowWidth - 72) / 5).toFixed(0) + 'px' }}
                                            onClick={() => Taro.navigateTo({ url: menu.profesSkill + '?userId=' + userId })}
                                        >
                                            <View className='cateCover'>
                                                <Image src={field.squad} style={{ width: 110 + 'rpx', height: 110 + 'rpx' }} />
                                            </View>
                                            <Text className='block_label sm_label '>培训班</Text>
                                        </View>
                                        <View className='cateItem' style={{ width: ((windowWidth - 72) / 5).toFixed(0) + 'px' }}
                                            onClick={this._toMail}
                                        >
                                            <View className='cateCover'>
                                                <Image src={field.mall_icon} style={{ width: 110 + 'rpx', height: 110 + 'rpx' }} />
                                            </View>
                                            <Text className='block_label sm_label '>学分换购</Text>
                                        </View>
                                        {/* <View className='cateItem'
                                            style={{ width: ((windowWidth - 72) / 5).toFixed(0) + 'px' }}
                                            onClick={() => Taro.showToast({ title: '敬请期待', icon: 'none', duration: 1500 })}
                                        >
                                            <View className='cateCover'>
                                                <Image src={field.pk} style={{ width: 110 + 'rpx', height: 110 + 'rpx' }} />
                                            </View>
                                            <Text className='block_label sm_label '>pk赛场</Text>
                                        </View>
                                        <View className='cateItem'
                                            style={{ width: ((windowWidth - 72) / 5).toFixed(0) + 'px' }}
                                            onClick={() => Taro.showToast({ title: '敬请期待', icon: 'none', duration: 1500 })}
                                        >
                                            <View className='cateCover'>
                                                <Image src={field.forest} style={{ width: 110 + 'rpx', height: 110 + 'rpx' }} />
                                            </View>
                                            <Text className='block_label sm_label '>完美林</Text>
                                        </View> */}
                                        <View className='cateItem'
                                            style={{ width: ((windowWidth - 72) / 5).toFixed(0) + 'px' }}
                                            onClick={() => Taro.navigateTo({ url: menu.ask })}
                                        >
                                            <View className='cateCover'>
                                                <Image src={field.forum} style={{ width: 110 + 'rpx', height: 110 + 'rpx' }} />
                                            </View>
                                            <Text className='block_label sm_label '>问吧</Text>
                                        </View>


                                    </View>
                                    {/* <View className='cateList'>

                                        <View className='cateItem'
                                            style={{ width: ((windowWidth - 72) / 5).toFixed(0) + 'px' }}
                                            onClick={() => Taro.navigateTo({ url: menu.seminar })}
                                        >
                                            <View className='cateCover'>
                                                <Image src={field.seminar} style={{ width: 110 + 'rpx', height: 110 + 'rpx' }} />
                                            </View>
                                            <Text className='block_label sm_label '>研讨会</Text>
                                        </View>
                                        <View className='cateItem'
                                            style={{ width: ((windowWidth - 72) / 5).toFixed(0) + 'px' }}
                                            onClick={() => Taro.navigateTo({ url: menu.searchList + '?ctype=0&btype=0' + '&keyword=' })}
                                        >
                                            <View className='cateCover'>
                                                <Image src={field.course} style={{ width: 110 + 'rpx', height: 110 + 'rpx' }} />
                                            </View>
                                            <Text className='block_label sm_label '>视频课程</Text>
                                        </View>
                                        <View className='cateItem'
                                            style={{ width: ((windowWidth - 72) / 5).toFixed(0) + 'px' }}
                                            onClick={() => Taro.navigateTo({ url: menu.searchList + '?ctype=1&btype=0' + '&keyword=' })}
                                        >
                                            <View className='cateCover'>
                                                <Image src={field.audio} style={{ width: 110 + 'rpx', height: 110 + 'rpx' }} />
                                            </View>
                                            <Text className='block_label sm_label '>音频课程</Text>
                                        </View>
                                        
                                    </View> */}

                                    {/* 回放 */}
                                    {
                                        liveSlist.length > 0 ?
                                            <View className='liveback_box,ml_15,mr_15 mt_15'>
                                                <View className='d_flex fd_r ai_ct pl_15 mr_10'>
                                                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/live_replay.png'} className='back_cover mr_10' />
                                                </View>
                                                <Swiper
                                                    className='liveback_sw'
                                                    indicatorDots={false}
                                                    vertical
                                                    circular
                                                    autoplay>
                                                    {
                                                        liveSlist.map((item: any, index) => {
                                                            return (
                                                                <SwiperItem className='liveback_sw_it' key={'item' + index} onClick={this._livedesc.bind(this, item)}>
                                                                    <Text className='default_label  c33_label'>{subNumTxt(item.courseName, 10)}</Text>
                                                                </SwiperItem>
                                                            )
                                                        })
                                                    }
                                                </Swiper>
                                                <View className='d_flex fd_r ai_ct jc_ct pr_15 pl_12' onClick={() => Taro.navigateTo({ url: menu.liveBack })}>
                                                    <Text className='tip_label default_label fw_label'>全部</Text>
                                                    <Image src={asset.arrow_right} className='arrow_right' />
                                                </View>
                                            </View>
                                            : null}
                                    {/* live */}
                                    {/* {
                                        liveList.length > 0 ? */}
                                    <View className='live_box,ml_15,mr_15 mt_15'>
                                        <View className='tipss'>
                                            <View className='d_flex'>
                                                <View className='tiss'>直播课程</View>
                                                <Picker mode='selector' range={this.state.areas} onChange={this.onPick}>
                                                    <View className='otip'>
                                                        <View>{this.state.areaName}</View>
                                                        <Image src={asset.right_or} className='size_4 ml_5' />
                                                    </View>
                                                </Picker>
                                            </View>
                                            <View className='jcc' onClick={() => { Taro.navigateTo({ url: menu.liveNotice }) }}>
                                                <View className='tip_label default_label fw_label'>更多</View>
                                                <Image src={asset.arrow_right} className='arrow_right' />
                                            </View>
                                        </View>
                                        {
                                            liveList.map((lives: any, index) => {
                                                if (lives.plant == 0 || lives.plant == 1 && liveList.length > 0) {
                                                    return (
                                                        <View className='p_15,bg_white,circle_5,mb_15' key={'live' + index}
                                                            onClick={() => {
                                                                if (lives.ctype == 52) {
                                                                    Taro.navigateTo({ url: menu.actveLive + '?courseId=' + lives.courseId + '&liveStatus=' + lives.liveStatus + '&liveName=' + lives.courseName })
                                                                } else {
                                                                    Taro.navigateTo({ url: menu.liveDesc + '?courseId=' + lives.courseId + '&liveStatus=' + lives.liveStatus + '&liveName=' + lives.courseName })
                                                                }
                                                            }}
                                                        >
                                                            <View className='d_flex fd_r,jc_sb,pb_10,border_bt'>
                                                                {
                                                                    lives.liveStatus === 0 && lives.roomStatus === 0 ?
                                                                        <Text className='gray_label,sm_label'>{liveday(lives.beginTime)}</Text>
                                                                        : null}
                                                                {
                                                                    lives.liveStatus === 1 && lives.roomStatus === 2 ?
                                                                        <Text className='red_label,sm_label'>直播中</Text>
                                                                        : null}
                                                                {
                                                                    (lives.liveStatus === 2 && lives.roomStatus === 0) || (lives.liveStatus === 2 && lives.roomStatus === 1) ?
                                                                        <Text className='gray_label,sm_label'>休息中</Text>
                                                                        : null}
                                                                {
                                                                    lives.liveStatus === 2 && lives.roomStatus === 3 ?
                                                                        <Text className='red_label,sm_label'>已结束</Text>
                                                                        : null}

                                                                {
                                                                    lives.liveStatus === 0 && lives.roomStatus === 0 ?
                                                                        <Text className='sm_label,tip_label'>{lives.bookNum}人已预约</Text>
                                                                        :
                                                                        <Text className='sm_label,tip_label'>{lives.hit}人观看</Text>
                                                                }
                                                            </View>
                                                            <View className='pt_10'>
                                                                <Text className='c33_label,lg_label,fw_label'>{lives.courseName}</Text>
                                                                <View className='d_flex fd_r,jc_sb,pt_5,ai_ct'  >
                                                                    <Text className='sm_label,gray_label col_1'>{lives.summary}</Text>
                                                                    {
                                                                        lives.liveStatus === 0 && lives.roomStatus === 0 ?
                                                                            <View>
                                                                                {
                                                                                    lives.book ?

                                                                                        <View className='live_btn ml_10'>
                                                                                            <Text className='sm_label,red_label}'>进入</Text>
                                                                                        </View>
                                                                                        :
                                                                                        <View onClick={this.handleStop.bind(this)}>
                                                                                            <View className='live_ofbtn ml_10' onClick={this._makelive.bind(this, lives)} >
                                                                                                <Text className='sm_label,white_label}'>预约</Text>
                                                                                            </View>
                                                                                        </View>
                                                                                }
                                                                            </View>
                                                                            :
                                                                            <View className=' live_btn ml_10'>
                                                                                <Text className='sm_label,red_label'>进入</Text>
                                                                            </View>
                                                                    }
                                                                </View>
                                                            </View>
                                                        </View>
                                                    );
                                                }
                                            })
                                        }
                                    </View>
                                    {/* : null} */}

                                    {/* 首页模块排序 */}
                                    {
                                        IndexSortList.map((sort, index) => {
                                            if (sort.data === null || sort.data === '' || sort.data === undefined) {
                                                return null
                                            }
                                            return (
                                                <View key={'sort' + index}>
                                                    {
                                                        sort.type === 'teacher' && sort.data.length > 0 ?
                                                            <View className='pl_15 pr_15'>
                                                                <View className='teachzone border_bt pb_20 pl_15 pr_15'>
                                                                    <View className='head pl_2 pr_2   d_flex fd_r jc_sb ai_ct'>
                                                                        <Text className='lg_label c33_label fw_label'>讲师专区</Text>
                                                                        <View className='d_flex fd_r ai_ct jc_ct' onClick={() => Taro.navigateTo({ url: menu.lecturer })}>
                                                                            <Text className='tip_label default_label fw_label'>全部</Text>
                                                                            <Image src={asset.arrow_right} className='arrow_right' />
                                                                        </View>
                                                                    </View>
                                                                    <ScrollView
                                                                        scrollX
                                                                        style={{ height: '380rpx' }}

                                                                    >
                                                                        <View className='teach d_flex mt_15 '>
                                                                            {
                                                                                sort.data.map((teach: any, techIndex) => {
                                                                                    return (

                                                                                        <View className='teach_item mr_20 d_flex fd_c ai_ct  '
                                                                                            onClick={() => Taro.navigateTo({ url: menu.teachZone + '?teacher_id=' + `${teach.teacherId}` })}
                                                                                            key={'item' + techIndex}
                                                                                        >
                                                                                            <Image className='teach_cover' src={teach.teacherImg} />
                                                                                            <Text className='c33_label default_label fw_label mt_10'>{teach.teacherName}</Text>
                                                                                            <View className='reach_bt d_flex fd_r jc_ct ai_ct mt_5'>
                                                                                                <Text className='tip_label sm_label'>{teach.follow}人关注</Text>
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
                                                        sort.type === 'leader' && sort.data.length > 0 ?
                                                            <View className='pl_15 pr_15'>
                                                                <View className='teachzone border_bt pb_20 pl_15 pr_15'>
                                                                    <View className='head pl_2 pr_2   d_flex fd_r jc_sb ai_ct'>
                                                                        <Text className='lg_label c33_label fw_label'>领导风采</Text>
                                                                    </View>
                                                                    <ScrollView
                                                                        scrollX
                                                                        style={{ height: '380rpx' }}
                                                                    >
                                                                        <View className='teach d_flex mt_15 '>
                                                                            {
                                                                                sort.data.map((leader, leaderIndex) => {
                                                                                    return (
                                                                                        <View className='teach_item mr_20 d_flex fd_c ai_ct' key={'leader' + leaderIndex}
                                                                                            onClick={() => Taro.navigateTo({ url: menu.leaderShip + '?teach_id=' + leader.teacherId })}
                                                                                        >
                                                                                            <Image className='teach_cover' src={leader.teacherImg} />
                                                                                            <Text className='c33_label default_label fw_label mt_10'>{leader.teacherName}</Text>
                                                                                            <Text className='tip_label sm_label mt_5'>{(leader.honor).substring(0, 6)}</Text>
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
                                                        sort.type === 'channel' && sort.data.courseList.length > 0 ?
                                                            <View className='pl_15 pr_15'>
                                                                <View className='recomm pt_25' >
                                                                    <View className='head pl_2 pr_2  pb_12 d_flex fd_r jc_sb ai_ct'>
                                                                        <Text className='lg_label c33_label fw_label'>{sort.data.channelName}</Text>
                                                                        <View className='d_flex fd_r ai_ct jc_ct'
                                                                            onClick={this._oncourseList.bind(this, sort)}
                                                                        >
                                                                            <Text className='tip_label default_label fw_label'>全部</Text>
                                                                            <Image src={asset.arrow_right} className='arrow_right' />
                                                                        </View>
                                                                    </View>
                                                                    {
                                                                        sort.data.ttype == 0 && sort.data.ctype == 0 ?
                                                                            <View className='items'>
                                                                                {
                                                                                    sort.data.courseList.map((recom: any, recomidx_f) => {
                                                                                        return (
                                                                                            <View className='pb_5 item' key={'recom' + recomidx_f} onClick={this._oncourseDesc.bind(this, recom)}>
                                                                                                <View className='plate_item d_flex fd_c mb_15'>
                                                                                                    <View className='item_cover_cons'>
                                                                                                        <Image src={recom.courseImg} className='platerows_img' />
                                                                                                        <View className='item_tips_hit'>
                                                                                                            <Image src={asset.cover_tips_icon} className='item_hit_cover' />
                                                                                                            <Text className='sm8_label white_label mt_3'>{recom.chapter}讲</Text>
                                                                                                        </View>
                                                                                                    </View>
                                                                                                    <View className='d_flex fd_c'>
                                                                                                        <View className='item_text'>
                                                                                                            <Text className='default_label c33_label fw_label' >{recom.courseName}</Text>
                                                                                                        </View>
                                                                                                        <View className='recom_bg'>
                                                                                                            <Text className='sml_label tip_label'>{recom.summary}</Text>
                                                                                                        </View>
                                                                                                        {
                                                                                                            recom.payType > 0 ?
                                                                                                                <Text className='red_label sm_label mt_3'>{recom.integral}学分</Text>
                                                                                                                :
                                                                                                                <Text className='red_label sm_label mt_3'>免费</Text>
                                                                                                            // null
                                                                                                        }
                                                                                                        <View className='d_flex fd_r ai_ct jc_sb mt_5'>
                                                                                                            {
                                                                                                                recom.teacherId > 0 ?
                                                                                                                    <View className='d_flex fd_r ai_ct'>
                                                                                                                        <Image src={asset.per_icon} className='item_head_cover' />
                                                                                                                        <Text className='sm_label c33_label ml_5'>{recom.teacherName}</Text>
                                                                                                                    </View>
                                                                                                                    : null}
                                                                                                            <View className='view_play d_flex fd_r ai_ct '>
                                                                                                                <Image src={asset.pay_icon} className='view_icon' />
                                                                                                                <Text className='sm_label gray_label ml_5'>{learnNum(recom.hit)}</Text>
                                                                                                            </View>
                                                                                                        </View>
                                                                                                    </View>
                                                                                                </View>
                                                                                            </View>

                                                                                        )
                                                                                    })
                                                                                }
                                                                            </View>
                                                                            : null}
                                                                    {
                                                                        sort.data.ttype == 1 && sort.data.ctype == 0 ?
                                                                            <View className='recomm_items'>
                                                                                {
                                                                                    sort.data.courseList.map((recom: any, recomidx_t) => {
                                                                                        return (
                                                                                            <View key={'recom' + recomidx_t} className='pb_20'
                                                                                                onClick={this._oncourseDesc.bind(this, recom)}
                                                                                            >
                                                                                                <View className='courseitem d_flex fd_r   pb_20 '>
                                                                                                    <View className='item_cover_cons'>
                                                                                                        <Image src={recom.courseImg} className='item_cover' />
                                                                                                        <View className='item_tips_hit'>
                                                                                                            <Image src={asset.cover_tips_icon} className='item_hit_cover' />
                                                                                                            <Text className='sm8_label white_label mt_3'>{recom.chapter}讲</Text>
                                                                                                        </View>
                                                                                                    </View>
                                                                                                    <View className='d_flex fd_c pl_10 jc_sb col_1'>
                                                                                                        <View className='d_flex fd_c'>
                                                                                                            <View className='item_text'>
                                                                                                                <Text className='default_label c33_label fw_label'>{recom.courseName}</Text>
                                                                                                            </View>
                                                                                                            <View className='recom_bg'>
                                                                                                                <Text className='sml_label tip_label'>{subNumTxt(recom.summary, 24)}</Text>
                                                                                                            </View>
                                                                                                        </View>
                                                                                                        {
                                                                                                            recom.payType > 0 ?
                                                                                                                <Text className='red_label sm_label mt_3'>{recom.integral}学分</Text>
                                                                                                                :
                                                                                                                <Text className='red_label sm_label mt_3'>免费</Text>
                                                                                                            // null
                                                                                                        }
                                                                                                        <View className='d_flex fd_r ai_ct mt_5 '>
                                                                                                            {
                                                                                                                recom.teacherId > 0 ?
                                                                                                                    <View className='d_flex fd_r ai_ct mr_15'>
                                                                                                                        <Image src={asset.per_icon} className='item_head_cover' />
                                                                                                                        <Text className='sm_label c33_label ml_5'>{recom.teacherName}</Text>
                                                                                                                    </View>
                                                                                                                    : null}
                                                                                                            <View className='view_play d_flex fd_r ai_ct '>
                                                                                                                <Image src={asset.pay_icon} className='view_icon' />
                                                                                                                <Text className='sm_label gray_label ml_5'>{learnNum(recom.hit)}</Text>
                                                                                                            </View>
                                                                                                        </View>
                                                                                                    </View>
                                                                                                </View>
                                                                                            </View>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </View>
                                                                            : null}

                                                                    {
                                                                        sort.data.ctype === 3 ?
                                                                            <View className='graphic'>
                                                                                {
                                                                                    sort.data.courseList.map((grap, idx) => {

                                                                                        return (
                                                                                            <View key={'grap' + idx} className={idx != 2 ? 'border_bt items' : 'items'}>
                                                                                                {
                                                                                                    idx < 3 ?
                                                                                                        <View style={{ width: '100%' }} className='pt_15 pb_15'
                                                                                                            onClick={this._onGrapDesc.bind(this, grap)}
                                                                                                        >
                                                                                                            <GrapCourse courseList={grap} />
                                                                                                        </View>
                                                                                                        : null}
                                                                                            </View>

                                                                                        )
                                                                                    })
                                                                                }
                                                                            </View>
                                                                            : null}

                                                                    {
                                                                        sort.data.ctype === 1 ?
                                                                            <View className='recomm_items'>
                                                                                {
                                                                                    sort.data.courseList.map((recom: any, recomIdx_s) => {
                                                                                        return (
                                                                                            <View key={'recom' + recomIdx_s} className='pb_20'
                                                                                                onClick={this._onAudioDesc.bind(this, recom)}
                                                                                            >
                                                                                                <Course courseList={recom} atype={1} />
                                                                                            </View>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </View>
                                                                            : null}
                                                                </View>
                                                            </View>
                                                            : null}

                                                    {
                                                        sort.type === 'article' && sort.data.length > 0 ?
                                                            <View className='pl_15 pr_15'>
                                                                <View className='recomm pt_25' >
                                                                    <View className='head pl_2 pr_2  pb_12 d_flex fd_r jc_sb ai_ct'>
                                                                        <Text className='lg_label c33_label fw_label'>资讯</Text>
                                                                        <View className='d_flex fd_r ai_ct jc_ct' onClick={() => Taro.navigateTo({ url: menu.consultList + '?type=0' })}>
                                                                            <Text className='tip_label default_label fw_label'>全部</Text>
                                                                            <Image src={asset.arrow_right} className='arrow_right' />
                                                                        </View>
                                                                    </View>
                                                                    <View className='consult'>
                                                                        {
                                                                            sort.data.map((art, index) => {
                                                                                return (
                                                                                    <View key={'items' + index} onClick={this._consultDesc.bind(this, art)}>
                                                                                        <View className='itemc border_bt pb_10 pt_10' >
                                                                                            <ConsultCourse articleList={art} />
                                                                                        </View>
                                                                                    </View>

                                                                                )
                                                                            })
                                                                        }
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            : null}

                                                    {
                                                        sort.type === 'activity' && sort.data.length > 0 ?
                                                            <View className='pl_15 pr_15'>
                                                                <View className='activity'>
                                                                    <View className='mb_20 d_flex fd_r ai_ct jc_sb'>
                                                                        <Text className='lg18_label c33_label fw_label'>活动</Text>
                                                                        <View className='d_flex fd_r ai_ct jc_ct  pl_12'
                                                                            onClick={this._onSwitchTab.bind(this, 0)}
                                                                        >
                                                                            <Text className='tip_label default_label fw_label'>全部</Text>
                                                                            <Image src={asset.arrow_right} className='arrow_right' />
                                                                        </View>
                                                                    </View>
                                                                    <View>
                                                                        {
                                                                            sort.data.map((art, index) => {
                                                                                let on: any;
                                                                                if (sort.data.length === 1) {
                                                                                    on = true
                                                                                } else if (sort.data.length > 1) {
                                                                                    on = index === 1
                                                                                }


                                                                                return (
                                                                                    <View key={index + '_articleItems'}>
                                                                                        {
                                                                                            index < 2 ?
                                                                                                <View className={!on ? 'articleItems bdr_bt' : 'articleItems'}
                                                                                                    style={!on ? {} : { paddingBottom: 0 + 'rpx' }}
                                                                                                    onClick={this.artDesc.bind(this, art)}
                                                                                                >

                                                                                                    <View className='arthead'>
                                                                                                        <Image className='arthead_cover' mode='scaleToFill' src={art.activityImg} />
                                                                                                        <View className='artbottom'>
                                                                                                            <Text className='artbot'>{formatTimeStampToTime(art.beginTime * 1000)} - {formatTimeStampToTime(art.endTime * 1000)}</Text>
                                                                                                        </View>
                                                                                                    </View>
                                                                                                    <View className='d_flex fd_c  jc_sb mt_15'>
                                                                                                        <Text className='lg_label c33_label fw_label col_1 dup2_txt'>{art.title}</Text>
                                                                                                        <Text className='tip_label sm_label dup_per_txt'>{art.subTitle}</Text>

                                                                                                    </View>
                                                                                                </View>
                                                                                                : null}
                                                                                    </View>

                                                                                )
                                                                            })
                                                                        }
                                                                    </View>

                                                                </View>
                                                            </View>
                                                            : null}

                                                    {
                                                        sort.type === 'column' && sort.data.length > 0 ?
                                                            <View className='pl_15 pr_15'>
                                                                <View className='activity'>
                                                                    <View className='mb_20 d_flex fd_r ai_ct jc_sb'>
                                                                        <Text className='lg18_label c33_label fw_label'>专题</Text>
                                                                        <View className='d_flex fd_r ai_ct jc_ct  pl_12'
                                                                            onClick={this._onSwitchTab.bind(this, 1)}
                                                                        >
                                                                            <Text className='tip_label default_label fw_label'>全部</Text>
                                                                            <Image src={asset.arrow_right} className='arrow_right' />
                                                                        </View>
                                                                    </View>
                                                                    <View>
                                                                        {
                                                                            sort.data.map((art:any, index) => {
                                                                                let on: any;
                                                                                if (sort.data.length === 1) {
                                                                                    on = true
                                                                                } else if (sort.data.length > 1) {
                                                                                    on = index === 1
                                                                                }
                                                                                return (
                                                                                    <View key={'colum' + index}>
                                                                                        {
                                                                                            index < 2 ?
                                                                                                <View className={!on ? 'articleItems bdr_bt' : 'articleItems'}
                                                                                                    style={!on ? {} : { paddingBottom: 0 + 'rpx' }}
                                                                                                    onClick={this.columnDesc.bind(this, art)}
                                                                                                >
                                                                                                    <View className='arthead'>
                                                                                                        <Image className='arthead_cover' mode='scaleToFill' src={art.articleImg} />
                                                                                                    </View>
                                                                                                    <View className='d_flex fd_c  jc_sb mt_15'>
                                                                                                        <Text className='lg_label c33_label fw_label col_1'>{subNumTxt(art.title, 13)}</Text>
                                                                                                        <Text className='tip_label sm_label'>{subNumTxt(art.summary, 24)}</Text>
                                                                                                    </View>
                                                                                                </View>
                                                                                                : null}
                                                                                    </View>

                                                                                )
                                                                            })
                                                                        }
                                                                    </View>

                                                                </View>
                                                            </View>
                                                            : null}
                                                </View>
                                            )

                                        })
                                    }



                                    <View className='pl_15 pr_15'>
                                        <View className='recomm ' >
                                            <View className='head pl_2 pr_2  pb_12 d_flex fd_r jc_sb ai_ct'>
                                                <Text className='lg_label c33_label fw_label'>猜你喜欢</Text>
                                                <View className='d_flex fd_r ai_ct jc_ct' onClick={this._update_recom}>
                                                    <Text className='tip_label default_label fw_label'>换一批</Text>
                                                    <Image src={asset.update_icon} className=' update_icon ml_5' />
                                                </View>
                                            </View>
                                            <View className='recomm_items'>
                                                {
                                                    recommReList.map((recom, index) => {
                                                        return (
                                                            <View key={'recom' + index} className='pb_20'
                                                                onClick={this._oncourseDesc.bind(this, recom)}
                                                            >
                                                                <Course courseList={recom} atype={1} />
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>
                                    </View>
                                    <View className='d_flex ai_ct jc_ct pt_15 '>
                                        <Text className='sm_label tip_label'>没有更多数据了</Text>
                                    </View>
                                </View>
                                : null}




                        {
                            MenuList.length > 0 && tabStatus > 0 ?
                                <View style={{ backgroundColor: '#ffffff' }}>
                                    {
                                        IndexMenuTab[tabStatus - 1] === 'channel' ?
                                            <View className='pl_12 pr_12 pt_15' >
                                                {
                                                    MenuList.map((mList, index) => {
                                                        return (
                                                            <View key={'menu' + index} className='pt_10 pb_10 border-bt'
                                                                onClick={this._oncourseDesc.bind(this, mList)}
                                                            >
                                                                <Course courseList={mList} atype={1} />
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                            : null}
                                    {
                                        IndexMenuTab[tabStatus - 1] === 'article' ?
                                            <View className='consult pl_15 pr_15' >
                                                {
                                                    MenuList.map((art1: any, index) => {
                                                        return (
                                                            <View className='itemc border_bt pb_10 pt_10' key={'items' + index}
                                                                onClick={this._consultDesc.bind(this, art1)}
                                                            >
                                                                <ConsultCourse articleList={art1} />
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                            : null}
                                    {
                                        IndexMenuTab[tabStatus - 1] === 'column' ?
                                            <View>
                                                {
                                                    MenuList.map((art: any, index) => {
                                                        let on: any;
                                                        if (MenuList.length === 1) {
                                                            on = true
                                                        } else if (MenuList.length > 1) {
                                                            on = index === 1
                                                        }
                                                        return (
                                                            <View key={'colum' + index} className='activity activity_menu'>
                                                                <View className={!on ? 'articleItems bdr_bt mb_0' : 'articleItems mb_0'}
                                                                    style={!on ? {} : { paddingBottom: 0 + 'rpx' }}
                                                                    onClick={this.columnDesc.bind(this, art)}
                                                                >
                                                                    <View className='arthead'>
                                                                        <Image className='arthead_cover' mode='scaleToFill' src={art.articleImg} />
                                                                    </View>
                                                                    <View className='d_flex fd_c  jc_sb mt_15'>
                                                                        <Text className='lg_label c33_label fw_label col_1'>{subNumTxt(art.title, 13)}</Text>
                                                                        <Text className='tip_label sm_label'>{subNumTxt(art.summary, 24)}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>

                                                        )
                                                    })
                                                }
                                            </View>
                                            : null}
                                    {
                                        IndexMenuTab[tabStatus - 1] === 'activity' ?
                                            <View>
                                                {
                                                    MenuList.map((art: any, index) => {
                                                        let on: any;
                                                        if (MenuList.length === 1) {
                                                            on = true
                                                        } else if (MenuList.length > 1) {
                                                            on = index === 1
                                                        }


                                                        return (
                                                            <View key={'activity' + index} className='activity activity_menu'>
                                                                <View className={!on ? 'articleItems bdr_bt mb_0' : 'articleItems mb_0'}
                                                                    style={!on ? {} : { paddingBottom: 0 + 'rpx' }}
                                                                    onClick={this.columnDesc.bind(this, art)}
                                                                >
                                                                    <View className='arthead'>
                                                                        <Image className='arthead_cover' mode='scaleToFill' src={art.activityImg} />
                                                                        <View className='artbottom'>
                                                                            <Text className='artbot'>{formatTimeStampToTime(art.beginTime * 1000)} - {formatTimeStampToTime(art.endTime * 1000)}</Text>
                                                                        </View>
                                                                    </View>
                                                                    <View className='d_flex fd_c  jc_sb mt_15'>
                                                                        <Text className='lg_label c33_label fw_label col_1'>{subNumTxt(art.title, 13)}</Text>
                                                                        <Text className='tip_label sm_label'>{subNumTxt(art.subTitle, 24)}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                            : null}
                                    {
                                        IndexMenuTab[tabStatus - 1] === 'teacher' || IndexMenuTab[tabStatus - 1] === 'leader' ?

                                            <View className='lectitems'>
                                                {
                                                    MenuList.map((lect: any, lectindex) => {
                                                        let lectArray: string[] = new Array()
                                                        let lectString: string = lect.honor
                                                        if (lectString.indexOf('&') != -1) {
                                                            lectArray.push(lectString.split('&')[0], lectString.split('&')[1])
                                                        } else {
                                                            lectArray.push(lect.honor)
                                                        }

                                                        return (
                                                            <View className='item mb_15' key={'lect' + lectindex} >
                                                                <View className='d_flex item_right '
                                                                    onClick={() => Taro.navigateTo({ url: IndexMenuTab[tabStatus - 1] === 'teacher' ? menu.teachZone + '?teacher_id=' + `${lect.teacherId}` : menu.leaderShip + '?teach_id=' + lect.teacherId })}
                                                                >
                                                                    <View className='item_cover'>
                                                                        <Image className='item_cover' src={lect.teacherImg} />
                                                                    </View>
                                                                    <View className='d_flex fd_c jc_sb ml_10 col_1'>
                                                                        <View>
                                                                            <View className='d_flex fd_r jc_sb ai_ct'>
                                                                                <Text className='lg_label black_label fw_label'>{lect.teacherName}</Text>
                                                                                {
                                                                                    lect.isFollow ?
                                                                                        <View onClick={this.handleStop.bind(this)}>
                                                                                            <View className='focuson d_flex jc_ct ai_ct'
                                                                                                onClick={this._offFollow.bind(this, lect, lectindex)}
                                                                                            >
                                                                                                <Text className='red_label sm_label'>已关注</Text>
                                                                                            </View>
                                                                                        </View>
                                                                                        :
                                                                                        <View onClick={this.handleStop.bind(this)}>
                                                                                            <View className='focuson d_flex jc_ct ai_ct'
                                                                                                onClick={this._onFollow.bind(this, lect, lectindex)}
                                                                                            >
                                                                                                <Text className='red_label sm_label'>+关注</Text>
                                                                                            </View>
                                                                                        </View>
                                                                                }
                                                                            </View>
                                                                            <View className='d_flex fd_c'>
                                                                                {
                                                                                    lectArray.map((lectstr: any, lectidx) => {
                                                                                        return (
                                                                                            <Text className='default_label gray_label mt_5' style={{ lineHeight: '30rpx', }} key={'lectstr' + lectidx}>{lectstr}</Text>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </View>
                                                                        </View>
                                                                        <Text className='sm_label tip_label' style={{ lineHeight: '24rpx', }}>共 {lect.course} 课</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )
                                                    })
                                                }

                                            </View>
                                            : null}

                                </View>

                                : null}


                        {
                            isTopShow ?
                                <View className='returnTop d_flex jc_ct ai_ct' id='C' onClick={this._toTop}>
                                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/top_icon.png'} className='returnTop_cover' />
                                </View>
                                : null}

                    </ScrollView>
                </View>

                {
                    ad_type ?
                        <View className='layer_tip'>
                            <View className='returnTop d_flex jc_ct ai_ct'>
                                <View className='tips_box d_flex ai_ct fd_c'>
                                    <Swiper
                                        className='tips_cover'
                                        indicatorColor='#999'
                                        indicatorActiveColor='#333'
                                        vertical={false}
                                        circular
                                        indicatorDots
                                        autoplay>
                                        {
                                            adpopups.map((popup: any, index) => {
                                                return (
                                                    <SwiperItem className='tips_cover' onClick={this.onAdPopupLink.bind(this, popup)} key={'popup' + index}
                                                    >
                                                        <Image src={popup.fileUrl} className='tip_image' style={{ width: (windowWidth * 0.8).toFixed(0) + 'px', height: (windowWidth * 0.8 * 0.67).toFixed(0) + 'px' }} />
                                                        <View className='d_flex fd_c ai_ct mt_5  pb_20 ' style={{ width: (windowWidth * 0.8).toFixed(0) + 'px' }}>
                                                            <Text className='lg_label black_label fw_label'>{popup.billboardName}</Text>
                                                            <View className='d_flex fd_r tips_cont'>
                                                                <Text className='default_label c33_label mt_5 pl_10'>{subNumTxt(popup.content, 32)}</Text>
                                                            </View>
                                                        </View>
                                                    </SwiperItem>
                                                )
                                            })
                                        }
                                    </Swiper>
                                    <Image src={asset.tip_dele} className='tips_dete' onClick={this._offAdtip} />
                                </View>
                            </View>
                        </View>
                        : null}

                {
                    snpwdType ?
                        <View className='layer_tip'>
                            <View className='returnTop d_flex jc_ct ai_ct'>
                                <View className='snpwd_box'>
                                    <View className='pl_15 pr_15 pt_30'>
                                        <Text className='lg_label c33_label fw_label text_word'>请输入会员卡：<Text className='sred_label lg_label fw_label'>{encryNumber(snpwd_sn)}</Text>的密码</Text>
                                        <View className='mt_20'>
                                            <Input className='snpwd_input default_label tip_label p_5'
                                                placeholder='输入密码'
                                                type='text'
                                                value={snpwd_pwd}
                                                onInput={(e) => this.setState({ snpwd_pwd: e.detail.value })}
                                            />
                                        </View>
                                    </View>
                                    <View className='d_flex fd_r ai_ct jc_sb mt_20'>
                                        <View className='snpwd_btn snpwd_btn_left' onClick={() => this.setState({ snpwdType: false })}>
                                            <Text className='lg18_label tip_label'>取消</Text>
                                        </View>
                                        <View className='snpwd_btn' onClick={this._pwdSnpwd}>
                                            <Text className='lg18_label c33_label'>确认</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : null}

                {/* {
                    cmic_type !== 2 ?
                    <CMusic 
                        updateData ={updateData}
                        cmic_type={cmic_type} 
                        cmic_duration={cmic_duration}
                        onUpdatePlayStatus={this.props.updatePlayStatus.bind(this)}
                    />
                :null} */}

                <ModalPannel title={'预约成功'} content={time_ms(liveResetTime)} visible={show_pannel} onClose={() => { this.setState({ show_pannel: false }) }}></ModalPannel>

                <Auth ref={'auth'} success={() => {
                    this._onLoadCallBack()
                }} />

                {
                    ttyp == 1 && tip != coupons[0].couponId ?
                        <View className='comps'>
                            <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/base/model.score.png'} className='piccs' />
                            <View className='rowjc tiwrd'>
                                恭喜您获得{coupons[0].num}张优惠券
                            </View>
                            <View className='rowjc siwrd'>
                                请在有效期内使用
                            </View>
                            {
                                coupons.map((item, index) => {
                                    if (index < 1) {
                                        return (
                                            <View className='rowjc mt_10'>
                                                <View className='cpics'>
                                                    <View className='rits'></View>
                                                    <View className='ritss'></View>
                                                    <View className='dash'></View>
                                                    <View className='wrod_left'>
                                                        {
                                                            item.ctype == 3 ?
                                                                <View className='rowjcs'>
                                                                    <View className='font_12 mt_10'>{item.integral}学分</View>
                                                                    {/* <View className='font_22'>{item.integral}学分</View> */}
                                                                </View>
                                                                :
                                                                <View className='rowjcs'>
                                                                    <View className='font_12 mt_10'>¥</View>
                                                                    <View className='font_22'>{item.amount}</View>
                                                                </View>
                                                        }
                                                        {
                                                            item.ctype == 3 ?
                                                                <View className='rowjcs font_10'>满{item.requireIntegral}可用</View>
                                                                :
                                                                <View className='rowjcs font_10'>满{item.requireAmount}元可用</View>
                                                        }

                                                    </View>
                                                    <View className='wrod_right'>
                                                        <View className='rowjcss font_15'>
                                                            {item.couponName}
                                                        </View>
                                                        <View className='rowjcss font_10 mt_5'>{formatTimeStampToTime(item.beginTime * 1000)} - {item.endTime == 0 ? '无期限' : formatTimeStampToTime(item.endTime * 1000)}</View>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    }

                                })
                            }
                            <View className='rowjc mt_20 mb_20' onClick={this.onCloses}>
                                <View className='btnss'>立即领取</View>
                            </View>
                        </View>
                        : null
                }

            </View>
        )
    }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as unknown as ComponentClass<PageOwnProps, PageState>
