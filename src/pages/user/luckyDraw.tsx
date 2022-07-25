import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View,WebView} from '@tarojs/components'

import  '../../config/theme.css';
import './luckyDraw.less'


import inter from '../../config/inter'
import api from '../../services/api'


type  PageState = {
    lottery:boolean,
    integralnum:number,
    lotterynum:number,
}


class LuckyDraw extends Component<{}, PageState>  {
  
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '翻牌抽奖'
    }

    constructor () {
        super(...arguments)
        this.state = {
            lottery:false,
            integralnum:0,
            lotterynum:0
        }

        this.onmessage = this.onmessage.bind(this)
    }

    componentWillMount(){
        Taro.setStorageSync("back", "y");
        api.get(inter.User)
        .then(res=>{
            if(res.data.status){
                let userData = res.data.data
                this.setState({
                    integralnum:userData.integral,
                    lotterynum:userData.lottery
                })
            }
        })
        Taro.showToast({
            title:'加载中...',
            icon:'loading',
            duration:2000
        })
    }

    componentWillUnmount() {
        // 页面销毁时执行  
    }


    onmessage(e){

        const that = this
        if(e.detail.data[0]){
            Taro.setStorageSync('lucky', JSON.stringify(e.detail.data));
        }
    }


    render () {
        const {integralnum,lotterynum} = this.state
        // console.log(integralnum,lotterynum)
        // var weburl = "https://teach.perfect99.com/event/lucky/index.html?v=76&integral=" +  integralnum + '&lotterynum=' + lotterynum
        var weburl = "https://teach.perfect99.com/event/lucky2/index.html?v=76&integral=" +  integralnum + '&lotterynum=' + lotterynum
        
        // var weburl = "http://localhost:8000/index.html?v=74&integral="  +  integralnum + '&lotterynum=' + lotterynum

        return ( 
            <View className='filpwrap' >
                <WebView src={weburl} onMessage={this.onmessage}></WebView>
            </View>
        )
    }
}


export default LuckyDraw as ComponentClass