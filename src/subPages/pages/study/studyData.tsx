
import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { View, Text ,Image,Progress,Canvas} from '@tarojs/components'

import wxCharts from '../../../utils/wxcharts'

import asset from '../../../config/asset'

import Auths from '../../../components/Auths'
import { connect } from '@tarojs/redux'
import { usersType } from '../../../constants/usersType'
import { getUserStudy,getLearnCourse} from '../../../actions/user'


import  '../../../config/theme.css'
import './studyData.less'

type PageStateProps = {
    user:usersType,
    getUserStudy:{
        learn:number,
        rank:number,
        today:number,
        total:number,
        totalCourse:number,
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
    totalCourse:number,
    loginStatus:boolean
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface studyData {
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


class studyData extends Component<PageDispatchProps & PageStateProps, PageState> {

    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "white",
        navigationBarTitleText: '学习数据',
        navigationBarBackgroundColor:'#F46341',
    }

    constructor () {
        super(...arguments)
        this.state = {
            study:[],
            learnList:[],
            recommList:[],
            learn:0,
            rank:0,
            totalCourse:0,
            loginStatus: false,
        }

        this._loaddata = this._loaddata.bind(this);
        this._loading = this._loading.bind(this);
    }

    
    componentWillReceiveProps (nextProps) {
        const {user} = nextProps
        const {userStudy,learnCourse} = user
        const {learnList,learn,rank,totalCourse} = userStudy
        const {loginStatus} = this.state


        if (loginStatus) {
            if (user !== this.props.user) {
                this.setState({
                    learnList:learnList,
                    learn:learn,
                    rank:rank,
                    totalCourse:totalCourse,
                    study:learnCourse.items
                },()=>{
                    this._loading(learnList);
                })
            }
        }
        
    }


    componentWillUnmount () { }

    componentDidShow () { 
        const token = Taro.getStorageSync('token')
        const loginStatus = token != '';

        this.setState({
            loginStatus: loginStatus
        },()=>{
            if (loginStatus) {
                this._loaddata();
            } else {
                this.refs.auth.doLogin();
            }
        })       
    }

    componentDidHide () { }


    _loaddata(){
        this.getUserStudy();
        this.getLearnCourse();
    }


    getLearnCourse(){
        this.props.getLearnCourse({
            status:0,
            page:0
        })
    }

    _loading(learnList){
        let lineChart  ;
        var windowWidth:number  = 320;
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }  catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        let categories:string[] = new Array()
        let data:number[] = new Array()

        learnList.map((learn,index)=>{
            categories.push(learn.day.substring(5));
            data.push(learn.duration/3600 > 0 ? learn.duration/3600 : 0.01);
        })
        

        if (data.length > 0) {
            lineChart = new wxCharts({
                // canvasId: 'lineCanvas', 
                // type: 'line',
                // categories: categories,
                // animation: false,

                touchIndex:-1,
                legend:true,
                drawAreaWithLine:true,
                canvasId: 'lineCanvas', 
                type: 'area',
                categories: categories,
                animation: false,
                dataPointShape:['circle'],


                series: [{
                    name: '观看时间(h)',
                    data: data,
                    showInLegend:false,
                    format: function (val, name) {
                        return val.toFixed(2) + 'h';
                    },
                    itemStyle:{
                        normal:{
                            label:{
                                show:true
                            },
                            color:'#F4623F',
                            lineStyle:{
                                color:'#F4623F'
                            }
                        }
                    }
                }],
                tooltip: {
                    formatter: '10'
                },
                xAxis: {
                    fontColor:'#999',
                    gridColor:'#EFEFEF',
                    disableGrid: true,
                    axisLine:{
                        lineStyle :{
                            color: '#F4623F'
                        }
                    },
                },
                yAxis: {
                    // title: '观看时间 (小时)',
                    format: function (val) {
                        return val.toFixed(1);
                    },
                    min: 0,
                    max:0.5,
                    axisLine:{
                        lineStyle :{
                            color: '#CECECE'
                        }
                    }
                },
                width: windowWidth,
                height: 200,
                dataLabel: false,
                extra: {
                    lineStyle: 'curve'
                }
            })
        }
        
    }

    getUserStudy(){
        this.props.getUserStudy()
    }



    render () {
        const {user} = this.props
        const {userStudy} = user
        const {today,total} = userStudy
        const {learn,rank,totalCourse} = this.state
        let canvaswidth:number = 375
        var res = Taro.getSystemInfoSync();
        canvaswidth = res.windowWidth;

        return (
            <View className='studywrap'>
                <Image src={asset.learn_icon} className='learn_icon'  />
                <View className='studycons'>
                    <View className='studyRank'>
                        <View className='hourRnk bg_white d_flex fd_c'>
                            <View className='d_flex fd_r hour_items '>
                                <View className='d_flex fd_c jc_ct  hourRnk_item'>
                                    <Text className='sm_label gray_label'>今日学习</Text>
                                    <Text className='c33_label lg24_label mt_5 fw_label'>{(today/3600).toFixed(1)}<Text className='smm_label pl_5'>小时</Text></Text>
                                </View>
                                <View className='d_flex fd_c ai_ct jc_ct  hourRnk_item'>
                                    <Text className='sm_label gray_label '>累计学习</Text>
                                    <Text className='c33_label lg24_label mt_5 fw_label'>{(total/3600).toFixed(1)}<Text className='smm_label pl_5'>小时</Text></Text>
                                </View>
                                <View className='d_flex fd_c ai_ct jc_ct  hourRnk_item'>
                                    <Text className='sm_label gray_label '>连续学习</Text>
                                    <Text className='c33_label lg24_label mt_5 fw_label'>{learn}<Text className='smm_label '> 天</Text></Text>
                                </View>
                            </View>
                            <Text className='default_label gray_label mt_15 ml_5'>行动力超过了{rank}%的用户</Text>
                        </View>
                    </View>
                    <Canvas style={{ height:'400rpx',width:(canvaswidth) +'px' }}  canvasId='lineCanvas' ></Canvas>


                    <View className='m_15 p_15 log_cons'>
                        <Text className='default_label c33_label fw_label'>累计</Text>
                        <View className='log border_tp mt_15 pt_15' >
                            <View className='d_flex fd_r ai_ct'>
                                <Image src={asset.study_hour} className='log_icon' />
                                <Text className='sm_label gray_label ml_10'>累计时长</Text>
                            </View>
                            <Text className='sm_label gray_label'>{(total/60).toFixed(1)}分</Text>
                        </View>
                        <View className='log mt_15'>
                            <View className='d_flex fd_r ai_ct'>
                                <Image src={asset.study_total} className='log_icon' />
                                <Text className='sm_label gray_label ml_10'>累计天数</Text>
                            </View>
                            <Text className='sm_label gray_label'>{learn}天</Text>
                        </View>
                        <View className='log mt_15'>
                            <View className='d_flex fd_r ai_ct'>
                                <Image src={asset.study_course} className='log_icon' />
                                <Text className='sm_label gray_label ml_10'>累计课程</Text>
                            </View>
                            <Text className='sm_label gray_label'>{totalCourse}课</Text>
                        </View>
                    </View>
                </View>
                
                
                <Auths ref={'auth'} success={() => {
                    this._loaddata();

                    this.setState({
                        loginStatus: true     
                    })
                }}/>
            </View>
        )
    }
}


export default studyData as ComponentClass