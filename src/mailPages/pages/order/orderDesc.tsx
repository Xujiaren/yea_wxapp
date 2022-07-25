import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { View, Input ,Text,Image,Textarea,Picker} from '@tarojs/components'

import {getExactTime,percent2percent25} from '../../../utils/common'

import  '../../../config/theme.css';
import './orderDesc.less'
import menu from '../../../config/menu';
import asset from '../../config/asset'


import { connect } from '@tarojs/redux'
import { mailType } from '../../../constants/mailType'
import inter from '../../../config/inter'
import api from '../../../services/api'

import {
    getOrderDesc,
} from '../../../actions/mail'


type PageStateProps = {
    mail: mailType,
    getOrderDesc:Array<{}>
}

type PageDispatchProps = {
    getOrderDesc:(object) => any,
}

type PageOwnProps = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface orderDesc {
    props: IProps;
}

type PageState = {
    load:boolean,
    navHeight:number,//刘海高度
    capHeight:number,//胶囊高度
    refundType:boolean,
    saleType:boolean,
    afterType:boolean,
    invoiceType:boolean,
    content:string,
    order_id:number,
    orderDesc:{
        orderId:number,
        otype:number,
        orderSn:string,
        userId:number,
        goodsAmount:number,
        orderAmount:number,
        shippingAmount:number,
        couponAmount:number,
        integralAmount:number,
        payStatus:number,
        orderStatus:number,
        shippingStatus:number,
        isDigital:number,
        realname:string,
        mobile:string,
        province:string,
        city:string,
        district:string,
        street:string,
        address:string,
        goodsWeight:number,
        shippingId:number,
        shippingSn:string,
        remark:string,
        activityId:number,
        status:number,
        payTime:number,
        payTimeFt:null,
        invoiceUrl:string,
        orderGoods:Array<{
            recId:number,
            orderId:number,
            userId:number,
            goodsId:number,
            goodsName:string,
            goodsAttr:string,
            attrId:string,
            goodsImg:string,
            goodsNum:number,
            integralAmount:number,
            marketAmount:number,
            goodsAmount:number,
            goodsWeight:number,
            warehouseId:number,
            isComment:number,
            activityId:number,
            ctype:number,
        }>
    },
    orderGoods:Array<any>,
    realname:string,
    mobile:string,
    province:string,
    city:string,
    district:string,
    address:string,
    integralAmount:number,
    orderStatus:number,
    shippingStatus:number,
    payStatus:number,
    orderSn:string,
    payTime:string,
    shippingTime:string,
    shippingName:string,
    shippingSn:string,


    afterTypeId:number,
    afterTypeList:Array<{}>,
    afterReason:Array<string>,
    afterReasons:Array<string>,
    afterReasonIndex:number,
    afterExplain:string,
    afterImgs:Array<string>,

    orderReturnList:Array<{
        adminStatus:number,
        etype:number,
        reason:number,
        returnId:number,
        status:number
    }>,

    saleTypeShopName:string,
    saleTypeShopNumber:string,

    invoiceIdx:number,

    invoice_rise:string, // 抬头
    invoice_mobile:string, // 手机号
    invoice_email:string, // 邮箱
    invoice_unit:string, // 单位全称
    invoice_code:string,// 纳税人识别码

    otype:number,

    orderAmount:number,
    shippingAmount:number,
    invoiceUrl:string,
    backAddress:string,
    backPhone:string,
    backName:string,
}

@connect(({ mail }) => ({
    mail:mail
  }), (dispatch) => ({
    getOrderDesc(object){
        dispatch(getOrderDesc(object))
    },
}))

