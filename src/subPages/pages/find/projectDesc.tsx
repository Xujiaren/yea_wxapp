import { ComponentClass } from 'react'
import Taro, { Component,getApp } from '@tarojs/taro'
import { View ,Text,Image,Video,Button,ScrollView} from '@tarojs/components'

import menu from '../../../config/menu';

import Auth from '../../../components/Auth'
import Comt from '../../../components/General/Comt'
import Coursescore from '../../../components/Coursescore'
import Eval from '../../../components/Eval'

import {subNumTxt,percent2percent25} from '../../../utils/common'

import inter from '../../../config/inter'
import api from '../../../services/api'

import asset from '../../../config/asset';

import  '../../../config/theme.css';
import './projectDesc.less'




type PageState = {
    load:boolean,
    userId:number,
    articleId:number,
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
    likeNum:number,
    isCollect:boolean,
    comment:number,
    mediaId:string,
    artDesc:{
        articleId: number,
        articleImg: string,
        atype: number,
        canShare: number,
        categoryId: number,
        comment: number,
        content: string,
        contentId:number,
        ctype: number,
        gallery: Array<{}>,
        hit: number,
        isTop: number,
        like: false
        likeNum:number,
        pubTime: number,
        pubTimeFt: string,
        summary: string,
        teacherId: number,
        teacherName: string,
        title:string,
        ttype: number,
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
    galleryIndex:number
}

class projectDesc extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '',
    }

    constructor () {
        super(...arguments)
        this.state = {
            load:false,
            userId:0,
            articleId:0,
            articleName:'',
            artDesc:{},
            topComms:[],
            gallery:[],
            likeNum:0,
            like:false,
            isCollect:false,
            comment:0,
            mediaId:'',
            videoCover:'',
            videoDuration:0,
            videom38u:'',
            galleryIndex:100,
        }

        this._parse = this._parse.bind(this);
    }

    componentWillMount () {
        var that = this
        const {articleId,articleName,fromuser,scene} = that.$router.params

        that.setState({
            articleId:parseInt(articleId),
            articleName:articleName
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
        that.getartDesc();
        that._consultComt();
    }

    componentWillUnmount () {
        
    }
    
    componentDidShow () { }
    componentDidHide () { }


    // 获取个人信息判断是否登录
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

    // 资讯评论
    _consultComt(){
        var that = this;
        const {articleId}  =  that.state;

        
        api.get(inter.SiteComments + articleId,{
                sort:2,
                page:0,
                ctype:15,
            }).then((res)=>{
                if(res.data.status){
                    let topComms  = res.data.data
                    this.setState({
                        topComms:topComms.items
                    })
                }
            })

    }


    // 获取详情
    getartDesc(){
        var that = this;
        const {articleId} = that.state;
        api.get(inter.ArticleDesc + articleId)
            .then((res)=>{
                if(res.data.status){
                    let specialList = res.data.data
                    if(specialList.canShare==0){
                        Taro.hideShareMenu()
                    }else{
                        wx.showShareMenu({

                            withShareTicket: true,
                
                            menus: ['shareAppMessage', 'shareTimeline']
                        })
                    }
                    that.setState({
                        load:true,
                        artDesc:specialList,
                        gallery:specialList.gallery,
                        like:specialList.isLike,
                        likeNum:specialList.likeNum,
                        isCollect:specialList.isCollect,
                        comment:specialList.comment,
                        mediaId:specialList.mediaId,
                    },()=>{

                        // if(specialList.mediaId.length > 0){
                        //     that.getVideo();
                        // }

                        if(Array.isArray(specialList.gallery) && specialList.gallery.length > 0){
                            that._getPVideo(specialList.gallery[0].link,0);
                        } else {
                            if(specialList.mediaId.length > 0){
                                that.getVideo();
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

    // 分享详情页
    onShareAppMessage(ops){
        var that = this ;
        const {artDesc,userId} = that.state;

        api.post(inter.userLog,{
            log_type:1,
            type:1,
            device_id:0,
            intro:'分享专题',
            content_id:artDesc.articleId,
            param:JSON.stringify({name:artDesc.title,cctype:4,ttype:0}),
            from:0,
        }).then((res)=>{
            console.log('ee')
        })
        api.post(inter.userHistory,{
            content_id:artDesc.articleId,
            ctype:15,
            etype:16,
        }).then((res)=>{
            console.log('aa')
        })
        if (ops.from === 'button') {
            // 来自页面内转发按钮
            // console.log(ops.target)
        }
        return {
            title: artDesc.title,
            path: menu.projectDesc + '?articleId=' + artDesc.articleId + '&articleName=' + percent2percent25(artDesc.title) +'&fromuser=' + userId,
            imageUrl:artDesc.articleImg  + '?x-oss-process=image/resize,w_500,h_380,m_pad' ,
            success: function (res) {
                // 转发成功
                console.log("转发成功:" + JSON.stringify(res));
                this.setState({
                    shareshow:false
                })
            },
            fail: function (res) {
              // 转发失败
              console.log("转发失败:" + JSON.stringify(res));
            }
        }
    }
    onShareTimeline() {
        const {artDesc,userId} = this.state;
        return {
            title:artDesc.title,
            query: menu.projectDesc + '?articleId=' + artDesc.articleId + '&articleName=' + percent2percent25(artDesc.title) + +'&fromuser=' + userId,
            imageUrl: artDesc.articleImg + '?x-oss-process=image/resize,w_500,h_380,m_pad'
        }
    }


    // 通过 mediaId  获取 视频资源
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

    // 得到专辑
    _getPVideo(mediaId,index){
        var that = this 

        const videoContext = Taro.createVideoContext('video')
        videoContext.stop();

        api.post(inter.CourseVideo,{
            media_id:mediaId
        }).then((res)=>{
            if(res.data.status){
                const videodesc = res.data.data
                that.setState({
                    galleryIndex:index,
                    mediaId:mediaId,
                    videom38u:videodesc.m38u,
                },()=>{
                    videoContext.play();
                })
                Taro.showToast({
                    title:'加载中',
                    icon:'loading',
                    duration: 2000
                })
            }
        })
    }

    // 查看图片
    onViewImg(gallery,index){
        let urls:string[] = new Array() ;
        for(let i = 0 ; i < gallery.length; i++){
            urls.push(gallery[i].fpath)
        }

        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: urls[index], // 当前显示图片的http链接，默认是第一个
        }).then((res)=>{
            // console.log(res)
        })
    }


    // 查看评论图片
    onViewImgs(galleryList,index){
        let urls:string[] = new Array() ;
        for(let i = 0 ; i < galleryList.length; i++){
            urls.push(galleryList[i].fpath)
        }
        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: urls[index], // 当前显示图片的http链接，默认是第一个
        }).then((res)=>{
            // console.log(res)
        })
    }


    //资讯点赞
    _onPraise(){
        var that = this ;
        const {like,userId,articleId,likeNum} = that.state;

        if(userId > 0){
            if(!like){
                api.post(inter.ArticleLike + articleId)
                .then((res)=>{
                    if(res.data.status){
                        Taro.showToast({
                            title: '点赞成功',
                            icon: 'none',
                            duration: 2000
                        })
                        let likenumber = likeNum + 1 
                        this.setState({
                            like:!like,
                            likeNum:likenumber
                        })
                    }
                })
            } else {
                api.post(inter.ArticleRmLike + articleId)
                .then((res)=>{
                    if(res.data.status){
                        Taro.showToast({
                            title: '取消点赞',
                            icon: 'none',
                            duration: 2000
                        })
                        let likenumber = likeNum - 1 
                        
                        this.setState({
                            like:!like,
                            likeNum:likenumber < 0 ? 0 : likenumber
                        })
                    }
                })
            }
        } else {
            this.refs.auth.doLogin();
        }

    }


    // 评论点赞
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

    // 收藏
    _onCollect(){
        var that = this ;
        const {userId,articleId,isCollect} = that.state;

        if(userId > 0){
            if(!isCollect){

                api.post(inter.aCollect + articleId,{
                    ctype:15
                }).then((res)=>{
                            if(res.data.status){
                                Taro.showToast({
                                    title: '收藏成功',
                                    icon: 'none',
                                    duration: 1000
                                })
                                that.setState({
                                    isCollect:true,
                                })
                            } else {
                                Taro.showToast({
                                    title: '收藏失败',
                                    icon: 'none',
                                    duration: 1000
                                })
                            }    
                    })
            } else {
                api.post(inter.RemoveaCollect+ articleId,{
                    ctype:15
                }).then((res)=>{
                    if(res.data.status){
                        Taro.showToast({
                            title: '取消成功',
                            icon: 'none',
                            duration: 1000
                        })
                        that.setState({
                            isCollect:false,
                        })
                    } else {
                        Taro.showToast({
                            title: '取消失败',
                            icon: 'none',
                            duration: 1000
                        })
                    }
                })
            }
            
        } else {
            this.refs.auth.doLogin();
        }
    }

    


    // 写评论
    _whiteCommt(){
        var that = this 
        const {articleId,userId}  = that.state
        if(userId > 0){
            Taro.navigateTo({
                url:menu.writeCommt+'?course_id='+`${articleId}` + '&whitetip='+Taro.getStorageSync('whiteTip') + '&type=1&ctype=15&isStar=0'
            })
        } else {
            this.refs.auth.doLogin();
        }

    }


    _onLoadCallBack(){
        var that = this ;
        const {articleId} = that.state;
        that.getUser();
        
        api.get(inter.ArticleDesc + articleId)
            .then((res)=>{
                if(res.data.status){
                    let specialList = res.data.data
                    that.setState({
                        like:specialList.like,
                        likeNum:specialList.likeNum,
                        isCollect:specialList.collect,
                        comment:specialList.comment,
                    },()=>{
                        if(res.data.data.mediaId.length > 0){
                            this.getVideo();
                        }
                    })
                }
            })
    }

    _onShare(){
        var that = this
        const {artDesc} =  that.state 

        Taro.showToast({
            title:'很抱歉，此页面不支持分享转发，暂无法打开！',
            icon:'none',
            duration:2000
        })
    }

    
    render () {

        if (!this.state.load) return null;
        const {artDesc,gallery,like,likeNum,comment,topComms,isCollect,videom38u,mediaId,articleId,galleryIndex,userId} = this.state;

        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }  catch (e) {
            
        }
       
       
        return (
            <View>
                <View className='head'>
                    {
                        mediaId.length > 0 ?
                        <Video  
                            src={videom38u} 
                            className='cover_vd'
                            style={{width: windowWidth + 'px',height:(windowWidth * 0.56 +1).toFixed(0) + 'px',display:'flex',justifyContent:'center'}}
                            autoplay
                            id='video'
                            autoPauseIfNavigate={true}
                        /> 
                    :
                        <View className='ml_20 mr_20'>
                            <Image 
                                src={artDesc.articleImg} 
                                className='cover_pic' 
                            />
                        </View>
                        
                    }
                </View>
                
                <View className='findwrap' >
                    
                    <View  className='wraphead'>
                        <View className='artdesc_tip'>
                            <Text className='lg_label c33_label fw_label title'>{artDesc.title}</Text>
                            <Text className='default_label gray_label'>{artDesc.summary}</Text>
                            <View className='artdesc_date'>
                                <Text className='tip_label sm_label'>发布时间：{artDesc.pubTimeFt}</Text>
                                <View className='artdesc_parse' onClick={this._onPraise}>
                                    <Image src={like ? asset.onpraise : asset.praise}  className='parse_cover'/>
                                    <Text className={like ?  'red_label sm_label' : 'tip_label  sm_label'}>{likeNum}</Text>
                                </View>
                            </View>
                        </View>

                        <View className='articons'>
                            <View className='articon'>
                                <Image src={asset.video_icon} className='icon' />
                                <Text className='sm_label gray_label'>{artDesc.hit}播放</Text>
                            </View>
                            <View className='articon' 
                                onClick={()=>Taro.navigateTo({url:menu.allComment+'?course_id=' + `${articleId}` +'&type=1' + '&ctype=15'})}
                            >
                                <Image src={asset.eval_icon} className='icon' />
                                <Text className='sm_label gray_label'>{comment}评论</Text>
                            </View>
                            <View className='articon' onClick={this._onCollect}>
                                <Image src={isCollect ? asset.collected : asset.ct_icon} className='collect_icon' />
                                <Text className={isCollect ? 'sm_label red_label' : 'sm_label gray_label'} >收藏</Text>
                            </View>
                            {
                                artDesc.canShare === 1 ?
                                <Button open-type='share' onShareAppMessage={this.onShareAppMessage} className='shareBtn'>
                                    <Image src={asset.share_icon} className='shart_icon' />
                                    <Text className='sm_label gray_label'>分享</Text>
                                </Button>
                                :
                                <View  className='shareBtn' onClick={this._onShare}>
                                    <Image src={asset.share_icon} className='shart_icon' />
                                    <Text className='sm_label gray_label'>分享</Text>
                                </View>
                            }
                            

                        </View>
                        {
                            gallery.length > 0 ?
                                <View className='mt_20 '>
                                    <View className='head'>
                                        <Text className='lg_label c33_label fw_label'>选集</Text>
                                    </View>  
                                    <ScrollView
                                        scrollX
                                        style={{height:'280rpx'}}
                                        className='mt_20'
                                    >
                                        <View className='teach d_flex '> 
                                            {
                                                gallery.map((item:any,index)=>{
                                                    return(
                                                        <View className='teach_item mr_10 d_flex fd_c ai_ct' key={'item'+index} 
                                                            style={{width:(windowWidth * 0.4 + 2) + 'px'}}
                                                            onClick={this._getPVideo.bind(this,item.link,index)}
                                                        >
                                                            {console.log(item.title.length)}
                                                            <Image src={item.fpath} className={galleryIndex === index ? 'teach_cover gall_rborder' : 'teach_cover gall_wborder'} 
                                                            style={{width:windowWidth * 0.4 + 'px' ,height:(windowWidth * 0.4 * 0.56).toFixed(2) + 'px'}} />                                                          
                                                               <Text className='sm_label fw_label mt_10' style={galleryIndex === index ? {color:'#FF5047'}:{color:'#333333'}}>{item.title.slice(item.title.length-4,item.title.length)=='.mp4'?subNumTxt(item.title.slice(0,item.title.length-4),20):subNumTxt(item.title,20)}</Text>                                                       
                                                        </View> 
                                                    )
                                                })
                                            }
                                        </View> 
                                    </ScrollView>
                                </View>
                        :null}
                    </View>
                    <View className='p_15 mt_10 bg_white pb_30'>
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

                        
                        <View className='evalbtm' style={{width:(windowWidth - 40 + 'px')}}>
                            <View className='evalbox' onClick={this._whiteCommt}>
                                <Text className='default_label tip_label'>写留言，发表看法</Text>
                            </View>
                        </View>
                        
                </View>
                

                {
                    comment > 0 ?
                    <View className='pt_12 pb_12 d_flex fd_r ai_ct jc_ct border_tp bg_white pb_50' 
                        onClick={()=>Taro.navigateTo({url:menu.allComment+'?course_id=' + `${articleId}` +'&type=1' + '&ctype=15'})}
                    >
                        <Text className='gray_label sm_label'>查看全部评论 &gt;</Text>
                    </View> 
                :null}
                



                <Auth ref={'auth'} type={1} success={() => {
                    this._onLoadCallBack()
                }}/>
            </View>
            
        )
    }
}

export default projectDesc as ComponentClass