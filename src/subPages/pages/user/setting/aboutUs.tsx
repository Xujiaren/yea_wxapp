import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { View ,Text, Image} from '@tarojs/components'

import menu from '../../../../config/menu';

import inter from '../../../../config/inter'
import api from '../../../../services/api'

import asset from '../../../../config/asset'


import  '../../../../config/theme.css';
import './aboutUs.less'

type PageState = {
    unioinId:number,
    userId:number,
}

class aboutUs extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '关于我们',
        navigationBarBackgroundColor:'#FFF',
    }

    constructor () {
        super(...arguments)
        this.state = {
            unioinId:0,
            userId:0,
        }
    }

    componentWillMount () {
    }

    componentDidMount () { 
        var that = this;
        that.getUser();
    }

    componentWillUnmount () {

    }
    
    componentDidShow () { }
    componentDidHide () { }

    getUser(){
        var that = this
        api.get(inter.User)
        .then((res)=>{
            console.log(res)
            if(res.data.status){
                let userData = res.data.data
                that.setState({
                    userId:userData.userId,
                    unioinId:userData.unionId
                })
            }
        })
    }

    render () {

        const {unioinId} = this.state;
        return (
            <View className='root'>
                <View className='li_item d_flex fd_r jc_sb ai_ct bg_white' onClick={()=>{
                    Taro.navigateTo({ url:`${menu.aboutUsInfo}?index=0` + '&title=油葱学堂介绍' })
                }}>
                    <Text className='li_text c33_label'>油葱学堂介绍</Text>
                    <Image src={asset.arrow_right}  className='arrow_icon' />
                </View>
                <View className='li_item d_flex jc_sb ai_ct bg_white'  onClick={()=>{
                    Taro.navigateTo({ url:`${menu.aboutUsInfo}?index=1` + '&title=用户服务使用协议' })
                }}>
                    <Text className='li_text c33_label'>用户服务使用协议</Text>
                    <Image src={asset.arrow_right}  className='arrow_icon' />
                </View>
                <View className='li_item d_flex jc_sb ai_ct bg_white'  onClick={()=>{
                    Taro.navigateTo({ url:`${menu.aboutUsInfo}?index=2` + '&title=隐私条款' })
                }}>
                    <Text className='li_text c33_label'>隐私条款</Text>
                    <Image src={asset.arrow_right}  className='arrow_icon' />
                </View>
                <View className='li_item d_flex jc_sb ai_ct bg_white'  onClick={()=>{
                    Taro.navigateTo({ url:`${menu.aboutUsInfo}?index=3` + '&title=版权声明'})
                }}>
                    <Text className='li_text c33_label'>版权声明</Text>
                    <Image src={asset.arrow_right}  className='arrow_icon' />
                </View>
                
                <View className='li_item d_flex jc_sb ai_ct bg_white'  onClick={() => Taro.navigateTo({url:`${menu.aboutUsInfo}?index=4` + '&title=联系我们'})}>
                    <Text className='li_text c33_label'>联系我们</Text>
                    <Image src={asset.arrow_right}  className='arrow_icon' />
                </View>
                <View className='li_item d_flex jc_sb ai_ct bg_white' onClick={() => Taro.navigateTo({url:'zhenZhao'})}>
                    <Text className='li_text c33_label'>证照信息</Text>
                    <Image src={asset.arrow_right}  className='arrow_icon' />
                </View>
                <View className='li_item d_flex jc_sb ai_ct bg_white'  onClick={()=>{
                    Taro.navigateTo({ url:`${menu.aboutUsInfo}?index=11` + '&title=付费服务及充值协议'})
                }}>
                    <Text className='li_text c33_label'>付费服务及充值协议</Text>
                    <Image src={asset.arrow_right}  className='arrow_icon' />
                </View>
            </View>
        )
    }
}

export default aboutUs as ComponentClass