import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image} from '@tarojs/components'

import menu from '../../../../config/menu';
import asset from '../../../../config/asset';

import inter from '../../../../config/inter'
import api from '../../../../services/api'
import  '../../../../config/theme.css';
import './hasCourse.less'



type PageState = {
    courses:{
        beginTime: number,
        beginTimeFt: string,
        canApply: boolean
        content: string,
        endTime: number,
        endTimeFt: string,
        enrollNum: number,
        isVolunteer: number,
        link: string,
        location: string,
        pubTime: number,
        pubTimeFt: string,
        registeryNum: number,
        squadId: number,
        squadImg: string,
        squadName: string,
        status: number,
        summary: string,
    },
    p_value:number,
    p_type:boolean,
    squadId:number,
    page:number,
}

class hasCourse extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '已报班级'
    }

    constructor () {
        super(...arguments)
        this.state = {
            courses:{},
            p_value:0, // 进度条
            p_type:false, // 是否显示
            squadId:0,
            page:0
        }
    }

    componentWillMount () {
        var that = this
        const {squadId,page} = this.$router.params

        that.setState({
            squadId:parseInt(squadId),
            page:parseInt(page)
        })

    }

    componentDidMount () { 
        var that = this ;
        that._getO2o();
    }

    componentWillUnmount () {

    }
    
    componentDidShow () { }
    componentDidHide () { }


     // 线下报名
     _getO2o(){
        var that = this ;
        const {page,squadId} = that.state;

        api.get(inter.o2olist,{
            stype:3,
            page:page
        }).then((res)=>{
            if(res.data.status){
                let courseList = res.data.data.items
                courseList.map((item,index)=>{
                    if(item.squadId === squadId){
                        that.setState({
                            courses:courseList[index]
                        })
                    }
                })

            }
        })
    }

    // 下载文件
    _downFile(){
        var that = this ;

        const {courses} = that.state

        that.setState({
            p_value:0,
            p_type:true
        })

        var link_list =  courses.link.split(',')

        for(let i = 0 ; i < link_list.length ; i++){
            that._download(link_list[i]);
        }

    }

    // 下载 图片
    _download = (info) => {
        console.log('i')
        var that = this; 

        const DownloadTask =  Taro.downloadFile({
            header: {
                'Accept-Encoding': 'chunked',
            },
            url:info,
            success:function(res){
                const tempFilePath = res.tempFilePath;
                if (res.statusCode === 200) {
                    Taro.saveImageToPhotosAlbum({
                        filePath:tempFilePath
                    }).then((res)=>{
                        if(res.errMsg === 'saveImageToPhotosAlbum:ok'){
                            Taro.showToast({
                                title:'已保存到本地图库'
                            })
                        }
                    })
                }
            }
        })

        DownloadTask.progress((res)=>{

            that.setState({
                p_value:res.progress
            })

            if(res.progress === 100){
                that.setState({
                    p_type:false
                })
            }
        })

    }
    
    render () {
        const {courses,p_value,p_type} = this.state

        return (
            <View className='wrap'>
                <View className='courses'>
                    <View  className='course d_flex fd_r ai_ct mt_20'>
                        <View className='d_flex fd_c col_1'>
                            <Text className='lg_label c33_label mb_15 fw_label'>{courses.squadName}</Text>
                            <View className='d_flex fd_r mb_15'>
                                <Text  className='default_label c33_label'>班级人数：{courses.enrollNum}</Text>
                                <Text  className='default_label c33_label pl_10'>已报名：{courses.registeryNum}</Text>
                            </View>
                            <Text className='default_label gray_label mb_5'>上课时间：{courses.endTimeFt}</Text>
                            <Text className='default_label gray_label'>上课地点：{courses.location}</Text>
                        </View>
                    </View>
                </View>

                <View className='submit' onClick={this._downFile}>
                    <Text className='white_label default_label'>下载培训通知</Text>
                </View>
                
                {
                    p_type ? 

                    <View className='layer'>
                        <View className='layerBox'>
                            <Text className='white_label default_label'>请稍等{p_value}%</Text>
                        </View>
                    </View>

                :null}
                
            </View>
        )
    }
}

export default hasCourse as ComponentClass