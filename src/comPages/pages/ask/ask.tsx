import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { View, Text ,Image,Swiper,SwiperItem} from '@tarojs/components'

import Tabs from '../../../components/Tabs'

import asset from '../../../config/asset'
import menu from '../../../config/menu';
import inter from '../../../config/inter'

import api from '../../../services/api';

import Askcell from '../../components/askcell'
import AskHotcell from '../../components/AskHotcell'
import Auth from '../../../components/Auth'

import  '../../../config/theme.css';
import './ask.less'

type  PageState = {
    navHeight:number,//刘海高度
    capHeight:number,//胶囊高度
    status:number,
    category_id:number,
    askList:Array<{
        askId:number,
        askReplyDTO:object,
        categoryId: number,
        collect: number,
        content: string,
        flag: string,
        gallery:Array<any>,
        hit: number,
        integral: number,
        isCollect: false
        isShare: number,
        isTop: number,
        pubIp: string,
        pubTime: number,
        replyId: number,
        replyNum: number,
        title: string,
        userId: number,
        avatar:string,
        comment:number,
        nickname:string,
    }>,
    tap:Array<any>,
    cate_arr:Array<any>,
    ad_arr:Array<any>,
    current:number,
    userId:number,
    page:number,
    pages:number,
}

class ask extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationStyle:"custom",
        enablePullDownRefresh: true
    }
    page: number
    pages: number

    constructor () {
        super(...arguments)

        this.page = 0;
        this.pages = 0;

        this.state = {
            navHeight:0,
            capHeight:0,
            status:0, //sort   0 推荐  1热榜
            askList:[],
            tap:[],
            cate_arr:[],
            category_id:0,
            ad_arr:[],
            current:0,
            userId:0,
            page:0,
            pages:0,
        }
    }

    componentWillReceiveProps (nextProps) {
    }

    componentWillMount () {
        this._setbatHeight();
    }

    componentDidMount () { 

        var that = this ;
        that._getCate();
        that._getAsk();
        that._getConfigAd();
        that._getUser();
    }
    componentWillUnmount () { }
    componentDidShow () { }
    componentDidHide () { }


    // 顶部高度适应
    _setbatHeight(){
        var that = this
        var sysinfo =  Taro.getSystemInfoSync()
        var navHeight:number = 44
        var cpHeight:number = 40
        var isiOS = sysinfo.system.indexOf('iOS') > -1
        if (!isiOS) {
            cpHeight = 48
            navHeight = sysinfo.statusBarHeight;
        } else {
            cpHeight = 40
            navHeight = sysinfo.statusBarHeight;
        }

        that.setState({
            navHeight: navHeight,
            capHeight: cpHeight
        })
    }

    _getUser(){
        var that  = this ;
        
        api.get(inter.User)
        .then((res)=>{
            if(res.data.status){
                let userData = res.data.data;

                that.setState({
                    userId:userData.userId,
                })
            }
            
        })
    }


    _onSelect = (e) => {
        var that = this;

        that.setState({
            status:e,
            category_id:0,
        },()=>{
            that._getAsk();
        })
    }

    // 广告位
    _getConfigAd(){

        var that = this;

        api.get(inter.ConfigAd + 6)
        .then((res)=>{
            console.log(res)
            if(res.data.status){

                that.setState({
                    ad_arr:res.data.data,
                })

            }
        })
    }

    // 分类
    _getCate(){

        var that = this;
        const {} = that.state;

        api.get(inter.configAsk)
        .then((res)=>{
            if(res.data.status){
                
                let cate = res.data.data;
                let cateList:any = [];

                if(cate.length > 0){
                    for(let i = 0 ; i < cate.length ; i++){
                        cateList.push(cate[i].categoryName)
                    }
                }

                that.setState({
                    tap:cateList,
                    cate_arr:cate,
                })
            }
        })
    }


    // 得到 问答
    _getAsk(){
        var that = this ;
        const {status,category_id,askList} = that.state;

        api.get(inter.ask,{
            category_id:category_id,
            keyword:'',
            sort:status,
            page:this.page,
        }).then((res)=>{
            console.log(res)
            if(res.data.status){


                let arr = res.data.data;
                if(this.page === 0) {
                    this.page = arr.page
                    this.pages = arr.pages
                    var tList = arr.items
                } else {
                    var tList:any= askList.concat(arr.items)
                }
                
                this.setState({
                    askList:tList,
                    page:arr.page ,
                    pages:arr.pages,
                })

            }


            
        })
    }


    _onCate = (categoryId) => {

        var that = this;
        
        that.setState({
            category_id:categoryId,
            askList:[],
        },()=>{
            that._getAsk();
        })

    }

    onPullDownRefresh(){
        var self = this
        const {status} = self.state

        
        setTimeout(function () {
            //执行ajax请求后停止下拉
            Taro.stopPullDownRefresh();
        }, 1000);
        
    }

    
    // 详情页
    _toQust = (item) =>{

        var that = this;
        const {userId} = that.state;

        if(userId === item.userId){

            Taro.navigateTo({
                url:menu.qustShow + '?askId=' + item.askId + '&title=' + item.title
            })

        } else {

            Taro.navigateTo({
                url:menu.question + '?askId=' + item.askId + '&title=' + item.title
            })

        }
        
    }


    _onMessage = () => {

        Taro.navigateTo({
            url:menu.message
        })

    }

    _onSwiper(e){
        var that = this
        that.setState({
            current:e.detail.current
        }) 
    }


    //广告位判断
    onAdLink = (ad) => {

        let adlink = ad.link;

        if(adlink !== ''){
            if(adlink.substring(0,4) == 'http'){
                Taro.navigateTo({url:menu.adWebView+'?link='+`${ad.link}` + '&ad=' + `${JSON.stringify(ad)}` })
            } else {
                Taro.navigateTo({
                    url:adlink
                })
            }
        }
        
    }


    _askQust = (item) => {
        
        var that = this ;
        const {userId} = that.state ;

        if(userId > 0 ){
            Taro.navigateTo({url:menu.askQust+ '?whitetip=' + Taro.getStorageSync('whiteTipss')});

        } else {

            that._onLogin();
        }
        

    }

    _onLogin = () => {

        var that  = this 
        that.refs.auth.doLogin();

    }

    _onLoadCallBack = () => {
        var that = this

        that._getUser();
    }


    //上拉
    onReachBottom(){
        var self = this;
        
        const {page,pages} = this.state
        
        if(page < pages){
            this.page = this.page + 1 ;

            self._getAsk();
        } 
    }

    render () {

        const {navHeight,capHeight,status,askList,cate_arr,category_id,ad_arr,current} = this.state;
        let val_h = navHeight + capHeight ;
        return (
            <View  className='wrap'>
                <View className='head'>
                    <View style={{height:navHeight+'px',width:'100%'}}></View>
                    <View style={{height:capHeight+'px',width:'100%'}} className='d_flex jc_ct ai_ct'></View>
                    <View className='search mb_10' >
                        <Image src={asset.lg_icon}  mode='aspectFit' className='left_angle' onClick={()=>Taro.navigateBack()} />
                        <View className='input ml_15 mr_20 pl_15' onClick={()=>Taro.navigateTo({url:menu.askSearch})}>
                            <Image src={asset.search} className='search_icon'  />
                            <Text className='tip_label default_label pl_10'>搜索问题</Text>
                        </View>
                        <Image src={asset.msg_icon} className='message_icon'  mode='aspectFit' onClick={this._onMessage} />
                    </View>
                    <View className='atabs'>
                        <Tabs items={['推荐', '热榜']} cctype={1} atype={1} selected={status} onSelect={this._onSelect} />
                    </View>
                </View>

                {
                    status === 0 ? 
                    <View className='cons' style={{marginTop: (val_h + 80) * 2+'rpx'}}>

                        {
                            Array.isArray(ad_arr) && ad_arr.length > 0 ? 
                            <View className='swiper_cons mt_15'>
                                <Swiper
                                    className='swiper3D'
                                    indicatorColor='rgba(255,255,355,0.49)'
                                    indicatorActiveColor='#ffffff'
                                    vertical={false}
                                    circular
                                    indicatorDots
                                    autoplay
                                    duration={1000}
                                    interval={5000}
                                    previous-margin='50rpx'
                                    next-margin='50rpx'
                                    onChange={(e)=>this._onSwiper(e)}
                                >
                                    {
                                        ad_arr.map((ad:any,index)=>{
                                            const on = current  == index

                                            return(
                                                <SwiperItem className={on ? 'active' : 'normal'} key={'ad'+ index} >
                                                    <View className={'swiper_item'}>
                                                        <Image
                                                            className={'swiper_img'}
                                                            src={ad.fileUrl} 
                                                            onClick={this.onAdLink.bind(this,ad)}
                                                        />
                                                    </View>
                                                </SwiperItem>
                                            )
                                        })
                                    }
                                </Swiper>
                            </View>
                        :null}
                        


                        <View className={ad_arr.length === 0 ? 'pt_15' : ''}>
                            {
                                askList.map((item,index)=>{
                                    const on = index === askList.length - 1;
                                    return (
                                        <View key={'item' + index} className={on ? 'mt_15' :'border_bt mt_15'}>
                                            <Askcell ask={item} type={0}  onClick={this._toQust.bind(this,item)}  />
                                        </View>
                                        
                                    )
                                })
                            }
                        </View>
                    </View>
                    :
                    <View  style={{marginTop: (val_h + 80) * 2+'rpx',backgroundColor:'#ffffff'}}>
                        <View className=' d_flex  fd_r tab_box' style={{width:'100%',whiteSpace:'nowrap',overflowY:'scroll'}}>

                            <View className='items  pl_10 pr_10' onClick={this._onCate.bind(this,0)}>
                                <Text className={ category_id === 0 ? 'sm_label red_label' : 'gray_label sm_label'}>全部 </Text>
                            </View>

                            {
                                cate_arr.map((item:any,index)=>{
                                    const on = category_id === item.categoryId
                                    return(
                                        <View key={'items'+index}  className='items  pl_10 pr_10' onClick={this._onCate.bind(this,item.categoryId)}>
                                            <Text className={on ? 'sm_label sred_label' : 'gray_label sm_label'}>{item.categoryName}</Text>
                                        </View>
                                    )
                                })
                            }

                        </View>
                        <View className='cons' >
                            {
                                askList.map((item,index)=>{
                                    const on = index === askList.length - 1;

                                    return (
                                        <View key={'item' + index} className={on ? 'mt_15' :'border_bt mt_15'}>
                                            <AskHotcell ask={item} idx={index + 1}  onClick={this._toQust.bind(this,item)}  />
                                        </View>
                                        
                                    )
                                })
                            }
                        </View>
                    </View>
                    

                }

                <Auth ref={'auth'} success={() => {
                    this._onLoadCallBack()
                }}/>

                <View className='top'   onClick={this._askQust}>
                    <Image src={asset.edit_icon} className='edit_icon' />
                    <Text className='default_label white_label mt_2'>提问</Text>
                </View>
            </View>
        )
    }
}

export default ask as ComponentClass