import { ComponentClass } from 'react'
import Taro, { Component ,Config, } from '@tarojs/taro'
import { View, Text ,Image,Swiper ,SwiperItem } from '@tarojs/components'
import  '../../../config/theme.css';
import asset from '../../config/asset'
import menu from '../../../config/menu';

import Auth from '../../../components/Auth'
import { connect } from '@tarojs/redux'
import { usersType } from '../../../constants/usersType'

import {getUserLevel} from '../../../actions/user'

import './user.less'

import api from '../../../services/api'
import inter from '../../../config/inter'

type PageStateProps = {
    user:usersType,
    getCollectCourse:Array<{}>,
    getUserLevel:Array<{}>
} 

type PageDispatchProps = {
    getUserLevel:() => any
}

type PageOwnProps = {}

type PageState = {
    nickname:string,
    follow:number,
    prestige:number,
    level:number,
    integral:number,
    avatar:string ,
    praise:number,
    teacher:boolean,
    isAuth:number,
    userLevel:Array<{
        levelId:number
    }>,
    lottery:number,
    current:number,
    adbans:Array<{}>,
    userId:number,
    user_bg:string,
    teacherDTO:{
        checkStatus:number,
        content: string,
        course:number,
        courseNum:number,
        follow:number,
        galleryList: Array<any>
        hit:number,
        honor: string,
        isFollow: boolean,
        level:number,
        newCourse:number,
        reason: null
        satisf:number,
        score:number,
        teacherId: number,
        teacherImg: string,
        teacherName: string,
        userId: number,
        userImg: string,
    },
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface User {
    props: IProps;
}

@connect(({ user }) => ({
    user:user
    }), (dispatch) => ({
    getUserLevel(){
        dispatch(getUserLevel())
    }
}))



class User extends Component<{}, PageState>  {
    
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "white",
        navigationBarTitleText: '我的',
        navigationBarBackgroundColor:'#EB6533',
    }

    constructor () {
        super(...arguments)
        this.state = {
            nickname:'',
            follow:0,
            prestige:0,
            level:0,
            integral:0,
            avatar:'',
            teacher:false,
            isAuth:0,
            praise:0,
            userLevel:[],
            lottery:0,
            current:0,
            adbans:[],
            userId:0,
            teacherDTO:{},
            user_bg:''
        }
        this._onLogin = this._onLogin.bind(this);
        this._onLoadCallBack = this._onLoadCallBack.bind(this);
        this._updata = this._updata.bind(this); 
    }

    componentWillReceiveProps (nextProps) {

       var that = this
       const {user} = nextProps
        const {userLevel} = user;

        if(user !== this.props.user){
            if(userLevel.length > 0){
                that.setState({
                    userLevel:userLevel
                })
            }
        }

        
    }
  
    componentWillMount () { 
        
    }

    componentDidMount () {
        this.getUserLevel();
        this.adban();
        this.getConfig();
    }

    componentWillUnmount () { }
    componentDidShow () { 
        // const token = Taro.getStorageSync('token')
        // const luckyId =  Taro.getStorageSync('luckyId');

        this.getUser();
        this.getUserLevel();
        this.adban();
        
    }
    componentDidHide () { }

    getConfig = ()=>{
        try {
            api.get(inter.Config).then((res)=>{
                if(res.data.status){
                    const {data} = res.data
                    const {user_bg} = JSON.parse(data['ui_choose_field'])
                    if(typeof(user_bg) !== 'undefined')
                        this.setState({ user_bg })
                }
            })
        } catch (error) {
            
        }
    }

    
    // 获取个人信息判断是否登录
    getUser(){
        var that = this
        api.get(inter.User)
        .then((res)=>{
            if(res.data.status){
                let userData = res.data.data
                that.setState({
                    nickname:userData.nickname,
                    follow:userData.follow,
                    prestige:userData.prestige,
                    level:userData.level,
                    integral:userData.integral,
                    avatar:userData.avatar,
                    isAuth:userData.isAuth,
                    teacher:userData.teacher,
                    praise:userData.praise,
                    lottery:userData.lottery,
                    userId:userData.userId,
                    teacherDTO:userData.teacherDTO
                })
            } else {
                that.setState({
                    userId:0
                })
            }
        })
    }


    getUserLevel(){
        this.props.getUserLevel()
    }
    
    _onLogin(){
        var that  = this 
        that.refs.auth.doLogin();
    }


    _onLoadCallBack(){
        var that = this
        that.getUser();
    }

    _updata(){
        this.getUser();
    }


    _onSwiper(e){
        this.setState({
            current:e.detail.current
        })
    }


    adban(){
        api.get(inter.ConfigAdban)
            .then((res)=>{
                if(res.data.status){
                    this.setState({
                        adbans:res.data.data,
                    })
                }
            })
    }



    _toMail(ad){
        let adlink = ad.link;

        if(adlink.substring(0,4) == 'http'){
            Taro.navigateTo({url:menu.adWebView+'?link='+`${ad.link}` + '&ad=' + `${JSON.stringify(ad)}` })
        } else {

            api.post(inter.userYcToken,{})
            .then((res)=>{
                if(res.data.status){
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
                        path: ad.link,
                        envVersion: 'release',
                        extraData: {
                            token: data.msg,
                        },
                        success(res){
                            console.info(res);
                        }
                    });
                }
            })

            
        }

    }


    // 操作
    _actions = (type,value) => {

        var that = this;
        const {userId,integral,level,lottery,prestige,avatar,userLevel,isAuth,teacherDTO,nickname} = that.state;

        if( userId > 0 ){

            if(type === 'Collect'){
                Taro.navigateTo({url:menu.myCollect})
            } else if(type === 'Lucyfile'){

                    let nowLevel:number = 0
                    for(let i = 0 ; i < userLevel.length ; i++){
                        if(userLevel[i].levelId == level){
                            nowLevel = i
                        }
                    }

                    if(lottery > 0 || integral >= 50){
                        Taro.navigateTo({
                            url:menu.readyLottery
                        })
                    } else {

                        Taro.showModal({
                            title: '金币/抽奖次数不足',
                            content: '去做任务获取金币吧',
                        }).then(res=>{
                            if(res.confirm){
                                Taro.navigateTo({url:menu.growthEquity+'?integral='+`${integral}`+'&prestige='+`${prestige}`+'&level='+`${nowLevel}`+ '&avatar=' + `${avatar}`})
                            }
                        })
                    }

            }  else if(type === 'Growth'){
                let nowLevel = value
                Taro.navigateTo({url:menu.growthEquity+'?integral='+`${integral}`+'&prestige='+`${prestige}`+'&level='+`${nowLevel}`+ '&avatar=' + `${avatar}`})
            } else if(type === 'Invite'){
                Taro.navigateTo({url:menu.shareInvite})
            } else if(type === 'Card' ){
                Taro.navigateTo({url:menu.myIDCard})
            } else if(type === 'Skill'){
                Taro.navigateTo({url:menu.profesSkill+'?userId=' + userId})
            } else if(type === 'Auth'){
        
                if(isAuth == 1){
                    Taro.showToast({
                        title:'已认证',
                        icon:'none'
                    })
                } else {
                    Taro.navigateTo({url:menu.realAuth})
                }

            } else if(type === 'Gold'){
                Taro.navigateTo({url:menu.myGold+ '?integral=' +`${integral}`})
            } else if(type === 'Medal'){
                Taro.navigateTo({url:menu.myMedal})
            } else if(type === 'Reward'){
                Taro.navigateTo({url:menu.myReward})
            } else if(type === 'FeedBack'){
                Taro.navigateTo({url:menu.fdback})
            } else if(type === 'Coupon'){
                Taro.navigateTo({url:menu.userCoupon})
            } else if(type === 'LectCourse'){
                Taro.navigateTo({url:menu.lectCourse + '?teacherId=' + teacherDTO.teacherId  })
            } else if(type === 'Promotion'){
                Taro.navigateTo({url:menu.promotion + '?type=1' })
            } else if(type === 'Applylect'){
                Taro.navigateTo({url:menu.lectSignUp + '?type=1' })
            } else if(type === 'OwnCourse'){
                Taro.navigateTo({url:menu.ownCourse})
            } else if(type === 'MyCertificate'){
                Taro.navigateTo({url:menu.MyCertificate})
            } else if(type === 'PushClass'){
                Taro.navigateTo({url:menu.pushClass})
            } else if(type === 'MyFous'){
                Taro.navigateTo({url:menu.myFous})
            } else if(type === 'SignIn'){
                Taro.navigateTo({url:menu.signIn})
            } else if(type === 'Setting'){
                Taro.navigateTo({url:menu.setting})
            } else if(type === 'Abouts'){
                Taro.navigateTo({url:menu.aboutUs})
            } else if(type === 'userAccount'){
                Taro.navigateTo({url:menu.userAccount})
            } else if(type === 'ask'){
                Taro.navigateTo({url:menu.ask})
            } else if(type === 'annualBill'){
                Taro.navigateTo({url:menu.annualBill+'?avatar=' + avatar + '&nickname=' + nickname  })
            } else if(type === 'Logout'){
                api.get(inter.logout)
                .then((res)=>{
                    if(res.data.status){
                        Taro.setStorageSync('token', '');
                        that.getUser();
                        that.setState({
                            integral:0,
                        })
                    }
                })
            }

        } else {
            that._onLogin();
        }
        
    }

    render () {
        const {user_bg, nickname,follow,prestige,level,integral,avatar,praise,teacher,isAuth,userLevel,adbans,userId,teacherDTO} = this.state

        let nowLevel:number = 0
        for(let i = 0 ; i < userLevel.length ; i++){
            if(userLevel[i].levelId == level){
                nowLevel = i
            }
        }

        
        return (
            <View className='userwrap'>
                <Image src={user_bg}  className='headerImg'/>    
                <View className="headbox">
                    <View className='header'>
                        {
                            userId > 0 ?
                            <View className='d_flex fd_r ai_ct pl_30 pr_20 pt_25'>
                                <View className='cover  d_flex jc_ct ai_ct' onClick={this._updata}>
                                    <Image src={avatar} className='header_cover' />
                                </View>
                                <View  className='header_right d_flex fd_c ml_10 jc_sb col_1'>
                                    <View className='editbox d_flex fd_r ai_ct jc_sb'>
                                        <View>  
                                            <Text className='lg16_label white_label'>{nickname}</Text>
                                        </View>
                                        
                                        <View className='edit_info ml_10 d_flex ai_ct' onClick={()=>Taro.navigateTo({url:menu.userInfo})}>
                                            <Image src={asset.edit}  className='tips_edit' />
                                            <Text className='sm_label white_label ml_10'>编辑资料</Text>
                                            <Image src={asset.right_arrow} className='right_arrow' />
                                        </View>
                                    </View>
                                    <View className='d_flex fd_r ai_ct jc_sb'>
                                        <View className='d_flex fd_r '>
                                            <View className='tips_lbtn d_flex jc_ct ai_ct mr_5 pl_10 pr_10 h_32' >
                                                <Image src={asset.vipleves}  className='tips_dot' />
                                                <Text className='smm_label brown_label ml_5'>Lv.{nowLevel}</Text>
                                            </View>
                                            <View className=' tips_btn d_flex jc_ct ai_ct mr_5 pl_10 pr_10 h_32' >
                                                <Text className='smm_label white_label'> {isAuth == 1 ?  '已实名' : '未认证'}</Text>
                                            </View>
                                            <View className=' tips_btn d_flex jc_ct ai_ct mr_5 pl_10 pr_10 h_32' >
                                                <Text className='smm_label white_label'>{teacher ? '讲师' : '学者'}</Text>
                                            </View>
                                        </View>

                                        <Text className='smm_label  white_label'>关注 {follow} · 获赞 {praise}</Text>
                                    </View>
                                </View>
                            </View> 
                            :
                            <View className='d_flex fd_r ai_ct pl_30 pr_20 pt_20'>
                                <View className='cover  d_flex jc_ct ai_ct' onClick={this._onLogin}>
                                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/header.png'} className='header_cover' />
                                </View>
                                <View  className=' d_flex fd_c ml_10 jc_sb col_1' onClick={this._onLogin}>
                                    <Text className='white_label default_label'>点击登录</Text>
                                </View>
                            </View>   
                        }
                        
                    </View> 
                    <View className='cate_box bg_white d_flex  m_20'>
                        <View className='d_flex fd_c jc_ct ai_ct col_1 pt_20 pb_20' onClick={this._actions.bind(this,'Collect')}>
                            <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/collect.png'} className='icon_item' />
                            <Text className='sm_label c33_label pt_10 fw_label'>我的收藏</Text>
                        </View>
                        <View className='d_flex fd_c jc_ct ai_ct col_1 pt_20 pb_20' onClick={this._actions.bind(this,'Lucyfile')}>
                            <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/filp.png'} className='icon_item' />
                            <Text className='sm_label c33_label pt_10 fw_label'>翻牌抽奖</Text>
                        </View>
                        <View className='d_flex fd_c jc_ct ai_ct col_1 pt_20 pb_20' onClick = {this._actions.bind(this,'Growth',nowLevel)}>
                            <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/growth.png'} className='icon_item' />
                            <Text className='sm_label c33_label pt_10 fw_label'>成长特权</Text>
                        </View>
                        <View className='d_flex fd_c jc_ct ai_ct col_1 pt_20 pb_20'  onClick={this._actions.bind(this,'Invite')} >
                            <Image src={ 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/recomm.png'} className='icon_item' />
                            <Text className='sm_label c33_label  pt_10 fw_label'>推荐好友</Text>
                        </View>
                    </View>


                    <View className='bg_white  ml_30 mr_20'>

                        
                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt' onClick={this._actions.bind(this,'Card')}>
                            <Text className='default_label  c33_label fw_label'>我的学生证</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View>
                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt'  onClick={this._actions.bind(this,'Skill')} >
                            <Text className='default_label c33_label fw_label'>专业技能培训</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View>
                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt' onClick={this._actions.bind(this,'Auth')}>
                            <View className='d_flex fd_r ai_ct'>
                                <Text className='default_label  c33_label fw_label'>实名认证</Text>
                                {
                                    isAuth == 1 ?
                                    null:
                                    <View className='red_dot'></View>
                                }
                            </View>
                            <View className='d_flex fd_r ai_ct'>
                                {
                                    isAuth == 1 ?
                                    null:
                                    <Text className='tip_label sm_label'>认证送金币</Text>
                                }
                                <Image src={asset.arrow_right}  className='arrow_right' />
                            </View>
                        </View>
                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt'  onClick={this._actions.bind(this,'Gold')} >
                            <Text className='default_label c33_label fw_label'>我的金币</Text>
                            <View className='d_flex ai_ct fd_r jc_sb'>
                                <Text className='default_label pr_10' style={{color:'#FFA71F'}}>{integral}金币</Text>
                                <Image src={asset.arrow_right}  className='arrow_right' />
                            </View>
                        </View>
                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt'  onClick={this._actions.bind(this,'Medal')}>
                            <Text className='default_label c33_label fw_label'>我的勋章</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View>
                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt'  onClick={this._actions.bind(this,'Reward')} >
                            <Text className='default_label c33_label fw_label'>我的打赏</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View>
                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt'  onClick={this._actions.bind(this,'FeedBack')} >
                            <View className='d_flex fd_r ai_ct'>
                                <Text className='default_label c33_label fw_label'>帮助反馈</Text>
                                {/* <View className='red_dot'></View> */}
                            </View>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View>
                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_bt'  onClick={this._actions.bind(this,'Coupon')}  >
                            <Text className='default_label c33_label fw_label'>优惠券</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View>

                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 '  onClick={this._actions.bind(this,'Abouts')}  >
                            <Text className='default_label c33_label fw_label'>关于我们</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View>

                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp' onClick={this._actions.bind(this,'userAccount')}>
                            <Text className='default_label c33_label fw_label'>我的账户</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View>

                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp'  onClick={this._actions.bind(this,'PushClass')}>
                            <Text className='default_label c33_label fw_label'>推课赚钱</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View>

                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp'  onClick={this._actions.bind(this,'ask')}>
                            <Text className='default_label c33_label fw_label'>问答</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View>

                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp'  onClick={this._actions.bind(this,'annualBill')}>
                            <Text className='default_label c33_label fw_label'>年度账单</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View>

                        <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp' onClick={this._actions.bind(this,'MyFous')}>
                            <Text className='default_label c33_label fw_label'>我的关注</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View>



                        {/* <Button className='list' open-type='contact'>
                            <View className='list_left'>
                                <Text className='fs_14 clabel_33'>联系客服</Text>
                            </View>
                        </Button> */}

                        
                        {/* {teacher ?<View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp' onClick={this._actions.bind(this,'LectCourse')}>
                            <Text className='default_label c33_label fw_label'>我的课程</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View>:null}
                        {teacher ?<View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp'  onClick={this._actions.bind(this,'Promotion')}>
                            <Text className='default_label c33_label fw_label'>讲师晋级</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View>:null} */}
                        {/* {!teacher ? <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp'  onClick={this._actions.bind(this,'Applylect')}>
                            <Text className='default_label c33_label fw_label'>申请讲师</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View>:null} */}
                        {/* <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp'  onClick={this._actions.bind(this,'OwnCourse')}>
                            <Text className='default_label c33_label fw_label'>已购课程</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View> */}
                        {/*  <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp' onClick={this._actions.bind(this,'MyCertificate')}>
                            <Text className='default_label c33_label fw_label'>我的证书</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View> */}
                        {/* <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp'  onClick={this._actions.bind(this,'PushClass')}>
                            <Text className='default_label c33_label fw_label'>推课赚钱</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View> */}
                        {/* <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp' onClick={this._actions.bind(this,'MyFous')}>
                            <Text className='default_label c33_label fw_label'>我的关注</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View> */}
                        {/* <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp'  onClick={this._actions.bind(this,'SignIn')} >
                            <Text className='default_label c33_label fw_label'>签到</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View>*/}
                        {/* <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp' onClick={this._actions.bind(this,'Setting')}>
                            <Text className='default_label c33_label fw_label'>设置</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View> */}
                        {/* <View className='d_flex fd_r ai_ct jc_sb pt_15 pb_15 border_tp'  onClick={this._actions.bind(this,'Logout')}>
                            <Text className='default_label c33_label fw_label'>退出登录</Text>
                            <Image src={asset.arrow_right}  className='arrow_right' />
                        </View> */}
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
                                    adbans.map((ad:any,index)=>{
                                        return(
                                            <SwiperItem key={'teacher_gallery_'+index}>
                                                <Image 
                                                    src={ad.fileUrl} 
                                                    className='swiper_item' 
                                                    onClick={this._toMail.bind(this,ad)}
                                                />
                                            </SwiperItem>
                                        )
                                        
                                    })
                                }
                            </Swiper>
                        </View> 
                    :null}

                </View>

                
                <Auth ref={'auth'} success={() => {
                    this._onLoadCallBack()
                }}/>
            </View>
        )
    }
}

export default User as unknown as ComponentClass<PageOwnProps, PageState>