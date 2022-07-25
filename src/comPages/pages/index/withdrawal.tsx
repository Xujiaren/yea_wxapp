import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'

import asset from '../../../config/asset';
import asset1 from '../../config/asset';
import menu from '../../../config/menu';
import inter from '../../../config/inter';
import api from '../../../services/api';

import '../../../config/theme.css';

import './withdrawal.less';


type PageStateProps = {

}


type PageDispatchProps = {
}

type PageOwnProps = {}

type PageState = {
    amount: string,
    paytype: number,
    account: string,
    account_name: string,
    account_sn: string,
    isShow: boolean,
    balance: number,
    limit: number,
    again: number,
    text: any,
    tip: number,
    realname:string,
    bank_name:string,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface withdrawal {
    props: IProps;
}


class withdrawal extends Component<PageDispatchProps & PageStateProps, PageState> {
    // eslint-disable-next-line react/sort-comp
    config: Config = {
        navigationBarTitleText: '提现'
    }

    constructor() {
        super(...arguments)
        this.state = {
            amount: '',
            paytype: 0,
            account: '',
            account_name: '',
            account_sn: '',
            isShow: false,
            balance: 0,
            limit: 100,
            again: 0,
            text: '',
            tip: 0,
            realname:'',
            bank_name:'',
        }
    }
    componentWillReceiveProps(nextProps) {

    }
    componentDidShow() {

    }
    componentWillMount() {


    }
    componentDidMount() {
        var that = this;
        that.getUser();
        that.getConfig()
        that.getConfigs()
    }
    getConfig = () => {
        api.get('/config')
            .then(res => {
                this.setState({
                    limit: parseInt(res.data.data.teacher_withdrawl_limit)
                })
            })
    }

    getConfigs = () => {
        api.get(inter.FundConfig, {
            keyy: 'withdraw_text',
            section: 'teacher'
        }).then(res => {
            if (res.data.status) {
                let val = res.data.data
                this.setState({
                    again: val.again,
                    text: val.text
                })
                let guize = Taro.getStorageSync('guize')
                if (guize == 1) {
                    this.setState({
                        tip: 0
                    })
                }else{
                    this.setState({
                        tip: 1
                    })
                }
            }
        })
    }
    componentWillUnmount() { }
    componentDidHide() { }

    _onSelect = (e) => {
        this.setState({
            paytype: e,
            account_sn: '',
            bank_name:'',
            realname:'',
        })
    }


    getUser() {
        var that = this
        api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    let userData = res.data.data

                    that.setState({
                        balance: userData.canbalance,
                    })
                }
            })
    }
    onOpen = () => {
        this.setState({
            tip: 0
        })
    }
    _onClose = () => {
        Taro.setStorageSync('guize', 1)
        this.setState({
            tip: 0
        })
    }
    _onWithdrawal = () => {

        var that = this;
        const { paytype, amount, account, account_name, account_sn,bank_name,realname } = that.state;
        // var pattern = /^d{16}|d{19}$/
        let val = /^([1-9]{1})(\d{15}|\d{18})$/
        let vas = /^([1-9]{1})(\d{11}|\d{15}|\d{16}|\d{17}|\d{18})$/
        let nas = /^(([a-zA-Z+\.?\·?a-zA-Z+]{2,30}$)|([\u4e00-\u9fa5+\·?\u4e00-\u9fa5+]{2,30}$))/
        // 银行卡号有以下情况建行16、19，农行19，工行19、交通17、民生16、兴业18、招行12、16、19
        if (paytype == 2 && !account_sn) {
            Taro.showToast({
                title: '请填写卡号',
                icon: 'none',
                duration: 1500,
            });
            return;
        }
        if (paytype == 1 && !account_sn) {
            Taro.showToast({
                title: '请填写支付宝账号',
                icon: 'none',
                duration: 1500,
            });
            return;
        }
        if (paytype == 0 && !account_sn) {
            Taro.showToast({
                title: '请填写微信号',
                icon: 'none',
                duration: 1500,
            });
            return;
        }
        if (paytype == 2 && !(parseInt(account_sn))){
            Taro.showToast({
                title: '请填写正确的卡号格式',
                icon: 'none',
                duration: 1500,
            });
            return
        }
        if(paytype == 2 && !vas.test(account_sn)){
            Taro.showToast({
                title: '请填写正确的卡号格式',
                icon: 'none',
                duration: 1500,
            });
            return
        }
        if(paytype == 2 && !realname){
            Taro.showToast({
                title: '请填写姓名',
                icon: 'none',
                duration: 1500,
            });
            return
        }
        if(paytype == 2 && !bank_name){
            Taro.showToast({
                title: '请填写开户行',
                icon: 'none',
                duration: 1500,
            });
            return
        }
        if(paytype == 2 && !nas.test(realname)){
            Taro.showToast({
                title: '请填写正确的姓名',
                icon: 'none',
                duration: 1500,
            });
            return
        }
        // if(paytype==2&&!pattern.test(account_sn)){
        //     Taro.showToast({
        //         title:'请填写正确的卡号',
        //         icon:'none',
        //         duration:1500,
        //     });
        //     return;
        // }
        api.post('/user/toBalance', {
            integral: amount
        }).then(res => {
            console.log(res)
            if (res.data.status) {
                api.post(inter.userWithdraw, {
                    amount: amount,
                    way: paytype,
                    account: account,
                    account_name: account_name,
                    account_sn: account_sn,
                    realname:realname,
                    bank_name:bank_name,
                }).then((res) => {
                    console.log(res)
                    if (res.data.status) {

                        Taro.showToast({
                            title: '提现成功！',
                            icon: 'none',
                            duration: 1000,
                        })
                        setTimeout(() => {
                            Taro.navigateBack();
                        }, 1000)

                    } else {

                        Taro.showToast({
                            title: '提现失败！',
                            icon: 'none',
                            duration: 1000,
                        })

                    }
                })
            }
        })
    }

    render() {

        const { amount, paytype, isShow, balance, limit, account_sn, tip, again, text,realname,bank_name } = this.state;

        let acount = amount === '' ? '0' : amount;
        let on = parseInt(acount) >= limit && parseInt(acount) <= balance;


        return (
            <View className='wrap'>
                <View className='d_flex fd_c bg_white p_15'>
                    <Text className='lg_label c33_label fw_label'>提现金额</Text>
                    <View className='border_bt d_flex  fd_r ai_ct mb_10 mt_10'>
                        <Text className='c33_label lg24_label fw_label'>¥</Text>
                        <Input
                            className='input lg24_label c33_label col_1 pl_15 '
                            placeholderClass='p_color default_label'
                            placeholder='请输入金额'
                            type='number'
                            value={amount}
                            onInput={(e): void => this.setState({ amount: e.detail.value })}
                        />
                    </View>
                    <Text className='tip_label default_label'>{`当前余额${balance}元，最低提现限额${limit}元`}</Text>
                </View>
                <View className='p_15 bg_white mt_10'>
                    <Text className='lg_label c33_label fw_label'>提现到</Text>
                    <View className='d_flex fd_c with_box mt_10'>

                        <View className='d_flex fd_r jc_sb pt_20 pb_20 with_item border_bt' onClick={this._onSelect.bind(this, 0)}>
                            <View className='d_flex fd_r ai_ct' >
                                <Image src={asset.wechat_pay} className='payIcon' />
                                <Text className='default_label c33_label pl_10'>微信</Text>
                            </View>
                            <Image src={paytype === 0 ? asset.radio_full : asset.radio} className='radio' />
                        </View>
                        <View className='d_flex fd_r jc_sb pt_20 pb_20 with_item border_bt' onClick={this._onSelect.bind(this, 1)}>
                            <View className='d_flex fd_r ai_ct'>
                                <Image src={asset.ali_pay} className='payIcon' />
                                <Text className='default_label c33_label pl_10'>支付宝</Text>
                            </View>
                            <Image src={paytype === 1 ? asset.radio_full : asset.radio} className='radio' />
                        </View>
                        <View className='d_flex fd_r jc_sb pt_20 pb_20 with_item' onClick={this._onSelect.bind(this, 2)}>
                            <View className='d_flex fd_r ai_ct' >
                                <Image src={asset.caedit_pay} className='payIcon' />
                                <Text className='default_label c33_label pl_10'>银行卡</Text>
                            </View>
                            <Image src={paytype === 2 ? asset.radio_full : asset.radio} className='radio' />
                        </View>
                    </View>
                </View>
                {
                    paytype === 0 ?
                        <View className='bg_white p_15 mt_10'>
                            <View className='d_flex fd_r ai_ct jc_sb mt_20 mb_20'>
                                <Text className='gray_label c33_label fw_label'>微信号</Text>
                                <View className='d_flex fd_r ai_ct' >
                                    <Input value={account_sn} placeholder='请输入微信号' onInput={(e): void => this.setState({ account_sn: e.detail.value })} />
                                </View>
                            </View>
                        </View>
                        : null}
                {
                    paytype === 1 ?
                        <View className='bg_white p_15 mt_10'>
                            <View className='d_flex fd_r ai_ct jc_sb mt_20 mb_20'>
                                <Text className='gray_label c33_label fw_label'>支付宝账号</Text>
                                <View className='d_flex fd_r ai_ct' >
                                    <Input value={account_sn} placeholder='请输入支付宝账号' onInput={(e): void => this.setState({ account_sn: e.detail.value })} />
                                </View>
                            </View>
                        </View>
                        : null}
                {
                    paytype === 2 ?
                        <View className='bg_white p_15 mt_10'>
                            <View className='d_flex fd_r ai_ct jc_sb mt_20 mb_20'>
                                <Text className='gray_label c33_label fw_label'>银行卡</Text>
                                <View className='d_flex fd_r ai_ct' >
                                    <View>
                                        <View>
                                        <Input value={account_sn} placeholder='请输入卡号' onInput={(e): void => this.setState({ account_sn: e.detail.value })} />
                                        </View>
                                        <View className='mt_15'>
                                        <Input value={realname} placeholder='请输入姓名' onInput={(e): void => this.setState({ realname: e.detail.value })} />
                                        </View>
                                        <View className='mt_15'>
                                        <Input value={bank_name} placeholder='开户行' onInput={(e): void => this.setState({ bank_name: e.detail.value })} />
                                        </View>
                                    </View>  
                                </View>
                            </View>
                        </View>
                        : null}

                {
                    on ?
                        <View className='m_15 btn' onClick={this._onWithdrawal}>
                            <Text className='lg_label white_label fw_label'>申请提现</Text>
                        </View>
                        :
                        <View className='m_15 btn btn_c' >
                            <Text className='lg_label white_label fw_label'>申请提现</Text>
                        </View>
                }



                {
                    isShow ?
                        <View className='layer_box'>
                            <View className='cons'>
                                <View className='head'>
                                    <Image src={asset1.withal_icon} className='withdraw_icon' />
                                    <View className='head_tit'>
                                        <Text className='lg18_label white_label'>提交成功，待审核</Text>
                                    </View>
                                </View>
                                <View className='body_cons'>
                                    <Text className='lg_label c33_label'>提示：我们会在7-20个工作日内完成审核并发送结果，请注意消息通知。</Text>
                                </View>
                                <View className='d_flex fd_r btm' onClick={() => this.setState({ isShow: false })}>
                                    <View className='bor_r col_1 d_flex fd_r jc_ct ai_ct'>
                                        <Text className='lg18_label tip_label'>取消</Text>
                                    </View>
                                    <View className='col_1 d_flex fd_r jc_ct ai_ct' onClick={() => this.setState({ isShow: false })}>
                                        <Text className='lg18_label c33_label'>确定</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : null}
                <View>
                    {
                        tip ?
                            <View className='layer'>
                                <View className='commt_layer pt_12  '>
                                    <View className='d_flex fd_c mb_15 pl_20 pr_20'>
                                        <View className='d_flex ai_ct jc_ct'>
                                            <Text className='lg18_label pt_10 black_label'>提现规则</Text>
                                        </View>

                                    </View>
                                    <View className='pl'>
                                    <Text className='default_label pt_10 c33_label'>{text}</Text>
                                    </View>
                                    
                                    <View className='layer_btns pl_20 pr_20 d_flex jc_sb ai_ct mt_30' >
                                        {
                                            again == 1 ?
                                                <View className='layer_btn d_flex jc_ct ai_ct' onClick={this._onClose.bind(this)}>
                                                    <Text className='lg_label c33_label'>不再提示</Text>
                                                </View>
                                                :
                                                <View className='layer_btn d_flex jc_ct ai_ct'>
                                                    <Text className='lg_label tip_label'>不再提示</Text>
                                                </View>
                                        }
                                        <View className='layer_btn d_flex d_flex jc_ct ai_ct' onClick={this.onOpen}>
                                            <Text className='lg_label c33_label'>关闭</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            : null}
                </View>
            </View >

        )
    }
}

export default withdrawal as ComponentClass