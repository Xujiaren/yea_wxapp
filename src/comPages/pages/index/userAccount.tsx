import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Picker, Checkbox, Radio } from '@tarojs/components'

type PageState = {
    list: Array<{}>,
    status: number,
    tip: boolean,
    inteType: Array<string>,
    inteIdx: number,
    timeType: Array<string>,
    timeIdx: number,
    allType: Array<string>,
    allIdx: number,
    text: any,

    page: number,
    pages: number,


    userIngral: number,
    balance: number,
    rIntegral: number,
    yintegral: number,
    canbalance: number,
    teacher: boolean,
    iftext: string,
    on: boolean,
    tipp: number,
    again: number,
    agree: number
}

import Tabs from '../../../components/Tabs';

import asset from '../../../config/asset';
import menu from '../../../config/menu';

import inter from '../../../config/inter';
import api from '../../../services/api'

import '../../../config/theme.css';
import './userAccount.less';



class userAccount extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '我的账户',
        enablePullDownRefresh: true
    }
    timer: any;
    page: number;
    pages: number;

    constructor() {
        super(...arguments)

        this.page = 0;
        this.pages = 0;

        this.state = {
            list: [],
            status: 0, // 0金币账户 1现金账户 2游学积分
            tip: false,
            inteType: ['全部', '充值金币', '权益学分'],
            inteIdx: 0, // -1全部 0权益学分 1充值金币
            timeType: ['近一周', '近一月', '近三月', '近半年', '去年', '前年'],
            timeIdx: 0, // 0近一周 1近一月 2近三月 3近半年 4去年 5前年
            allType: ['收入', '支出'],
            allIdx: 0, // -1全部 0获取 1消耗
            text: [],

            page: 0,
            pages: 0,


            userIngral: 0, // 权益学分
            balance: 0, // 现金
            rIntegral: 0, // 充值金币
            yintegral: 0,
            canbalance: 0,
            teacher: false,
            iftext: '',
            on: false,
            tipp: 0,
            again: 0,
            agree: 0,
        }
    }

    componentWillMount() {
    }

    componentDidMount() {

        var that = this;
        that._getAccount();
        that._getUser();
        that.getText()
        let tipp = Taro.getStorageSync('tipp')
        if (tipp) {
            this.setState({
                tipp: parseInt(tipp)
            })
        }

    }
    getText = () => {
        // api.get(inter.Config)
        //     .then(res => {
        //         let list = res.data.data.teacher_fund_text.split(";")
        //         this.setState({
        //             text: list,
        //             iftext:res.data.data.teacher_fund_iftext
        //         })
        //     })
        api.get(inter.FundConfig, {
            keyy: 'fund_text',
            section: 'teacher'
        }).then(res => {
            if (res.data.status) {
                let val = res.data.data
                this.setState({
                    agree: val.agree,
                    again: val.again,
                    text: val.text,
                    iftext: val.agreeText
                })
            }
        })
    }
    componentWillUnmount() {

    }

    componentDidShow() {

        var that = this;
        that._getUser();

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
                        userIngral: userData.integral,
                        balance: userData.balance,
                        rIntegral: userData.rintegral,
                        yintegral: userData.yintegral,
                        canbalance: userData.canbalance,
                        teacher: userData.teacher,
                    })

                }
            })
    }

    _getAccount() {
        var that = this;
        const { status, inteIdx, allIdx, timeIdx, list } = that.state;

        let inte_type = - 1;
        if (inteIdx === 1) {
            inte_type = 1
        } else if (inteIdx === 2) {
            inte_type = 0
        }

        api.get(inter.AccountUser, {
            account_type: status,
            integral_type: inte_type,
            itype: allIdx,
            time_type: timeIdx,
            page: this.page,
        }).then((res) => {
            if (res.data.status) {

                let fLists = res.data.data;

                if (this.page === 0) {
                    var tList = fLists.items
                } else {
                    var tList: any = list.concat(fLists.items)
                }

                that.setState({
                    list: tList,
                    page: fLists.page,
                    pages: fLists.pages,
                })

            }
        })
    }


    _onSelect = (e) => {
        var that = this;

        this.page = 0;

        that.setState({
            status: e,
            page: 0,
        }, () => {
            that._getAccount();
        })
    }

    _witdit = () => {
        var that = this;
        const { tipp } = this.state
        if (tipp == 0) {
            that.setState({
                tip: true
            })
        } else {
            Taro.navigateTo({ url: menu.withdrawal })
        }
    }


    // 下拉
    onPullDownRefresh() {
        var self = this

        this.page = 0;

        self.setState({
            page: 0,
            list: []
        }, () => {
            self._getAccount();
        })

        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);

    }

    onReachBottom() {
        var self = this;

        let { page, pages } = this.state

        if (page < pages) {
            this.page = this.page + 1
            self._getAccount();
        }
    }
    _onClose() {
        const { on, agree } = this.state
        var that = this
        if (agree == 1) {
            if (on) {
                let time = new Date().getTime().toString()
                time=time.slice(0,time.length-3)
                api.post(inter.userHistory,{
                    etype:116,
                    ctype:0,
                    cctype:1,
                    content_id:parseInt(time)
                })
                Taro.setStorageSync('tipp', 1)
                that.setState({
                    tip: false,
                    tipp: 1,
                }, () => {
                    Taro.navigateTo({ url: menu.withdrawal })
                })
            } else {
                Taro.showToast({
                    title: '请同意后点击',
                    icon: 'none',
                    duration: 1500,
                })
            }
        } else {
            Taro.setStorageSync('tipp', 1)
            that.setState({
                tip: false,
                tipp: 1,
            }, () => {
                Taro.navigateTo({ url: menu.withdrawal })
            })
        }


    }
    onOpen = () => {
        const { on, agree } = this.state
        if (agree == 1) {
            if (on) {
                let time = new Date().getTime().toString()
                time=time.slice(0,time.length-3)
                api.post(inter.userHistory,{
                    etype:116,
                    ctype:0,
                    cctype:0,
                    content_id:parseInt(time)
                })
                this.setState({ tip: false },
                    () => Taro.navigateTo({ url: menu.withdrawal }))
            } else {
                this.setState({ tip: false })
            }
        } else {
            this.setState({ tip: false },
                () => Taro.navigateTo({ url: menu.withdrawal }))
        }
    }
    onChanges = (e) => {
        this.setState({ inteIdx: parseInt(e.detail.value) }, () => {
            this._getAccount()
        })
    }
    render() {

        const { list, status, tip, text, inteType, inteIdx, timeIdx, timeType, allIdx, allType, userIngral, balance, rIntegral, yintegral, canbalance, teacher, iftext, on, agree, again } = this.state

        return (
            <View className='wrap'>

                <View className='head'>
                    <View className='atabs'>
                        {/* <Tabs items={['金币账户', '现金账单', '游学福利']} atype={1} selected={status} onSelect={this._onSelect} /> */}
                        {/* <Tabs items={['金币账户', '现金账单']} atype={1} selected={status} onSelect={this._onSelect} /> */}
                    </View>
                    {
                        status === 0 ?
                            <View className='cons'>
                                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/c571cda0-e8ce-459a-9125-4fa8ff7b6c8f.png'} className='gold_icon' />
                                <View className='act_box'>
                                    <View className='sct_box_top'>
                                        <View className='d_flex fd_c'>
                                            <Text className='sm_label white_label fe_label'>学分总额</Text>
                                            <Text className='white_label fw_label' style={{ fontSize: 64 + 'rpx' }}>{rIntegral + userIngral}</Text>
                                        </View>
                                        {/* <View className='sct_box_btn' onClick={() => Taro.navigateTo({ url: menu.Recharge })}>
                                            <Text className='default_label gray_label'>充值</Text>
                                        </View> */}
                                    </View>
                                    <View className='sct_box_btm'>
                                        {/* <View className='d_flex fd_c'>
                                            <Text className='sm_label white_label'>充值金币</Text>
                                            <Text className='white_label fw_label' style={{ fontSize: 64 + 'rpx' }}>{rIntegral}</Text>
                                        </View> */}
                                        <View className='d_flex fd_c'
                                        //  style={{ marginLeft: 140 + 'rpx' }}
                                         >
                                            <Text className='sm_label white_label'>权益学分</Text>
                                            <Text className='white_label fw_label' style={{ fontSize: 64 + 'rpx' }}>{userIngral}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            : null}
                    {
                        status === 1 ?
                            <View className='card_box'>
                                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/34a9ee3a-9843-41b8-9507-e59bd3995c3c.png'} className='card_icon_c' />
                                <View className='icon_cbox mt_5'>
                                    <Text className='default_label white_label fw_label' style={{ paddingLeft: 70 + 'rpx', paddingRight: 70 + 'rpx' }}>可提现金额</Text>
                                    <View className='default_label d_flex fd_r ai_ct jc_sb' style={{ paddingLeft: 70 + 'rpx', paddingRight: 70 + 'rpx' }}>
                                        <View>
                                            <Text className='white_label' style={{ fontSize: 48 + 'rpx' }}>¥<Text className='white_label' style={{ fontSize: 64 + 'rpx' }}>{canbalance}</Text></Text>
                                        </View>
                                        {
                                            teacher ?
                                                <View className='sct_box_btn' onClick={this._witdit}>
                                                    <Text className='gray_label default_label'>提现</Text>
                                                </View>
                                                : null
                                        }
                                    </View>
                                </View>
                            </View>
                            : null}

                    {
                        status === 2 ?
                            <View className='card_box'>
                                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/34a9ee3a-9843-41b8-9507-e59bd3995c3c.png'} className='card_icon_c' />
                                <View className='icon_cbox mt_5'>
                                    <Text className='default_label white_label fw_label' style={{ paddingLeft: 70 + 'rpx', paddingRight: 70 + 'rpx' }}>游学福利值</Text>
                                    <View className='default_label d_flex fd_r ai_ct' style={{ paddingLeft: 70 + 'rpx', paddingRight: 70 + 'rpx' }}>
                                        <Text className='white_label' style={{ fontSize: 64 + 'rpx' }}>{yintegral}</Text>
                                        <Text className='white_label sm_label ml_10 mt_15'>(有效期至12月31日)</Text>
                                    </View>
                                </View>
                            </View>
                            : null}


                    <View className='sect_box'>

                        {
                            status === 0 ?
                                <View className='d_flex fd_r ai_ct'>
                                    {/* <Picker mode='selector' value={inteIdx} range={inteType} onChange={this.onChanges}>
                                        <Text className='sm_label gray_label pr_5'>{inteType[inteIdx]}</Text>
                                    </Picker>
                                    <Image src={asset.btm_actgle} className='act_icon' /> */}
                                </View>
                                : null}

                        <View className='d_flex fd_r ai_ct'>
                            <View className='d_flex fd_r ai_ct'>
                                <Picker mode='selector' value={timeIdx} range={timeType} onChange={(e) => this.setState({ timeIdx: e.detail.value }, () => {
                                    this._getAccount()
                                })}>
                                    <Text className='sm_label gray_label pr_5'>{timeType[timeIdx]}</Text>
                                </Picker>
                                <Image src={asset.btm_actgle} className='act_icon' />
                            </View>
                            <View className='d_flex fd_r ai_ct pl_20'>
                                <Picker mode='selector' value={allIdx} range={allType} onChange={(e) => this.setState({ allIdx: e.detail.value }, () => {
                                    this._getAccount()
                                })}>
                                    <Text className='sm_label gray_label pr_5'>{allType[allIdx]}</Text>
                                </Picker>
                                <Image src={asset.btm_actgle} className='act_icon' />
                            </View>
                        </View>
                    </View>

                </View>



                <View className='list' style={status === 0 ? { marginTop: 590 + 'rpx' } : { marginTop: 470 + 'rpx' }}>
                    {
                        list.map((item: any, index) => {
                            return (
                                <View key={'item' + index} className='d_flex fd_r jc_sb pt_15 pb_15 pl_20 pr_20'>
                                    <View className='d_flex fd_c col_1'>
                                        <Text className='c33_label default_label '>{item.contentName}</Text>
                                        <Text className='c33_label sm_label'>{item.pubTimeFt}</Text>
                                    </View>
                                    {
                                        status == 0 ?
                                            <Text className='sm_label' style={{ color: '#FFA349' }}>{allIdx == 0 ? '+' : '-'}{item.integral}学分</Text>
                                            : null}
                                    {
                                        status == 1 ?
                                            <Text className='sm_label' style={{ color: '#FFA349' }}>{allIdx == 0 ? '+' : '-'}¥{item.amount}</Text>
                                            : null}
                                    {
                                        status == 2 ?
                                            <Text className='sm_label' style={{ color: '#FFA349' }}>{allIdx == 0 ? '+' : '-'}{item.integral}游学积分</Text>
                                            : null}
                                </View>
                            )
                        })
                    }
                </View>


                <View>
                    {
                        tip ?
                            <View className='layer'>
                                <View className='commt_layer pt_12  '>
                                    <View className='d_flex fd_c mb_15 pl_20 pr_20'>
                                        <View className='d_flex ai_ct jc_ct'>
                                            <Text className='lg18_label pt_10 black_label'>准入提示</Text>
                                        </View>

                                    </View>
                                    <View className='pl'>
                                        <Text className='default_label pt_10 c33_label'>{text}</Text>
                                    </View>
                                    
                                    {
                                        agree == 1 ?
                                            <View className='checked'>
                                                <Radio checked={on} onClick={() => {
                                                    if (!on) { this.setState({ on: true }) } else {
                                                        this.setState({ on: false })
                                                    }
                                                }} />
                                                {/* <View className='oks'></View> */}
                                                <Text onClick={() => {
                                                    if (!on) { this.setState({ on: true }) } else {
                                                        this.setState({ on: false })
                                                    }
                                                }} >{iftext}</Text>
                                            </View>
                                            : null
                                    }

                                    <View className='layer_btns pl_20 pr_20 d_flex jc_sb ai_ct mt_30' >
                                        {
                                            again == 1 ?
                                                <View className='layer_btn d_flex jc_ct ai_ct' onClick={this._onClose.bind(this)}>
                                                    <Text className='lg_label c33_label'>不再提示</Text>
                                                </View>
                                                :
                                                <View className='layer_btn d_flex jc_ct ai_ct'>
                                                    <Text className='lg_label tip_label'>不再提示</Text>
                                                </View>
                                        }
                                        <View className='layer_btn d_flex d_flex jc_ct ai_ct' onClick={this.onOpen}>
                                            <Text className='lg_label c33_label'>关闭</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            : null}
                </View>
            </View>
        )
    }

}

export default userAccount as ComponentClass