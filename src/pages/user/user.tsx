import { ComponentClass } from 'react'
import Taro, { Component, Config, getApp } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'




import Auth from '../../components/Auth'
import { connect } from '@tarojs/redux'
import { usersType } from '../../constants/usersType'
import { getUserLevel } from '../../actions/user'


import api from '../../services/api'


import menu from '../../config/menu';
import asset from '../../config/asset'
import inter from '../../config/inter'

import '../../config/theme.css';
import './user.less'



type PageStateProps = {
    user: usersType,
    getCollectCourse: Array<{}>,
    getUserLevel: Array<{}>
}

type PageDispatchProps = {
    getUserLevel: () => any
}

type PageOwnProps = {}

type PageState = {
    nickname: string,
    follow: number,
    prestige: number,
    level: number,
    integral: number,
    avatar: string,
    praise: number,
    teacher: boolean,
    isAuth: number,
    userLevel: Array<{
        levelId: number
    }>,
    lottery: number,
    current: number,
    adbans: Array<{}>,
    userId: number,
    user_bg: string,
    teacherDTO: any,
    isPrimary: number,
    unionId: number,
    status: boolean,
    isOpne: number,
    closeText: string,
    courseOpen: number,
    courseText: string,
    billImg:string,
    bill:boolean,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface User {
    props: IProps;
}

@connect(({ user }) => ({
    user: user
}), (dispatch) => ({
    getUserLevel() {
        dispatch(getUserLevel())
    }
}))



class User extends Component<{}, PageState>  {

    // eslint-disable-next-line react/sort-comp
    config: Config = {
        navigationBarTextStyle: "white",
        navigationBarTitleText: '我的',
        navigationBarBackgroundColor: '#EB6533',
        navigationStyle: "custom"
    }

    constructor() {
        super(...arguments)
        this.state = {
            nickname: '',
            follow: 0,
            prestige: 0,
            level: 0,
            integral: 0,
            avatar: '',
            teacher: false,
            isAuth: 0,
            praise: 0,
            userLevel: [],
            lottery: 0,
            current: 0,
            adbans: [],
            userId: 0,
            billImg: '',
            bill: true,
            teacherDTO: {},
            user_bg: '',
            isPrimary: 0,
            unionId: 0,
            status: true,
            isOpne: 1,
            closeText: '',
            courseOpen: 1,
            courseText: ''
        }
        this._onLogin = this._onLogin.bind(this);
        this._onLoadCallBack = this._onLoadCallBack.bind(this);
        this._updata = this._updata.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        var that = this
        const { user } = nextProps
        const { userLevel } = user;

        if (user !== this.props.user) {
            if (userLevel.length > 0) {
                that.setState({
                    userLevel: userLevel,
                })
            }
        }

    }

    componentWillMount() {

    }

    componentDidMount() {
        this.getUserLevel();
        this.adban();
        api.get(inter.checkUser)
            .then(res => {
                // console.log(res)
                this.setState({ status: res.data.status })
            })
    }

    componentWillUnmount() { }
    componentDidShow() {
        // const token = Taro.getStorageSync('token')
        // const luckyId =  Taro.getStorageSync('luckyId');

        this.getUser();
        this.getUserLevel();
        this.adban();
        this.getbills();
        this.getConfig();
        let showLogs = 0
        showLogs = getApp().globalData.showLogs
        if (showLogs) {
            setTimeout(() => {
                this.refs.auth.doLogin();
                getApp().globalData.showLogs=0
            }, 1000);
        }
    }
    componentDidHide() { }
    getbills = () => {
        let date=new Date()
        let year = date.getFullYear()
        api.get('/user/bill', {
            year: year
        }).then(res => {
            // console.log(res, '???')
            if (res.data.status) {
                let list = res.data.data.bill_info
                this.setState({
                    billImg: list.billImg,
                    bill: true
                })
            } else {
                this.setState({
                    billImg: '',
                    bill: false
                })
            }
        })
    }

    getConfig = () => {
        // try {
        api.get(inter.Config).then((res) => {
            if (res.data.status) {
                const { data } = res.data
                this.setState({
                    isOpne: parseInt(data.user_apply_status),
                    closeText: data.user_apply_close_text,
                    courseOpen: parseInt(data.course_agent_status),
                    courseText: data.course_agent_text,
                })
                const { user_bg } = JSON.parse(data['ui_choose_field'])
                if (typeof (user_bg) !== 'undefined') {
                    this.setState({ user_bg })
                }
            }
        })
        // } catch (error) {

        // }
    }

    // 获取个人信息判断是否登录
    getUser() {
        var that = this
        api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    let userData = res.data.data
                    that.setState({
                        nickname: userData.nickname,
                        follow: userData.follow,
                        prestige: userData.prestige,
                        level: userData.level,
                        integral: userData.integral + userData.rintegral,
                        avatar: userData.avatar,
                        isAuth: userData.isAuth,
                        teacher: userData.teacher,
                        praise: userData.praise,
                        lottery: userData.lottery,
                        userId: userData.userId,
                        teacherDTO: userData.teacherDTO,
                        isPrimary: userData.isPrimary,
                        unionId: userData.unionId
                    }, () => {
                        that.getConfig()
                    })
                } else {
                    that.setState({
                        userId: 0
                    })
                }
            })
    }


    getUserLevel() {
        this.props.getUserLevel()
    }

    _onLogin() {
        var that = this
        that.refs.auth.doLogin();
    }


    _onLoadCallBack() {
        var that = this
        that.getUser();
    }

    _updata() {
        this.getUser();
    }


    _onSwiper(e) {
        this.setState({
            current: e.detail.current
        })
    }


    adban() {
        api.get(inter.ConfigAdban)
            .then((res) => {
                if (res.data.status) {
                    this.setState({
                        adbans: res.data.data,
                    })
                }
            })
    }



    _toMail(ad) {
        let adlink = ad.link;
        // console.log(ad, 'ad')
        api.post(inter.saveHistory, {
            type: 1,
            billboard_id: ad.billboardId
        })
            .then(res => {
                // console.log(res)
            })
        api.post('/user/save/shop/jump/history', {})
            .then(res => {
                if (adlink.substring(0, 4) == 'http') {
                    Taro.navigateTo({ url: menu.adWebView + '?link=' + `${ad.link}` + '&ad=' + `${JSON.stringify(ad)}` })
                } else {

                    api.post(inter.userYcToken, {})
                        .then((res) => {
                            // console.log(res,'///')
                            if (res.data.status) {
                                let data = res.data.data;

                                wx.navigateToMiniProgram({
                                    appId: 'wxf2bb2960b32a82c3',
                                    path: ad.link,
                                    envVersion: 'release',
                                    extraData: {
                                        token: data.msg,
                                    },
                                    success(res) {
                                        // console.log(res,'???')
                                        // console.info(res);
                                    }
                                });
                            }
                        })
                }
            })

    }


    // 操作
    _actions = (type, value) => {

        var that = this;
        const { userId, integral, level, lottery, prestige, avatar, userLevel, isAuth, teacherDTO, unionId, bill, isOpne, closeText, courseText, courseOpen } = that.state;

        if (userId > 0) {

            if (type === 'Collect') {
                Taro.navigateTo({ url: menu.myCollect })
            } else if (type === 'Lucyfile') {

                let nowLevel: number = 0
                for (let i = 0; i < userLevel.length; i++) {
                    if (userLevel[i].levelId == level) {
                        nowLevel = i
                    }
                }

                if (lottery > 0) {
                    Taro.navigateTo({
                        url: menu.readyLottery
                    })
                } else {

                    Taro.showModal({
                        title: '提示',
                        content: '抽奖次数不足',
                    }).then(res => {
                        // if (res.confirm) {
                        //     Taro.navigateTo({ url: menu.growthEquity + '?integral=' + `${integral}` + '&prestige=' + `${prestige}` + '&level=' + `${nowLevel}` + '&avatar=' + `${avatar}` })
                        // }
                    })
                }

            } else if (type === 'Growth') {
                let nowLevel = value
                Taro.navigateTo({ url: menu.growthEquity + '?integral=' + `${integral}` + '&prestige=' + `${prestige}` + '&level=' + `${nowLevel}` + '&avatar=' + `${avatar}` })
            } else if (type === 'Invite') {
                Taro.navigateTo({ url: menu.shareInvite })
            } else if (type === 'Card') {
                Taro.navigateTo({ url: menu.myIDCard })
            } else if (type === 'Skill') {
                Taro.navigateTo({ url: menu.profesSkill + '?userId=' + userId })
            } else if (type === 'Auth') {

                if (isAuth == 1) {
                    Taro.showToast({
                        title: '已认证',
                        icon: 'none'
                    })
                } else {
                    Taro.navigateTo({ url: menu.realAuth + '?unionId=' + unionId })
                }

            } else if (type === 'Gold') {
                Taro.navigateTo({ url: menu.myGold + '?integral=' + `${integral}` })
            } else if (type === 'Medal') {
                Taro.navigateTo({ url: menu.myMedal })
            } else if (type === 'Reward') {
                Taro.navigateTo({ url: menu.myReward })
            } else if (type === 'FeedBack') {
                Taro.navigateTo({ url: menu.fdback })
            } else if (type === 'Coupon') {
                Taro.navigateTo({ url: menu.userCoupon })
            } else if (type === 'LectCourse') {
                Taro.navigateTo({ url: menu.lectCourse + '?teacherId=' + teacherDTO.teacherId })
            } else if (type === 'Promotion') {
                Taro.navigateTo({ url: menu.promotion + '?type=1' })
            } else if (type === 'Applylect') {
                if (isOpne === 0) {
                    Taro.showToast({
                        title: closeText,
                        icon: 'none',
                        duration: 2000
                    })
                } else {
                    Taro.navigateTo({ url: menu.lectSignUp + '?type=1' })
                }
            } else if (type === 'OwnCourse') {
                Taro.navigateTo({ url: menu.ownCourse })
            } else if (type === 'MyCertificate') {
                // Taro.showToast({
                //     title:'暂未开放，敬请期待',
                //     icon:'none',
                //     duration:1000,
                // })
                Taro.navigateTo({ url: menu.MyCertificate })
            } else if (type === 'PushClass') {
                if (courseOpen === 0) {
                    Taro.showToast({
                        title: courseText,
                        icon: 'none',
                        duration: 2000
                    })
                } else {
                    Taro.navigateTo({ url: menu.pushClass })
                }
            } else if (type === 'MyFous') {
                Taro.navigateTo({ url: menu.myFous })
            } else if (type === 'SignIn') {
                Taro.navigateTo({ url: menu.signIn })
                // Taro.navigateTo({url:menu.steps})
            } else if(type === 'mylive'){
                Taro.navigateTo({ url: menu.mylive+'?teacherId='+this.state.teacherDTO.teacherId })
            } else if (type === 'userAccount') {
                Taro.navigateTo({ url: menu.userAccount })
            } else if (type === 'Setting') {
                Taro.navigateTo({ url: menu.setting })
            } else if (type === 'Content') {
                Taro.navigateTo({ url: menu.userAsk })
            } else if (type === 'Message') {
                Taro.navigateTo({ url: menu.message })
            } else if (type === 'download') {
                Taro.navigateTo({ url: menu.downLoad })
            } else if (type === 'Logout') {
                api.get(inter.logout)
                    .then((res) => {
                        if (res.data.status) {
                            Taro.setStorageSync('token', '');
                            that.getUser();
                            that.setState({
                                integral: 0,
                            })
                        }
                    })
            }

        } else {
            that._onLogin();
        }

    }

    render() {
        const { user_bg, nickname, follow, prestige, level, integral, avatar, praise, teacher, isAuth, userLevel, adbans, userId, teacherDTO, isPrimary, billImg ,bill} = this.state
        // console.log(userLevel)
        let nowLevel: number = 0
        for (let i = 0; i < userLevel.length; i++) {
            if (userLevel[i].levelId == level + 1) {
                nowLevel = i
            }
        }

        let bg_v2 = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/c6ce2658-60f9-479e-a7e5-c29ca6458f65.png';
        return (
            <View className='userwrap'>
                <Image src={user_bg} className='headerImg' />
                <View className="headbox">
                    <View className='head_er mt_10'>
                        <Image src={asset.message_icon} mode="widthFix" style={{ width: 36 + 'rpx', height: 36 + 'rpx' }}
                            onClick={this._actions.bind(this, 'Message')}
                        />
                        <Image src={asset.setting_icon} mode="widthFix" style={{ width: 36 + 'rpx', height: 36 + 'rpx', marginLeft: 30 + 'rpx', }}
                            onClick={() => Taro.navigateTo({ url: menu.setting })}
                        />
                    </View>
                    <View className='header mt_20 mb_10'>
                        {
                            userId > 0 ?
                                <View className='d_flex fd_r   pl_30 pr_20 '>
                                    <View className='cover  d_flex jc_ct ai_ct' onClick={this._updata}>
                                        <Image src={avatar} className='header_cover' />
                                    </View>
                                    <View className='header_right d_flex fd_c ml_10 jc_sb col_1'>
                                        <View className='editbox d_flex fd_r ai_ct jc_sb'>
                                            <View className='d_flex fd_r ai_ct'>
                                                <Text className='lg16_label white_label'>{nickname}</Text>
                                                {
                                                    teacher ?
                                                        <View className=' tips_btn d_flex jc_ct ai_ct ml_5  pl_5 pr_5'>
                                                            <Text className='smm_label white_label'>{teacherDTO.wtype == 0 ? '讲师' : teacherDTO.wtype == 1 ? '经销商讲师' : teacherDTO.wtype == 2 ? '外部讲师' : teacherDTO.wtype == 3 ? '内部讲师' : null}</Text>
                                                        </View>
                                                        : null}

                                                <View className=' tips_btn d_flex jc_ct ai_ct ml_5  pl_5 pr_5'>
                                                    <Text className='smm_label white_label'>Lv.{nowLevel}</Text>
                                                </View>
                                                <Image src={asset.edit} className='tips_edit ml_5' onClick={() => Taro.navigateTo({ url: menu.userInfo })} />
                                            </View>
                                            <View className='edit_info ml_10 d_flex ai_ct' onClick={() => Taro.navigateTo({ url: menu.userInfo })}>
                                                <Image src={asset.right_arrow} className='right_arrow' />
                                            </View>
                                        </View>
                                        {
                                            teacher ?
                                                <View className=' tips_btns d_flex jc_ct ai_ct pl_5 pr_5'>
                                                    <Text className='smm_label white_label'>粉丝数：{teacherDTO.follow}</Text>
                                                </View>
                                                : null}
                                        <View className='d_flex fd_r mt_5 mb_5 h_32'>
                                            <View className='tips_lbtn d_flex jc_ct ai_ct mr_5 pl_5 pr_5 h_32'>
                                                <Image src={asset.vipleves} className='tips_dot' />
                                                <Text className='smm_label brown_label ml_5'>Lv.{nowLevel}</Text>
                                            </View>
                                            <View className=' tips_btn d_flex jc_ct ai_ct mr_5 pl_5 pr_5 h_32'>
                                                <Text className='smm_label white_label'> {isAuth == 1 ? '已实名' : '未认证'}</Text>
                                            </View>
                                            {
                                                isAuth ?
                                                    <View className=' tips_btn d_flex jc_ct ai_ct mr_5 pl_5 pr_5 h_32'>
                                                        <Text className='smm_label white_label'>{isPrimary === 0 && isAuth == 1 ? '副卡' : isPrimary === 1 && isAuth == 1 ? '正卡' : ''}</Text>
                                                    </View>
                                                    : null
                                            }

                                        </View>
                                        <Text className='sm_label  white_label '>{`我的学分 ${integral}`}</Text>

                                    </View>
                                </View>
                                :
                                <View className='d_flex fd_r ai_ct mt_20 pl_30 pr_20'>
                                    <View className='cover  d_flex jc_ct ai_ct' onClick={this._onLogin}>
                                        <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/header.png'} className='header_cover' />
                                    </View>
                                    <View className=' d_flex fd_c ml_10 jc_sb col_1' onClick={this._onLogin}>
                                        <Text className='white_label default_label'>点击登录</Text>
                                    </View>
                                </View>
                        }

                    </View>
                    <View className='cate_box bg_white d_flex  m_20'>
                        <View className='d_flex fd_c jc_ct ai_ct col_1 pt_20 pb_20' onClick={this._actions.bind(this, 'Collect')}>
                            <Image src={asset.user_collect} className='icon_item_cate' />
                            <Text className='sm_label c33_label pt_10 fw_label'>我的收藏</Text>
                        </View>
                        <View className='d_flex fd_c jc_ct ai_ct col_1 pt_20 pb_20' onClick={this._actions.bind(this, 'MyFous')}  >
                            <Image src={asset.user_focus} className='icon_item_cate' />
                            <Text className='sm_label c33_label pt_10 fw_label'>我的关注</Text>
                        </View>
                        <View className='d_flex fd_c jc_ct ai_ct col_1 pt_20 pb_20' onClick={this._actions.bind(this, 'Reward')}   >
                            <Image src={asset.user_intergral} className='icon_item_cate' />
                            <Text className='sm_label c33_label pt_10 fw_label'>我的打赏</Text>
                        </View>
                        <View className='d_flex fd_c jc_ct ai_ct col_1 pt_20 pb_20' onClick={this._actions.bind(this, 'OwnCourse')}  >
                            <Image src={asset.user_hascourse} className='icon_item_cate' />
                            <Text className='sm_label c33_label  pt_10 fw_label'>已购课程</Text>
                        </View>
                        {/* <View className='d_flex fd_c jc_ct ai_ct col_1 pt_20 pb_20' onClick={this._actions.bind(this,'Lucyfile')}  >
                            <Image src={asset.fanpaia} className='icon_item_cate' />
                            <Text className='sm_label c33_label  pt_10 fw_label'>翻牌抽奖</Text>
                        </View> */}
                    </View>

                    <View className='usu_cate_box bg_white'>
                        <View className='m_20'>
                            <Text className='c33_label lg_label fw_label'>常用功能</Text>
                        </View>
                        <View className='cate_cons'>
                            <View className='d_flex fd_c jc_ct ai_ct  pb_20 usu_icon_item' onClick={this._actions.bind(this, 'userAccount')}>
                                <View className='icon_cover'>
                                    <Image src={asset.user_accout} className='icon_item' mode='aspectFit' />
                                </View>
                                <Text className='sm_label c33_label pt_10 fw_label'>我的账户</Text>
                            </View>
                            <View className='d_flex fd_c jc_ct ai_ct  pb_20 usu_icon_item' onClick={this._actions.bind(this, 'Growth', nowLevel)}>
                                <View className='icon_cover'>
                                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/growth.png'} className='icon_item' mode='aspectFit' />
                                </View>
                                <Text className='sm_label c33_label pt_10 fw_label'>成长特权</Text>
                            </View>
                            <View className='d_flex fd_c jc_ct ai_ct  pb_20 usu_icon_item' onClick={this._actions.bind(this, 'Coupon')} >
                                <View className='icon_cover'>
                                    <Image src={asset.user_coupon} className='icon_item' mode='aspectFit' />
                                </View>
                                <Text className='sm_label c33_label pt_10 fw_label'>优惠券</Text>
                            </View>
                            <View className='d_flex fd_c jc_ct ai_ct  pb_20 usu_icon_item' onClick={this._actions.bind(this, 'PushClass')}>
                                <View className='icon_cover'>
                                    <Image src={asset.user_const} className='icon_item' mode='aspectFit' />
                                </View>
                                <Text className='sm_label c33_label pt_10 fw_label'>推课赚钱</Text>
                            </View>
                            <View className='d_flex fd_c jc_ct ai_ct  pt_20 pb_20 usu_icon_item' onClick={this._actions.bind(this, 'Content')}>
                                <View className='icon_cover'>
                                    <Image src={asset.user_studydata} className='icon_item' mode='aspectFit' />
                                </View>
                                <Text className='sm_label c33_label pt_10 fw_label'>我的内容</Text>
                            </View>
                            <View className='d_flex fd_c jc_ct ai_ct pt_20  pb_20 usu_icon_item' onClick={this._actions.bind(this, 'MyCertificate')}>
                                <View className='icon_cover'>
                                    <Image src={asset.user_cert} className='icon_item' mode='aspectFit' />
                                </View>
                                <Text className='sm_label c33_label pt_10 fw_label'>我的证书</Text>
                            </View>
                            <View className='d_flex fd_c jc_ct ai_ct pt_20  pb_20 usu_icon_item' onClick={this._actions.bind(this, 'Medal')}>
                                <View className='icon_cover'>
                                    <Image src={asset.user_reward} className='icon_item' mode='aspectFit' />
                                </View>
                                <Text className='sm_label c33_label pt_10 fw_label'>我的勋章</Text>
                            </View>
                            <View className='d_flex fd_c jc_ct ai_ct  pt_20 pb_20 usu_icon_item' onClick={this._actions.bind(this, 'download')}>
                                <View className='icon_cover'>
                                    <Image src={asset.user_down} className='icon_item' mode='aspectFit' />
                                </View>
                                <Text className='sm_label c33_label pt_10 fw_label'>下载专区</Text>
                            </View>
                        </View>
                    </View>
                    {/* <View onClick={()=>Taro.navigateTo({url:menu.annualBill})} className='ad_box'> */}
                    {/* <View onClick={()=>Taro.navigateTo({url:menu.Niandu})} className='ad_box'>
                        <Image src="https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/081604e9-2b32-4798-b88e-172f844a9d4b.png" className='ad_box_img' />
                    </View> */}
                    {
                        bill ?
                            <View onClick={() => Taro.navigateTo({ url: menu.Niandu })} className='ad_box'>
                                <Image src={billImg} className='ad_box_img' />
                            </View>
                            : null
                    }

                    <View className='usu_cate_box mb_25 bg_white'>
                        <View className='m_20'>
                            <Text className='c33_label lg_label fw_label'>互动签到</Text>
                        </View>
                        <View className='hd_box'>

                            {/* <View className='hd_box_item '>
                                <View className='d_flex fd_c ml_20'>
                                    <Text className='c33_label default_label'>完美林</Text>
                                    <Text className='sm_label tip_label'>积累绿色能量</Text>
                                </View>
                                <View className='handCover'>
                                    <Image src={asset.user_woods} mode='aspectFit' className='hd_box_img' />
                                </View>
                            </View>
                            <View className='hd_box_item'>
                                <View className='d_flex fd_c ml_20'>
                                    <Text className='c33_label default_label'>健康步数</Text>
                                    <Text className='sm_label tip_label'>步数领金币 &gt;</Text>
                                </View>
                                <View className='handCover'>
                                    <Image src={asset.user_footer} mode='aspectFit' className='hd_box_img' />
                                </View>
                            </View> */}

                            <View className='hd_box_item' onClick={this._actions.bind(this, 'SignIn')}>
                                <View className='d_flex fd_c ml_20'>
                                    <Text className='c33_label default_label'>每日签到</Text>
                                    <Text className='sm_label tip_label'>连续签到 &gt;</Text>
                                </View>
                                <View className='handCover'>
                                    <Image src={asset.sign_icon} mode='aspectFit' className='hd_box_img' />
                                </View>
                            </View>
                            <View className='hd_box_item' onClick={this._actions.bind(this, 'Lucyfile')}>
                                <View className='d_flex fd_c ml_20'>
                                    <Text className='c33_label default_label'>翻牌抽奖</Text>
                                    <Text className='sm_label tip_label'>幸运翻牌 &gt;</Text>
                                </View>
                                <View className='handCover'>
                                    <Image src={asset.user_lucky} mode='aspectFit' className='hd_box_img' />
                                </View>
                            </View>
                        </View>
                    </View>

                    {
                        adbans.length > 0 ?
                            <View className='swiper_cons'>
                                <Swiper
                                    className='swiper'
                                    indicatorColor='rgba(255,255,355,0.49)'
                                    indicatorActiveColor='#ffffff'
                                    vertical={false}
                                    circular
                                    indicatorDots
                                    autoplay
                                >
                                    {
                                        adbans.map((ad: any, index) => {
                                            return (
                                                <SwiperItem key={'teacher_gallery_' + index}>
                                                    <Image
                                                        src={ad.fileUrl}
                                                        className='swiper_item'
                                                        onClick={this._toMail.bind(this, ad)}
                                                    />
                                                </SwiperItem>
                                            )

                                        })
                                    }
                                </Swiper>
                            </View>
                            : null}


                    <View className='bg_white  pl_30 pr_20'>


                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt' onClick={this._actions.bind(this, 'Card')}>
                            <Text className='default_label  c33_label fw_label'>我的学生证</Text>
                            <Image src={asset.arrow_right} className='arrow_right' />
                        </View>
                        {teacher ? <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt' onClick={this._actions.bind(this, 'mylive')}>
                            <Text className='default_label c33_label fw_label'>我的直播</Text>
                            <Image src={asset.arrow_right} className='arrow_right' />
                        </View> : null}
                        {/* <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt'>
                            <Text className='default_label  c33_label fw_label'>我的下载</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View> */}
                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt' onClick={this._actions.bind(this, 'Skill')} >
                            <Text className='default_label c33_label fw_label'>培训班</Text>
                            <Image src={asset.arrow_right} className='arrow_right' />
                        </View>
                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt' onClick={this._actions.bind(this, 'Auth')}>
                            <View className='d_flex fd_r ai_ct'>
                                <Text className='default_label  c33_label fw_label'>实名认证</Text>
                                {
                                    isAuth == 1 ?
                                        null :
                                        <View className='red_dot'></View>
                                }
                            </View>
                            <View className='d_flex fd_r ai_ct'>
                                {
                                    isAuth == 1 ?
                                        null :
                                        <Text className='tip_label sm_label'>认证送学分</Text>
                                }
                                <Image src={asset.arrow_right} className='arrow_right' />
                            </View>
                        </View>
                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt' onClick={this._actions.bind(this, 'Invite')}>
                            <Text className='default_label c33_label fw_label'>邀请有礼</Text>
                            <Image src={asset.arrow_right} className='arrow_right' />
                        </View>
                        {!teacher ? <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt' onClick={this._actions.bind(this, 'Applylect')}>
                            <Text className='default_label c33_label fw_label'>申请讲师</Text>
                            <Image src={asset.arrow_right} className='arrow_right' />
                        </View> : null}
                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt'
                            // onClick={this._actions.bind(this, 'FeedBack')} 
                            onClick={() => {
                                Taro.navigateTo({ url: menu.fdback })
                            }}
                        >
                            <View className='d_flex fd_r ai_ct'>
                                <Text className='default_label c33_label fw_label'>帮助反馈</Text>
                                {/* <View className='red_dot'></View> */}
                            </View>
                            <Image src={asset.arrow_right} className='arrow_right' />
                        </View>
                        {/* <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt'  onClick={this._actions.bind(this,'Content')} >
                            <Text className='default_label c33_label fw_label'>我的内容</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View> */}




                        {teacher ? <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp' onClick={this._actions.bind(this, 'LectCourse')}>
                            <Text className='default_label c33_label fw_label'>我的课程</Text>
                            <Image src={asset.arrow_right} className='arrow_right' />
                        </View> : null}
                        {teacher ? <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp' onClick={this._actions.bind(this, 'Promotion')}>
                            <Text className='default_label c33_label fw_label'>讲师晋级</Text>
                            <Image src={asset.arrow_right} className='arrow_right' />
                        </View> : null}
                        {/* <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp' onClick={this._actions.bind(this,'Setting')}>
                            <Text className='default_label c33_label fw_label'>设置</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View> */}
                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp' onClick={this._actions.bind(this, 'Logout')}>
                            <Text className='default_label c33_label fw_label'>退出登录</Text>
                            <Image src={asset.arrow_right} className='arrow_right' />
                        </View>
                    </View>




                </View>


                <Auth ref={'auth'} success={() => {
                    this._onLoadCallBack()
                }} />
            </View>
        )
    }
}

export default User as unknown as ComponentClass<PageOwnProps, PageState>