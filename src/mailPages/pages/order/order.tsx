import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Picker, Input } from '@tarojs/components'

import { getExactTime } from '../../../utils/common'
import menu from '../../../config/menu'
import asset from '../../../config/asset'
import asset1 from '../../config/asset'

import inter from '../../../config/inter'
import api from '../../../services/api'

import '../../../config/theme.css';
import './order.less'


import { connect } from '@tarojs/redux'
import { mailType } from '../../../constants/mailType'

import {
    getUserOrder,
} from '../../../actions/mail'

type PageStateProps = {
    mail: mailType,
    getUserOrder: Array<{}>
}

type PageDispatchProps = {
    getUserOrder: (object) => any,
}

type PageOwnProps = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface order {
    props: IProps;
}

type PageState = {
    tabbar_bottom: Array<{
        text: string,
        link: string,
        icon: string,
        iconfull: string
    }>,
    loadding: boolean,
    tabbarIndex: number,
    status: number,
    logType: boolean,
    orderList: Array<any>,
    page: number,
    pages: number,
    total: number,
    shipName: string,
    shipNumber: string,
    goodsImg: string,

    orderId: number,
    goodsId: number,
    integralAmount: number,
    afterType: boolean,
    afterTypeId: number,
    afterTypeList: Array<{}>,
    afterReason: Array<string>,
    afterReasons: Array<string>,
    afterReasonIndex: number,
    afterExplain: string,
    afterImgs: Array<string>,
    goodsAmount: number,
}

@connect(({ mail }) => ({
    mail: mail
}), (dispatch) => ({
    getUserOrder(object) {
        dispatch(getUserOrder(object))
    },
}))

