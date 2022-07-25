import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View,Text ,Image} from '@tarojs/components'
import Course from '../../../components/Course'
import RowCourse from '../../../components/RowCourse'
import asset from '../../../config/asset'
import menu from '../../../config/menu'

import {percent2percent25} from '../../../utils/common'

import { connect } from '@tarojs/redux'
import { homeType } from '../../../constants/homeType'

import { 
    getSiteChannel
} from '../../../actions/home'


import inter from '../../../config/inter'
import api from '../../../services/api'

import  '../../../config/theme.css';
import './indexCourse.less'

type PageStateProps = {
    home:homeType,
    getSiteChannel:Array<{}>
}

type PageDispatchProps = {
    getSiteChannel:(object) => any
}

type PageOwnProps = {}

type courseList = {
    categoryId: number,
    chapter: number,
    chapterList: Array<{}>,
    collect: boolean,
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
    study: null,
    summary: string,
    teacher: null
    teacherId: number,
    teacherName:string,
    ttype: number,
}

type PageState = {
    course:Array<courseList>,
    status:number,
    channel_id:number,
    sort:number,
    tabs:Array<string>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface IndexCourse {
    props: IProps;
}


@connect(({home})=>({
    home:home,
    // getSiteChannel:home.getSiteChannel
}),(dispatch) => ({
    getSiteChannel(object){
        dispatch(getSiteChannel(object))
    }
}))

class IndexCourse extends Component<PageDispatchProps & PageStateProps, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '精品课程',
        enablePullDownRefresh: true
    }

    constructor () {
        super(...arguments)
        this.state = {
            course:[],
            status:0,
            channel_id:0,
            sort:0,
            tabs:['最新','最热']
        }
        this._onSelect = this._onSelect.bind(this);
        this.loaddata = this.loaddata.bind(this);
        this.getSiteChannel = this.getSiteChannel.bind(this)
    }

    componentWillReceiveProps (nextProps) {   
        

        const {home} = nextProps
        const {siteChannel} = home

        if (home !== this.props.home) {
            this.setState({
                course:siteChannel,
            })
        }
    }

    componentWillMount () { 
        var that = this
        const {channel_id,channelName} = this.$router.params
        Taro.setNavigationBarTitle({
            title: channelName,
         })

        that.setState({
            channel_id:parseInt(channel_id)
        })
    }

    componentDidMount () { 
        this.getSiteChannel()
    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    getSiteChannel(){
        var that = this
        const {status,channel_id} = that.state
        that.props.getSiteChannel({
            channel_id,
            sort:status
        })
    }


    //展现的方式
    _onModel(){
        var that = this 
        const  {sort} = that.state 
        this.setState({
            sort : sort == 0 ? 1 : 0, 
        })
    }


    _onSelect(index){
        var that = this
        const {channel_id} = that.state
        that.setState({
            status:index
        },()=>{
            api.get(inter.ChannelSite + channel_id,{
                sort:index
            }).then((res)=>{
                if(res.data.status){
                    let course = res.data.data
                    that.setState({
                        course:course
                    })
                }
            })
        })

    }

    _onCourseDesc(c_row){
        if(c_row.ctype  === 0 ){
            Taro.navigateTo({
                url:menu.courseDesc+`?course_id=${c_row.courseId}` + '&courseName='+ percent2percent25(`${c_row.courseName}`) + '&isback=0'
            })  
        } else if(c_row.ctype === 1){
            Taro.navigateTo({url:menu.audioDesc +'?course_id='+ c_row.courseId+ '&audioName=' + percent2percent25(c_row.courseName)})
        }
    }

    loaddata(){
        var that = this
        const {status,channel_id} = that.state
        that.props.getSiteChannel({
            channel_id,
            sort:status
        })
    }

    onPullDownRefresh(){

        this.getSiteChannel();

        setTimeout(function () {
            //执行ajax请求后停止下拉
            Taro.stopPullDownRefresh();
        }, 1000);

    }


    render(){
        const {course ,status,sort,tabs} = this.state

        const icon_img = sort == 0 ? asset.rows :asset.vert
        const icon_tit = sort == 1 ? '双排模式' : '单排模式'

        return (
            <View className='coursewrap '>
                <View className='coursehead'>
                    <View className='d_flex pt_10 course_box jc_sb'>
                        <View className='d_flex fd_r ai_ct jc_sb head_box col_1'>
                            {
                                tabs.map((tab,index)=>{
                                    const on = index == status
                                    return(
                                        <View key={'tab'+index} className='head_box_item d_flex fd_c ai_ct' onClick={this._onSelect.bind(this,index)}>
                                            <Text className='default_label ' style={on ? {color:'#333333',fontWeight:'bold'} : {color:'#666666'}}>{tab}</Text>
                                            <View className='border_btn' style={on ? {backgroundColor:'#F4623F'} : {}} ></View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        <View className='course_sty  d_flex ai_ct jc_fe mb_5' onClick={this._onModel}>
                            <Image src={icon_img} className='iconimg' />
                            <Text className='default_label ml_5 tip_label'>{icon_tit}</Text>
                        </View>
                    </View>
                </View>
                
                <View className="hg35"></View>


                <View className='platewrap pl_12 pr_12 pt_15'>
                    {
                        sort == 0 ?
                        <View className='platerows '>
                            {
                                course.map((c_row,index)=>{
                                    return(
                                        <View key={'plate' + index} className='platerows_item' onClick={this._onCourseDesc.bind(this,c_row)}>
                                            <RowCourse courseList={c_row} />
                                        </View>
                                        
                                    )
                                })
                            }
                            
                        </View>
                        :
                        <View className='platevert'>
                            {
                                course.map((c_vert,index)=>{
                                    return(
                                        <View key={'c_vert'+index} className='pt_10 pb_10 border_bt platevert_it' onClick={this._onCourseDesc.bind(this,c_vert)}>
                                            <Course  courseList={c_vert} atype={0}/>
                                        </View>
                                        
                                    )
                                })
                            }
                            
                        </View>
                    }
                </View>
            </View>
        )
    }
}


export default IndexCourse as ComponentClass