import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image} from '@tarojs/components'

import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import  '../../../../config/theme.css';
import './message.less'
import { connect } from '@tarojs/redux'
import { homeType } from '../../../../constants/homeType'
import api from '../../../../services/api'
import inter from '../../../../config/inter'

import {subNumTxt,msgTime} from '../../../../utils/common'

import { 
    getUserMsgUread,
} from '../../../../actions/home'

type PageStateProps = {
    home: homeType,
    getUserMsgUread:object,

}

type PageDispatchProps = {
    getUserMsgUread:()=> any,
    enablePullDownRefresh: true
}

type PageOwnProps = {}

type PageState = {
    message:number,
    remind:number,
    courseRemind:number,
    admin:{
        chatId: number,
        chatType: number,
        ctype: number,
        fromUid: number,
        fromUnread: number,
        lastMsg: string,
        lastUname: string,
        pubTime: number,
        pubTimeFt: string,
        toUid: number,
        toUnread: number,
        updateTime: number,
        updateTimeFt: string,
    },
    remindList:Array<{
        pubTime:number,
        title:string,
    }>,
    courseList:Array<{
        pubTime:number,
        title:string,
    }>,
    newsList:Array<{
        ptime:number,
        title:string,
    }>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Message {
  props: IProps;
}

@connect(({ home }) => ({
    home:home
  }), (dispatch) => ({
      getUserMsgUread(){
          dispatch(getUserMsgUread())
      },
  }))



class Message extends Component<{}, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '消息',
        enablePullDownRefresh: true
    }


    constructor () {
        super(...arguments)
        this.state = {
            message:0,
            remind:0,
            courseRemind:0,
            admin:{},
            remindList:[], // 系统消息
            courseList:[], // 课程消息
            newsList:[],

        }
    }

    componentWillReceiveProps (nextProps) {
        // console.log(this.props, nextProps)
        
        const {home} = this.props
        const {userMsguRead} = home
        
        this.setState({
            message:userMsguRead.message,
            remind:userMsguRead.remind,
            courseRemind:userMsguRead.courseRemind,
        })

    }


    componentWillMount () { }

    componentDidMount () { 
        var that = this
        that.getUserMsgUread()
        that.msgAdmin()
        that._msgRemind()// 系统
        that._msgNews()
        that._msgCourse() // 
    }



    componentWillUnmount () { 
        api.get(inter.MessageUnRead).then(res=>{
            if(!res.data.status){
                console.log('出错')
            }
        })
    }

    componentDidShow () { 
        var that = this ;
        that.getUserMsgUread()
        that.msgAdmin()
    }

    componentDidHide () { }



    // 管理员消息
    msgAdmin(){
        var that = this 

        api.get(inter.MessageAdmin)
        .then((res)=>{
            let admins = res.data.data[0]
            if(admins !== undefined){
                that.setState({
                    admin:admins
                })
            }
        })
    }

    // 课程消息
    _msgCourse(){
        var that = this
        api.get(inter.MessageCourse,{
            page:0
        }).then((res)=>{
            let remind = res.data.data.items

            that.setState({
                courseList:remind
            })
        })
    }


    // 油葱新鲜事消息
    _msgNews(){
        
        var that = this
        api.get(inter.Message,{
            etype:40,
            page:0
        }).then((res)=>{
            let message = res.data.data.items
            that.setState({
                newsList:message
            })
        })
    }

    
    //  系统消息
    _msgRemind(){
        var that = this
        api.get(inter.MessageRemind,{
            page:0
        }).then((res)=>{
            let remind = res.data.data.items
            that.setState({
                remindList:remind
            })
        })
    }


    

    // 未读消息
    getUserMsgUread(){
        var that = this;
        api.get(inter.MessageUnRead)
        .then((res)=>{
            if(res.data.status){
                let unread = res.data.data;
                that.setState({
                    message:unread.message,
                    remind:unread.remind,
                    courseRemind:unread.courseRemind
                })
            }
        })
    }

    // 聊天页面
    _toAdmin(){
        var that = this 
        const {admin} = that.state


        if(Object.keys(admin).length > 0){
            Taro.navigateTo({
                url:menu.msgAdmin + '?chatId=' + admin.chatId
            })
        } else {
            Taro.navigateTo({
                url:menu.msgAdmin + '?chatId=0'
            })
        }
    }


    onPullDownRefresh(){
        var self = this
        self.getUserMsgUread()
        self.msgAdmin()
        self._msgRemind()// 系统
        self._msgNews()
        self._msgCourse() // 
        setTimeout(function () {
            //执行ajax请求后停止下拉
            self.getUserMsgUread()

        }, 1000);
    }

    render () {
        const {message,remind,courseRemind,admin,remindList,courseList,newsList} = this.state

        let isAdmin = Object.keys(admin).length > 0
        let isRemind = false
        let isCourse = false 
        let isNews =false

        if(remindList && remindList.length > 0){
            isRemind = true
        }

        if(courseList && courseList.length > 0){
            isCourse = true
        }

        if(newsList && newsList.length > 0){
            isNews = true
        }


        return (
            <View className='messagehwrap'>

                <View className='d_flex pl_20 pr_20  fd_r jc_sb ai_ct '
                    onClick={()=> Taro.navigateTo({url:menu.remindList+`?type=1&name=${'系统通知'}`})}
                >
                    <View className='msg_item d_flex fd_r ai_ct'>
                        <View className='msg_item_icon'>
                            <Image src={asset.sysIcon}  className='msg_icon' />
                            {
                                remind > 0 ?
                                <View className='msg_count d_flex jc_ct ai_ct'>
                                    <Text className='sm9_label white_label'>{remind}</Text>
                                </View>
                            :null}
                        </View>
                        <View className='d_flex fd_c col_1 ml_15'>
                            <View className='d_flex fd_r ai_ct jc_sb mb_5'>
                                <Text className='c33_label default_label fw_label'>系统通知</Text>
                            <Text className='tip_label smm_label'>{isRemind ? msgTime(remindList[0].pubTime) :''  }</Text>
                            </View>
                            <Text className='sm_label gray_label'>{isRemind ? remindList[0].title : ''}</Text>
                        </View>
                        
                    </View>
                </View>
                <View className='d_flex pl_20 pr_20  fd_r jc_sb ai_ct '
                    onClick={()=> Taro.navigateTo({url:menu.msgCourse+`?type=2&name=${'课程消息'}`})}
                >
                    <View className='msg_item d_flex fd_r ai_ct'>
                        <View className='msg_item_icon'>
                            <Image src={asset.reminIcon}  className='msg_icon' />
                            {
                                courseRemind > 0 ?
                                <View className='msg_count d_flex jc_ct ai_ct'>
                                    <Text className='sm9_label white_label'>{courseRemind}</Text>
                                </View>
                            :null}
                        </View>
                        <View className='d_flex fd_c col_1 ml_15'>
                            <View className='d_flex fd_r ai_ct jc_sb mb_5'>
                                <Text className='c33_label default_label fw_label'>课程消息</Text>
                                <Text className='tip_label smm_label'>{isCourse ? msgTime(courseList[0].pubTime) : '' }</Text>
                            </View>
                            <Text className='sm_label gray_label'>{isCourse ? courseList[0].title : ''}</Text>
                        </View> 
                    </View>
                </View>

                {/* <View className='d_flex pl_20 pr_20  fd_r jc_sb ai_ct '                    
                    onClick={this._toAdmin}
                >
                    <View className='msg_item d_flex fd_r ai_ct'>
                        <View className='msg_item_icon'>
                            <Image src={asset.adminIcon}  className='msg_icon' />
                        </View>
                        <View className='d_flex fd_c col_1 ml_15'>
                            <View className='d_flex fd_r ai_ct jc_sb mb_5'>
                                <Text className='c33_label default_label fw_label'>管理员消息</Text>
                            <Text className='tip_label smm_label'>{isAdmin ? msgTime(admin.updateTime) : ''}</Text>
                            </View>
                            {
                                isAdmin ? 
                                <Text className='sm_label gray_label'>{admin.lastMsg.indexOf('png') > 0  || admin.lastMsg.indexOf('jpeg') > 0 || admin.lastMsg.indexOf('jpg') > 0 ? '图片' :  subNumTxt(admin.lastMsg,18)}</Text>
                                :
                                <Text className='sm_label gray_label'>你好，你的反馈我们已经收到。</Text>
                            }
                        </View>
                    </View>
                </View> */}
                
                <View className='d_flex pl_20 pr_20  fd_r jc_sb ai_ct '
                    onClick={()=> Taro.navigateTo({url:menu.msgList+`?type=0&name=${'油葱新鲜事'}`})}
                >
                    <View className='msg_item d_flex fd_r ai_ct'>
                        <View className='msg_item_icon'>
                            <Image src={asset.newsIcon}  className='msg_icon' />
                            {
                                message > 0 ?
                                <View className='msg_count d_flex jc_ct ai_ct'>
                                    <Text className='sm9_label white_label'>{message}</Text>
                                </View>
                            :null}
                        </View>
                        <View className='d_flex fd_c col_1 ml_15'>
                            <View className='d_flex fd_r ai_ct jc_sb mb_5'>
                                <Text className='c33_label default_label fw_label'>油葱新鲜事</Text>
                                <Text className='tip_label smm_label'>{isNews ? msgTime(newsList[0].ptime) :''  }</Text>
                            </View>
                            <Text className='sm_label gray_label'>{isNews ? newsList[0].title : ''}</Text>
                        </View>
                    </View>
                </View>

            </View>
        )
    }
}

export default Message as ComponentClass