/**
 * @wang
 */
 import { ComponentClass } from 'react'
 import Taro, { Component, request ,Config,getApp} from '@tarojs/taro'
 import { View, Text ,Image} from '@tarojs/components'
 import Comt from '../../../../components/General/Comt'
 import inter from '../../../../config/inter'
 import api from '../../../../services/api'
 import GrapTmp from '../../../../pages/index/grapTmp'
 import Auth from '../../../../components/Auth'
 import Eval from '../../../../components/Eval'
 import menu from '../../../../config/menu'
 import {dateDiff,formatTimeStampToTime,getExactTimes} from '../../../../utils/common'
 
 
 import  '../../../../config/theme.css';
 import './downActivity.less'
 
 type PageState = {
     load:boolean,
     is_lock:boolean,
     squadId:number,
     squadName:string,
     userId:number,
     type:number,
     nowdate:number,
     o2odesc:{
 
         applyBegin: 0
         applyBeginFt: "1970-01-01 08:00"
         applyEnd: 0
         applyEndFt: "1970-01-01 08:00"
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
     },
     enrollNum:number,
     registeryNum:number,
     stype:number,
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
 }
 class downActivity extends Component<{}, PageState>  {
     
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
             enrollNum:0, //  招生人数
             registeryNum:0, // 报名人数
             stype:0,
             topComms:[],
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
         },()=>{
             this._siteComments()
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
                 if(o2odesc.canShare==1){
                     Taro.showShareMenu({
                         withShareTicket: true
                     })
                 }else{
                     Taro.hideShareMenu()
                 }
                 that.setState({
                     load:true,
                     o2odesc:o2odesc,
                     enrollNum:o2odesc.enrollNum,
                     registeryNum:o2odesc.registeryNum
                 })
                 Taro.setNavigationBarTitle({
                     title: res.data.data.squadName,
                 })
                 if(o2odesc.hasFlag){
                     // 报名开始时间 大于 当前时间 
                     if(o2odesc.applyBegin * 1000  >  nowTime){
                         that.setState({
                             type:0
                         })
                     } else if(o2odesc.applyBegin * 1000 < nowTime &&  o2odesc.applyEnd * 1000 > nowTime){
                         if(o2odesc.canApply){
 
                             if(o2odesc.registeryNum  >= o2odesc.enrollNum){
                                 
                                 this.setState({
                                     type:5
                                 })
 
                             } else {
                                 that.setState({
                                     type:1
                                 })
                             }
                             
 
                         } else {
                             that.setState({
                                 type:2
                             })
                         }
                     } else if(o2odesc.applyEnd * 1000 < nowTime){
                         that.setState({
                             type:3
                         })
                     }
                 } else {
                     that.setState({
                         type:4
                     })
                 }
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
     _siteComments(){
        var that = this;
        const {squadId} = that.state;
        api.get(inter.SiteComments + squadId,{
            ctype:54,
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
    _parse=(val,comIdx)=>{
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
     _singUp(){
         var that = this;
         const {squadId,userId,enrollNum,registeryNum,stype,o2odesc} = that.state;
 
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
                         url:menu.myTrainClassSignUp + '?squad_id=' + squadId + '&applyBegin=' + o2odesc.applyBegin + '&applyend=' + o2odesc.applyEnd
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
     _whiteCommt(){
        var that = this 
        const {squadId,userId}  = that.state
        if(userId>0){
            Taro.navigateTo({
                url:menu.writeCommt+'?course_id='+`${squadId}` + '&whitetip='+Taro.getStorageSync('whiteTip') + '&type=1&ctype=54&isStar=0'
            })
        } else {
            this.refs.auth.doLogin();
        }
    }
     render () {
         if (!this.state.load) return null;
         const {o2odesc,type,topComms,userId} = this.state
 
         return (
             <View className='root'>
                 <View className='content_wrap'>
                     <View className='img_wrap'>
                         <Image className='class_img' src={o2odesc.squadImg} />
                     </View>
                     <View className='title'>
                         <Text>{o2odesc.squadName}</Text>
                     </View>
                     {
                         o2odesc.summary.length > 0 ? 
                         <Text className='gray_label default_label'>{o2odesc.summary}</Text>
                     :null}
                     <View className='info_wrap mt_5'>
                         <Text className='time'>报名时间：{getExactTimes(o2odesc.applyBegin)} - {getExactTimes(o2odesc.applyEnd)}</Text>
                     </View>
                     <View className='info_wrap'>
                         <Text className='time'>活动时间：{getExactTimes(o2odesc.beginTime)} - {getExactTimes(o2odesc.endTime)}</Text>
                         <Text>{dateDiff(o2odesc.pubTime)}</Text>
                     </View>
                     <View className='info_wrap'>
                         <Text>招生人数：{o2odesc.enrollNum}  报名人数：{o2odesc.registeryNum}</Text>
                         <Text>地点：{o2odesc.location}</Text>
                     </View>
                 </View>
 
                 <View className='cons  bg_white pl_15 pr_15' style={{paddingBottom:120 + 'rpx'}}>
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
                         type === 5 ?
                         <View className='btn lock' >
                             <Text>报名人数已满</Text>
                         </View>
                     :null}
                     
                     {
                         type === 2 ?
                         <View className='btn lock' >
                             <Text>已报名</Text>
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
                            onClick={()=>Taro.navigateTo({url:menu.allComment+'?course_id=' + `${this.state.squadId}` +'&type=1' + '&ctype=54'})}
                        >
                            <Text className='gray_label sm_label'>查看全部评论 &gt;</Text>
                        </View>
                    </View>
                 <View className='comments d_flex fd_r ai_ct'>
                        <View className='input' onClick={this._whiteCommt}>
                            <Text className='tip_label default_label'>写留言，发表看法</Text>
                        </View>
                        {/* <View className='countBox'  
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
                        </View> */}
                    </View>
                 <Auth ref={'auth'} type={1} success={() => {
                     this._onLoadCallBack()
                 }}/>
             </View>
         )
     }
 }
 
 export default downActivity as ComponentClass
 