import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { View ,Text, Image} from '@tarojs/components'

import menu from '../../../../config/menu';

import inter from '../../../../config/inter'
import api from '../../../../services/api'

import asset from '../../../../config/asset'


import  '../../../../config/theme.css';
import './zhenZhao.less'
import GrapTmp from '../GrapTmp'
type PageState = {
    unioinId:number,
    userId,
    content:string,
}

class zhenZhao extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '证照信息',
        navigationBarBackgroundColor:'#FFF',
    }

    constructor () {
        super(...arguments)
        this.state = {
            unioinId:0,
            userId:0,
            content:''
        }
    }

    componentWillMount () {
    }

    componentDidMount () { 
        var that = this;
        that.getUser();
        that.getZhen()
    }

    componentWillUnmount () {

    }
    
    componentDidShow () { }
    componentDidHide () { }

    getUser(){
        var that = this
        api.get(inter.User)
        .then((res)=>{
            console.log(res)
            if(res.data.status){
                let userData = res.data.data
                that.setState({
                    userId:userData.userId,
                    unioinId:userData.unionId
                })
            }
        })
    }
    getZhen=()=>{
        api.get('/article/system/img')
        .then(res=>{
            console.log(res)
            if(res.data.status){
                this.setState({
                    content:res.data.data.content
                })
            }
        })
    }
    // onOpen=()=>{
    //     const{content}=this.state
    //     let list = []
    //     list = list.concat(img)
    //     Taro.previewImage({
    //         current: img, // 当前显示图片的http链接
    //         urls: list // 需要预览的图片http链接列表
    //       })
    // }
    render () {
        const{content}=this.state
        return (
            <View className='box'>
                <View style={{padding:'30rpx'}}>
                    <GrapTmp content={content} ></GrapTmp>
                </View>
            </View>
        )
    }
}

export default zhenZhao as ComponentClass