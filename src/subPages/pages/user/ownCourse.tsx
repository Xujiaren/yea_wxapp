import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Input,Image} from '@tarojs/components'

import inter from '../../../config/inter'
import api from '../../../services/api'

import { usersType } from '../../../constants/usersType'
import {percent2percent25} from '../../../utils/common'

import menu from '../../../config/menu'
import Tabs from '../../../components/Tabs'
import asset from '../../../config/asset'

import  '../../../config/theme.css';
import './ownCourse.less'


type PageStateProps = {

} 

type PageDispatchProps = {

}

type PageOwnProps = {}

type PageState = {
    course:Array<any>,
    page:number,
    pages:number,
    total:number,
    loadding:boolean,
    status:number,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface ownCourse {
    props: IProps;
}




class ownCourse extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '已购课程',
        enablePullDownRefresh: true
    }

    constructor () {
        super(...arguments)
        this.state = {
            course:[], // 课程列表
            page:0,
            pages:0,
            total:0,
            status:0,
            loadding:false,
        }
    }

    componentWillMount () { 
        var that = this 
        const {courseType} = that.$router.params

        that.setState({
            status: courseType !== undefined ? parseInt(courseType) : 0
        })

    }
    componentDidMount () {
        var that = this
        that.getCourseList()
    }
    componentWillUnmount () { }
    componentDidShow () { }
    componentDidHide () { }


    // 课程接口
    getCourseList(){
        var that = this;

        const {page,status} = that.state


        api.get(inter.ownCourse,{
            ctype:status,
            page:page,
        }).then(res=>{
            if(res.data.status){
                let courseList = res.data.data
                this.setState({
                    course:courseList.items,
                    page:courseList.page,
                    pages:courseList.pages,
                    total:courseList.total,
                })
            }
        })
    }



    // 加载数据
    loaddata(){
        var that = this;

        const {page,course,status} = that.state


        api.get(inter.ownCourse,{
            ctype:status,
            page:page,
        }).then(res=>{
            if(res.data.status){
                let courseList = res.data.data
                const tempArray = course.concat(courseList.items)
                this.setState({
                    course:tempArray,
                    page:courseList.page,
                    pages:courseList.pages,
                    total:courseList.total,
                })
            }
        })
    }


    _onSelect = (index) =>{
        var that = this;
        this.setState({
            status:index,
            course:[],
            page:0,
        },()=>{
            that.getCourseList()
        })
    }


    // 进入详情页
    _oncourseDesc(item){
        var that = this 
        const {status} = that.state  

        if( status === 0 ){

            Taro.navigateTo({
                url:menu.courseDesc+`?course_id=${item.courseId}` + '&courseName='+ percent2percent25(`${item.courseName}`) + '&isback=0'
            })

        } else  if(status === 1){

            Taro.navigateTo({
                url:menu.audioDesc +'?course_id='+ item.courseId+ '&audioName=' + percent2percent25(item.courseName)
            })
            
        } else if(status === 2){
            if(item.liveStatus === 2 && item.roomStatus === 4){
                Taro.navigateTo({
                    url:menu.courseDesc+`?course_id=${item.courseId}` + '&courseName='+ percent2percent25(`${item.courseName}`) + '&isback=1'
                })
            } else {
                Taro.navigateTo({
                    url:menu.liveDesc+'?courseId='+ item.courseId+'&liveStatus='+ item.liveStatus + '&liveName=' + percent2percent25(`${item.courseName}`)
                })
            }
        }
        
    }
    

     // 下拉
     onPullDownRefresh(){
        var self = this
        
        self.setState({
            page:0,
            course:[],
            loadding:false
        },()=>{
            self.getCourseList();
            
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }


    onReachBottom(){
        var self = this;
        
        let {page,pages} = this.state

        if(page < pages){
            self.setState({
                page:page + 1
            },()=>{
                self.loaddata();
            })
        } else {
            self.setState({
                loadding:true
            })
        }
    }

    render () {
        const {status,course,loadding} = this.state
        return (
            <View className='wrap'>

                <View className='headbox'>
                    <View className='atabs pl_30 pr_30'>
                        <Tabs items={['视频课程','音频课程','直播课程']}  selected={status} onSelect={this._onSelect}/>
                    </View>
                </View>

                <View className='recomm_items pl_20 pr_20 '>
                    {
                        course.map((item,index)=>{
                            return(
                                <View className='item d_flex fd_r   pb_20 ' key={'recom'+index} onClick={this._oncourseDesc.bind(this,item)}>
                                    <View className='item_cover_cons' >
                                        <Image src={item.courseImg} className='item_cover' />
                                        {
                                            item.chapter > 1 ?
                                            <View className='item_tips_hit'>
                                                <Image src={asset.cover_tips_icon}  className='item_hit_cover' />
                                                <Text className='sm8_label white_label mt_3'>{item.chapter}讲</Text>
                                            </View>
                                        :null}
                                        {
                                            item.liveStatus === 2 && item.roomStatus === 4 ?
                                            <View className='item_tips_back'>
                                                <Text className='sm8_label white_label '>回放</Text>
                                            </View>
                                        :null}
                                    </View>
                                    <View className='d_flex fd_c pl_10 jc_sb col_1'>
                                        <View className='d_flex fd_c'>
                                            <View className='item_text'>
                                            <Text className='default_label c33_label fw_label' >{item.courseName}</Text>
                                            </View>
                                            <View className='recom_bg'>
                                                <Text className='sml_label tip_label'>{item.summary}</Text>
                                            </View>
                                        </View>
                                        
                                        <View className='d_flex fd_r ai_ct mt_5 jc_sb'>
                                        <Text className='sm_label red_label'>{item.integral}学分</Text>
                                            <View className='view_play d_flex fd_r ai_ct ' onClick={this._oncourseDesc.bind(this,item)}>
                                                <View className='view_icon'></View>
                                                <Text className='sm_label red_label ml_5'>播放</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>

                {
                    loadding == true ?
                        <View className='loaddata d_flex ai_ct jc_ct bg_white pt_10 pb_10'>
                            <Text className='sm_label tip_label'>没有更多数据了</Text>
                        </View>
                :null}
                    
            </View>
        )
    }
}

export default ownCourse as ComponentClass