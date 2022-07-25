import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image} from '@tarojs/components'



import asset from '../../../../config/asset'
import menu from '../../../../config/menu';
import inter from '../../../../config/inter'
import api from '../../../../services/api'

import {percent2percent25} from '../../../../utils/common'

import  '../../../../config/theme.css';
import './lectCourse.less'

type PageState = {
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
    course:Array<any>,
    page:number,
    pages:number,
    total:number,
    loadding:boolean,
    teacherId:number,
    courseNum:number,
    newCourse:number,
    percent:number,
    hour:number,
}

class lectCourse extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '我的课程',
        // enablePullDownRefresh: true
    }

    constructor () {
        super(...arguments)
        this.state = {
            teacherDTO:{},
            course:[], // 课程列表
            page:0,
            pages:0,
            total:0,
            loadding:false,
            teacherId:0,
            courseNum:0,
            newCourse:0,
            percent:0,
            hour:0,
        }
    }

    componentWillMount () {
        var that = this ;

        const {teacherId} = that.$router.params

        that.setState({
            teacherId:parseInt(teacherId)
        })
    }

    componentDidMount () { 

        var that = this
        that.getUser();
        that.getCourseList()
        
    }

    componentWillUnmount () {

    }
    
    componentDidShow () { }
    componentDidHide () { }

    
     // 我的
     getUser(){
        var that = this
        api.get(inter.User)
        .then((res)=>{
            if(res.data.status){
                let userData = res.data.data
                that.setState({
                    teacherDTO:userData.teacherDTO,
                    courseNum:userData.teacherDTO.courseNum,
                    newCourse:userData.teacherDTO.newCourse,
                    percent:userData.teacherDTO.percent,
                    hour:userData.teacherDTO.hour,
                })
            }
        })
    }

    // 课程接口
    getCourseList(){
        var that = this;

        const {teacherId} = that.state


        api.get(inter.teachCourse + teacherId + '/course').then(res=>{
            if(res.data.status){
                let courseList = res.data.data
                this.setState({
                    course:courseList,
                })
            }
        })
    }



    // 课程详情
    _courseDesc(lect){

        Taro.navigateTo({
            url:menu.courseDesc+`?course_id=${lect.courseId}` + '&courseName='+ percent2percent25(`${lect.courseName}`) + '&isback=0'
        })  

    }



    // // 加载数据
    // loaddata(){
    //     var that = this;

    //     const {page,course} = that.state


    //     api.get(inter.Index,{
    //         category_id:22,
    //         ccategory_id:0,
    //         ctype:9,
    //         sort: 1,
    //         page:page,
    //     }).then(res=>{
    //         if(res.data.status){
    //             let courseList = res.data.data
    //             const tempArray = course.concat(courseList.items)
    //             this.setState({
    //                 course:tempArray,
    //                 page:courseList.page,
    //                 pages:courseList.pages,
    //                 total:courseList.total,
    //             })
    //         }
    //     })
    // }



    //  // 下拉
    //  onPullDownRefresh(){
    //     var self = this
        
    //     self.setState({
    //         page:0,
    //         course:[],
    //         loadding:false
    //     },()=>{
    //         self.getCourseList();
            
    //         setTimeout(function () {
    //             //执行ajax请求后停止下拉
    //             Taro.stopPullDownRefresh();
    //         }, 1000);
    //     })
    // }


    // onReachBottom(){
    //     var self = this;
        
    //     let {page,pages} = this.state

    //     if(page < pages){
    //         self.setState({
    //             page:page + 1
    //         },()=>{
    //             self.loaddata();
    //         })
    //     } else {
    //         self.setState({
    //             loadding:true
    //         })
    //     }
    // }

    
    render () {
        const {course,loadding,courseNum,newCourse,percent,hour} = this.state

        return (
            <View>
                <View className='tops'>
                    <View className='txt_ct'>
                        <View className='blues'>{courseNum}</View>
                        <View className='grays mt_10'>授课总数</View>
                    </View>
                    <View className='txt_ct'>
                        <View className='blues'>{hour}</View>
                        <View className='grays mt_10'>授课课时</View>
                    </View>
                    <View className='txt_ct'>
                        <View className='blues'>{newCourse}</View>
                        <View className='grays mt_10'>本年新课</View>
                    </View>
                    <View className='txt_ct'>
                        <View className='blues'>{percent}</View>
                        <View className='grays mt_10'>满意度</View>
                    </View>
                </View>
                <View className='wrap pl_20 pr_20 pt_20'>
                {
                    course.map((lect:any,index)=>{
                        return(
                            <View key={'lect' + index}  className='item d_flex fd_r   pb_20' onClick={this._courseDesc.bind(this,lect)}>
                                <View className='item_cover_cons'>
                                    <Image src={lect.courseImg} className='item_cover' />
                                    {
                                        lect.chapter > 1 ? 
                                        <View className='item_tips_hit'>
                                            <Image src={asset.cover_tips_icon}  className='item_hit_cover' />
                                            <Text className='sm8_label white_label mt_3'>{lect.chapter}讲</Text>
                                        </View>
                                    :null}
                                </View>

                                <View className='col_1 d_flex  fd_c  jc_sb ml_10'>
                                    <View className='d_flex fd_c'>
                                        <Text className='default_label c33_label item_text'>{lect.courseName}</Text>
                                        {
                                            lect.integral > 0 ?
                                            <Text className='red_label sm_label mt_3'>{lect.integral}学分</Text>
                                            :
                                            <Text className='red_label sm_label mt_3'>免费</Text>
                                        }
                                    </View>
                                    <View className='d_flex fd_r jc_sb'>
                                        {/* <Text className='sm_label gray_label'>购买人数：{100} </Text>  */}
                                        <Text className='sm_label gray_label'> 综合评分：{lect.score}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
                </View>
                

                {/* {
                    loadding == true ?
                        <View className='loaddata d_flex ai_ct jc_ct bg_white pt_10 pb_10'>
                            <Text className='sm_label tip_label'>没有更多数据了</Text>
                        </View>
                    :null} */}
            </View>
        )
    }
}

export default lectCourse as ComponentClass