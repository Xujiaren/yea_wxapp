import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image,Button} from '@tarojs/components'

import '../config/theme.css'
import './Auth.less'
import api from '../services/api'
import inter from  '../config/inter'


import menu from '../config/menu'

type Props = {
    isLogin:boolean,

}

type PageState = {
    isLogin:Boolean,
    isMobile:Boolean,
    isValid:Boolean,
    fuser:number
}

export default class Auths extends Component<Props,PageState> {

    constructor () {
        super(...arguments)


        this.state = {
            isLogin:false,
            isMobile:false,
            isValid:false,
            fuser: 0
        }
        
        this.doLogin = this.doLogin.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
    }

    componentWillMount () {
        let fuser = Taro.getStorageSync('fuser');

        if (fuser != '') {
            this.setState({
                fuser: parseInt(fuser)
            })
        }
    }

    componentDidMount () { }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }



    getUserInfo = (userInfo) => {

        const that = this;
        const {fuser} = that.state


        this.setState({
            isLogin: false
        }, () => {
            if(userInfo.detail.errMsg === 'getUserInfo:ok'){   //同意

                Taro.login({
                    success: res=>{
                        let iv = encodeURIComponent(userInfo.detail.iv)
                        let encryptedData = encodeURIComponent(userInfo.detail.encryptedData)
                        api.post(inter.wxpro,{
                            iv:iv,
                            encryptedData:encryptedData,
                            fuser:this.state.fuser,
                            code: res.code,
                            nickName:userInfo.detail.userInfo.nickName,
                            avatar:userInfo.detail.userInfo.avatarUrl,
                            sex:userInfo.detail.userInfo.gender,
                        }).then((res)=>{
                            if(res.data.status){
                                Taro.setStorageSync('token', res.data.data.token);
                                
                                let authdata = res.data.data;
                                this.setState({
                                    isValid: authdata.valid
                                })

                                if(authdata.new) {
                                    this.setState({
                                        isMobile:true
                                    })
                                } else {
                                    // 认证时 手机号和认证都通过
                                    that.props.success && this.props.success();
                                    if(!authdata.valid){
                                        this._realAuth();
                                    }
                                }
                            } else {
                                Taro.showModal({
                                    title: '登录',
                                    content: '账户已禁用',
                                    showCancel:false
                                }).then(res => console.log(res.confirm, res.cancel))
                            }
                        })
                    },
                })
            } 
        })
        
    }


    _realAuth(){
        Taro.showModal({
            content: "还未实名认证",
            // showCancel: false,
            confirmText: '去认证',
            success: res=> {
                if(res.cancel){
                    this.setState({
                        isMobile: false,
                        isLogin:false
                    })
                }   
                if(res.confirm){
                    this.setState({
                        isMobile: false,
                        isLogin:false
                    })
                    Taro.navigateTo({url:menu.realAuth})
                }
            }
        })
    }
    
    getPhoneNumber = (e) => {
        const {isValid} = this.state
        if(e.detail.errMsg == 'getPhoneNumber:ok'){

            let data = JSON.stringify({
                iv: e.detail.iv,
                encryptedData:e.detail.encryptedData,
            })
            this.setState({
                isMobile:false,
                isLogin:false
            },()=>{
                this.props.success && this.props.success();
            })
            api.post(inter.OuthMobile,{
                data: data
            }).then(res=>{
                if(res.data.status){
                    
                    if(!isValid){
                        this._realAuth();
                    } else {
                        this.setState({
                            isMobile:false,
                            isLogin:false
                        })
                    }
                }
            })
        } else {
            this.props.success && this.props.success();
            if(!isValid){
                this._realAuth();
            } else {
                this.setState({
                    isMobile:false
                })
            }
        }
    }

    //不获取手机号
    _noMbile(){
        var that = this 
        const {isValid} = that.state
        
        that.setState({
            isMobile:false
        },()=>{
            that.props.success && that.props.success();
        })

        if(!isValid){
                
            Taro.showModal({
                content: "还未实名认证",
                // showCancel: false,
                confirmText: '去认证',
                success: res=> {
                    if(res.cancel){
                        this.setState({
                            isMobile: false,
                            isLogin:false
                        })
                    }   
                    if(res.confirm){
                        this.setState({
                            isMobile: false,
                            isLogin:false
                        })
                        Taro.navigateTo({url:menu.realAuth})
                    }
                }
            })
        } else {
            this.setState({
                isMobile:false
            })
        }
    }

    doLogin() {
        this.setState({
            isLogin: true
        })
    }

    render () {
        let {isLogin,isMobile} = this.state

        return (
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
                                         <Button  className='btn gray_label' onClick={()=>this.setState({isLogin:false})} >暂不登录</Button>
                                        <Button open-type='getUserInfo' className='btn lred_label'  onGetUserInfo={this.getUserInfo}>确定登录</Button> 
                                    </View>
                                </View>
                            </View>
                        </View>
                 :null} 
                {
                    isMobile ? 
                     <View className='usershow'>
                        <View className='ctypelayer'></View>
                            <View className='dialog'> 
                            <View className='wrappost'>
                                <Text className='c33_label lg20_label mt_10'>获取手机号</Text>
                                <Text className='c33_label mt_10  lg18_label pl_15 pr_15'>该操作将会获取你手机号操作，是否确认进行登录。</Text>
                                <View className='d_flex fd_r ai_ct wrapbtns'>
                                        <Button  className='btn gray_label' onClick={this._noMbile.bind(this)} >暂不获取</Button>
                                        <Button openType='getPhoneNumber' className='btn lred_label'  onGetPhoneNumber={this.getPhoneNumber}>获取手机号</Button>
                                </View>
                            </View>
                        </View>
                    </View>
                :null}
            </View>
        )
    }

}