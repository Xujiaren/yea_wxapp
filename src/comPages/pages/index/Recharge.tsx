import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import menu from '../../../config/menu';
import asset from '../../../config/asset';
import inter from '../../../config/inter'
import api from '../../../services/api'

import '../../../config/theme.css';
import './Recharge.less';


type PageState = {
    list: Array<any>,
    rechIdx: number,
    userIngral: number,
    rechargeId: number,
    rechargeIntegral: number,
    amount: number,
    ctype:number,
}

class Recharge extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '充值'
    }
    timer: any;

    constructor() {
        super(...arguments)
        this.state = {
            list: [],
            rechIdx: 0,
            userIngral: 0,
            rechargeId: 0,
            rechargeIntegral: 0,
            amount: 0,
            ctype:0,
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        var that = this;
        that._refs();
    }

    componentWillUnmount() {

    }

    componentDidShow() {
        var that = this;
        that._refs();
    }
    componentDidHide() { }


    _refs() {
        var that = this

        that._getUser();
        that._getOrderCharge();
    }

    // 获取个人信息判断是否登录
    _getUser() {
        var that = this
        api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    let userData = res.data.data

                    that.setState({
                        userIngral: userData.integral + userData.rintegral
                    })
                }
            })
    }

    _getOrderCharge() {
        var that = this;

        api.get(inter.orderCharge)
            .then((res) => {
                that.setState({
                    list: res.data.data
                })
            })
    }

    _onSelect = (index, item) => {
        var that = this;

        that.setState({
            rechIdx: index,
            rechargeId: item.rechargeId,
            rechargeIntegral: item.rechargeIntegral,
            amount: item.amount,
            ctype:item.rechargeItemDTO.ctype
        })
    }


    render() {

        const { list, rechIdx, userIngral, rechargeId, rechargeIntegral, amount ,ctype} = this.state;

        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {

        }

        return (
            <View className='wrap'>
                <View className='d_flex fd_r jc_fe pr_20' onClick={() => Taro.navigateTo({ url: menu.rechRecord })}>
                    <Text className='tip_label default_label'>充值记录</Text>
                </View>
                <View>
                    <View className='d_flex fd_r jc_ct ai_ct'>
                        <Text className='lg36_label black_label fw_label'>{userIngral}</Text>
                        <Text className='default_label black_label fw_label pl_5 mt_15'>金币</Text>
                    </View>
                    <View className='pl_17 pr_17 d_flex fd_c'>
                        <Text className='tip_label default_label'>金币充值</Text>
                        <View className='d_flex fd_r jc_sb rech_boxs'>
                            {
                                list.map((item, index) => {
                                    let on = item.rechargeId === rechargeId;
                                    return (
                                        <View key={'item' + index} className={on ? 'd_flex fd_c rech_box rech_box_border_red' : 'd_flex fd_c rech_box rech_box_border_gray'} onClick={this._onSelect.bind(this, index, item)}
                                            style={on ? { width: (windowWidth - 72) / 3 + 'px', height: 92 + 'px' } : { width: (windowWidth - 66) / 3 + 'px', height: 94 + 'px' }}
                                        >
                                            {
                                                item.rechargeItemDTO.ctype == 0&&item.rechargeItemDTO.itemNum>0 ?
                                                    <View className='rech_cons'>
                                                        <Image src={on ? asset.rech_icon1 : asset.rech_icon3} className='rech_icon' />
                                                        <View className='rech_tit'>
                                                            <Text className='smm_label white_label'>+{item.rechargeItemDTO.integral}金币</Text>
                                                        </View>
                                                    </View>
                                                    :
                                                    <View className='h34'></View>
                                            }
                                            <View className='d_flex fd_c ai_ct mt_12'>
                                                <Text className={on ? 'sred_label lg_label fw_label' : 'c33_label lg_label fw_label'}>{item.amount}元</Text>
                                                <Text className={on ? 'sred_label sm_label' : 'tip_label sm_label'}>{item.rechargeIntegral}金币</Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>

                    <View className='pl_17 pr_17 mt_10 d_flex fd_c'>
                        <Text className='tip_label default_label'>充值获赠</Text>
                        <View className='d_flex fd_r jc_sb rech_boxs' >
                            {
                                list.map((item, index) => {
                                    let on = item.rechargeId === rechargeId;
                                    if (item.rechargeItemDTO.ctype == 1&&item.rechargeItemDTO.itemNum>0) {
                                        return (
                                            <View key={'item' + index} className={on && index == list.length - 1 ? 'd_flex fd_c rech_box rech_box_border_red' : on && index != list.length - 1 ? 'd_flex fd_c rech_box rech_box_border_red' : !on && index == list.length - 1 ? 'd_flex fd_c rech_box rech_box_border_gray' : !on && index != list.length - 1 ? 'd_flex fd_c rech_box rech_box_border_gray' : null} style={on ? { width: (windowWidth - 72) / 3 + 'px', height: 162 + 'px' } : { width: (windowWidth - 66) / 3 + 'px', height: 164 + 'px' }}>
                                                <View className='rech_cons'>
                                                    <Image src={on ? asset.rech_icon2 : ''} className='rech_icon_d' />
                                                </View>
                                                <View className='recharge_cover'>
                                                    <Image src={item.rechargeItemDTO.itemImg} mode='aspectFill' className='recharge_icon' />
                                                </View>
                                                <Text className={on?'orange sm_label pl_5 pr_5 mt_15':'black_label sm_label pl_5 pr_5 mt_15'}>{item.rechargeItemDTO.itemName}</Text>
                                                <Text className={on?'sm_label tip_label pl_5 pr_5 mt_12 orange':'sm_label tip_label pl_5 pr_5 mt_12'}>{item.amount}元充值获赠</Text>
                                            </View>
                                        )
                                    }
                                })
                            }
                            {
                                list.map((item, index) => {
                                    let on = item.rechargeId === rechargeId;
                                    if (item.rechargeItemDTO.ctype != 1||item.rechargeItemDTO.itemNum==0) {
                                        return (
                                            <View className={'wids'}>
                                               
                                            </View>
                                        )
                                    }
                                })
                            }
                        </View>
                    </View>

                    <View className='d_flex fd_r ai_ct jc_ct m_15 btn' onClick={() =>{
                        if(rechargeId){
                            Taro.navigateTo({ url: menu.rePay + '?rechargeId=' + rechargeId + '&rechargeIntegral=' + rechargeIntegral + '&amount=' + amount+'&ctype='+ ctype})
                        }else{
                            Taro.showToast({
                                title:'请选择充值金额',
                                icon:'none',
                                duration:1500
                            })
                        }
                    }}>
                        <Text className='white_label lg_label fw_label'>确认支付</Text>
                    </View>

                    <View className='pl_17 pr_17 d_flex fd_c '>
                        <Text className='tip_label default_label lh20_label'>1、金币可以用于直接购买APP内虚拟内容（不含实物产品、线下课）；</Text>
                        <Text className='tip_label default_label lh20_label'>2、iOS系统和其他系统的余额只能在相应系统使用，不能互通使用；</Text>
                        <Text className='tip_label default_label lh20_label'>3、金币为虚拟币，充值后的金币不会过期，但无法提现或转赠他人。</Text>
                    </View>

                    <View className='d_flex fd_r ai_ct jc_ct mt_20 pb_20' onClick={() => Taro.navigateTo({ url: menu.feedBack })}>
                        <Text className='default_label tip_label'>遇到问题，请提交 </Text>
                        <Text className='default_label c33_label' style={{ textDecorationLine: 'underline' }}>意见反馈</Text>
                    </View>
                </View>
            </View>
        )
    }
}

export default Recharge as ComponentClass