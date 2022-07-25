import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image,Canvas} from '@tarojs/components'


import {formatTimeStampToTime} from '../../../utils/common'
import asset from '../../config/asset'

import '../../../config/theme.css'
import './Coupon.less'

type Props = {
    data:{
        "ucId": number,
        "couponId": number,
        "couponName": string,
        "couponType": number,
        "code": string,
        "userId": number,
        "amount": number,
        "requireAmount": number,
        "orderId": number,
        "pubTime": number,
        "beginTime": number,
        "endTime": number,
        "ctype": number,
        "contentId": number,
        "isPlus": number,
        "from": number,
        "status": number,
    },
    type:number,
    onCopy:(msg)=>void
}

type PageState = {
    ytype:number,

    data:{
        "ucId": number,
        "couponId": number,
        "couponName": string,
        "couponType": number,
        "code": string,
        "userId": number,
        "amount": number,
        "requireAmount": number,
        "orderId": number,
        "pubTime": number,
        "beginTime": number,
        "endTime": number,
        "ctype": number,
        "contentId": number,
        "isPlus": number,
        "from": number,
        "status": number,
    },
    type:number,
}

export default class Coupon extends Component<Props,PageState> {

   

    constructor () {
        super(...arguments)

        let ytype = this.props.data !== undefined ?  this.props.data.status : 0 ;
        let data = this.props.data;
        let type = this.props.type;

        this.state = {
            ytype,
            data,
            type,
        }
        
    }

    componentWillReceiveProps (nextProps) {
        const {data,type} = nextProps;

        this.setState({
            ytype:data !== undefined ? data.status : 0,
            data,
            type,
        })
    }

    componentWillMount () {
        
    }

    componentDidMount () { 



    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    _onCopy = (msg) => {
        this.props.onCopy(msg)
    }

    render () {

        const {ytype,data,type} = this.state;


        let windowWidth = 500
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }  catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        if(data === undefined) return null ;

        return (
            <View>
                {
                    type === 0 && ytype === 0 ?
                    <View className='coupon_box'>
                        <Image src={asset.bg_coupon}  className='coupon_icon'/>
                        <View className='d_flex fd_r ai_ct coupon_cons'> 
                            <View className='d_flex fd_c jc_ct ai_ct coupon_cons_h' style={{width:(windowWidth - 30) * 0.40 * 2 + 'rpx'}}>
                                {
                                    data.ctype==3?
                                    <Text className='lg26_label sred_label fw_label'>{data.integral}学分</Text>
                                    :
                                    <Text className='lg26_label sred_label fw_label'><Text className='lg_label sred_label fw_label'>￥</Text>{data.amount}</Text>
                                }
                                {
                                    data.ctype==3?
                                    <Text className='sm_label'>满{data.requireIntegral}可用</Text>
                                    :
                                    <Text className='sm_label'>满{data.requireAmount}元可用</Text>
                                }
                                
                            </View>
                            <View className='d_flex fd_c jc_ct pl_20 coupon_cons_h'>
                                <Text className='lg_label c33_label fw_label'>{data.couponName}</Text>
                                {
                                    data.endTime==0?
                                    <Text className='sm_label mt_10 bf_label' >{formatTimeStampToTime(data.beginTime * 1000)} - 无期限</Text>
                                    :
                                    <Text className='sm_label mt_10 bf_label' >{formatTimeStampToTime(data.beginTime * 1000)} - {formatTimeStampToTime(data.endTime * 1000)}</Text>
                                }
                            </View>
                        </View>
                    </View>
                :null}

                {
                    type === 1 && (ytype === 2 || ytype === 1) ?
                    <View className='coupon_box'>
                        <Image src={asset.bg_fail_coupon}  className='coupon_icon'/>
                        <View className='d_flex fd_r ai_ct coupon_cons'> 
                            <View className='d_flex fd_c jc_ct ai_ct coupon_cons_h' style={{width:(windowWidth - 30) * 0.40 * 2 + 'rpx'}}>
                                {
                                    data.ctype==3?
                                    <Text className='lg26_label tip_label fw_label'>{data.integral}学分</Text>
                                    :
                                    <Text className='lg26_label tip_label fw_label'><Text className='lg_label tip_label fw_label'>￥</Text>{data.amount}</Text>
                                }
                                {
                                    data.ctype==3?
                                    <Text className='sm_label bf_label' >满{data.requireIntegral}可用</Text>
                                    :
                                    <Text className='sm_label bf_label' >满{data.requireAmount}元可用</Text>
                                }
                                
                            </View>
                            <View className='d_flex fd_c jc_ct pl_20 coupon_cons_h'>
                                <Text className='lg_label tip_label fw_label'>{data.couponName}</Text>
                                {
                                    data.endTime==0?
                                    <Text className='sm_label mt_10 bf_label'>{formatTimeStampToTime(data.beginTime * 1000)} - 无期限</Text>
                                    :
                                    <Text className='sm_label mt_10 bf_label'>{formatTimeStampToTime(data.beginTime * 1000)} - {formatTimeStampToTime(data.endTime * 1000)}</Text>
                                }
                            </View>
                        </View>
                    </View>
                :null}


                {
                    type === 2?
                    <View className='coupon_box'>
                        <Image src={asset.bg_null_coupon}  className='coupon_icon'/>
                        <View className='d_flex fd_c jc_ct coupon_cons coupon_cons_h ml_25'> 
                            <Text className='sred_label lg_label fw_label'>兑换码</Text>
                            <View className='d_flex fd_r ai_ct mt_8'>
                                <View className='codeback pr_10'>
                                    <Text className='black_label default_label mt_2'>{data.code}</Text>
                                </View>
                                <View className='nocopyBtn' onClick={this._onCopy.bind(this,data.code)}>
                                    <Text className='gray_label sm_label'>复制</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                :null}

                {/* {
                    type === 2 &&ytype === 2 && ttype === 1 ?
                    <View className='coupon_box'>
                        <Image src={asset.bg_used_coupon}  className='coupon_icon'/>
                        <View className='d_flex fd_c jc_ct coupon_cons coupon_cons_h ml_25'> 
                            <Text className='gray_label lg_label fw_label'>兑换码</Text>
                            <View className='d_flex fd_r ai_ct mt_10'>
                                <View className='codeback pr_10'>
                                    <Text className='black_label default_label'>348827733331311192112113</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                :null} */}

            </View>
            
        )
    }
}