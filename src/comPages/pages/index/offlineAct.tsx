import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { View, Text,Image ,Input} from '@tarojs/components'

import { connect } from '@tarojs/redux'
import { homeType } from '../../../constants/homeType'

import Eval from '../../../components/Eval'
import Comt from '../../../components/General/Comt'


import inter from '../../../config/inter';
import api from '../../../services/api';
import asset from '../../../config/asset';
import menus from '../../../config/menu';


import GrapTmp from '../../../pages/index/grapTmp'


import { 
    getCourseDesc,
    getConfigGift
} from '../../../actions/home'


import  '../../../config/theme.css';
import './offlineAct.less';

type PageStateProps = {
    home: homeType,
}

type PageDispatchProps = {
    getCourseDesc: (object) => any,
    getConfigGift:(object)=>any
}



type PageOwnProps = {}

type  PageState = {
    course_id:number,
    article:any,
    isCollect:boolean,
    collectNum:number,
    courseImg:string,
    courseName:string,
    topComms:Array<{
        avatar:string,
        childList:Array<{}>,
        commentId:number,
        content:string,
        contentId:number,
        ctype:string,
        galleryList:Array<{}>,
        isAdmin:number,
        parentId:number,
        praise:number,
        pubIp:string,
        pubTime:number,
        pubTimeFt:string,
        score:number,
        userId:number,
        username:string ,
        like:boolean,
    }>,
    teacher:{
        content: string,
        course: number,
        follow:number,
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
    load:boolean,
    loginStatus: boolean,
    userId:number,
    teacherId:number,
    pubTimeFt:string,
    galleryList:Array<{}>,
    hit:number,
    typegift:boolean,
    gfId:number,
    userintegral:number,
    gfIntegral:number,
    gifttImg:string,
    publishGift:boolean,
    username:string ,
    comment:number,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface offlineAct {
    props: IProps;
}

@connect(({ home }) => ({ 
    home: home,
}), (dispatch) => ({
    getCourseDesc (object) {
        dispatch(getCourseDesc(object))
    },
    getConfigGift(object){
        dispatch(getConfigGift(object))
    }
}))


class offlineAct extends Component<PageDispatchProps & PageStateProps, PageState> {
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTitleText: '评选最美员工活动专题'
    }

    constructor () {
        super(...arguments)
        this.state = {
            course_id:0,
            article:"",
            isCollect:false,
            collectNum:0,
            courseImg:'',
            courseName:'',
            topComms:[],
            load: false,
            loginStatus: false,
            userId:0,
            teacher:{
                content: '',
                course: 0,
                follow:0,
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
            galleryList:[],
            teacherId:0,
            pubTimeFt:'',
            hit:0,
            typegift:false,
            gfId:0,
            userintegral:0,
            gfIntegral:0,
            gifttImg:'',
            publishGift:false,
            username:'',
            comment:0,
        }
    }


    componentWillReceiveProps (nextProps) {
        var that = this;
        const {home} = nextProps
        const {courseDesc} = home

        if (home !== this.props.home) {

            Taro.hideNavigationBarLoading()
            Taro.stopPullDownRefresh()

            that.setState({
                article:courseDesc.content,
                isCollect:courseDesc.collect,
                collectNum:courseDesc.collectNum,
                courseImg:courseDesc.courseImg,
                courseName:courseDesc.courseName,
                teacher:courseDesc.teacher,
                teacherId:courseDesc.teacherId,
                pubTimeFt:courseDesc.pubTimeFt,
                galleryList:courseDesc.galleryList,
                load: true,
                hit:courseDesc.hit,
                comment: courseDesc.comment,
            })
        }
        
    }




    componentWillMount () { 
    }



    componentDidMount() {
        var that = this;
        that.getCourseDesc();
        that._getAllComment();
        that.getUser();
    }


    getUser(){
        var that = this
        api.get(inter.User)
            .then((res)=>{
                if(res.data.status){
                    let userData = res.data.data
                    that.setState({
                        username:userData.nickname,
                        userintegral:userData.integral,
                        userId:userData.userId,
                    })
                }
            })
    }

    // 得到课程详情
    getCourseDesc(){
        var that = this

        let course_id = 542 ;
        that.props.getCourseDesc({
            course_id
        })
    }


    //课程评论
    _getAllComment(){
        var that = this

        api.get(inter.CourseCommt+542,{
            sort:2,
            page:0,
        }).then(res=>{
            if(res.data.status){
                let topComms  = res.data.data
                that.setState({
                    topComms:topComms.items
                })
            }
        })
    }

    _parse = () => {

    }


    _singUp = () =>{
        
    }
    



    componentWillUnmount () { }
    componentDidShow () { }
    componentDidHide () { }
    
    render () {

        const {article,courseImg,courseName,comment,course_id,topComms} = this.state ;

        return (
            <View  className='wrap'>
                <View className='content_wrap'>
                    <View className='img_wrap'>
                        <Image className='class_img' src={courseImg} mode='aspectFit'/>
                    </View>
                    <View className='title'>
                        <Text>{courseName}</Text>
                    </View>
                    <View className='info_wrap'>
                        <Text className='time'>活动时间：2018.12.18 - 12.30</Text>
                    </View>
                    <View className='info_wrap'>
                        <Text>332人关注·222人参加</Text>
                        <View className='fouse_btn'>
                            <Text className='sred_label sm_label'>+关注</Text>
                        </View>
                    </View>
                </View>
                <View className='p_15'>
                    <GrapTmp content={article} ></GrapTmp>
                </View>

                <View>
                    <View className='m_15 pt_15 border_tp'>
                        <Text className='lg18_label c33_label fw_label'>精选评论</Text>
                        {
                            topComms.length > 0  ? 
                            <View>
                            {
                                topComms.map((comm,index)=>{
                                    return(
                                        <View key={'comm' + index}>
                                            <Eval  
                                                comIdx={index}
                                                type = {1}
                                                val = {comm} 
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
                            onClick={()=>Taro.navigateTo({url:menus.allComment+'?course_id=' + `${course_id}` +'&type=0' + '&ctype=0'})}
                        >
                            <Text className='gray_label sm_label'>查看全部评论 &gt;</Text>
                        </View>
                    :null}
                    
                </View>

                <View className='btn_wrap'>
                    <View className='btn' hoverClass='on_btn' onClick={this._singUp}>
                        <Text>立即报名</Text>
                    </View>
                </View>
            </View>
        )
    }
}

export default offlineAct as ComponentClass