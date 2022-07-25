import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image} from '@tarojs/components'

import asset from '../../../config/asset'
import asset1 from '../../config/asset'

import inter from '../../../config/inter'
import menu from '../../../config/menu';
import api from '../../../services/api'

import  '../../../config/theme.css';
import './settlement.less'


  
type PageState = {
    adsData:{
        address: string,
        addressId: number,
        addressName: string,
        city: string,
        district: string,
        isFirst: number,
        mobile: string,
        province: string,
        realname: string,
        userId: number
    },
    cartIds:Array<any>,
    totalAmount:string,
    disAmount:string,
    allAmount:string,
    mock_cartIds:object,
    order_act:object,
    mailCart:Array<{}>,

    freightAmount:number, // 运费价格
    totalNumber:number, // 总共件数

    finalPrice:number, // 最终价格
    order_obj:object,

    payId:number,
    list:Array<number>,
    couponId:number,
    amount:number,
    isFrees:Array<any>,
    goodIds:Array<any>,
    ttyps:number
}

class settlement extends Component<{}, PageState> {

    config = {
        navigationBarTitleText: '购物车'
    }

    activitys: any[]
    mailCart: any[]

    constructor () {
        super(...arguments)

        this.mailCart = [];
        this.activitys = [];

        this.state = {
            adsData:{},
            cartIds:[],
            totalAmount:'',
            disAmount:'',
            allAmount:'',
            mock_cartIds:{},
            order_act:{},
            mailCart:[],

            order_obj:{},

            freightAmount:0, // 运费价格
            totalNumber:0, // 总共件数

            finalPrice:0, // 最终价格

            payId:0, //  2 微信支付
            list:[],
            couponId:-1,
            amount:0,
            isFrees:[],
            goodIds:[],
            ttyps:0
        }

        this._act_list = this._act_list.bind(this);
        this._SelectPay = this._SelectPay.bind(this); 
        this._freight = this._freight.bind(this);
        this._shipAmount = this._shipAmount.bind(this);
        this._onPay = this._onPay.bind(this);
    }

    

    componentWillMount () {
        var that = this;

        const {cartIds,totalAmount,disAmount,allAmount,mock_cartIds,order_act,goodIds} = that.$router.params;
        this.setState({
            cartIds:JSON.parse(cartIds),
            totalAmount:totalAmount,
            disAmount:disAmount,
            allAmount:allAmount,
            mock_cartIds:JSON.parse(mock_cartIds),
            order_act:JSON.parse(order_act),
        })
        var plist=[]
        var isFrees=[]
        JSON.parse(cartIds).map((item)=>{
            api.get(inter.shopDesc+parseInt(item))
            .then(res=>{
                var datas = res.data.data
                plist=plist.concat(datas.couponList.map(item=>item==item?item.couponId:null))
                this.setState({
                    list:plist,
                })
            })
        })
        JSON.parse(goodIds).map((item)=>{
            api.get(inter.shopDesc+parseInt(item))
            .then(res=>{
                console.log(res)
                var datas = res.data.data
                isFrees=isFrees.concat(datas.isFree)
                this.setState({
                    isFrees:isFrees
                })
            })
        })

    }

    componentDidMount () { 
        var that = this 
        that._getAddress()
        that.shopCart()
        that.shopSet();
    }

    componentWillUnmount () {

    }
    
    componentDidShow () { 
        var that = this ;

        let pages = Taro.getCurrentPages();
        let currPage = pages[pages.length - 1]; // 获取当前页面
        if (currPage.__data__.adsData) { // 获取值
            this.setState({ 
                adsData: currPage.__data__.adsData 
            },()=>{
                that._freight();
            })
        }
        if (currPage.__data__.couponId) { // 获取值
            // console.log(currPage.__data__.couponId,'?????????')
            this.setState({ 
                couponId: currPage.__data__.couponId,
                amount: currPage.__data__.amount
            })
          } 

    }

    componentDidHide () { }

    //
    shopSet(){

        var that = this ;
        api.get(inter.shopSet)
        .then((res)=>{
            if(res.data.status){

                let setShop = res.data.data;
                that.activitys = setShop.activity;
            }
        })

    }


    // 购物车
    shopCart(){

        var that = this ;
        const {cartIds} = that.state;

        api.get(inter.shopCart)
        .then((res)=>{
            if(res.data.status){

                let cart_arr:any = [];
                let mailCart = res.data.data;
                
                for(let i = 0 ; i < mailCart.length ; i++){

                    if(cartIds.indexOf(mailCart[i].cartId + '') > -1){
                        cart_arr.push(mailCart[i]);
                    }
                }

                this.mailCart = cart_arr;

                this.setState({
                    mailCart:cart_arr
                },()=>{
                    that._act_list();
                    that._freight();
                })
                
            }
        })
    }

