import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text,Progress ,Image} from '@tarojs/components'

import Tabs from '../../../components/Tabs'

import menu from '../../../config/menu'
import { connect } from '@tarojs/redux'
import { usersType } from '../../../constants/usersType'

import { getLearnCourse} from '../../../actions/user'


import {subTxt,percent2percent25} from '../../../utils/common'

import  '../../../config/theme.css';
import './studyRecord.less'

type PageStateProps = {
    user:usersType,
}


type PageDispatchProps = {
    getLearnCourse:(object)=>any
}

type PageOwnProps = {}

type PageState = {
    status:number,
    page:number,
    pages:number,
    total:number,
    record:Array<{
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
        study:{
            courseId: number,
            currentChapter: any,
            duration: number,
            integral: number,
            status: number,
            totalChapter: any,
            updateTime: number,
            userId: number,
            updateTimeFt:string
        },
        isSeries:number
    }>,
    loadding:boolean
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface StudyRecord {
    props: IProps;
}

@connect(({user})=>({
    user:user
}),(dispatch)=>({
    getLearnCourse(object){
        dispatch(getLearnCourse(object))
    }
}))



class StudyRecord extends Component<PageDispatchProps & PageStateProps, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '学习记录',
        enablePullDownRefresh: true
    }
    itemtype: any

    constructor () {
        super(...arguments)

        this.itemtype = null;
        this.state = {
            status:0,
            page:0,
            pages:0,
            total:0,
            record:[],
            loadding:false
        }
    }

    componentWillReceiveProps (nextProps) {
        const {user} = nextProps
        const {learnCourse} = user
        const {record} = this.state
        if (user !== this.props.user) {
            var fList:any= record.concat(learnCourse.items)

            
            this.setState({
                page:learnCourse.page ,
                pages:learnCourse.pages,
                total:learnCourse.total,
                record:fList
            })
            this.itemtype = [];
        }
        
    }

    componentWillMount () { }

    componentDidMount () { 
        this.getLearnCourse()
    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    getLearnCourse(){
        var that = this 
        const {status,page} = that.state
        this.props.getLearnCourse({
            status:status,
            page:0
        })
    }

    _onSelect = (index) =>{
        var that = this 
        const {page} = that.state
        that.setState({
            page:0,
            status:index,
            record:[]
        },()=>{
            this.props.getLearnCourse({
                status:index,
                page:0
            })
        })
        
    }

    //下拉
    onPullDownRefresh(){
        var self = this

        this.itemtype = null

        self.setState({
            page:0,
            record:[]
        },()=>{
            self.getLearnCourse();
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }

    onReachBottom(){
        var self = this;
        
        let {page,pages,status} = this.state

        if(page < pages){
            self.props.getLearnCourse({
                status:status,
                page:page+1,
            })
        } else {
            self.setState({
                loadding:true
            })
        }
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
            Taro.navigateTo({url:menu.audioDesc +'?course_id='+ recom.courseId+ '&audioName=' + percent2percent25(recom.courseName)  })
        } else if(recom.ctype === 18){
            Taro.navigateTo({url: menu.learnDesc + '?courseId=' +  recom.courseId + '&courseName=' + percent2percent25(`${recom.courseName}`)})
        }
    }

    render () {
        const {status,record,loadding} = this.state
                      
        return (
            <View className='recordwrap'>
                <View className='headbox'>
                    <View className='atabs pl_30 pr_30'>
                        <Tabs items={['在学课程', '已学课程']}  selected={status} onSelect={this._onSelect}/>
                    </View>
                </View>
                
                <View className='recordcons'>
                    {
                        record.length > 0 ? 
                        record.map((item,index)=>{
                            return(
                                <View key={'stu'+index} className='c_item d_flex pb_15 pt_15' onClick={this._oncourseDesc.bind(this,item)} >
                                    <View className='c_item_cover'>
                                        <Image src={item.courseImg} className='c_item_img_cover' />
                                        {
                                            item.isSeries == 1 ?
                                            <View className='c_item_title d_flex fd_r ai_ct jc_ct'>
                                                <Text className='sm_label white_label'>系列课({item.study.currentChapter}/{item.study.totalChapter})</Text>
                                            </View>
                                        :null}
                                        
                                    </View>
                                    <View className='d_flex fd_c jc_sb ml_10 col_1 '>
                                        <View className="item_text">
                                            <Text className='default_label c33_label fw_label fw_label'>{subTxt(item.courseName)}</Text>
                                        </View>
                                        <View >
                                            <View className='d_flex fd_r jc_sb mb_5'>
                                                <Text className='sm_label c33_label fw_label'>{item.study.updateTimeFt}</Text>
                                                {
                                                    status == 0 ?
                                                    <Text className='sm_label tip_label'>在学{item.study.progress}%</Text>
                                                :
                                                    <Text className='sm_label tip_label'>已学完</Text>
                                                }
                                                
                                            </View>
                                            <Progress percent={status == 0 ? item.study.progress : 100}
                                                strokeWidth={3} 
                                                active 
                                                backgroundColor='#FFDFDE' 
                                                activeColor='#FF5047' 
                                            />
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                        :
                        <View>
                            {
                                this.itemtype === [] ?
                                <Image mode='aspectFit' className='empty_img' src='https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/9rh83qwi1599641528386.png'/>
                            :null}
                        </View>
                        
                    }
                    {
                        loadding == true ?
                            <View className='loaddata d_flex ai_ct jc_ct bg_white pt_10 pb_10'>
                                <Text className='sm_label tip_label'>没有更多数据了</Text>
                            </View>
                        :null}
                </View>
                
            </View>
        )
    }
}


export default StudyRecord as ComponentClass