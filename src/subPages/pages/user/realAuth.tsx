import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Input ,Text} from '@tarojs/components'

import  '../../../config/theme.css';
import './realAuth.less'

import inter from '../../../config/inter'
import api from '../../../services/api'
import menu from '../../../config/menu'
import GetInt from '../../../components/GetInt'
type PageState = {
    vip:string,
    Idcard:string,
    unionId:string,
    show:boolean,
    integral:number,
}

class RealAuth extends Component<{}, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '实名认证',
        enablePullDownRefresh: false
    }

    constructor () {
        super(...arguments)
        this.state = {
            vip:'',
            Idcard:'',
            unionId:'',
            show:false,
            integral:0,
        }
    }

    componentWillMount () {
        var that = this;

        const {unionId} = that.$router.params;

        that.setState({
            unionId:unionId
        })
    }

    componentDidMount () { 

        var that = this;
        let vip = Taro.getStorageSync('snpwd_sn');

        that.setState({
            vip:vip,
        })

    }

    componentWillUnmount () {
        Taro.setStorageSync('authNum', 0);
        // Taro.setStorageSync('snpwd_sn', '');
    }

    componentDidShow () { }

    componentDidHide () { }



    _onSubmit = () => {
        var that = this ;
        const {vip,Idcard,unioinId} = that.state
        
        const authNum = Taro.getStorageSync('authNum');
        console.log(authNum)

        
        if(vip.length == 8 || vip.length == 10){
            if(Idcard.length == 6){
                api.post(inter.UserAuth,{
                    sn:vip,
                    pwd:Idcard
                }).then(res=>{
                    if(res.data.status){
                        if(res.data.message){
                            if(authNum < 2){
                                if(res.data.message == 'PWD_ERROR' || res.data.message == 'USER_ERROR' ){
                                    Taro.showModal({
                                        title: '实名认证',
                                        content: '您输入的帐号与身份证 \n 信息不符，请重新填写',
                                        showCancel:false
                                    }).then(res => console.log(res.confirm, res.cancel))
                                } else if (res.data.message == 'bind limit exceeded'){
                                    Taro.showModal({
                                        title:'实名认证',
                                        content:'系统检测您的VIP卡号已与 \n 另一个微信账号绑定，请登录\n 原账号使用，如需换绑，请到\n “帮助反馈”中提交您的VIP卡 \n 号进行申请。',
                                        confirmText:'帮助反馈'
                                    }).then(res => {
                                        if(res.confirm){
                                            Taro.navigateTo({url:menu.feedBack})
                                        }
                                    })
                                } else if(res.data.message == 'card and pwd already bound'){
                                    Taro.showModal({
                                        title: '实名认证',
                                        content: '当前卡号和密码已被绑定',
                                        showCancel:false
                                    }).then(res => console.log(res.confirm, res.cancel))
                                }  else if(res.data.message == 'SYSTEM_ERROR'){
                                    Taro.showModal({
                                        title: '实名认证',
                                        content: '系统错误',
                                        showCancel:false
                                    }).then(res => console.log(res.confirm, res.cancel))
                                }else if(res.data.message == 'USER_EXPIRED'){
                                    Taro.showModal({
                                        title: '实名认证',
                                        content: '卡号过期',
                                        showCancel:false
                                    }).then(res => console.log(res.confirm, res.cancel))
                                }
    
                                Taro.setStorageSync('authNum', authNum+1);
    
                            } else {
                                Taro.showModal({
                                    title: '实名认证',
                                    content: '您已输错超过三次，请联系 \n 客服',
                                    confirmText:'确定',
                                    showCancel:false
                                }).then(res => {
                                    if(res.cancel){}   
                                    if(res.confirm){
                                        Taro.redirectTo({
                                            url:menu.kefu + '?unioinId=' + unioinId
                                        })
                                    }
                                })
                            }
                        }else{
                            Taro.showToast({
                                title: '认证成功',
                                icon: 'success',
                                duration: 2000
                            })
                            setTimeout(()=>Taro.navigateBack(),1000)
                        }
                    } else {
                        if(authNum < 2){
                            if(res.data.message == 'PWD_ERROR' || res.data.message == 'USER_ERROR' ){
                                Taro.showModal({
                                    title: '实名认证',
                                    content: '您输入的帐号与身份证 \n 信息不符，请重新填写',
                                    showCancel:false
                                }).then(res => console.log(res.confirm, res.cancel))
                            } else if (res.data.message == 'bind limit exceeded'){
                                Taro.showModal({
                                    title:'实名认证',
                                    content:'系统检测您的VIP卡号已与 \n 另一个微信账号绑定，请登录\n 原账号使用，如需换绑，请到\n “帮助反馈”中提交您的VIP卡 \n 号进行申请。',
                                    confirmText:'帮助反馈'
                                }).then(res => {
                                    if(res.confirm){
                                        Taro.navigateTo({url:menu.feedBack})
                                    }
                                })
                            } else if(res.data.message == 'card and pwd already bound'){
                                Taro.showModal({
                                    title: '实名认证',
                                    content: '当前卡号和密码已被绑定',
                                    showCancel:false
                                }).then(res => console.log(res.confirm, res.cancel))
                            }  else if(res.data.message == 'SYSTEM_ERROR'){
                                Taro.showModal({
                                    title: '实名认证',
                                    content: '网络错误，请稍候重试',
                                    showCancel:false
                                }).then(res => console.log(res.confirm, res.cancel))
                            }else if(res.data.message == 'USER_EXPIRED'){
                                Taro.showModal({
                                    title: '实名认证',
                                    content: '卡号过期',
                                    showCancel:false
                                }).then(res => console.log(res.confirm, res.cancel))
                            }

                            Taro.setStorageSync('authNum', authNum+1);

                        } else {
                            Taro.showModal({
                                title: '实名认证',
                                content: '您已输错超过三次，请联系 \n 客服',
                                confirmText:'确定',
                                showCancel:false
                            }).then(res => {
                                if(res.cancel){}   
                                if(res.confirm){
                                    Taro.redirectTo({
                                        url:menu.kefu + '?unioinId=' + unioinId
                                    })
                                }
                            })
                        }
                        
                    }

                }) 
            } else {
                Taro.showModal({
                    title: '提示',
                    content: '身份证号码填写不完整',
                    showCancel:false
                }).then(res => console.log(res.confirm, res.cancel))
            }
            
        } else {
            Taro.showModal({
                title: '提示',
                content: 'VIP卡号/序列号填写不正确',
                showCancel:false
            }).then(res => console.log(res.confirm, res.cancel))
        }
        

    }


    // 没有会员，去商城注册
    // _toLink(){

    //     Taro.navigateTo({
    //         url:menu.adWebView + '?link=https://wap.perfect99.com/#/shop/register'
    //     })
    // }
    onOkeys=()=>{
        this.setState({
            show:false
        })
    }

    render () {
        const {vip,Idcard,show,integral} = this.state

        return (
            <View className='realwrap'>
                <View className='from mt_10'>
                    <View className='from_item d_flex ai_ct jc_sb pb_15 pt_15 border_bt bg_white'>
                        <Text className='c33_label default_label'>VIP卡号</Text>
                        <Input className='input default_label tip_label' 
                            placeholder='VIP卡号' 
                            value= {vip}
                            maxLength={10}
                            onInput={(event)=>this.setState({vip:event.detail.value})}
                        />
                    </View>
                    <View className='from_item d_flex ai_ct jc_sb pb_15 pt_15  bg_white'>
                        <Text className='c33_label default_label'>身份证后6位</Text>
                        <Input className='input default_label tip_label' 
                            placeholder='请输入身份证的后六位' 
                            value={Idcard}
                            maxLength={6}
                            type='password'
                            onInput={(event)=>this.setState({Idcard:event.detail.value})}
                        />
                    </View>
                </View>
                <View onClick={this._onSubmit} className='submit d_flex jc_ct ai_ct pt_12 pb_12'>
                    <Text className='lg_label white_label'>认证</Text>
                </View>

                {/* <View className='d_flex fd_r ai_ct jc_ct' onClick={this._toLink}> 
                    <Text className='default_label red_label'>没有VIP卡号？立即注册</Text>
                </View> */}
                 <GetInt show={show} integral={integral} onOkeys={this.onOkeys}></GetInt>
            </View>
        )
    }
}


export default RealAuth as ComponentClass