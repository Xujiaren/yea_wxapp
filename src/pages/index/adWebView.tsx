import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View,WebView } from '@tarojs/components'

import menus from '../../config/menu';

// import './actRule.less'
import inter from '../../config/inter'
import api from '../../services/api'

type PageState = {
    link:string,
    ad:any,
    userId:number,
}

class AdWebView extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: ''
    }

    constructor () {
        super(...arguments)
        this.state = {
            link:'',
            ad:{},
            userId:0,
        }
    }

    componentWillMount () {
       

        const that = this 
        const {fromuser,scene,mail,link,ad} = that.$router.params;

        that.setState({
            link:link,
            ad: ad == undefined ? {} : JSON.parse(ad)
        })

        if (scene) {
            const fuser = decodeURIComponent(scene).split('=');
            if (fuser.length > 1) {
                Taro.setStorageSync('fuser', fuser[1]);
            }
        }
        if (fromuser) {
            Taro.setStorageSync('fuser', fromuser);
        }

        if(parseInt(mail) === 1){
            Taro.setNavigationBarTitle({
                title: '商城',
            })
        }
    }

    componentDidMount () { 
        var that = this;
        that.getUser();
    }

    componentWillUnmount () {
        const that = this 
        const {fromuser,scene,mail} = that.$router.params;
        if (scene) {
            const fuser = decodeURIComponent(scene).split('=');
            if (fuser.length > 1) {
                Taro.setStorageSync('fuser', fuser[1]);
            }
        }
        if (fromuser) {
            Taro.setStorageSync('fuser', fromuser);
        }

        if(parseInt(mail) === 1){
            Taro.setNavigationBarTitle({
                title: '商城',
            })
        }
    }
    
    componentDidShow () { }
    componentDidHide () { }

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

    //分享课程
    onShareAppMessage = (res) =>{
        const {ad,userId,link} = this.state
        api.post(inter.userLog,{
            log_type:1,
            type:1,
            device_id:0,
            intro:'分享广告详情页',
            content_id:0,
            param:JSON.stringify({name:ad.billboardName,cctype:8,ttype:0}),
            from:0,
        }).then((res)=>{
            console.log('ee')
        })

        if (res.from === 'button') {
            // 来自页面内转发按钮
        }
        
        return{
            title:ad.billboardName,
            path:menus.adWebView  +'?link='+`${link}` + '&ad=' + `${JSON.stringify(ad)}`+'&fromuser=' + userId,
            imageUrl:ad.fileUrl
        }
    }
    
    render () {
        const {link} = this.state

        return (
            <View  style={{paddingLeft:50+'rpx',paddingRight:50+ 'rpx' ,paddingTop:50+'rpx'}}>
                <WebView src={link}></WebView>
            </View>
        )
    }
}

export default AdWebView as ComponentClass