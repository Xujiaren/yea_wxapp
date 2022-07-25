import { ComponentClass } from 'react'
import Taro, { Component,getApp } from '@tarojs/taro'
import { View ,Text,Image,Video,CoverView} from '@tarojs/components'


import GrapTmp from '../../../pages/index/grapTmp'

import Auth from '../../../components/Auth'
import Eval from '../../../components/Eval'
import Scratch from '../../components/Scratch/Scratch'
import Comt from '../../../components/General/Comt'


import menu from '../../../config/menu';
import asset from '../../../config/asset';
import inter from '../../../config/inter'

import api from '../../../services/api'

import {formatTimeStampToTime  ,percent2percent25,subNumTxt} from '../../../utils/common'

import  '../../../config/theme.css';
import './activityDesc.less'

type PageState = {
    load:boolean,
    userId:number,
    answer_list:any,
    activityId:number,
    articleName:string,
    gallery:Array<{
        contentId: number,
        ctype: number,
        fpath: string,
        ftype: number,
        galleryId: number,
        link: string,
        status: number,
    }>,
    like:boolean,
    collect:number,
    isCollect:boolean,
    isFollow:boolean,
    mediaId:string,
    follow:number,
    num:number,
    artDesc:{
        activityId: number,
        activityImg: string,
        atype: number,
        beginTime: number,
        beginTimeFt: string,
        content: string,
        contentId: number,
        ctype: number,
        endTime: number,
        endTimeFt: string,
        flag: string,
        follow: number,
        hit: number,
        integral: number,
        isDelete: number,
        num: number,
        pubTime: number,
        pubTimeFt: string,
        rule: string,
        signendTime: number,
        signendTimeFt: string,
        status: number,
        title: string,
        voteendTime: number,
        voteendTimeFt: string,
        topicDTO:any,
        isApply:boolean,
        isFinish:boolean,
        showVote:number, // 0 不显示
    },
    topComms:Array<{
        avatar:string,
        childList:Array<{}>,
        commentId:number,
        content:string,
        contentId:number,
        ctype:string,
        galleryList:Array<{}>,
        isAdmin:number,
        parentId:number,
        praise:number,
        pubIp:string,
        pubTime:number,
        pubTimeFt:string,
        score:number,
        userId:number,
        username:string ,
        like:boolean
    }>,

    videoCover:string,
    videoDuration:number,
    videom38u:string,

    atype: number, //
    ctype: number,
    status: number,
    nowdate:number,

    beginTime:number,
    signendTime:number,
    voteendTime:number,
    endTime:number,
    activiType:number,
    autoType : number,

    voteList:Array<{
        activityId: number,
        joinId: number,
        avatar:string,
        isVote:number,
        mobile: string,
        number: number,
        pubIp: string,
        pubTime: number,
        username: string,
        workIntro: string,
        workName: string,
        workUrl: string,
        galleryList:Array<{
            fpath:string
        }>
    }>,
    topicDTO:{
        canVote:boolean,
        optionList:Array<{
            num: number,
            optionId: number,
            optionLabel: string,
            optionType: number,
            topicId: number
        }>
    },
    P_m38u:string,
    videoType:boolean,
    isApply:boolean,
    isShow:boolean,
    isBack:number,
    canApply:boolean,

    showVote:number,
    etype:number,

    ztype:number,
    rule:string,
}

