import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image, Swiper, SwiperItem } from '@tarojs/components'

import menu from '../../../config/menu'
import asset from '../../../config/asset'
import asset1 from '../../config/asset'

import { percent2percent25 } from '../../../utils/common'

import api from '../../../services/api'
import inter from '../../../config/inter'

import '../../../config/theme.css';
import './mail.less'

import { connect } from '@tarojs/redux'
import { mailType } from '../../../constants/mailType'

import {
    getConfigAd,
    getShopSellTop
} from '../../../actions/mail'


type PageStateProps = {
    mail: mailType,
    getConfigAd: Array<{}>,
    getShopSellTop: Array<{}>,
}

type PageDispatchProps = {
    getConfigAd: () => any,
    getShopSellTop: () => any,
}

type PageOwnProps = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface mail {
    props: IProps;
}

type PageState = {

    current: number,
    topNum: number,
    tabbar_bottom: Array<{
        text: string,
        link: string,
        icon: string,
        iconfull: string
    }>,
    adList: Array<{}>,
    shopSellTop: Array<{}>,
    exchangeGifts: Array<{}>,
    lecterEnjoy: Array<{}>,
    vipEnjoy: Array<{}>,
    newRecomm: Array<{}>,
    limitGoods: Array<{}>,
    tabbarIndex: number,
    keyword: string,
    cateId: number,
    cateGoods: Array<{}>,
    teacher: boolean,
    teachers: any,
    level: number,
    keyList: Array<any>
    num: number,
}


@connect(({ mail }) => ({
    mail: mail
}), (dispatch) => ({
    getConfigAd() {
        dispatch(getConfigAd())
    },
    getShopSellTop() {
        dispatch(getShopSellTop())
    }
}))

