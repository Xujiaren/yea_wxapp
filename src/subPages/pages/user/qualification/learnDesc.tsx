import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Video} from '@tarojs/components'

import { connect } from '@tarojs/redux'
import { homeType } from '../../../../constants/homeType'



import menu from '../../../../config/menu';
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import  '../../../../config/theme.css';
import './learnDesc.less'

import { 
    getCourseDesc,
} from '../../../../actions/home'


type PageStateProps = {
    home: homeType,
}

type PageDispatchProps = {
    getCourseDesc: (object) => any,
}

type PageState = {
    load: boolean,
    course_id:number,
    courseName:string,
    chapter:string,
    hit:string,
    mediaId:string,
    videoCover:string,
    videoDuration:number,
    videom38u:string,
    chapterList:Array<any>,
    content:string,
    courseImg:string,
    networkType:boolean,
    play: boolean,
    now_time:string,
    end_time:any,
    rds_initTime:number,
}

type PageOwnProps = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface learnDesc {
    props: IProps;
}

@connect(({ home }) => ({
    home: home,

}), (dispatch) => ({
    getCourseDesc (object) {
        dispatch(getCourseDesc(object))
    },
}))


class learnDesc extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: ''
    }
    ts: any

    constructor () {
        super(...arguments)

        this.ts = 0;
        this.state = {
            load: false,
            course_id:0,
            courseName:'',
            chapter:'',
            hit:'',
            mediaId:'',
            videoCover:'',
            videoDuration:0,
            videom38u:'',
            chapterList:[],
            content:'',
            courseImg:'',
            networkType:false,
            play: false,
            now_time:'',
            end_time:'',
            rds_initTime:0,
        }

        this._getCourseRecord = this._getCourseRecord.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        const {home} = nextProps
        const {courseDesc} = home

        if(home !== this.props.home){
            this.setState({
                courseName:courseDesc.courseName,
                content:courseDesc.content,
                chapter:courseDesc.chapter,
                hit:courseDesc.hit,
                mediaId:courseDesc.mediaId,

            },()=>{
                this.getVideo()
            })
        }
    }

    componentWillMount () {
        var that = this ;
        
        const {courseId,courseName} = that.$router.params

        that.setState({
            course_id:parseInt(courseId),
        })

        Taro.setNavigationBarTitle({
            title: courseName,
        })
    }

    componentDidMount () { 
        var that = this
        that._getCourseDesc();
    }

    componentWillUnmount () {

    }
    
    componentDidShow () { }
    componentDidHide () { }


    // 详情
    _getCourseDesc(){
        var that = this ;
        const {course_id} = that.state

        that.props.getCourseDesc({
            course_id
        })
    }


    // 获取视频
    getVideo(){
        var that = this 
        const {mediaId} = that.state

        let record = Taro.getStorageSync("courseRd");
        if (record == '') record = {};

        api.post(inter.CourseVideo,{
            media_id:mediaId
        }).then((res)=>{
            if(res.data.status){
                const videodesc = res.data.data

                that.setState({
                    load: true,
                    videoCover:videodesc.cover,
                    end_time:videodesc.duration,
                    videom38u:videodesc.m38u,
                    courseImg:videodesc.courseImg,
                    content:videodesc.content,

                },()=>{
                    let rds_initTime = record[mediaId] || 0;
                    if(videodesc.duration - rds_initTime < 10){
                        rds_initTime = 0;
                    }
                    that.setState({
                        rds_initTime:rds_initTime
                    })
                })
                Taro.showToast({
                    title:'加载中',
                    icon:'loading',
                    duration: 2000
                })
            }
        })
    }


    onTimeUpdate = (e) => {
        this.ts++;
        var that = this 

        const {course_id,chapterId,cchapterId,networkType,mediaId,courseName} = that.state

        var nowTime = parseInt(e.detail.currentTime).toFixed(0);
        that.setState({
            now_time:nowTime,
        })

        function extend(target, source) { 
            for (var obj in source) {
                target[obj] = source[obj];
            } return target;
        }  

        //判断网络情况
        if(!networkType){
            Taro.getNetworkType({
                success:(res)=>{
                    var networkType = res.networkType

                    if(networkType !== 'wifi'){
                        Taro.showToast({
                            title:'流量观看中',
                            icon:'none',
                            duration:2000
                        })
                        that.setState({
                            networkType:true
                        })
                    }
                }
            })
        }


        if(this.ts % 12 == 0 ){
            
            const rd_mediaId = {mediaId:mediaId}
            const rd_duration = {duration:parseInt(e.detail.currentTime).toFixed(0)}
            const rd_course  = extend(rd_mediaId,rd_duration);
            this._getCourseRecord(rd_course)

            let  learnTime = (this.ts / 4).toFixed(0);

            api.post(inter.LearnCourse+course_id,{
                course_id:course_id,
                course_name:courseName,
                chapter_id:0,
                cchapter_id:0,
                duration:learnTime
            }).then((res)=>{
                // console.log(res)
            })
        }
    }

    _getCourseRecord(rd_course:any){

        const {play} = this.state;
        if (!play) return;

        let record = Taro.getStorageSync("courseRd");

        if (record == '') {
            record = {};
        }

        const rd_mediaId = rd_course.mediaId;


        record[rd_mediaId] = parseInt(rd_course.duration);

        Taro.setStorageSync('courseRd', record)

    }

    onEnded(e) {

    }

    onPlay(e) {
        this.setState({
            play: true
        })
    }

    onPause(e) {
        this.setState({
            play: false
        })
    }

    render () {
        if (!this.state.load) return null;

        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }  catch (e) {
            
        }

        const {content,courseImg,courseName,chapter,hit,videom38u,rds_initTime} = this.state

        return (
            <View className='wrap'>
               <Video
                    src={videom38u}
                    poster={courseImg}
                    className='video'
                    style={{width:'100%',height:(windowWidth * 0.56).toFixed(0) + 'px',display:'flex',justifyContent:'center'}}
                    autoplay
                    initialTime ={rds_initTime}
                    id='video'
                    loop={false}
                    muted={false}
                    onEnded={this.onEnded}
                    onPlay={this.onPlay}
                    onPause={this.onPause}
                    onTimeUpdate={this.onTimeUpdate}
                    autoPauseIfNavigate={true}
                />
                <View className='d_flex fd_c pl_15 pr_15 mt_20'>
                    <Text className='lg20_label c33_label fw_label'>{courseName}</Text>
                    <Text className='gray_label sm_label mt_5'>共1讲  {hit}</Text>
                </View>

                <View className='pl_15 pr_15'>
                    <View className='pb_15 pt_10 d_flex fd_c '>
                        <Text className='lg18_label c33_label fw_label'>课程简介</Text>
                        <Text className='default_label lh20_label pt_10 gray_label'>{content}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

export default learnDesc as ComponentClass