import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem, Input, Video } from '@tarojs/components'

import menu from '../../../config/menu';
import Auth from '../../../components/Auth'
import GrapTmp from '../../../pages/index/grapTmp'

import { percent2percent25 } from '../../../utils/common'

import inter from '../../../config/inter'
import api from '../../../services/api'

import asset from '../../config/asset'

import '../../../config/theme.css';
import './mailDesc.less'




import { connect } from '@tarojs/redux'
import { mailType } from '../../../constants/mailType'

import {
    getGoodsDesc,
} from '../../../actions/mail'

type PageStateProps = {
    mail: mailType,
    getGoodsDesc: {},
}

type PageDispatchProps = {
    getGoodsDesc: (object) => any,
}

type PageOwnProps = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface mailDesc {
    props: IProps;
}



type PageState = {
    userId: number,
    load: boolean,
    status: boolean,
    cartType: boolean,
    goods_id: number,
    goods_number: any,
    stock: number,
    galleryList: Array<{
        fpath: string
    }>,
    goodsDesc: {
        isFree: number,
        goodsName: string,
        goodsAmount: number,
        summary: string,
        marketAmount: number,
        saleNum: number,
        goodsImg: string,
        goodsIntegral: number,
        gtype: number,
        goodsActivityDTO: object,
    },
    goodsAttr: Array<{
        attrId: number,
        atype: number,
        goodsAttrMapList: Array<{
            attrId: number,
            attrVal: string,
            goodsAttrId: number,
            goodsId: number,
            stock: number,
        }>,
        itype: number
        name: string,
        sortOrder: number,
        stock: number,
        typeId: number,
        values: string,
    }>,
    goodsAttrIds: any,
    goodsIntro: string,
    goodsAttr_str: string,
    goodsOne: string,
    goodsTwo: string,
    goodsThree: string,
    height: any


    dis_Amount: number,
    dis_level: number,
    goodsAmountDTO: {
        goodsId: number,
        level: number,
        goodsAmount: any
    },

    payType: number,
    level: number,
    teacher: boolean,
    teachers: any,
    address: any,
    freightAmount: number,
    stockMap:any,
    stocks:number
}

@connect(({ mail }) => ({
    mail: mail
}), (dispatch) => ({

    getGoodsDesc(object) {
        dispatch(getGoodsDesc(object))
    }
}))


