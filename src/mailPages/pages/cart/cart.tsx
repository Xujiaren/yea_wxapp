import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import asset from '../../../config/asset'
import asset1 from '../../config/asset'

import inter from '../../../config/inter'
import menu from '../../../config/menu';
import api from '../../../services/api'

import '../../../config/theme.css';
import './cart.less'

function cart_restruct(arr) {
    let obj = {}
    arr.map(v => {
        obj[v.activityId] = 0
    })
    let cart = Object.keys(obj)

    let result = cart.map(v => {
        return {
            data: arr.filter(_v => v == _v.activityId)
        }
    })
    return result;
}

function activity(id, arr) {
    let result = {};

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].activityId === id) {
            result = arr[i];
        }
    }

    return result;
}

// 多少个相同元素 满折
function activity_count(id, arr) {
    let count = 0

    if (id !== undefined && id.length > 0) {
        for (let i = 0; i < arr.length; i++) {

            if (id.indexOf((arr[i].cartId + '')) > -1) {
                count += arr[i].goodsNumber;
            }
        }
    }

    return count;
}

// 满减 计算出商品的总价
function activity_total(ids, arr) {

    let total = 0;
    if (ids !== undefined && ids.length > 0) {
        for (let i = 0; i < arr.length; i++) {

            if (ids.indexOf(arr[i].cartId + '') > -1) {
                if( arr[i].goodsAmountDTO.goodsAmount){
                    total += arr[i].goodsNumber * arr[i].goodsAmountDTO.goodsAmount;
                }else{
                    total += arr[i].goodsNumber * arr[i].goodsAmount;
                }
               
            }
        }
    }

    return total.toFixed(2);
}


type PageState = {
    tabbar_bottom: Array<{
        text: string,
        link: string,
        icon: string,
        iconfull: string
    }>,
    mailCart: Array<any>,
    mockCart: Array<any>,
    tabbarIndex: number,
    toggle: boolean,


    delGoodIds: Array<any>, // 删除商品 goodids 集合
    cartIds: Array<any>, // 商品 cartid 集合
    goodIds: Array<any>, // 商品 goodid 集合
    totalAmount: number, // 结算 总价
    allType: boolean, // 全选 
    delType: boolean,

    act_goodsId: any,// 活动满足， 商品id

    mock_cartIds: any,
    mock_goodIds: any,

    c_type: 0, // 0 选择购物车 1 选择删除商品 

    meet_ids: Array<any>,

    order_act: any,

}