    // 选择支付方式
    _SelectPay(type){
        
        var that = this;
        that.setState({
            payId:type
        })
    }

    // 地址
    _getAddress(){
        var that = this;
        api.get(inter.Address)
        .then((res)=>{
            if(res.data.status){
                let adres = res.data.data;
                adres.map((addr, index) => {
                    if (addr.isFirst == 1) {
                        that.setState({
                            adsData:addr
                        },()=>{
                            that._freight();
                        })
                    }
                })
            }
        })
    }

    // 活动
    _act_list(){
        var that = this ;
        const {order_act} = that.state;

        let order_arr = Object.entries(order_act);

        for(let i = 0 ; i < order_arr.length ; i++){
            if(order_arr[i][1] === 0){
                order_arr.splice(i,1)
            }
        }

        let order_obj =  Object.fromEntries(order_arr);

        that.setState({
            order_obj:order_obj
        })
    }

    
    // 计算运费
    _freight(){

        var that = this.state;
        const {adsData,cartIds,mailCart,mock_cartIds,isFrees} = this.state;

        let goodsIds =  Object.keys(mock_cartIds); // 包含的cartids 
        let allWeight = 0 ;

        if(Object.keys(adsData).length > 0){

            let province = '';
            let city = '';

            if(adsData.province.indexOf('上海') > -1 || adsData.province.indexOf('北京') > -1 || adsData.province.indexOf('天津') > -1 || adsData.province.indexOf('重庆') > -1){
                province = adsData.province.replace("市","");

            } else if(adsData.province.indexOf('广西') > -1){
                province = '广西';
            } else if(adsData.province.indexOf('内蒙古') > -1){
                province = '内蒙古';
            } else if(adsData.province.indexOf('广西') > -1){
                province = '广西';
            } else if(adsData.province.indexOf('西藏') > -1){
                province = '西藏';
            } else if(adsData.province.indexOf('宁夏') > -1){
                province = '宁夏';
            } else if(adsData.province.indexOf('新疆') > -1){
                province = '新疆';
            } else {
                province = adsData.province.substr(0,adsData.province.length - 1);
            }

            if(adsData.city.indexOf('上海') > -1 || adsData.city.indexOf('北京') > -1 || adsData.city.indexOf('天津') > -1 || adsData.city.indexOf('重庆') > -1){
                city = adsData.city;
            } else if(adsData.city.indexOf('市') > -1){
                city = adsData.city.substr(0,adsData.city.length - 1);
            } else if(adsData.city.indexOf('地区') > -1){
                city = adsData.city.substr(0,adsData.city.length - 2);
            } else if(adsData.city.indexOf('盟') > -1){
                city = adsData.city.substr(0,adsData.city.length - 1);
            } else if(adsData.province.indexOf('海南') > -1){
                if(adsData.district.indexOf('黎族苗族') > -1){
                    city = adsData.district.substr(0,adsData.district.length - 7);
                } else {
                    city = adsData.district.substr(0,adsData.district.length - 1);
                }
            } else if(adsData.province.indexOf('新疆') > -1){

                if(adsData.city.indexOf('回族自治州') > -1){
                    city = adsData.city.substr(0,adsData.city.length - 5);
                } else if(adsData.city.indexOf('蒙古自治州') > -1){
                    city = adsData.city.substr(0,adsData.city.length - 5);
                } else if(adsData.city.indexOf('哈萨克自治州') > -1){
                    city = adsData.city.substr(0,adsData.city.length - 6);
                } else if(adsData.city.indexOf('哈萨克自治州') > -1){
                    city = adsData.city.substr(0,adsData.city.length - 6);
                } else if(adsData.city.indexOf('自治区直辖县级行政区') > -1){
                    city = adsData.district.substr(0,adsData.district.length - 1);
                } else if(adsData.city.indexOf('克孜勒苏柯尔克孜') > -1){
                    city = '克孜勒苏柯尔克孜';
                }

            }

            for(let i = 0 ; i < mailCart.length ; i++ ){
                // console.log(isFrees,"???????")
                if(!mailCart[i].freeShip&&isFrees[i]!=1){
    
                    if(goodsIds.indexOf(mailCart[i].cartId + '') > -1){
                        allWeight += mailCart[i].goodsWeight * mailCart[i].goodsNumber;
                    }
    
                }
            }
            console.log(allWeight)
            if(isFrees.filter(item=>item!=1).length>0){
                this._shipAmount(province,city,allWeight);
            }
        }

        

        

    }

