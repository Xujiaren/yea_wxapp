import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem,Audio } from '@tarojs/components'
import menu from '../../../config/menu'
import asset from '../../../config/asset'
import inter from '../../../config/inter'
import api from '../../../services/api'
import Tabs from '../../../components/Tabs'
import '../../../config/theme.css';
import './steps.less'



type PageState = {
    
}


class steps extends Component<{}, PageState> {
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
           
        }

    }

    componentDidMount() {
       
    }
   
    componentDidShow() {

    }


    render() {
        return (
            <View className='box'>
              {/* <Image src={} className='background'/> */}
              <View className='main'></View>
            </View>
        )

    }
}

export default steps as ComponentClass