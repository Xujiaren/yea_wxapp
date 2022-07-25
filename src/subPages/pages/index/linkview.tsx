import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text,WebView } from '@tarojs/components'

import menu from '../../../config/menu';

import inter from '../../../config/inter'
import api from '../../../services/api'

type PageState = {
    link:string,
    msg:any,
    userId:number,
}

class linkview extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '广告'
    }

    constructor () {
        super(...arguments)
        this.state = {
            link:'',
            msg:{},
            userId:0,
        }
    }

    componentWillMount () {
        const {link,msg} = this.$router.params
        this.setState({
            link:decodeURIComponent(link),
            msg:decodeURIComponent(msg)
        })
    }

    componentDidMount () { 
        var that = this;
        that.getUser();
    }

    componentWillUnmount () {
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
        const {link,userId,msg} = this.state

        api.post(inter.userLog,{
            log_type:1,
            type:1,
            device_id:0,
            intro:'分享广告详情页',
            content_id:0,
            param:JSON.stringify({name:'',cctype:8,ttype:0}),
            from:0,
        }).then((res)=>{
            console.log('ee')
        })
        
        if (res.from === 'button') {
            // 来自页面内转发按钮
        }
        return{
            title:msg.title,
            path:menu.linkview +'?link='+ encodeURIComponent(`${link}`)+ '&msg=' + encodeURIComponent(`${JSON.stringify(msg)}`)
        }
    }
    
    render () {
        const {link} = this.state
        return (
            <View >
                <WebView src={link}></WebView>
            </View>
        )
    }
}

export default linkview as ComponentClass