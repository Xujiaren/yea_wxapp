import { ComponentClass } from 'react'
import Taro, { Component, getApp, navigateTo } from '@tarojs/taro'
import { View, Text, Image, Picker } from '@tarojs/components'


import { percent2percent25 } from '../../utils/common'

import Tabs from '../../components/Tabs'
import ActCell from '../../components/Cell/ActCell'


import menu from '../../config/menu';
import inter from '../../config/inter'
import api from '../../services/api'
import asset from '../../config/asset';

import '../../config/theme.css';
import './find.less'

type PageState = {
    load: boolean,
    userId: number,
    specialList: Array<{}>,
    findsList: Array<{
        beginTime: any,
        endTime: any
    }>,
    page: number,
    pages: number,
    ppage: number,
    ppages: number,
    total: number,
    status: number,
    keyword: string,
    nowdate: number,
    hasspecial: boolean,
    downList: Array<any>,
    act_N_bgn: Array<any>,
    act_bgn: Array<any>,
    act_end: Array<any>,
    ids: Array<any>,
    selector: any,
    ttyps
}

class find extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '活动',
        enablePullDownRefresh: true
    }
    page: number;
    pages: number;
    ppage: number;
    ppages: number;
    constructor() {
        super(...arguments)

        this.page = 0;
        this.pages = 0;
        this.ppage = 0;
        this.ppages = 0;
        this.state = {
            load: true,
            userId: 0,
            specialList: [],// 专题
            findsList: [],  // 活动
            page: 0,
            pages: 0,
            ppage: 0,
            ppages: 0,
            total: 0,
            status: 0,
            keyword: '',
            nowdate: 0,
            hasspecial: false,
            downList: [],
            ids: [],
            selector: ['进行中', '未开始', '已结束'],
            ttyps: 0
        }
    }

    componentWillMount() {
        var that = this;

        var nowTime = new Date();
        that.setState({
            nowdate: nowTime.getTime(),
        })
        api.post('/user/log', {
            log_type: 4,
            type: 17,
            contentId: 0
        }).then(res => { })
    }

    componentDidMount() {
        var that = this;

        that._articleList();
        that.getArtSpecial(); //专题
        that.stylist()
    }

    componentWillUnmount() {
    }

    componentDidShow() {
        let showDialog = ''
        let showDialogs = 0
        showDialog = getApp().globalData.showDialog
        showDialogs = getApp().globalData.showDialogs
        if (showDialog) {
            this.setState({
                keyword: showDialog
            })
        }
        if (showDialogs) {
            this.setState({
                status: showDialogs
            })
        }
    }
    componentDidHide() { }

    //线下
    stylist = () => {
        var that = this
        const { keyword, findsList } = that.state;
        api.get(inter.o2olist, {
            page: this.ppage,
            stype: 8,
            pageSize: 100
        }).then(res => {
            if (res.data.status) {
                let findList = res.data.data

                if (this.ppage === 0) {
                    var tList = findList.items
                } else {
                    var tList: any = findsList.concat(findList.items)
                }

                this.setState({
                    downList: tList,
                    ppage: findList.page,
                    ppages: findList.pages,
                    total: findList.total
                })

            }
        })
    }
    // 活动
    _articleList() {
        var that = this
        const { keyword, findsList } = that.state;
        api.get(inter.Activity, {
            is_offline: -1,
            keyword: keyword,
            page: this.page,
            pageSize: 100
        }).then((res) => {
            if (res.data.status) {
                let findList = res.data.data

                if (this.page === 0) {
                    var tList = findList.items
                    if (tList.length < 4) {
                        // console.log(that.ppage, '///?')

                    }
                } else {
                    var tList: any = findsList.concat(findList.items)
                }

                this.setState({
                    findsList: tList,
                    page: findList.page,
                    pages: findList.pages,
                    total: findList.total
                })

            }
        })
    }

    // 专题
    getArtSpecial() {
        var that = this;
        const { specialList, keyword } = that.state;
        api.get(inter.ArticleSpecial, {
            page: that.page,
            keyword: keyword
        }).then((res) => {
            if (res.data.status) {
                let speLists = res.data.data;
                if (that.page === 0) {
                    var speList = speLists.items
                } else {
                    var speList: any = specialList.concat(speLists.items)
                }

                that.setState({
                    specialList: speList,
                    page: speList.page,
                    pages: speList.pages,
                    total: speList.total,
                    hasspecial: true
                })
            }
        })
    }


    artDesc(article) {
        var that = this;
        const { status } = that.state;
        // console.log(article)
        let arr = Object.keys(article).includes('squadId')
        if (!arr) {
            if (status === 0) {
                Taro.navigateTo({
                    url: menu.activityDesc + '?activityId=' + article.activityId + '&articleName=' + percent2percent25(article.title) + '&atype=' + article.atype
                })
            } else if (status === 1) {
                Taro.navigateTo({
                    url: menu.projectDesc + '?articleId=' + article.articleId + '&articleName=' + percent2percent25(article.title)
                })
            }
        } else {
            Taro.navigateTo({
                url: menu.downActivity + '?squadId=' + article.squadId + '&squadName=' + percent2percent25(article.squadName) + '&type= 0' + '&stype=0'
            })
        }

    }
    // downDesc(val){
    //     Taro.navigateTo({
    //         url: menu.myTranDetail + '?squadId=' + val.squadId + '&squadName=' + percent2percent25(val.squadName) + '&type= 0'  + '&stype=0'
    //     })
    // }
    // 下拉
    onPullDownRefresh() {
        var self = this

        const { status } = self.state;

        this.page = 0;

        var nowTime = new Date();
        this.setState({
            nowdate: nowTime.getTime()
        })

        if (status === 0) {
            self.setState({
                page: 0,
                findsList: []
            }, () => {
                self._articleList();
                self.stylist()
                setTimeout(function () {
                    //执行ajax请求后停止下拉
                    Taro.stopPullDownRefresh();
                }, 1000);
            })
        } else if (status === 1) {
            self.setState({
                page: 0,
                specialList: [],
                hasspecial: false
            }, () => {
                self.getArtSpecial();
                setTimeout(function () {
                    //执行ajax请求后停止下拉
                    Taro.stopPullDownRefresh();
                }, 1000);
            })
        }


    }

    //上拉
    onReachBottom() {
        var self = this;

        const { page, pages, status, ppage, ppages } = self.state

        if (page < pages - 1) {
            self.page = self.page + 1
            if (status === 0) {
                self._articleList();
            } else if (status === 1) {
                self.getArtSpecial();
            }
        }
        if (ppage < ppages - 1) {
            self.ppage = self.ppage + 1
            if (status === 0) {
                self.stylist()
            } else if (status === 1) {
                self.getArtSpecial();
            }
        }
    }

    _onSelect = (index) => {
        var that = this;
        that.page = 0;
        Taro.setStorageSync("findStatus", index);
        if (index === 0) {
            that._articleList();
            that.stylist()
        } else if (index === 1) {
            that.getArtSpecial();
        }

        that.setState({
            status: index
        })
    }
    onChanges = (e) => {
        // console.log(e)
        this.page = 0;
        this.pages = 0;
        this.setState({
            ttyps: e.detail.value,
            page: 0,
            pages: 0,
        }, () => {
            this.stylist()
            this._articleList()
        })
    }
    compare = (property) => {
        return function (obj1, obj2) {
            var value1 = obj1[property];
            var value2 = obj2[property];
            return value1 - value2;     // 升序
        }
    }
    compares = (property) => {
        return function (obj1, obj2) {
            var value1 = obj1[property];
            var value2 = obj2[property];
            return value2 - value1;     // 降序
        }
    }


    render() {
        if (!this.state.load) return null;
        const { status, specialList, findsList, nowdate, hasspecial, downList, ttyps } = this.state;

        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {

        }
        let lists: any[] = new Array()
        let act_bgn: any[] = new Array()
        let act_end: any[] = new Array()
        let act_N_bgn: any[] = new Array()
        lists = findsList.concat(downList)
        let beg = []
        let ins = []
        let ends = []
        for (let i = 0; i < lists.length; i++) {
            if (nowdate < lists[i].startTime * 1000) {
                act_N_bgn.push(lists[i])
                beg = act_N_bgn.sort(this.compares("startTime"))
                beg.map((item, index) => {
                    if (item.isRecomm == 1) {
                        let arr = beg
                        let itm = arr.splice(index, 1)
                        arr.splice(0, 0, itm[0])
                        beg = arr
                    }

                })
            } else if (nowdate > lists[i].startTime * 1000 && nowdate < lists[i].endTime * 1000) {
                act_bgn.push(lists[i])
                ins = act_bgn.sort(this.compares("startTime"))
                ins.map((item, index) => {
                    if (item.isRecomm == 1) {
                        let arr = ins
                        let itm = arr.splice(index, 1)
                        arr.splice(0, 0, itm[0])
                        ins = arr
                    }

                })
            } else {
                act_end.push(lists[i])
                ends = act_end.sort(this.compares("endTime"))
                ends.map((item, index) => {
                    if (item.isRecomm == 1) {
                        let arr = ends
                        let itm = arr.splice(index, 1)
                        arr.splice(0, 0, itm[0])
                        ends = arr
                    }

                })
            }
        }
        return (
            <View className='findwrap'>
                <View className='headbox'>
                    <View className='atabs'>
                        <Tabs items={['活动', '专题']} atype={0} selected={status} onSelect={this._onSelect} />
                    </View>
                </View>


                <View className='findcons pt_30'>
                    {/* <View className='findcons '> */}

                    {
                        status === 0 ?
                            <View className='article'
                                style={{ width: (windowWidth * 0.84).toFixed(0) + 'px' }}
                            >
                                <View className='pb_10 ccs' >
                                    <View></View>
                                    <Picker mode='selector' range={this.state.selector} onChange={this.onChanges}>
                                        <View className='ros'>
                                            <Text className='lg18 c33_label'>{ttyps == 0 ? '进行中' : ttyps == 1 ? '未开始' : '已结束'}</Text>
                                            <Image src={asset.btm_actgle} className='act_icon' />
                                        </View>
                                    </Picker>
                                </View>
                                {/* {
                                    downList.length > 0 ?
                                        <View>
                                            <View className='pb_10'>
                                                <Text className='default_label c33_label fw_label'>进行中</Text>
                                            </View>
                                            {
                                                downList.map((findt: any, index) => {
                                                    const on = act_bgn.length === index + 1

                                                    return (
                                                        <View className='articleItems' onClick={this.downDesc.bind(this, findt)} key={'item' + index} style={on ? { borderBottom: 0 + 'rpx', marginBottom: 0 + 'rpx' } : {}}>
                                                            <ActCell findt={findt} ttype={1} />
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                        : null} */}

                                {
                                    act_bgn.length > 0 && ttyps == 0 ?
                                        <View>
                                            <View className='pb_10'>
                                                {/* <Text className='default_label c33_label fw_label'>进行中</Text> */}
                                            </View>
                                            {
                                                ins.map((findt: any, index) => {
                                                    const on = act_bgn.length === index + 1

                                                    return (
                                                        <View className='articleItems' onClick={this.artDesc.bind(this, findt)} key={'item' + index} style={on ? { borderBottom: 0 + 'rpx', marginBottom: 0 + 'rpx' } : {}}>
                                                            <ActCell findt={findt} ttype={1} />
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                        : null}

                                {
                                    act_N_bgn.length > 0 && ttyps == 1 ?
                                        <View className={act_bgn.length > 0 ? 'article_top' : ''}>
                                            <View className='pb_10'>
                                                {/* <Text className='default_label c33_label fw_label'>未开始</Text> */}
                                            </View>
                                            {
                                                beg.map((findt: any, index) => {
                                                    const on = act_N_bgn.length === index + 1
                                                    return (
                                                        <View className='articleItems' onClick={this.artDesc.bind(this, findt)} key={'item' + index}
                                                            style={on ? { borderBottom: 0 + 'rpx', marginBottom: 0 + 'rpx' } : {}}
                                                        >
                                                            <ActCell findt={findt} ttype={0} />
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                        : null}
                                {
                                    act_end.length > 0 && ttyps == 2 ?
                                        <View style={act_N_bgn.length > 0 || act_bgn.length > 0 ? { paddingTop: 40 + 'rpx', borderTop: '2rpx solid #f0f0f0' } : {}}>
                                            <View className='pb_10'>
                                                {/* <Text className='default_label c33_label fw_label'>已结束</Text> */}
                                            </View>
                                            {
                                                ends.map((findt: any, index) => {
                                                    const on = act_end.length === index + 1
                                                    return (
                                                        <View className='articleItems' onClick={this.artDesc.bind(this, findt)}
                                                            key={'item' + index}
                                                            style={on ? { borderBottom: 0 + 'rpx', marginBottom: 0 + 'rpx' } : {}}
                                                        >
                                                            <ActCell findt={findt} ttype={2} />
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                        : null}

                            </View>
                            : null}


                    {status === 1 && specialList.length > 0 ?
                        <View className='subJect' >

                            <View className='pb_10'>
                                <Text className='lg18 c33_label'>热门专题</Text>
                            </View>

                            {
                                specialList.map((article: any, index) => {
                                    const on = specialList.length === index + 1
                                    return (
                                        <View className='subJectItems' key={'o2o' + index} style={on ? { borderBottom: 0 + 'rpx' } : {}}
                                            onClick={this.artDesc.bind(this, article)}
                                        >
                                            <Image className='subJectItem_cover' src={article.articleImg} />
                                            <View className='findTip d_flex fd_c'>
                                                <Text className='lg_label c33_label fw_label per_txt'>{article.title}</Text>
                                                <Text className='gray_label default_label per_txt'>{article.summary}</Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        : null}
                    {
                        status == 1 && hasspecial && specialList.length === 0 ?
                            <View className='d_flex fd_c jc_ct ai_ct' style={{ marginTop: 140 + 'rpx' }}>
                                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/89b7372a-9784-4f91-a04f-e3c1798a7c53.png'} className='notDataImg' />
                                <Text className='sm_label gray_label mt_20'>暂无专题活动</Text>
                            </View>
                            : null}
                    {
                        status == 0 && act_bgn.length == 0&& ttyps == 0?
                            <View className='d_flex fd_c jc_ct ai_ct' style={{ marginTop: 140 + 'rpx' }}>
                                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/89b7372a-9784-4f91-a04f-e3c1798a7c53.png'} className='notDataImg' />
                                <Text className='sm_label gray_label mt_20'>暂无专题活动</Text>
                            </View>
                            : null}
                             {
                        status == 0 && act_N_bgn.length == 0 && ttyps == 1 ?
                            <View className='d_flex fd_c jc_ct ai_ct' style={{ marginTop: 140 + 'rpx' }}>
                                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/89b7372a-9784-4f91-a04f-e3c1798a7c53.png'} className='notDataImg' />
                                <Text className='sm_label gray_label mt_20'>暂无专题活动</Text>
                            </View>
                            : null}
                             {
                        status == 0 && act_end.length == 0 && ttyps == 2 ?
                            <View className='d_flex fd_c jc_ct ai_ct' style={{ marginTop: 140 + 'rpx' }}>
                                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/89b7372a-9784-4f91-a04f-e3c1798a7c53.png'} className='notDataImg' />
                                <Text className='sm_label gray_label mt_20'>暂无专题活动</Text>
                            </View>
                            : null}

                </View>

            </View>
        )
    }
}

export default find as ComponentClass