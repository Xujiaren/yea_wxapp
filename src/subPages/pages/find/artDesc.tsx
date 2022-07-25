import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image,Video,Button} from '@tarojs/components'

import menus from '../../../config/menu';
import Tabs from '../../../components/Tabs'

import Auth from '../../../components/Auth'


import inter from '../../../config/inter'
import api from '../../../services/api'

import asset from '../../../config/asset';

import  '../../../config/theme.css';
import './artDesc.less'

import {percent2percent25} from '../../../utils/common'


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

    videoCover:string,
    videoDuration:number,
    videom38u:string,

}

class artDesc extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '',
        enablePullDownRefresh: true
    }

    constructor () {
        super(...arguments)
        this.state = {
            load:false,
            userId:0,
            articleId:0,
            articleName:'',
            artDesc:{},
            gallery:[],
            likeNum:0,
            like:false,
            isCollect:false,
            mediaId:'',
            videoCover:'',
            videoDuration:0,
            videom38u:'',
        }
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


    // 获取详情
    getartDesc(){
        var that = this;
        const {articleId} = that.state;
        api.get(inter.ArticleDesc + articleId)
            .then((res)=>{
                console.log(res,'//')
                if(res.data.status){
                    that.setState({
                        load:true,
                        artDesc:res.data.data,
                        gallery:res.data.data.gallery,
                        like:res.data.data.isLike,
                        likeNum:res.data.data.likeNum,
                        isCollect:res.data.data.isCollect,
                        mediaId:res.data.data.mediaId,
                    },()=>{
                        if(res.data.data.mediaId.length > 0){
                            this.getVideo();
                        }
                    })
                }
                if(res.data.message){
                    Taro.showModal({
                        title: '提示',
                        content: res.data.message,
                        success: function (res) {
                          if (res.confirm) {
                            Taro.switchTab({
                                url:menus.index
                            })
                          } else if (res.cancel) {
                            Taro.switchTab({
                                url:menus.index
                            })
                          }
                        }
                    })
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
            intro:'分享精彩回顾',
            content_id:artDesc.articleId,
            param:JSON.stringify({name:artDesc.title,cctype:5,ttype:0}),
            from:0,
        }).then((res)=>{
            console.log('ee')
        })

        if (ops.from === 'button') {
            // 来自页面内转发按钮
            // console.log(ops.target)
        }
        return {
            title: artDesc.title,
            path: menus.artDesc + '?articleId=' + artDesc.articleId + '&articleName=' + percent2percent25(artDesc.title) +'&fromuser=' + userId,
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

    _onCollect(){
        var that = this ;
        const {userId,articleId,isCollect} = that.state;

        if(userId > 0){
            if(!isCollect){
                api.post(inter.aCollect + articleId,{
                    ctype:13
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
                    ctype:13
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

    _onLoadCallBack(){
        var that = this ;
        const {articleId} = that.state;
        that.getUser();
        
        api.get(inter.ArticleDesc + articleId)
            .then((res)=>{
                if(res.data.status){
                    that.setState({
                        like:res.data.data.like,
                        likeNum:res.data.data.likeNum,
                        isCollect:res.data.data.collect,
                    },()=>{
                        if(res.data.data.mediaId.length > 0){
                            this.getVideo();
                        }
                    })
                }
            })
    }


    // 下拉
    onPullDownRefresh(){
        var self = this


        self.getartDesc();
        setTimeout(function () {
            //执行ajax请求后停止下拉
            Taro.stopPullDownRefresh();
        }, 1000);

        
    }

    
    render () {

        if (!this.state.load) return null;
        const {artDesc,gallery,like,likeNum,isCollect,videom38u,mediaId} = this.state;

        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }  catch (e) {
            
        }


        return (
            <View className='findwrap'>
                {
                        mediaId.length > 0 ?
                        <Video  
                            src={videom38u} 
                            style={{width: windowWidth + 'px',height:(windowWidth * 0.56 + 1).toFixed(0) + 'px',display:'flex',justifyContent:'center'}}
                            className='cover_vd'
                            autoplay
                            id='video'
                        /> 
                    :
                        <View className='ml_20 mr_20'>
                            <Image 
                            src={artDesc.articleImg} 
                            className='cover_pic' />
                        </View>
                        
                }
                <View  className='wraphead pl_20 pr_20'>
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
                        <View className='articon' onClick={this._onCollect}>
                            <Image src={isCollect ? asset.collected : asset.ct_icon} className='collect_icon' />
                            <Text className={isCollect ? 'sm_label red_label' : 'sm_label gray_label'} >收藏</Text>
                        </View>

                        <Button open-type='share' onShareAppMessage={this.onShareAppMessage} className='shareBtn'>
                            <Image src={asset.share_icon} className='shart_icon' />
                            <Text className='sm_label gray_label'>分享</Text>
                        </Button>

                    </View>
                </View>

                
                <View className='imgLists pl_20 pr_20'>
                    {
                        gallery.map((img:any,index)=>{
                            return(
                                <Image src={img.fpath} className='item'  style={{width:((windowWidth - 50 ) /2).toFixed(0)+'px'}} key={'img' + index} 
                                    onClick={this.onViewImg.bind(this,gallery,index)}
                                />
                            )
                        })
                    }
                </View>
                <Auth ref={'auth'} success={() => {
                    this._onLoadCallBack()
                }}/>
            </View>
        )
    }
}

export default artDesc as ComponentClass