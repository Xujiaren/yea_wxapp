import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'

import inter from '../../../config/inter'
import api from '../../../services/api'

import { percent2percent25 } from '../../../utils/common'
import asset from '../../config/asset'

import menu from '../../../config/menu';

import '../../../config/theme.css';
import './search.less'

import { connect } from '@tarojs/redux'
import { mailType } from '../../../constants/mailType'

import {
    getConfig,
} from '../../../actions/mail'

type PageStateProps = {
    mail: mailType,
    getConfig: Array<{}>,
}
type PageDispatchProps = {
    getConfig: () => any,
}

type PageOwnProps = {}


type PageState = {
    initType: number,
    goods: Array<any>,
    page: number,
    pages: number,
    total: number,
    keyword: string,
    historyList: Array<string>
    status: number,
    hiss: string,
    his: Array<string>,
    hotList: Array<any>
    type: number,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface search {
    props: IProps;
}

@connect(({ mail }) => ({
    mail: mail
}), (dispatch) => ({
    getConfig() {
        dispatch(getConfig())
    }
}))

class search extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '严选商城',
        enablePullDownRefresh: true
    }

    page: number
    pages: number

    constructor() {
        super(...arguments)

        this.page = 0;
        this.pages = 0;
        this.state = {
            initType: 0,
            goods: [], // 课程列表
            page: 0,
            pages: 0,
            total: 0,
            keyword: '',
            historyList: [],
            status: 0,
            hiss: '',
            his: [],
            hotList: [],
            type: 0,
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillMount() {
        const { keyword } = this.$router.params
        const hiss = Taro.getStorageSync('keyworde')
        let his = Taro.getStorageSync('keyworde').split(',')
        let hist = []
        if (his.length >= 3) {
            hist = his.slice(-3)
        } else {
            hist = his
        }
        this.setState({
            keyword: keyword,
            initType: 0,
            historyList: hist,
            hiss: hiss,
            his: his,
        })
    }

    componentDidMount() {
        var that = this;
        that._getConfig();
    }

    componentWillUnmount() {

    }

    componentDidShow() { }
    componentDidHide() { }


    _getConfig() {
        var that = this;

        // that.props.getConfig()
        api.get(inter.Config)
            .then(res => {
                let lst = res.data.data.search_goods_hot
                lst = lst.split('|')
                this.setState({
                    hotList: lst
                })
            })
    }


    _onSearch() {
        var that = this;
        const { page, keyword, historyList } = that.state;

        if (keyword) {
            api.get(inter.shopSearch, {
                category_id: '',
                ccategory_id: '',
                keyword: keyword,
                gtype: 0,
                sortOrder: 0,
                page: page,
            }).then(res => {
                if (res.data.status) {
                    let courseList = res.data.data
                    this.setState({
                        goods: courseList.items,
                        page: courseList.page,
                        pages: courseList.pages,
                        total: courseList.total,
                        initType: 1,
                        status: 1
                    })
                    if (courseList.items.length == 0) {
                        this.setState({
                            type: 1
                        })
                    }else{
                        this.setState({
                            type: 0
                        })
                    }
                }
            })

            api.post(inter.userLog, {
                log_type: 1,
                type: 0,
                device_id: 0,
                intro: '商城搜索',
                content_id: 0,
                param: keyword,
                from: 0,
            }).then((res) => {
                console.log('ee')
            })
            let history = historyList
            history.push(keyword).toLocaleString()
            if (historyList.length == 0) {
                Taro.setStorageSync('keyworde', history)
                this.setState({ historyList: history })
            } else {
                Taro.setStorageSync('keyworde', ',' + history)
            }
        }

    }

    _goodsDesc(cates) {
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

    // 下拉
    onPullDownRefresh() {
        var self = this
        this.page = 0;

        self.setState({
            page: 0,
            goods: []
        }, () => {
            self._onSearch();
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }

    //上拉
    onReachBottom() {
        var self = this;

        const { page, pages } = self.state

        if (page < pages) {
            this.page = this.page + 1
            self._onSearch();
        }
    }
    onHist = (val) => {
        console.log(val)
        var that = this
        that.setState({ keyword: val, status: 1 })
        const { page } = that.state;

        if (val) {
            api.get(inter.shopSearch, {
                category_id: '',
                ccategory_id: '',
                keyword: val,
                gtype: 0,
                sortOrder: 0,
                page: page,
            }).then(res => {
                if (res.data.status) {
                    let courseList = res.data.data
                    this.setState({
                        goods: courseList.items,
                        page: courseList.page,
                        pages: courseList.pages,
                        total: courseList.total,
                        initType: 1
                    })
                }
            })

            api.post(inter.userLog, {
                log_type: 1,
                type: 0,
                device_id: 0,
                intro: '商城搜索',
                content_id: 0,
                param: val,
                from: 0,
            }).then((res) => {
                console.log('ee')
            })
        }
    }
    // onDelete=(val)=>{
    //     const{hiss,historyList,his}=this.state
    //     let hist = ''
    //     if(his[0]!=val){
    //         hist = hiss.replace(','+val)
    //     }else{
    //         hist = hiss.replace(val)
    //     }
    //     console.log(hist)
    //     Taro.setStorageSync('keyworde', hist)
    //     this.setState({
    //         historyList:historyList.remove(val)
    //     })

    // }

    render() {
        const { goods, keyword, initType, historyList, status, hotList } = this.state

        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {

        }
        console.log(historyList)
        return (
            <View className='wrap'>
                <View className='searchbox'>
                    <View className='d_flex fd_r ai_ct pl_15 pr_15 searchhead' >
                        <View className='col_1 searchleft d_flex fd_r ai_ct'>
                            <Image src={asset.search} className='s_img' />
                            <View className='wid'>
                                <Input
                                    className='default_label ml_10 col_1'
                                    placeholder={keyword}
                                    value={initType === 0 ? '' : keyword}
                                    onConfirm={this._onSearch}
                                    onInput={(e) => this.setState({ keyword: e.detail.value, initType: 1 })}
                                />
                            </View>
                            <View className='clear' onClick={() => { this.setState({ keyword: '' }) }}>
                                <Image src={asset.dete_icon} className='pic' />
                            </View>
                        </View>
                        <View className='searchbtn' onClick={this._onSearch}>
                            <Text className='black_label default_label'>搜索</Text>
                        </View>
                    </View>
                </View>
                {
                    status == 0 ?
                        <View className='his'>
                            <View className='hist'>热搜词</View>
                            {
                                hotList.length > 0 ?
                                    <View className='hots'>
                                        {
                                            hotList.map(item => {
                                                return (
                                                    <View className='hottip' onClick={() => {
                                                        this.setState({
                                                            keyword: item
                                                        }, this._onSearch)
                                                    }}>
                                                        <View>{item}</View>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                    :
                                    <View className='hots'></View>
                            }

                            <View className='hist'>搜索历史</View>
                            {
                                historyList.map((item, index) => {
                                    if (historyList.length > 0) {
                                        return (
                                            <View className='his_word' onClick={this.onHist.bind(this, item)}>
                                                <View className='items'>{item}</View>
                                                {/* <Image className='pic itms' src={asset.dete_icon} onClick={this.onDelete.bind(this,item)}/> */}
                                            </View>
                                        )
                                    }
                                })
                            }
                        </View>
                        : null
                }
                <View className='recommBox pl_15 pr_15'>
                    {
                        this.state.type == 1 ?
                            <View className='pt_20 pb_20 search_his d_flex ai_ct jc_ct mt_10' style={{width:'100%'}}>
                                <View className='d_flex fd_c ai_ct search_full'>
                                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/d09e51f0-633e-4fa5-82ed-6335ae27f814.png'} className='no_search' />
                                    <Text className='sred_label sm_label mt_15'>没有找到相关商品</Text>
                                </View>
                            </View>
                            : null
                    }
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
                                    <View className='pl_10 pr_10 d_flex fd_c'>
                                        <Text className='c33_label default_label mt_5 dup_per_txt'>{item.goodsName} </Text>
                                        {
                                            item.gtype == 1 ?
                                                <View className='d_flex fd_r jc_sb mt_15'>
                                                    <Text className='sred_label default_label fw_label'>{item.goodsIntegral}免费</Text>
                                                    <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                                </View>
                                                : item.gtype == 2 ?
                                                    <View className='d_flex fd_r jc_sb mt_15'>
                                                        <Text className='sred_label default_label fw_label'>¥{item.goodsAmountDTO.goodsAmount ? item.goodsAmountDTO.goodsAmount : item.goodsAmount}</Text>
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
            </View>
        )
    }
}

export default search as ComponentClass