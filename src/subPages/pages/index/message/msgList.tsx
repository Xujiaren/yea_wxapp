import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image} from '@tarojs/components'


import menu from '../../../../config/menu';
import api from '../../../../services/api'
import inter from '../../../../config/inter'

import asset from '../../../../config/asset'

import { connect } from '@tarojs/redux'
import { homeType } from '../../../../constants/homeType'

import  '../../../../config/theme.css';
import './msgList.less';

import { 
    getUserMessage
} from '../../../../actions/home'

import { msgTime } from '../../../../utils/common'


type PageStateProps = {
    home: homeType,

    getUserMessage:Array<{}>
}

type PageDispatchProps = {
    getUserMessage:(object)=>any
}

type PageOwnProps = {}

type PageState = {
    loadding:boolean
    type:number,
    page:number,
    pages:number,
    total:number,
    items:Array<{}>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface MsgList {
     props: IProps;
}

@connect(({ home }) => ({
        home:home
    }), (dispatch) => ({

    getUserMessage(object){
        dispatch(getUserMessage(object))
    }

}))

class MsgList extends Component<{}, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '',
        enablePullDownRefresh: true
    }
    page: number;
    pages: number;


    //特定已读
    constructor () {
        super(...arguments)

        this.page = 0;
        this.pages = 0;
        this.state = {
            loadding:false,
            type:0,
            page:0,
            pages:0,
            total:0,
            items:[]
        }

        this._allread = this._allread.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        const {home} = nextProps
        const {userMessage} = home
        const {items,page} = this.state

        if (home !== this.props.home) {
            if(this.page == 0){
                this.page = userMessage.page
                this.pages = userMessage.pages
                var fList:any= userMessage.items

            } else {
                var fList:any= items.concat(userMessage.items)
            }
            
            this.setState({
                page:userMessage.page,
                pages:userMessage.pages,
                total:userMessage.total,
                items:fList
            })
        }
        
    }

    componentWillMount () { 
        var that = this ;
        const {  name,type } = this.$router.params;
        Taro.setNavigationBarTitle({
           title: name,
        })
        that.setState({
            type:parseInt(type)
        })
    }

    componentDidMount () {
        this.getUserMessage()
    }

    componentWillUnmount () { }

    componentDidShow () {
        var that = this ;

        that.page = 0;

        that.getUserMessage();
    }

    componentDidHide () { }

    getUserMessage(){
        var that = this ;
        that.props.getUserMessage({
            page:0,
            etype:40
        })
    }

    _onMsgList(msg){
        var that = this
        const {type} = that.state
        api.post(inter.MessageOperate,{
            type:type,
            message_id:msg.messageId,
            operate:0,
        }).then(res=>{
            if(res.data.status){
                api.get(inter.MessageUnRead).then(res=>{
                    if(!res.data.status){
                        console.log('出错')
                    }
                })
            }
        })

        Taro.navigateTo({
            url:menu.msgDesc+'?msg='+ encodeURIComponent(JSON.stringify(msg)) + '&typeImg=1'
        })

    }

    loaddata(){

        var self = this
        const {page} = self.state
        self.props.getUserMessage({
            page:page,
            etype:40
        })

    }

    onPullDownRefresh(){
        var self = this
        
        self.setState({
            page:0,
            items:[]
        },()=>{
            self.loaddata();
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
        self.setState({
            loadding:false
        })
    }

    onReachBottom(){
        var self = this;
        
        const {page,pages} = self.state

        if(page < pages){
            this.page = this.page + 1
            self.props.getUserMessage({
                page:page+1,
                etype:40
            })
        } else {
            self.setState({
                loadding:true
            })
        }
    }

    _allread(){
        var that = this
        const {type} = that.state
        api.post(inter.MessageOperate,{
            type:type,
            message_id:0,
            operate:0,
        }).then(res=>{
            if(res.data.status){
                that.setState({
                    page:0,
                    items:[]
                },()=>{
                    that.getUserMessage();
                })
            }
        })
    }

    render () {
        
        const {loadding,items} = this.state
        return (
            <View className='msgListwrap ml_15 mr_15 mt_15'>
                <View className='d_flex fd_r jc_fe pt_10 pb_10 msghead'>
                    <Text className='sm_label gray_label mr_12' onClick={this._allread}>全部已读</Text>
                </View>

                <View className='msgwrap'>
                    
                    {
                        items.map((msg:any,index)=>{
                            return(
                                <View className='msgItem p_12 mb_15' key={'msg'+index}  
                                    onClick={this._onMsgList.bind(this,msg)}
                                >
                                    <View className='head'>
                                        <View className='msgImgbox' >
                                            <Image src={asset.newsIcon} className='headCover' />
                                            {
                                                msg.status == 0 ?
                                                <View className='headDot'></View>
                                            :null}
                                        </View>
                                        <Text style={msg.status == 0 ? {fontSize:'32rpx',color:'#000000',fontWeight:'bold'} : {fontSize:'28rpx',color:'#999999' }} >{msg.title}</Text>
                                    </View>
                                    <View className='d_flex fd_c pb_10'>
                                        {
                                            msg.messageImg !== '' && msg.messageImg !== null ?
                                            <Image src={msg.messageImg}  mode='aspectFit' className='messageImg' />
                                        :
                                            <Text className='default_label  mt_5 lh20_label' style={msg.status == 0 ? {color:'#666666'} : {color:'#999999'}}>{msg.summary}</Text>
                                        }
                                        <Text className='sm_label tip_label mt_5'>{msgTime(msg.ptime)}</Text>
                                    </View>
                                    <View className='d_flex fd_r ai_ct msg_btm'>
                                        <Text className='gray_label default_label'>点击查看更多</Text>
                                        <Image src={asset.arrow_right}  className='icon_right' />
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>

                {   
                    loadding == true ?
                    <View className='loaddata d_flex ai_ct jc_ct  pt_10 pb_10'>
                        <Text className='sm_label tip_label'>没有更多数据了</Text>
                    </View>
                :null}
                
            </View>
        )
    }
}


export default MsgList as ComponentClass