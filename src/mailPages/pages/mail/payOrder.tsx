import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import menu from '../../../config/menu';
import asset from '../../config/asset'
import asset1 from '../../../config/asset'

import inter from '../../../config/inter'
import api from '../../../services/api'
import '../../../config/theme.css';
import './payOrder.less'

type PageState = {
    goods_number: number,
    adsData: {
        address: string,
        addressId: number,
        addressName: string,
        city: string,
        district: string,
        isFirst: number,
        mobile: string,
        province: string,
        realname: string,
        userId: number
    },
    integral: number,
    selectIntegral: boolean,
    goodsAttrIds: any,
    goodsAttr_str: string,

    goodsIntegral: number,
    goodsName: string,
    goodsImg: string,
    goods_id: number,

    gtype: number,
    goodsAmount: number,

    goodsActivityDTO: object,

    discount: number,
    finalPrice: number,
    freightAmount: number,
    goodsDesc: object,

    payType: number,
    couponList:Array<{}>,
    cid:Array<number>,
    couponId:number,
    amount:number,
    isFree:number,
    ttyps:number
}

class payOrder extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '结算'
    }

    constructor() {
        super(...arguments)
        this.state = {
            goods_number: 0,
            adsData: {},
            goodsAttrIds: {},
            integral: 0,
            selectIntegral: false,
            goodsAttr_str: '',

            payType: 0, // 2 微信 9 小程序
            goodsIntegral: 0,
            goodsName: '',
            goodsImg: '',
            goods_id: 0,

            gtype: 0, // 2  现金 3 学分
            goodsAmount: 0,

            goodsActivityDTO: {},

            discount: 0,
            finalPrice: 0,

            freightAmount: 0,

            goodsDesc: {},
            couponList:[],
            cid:[],
            couponId:-1,
            amount:0,
            isFree:0,
            ttyps:0
        }
    }

    componentWillMount() {
        var that = this
        const { goods_number, goodsAttrIds, goodsAttr_str, goodsIntegral, goodsName, goodsImg, goods_id, gtype, goodsAmount, goodsActivityDTO, goodsDesc,isFree } = that.$router.params
        api.get(inter.shopDesc+goods_id).then(res=>{
            let list = res.data.data
            let cid = list.couponList.map(item=>item==item?item.couponId:null)
            that.setState({
                couponList:list.couponList,
                cid:cid
            })
        })
        that.setState({
            goods_number: parseInt(goods_number),
            goodsAttrIds: JSON.parse(goodsAttrIds),
            goodsAttr_str: goodsAttr_str,
            goodsIntegral: parseInt(goodsIntegral),
            goodsName: goodsName,
            goodsImg: goodsImg,
            goods_id: parseInt(goods_id),
            gtype: parseInt(gtype),
            goodsAmount: goodsAmount * 1,
            goodsActivityDTO: JSON.parse(goodsActivityDTO),
            goodsDesc: JSON.parse(goodsDesc),
            isFree:parseInt(isFree),
        })

        this._freactivtity = this._freactivtity.bind(this);
        this._freight = this._freight.bind(this);
        this._shipAmount = this._shipAmount.bind(this);
        this._onSelect = this._onSelect.bind(this);
    }

    componentDidMount() {
        var that = this
        that._getAddress()
        that._getUser()
        that._freactivtity()
    }

    componentWillUnmount() {

    }

    componentDidShow() {
        let pages = Taro.getCurrentPages();
        let currPage = pages[pages.length - 1]; // 获取当前页面
        if (currPage.__data__.adsData) { // 获取值
            this.setState({
                adsData: currPage.__data__.adsData
            }, () => {
                this._freight()
            })
        }
        if (currPage.__data__.couponId) { // 获取值
            console.log(currPage.__data__.couponId,'?????????')
            this.setState({ 
                couponId: currPage.__data__.couponId,
                amount: currPage.__data__.amount
            })
          } 
    }

    componentDidHide() { }


    // 获取个人信息判断是否登录
    _getUser() {
        var that = this
        api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    let userData = res.data.data
                    that.setState({
                        integral: userData.integral+userData.rintegral,
                    })
                }
            })
    }

    _getAddress() {
        var that = this;
        api.get(inter.Address)
            .then((res) => {
                if (res.data.status) {
                    let adres = res.data.data;
                    adres.map((addr, index) => {
                        if (addr.isFirst == 1) {
                            that.setState({
                                adsData: addr
                            }, () => {
                                this._freight();
                            })
                        }
                    })
                }
            })
    }

    _freight() {
        var that = this.state;
        const { adsData, goodsDesc, goods_number } = this.state;

        if (Object.keys(adsData).length > 0) {

            let province = '';
            let city = '';

            if (adsData.province.indexOf('上海') > -1 || adsData.province.indexOf('北京') > -1 || adsData.province.indexOf('天津') > -1 || adsData.province.indexOf('重庆') > -1) {
                province = adsData.province.replace("市", "");

                console.log(province)
            } else if (adsData.province.indexOf('广西') > -1) {
                province = '广西';
            } else if (adsData.province.indexOf('内蒙古') > -1) {
                province = '内蒙古';
            } else if (adsData.province.indexOf('广西') > -1) {
                province = '广西';
            } else if (adsData.province.indexOf('西藏') > -1) {
                province = '西藏';
            } else if (adsData.province.indexOf('宁夏') > -1) {
                province = '宁夏';
            } else if (adsData.province.indexOf('新疆') > -1) {
                province = '新疆';
            } else {
                province = adsData.province.substr(0, adsData.province.length - 1);
            }

            // province = adsData.province;

            if (adsData.city.indexOf('上海') > -1 || adsData.city.indexOf('北京') > -1 || adsData.city.indexOf('天津') > -1 || adsData.city.indexOf('重庆') > -1) {
                city = adsData.city;
            } else if (adsData.city.indexOf('市') > -1) {
                city = adsData.city.substr(0, adsData.city.length - 1);
            } else if (adsData.city.indexOf('地区') > -1) {
                city = adsData.city.substr(0, adsData.city.length - 2);
            } else if (adsData.city.indexOf('盟') > -1) {
                city = adsData.city.substr(0, adsData.city.length - 1);
            } else if (adsData.province.indexOf('海南') > -1) {
                if (adsData.district.indexOf('黎族苗族') > -1) {
                    city = adsData.district.substr(0, adsData.district.length - 7);
                } else {
                    city = adsData.district.substr(0, adsData.district.length - 1);
                }
            } else if (adsData.province.indexOf('新疆') > -1) {

                if (adsData.city.indexOf('回族自治州') > -1) {
                    city = adsData.city.substr(0, adsData.city.length - 5);
                } else if (adsData.city.indexOf('蒙古自治州') > -1) {
                    city = adsData.city.substr(0, adsData.city.length - 5);
                } else if (adsData.city.indexOf('哈萨克自治州') > -1) {
                    city = adsData.city.substr(0, adsData.city.length - 6);
                } else if (adsData.city.indexOf('哈萨克自治州') > -1) {
                    city = adsData.city.substr(0, adsData.city.length - 6);
                } else if (adsData.city.indexOf('自治区直辖县级行政区') > -1) {
                    city = adsData.district.substr(0, adsData.district.length - 1);
                } else if (adsData.city.indexOf('克孜勒苏柯尔克孜') > -1) {
                    city = '克孜勒苏柯尔克孜';
                }

            }


            let allWeight = goodsDesc.goodsWeight * goods_number;

            // console.log(province, 'province', adsData)

            this._shipAmount(province, city, allWeight);

        }


    }

    _shipAmount(province, city, allWeight) {
        const{gtype}=this.state
        // console.log(province, city, allWeight,"///")
        api.get(inter.shipAmount, {
            province: province,
            city: city,
            goods_weight: allWeight,
        }).then((res) => {
            // console.log(res,"???")
            if (res.data.status) {
                this.setState({
                    freightAmount: res.data.data,
                })

            } else {
                if(gtype!=3){
                    Taro.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
                }
            }
        })
    }

    _freactivtity() {
        var that = this;
        const { goodsActivityDTO, goods_number, goodsAmount } = that.state;

        let total_price = (goods_number * goodsAmount).toFixed(2);

        if (goodsActivityDTO.activityId !== 0) {

            if (goodsActivityDTO.way === 1) {

                if (parseInt(goodsActivityDTO.condFir) <= parseInt(goods_number)) {

                    let dis_amount = (goods_number * goodsAmount * (goodsActivityDTO.condSec * 1)).toFixed(2);
                    let dis_amount_m = (goods_number * goodsAmount * (1 - goodsActivityDTO.condSec * 1)).toFixed(2);

                    this.setState({
                        discount: dis_amount_m * 1,
                        finalPrice: dis_amount * 1,
                    })

                } else {
                    that.setState({
                        finalPrice: total_price * 1
                    })
                }
            } else {

                if (total_price * 1 >= goodsActivityDTO.condFir * 1) {
                    

                    let price = (total_price - goodsActivityDTO.condSec * 1).toFixed(2)
                    // console.log(price,"?????")
                    this.setState({
                        discount: goodsActivityDTO.condSec * 1,
                        finalPrice: price,
                    })

                } else {
                    that.setState({
                        finalPrice: total_price * 1
                    })
                }

            }
        } else {
            that.setState({
                finalPrice: total_price * 1
            })
        }
    }

    _selectIntegral() {
        var that = this;

        const { selectIntegral } = that.state

        that.setState({
            selectIntegral: !selectIntegral
        })
    }


    // 付款 学分
    _payOrder() {
        var that = this
        const { selectIntegral,payType,couponId, goodsAttrIds, adsData, goods_number, integral, goodsIntegral, goods_id, gtype } = that.state

        let attrids = Object.values(goodsAttrIds).join(",");


        if (Object.keys(adsData).length > 0) {

            if (gtype === 3) {

                if (selectIntegral) {
                    if (goodsIntegral * goods_number < integral) {
                        api.post(inter.goodSubmit, {
                            buy_type: 0,
                            pay_type: 3,
                            goods_id: goods_id,
                            goods_number: goods_number,
                            attr_ids: attrids,
                            coupon_id: -1,
                            address_id: adsData.addressId,
                            remark: ''
                        }).then((res) => {
                            if (res.data.status) {
                                Taro.showToast({
                                    title: '购买成功',
                                    icon:'success',
                                    duration:2000
                                })
                                that.setState({
                                    ttyps:1
                                })
                                setTimeout(() => {
                                    Taro.redirectTo({
                                        url: menu.mailOrder
                                    })
                                }, 2000);
                            }
                            
                        })
                    } else {
                        Taro.showToast({
                            title: '学分不足',
                            icon: 'none',
                            duration: 1000,
                        })
                    }

                } else {
                    Taro.showToast({
                        title: '请选择学分',
                        icon: 'none',
                        duration: 1000,
                    })
                }

            } else if(gtype === 2){
                console.log('微信支付');
                if(payType==9){
                    console.log(goods_id,goods_number,attrids,couponId,adsData.addressId,'支付！！！！！')
                    api.post(inter.orderSubmit, {
                        buy_type: 0,
                        pay_type: 9,
                        goods_id: goods_id,
                        goods_number: goods_number,
                        attr_ids: attrids,
                        coupon_id:couponId,
                        address_id: adsData.addressId,
                        remark: ''
                    }).then((res) => {
                        if (res.data.status) {
                            let pay = res.data.data.pay_info;
                            if(pay=='already_payed'){
                                Taro.showToast({
                                    title: '已支付',
                                    icon:'success',
                                    duration: 2000,
                                })
                                that.setState({
                                    ttyps:1
                                })
                                setTimeout(() => {
                                    Taro.redirectTo({
                                        url: menu.mailOrder
                                    })
                                }, 2000);
                            }else{
                                Taro.requestPayment({
                                    timeStamp: (pay.timeStamp).toString(),
                                    nonceStr: pay.nonceStr,
                                    package: pay.package,
                                    signType: 'MD5',
                                    paySign: pay.sign,
                                    success: function (res) {
                                        Taro.showToast({
                                            title: '支付成功',
                                            icon:'success',
                                            duration: 2000,
                                        })
                                        that.setState({
                                            ttyps:1
                                        })
                                        setTimeout(() => {
                                            Taro.redirectTo({
                                                url: menu.mailOrder
                                            })
                                        }, 2000);
                                        // const data ={
                                        //     "keyword1": {
                                        //         "value": orderdesc.goods_info.goods_name, 
                                        //     }, 
                                        //     "keyword2": {
                                        //         "value": orderdesc.total.price+'元', 
                                        //     } , 
                                        //     "keyword3": {
                                        //         "value": moment(Date.parse(new Date())).format("YYYY-MM-DD HH:mm:ss"), 
                                        //     } , 
                                        //     "keyword4": {
                                        //         "value": "已支付", 
                                        //     } 
                                        // }
                                        // const jsondata = JSON.stringify(data);
                                        // api.post('sendmess',{
                                        //     backend:0,
                                        //     template_id:'POtCI29lnf8Ae18mfZyhf607ltCLWLbK3H8nUmw07Vk',
                                        //     form_id:e.detail.formId,
                                        //     u_id:this.state.userhead.user_id, 
                                        //     send_data:jsondata
                                        // }).then(res=>{
                                        //     console.log(res);
                                        // })       
                                    },
                                    fail: function (res) {
                                        console.log(res)
                                       
                                        setTimeout(() => {
                                            Taro.redirectTo({
                                                url: menu.mailOrder
                                            })
                                        }, 500);
                                    }
                                })
                            }
                        }
                    })
                }else{
                    Taro.showToast({
                        title: '请选择支付方式',
                        icon: 'none',
                        duration: 1000,
                    })
                }

            }else if(gtype===4){
                if (selectIntegral) {
                    if(payType==9){
                        if (goodsIntegral * goods_number < integral) {
                            api.post(inter.orderSubmit, {
                                buy_type: 0,
                                pay_type: 9,
                                goods_id: goods_id,
                                goods_number: goods_number,
                                attr_ids: attrids,
                                coupon_id: couponId,
                                address_id: adsData.addressId,
                                remark: ''
                            }).then((res) => {
                                if (res.data.status) {
                                    let pay = res.data.data.pay_info;
                                    Taro.requestPayment({
                                        timeStamp: (pay.timeStamp).toString(),
                                        nonceStr: pay.nonceStr,
                                        package: pay.package,
                                        signType: 'MD5',
                                        paySign: pay.sign,
                                        success: function (res) {
                                            api.post(inter.goodSubmit, {
                                                buy_type: 0,
                                                pay_type: 3,
                                                goods_id: goods_id,
                                                goods_number: goods_number,
                                                attr_ids: attrids,
                                                coupon_id: -1,
                                                address_id: adsData.addressId,
                                                remark: ''
                                            }).then((res) => {
                                                if (res.data.status) {
                                                    Taro.showToast({
                                                        title: '支付成功',
                                                        icon:'success',
                                                        duration: 2000,
                                                    })
                                                }
                                                that.setState({
                                                    ttyps:1
                                                })
                                                setTimeout(() => {
                                                    Taro.redirectTo({
                                                        url: menu.mailOrder
                                                    })
                                                }, 2000);
                                            })
                                           
                                            // const data ={
                                            //     "keyword1": {
                                            //         "value": orderdesc.goods_info.goods_name, 
                                            //     }, 
                                            //     "keyword2": {
                                            //         "value": orderdesc.total.price+'元', 
                                            //     } , 
                                            //     "keyword3": {
                                            //         "value": moment(Date.parse(new Date())).format("YYYY-MM-DD HH:mm:ss"), 
                                            //     } , 
                                            //     "keyword4": {
                                            //         "value": "已支付", 
                                            //     } 
                                            // }
                                            // const jsondata = JSON.stringify(data);
                                            // api.post('sendmess',{
                                            //     backend:0,
                                            //     template_id:'POtCI29lnf8Ae18mfZyhf607ltCLWLbK3H8nUmw07Vk',
                                            //     form_id:e.detail.formId,
                                            //     u_id:this.state.userhead.user_id, 
                                            //     send_data:jsondata
                                            // }).then(res=>{
                                            //     console.log(res);
                                            // })
            
            
                                        },
                                        fail: function (res) {
                                            console.log(res)
                                        }
                                    })
                                }
                            })
                        } else {
                            Taro.showToast({
                                title: '学分不足',
                                icon: 'none',
                                duration: 1000,
                            })
                        }
                    }else{
                        Taro.showToast({
                            title: '请选择支付方式',
                            icon: 'none',
                            duration: 1000,
                        })
                    }
                } else {
                    Taro.showToast({
                        title: '请选择学分',
                        icon: 'none',
                        duration: 1000,
                    })
                }
            }

        } else {
            Taro.showToast({
                title: '请选择收货地址',
                icon: 'none',
                duration: 1000,
            })
        }

    }

    _onSelect() {

        var that = this;
        that.setState({
            payType: 9,
        })
    }
    onCoupon=()=>{
        const{goodsAmount , goods_number}=this.state
        let price=goodsAmount * goods_number
        Taro.navigateTo({
            url:menu.userCoupon+'?type=2'+'&price='+price+'&coupons='+JSON.stringify(this.state.cid)
        })
    }

    render() {

        const { goods_number, adsData, integral,amount, selectIntegral, goodsAttr_str, goodsIntegral, goodsName, goodsImg, gtype, goodsAmount, goodsActivityDTO, finalPrice, discount, freightAmount, payType,isFree } = this.state;
        let pay_prices = 0
        if(isFree==1){
            pay_prices = finalPrice
        }else{
            pay_prices = finalPrice + freightAmount;
        }
        return (
            <View className='wrap'>
                <View className='addres'>
                    <Image src={asset.ads_head} className='ads_side' />

                    <View className='order_ads d_flex fd_r ai_ct'
                        onClick={() => Taro.navigateTo({ url: menu.address + '?nageType=1' })}
                    >
                        <Image src={asset.location} className='ads_img' />
                        {
                            Object.keys(adsData).length > 0 ?
                                <View className='d_flex fd_c ml_15'>
                                    <Text className='c33_label default_label fw_label'>{adsData.realname} {adsData.mobile}</Text>
                                    <Text className='gray_label default_label'>{adsData.province + adsData.city + adsData.district + adsData.address}</Text>
                                </View>
                                :
                                <View className='d_flex fd_c ai_ct ml_15'>
                                    <Text className='gray_label default_label'>请选择地址</Text>
                                </View>
                        }
                    </View>
                    <Image src={asset.ads_head} className='ads_side' />
                </View>

                <View className='mt_10 bg_white'>
                    <View className='itemLists pl_15 pr_15' >
                        <View className='itemList d_flex pt_15 pb_10'>
                            <Image src={goodsImg} className='itemCover' />
                            <View className='d_flex fd_c jc_sb col_1'>
                                <View className='d_flex fd_c'>
                                    <Text className='c33_label default_label fw_label'>{goodsName}</Text>
                                    <Text className='tip_label default_label'>{goodsAttr_str.length > 0 ? goodsAttr_str : '默认规格'}</Text>
                                </View>
                                <View className='d_flex fd_r jc_sb'>
                                    {
                                        gtype === 2 ?
                                            <Text className='default_label sred_label fw_label'>¥{goodsAmount}</Text>
                                            : null}
                                    {
                                        gtype === 3 ?
                                            <Text className='default_label sred_label fw_label'>{goodsIntegral}学分</Text>
                                            : null}
                                     {
                                        gtype === 4 ?
                                            <Text className='default_label sred_label fw_label'>¥{goodsAmount}+{goodsIntegral}学分</Text>
                                            : null}       

                                    <Text className='sm_label black_label'>x{goods_number}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>


                {
                    gtype === 2 || gtype === 4 ?
                        <View className="d_flex fd_r ai_ct jc_sb pt_12 pb_12 pl_20 pr_15 bg_white mt_10 mb_10">
                            <Text className="default_label gray_label">优惠券</Text>
                            <View className="d_flex fd_r ai_ct"  onClick={this.onCoupon}>
                                <Text className="default_label gray_label">￥{amount.toFixed(2)}</Text>
                                <Image src={asset1.arrow_right} className='arrow_right' />
                            </View>
                        </View>
                        : null}


                {
                    gtype === 2 ?
                        <View className='d_flex  fd_c mt_10'>
                            <View className='d_flex fd_r jc_sb pl_20 pr_15 bg_white pt_12 pb_12 border_bt'>
                                <Text className='default_label c33_label'>总价</Text>
                                <Text className='lg_label c33_label fw_label'>¥{goodsAmount * goods_number}</Text>
                            </View>
                            <View className='pl_20 pr_15 bg_white'>

                                <View className='d_flex fd_r jc_sb pt_5 pb_5'>
                                    <Text className='default_label gray_label'>运费</Text>
                                    <Text className='default_label c33_label'>￥{isFree==1?'0':freightAmount}</Text>
                                </View>
                                {
                                    goodsActivityDTO.activityId !== 0 ?
                                        <View className='d_flex fd_r jc_sb pt_5 pb_5'>
                                            <Text className='default_label gray_label'>{goodsActivityDTO.title}</Text>
                                            <Text className='default_label c33_label'>-¥{discount}</Text>
                                        </View>
                                        : null}
                            </View>
                            <View className='d_flex fd_r jc_sb pl_20 pr_15 bg_white pt_12 pb_12 border_tp'>
                                <Text className='default_label c33_label'>实付款</Text>
                                    
                                <Text className='lg_label fw_label'>¥{(pay_prices-amount).toFixed(2)>0?(pay_prices-amount).toFixed(2):'0.0'}</Text>
                            </View>
                        </View>
                        : null}
                {
                    gtype === 4 ?
                        <View className='d_flex  fd_c mt_10'>
                            <View className='d_flex fd_r jc_sb pl_20 pr_15 bg_white pt_12 pb_12 border_bt'>
                                <Text className='default_label c33_label'>总价</Text>
                                <Text className='lg_label c33_label fw_label'>¥{goodsAmount * goods_number}</Text>
                            </View>
                            <View className='pl_20 pr_15 bg_white'>

                                <View className='d_flex fd_r jc_sb pt_5 pb_5'>
                                    <Text className='default_label gray_label'>运费</Text>
                                    <Text className='default_label c33_label'>￥{isFree==1?'0':freightAmount}</Text>
                                </View>
                                {
                                    goodsActivityDTO.activityId !== 0 ?
                                        <View className='d_flex fd_r jc_sb pt_5 pb_5'>
                                            <Text className='default_label gray_label'>{goodsActivityDTO.title}</Text>
                                            <Text className='default_label c33_label'>-¥{discount}</Text>
                                        </View>
                                        : null}
                            </View>
                            <View className='d_flex fd_r jc_sb pl_20 pr_15 bg_white pt_12 pb_12 border_tp'>
                                <Text className='default_label c33_label'>实付款</Text>
                                <Text className='lg_label fw_label'>¥{(pay_prices-amount).toFixed(2)>0?(pay_prices-amount).toFixed(2):'0.0'}</Text>
                            </View>
                            {/* <View className='pl_20 pr_15 pt_12 pb_12 bg_white mb_10 mt_1 d_flex fd_r ai_ct jc_sb' onClick={this._selectIntegral}>
                                <Text className='default_label c33_label'>可用学分 {integral}</Text>
                                <Image src={selectIntegral ? asset.radio_full : asset.radio} className='radio' />
                            </View> */}
                        </View>
                        : null}

                {
                    gtype === 3 ?
                        <View className='d_flex fd_r jc_sb pl_20 pr_15 bg_white pt_12 pb_12 border_bt mt_10'>
                            <Text className='default_label c33_label'>总价</Text>
                            <Text className='default_label c33_label fw_label'>{goodsIntegral * goods_number}学分</Text>
                        </View>
                        : null}
                {
                    gtype === 3 ?
                        <View className='pl_20 pr_15 pt_12 pb_12 bg_white mb_10 mt_1 d_flex fd_r ai_ct jc_sb' onClick={this._selectIntegral}>
                            <Text className='default_label c33_label'>可用学分 {integral}</Text>
                            <Image src={selectIntegral ? asset.radio_full : asset.radio} className='radio' />
                        </View>
                        : null}


                {
                    gtype === 2 ?
                        <View className='mt_10'>
                            <View className='pl_20 pr_15 pt_12 pb_12 bg_white d_flex fd_r jc_sb border_bt'>
                                <View className='d_flex fd_r ai_ct '>
                                    <Text className='default_label c33_label'>支付方式</Text>
                                </View>
                            </View>
                            <View className='pl_20 pr_15 pt_12 pb_12 bg_white d_flex fd_r jc_sb border_bt' onClick={this._onSelect}>
                                <View className='d_flex fd_r ai_ct '>
                                    <Image src={asset.wechat_pay} className='payIcon' />
                                    <Text className='default_label c33_label pl_10'>微信支付</Text>
                                </View>
                                <Image src={payType === 9 ? asset.radio_full : asset.radio} className='radio' />
                            </View>
                        </View>
                        : null}
                 {
                    gtype === 4 ?
                        <View className='mt_10'>
                            <View className='pl_20 pr_15 pt_12 pb_12 bg_white d_flex fd_r jc_sb border_bt'>
                                <View className='d_flex fd_r ai_ct '>
                                    <Text className='default_label c33_label'>支付方式</Text>
                                </View>
                            </View>
                            <View className='pl_20 pr_15 pt_12 pb_12 bg_white d_flex fd_r jc_sb border_bt' onClick={this._onSelect}>
                                <View className='d_flex fd_r ai_ct '>
                                    <Image src={asset.wechat_pay} className='payIcon' />
                                    <Text className='default_label c33_label pl_10'>微信支付</Text>
                                </View>
                                <Image src={payType === 9 ? asset.radio_full : asset.radio} className='radio' />
                            </View>
                            <View className='pl_20 pr_15 pt_12 pb_12 bg_white mb_10 mt_1 d_flex fd_r ai_ct jc_sb' onClick={this._selectIntegral}>
                                <Text className='default_label c33_label'>可用学分 {integral}</Text>
                                <Image src={selectIntegral ? asset.radio_full : asset.radio} className='radio' />
                            </View>
                        </View>
                        
                        : null}


                <View className='mt_20 pb_50'></View>


                <View className='payOrder' onClick={()=>{
                    if(this.state.ttyps==0){
                        this._payOrder()
                    }else{
                        Taro.showToast({
                            title:'已购买',
                            icon:'none',
                            duration:1000
                        })
                    }
                }}>
                    <Text className='lg_label white_label'>确认支付</Text>
                </View>
            </View>
        )
    }
}

export default payOrder as ComponentClass