class activityDesc extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '活动详情',
        enablePullDownRefresh: true,
    }

    constructor () {
        super(...arguments)
        this.state = {
            canApply:false,
            load:false,
            userId:0,
            activityId:0,
            answer_list:{},
            articleName:'',
            artDesc:{},
            gallery:[],
            collect:0,
            like:false,
            isCollect:false,
            isFollow:false,
            follow:0,
            mediaId:'',
            videoCover:'',
            videoDuration:0,
            videom38u:'',
            topComms:[],
            num:0,
            atype: 0,  // 0 无活动类型  2 主题活动 3 投票 4 问卷 9 线下活动
            ctype:0,   //  {atype = 2 >   16 视频  17 图片} {}
            status:0 ,  // 1 未开始 2 进行中 3 已结束
            nowdate:0,
            activiType:0 , // 0 未开始 马上参加不显示 1 马上参加发布作品  2 进行中 展示投票 投票  3 投票时间截止展示排名 
            autoType:0, // 自主投票  0 未开始 1 进行中 2 已结束
            voteList:[], //  投票
            topicDTO:{},
            P_m38u:'',
            videoType:false,
            isApply:false , //true 参加 false 未参加  
            isShow:false, // 是否显示刮刮卡 
            isBack:0, // 0 本页面 1 上一个页面 
            showVote:0 , // 0 不显示 1 显示
            etype:20, // 14/点赞  20/投票

            ztype:0,
            rule:'',
        }
        this._parse = this._parse.bind(this);
        this.onShareAppMessage = this.onShareAppMessage.bind(this);
        this._toSignUp = this._toSignUp.bind(this);
        this._toVote = this._toVote.bind(this);
    }

    componentWillMount () {
        var that = this
        const {activityId,articleName,fromuser,scene,atype} = that.$router.params
        var nowTime = new Date();

        that.setState({
            activityId:parseInt(activityId),
            articleName:articleName,
            atype:parseInt(atype),
            nowdate:nowTime.getTime()
        })

        Taro.setNavigationBarTitle({
            title: articleName,
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
    }

    componentDidMount () { 
        var that = this;
        that.getUser();
        that._getArtDesc();
    }

    componentWillUnmount () {

    }
    
    componentDidShow () {
        var that = this ;
        that._actInfo();
        that._siteComments();
    }


    componentDidHide () { }


    // 获取活动详情
    _getArtDesc(){
        var that = this;
        const {activityId,nowdate} = that.state

        var nowTime = new Date();
        let newtime = nowTime.getTime();


        api.get(inter.ActivityDesc + activityId)
            .then((res)=>{
                if(res.data.status){
                    let artdesc = res.data.data
                    // console.log(artdesc)
                    if(artdesc.canShare==0){
                        Taro.hideShareMenu()
                    }else{
                        wx.showShareMenu({

                            withShareTicket: true,
                
                            menus: ['shareAppMessage', 'shareTimeline']
                        })
                    }
                    that.setState({
                        load:true,
                        artDesc:artdesc,
                        gallery:artdesc.gallery,
                        like:artdesc.like,
                        collect:artdesc.collect,
                        isCollect:artdesc.isCollect,
                        isFollow:artdesc.isFollow,
                        follow:artdesc.follow,
                        num:artdesc.num,
                        atype: artdesc.atype, //
                        ctype: artdesc.ctype,
                        status: artdesc.status,
                        // mediaId:artdesc.mediaId,
                        beginTime:artdesc.beginTime,
                        signendTime:artdesc.signendTime,
                        voteendTime:artdesc.voteendTime,
                        endTime:artdesc.endTime,
                        topicDTO:artdesc.topicDTO,
                        isApply:artdesc.isApply,
                        canApply:artdesc.canApply,
                        showVote:artdesc.showVote,
                        etype:artdesc.etype,
                        rule:artdesc.rule
                    },()=>{
                        if(newtime < artdesc.beginTime * 1000){
                            that.setState({
                                activiType:0,
                            })
                            if(artdesc.atype === 3){
                                that.setState({
                                    autoType:0
                                })
                            }
                        } else if(newtime < artdesc.signendTime * 1000 && newtime > artdesc.beginTime * 1000 ){
                            that.setState({
                                activiType:1
                            })
                        } else if(newtime < artdesc.voteendBeginTime * 1000  && newtime > artdesc.signendTime * 1000){
                            that.setState({
                                activiType:9
                            })
                        } else if(newtime < artdesc.voteendTime * 1000 && newtime > artdesc.voteendBeginTime * 1000 ){
                            that.setState({
                                activiType:2
                            })
                        } else if(newtime > artdesc.showTime * 1000){
                            that.setState({
                                activiType:3
                            })
                        } 

                        if( newtime > artdesc.beginTime * 1000   &&  newtime < artdesc.endTime * 1000){
                            that.setState({
                                autoType:1
                            })
                        }

                        if(newtime > artdesc.endTime * 1000){

                            if(artdesc.atype === 4){
                                that.setState({
                                    activiType:4
                                })
                            }
                            if(artdesc.atype === 2){
                                that.setState({
                                    activiType:4
                                })
                            }
                            
                            if(artdesc.atype === 3){
                                that.setState({
                                    autoType:2
                                })
                            }
                        }
                        
                    })
                    if(res.data.message){
                        if(res.data.message=='您尚未实名认证，请认证后再来！'){
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
                        }else if(res.data.message=='您不属于本内容的特定开放对象，其他内容同样精彩！'){
                            Taro.showModal({
                                title: '提示',
                                content: res.data.message,
                                success: function (res) {
                                    if (res.confirm) {
                                        Taro.switchTab({url:menu.find})
                                    } else if (res.cancel) {
                                        Taro.switchTab({url:menu.find})
                                    }
                                }
                            })
                            setTimeout(() => {
                                Taro.switchTab({url:menu.find})
                            }, 3000);
                        }else if(res.data.message=='请先登录！'){
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
                        }else{
                            Taro.showModal({
                                title: '提示',
                                content: res.data.message,
                                success: function (res) {
                                    if (res.confirm) {
                                        Taro.switchTab({url:menu.find})
                                    } else if (res.cancel) {
                                        Taro.switchTab({url:menu.find})
                                    }
                                }
                            })
                            setTimeout(() => {
                                Taro.switchTab({url:menu.find})
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

    _toSignUp(activityId,ctype){
        const {beginTime,signendTime,userId} = this.state;
        var nowTime = new Date();
        let newtime = nowTime.getTime();

        if(userId > 0 ){
            if(newtime < signendTime * 1000 && newtime > beginTime * 1000){
                Taro.navigateTo({url:menu.activitySignup+'?activityId=' + activityId + '&ctype='+ ctype + '&signendTime=' + signendTime + '&beginTime='+beginTime})
            } else {
                Taro.showToast({
                    title:'时间已截止',
                    icon:'none',
                    duration: 1000
                })
    
                setTimeout(()=>{
                    this._getArtDesc();
                },1000);
                
            }
        } else {

            this.refs.auth.doLogin();
        }
       

    }


    // 获取 作品列表
    _actInfo(){

        var that = this ;
        const {activityId} = that.state

        api.get(inter.ActivityInfo + activityId,{
            keyword:'',
            page:0
        }).then((res)=>{
            if(res.data.status){
                let voteList = res.data.data
                that.setState({
                    voteList:voteList.items,
                })
            }
        })
    }
    
    //  评论 置顶 
    _siteComments(){
        var that = this;
        const {activityId} = that.state;
        api.get(inter.SiteComments + activityId,{
            ctype:2,
            sort:2,
            page:0,
        }).then((res)=>{
            if(res.data.status){
                let topComms  = res.data.data
                that.setState({
                    topComms:topComms.items
                })
            }
        })

    }

    // 获取视频
    getVideo(){
        var that = this 
        const {mediaId} = that.state
        api.post(inter.CourseVideo,{
            media_id:mediaId
        }).then((res)=>{
            if(res.data.status){
                const videodesc = res.data.data

                that.setState({
                    videoCover:videodesc.cover,
                    videoDuration:videodesc.duration,
                    videom38u:videodesc.m38u,
                })
                Taro.showToast({
                    title:'加载中',
                    icon:'loading',
                    duration: 2000
                })
            }
        })
    }

    // 获取跟人信息 判断是否登录
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

    _toVote(canApply,activityId,ctype){
        var that = this;
        const {userId,etype} = that.state;

        if(userId > 0 ){
            if(!canApply){
                Taro.showToast({
                    title:'很抱歉，系统检测到您不属于本次活动的特定对象，请选择其它活动，感谢您的支持！',
                    icon:'none',
                    duration:1000,
                })
                return
            }

            Taro.navigateTo({url:menu.actProduction + '?activityId=' + activityId + '&ctype='+ ctype + '&etype=' + etype+'&activiType='+this.state.activiType+'&keyword=',})

        } else {
            this.refs.auth.doLogin();
        }

    }


    // 关注
    _onFocus(){
        var that = this;
        const {isFollow,activityId,userId,canApply} = that.state;
        
        if(userId > 0){
            if(!canApply){
                Taro.showToast({
                    title:'很抱歉，系统检测到您不属于本次活动的特定对象，请选择其它活动，感谢您的支持！',
                    icon:'none',
                    duration:1000,
                })
                return
            }
            if(isFollow){
                api.post(inter.RemovesFollow + activityId,{
                    ctype:2
                }).then((res)=>{
                    if(res.data.status){
                        that.setState({
                            isFollow:false
                        })
                        that._getFollow();
                        Taro.showToast({
                            title:'取消成功',
                            icon:'none',
                            duration:1000,
                        })
                    }
                })
            } else {
                api.post(inter.PushlishFollow + activityId,{
                    ctype:2
                }).then((res)=>{
                    if(res.data.status){
                        that.setState({
                            isFollow:true
                        })
                        that._getFollow();
                        Taro.showToast({
                            title:'关注成功',
                            icon:'none',
                            duration:1000,
                        })
                    }
                })
            }
        } else {
            this.refs.auth.doLogin();
        }

    }


    // 关注
    _getFollow(){
        var that = this;
        const {activityId} = that.state
        api.get(inter.ActivityDesc + activityId)
        .then((res)=>{
            if(res.data.status){
                let artdesc = res.data.data
                that.setState({
                    follow:artdesc.follow,
                })
            }
        })
    }


    //分享课程
    onShareAppMessage = (res) =>{
        var that = this ;
        const {artDesc,userId} = that.state;

        api.post(inter.userLog,{
            log_type:1,
            type:1,
            device_id:0,
            intro:'分享活动',
            content_id:artDesc.activityId,
            param:JSON.stringify({name:artDesc.title,cctype:3,ttype:0}),
            from:0,
        }).then((res)=>{
            console.log('ee')
        })

        if (res.from === 'button') {
            // 来自页面内转发按钮
        }
        return{
            title:artDesc.title,
            path:menu.activityDesc + '?activityId=' + artDesc.activityId + '&articleName=' + percent2percent25(artDesc.title) + +'&fromuser=' + userId,
            imageUrl:artDesc.activityImg + '?x-oss-process=image/resize,w_500,h_380,m_pad' 
        }
    }
    onShareTimeline() {
        const {artDesc,userId} = this.state;
        return {
            title:artDesc.title,
            query: menu.activityDesc + '?activityId=' + artDesc.activityId + '&articleName=' + percent2percent25(artDesc.title) + +'&fromuser=' + userId,
            imageUrl: artDesc.activityImg + '?x-oss-process=image/resize,w_500,h_380,m_pad'
        }
    }
    
    // 活动详情
    _getArtdesc(){

        var that = this ;
        const {activityId} = that.state;

        api.get(inter.ActivityDesc + activityId)
        .then((res)=>{
            if(res.data.status){
                let artdesc = res.data.data
                that.setState({
                    like:artdesc.like,
                    collect:artdesc.collect,
                    isCollect:artdesc.isCollect,
                    isFollow:artdesc.isFollow,
                    follow:artdesc.follow,
                    num:artdesc.num
                })
            }
        })
    }


    // 跳转到评论
    _whiteCommt(){
        var that = this 
        const {activityId,userId}  = that.state
        if(userId>0){
            Taro.navigateTo({
                url:menu.writeCommt+'?course_id='+`${activityId}` + '&whitetip='+Taro.getStorageSync('whiteTip') + '&type=1&ctype=2&isStar=0'
            })
        } else {
            this.refs.auth.doLogin();
        }
    }


    // 活动取消收藏
    _RemoveCollect(){
        var that = this
        const {activityId,collect,userId} = that.state
        

        if(userId>0){
            api.post(inter.RemoveaCollect+ activityId,{
                ctype:2
            }).then((res)=>{
                    if(res.data.status){
                        let colletN = collect - 1
                        Taro.showToast({
                            title: '取消成功',
                            icon: 'none',
                            duration: 2000
                        })
                        that.setState({
                            isCollect:false,
                            collect:colletN
                        })
                    } else {
                        Taro.showToast({
                            title: '取消失败',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                })
        }  else {
            this.refs.auth.doLogin();
        }
    }   

    // 活动收藏
    _onCollct(){
        var that = this
        const {activityId,collect,userId} = that.state

        if(userId>0){
            api.post(inter.aCollect + activityId,{
                ctype:2
            }).then((res)=>{
                if(res.data.status){
                    Taro.showToast({
                        title: '收藏成功',
                        icon: 'none',
                        duration: 2000
                    })
                    let colletN = collect + 1
                    that.setState({
                        isCollect:true,
                        collect:colletN
                    })
                } else {
                    Taro.showToast({
                        title: '收藏失败',
                        icon: 'none',
                        duration: 2000
                    })
                }    
            })
        } else  {
            this.refs.auth.doLogin();
        }
    }


    //  投票  查看大图
    onViewImgs(url){

        let urls:string[] = new Array() ;
        
        urls.push(url)

        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: urls[0], // 当前显示图片的http链接，默认是第一个
        }).then((res)=>{
            // console.log(res)
        })
    }
    

    //  评论点赞
    _parse(val,comIdx){
        var that = this
        const {topComms,userId} = that.state

        if(userId > 0){
            if(val.like){
                api.post(inter.RemoveLike+val.commentId).then((res)=>{
                    if(res.data.status){
                        topComms[comIdx].like = !topComms[comIdx].like 
                        topComms[comIdx].praise = topComms[comIdx].praise - 1
                        that.setState({
                            topComms:topComms
                        })
                    }
                })
            } else {
                api.post(inter.PublishLike+val.commentId).then((res)=>{
                    if(res.data.status){
                        topComms[comIdx].like = !topComms[comIdx].like 
                        topComms[comIdx].praise = topComms[comIdx].praise + 1
                        that.setState({
                            topComms:topComms
                        })
                    }
                })
            }
        } else {
            this.refs.auth.doLogin();
        }

    }
    

    // 登录后回调
    _onLoadCallBack(){
        var that = this ;

        that.getUser();
        that._getArtdesc();
        that._siteComments();

    }

    _onScratch(){
        console.log('确定刮刮卡')
        var that = this;
        that.setState({
            isShow:false
        })
    }

    onRefuse = ()=>{
        Taro.showToast({
            title:'很抱歉，系统检测到您不属于本次活动的特定对象，请选择其它活动，感谢您的支持！',
            icon:'none',
            duration:1000,
        })
    }

    // 投票
    _onVote(txt){

        var that = this
        const {activityId,answer_list,canApply,userId} = that.state

        if(userId ===  0 ){
            this.refs.auth.doLogin();

            return
        }

        if( !canApply ){
            Taro.showToast({
                title:'很抱歉，系统检测到您不属于本次活动的特定对象，请选择其它活动，感谢您的支持！',
                icon:'none',
                duration:1000,
            })
            return
        }

        let answer_arr_num = (txt.optionId + '' ).split(",").map(Number)
        answer_list[parseInt(txt.topicId)] = answer_arr_num

        api.post(inter.ActivityAnswer + activityId + '/answer',{
            answer:JSON.stringify(answer_list),
        }).then((res)=>{
            if(res.data.status){
                //提交成功 
                api.get(inter.ActivityDesc + activityId)
                .then((res)=>{
                    if(res.data.status){
                        let artdesc = res.data.data
                        that.setState({
                            topicDTO:artdesc.topicDTO,
                            isShow:true
                        })
                    }
                })
            }
        })
    }


    // 点击传播数据 弹窗有新的视频数据播放
    _coverplay(voteUrl){

        var that = this 

        const videoContext = Taro.createVideoContext('video')
        videoContext.stop();

        that.setState({
            P_m38u:voteUrl,
            videoType:true
        })
    }

    //  调查问卷  
    _questSurvey(){
        var that = this ;
        const {activityId,userId} = that.state

        if(userId > 0){
            Taro.navigateTo({url:menu.questSurvey + '?activityId=' + activityId+'&courseId=0'})
        } else {
            this.refs.auth.doLogin();
        }
    }


    // 视频弹窗关闭
    _onClose(){
        var that = this;
        const videoContext = Taro.createVideoContext('P_video')
        videoContext.stop()
        that.setState({
            videoType:false
        })
    }


     // 下拉刷新
    onPullDownRefresh(){
        var that = this;

        var nowTime = new Date();

        that.setState({
            nowdate:nowTime.getTime()
        },()=>{
            console.log(nowTime.getTime())
        })


        that._getArtDesc();
        that._actInfo();
        Taro.showNavigationBarLoading()
        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }


    _offSign = (activityId) => {

        Taro.navigateTo({
            url:menu.registInfo + '?activityId=' + activityId
        })
    }
    

    render () {
        if (!this.state.load) return null;
        const {canApply, artDesc,activityId,isFollow,isCollect,collect,topComms,follow,num,atype,ctype,activiType,topicDTO,P_m38u,videoType,autoType,isApply,isShow,isBack,showVote,etype,rule,userId} = this.state

        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }  catch (e) {
            
        }

        let pushArr:any = []
        if(topicDTO !== null){
            pushArr = Array.isArray(topicDTO.optionList) ? topicDTO.optionList : []
        }
      

        return (
            <View className='wrap' style={isShow  ? {overflowY:'hidden',height:100+'vh'} : {}}>
                <View className='wrapdesc'> 
                    <Image src={artDesc.activityImg}  className='headCover' />
                    <View className='d_flex fd_c mt_5'>
                        <Text className='lg18_label c33_label fw_label'>{artDesc.title}</Text>
                        <Text className='sm_label tip_label mt_5'>活动时间：{formatTimeStampToTime(artDesc.beginTime * 1000)} - {formatTimeStampToTime(artDesc.endTime * 1000)}</Text>
                        <View className='d_flex fd_r jc_sb ai_ct'>
                            <Text className='sm_label tip_label'>{follow}人关注{artDesc.atype !== 0 ? `·${num}人参加` : ''}</Text>
                            <View className='focusBtn' onClick={ this._onFocus }>
                                <Text className='sred_label sm_label'>{isFollow ? '已关注' :'关注'}</Text>
                            </View>
                        </View>
                    </View>
                    <View className='d_flex fd_c mt_15'>
                        <Text className='lg_label c33_label fw_label '>活动详情</Text>
                        <View className='cons  bg_white'>
                            <GrapTmp content={artDesc.content} ></GrapTmp>
                        </View>
                    </View>
                </View>

                {/* 写留言 isApply //true 参加 false 未参加   */}
                {/* {
                    !(atype === 2 && activiType === 1 ) ?  */}
                    <View className='comments d_flex fd_r ai_ct'>
                        <View className='input' onClick={this._whiteCommt}>
                            <Text className='tip_label default_label'>写留言，发表看法</Text>
                        </View>
                        <View className='countBox'  
                            onClick={isCollect ? this._RemoveCollect : this._onCollct}
                        >
                            <Image src={isCollect ? asset.collected : asset.heart_icon} className='heart_icon' />
                            <View className='count'>
                                {
                                    collect > 0 ?
                                    <Text className='sm9_label white_label'>{collect > 999 ? '999+' : collect}</Text>
                                    :
                                    <Text className='sm9_label white_label'>0</Text>
                                }
                            </View>
                        </View>
                    </View> 
                {/* :null} */}

                {/* atype === 2主题投票 ; activiType:0 , // 0 未开始 马上参加不显示 1 马上参加发布作品  2 进行中 展示投票 投票  3 投票时间截止展示排名 */}

                {
                    atype === 9 && !isApply? 
                    <View className='wrapbtm'>
                        <View className='wrapbox'  onClick = {this._offSign.bind(this,activityId)}>
                            <Text className='default_label white_label'>线下报名</Text>
                        </View>
                    </View>
                :null} 

                {
                    atype === 2 ?
                    <View>
                        {/* 参加活动 */}
                        {/* {
                            activiType === 1  && !isApply?
                            <View className='wrapbtm'>
                                {
                                    canApply?
                                    <View className='wrapbox' 
                                        onClick = {this._toSignUp.bind(this,activityId,ctype)}
                                    >
                                        <Text className='default_label white_label'>马上参加</Text>
                                    </View>:
                                    <View className='wrapbox' style={{backgroundColor:'#BFBFBF'}} onClick={this.onRefuse}>
                                        <Text className='default_label white_label'>马上参加</Text>
                                    </View>
                                }
                            </View>
                        :null}  */}

                        {/* 作品展示/投票 */}
                        {
                            activiType === 2 ?
                            <View className='makeBtn' style={canApply?{}:{backgroundColor:'#BFBFBF'}}  
                                // onClick={!canApply?this.onRefuse:()=>Taro.navigateTo({url:menu.actProduction + '?activityId=' + activityId + '&ctype='+ ctype})}
                                onClick={this._toVote.bind(this,canApply,activityId,ctype)}
                            >
                                <Text className='default_label white_label'>我要{etype === 14 ? '点赞' : '投票'}</Text>
                            </View>
                            
                        :null}
                         {
                            activiType === 3||activiType === 4?
                            <View className='makeBtn' style={canApply?{}:{backgroundColor:'#BFBFBF'}}  
                                // onClick={!canApply?this.onRefuse:()=>Taro.navigateTo({url:menu.actProduction + '?activityId=' + activityId + '&ctype='+ ctype})}
                                onClick={this._toVote.bind(this,canApply,activityId,ctype)}
                            >
                                <Text className='default_label white_label'>查看作品</Text>
                            </View>
                            
                        :null}
                         {
                            activiType === 1  && !isApply?
                            <View className='makeBtn' style={canApply?{}:{backgroundColor:'#BFBFBF'}}  
                                // onClick={!canApply?this.onRefuse:()=>Taro.navigateTo({url:menu.actProduction + '?activityId=' + activityId + '&ctype='+ ctype})}
                                onClick={()=>{
                                    if(canApply){
                                        this._toSignUp(activityId,ctype)
                                    }else{
                                        this.onRefuse()
                                    }
                                }}
                            >
                                <Text className='default_label white_label'>马上参加</Text>
                            </View>
                            
                        :null}
                    </View>
                :null}


                


                
                {/* 投票   19文字  17图片 16视频*/}
                {
                    atype === 3 ?
                    <View>
                        <View className='paytit'>
                            <View className='lg_label c33_label fw_label '>投票内容</View>
                            <View className='tiwd'>{rule}</View>
                        </View>
                        {
                            ctype === 19 ?
                            <View className='votes pl_15 pr_15'>
                                {
                                    pushArr.map((txt,index)=>{
                                        return(
                                            <View className='vote d_flex fd_r jc_sb ai_ct mb_10' key={'txt' + index}> 
                                                <Text className='default_label c33_label pl_20 fw_label col_1 pr_10'>{txt.optionLabel}</Text>
                                                {
                                                    topicDTO.canVote  && autoType === 1 ? 
                                                    <View className='d_flex fd_r ai_ct pr_10'>
                                                        {
                                                            showVote === 1 ?
                                                            <Text className='default_label sred_label'>{txt.num}票</Text>
                                                        :null}
                                                        <View className='voteBtn' onClick={this._onVote.bind(this,txt)}>
                                                            <Text className='white_label default_label'>投票</Text>
                                                        </View>
                                                    </View>
                                                    :
                                                    <View className='d_flex fd_r ai_ct pr_10'>
                                                        {
                                                            showVote === 1 ?
                                                            <Text className='default_label sred_label'>{txt.num}票</Text>
                                                        :null}
                                                        <View className='voteBtn' style={{backgroundColor:'#BFBFBF'}}>
                                                            <Text className='white_label default_label'>{txt.canVote ?  '投票':'已投票'}</Text>
                                                        </View>
                                                    </View>
                                                }
                                                
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        :null}
                        {
                            ctype === 16 ?
                            <View className='voteList pl_15 pr_15'>
                                {
                                    pushArr.map((push,index)=>{
                                        return(
                                            <View className='item' style={{width:(windowWidth - 40)/2 + 'px'}} key={'push'+index}>
                                                <View className='m_10 d_flex fd_c '>
                                                    {
                                                        isShow ?
                                                        <Image className='itemCover' src={push.url + + '?x-oss-process=video/snapshot,t_2000,m_fast'}/>
                                                        :
                                                        <Video  
                                                            src={push.url} 
                                                            className='itemCover'
                                                            id='video'
                                                        >
                                                            <CoverView className="coverPlay"  onClick={this._coverplay.bind(this,push.url)}></CoverView>
                                                        </Video> 
                                                    }
                                                    
                                                    <View className='d_flex fd_r jc_sb mt_10' style={{height:80+'rpx'}}>
                                                        <Text className='default_label c33_label fw_label'>{subNumTxt(push.optionLabel,18)}</Text>
                                                    </View>

                                                    <View className='d_flex fd_r ai_ct jc_sb mt_5 '>
                                                        {
                                                            showVote === 1 ?
                                                            <Text className='sred_label default_label'>{push.num}票</Text>
                                                        :null}
                                                        
                                                        {
                                                            topicDTO.canVote  && autoType === 1 ? 
                                                            <View className='voteBtn' onClick={this._onVote.bind(this,push)} style={{width:120+'rpx',height:48+'rpx',marginTop:0+'rpx'}}>
                                                                <Text className='white_label default_label'>投票</Text>
                                                            </View>
                                                            :
                                                            <View className='voteBtn'  style={{width:120+'rpx',height:48+'rpx',marginTop:0+'rpx',backgroundColor:'#BFBFBF'}}>
                                                                <Text className='white_label default_label'>{push.canVote ?  '投票':'已投票'}</Text>
                                                            </View>
                                                        }
                                                    </View>
                                                    
                                                </View> 
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        :null}
                        {
                            ctype === 17 ?
                            <View className='voteList ml_15 mr_15 mb_15'>
                                {
                                    pushArr.map((push,index)=>{
                                        return(
                                            <View className='item' style={{width:(windowWidth - 40)/2 + 'px'}} key={'push'+index}>
                                                <View className='m_10 d_flex fd_c '>
                                                    <Image src={push.url} className='itemCover' onClick={this.onViewImgs.bind(this,push.url)} />
                                                    <View className='d_flex fd_r jc_sb mt_10' style={{height:80+'rpx'}}>
                                                        <Text className='default_label c33_label fw_label'>{subNumTxt(push.optionLabel,18)}</Text>
                                                    </View>
                                                    <View className='d_flex fd_r ai_ct jc_sb mt_5 '>
                                                        {
                                                            showVote === 1 ? 
                                                            <Text className='sred_label default_label'>{push.num}票</Text>
                                                        :null}
                                                        
                                                        {
                                                            topicDTO.canVote  && autoType === 1 ? 
                                                            <View className='voteBtn' onClick={this._onVote.bind(this,push)} style={{width:120+'rpx',height:48+'rpx',marginTop:0+'rpx'}}>
                                                                <Text className='white_label default_label'>投票</Text>
                                                            </View>
                                                            :
                                                            <View className='voteBtn'  style={{width:120+'rpx',height:48+'rpx',marginTop:0+'rpx',backgroundColor:'#BFBFBF'}}>
                                                                <Text className='white_label default_label'>{push.canVote ?  '投票':'已投票'}</Text>
                                                            </View>
                                                        }
                                                    </View>
                                                    
                                                    
                                                </View> 
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        :null}
                    </View>
                :null}


                {/* 问卷调查 */}
                {
                    atype === 4 ?
                    <View>
                        {
                            activiType === 4?
                            <View className='makeBtn ' style={{backgroundColor:'#BFBFBF'}}>
                                <Text className='default_label white_label'>时间已截止</Text>
                            </View>
                        :null}

                        {
                            (activiType === 2 ||  activiType === 1  || activiType === 3 || activiType === 9) && !artDesc.isFinish ? 
                            <View className='makeBtn ' style={canApply?{}:{background:"#BFBFBF"}} onClick={canApply?this._questSurvey:this.onRefuse}>
                                <Text className='default_label white_label'>开始问卷</Text>
                            </View>   
                        :null}
                        
                    </View>
                :null}
                

                {/* 精选评论 */}
                <View className='evalBox pb_15'>
                        <View className='p_15 mt_10 bg_white'>
                            <Text className='lg18_label c33_label fw_label'>精选评论</Text>
                            {
                                topComms.length > 0  ? 
                                <View>
                                {
                                    topComms.map((comm,index)=>{
                                        return(

                                            <View key={'comm' + index}>
                                                <Eval  
                                                    comIdx={index}
                                                    val = {comm} 
                                                    type = {1}
                                                    onParse={this._parse}
                                                />
                                            </View>
                                        )   
                                    })
                                }
                                </View>
                            :
                                <Comt />
                            }
                        </View>
                        
                        <View className='pt_12 pb_12 d_flex fd_r ai_ct jc_ct border_tp bg_white pb_50' 
                            onClick={()=>Taro.navigateTo({url:menu.allComment+'?course_id=' + `${activityId}` +'&type=1' + '&ctype=2'})}
                        >
                            <Text className='gray_label sm_label'>查看全部评论 &gt;</Text>
                        </View>
                    </View>
                

                {/* 打开播放视频窗口 */}
                {
                    videoType ?
                    <View className='layer'>
                        <View className='d_flex ai_ct jc_ct layer_box'>
                            <View className='closeBtn' onClick={this._onClose}>
                                <Image src={asset.video_close} className='layer_icon' />
                            </View>
                            <Video 
                                src={P_m38u} 
                                className='cover_layer'
                                style={{width:windowWidth + 'px'}}
                                autoplay
                                id='P_video'
                            />
                        </View>
                    </View>
                :null}

                {
                    isShow ? 
                        <Scratch  isShow={isShow} isBack={isBack} scratchId={activityId} 
                            success={() => {
                                this._onScratch()
                            }}
                        />
                :null}                
                <Auth ref={'auth'} type={1} success={() => {
                    this._onLoadCallBack()
                }}/>
            </View>
        )
    }
}

export default activityDesc as ComponentClass