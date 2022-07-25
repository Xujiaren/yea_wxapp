import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'

import '../config/theme.css'
import './GetInt.less'
import api from '../services/api'
import inter from '../config/inter'


import menu from '../config/menu'
import wxDiscode from 'src/wxParse/wxDiscode'

type Props = {
    onOkeys:() => void,
    show:boolean,
    integral:number
}

type PageState = {

}

export default class GetInt extends Component<Props, PageState> {

    constructor() {
        super(...arguments)


        this.state = {
           
        }

    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }



    render() {
        const{integral,show,onOkeys}=this.props
        return (
            <View>
                {
                    show?
                        <View className='box'>
                            <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/base/model.score.png'} className='piccs' />
                            <View className='jc_ct mt'>
                                恭喜您
                        </View>
                            <View className='jc_ct mt_1'>
                                获得 {integral} 学分
                        </View>
                            <View className='jc_ct mt_10'>
                                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/eaf0f6ec-af98-45ef-940a-cf8034f14d62.gif'} className='pic' />
                            </View>
                            <View className='jc_ct mt_20'>
                                <View className='btn' onClick={onOkeys}>确定</View>
                            </View>
                        </View>
                        : null
                }
            </View>
        )
    }

}