class order extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '订单',
        enablePullDownRefresh: true
    }
    page: number
    pages: number
    itemType: any

    constructor() {
        super(...arguments)

        this.page = 0;
        this.pages = 0;

        this.itemType = null;

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
                link: menu.mailCart,
                icon: asset1.cart_icon,
                iconfull: asset1.cart_icon_full
            }
                , {
                text: '订单',
                link: '',
                icon: asset1.order_icon,
                iconfull: asset1.order_icon_full
            }],
            loadding: false,
            tabbarIndex: 3,
            status: 0,
            logType: true,
            orderList: [],
            page: 0,
            pages: 0,
            total: 0,
            shipName: '',
            shipNumber: '',
            goodsImg: '',

            orderId: 0,
            goodsId: 0,
            integralAmount: 0,
            afterType: true,
            afterTypeId: 0,
            afterTypeList: [{ text: '我要退款（无需退货）', afterTypeId: 25 }, { text: '我要退货退款', afterTypeId: 26 }, { text: '换货', afterTypeId: 27 }],
            afterReason: ['空包裹', '商品瑕疵', '质量问题', '漏发/错发', '收到商品时有划痕或破损', '包装/商品污渍/变形'],
            afterReasons: ['商品瑕疵', '质量问题', '漏发/错发', '收到商品时有划痕或破损', '包装/商品污渍/变形'],
            afterReasonIndex: 0,
            afterExplain: '',// 退换货原因 
            afterImgs: [], // 上传凭证
            goodsAmount: 0,
        }
    }

    componentWillReceiveProps(nextProps) {
        const { mail } = nextProps
        const { userOrder } = mail
        const { orderList } = this.state

        if (mail !== this.props.mail) {
            if (this.page == 0) {
                this.page = userOrder.page
                this.pages = userOrder.pages
                var fList: any = userOrder.items
            } else {
                var fList: any = orderList.concat(userOrder.items)
            }

            this.itemType = [];

            this.setState({
                orderList: fList,
                page: userOrder.page,
                pages: userOrder.pages,
                total: userOrder.total,
            })
        }
    }

    componentWillMount() {
        this.getConfig()
    }

    componentDidMount() {
        var that = this;
        that._getUserOrder();
    }

    componentWillUnmount() {

    }

    componentDidShow() {
        var that = this;
        that._getUserOrder();
    }
    componentDidHide() { }

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

    _getUserOrder() {

        var that = this;
        const { status, page } = that.state

        that.props.getUserOrder({
            status,
            page
        })

    }


    _onSelect = (index) => {
        this.itemType = null;
        this.setState({
            status: index,
            page: 0,
            orderList: [],
            loadding: false
        }, () => {
            this._getUserOrder()
        })
    }

    _onCopy(sn) {
        Taro.setClipboardData({
            data: sn,
        }).then((res) => {
            console.log(res);
        })
    }


    _onOrderDesc(item) {
        Taro.navigateTo({
            url: menu.orderDesc + '?orderId=' + item.orderId
        })
    }


    // 下拉
    onPullDownRefresh() {
        var self = this
        this.page = 0;

        this.itemType = null;
        self.setState({
            page: 0,
            orderList: [],
            loadding: false
        }, () => {
            self._getUserOrder();
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }

    //上拉
    onReachBottom() {
        var self = this;

        const { page, pages, status } = self.state

        if (page < pages) {
            this.page = this.page + 1
            self.props.getUserOrder({
                status,
                page: page + 1
            })
        } else {
            self.setState({
                loadding: true
            })
        }
    }

    handleStop(e) {
        e.stopPropagation()
    }

    _checkLog(item) {
        var that = this;
        Taro.navigateTo({
            url:'ems?orderId='+item.orderId
        })
        // that.setState({
        //     shipName: item.shippingName,
        //     shipNumber: item.shippingSn,
        //     goodsImg: item.orderGoods[0].goodsImg,
        //     logType: false
        // })
    }



    _onRate = e => {
        var that = this
        that.setState({
            afterReasonIndex: e.detail.value
        })
    }


    // 售后方式
    _slectAfterType(aft) {
        var that = this
        that.setState({
            afterTypeId: aft.afterTypeId
        })
    }




    _onDetele(index) {
        var that = this
        const { afterImgs } = that.state
        afterImgs.splice(index, 1)

        that.setState({
            afterImgs: afterImgs
        })
    }

    //选择照片或者拍照
    _onChangeImg = () => {
        var that = this;
        const { afterImgs } = that.state

        Taro.chooseImage({
            count: 3,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success: function (res) {

                for (let i = 0; i < res.tempFilePaths.length; i++) {
                    Taro.getFileSystemManager().readFile({
                        filePath: res.tempFilePaths[i], // 选择图片返回的相对路径
                        encoding: 'base64', // 编码格式
                        success: res => { // 成功的回调
                            api.post(inter.UploadSite, {
                                file: 'data:image/png;base64,' + res.data,
                            }).then(res => {
                                if (res.data.status) {
                                    afterImgs.push(res.data.data)
                                    that.setState({
                                        afterImgs: afterImgs
                                    })
                                }
                            })
                        },
                        fail: msg => {
                        }
                    })
                }

            },
            fail: function (errmsg) {

            }
        })
    }

    onViewImgs(afterImgs, index) {
        let urls: string[] = new Array();
        for (let i = 0; i < afterImgs.length; i++) {
            urls.push(afterImgs[i])
        }
        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: urls[index], // 当前显示图片的http链接，默认是第一个
        }).then(res => {
            // console.log(res)
        })
    }

    _onAfter(item) {
        var that = this
        that.setState({
            integralAmount: item.integralAmount,
            orderId: item.orderId,
            goodsId: item.orderGoods[0].goodsId,
            afterType: false,
            goodsAmount: item.orderAmount
        })

    }



    //  售后提交
    _onAfterSubmit() {
        var that = this;
        const { afterTypeId, afterTypeList, afterReason, afterReasonIndex, afterExplain, afterImgs, goodsId, orderId ,afterReasons} = that.state

        console.log(afterTypeId, afterTypeList, afterReason, afterReasonIndex, afterExplain, afterImgs, goodsId, orderId)
        let vas = afterReason
        if(afterTypeId==27){
            vas = afterReasons
        }
        api.post(inter.orderReturn + orderId + '/' + goodsId, {
            etype: afterTypeId,
            reason: vas[afterReasonIndex] + afterExplain,
            picString: afterImgs.join(",")
        }).then((res) => {
            if (res.data.status) {
                Taro.showToast({
                    title: '提交成功',
                    icon: 'none'
                })

                that.setState({
                    afterType: true,
                    afterImgs: [],
                    afterExplain: '',
                    status: 5
                }, () => {
                    that._getUserOrder();
                })
            }
        })
    }

    // 确认收货

    _orderConfirm(orderId) {
        var that = this;
        api.post(inter.orderConfirm, {
            order_id: orderId
        }).then((res) => {
            if (res.data.status) {
                Taro.showToast({
                    title: '确认成功',
                    icon: 'none',
                    duration: 1000
                })
                that._getUserOrder();
            }
        })
    }

    // 取消订单
    _orderCancel(item) {
        console.log(item.orderId)
        var that = this;
        api.post(inter.orderCancel, {
            order_id: item.orderId,
            coupon_id: 0
        }).then((res) => {
            console.log(res)
            if (res.data.status) {
                Taro.showToast({
                    title: '取消成功',
                    icon: 'none',
                    duration: 1000
                })
                that._getUserOrder();
            }
        })
    }

    //  跳到支付页面
    _toOrder(item) {

        Taro.navigateTo({
            url: menu.orderPay + '?orderAmount=' + item.orderAmount + '&orderSn=' + item.orderSn
        })
    }


    render() {
        const { tabbar_bottom, tabbarIndex, status, logType, orderList, shipNumber, shipName, goodsImg, afterType, afterTypeId, afterTypeList, afterReason, afterReasonIndex, afterExplain, afterImgs, integralAmount, loadding, goodsAmount } = this.state


        return (
            <View className='pushwrap'>

                <View className='atabs'>
                    <View className='d_flex fd_r ai_ct jc_sb head_box col_1'>
                        {
                            ['全部', '待付款', '待发货', '待收货', '已收货', '售后'].map((tab, index) => {
                                const on = index == status
                                return (
                                    <View key={'tab' + index} className='head_box_item d_flex fd_c ai_ct' onClick={this._onSelect.bind(this, index)}>
                                        <Text className='default_label ' style={on ? { color: '#333333', fontWeight: 'bold' } : { color: '#666666' }}>{tab}</Text>
                                        <View className='border_btn' style={on ? { backgroundColor: '#F4623F' } : {}} ></View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>

                {
                    orderList.length > 0 ?

                        <View className='orderBoxs'>
                            {
                                orderList.map((item: any, index) => {
                                    let odr_val = ''
                                    let odr_tips = ''
                                    let odr_status: number = 100

                                    if (item.orderStatus === 0) {
                                        if (item.payStatus === 0) {
                                            odr_val = '待付款'
                                            odr_status = 0
                                        } else if (item.payStatus === 1) {
                                            if (item.shippingStatus === 0) {
                                                odr_val = '待发货'
                                                odr_status = 1
                                            } else if (item.shippingStatus === 1) {
                                                odr_val = '待收货'
                                                odr_status = 2
                                            } else if (item.shippingStatus === 2) {
                                                odr_val = '已收货'
                                                odr_status = 3
                                            }
                                        }
                                    } else if (item.orderStatus === 1) {
                                        odr_val = '已取消'
                                        odr_status = 7
                                    } else if (item.orderStatus === 2) {
                                        if (item.orderReturnList.length > 0) {
                                            if (item.orderReturnList[0].status === 0) {
                                                if (item.orderReturnList[0].adminStatus === 0) {
                                                    odr_val = '待处理'
                                                    odr_status = 4
                                                } else if (item.orderReturnList[0].adminStatus === 1) {
                                                    odr_val = '退款中'
                                                    odr_status = 5
                                                } else {
                                                    odr_val = '拒绝'
                                                    odr_status = 6
                                                }
                                            } else if (item.orderReturnList[0].status === 1) {
                                                odr_val = '订单关闭'
                                                odr_status = 14
                                            }
                                        }

                                    } else if (item.orderStatus === 3) {

                                        if (item.orderReturnList.length > 0) {
                                            if (item.orderReturnList[0].status === 0) {
                                                if (item.orderReturnList[0].adminStatus === 0) {
                                                    odr_val = '待处理'
                                                    odr_status = 8
                                                } else if (item.orderReturnList[0].adminStatus === 1) {
                                                    odr_val = '处理中'
                                                    odr_status = 9
                                                } else {
                                                    odr_val = '拒绝'
                                                    odr_status = 10
                                                }
                                            } else if (item.orderReturnList[0].status === 1) {
                                                odr_val = '订单关闭'
                                                odr_status = 14
                                            }

                                        }
                                    } else if (item.orderStatus === 4) {
                                        if (item.orderReturnList.length > 0) {
                                            if (item.orderReturnList[0].status === 0) {
                                                if (item.orderReturnList[0].adminStatus === 0) {
                                                    odr_val = '待处理'
                                                    odr_status = 11
                                                } else if (item.orderReturnList[0].adminStatus === 1) {
                                                    odr_val = '处理中'
                                                    odr_status = 12
                                                } else {
                                                    odr_val = '拒绝'
                                                    odr_status = 13
                                                }
                                            } else if (item.orderReturnList[0].status === 1) {
                                                odr_val = '订单关闭'
                                                odr_status = 14
                                            }

                                        }
                                    }



                                    return (
                                        <View className='item' key={'item' + index}
                                            onClick={this._onOrderDesc.bind(this, item)}
                                        >
                                            <View className='itemHead d_flex fd_r jc_sb pt_15 pb_10'>
                                                <Text className='sm_label c33_label'>下单时间：{getExactTime(parseInt(item.payTime))}</Text>
                                                {
                                                    odr_status === 5 || odr_status === 9 || odr_status === 12 ?
                                                        <Text className='sred_label sm_label'>{odr_val}</Text>
                                                        :
                                                        <Text className='c33_label sm_label'>{odr_val}</Text>
                                                }
                                            </View>
                                            <View className='itemLists' >
                                                {
                                                    item.orderGoods.map((odr, idx) => {
                                                        return (
                                                            <View className='itemList d_flex pt_15 pb_10 ' key={'odr' + idx}>
                                                                <Image src={odr.goodsImg} className='itemCover' />
                                                                <View className='d_flex fd_c jc_sb col_1'>
                                                                    <View className='d_flex fd_r jc_sb'>
                                                                        <Text className='c33_label default_label fw_label col_1'>{odr.goodsName}</Text>
                                                                        {
                                                                            item.otype === 2 ?
                                                                                <Text className='sm_label c33_label'>¥{odr.goodsAmount}</Text>
                                                                                : null}

                                                                        {
                                                                            item.otype === 3 ?
                                                                                <Text className='sm_label c33_label'>{odr.integralAmount}学分</Text>
                                                                                : null}

                                                                    </View>
                                                                    <View className='d_flex fd_r jc_sb'>
                                                                        <Text className='tip_label default_label'>{odr.goodsAttr}</Text>
                                                                        <Text className='sm_label black_label'>x{odr.goodsNum}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                            <View className='d_flex jc_fe fd_c ai_end pt_10 itemBottom' onClick={this.handleStop.bind(this)}>
                                                <View className='d_flex fd_r ai_ct jc_fe'>
                                                    <View className='d_flex fd_r mr_10'>
                                                        {/* <Text className='sm_label c33_label fw_label pr_10'>邮费：¥{item.shippingAmount}</Text> */}
                                                        <Text className='sm_label c33_label fw_label pr_10'>共{item.totalNum}件</Text>

                                                        <Text className='sm_label tip_label'>合计：</Text>
                                                        {
                                                            item.otype === 3 ?
                                                                <Text className='sred_label sm_label'>{item.integralAmount}学分</Text>
                                                                : null}
                                                        {
                                                            item.otype === 2 ?
                                                                <Text className='sred_label sm_label'>¥{item.orderAmount}</Text>
                                                                : null}

                                                    </View>

                                                </View>
                                                <View className='d_flex fd_r ai_ct jc_fe'>
                                                    {
                                                        odr_status === 0 || odr_status === 1 ?
                                                            <View className='itemCancel d_flex ai_ct jc_ct' onClick={this._orderCancel.bind(this, item)}>
                                                                <Text className='default_label c33_label'>取消订单</Text>
                                                            </View>
                                                            : null}
                                                    {
                                                        odr_status === 0 ?
                                                            <View className='itemPlay d_flex ai_ct jc_ct m_5' onClick={this._toOrder.bind(this, item)}>
                                                                <Text className='default_label sred_label'>去付款</Text>
                                                            </View>
                                                            : null}

                                                    {
                                                        odr_status === 2 ?
                                                            <View className='itemCancel d_flex ai_ct jc_ct m_5' onClick={this._checkLog.bind(this, item)}>
                                                                <Text className='default_label c33_label'>查看物流</Text>
                                                            </View>
                                                            : null}

                                                    {
                                                        odr_status === 1 || odr_status === 2 ?
                                                            <View className='itemCancel d_flex ai_ct jc_ct m_5' onClick={this._onAfter.bind(this, item)}>
                                                                <Text className='default_label c33_label'>申请售后</Text>
                                                            </View>
                                                            : null}


                                                    {
                                                        odr_status === 2 ?
                                                            <View className='itemPlay d_flex ai_ct jc_ct m_5' onClick={this._orderConfirm.bind(this, item.orderId)}>
                                                                <Text className='default_label sred_label'>确认收货</Text>
                                                            </View>
                                                            : null}

                                                    {/* {
                                                    odr_status === 4  || odr_status === 8 ?
                                                    <View className='itemCancel d_flex ai_ct jc_ct m_5'>
                                                        <Text className='default_label c33_label'>待处理</Text>
                                                    </View>
                                                :null}

                                                {
                                                    odr_status === 5 || odr_status === 9 ?
                                                    <View className='itemCancel d_flex ai_ct jc_ct m_5'>
                                                        <Text className='default_label c33_label'>处理中</Text>
                                                    </View>
                                                :null}

                                                {
                                                    odr_status === 6 || odr_status === 10 ?
                                                    <View className='itemCancel d_flex ai_ct jc_ct m_5 ml_0'>
                                                        <Text className='default_label c33_label'>拒绝</Text>
                                                    </View>
                                                :null} */}
                                                </View>
                                            </View>

                                        </View>
                                    )
                                })
                            }
                        </View>

                        : null}
                {
                    orderList.length === 0 && this.itemType !== null ?
                        <View className='d_flex fd_c jc_ct ai_ct order_null_box'>
                            <Image src={asset1.order_null} className='order_null' />
                            <Text className='tip_label sm_label'>一个订单都没有哦~</Text>
                        </View>
                        : null}

                {
                    loadding ?
                        <View className='d_flex ai_ct jc_ct pt_15 pb_15 ' style={{ paddingBottom: 120 + 'rpx' }}>
                            <Text className='sm_label tip_label'>没有更多数据了</Text>
                        </View>
                        : null}


                <View className='logistics' hidden={logType}>
                    <View className='loglayer' onClick={() => this.setState({ logType: true })}></View>
                    <View className='log_cons'>
                        <View className='d_flex fd_r log_cons_desc'>
                            <Image src={goodsImg} className='logCover' />
                            <View className='d_flex fd_c jc_sb'>
                                <View className='d_flex fd_r ai_ct'>
                                    <Text className='fw_label lg_label black_label'>{shipName}</Text>
                                </View>
                                <Text className='tip_label default_label'>快递单号：{shipNumber}</Text>
                            </View>
                        </View>
                        <View className='log_btn'>
                            <View className='log_btn_l col_1' onClick={() => this.setState({ logType: true })}>
                                <Text className='lg18_label tip_label'>取消</Text>
                            </View>
                            <View className='col_1 log_btn_r' onClick={this._onCopy.bind(this, shipNumber)}>
                                <Text className='lg18_label c33_label'>复制</Text>
                            </View>
                        </View>
                    </View>

                </View>


                <View className='afteristics' hidden={afterType}>
                    {/* <View className='afteristics' hidden={false}> */}
                    <View className='loglayer'></View>
                    <View className='log_cons'>
                        <View className='log_head'>
                            <View className='d_flex fd_r ai_ct'>
                                <View className='headBorder'></View>
                                <Text className='c33_label default_label pl_10'>售后类型</Text>
                            </View>

                            <View className='d_flex fd_c '>
                                {
                                    afterTypeList.map((aft: any, index) => {

                                        let on = afterTypeId === aft.afterTypeId
                                        return (
                                            <View className='d_flex fd_r ai_ct pt_10 pb_10' key={'aft' + index}
                                                onClick={this._slectAfterType.bind(this, aft)}
                                            >
                                                <Image src={on ? asset.radio_full : asset.radio} className='radio' />
                                                <Text className={on ? 'red_label default_label pl_10' : 'gray_label default_label pl_10'} >{aft.text}</Text>
                                            </View>
                                        )
                                    })
                                }
                            </View>

                            <View className='d_flex fd_r ai_ct'>
                                <View className='headBorder'></View>
                                <Text className='c33_label default_label pl_10'>{afterTypeId!=27?'退款原因':'换货原因'}</Text>
                            </View>


                            {
                                afterTypeId === 27 ?
                                    <View>
                                         <View className='log_input mt_25'>
                                            <Picker
                                                className='col_1'
                                                mode='selector'
                                                range={this.state.afterReasons} onChange={this._onRate}
                                            >
                                                <Text className='smm_label c33_label pl_15'>{afterReason[afterReasonIndex]}</Text>
                                            </Picker>
                                            <Image src={asset1.down_arrow} className='down_arrow' />
                                        </View>
                                    </View>
                                    :
                                    <View>
                                        <View className='log_input mt_25'>
                                            <Picker
                                                className='col_1'
                                                mode='selector'
                                                range={afterReason} onChange={this._onRate}
                                            >
                                                <Text className='smm_label c33_label pl_15'>{afterReason[afterReasonIndex]}</Text>
                                            </Picker>
                                            <Image src={asset1.down_arrow} className='down_arrow' />
                                        </View>
                                        <View className='d_flex fd_r ai_ct jc_sb mt_30'>
                                            <View className='d_flex fd_r ai_ct'>
                                                <View className='headBorder'></View>
                                                <Text className='c33_label default_label pl_10'>退款金额</Text>
                                            </View>
                                            {
                                                integralAmount > 0 && goodsAmount == 0 ?
                                                    <Text className='default_label red_label'>{integralAmount}学分</Text>
                                                    : null
                                            }
                                            {
                                                integralAmount == 0 && goodsAmount > 0 ?
                                                    <Text className='default_label red_label'>¥{goodsAmount}</Text>
                                                    : null
                                            }
                                            {
                                                integralAmount > 0 && goodsAmount > 0 ?
                                                    <Text className='default_label red_label'>¥{goodsAmount}+{integralAmount}学分</Text>
                                                    : null
                                            }
                                        </View>
                                        <View className='d_flex fd_r ai_ct jc_fe'>
                                            {
                                                integralAmount > 0 && goodsAmount == 0 ?
                                                    <Text className='tip_label sm_label'>不可修改，最多{integralAmount}学分</Text>
                                                    : null
                                            }
                                            {
                                                integralAmount == 0 && goodsAmount > 0 ?
                                                    <Text className='tip_label sm_label'>不可修改，最多¥{goodsAmount}</Text>
                                                    : null
                                            }
                                            {
                                                integralAmount > 0 && goodsAmount > 0 ?
                                                    <Text className='tip_label sm_label'>不可修改，最多¥{goodsAmount}+{integralAmount}学分</Text>
                                                    : null
                                            }
                                        </View>
                                    </View>
                            }

                            <View className='d_flex fd_r ai_ct mt_25'>
                                <View className='headBorder'></View>
                                <Text className='c33_label default_label pl_10'>{afterTypeId === 27 ? '换货说明' : '退款说明'}</Text>
                            </View>
                            <View className='log_input'>
                                <Input
                                    type='text'
                                    placeholder='选填'
                                    className='pl_15'
                                    value={afterExplain}
                                    onInput={(e): void => this.setState({ afterExplain: e.detail.value })}
                                />
                            </View>

                            <View className='d_flex fd_r '>
                                {
                                    afterImgs.map((img, index) => {
                                        return (
                                            <View className='mt_25 mr_10 log_pic' onClick={this.onViewImgs.bind(this, afterImgs, index)} key={'img' + index}>
                                                <Image src={img} className='uppic_img' />
                                                <View onClick={this._onDetele.bind(this, index)} >
                                                    <Image src={asset.i_dete} className="commt_tip" />
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                                {
                                    afterImgs.length < 3 ?
                                        <View className='mt_25 log_pic'>
                                            <Image src={asset.uppic} className='uppic' onClick={this._onChangeImg} />
                                            <Text className='sm_label tip_label'>上传凭证</Text>
                                        </View>
                                        : null}
                            </View>

                        </View>
                        <View className='log_btn'>
                            <View className='log_btn_l col_1' onClick={() => this.setState({ afterType: true, afterImgs: [], afterExplain: '' })}>
                                <Text className='lg18_label tip_label'>关闭</Text>
                            </View>
                            <View className='col_1 log_btn_r' onClick={this._onAfterSubmit}>
                                <Text className='lg18_label red_label'>提交</Text>
                            </View>
                        </View>
                    </View>
                </View>


                <View className='tabbar'>
                    {
                        tabbar_bottom.map((item, idx) => {
                            const on = tabbarIndex === idx

                            return (
                                <View key={'item' + idx} className='tabItem'
                                    onClick={() => Taro.redirectTo({ url: item.link })}
                                >
                                    <Image src={on ? item.iconfull : item.icon} className={on ? 'tabItem_cover ' : 'tabItem_cover '} />
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

export default order as ComponentClass