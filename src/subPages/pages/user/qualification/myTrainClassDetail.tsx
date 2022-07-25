/**
 * @wang
 */
import { ComponentClass } from 'react'
import Taro, { Component, request ,Config} from '@tarojs/taro'
import { View, Text ,Image} from '@tarojs/components'

import inter from '../../../../config/inter'
import api from '../../../../services/api'
import GrapTmp from '../../../../pages/index/grapTmp'
import Auth from '../../../../components/Auth'

import menu from '../../../../config/menu'
import {dateDiff,formatTimeStampToTime} from '../../../../utils/common'


import  '../../../../config/theme.css';
import './myTrainClassDetail.less'

type PageState = {
    load:boolean,
    is_lock:boolean,
    squadId:number,
    squadName:string,
    userId:number,
    type:number,
    nowdate:number,
    o2odesc:{
        applyBegin: number,
        applyBeginFt: string,
        applyEnd: number,
        applyEndFt: string,
        beginTime: number,
        beginTimeFt: string,
        endTime: number,
        endTimeFt: string,
        pubTime:number,
        canApply: boolean,
        content: string,
        enrollNum: number,
        isVolunteer: number,
        link: string,
        location: string,
        registeryNum: number,
        squadId: number,
        squadImg: string,
        squadName: string,
        status: number,
        summary:string,
        canSign:boolean
    },
    enrollNum:number,
    registeryNum:number,
    stype:number,
    canSign:boolean,
    finish:boolean
}
class myTrainClassDetail extends Component<{}, PageState>  {
    
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '培训班详情',
        navigationBarBackgroundColor:'#FFF',
        enablePullDownRefresh: true,
    }

    constructor () {
        super(...arguments)
        this.state = {
            load:false,
            is_lock:false,
            squadId:0,
            squadName:'',
            o2odesc:{},
            userId:0,
            type:0,
            nowdate:0,
            enrollNum:0,
            registeryNum:0,
            stype:0,
            canSign:false , // 已报名  true 可以报名
            finish:false,
        }
        this._singUp = this._singUp.bind(this);
    }


    componentWillReceiveProps (nextProps) {}
    componentWillMount () {
        const { squadName,squadId,stype} = this.$router.params
        this.setState({
            squadId:parseInt(squadId),
            squadName:squadName,
            stype:parseInt(stype)
        })

        Taro.setNavigationBarTitle({
            title: squadName,
        })
    }
    componentDidMount () {
        var that = this
        that.getUser();
    }

    componentWillUnmount () {}
    componentDidShow () {
        var that = this;
        that.geto2oDesc();
    }
    componentDidHide () {}
    
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

    geto2oDesc(){
        var that = this ;
        const {squadId} = that.state;
        var nowTime = (new Date()).getTime();

        api.get(inter.o2oDesc + squadId)
        .then((res)=>{
            if(res.data.status){
                let o2odesc = res.data.data
                that.setState({
                    load:true,
                    o2odesc:o2odesc,
                    enrollNum:o2odesc.enrollNum,
                    registeryNum:o2odesc.registeryNum,
                    canSign:o2odesc.canSign,
                    finish:o2odesc.finish
                })

                if(o2odesc.hasFlag){
                    if(o2odesc.beginTime * 1000  >  nowTime){
                        that.setState({
                            type:0
                        })
                    } else if(o2odesc.beginTime * 1000 < nowTime &&  o2odesc.endTime * 1000 > nowTime){
                        if(o2odesc.canApply){
                            that.setState({
                                type:1
                            })
                        } else {
                            that.setState({
                                type:2
                            })
                        }
                    } else if(o2odesc.endTime * 1000 < nowTime){
                        that.setState({
                            type:3
                        })
                    }
                } else {
                    that.setState({
                        type:4
                    })
                }
                if (res.data.message) {
                    if (res.data.message == '您尚未实名认证，请认证后再来！') {
                        Taro.showModal({
                            title: '提示',
                            content: res.data.message,
                            success: function (res) {
                                if (res.confirm) {
                                    Taro.navigateTo({ url: menu.realAuth })
                                } else if (res.cancel) {
                                    Taro.navigateTo({ url: menu.realAuth })
                                }
                            }
                        })
                    } else if (res.data.message == '您不属于本内容的特定开放对象，其他内容同样精彩！') {
                        Taro.showModal({
                            title: '提示',
                            content: res.data.message,
                            success: function (res) {
                                if (res.confirm) {
                                    // Taro.navigateTo({ url: menu.profesSkill })
                                } else if (res.cancel) {
                                    // Taro.navigateTo({ url: menu.profesSkill })
                                }
                            }
                        })
                        setTimeout(() => {
                            Taro.navigateTo({ url: menu.profesSkill })
                        }, 3000);
                    } else if (res.data.message == '请先登录！') {
                        Taro.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 4000,
                        })
                        setTimeout(() => {
                            getApp().globalData.showLogs = 1
                            Taro.switchTab({
                                url: '/pages/user/user'
                            })
                        }, 4000);
                    } else {
                        Taro.showModal({
                            title: '提示',
                            content: res.data.message,
                            success: function (res) {
                                if (res.confirm) {
                                    // Taro.navigateTo({ url: menu.profesSkill })
                                } else if (res.cancel) {
                                    // Taro.navigateTo({ url: menu.profesSkill })
                                }
                            }
                        })
                        setTimeout(() => {
                            Taro.navigateTo({ url: menu.profesSkill })
                        }, 3000);
                    }
                }
                
            }else{
                if(res.data.message=='请先登录！'){
                    Taro.showToast({
                        title:res.data.message,
                        icon:'none',
                        duration:4000,
                    })
                    setTimeout(() => {
                        getApp().globalData.showLogs=1
                        Taro.switchTab({
                            url:'/pages/user/user'
                        })
                    }, 4000);
                }
             }
        })
    }

    _singUp(){
        var that = this;
        const {squadId,userId,enrollNum,registeryNum,stype} = that.state;

        if(userId > 0){
            if(  enrollNum <= registeryNum) {
                Taro.showToast({
                    title:'报名人数已满',
                    icon:'none',
                    duration:1000,
                })
            } else {
                if(stype === 0){
                    Taro.navigateTo({
                        url:menu.myTrainClassSignUp + '?squad_id=' + squadId
                    })
                } else {
                    Taro.navigateTo({
                        url:menu.certificateSignUp + '?squad_id=' + squadId
                    })
                }
                
            }
        } else {
            this.refs.auth.doLogin();
        }
        
    }

    onPullDownRefresh(){
        var that = this;
        that.geto2oDesc();
        Taro.showNavigationBarLoading()
        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }

    _onLoadCallBack(){
        var that = this;
        that.getUser();
    }

    render () {
        if (!this.state.load) return null;
        const {o2odesc,type,finish} = this.state

        return (
            <View className='root'>
                <View className='content_wrap'>
                    <View className='img_wrap'>
                        <Image className='class_img' src={o2odesc.squadImg} />
                    </View>
                    <View className='title'>
                        <Text>{o2odesc.squadName}</Text>
                    </View>
                    <View className='info_wrap'>
                        <Text className='time'>活动时间：{formatTimeStampToTime(o2odesc.beginTime*1000)} - {formatTimeStampToTime(o2odesc.endTime*1000)}</Text>
                        <Text>{dateDiff(o2odesc.pubTime)}</Text>
                    </View>
                    <View className='info_wrap'>
                        <Text>招生人数：{o2odesc.enrollNum}  报名人数：{o2odesc.registeryNum}</Text>
                        {
                            o2odesc.location.length > 0 ?
                            <Text>地点：{o2odesc.location}</Text>
                        :null}
                    </View>
                </View>

                <View className='cons  bg_white pb_50 pl_15 pr_15' style={{paddingBottom:160+'rpx'}}>
                    <GrapTmp content={o2odesc.content} ></GrapTmp>
                </View>
                <View className='btn_wrap'>
                    {
                        type === 0  ?
                        <View className='btn lock' >
                            <Text>未开始</Text>
                        </View>
                    :null}
                    {
                        type === 1 ?
                        <View className='btn' hoverClass='on_btn' onClick={this._singUp}>
                            <Text>立即报名</Text>
                        </View>
                    :null}
                    {
                        type === 2 ?
                        <View>
                            {
                                finish ? 
                                <View className='btn lock'>
                                    <Text>开始学习</Text>
                                </View>
                                :
                                <View className='btn'
                                    onClick={()=> Taro.navigateTo({url:menu.practiceRoom + '?squadId=' + o2odesc.squadId + '&examTitle=' + o2odesc.squadName + '&examImg=' + o2odesc.squadImg })}
                                >
                                    <Text>开始学习</Text>
                                </View>
                            }
                        </View>
                        
                    :null}
                    {
                        type === 3?
                        <View className='btn lock' >
                            <Text>已结束</Text>
                        </View>
                    :null}
                    {
                        type === 4?
                        <View className='btn lock' >
                            <Text>暂无报名权限</Text>
                        </View>
                    :null}
                </View>
                <Auth ref={'auth'} success={() => {
                    this._onLoadCallBack()
                }}/>
            </View>
        )
    }
}

export default myTrainClassDetail as ComponentClass
