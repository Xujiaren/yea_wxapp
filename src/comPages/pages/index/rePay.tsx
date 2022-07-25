import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Canvas } from '@tarojs/components'

type PageState = {
    payType: number,
    rechargeId: number,
    rechargeIntegral: number,
    amount: number,
    ctype: number,
}


import asset from '../../../config/asset'
import inter from '../../../config/inter'
import menu from '../../../config/menu'
import api from '../../../services/api'

import '../../../config/theme.css';
import './rePay.less';




class rePay extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '充值支付'
    }
    timer: any;

    constructor() {
        super(...arguments)
        this.state = {
            payType: 0,
            rechargeId: 0,
            rechargeIntegral: 0,
            amount: 0,
            ctype: 0,
        }
    }

    componentWillMount() {
        var that = this;
        const { rechargeId, rechargeIntegral, amount, ctype } = that.$router.params

        that.setState({
            rechargeId: parseInt(rechargeId),
            rechargeIntegral: parseFloat(rechargeIntegral),
            amount: parseFloat(amount),
            ctype: parseInt(ctype),
        })
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    componentDidShow() { }
    componentDidHide() { }

    _onSelect = () => {
        var that = this;

        that.setState({
            payType: 1
        })
    }

    _onPay = () => {
        var that = this;
        const { rechargeId, ctype ,payType} = that.state;
        if(payType==1){
            api.post(inter.orderCharge, {
                recharge_id: rechargeId,
                pay_type: 9
            }).then((res) => {
                console.log(res)
                if(res.data.status){
                    let pay = res.data.data.pay_info;
                    let rewardId = res.data.data.reward.rewardId
                    Taro.requestPayment({
                        timeStamp: pay.timeStamp + '',
                        nonceStr: pay.nonceStr,
                        package: pay.package,
                        signType: 'MD5',
                        paySign: pay.sign,
                        success: function (res) {
                            if (ctype == 1) {
                                if(rewardId!=0){
                                    Taro.showToast({
                                        title: '支付成功,请填写地址',
                                        duration: 1000,
                                    })
                                    setTimeout(() => {
                                        //             Taro.navigateBack();
                                        Taro.navigateTo({
                                            url: menu.address + '?nageType=2' + '&rewardId=' + rewardId
                                        })
                                    }, 1000)
                                }else{
                                    Taro.showToast({
                                        title: '支付成功',
                                        duration: 1000,
                                    })
                                    setTimeout(() => {
                                        Taro.navigateBack({
                                            delta:2
                                        })
                                    }, 1000);
                                }
                                
                            } else {
                                Taro.showToast({
                                    title: '支付成功',
                                    duration: 1000,
                                })
                                setTimeout(() => {
                                    Taro.navigateBack({ delta: 2 });
        
                                }, 1000)
                            }
        
                        },
                        fail: function (res) {
                            console.log(res)
                        }
                    })
                }
               if(res.data.message=='ITEM_NUM_ERROR'){
                   Taro.showToast({
                       title:'赠品数量不足,无法充值',
                       icon:'none',
                       duration:1500
                   })
               }
            })
        }else{
            Taro.showToast({
                title:'请选择支付方式',
                icon:'none',
                duration:1500
            })
        }
       
    }

    render() {

        const { payType, rechargeId, rechargeIntegral, amount } = this.state

        return (
            <View className='wrap'>

                <View className='wrap_head'>
                    <View className='d_flex fd_r ai_ct jc_sb wrap_head_item'>
                        <Text className='c33_label default_label'>商品名称</Text>
                        <Text className='c33_label default_label fw_label'>{rechargeIntegral} 金币</Text>
                    </View>
                    <View className='d_flex fd_r ai_ct jc_sb wrap_head_item'>
                        <Text className='c33_label default_label'>金额</Text>
                        <Text className='c33_label default_label fw_label'>￥{amount}</Text>
                    </View>
                    <View className='d_flex fd_r ai_ct jc_sb wrap_head_item'>
                        <Text className='c33_label default_label'>待支付</Text>
                        <Text className='sred_label default_label fw_label'>￥{amount}</Text>
                    </View>
                </View>
                <View className='mt_10'>
                    <View className='pl_20 pr_15 pt_12 pb_12 d_flex fd_r jc_sb border_bt'>
                        <View className='d_flex fd_r ai_ct '>
                            <Text className='lg_label c33_label'>选择支付方式</Text>
                        </View>
                    </View>
                    <View className='pl_20 pr_15 pt_15 pb_15 bg_white d_flex fd_r jc_sb ai_ct border_bt' onClick={this._onSelect}>
                        <View className='d_flex fd_r ai_ct '>
                            <Image src={asset.wechat_pay} className='payIcon' />
                            <Text className='default_label c33_label pl_10'>微信支付</Text>
                        </View>
                        <Image src={payType === 1 ? asset.radio_full : asset.radio} className='radio' />
                    </View>
                </View>


                <View className='btn' onClick={this._onPay}>
                    <Text className='lg_label white_label fw_label'>确认支付</Text>
                </View>
            </View>
        )
    }

}

export default rePay as ComponentClass