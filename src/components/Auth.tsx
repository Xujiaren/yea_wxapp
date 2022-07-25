import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

import '../config/theme.css'
import './Auth.less'
import api from '../services/api'
import inter from '../config/inter'


import menu from '../config/menu'
import wxDiscode from 'src/wxParse/wxDiscode'

type Props = {
    isLogin: boolean,
    type:number
}

type PageState = {
    isLogin: Boolean,
    isMobile: Boolean,
    isValid: Boolean,
    fuser: number
}

export default class Auth extends Component<Props, PageState> {

    constructor() {
        super(...arguments)


        this.state = {
            isLogin: false,
            isMobile: false,
            isValid: false,
            fuser: 0
        }

        this.doLogin = this.doLogin.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
    }

    componentWillMount() {
        let fuser = Taro.getStorageSync('fuser');

        if (fuser != '') {
            this.setState({
                fuser: parseInt(fuser)
            })
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }



    getUserInfo = () => {
        wx.getUserProfile({
            lang: 'zh_CN',
            desc: '用户登录',
            success: (res) => {
                const that = this;
                const { fuser } = that.state

                let userInfo = res
                this.setState({
                    isLogin: false
                }, () => {

                    if (userInfo.errMsg === 'getUserProfile:ok') {   //同意
                        Taro.login({
                            success: res => {
                                let iv = encodeURIComponent(userInfo.iv)
                                let encryptedData = encodeURIComponent(userInfo.encryptedData)
                                api.post(inter.wxpro, {
                                    iv: iv,
                                    encryptedData: encryptedData,
                                    fuser: this.state.fuser,
                                    code: res.code,
                                    nickName: userInfo.userInfo.nickName,
                                    avatar: userInfo.userInfo.avatarUrl,
                                    sex: userInfo.userInfo.gender,
                                }).then((res) => {
                                    if (res.data.status) {
                                        Taro.setStorageSync('token', res.data.data.token);
                                        that.props.success && that.props.success();

                                        let authdata = res.data.data;
                                        this.setState({
                                            isValid: authdata.valid
                                        })

                                        if (authdata.new) {
                                            this.setState({
                                                isMobile: true
                                            })
                                        } else {
                                            if (!authdata.valid) {
                                                this._realAuth();
                                            }
                                        }
                                    } else {
                                        Taro.showModal({
                                            title: '登录',
                                            content: '您的账户因违规操作已被禁用，请联系客服处理！',
                                            showCancel: false
                                        }).then(res => console.log(res.confirm, res.cancel))
                                    }
                                })
                            },
                        })
                    }
                })

            },
            // 失败回调
            fail: (err) => {
                // 弹出错误
                console.log(err)
            }
        });

    }


    _realAuth() {
        Taro.showModal({
            content: "还未实名认证",
            // showCancel: false,
            confirmText: '去认证',
            success: res => {
                if (res.cancel) {
                    this.setState({
                        isMobile: false,
                        isLogin: false
                    })
                    Taro.navigateTo({ url: menu.realAuth })
                }
                if (res.confirm) {
                    this.setState({
                        isMobile: false,
                        isLogin: false
                    })
                    Taro.navigateTo({ url: menu.realAuth })
                }
            },
        })
    }

    getPhoneNumber = (e) => {
        var that = this;

        const { isValid } = this.state
        if (e.detail.errMsg == 'getPhoneNumber:ok') {

            let data = JSON.stringify({
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData,
            })

            api.post(inter.OuthMobile, {
                data: data
            }).then(res => {
                if (res.data.status) {

                    that.props.success && this.props.success();

                    if (!isValid) {
                        this._realAuth();
                        this.setState({
                            isMobile: false
                        })
                    } else {
                        this.setState({
                            isMobile: false,
                            isLogin: false
                        })
                    }


                }
            })
        } else {
            if (!isValid) {
                this._realAuth();
                this.setState({
                    isMobile: false
                })
            } else {
                this.setState({
                    isMobile: false
                })
            }
        }
    }

    //不获取手机号
    _noMbile() {
        var that = this
        const { isValid } = that.state
        if (!isValid) {

            Taro.showModal({
                content: "还未实名认证",
                // showCancel: false,
                confirmText: '去认证',
                success: res => {
                    if (res.cancel) {
                        this.setState({
                            isMobile: false,
                            isLogin: false
                        })
                    }
                    if (res.confirm) {
                        this.setState({
                            isMobile: false,
                            isLogin: false
                        })
                        Taro.navigateTo({ url: menu.realAuth })
                    }
                }
            })
        } else {
            this.setState({
                isMobile: false
            })
        }
    }

    doLogin() {
        this.setState({
            isLogin: true
        })
    }

    render() {
        let { isLogin, isMobile } = this.state
        const { type } = this.props
        return (
            <View>
                {
                    type == 1 ?
                        <View>
                            {
                                isLogin ?
                                    <View className='usershow'>
                                        <View className='ctypelayer'></View>
                                        <View className='dialog'>
                                            <View className='wrappost'>
                                                <Text className='c33_label lg20_label mt_10'>登录</Text>
                                                <Text className='c33_label mt_10 mb_10 lg18_label  pl_15 pr_15'>该操作将会授权操作，是否确认进行登录。</Text>
                                                <View className='d_flex fd_r ai_ct wrapbtns'>
                                                    <Button className='btn gray_label' onClick={() => this.setState({ isLogin: false }, () => {
                                                        setTimeout(() => {
                                                            Taro.switchTab({
                                                                url: '/pages/index/index'
                                                            })
                                                        }, 1000);
                                                    })} >暂不登录</Button>
                                                    {/* <Button open-type='getUserInfo' className='btn lred_label'  onGetUserInfo={this.getUserInfo}>确定登录</Button>  */}
                                                    <Button className='btn lred_label' onClick={this.getUserInfo}>确定登录</Button>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    : null}
                        </View>
                        :
                        <View>
                            {
                                isLogin ?
                                    <View className='usershow'>
                                        <View className='ctypelayer'></View>
                                        <View className='dialog'>
                                            <View className='wrappost'>
                                                <Text className='c33_label lg20_label mt_10'>登录</Text>
                                                <Text className='c33_label mt_10 mb_10 lg18_label  pl_15 pr_15'>该操作将会授权操作，是否确认进行登录。</Text>
                                                <View className='d_flex fd_r ai_ct wrapbtns'>
                                                    <Button className='btn gray_label' onClick={() => this.setState({ isLogin: false })} >暂不登录</Button>
                                                    {/* <Button open-type='getUserInfo' className='btn lred_label'  onGetUserInfo={this.getUserInfo}>确定登录</Button>  */}
                                                    <Button className='btn lred_label' onClick={this.getUserInfo}>确定登录</Button>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    : null}
                        </View>
                }

                {
                    isMobile ?
                        <View className='usershow'>
                            <View className='ctypelayer'></View>
                            <View className='dialog'>
                                <View className='wrappost'>
                                    <Text className='c33_label lg20_label mt_10'>获取手机号</Text>
                                    <Text className='c33_label mt_10  lg18_label pl_15 pr_15'>该操作将会获取你手机号操作，是否确认进行登录。</Text>
                                    <View className='d_flex fd_r ai_ct wrapbtns'>
                                        <Button className='btn gray_label' onClick={this._noMbile.bind(this)} >暂不获取</Button>
                                        <Button openType='getPhoneNumber' className='btn lred_label' onGetPhoneNumber={this.getPhoneNumber}>获取手机号</Button>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : null}
            </View>
        )
    }

}