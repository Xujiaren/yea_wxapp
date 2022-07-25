import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import inter from '../../../config/inter'
import api from '../../../services/api'
import { percent2percent25 } from '../../../utils/common'
import asset from '../../config/asset'

import menu from '../../../config/menu';

import '../../../config/theme.css';
import './mailList.less'

type PageState = {
    status: number,
    sort: number,
    tabs: Array<string>,
    goods: Array<any>,
    page: number,
    pages: number,
    total: number,
    keyword: string,
    cateId: number,
    time_limit: number,
}

class mailList extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '',
        enablePullDownRefresh: true
    }
    page: number
    pages: number

    constructor() {
        super(...arguments)

        this.page = 0;
        this.pages = 0;

        this.state = {
            status: 0,
            sort: 0,
            tabs: ['最新', '销量'],
            goods: [], // 课程列表
            page: 0,
            pages: 0,
            total: 0,
            keyword: '',
            cateId: 0,
            time_limit: 0,
        }
    }

    componentWillMount() {
        const { keyword, cateId, time_limit } = this.$router.params

        Taro.setNavigationBarTitle({
            title: keyword,
        })



        this.setState({
            keyword: keyword,
            cateId: parseInt(cateId),
            time_limit: parseInt(time_limit)
        })
    }

    componentDidMount() {
        var that = this;

        that._cateList();
    }

    componentWillUnmount() {
    }

    componentDidShow() { }
    componentDidHide() { }

    _cateList() {
        var that = this;
        const { cateId, page, status, goods, time_limit } = that.state

        if (time_limit === 1) {
            api.get(inter.shopSearch, {
                category_id: '',
                ccategory_id: '',
                keyword: '',
                time_limit: time_limit,
                gtype: 0,
                sortOrder: status,
                page: this.page,
            }).then(res => {
                if (res.data.status) {
                    let goodsList = res.data.data

                    if (this.page === 0) {
                        var tList = goodsList.items
                    } else {
                        var tList: any = goods.concat(goodsList.items)
                    }

                    that.setState({
                        goods: tList,
                        page: goodsList.page,
                        pages: goodsList.pages,
                        total: goodsList.total
                    })
                }
            })
        } else {
            api.get(inter.shopSearch, {
                category_id: cateId,
                ccategory_id: '',
                keyword: '',
                time_limit: time_limit,
                gtype: 0,
                sortOrder: status,
                page: this.page,
            }).then(res => {
                if (res.data.status) {
                    let goodsList = res.data.data

                    if (this.page === 0) {
                        var tList = goodsList.items
                    } else {
                        var tList: any = goods.concat(goodsList.items)
                    }

                    that.setState({
                        goods: tList,
                        page: goodsList.page,
                        pages: goodsList.pages,
                        total: goodsList.total
                    })
                }
            })
        }

    }

    _onSelect(index) {
        var that = this;

        that.setState({
            status: index,
            page: 0
        }, () => {
            that._cateList();
        })
    }

    _onModel() {
        var that = this
        const { sort } = that.state
        this.setState({
            sort: sort == 0 ? 1 : 0,
        })
    }

    _goodsDesc(cates) {
        api.post(inter.inuserLogs,{
            logType:3,
            type:3,
            content_id:cates.goodsId,
            from:1
        }).then(res=>{})
        Taro.navigateTo({
            url: menu.mailDesc + "?goods_id=" + cates.goodsId + "&goodsName=" + percent2percent25(cates.goodsName)
        })
    }


    // 下拉
    onPullDownRefresh() {
        var self = this
        this.page = 0;

        self.setState({
            page: 0,
            goods: []
        }, () => {
            self._cateList();
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
            self._cateList();
        }
    }



    render() {
        const { status, sort, tabs, goods } = this.state
        const icon_img = sort == 0 ? asset.rows : asset.vert
        const icon_tit = sort == 1 ? '双排模式' : '单排模式'

        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {

        }

        return (
            <View className='wrap'>
                <View className='coursehead'>
                    <View className='d_flex pt_10 course_box jc_sb'>
                        <View className='d_flex fd_r ai_ct jc_sb head_box col_1'>
                            {
                                tabs.map((tab, index) => {
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
                        <View className='course_sty  d_flex ai_ct jc_fe mb_5' onClick={this._onModel}>
                            <Image src={icon_img} className='iconimg' />
                            <Text className='default_label ml_5 tip_label'>{icon_tit}</Text>
                        </View>
                    </View>
                </View>

                {
                    sort === 0 ?

                        <View className='recommBox pl_15 pr_15'>
                            {
                                goods.map((item, index) => {
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
                                            <View className='pl_10 pr_10 d_flex fd_c mt_5'>
                                                <Text className='c33_label default_label dup_per_txt'>{item.goodsName}</Text>
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


                                        </View>
                                    )
                                })
                            }
                        </View>
                        :
                        <View className='vertBox pl_15 pr_15'>
                            {
                                goods.map((item: any, index) => {
                                    return (
                                        <View key={'cates' + index} className='rcomItem d_flex fd_r' >
                                            <Image
                                                className='catesCover border_ra'
                                                src={item.goodsImg}
                                                mode='aspectFit'
                                            />
                                            <View className='p_15 d_flex fd_c jc_sb col_1'>
                                                <Text className='c33_label default_label dup_per_txt'>{item.goodsName}</Text>
                                                <View className='d_flex fd_r jc_sb ai_ct'>
                                                    <View className='d_flex fd_r ai_ct'>
                                                        {
                                                            item.gtype === 2 ?
                                                                <Text className='sred_label default_label fw_label'>¥{item.goodsAmount}</Text>
                                                                : null}

                                                        {
                                                            item.gtype === 3 ?
                                                                <Text className='sred_label default_label fw_label'>{item.goodsIntegral}学分</Text>
                                                                : null}
                                                        {
                                                            item.gtype === 4 ?
                                                                <Text className='sred_label default_label fw_label'>¥{item.goodsAmount}+{item.goodsIntegral}学分</Text>
                                                                : null}
                                                    </View>
                                                    <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })

                            }
                        </View>
                }

            </View>
        )
    }
}

export default mailList as ComponentClass