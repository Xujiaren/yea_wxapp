import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image,Canvas} from '@tarojs/components'


import api from '../../../services/api'
import inter from  '../../../config/inter'
import menu from '../../../config/menu'
import asset from '../../config/asset'

import '../../../config/theme.css'
import './Coupon.less'

type Props = {
    data:{
        price:number,
        discount:number,
        title:string,
        begDate:string,
        endDate:string,
        c_status:number,
        code:string,
        ytype:number,
        ttype:number,
    }
}

type PageState = {

    data:{
        price:number,
        discount:number,
        title:string,
        begDate:string,
        endDate:string,
        c_status:number,
        code:string,
        ytype:number,
        ttype:number,
    },
    
}

export default class Coupon extends Component<Props,PageState> {

   

    constructor () {
        super(...arguments)

        let data = this.props.data;

        this.state = {
            data,
        }
        
    }

    componentWillReceiveProps (nextProps) {
        const {data} = nextProps;

        this.setState({
            data,
        })
    }

    componentWillMount () {
        
    }

    componentDidMount () { 



    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }


    render () {

        const {data} = this.state;


        let windowWidth = 500
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }  catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        if(data === undefined) return null ;
        return (
            <View className='coupon_box'>
                <Image src={asset.bg_coupon}  className='coupon_icon'/>
                <View className='d_flex fd_r ai_ct coupon_cons'> 
                    <View className='d_flex fd_c jc_ct ai_ct coupon_cons_h' style={{width:(windowWidth - 30) * 0.40 * 2 + 'rpx'}}>
                        <Text className='lg26_label sred_label fw_label'><Text className='lg_label sred_label fw_label'>￥</Text>20</Text>
                        <Text className='sm_label'>满100元可用</Text>
                    </View>
                    <View className='d_flex fd_c jc_ct pl_20 coupon_cons_h'>
                        <Text className='lg_label c33_label fw_label'>直播课程专享</Text>
                        <Text className='sm_label mt_10 bf_label' >2019.12.19 - 2020.1.1</Text>
                    </View>
                </View>
            </View>
        )
    }
}