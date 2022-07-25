import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image,Progress,Swiper, SwiperItem} from '@tarojs/components'


import { connect } from '@tarojs/redux'
import { usersType } from '../../../constants/usersType'
import { getUserTask,getUserLevel} from '../../../actions/user'
import api from '../../../services/api'

import Coupon from '../../components/coupon/Coupon'
import asset from '../../../config/asset'
import menu from '../../../config/menu';
import inter from '../../../config/inter'

import  '../../../config/theme.css';
import './growthEquity.less'


// import index from '../index';

type PageStateProps = {
    user:usersType,
    getUserTask:Array<{}>,
    getUserLevel:Array<{}>
}

type PageDispatchProps = {
    getUserTask:() => any,
    getUserLevel:() => any
}

type PageOwnProps = {}


type PageState = {
    status:number,
    level:number,
    equityList:Array<{}>,
    integral:string,
    prestige:string,
    avatar:string,
    levels:Array<number>,
    leveldot:number,
    list:Array<{
        price:number,
        discount:number,
        title:string,
        begDate:string,
        endDate:string,
        c_status:number,
        code:string,
        ytype:number,
        ttype:number,
    }>,
    leve:any
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface GrowthEquity {
    props: IProps;
}

@connect(({user}) =>({
    user:user
}),(dispatch) => ({
    getUserTask(){
        dispatch(getUserTask())
    },
    getUserLevel(){
        dispatch(getUserLevel())
    }
}))


class GrowthEquity extends Component<PageDispatchProps & PageStateProps, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '成长权益',
        enablePullDownRefresh: false
    }   

    constructor () {
        super(...arguments)
        this.state = {
            status:0,
            level:0,
            equityList:[],
            integral:'',
            prestige:'',
            avatar:'',
            levels:[0,1,2,3,4,5,6,7,8],
            leveldot:0,
            list:[{
                price:20,
                discount:100,
                title:'直播课程专享',
                begDate:'2019.12.19',
                endDate:'2020.1.1',
                c_status:0,
                code:'',
                ytype:0,
                ttype:0,
            },{
                price:20,
                discount:100,
                title:'直播课程专享',
                begDate:'2019.12.19',
                endDate:'2020.1.1',
                c_status:0,
                code:'',
                ytype:0,
                ttype:0,
            }],
            leve:[]
        }
        this._onSwiper = this._onSwiper.bind(this);
        // this._renderImg = this._renderImg.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        var that = this
        const {level} = that.state
        const {user} = nextProps
        const {userLevel} = user
        
        console.log(userLevel)
        if(userLevel[0] !== undefined){
            that.setState({
                equityList:userLevel[level].equityList,
                leve:userLevel,
            })
        }
        
    }

    componentWillMount () { 
        const {integral,prestige,level,avatar} = this.$router.params

        this.setState({
            integral:integral,
            prestige:prestige,
            leveldot:parseInt(level),
            avatar:avatar,
            level:parseInt(level)
        },()=>{

        })

    }

    componentDidMount () { 
        this.getUserTask()
        this.getUserLevel()
    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    getUserTask(){
        this.props.getUserTask()
    }
    getUserLevel(){
        this.props.getUserLevel()
    }

    _onSwiper(e){
        var that = this
        const st = e.detail.current;
        that.setState({
            level:st
        })
        api.get(inter.Level).then((res)=>{
            if(res.data.status){
                var equityList = res.data.data
                this.setState({
                    equityList:equityList[st].equityList
                })

            }
        })
    }


    //  等级背景图片
    
    _renderImg(index:number){
        let url:string = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/g_lv0.png';
        if((index +  9 )% 9 === 0){
            url = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/g_lv0.png'
        } else if((index +  9 )% 9 === 1){
            url = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/g_lv1.png'
        } else if((index +  9 )% 9 === 2){
            url = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/g_lv2.png'
        } else if((index +  9 )% 9 === 3){
            url = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/g_lv3.png'
        } else if((index +  9 )% 9 === 4){
            url = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/g_lv4.png'
        } else if((index +  9 )% 9 === 5){
            url = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/g_lv5.png'
        } else if((index +  9 )% 9 === 6){
            url = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/g_lv6.png'
        } else if((index +  9 )% 9 === 7){
            url = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/g_lv1.png'
        } else if((index +  9 )% 9 === 8){
            url = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/g_lv2.png'
        }

        return(
            <Image src={url} style={{width:'100%',height:'220rpx',}}  className='mt_10  mb_10' />
        )
    }


    //完成任务跳转
    _onTask(task){
        let taskline = task.link 
        if(task.taskName=='O2O培训'){
            Taro.navigateTo({
                url:menu.profesSkill
            })
        }
        if(task.taskName=='资格认证'){
            Taro.navigateTo({
                url:menu.certificateSignUp
            })
        }
        if(task.taskName=='搜索'){
            Taro.navigateTo({
                url:menu.search
            })
        }
        if(task.taskName=='完善个人资料'){
            Taro.navigateTo({
                url:menu.userInfo
            })
        }
        if(task.taskName=='个人身份认证'){
            Taro.navigateTo({
                url:menu.realAuth
            })
        }
        if(taskline.length == 0){
            if(task.taskName!='O2O培训'&&task.taskName!='资格认证'&&task.taskName!='搜索'){
                Taro.switchTab({
                    url:menu.index
                })
            }
        } else {
            if(taskline == '/pages/index/index'){
                Taro.switchTab({
                    url:menu.index
                })
            } else {
                Taro.navigateTo({
                    url:taskline
                })
            }
            
        }
        
    }

    // 权益详情
    _equityState(equityId){
        var that = this
        const {user} = that.props
        const {userLevel} = user
        const {level} = that.state

        let levelList = userLevel[level].equityList

        Taro.navigateTo({
            url:menu.equityState + '?equityId='+`${equityId}` + '&levelist=' + JSON.stringify(levelList)
        })
    }

    render () {
        var that = this
        const {level,equityList,integral,prestige,avatar,levels,leve,leveldot,list} = that.state

        const {user} = this.props
        const {userTask,userLevel} = user


        return (
            <View className='growwrap'>
                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/equity_bg.png'} className='equity_bg' />
                <View className='equity_box'>
                    <View className='headbox'>
                        <View className='head d_flex fd_r jc_sb '>
                            <View className='d_flex fd_c ai_ct'>
                                <Text className='lg30_label ' style={{color:'#DBB177'}}>{integral}</Text>
                                <Text className='sm_label white_label '>学分</Text>
                            </View>
                            <View className='head_cover_boxs'>
                                <Image src={avatar}  className='head_cover' />
                            </View>
                            <View className='d_flex fd_c ai_ct'>
                                <Text className='lg30_label ' style={{color:'#DBB177'}}>{prestige}</Text>
                                <Text className='sm_label white_label '>成长值</Text>
                            </View>
                        </View>
                        <View className='linebox mt_20'>
                            <View className='lines'></View>

                            <View className='levesbox d_flex fd_r ai_ct jc_sb'>
                                {
                                    userLevel.map((item,index)=>{
                                        const on  = index < leveldot+1
                                        return(
                                            <View className='leves_item d_flex ai_ct fd_c' key={'levels'+ index}>
                                                <View className='leves_dot' style={on ? {background:"linear-gradient(180deg,rgba(255,228,176,1) 0%,rgba(212,176,127,1) 100%)", boxShadow:"0px 1px 3px 0px rgba(211,171,107,1)"} : {}}></View>
                                                <Text className='sm_label tip_label mt_10'>Lv.{leve[index].levelName}</Text>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <Swiper
                            className='test-h'
                            indicatorColor='#999'
                            indicatorActiveColor='#333'
                            indicatorDots={false}
                            previous-margin='100rpx'
                            next-margin='100rpx'
                            current={level}
                            onChange={(e)=>this._onSwiper(e)}
                        >
                            {
                                userLevel.map((item:any,index)=>{

                                    let percent_val:number = 0 //progress值
                                    let prestige_tips:string = '' //完成 当前位置  未完成
                                    let prestige_num:any = '' 

                                    if(prestige > item.beginPrestige){
                                        if(prestige > item.endPrestige){
                                            percent_val = 100
                                            prestige_tips = '已完成'
                                        } else {
                                            percent_val = (parseInt(prestige)/item.endPrestige) * 100
                                            prestige_tips = '当前等级'
                                            prestige_num = `还差 ${item.endPrestige - parseInt(prestige) + 1} 点升级`
                                        }
                                    } else {
                                        percent_val = 0 
                                        prestige_tips = '未完成'
                                        prestige_num = `还需 ${item.endPrestige - parseInt(prestige) + 1} 点升级`
                                    }

                                    return(
                                        <SwiperItem className='levels' key={'item'+index}>
                                            <View className='level_box'>
                                                {this._renderImg(index)}
                                                <View className='level mt_10  mb_10 ' style={{position:'absolute',width:'100%',top:0}}>
                                                    <View className='level_tips'>
                                                        <Text className='sm8_label' style={{color:'#FDEBCD'}}> {prestige_tips}</Text>
                                                    </View>
                                                    <View className='progress d_flex fd_c  pt_25 '>
                                                        
                                                        <Text className='lg20_label fw_label'>Lv.{item.levelName}</Text>
                                                        <Text className='sm_label pb_5 fw_label'>当前成长值{prestige}</Text>
                                                        <Progress percent={percent_val}  
                                                            strokeWidth={4} 
                                                            className='progredd_w'
                                                            backgroundColor='#EFEFEF' 
                                                            activeColor='#212128'
                                                        />
                                                        <View className='d_flex fd_r jc_sb col_1 pt_5'>
                                                            <Text className='smm_label c33_label fw_label'>Lv.{index}</Text>                                                       
                                                            <Text className='smm_label c33_label fw_label'>{prestige_num}</Text>
                                                            {
                                                                (index + 1) > 9 ? 
                                                                <Text className='smm_label'>∞</Text>
                                                                :
                                                                <Text className='smm_label c33_label fw_label '>Lv.{index + 1}</Text>
                                                            }
                                                        </View>
                                                    </View>
                                                    
                                                </View>
                                            </View>
                                        </SwiperItem>
                                    )
                                    
                                })
                            }
                        </Swiper>
                    </View>
                    <View className='privilege d_flex fd_c'>
                        <View className='d_flex ai_ct jc_sb'>
                            <Text className='lg_label c33_label fw_label'>Lv.{level}特权</Text>
                            <View className='d_flex fd_r ai_ct' onClick={this._equityState.bind(this,0)}>
                                <Text className='tip_label default_label fw_label' >权益详情</Text>
                                <Image src={asset.arrow_right}  className='arrow_right'/>
                            </View>
                        </View>
                        <View className='d_flex ai_ct  pt_12 pb_12'>
                            {
                                equityList.map((equity:any,index)=>{
                                    return(
                                        <View className='d_flex fd_c  ai_ct ' key={'equity'+index} style={{width:"25%"}} 
                                            onClick={this._equityState.bind(this,equity.equityId)}
                                        >
                                            <Image className='priv_icon' src={equity.equityImg}  />
                                            <Text className='default_label pt_10 c33_label fw_label'>{equity.equityName}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                    <View className='noviebox pt_15 pl_25 pr_25 pb_25'>
                        <Text className='lg_label  pb_10  c33_label fw_label'>会员任务</Text>
                        <View className='novice mb_15'>
                            {
                                userTask.map((task:any,index)=>{
                                    return(
                                        <View className='d_flex fd_r ai_ct' key={'task'+index}>
                                            <Image src={task.taskImg} className='task_cover' />
                                            <View className='novice_item d_flex jc_sb ai_ct col_1 border_bt pb_20 pt_20'>
                                                <View className='d_flex fd_c ml_10'>
                                                    <View className='d_flex fd_r ai_ct'>
                                                        <Text className='default_label c33_label'>{task.taskName}</Text>
                                                        {
                                                            task.status == 1 ?
                                                            <View className='grothbtns d_flex fd_r ai_ct jc_ct ml_5'>
                                                                <Text className='smm_label' style={{color:'#DBB177'}}>成长值</Text>
                                                            </View>
                                                        :null}
                                                        
                                                        <Text className=' sm_label ml_5' style={{color:'#DBB177'}}>+{task.integral}</Text>
                                                    </View>
                                                    <Text className='sm_label tip_label'>{task.taskSummary}</Text>
                                                </View>
                                                {
                                                    task.status == 0 ?
                                                    <View className='level_btn d_flex jc_ct ai_ct '  onClick={this._onTask.bind(this,task)}>
                                                        <Text className='sm_label white_label'>去完成</Text>
                                                    </View>
                                                    :
                                                    <View className='level_btns d_flex jc_ct ai_ct ' >
                                                        <Text className='sm_label white_label'>已完成</Text>
                                                    </View>
                                                }
                                            
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>


                        {/* <Text className='fw_label c33_label lg_label'>兑换优惠券</Text>
                        <View className='coupon_con conpon_btn pt_15 pb_15 mb_15'>
                            {
                                list.map((item,index)=>{
                                    return(
                                        <View key={'item' + index}>
                                            <Coupon  data={item} />
                                            <View className='d_flex fd_r ai_ct jc_sb'>
                                                <View className='d_flex fd_r ai_ct jc_ct con_btn'>
                                                    <Text className='sm_label white_label'>兑换</Text>
                                                </View>
                                                <Text className='tip_label sm_label'>余 4999</Text>
                                            </View>
                                        </View>
                                        
                                    )
                                })
                            }
                        </View> */}


                        {/* <Text className='fw_label c33_label lg_label'>免费领券</Text>
                        <View className='coupon_con'>
                            {
                                list.map((item,index)=>{
                                    return(
                                        <View key={'item' + index} >
                                            <Coupon  data={item} />
                                            <View className='d_flex fd_r ai_ct jc_sb'>
                                                <View className='d_flex fd_r ai_ct jc_ct con_btn'>
                                                    <Text className='sm_label white_label'>兑换</Text>
                                                </View>
                                                <Text className='tip_label sm_label'>余 4999</Text>
                                            </View>
                                            
                                        </View>
                                        
                                    )
                                })
                            }
                        </View> */}

                        
                    </View>

                
                </View>
            </View>

            
        )
    }
}


export default GrowthEquity as ComponentClass