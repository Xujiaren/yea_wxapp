import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image} from '@tarojs/components'


import menu from '../../../../config/menu';
import api from '../../../../services/api'
import inter from '../../../../config/inter'

import asset from '../../../../config/asset'


import { connect } from '@tarojs/redux'
import { homeType } from '../../../../constants/homeType'

import './remindList.less';
import  '../../../../config/theme.css';
import {msgTime} from '../../../../utils/common'

import { 
    getUserRemind,
} from '../../../../actions/home'


type PageStateProps = {
    home: homeType,
    getUserRemind:Array<{}>,
}

type PageDispatchProps = {
    getUserRemind:(object)=>any,
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

interface RemindList {
     props: IProps;
}

@connect(({ home }) => ({
        home:home
    }), (dispatch) => ({
    getUserRemind (object) {
      dispatch(getUserRemind(object))
    },

}))

class RemindList extends Component<{}, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '',
        enablePullDownRefresh: true
    }
    page: number;
    pages: number;

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
        const {userRemind} = home
        const {items,page} = this.state
        if (home !== this.props.home) {
            
            if(this.page == 0){
                var fList:any= userRemind.items
                this.page = userRemind.page
                this.pages = userRemind.pages
            } else {
                var fList:any= items.concat(userRemind.items)
            }
            
            this.setState({
                page:userRemind.page,
                pages:userRemind.pages,
                total:userRemind.total,
                items:fList
            })
        }
    }

    componentWillMount () { 
        const {  name,type } = this.$router.params;
        Taro.setNavigationBarTitle({
           title: name,
        })
        this.setState({
            type:parseInt(type)
        })
    }

    componentDidMount () {
        var that = this
        that.getUserRemind()
    }

    componentWillUnmount () { }

    componentDidShow () {   
        var that = this ;
        that.page = 0;

        that.getUserRemind();
    }

    componentDidHide () { }

    getUserRemind(){
        var that = this;

        that.props.getUserRemind({
            page:0
        })

    }

    _onMsgList(msg){
        var that = this
        const {type} = that.state
        api.post(inter.MessageOperate,{
            type:type,
            message_ids:msg.remindId,
            operate:0,
        }).then(res=>{
            if(res.data.status){
                api.get(inter.MessageUnRead).then(res=>{
                })
            }
        })
        

        if(msg.url.substring(0,4) == 'http'){
            let adl = encodeURIComponent(msg.url)
                let dl = decodeURIComponent(msg.url)
                Taro.navigateTo({ url: menu.adWebView + '?link=' + `${adl}` })
        }else{
            Taro.navigateTo({
                url:menu.msgDesc+'?msg=' + encodeURIComponent(JSON.stringify(msg))
            })
        }
    }

    loaddata(){
        var self = this
        const {page} = self.state
        self.props.getUserRemind({
            page:page
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
        
        let {page,pages} = this.state

        if(page < pages){
            this.page = this.page + 1
            self.props.getUserRemind({
                page:page+1
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
            message_ids:0,
            operate:0,
        }).then(res=>{
            if(res.data.status){
                that.setState({
                    page:0,
                    items:[]
                },()=>{
                    that.getUserRemind()
                })
            }
        })
    }

    render () {
        
        const {loadding,items} = this.state

        console.log(items,'???')
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
                                            <Image src={asset.sysIcon} className='headCover' />
                                            {
                                                msg.status == 0 ?
                                                <View className='headDot'></View>
                                            :null}
                                        </View>
                                        <Text style={msg.status == 0 ? {fontSize:'32rpx',color:'#000000',fontWeight:'bold'} : {fontSize:'28rpx',color:'#999999' }} >{msg.title}</Text>
                                    </View>
                                    <View className='d_flex fd_c pb_10'>
                                        <Text className='default_label  mt_5 lh20_label' style={msg.status == 0 ? {color:'#666666'} : {color:'#999999'}}>{msg.content}</Text>
                                        <Text className='sm_label tip_label mt_5'>{msgTime(msg.pubTime)}</Text>
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


export default RemindList as ComponentClass