class mail extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '商城',
        enablePullDownRefresh: true
    }

    constructor() {
        super(...arguments)
        this.state = {
            cateId: 0, // 大分类id
            current: 0,
            topNum: 0,
            tabbar_bottom: [{
                text: '首页',
                link: '',
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
                link: menu.mailOrder,
                icon: asset1.order_icon,
                iconfull: asset1.order_icon_full
            }],
            adList: [], // 弹窗
            shopSellTop: [],  //人气单品
            exchangeGifts: [], // 用户专享
            lecterEnjoy: [], // 讲师专享
            vipEnjoy: [],    // 会员专享礼
            newRecomm: [],  //新品推荐
            cateGoods: [], // 总分类列表
            limitGoods: [],// 限时抢购
            tabbarIndex: 0,
            keyword: '',
            teacher: false,
            teachers: {},
            level: 0,
            keyList: [],
            num: 0,
        }
    }


    componentWillReceiveProps(nextProps) {
        const { mail } = nextProps
        const { adList, shopSellTop, config } = mail

        let searchdefult: string[] = new Array()

        if (Object.keys(config).length !== 0) {
            searchdefult = config.search_goods_def.split("|")
        }

        // let inputtxt: string = searchdefult[Math.floor(Math.random() * searchdefult.length)]

        if (mail !== this.props.mail) {

            this.setState({
                adList: adList,
                shopSellTop: shopSellTop,
                // keyword: searchdefult[0],
                keyList: searchdefult
            })
        }
    }

    componentWillMount() {
        this.getConfig()
    }

    componentDidMount() {
        var that = this;
        that.getUser();
        that._reload();
        that.getHistory()
    }

    componentWillUnmount() {

    }

    componentDidShow() { }
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
    _reload() {
        var that = this

        that._shopCategory();
        that.props.getConfigAd()
        that.props.getShopSellTop()
        that._exchangeGifts();
        that._vipEnjoy();
        that._newRecomm();
        that._limitGoods();
        that._lecterEnjoy();
    }


    _onSwiper(e) {
        var that = this
        that.setState({
            current: e.detail.current
        })
    }

    // 分类
    _shopCategory() {

        var that = this;

        api.get(inter.shopCategory)
            .then(res => {
                if (res.data.status) {
                    let cateGoods = res.data.data
                    that.setState({
                        cateGoods: cateGoods,
                    })
                }
            })
    }



    // 用户专享
    _exchangeGifts() {
        var that = this;

        api.get(inter.shopExchange, {
            exchange_type: 0,
            ctype: '',
            page: ''
        }).then((res) => {
            if (res.data.status) {
                that.setState({
                    exchangeGifts: res.data.data.items
                })
            }
        })
    }
    // 获取个人信息判断是否登录
    getUser() {
        var that = this
        api.get(inter.User)
            .then((res) => {
                console.log(res.data.data)
                if (res) {
                    this.setState({
                        level: res.data.data.level,
                        teacher: res.data.data.teacher,
                        teachers: res.data.data.teacherDTO
                    })
                }
            })
    }
    getHistory = () => {
        let time = new Date().getTime()
        let str = time.toString()
        str = str.slice(0, str.length - 3)
        api.post(inter.userHistory, {
            cctype: 1,
            content_id: parseInt(str),
            ctype: 6,
            etype: 106
        }).then(res => {

        })
    }
    // 讲师专享
    _lecterEnjoy() {
        var that = this;

        api.get(inter.shopExchange, {
            exchange_type: 0,
            ctype: 1,
            page: '',
            sortOrder: 0,
        }).then((res) => {
            console.log(res, '讲师aaaaaa')
            if (res.data.status) {
                that.setState({
                    lecterEnjoy: res.data.data.items
                })
            }
        })
    }

    // 会员专享
    _vipEnjoy() {
        var that = this;

        api.get(inter.shopExchange, {
            exchange_type: 1,
            ctype: 0,
            page: '',
            sortOrder: 0,
        }).then((res) => {
            if (res.data.status) {
                that.setState({
                    vipEnjoy: res.data.data.items
                })
            }
        })
    }

    // 新品推荐
    _newRecomm() {
        var that = this;

        api.get(inter.shopSearch, {
            category_id: '',
            ccategory_id: '',
            keyword: '',
            time_limit: 0,
            gtype: 0,
            sortOrder: 0,
            page: 0,
        }).then((res) => {
            if (res.data.status) {
                that.setState({
                    newRecomm: res.data.data.items
                })
            }
        })
    }


    // 限时抢购
    _limitGoods() {
        var that = this;

        api.get(inter.shopSearch, {
            category_id: '',
            ccategory_id: '',
            keyword: '',
            time_limit: 1,
            gtype: 0,
            sortOrder: 0,
            page: 0,
        }).then((res) => {
            if (res.data.status) {
                that.setState({
                    limitGoods: res.data.data.items
                })
            }
        })
    }


    onAdLink() {

    }
    _goodsDescss(cates) {
        const { level } = this.state
        api.post(inter.inuserLogs, {
            logType: 3,
            type: 3,
            content_id: cates.goodsId,
            from: 1
        }).then(res => { })
        Taro.navigateTo({
            url: menu.mailDesc + "?goods_id=" + cates.goodsId + "&goodsName=" + percent2percent25(cates.goodsName)
        })

    }
    _goodsDesc(cates) {
        api.post(inter.inuserLogs, {
            log_type: 3,
            type: 3,
            content_id: cates.goodsId,
            from: 1
        }).then(res => { })
        Taro.navigateTo({
            url: menu.mailDesc + "?goods_id=" + cates.goodsId + "&goodsName=" + percent2percent25(cates.goodsName)
        })
    }
    _goodsDescs(cates) {
        const { teacher, teachers } = this.state
        api.post(inter.inuserLogs, {
            log_type: 3,
            type: 3,
            content_id: cates.goodsId,
            from: 1
        }).then(res => { })
        Taro.navigateTo({
            url: menu.mailDesc + "?goods_id=" + cates.goodsId + "&goodsName=" + percent2percent25(cates.goodsName)
        })

    }

    _adDesc(ad) {
        let adlink = ad.link
        api.post(inter.saveHistory, {
            type: 1,
            billboard_id: ad.billboardId
        })
            .then(res => {
                // console.log(res)
            })
        if (adlink !== '') {
            if (adlink.substring(0, 4) == 'http') {
                Taro.navigateTo({ url: menu.adWebView + '?link=' + `${ad.link}` + '&ad=' + `${JSON.stringify(ad)}` })
            } else {
                Taro.navigateTo({
                    url: adlink
                })
            }
        }

    }


    // 下拉
    onPullDownRefresh() {
        var self = this

        self._reload()
        setTimeout(function () {
            //执行ajax请求后停止下拉
            Taro.stopPullDownRefresh();
        }, 1000);
    }

    render() {
        const { adList, current, topNum, tabbar_bottom, tabbarIndex, keyword, shopSellTop, exchangeGifts, vipEnjoy, newRecomm, lecterEnjoy, cateGoods, limitGoods, teachers, num, keyList } = this.state
        let exGifts = exchangeGifts.slice(0, 3)
        let limitgood = limitGoods.slice(0, 3)
        let cateGood = cateGoods.slice(0, 4)

        //视频的品读款度
        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {

        }
        setTimeout(() => {
            if (num < keyList.length - 1) {
                this.setState({
                    num: num + 1
                })
            } else {
                this.setState({
                    num: 0
                })
            }
        }, 5000);
        return (
            <View className='indexwrap'>
                <ScrollView
                    scrollY
                    scrollTop={topNum}
                    scrollWithAnimation
                    enableBackToTop={true}
                    scrollIntoView='C'
                    className='pb_30'
                    style={{ paddingBottom: 150 + 'rpx' }}
                >
                    <View className='searchbox d_flex fd_r pt_12 pb_12 ai_ct pl_15 pr_15'>
                        <View className='search_input d_flex fd_r ai_ct col_1 pl_12'
                            onClick={() => { Taro.navigateTo({ url: menu.mailSearch + '?keyword=' + (keyList.length > 0 ? percent2percent25(keyList[num]) : '') }) }}
                        >
                            <Image src={asset.search} className='search_icon' />
                            <View className='search_text pl_5'>
                                <Text className='default_label  tip_label'>{keyList.length > 0 ? keyList[num] : ''}</Text>
                            </View>
                        </View>
                    </View>

                    <View className='swiper_cons'>
                        <Swiper
                            className='swiper3D'
                            indicatorColor='rgba(255,255,355,0.49)'
                            indicatorActiveColor='#ffffff'
                            vertical={false}
                            circular
                            indicatorDots
                            autoplay
                            duration={1000}
                            interval={5000}
                            previous-margin='50rpx'
                            next-margin='50rpx'
                            onChange={(e) => this._onSwiper(e)}
                        >
                            {
                                adList.map((ad: any, index) => {
                                    const on = current == index

                                    return (
                                        <SwiperItem className={on ? 'active' : 'normal'} key={'ad' + index} >
                                            <View className={'swiper_item'}>
                                                <Image
                                                    className={'swiper_img'}
                                                    src={ad.fileUrl}
                                                    onClick={this._adDesc.bind(this, ad)}
                                                />
                                            </View>
                                        </SwiperItem>
                                    )
                                })
                            }
                        </Swiper>
                    </View>


                    {
                        cateGood.length > 0 ?
                            <View className='cateList'>
                                {
                                    cateGood.map((cates: any, index) => {
                                        return (
                                            <View key={'cates' + index} className='cateItem'
                                                style={{ width: ((windowWidth - 72) / 5).toFixed(0) + 'px' }}
                                                onClick={() => Taro.navigateTo({ url: menu.mailList + '?keyword=' + percent2percent25(cates.categoryName) + '&cateId=' + cates.categoryId + '&time_limit=0' })}
                                            >
                                                <Image src={cates.link} className='cateCover' />
                                                <Text className='block_label sm_label mt_10'>{cates.categoryName}</Text>
                                            </View>
                                        )
                                    })
                                }
                                <View className='cateItem'
                                    style={{ width: ((windowWidth - 72) / 5).toFixed(0) + 'px' }}
                                    onClick={() => Taro.navigateTo({ url: menu.mailCate })}
                                >
                                    <View className='cateCover'>
                                        <Image src={asset1.cateIcon} style={{ width: 40 + 'rpx', height: 40 + 'rpx' }} />
                                    </View>
                                    <Text className='block_label sm_label mt_10'>全部分类</Text>
                                </View>
                            </View>
                            : null}



                    {
                        shopSellTop.length > 0 ?
                            <View className='pl_15 pr_15 mt_20 recomm'>
                                <View className='d_flex fd_r jc_sb'>
                                    <View className='d_flex fd_r ai_ct'>
                                        <View className='headBorder'></View>
                                        <Text className='lg18_label black_label fw_label pl_10'>人气单品</Text>
                                    </View>
                                </View>
                                <View className='popularItem'>
                                    <View
                                        // scrollX
                                        style={{ height: '320rpx', overflowY: 'auto' }}
                                    >
                                        <View className='popu_items d_flex mt_15 '>
                                            {
                                                shopSellTop.map((item: any, index) => {
                                                    return (
                                                        <View className='popu_item d_flex fd_c '
                                                            key={'item' + index}
                                                            onClick={this._goodsDesc.bind(this, item)}
                                                        >
                                                            <Image className='popu_cover' src={item.goodsImg} style={{ backgroundColor: '#FFFFFF' }} />
                                                            <Text className='c33_label sm_label  mt_5 dup_per_txt'>{item.goodsName}</Text>
                                                            {
                                                                item.gtype == 1 ?
                                                                    <Text className='sred_label sm_label fw_label mt_5 '>免费</Text>
                                                                    : item.gtype == 2 ?
                                                                        <Text className='sred_label sm_label fw_label mt_5 '>¥{item.goodsAmountDTO.goodsAmount ? item.goodsAmountDTO.goodsAmount : item.goodsAmount}</Text>
                                                                        : item.gtype == 3 ?
                                                                            <Text className='sred_label sm_label fw_label mt_5'>{item.goodsIntegral}学分</Text>
                                                                            : item.gtype == 4 ?
                                                                                <Text className='sred_label sm_label fw_label mt_5 '>¥{item.goodsAmount}+{item.goodsIntegral}学分</Text>
                                                                                : null
                                                            }
                                                            {/* <Text className='sred_label sm_label fw_label mt_5'>{item.goodsIntegral}学分</Text> */}

                                                            {
                                                                item.tagList[0].tagName.length > 0 ?
                                                                    <View className='popu_tips'>
                                                                        <Text className='smm_label white_label'>{item.tagList[0].tagName}</Text>
                                                                    </View>
                                                                    : null}
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>
                            </View>
                            : null}


                    {
                        limitgood.length > 0 ?
                            <View className='pl_15 pr_15 mt_15 recomm'>
                                <View className='d_flex fd_r jc_sb'>
                                    <View className='d_flex fd_r ai_ct'>
                                        <View className='headBorder'></View>
                                        <Text className='lg18_label black_label fw_label pl_10'>限时抢购</Text>
                                    </View>
                                    <Text className='sm_label tip_label'
                                        onClick={() => Taro.navigateTo({ url: menu.mailList + '?keyword=限时抢购' + '&cateId=' + "" + '&time_limit=1' })}
                                    >更多</Text>
                                </View>

                                <View className='convert'>
                                    <View className='con_boxs fd_r jc_sb'>
                                        {
                                            limitgood.map((gift: any, index) => {
                                                return (
                                                    <View className='d_flex fd_c con_box'
                                                        key={'gift' + index}
                                                        style={{ width: ((windowWidth - 76) / 3).toFixed(0) + 'px' }}
                                                        onClick={this._goodsDesc.bind(this, gift)}
                                                    >
                                                        <Image src={gift.goodsImg} className='convertCover' style={{ backgroundColor: '#F8F8F8' }} />
                                                        <Text className='c33_label sm_label mt_5 dup_per_txt'>{gift.goodsName}</Text>
                                                        {
                                                            gift.gtype == 1 ?
                                                                <Text className='sred_label sm_label fw_label mt_5 '>免费</Text>
                                                                : gift.gtype == 2 ?
                                                                    <Text className='sred_label sm_label fw_label mt_5 '>¥{gift.goodsAmountDTO.goodsAmount ? gift.goodsAmountDTO.goodsAmount : gift.goodsAmount}</Text>
                                                                    : gift.gtype == 3 ?
                                                                        <Text className='sred_label sm_label fw_label mt_5'>{gift.goodsIntegral}学分</Text>
                                                                        : gift.gtype == 4 ?
                                                                            <Text className='sred_label sm_label fw_label mt_5 '>{gift.goodsIntegral}学分</Text>
                                                                            : null
                                                        }
                                                        {/* <Text className='sred_label sm_label fw_label mt_5'>{gift.goodsIntegral}学分</Text> */}
                                                        <View className='con_tips'>
                                                            <Text className='smm_label white_label'>限时抢购</Text>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                        }

                                    </View>
                                </View>
                            </View>
                            : null}


                    {
                        exGifts.length > 0 ?
                            <View className='pl_15 pr_15 mt_15 recomm'>
                                <View className='d_flex fd_r jc_sb'>
                                    <View className='d_flex fd_r ai_ct'>
                                        <View className='headBorder'></View>
                                        <Text className='lg18_label black_label fw_label pl_10'>用户专享</Text>
                                    </View>
                                    <Text className='sm_label tip_label'
                                        onClick={() => Taro.navigateTo({ url: menu.flash + '?title=用户专享' })}
                                    >更多</Text>
                                </View>

                                <View className='convert'>
                                    <View className='con_boxs fd_r jc_sb'>
                                        {
                                            exGifts.map((gift: any, index) => {
                                                return (
                                                    <View className='d_flex fd_c con_box'
                                                        key={'gift' + index}
                                                        style={{ width: ((windowWidth - 76) / 3).toFixed(0) + 'px' }}
                                                        onClick={this._goodsDesc.bind(this, gift)}
                                                    >
                                                        <Image src={gift.goodsImg} className='convertCover' style={{ backgroundColor: '#F8F8F8' }} />
                                                        <Text className='c33_label sm_label mt_5 dup_per_txt'>{gift.goodsName}</Text>
                                                        {
                                                            gift.gtype == 1 ?
                                                                <Text className='sred_label sm_label fw_label mt_5 '>免费</Text>
                                                                : gift.gtype == 2 ?
                                                                    <Text className='sred_label sm_label fw_label mt_5 '>¥{gift.goodsAmountDTO.goodsAmount ? gift.goodsAmountDTO.goodsAmount : gift.goodsAmount}</Text>
                                                                    : gift.gtype == 3 ?
                                                                        <Text className='sred_label sm_label fw_label mt_5'>{gift.goodsIntegral}学分</Text>
                                                                        : gift.gtype == 4 ?
                                                                            <Text className='sred_label sm_label fw_label mt_5 '>¥{gift.goodsAmount}+{gift.goodsIntegral}学分</Text>
                                                                            : null
                                                        }
                                                        {/* <Text className='sred_label sm_label fw_label mt_5'>{gift.goodsIntegral}学分</Text> */}
                                                        {
                                                            gift.tagList[0].tagName.length > 0 ?
                                                                <View className='con_tips'>
                                                                    <Text className='smm_label white_label'>{gift.tagList[0].tagName}</Text>
                                                                </View>
                                                                : null}
                                                    </View>
                                                )
                                            })
                                        }

                                    </View>
                                </View>
                            </View>
                            : null}

                    {
                        vipEnjoy.length > 0 ?
                            <View className='pl_15 pr_15 mt_15 recomm'>
                                <View className='d_flex fd_r jc_sb'>
                                    <View className='d_flex fd_r ai_ct'>
                                        <View className='headBorder'></View>
                                        <Text className='lg18_label black_label fw_label pl_10'>会员专享礼</Text>
                                    </View>
                                    <Text className='sm_label tip_label'
                                        onClick={() => Taro.navigateTo({ url: menu.generalList + '?title=会员专享礼' + '&exchange_type=' + 1 + '&ctype=' + 9 + '&dtype=0' })}
                                    >更多</Text>
                                </View>
                                <View className='recommBox'>
                                    {
                                        vipEnjoy.map((vip: any, index) => {
                                            return (
                                                <View key={'cates' + index} className='rcomItem'
                                                    style={{ width: ((windowWidth - 46) / 2).toFixed(0) + 'px' }}
                                                    onClick={this._goodsDescss.bind(this, vip)}
                                                >
                                                    <Image
                                                        className='catesCover'
                                                        src={vip.goodsImg}
                                                        mode='aspectFit'
                                                        style={{ width: ((windowWidth - 46) / 2).toFixed(0) + 'px', height: ((windowWidth - 46) / 2).toFixed(0) + 'px' }}
                                                    />
                                                    <Text className='c33_label default_label pl_10 mt_5 pl_10 dup_per_txt'>{vip.goodsName}</Text>
                                                    {
                                                        vip.gtype == 1 ?
                                                            <Text className='sred_label sm_label fw_label mt_5 pl_10'>免费</Text>
                                                            : vip.gtype == 2 ?
                                                                <Text className='sred_label sm_label fw_label mt_5 pl_10'>¥{vip.goodsAmountDTO.goodsAmount ? vip.goodsAmountDTO.goodsAmount : vip.goodsAmount}</Text>
                                                                : vip.gtype == 3 ?
                                                                    <Text className='sred_label sm_label fw_label mt_5 pl_10'>{vip.goodsIntegral}学分</Text>
                                                                    : vip.gtype == 4 ?
                                                                        <Text className='sred_label sm_label fw_label mt_5 pl_10'>¥{vip.goodsAmount}+{vip.goodsIntegral}学分</Text>
                                                                        : null
                                                    }
                                                    {/* <Text className='sred_label sm_label fw_label mt_5'>{vip.goodsIntegral}学分</Text> */}
                                                    <View className='vip_tips'>
                                                        <Text className='smm_label c33_label'>Lv.{vip.ulevel}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                            : null}


                    {
                        lecterEnjoy.length > 0 ?
                            <View className='pl_15 pr_15 mt_15 recomm'>
                                <View className='d_flex fd_r jc_sb'>
                                    <View className='d_flex fd_r ai_ct'>
                                        <View className='headBorder'></View>
                                        <Text className='lg18_label black_label fw_label pl_10'>讲师专享</Text>
                                    </View>
                                    <Text className='sm_label tip_label'
                                        onClick={() => Taro.navigateTo({ url: menu.generalList + '?title=讲师专享' + '&exchange_type=' + 9 + '&ctype=' + 1 + '&dtype=1' })}
                                    >更多</Text>
                                </View>
                                <View className='recommBox'>
                                    {
                                        lecterEnjoy.map((lecter: any, index) => {
                                            return (
                                                <View key={'cates' + index} className='rcomItem'
                                                    style={{ width: ((windowWidth - 46) / 2).toFixed(0) + 'px' }}
                                                    onClick={this._goodsDescs.bind(this, lecter)}
                                                >
                                                    <Image
                                                        className='catesCover'
                                                        src={lecter.goodsImg}
                                                        mode='aspectFit'
                                                        style={{ width: ((windowWidth - 46) / 2).toFixed(0) + 'px', height: ((windowWidth - 46) / 2).toFixed(0) + 'px' }}
                                                    />
                                                    <Text className='c33_label default_label pl_10 mt_5 dup_per_txt'>{lecter.goodsName}</Text>
                                                    {
                                                        lecter.gtype == 1 ?
                                                            <Text className='sred_label sm_label fw_label mt_5 pl_10'>免费</Text>
                                                            : lecter.gtype == 2 ?
                                                                <Text className='sred_label sm_label fw_label mt_5 pl_10'>¥{lecter.goodsAmountDTO.goodsAmount ? lecter.goodsAmountDTO.goodsAmount : lecter.goodsAmount}</Text>
                                                                : lecter.gtype == 3 ?
                                                                    <Text className='sred_label sm_label fw_label mt_5 pl_10'>{lecter.goodsIntegral}学分</Text>
                                                                    : lecter.gtype == 4 ?
                                                                        <Text className='sred_label sm_label fw_label mt_5 pl_10'>¥{lecter.goodsAmount}+{lecter.goodsIntegral}学分</Text>
                                                                        : null
                                                    }
                                                    {/* <Text className='sred_label sm_label fw_label mt_5 pl_10'>{lecter.goodsIntegral}学分</Text> */}
                                                    <View className='lect_tips'>
                                                        <Text className='smm_label white_label'>{lecter.tlevel == 1 ? '讲师' : lecter.tlevel == 2 ? '初级' : lecter.tlevel == 3 ? '中级' : lecter.tlevel == 4 ? '高级' : null}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                            : null}

                    {
                        newRecomm.length > 0 ?
                            <View className='pl_15 pr_15 mt_15 recomm'>
                                <View className='d_flex fd_r jc_sb'>
                                    <View className='d_flex fd_r ai_ct'>
                                        <View className='headBorder'></View>
                                        <Text className='lg18_label black_label fw_label pl_10'>新品推荐</Text>
                                    </View>
                                    <Text className='sm_label tip_label'
                                        onClick={() => Taro.navigateTo({ url: menu.flash + '?title=新品推荐'+'&type=1' })}
                                    >更多</Text>
                                </View>
                                <View className='recommBox'>
                                    {
                                        newRecomm.map((recom: any, index) => {
                                            return (
                                                <View key={'cates' + index} className='rcomItem'
                                                    style={{ width: ((windowWidth - 46) / 2).toFixed(0) + 'px' }}
                                                    onClick={this._goodsDesc.bind(this, recom)}
                                                >
                                                    <Image
                                                        className='catesCover'
                                                        src={recom.goodsImg}
                                                        mode='aspectFit'
                                                        style={{ width: ((windowWidth - 46) / 2).toFixed(0) + 'px', height: ((windowWidth - 46) / 2).toFixed(0) + 'px' }}
                                                    />
                                                    <Text className='c33_label default_label pl_10 mt_5 dup_per_txt'>{recom.goodsName}</Text>
                                                    {
                                                        recom.gtype == 1 ?
                                                            <Text className='sred_label sm_label fw_label mt_5 pl_10'>免费</Text>
                                                            : recom.gtype == 2 ?
                                                                <Text className='sred_label sm_label fw_label mt_5 pl_10'>¥{recom.goodsAmountDTO.goodsAmount ? recom.goodsAmountDTO.goodsAmount : recom.goodsAmount}</Text>
                                                                : recom.gtype == 3 ?
                                                                    <Text className='sred_label sm_label fw_label mt_5 pl_10'>{recom.goodsIntegral}学分</Text>
                                                                    : recom.gtype == 4 ?
                                                                        <Text className='sred_label sm_label fw_label mt_5 pl_10'>¥{recom.goodsAmount}+{recom.goodsIntegral}学分</Text>
                                                                        : null
                                                    }
                                                    {/* <Text className='sred_label sm_label fw_label mt_5 pl_10'>{recom.goodsIntegral}学分</Text> */}
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                            : null}

                </ScrollView>
                <View className='tabbar'>
                    {
                        tabbar_bottom.map((item, idx) => {
                            const on = tabbarIndex === idx
                            return (
                                <View key={'item' + idx} className='tabItem'
                                    onClick={() => Taro.navigateTo({ url: item.link })}
                                >
                                    <Image src={on ? item.iconfull : item.icon} className={on ? 'tabItem_cover' : 'tabItem_cover'} />
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

export default mail as ComponentClass