class cart extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '购物车'
    }
    activitys: any[]

    constructor() {
        super(...arguments)

        this.activitys = [];
        this.state = {
            tabbar_bottom: [{
                text: '首页',
                link: menu.mailIndex,
                icon: asset1.mail_icon,
                iconfull: asset1.mail_icon_full
            }, {
                text: '分类',
                link: menu.mailCate,
                icon: asset1.cate_icon,
                iconfull: asset1.cate_icon_full
            }
                , {
                text: '购物车',
                link: '',
                icon: asset1.cart_icon,
                iconfull: asset1.cart_icon_full
            }
                , {
                text: '订单',
                link: menu.mailOrder,
                icon: asset1.order_icon,
                iconfull: asset1.order_icon_full
            }],
            mailCart: [],
            mockCart: [],
            tabbarIndex: 2,
            toggle: false,



            delGoodIds: [], // 删除商品 goodids 集合
            cartIds: [], // 商品 cartid 集合
            goodIds: [], // 商品 goodid 集合
            totalAmount: 0, // 结算 总价
            allType: false, // 全选 
            delType: false,

            act_goodsId: {},// 活动满足， 商品id

            mock_cartIds: {},
            mock_goodIds: {},

            c_type: 0, // 0 选择购物车 1 选择删除商品 

            meet_ids: [],

            order_act: {},

        }

        this.shopCart = this.shopCart.bind(this);
        this._updateCart = this._updateCart.bind(this);
        this._judge = this._judge.bind(this);
        this._checkAll = this._checkAll.bind(this);
        this.shopSet = this.shopSet.bind(this);
        this._toSettlement = this._toSettlement.bind(this);
    }

    componentWillMount() {
        this.getConfig()
    }

    componentDidMount() {
        this.shopCart();
        this.shopSet();
    }

    componentWillUnmount() {

    }

    componentDidShow() { }
    componentDidHide() { }

    shopSet() {

        var that = this;
        api.get(inter.shopSet)
            .then((res) => {
                if (res.data.status) {

                    let setShop = res.data.data;
                    that.activitys = setShop.activity;
                }
            })

    }


    shopCart = () => {
        var that = this;

        api.get(inter.shopCart)
            .then((res) => {
                if (res.data.status) {

                    let cart = res.data.data;
                    if (cart.length > 0) {
                        let goodIds = []
                        cart.map(item => {
                            goodIds = goodIds.concat(item.goodsId)
                        })
                        that.setState({
                            mockCart: cart_restruct(cart),
                            mailCart: cart,
                            goodIds: goodIds
                        }, () => {
                            that._countAmount();
                        })
                    } else {
                        let goodIds = []
                        that.setState({
                            mockCart: cart,
                            mailCart: cart,
                            goodIds: goodIds
                        }, () => {
                            that._countAmount();
                        })
                    }

                }
            })
    }



    getConfig = () => {
        const { tabbar_bottom } = this.state
        try {
            api.get(inter.Config).then((res) => {
                if (res.data.status) {
                    const { data } = res.data
                    const { mall_light, mall_dark, cate_light, cate_dark, order_light, order_dark, card_light, card_dark } = JSON.parse(data['ui_choose_field'])

                    if (typeof (mall_light) !== 'undefined') {
                        tabbar_bottom[0]['icon'] = mall_dark
                        tabbar_bottom[0]['iconfull'] = mall_light

                        tabbar_bottom[1]['icon'] = cate_dark
                        tabbar_bottom[1]['iconfull'] = cate_light

                        tabbar_bottom[2]['icon'] = card_dark
                        tabbar_bottom[2]['iconfull'] = card_light

                        tabbar_bottom[3]['icon'] = order_dark
                        tabbar_bottom[3]['iconfull'] = order_light

                        this.setState({ tabbar_bottom })
                    }
                }
            })
        } catch (error) {

        }
    }

    _onToggle() {
        var that = this;
        const { toggle } = that.state

        that.setState({
            toggle: !toggle
        })

    }

    // 增减购物车
    _updateCart(cart, type, text) {

        var that = this;

        api.post(inter.shopDoneCart, {
            cart_id: cart.cartId,
            goods_number: 1,
            ctype: type,
        }).then((res) => {
            if (res.data.status) {

                that.shopCart();

            } else {

                let tip = ''
                if (res.data.message === 'number only one') {
                    tip = '商品不能在减少了'
                } else if (res.data.message === 'out of stock') {
                    tip = '库存不足'
                }

                Taro.showToast({
                    title: tip,
                    icon: 'none',
                    duration: 1000,
                })
            }
        })

    }

    // 
    _onSelect(cart) {
        var that = this;
        const { delGoodIds, mock_cartIds, c_type } = that.state;

        let _mockcartIds = mock_cartIds;

        if (Object.keys(_mockcartIds).indexOf(cart.cartId + '') === -1) {

            _mockcartIds[parseInt(cart.cartId)] = cart.activityId;

            that.setState({
                cartIds: Object.keys(_mockcartIds),
                mock_cartIds: _mockcartIds
            }, () => {
                this._judge();
                this._countAmount();
            })


        } else {

            let _mock_carts = {};
            let g_arr: any = [];

            let idx = Object.keys(_mockcartIds).indexOf(cart.cartId + '');

            g_arr = Object.entries(_mockcartIds);
            g_arr.splice(idx, 1);

            _mock_carts = Object.fromEntries(g_arr);

            let mock_ids = Object.keys(_mock_carts);

            that.setState({
                cartIds: mock_ids,
                mock_cartIds: _mock_carts
            }, () => {
                this._judge();
                this._countAmount();
            })


        }



    }

    // 判断
    _judge() {
        var that = this;

        const { c_type, delGoodIds, cartIds, mailCart } = that.state;

        let judge: any = [];

        for (var i = 0; i < mailCart.length; i++) {

            judge.push(mailCart[i].cartId + '');

            if ((judge.sort().toString() === cartIds.sort().toString()) && cartIds.length > 0) {

                that.setState({
                    allType: true,
                });
            } else {
                that.setState({
                    allType: false,
                });
            }
        }


    }

    // 计算价格
    _countAmount() {
        const { meet_ids, act_goodsId, cartIds, mock_cartIds, order_act, mailCart } = this.state;

        let totalMoney = 0;
        let _order_act = order_act;
        let total_mz_discount = 0;

        for (let i = 0; i < mailCart.length; i++) {

            if (cartIds.indexOf(mailCart[i].cartId + '') > -1) {

                if (mailCart[i].activityId == 0) { // 没有活动 计算
                    let goodsAmount = mailCart[i].goodsAmount
                    if(mailCart[i].goodsAmountDTO.goodsAmount){
                        goodsAmount = mailCart[i].goodsAmountDTO.goodsAmount
                    }
                    totalMoney += goodsAmount * mailCart[i].goodsNumber;

                } else {  // 不同活动 计算

                    let act_ids = Object.values(mock_cartIds);

                    for (let j = 0; j < this.activitys.length; j++) {

                        // 满折
                        let mz_g_ids = []; // 满折商品ids 
                        let mz_a_ids = []; // 满折活动ids
                        let mz_arr: any = []; // 满折 数组
                        // 满减
                        let mj_total = 0; // 满减
                        let mj_g_ids = [];


                        mz_arr = Object.entries(mock_cartIds);

                        for (let z = 0; z < mz_arr.length; z++) {
                            if (mz_arr[z][1] === this.activitys[j].activityId) {
                                mz_g_ids.push(mz_arr[z][0]);
                                mj_g_ids.push(mz_arr[z][0]);
                            }
                        }


                        mj_total = activity_total(mj_g_ids, mailCart);
                        let act_count = activity_count(mz_g_ids, mailCart);

                        if (this.activitys[j].way === 0) { // 满减 


                            act_goodsId[this.activitys[j].activityId] = mj_g_ids;


                            if (mj_total >= this.activitys[j].condFir) {
                                // 满减 满足条件        

                                let per_count: any = ((this.activitys[j].condSec * 1) / mj_g_ids.length).toFixed(2); //  每件 减 少的钱数

                                if (mj_g_ids.indexOf(mailCart[i].cartId + '') > -1) {
                                    if(mailCart[i].goodsAmountDTO.goodsAmount){
                                        totalMoney += mailCart[i].goodsAmountDTO.goodsAmount * mailCart[i].goodsNumber - per_count;
                                    }else{
                                        totalMoney += mailCart[i].goodsAmountDTO.goodsAmount * mailCart[i].goodsNumber - per_count;
                                    }
                                }

                                _order_act[this.activitys[j].activityId] = this.activitys[j].condSec * 1;


                            } else {

                                if (mj_g_ids.indexOf(mailCart[i].cartId + '') > -1) {
                                    if(mailCart[i].goodsAmountDTO.goodsAmount){
                                        totalMoney += mailCart[i].goodsAmountDTO.goodsAmount * mailCart[i].goodsNumber;
                                    }else{
                                        totalMoney += mailCart[i].goodsAmount * mailCart[i].goodsNumber;
                                    }
                                    
                                }

                                _order_act[this.activitys[j].activityId] = 0;
                            }

                        } else if (this.activitys[j].way === 1) { // 满折


                            act_goodsId[this.activitys[j].activityId] = mz_g_ids;


                            if (this.activitys[j].condFir * 1 > act_count) {  // 不满足满折活动 ， 按正常价格 计算 

                                if (mz_g_ids.indexOf(mailCart[i].cartId + '') > -1) {
                                    if(mailCart[i].goodsAmountDTO.goodsAmount){
                                        totalMoney += mailCart[i].goodsAmountDTO.goodsAmount * mailCart[i].goodsNumber;
                                    }else{
                                        totalMoney += mailCart[i].goodsAmount * mailCart[i].goodsNumber;
                                    }
                                    
                                }


                                _order_act[this.activitys[j].activityId] = 0;

                            } else { // 满足满折活动  

                                if (mz_g_ids.indexOf(mailCart[i].cartId + '') > -1) {
                                    if(mailCart[i].goodsAmountDTO.goodsAmount){
                                        totalMoney += mailCart[i].goodsAmountDTO.goodsAmount * mailCart[i].goodsNumber * (this.activitys[j].condSec * 1);

                                        total_mz_discount += mailCart[i].goodsAmountDTO.goodsAmount * mailCart[i].goodsNumber * (1 - this.activitys[j].condSec * 1)
                                    }else{
                                        totalMoney += mailCart[i].goodsAmount * mailCart[i].goodsNumber * (this.activitys[j].condSec * 1);

                                        total_mz_discount += mailCart[i].goodsAmount * mailCart[i].goodsNumber * (1 - this.activitys[j].condSec * 1)
                                    }

                                   
                                }

                                _order_act[this.activitys[j].activityId] = total_mz_discount.toFixed(2);
                            }

                        }

                    }


                }
            }
        }

        this.setState({
            totalAmount: totalMoney,
            act_goodsId: act_goodsId
        })


    }


    // 全选
    _checkAll() {
        var that = this;

        const { c_type, delGoodIds, cartIds, mock_cartIds, mailCart } = that.state;

        let allchoose: any = [];
        let _mock_cartIds = mock_cartIds;

        for (var i = 0; i < mailCart.length; i++) {

            allchoose.push(mailCart[i].cartId + '');

            _mock_cartIds[parseInt(mailCart[i].cartId) + ''] = mailCart[i].activityId;

            if ((allchoose.sort().toString() === cartIds.sort().toString()) && cartIds.length > 0) {

                that.setState({
                    allType: false,
                    mock_cartIds: [],
                    cartIds: [],
                    order_act: {},
                }, () => {
                    that._countAmount();
                });
            } else {
                that.setState({
                    cartIds: allchoose,
                    allType: true,
                    mock_cartIds: _mock_cartIds,

                }, () => {
                    that._countAmount();
                });
            }
        }

    }

    _toSettlement() {

        var that = this;
        const { cartIds, totalAmount, mock_cartIds, order_act, mailCart, goodIds } = that.state;

        let all_total = activity_total(cartIds, mailCart);
        console.log(mailCart)
        if (mailCart.length == 0) {
            Taro.showToast({
                title: '暂无商品可结算',
                icon: 'none',
                duration: 1000
            })
        } else {
            if (Object.values(mock_cartIds).length == 0) {
                Taro.showToast({
                    title: '请选择商品',
                    icon: 'none',
                    duration: 1000
                })
            } else {
                Taro.navigateTo({
                    url: menu.settlement + '?cartIds=' + JSON.stringify(cartIds) + '&goodIds=' + JSON.stringify(goodIds) + '&totalAmount=' + totalAmount + '&disAmount=' + (all_total - totalAmount).toFixed(2) + '&allAmount=' + all_total
                        + '&mock_cartIds=' + JSON.stringify(mock_cartIds) + '&order_act=' + JSON.stringify(order_act)
                })
            }
        }
    }

    // 删除
    _allDelete() {

        let that = this;
        const { cartIds, mockCart } = that.state;
        console.log(cartIds.join(','))
        api.post(inter.shopRemoveCart, {
            cartIds: cartIds.join(',')
        }).then((res) => {
            if (res.data.status) {
                that.shopCart();
                that.setState({
                    mock_cartIds: []
                })
            }
        })
    }


    render() {
        const { tabbar_bottom, tabbarIndex, toggle, mockCart, mailCart, mock_cartIds, cartIds, allType, totalAmount, act_goodsId, order_act } = this.state;

        return (
            <View className='wrap'>
                <View className='headToggle' >
                    <Text className='default_label c33_label fw_label pr_10' onClick={this._onToggle}>{toggle ? '取消' : '管理'}</Text>
                </View>

                <View className='shopBoxs'>

                    {
                        mockCart.map((m_cart, index) => {

                            let m_activity = {}; //  活动详情
                            let per_money = 0; // 每件优惠价格
                            let per_goods = []; // 优惠的商品 id
                            let per_isMeet = false; // 是否优惠

                            let cart_total = 0; // 总价
                            let cart_count = 0; // 总件数

                            m_activity = activity(m_cart.data[0].activityId, this.activitys);

                            if (m_cart.data[0].activityId !== 0) {
                                per_goods = act_goodsId[m_cart.data[0].activityId + ''] == undefined ? [] : act_goodsId[m_cart.data[0].activityId + ''];

                                cart_count = activity_count(per_goods, mailCart);
                                cart_total = activity_total(per_goods, mailCart);
                                if (m_activity.way === 0) {

                                    if (cart_total >= m_activity.condFir) {
                                        per_money = m_activity.condSec / cart_count;
                                        per_isMeet = true;
                                    }

                                } else if (m_activity.way === 1) {


                                    if (cart_count >= m_activity.condFir) {
                                        per_isMeet = true;
                                    }

                                }

                            }

                            let cart = m_cart.data.map((d_cart: any, idx) => {

                                let on = cartIds.indexOf(d_cart.cartId + '') > -1;
                                let _ok = per_goods.indexOf(d_cart.cartId + '') > -1;
                                return (
                                    <View className='good' key={'good' + idx}>
                                        <View className='good_tipCover'>
                                            <Image src={on ? asset.radio_full : asset.radio} className='good_radio' onClick={this._onSelect.bind(this, d_cart, 0)} />
                                        </View>
                                        <View className='goodright col_1'>
                                            <View className='goodCover'>
                                                <Image src={d_cart.goodsImg} className='goodImg' />
                                            </View>
                                            <View className='d_flex fd_c col_1'>
                                                <View className='d_flex fd_r ai_ct'>
                                                    {
                                                        d_cart.activityId !== 0 ?
                                                            <View className='good_tip'>
                                                                {
                                                                    m_activity.way === 0 ?

                                                                        <Text className='red_label smm_label'>满{m_activity.condFir}-{m_activity.condSec}</Text>
                                                                        :
                                                                        <Text className='red_label smm_label'>满{m_activity.condFir}件{m_activity.condSec * 10}折</Text>
                                                                }
                                                            </View>
                                                            : null}
                                                    <Text className='c33_label default_label fw_label'>{d_cart.goodsName}</Text>
                                                </View>
                                                <Text className='sm_label tip_label mt_5'>{d_cart.goodsAttr}</Text>
                                                <View className='d_flex fd_r jc_sb mt_5 ai_ct'>
                                                    <Text className='red_label default_label'>￥{d_cart.goodsAmountDTO.goodsAmount?d_cart.goodsAmountDTO.goodsAmount:d_cart.goodsAmount}</Text>
                                                    {
                                                        d_cart.activityId !== 0 && _ok && per_isMeet && on ?
                                                            <View className='dis_box ml_10'>
                                                                {
                                                                    m_activity.way === 0 ?
                                                                        <Text className='red_label smm_label'>优惠价¥{(d_cart.goodsAmount - per_money).toFixed(2)}</Text>
                                                                        :
                                                                        <Text className='red_label smm_label'>优惠价¥{(d_cart.goodsAmount * m_activity.condSec).toFixed(2)}</Text>
                                                                }
                                                            </View>
                                                            : null}
                                                    <View className='goodToggle'>
                                                        <Image src={asset1.minus} className='minus' onClick={this._updateCart.bind(this, d_cart, 1, 0)} />
                                                        <Text className='c33_label default_label pl_10 pr_10'>{d_cart.goodsNumber}</Text>
                                                        <Image src={asset1.add} className='add' onClick={this._updateCart.bind(this, d_cart, 0, 0)} />
                                                    </View>
                                                </View>
                                            </View>

                                        </View>

                                    </View>
                                )
                            })

                            return (
                                <View className='shopBox' key={'shop' + index}>
                                    {
                                        m_cart.data[0].activityId !== 0 ?
                                            <View className='shopTit'>
                                                <View className='shopTit_tip'>
                                                    <Text className='smm_label white_label'>{m_activity.title}</Text>
                                                </View>
                                                {
                                                    m_activity.way === 0 ?
                                                        <Text className='sm_label sred_label'>购物满{m_activity.condFir}-{m_activity.condSec}</Text>
                                                        : null}
                                                {
                                                    m_activity.way === 1 ?
                                                        <Text className='sm_label sred_label'>购物满{m_activity.condFir}件{m_activity.condSec * 10}折</Text>
                                                        : null}

                                            </View>
                                            : null}

                                    <View className='goods'>
                                        {cart}
                                    </View>
                                    {
                                        m_cart.data[0].activityId !== 0 ?
                                            <View className='d_flex fd_r ai_ct jc_fe pb_5 pt_10 count_box'>
                                                {
                                                    m_activity.way === 0 ?
                                                        <Text className='default_label c33_label mts'>购物满{m_activity.condFir}-{m_activity.condSec},</Text>
                                                        :
                                                        <Text className='default_label c33_label mts'>购物满{m_activity.condFir}件{m_activity.condSec * 10}折,</Text>
                                                }
                                                {
                                                    per_isMeet ?
                                                        <View>
                                                            {
                                                                m_activity.way === 0 ?
                                                                    <Text className='default_label c33_label'>已优惠¥{(m_activity.condSec * 1).toFixed(2)}</Text>
                                                                    : null}
                                                            {
                                                                m_activity.way === 1 ?
                                                                    <Text className='default_label c33_label'>已优惠¥{(cart_total - cart_total * m_activity.condSec).toFixed(2)}</Text>
                                                                    : null}
                                                        </View>
                                                        :
                                                        <View>
                                                            <Text className='default_label c33_label'>已优惠¥0</Text>
                                                        </View>
                                                }
                                                {
                                                    per_isMeet ?
                                                        <View>
                                                            {
                                                                m_activity.way === 0 ?
                                                                    <Text className='default_label c33_label pl_20' >小计 ¥{(cart_total - m_activity.condSec).toFixed(2)}</Text>
                                                                    : null}
                                                            {
                                                                m_activity.way === 1 ?
                                                                    <Text className='default_label c33_label pl_20'>小计 ¥{(cart_total * m_activity.condSec).toFixed(2)}</Text>
                                                                    : null}
                                                        </View>
                                                        :
                                                        <View>
                                                            <Text className='default_label c33_label pl_20'>小计¥{cart_total}</Text>
                                                        </View>
                                                }
                                            </View>
                                            : null}
                                </View>
                            )
                        })
                    }


                </View>

                <View className='cartBottom'>
                    <View className='cartLeft'>

                        <Image src={allType ? asset.radio_full : asset.radio} className='cartLeftCover'
                            onClick={this._checkAll}
                        />
                        <Text className='default_label gray_label'>全选</Text>
                    </View>
                    {
                        toggle ?
                            <View className='cartbtn' onClick={this._allDelete}>
                                <Text className='default_label red_label'>删除</Text>
                            </View>
                            :
                            <View className='order_btns d_flex ai_ct '>
                                <Text className='default_label c33_label mr_10'>合计：<Text className='red_label default_label'>￥{totalAmount.toFixed(2)}</Text></Text>
                                <View className='orderBtn' onClick={this._toSettlement}>
                                    <Text className='white_label default'>结算</Text>
                                </View>
                            </View>
                    }

                </View>
                <View className='tabbar'>
                    {
                        tabbar_bottom.map((item, idx) => {
                            const on = tabbarIndex === idx
                            return (
                                <View key={'item' + idx} className='tabItem'
                                    onClick={() => Taro.redirectTo({ url: item.link })}
                                >
                                    <Image src={on ? item.iconfull : item.icon} className={on ? 'tabItem_cover ' : 'tabItem_cover'} />
                                    <Text className={on ? 'red_label sm_label' : 'gray_label sm_label'}>{item.text}</Text>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    }
}

export default cart as ComponentClass