import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image} from '@tarojs/components'


import { percent2percent25} from '../../../utils/common'

import menu from '../../../config/menu';
import api from '../../../services/api'
import inter from '../../../config/inter'
import  '../../../config/theme.css';
import './flash.less'

import { connect } from '@tarojs/redux'
import { mailType } from '../../../constants/mailType'

import {
    getExGifts
} from '../../../actions/mail'

type PageStateProps = {
    mail: mailType,
    getExGifts:{},
}

type PageDispatchProps = {
    getExGifts:(object) => any,
}

type PageOwnProps = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

type PageState = {
    exGiftList:Array<{}>,
    page:number,
    pages:number,
    total:number,
    sortOrder:number,
    type:number,
}

interface flash {
    props: IProps;
}

@connect(({ mail }) => ({
    mail:mail
  }), (dispatch) => ({
    getExGifts(object){
        dispatch(getExGifts(object))
    }
}))

class flash extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '限时抢购列表',
        enablePullDownRefresh: true
    }
    page: number
    pages: number

    constructor () {
        super(...arguments)

        this.page = 0;
        this.pages = 0;
        
        this.state = {
            exGiftList:[],
            page:0,
            pages:0,
            total:0,
            sortOrder:0,
            type:0,
        }
    }

    componentWillReceiveProps (nextProps) {
        const {mail} = nextProps
        const {exGifts} = mail

        const {exGiftList} = this.state

        if(mail !== this.props.mail){

            if(this.page == 0 ){
                this.page = exGifts.page
                this.pages = exGifts.pages
                var fList:any= exGifts.items
            } else {
                var fList:any= exGiftList.concat(exGifts.items)
            }

            this.setState({
                exGiftList:fList,
                page:exGifts.page,
                pages:exGifts.pages,
                total:exGifts.total,
            })

        }
    }

    componentWillMount () {

        const {title,type} = this.$router.params

        Taro.setNavigationBarTitle({
            title: title,
        })

    }

    componentDidMount () { 

        var that = this
        const {title,type} = this.$router.params
        if(type){
            this.setState({
                type:parseInt(type)
            })
        }
        if(type=='1'){
            api.get(inter.shopSearch, {
                category_id: '',
                ccategory_id: '',
                keyword: '',
                time_limit: 0,
                gtype: 0,
                sortOrder: this.state.sortOrder,
                page: 0,
            }).then((res) => {
                if (res.data.status) {
                    that.setState({
                        exGiftList:res.data.data.items,
                        page:res.data.data.page,
                        pages:res.data.data.pages,
                        total:res.data.data.total,
                    })
                }
            })
        }else{
            that._getExGifts();
        }
    }

    componentWillUnmount () {

    }
    
    componentDidShow () { }
    componentDidHide () { }

    _getExGifts(){
        const{sortOrder}=this.state
        var that = this ;

        that.props.getExGifts({
            page:this.page,
            sortOrder:sortOrder
        })

    }
    _goodsDesc(item){
        api.post(inter.inuserLogs,{
            logType:3,
            type:3,
            content_id:item.goodsId,
            from:1
        }).then(res=>{})
        Taro.navigateTo({
            url:menu.mailDesc+ "?goods_id=" + item.goodsId + "&goodsName=" + percent2percent25(item.goodsName)
        })
    }

    // 下拉
    onPullDownRefresh(){
        var self = this
        this.page = 0 ;

        self.setState({
            page:0,
            exGiftList:[]
        },()=>{
            if(this.state.type==0){
                self._getExGifts();
            }else{
                api.get(inter.shopSearch, {
                    category_id: '',
                    ccategory_id: '',
                    keyword: '',
                    time_limit: 0,
                    gtype: 0,
                    sortOrder: this.state.sortOrder,
                    page: 0,
                }).then((res) => {
                    if (res.data.status) {
                        this.setState({
                            exGiftList:res.data.data.items,
                            page:res.data.data.page,
                            pages:res.data.data.pages,
                            total:res.data.data.total,
                        })
                    }
                })
            }
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }


    //上拉
    onReachBottom(){
        var self = this;
        
        const {page,pages,sortOrder,type,exGiftList} = self.state
        
        if(page < pages){
            this.page = this.page + 1
            if(type==0){
                self.props.getExGifts({
                    page:page + 1,
                    sortOrder:sortOrder
                })
            }else{
                api.get(inter.shopSearch, {
                    category_id: '',
                    ccategory_id: '',
                    keyword: '',
                    time_limit: 0,
                    gtype: 0,
                    sortOrder: sortOrder,
                    page: page+1,
                }).then((res) => {
                    if (res.data.status) {
                        let exGifts=res.data.data
                        if(this.page == 0 ){
                            this.page = exGifts.page
                            this.pages = exGifts.pages
                            var fList:any= exGifts.items
                        } else {
                            var fList:any= exGiftList.concat(exGifts.items)
                        }
            
                        this.setState({
                            exGiftList:fList,
                            page:exGifts.page,
                            pages:exGifts.pages,
                            total:exGifts.total,
                        })
                    }
                })
            } 
        } 
    }
    
    render () {
        const {exGiftList,sortOrder} = this.state

        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }  catch (e) {
            
        }

        return (
            <View className='wrap'>
                 <View className='tops'>
                    <View onClick={()=>{
                        this.setState({
                            sortOrder:0
                        },()=>{
                            this._getExGifts()
                        })
                    }}>
                        <View className='tipe'>最新</View>
                        <View className='tipe'>
                            {
                                sortOrder==0?
                                <View className='ude'></View>
                                :
                                <View></View>
                            }
                        </View>
                    </View>
                    <View onClick={()=>{
                        this.setState({
                            sortOrder:1
                        },()=>{
                            this._getExGifts()
                        })
                    }}>
                        <View className='tipes'>最热</View>
                        <View className='tipe'>
                        {
                                sortOrder==1?
                                <View className='ude'></View>
                                :
                                <View></View>
                            }
                        </View>
                    </View>
                </View>
               <View className='recommBox pl_15 pr_15'>
                        {
                            exGiftList.map((item:any,index)=>{
                                return(
                                    <View key={'cates' + index} className='rcomItem' 
                                        style={{width:((windowWidth-46)/2).toFixed(0)+ 'px'}}
                                        onClick={this._goodsDesc.bind(this,item)}
                                    >
                                        <Image  
                                            className='catesCover'
                                            src={item.goodsImg}
                                            mode='aspectFit'
                                            style={{width:((windowWidth-46)/2).toFixed(0)+ 'px',height:((windowWidth-46)/2).toFixed(0)+ 'px'}}
                                        />
                                        <View className='pl_10 pr_10 d_flex fd_c'>
                                            <Text className='c33_label default_label mt_5 dup_per_txt'>{item.goodsName}</Text>
                                            {/* <View className='d_flex fd_r jc_sb mt_15'>
                                                <Text className='sred_label sm_label fw_label'>{item.goodsIntegral}学分</Text>
                                                <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                            </View> */}
                                            {
                                                    item.gtype == 1 ?
                                                        <View className='d_flex fd_r jc_sb mt_15'>
                                                            <Text className='sred_label default_label fw_label'>免费</Text>
                                                            <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                                        </View>
                                                        : item.gtype == 2 ?
                                                            <View className='d_flex fd_r jc_sb mt_15'>
                                                                <Text className='sred_label default_label fw_label'>¥{item.goodsAmountDTO.goodsAmount?item.goodsAmountDTO.goodsAmount:item.goodsAmount}</Text>
                                                                <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                                            </View>
                                                            : item.gtype == 3 ?
                                                                <View className='d_flex fd_r jc_sb mt_15'>
                                                                    <Text className='sred_label default_label fw_label'>{item.goodsIntegral}学分</Text>
                                                                    <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                                                </View>
                                                                : item.gtype == 4 ?
                                                                    <View className='d_flex fd_r jc_sb mt_15'>
                                                                        <Text className='sred_label default_label fw_label'>¥{item.goodsAmount}+{item.goodsIntegral}学分</Text>
                                                                        <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                                                    </View>
                                                                    : null
                                                }
                                        </View>
                                        {/* <View className='tips'>
                                            <Text className='smm_label white_label'>限时抢购</Text>
                                        </View> */}
                                        
                                    </View>
                                )
                            })
                        }
                    </View>
            </View>
        )
    }
}

export default flash as ComponentClass