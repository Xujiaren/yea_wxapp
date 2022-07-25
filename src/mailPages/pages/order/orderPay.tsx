import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image} from '@tarojs/components'

import inter from '../../../config/inter'
import api from '../../../services/api'

import asset from '../../../config/asset';
import menu from '../../../config/menu'

import  '../../../config/theme.css';
import './orderPay.less'



type PageState = {
    orderAmount:string,
    orderSn:string ,
    payId:number
}

class orderPay extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '支付订单'
    }

    constructor () {
        super(...arguments)
        this.state = {
            orderAmount:'',
            orderSn:'' ,
            payId:0,
        }

        this._onPay = this._onPay.bind(this);

    }

    componentWillMount () {
        var that = this;
        const {orderAmount,orderSn} = that.$router.params;

        that.setState({
            orderAmount:orderAmount,
            orderSn:orderSn,
        })
       
    }

    componentDidMount () { 
        
    }

    componentWillUnmount () {
        
    }
    
    componentDidShow () { 
       
    }
    componentDidHide () { }

    _onPay(){
        var that = this;
        const {orderSn,payId} = that.state;
        if(payId === 9){
            console.log(orderSn)
            api.post(inter.orderToPay,{
                order_sn:orderSn,
                pay_type:payId,
            }).then((res)=>{
                console.log(res)
                if(res.data.status){
                    let pay = res.data.data ;

                    Taro.requestPayment({
                        timeStamp:(pay.timeStamp).toString(),
                        nonceStr: pay.nonceStr,
                        package: pay.package,
                        signType: 'MD5',
                        paySign: pay.sign,
                        success: function (res) { 
    
                            Taro.showToast({
                                title:'支付成功',

                                duration:1000,
                            })
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
                            // Taro.showToast({
                            //     title:'支付失败',
                            //     icon:'none',
                            //     duration:1000,
                            // })
                        }
                    })
                }
            })
        } else {
            Taro.showToast({
                title:'请选择支付方式',
                icon:'none',
                duration:1000,
            })
        }
        
    }
    

    render () {
        const {orderAmount,orderSn,payId} = this.state;

        return (
            <View className='wrap'>
                <View className='head d_flex fd_c jc_ct ai_ct'>
                    <Text className=' black_label fw_label' style={{fontSize:18 + 'px'}}>¥<Text className=' black_label fw_label' style={{fontSize:36 + 'px'}}>{orderAmount}</Text></Text>
                    <Text className='sm_label tip_label'>订单编号：{orderSn}</Text>
                </View>

                <View className='bg_white mt_10 pl_20 pt_12 pb_12 pr_15'>
                    <Text className = 'default_label c33_label lh20_label mb_5'>支付方式</Text>
                    <View className ='d_flex ai_ct fd_r jc_sb bg_white pt_15 pb_15' onClick={()=>this.setState({payId:9})}>
                        <View className='d_flex fd_r ai_ct '>
                            <Image src={asset.wechat_pay}  className='payIcon'/>
                            <Text className='default_label c33_label pl_10'>微信支付</Text>
                        </View>
                        <Image src={payId === 9 ? asset.radio_full :  asset.radio} className='radio'  />
                    </View>
                </View>


                <View className='paybtn' onClick={this._onPay}>
                    <Text className='lg_label white_label'>确认支付</Text>
                </View>

            </View>
        )
    }
}

export default orderPay as ComponentClass