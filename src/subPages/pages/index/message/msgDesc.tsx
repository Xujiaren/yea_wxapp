import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image} from '@tarojs/components'

import menu from '../../../../config/menu';

import  '../../../../config/theme.css';
import './msgDesc.less';

import inter from '../../../../config/inter'
import api from '../../../../services/api'

type PageState = {
    msg:{
        content:string,
        etype:number,
        pubTime:number,
        remindId:number,
        status:number,
        title:string,
        userId:number,
        pubTimeFt:string,
        link:string,
        messageImg:string,
        url:string,
    },
    typeImg:number,
}

class MsgDesc extends Component<{}, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '消息详情'
    }

    constructor () {
        super(...arguments)
        this.state = {
            msg:{
                content:'',
                etype:0,
                pubTime:0,
                remindId:0,
                status:0,
                title:'',
                userId:0,
                pubTimeFt:'',
                link:'',
                messageImg:'',
                url:'',
            },
            typeImg:0
        }
    }

    componentWillMount () { 
        const {msg,typeImg} = this.$router.params;

        let msg_obj =  JSON.parse(decodeURIComponent(msg)) ;
        
        this.setState({
            msg:msg_obj,
            typeImg: typeImg !== undefined ?  parseInt(typeImg) :0
        })
    }

    componentDidMount () { }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    // 跳转链接
    _onLink(msg){
        let messageId=0
        let remindId=0
        if(msg.messageId){
            messageId=msg.messageId
        }
        if(msg.remindId){
            remindId=msg.remindId
        }
        api.post('/user/message/save/jump',{
            messageId:messageId,
            remindId:remindId
        }).then(res=>{})
        let adlink = msg.link
        if(adlink !== ''){
            if(adlink.substring(0,4) == 'http'){
                Taro.navigateTo({
                    url:menu.linkview+'?link='+ encodeURIComponent(`${msg.link}`) + '&msg=' + encodeURIComponent(`${JSON.stringify(msg)}`)
                })
            } else {
                Taro.navigateTo({
                    url:adlink
                })
            }
        }
    }

    _actions = (type) => {
        var that = this ;
        const {msg} = that.state ;

        let url = msg.url.length > 0 ?  JSON.parse(msg.url) : '';

        console.log(url,'url')
        
        if(type === 2){

            api.post(inter.MessageAgree + msg.remindId,{
                agree:type
            }).then((res)=>{
                if(res.data.status){
                    Taro.showToast({
                        title:'已拒绝',
                        icon:'none',
                        duration:1000,
                    })

                    setTimeout(() => {
                        Taro.navigateBack();
                    }, 1000);
                }
            })

        } else if(type === 1){


            api.post(inter.MessageAgree + msg.remindId,{
                agree:type
            }).then((res)=>{
                if(res.data.status){
                    Taro.showToast({
                        title:'已接受',
                        icon:'none',
                        duration:1000,
                    })

                    setTimeout(() => {
                        Taro.navigateTo({url:menu.question + '?askId=' + url.askId})
                    }, 1000);
                }
            })

            

        }
    }
    onUrl=(msg)=>{
        if(msg.url==='/comPages/pages/user/readyLottery'){
            api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    let userData = res.data.data
                    if(userData.lottery>0){
                        Taro.navigateTo({url:msg.url})
                    }else{
                        Taro.showModal({
                            title: '提示',
                            content: '抽奖次数不足',
                        })
                    }
                } 
            })
        }else{
            Taro.navigateTo({url:msg.url})
        }
    }
    render () {
        const {msg,typeImg} = this.state;


        return (
            <View className='msgDesc'>
                <View className='d_flex fd_c pt_15'>
                    <Text className='lg_label fw_label black_label'>{msg.title}</Text>
                    <Text className='sm_label tip_label pt_5'>{msg.pubTimeFt}</Text>
                </View>
                <View className='msg_txt pt_15 pb_30 d_flex fd_c'>
                    <Text className='default_label lh16_label gray_label '>{msg.content}</Text>
                    <Text className='default_label lh16_label  ' style={{color:'#1a0dab',textDecorationLine:'underline'}} 
                        onClick={this._onLink.bind(this,msg)}
                    >{msg.link}</Text>
                    {/* {
                        typeImg === 1 ?
                        <Image src={msg.messageImg} mode='widthFix' className='messageImg'  style={{width:'100%',marginTop:'20rpx'}} />
                    :null} */}
                </View>
                {
                    msg.url&&msg.url.substring(0,1) == '/' ?
                    <View className='d_flex fd_r jc_ct mt_20'
                        onClick={this.onUrl.bind(this,msg)}
                    >
                        <View className='backBtn'>
                            <Text className='default_label white_label'>参与</Text>
                        </View>
                    </View>
                :null}
                {
                    msg.title === '问题反馈' ?
                    <View className='d_flex fd_r jc_ct mt_20'
                        onClick={()=>Taro.navigateTo({url:menu.feedBack + '?status=1'})}
                    >
                        <View className='backBtn'>
                            <Text className='default_label white_label'>参与</Text>
                        </View>
                    </View>
                :null}



                {
                    msg.etype === 10 ?
                    <View className='d_flex fd_r ai_ct jc_ct'>
                        <View className='d_flex fd_r ai_ct jc_ct rejt_btn' onClick={this._actions.bind(this,2)}>
                            <Text className='tip_label default_label'>拒绝</Text>
                        </View>
                        <View className='d_flex fd_r jc_ct ai_ct accept_btn ml_30' onClick={this._actions.bind(this,1)}>
                            <Text className='sred_label default_label'>接受</Text>
                        </View>
                    </View>
                :null}
                
                
            </View>
        )
    }
}


export default MsgDesc as ComponentClass