import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Progress,Image} from '@tarojs/components'

import menu from '../../../../config/menu';
import Tabs from '../../../../components/Tabs'

import inter from '../../../../config/inter'
import api from '../../../../services/api'
import  '../../../../config/theme.css';
import './videoLearn.less'


import { connect } from '@tarojs/redux'
import { usersType } from '../../../../constants/usersType'

import { 
    getUserVideoLearn
} from '../../../../actions/user'

import {subTxt} from '../../../../utils/common'

type PageStateProps = {
    user:usersType,
}


type PageDispatchProps = {
    getUserVideoLearn:(object)=>any
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
    loadding:boolean,
    userId:number,
    type:number,
    squadId:number,
}


type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface videoLearn {
    props: IProps;
}

@connect(({user})=>({
    user:user
}),(dispatch)=>({
    getUserVideoLearn(object){
        dispatch(getUserVideoLearn(object))
    }
}))


class videoLearn extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '视频学习',
        enablePullDownRefresh: true,
    }

    constructor () {
        super(...arguments)
        this.state = {
            userId:0,
            status:0,
            page:0,
            pages:0,
            total:0,
            record:[],
            loadding:false,
            type:0,
            squadId:0,
        }
    }

    componentWillReceiveProps (nextProps) {
        const {user} = nextProps
        const {userVideoLearn} = user
        if (user !== this.props.user) {

            this.setState({
                record:userVideoLearn
            })
        }
        
    }

    componentWillMount () {
        var that = this 
        const {squadId} = that.$router.params

        that.setState({
            squadId: parseInt(squadId)
        })
    }

    componentDidMount () { 
        var that = this;
        that.getUser();
        that.getUserVideoLearn();
    }

    componentWillUnmount () {

    }
    
    componentDidShow () {
        var that = this 
        that.getUserVideoLearn();
     }
    componentDidHide () { }

    getUserVideoLearn(){
        var that = this 
        const {status,squadId} = that.state

        let idx = 1

        if(status === 1){
            idx = 0
        } 
        that.props.getUserVideoLearn({
            squadId:squadId,
            type:idx
        })
    }



    getUser(){
        var that = this
        api.get(inter.User)
        .then((res)=>{
            if(res.data.status){
                let userData = res.data.data
                that.setState({
                    userId:userData.userId,
                })
            }
        })
    }

    _onSelect = (index) =>{
        var that = this 
        const {squadId} = that.state

        let idx = 1

        if(index === 1){
            idx = 0
        } 

        that.setState({
            page:0,
            status:index,
            record:[],
            type:idx
        },()=>{
            that.props.getUserVideoLearn({
                squadId:squadId,
                type:idx
            })
        })
        
    }


    onReachBottom(){
        var self = this;
        
        let {page,pages,type,squadId} = this.state

        if(page < pages){
            self.props.getUserVideoLearn({
                squadId:squadId,
                type:type
            })
        } else {
            self.setState({
                loadding:true
            })
        }
    }


    // 课程详情
    _oncourseDesc(item){
        Taro.navigateTo({
            url: menu.learnDesc + '?courseId=' +  item.courseId + '&courseName=' + `${item.courseName}`
        })
    }

    onPullDownRefresh(){
        var that = this;
        that.getUserVideoLearn();
        Taro.showNavigationBarLoading()
        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }

    
    
    render () {

        const {status,record,loadding} = this.state

        return (
           <View className='recordwrap'>
                <View className='headbox'>
                    <View className='atabs pl_30 pr_30'>
                        <Tabs items={['必修课程','选修课程']}  selected={status} onSelect={this._onSelect}/>
                    </View>
                </View>
                
                <View className='recordcons'>

                    {
                        record.map((item,index)=>{
                            return(
                                <View key={'stu'+index} className='c_item d_flex pb_15 pt_15' onClick={this._oncourseDesc.bind(this,item)} >
                                    <View className='c_item_cover'>
                                        <Image src={item.courseImg} className='c_item_img_cover' />
                                    </View>
                                    <View className='d_flex fd_c jc_sb ml_10 col_1 '>
                                        <View className="item_text">
                                            <Text className='default_label c33_label fw_label fw_label'>{subTxt(item.courseName)}</Text>
                                        </View>
                                        <View>
                                            <View className='d_flex fd_r jc_sb mb_5'>
                                                <Text className='sm_label c33_label fw_label'>{item.study.updateTimeFt}</Text>
                                                <Text className='sm_label tip_label'>在学{item.study === null ? 0:  item.study.progress}%</Text>
                                            </View>
                                            <Progress percent={item.study === null ? 0:  item.study.progress }
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

export default videoLearn as ComponentClass