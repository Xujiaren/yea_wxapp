
import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image,Progress,ScrollView} from '@tarojs/components'


import menu from '../../config/menu'
import asset from '../../config/asset'
import  '../../config/theme.css'
import './index.less'
import Tabs from '../../components/Tabs'
import Auths from '../../components/Auths'
import { connect } from '@tarojs/redux'
import { usersType } from '../../constants/usersType'
import {subTxt,percent2percent25} from '../../utils/common'
import { getUserStudy,getLearnCourse} from '../../actions/user'

import RowCourse from '../../components/RowCourse'

import inter from '../../config/inter'
import api from '../../services/api'

type PageStateProps = {
    user:usersType,
    userId:number,
    isAuth:number,
    getUserStudy:{
        learn:number,
        rank:number,
        today:number,
        total:number,
        learnList:Array<{
            day:string,
            duration:number
        }>
    }
} 

type PageDispatchProps = {
    getUserStudy:()=>any,
    getLearnCourse:(object)=>any
}

type PageOwnProps = {}

type  PageState = {
    userId:0,
    study:Array<{
        categoryId:number,
        chapter:number,
        chapterList:Array<{}>,
        content:string,
        courseId:number,
        courseImg:string,
        courseName:string,
        ctype:number,
        galleryList:Array<{}>,
        hit: number,
        integral: number,
        isRecomm: number,
        learn: number,
        pubTime: number,
        roomId: string,
        score: number,
        sortOrder: number,
        summary: string,
        teacher: string,
        teacherId: number,
        teacherName: string,
        ttype: number,
    }>,
    learnList:Array<{}>,
    recommList:Array<{}>,
    learn:number,
    rank:number,
    loginStatus:boolean,
    status:number,
    today:number,
    total:number,
    isAuth:number
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Study {
    props: IProps;
}

@connect(({user})=> ({
    user:user
}),(dispatch) => ({
    getUserStudy(){
        dispatch(getUserStudy())
    },
    getLearnCourse(object){
        dispatch(getLearnCourse(object))
    }
}))


class Study extends Component<PageDispatchProps & PageStateProps, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '学习',
        enablePullDownRefresh: false
    }

    constructor () {
        super(...arguments)
        this.state = {
            userId:0,
            study:[],
            learnList:[],
            recommList:[],
            learn:0,
            rank:0,
            loginStatus: false,
            status:0,
            today:0,
            total:0,
            isAuth:0
        }

        this._loaddata = this._loaddata.bind(this);
    }

    
    componentWillReceiveProps (nextProps) {
        const {user} = nextProps
        const {userStudy,learnCourse} = user

        if(userStudy !== undefined && learnCourse !== undefined){
            const {learnList,learn,rank,today,total} = userStudy
            const {loginStatus} = this.state
    
            if (loginStatus) {
                if (user !== this.props.user) {
                    this.setState({
                        learnList:learnList,
                        learn:learn,
                        rank:rank,
                        study:learnCourse.items,
                        today:today,
                        total:total
                    })
                }
            }
        }
    }


    componentWillUnmount () { }

    componentDidShow () { 
        var that = this
        const token = Taro.getStorageSync('token')
        const loginStatus = token != '';

        that.setState({
            loginStatus: loginStatus
        },()=>{
            if (loginStatus) {
                that._loaddata();
            } else {
                that.refs.auth.doLogin();
            }

            
        }) 
        
        
        
    }

    componentDidHide () { }


    componentDidMount () {
        var that = this ;
        that.getUser();
        that.getRecomm();
    }


    // 课程推荐
    getRecomm(){
        api.get(inter.CourseRecomm,{
            limit:10
        }).then((res)=>{
            this.setState({
                recommList:res.data.data
            })
        })
    }

    getLearnCourse(){
        this.props.getLearnCourse({
            status:0,
            page:0
        })
    }


    getUserStudy(){
        this.props.getUserStudy()
    }


    // 获取个人信息判断是否登录
    getUser(){
        var that = this
        api.get(inter.User)
        .then((res)=>{
            if(res.data.status){
                let userData = res.data.data
                if(userData.userId > 0){
                    that.setState({
                        userId:userData.userId,
                        isAuth:userData.isAuth
                    })
                } 
            }
        })
    }


    //详情页
    _oncourseDesc(recom){
        if(recom.ctype === 3){
            Taro.navigateTo({
                url:menu.grapWbdesc +`?course_id=${recom.courseId}` + '&courseName='+ percent2percent25(`${recom.courseName}`)
            })
        } else if(recom.ctype === 0 || recom.ctype === 2) {
            Taro.navigateTo({
                url:menu.courseDesc+`?course_id=${recom.courseId}` + '&courseName='+ percent2percent25(`${recom.courseName}`) + '&isback=0'
            })  
        } else if(recom.ctype === 1){
            Taro.navigateTo({url:menu.audioDesc +'?course_id='+ recom.courseId+ '&audioName=' + percent2percent25(recom.courseName) })
        } else if(recom.ctype === 18){
            Taro.navigateTo({url: menu.learnDesc + '?courseId=' +  recom.courseId + '&courseName=' + percent2percent25(`${recom.courseName}`)})
        }
    }


    // 选择学习地图
    _onSelect = (index) =>{
        var that = this ;
        const {userId,isAuth} = that.state
        if(userId > 0 ){

            if(index === 1){

                if(isAuth === 1){
                    Taro.navigateTo({
                        url:menu.s_Map
                    })
                } else {
                    Taro.showToast({
                        title:'学习地图仅对特定对象可见',
                        icon:'none',
                        duration:1000,
                    })
                }
                
            }
        } else {
            that.refs.auth.doLogin();
        }
        
    }

    // 点击更新按钮
    _update_recom(){
        api.get(inter.CourseRecomm,{
            limit:50
        }).then((res)=>{
            this.setState({
                recommList:res.data.data
            })
        })
    }


    _loaddata(){
        var that = this ;
        that.getUserStudy();
        that.getLearnCourse();
    }


    // 登录回调
    _onLoadCallBack(){
        var that = this ;
        
        that.getUser();
        that.getUserStudy();
        that.getLearnCourse();
    }


    // 查看排名
    _checkRank(type){
        var that = this
        const {userId} = that.state

        if(userId > 0 && userId !== undefined){

            if( type === 0 ){
                Taro.navigateTo({url:menu.provinData})
                // Taro.showToast({
                //     title:'暂未开放，敬请期待',
                //     icon:'none',
                //     duration:1000,
                // })
            } else {
                Taro.navigateTo({url:menu.rank})
            }
            
        } else {
            that.refs.auth.doLogin();
        } 
    }


    // 查看学习数据
    _studyData(){
        var that = this
        const {userId} = that.state

        if(userId > 0 && userId !== undefined){
            Taro.navigateTo({url:menu.studyData})
        } else {
            that.refs.auth.doLogin();
        } 

    }

    render () {

        const {recommList,study,learn,rank,status,today,total} = this.state
        let canvaswidth:number = 375
        var res = Taro.getSystemInfoSync();
        canvaswidth = res.windowWidth;

        let recommReList = recommList.slice(0,4)
        let studyReList = study.slice(0,4)

        // console.log(canvaswidth)

        return (
            <View className='studywrap'>

                <View className='headbox'>
                    <View className='atabs'>
                        <Tabs items={['学习记录','学习地图']} atype={0} selected={status} onSelect={this._onSelect} />
                    </View>
                </View>
                {/* <View style={{marginTop:100 + 'rpx'}}> */}
                <View style={{marginTop:50 + 'rpx'}}>
                    {/* <View className='study_head ' > */}
                <View className='study_head mb_10 ' style={{marginTop:40 + 'rpx'}}>
                    <Image src={asset.study_bg} className='study_bg'  style={{width:(canvaswidth -30)  + 'px' }}/>
                    <View className='study_head_desc d_flex fd_c jc_sb ai_ct' style={{width:(canvaswidth -30)  + 'px' }}>
                        <View className='d_flex fd_r jc_sb ai_ct mt_25' style={{width:(canvaswidth - 30)  + 'px' }}>
                            <View className='col_1 d_flex fd_c jc_ct ai_ct'>
                                <Text className='white_label sm_label'>今日学习</Text>
                                <Text className='white_label lg24_label mt_5'>{(today/3600).toFixed(1)}<Text className='smm_label pl_5'>小时</Text></Text>
                            </View>
                            <View className='col_1 d_flex fd_c jc_ct ai_ct borderSty'>
                                <Text className='white_label sm_label'>累计学习</Text>
                                <Text className='white_label lg24_label mt_5'>{(total/3600).toFixed(1)}<Text className='smm_label pl_5'>小时</Text></Text>
                            </View>
                            <View className='col_1 d_flex fd_c jc_ct ai_ct'>
                                <Text className='white_label sm_label'>连续学习</Text>
                                <Text className='white_label lg24_label mt_5'>{learn}<Text className='smm_label '> 天</Text></Text>
                            </View>
                        </View>
                        <Text className='sm_label mt_25 pb_20' style={{color:'#FBE59A'}}
                            onClick={this._studyData}
                        >学习数据</Text>
                    </View>
                </View>

                    <View className='stu_box d_flex fd_r ai_ct mt_5' style={{width:(canvaswidth -30)  + 'px' }}>
                        <View className='stu_item ' onClick={this._checkRank.bind(this,0)}>
                            <Text className='white_label fw_label default_label stu_tit'>各省学习排行</Text>
                            <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/397f2f6b-71c7-41dc-b974-35e823b0a2df.png'} className='stu_cover' />
                        </View>
                        <View className='stu_item ml_10' onClick={this._checkRank.bind(this,1)}>
                            <Text className='white_label fw_label default_label stu_tit'>个人学习排行</Text>
                            <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/07caec41-b58a-4c17-848b-1ccbf5c9d8cc.png'} className='stu_cover' />
                        </View>                    
                    </View>
                    <View className='ml_15 mr_15 mt_10'>
                    {
                        studyReList.length > 0 ?
                        <View className='study_course bg_white d_flex  fd_c pl_15 pr_15 pt_15 pb_15 mt_10'>
                            <View className='d_flex fd_r jc_sb ai_ct'>
                                <Text className='lg_label c33_label fw_label'>在学课程</Text>
                                <View className='d_flex ai_ct fd_r' onClick={() => Taro.navigateTo({url:menu.studyRecord})}>
                                    <Text className='default_label tip_label fw_label'>全部</Text>
                                    <Image src={asset.arrow_right} className='arrow_right ml_2' />
                                </View>
                            </View>
                            <View className='c_items'>
                                {
                                    studyReList.map((stu:any,index)=>{
                                        return(
                                            <View key={'stu'+index} className='c_item d_flex pb_15 pt_15 border_bt' onClick={this._oncourseDesc.bind(this,stu)}>
                                                <View className='c_item_cover'>
                                                    <Image src={stu.courseImg}  className='c_item_img_cover' />
                                                    {
                                                        stu.isSeries == 1 ?
                                                            <View className='c_item_title d_flex fd_r ai_ct jc_ct'>
                                                                <Text className='sm_label white_label'>系列课({stu.study.currentChapter}/{stu.study.totalChapter})</Text>
                                                            </View>
                                                    :null}
                                                </View>
                                                
                                                <View className='d_flex fd_c jc_sb ml_10 col_1'>
                                                    <View className="item_text">
                                                        <Text className='default_label c33_label fw_label'>{subTxt(stu.courseName)}</Text>
                                                    </View>
                                                    <View >
                                                        <View className='d_flex fd_r jc_sb mb_5'>
                                                            <Text className='sm_label c33_label fw_label'>{stu.study.updateTimeFt}</Text>
                                                            <Text className='sm_label tip_label'>在学{stu.study.progress}%</Text>
                                                        </View>
                                                        <Progress percent={stu.study.progress}  strokeWidth={3} active backgroundColor='#FFDFDE' activeColor='#FF5047' />
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    :null}
                    

                    
                   {
                        recommReList.length > 0 ?
                        <View className='video border_bt  pl_10 pr_10 bg_white mt_25'>
                            <View className='head pl_2 pr_2 pt_15 pb_15 d_flex fd_r jc_sb ai_ct'>
                                <Text className='lg_label c33_label fw_label'>课程推荐</Text>
                                <View className='d_flex fd_r ai_ct jc_ct' onClick={this._update_recom}>
                                    <Text className='tip_label default_label fw_label'>换一批</Text>
                                    <Image src={asset.update_icon}  className=' update_icon ml_5' />
                                </View>
                            </View>  
                            <View className='items d_flex fd_r jc_sb '>
                                {
                                    recommReList.map((item:any,index)=>{
                                        return(
                                            <View key={'item'+index} className='item' 
                                                onClick={this._oncourseDesc.bind(this,item)}
                                            >
                                                <RowCourse  courseList={item}/>  
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View> 
                    :null}
                    
                </View> 
                    <View className='d_flex ai_ct jc_ct pt_15 '>
                        <Text className='sm_label tip_label'>没有更多数据了</Text>
                    </View>
                </View>
                




                <Auths ref={'auth'} success={() => {
                    this._onLoadCallBack()

                    this.setState({
                        loginStatus: true     
                    })
                }}/>
            </View>
        )
    }
}


export default Study as ComponentClass