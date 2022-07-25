import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input, Video } from '@tarojs/components'
import Tabs from '../../../components/Tabs'

import api from '../../../services/api'
import inter from '../../../config/inter'
import { subNumTxt, learnNum, percent2percent25 } from '../../../utils/common'
import menu from '../../../config/menu';
import asset from '../../../config/asset';
import asset1 from '../../config/asset';
import './activeLive.less'
import './bangDan.less'
type PageState = {
    list: Array<any>,
    background: string,
}

class bangDan extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationStyle: 'custom',
    }
    page: number;
    pages: number;

    constructor() {
        super(...arguments)

        this.page = 0;
        this.pages = 0;

        this.state = {
            list: [],
            background: '',
        }
    }

    componentWillMount() {
    }
    componentDidMount() {
        const { courseId, background } = this.$router.params
        if (background) {
            this.setState({
                background: background
            })
        }
        api.get(inter.bangdan + parseInt(courseId))
            .then(res => {
                console.log(res)
                if (res.data.status) {
                    this.setState({
                        list: res.data.data
                    })
                }
            })

    }
    componentWillUnmount() { }
    componentDidShow() { }
    componentDidHide() { }

    //直播数据

    infoName=(val)=>{
        if(val.length>5){
            return val.slice(0,5)+'...'
        }else{
            return val
        }
    }
    render() {
        const { list, background } = this.state
        let one = []
        let two = []
        let three = []
        let ones = []
        let twos = []
        let threes = []
        if (list.length > 0) {
            one = Object.values(list[0])
            ones = Object.keys(list[0])
        }
        if (list.length > 1) {
            two = Object.values(list[1])
            twos = Object.keys(list[1])
        }
        if (list.length > 2) {
            three = Object.values(list[2])
            threes = Object.keys(list[2])
        }
        console.log(one)
        return (
            <View className='bang'>

                <View className='backg'>
                    <Image src={background} style={{ width: '100%', height: '100%' }} />
                </View>
                <View onClick={() => { Taro.navigateBack({ delta: 1 }) }} >
                    <Image src={asset.back_w} className='backs'/>
                </View>
                <View className='label_white label_18 head'>贡献榜</View>
                <View className='row jc_ct ai_ct photo'>
                    <View className='cover'>
                        <Image src={asset1.two} className='p_two' />
                        {
                            list.length > 1 ?
                                <Image src={two[0].avatar} className='picsss' />
                                : null
                        }
                    </View>
                    <View className='cov'>
                        <Image src={asset1.one} className='p_two' />
                        {
                            list.length > 0 ?
                                <Image src={one[0].avatar} className='picss' />
                                : null
                        }
                    </View>
                    <View className='covers'>
                        <Image src={asset1.three} className='p_two' />
                        {
                            list.length > 2 ?
                                <Image src={three[0].avatar} className='picsss' />
                                : null
                        }
                    </View>
                </View>
                <View className='lnames'>
                    <View className='threes'>
                        <Text className='hids'>{two.length > 0 ? this.infoName(two[0].nickname) : ''}</Text>
                        <View style={{ fontWeight: '300', fontSize: '28rpx' }}>{two.length > 0 ? twos[0] + '学分' : null}</View>
                    </View>
                    <View className='threes'>
                        <Text className='hids'>{one.length > 0 ? this.infoName(one[0].nickname) : ''}</Text>
                        <View style={{ fontWeight: '300', fontSize: '28rpx' }}>{one.length > 0 ? ones[0] + '学分' : null}</View>
                    </View>
                    <View className='threes'>
                        <Text className='hids'>{three.length > 0 ? this.infoName(three[0].nickname): ''}</Text>
                        <View style={{ fontWeight: '300', fontSize: '28rpx' }}>{three.length > 0 ? threes[0] + '学分' : null}</View>
                    </View>
                </View>
                <View className='bottn'></View>
                {
                    list.length > 0 ?
                        <View className='bodys row col'>
                            {
                                list.map((item, index) => {
                                    var mss = Object.values(item)
                                    var value = Object.keys(item)
                                    if (index > 2 && index < 12) {
                                        return (
                                            <View className='row ai_ct label_three label_16 mt_30'>
                                                <View className='bold ml_10 wds'>{index + 1}</View>
                                                <View className='row ai_ct ml_20 tip'>
                                                    <View className='apicss'>
                                                        <Image src={mss[0].avatar} className='apicss' />
                                                    </View>
                                                    <View className='bold ml_5'>{mss[0].nickname}</View>
                                                </View>
                                                <View className='ml_20'>{value[0]}学分</View>
                                            </View>
                                        )
                                    }
                                })
                            }
                        </View>
                        : null
                }

            </View>
        )
    }
}

export default bangDan as ComponentClass