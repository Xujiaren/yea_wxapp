import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import menu from '../../../config/menu';
import asset from '../../../config/asset';
import inter from '../../../config/inter'
import api from '../../../services/api'
import { subNumTxt } from '../../../utils/common'

import '../../../config/theme.css';
import './buyCourse.less'



type PageState = {
    selectIntegral: boolean,
    courseId: number,
    coursename: string,
    courseImg: string,
    summary: string,
    integral: number,
    courseintegral: number,
    honer: string,
    teacherName: string,
    payType: number,
    courseType: number,
    yintegral: number,
    courseCash:number,
    cid:Array<number>,
    couponList:Array<{}>,
    couponId:number,
    amount:number,
    fromuser:number,
}

class buyCourse extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '购买课程'
    }
    timer: any;

    constructor() {
        super(...arguments)
        this.state = {
            courseId: 0,
            coursename: '',
            courseImg: '',
            summary: '',
            selectIntegral: false,
            integral: 0,
            courseintegral: 0,
            honer: '',
            teacherName: '',
            payType: 0,
            courseType: 0,
            yintegral: 0,
            courseCash:0,
            cid:[],
            couponList:[],
            couponId:0,
            amount:0,
            fromuser:0
        }
    }

    componentWillMount() {

        var that = this;
        const { courseId, coursename, courseImg, summary, courseintegral, teacherName, honer, payType, courseType ,courseCash,fromuser} = that.$router.params
        api.get(inter.CourseDesc+courseId).then(res=>{
            let list = res.data.data
            let cid = list.couponList.map(item=>item==item?item.couponId:null)
            console.log(cid,'???')
            that.setState({
                couponList:list.couponList,
                cid:cid
            })
        })
        if(fromuser){
            that.setState({
                fromuser:parseInt(fromuser)
            })
        }
        that.setState({
            courseId: parseInt(courseId),
            coursename: coursename,
            courseImg: courseImg,
            summary: summary,
            courseintegral: parseInt(courseintegral),
            courseCash:parseInt(courseCash),
            honer: honer,
            teacherName: teacherName,
            payType: parseInt(payType),
            courseType: courseType !== undefined ? parseInt(courseType) : 0
        })
    }

    componentDidMount() {
        var that = this

        that._getUser();
    }

    componentWillUnmount() {
        Taro.navigateBack({
            delta:2
        })
    }

    componentDidShow() { 
        let pages = Taro.getCurrentPages();
        let currPage = pages[pages.length - 1]; // 获取当前页面
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
                console.log(res)
                if (res.data.status) {
                    let userData = res.data.data
                    that.setState({
                        integral: userData.integral + userData.rintegral,
                        yintegral: userData.yintegral
                    })
                }
            })
    }


    _selectIntegral() {
        var that = this;

        const { selectIntegral } = that.state

        that.setState({
            selectIntegral: !selectIntegral
        })
    }



    _payOrder() {
        var that = this
        const { selectIntegral, integral,payType,yintegral,courseintegral, courseId, courseType,couponId ,couponList,fromuser,amount} = that.state
        let ucids = couponList.filter(item=>item.couponId==couponId)
        let ucid = 0
        if(ucids.length>0){
            ucid=ucids[0].ucId
        }
        if(payType==4){
            if (selectIntegral) {
                if (courseintegral < yintegral) {
                    api.post(inter.payCourse, {
                        from_uid: fromuser,
                        pay_type: 4,
                        course_id: courseId,
                        chapter_id: 0,
                        coupon_id: 0,
                    }).then((res) => {
                        if (res.data.status) {
                            api.post(inter.userHistory,{
                                etype:22,
                                ctype:7,
                                cctype:1,
                                content_id:courseId,
                            }).then(res=>{})
                            Taro.showToast({
                                title: '兑换成功',
                                icon:'none',
                                duration:1000
                            })
                            setTimeout(() => {
                                Taro.navigateBack({
                                    delta:1
                                })
                            }, 1000);
                        }
                    })
                } else {
                    Taro.showToast({
                        title: '积分不足',
                        icon: 'none',
                        duration: 1000,
                    })
                }
    
            } else {
                Taro.showToast({
                    title: '请选择积分',
                    icon: 'none',
                    duration: 1000,
                })
            }
        }
        if(payType==1){
            if (selectIntegral) {
                if (courseintegral-amount < integral) {
                    api.post(inter.payCourse, {
                        from_uid: fromuser,
                        pay_type: 3,
                        course_id: courseId,
                        chapter_id: 0,
                        uc_id: ucid,
                    }).then((res) => {
                        if (res.data.status) {
                            api.post(inter.userHistory,{
                                etype:22,
                                ctype:7,
                                cctype:1,
                                content_id:courseId,
                            }).then(res=>{})
                            Taro.showToast({
                                title: '购买成功'
                            })
                        }
                        Taro.redirectTo({
                            url: menu.ownCourse + '?courseType=' + courseType
                        })
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
        }
        if(payType==2){
            api.post(inter.payCourse, {
                from_uid: fromuser,
                pay_type: 9,
                course_id: courseId,
                chapter_id: 0,
                uc_id: ucid,
            }).then(res=>{
                console.log(res)
                if (res.data.status) {
                    let pay = res.data.data.pay_info;
                    let order = res.data.data.order_info;
                    let from_uid = res.data.data.from_uid;
                    Taro.requestPayment({
                        timeStamp: (pay.timeStamp).toString(),
                        nonceStr: pay.nonceStr,
                        package: pay.package,
                        signType: 'MD5',
                        paySign: pay.sign,
                        success: function (res) {
                            api.post('/order/check/orderPay',{
                                course_id:courseId,
                                order_id:order.orderId,
                                from_uid:from_uid,
                                pay_type:9,
                                payed:1
                            }).then(res=>{
                                if(res.data.status){
                                    api.post(inter.userHistory,{
                                        etype:22,
                                        ctype:7,
                                        cctype:1,
                                        content_id:courseId,
                                    }).then(res=>{})
                                    Taro.showToast({
                                        title: '支付成功',
        
                                        duration: 1000,
                                    })
                                    setTimeout(() => {
                                        Taro.navigateBack({
                                            delta:1
                                        })
                                    }, 1000);
                                }
                            })
                           
                        },
                        fail: function (res) {
                            api.post('/order/check/orderPay',{
                                course_id:courseId,
                                order_id:order.orderId,
                                from_uid:from_uid,
                                pay_type:9,
                                payed:0
                            }).then(res=>{
                                console.log(res)
                            })
                        }
                    })
                }
            })
        }
        if(payType==3){
            if (selectIntegral) {
                if (courseintegral < integral) {
                    api.post(inter.payCourse, {
                        from_uid: fromuser,
                        pay_type: 9,
                        course_id: courseId,
                        chapter_id: 0,
                        uc_id: ucid,
                    }).then(res=>{
                        console.log(res)
                        if (res.data.status) {
                            let pay = res.data.data.pay_info;
                            let order = res.data.data.order_info;
                            let from_uid = res.data.data.from_uid;
                            Taro.requestPayment({
                                timeStamp: (pay.timeStamp).toString(),
                                nonceStr: pay.nonceStr,
                                package: pay.package,
                                signType: 'MD5',
                                paySign: pay.sign,
                                success: function (res) {
                                    api.post('/order/check/orderPay',{
                                        course_id:courseId,
                                        order_id:order.orderId,
                                        from_uid:from_uid,
                                        pay_type:9,
                                        payed:1
                                    }).then(res=>{
                                        if(res.data.status){
                                            api.post(inter.payCourse, {
                                                from_uid: 0,
                                                pay_type: 3,
                                                course_id: courseId,
                                                chapter_id: 0,
                                                uc_id: 0,
                                            }).then((res) => {
                                                if (res.data.status) {
                                                    api.post(inter.userHistory,{
                                                        etype:22,
                                                        ctype:7,
                                                        cctype:1,
                                                        content_id:courseId,
                                                    }).then(res=>{})
                                                    Taro.showToast({
                                                        title: '支付成功',
                        
                                                        duration: 1000,
                                                    })
                                                    setTimeout(() => {
                                                        Taro.navigateBack({
                                                            delta:1
                                                        })
                                                    }, 1000);
                                                }
                                            })
                                           
                                        }
                                    })
                                   
                                },
                                fail: function (res) {
                                    api.post('/order/check/orderPay',{
                                        course_id:courseId,
                                        order_id:order.orderId,
                                        from_uid:from_uid,
                                        pay_type:9,
                                        payed:0
                                    }).then(res=>{
                                        console.log(res)
                                    })
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
    
            } else {
                Taro.showToast({
                    title: '请选择学分',
                    icon: 'none',
                    duration: 1000,
                })
            }
        }
    }

    onCourp=()=>{
        // let price = this.state.courseCash
        let price = this.state.courseintegral
        Taro.navigateTo({ 
            url:menu.userCoupon+'?type=2'+'&price='+price+'&coupons='+JSON.stringify(this.state.cid)
        })
    }


    render() {

        const { coursename, courseImg, summary, yintegral, selectIntegral, integral, honer, teacherName, payType, courseintegral,courseCash ,couponId,amount,couponList} = this.state

        return (
            <View className='wrap'>
                <View style={{ marginBottom: '120rpx' }}>
                    <View className='d_flex fd_c coursehead'>
                        <Text className='sm_label tip_label'>课程信息</Text>
                        <View className='d_flex fd_r course mt_10'>
                            <Image src={courseImg} className='courseCover' />
                            <View className='d_flex fd_c col_1'>
                                <Text className='lg_label c33_label fw_label'>{subNumTxt(coursename, 10)}</Text>
                                <Text className='sm_label tip_label'>{subNumTxt(summary, 12)}</Text>
                                <Text className='sm_label tip_label'>{teacherName}</Text>
                                {/* <View className='d_flex fd_r ai_ct'>
                                    <Text className='red_label sm_label'>¥<Text className='lg_label'>234</Text></Text>
                                    <Text className='sm_label tip_label' style={{paddingTop:'6rpx'}}>¥324</Text>
                                </View> */}
                                {
                                    payType == 4 ?
                                        <Text className='sm_label red_label fw_label mt_3'>{courseintegral}游学积分</Text>
                                        :payType == 1?
                                        <Text className='sm_label red_label fw_label mt_3'>{courseintegral}学分</Text>
                                        :payType == 2?
                                        <Text className='sm_label red_label fw_label mt_3'>¥{courseCash}</Text>
                                        :payType == 3?
                                        <Text className='sm_label red_label fw_label mt_3'>¥{courseCash}+{courseintegral}学分</Text>
                                        :null
                                }
                            </View>
                        </View>
                    </View>

                    {
                        payType == 4 ?
                            null
                            :
                            <View className='d_flex fd_r discount' onClick={this.onCourp}>
                                <Text className='c33_label default_label'>优惠券</Text>
                                <View className='d_flex fd_r ai_ct'>
                                    <View className='discount_box '>
                                        {
                                            couponList.length>0?
                                            <Text className='red_label sm_label'>{amount}学分</Text>
                                            :
                                            <Text className='red_label sm_label'>无可用优惠券</Text>
                                        }
                                       
                                    </View>
                                    <Image src={asset.arrow_right} className='arrow_right' />
                                </View>
                            </View>
                    }

                    {
                        payType==2||payType==3?
                         <View className='pircedesc'>
                         <Text className='c33_label_label default_label'>价格明细</Text>
                         <View className='d_flex fd_r jc_sb ai_ct mb_10 mt_10'>
                             <Text className='default_label c33_label'>课程总价：</Text>
                             <Text className='default_label c33_label'>￥{courseCash}</Text>
                         </View>
                         {/* <View className='d_flex fd_r jc_sb ai_ct mb_10'>
                             <Text className='default_label c33_label'>优惠券抵扣：</Text>
                             <Text className='default_label c33_label'>-￥0</Text>
                         </View> */}
                         <View className='d_flex fd_r money'>
                             <Text className='default_label c33_label'>支付金额：<Text className='red_label'>￥{courseCash-amount}</Text></Text>
                         </View>
                     </View>
                     :null
                    }
                   

                    {
                        payType == 4 ?
                            <View className='pl_20 pr_15 pt_12 pb_12 bg_white mb_10 mt_10 d_flex fd_r ai_ct jc_sb' onClick={this._selectIntegral}>
                                <Text className='default_label c33_label'>游学积分 {yintegral}</Text>
                                <Image src={selectIntegral ? asset.radio_full : asset.radio} className='radio' />
                            </View>
                            :payType==1||payType==3?
                            <View className='pl_20 pr_15 pt_12 pb_12 bg_white mb_10 mt_10 d_flex fd_r ai_ct jc_sb' onClick={this._selectIntegral}>
                                <Text className='default_label c33_label'>可用学分 {integral}</Text>
                                <Image src={selectIntegral ? asset.radio_full : asset.radio} className='radio' />
                            </View>
                            :null
                    }


                    {/* <View className='pl_20 pr_15 pt_12 pb_12 bg_white d_flex fd_r jc_sb border_bt'>
                        <View className='d_flex fd_r ai_ct '>
                            <Text className='default_label c33_label pl_10'>支付方式</Text>
                        </View>
                    </View>
                    <View className='pl_20 pr_15 pt_12 pb_12 bg_white d_flex fd_r jc_sb border_bt'>
                        <View className='d_flex fd_r ai_ct '>
                            <Image src={asset.ali_pay}  className='payIcon'/>
                            <Text className='default_label c33_label pl_10'>支付宝支付</Text>
                        </View>
                        <Image src={asset.radio} className='radio' />
                    </View>
                    <View className='pl_20 pr_15 pt_12 pb_12 bg_white d_flex fd_r jc_sb border_bt'>
                        <View className='d_flex fd_r ai_ct '>
                            <Image src={asset.wechat_pay}  className='payIcon'/>
                            <Text className='default_label c33_label pl_10'>微信支付</Text>
                        </View>
                        <Image src={asset.radio} className='radio' />
                    </View>
                    <View className='pl_20 pr_15 pt_12 pb_12 bg_white d_flex fd_r jc_sb border_bt'>
                        <View className='d_flex fd_r ai_ct '>
                            <Image src={asset.caedit_pay}  className='payIcon'/>
                            <Text className='default_label c33_label pl_10'>银行卡支付</Text>
                        </View>
                        <Image src={asset.radio} className='radio' />
                    </View>
                    */}
                    <View className='d_flex fd_r m_20'>
                        <View className='hot_tip mr_10'>
                            <Text className='red_label default_label'>!</Text>
                        </View>
                        <View className='d_flex fd_c col_1'>
                            <Text className='sm_label tip_label'>您将购买的商品为虚拟内容服务，不支持退订、转让以及退换，请慎重确认。</Text>
                            <Text className='sm_label tip_label'>购买后可在“我的·已购课程”中查看。</Text>
                        </View>
                    </View>
                </View>


                <View className='btms'>
                    <View className='btms_left'>
                        <Text className='default_label c33_label'>支付金额：</Text>
                        {/* <Text className='default_label red_label'>¥<Text className=' lg18_label'>234</Text></Text> */}
                        {
                            payType==4?
                            <Text className='sm_label red_label fw_label '>{courseintegral}积分</Text>
                            :payType==1?
                            <Text className='sm_label red_label fw_label '>{courseintegral-amount>=0?courseintegral-amount:'0'}学分</Text>
                            :payType==2?
                            <Text className='sm_label red_label fw_label '>¥{courseCash-amount>=0?courseCash-amount:'0'}</Text>
                            :payType==3?
                            <Text className='sm_label red_label fw_label '>¥{courseCash-amount}+{courseintegral}学分</Text>
                            :null
                        }
                    </View>

                    <View className='btms_btn' onClick={this._payOrder}>
                        {
                            payType==4?
                            <Text className='white_label default_label'>立即兑换</Text>
                            :
                            <Text className='white_label default_label'>立即支付</Text>
                        }
                    </View>
                </View>


            </View>
        )
    }
}

export default buyCourse as ComponentClass