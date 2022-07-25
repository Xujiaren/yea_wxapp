import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image,Swiper,SwiperItem} from '@tarojs/components'

import menu from '../../../config/menu';


import inter from '../../../config/inter'
import api from '../../../services/api'
import  '../../../config/theme.css';
import './pictures.less'

type PageState = {
    current:number,
    urls:any,
}

class pictures extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationStyle: 'custom',
    }

    constructor () {
        super(...arguments)
        this.state = {
            current:0,
            urls:[],
        }
    }

    componentWillMount () {
    }

    componentDidMount () { 
        const {urls} =this.$router.params
        let url = JSON.parse(urls)
        this.setState({
            urls:url
        })
        var that = this;

    }

    componentWillUnmount () {

    }
    
    componentDidShow () { }
    componentDidHide () { }

   

    
    
    render () {
        const{urls,current}=this.state
        return (
            <View className='box'>
                <View className='tops'>{current+1}/{urls.length}</View>
                <Swiper
                        className='picture'
                        indicatorColor='#999'
                        indicatorActiveColor='#333'
                        circular
                        current={current}
                        onChange={(e) => {
                            let num = e.detail.current + 1
                            this.setState({ current: e.detail.current})
                        }}
                    >
                        {
                            urls.map(item=>{
                                return(
                                    <SwiperItem className='picture'>
                                        <View className='pics' onClick={()=>{Taro.navigateBack({delta:1})}}>
                                            <Image src={item.fpath} mode='widthFix' className='pic'/>
                                        </View>
                                    </SwiperItem>
                                )
                            })
                        }
                    </Swiper>
            </View>
        )
    }
}

export default pictures as ComponentClass