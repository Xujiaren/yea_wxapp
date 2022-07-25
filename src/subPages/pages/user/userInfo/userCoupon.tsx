import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image,} from '@tarojs/components'


import inter from '../../../../config/inter'
import api from  '../../../../services/api'


type PageState = {
    list:Array<{
        "ucId": number,
        "couponId": number,
        "couponName": string,
        "couponType": number,
        "code": string,
        "userId": number,
        "amount": number,
        "requireAmount": number,
        "orderId": number,
        "pubTime": number,
        "beginTime": number,
        "endTime": number,
        "ctype": number,
        "contentId": number,
        "isPlus": number,
        "from": number,
        "status": number,
    }>,
    status:number,
    page:number,
    pages:number,
    type:number,
    coupons:any,
    price:number,
}

import Coupon from '../../../components/coupon/Coupon'
import Tabs from '../../../../components/Tabs'
import asset from '../../../config/asset'


import  '../../../../config/theme.css';
import './userCoupon.less'
import { Router } from '@tarojs/router'




class userCoupon extends Component<{}, PageState> {

    // eslint-disable-next-line react/sort-comp

    config = {
        navigationBarTitleText: '优惠券',
        enablePullDownRefresh: true
    }
    page: number
    pages: number
    itemtype: any

    constructor () {
        super(...arguments)

        this.page = 0;
        this.pages = 0;
        this.itemtype = null;
        
        this.state = {
            list:[],
            status:0,
            page:0,
            pages:0,
            type:0,
            coupons:[],
            price:0,
        }
    }

    componentWillMount () {
        var that = this ;
        const{type,coupons,price}=that.$router.params
        let coup = JSON.parse(coupons)
        that.setState({
            type:parseInt(type),
            coupons:coup,
            price:parseInt(price)
        })
    }

    componentDidMount () { 
        this._getCoupon();
    }

    componentWillUnmount () {

    }
    
    componentDidShow () { }
    componentDidHide () { }

    _getYcCoupon(){
        var that = this;
        const {list,coupons,type} = that.state;

        api.get(inter.userYccoupon,{
            page:this.page
        }).then((res)=>{
            if(res.data.status){
                let ycCoupon = res.data.data ;

                console.log(res.data.data)

                if(this.page === 0 ){
                    this.page = ycCoupon.page
                    this.pages = ycCoupon.pages
                    var fList:any= ycCoupon.items
                } else {
                    var fList:any= list.concat(ycCoupon.items)
                }
    
                this.itemtype = [];
    
                that.setState({
                    list:fList,
                    page:ycCoupon.page,
                    pages:ycCoupon.pages,
                })
            }
        })
    }

    _getCoupon(){

        var that = this;
        const {status,list} = that.state;

        api.get(inter.userCoupon,{
            status:status,
            page:this.page,
        }).then((res)=>{
            console.log(res)
            let data = res.data.data ;

            if(this.page === 0 ){
                this.page = data.page
                this.pages = data.pages
                var fList:any= data.items
            } else {
                var fList:any= list.concat(data.items)
            }

            this.itemtype = [];

            that.setState({
                list:fList,
                page:data.page,
                pages:data.pages,
            })

            
        })
    }
    _getYoucong=()=>{
        var that = this;
        const {list} = that.state;
        api.get(inter.userYccoupon,{
            page:this.page
        }).then(res=>{
            console.log(res)
            let data = res.data.data ;

            if(this.page === 0 ){
                this.page = data.page
                this.pages = data.pages
                var fList:any= data.items
            } else {
                var fList:any= list.concat(data.items)
            }

            this.itemtype = [];

            that.setState({
                list:fList,
                page:data.page,
                pages:data.pages,
            })
        })
    }

    _onSelect = (index) => {
        var that = this ;

        this.page = 0;

        that.setState({
            status:index,
            page:0,
        },()=>{
            if(index === 2){
                that._getYcCoupon();
                // that._getYoucong()
            } else {
                that._getCoupon();
            }
        })
    }

    // 拷贝油葱码
    _onCopy = (msg) => {
        Taro.setClipboardData({
            data: msg,
        }).then((res)=>{
            console.log(res);
        })
    }