    _shipAmount(province,city,allWeight){
        api.get(inter.shipAmount,{
            province:province,
            city:city,
            goods_weight:allWeight,
        }).then((res)=>{
            if(res.data.status){
 
                this.setState({
                    freightAmount:res.data.data,
                })

            } else {
                Taro.showToast({
                    title:res.data.message,
                    icon:'none',
                    duration:1000
                })
            }
        })
    }

    _onPay(){

        var that = this;
        const {payId,goodsAttrIds,couponId,goods_id,adsData,totalNumber,mock_cartIds} = that.state;

        let vaild = true;
        let msg = '';
        let cartIds =  Object.keys(mock_cartIds); // 包含的cartids 

        if(Object.keys(adsData).length === 0 ){
            vaild = false;
            msg = '请选择地址';
        } else if(payId === 0){
            vaild = false;
            msg = '请选择支付方式';
        }

        if(vaild){

            api.post(inter.orderSubmit,{
                buy_type:1,
                pay_type:9,
                cart_ids:cartIds,
                goods_number:totalNumber,
                attr_ids:'',
                coupon_id:couponId,
                address_id:adsData.addressId,
                remark:''
            }).then((res)=>{
                console.log(res)
                if(res.data.status){
                    let pay = res.data.data.pay_info;
                    if(pay=='already_payed'){
                        Taro.showToast({
                            title:'已支付',
                            icon:'success',
                            duration:2000,
                        })
                    }else{
                        Taro.requestPayment({
                            timeStamp:(pay.timeStamp).toString(),
                            nonceStr: pay.nonceStr,
                            package: pay.package,
                            signType: 'MD5',
                            paySign: pay.sign,
                            success: function (res) { 
                                Taro.showToast({
                                    title:'支付成功',
                                    icon:'success',
                                    duration:2000,
                                })
                                that.setState({
                                    ttyps:1
                                })
                                setTimeout(() => {
                                    Taro.redirectTo({
                                        url: menu.mailOrder
                                    })
                                }, 2000);
                                // const data ={
                                //     "keyword1": {
                                //         "value": orderdesc.goods_info.goods_name, 
                                //     }, 
                                //     "keyword2": {
                                //         "value": orderdesc.total.price+'元', 
                                //     } , 
                                //     "keyword3": {
                                //         "value": moment(Date.parse(new Date())).format("YYYY-MM-DD HH:mm:ss"), 
                                //     } , 
                                //     "keyword4": {
                                //         "value": "已支付", 
                                //     } 
                                // }
                                // const jsondata = JSON.stringify(data);
                                // api.post('sendmess',{
                                //     backend:0,
                                //     template_id:'POtCI29lnf8Ae18mfZyhf607ltCLWLbK3H8nUmw07Vk',
                                //     form_id:e.detail.formId,
                                //     u_id:this.state.userhead.user_id, 
                                //     send_data:jsondata
                                // }).then(res=>{
                                //     console.log(res);
                                // })
    
                                
                            },
                            fail: function (res) { 
                                console.log(res)
                                setTimeout(() => {
                                    Taro.redirectTo({
                                        url: menu.mailOrder
                                    })
                                }, 500);
                            }
                        })
                    }
                }
            })
            



        } else {

            Taro.showToast({
                title:msg,
                icon:'none',
                duration:1000,
            })
        }

    }
    onCoupon=()=>{
        const{list,allAmount}=this.state
        Taro.navigateTo({
            url:menu.userCoupon+'?type=2'+'&price='+allAmount+'&coupons='+JSON.stringify(list)
        })
    }
 
