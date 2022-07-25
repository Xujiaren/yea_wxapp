import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input, Video, LivePlayer, Swiper, SwiperItem, ScrollView, Button, LivePusher, CoverView } from '@tarojs/components'
import Tabs from '../../../components/Tabs'
import { homeType } from '../../../constants/homeType'
import api from '../../../services/api'
import inter from '../../../config/inter'
import Auth from '../../../components/Auth'
import { subNumTxt, learnNum, percent2percent2, getExactTimes } from '../../../utils/common'
import menu from '../../../config/menu';
import DateTime from '../../../components/DateTime'
import asset from '../../../config/asset';
import asset1 from '../../config/asset';
import { liveroom } from '../../../config'
import { connect } from '@tarojs/redux';
import '../../../config/theme.css';
import './activeLive.less';
import {
    getConfigGift
} from '../../../actions/home'
import AliRtcMiniappSDK from '../../../utils/aliyun-webrtc-miniapp-sdk';
import { sha256 } from '../../../utils/sha256';
import Layouter from '../../../utils/layout';
import { emojis, emojiToPath, textToEmoji } from '../../../utils/emoji';
import { parseInt } from 'lodash'
type PageStateProps = {
    home: homeType,
}
type PageDispatchProps = {
    getConfigGift: (object) => any
}
type PageOwnProps = {}
type PageState = {
    Jcurrent: number,
    word: Array<any>,
    status: number,
    open: number,
    prize_type: number,
    prize_list: Array<any>,
    liveStatus: number,
    roomStatus: number,
    chatIds: Array<any>,
    userCount: number,
    userintegral: number,
    userId: number,
    isAuth: number,
    userAvatar: string,
    userName: string,
    courseId: number,
    courseDesc: any,
    say: string,
    speakerList: Array<any>,
    interactList: Array<any>,
    fullScreenFlag: boolean,
    comeList: Array<any>,
    rewardList: Array<any>,
    teacherName: string,
    teacherImg: string,
    tid: number,
    come: boolean,
    vant: Array<any>,
    now: number,
    typegift: boolean,
    gfIntegral: number,
    goodList: Array<any>,
    vants: number,
    gfId: number,
    gifttImg: string,
    giftName: string,
    activityDTO: any,
    lottery: Array<any>,
    lotteryList: Array<any>,
    activityId: number,
    l_name: string,
    l_mobile: string,
    l_address: string,
    rewardId: number,
    kicked: boolean,
    likeNum: number,
    tipps: number,
    idxs: number,
    glist: any,
    teacherId: number,
    isFollow: boolean,
    van_list: Array<any>,
    gooddescType: boolean,
    gooddesc: any,
    cartList: any,
    goodsList: any,
    touch: number,
    logs: boolean,
    isLogin: boolean,
    isValid: Boolean,
    isMobile: boolean,
    goodlayer: boolean,
    background: string,
    c_integral: number,
    canBuy: boolean,
    questionActivityDTOs: any,
    askList: Array<any>,
    pages: number,
    attyps: number,
    optionId: number,
    answers: any,
    ttime: number,
    likeCount: number,
    vantss: number,
    asklst: Array<any>,
    forteach: boolean,
    minutes: any,
    seconds: any,
    emojiList: any,
    liveUrl: any,
    canSend: boolean,
    vantCount: number,
    isInlianmai: boolean,
    targetId: number,
    pushUrl: string,
    userinfo: any,
    media: any,
    openList_lm: boolean,
    lm_list: any,
    islm_persom: boolean,
    joinStatus: number,
    persolal_lm: boolean,
    canJoin: number,
    lm_id: any,
    publishType: number,
}
type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface activeLive {
    props: IProps;
}
@connect(({ home }) => ({
    home: home,
}), (dispatch) => ({
    getConfigGift(object) {
        dispatch(getConfigGift(object))
    }
}))
class activeLive extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationStyle: 'custom',
    }
    page: number;
    pages: number;
    pingObj: NodeJS.Timeout;
    PlayerCtx: Taro.LivePlayerContext;
    sockets: Promise<void>;
    recontnum: number;
    tims: any;
    vantTims: any;
    client: any;
    layouter: any;
    hasOpenDeviceAuthorizeModal: any;
    authorizeMic: any;
    authorizeCamera: any;

    constructor() {
        super(...arguments)

        this.page = 0;
        this.pages = 0;
        this.tims = null;
        this.vantTims = null;
        this.client = null;
        this.layouter = null;
        this.hasOpenDeviceAuthorizeModal = null;
        this.authorizeMic = null;
        this.authorizeCamera = null;
        this.state = {
            status: 0,
            word: [{ name: 'Andrew', content: '哇，好好看!', status: 0 }, { name: 'Stella ', content: '66666666', status: 0 }, { name: '主讲 ', content: '准备开始了！', status: 1 },
            { name: 'James Christensen', content: '我喜欢啊', status: 0 }, { name: 'Stella', content: '什么时候开始？？？', status: 0 }],
            open: 0,
            prize_type: 0,
            prize_list: ['', '', ''],
            liveStatus: 0,
            roomStatus: 0,
            userCount: 0,
            userintegral: 0,
            chatIds: [],
            userId: 0,
            isAuth: 0,
            userAvatar: '',
            userName: '',
            courseId: 0,
            courseDesc: {},
            say: '',
            speakerList: [],
            interactList: [],
            fullScreenFlag: false,
            comeList: [],
            rewardList: [],
            teacherName: '',
            teacherImg: '',
            tid: 0,
            come: true,
            vant: [],
            now: 0,
            typegift: false,
            gfIntegral: 0,
            goodList: [],
            vants: 0,
            Jcurrent: 0,
            gfId: 0,
            gifttImg: '',
            giftName: '',
            activityDTO: null,
            lottery: [],
            lotteryList: [],
            activityId: 0,
            l_name: '',
            l_mobile: '',
            l_address: '',
            rewardId: 0,
            kicked: false,
            likeNum: 0,
            tipps: 0,
            idxs: 0,
            glist: {},
            teacherId: 0,
            isFollow: false,
            van_list: [],
            gooddescType: false,
            gooddesc: {},
            cartList: [],
            goodsList: [],
            touch: 0,
            logs: false,
            isLogin: false,
            isValid: false,
            isMobile: false,
            goodlayer: false,
            background: '',
            c_integral: 0,
            canBuy: false,
            questionActivityDTOs: {},
            askList: [],
            pages: 0,
            attyps: 1,
            optionId: 0,
            answers: {},
            ttime: 0,
            likeCount: 0,
            vantss: 0,
            asklst: [],
            forteach: false,
            seconds: '00',
            minutes: '00',
            emojiList: [],
            liveUrl: '',
            canSend: true,
            vantCount: 0,
            isInlianmai: false,
            targetId: 0,
            pushUrl: '',
            userinfo: {},
            media: [],
            openList_lm: false,
            lm_list: [],
            islm_persom: false,
            joinStatus: 0,
            persolal_lm: false,
            canJoin: 0,
            lm_id: 0,
            publishType: 0
        }
    }
    socketTask: Taro.SocketTask
    componentDidMount() {
        this.PlayerCtx = Taro.createLivePlayerContext('liverPlayer', this.$scope);
        this.getConfigGift();
        this._getLiveGoods(0, 0);
        let lst = Taro.getStorageSync('liveask')
        if (lst) {
            this.setState({
                asklst: lst
            })
        }
        const emojiList = Object.keys(emojis).map(key => ({
            key: key,
            img: emojiToPath(key)
        }))
        this.setState({
            emojiList: emojiList
        })
        this.timeOuts()
        wx.setKeepScreenOn({
            keepScreenOn: true
        })
    }
    timeOuts = () => {
        this.tims = setInterval(() => {
            let myDate = new Date();
            let seconds = myDate.getSeconds();
            let ttime = myDate.getTime()
            if (seconds == 59) {
                if (this.state.courseId) {
                    this.getHitNum();
                    this.actAsk();
                }
            }
            this.activityLst();
            this.lianmai();
            this.setState({
                ttime: ttime
            }, () => {
                this.forTimes();
            })
        }, 1000)
        this.vantTims = setInterval(() => {
            if (this.state.vantCount > 0) {
                api.post('/user/like/course/' + this.state.courseId, {
                    times: this.state.vantCount
                }).then(res => {
                    this.setState({
                        vantCount: 0,
                    })
                })
            }
        }, 5000)
    }
    lianmai = () => {
        if (this.state.targetId) {
            api.post(inter.startLianmai, {
                course_id: this.state.courseId,
                type: 0,
                target_id: this.state.targetId
            }).then(res => {

            })
        }
    }
    activityLst = () => {
        let that = this
        const { courseId } = this.state
        if (courseId) {
            api.get('/course/live/activity/' + courseId, {
                type: 0,
            }).then(res => {
                if (res.data.status) {
                    let activityDTOs = res.data.data
                    if (activityDTOs && activityDTOs.length > 0) {
                        var ttime = new Date().getTime()
                        let list = activityDTOs

                        list = list.filter(item => item.endTime * 1000 + 180000 >= ttime)

                        if (list && list.length > 0) {
                            var act = Math.min.apply(Math, list.map((e) => { return e.endTime }))
                            list = list.filter(itm => itm.endTime == act)

                            if (that.state.activityId !== list[0].activityId) {
                                this.setState({
                                    activityDTO: list[0],
                                    activityId: list[0].activityId,
                                })
                            }
                        } else {
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
    actAsk = () => {
        let that = this
        const { courseId } = this.state
        if (courseId) {
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
    componentDidShow() {
        this.getUser(1)
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
    componentWillUnmount() {
        const { courseId } = this.state
        Taro.closeSocket();
        if (this.socketTask) {
            this.socketTask.close({});
        }
        api.post(inter.leaveRoom, {
            cctype: 1,
            content_id: courseId,
        }).then(res => {
        })
        clearInterval(this.tims)
        clearInterval(this.vantTims)
        this.client && this.client.leave(() => {
            console.log('leave success')
        });
        if (this.state.islm_persom) {
            // try {
            //     this.client && this.client.unpublish()
            // } catch (e) {
            //     console.log(e, 'unpublish failed')
            // }

            this.client && this.client.leave((e) => {
                console.log('leave success')
            });
            this.setState({
                persolal_lm: false,
                islm_persom: false,
            })
        }
        if ((this.state.userId == this.state.tid || this.state.islm_persom) && !(this.state.liveStatus === 0 && this.state.roomStatus === 0) || (this.state.liveStatus === 2 && this.state.roomStatus === 1) || (this.state.liveStatus === 2 && this.state.roomStatus === 3) || (this.state.liveStatus === 2 && this.state.roomStatus === 0)) {
            let data = {
                mtype: 'live-leave',
                msg: ''
            }
            api.post('/site/remove/channel/user', {
                channel_id: 'live_' + this.state.courseId,
                user_id: this.state.lm_id
            }, 1)
            Taro.sendSocketMessage({
                data: JSON.stringify(data)
            })
        }
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
            path: menu.actveLive + '?courseId=' + courseId + + '&liveName=' + percent2percent25(courseDesc.courseName) + '&liveStatus=0' + '&fromuser=' + userId,
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
            query: menu.actveLive + '?courseId=' + courseId + + '&liveName=' + percent2percent25(courseDesc.courseName) + '&liveStatus=0' + '&fromuser=' + userId,
            imageUrl: courseDesc.courseImg + '?x-oss-process=image/resize,w_500,h_380,m_pad'
        }
    }
    getTeachers = () => {
        const { teacherId } = this.state
        api.get(inter.Teacher + '/' + teacherId, {})
            .then(res => {
                if (res.data.status) {
                    this.setState({
                        isFollow: res.data.data.teacher.isFollow,
                        forteach: true
                    })
                }
            })
    }
    componentDidHide() {
        api.post(inter.leaveRoom, {
            cctype: 1,
            content_id: this.state.courseId,
        }).then(res => {
        })
        this.client && this.client.leave(() => {
            console.log('leave success')
        });
        if (this.state.islm_persom) {
            try {
                this.client && this.client.unpublish()
            } catch (e) {
                console.log(e, 'unpublish failed')
            }

            this.client && this.client.leave((e) => {
                console.log('leave success')
            });
            this.setState({
                persolal_lm: false,
                islm_persom: false,
            })
        }
        if ((this.state.userId == this.state.tid || this.state.islm_persom) && !(this.state.liveStatus === 0 && this.state.roomStatus === 0) || (this.state.liveStatus === 2 && this.state.roomStatus === 1) || (this.state.liveStatus === 2 && this.state.roomStatus === 3) || (this.state.liveStatus === 2 && this.state.roomStatus === 0)) {
            let data = {
                mtype: 'live-leave',
                msg: ''
            }
            api.post('/site/remove/channel/user', {
                channel_id: 'live_' + this.state.courseId,
                user_id: this.state.lm_id
            }, 1)
            Taro.sendSocketMessage({
                data: JSON.stringify(data)
            })
        }
    }
    //获取人数
    getHitNum = () => {
        api.get(inter.hitNums + this.state.courseId)
            .then(res => {
                this.setState({
                    likeNum: res.data.data
                })
            })
    }
    componentWillMount() {
        let that = this
        const { courseId } = this.$router.params
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
        this.setState({
            courseId: parseInt(courseId)
        })
        api.get(inter.LiveGoods, {
            course_id: parseInt(courseId)
        }).then(res => {
            // console.log(res)
            if (res.data.status) {
                let goodList = res.data.data
                this.setState({
                    goodList: goodList,
                })
                if (goodList.length > 0) {
                    this.setState({
                        glist: goodList[0],
                    })
                }
            }
        })
        api.get('/course/live/activity/' + courseId, {
            type: 0,
        }).then(res => {
            if (res.data.status) {
                let activityDTOs = res.data.data
                if (activityDTOs && activityDTOs.length > 0) {
                    var ttime = new Date().getTime()
                    let list = activityDTOs

                    list = list.filter(item => item.endTime * 1000 + 180000 >= ttime)

                    if (list && list.length > 0) {
                        var act = Math.min.apply(Math, list.map((e) => { return e.endTime }))
                        list = list.filter(itm => itm.endTime == act)

                        if (that.state.activityId !== list[0].activityId) {
                            this.setState({
                                activityDTO: list[0],
                                activityId: list[0].activityId,
                            })
                        }
                    } else {
                        this.setState({
                            activityDTO: null,
                            activityId: 0,
                        })
                    }

                }
            }
        })
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
    getCourseDesc = () => {
        var that = this
        api.get(inter.CourseDesc + this.state.courseId)
            .then(res => {
                if (res.data.status && res.data.data) {
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
                                    setTimeout(() => {
                                        Taro.switchTab({
                                            url: menu.index
                                        })
                                    }, 5000);
                                }
                            }
                        });
                        return;
                    }
                    if (that.state.liveUrl !== res.data.data.liveUrl) {
                        that.setState({
                            liveUrl: res.data.data.liveUrl
                        })
                    }
                    if (that.state.courseDesc !== res.data.data) {
                        if (res.data.data.canShare == 1) {
                            wx.showShareMenu({

                                withShareTicket: true,

                                menus: ['shareAppMessage', 'shareTimeline']
                            })
                        } else {
                            Taro.hideShareMenu()
                        }
                        this.setState({
                            courseDesc: res.data.data,
                            teacherId: res.data.data.teacher.teacherId,
                            teacherName: res.data.data.teacher.teacherName,
                            teacherImg: res.data.data.teacher.teacherImg,
                            tid: res.data.data.teacher.userId,
                            // likeNum: res.data.data.hit,
                            liveStatus: res.data.data.liveStatus,
                            roomStatus: res.data.data.roomStatus,
                            background: res.data.data.beginUrl,
                            c_integral: res.data.data.integral,
                            canBuy: res.data.data.canBuy,
                            vantss: res.data.data.likeNum,
                            publishType: res.data.data.publishType
                        }, () => {
                            if (this.state.userId == this.state.tid && !(this.state.liveStatus === 0 && this.state.roomStatus === 0) || (this.state.liveStatus === 2 && this.state.roomStatus === 1) || (this.state.liveStatus === 2 && this.state.roomStatus === 3) || (this.state.liveStatus === 2 && this.state.roomStatus === 0)) {
                                this.intoRooms()
                            }
                            if (!this.state.forteach && this.state.teacherId) {
                                this.getTeachers()
                            }
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
                            if (this.state.c_integral > 0 && this.state.canBuy && this.state.userId > 0) {
                                var that = this
                                Taro.showModal({
                                    title: '提示',
                                    content: '请购买后继续观看',
                                    success: function (res) {
                                        if (res.confirm) {
                                            Taro.navigateTo({
                                                url: menu.buyCourse + '?courseId=' + that.state.courseDesc.courseId + '&coursename=' + percent2percent25(that.state.courseDesc.courseName) + '&courseImg=' + that.state.courseDesc.courseImg +
                                                    '&summary=' + percent2percent25(that.state.courseDesc.summary) + '&courseintegral=' + that.state.courseDesc.integral + '&teacherName=' + that.state.courseDesc.teacher.teacherName + '&honer=' +
                                                    that.state.courseDesc.teacher.honor + '&courseType=2' + '&payType=1'
                                            })
                                        } else if (res.cancel) {
                                            Taro.navigateBack({
                                                delta: 1
                                            })
                                        }
                                    }
                                })
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

                }
            })
    }
    _datecall = () => {
        this.getCourseDesc();
    }
    getConfigGift() {
        this.props.getConfigGift({
            gtype: 1
        })
    }
    getCourse = () => {
        const { courseId } = this.state
        api.get(inter.CourseDesc + courseId)
            .then(res => {
                if (res.data.status && res.data.data) {
                    // if (res.data.data.activityDTOs&&res.data.data.activityDTOs.length > 0) {
                    //     var ttime = new Date().getTime()
                    //     let list = res.data.data.activityDTOs

                    //     list = list.filter(item => item.endTime * 1000 + 180000 >= ttime)

                    //     if (list&&list.length > 0) {
                    //         var act = Math.min.apply(Math, list.map((e) => { return e.endTime }))
                    //         list = list.filter(itm => itm.endTime == act)
                    //         if(this.state.activityId!==list[0].activityId){
                    //             this.setState({
                    //                 activityDTO: list[0],
                    //                 activityId: list[0].activityId,
                    //             })
                    //         }else{
                    //             this.setState({
                    //                 activityDTO: null,
                    //                 activityId: 0,
                    //             })
                    //         }

                    //     }else{
                    //         this.setState({
                    //             activityDTO: null,
                    //             activityId: 0,
                    //         })
                    //     }
                    // }
                    this.setState({
                        courseDesc: res.data.data,
                        teacherName: res.data.data.teacher.teacherName,
                        teacherImg: res.data.data.teacher.teacherImg,
                        tid: res.data.data.teacher.userId,
                        likeNum: res.data.data.hit,
                        c_integral: res.data.data.integral,
                        canBuy: res.data.data.canBuy,
                    })
                }
            })
    }
    getUser(type) {
        var that = this
        const { courseId } = that.$router.params
        const { liveStatus } = that.state

        api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    let userData = res.data.data
                    let ads = res.data.data.addressList[0]
                    if (userData.addressList.length > 0) {
                        this.setState({
                            l_name: ads.realname,
                            l_mobile: ads.mobile,
                            l_address: ads.province + ads.city + ads.district + ads.address
                        })
                    }
                    // api.get(inter.CourseDesc + parseInt(courseId))
                    //     .then((res) => {
                    //         if (res.data.status) {
                    //             let courseData = res.data.data;
                    //             if (courseData.canPlay) {
                    //             } else {
                    //                 Taro.showModal({
                    //                     title: '直播提示',
                    //                     content: '该课程仅对特定用户可见',
                    //                     showCancel: false,
                    //                     success: function (res) {
                    //                         if (res.confirm) {
                    //                             Taro.switchTab({
                    //                                 url: menu.index
                    //                             })
                    //                         }
                    //                     }
                    //                 })
                    //             }
                    //         }
                    //     })

                    that.setState({
                        userinfo: userData,
                        userintegral: userData.integral + userData.rintegral,
                        userId: userData.userId,
                        userAvatar: userData.avatar,
                        userName: userData.nickname,
                        isAuth: userData.isAuth,
                        logs: true
                    }, () => {
                        this.getCourseDesc()
                        // this.intoRooms()
                        api.post(inter.leaveRoom, {
                            content_id: parseInt(courseId),
                            type: 1
                        }).then(res => {
                            api.get(inter.hitNums + courseId)
                                .then(res => {
                                    this.setState({
                                        likeNum: res.data.data
                                    })
                                })
                        })
                        if (type === 1) {
                            this._onChat();
                        }
                    })
                } else {
                    that.setState({
                        logs: false
                    })

                    // if (liveStatus === 0 || liveStatus === 1) {
                    setTimeout(() => {
                        that.setState({
                            isLogin: true,
                        })
                    }, 1000);

                    // }
                }
            })
    }
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
    _onChat() {
        var that = this;
        const { userId, userName, userAvatar, courseId } = that.state
        // console.log(liveroom+  courseId + '?name=' + userName + '&avatar=' + encodeURI(userAvatar) +'&uid='+ userId,);

        if (this.socketTask == null || this.socketTask.readyState != 1) {
            Taro.connectSocket({
                url: liveroom + courseId + '?name=' + encodeURI(userName) + '&avatar=' + encodeURI(userAvatar) + '&uid=' + userId,
            }).then(task => {
                that.socketTask = task;
                console.log(task, '///')
                that.handleCallback();
            })
        }
    }
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
    handleCallback() {
        var that = this;
        const { socketTask } = that
        const { speakerList, interactList, fullScreenFlag, comeList, rewardList, userId, courseDesc, courseId, likeCount, joinStatus, canJoin } = that.state;

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
                        if (chatList.user.id === userId) {
                            that.setState({
                                isToback: true,
                                msgTipType: false
                            })
                        } else {
                            that.setState({
                                isToback: false,
                                msgTipType: true
                            })
                        }

                        interactList.push(JSON.parse(data))
                    }
                }
                if (chatList.type === 'event-msg') {
                    if (chatList.user.admin === 1) {
                        if (chatList.msg.mtype === 'goods' || chatList.msg.mtype === 'gift') {
                        } else {
                            that.setState({
                                isToback: false,
                                msgTipType: true
                            })
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
                    come: true,
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            come: false
                        })
                    }, 7000);
                })
            } else if (chatList.type === 'event-mute') {
                this._eventKeyword(chatList.msg.msg);
            } else if (chatList.type === 'event-restore') {
                this._eventKeyword(chatList.msg.msg);
            } else if (chatList.type === 'event-system') {
                // console.log(chatList,'/////')
                that.setState({
                    userCount: chatList.userCount,
                })
                if (likeCount !== chatList.likeCount) {
                    this.setState({
                        likeCount: chatList.likeCount
                    })
                }
                if (canJoin !== chatList.canJoin) {
                    this.setState({
                        canJoin: chatList.canJoin
                    })
                }
                if (joinStatus !== chatList.joinStatus) {
                    this.setState({
                        joinStatus: chatList.joinStatus
                    })
                }
            } else if (chatList.type === 'event-kick-user') {
                this._eventkick();
            } else if (chatList.type === 'event-live') {
                let ots = Taro.getStorageSync('live_' + this.state.courseId)
                if (ots && this.state.tid == this.state.userId) {
                    if ((chatList.liveStatus === 0 && chatList.roomStatus === 0) || (chatList.liveStatus === 2 && chatList.roomStatus === 1) || (chatList.liveStatus === 2 && chatList.roomStatus === 3) || (chatList.liveStatus === 2 && chatList.roomStatus === 0)) {
                        this.intoRooms()
                    }
                }
                that.setState({
                    liveStatus: chatList.liveStatus,
                    roomStatus: chatList.roomStatus,
                }, () => {
                    // this.getCourseDesc()
                    // this._getVideos();
                    // if (fullScreenFlag) {
                    //     this.PlayerCtx.exitFullScreen({
                    //         success: res => {
                    //             that.setState({
                    //                 fullScreenFlag: false,
                    //             })
                    //         },
                    //         fail: res => {
                    //             console.log('exit fullscreen success');
                    //         }
                    //     });
                    // }
                    // if((this.state.liveStatus === 0 && this.state.roomStatus === 0) || (this.state.liveStatus === 2 && this.state.roomStatus === 1) || (this.state.liveStatus === 2 && this.state.roomStatus === 3) || (this.state.liveStatus === 2 && this.state.roomStatus === 0)){

                    // }else{
                    //     if (this.state.c_integral > 0 && this.state.canBuy && this.state.userId > 0)
                    //     Taro.showModal({
                    //         title: '提示',
                    //         content: '请购买后继续观看',
                    //         success: function (res) {
                    //             if (res.confirm) {
                    //                 Taro.navigateTo({
                    //                     url: menu.buyCourse + '?courseId=' + courseDesc.courseId + '&coursename=' + percent2percent25(courseDesc.courseName) + '&courseImg=' + courseDesc.courseImg +
                    //                         '&summary=' + percent2percent25(courseDesc.summary) + '&courseintegral=' + courseDesc.integral + '&teacherName=' + courseDesc.teacher.teacherName + '&honer=' +
                    //                         courseDesc.teacher.honor + '&courseType=2'+'&payType=1'
                    //                 })
                    //             } else if (res.cancel) {
                    //                 Taro.navigateBack({
                    //                     delta: 1
                    //                 })
                    //             }
                    //         }
                    //     })
                    // }
                })
            } else if (chatList.type === "event-cancel") {
                this._getChatId(chatList.msg.msg);
            } else if (chatList.type === "event-keyword") {
                this._eventKeyword(chatList.msg.msg);
            } else if (chatList.type === "event-live-apply") {
                let lm_list = this.state.lm_list
                if (chatList.user.uid == this.state.userId) {
                    if (lm_list.filter(item => item.uid == chatList.user.uid).length == 0) {
                        lm_list.push(chatList.user)
                        this.setState({
                            lm_list: lm_list
                        }, () => {
                            Taro.showToast({
                                title: '申请成功',
                                icon: 'none',
                                duration: 1000
                            })
                        })
                    } else {
                        Taro.showToast({
                            title: '已申请',
                            icon: 'none',
                            duration: 1000
                        })
                    }
                }

                if (this.state.tid == this.state.userId) {
                    if (lm_list.filter(item => item.uid == chatList.user.uid).length == 0) {
                        lm_list.push(chatList.user)
                        this.setState({
                            lm_list: lm_list
                        })
                    }
                }
            } else if (chatList.type === "event-live-leave") {
                if (this.state.islm_persom || this.state.tid == this.state.userId) {
                    Taro.showToast({
                        title: '结束连麦',
                        icon: 'none',
                        duration: 2000
                    })
                    setTimeout(() => {
                        wx.setKeepScreenOn({
                            keepScreenOn: true
                        })
                    }, 5000);
                }
                if (this.state.islm_persom) {
                    // this.client && this.client.unpublish()
                    setTimeout(() => {
                        this.setState({
                            persolal_lm: false,
                            islm_persom: false,
                        }, () => {
                            this.client && this.client.leave();
                        })
                    }, 2000);
                }
                // if( this.state.tid == this.state.userId || this.state.userId == 362295){
                //     this.client && this.client.unsubscribe(this.state.lm_id)
                // }
                setTimeout(() => {
                    this.setState({
                        isInlianmai: false
                    })
                }, 2000);
            } else if (chatList.type === "event-live-confirm") {
                // console.log(chatList, "event-live-confirm")
                this.setState({
                    isInlianmai: true,
                    lm_id: chatList.user.uid
                })
                if (this.state.tid == this.state.userId || chatList.user.uid == this.state.userId) {
                    Taro.showToast({
                        title: '开始连麦',
                        icon: 'none',
                        duration: 1000
                    })
                }
                if (chatList.user.uid == this.state.userId) {
                    this.setState({
                        islm_persom: true,
                        persolal_lm: true,
                    }, () => {
                        this.intoRooms()
                    })
                }

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
    _onMail(goods) {
        let adlink = goods.goodsLink
        if (adlink.substring(0, 4) == 'http') {
            api.post(inter.userHistory, {
                cctype: 1,
                etype: 107,
                ctype: 3,
                contentId: this.state.courseId
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

    onBang = () => {
        const { courseId, background } = this.state
        Taro.navigateTo({
            url: menu.bangDan + '?courseId=' + courseId + '&background=' + background
        })
    }
    onReservation = () => {
        const { userId, courseId, teacherId } = this.state;
        var page = this.page
        var that = this
        // if (userId > 0) {
        //     let tmpId = 'bH2whf7pY40T4COena9BrTi3jPQDM4Ls9CRaEW7ycqU'
        //     Taro.requestSubscribeMessage({
        //         tmplIds: [tmpId],
        //         success(res) {
        //             api.post(inter.bookCourse + courseId, {
        //                 form_id: 'wxapp',
        //             }).then(res => {
        //                 that.getCourse()
        //             })
        //         }
        //     })
        // }
        api.post(inter.PublishFollow + teacherId).then((res) => {
            if (res.data.status) {
                Taro.showToast({
                    title: '关注成功',
                    icon: 'none',
                    duration: 1500,
                })
                that.getTeachers()
            } else {
                Taro.showToast({
                    title: '该直播未绑定讲师用户，无法关注',
                    icon: 'none',
                    duration: 2000
                })
            }
        })

    }
    onReservations = () => {
        const { userId, courseId, teacherId } = this.state;
        var that = this
        api.post(inter.RemoveFollow + teacherId).then((res) => {
            if (res.data.status) {
                Taro.showToast({
                    title: '取消成功',
                    icon: 'none',
                    duration: 1500,
                })
                that.getTeachers()
            } else {
                Taro.showToast({
                    title: '取消失败',
                    icon: 'none'
                })
            }
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
    //发送消息
    _onSend() {
        var that = this
        const { say, logs, courseId, userCount, canSend } = that.state;
        if (this.socketTask.readyState != 1) {
            Taro.showToast({
                icon: 'none',
                title: '请重新进入直播间'
            });
            return;
        }
        if (!canSend) {
            Taro.showToast({
                icon: 'none',
                title: '您发送消息过于频繁，请稍后再发',
                duration: 1500
            });
            return;
        }
        if (say.length > 0) {
            let data = {
                mtype: "text",
                msg: say
            }
            api.post(inter.liveCheck, {
                content: say,
                courseId: courseId
            }).then(res => { })
            Taro.sendSocketMessage({
                data: JSON.stringify(data),
            })
            that.setState({
                say: '',
                // typeEmjio: false
            })
            if (userCount > 30 && userCount < 200) {
                that.setState({
                    canSend: false
                }, () => {
                    setTimeout(() => {
                        that.setState({
                            canSend: true
                        })
                    }, 5000);
                })
            } else if (userCount >= 200 && userCount < 500) {
                that.setState({
                    canSend: false
                }, () => {
                    setTimeout(() => {
                        that.setState({
                            canSend: true
                        })
                    }, 10000);
                })
            } else if (userCount >= 500 && userCount < 800) {
                that.setState({
                    canSend: false
                }, () => {
                    setTimeout(() => {
                        that.setState({
                            canSend: true
                        })
                    }, 15000);
                })
            } else if (userCount >= 800 && userCount < 1000) {
                that.setState({
                    canSend: false
                }, () => {
                    setTimeout(() => {
                        that.setState({
                            canSend: true
                        })
                    }, 20000);
                })
            } else if (userCount >= 1000) {
                that.setState({
                    canSend: false
                }, () => {
                    setTimeout(() => {
                        that.setState({
                            canSend: true
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

    }
    _onFinishReward(e) {
        var that = this;
        const { rewardList } = that.state;

        rewardList.shift();

        that.setState({
            rewardList: rewardList
        })
    }
    onvant = () => {
        const { vant, now, vants, courseDesc, courseId, van_list, likeCount, vantss, vantCount } = this.state
        let url_s = ['https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/9759bafa-ecb2-446d-92c3-4371500cd7bd.gif',
            'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/4be31d59-116f-4b55-a957-178716db7351.gif',
            'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/4be31d59-116f-4b55-a957-178716db7351.gif',
            'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/24d89323-b65c-49ac-8845-fb42d57d22b9.gif',
            'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/0a7f6ee3-e81b-434d-961b-c85a2119366e.gif',
            'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/fc98435a-df55-4201-aaa9-b01d41539d3c.gif']

        let idxs = Math.floor((Math.random() * url_s.length))
        let lst = van_list
        lst = lst.concat(url_s[idxs])
        this.setState({
            vants: 1,
            van_list: lst,
            vantCount: vantCount + 1,
        })
        if (likeCount > vantss) {
            this.setState({
                vantss: likeCount + 1
            })
        } else {
            this.setState({
                vantss: vantss + 1
            })
        }

    }
    hides = () => {
        const { vant, now, vants, courseDesc, courseId, van_list } = this.state
        let vas = van_list.filter((item, index) => index != 0)
        this.setState({
            van_list: vas,
            vants: 0
        })
    }
    _onTypegift() {
        var that = this
        const { userId } = that.state

        if (userId > 0) {
            that.setState({
                typegift: true
            })
        } else {
            this.refs.auth.doLogin();
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
    onOpen = () => {
        const { goodList, glist } = this.state
        let adlink = glist.goodsLink
        if (adlink.substring(0, 4) == 'http') {
            let adl = encodeURIComponent(adlink)
            console.log(adl)
            let dl = decodeURIComponent(adl)
            console.log(dl)
            api.post(inter.userHistory, {
                etype: 107,
                ctype: 3,
                content_id: this.state.courseId,
                cctype: 1
            }).then(res => { })
            Taro.navigateTo({ url: menu.adWebView + '?link=' + `${adl}` })
        } else if (adlink.substring(1, 5) == 'mail') {
            api.post(inter.userHistory, {
                etype: 107,
                ctype: 3,
                content_id: this.state.courseId,
                cctype: 1
            }).then(res => { })
            Taro.navigateTo({ url: adlink })
        } else {
            api.post(inter.userHistory, {
                etype: 107,
                ctype: 3,
                content_id: this.state.courseId,
                cctype: 1
            }).then(res => { })
            api.post(inter.userYcToken, {})
                .then((res) => {
                    if (res.data.status) {
                        let data = res.data.data;

                        wx.navigateToMiniProgram({
                            appId: 'wxf2bb2960b32a82c3',
                            path: adlink,
                            envVersion: 'release',
                            extraData: {
                                token: data.msg,
                            },
                            success(res) {
                                // console.info(res);
                            }
                        });
                    }
                })
        }
    }
    toMails = () => {
        const { goodList } = this.state
        if (goodList.length > 0) {
            let idx = Math.floor((Math.random() * goodList.length))
            this.setState({
                tipps: 1,
            }, () => {
                setTimeout(() => {
                    this.setState({
                        tipps: 0,
                        glist: goodList[idx]
                    })
                }, 10000);
            })
        }
    }
    _onSwiper(e) {
        var that = this;
        that.setState({
            Jcurrent: e.detail.current
        })
    }
    _onSelectGift(gf) {
        var that = this
        that.setState({
            gfIntegral: gf.integral,
            gfId: gf.giftId,
            gifttImg: gf.giftImg,
            giftName: gf.giftName
        })
    }
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
            if (res.data.message == '已填写') {
                Taro.showToast({
                    title: '您已填写',
                    icon: 'success',
                    duration: 1500
                })
            } else {
                Taro.showToast({
                    title: '填写成功',
                    icon: 'success',
                    duration: 1500
                })
            }
            this.setState({
                open: 0,
                prize_type: 0
            })
        })
    }
    handleStop(e) {
        e.stopPropagation()
    }
    _goodslayer = () => {
        var that = this;
        that.setState({
            goodlayer: false
        })
    }
    _goodsCart = () => {
        var that = this;
        that.setState({
            goodlayer: true
        })
    }
    goBack = () => {
        let pages = Taro.getCurrentPages()
        // console.log(pages)
        if (pages.length == 1) {
            Taro.switchTab({
                url: menu.index
            })
        } else {
            Taro.navigateBack({
                delta: 1
            })
        }

    }
    ontips = (val) => {
        const { askList, pages, questionActivityDTOs, answers, asklst } = this.state
        // console.log(val)
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
    getNums = (val) => {
        if (val <= 9999) {
            return val
        } else if (val > 9999 && val <= 99999) {
            return val.toString().slice(0, 1) + 'w+'
        } else if (val > 99999 && val <= 999999) {
            return val.toString().slice(0, 1) + val.toString().slice(1, 2) + 'w+'
        } else if (val > 999999 && val <= 9999999) {
            return val.toString().slice(0, 1) + val.toString().slice(1, 2) + val.toString().slice(2, 3) + 'w+'
        } else if (val > 9999999 && val <= 99999999) {
            return val.toString().slice(0, 1) + 'kw+'
        } else if (!val) {
            return '0'
        } else {
            return '10kw+'
        }
    }
    onShenqin = () => {
        const { courseId, isInlianmai } = this.state
        // api.post(inter.applyLianmai, {
        //     course_id: courseId,
        //     is_connect: 0,
        // }).then(res => {
        //     if (res.data.message) {
        //         Taro.showToast({
        //             title: res.data.message,
        //             icon: 'none',
        //             duration: 2000,
        //         })
        //     } else {
        //         Taro.showToast({
        //             title: '申请成功',
        //             icon: 'success',
        //             duration: 2000,
        //         })
        //     }
        // })
        if (isInlianmai) {
            Taro.showToast({
                title: '主播正在连麦中,请稍等',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        let data = {
            mtype: 'live-apply',
            msg: ''
        }
        Taro.sendSocketMessage({
            data: JSON.stringify(data)
        })
        this.checkDeviceAuthorize()
    }
    checkDeviceAuthorize = () => {
        wx.getSetting().then((result) => {
            console.log('getSetting', result)
            this.authorizeMic = result.authSetting['scope.record']
            this.authorizeCamera = result.authSetting['scope.camera']
            if (result.authSetting['scope.camera'] && result.authSetting['scope.record']) {
                wx.authorize({
                    scope: 'scope.camera',
                    success(resSuccess){
                        console.log(resSuccess)
                    },
                    fail(resFail){
                        console.log(resFail)
                    }
                })
                // 授权成功
            } else {
                // 没有授权，弹出授权窗口
                // 注意： wx.authorize 只有首次调用会弹框，之后调用只返回结果，如果没有授权需要自行弹框提示处理
                wx.authorize({
                    scope: 'scope.camera',
                    success(resSuccess){

                    }
                })
            }
        })
    }
    toLianmaiList = () => {
        const { courseId } = this.state
        // Taro.navigateTo({ url: menu.lianMai + '?courseId=' + courseId })
        this.setState({
            openList_lm: true
        })
    }
    closeLianmai = () => {
        // api.post(inter.startLianmai, {
        //     course_id: this.state.courseId,
        //     target_id: this.state.targetId,
        //     type: 1
        // })
        let data = {
            mtype: 'live-leave',
            msg: ''
        }
        Taro.sendSocketMessage({
            data: JSON.stringify(data)
        })
        api.post('/site/remove/channel/user', {
            channel_id: 'live_' + this.state.courseId,
            user_id: this.state.lm_id
        }, 1)
    }
    intoRooms = () => {
        if (this.state.tid == this.state.userId) {
            let ots = Taro.getStorageSync('live_' + this.state.courseId)
            if (ots) {
                this.initAliRtcChannel().then(url => {
                    let ts = new Date().getTime()
                    this.addMedia(0, this.state.userId, url, {
                        key: ts,
                        name: this.state.userName
                    });
                    // this.client.setRole('broadcaster')
                })
            } else {
                api.post('/site/sub/channel/event', {
                    channel_id: 'live_' + this.state.courseId,
                    action: 'create'
                }, 1).then(res => {
                    this.initAliRtcChannel().then(url => {
                        Taro.setStorageSync('live_' + this.state.courseId, true)
                        let ts = new Date().getTime()
                        this.addMedia(0, this.state.userId, url, {
                            key: ts,
                            name: this.state.userName
                        });
                        // this.client.setRole('broadcaster')
                    })
                })
            }
        } else {
            this.initAliRtcChannel().then(url => {
                let ts = new Date().getTime()
                this.addMedia(0, this.state.userId, url, {
                    key: ts,
                    name: this.state.userName
                });
                // this.client.setRole('broadcaster')
            })
        }


    }
    openLive = () => {
        api.post(inter.startLives, {
            course_id: this.state.courseId,
            type: 0
        }).then(res => {
            this.setState({
                pushUrl: res.data.data.rtmp
            }, () => {
                this.intoRooms()
            })
        })
    }
    closeLive = () => {
        Taro.setStorageSync('live_' + this.state.courseId, false)
        api.post('/site/sub/channel/event', {
            channel_id: 'live_' + this.state.courseId,
            action: 'close'
        }, 1)
        api.post(inter.startLives, {
            course_id: this.state.courseId,
            type: 1
        }).then(res => {

        })
        if ((this.state.userId == this.state.tid || this.state.islm_persom) && !(this.state.liveStatus === 0 && this.state.roomStatus === 0) || (this.state.liveStatus === 2 && this.state.roomStatus === 1) || (this.state.liveStatus === 2 && this.state.roomStatus === 3) || (this.state.liveStatus === 2 && this.state.roomStatus === 0)) {
            let data = {
                mtype: 'live-leave',
                msg: ''
            }
            api.post('/site/remove/channel/user', {
                channel_id: 'live_' + this.state.courseId,
                user_id: this.state.lm_id
            }, 1)
            Taro.sendSocketMessage({
                data: JSON.stringify(data)
            })
        }
    }
    /**
   * 初始化SDK 并入会推流
   * 
   */
    GenerateAliRtcAuthInfo = () => {
        let channelId = 'live_' + this.state.courseId
        let userId = this.state.userId
        var appId = "9s8u0imx"; // 修改为自己的appid 该方案仅为开发测试使用，正式上线需要使用服务端的AppServer
        var key = "33b55700c8d1e72d3163677ecb919c61";     // 修改为自己的key 该方案仅为开发测试使用，正式上线需要使用服务端的AppServer
        var timestamp = parseInt(new Date().getTime() / 1000 + 48 * 60 * 60);
        var nonce = 'AK-' + timestamp;
        var token = sha256(appId + key + channelId + userId + nonce + timestamp);
        return {
            appid: appId,
            userid: userId,
            timestamp: timestamp,
            nonce: nonce,
            token: token,
            gslb: ["https://rgslb.rtc.aliyuncs.com"],
            channel: channelId
        };
    }
    initAliRtcChannel() {
        return new Promise((resolve, reject) => {
            let client = {}
            client = new AliRtcMiniappSDK()
            this.client = client;
            this.subscribeEvents(client);
            let authInfo = this.GenerateAliRtcAuthInfo()
            client.join(authInfo, () => {
                // 推流获取推流地址
                client.publish(url => {
                    resolve(url);
                })
            }, (err) => {
                Taro.showToast({
                    title: 'publish failed',
                    icon: 'none',
                    duration: 2000
                })
                reject(err);
            }, (e) => {
                Taro.showToast({
                    title: `client join channel failed（${e.reason}）`,
                    icon: 'none',
                    duration: 2000
                })
                reject(e)
            })

        });
    }
    /**
   * 注册stream事件
   */
    subscribeEvents(client) {
        /**
         * fired when new stream join the channel
         */
        client.on("stream-added", e => {
            // console.log(e, 'stream-added')
            let { uid, displayName } = e;
            const ts = new Date().getTime();

            /**
             * subscribe to get corresponding url
             */
            client.subscribe(uid, (url) => {
                let media = this.state.media || [];
                let matchItem: any = null;
                for (let i = 0; i < media.length; i++) {
                    let item = this.state.media[i];
                    if (item.uid === uid) {
                        //if existing, record this as matchItem and break
                        matchItem = item;
                        break;
                    }
                }

                if (!matchItem) {
                    //if not existing, add new media
                    this.addMedia(1, uid, url, {
                        key: ts,
                        name: displayName,
                        audio: true,
                        video: true
                    })
                } else {
                    // if existing, update property
                    // change key property to refresh live-player
                    this.updateMedia(matchItem.uid, {
                        url: url,
                        key: ts,
                    });
                }
            }, e => {
                console.log(e, 'subscribeEvents')
            });
        });

        /**
         * remove stream when it leaves the channel
         */
        client.on("stream-removed", e => {
            // console.log(e, 'stream-removed')
            let { uid } = e;

            this.removeMedia(uid);
        });

        client.on("mute-audio", (e) => {
            // console.log(e, 'mute-audio')
            let { uid } = e;
            this.updateMedia(uid, {
                audio: false
            })
        })

        client.on("mute-video", (e) => {
            // console.log(e, 'mute-video')
            let { uid } = e;
            this.updateMedia(uid, {
                video: false
            })
        })

        client.on("unmute-audio", (e) => {
            // console.log(e, 'unmute-audio')
            let { uid } = e;
            this.updateMedia(uid, {
                audio: true
            })
        })

        client.on("unmute-video", (e) => {
            // console.log(e, 'unmute-video')
            let { uid } = e;
            this.updateMedia(uid, {
                video: true
            })
        })

        client.on("leave", (e) => {
            // console.log(e, 'leave')
            let { uid } = e;
            this.removeMedia(uid);
        })

        /**
         * when bad thing happens - we recommend you to do a 
         * full reconnect when meeting such error
         * it's also recommended to wait for few seconds before
         * reconnect attempt
         */
        client.on("error", err => {
            // console.log(err, 'error')
            let errObj = err || {};
            let code = errObj.code || 0;
            let reason = errObj.reason || "";

            if (code !== 100002) {
                Taro.showToast({
                    title: `[error] code: ${code} reason ${reason}`,
                    icon: 'none',
                    duration: 2000
                })
            } else {
                Taro.showModal({
                    title: '发生错误',
                    content: '[100002]websocket断开,是否重连？',
                    success: (res) => {
                        if (res.confirm) {
                            const pages = Taro.getCurrentPages();
                            const currentPage = pages[pages.length - 1];
                            const url = `/${currentPage.route}`;
                            let optionsStr = "?"
                            for (let i in this.options) {
                                optionsStr += i + '=' + this.options[i] + '&'
                            }
                            optionsStr = optionsStr.substring(0, optionsStr.length - 1)
                            Taro.redirectTo({
                                url: `${url}${optionsStr}`
                            })
                        } else if (res.cancel) {
                            Taro.navigateBack()
                        }
                    }
                })
            }
        });
    }
    removeMedia(uid) {
        let media = this.state.media || [];
        media = media.filter(item => {
            return item.uid != uid
        });

        if (media.length !== this.state.media.length) {
            media = this.syncLayout(media);
            this.refreshMedia(media);
        } else {
            return Promise.resolve();
        }
    }
    updateMedia(uid, options) {
        let media = this.state.media || [];
        let changed = false;
        for (let i = 0; i < media.length; i++) {
            let item = media[i];
            if (item.uid == uid) {
                media[i] = Object.assign(item, options);
                changed = true;
                break;
            }
        }

        if (changed) {
            return this.refreshMedia(media);
        } else {
            return Promise.resolve();
        }
    }
    addMedia(mediaType, uid, url, options) {
        let media = this.state.media || [];

        if (mediaType === 0) {
            //pusher
            let tag = 0;
            if (media.length >= 1 && media[0].type === 0) {
                tag = 1
            }
            media.splice(0, tag, {
                key: options.key,
                type: mediaType,
                uid: `${uid}`,
                name: options.name,
                holding: false,
                url: url,
                left: 0,
                top: 0,
                width: 0,
                height: 0
            });
        } else {
            //player
            media.push({
                key: options.key,
                type: mediaType,
                uid: `${uid}`,
                holding: false,
                name: options.name,
                audio: options.audio,
                video: options.video,
                url: url,
                left: 0,
                top: 0,
                width: 0,
                height: 0
            });
        }

        media = this.syncLayout(media);
        return this.refreshMedia(media);
    }
    syncLayout = (media) => {
        // let sizes = this.layouter.getSize(media.length);
        // for (let i = 0; i < sizes.length; i++) {
        //     let size = sizes[i];
        //     let item = media[i];

        //     if (item.holding) {
        //         //skip holding item
        //         continue;
        //     }

        //     item.left = parseFloat(size.x).toFixed(2);
        //     item.top = parseFloat(size.y).toFixed(2);
        //     item.width = parseFloat(size.width).toFixed(2);
        //     item.height = parseFloat(size.height).toFixed(2);
        // }
        return media;
    }
    refreshMedia = (media) => {
        return new Promise((resolve) => {
            if (media !== this.state.media) {
                this.setState({
                    media: media
                }, () => {
                    resolve();
                });
            }
        });
    }
    /**
   * 推流设置
   */
    onRepublish = () => {
        let ts = new Date().getTime();
        if (!this.client) {
            // 未推流状态进行推流

            this.client.publish((url) => {
                this.addMedia(0, this.state.userId, url, {
                    key: ts,
                    name: this.state.userName
                });
            }, e => {
                Taro.showToast({
                    title: 'publish failed',
                    icon: 'none',
                    duration: 2000
                })
            });
        } else {
            // 已推流状态停止推流后重新推流
            this.client.unpublish(() => {
                this.removeMedia(this.state.userId);
                this.client.publish((url) => {
                    this.addMedia(0, this.state.userId, url, {
                        key: ts,
                        name: this.state.userName
                    });
                }, e => {
                    Taro.showToast({
                        title: `client publish failed`,
                        icon: 'none',
                        duration: 2000
                    })
                });
            }, err => {
                Taro.showToast({
                    title: 'unpublish failed',
                    icon: 'none',
                    duration: 2000
                })
            });
        }
    }
    onOk = (val) => {
        if (this.state.isInlianmai) {
            Taro.showToast({
                title: '您正在连麦中',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        let data = {
            mtype: "live-confirm",
            msg: "",
            tuid: val.id
        }
        Taro.sendSocketMessage({
            data: JSON.stringify(data)
        })
        Taro.showToast({
            title: '开始连麦，请稍等',
            icon: 'none',
            duration: 1000
        })
        let lm_list = this.state.lm_list.filter(item => item.uid !== val.uid)
        this.setState({
            openList_lm: false,
            lm_list: lm_list,
        })
    }
    render() {
        const { typegift, teacherImg, teacherName, tid, status, open, prize_type, prize_list, courseDesc, userName, userAvatar, say, speakerList, comeList, interactList, rewardList, come, vant, gfIntegral, userintegral, goodList, vants, gfId, activityDTO, lottery, userId, lotteryList, l_address, l_mobile, l_name, likeNum, tipps, idxs, glist, isFollow, van_list, gooddesc, gooddescType, touch, fullScreenFlag, userCount, liveStatus, roomStatus, logs, goodlayer, cartList, background, c_integral, canBuy, questionActivityDTOs, askList, pages, attyps, optionId, ttime, likeCount, vantss, asklst, seconds, minutes, emojiList, liveUrl, isInlianmai, media, openList_lm, lm_list, joinStatus, canJoin, publishType } = this.state

        const { home } = this.props
        const { giftList } = home
        //礼物8个人一组
        let lm_num = 0
        if (lm_list.length > 0) {
            lm_num = lm_list.length
        }
        let giftst: any[] = new Array()
        for (let i = 0; i < giftList.length; i += 8) {
            giftst.push(giftList.slice(i, i + 8));
        }

        if (van_list.length > 0) {
            setTimeout(() => {
                this.hides()
            }, 900);
        }
        let isTeacher = false
        if (userId === tid) {
            isTeacher = true
        } else {
            isTeacher = false
        }
        let teach_watch: any = { uid: 0, url: '' }
        let user_watch: any = { uid: 0, url: '' }
        if (media.filter(item => item.uid == this.state.lm_id).length > 0) {
            teach_watch = media.filter(item => item.uid == this.state.lm_id)[media.filter(item => item.uid == this.state.lm_id).length - 1]
        }
        if (media.filter(item => item.uid == this.state.tid).length > 0) {
            user_watch = media.filter(item => item.uid == this.state.tid)[0]
        }
        return (
            <View className='box' onClick={() => {
                if (touch == 1) {
                    this.setState({
                        touch: 0
                    })
                } else {
                    this.setState({
                        touch: 1
                    })
                }

            }}>

                <View className='row col p_10 top'>
                    <View className='row jc_sb'>
                        <View className='mt' onClick={this.handleStop.bind(this)}>
                            <View className='row ai_ct'>
                                <Image src={asset.back_w} className='size_34 ml_10' onClick={this.goBack} />
                                <View className='cover ml_10'>
                                    <Image src={teacherImg ? teacherImg : 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1abe17a5-8f6e-48f8-b61d-fa8ac4eb2912.png'} className='pictures bdr' />
                                </View>
                                <View className='row col ml_5'>
                                    <View className='label_white label_12'>{teacherName}</View>
                                    <View className='label_white label_12'>{likeNum}人观看</View>
                                </View>
                                {
                                    isTeacher && publishType == 1 ?
                                        <View>
                                            {
                                                (liveStatus === 0 && roomStatus === 0) || (liveStatus === 2 && roomStatus === 1) || (liveStatus === 2 && roomStatus === 3) || (liveStatus === 2 && roomStatus === 0) ?
                                                    <View className='label_white label_14 btn_a row jc_ct ai_ct ml_20' onClick={this.openLive}>
                                                        开始直播
                                                </View>
                                                    :
                                                    <View className='label_white label_14 btn_b row jc_ct ai_ct ml_20' onClick={this.closeLive}>
                                                        关闭直播
                                                </View>
                                            }
                                        </View>
                                        :
                                        <View>
                                            {
                                                isFollow ?
                                                    <View className='label_white label_14 btn_b row jc_ct ai_ct ml_20' onClick={this.onReservations}>
                                                        已关注
                                                    </View>
                                                    :
                                                    <View className='label_white label_14 btn_a row jc_ct ai_ct ml_20' onClick={this.onReservation}>
                                                        +关注
                                                    </View>
                                            }
                                        </View>

                                }


                            </View>
                            {
                                (liveStatus === 0 && roomStatus === 0) || (liveStatus === 2 && roomStatus === 1) || (liveStatus === 2 && roomStatus === 3) || (liveStatus === 2 && roomStatus === 0) ?
                                    null
                                    :
                                    <View className='lmsa'>
                                        {
                                            canJoin == 1?
                                                <View>
                                                    {
                                                        isInlianmai && (this.state.islm_persom || isTeacher) ?
                                                            <View className='lsm_btn' onClick={this.closeLianmai}>
                                                                <View className='lsms'>
                                                                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1655360999429.png'} style={{ width: '100%', height: '100%' }} />
                                                                </View>
                                                                <View className='label_8a row jc_ct ai_ct'>
                                                                    关闭连麦
                                                                 </View>
                                                            </View>
                                                            :
                                                            <View>
                                                                {
                                                                    isTeacher ?
                                                                        <View className='lsm_btn' onClick={this.toLianmaiList}>
                                                                            <View className='lsms'>
                                                                                <Image src={lm_num == 0 ? 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1655360999429.png' : 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1655517657870.png'} style={{ width: '100%', height: '100%' }} />
                                                                            </View>
                                                                            <View className={lm_num == 0 ? 'label_8a row jc_ct ai_ct' : 'sred_label row jc_ct ai_ct'}>
                                                                                连麦列表
                                                                            </View>
                                                                        </View>
                                                                        :
                                                                        <View className='lsm_btn' onClick={this.onShenqin}>
                                                                            <View className='lsms'>
                                                                                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1655517657870.png'} style={{ width: '100%', height: '100%' }} />
                                                                            </View>
                                                                            <View className={'sred_label row jc_ct ai_ct'}>
                                                                                连麦申请
                                                                            </View>
                                                                        </View>
                                                                }
                                                            </View>
                                                    }
                                                </View>
                                                : null
                                        }
                                    </View>
                            }
                            <View className='row ai_ct mt_20 ml_10 bangdan' onClick={this.onBang}>
                                <Image src={asset.bang} className='size_18' />
                                <View className='label_white label_12 ml_5'>贡献榜</View>
                                <Image src={asset.right_w} className='size_10 ml_5' />
                            </View>
                            {
                                activityDTO && (activityDTO.beginTime * 1000) - ttime <= 0 && ttime <= (activityDTO.endTime * 1000) ?
                                    <View className='mt_30 ml_10 row col'>
                                        <Image src={asset.prize_ic} className='size_60' onClick={() => { this.setState({ open: 1 }) }} />
                                        {
                                            ttime <= (activityDTO.endTime * 1000) ?
                                                <View className='label_white label_16 ml_8 mt_5'>{minutes ? minutes : '00'}:{seconds ? seconds : '00'}</View>
                                                : null
                                        }

                                    </View>
                                    : null
                            }
                            {
                                activityDTO && ttime > (activityDTO.endTime * 1000) && ttime <= (activityDTO.endTime * 1000 + 180000) ?
                                    <View className='mt_30 ml_10 row col'>
                                        <Image src={asset.prize_ic} className='size_60' onClick={this.forLottery} />
                                        <View className='label_white label_16 ml_8 mt_5'>已开奖</View>
                                    </View>
                                    : null
                            }

                        </View>
                        <View className='mt2'>
                            {/* <View className='row jc_ct ai_ct btn_b'>
                                <Image src={asset.share_w} className='size_20' />
                                <View className='label_white label_20 ml_10'>|</View>
                                <Image src={asset.close_w} className='size_20 ml_10' onClick={() => { Taro.navigateBack({ delta: 1 }) }} />
                            </View> */}
                        </View>
                    </View>
                </View>
                <View className='read_box row col'>
                    <View className='read row col'>
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
                                    if (rewardList.length > 0 && index == rewardList.length - 1) {
                                        return (
                                            <SwiperItem style={{ width: '100%', height: '5vh' }} key={'reward' + index}>
                                                <View className='row ai_ct red_box'>
                                                    <View className='label_white label_15 ml_8'>{reward_arr[0]}打赏{gifttxt}</View>
                                                    <Image src={imgurl} style={{ width: '40rpx', height: '40rpx' }} />
                                                    <View className='label_white label_15 mr_20'>x1</View>
                                                </View>
                                            </SwiperItem>
                                        )
                                    }

                                })
                            }
                            <SwiperItem>
                                <Text></Text>
                            </SwiperItem>
                        </Swiper>
                        {
                            logs === true && come && comeList.length > 0 ?
                                <View className='row ai_ct green_box mt_8'>
                                    <View className='label_white label_14 ml_8 mr_20'>{comeList[comeList.length - 1]}来了</View>
                                </View>
                                :
                                null
                        }
                    </View>
                    <View className={touch == 0 ? 'opty' : null}>
                        <View onClick={() => {
                            this.setState({
                                touch: 1
                            })
                        }}>
                            <ScrollView
                                className='words'
                                scrollY
                                scrollWithAnimation
                                scrollIntoView={'t' + (speakerList.length - 1).toString()}
                            >
                                <View className='row col cls'>
                                    {
                                        speakerList.map((item, index) => {
                                            let chatSpekList: any[] = textToEmoji(item.msg.msg)
                                            if (index < speakerList.length && index >= speakerList.length - 50) {
                                                return (
                                                    <View className={'mt_10 main'} id={'t' + index} key={'t_' + index}>

                                                        <Text className='label_15 label_white ml_4'>{item.user.name} :</Text>

                                                        {
                                                            item.msg.mtype === "img" || item.msg.mtype === "url" ?
                                                                <Text className='label_white label_15 ml_5 lighter'>{item.msg.msg}</Text>
                                                                : null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList[0].msgType === 'text' ?
                                                                <Text className='label_white label_15 ml_5 lighter'>{item.msg.msg}</Text>
                                                                :
                                                                <Image src={chatSpekList[0].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 1 && chatSpekList[1].msgType !== 'text' ?
                                                                <Image src={chatSpekList[1].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 2 && chatSpekList[2].msgType !== 'text' ?
                                                                <Image src={chatSpekList[2].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 3 && chatSpekList[3].msgType !== 'text' ?
                                                                <Image src={chatSpekList[3].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 4 && chatSpekList[4].msgType !== 'text' ?
                                                                <Image src={chatSpekList[4].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 5 && chatSpekList[5].msgType !== 'text' ?
                                                                <Image src={chatSpekList[5].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 6 && chatSpekList[6].msgType !== 'text' ?
                                                                <Image src={chatSpekList[6].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 7 && chatSpekList[7].msgType !== 'text' ?
                                                                <Image src={chatSpekList[7].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 8 && chatSpekList[8].msgType !== 'text' ?
                                                                <Image src={chatSpekList[8].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 9 && chatSpekList[9].msgType !== 'text' ?
                                                                <Image src={chatSpekList[9].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 10 && chatSpekList[10].msgType !== 'text' ?
                                                                <Image src={chatSpekList[10].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 11 && chatSpekList[11].msgType !== 'text' ?
                                                                <Image src={chatSpekList[11].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }

                                                    </View>
                                                )
                                            }
                                        })
                                    }
                                </View>
                            </ScrollView>
                            <View className='grads'>
                                <ScrollView
                                    className='word '
                                    scrollY
                                    scrollIntoView={'a' + (interactList.length - 1).toString()}
                                >
                                    {/* <View className='row col '> */}
                                    {
                                        interactList.map((item: any, index) => {
                                            let chatSpekList: any[] = textToEmoji(item.msg.msg)
                                            if (index < interactList.length && index >= interactList.length - 50) {
                                                return (
                                                    <View className={item.user.id != tid ? 'mt_10 mains' : 'mt_10 main'} id={'a' + index} key={'a' + index}>
                                                        {
                                                            item.user.id != tid ?
                                                                <Text className={index % 3 == 1 ? 'labs_1' : index % 3 == 2 ? 'labs_2' : 'labs_3'}>{item.user.name} :</Text>
                                                                :
                                                                <Text className='label_15 label_white ml_4'>{item.user.name} :</Text>
                                                        }
                                                        {
                                                            item.msg.mtype === "img" || item.msg.mtype === "url" ?
                                                                <Text className='label_white label_15 ml_5 lighter'>{item.msg.msg}</Text>
                                                                : null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList[0].msgType === 'text' ?
                                                                <Text className='label_white label_15 ml_5 lighter'>{item.msg.msg}</Text>
                                                                :
                                                                <Image src={chatSpekList[0].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 1 && chatSpekList[1].msgType !== 'text' ?
                                                                <Image src={chatSpekList[1].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 2 && chatSpekList[2].msgType !== 'text' ?
                                                                <Image src={chatSpekList[2].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 3 && chatSpekList[3].msgType !== 'text' ?
                                                                <Image src={chatSpekList[3].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 4 && chatSpekList[4].msgType !== 'text' ?
                                                                <Image src={chatSpekList[4].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 5 && chatSpekList[5].msgType !== 'text' ?
                                                                <Image src={chatSpekList[5].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 6 && chatSpekList[6].msgType !== 'text' ?
                                                                <Image src={chatSpekList[6].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 7 && chatSpekList[7].msgType !== 'text' ?
                                                                <Image src={chatSpekList[7].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 8 && chatSpekList[8].msgType !== 'text' ?
                                                                <Image src={chatSpekList[8].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 9 && chatSpekList[9].msgType !== 'text' ?
                                                                <Image src={chatSpekList[9].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 10 && chatSpekList[10].msgType !== 'text' ?
                                                                <Image src={chatSpekList[10].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }
                                                        {
                                                            item.msg.mtype === "text" && chatSpekList.length > 11 && chatSpekList[11].msgType !== 'text' ?
                                                                <Image src={chatSpekList[11].msgImage} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                                                :
                                                                null
                                                        }

                                                    </View>
                                                )
                                            }
                                        })
                                    }
                                    {/* </View> */}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                    <View onClick={this.handleStop.bind(this)}>
                        <View className={'foot'} onClick={() => {
                            this.setState({
                                touch: 1
                            })
                        }}>
                            {
                                gooddescType ?
                                    <View className='qips'>
                                        <View className='qipao row ai_ct' onClick={this._onMail.bind(this, gooddesc)}>
                                            <View className='pic'>
                                                <Image src={gooddesc.goodsImg} className='picture' />
                                            </View>
                                            <View className='mess label_16'>
                                                {subNumTxt(gooddesc.goodsName, 9)}
                                            </View>
                                        </View>

                                        {/* <View className={gooddescType || goodList.length > 0 && tipps == 1 ? 'qipaoj' : 'qipaojs'}></View> */}
                                        <View className={'qipaoj'}></View>
                                    </View> : null
                            }

                            {/* <View className={'qipaojs'}></View> */}
                            <View className='row ai_ct mt_5'>
                                <View className='shops'>
                                    {goodList.length > 0 ? <View className='dips label_12'>{goodList.length}</View> : null}
                                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/7a2307cf-c512-47d7-a53b-4b1cdf402f40.png'} className='shop' onClick={this._goodsCart} />
                                </View>
                                <View className='label_white ml_10 intps'>
                                    <Input type='text' placeholder='说点什么吧' value={say} onInput={(e) => { this.setState({ say: e.detail.value }) }} onConfirm={this._onSend} />
                                </View>
                                <View className='label_white send' onClick={this._onSend}>发送</View>
                                <View className='gifts'>
                                    <Image src={asset.present_w} className='prea' onClick={this._onTypegift} />
                                </View>

                                <View className='aixing' onClick={this.onvant} >
                                    <View className='dipss'>{likeCount > vantss ? this.getNums(likeCount) : this.getNums(vantss)}</View>
                                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/13d907d3-eb03-4b4f-8076-3c6ba4487d11.png'} className={vants == 0 ? 'aixings' : 'aixingss'} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {
                    van_list.length > 0 ?
                        <View className='area'>
                            {
                                van_list.map((item, index) => {
                                    return (
                                        <Image src={item} style={{ width: '100%', height: '100%', position: 'absolute', left: '0', top: '0', zIndex: index + 1 }} />
                                    )
                                })
                            }

                        </View>
                        : null
                }

                {
                    (liveStatus === 0 && roomStatus === 0) || (liveStatus === 2 && roomStatus === 1) || (liveStatus === 2 && roomStatus === 3) || (liveStatus === 2 && roomStatus === 0) ?
                        <View className='bg_boxs'>
                            {
                                background ?
                                    <Image src={background} style={{ width: '100%', height: '100%' }} />
                                    : null
                            }
                            <View className='bg_boxa'></View>
                            {
                                ttime < courseDesc.beginTime * 1000 - 60 * 10 * 1000 ?
                                    <View className='bg_box'>
                                        <View className='acl row jc_ct'>
                                            <Image src={asset.clocks} className='clc' />
                                        </View>
                                        <View className='white_label label_25 acl mt_10'>直播未开始</View>
                                    </View> : null
                            }
                            {
                                ttime > courseDesc.beginTime * 1000 - 60 * 10 * 1000 && ttime < courseDesc.beginTime * 1000 ?
                                    <View className='bg_box'>
                                        <View className='acl row jc_ct'>
                                            <Text className='tip_label default_label' >直播倒计时</Text>
                                        </View>
                                        <View className='white_label lg40_label acl mt_10'>{parseInt((courseDesc.beginTime * 1000 - ttime) / 60000) + 1}分钟</View>
                                    </View> : null
                            }
                            {
                                ttime > courseDesc.beginTime * 1000 && ttime < courseDesc.endTime * 1000 ?
                                    <View className='bg_box'>
                                        <View className='acl row jc_ct'>
                                            <Image src={asset.clocks} className='clc' />
                                        </View>
                                        <View className='white_label label_25 acl mt_10'>直播即将开始</View>
                                    </View> : null
                            }
                            {
                                ttime > courseDesc.endTime * 1000 ?
                                    <View className='bg_box'>
                                        <View className='acl row jc_ct'>
                                            <Image src={asset.clocks} className='clc' />
                                        </View>
                                        <View className='white_label label_25 acl mt_10'>直播已结束</View>
                                    </View> : null
                            }
                        </View>
                        :
                        <View className='video'>
                            {
                                isTeacher || this.state.islm_persom ?
                                    <View style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={isInlianmai ? { width: '50%', height: '50%', marginTop: '20%' } : { width: '100%', height: '100%' }}>
                                            {
                                                media[0].url ?
                                                    <LivePusher
                                                        url={media[0].url}
                                                        maxBitrate={300}
                                                        className='all_live'
                                                        mode='RTC'
                                                        autopush={media[0].url ? true : false}
                                                        waitingImage={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1652922842919.jpeg'}
                                                        onStateChange={(data) => {
                                                            // console.log(data.detail.code, 'livepush-state')
                                                        }}
                                                        onNetstatus={(data) => {
                                                            // console.log(data.currentTarget.code, 'livepush-net')
                                                        }}
                                                        onError={(err) => {
                                                            // console.log(err, 'livepush-error')

                                                        }}
                                                    />
                                                    : null
                                            }
                                        </View>
                                        {
                                            isInlianmai ?
                                                <View style={{ width: '50%', height: '50%', marginTop: '20%' }}>
                                                    {
                                                        teach_watch.url ?
                                                            <LivePlayer
                                                                src={isTeacher ? teach_watch.url : this.state.islm_persom ? user_watch.url : null}
                                                                mode='live'
                                                                className='all_live'
                                                                autoplay={true}
                                                                id='liverPlayer'
                                                                objectFit="fillCrop"
                                                                orientation="vertical"
                                                                picture-in-picture-mode={['push', 'pop']}
                                                            />
                                                            : null
                                                    }
                                                </View>
                                                : null
                                        }
                                    </View>
                                    :
                                    <View style={{ width: '100%', height: '100%' }}>
                                        <LivePlayer
                                            key='user'
                                            src={liveUrl}
                                            mode='live'
                                            className='all_live'
                                            autoplay={true}
                                            id='liverPlayer'
                                            objectFit={'contain'}
                                            orientation="vertical"
                                            picture-in-picture-mode={['push', 'pop']}
                                        />
                                    </View>
                            }

                        </View>

                }
                {
                    typegift ?
                        <View className='layer' style={status === 0 ? { bottom: 6 + 'rpx' } : { bottom: 100 + 'rpx' }} onClick={this.handleStop.bind(this)}>
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

                {/* 抽奖 */}
                {
                    this.state.isLogin ?
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
                    this.state.isMobile ?
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
                {
                    goodlayer ?
                        <View className='goods' onClick={this.handleStop.bind(this)}>
                            <View className='goodslayer' onClick={this._goodslayer}></View>
                            <View className='goodsCons'>
                                <ScrollView scrollY className='goodsCon'>
                                    <View className='goodsItems'>
                                        {
                                            goodList.map((cart: any, index) => {
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
                    activityDTO && open != 0 ?
                        <View className={open == 1 ? 'prize height' : open == 2 || open == 3 || open == 4 ? 'prize heights' : null} onClick={this.handleStop.bind(this)}>
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
                                        <View className='label_white label_14 font_l row jc_ct'>{activityDTO ? activityDTO.title : ''} 抽{activityDTO ? activityDTO.num : '0'}人</View>
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
                                            <View className='label_white label_14 font_l row jc_ct'>{activityDTO ? activityDTO.title : ''} 抽{activityDTO ? activityDTO.num : '0'}人</View>
                                            <View className='row jc_ct mt_8'>
                                                <View className='tipss'>
                                                    <Image src={userAvatar} className='picture' />
                                                </View>
                                            </View>
                                            {
                                                lottery.length > 0 && lottery.filter(item => item.userId == userId).length > 0 ?
                                                    <View className='label_16 bg_ye row jc_ct mt_15'>{userName}，恭喜中奖！</View>
                                                    :
                                                    <View className='label_16 bg_ye row jc_ct mt_15'>很遗憾，没有中奖！</View>
                                            }
                                            {
                                                lottery.length > 0 && lottery.filter(item => item.userId == userId).length > 0 ?
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
                                                        lotteryList.length > 0 ?
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
                {
                    attyps == 1 && askList.length > 0 && questionActivityDTOs.beginTime * 1000 <= ttime && (questionActivityDTOs.beginTime * 1000 + 300 * 1000) >= ttime && asklst.indexOf(questionActivityDTOs.activityId) == -1 ?
                        <View className='askbox' onClick={this.handleStop.bind(this)}>
                            <Image src={asset1.close_b} className='backs' onClick={() => { this.setState({ attyps: 0 }) }} />
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
                    openList_lm ?
                        <View className='lianmailst'>
                            <View className='closelm' onClick={() => { this.setState({ openList_lm: false }) }}>关闭</View>
                            <ScrollView
                                className='soclm'
                                scrollY
                                scrollWithAnimation
                            >
                                {
                                    lm_list.length > 0 && lm_list.map((item, index) => {
                                        return (
                                            <View className='lm_item row jc_sb ai_ct'>
                                                <View style='label_12'>{index + 1}</View>
                                                <Image src={item.avatar} className='lm_pic' />
                                                <View style='label_12'>{item.name}</View>
                                                <View className='lm_btns row jc_ct ai_ct label_white mr_30' onClick={this.onOk.bind(this, item)}>同意</View>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                        : null
                }

            </View>
        )
    }
}

export default activeLive as ComponentClass