class mailDesc extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '商品详情'
    }

    constructor() {
        super(...arguments)
        this.state = {
            userId: 0,
            load: false,
            status: true,
            cartType: true,
            goods_id: 0,
            goodsDesc: {},
            galleryList: [],
            goodsAttr: [],
            goodsAttrIds: {},
            goods_number: 1,
            stock: 0,
            stocks:0,
            goodsIntro: "",
            goodsAttr_str: "",
            // dis_Amount:0,
            // dis_level:0,
            payType: 0, //  1 加入购物车 2 立即购买
            goodsOne: "",
            goodsTwo: "",
            goodsThree: '',
            height: '',
            level: 0,
            teacher: false,
            teachers: {},
            address: [],
            freightAmount: 0,
            stockMap:[]
        }

        this._onLoadCallBack = this._onLoadCallBack.bind(this);
        this.onShareAppMessage = this.onShareAppMessage.bind(this);
        this._toCart = this._toCart.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { mail } = nextProps
        const { goodsDesc } = mail
        if (mail.goodsDesc == 'LEVEL_FALSE') {
            Taro.showModal({
                title: '提示',
                content: '该等级无法兑换',
                success: function (res) {
                    if (res.confirm) {
                        Taro.navigateBack({
                            delta: 1
                        })
                    } else if (res.cancel) {
                        Taro.navigateBack({
                            delta: 1
                        })
                    }
                }
            })
        }
        if (mail !== this.props.mail) {
            var goods = goodsDesc.goodsIntro.split("<p></p>")
            let good = ''
            if (goods.filter(item => item.search('.mp4') != -1).length != 0) {
                good = goods.filter(item => item.search('.mp4') != -1)[0].split('src="')[1]
            }
            let maps = []
            if(goodsDesc.attrStockMapDTOS.length>0){
                goodsDesc.attrStockMapDTOS.map(item=>{
                    let vas = {goodsAttrIds:item.goodsAttrIds,stock:item.stock}
                    maps.push(vas)
                })
            }
            if(goodsDesc.status===0){
                Taro.showModal({
                    title: '提示',
                    content: '该商品已下架',
                    success: function (res) {
                        if (res.confirm) {
                            Taro.switchTab({ url: menu.index })
                        } else if (res.cancel) {
                            Taro.switchTab({ url: menu.index })
                        }
                    }
                })
                setTimeout(() => {
                    Taro.switchTab({ url: menu.index })
                }, 3000);
            }
            this.setState({
                goodsDesc: goodsDesc,
                galleryList: goodsDesc.galleryList,
                stock: goodsDesc.stock,
                stocks:goodsDesc.stock,
                goodsAttr: goodsDesc.goodsAttr,
                goodsIntro: goodsDesc.goodsIntro,
                load: true,
                goodsAmountDTO: goodsDesc.goodsAmountDTO,
                // dis_Amount:goodsDesc.goodsAmountDTO.,
                // dis_level:goodsDesc.goodsAmountDTO.level,
                goodsOne: goods,
                goodsTwo: goods.slice(1).filter(item => item.search('.mp4') == -1),
                goodsThree: good,
                stockMap:maps
            }, () => {
                this._getUser();
            })
            if (goodsDesc.canShare == 0) {
                Taro.hideShareMenu()
            }
        }

    }



    componentWillMount() {


        const { goodsName, goods_id, scene, fromuser } = this.$router.params;

        Taro.setNavigationBarTitle({
            title: goodsName,
        })

        this.setState({
            goods_id: parseInt(goods_id)
        })

        if (scene) {
            const fuser = decodeURIComponent(scene).split('=');
            if (fuser.length > 1) {
                Taro.setStorageSync('fuser', fuser[1]);
            }
        }
        if (fromuser) {
            Taro.setStorageSync('fuser', fromuser);
        }
    }

    componentDidMount() {
        var that = this;
        const { goods_id } = that.state
        that.props.getGoodsDesc({
            goods_id
        })
        this.getHistory()
    }

    componentWillUnmount() {

    }

    componentDidShow() {
        var that = this;
        const { goods_id } = that.state

        api.get(inter.shopDesc + goods_id)
            .then((res) => {
                if (res.data.status) {
                    let gdesc = res.data.data

                    that.setState({
                        stock: gdesc.stock
                    })
                }
            })
    }
    componentDidHide() { }

    _getUser() {
        var that = this

        api.get(inter.User)
            .then(res => {
                if (res.data.status) {
                    let userData = res.data.data
                    that.setState({
                        level: userData.level,
                        userId: userData.userId,
                        teacher: userData.teacher,
                        teachers: userData.teacherDTO
                    })
                    if (userData.addressList.length > 0) {
                        that.setState({
                            address: userData.addressList
                        })
                        let vas = userData.addressList[0]
                        that._shipAmount(vas.province, vas.city)
                    }
                }
            })
    }
    getHistory=()=>{
        const{goods_id}=this.state
        api.post(inter.userHistory,{
            cctype:1,
            content_id:goods_id,
            ctype:7,
            etype:106
        }).then(res=>{

        })
    }
    _shipAmount(province, city) {
        const { goodsDesc } = this.state
        api.get(inter.shipAmount, {
            province: province,
            city: city,
            goods_weight: goodsDesc.goodsWeight,
        }).then((res) => {
            if (res.data.status) {
                this.setState({
                    freightAmount: res.data.data,
                })

            }
        })
    }
    //分享课程
    onShareAppMessage = (res) => {

        const { goodsDesc, userId, galleryList, goods_id } = this.state

        api.post(inter.userLog, {
            log_type: 1,
            type: 1,
            device_id: 0,
            intro: '分享商城商品详情页',
            content_id: goods_id,
            param: JSON.stringify({ name: goodsDesc.goodsName, cctype: 7, ttype: 0 }),
            from: 0,
        }).then((res) => {
            console.log('ee')
        })


        if (res.from === 'button') {
            // 来自页面内转发按钮
        }

        return {
            title: goodsDesc.goodsName,
            path: menu.mailDesc + '?goods_id=' + goods_id + '&goodsName=' + percent2percent25(goodsDesc.goodsName) + '&fromuser=' + userId,
            imageUrl: galleryList[0].fpath + '?x-oss-process=image/resize,w_500,h_380,m_pad'
        }
    }

    //
    _add() {
        var that = this;
        const { goods_number, stock } = that.state

        if (goods_number < stock) {
            that.setState({
                goods_number: goods_number + 1
            })
        } else {
            Taro.showToast({
                title: '库存不足',
                icon: 'none',
                duration: 1000
            })
        }

    }

    //
    _minus() {

        var that = this;
        const { goods_number } = that.state

        if (goods_number > 1) {
            that.setState({
                goods_number: goods_number - 1
            })
        }
    }

    // 立即购买
    _toBuy() {
        var that = this
        const { goodsDesc, level, teachers, teacher } = this.state
        if (level < goodsDesc.ulevel) {
            Taro.showToast({
                title: '该等级无法兑换',
                icon: 'none',
                duration: 1500
            });
            return;
        }
        if (goodsDesc.tlevel > 0 && !teacher) {
            Taro.showToast({
                title: '抱歉，您不是讲师',
                icon: 'none',
                duration: 1500
            });
            return;
        }
        if (goodsDesc.tlevel > 0 && teachers.level + 1 < goodsDesc.tlevel) {
            Taro.showToast({
                title: '该讲师等级无法兑换',
                icon: 'none',
                duration: 1500
            });
            return;
        }
        that.setState({
            cartType: false,
            payType: 2,
        })
    }

    // 加入购物车
    _toCart() {

        var that = this;
        const { goodsDesc, level, teachers, teacher } = this.state
        if (level < goodsDesc.ulevel) {
            Taro.showToast({
                title: '抱歉，您的等级未达标',
                icon: 'none',
                duration: 1500
            });
            return;
        }
        if (goodsDesc.tlevel > 0 && !teacher) {
            Taro.showToast({
                title: '抱歉，您不是讲师',
                icon: 'none',
                duration: 1500
            });
            return;
        }
        if (goodsDesc.tlevel > 0 && teachers.level + 1 < goodsDesc.tlevel) {
            Taro.showToast({
                title: '抱歉，您的等级未达标',
                icon: 'none',
                duration: 1500
            });
            return;
        }
        that.setState({
            cartType: false,
            payType: 1,
        })
    }

    // 直接购买   加入购物车
    _toOrder() {
        var that = this
        const { goodsDesc, goods_number, goodsAttrIds, goodsAttr, goodsIntro, goodsAttr_str, stock, goods_id, payType, goodsAmountDTO, level } = that.state

        let attrids = Object.values(goodsAttrIds).join(",");
        if (Object.values(goodsAttrIds).length >= goodsAttr.length) {

            if (stock >= goods_number) {

                if (payType === 2) {
                    let amount = goodsDesc.goodsAmount
                    if (goodsAmountDTO.goodsAmount) {
                        amount = goodsAmountDTO.goodsAmount
                    }
                    Taro.navigateTo({
                        url: menu.payOrder + '?goodsName=' + goodsDesc.goodsName + '&goods_id=' + goods_id + '&goodsIntegral=' + goodsDesc.goodsIntegral + '&goodsImg=' + goodsDesc.goodsImg + '&goods_number=' + goods_number + '&goodsAttrIds=' + JSON.stringify(goodsAttrIds) + '&goodsAttr_str=' + goodsAttr_str + '&gtype=' + goodsDesc.gtype + '&isFree=' + goodsDesc.isFree + '&goodsAmount=' + amount + '&goodsActivityDTO=' + JSON.stringify(goodsDesc.goodsActivityDTO) + '&goodsDesc=' + JSON.stringify(goodsDesc),
                    })
                    that.setState({
                        cartType: true
                    })

                } else {

                    api.post(inter.shopAddCart, {
                        goods_id: goods_id,
                        attr_ids: attrids,
                        goods_number: goods_number,
                        device_id: 0,
                    }).then((res) => {
                        if (res.data.status) {
                            that.setState({
                                cartType: true
                            })
                            api.post(inter.inuserLogs,{
                                log_type:3,
                                type:4,
                                content_id:goods_id,
                                from:1
                            }).then(res=>{})
                            Taro.showToast({
                                title: '加入成功',
                                icon: 'none',
                                duration: 1000
                            })
                        }
                    })

                }

            } else {
                Taro.showToast({
                    title: '库存不足',
                    icon: 'none',
                    duration: 1000
                })
            }

        } else {
            Taro.showToast({
                title: '请选择规格',
                icon: 'none',
                duration: 1000,
            })
        }

    }

    _selectAttr(attr, idx, index) {

        var that = this
        const { goodsAttr, goodsAttrIds,stockMap } = that.state


        if (goodsAttrIds[attr.attrId] === undefined || goodsAttrIds[attr.attrId] === "") {

            goodsAttrIds[attr.attrId] = attr.goodsAttrId + ''

        } else {
            let attr_ids: Array<any> = goodsAttrIds[attr.attrId].split(",")

            if (attr_ids.indexOf(attr.goodsAttrId + '') > -1) {
                attr_ids.splice(attr_ids.indexOf(attr.goodsAttrId + ''), 1)
            } else {
                attr_ids[0] = attr.goodsAttrId + ''
            }

            let attr_str: string = attr_ids.join(",")

            goodsAttrIds[attr.attrId] = attr_str
        }
        // console.log(goodsAttrIds,stockMap,'///')
        let lst = Object.values(goodsAttrIds)
        // console.log(lst.toLocaleString(),'bbbb')
        let stocks = 0
        if(stockMap.length>0){
            stockMap.map(itm=>{
                if(lst.length==1){
                    if(itm.goodsAttrIds.indexOf(lst.toLocaleString())!=-1){
                        stocks=stocks+itm.stock
                    }
                }
                if(lst.length==2){
                    if(itm.goodsAttrIds.indexOf(lst[0])!=-1&&itm.goodsAttrIds.indexOf(lst[1])!=-1){
                        stocks=stocks+itm.stock
                    }
                } 
                if(lst.length==3){
                    if(itm.goodsAttrIds.indexOf(lst[0])!=-1&&itm.goodsAttrIds.indexOf(lst[1])!=-1&&itm.goodsAttrIds.indexOf(lst[2])!=-1){
                        stocks=stocks+itm.stock
                    }
                } 
                if(lst.length==4){
                    if(itm.goodsAttrIds.indexOf(lst[0])!=-1&&itm.goodsAttrIds.indexOf(lst[1])!=-1&&itm.goodsAttrIds.indexOf(lst[2])!=-1&&itm.goodsAttrIds.indexOf(lst[3])!=-1){
                        stocks=stocks+itm.stock
                    }
                } 
                if(lst.length==5){
                    if(itm.goodsAttrIds.indexOf(lst[0])!=-1&&itm.goodsAttrIds.indexOf(lst[1])!=-1&&itm.goodsAttrIds.indexOf(lst[2])!=-1&&itm.goodsAttrIds.indexOf(lst[3])!=-1&&itm.goodsAttrIds.indexOf(lst[4])!=-1){
                        stocks=stocks+itm.stock
                    }
                } 
            })
        }
        // console.log(stocks,'aaaaa')
        that.setState({
            goodsAttrIds: goodsAttrIds,
            stock:stocks,
            goods_number:1
        }, () => {
            that._goodStr()
        })


    }

    _goodStr() {
        var that = this;
        const { goodsAttr, goodsAttrIds } = that.state

        let attrs: any = []

        for (let i = 0; i < goodsAttr.length; i++) {
            for (let j = 0; j < goodsAttr[i].goodsAttrMapList.length; j++) {
                if (goodsAttr[i].goodsAttrMapList[j].goodsAttrId === parseInt(goodsAttrIds[goodsAttr[i].attrId])) {
                    attrs.push(goodsAttr[i].goodsAttrMapList[j].attrVal)
                }
            }
        }

        that.setState({
            goodsAttr_str: attrs.join(",")
        })

    }



    _onLoadCallBack() {
        var that = this;
        that._getUser();
    }
    // videometa=(e)=>{
    //     var that =this
    //     Taro.getSystemInfo({
    //         success:(res){
    //             var height = e.detail.height;

    //             //视频的宽
    //             var width = e.detail.width;

    //             //算出视频的比例
    //             var proportion = height / width;

    //             //res.windowWidth为手机屏幕的宽。
    //             var windowWidth = res.windowWidth;

    //             //算出当前宽度下高度的数值
    //             height = proportion * windowWidth;
    //             that.setState({
    //                 height:(height).toString()+'px'
    //             })
    //         }
    //     })
    // }

    render() {
        if (!this.state.load) return null;
        const { status, cartType, goodsDesc, galleryList, goods_number, goodsAttr, goodsAttrIds, goodsIntro, goodsOne, goodsTwo, goodsThree, stock, goodsAmountDTO,stocks } = this.state

        //视频的品读款度
        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {

        }

        return (
            <View className='wrap'>
                <View className='goods'>
                    <View className='teachHead'>
                        <Swiper
                            className='swiper'
                            style={{ width: windowWidth + 'px', height: windowWidth + 'px' }}
                            indicatorColor='rgba(202,202,202,1)'
                            indicatorActiveColor='#F4623F'
                            vertical={false}
                            circular
                            indicatorDots
                            autoplay
                        >
                            {
                                galleryList.map((pic, index) => {
                                    return (
                                        <SwiperItem key={'teacher_gallery_' + index}
                                            style={{ width: windowWidth + 'px', height: windowWidth + 'px' }}
                                        >
                                            <Image src={pic.fpath}
                                                className='swiper_item'
                                                style={{ width: windowWidth + 'px', height: windowWidth + 'px' }}
                                            />
                                        </SwiperItem>
                                    )

                                })
                            }
                        </Swiper>
                    </View>
                    <View className='goods_cons d_flex fd_c bg_white'>
                        <Text className='lg18_label black_label fw_label'>{goodsDesc.goodsName}</Text>
                        <Text className='default_label gray_label'>{goodsDesc.summary}</Text>
                        <View className='d_flex fd_r ai_ct mt_5'>
                            <View className='d_flex fd_r ai_ct '>
                                {
                                    goodsDesc.gtype == 1 ?
                                        <Text className='lg24_label red_label fw_label'>免费</Text>
                                        : goodsDesc.gtype == 3 ?
                                            <Text className='lg_label red_label fw_label'><Text className='lg24_label'>{goodsDesc.goodsIntegral}</Text>学分</Text>
                                            : goodsDesc.gtype == 2 ?
                                                <Text className='lg_label red_label fw_label'>¥<Text className='lg24_label'>{goodsAmountDTO.goodsAmount ? goodsAmountDTO.goodsAmount : goodsDesc.goodsAmount}</Text></Text>
                                                :
                                                <Text className='lg_label red_label fw_label'>¥<Text className='lg24_label'>{goodsDesc.goodsAmount}</Text>+<Text className='lg24_label'>{goodsDesc.goodsIntegral}</Text>学分</Text>
                                }

                            </View>
                            {
                                goodsDesc.goodsActivityDTO.activityId !== 0 ?
                                    <View>
                                        {/*  way 0 满减  1 满折 */}
                                        {
                                            goodsDesc.goodsActivityDTO.way === 0 ?
                                                <View className='count_tip'>
                                                    <Text className='smm_label red_label'>满{goodsDesc.goodsActivityDTO.condFir}减{goodsDesc.goodsActivityDTO.condSec}</Text>
                                                </View>
                                                :
                                                <View className='count_tip'>
                                                    <Text className='smm_label red_label'>满{goodsDesc.goodsActivityDTO.condFir}件{goodsDesc.goodsActivityDTO.condSec}折</Text>
                                                </View>
                                        }
                                    </View>
                                    : null}

                        </View>
                        {
                            goodsDesc.marketAmount ?
                                <View className='tip_label smm_label mark_price'>
                                    ¥{goodsDesc.marketAmount}
                                </View> : null
                        }
                        {/* <Text className='tip_label smm_label lh_label'>￥{goodsDesc.marketAmount}</Text> */}
                        <View className='d_flex fd_r ai_ct mt_15'>
                            <Text className='tip_label sm_label'>{goodsDesc.isFree == 1 ? '包邮' : '不包邮'}</Text>
                            <Text className='tip_label sm_label pl_20'>月销 <Text className='c33_label sm_label'>{goodsDesc.saleNum}</Text></Text>
                        </View>
                        {
                            goodsDesc.isFree == 1 ?
                                null
                                :
                                <View className='d_flex fd_r ai_ct mt_15'>
                                    {
                                        this.state.address.length>0?
                                        <Text className='tip_label sm_label'>预估邮费{this.state.freightAmount}元，提示：实际邮费将根据收货地址微调</Text>
                                        :
                                        <Text className='tip_label sm_label'>预估邮费7元，提示：实际邮费将根据收货地址微调</Text>
                                    }                                    
                                </View>
                        }

                    </View>

                    {
                        goodsDesc.goodsActivityDTO.activityId !== 0 ?
                            <View className='countBox'>
                                <Image src={asset.countIcon} className='countBox_icon' />
                                {/*  way 0 满减  1 满折 */}
                                {
                                    goodsDesc.goodsActivityDTO.way === 0 ?
                                        <Text className='tip_label sm_label'>促销: <Text className='c33_label sm_label'>满{goodsDesc.goodsActivityDTO.condFir}减{goodsDesc.goodsActivityDTO.condSec}</Text></Text>
                                        :
                                        <Text className='tip_label sm_label'>促销: <Text className='c33_label sm_label'>满{goodsDesc.goodsActivityDTO.condFir}件{goodsDesc.goodsActivityDTO.condSec}折</Text></Text>
                                }
                            </View>
                            : null}


                    <View className='d_flex fd_c bg_white desc '>
                        <View className='d_flex fd_r ai_ct pt_12'>
                            <View className='left_border'></View>
                            <Text className='black_label default_label fw_label'>商品详情</Text>
                        </View>
                        <View className='cons  bg_white pb_10 '>
                            <View className='words'>
                                <View className='p_15'>
                                    <GrapTmp content={goodsOne[0]} ></GrapTmp>
                                </View>
                                <View className='picture'>
                                    {
                                        goodsTwo.map((item) => {
                                            console.log(item)
                                            return (
                                                <GrapTmp content={item} ></GrapTmp>
                                            )
                                        })
                                    }
                                </View>
                                {
                                    goodsThree ?
                                        <View className='picture'>
                                            <Video
                                                className='picture'
                                                id='video'
                                                src={goodsThree.split('"></video>')[0]}
                                                initialTime='0'
                                                objectFit={'fill'}
                                                controls={true}
                                                autoplay={false}
                                                loop={false}
                                                muted={false}
                                            // onLoadedMetaData={this.videometa}
                                            // onError={this.videoErrorCallback}
                                            />

                                        </View>
                                        : null
                                }
                            </View>
                        </View>
                    </View>
                </View>


                {
                    stocks != 0 ?
                        <View className='mailbtn d_flex fd_r ai_ct'>
                            {/* <View className='services d_flex fd_c ai_ct'
                                // onClick={()=>Taro.navigateTo({url:menu.mailCart})}
                            >
                                <Image src={asset.kefu} className='kefuIcon' />
                                <Text className='gray_label sm_label'>客服</Text>
                            </View> */}

                            {
                                goodsDesc.gtype === 2 ?
                                    <View className='cart d_flex fd_c ai_ct'
                                        onClick={() => Taro.navigateTo({ url: menu.mailCart })}
                                    >
                                        <Image src={asset.cart} className='cartIcon' />
                                        <Text className='gray_label sm_label'>购物车</Text>
                                    </View>
                                    : null}

                            {
                                goodsDesc.gtype === 2 ?
                                    <View className='joinCart col_1 d_flex ai_ct jc_ct' onClick={this._toCart}>
                                        <Text className='default_label white_label'>加入购物车</Text>
                                    </View>
                                    : null}

                            <View className='buy col_1 d_flex ai_ct jc_ct' onClick={this._toBuy}>
                                <Text className='default_label white_label'>立即购买</Text>
                            </View>
                        </View>
                        :
                        <View className='salebtn'>
                            <Text className='gray_label default_label'>商品已售罄</Text>
                        </View>
                }

                <View className='layer' hidden={cartType}>
                    <View className='cartlayer' onClick={() => this.setState({ cartType: true })}></View>
                    <View className='cartBox '>
                        <View className='cartfull'></View>
                        <View className='cartBox_head'>
                            <Image src={goodsDesc.goodsImg} className='goodsCover' />
                            <View className='d_flex fd_r jc_sb cartBox_head_right'>
                                <View className='d_flex fd_c mt_10'>
                                    {
                                        goodsDesc.gtype == 1 ?
                                            <Text className='lg_label red_label fw_label'>免费</Text>
                                            : goodsDesc.gtype == 3 ?
                                                <Text className='lg_label red_label fw_label'>{goodsDesc.goodsIntegral}学分</Text>
                                                : goodsDesc.gtype == 2 ?
                                                    <Text className='lg_label red_label fw_label'>¥{goodsAmountDTO.goodsAmount ? goodsAmountDTO.goodsAmount : goodsDesc.goodsAmount}</Text>
                                                    :
                                                    <Text className='lg_label red_label fw_label'>¥{goodsDesc.goodsAmount}+{goodsDesc.goodsIntegral}学分</Text>
                                    }
                                    <Text className='gray_label sm_label mt_5'>请选择规格</Text>
                                </View>
                                <Image src={asset.dete_icon} className='dete_icon' onClick={() => this.setState({ cartType: true })} />
                            </View>
                        </View>
                        {
                            goodsAttr.map((attrs, index) => {
                                console.log(attrs,'???')
                                return (
                                    <View className='d_flex fd_c pl_20 pr_20 pt_15' key={'attrs' + index}>
                                        <Text className='default_label c33_label'>{attrs.name}</Text>
                                        <View className='type_boxs mt_15'>
                                            {
                                                attrs.goodsAttrMapList.map((attr, idx) => {
                                                    let on = parseInt(goodsAttrIds[attr.attrId]) === attr.goodsAttrId

                                                    return (
                                                        <View className={on ? 'type_box d_flex ai_ct jc_ct border_red mb_10' : 'type_box d_flex ai_ct jc_ct mb_10'} key={'attr' + idx} onClick={this._selectAttr.bind(this, attr, idx, index)}>
                                                            <Text className={on ? 'red_label sm_label' : 'gray_label sm_label'}>{attr.attrVal}</Text>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                )
                            })
                        }

                        <View className='pl_20 pr_20'>
                            <View className='countpay d_flex ai_ct jc_sb'>
                                <Text className='c33_label default_label'>数量选择</Text>
                                <View className='d_flex fd_r ai_ct count_cons'>
                                    <View className='count_minus' onClick={this._minus}>
                                        <Text className='default_label c33_label'>-</Text>
                                    </View>
                                    <Input
                                        className='count_count'
                                        type='number'
                                        value={goods_number}
                                        onInput={(e) => this.setState({ goods_number: e.detail.value })}
                                    />

                                    {/* <View className='count_count'>
                                        <Text className='default_label c33_label'>{goods_number}</Text>
                                    </View> */}
                                    <View className='count_add' onClick={this._add}>
                                        <Text className='default_label c33_label'>+</Text>
                                    </View>
                                </View>
                            </View>
                            <View className='mb_20'>
                                <View className='c33_label default_label mb_20'>
                                    库存:{stock}
                                </View>
                            </View>
                        </View>
                        <View className='makebtn' onClick={this._toOrder}>
                            <Text className='default_label white_label'>确定</Text>
                        </View>
                    </View>
                </View>
                <Auth ref={'auth'} success={() => {
                    this._onLoadCallBack()
                }} />
            </View >
        )
    }
}

export default mailDesc as ComponentClass