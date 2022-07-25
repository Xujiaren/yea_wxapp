import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import inter from '../../../config/inter'
import api from '../../../services/api'

import { percent2percent25 } from '../../../utils/common'

import menu from '../../../config/menu';

import '../../../config/theme.css';
import './generalList.less'

type PageState = {
    generaList: Array<{}>,
    page: number,
    pages: number,
    total: number,
    exchange_type: number,
    ctype: number,
    dtype: number,
    title: string,
    teachers: any,
    teacher: boolean,
    level:number,
    sortOrder:number,
}





class generalList extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '限时抢购列表',
        enablePullDownRefresh: true
    }
    page: number
    pages: number

    constructor() {
        super(...arguments)

        this.page = 0;
        this.pages = 0;

        this.state = {
            generaList: [],
            page: 0,
            pages: 0,
            total: 0,
            exchange_type: 0,
            ctype: 0,
            dtype: 0,
            title: '',
            teachers: {},
            teacher: true,
            level:0,
            sortOrder:0,
        }
    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillMount() {

        const { title, exchange_type, ctype, dtype } = this.$router.params
        this.setState({ title: title })
        Taro.setNavigationBarTitle({
            title: title,

        })

        this.setState({
            exchange_type: parseInt(exchange_type),
            ctype: parseInt(ctype),
            dtype: parseInt(dtype),
        })
    }

    componentDidMount() {
        var that = this
        that._getgeneraList()
        that.getUser()
    }

    componentWillUnmount() {

    }

    componentDidShow() { }
    componentDidHide() { }


    _getgeneraList() {
        var that = this;
        const { exchange_type, ctype, page, generaList,sortOrder } = that.state
        let ex_type: any = ''
        let c_type: any = ''

        if (exchange_type !== 9) {
            ex_type = exchange_type
        }

        if (ctype !== 9) {
            c_type = ctype
        }

        api.get(inter.shopExchange, {
            exchange_type: ex_type,
            ctype: c_type,
            page: this.page,
            sortOrder:sortOrder,
        }).then((res) => {
            if (res.data.status) {
                let genList = res.data.data
                if (this.page === 0) {
                    var tList = genList.items
                } else {
                    var tList: any = generaList.concat(genList.items)
                }

                that.setState({
                    generaList: tList,
                    page: genList.page,
                    pages: genList.pages,
                    total: genList.total
                })
            }
        })
    }

    _goodsDesc(cates) {
        const{title,level}=this.state
        api.post(inter.inuserLogs,{
            logType:3,
            type:3,
            content_id:cates.goodsId,
            from:1
        }).then(res=>{})
        // if(title=='会员专享'){
        //     if(level>=cates.ulevel){
                Taro.navigateTo({
                    url: menu.mailDesc + "?goods_id=" + cates.goodsId + "&goodsName=" + percent2percent25(cates.goodsName)
                })
            // }else{
        //         Taro.showToast({
        //             title:'很抱歉，您的等级未达标',
        //             icon: 'none',
        //             duration: 1500
        //         })
        //     }
        // }else{
        //     Taro.navigateTo({
        //         url: menu.mailDesc + "?goods_id=" + cates.goodsId + "&goodsName=" + percent2percent25(cates.goodsName)
        //     })
        // }
        
    }
    _goodsDescs(cates) {
        const { teachers, teacher } = this.state
        api.post(inter.inuserLogs,{
            logType:3,
            type:3,
            content_id:cates.goodsId,
            from:1
        }).then(res=>{})
        // if (teacher) {
        //     if (teachers.level + 1 >= cates.tlevel) {
                Taro.navigateTo({
                    url: menu.mailDesc + "?goods_id=" + cates.goodsId + "&goodsName=" + percent2percent25(cates.goodsName)
                })
        //     } else {
        //         Taro.showToast({
        //             title: '抱歉，您的等级未达标',
        //             icon: 'none',
        //             duration: 1500
        //         })
        //     }
        // } else {
        //     Taro.showToast({
        //         title: '抱歉，您不是讲师',
        //         icon: 'none',
        //         duration: 1500
        //     })
        // }

    }
    // 下拉
    onPullDownRefresh() {
        var self = this
        this.page = 0;

        self.setState({
            page: 0,
            generaList: []
        }, () => {
            self._getgeneraList()
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }
    getUser() {
        var that = this
        api.get(inter.User)
            .then((res) => {
                console.log(res.data.data)
                if (res) {
                    this.setState({
                        level:res.data.data.level,
                        teachers: res.data.data.teacherDTO,
                        teacher: res.data.data.teacher,
                    })
                }
            })
    }

    //上拉
    onReachBottom() {
        var self = this;

        const { page, pages, } = self.state

        if (page < pages) {
            this.page = this.page + 1

            self._getgeneraList()
        }
    }

    render() {
        const { ctype, generaList, dtype, teachers,sortOrder } = this.state

        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {

        }


        return (
            <View className='wrap'>
                <View className='tops'>
                    <View onClick={()=>{
                        this.setState({
                            sortOrder:0
                        },()=>{
                            this._getgeneraList()
                        })
                    }}>
                        <View className='tipe'>最新</View>
                        <View className='tipe'>
                            {
                                sortOrder==0?
                                <View className='ude'></View>
                                :
                                <View></View>
                            }
                        </View>
                    </View>
                    <View onClick={()=>{
                        this.setState({
                            sortOrder:1
                        },()=>{
                            this._getgeneraList()
                        })
                    }}>
                        <View className='tipes'>最热</View>
                        <View className='tipe'>
                        {
                                sortOrder==1?
                                <View className='ude'></View>
                                :
                                <View></View>
                            }
                        </View>
                    </View>
                </View>
                <View>
                    {
                        this.state.title == '讲师专享' ?
                            <View className='recommBox pl_15 pr_15'>
                                {
                                    generaList.map((item: any, index) => {
                                        return (
                                            <View key={'cates' + index} className='rcomItem'
                                                style={{ width: ((windowWidth - 46) / 2).toFixed(0) + 'px' }}
                                                onClick={this._goodsDesc.bind(this, item)}
                                            >
                                                <Image
                                                    className='catesCover'
                                                    src={item.goodsImg}
                                                    mode='aspectFit'
                                                    style={{ width: ((windowWidth - 46) / 2).toFixed(0) + 'px', height: ((windowWidth - 46) / 2).toFixed(0) + 'px' }}
                                                />
                                                <View className='pl_10 pr_10 d_flex fd_c'>
                                                    <Text className='c33_label default_label mt_5 dup_per_txt'>{item.goodsName}</Text>
                                                    {/* <View className='d_flex fd_r jc_sb mt_15'>
                                                    <Text className='sred_label default_label fw_label'>{item.goodsIntegral}学分</Text>
                                                    <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                                </View> */}
                                                    {
                                                        item.gtype == 1 ?
                                                            <View className='d_flex fd_r jc_sb mt_15'>
                                                                <Text className='sred_label default_label fw_label'>{item.goodsIntegral}免费</Text>
                                                                <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                                            </View>
                                                            : item.gtype == 2 ?
                                                                <View className='d_flex fd_r jc_sb mt_15'>
                                                                    <Text className='sred_label default_label fw_label'>¥{item.goodsAmountDTO.goodsAmount?item.goodsAmountDTO.goodsAmount:item.goodsAmount}</Text>
                                                                    <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                                                </View>
                                                                : item.gtype == 3 ?
                                                                    <View className='d_flex fd_r jc_sb mt_15'>
                                                                        <Text className='sred_label default_label fw_label'>{item.goodsIntegral}学分</Text>
                                                                        <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                                                    </View>
                                                                    : item.gtype == 4 ?
                                                                        <View className='d_flex fd_r jc_sb mt_15'>
                                                                            <Text className='sred_label default_label fw_label'>¥{item.goodsAmount}+{item.goodsIntegral}学分</Text>
                                                                            <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                                                        </View>
                                                                        : null
                                                    }
                                                </View>
                                                {/* <View className='tips'>
                                                <Text className='smm_label white_label'>限时抢购</Text>
                                            </View> */}
                                                {
                                                    this.state.title == '讲师专享' ?
                                                        <View className='lect_tips'>
                                                            <Text className='smm_label white_label'>{item.tlevel == 1 ? '讲师' : item.tlevel == 2 ? '初级' : item.tlevel == 3 ? '中级' : item.tlevel == 4 ? '高级' : null}</Text>
                                                        </View>
                                                        :
                                                        <View className='vip_tips'>
                                                            <Text className='smm_label c33_label'>Lv.{item.ulevel}</Text>
                                                        </View>
                                                }

                                            </View>
                                        )

                                    })
                                }
                            </View>
                            :
                            <View className='recommBox pl_15 pr_15'>
                                {
                                    generaList.map((item: any, index) => {
                                        return (
                                            <View key={'cates' + index} className='rcomItem'
                                                style={{ width: ((windowWidth - 46) / 2).toFixed(0) + 'px' }}
                                                onClick={this._goodsDesc.bind(this, item)}
                                            >
                                                <Image
                                                    className='catesCover'
                                                    src={item.goodsImg}
                                                    mode='aspectFit'
                                                    style={{ width: ((windowWidth - 46) / 2).toFixed(0) + 'px', height: ((windowWidth - 46) / 2).toFixed(0) + 'px' }}
                                                />
                                                <View className='pl_10 pr_10 d_flex fd_c'>
                                                    <Text className='c33_label default_label mt_5 dup_per_txt'>{item.goodsName}</Text>
                                                    {/* <View className='d_flex fd_r jc_sb mt_15'>
                                                <Text className='sred_label default_label fw_label'>{item.goodsIntegral}学分学分</Text>
                                                <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                            </View> */}
                                                    {
                                                        item.gtype == 1 ?
                                                            <View className='d_flex fd_r jc_sb mt_15'>
                                                                <Text className='sred_label default_label fw_label'>{item.goodsIntegral}免费</Text>
                                                                <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                                            </View>
                                                            : item.gtype == 2 ?
                                                                <View className='d_flex fd_r jc_sb mt_15'>
                                                                    <Text className='sred_label default_label fw_label'>¥{item.goodsAmountDTO.goodsAmount?item.goodsAmountDTO.goodsAmount:item.goodsAmount}</Text>
                                                                    <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                                                </View>
                                                                : item.gtype == 3 ?
                                                                    <View className='d_flex fd_r jc_sb mt_15'>
                                                                        <Text className='sred_label default_label fw_label'>{item.goodsIntegral}学分</Text>
                                                                        <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                                                    </View>
                                                                    : item.gtype == 4 ?
                                                                        <View className='d_flex fd_r jc_sb mt_15'>
                                                                            <Text className='sred_label default_label fw_label'>¥{item.goodsAmount}+{item.goodsIntegral}学分</Text>
                                                                            <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                                                        </View>
                                                                        : null
                                                    }
                                                </View>
                                                {/* <View className='tips'>
                                            <Text className='smm_label white_label'>限时抢购</Text>
                                        </View> */}
                                                {
                                                    this.state.title == '讲师专享' ?
                                                        <View className='lect_tips'>
                                                            <Text className='smm_label white_label'>{item.tlevel == 1 ? '讲师' : item.tlevel == 2 ? '初级' : item.tlevel == 3 ? '中级' : item.tlevel == 4 ? '高级' : null}</Text>
                                                        </View>
                                                        :
                                                        <View className='vip_tips'>
                                                            <Text className='smm_label c33_label'>Lv.{item.ulevel}</Text>
                                                        </View>
                                                }

                                            </View>
                                        )
                                    })
                                }
                            </View>
                    }

                </View>
            </View>
        )
    }
}

export default generalList as ComponentClass