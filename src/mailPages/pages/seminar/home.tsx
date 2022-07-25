import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import Seminar from './pages/seminar'
import Lives from './pages/live'
import Maps from './pages/map'
import Moments from './pages/moment'
import Mood from './pages/mood'
import menu from '../../../config/menu'
import asset from '../../../config/asset'
import api from '../../../services/api'
import inter from '../../../config/inter'
import './home.less'
import index from '..'

type PageState = {
    index: number,
    status: number,
    user: any,
    item: Array<any>
}
class home extends Component<{}, PageState> {
    config = {
        navigationStyle: 'custom',
    }
    page: number
    pages: number


    constructor(props) {
        super(props)

        this.page = 0;
        this.pages = 0;

        this.state = {
            index: 0,
            status: 0,
            user: {},
            item: [{ title: '海外研讨会', on: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/forum/home.on.png', src: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/forum/home.png' },
            { title: '精彩直播', on: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/forum/live.on.png', src: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/forum/live.png' },
            { title: '闯关打卡', on: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/forum/map.on.png', src: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/forum/map.png' },
            { title: '精彩瞬间', on: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/forum/moment.on.png', src: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/forum/moment.png' },
            { title: '心情墙', on: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/forum/mood.on.png', src: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/forum/mood.png' }]
        }

    }

    componentDidMount() {

    }

    componentDidShow() {

    }
    _onChange = (ele, val) => {
        if (val != this.state.index) {
            this.setState({ index: val })
        }
    }
    tolive=(val)=>{
        this.setState({index:parseInt(val)})
    }

    render() {

        const { index } = this.state

        return (
            <View className='box row col'>
                {   index == 0 || index == 1 || index == 3 ?
                    <View className='top row jc_sb bg_white ai_ct'>
                        <View onClick={() => { 
                            if(index==0){
                                Taro.navigateBack({ delta: 1 })
                            }else{
                                this.setState({index:0})
                            }
                         }}>
                            {/* <IconFont name={'left_arrow'} size={37} color={'#000000'} /> */}
                            <Image src={asset.lg_icon} className='size_37'/>
                        </View>
                        <View className='label_18_5'>{this.item[index].title}</View>
                        <View></View>
                    </View>
                    : null
                }

                <View className={index==0||index==1||index==3?'pt':null}>
                    {
                        index == 0 ?
                            <Seminar tolive={this.tolive.bind(this)}></Seminar>
                            : index == 1 ?
                                <Lives></Lives>
                                : index == 2 ?
                                    <Maps tolive={this.tolive.bind(this)}></Maps>
                                    : index == 3 ?
                                        <Moments></Moments>
                                        : index == 4 ?
                                            <Mood></Mood>
                                            : null
                    }
                </View>
                <View className='tab row jc_sb bg_white pl_15 pr_15 pt_10'>
                    {
                        this.state.item.map((item, _index) => {
                            return (
                                <View className='row col' onClick={this._onChange.bind(this, item, _index)}>
                                    <View className='row jc_ct'>
                                        {
                                            _index == index ?
                                                <Image src={item.on} className='tab_pic' />
                                                :
                                                <Image src={item.src} className='tab_pic' />
                                        }
                                    </View>
                                    {
                                        _index == index ?
                                            <View className='label_orange'>{item.title}</View>
                                            :
                                            <View className='label_gray'>{item.title}</View>
                                    }
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )

    }
}

export default home as ComponentClass