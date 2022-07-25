import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'

import menu from '../../../../config/menu';

import inter from '../../../../config/inter'
import api from '../../../../services/api'

import asset from '../../../../config/asset'


import '../../../../config/theme.css';
import './settingUser.less'

type PageState = {
    unioinId: number,
    userId: number,
    mobile: any,
    user_mobile: any,
    typs: number,
    code: any,
    yzm_status: boolean,
    num: number,
}

class settingUser extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config: Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '账号设置',
        navigationBarBackgroundColor: '#FFF',
    }
    timmer: any
    constructor() {
        super(...arguments)
        this.state = {
            unioinId: 0,
            userId: 0,
            mobile: '',
            user_mobile: '',
            typs: 0,
            code: '',
            yzm_status: false,
            num: 60,
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        var that = this;
        that.getUser();
    }

    componentWillUnmount() {
        clearInterval(this.timmer)
    }

    componentDidShow() { }
    componentDidHide() { }

    getUser() {
        var that = this
        api.get(inter.User)
            .then((res) => {
                console.log(res)
                if (res.data.status) {
                    let userData = res.data.data
                    that.setState({
                        userId: userData.userId,
                        unioinId: userData.unionId,
                        user_mobile: userData.mobile
                    })
                }
            })
    }
    _onCode = () => {
        const { mobile } = this.state
        if (mobile.length !== 11) {
            Taro.showToast({
                title: '请填写正确的手机号',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        api.post('/passport/code', {
            mobile: mobile,
            type: 0
        }).then(res => {
            this.setState({
                yzm_status: true
            })
            this.yzms()
        })
    }
    yzms = () => {
        this.timmer = setInterval(() => {
            if (this.state.num > 0) {
                this.setState({
                    num: this.state.num - 1
                })
            } else {
                this.setState({
                    num: 60,
                    yzm_status: false
                })
            }
        }, 1000)
    }
    onMobile=()=>{
        var that = this
        const{mobile,code}=this.state
        if(!code){
            Taro.showToast({
                title: '请填写验证码',
                icon: 'none',
                duration: 1000
            });
            return;
        }
        Taro.showModal({
            title: '提示',
            content: '确定修改手机号',
            success: function (res) {
                if (res.confirm) {
                    api.post('/user/mobile/valid',{
                        code:code,
                        mobile:mobile,
                        type:1
                    }).then(res=>{
                        console.log(res)
                        Taro.showToast({
                            title: '修改成功',
                            icon: 'none',
                            duration: 1000
                        });
                        if(res.data.status){
                            that.setState({
                                user_mobile:mobile,
                                typs:0
                            })
                        }else{
                            let msg = res.data.message
                            let tip = '系统错误，请联系工作人员。';
                            if (msg == 'ACCOUNT_DENY') {
                                tip = '账户已禁用，请联系工作人员。';
                            } else if (msg == 'CODE_ERROR') {
                                tip = '验证码错误';
                            }  else {
                                tip = '系统错误，请联系工作人员。';
                            }
                            Taro.showToast({
                                title: tip,
                                icon: 'none',
                                duration: 1000
                            });
                        }
                    })
                } else if (res.cancel) {
                    
                }
            }
        })
    }
    render() {

        const { unioinId, user_mobile, typs, mobile, code, yzm_status, num } = this.state;
        let mobiles = user_mobile || '';

        const mobile_val = mobiles.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        return (
            <View className='root'>
                {
                    typs == 0 ?
                        <View className='mt_10'>
                            {mobile_val}
                        </View>
                        :
                        <View className='mt_10'>
                            <View style={{ display: 'flex', alignItems: 'center' }}>
                                <Input className='input default_label tip_label col_1'
                                    type='number'
                                    value={mobile}
                                    placeholder={'请填写手机号'}
                                    placeholderClass='placestyle'
                                    onInput={(e) => this.setState({ mobile: e.detail.value })}
                                />
                                {
                                    yzm_status ?
                                        <View className='yzm'>
                                            {num}
                                </View>
                                        :
                                        <View className='yzm' onClick={this._onCode}>
                                            发送验证码
                                </View>
                                }

                            </View>
                            <View style={{ display: 'flex', alignItems: 'center', marginTop: '20rpx' }}>
                                <Input className='input default_label tip_label col_1'
                                    type='number'
                                    value={code}
                                    password={true}
                                    placeholder={'请填写验证码'}
                                    placeholderClass='placestyle'
                                    onInput={(e) => this.setState({ code: e.detail.value })}
                                />
                            </View>
                            <View className='btns'>
                                <View className='btnss' onClick={this.onMobile}>
                                    确定
                                </View>
                            </View>
                        </View>
                }

                <View className='li_item d_flex fd_r jc_sb ai_ct bg_white' onClick={() => {
                    if (typs == 0) {
                        this.setState({
                            typs: 1
                        })
                    } else {
                        this.setState({
                            typs: 0
                        })
                    }
                }}>
                    <Text className='li_text c33_label'>{typs == 0 ? '修改手机号' : '取消修改手机号'}</Text>
                    <Image src={asset.arrow_right} className='arrow_icon' />
                </View>
            </View>
        )
    }
}

export default settingUser as ComponentClass