    onPullDownRefresh(){
        var self = this
        const {status} = self.state;
        self.itemtype = null;
        this.page = 0 ;

        self.setState({
            page:0,
            list:[]
        },()=>{
            if(status === 2){
                self._getYcCoupon();
                // self._getYoucong()
            } else {
                self._getCoupon();
            }
           
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }

 
    onReachBottom(){
        var self = this;
        
        const {page,pages,status} = self.state

        if(page < pages){
            this.page = this.page + 1

            if(status === 2){
                self._getYcCoupon();
                // self._getYoucong()
            } else {
                self._getCoupon();
            }
        }
    }
    onOk=(val)=>{
        const{type,coupons,price}=this.state
        console.log(price,'aaaaaaaa',coupons)
        if(type==2){
            if(coupons.filter(item=>item==(val.couponId).toString()).length==0){
                Taro.showToast({
                    title:'不可使用',
                    icon:'none',
                    duration:1000
                })
            }else{
                if(val.ctype==3){
                    if(price>=val.requireIntegral){
                        let pages = Taro.getCurrentPages(); // 获取当前的页面栈 
                        let prevPage = pages[pages.length-2];
                        prevPage.setData({ //设置上一个页面的值
                            couponId: val.couponId,
                            amount:val.integral
                        });
                        Taro.navigateBack({
                            delta: 1
                        });  
                    }else{
                        Taro.showToast({
                            title:'满'+val.requireIntegral+'才能使用',
                            icon:'none',
                            duration:1000
                        })
                    }
                }else{
                    if(price>=val.requireAmount){
                        let pages = Taro.getCurrentPages(); // 获取当前的页面栈 
                        let prevPage = pages[pages.length-2];
                        prevPage.setData({ //设置上一个页面的值
                            couponId: val.couponId,
                            amount:val.amount
                        });
                        Taro.navigateBack({
                            delta: 1
                        });  
                    }else{
                        Taro.showToast({
                            title:'满'+val.requireAmount+'元才能使用',
                            icon:'none',
                            duration:1000
                        })
                    }
                }
               
                
            }  
        }
    }

    
    render () {
        const {list,status,type,coupons} = this.state;

        let windowWidth = 500
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }  catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        // console.log(list)
        // ytype  0 待使用  1 已失效   ttype 0 待使用 1 已使用
        let lst:any = []
        if(type>0){
            if(coupons.length>0){
                coupons.map(item=>{
                    lst=lst.concat(list.filter(itm=>itm.couponId==item)[0])
                })
            }
        }else{
            lst=list
        }
        console.log(lst,'????')
        return (
            <View className='wrap'>
               
                <View className='headbox'>
                    <View className='atabs'>
                        <Tabs items={['待使用','已失效','油葱券']} atype={0} selected={status} onSelect={this._onSelect} />
                    </View>
                </View>

                
                <View className='couBox'>
                    {
                       lst.length > 0 ? 
                        <View className='d_flex fd_c ai_ct m_20'>
                            {
                                lst.map((ls,index)=>{
                                    return(
                                        <View key={'ls' + index} style={{width:'100%'}}>
                                            {
                                                status === 0 && ls.status === 0 ?
                                                <View onClick={this.onOk.bind(this,ls)}>
                                                    <Coupon  onCopy={this._onCopy} data={ls} type={status} />
                                                </View>
                                            :null}
                                            {
                                                status === 1  &&  (ls.status === 2 ||  ls.status === 1) ? 
                                                <Coupon  onCopy={this._onCopy}  data={ls} type={status}  />
                                            :null}
                                            
                                            {
                                                status === 2 ?
                                                <Coupon  onCopy={this._onCopy} data={ls} type={status}/>
                                            :null}

                                            {/* {
                                                status === 2 && ls.status === 3 ?
                                                <Coupon  onCopy={this._onCopy} data={ls} type={status} />
                                            :null} */}
                                        </View>
                                    )
                                })
                            }
                        </View>
                    :null}
                    {
                        list.length === 0 && this.itemtype !== null ?
                        <View className='img_box'>
                            <Image src={asset.pf_coupon} className='nulldata' />
                        </View> 
                    :null}
                </View>
                
            </View>
        )
    }

}

export default userCoupon as ComponentClass