class orderDesc extends Component<{}, PageState> {

    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTitleText: '订单详情',
        enablePullDownRefresh: true,
        navigationStyle:"custom"
    }

    constructor () {
        super(...arguments)
        this.state = {
            load:false,
            navHeight:44,//刘海高度
            capHeight:20,//胶囊高度
            refundType:true,
            saleType:true,
            afterType:true,

            content:'',
            order_id:0,
            orderDesc:{},
            orderGoods:[],
            realname:'',
            mobile:'',
            province:'',
            city:'',
            district:'',
            address:'',
            integralAmount:0,
            orderStatus:0,
            shippingStatus:0,
            payStatus:0,
            orderSn:"",
            payTime:"",
            shippingTime:'',
            shippingName:"",
            shippingSn:"",

            afterTypeId:0,
            afterTypeList:[{text:'我要退款（无需退货）',afterTypeId:25},{text:'我要退货退款',afterTypeId:26},{text:'换货',afterTypeId:27}],
            afterReason: ['空包裹', '商品瑕疵', '质量问题', '漏发/错发', '收到商品时有划痕或破损', '包装/商品污渍/变形'],
            afterReasons: ['商品瑕疵', '质量问题', '漏发/错发', '收到商品时有划痕或破损', '包装/商品污渍/变形'],
            afterReasonIndex:0,
            afterExplain:'' ,// 退换货原因 
            afterImgs:[] , // 上传凭证

            orderReturnList:[],

            saleTypeShopName:'',
            saleTypeShopNumber:"",

            invoiceIdx:0,  // 0 个人 普通发票 1 企业 普通发票
            invoiceType:true, // 显示不显示
            invoice_rise:'', // 抬头
            invoice_mobile:'', // 手机号
            invoice_email:'', // 邮箱
            invoice_unit:'', // 单位全称
            invoice_code:'',// 纳税人识别码

            otype:0, // 2 金钱 3  学分

            orderAmount:0,
            shippingAmount:0,
            invoiceUrl:'',
            backAddress:'',
            backPhone:'',
            backName:'',
        }

        this._setbatHeight = this._setbatHeight.bind(this);
        this._onInvoice = this._onInvoice.bind(this);
    }


    componentWillReceiveProps (nextProps) {

        const {mail} = nextProps
        const { orderDesc } = mail

        if(mail !== this.props.mail){
            this.setState({
                load:true,
                orderDesc:orderDesc,
                orderGoods:orderDesc.orderGoods,
                realname:orderDesc.realname,
                mobile:orderDesc.mobile,
                province:orderDesc.province,
                city:orderDesc.city,
                district:orderDesc.district,
                address:orderDesc.address,
                integralAmount:orderDesc.integralAmount,
                orderStatus:orderDesc.orderStatus,
                shippingStatus:orderDesc.shippingStatus,
                payStatus:orderDesc.payStatus,
                payTime:orderDesc.payTime,
                shippingTime:orderDesc.shippingTime,
                orderSn:orderDesc.orderSn,
                shippingName:orderDesc.shippingName,
                shippingSn:orderDesc.shippingSn,
                orderReturnList:orderDesc.orderReturnList,
                otype:orderDesc.otype,
                orderAmount:orderDesc.orderAmount,
                shippingAmount:orderDesc.shippingAmount,
                invoiceUrl:orderDesc.invoiceUrl,
            })
        }
    }


    componentWillMount () { 
        var that = this
        that._setbatHeight();

        const { orderId } = that.$router.params

        that.setState({
            order_id:parseInt(orderId)
        })
 
    }

    componentDidMount () {
        var that = this ;

        that._getGoodsDesc();
        that.backAdress()
    }

    componentWillUnmount () {

    }

    componentDidShow () { }

    componentDidHide () { }


    _getGoodsDesc(){
        
        var that = this
        const {order_id} = that.state
        
        that.props.getOrderDesc({
            order_id
        })
        
    }
    backAdress=()=>{
        api.get('/shop/goods/return/address')
        .then(res=>{
            if(res.data.status){
                this.setState({
                    backAddress:res.data.data.address,
                    backPhone:res.data.data.phone,
                    backName:res.data.data.name
                })
            }
        })
    }
    _setbatHeight(){
        var that = this
        var sysinfo =  Taro.getSystemInfoSync()
        var navHeight:number = 44
        var cpHeight:number = 40
        var isiOS = sysinfo.system.indexOf('iOS') > -1
        if (!isiOS) {
            cpHeight = 48
            navHeight = sysinfo.statusBarHeight;
        } else {
            cpHeight = 40
            navHeight = sysinfo.statusBarHeight;
        }

        that.setState({
            navHeight: navHeight,
            capHeight: cpHeight
        })
    }

    _onCopy(sn){
        Taro.setClipboardData({
            data: sn,
        }).then((res)=>{
            console.log(res);
        })
    }




    _onRate = e =>{
        var that = this
        that.setState({ 
            afterReasonIndex:e.detail.value
        })
    }


    // 售后方式
    _slectAfterType(aft){
        var that = this 
        that.setState({
            afterTypeId:aft.afterTypeId
        })
    }


    _checkLog(){

    }


    _onDetele(index){
        var that = this
        const {afterImgs} = that.state
        afterImgs.splice(index,1)

        that.setState({
            afterImgs:afterImgs
        })
    }

    //选择照片或者拍照
    _onChangeImg = () => {
        var that = this;
        const {afterImgs} = that.state

        Taro.chooseImage({
            count:3,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success:function(res){
                
                for(let i = 0 ; i < res.tempFilePaths.length ; i++){
                    Taro.getFileSystemManager().readFile({
                        filePath: res.tempFilePaths[i], // 选择图片返回的相对路径
                        encoding: 'base64', // 编码格式
                        success: res => { // 成功的回调
                            api.post(inter.UploadSite,{
                                file:'data:image/png;base64,' + res.data,
                            }).then(res=>{
                                if(res.data.status){
                                    afterImgs.push(res.data.data)
                                    that.setState({
                                        afterImgs:afterImgs
                                    })
                                }
                            })
                        },
                        fail: msg => {
                        }
                    })
                }
                
            },
            fail:function(errmsg){

            }
        })
    }

    onViewImgs(afterImgs,index){
        let urls:string[] = new Array() ;
        for(let i = 0 ; i < afterImgs.length; i++){
            urls.push(afterImgs[i])
        }
        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: urls[index], // 当前显示图片的http链接，默认是第一个
        }).then(res=>{
            // console.log(res)
        })
    }



    //  售后提交
    _onAfterSubmit(){
        var that = this ;
        const {afterTypeId,afterTypeList,afterReason,afterReasonIndex,afterExplain,afterImgs,orderGoods,orderDesc} = that.state

        api.post(inter.orderReturn + orderDesc.orderId + '/' + orderGoods[0].goodsId ,{
            etype:afterTypeId,
            reason:afterReason[afterReasonIndex] + afterExplain,
            picString:afterImgs.join(",")
        }).then((res)=>{
            if(res.data.status){
                Taro.showToast({
                    title:'提交成功',
                    icon:'none'
                })

                that.setState({
                    afterType:true,
                    afterImgs:[]
                },()=>{
                    that._getGoodsDesc();
                })
            }
        })
    }


    // 寄出
    _saleType(){
        var that = this
        const {} = that
        that.setState({
            saleType:false
        })
    }


    // 寄出地址
    _onsaleTypeSunmit(){
        var that = this ;
        const {saleTypeShopName,saleTypeShopNumber,orderReturnList} = that.state
        api.post(inter.orderReturnShip + orderReturnList[0].returnId ,{
            ship_name:saleTypeShopName,
            ship_sn:saleTypeShopNumber
        }).then((res)=>{
            if(res.data.status){
                Taro.showToast({
                    title:'提交成功',
                    icon:'none'
                })

                that.setState({
                    saleType:true
                },()=>{
                    that._getGoodsDesc();
                })
            }
        })

    }


    //取消退货
    _orderCancle(){
        var that = this ;
        const {orderGoods,orderDesc,orderReturnList} = that.state

        api.post(inter.orderReturn + orderDesc.orderId + '/' + orderGoods[0].goodsId ,{
            etype:orderReturnList[0].etype,
            reason:orderReturnList[0].reason,
            action:'cancel',
            picString:'2132423'
        }).then((res)=>{
            if(res.data.status){
                Taro.showToast({
                    title:'提交成功',
                    icon:'none'
                })

                that.setState({
                    afterType:true
                },()=>{
                    that._getGoodsDesc();
                })
            }
        })
    }


    // 再次申请
    _refundType(){
        var that = this 

        that.setState({
            refundType:false
        })
    }

    // 再次申请
    _onRefundType(){
        var that = this ;
        const {orderGoods,orderDesc,orderReturnList,content,afterImgs} = that.state

        api.post(inter.orderReturn + orderDesc.orderId + '/' + orderGoods[0].goodsId ,{
            etype:orderReturnList[0].etype,
            reason:content,
            action:'apply',
            picString:afterImgs.join(",")
        }).then((res)=>{
            if(res.data.status){
                Taro.showToast({
                    title:'提交成功',
                    icon:'none'
                })

                that.setState({
                    afterType:true
                },()=>{
                    that._getGoodsDesc();
                })
            }
        })
    }

    // 确认收货

    _orderConfirm(){
        var that = this ;
        const {order_id} = that.state
        api.post(inter.orderConfirm,{
            order_id:order_id
        }).then((res)=>{
            if(res.data.status){
                Taro.showToast({
                    title:'确认成功',
                    icon:'none',
                    duration:1000
                })
            }
        })
    }

    _orderCancel(){
        var that = this 
        const {order_id} = that.state

        api.post(inter.orderCancel,{
            order_id:order_id
        }).then((res)=>{
            if(res.data.status){
                Taro.showToast({
                    title:'取消成功',
                    icon:'none',
                    duration:1000
                })
                that._getGoodsDesc();
            }
        })
    }


    // 下拉
    onPullDownRefresh(){
        var self = this

        self._getGoodsDesc();
        setTimeout(function () {
            //执行ajax请求后停止下拉
            Taro.stopPullDownRefresh();
        }, 1000);
    }

    // 申请发票
    _onInvoice(){
        var that = this ;
        const {order_id,invoiceIdx,invoice_rise,invoice_mobile,invoice_email,invoice_code,invoice_unit} = that.state;

        let isPush = true;
        let tip = ''; // 弹窗提示
        var pattern = /0?(13|14|15|17|18)[0-9]{9}/; // 手机号
        var szReg=/^([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; // 判断邮箱
        // orderInvoice
        if(invoiceIdx === 0){

            if(invoice_rise === ''){
                isPush = false,
                tip = '请填写发票抬头'
            } else if(!pattern.test(invoice_mobile)){
                isPush = false
                tip = '请填写正确的手机号'
            } else if(!szReg.test(invoice_email)){
                isPush = false
                tip = '请填写正确的邮箱'
            }

            if(isPush){
                api.post(inter.orderInvoice,{
                    order_id:order_id,
                    invoice_name:invoice_rise,
                    mobile:invoice_mobile,
                    email:invoice_email,
                }).then((res)=>{
                    if(res.data.status){

                        Taro.showToast({
                            title:'稍后发送到你的邮箱中',
                            icon:'none',
                            duration:1000,
                        })
                        that.setState({
                            invoiceType:true
                        })
                    }else{
                        Taro.showToast({
                            title:res.data.message,
                            icon:'none',
                            duration:2000,
                        })
                        that.setState({
                            invoiceType:true
                        })
                    }
                })

            } else {

                Taro.showToast({
                    title:tip,
                    icon:'none',
                    duration:2000,
                })
            }

        } else {

            if(invoice_unit === ''){
                isPush = false,
                tip = '请填写单位全称'
            } else if(invoice_code === ''){
                isPush = false,
                tip = '请填写纳税人识别号'
            } else if(!pattern.test(invoice_mobile)){
                isPush = false
                tip = '请填写正确的手机号'
            } else if(!szReg.test(invoice_email)){
                isPush = false
                tip = '请填写正确的邮箱'
            }

            if(isPush){

                api.post(inter.orderInvoice,{
                    order_id:order_id,
                    invoice_name:invoice_unit,
                    invoice_sn:invoice_code,
                    mobile:invoice_mobile,
                    email:invoice_email,
                }).then((res)=>{
                    if(res.data.status){

                        Taro.showToast({
                            title:'稍后发送到你的邮箱中',
                            icon:'none',
                            duration:1000,
                        })
                        that.setState({
                            invoiceType:true
                        })
                    }else{
                        Taro.showToast({
                            title:res.data.message,
                            icon:'none',
                            duration:2000,
                        })
                        that.setState({
                            invoiceType:true
                        })
                    }
                })


            } else {

                Taro.showToast({
                    title:tip,
                    icon:'none',
                    duration:2000,
                })
            }

        }
    }
    onOrder=()=>{
        const{orderAmount,orderSn}=this.state
        Taro.navigateTo({
            url: menu.orderPay + '?orderAmount=' + orderAmount + '&orderSn=' + orderSn
        })
    }
    render () {

        if (!this.state.load) return null;

        const {orderDesc,navHeight,capHeight,refundType,content,saleType,afterType,invoiceType,orderGoods,realname,mobile,province,city,district,address,integralAmount,
            orderStatus,shippingStatus,payStatus,payTime,shippingTime,orderSn,shippingName,shippingSn,afterTypeId,afterTypeList,afterReason,afterReasonIndex,afterExplain,afterImgs,orderReturnList,saleTypeShopName,saleTypeShopNumber,invoiceIdx,invoice_rise,invoice_mobile,invoice_email,invoice_code,invoice_unit,otype,orderAmount,shippingAmount,invoiceUrl,backAddress,backName,backPhone} = this.state


        let odr_val = '' 
        let odr_tips = ''
        let odr_status = 100 

        if(orderStatus === 0 ){
            if(payStatus === 0){
                odr_val = '待付款'
                odr_status = 0
            } else  if(payStatus === 1){
                if(shippingStatus === 0){
                    odr_val = '待发货'
                    odr_status = 1
                } else if(shippingStatus === 1){
                    odr_val = '待收货'
                    odr_status = 2
                } else if(shippingStatus === 2){
                    odr_val = '已收货'
                    odr_status = 3
                }
            }
        } else if(orderStatus === 1) {
            odr_val = '已取消'
            odr_status = 7
        } else if (orderStatus === 2){
                if(orderReturnList.length > 0){
                    
                    if(orderReturnList.length > 0){
                        if(orderReturnList[0].status === 0){
                            if(orderReturnList[0].adminStatus === 0){
                                odr_val = '待处理'
                                odr_status = 4
                            } else if(orderReturnList[0].adminStatus === 1){
                                odr_val = '退款中'
                                odr_status = 5
                            } else {
                                odr_val = '拒绝'
                                odr_status = 6
                            }
                        } else if(orderReturnList[0].status === 1){
                            odr_val = '订单关闭'
                            odr_status = 14
                        }
                    }
                }
                
        } else if(orderStatus === 3){
            if(orderReturnList.length > 0){
                if(orderReturnList[0].status === 0){
                    if(orderReturnList[0].adminStatus === 0){
                        odr_val = '待处理'
                        odr_status = 8
                    } else if(orderReturnList[0].adminStatus === 1){
                        odr_val = '处理中'
                        odr_status = 9
                    } else {
                        odr_val = '拒绝'
                        odr_status = 10
                    }
                } else if(orderReturnList[0].status === 1){
                    odr_val = '订单关闭'
                    odr_status = 14
                }
                
            }
        } else if(orderStatus === 4){
            if(orderReturnList.length > 0){
                if(orderReturnList[0].status === 0){
                    if(orderReturnList[0].adminStatus === 0){
                        odr_val = '待处理'
                        odr_status = 11
                    } else if(orderReturnList[0].adminStatus === 1){
                        odr_val = '处理中'
                        odr_status = 12
                    } else {
                        odr_val = '拒绝'
                        odr_status = 13
                    }
                } else if(orderReturnList[0].status === 1) {
                    odr_val = '订单关闭'
                    odr_status = 14
                }
            }
        }

       
        // console.log(orderDesc,'orderDesc')


        return (

            <View className='realwrap'>
                <Image src={asset.order_head}  className='order_head' />
                <View className='realHead'>
                    <View className='orderHead d_flex fd_c ai_ct'>
                        <View className='d_flex fd_c orderHeadTit'>
                            <View style={{height:navHeight+'px',width:'100%'}}></View>
                            <View style={{height:capHeight+'px',width:'100%'}} className='d_flex jc_sb ai_ct'>
                                <Image src={asset.left_arrow} style={{width:'32rpx',height:'36rpx'}} 
                                    onClick={()=>Taro.navigateBack()}
                                />
                                <Text className='lg18_label white_label'>订单详情</Text>
                                <Image src={''} style={{width:'32rpx',height:'36rpx'}} />
                            </View>
                        </View>
                        <View className='orderStatus'>
                            <Text className='lg20_label white_label fw_label' style={{marginLeft:'80rpx'}}>{odr_val}</Text>
                            {
                                odr_status === 4  || odr_status === 8 || odr_status === 11 ?
                                <View className='orderH_tip d_flex fd_r ai_ct jc_ct'>
                                    <Text className='smm_label white_label'>{'请等待处理'}</Text>
                                </View>
                            :null}
                            {
                                odr_status === 5 || odr_status === 9 || odr_status === 12 ?
                                <View className='orderH_tip d_flex fd_r ai_ct jc_ct'>
                                    <Text className='smm_label white_label'>{'审核已通过'}</Text>
                                </View>
                            :null}
                            {
                                odr_status === 6 || odr_status === 10 || odr_status === 13 ?
                                <View className='orderH_tip d_flex fd_r ai_ct jc_ct'>
                                    <Text className='smm_label white_label'>{'审核未通过'}</Text>
                                </View>
                            :null}
                        </View>
                    </View>


                    <View className='order_ads d_flex fd_r ai_ct'>
                        <Image src={asset.location} className='ads_img' />
                        <View className='d_flex fd_c ml_15'>
                            <Text className='c33_label default_label'>{realname + " " + mobile}</Text>
                            <Text className='gray_label sm_label'>{province}{city}{district}{address}</Text>
                        </View>
                    </View>


                    <View className='mt_10 bg_white'>
                        <View className='itemLists pl_15 pr_15' >
                            {
                                orderGoods && orderGoods.map((odr,index)=>{
                                    return(
                                        <View className='itemList d_flex pt_15 pb_10 ' key={'item' + index}
                                            onClick={()=>Taro.navigateTo({url:menu.mailDesc  + "?goods_id=" + odr.goodsId + "&goodsName=" + percent2percent25(odr.goodsName)})}
                                        >
                                            <Image src={odr.goodsImg} className='itemCover' />
                                            <View className='d_flex fd_c jc_sb col_1'>
                                                <View className='d_flex fd_r jc_sb'>
                                                    <Text className='c33_label default_label fw_label'>{odr.goodsName}</Text>
                                                    {
                                                        otype === 2 ?
                                                        <Text className='sm_label c33_label'>¥{odr.goodsAmount}</Text>
                                                    :null}
                                                    {
                                                        otype === 3 ?
                                                        <Text className='sm_label c33_label'>{odr.integralAmount}学分</Text>
                                                    :null}
                                                    
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
                        <View className='d_flex  fd_r order_bt ai_ct'>
                            <Text className='c33_label default_label pr_10'>邮费：¥{shippingAmount}</Text>
                            <Text className='sm_label tip_label'>合计：</Text>
                            {
                                otype === 2 ?
                                <Text className='sred_label default_label'>¥{orderAmount}</Text>
                            :null}

                            {
                                otype === 3 ?
                                <Text className='sred_label default_label'>{integralAmount}学分</Text>
                            :null}
                        </View>
                    </View>
                    
{/*                     
                    {
                        odr_status === 0 || odr_status === 1 ? */}
                        <View className='mt_10 d_flex fd_c'>
                            <View className='pt_12 pb_12 bg_white mb_1'>
                                <Text className='tip_label sm_label pl_15'>订单号:{orderSn}</Text>
                            </View>
                            <View className='pt_12 pb_12 bg_white'>
                                <Text className='tip_label sm_label pl_15'>下单时间: {getExactTime(parseInt(payTime))}</Text>
                            </View>
                        </View>
                    {/* :null} */}


                    {
                        odr_status === 2 ?
                        <View className="d_flex fd_c">
                            <View className='order_log d_flex fd_r jc_sb border_bt'>
                                <View className='order_cons'>
                                    <View className='d_flex fd_r ai_ct'>
                                        <View className='order_left'></View>
                                        <Text className='fw_label default_label black_label ml_10'>物流信息</Text>
                                    </View>
                                    <Text className='gray_label sm_label'>{shippingName}：{shippingSn}</Text>
                                </View>
                                <View className='order_copy d_flex ai_ct jc_ct' onClick={this._onCopy.bind(this,shippingSn)}>
                                    <Text className='default_label c33_label'>复制</Text>
                                </View>
                            </View>
                            <View className='pt_12 pb_12 bg_white border_bt'>
                                <Text className='tip_label sm_label pl_15'>下单时间: {getExactTime(parseInt(payTime))}</Text>
                            </View>
                            <View className='pt_12 pb_12 bg_white'>
                                <Text className='tip_label sm_label pl_15'>发货时间: {getExactTime(parseInt(shippingTime))}</Text>
                            </View>
                        </View>
                        
                    :null}

                    {
                        orderReturnList[0].reason.length > 0 ?
                        <View className='p_20'>
                            <Text className='default_label c33_label '>原因：{orderReturnList[0].reason}</Text>
                        </View>
                    :null}
                     {
                        orderReturnList[0].adminReason.length > 0 ?
                        <View className='pl_20 pr_20'>
                            <Text className='default_label c33_label '>拒绝理由：{orderReturnList[0].adminReason}</Text>
                        </View>
                    :null}
                    

                    

                    {
                        odr_status === 9  || odr_status === 12 ?
                        <View className='make_btn d_flex fd_r ai_ct jc_ct' onClick={this._saleType}>
                            <Text className='default_label white_label'>我已寄出（填写物流号）</Text>
                        </View>
                    :null}

                    {
                        odr_status === 6 || odr_status === 10 ?
                        <View className='make_btn d_flex fd_r ai_ct jc_ct' onClick={this._refundType}>
                            <Text className='default_label white_label'>修改申请</Text>
                        </View>
                    :null}

                    {
                        odr_status === 4  || odr_status === 5 || odr_status === 6 ?
                        <View className='make_btnm d_flex fd_r ai_ct jc_ct' onClick={this._orderCancle}>
                            <Text className='default_label sred_label'>取消退款</Text>
                        </View>
                    :null}

                    {
                        odr_status === 8  || odr_status === 9 || odr_status === 10 ?
                        <View className='make_btnm d_flex fd_r ai_ct jc_ct' onClick={this._orderCancle}>
                            <Text className='default_label sred_label'>取消退货/退款</Text>
                        </View>
                    :null}

                    {
                        odr_status === 11  || odr_status === 12 || odr_status === 13 ?
                        <View className='make_btnm d_flex fd_r ai_ct jc_ct' onClick={this._orderCancle}>
                            <Text className='default_label sred_label'>取消换货</Text>
                        </View>
                    :null}
                    
                    

                    
                </View>


                <View className='order_btm  '>
 
                    {/* {
                        odr_status === 0  ||  odr_status === 1  ?
                        <View className='order_btm_btn d_flex ai_ct jc_ct mr_10' onClick={this._orderCancel}>
                            <Text className='default_label c33_label'>取消订单</Text>
                        </View>
                    :null} */}

                    {
                        odr_status === 0 ? 
                        <View className='order_btm_btn d_flex ai_ct jc_ct' onClick={this.onOrder}>
                            <Text className='default_label sred_label'>去付款</Text>
                        </View>
                    :null}


                    {
                        odr_status === 1 || odr_status === 2 ?
                        <View className='order_btm_btn d_flex ai_ct jc_ct mr_10' onClick={()=> this.setState({afterType:false})}>
                            <Text className='default_label c33_label'>申请售后</Text>
                        </View>
                    :null}

                    
                    {
                        odr_status === 2 ?
                        <View className='order_btm_btn d_flex ai_ct jc_ct mr_10'  onClick={this._orderConfirm}>
                            <Text className='default_label sred_label'>确认收货</Text>
                        </View>
                    :null}

                    {
                        orderAmount!=0&&orderStatus === 0 && shippingStatus === 2  &&  invoiceUrl === '' ? 
                        <View className='order_btm_btn  ai_ct jc_ct mr_10' onClick={()=>this.setState({invoiceType:false})}>
                            <Text className='default_label sred_label'>申请发票</Text>
                        </View>
                    :null}

                    {
                        orderStatus === 0 && shippingStatus === 2  &&  invoiceUrl !== '' ? 
                        <View className='order_btm_btn  ai_ct jc_ct mr_10' >
                            <Text className='default_label sred_label'>发票已开</Text>
                        </View>
                    :null}

                </View>



                <View className='logistics' hidden={refundType}>
                    <View className='loglayer'></View>
                    <View className='log_cons'>
                        <View className='log_head'>
                            <View className='d_flex fd_r ai_ct jc_sb'>
                                <View className='d_flex fd_r ai_ct'>
                                    <View className='headBorder'></View>
                                    <Text className='c33_label default_label pl_10'>退款金额</Text>
                                </View>
                                <Text className='default_label red_label'>{integralAmount}学分</Text>
                            </View>
                            <View className='d_flex fd_r ai_ct jc_fe'>
                                <Text className='tip_label sm_label'>不可修改，最多{integralAmount}学分</Text>
                            </View>

                            <View className='d_flex fd_r ai_ct mt_25'>
                                <View className='headBorder'></View>
                                <Text className='c33_label default_label pl_10'>退款说明</Text>
                            </View>
                            <Textarea 
                                placeholder='请详细描述你的问题' 
                                className='from_atext p_15 mt_15 default_label' 
                                value={content}
                                onInput={(e:any) : void =>this.setState({content:e.detail.value})}
                            />


                            <View className = 'd_flex fd_r '>
                                {
                                    afterImgs.map((img,index)=>{
                                        return(
                                            <View className='mt_25 mr_10 log_pic' onClick={this.onViewImgs.bind(this,afterImgs,index)} key={'img'+index}>
                                                <Image  src={img} className='uppic_img' />
                                                <View onClick={this._onDetele.bind(this,index)} >
                                                    <Image src={asset.i_dete} className="commt_tip" />
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                                {
                                    afterImgs.length < 3  ?
                                    <View className='mt_25 log_pic'>
                                        <Image  src={asset.uppic} className='uppic' onClick={this._onChangeImg}/>
                                        <Text className='sm_label tip_label'>上传凭证</Text>
                                    </View>
                                :null}
                            </View>


                        </View>
                        <View className='log_btn'>
                            <View className='log_btn_l col_1' onClick={()=>this.setState({refundType:true})}>
                                <Text className='lg18_label tip_label'>关闭</Text>
                            </View>
                            <View className='col_1 log_btn_r' onClick={this._onRefundType}>
                                <Text className='lg18_label red_label'>提交</Text>
                            </View>
                        </View>
                    </View>
                </View>
                


                <View className='logistics' hidden={saleType}>
                    <View className='loglayer'></View>
                    <View className='log_cons'>
                        <View className='log_head'>
                            <View className='d_flex fd_r ai_ct'>
                                <View className='headBorder'></View>
                                <Text className='c33_label default_label pl_10'>寄回地址</Text>
                            </View>
                            <View className='d_flex fd_c pl_10 mt_15 mb_20'>
                                <Text className='gray_label sm_label'>{backAddress}</Text>
                                <Text className='gray_label sm_label mt_5'>电话：{backPhone}</Text>
                                <Text className='gray_label sm_label mt_5'>收件人：{backName}</Text>
                            </View>
                            <View className='d_flex fd_r ai_ct'>
                                <View className='headBorder'></View>
                                <Text className='c33_label default_label pl_10'>退货物流</Text>
                            </View>
                            <View className='log_input'>
                                <Input 
                                    type='text'
                                    placeholder='请输入快递'
                                    className='pl_15'
                                    value={saleTypeShopName}
                                    onInput={(e):void=>this.setState({saleTypeShopName:e.detail.value})} 
                                />
                            </View>
                            <View className='log_input'>
                                <Input 
                                    type='text'
                                    placeholder='请输入快递号'
                                    className='pl_15'
                                    value={saleTypeShopNumber}
                                    onInput={(e):void=>this.setState({saleTypeShopNumber:e.detail.value})} 
                                />
                            </View>
                        </View>
                        <View className='log_btn'>
                            <View className='log_btn_l col_1' onClick={()=>this.setState({saleType:true})}>
                                <Text className='lg18_label tip_label'>关闭</Text>
                            </View>
                            <View className='col_1 log_btn_r' onClick={this._onsaleTypeSunmit}>
                                <Text className='lg18_label red_label'>提交</Text>
                            </View>
                        </View>
                    </View>
                </View>


                <View className='afteristics' hidden={afterType}>
                    <View className='loglayer'></View>
                    <View className='log_cons'>
                        <View className='log_head'>
                            <View className='d_flex fd_r ai_ct'>
                                <View className='headBorder'></View>
                                <Text className='c33_label default_label pl_10'>售后类型</Text>
                            </View>

                            <View className='d_flex fd_c '>
                                {
                                    afterTypeList.map((aft:any,index)=>{

                                        let on = afterTypeId === aft.afterTypeId 
                                        return(
                                            <View className='d_flex fd_r ai_ct pt_10 pb_10' key={'aft' + index}
                                                onClick={this._slectAfterType.bind(this,aft)}
                                            >
                                                <Image src={on ?  asset.radio_full : asset.radio} className='radio' />
                                                <Text className= {on ? 'red_label default_label pl_10' : 'gray_label default_label pl_10'} >{aft.text}</Text>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            
                            {
                                afterTypeId === 27 ? 
                                null:
                                <View>
                                    <View className='log_input mt_25'>
                                        <Picker  
                                            className='col_1'
                                            mode='selector' 
                                            range={afterReason} onChange={this._onRate}
                                        >
                                            <Text className='smm_label c33_label pl_15'>{afterReason[afterReasonIndex]}</Text>
                                        </Picker>
                                        <Image src={asset.down_arrow } className='down_arrow' />
                                    </View>
                                    <View className='d_flex fd_r ai_ct jc_sb mt_30'>
                                        <View className='d_flex fd_r ai_ct'>
                                            <View className='headBorder'></View>
                                            <Text className='c33_label default_label pl_10'>退款金额</Text>
                                        </View>
                                        <Text className='default_label red_label'>{integralAmount}学分</Text>
                                    </View>
                                    <View className='d_flex fd_r ai_ct jc_fe'>
                                        <Text className='tip_label sm_label'>不可修改，最多{integralAmount}学分</Text>
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
                                    onInput={(e):void=>this.setState({afterExplain:e.detail.value})} 
                                />
                            </View>

                            <View className = 'd_flex fd_r '>
                                {
                                    afterImgs.map((img,index)=>{
                                        return(
                                            <View className='mt_25 mr_10 log_pic' onClick={this.onViewImgs.bind(this,afterImgs,index)} key={'img'+index}>
                                                <Image  src={img} className='uppic_img' />
                                                <View onClick={this._onDetele.bind(this,index)} >
                                                    <Image src={asset.i_dete} className="commt_tip" />
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                                {
                                    afterImgs.length < 3  ?
                                    <View className='mt_25 log_pic'>
                                        <Image  src={asset.uppic} className='uppic' onClick={this._onChangeImg}/>
                                        <Text className='sm_label tip_label'>上传凭证</Text>
                                    </View>
                                :null}
                            </View>

                        </View>
                        <View className='log_btn'>
                            <View className='log_btn_l col_1' onClick={()=>this.setState({afterType:true,afterImgs:[]})}>
                                <Text className='lg18_label tip_label'>关闭</Text>
                            </View>
                            <View className='col_1 log_btn_r' onClick={this._onAfterSubmit}>
                                <Text className='lg18_label red_label'>提交</Text>
                            </View>
                        </View>
                    </View>
                </View>



                <View className='afteristics' hidden={invoiceType}>
                    <View className='loglayer'></View>
                    <View className='log_cons'>
                        <View className='log_head'>
                            <View className='d_flex fd_r ai_ct'>
                                <View className='headBorder'></View>
                                <Text className='c33_label default_label pl_10'>发票类型</Text>
                            </View>

                            <View className='d_flex fd_c '>
                                {
                                    ['个人普通电子发票','企业普通电子发票'].map((aft,index)=>{

                                        let on = invoiceIdx === index ;

                                        return(
                                            <View className='d_flex fd_r ai_ct pt_10 pb_10' key={ 'aft' + index} onClick={()=>this.setState({invoiceIdx:index})}>
                                                <Image src={ on ?  asset.radio_full : asset.radio} className='radio' />
                                                <Text className='gray_label default_label pl_5' >{aft}</Text>
                                            </View>
                                        )
                                    })
                                }
                            </View>

                            <View className='d_flex fd_r ai_ct mt_10'>
                                <View className='headBorder'></View>
                                <Text className='c33_label default_label pl_10'>信息填写</Text>
                            </View>

                            <View className='fd_c mt_10'>
                                {
                                    invoiceIdx === 0 ?
                                    <View>
                                        <View className='log_input'>
                                            <Input 
                                                type='text'
                                                placeholder='发票抬头'
                                                className='pl_15 col_1'
                                                value={invoice_rise}
                                                onInput={(e):void=>this.setState({invoice_rise:e.detail.value})} 
                                            />
                                        </View>
                                        <View className='log_input'>
                                            <Input 
                                                type='text'
                                                placeholder='收件人手机'
                                                className='pl_15 col_1'
                                                value={invoice_mobile}
                                                onInput={(e):void=>this.setState({invoice_mobile:e.detail.value})} 
                                            />
                                        </View>
                                        <View className='log_input'>
                                            <Input 
                                                type='text'
                                                placeholder='邮箱'
                                                className='pl_15 col_1'
                                                value={invoice_email}
                                                onInput={(e):void=>this.setState({invoice_email:e.detail.value})} 
                                            />
                                        </View>
                                    </View>
                                    :
                                    <View>
                                        <View className='log_input'>
                                            <Input 
                                                type='text'
                                                placeholder='单位全称'
                                                className='pl_15 col_1'
                                                value={invoice_unit}
                                                onInput={(e):void=>this.setState({invoice_unit:e.detail.value})} 
                                            />
                                        </View>
                                        <View className='log_input'>
                                            <Input 
                                                type='text'
                                                placeholder='纳税人识别码'
                                                className='pl_15 col_1'
                                                value={invoice_code}
                                                onInput={(e):void=>this.setState({invoice_code:e.detail.value})} 
                                            />
                                        </View>
                                        <View className='log_input'>
                                            <Input 
                                                type='text'
                                                placeholder='手机'
                                                className='pl_15 col_1'
                                                value={invoice_mobile}
                                                onInput={(e):void=>this.setState({invoice_mobile:e.detail.value})} 
                                            />
                                        </View>
                                        <View className='log_input'>
                                            <Input 
                                                type='text'
                                                placeholder='邮箱'
                                                className='pl_15 col_1'
                                                value={invoice_email}
                                                onInput={(e):void=>this.setState({invoice_email:e.detail.value})} 
                                            />
                                        </View>
                                    </View>
                                }
                                
                                
                            </View>
                            
                        </View>
                        <View className='log_btn'>
                            <View className='log_btn_l col_1' onClick={()=>this.setState({invoiceType:true})}>
                                <Text className='lg18_label tip_label'>关闭</Text>
                            </View>
                            <View className='col_1 log_btn_r' onClick={this._onInvoice}>
                                <Text className='lg18_label red_label'>提交</Text>
                            </View>
                        </View>
                    </View>
                </View>



            </View>
        )
    }
}


export default orderDesc as ComponentClass