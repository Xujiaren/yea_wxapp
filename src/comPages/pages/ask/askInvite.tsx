import { ComponentClass } from 'react'
import Taro, { Component, showToast, } from '@tarojs/taro'
import { View ,Text,Image,Button} from '@tarojs/components'


import  asset from '../../../config/asset'
import menu from '../../../config/menu'
import inter from '../../../config/inter'
import api from '../../../services/api'

import Tabs from '../../../components/Tabs'

import  '../../../config/theme.css';
import './askInvite.less'


type PageState = { 
    content:string,
    list:Array<any>,
    status:number,
    askId:number,
    title:string,
    img:string,
    page: number,
    pages: number,
    focustList:any
}


class askInvite extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '邀请回答',
        enablePullDownRefresh:true
    }

    page: number;
    pages: number;
    constructor (props) {
        super(props)
        this.page = 1;
        this.pages = 1;
        this.state = {
            content:'',
            list:[],
            status:0,
            askId:0,
            title:'',
            img:'',
            page: 1,
            pages: 1,
            focustList:[]
        }

    }

    componentWillMount () {   

        var that = this;


        const {askId,title,img} = that.$router.params;

        that.setState({
            askId:parseInt(askId),
            title:title,
            img:img,
        },()=>{
            that.getTeacher()
        })
    }

    componentDidMount () { 

        var that = this;
        that._getInvite();
        
    }

    componentWillUnmount () {
        
    }
    
    componentDidHide () { }
    getTeacher=()=>{
        const{focustList,askId}=this.state
        api.get(inter.follow, {
            ask_id:askId,
            ctype: 1,
            page: this.page
        }).then((res) => {
            if (res.data.status) {
                let fLists = res.data.data;
                if (this.page === 1) {
                    var tList = fLists.items
                } else {
                    var tList: any = focustList.concat(fLists.items)
                }
                this.setState({
                    focustList: tList,
                    page: fLists.page,
                    pages: fLists.pages,
                })
            }
        })
    }

    _getInvite(){
        
        var that  = this ;
        const {askId} = that.state;

        api.get(inter.askfollows,{
            ask_id:askId
        }).then((res)=>{
            if(res.data.status){

                that.setState({
                    list:res.data.data
                })
            }
        })
    }

    //  下啦刷新
    onPullDownRefresh(){
        var that = this;

        Taro.showNavigationBarLoading();

        that._getInvite();

        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }

    _onSelect = (e) => {

        var that = this;
        that.setState({
            status:e
        })

    }

    // 分享详情页
    onShareAppMessage = (ops) => {

    
        var that = this ;
        const {title,img,askId} = that.state;

        if (ops.from === 'button') {
            // 来自页面内转发按钮
            // console.log(ops.target)
        }
        return {

            title: title,
            path: menu.question + '?askId=' + askId,
            imageUrl:img,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }

    _onInvite = (item) => {

        var that = this ;
        const {askId,status} = that.state ;
        if(status==1){
            if(item.askInvite==false){
                Taro.showModal({
                    title: '提示',
                    content: '是否邀请讲师'+item.teacherName,
                    success: function (res) {
                        if (res.confirm) {
                            api.post(inter.askAnswerInvite,{
                                ask_id:askId,
                                target_uid:item.userId,
                                ctype:status
                            }).then((res)=>{
                                console.log(res,'???')
                                if(res.data.status){
                                    Taro.showToast({
                                        title:'邀请成功',
                                        icon:'none',
                                        duration:2000,
                                    })
                                    that.getTeacher()
                                    // setTimeout(() => {
                                    //     Taro.navigateBack({
                                    //         delta:1
                                    //     })
                                    // }, 2000);
                
                                }
                            })
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                })
            }
        }else{
            if(!item.isInvite){

                api.post(inter.askAnswerInvite,{
                    ask_id:askId,
                    target_uid:item.userId,
                    ctype:status
                }).then((res)=>{
                    if(res.data.status){
                        Taro.showToast({
                            title:'邀请成功',
                            icon:'success',
                            duration:1000,
                        })
    
                        that._getInvite();
    
                    }
                })
            }
        }
    }
    onReachBottom() {
        var self = this;

        const { page, pages, status } = self.state
        if(status==1){
            if (page < pages) {
                this.page = this.page + 1
                self.getTeacher();
            }
        }
      
    }

    render () {

        const {list,status,focustList} = this.state;

        return (
            <View className='wrap fade '>
                <View className='atabs'>
                    <Tabs items={['推荐','讲师', '好友']} atype={1} selected={status} onSelect={this._onSelect} />
                </View>

                <View>
                    {
                        status === 0 ?
                        <View>

                            <View className='d_flex fd_r jc_ct pt_15 pb_15'>
                                <Text className='default_label tip_label'>你可以邀请下面用户快速获得回答</Text>
                            </View>
                            <View className='pl_15 pr_15'>
                                {
                                    list.map((item,index)=>{
                                        return(
                                            <View className='item_box d_flex fd_r jc_sb  ai_ct pt_15 pb_15' key={'item' + index}>
                                                <View className='d_flex fd_r ai_ct'>
                                                    <Image  src={item.avatar} className='invt_cover' />
                                                    <Text className='default_label c33_label fw_label pl_10'>{item.nickname}</Text>
                                                </View>
                                                <View className={item.isInvite ? 'invt_btn  d_flex ai_ct jc_ct' : 'invt_btns  d_flex ai_ct jc_ct'}  onClick={this._onInvite.bind(this,item)}>
                                                    <Text className={item.isInvite ? 'tip_label default_label fw_label' :'sred_label default_label fw_label' }>{item.isInvite ?  '已邀请' : '邀请'}</Text>
                                                </View>
                                                
                                            </View>
                                        )
                                    })
                                }
                            </View>

                        </View>
                    :status==1?
                    <View>

                    <View className='d_flex fd_r jc_ct pt_15 pb_15'>
                        <Text className='default_label tip_label'>你可以邀请关注的讲师速获得回答</Text>
                    </View>
                    <View className='pl_15 pr_15'>
                        {
                            focustList.map((item,index)=>{
                                return(
                                    <View className='item_box d_flex fd_r jc_sb  ai_ct pt_15 pb_15' key={'item' + index}>
                                        <View className='d_flex fd_r ai_ct'>
                                            <Image  src={item.teacherImg} className='invt_cover' />
                                            <Text className='default_label c33_label fw_label pl_10'>{item.teacherName}</Text>
                                        </View>
                                        <View className={item.isInvite ? 'invt_btn  d_flex ai_ct jc_ct' : 'invt_btns  d_flex ai_ct jc_ct'}  onClick={this._onInvite.bind(this,item)}>
                                            <Text className={item.isInvite ? 'tip_label default_label fw_label' :'sred_label default_label fw_label' }>{item.askInvite ?  '已邀请' : '邀请'}</Text>
                                        </View>
                                        
                                    </View>
                                )
                            })
                        }
                    </View>

                </View>
                    :
                    
                        <View>
                            <View className='d_flex fd_c ai_ct'  style={{marginTop:100 + 'rpx'}}>

                                <Text className='black_label default_label'>邀请微信好友来回答</Text>
                                <Button open-type='share' className="d_flex fd_c ai_ct mt_30 share_btn"  onShareAppMessage={this.onShareAppMessage}>
                                    <Image src={asset.wechat_icon} className='cover' />
                                    <Text className='sm_label gray_label mt_10'>微信好友</Text>
                                </Button>

                            </View>
                        </View>
                    }
                </View>
                
            </View>
        )
       
    }
}

export default askInvite as ComponentClass