/**
 * @wang
 */
import { ComponentClass } from 'react'
import Taro, { Component ,Config,} from '@tarojs/taro'
import { View, Text ,Image} from '@tarojs/components'

import { connect } from '@tarojs/redux'
import { homeType } from '../../../../constants/homeType'

import {
    getConfigCateNewCert
} from '../../../../actions/home'


import menu from '../../../../config/menu'
import api from '../../../../services/api'
import inter from '../../../../config/inter'

import {subNumTxt} from '../../../../utils/common'

import  '../../../../config/theme.css';
import './topicSort.less'

type PageStateProps ={
    home: homeType,
    catecert:Array<{}>
}


type PageDispatchProps = {
    getConfigCateNewCert:(object)=> any
}

type PageOwnProps = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface TopicSort {
  props: IProps;
}

type PageState = {
    cateCert:Array<{
        categoryId: number,
        categoryName: string,
        child: Array<any>
        ctype: number,
        isDelete: number,
        sortOrder: number,
        status: number,
        link:string,
        isMust:number
    }>,
    vedioStatus:boolean,
    exerciseStatus:boolean,
    squadId:number,
    examTitle:string,
    examImg:string,
}

@connect(({ home }) => ({
    home:home
  }), (dispatch) => ({
    getConfigCateNewCert(object){
        dispatch(getConfigCateNewCert(object))
    },
}))


class TopicSort extends Component<{}, PageState>  {
    
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '题目分类',
        navigationBarBackgroundColor:'#ffffff',
        enablePullDownRefresh: true,
        backgroundColor:'#FAFAFA'
    }

    constructor () {
        super(...arguments)
        this.state = {
            cateCert:[],
            exerciseStatus:false,
            vedioStatus:false,
            squadId:0,
            examTitle:'',
            examImg:'',
        }
        
    }


    componentWillReceiveProps (nextProps) {
        const {home} = nextProps
        const {cateNewCert} = home

        this.setState({
            cateCert:cateNewCert
        })
    }

    componentWillMount () {
        var that = this 
        const {squadId,examTitle,examImg} = that.$router.params

        that.setState({
            squadId: parseInt(squadId),
            examTitle:examTitle,
            examImg:examImg
        })
    }

    componentDidMount () {
        var that = this
        const {squadId} = that.state

        that.props.getConfigCateNewCert({
            squadId:squadId,
            ctype:96 // 18 课程分类  96题目分类
        })

        
        
    }

    componentWillUnmount () {}
    componentDidShow () {
        var that = this;
        that._studyStatus()
    }
    componentDidHide () {}


    // 资格认证状态
    _studyStatus(){
        var that = this 
        const {squadId} = that.state

        api.get(inter.studyStatus,{
            squadId	: squadId
        }).then((res)=>{

            let studyData = res.data.data

            if(!studyData.vedioStatus){
                Taro.showToast({
                    title:'请先完成视频必修课程学习',
                    icon:'none',
                    duration:3000
                })
            }

            that.setState({
                vedioStatus:studyData.vedioStatus,
                exerciseStatus:studyData.exerciseStatus
            })
        })
    }


    // 
    _toTopic(categoryId){
        var that = this 
        const {vedioStatus,exerciseStatus,examTitle,examImg} = that.state

        let test_id = 0 

        if(!exerciseStatus){
            test_id = -1
        }

        if(vedioStatus){
            Taro.navigateTo({
                url:menu.doingTopic + '?categoryId=' + categoryId  + '&test_id=' + test_id + '&examTitle=' + examTitle + '&examImg=' + examImg
            })
        } else {
            Taro.showToast({
                title:'请先完成视频必修课程学习',
                icon:'none',
                duration:1000
            })
        }

    }
    
    onPullDownRefresh(){
        var that = this
        const {squadId} = that.state
        Taro.showNavigationBarLoading()
        this.props.getConfigCateNewCert({
            squadId:squadId,
            ctype:96 // 18 课程分类  96题目分类
        })
        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }


    render () {
        const {cateCert} = this.state


        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }  catch (e) {
            
        }

        let chooseExam:Array<any> = [];
        let mustExam:Array<any> = [];

        cateCert.map((cate,index)=>{
            if(cate.isMust === 0){
                chooseExam.push(cateCert[index])
            } else {
                mustExam.push(cateCert[index])
            }
        })


        return (
            <View className='root d_flex fd_c jc_ct'>
                <View style={{width:(windowWidth*0.84).toFixed(0) + 'px',marginLeft:(windowWidth*0.08).toFixed(0) + 'px'}}>  
                    <View className='block_wrap'>
                        <View className='title'>
                            <Text>必考</Text><Text className='title_sub'>({mustExam.length})</Text>
                        </View>
                        <View className='flex_item_wrap'>
                            {
                                mustExam.map((cate,index)=>{
                                    return(
                                        <View className='item' key={'cate' + index }
                                            onClick = {this._toTopic.bind(this,cate.categoryId)}
                                        >
                                            <Image className='item_icon' src={cate.link} />
                                            <Text className='black_label default_label'>{subNumTxt(cate.categoryName ,26)}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                    <View className='block_wrap'>
                        <View className='title'>
                            <Text>选考</Text><Text className='title_sub'>({chooseExam.length})</Text>
                        </View>
                        <View className='flex_item_wrap'>
                            {
                                chooseExam.map((cate,index)=>{
                                    return(
                                        <View className='item' key={'cate' + index }
                                            onClick = {this._toTopic.bind(this,cate.categoryId)}
                                        >
                                            <Image className='item_icon' src={cate.link} />
                                            <Text className='black_label default_label'>{subNumTxt(cate.categoryName ,26)}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
                

                
            </View>
        )
    }
}

export default TopicSort as ComponentClass