    render () {
        const {adsData,payId,freightAmount,couponId,amount,finalPrice,order_obj,totalAmount,allAmount,isFrees} = this.state;

        let pay_prices  = totalAmount * 1 + freightAmount * 1;

        return(
            <View className='wrap'>
               <View className='addres'>
                    <Image src={asset1.ads_head} className='ads_side' />
                    
                    <View className='order_ads d_flex fd_r ai_ct'
                        onClick={()=>Taro.navigateTo({url:menu.address + '?nageType=1'})}
                    >
                        <Image src={asset1.location} className='ads_img' />
                        {
                            Object.keys(adsData).length > 0 ? 
                            <View className='d_flex fd_c ml_15'>
                                <Text className='c33_label default_label fw_label'>{adsData.realname} {adsData.mobile}</Text>
                                <Text className='gray_label default_label'>{adsData.province + adsData.city + adsData.district + adsData.address}</Text>
                            </View>
                        :
                            <View className='d_flex fd_c ai_ct ml_15'>
                                <Text className='gray_label default_label'>请选择地址</Text>
                            </View>
                        }
                    </View>
                    <Image src={asset1.ads_head} className='ads_side' />
               </View>

               <View className='mt_10 bg_white'>

                    <View className='itemLists pl_15 pr_15' >
                        {
                            this.mailCart.map((cart,index)=>{
                                return(
                                    <View className='itemList d_flex pt_15 pb_10' key={'cart' + index}>
                                        <Image src={cart.goodsImg} className='itemCover' />
                                        <View className='d_flex fd_c jc_sb col_1'>
                                            <View className='d_flex fd_c'>
                                                <Text className='c33_label default_label fw_label'>{cart.goodsName}</Text>
                                                <Text className='tip_label default_label'>{cart.goodsAttr}</Text>
                                            </View>
                                            <View className='d_flex fd_r jc_sb'>
                                                <Text className='default_label sred_label fw_label'>¥{cart.goodsAmountDTO.goodsAmount?cart.goodsAmountDTO.goodsAmount:cart.goodsAmount}</Text>
                                                <Text className='sm_label black_label'>x{cart.goodsNumber}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>

                </View>

                
               <View className="d_flex fd_r ai_ct jc_sb pt_12 pb_12 pl_20 pr_15 bg_white mt_10 mb_10">
                    <Text className="default_label gray_label">优惠券</Text>
                    <View className="d_flex fd_r ai_ct" onClick={this.onCoupon}>
                        <Text className="default_label gray_label">￥{amount.toFixed(2)}</Text>
                        <Image src={asset.arrow_right}  className='arrow_right' />
                    </View>
                </View>
                
               <View className='d_flex  fd_c mt_10'>
                    <View className='d_flex fd_r jc_sb pl_20 pr_15 bg_white pt_12 pb_12 border_tp'>
                        <Text className='default_label c33_label'>总价</Text>
                        <Text className='lg_label fw_label'>¥{Number(totalAmount).toFixed(2)}</Text>
                    </View>
                    <View className='pl_20 pr_15 bg_white'>
                        <View className='d_flex fd_r jc_sb pt_5 pb_5'>
                            <Text className='default_label gray_label'>运费</Text>
                            <Text className='default_label c33_label'>+¥{freightAmount}</Text>
                        </View>
                        {
                            this.activitys.length > 0 && this.activitys.map((act,index)=>{

                                let on = Object.keys(order_obj).indexOf(act.activityId + '') > -1 ;

                                return(
                                    <View key={'act' + index}>
                                        {
                                            on ?
                                            <View className='d_flex fd_r jc_sb pt_5 pb_5'>
                                                <Text className='default_label gray_label'>{act.title}</Text>
                                                <Text className='default_label c33_label'>-¥{order_obj[act.activityId]}</Text>
                                            </View>
                                        :null}
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View className='d_flex fd_r jc_sb pl_20 pr_15 bg_white pt_12 pb_12 border_tp'>
                        <Text className='default_label c33_label'>实付款</Text>
                        <Text className='lg_label fw_label'>￥{(pay_prices * 1-amount).toFixed(2)}</Text>
                    </View>
                </View>


                <View className='pl_20 pr_15 pt_12 pb_12 mt_10 bg_white d_flex fd_r jc_sb border_bt'>
                    <View className='d_flex fd_r ai_ct '>
                        <Text className='default_label c33_label'>支付方式</Text>
                    </View>
                </View>
                <View className='pl_20 pr_15 pt_12 pb_12 bg_white d_flex fd_r jc_sb border_bt' onClick={this._SelectPay.bind(this,2)}>
                    <View className='d_flex fd_r ai_ct '>
                        <Image src={asset.wechat_pay}  className='payIcon'/>
                        <Text className='default_label c33_label pl_10'>微信支付</Text>
                    </View>
                    <Image src={payId === 2 ? asset.radio_full : asset.radio} className='radio' />
                </View>

                <View className='payOrder' onClick={()=>{
                    if(this.state.ttyps==0){
                        this._onPay()
                    }else{
                        Taro.showToast({
                            title:'已支付',
                            icon:'none',
                            duration:1000
                        })
                    }
                }}>
                    <Text className='lg_label white_label'>确认支付</Text>
                </View>
            </View>
        )
    }


}

export default settlement as ComponentClass