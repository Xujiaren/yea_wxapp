import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import menu from '../../../../config/menu';
import Tabs from '../../../../components/Tabs'
import { formatTimeStampToTime, percent2percent25, subNumTxt } from '../../../../utils/common'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import '../../../../config/theme.css';
import './profesSkill.less'

type PageState = {
    status: number,
    is_empty: boolean,
    O2oList: Array<{}>,
    nowdate: number,
    page: number,
    pages: number,
    total: number,
    loadding: boolean,
    userId: number,
    toggle_index: number,
    hasspecial: boolean,
}

class profesSkill extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        // navigationBarTitleText: '专业技能培训',
        navigationBarTitleText: '培训班',
        enablePullDownRefresh: true
    }
    page: any;
    pages: any;

    constructor() {
        super(...arguments)

        this.page = 0;
        this.pages = 0;

        this.state = {
            status: 0,
            is_empty: false,
            O2oList: [],
            nowdate: 0,
            page: 0,
            pages: 0,
            total: 0,
            loadding: false,
            userId: 0,
            toggle_index: 0,
            hasspecial: false,
        }
    }

    componentWillMount() {
        var that = this;
        var nowTime = new Date();
        const { userId } = that.$router.params;
        this.setState({
            nowdate: nowTime.getTime(),
            userId: parseInt(userId)
        })
    }

    componentDidMount() {
        var that = this
        that._getUser()
    }

    componentWillUnmount() {
    }

    componentDidShow() {
        var that = this;
        const { status, toggle_index } = that.state;

        if (status === 0) {
            if (toggle_index === 0) {
                that._getO2o();
            } else if (toggle_index === 1) {
                that._getArtSquad();
            }
        } else {
            that._o2oSkillList()
        }

        // that._o2oSkillList()
    }
    componentDidHide() { }

    // 我的
    _getUser() {
        var that = this
        api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    let userData = res.data.data
                    that.setState({
                        userId: userData.userId,
                    })
                }
            })
    }

    // 培训班
    _getO2o() {
        var that = this;
        const { O2oList } = that.state;

        api.get(inter.o2olist, {
            stype: 0,
            page: this.page
        }).then((res) => {
            if (res.data.status) {
                let oList = res.data.data;
                if (this.page === 0) {
                    var tList: any = oList.items
                } else {
                    var tList: any = O2oList.concat(oList.items)
                }
                that.setState({
                    O2oList: tList,
                    page: oList.page,
                    pages: oList.pages,
                    total: oList.total
                })

            }
        })
    }

    // 精彩回顾
    _getArtSquad() {
        var that = this;
        const { O2oList } = that.state;

        api.get(inter.ArticleSquad, {
            page: that.page
        }).then((res) => {
            console.log(res)
            if (res.data.status) {
                let artLists = res.data.data;
                if (that.page === 0) {
                    var artList = artLists.items
                } else {
                    var artList: any = O2oList.concat(artLists.items)
                }

                that.setState({
                    O2oList: artList,
                    page: artLists.page,
                    pages: artLists.pages,
                    total: artLists.total
                })
            }
        })
    }

    // 专业技能
    _o2oSkillList() {
        var that = this;
        const { O2oList, userId } = that.state;

        // api.get(inter.o2oSkillList,{
        //     // userId:userId,
        //     page:this.page
        // }).then((res)=>{
        //     if(res.data.status){
        //         let oList = res.data.data;
        //         if(this.page === 0){
        //             var tList:any = oList.items
        //         } else {
        //             var tList:any = O2oList.concat(oList.items)
        //         }
        //         that.setState({
        //             O2oList:tList,
        //             page:oList.page ,
        //             pages:oList.pages,
        //             total:oList.total,
        //             hasspecial:true
        //         })

        //     }
        // })

        api.get(inter.o2olist, {
            stype: 2,
            page: this.page
        }).then((res) => {
            if (res.data.status) {
                let oList = res.data.data;
                if (this.page === 0) {
                    var tList: any = oList.items
                } else {
                    var tList: any = O2oList.concat(oList.items)
                }
                that.setState({
                    O2oList: tList,
                    page: oList.page,
                    pages: oList.pages,
                    total: oList.total,
                    hasspecial: true
                })

            }
        })

    }



    // 选择分类
    _onSelect = (index) => {
        var that = this;
        const { toggle_index } = that.state
        this.page = 0;


        that.setState({
            status: index,
            O2oList: [],
        }, () => {
            if (index === 0) {
                if (toggle_index === 0) {
                    that._getO2o();
                } else if (toggle_index === 1) {
                    that._getArtSquad();
                }

            } else {
                that._o2oSkillList()
            }
        })
    }

    _toggleIdx(idx) {
        var that = this
        this.page = 0;

        that.setState({
            toggle_index: idx,
            O2oList: []
        }, () => {
            if (idx === 0) {
                that._getO2o();
            } else if (idx === 1) {
                that._getArtSquad();
            }
        })


    }

    //跳转到详情页
    o2oDesc(o2o, type, stype) {
        Taro.navigateTo({
            url: menu.myTrainClassDetail + '?squadId=' + o2o.squadId + '&squadName=' + percent2percent25(o2o.squadName) + '&type= ' + type + '&stype=1'
        })
    }


    // 培训班活动详情页
    o2oTDesc(o2o, type) {
        Taro.navigateTo({
            url: menu.myTranDetail + '?squadId=' + o2o.squadId + '&squadName=' + percent2percent25(o2o.squadName) + '&type= ' + type + '&stype=0'
        })
    }

    _studyExamTips() {
        Taro.showToast({
            title: '考试暂未开放',
            icon: 'none',
            duration: 1000,
        })
    }

    _studyTips() {
        Taro.showToast({
            title: '线下缴费以后，才能开通此功能！',
            icon: 'none',
            duration: 1000,
        })
    }

    artDesc(article) {
        var that = this;


        Taro.navigateTo({
            url: menu.artDesc + '?articleId=' + article.articleId + '&articleName=' + percent2percent25(article.title)
        })
    }





    // 下拉刷新
    onPullDownRefresh() {
        Taro.showNavigationBarLoading()
        this.page = 0;

        var self = this;
        const { status, toggle_index } = self.state

        self.setState({
            O2oList: [],
            page: 0,
            loadding: false,
            hasspecial: false,
        }, () => {
            if (status === 0) {
                if (toggle_index === 0) {
                    self._getO2o();
                } else if (toggle_index === 1) {
                    self._getArtSquad()
                }
            } else {
                self._o2oSkillList();
            }

            setTimeout(function () {
                Taro.stopPullDownRefresh();
                Taro.hideNavigationBarLoading()
            }, 1000);
        })
    }

    //上拉
    onReachBottom() {
        var self = this;

        const { page, pages, status, toggle_index } = self.state

        if (page < pages) {
            this.page = this.page + 1
            if (status === 0) {
                if (toggle_index === 0) {
                    self._getO2o();
                } else if (toggle_index === 1) {
                    self._getArtSquad()
                }
            } else {
                self._o2oSkillList()
            }

        } else {
            self.setState({
                loadding: true
            })
        }
    }



    render() {
        const { O2oList, nowdate, loadding, status, toggle_index, hasspecial } = this.state

        let training: any = []
        let trained: any = []
        for (let i = 0; i < O2oList.length; i++) {
            if (O2oList[i].endTime * 1000 > nowdate) {
                training.push(O2oList[i])
            } else {
                trained.push(O2oList[i])
            }
        }


        return (
            <View className='root'>
                <View className='headbox'>
                    <View className='atabs'>
                        <Tabs items={['系统教育培训','专业技能培训']} atype={0} selected={status} onSelect={this._onSelect} />
                    </View>
                </View>

                {
                    status === 0 ?
                        <View className='pt_50'>
                            <View className='toggle d_flex row jc_ct ai_ct'>
                                <View
                                    className={toggle_index === 0 ? 'active toggle_item d_flex jc_ct ai_ct' : 'toggle_item d_flex jc_ct ai_ct'}
                                    onClick={this._toggleIdx.bind(this, 0)}
                                >
                                    <Text>系统教育培训</Text>
                                </View>
                                <View className={toggle_index === 1 ? 'active toggle_item d_flex jc_ct ai_ct' : ' toggle_item d_flex jc_ct ai_ct'}
                                    onClick={this._toggleIdx.bind(this, 1)}
                                >
                                    <Text>精彩回顾</Text>
                                </View>
                            </View>
                            {
                                O2oList.length === 0 ?
                                    <View className='empty_wrap d_flex fd_c jc_ct ai_ct'>
                                        <Text className='empty_txt'>暂无培训班</Text>
                                    </View>
                                    :
                                    <View className='content_wrap'>


                                        {
                                            toggle_index === 0 ?
                                                <View>
                                                    {
                                                        training.length > 0 ?
                                                            <View className='pt_15 pb_15'>
                                                                <Text className=' c33_label fw_label lg_label ' >正在进行中</Text>
                                                            </View>
                                                            : null}
                                                    {
                                                        training.map((o2o: any, index) => {
                                                            return (
                                                                <View className='item'
                                                                    key={'o2o' + index}
                                                                    onClick={this.o2oTDesc.bind(this, o2o, 0, 0)}
                                                                >
                                                                    <Image className='item_img' mode='aspectFill' src={o2o.squadImg} />
                                                                    <View className='d_flex  row ai_ct pt_5'>
                                                                        <Text className='name'>{subNumTxt(o2o.squadName, 36)}</Text>
                                                                    </View>
                                                                    {
                                                                        o2o.summary.length > 0 ?
                                                                            <Text className='gray_label sm_label'>{subNumTxt(o2o.summary, 44)}</Text>
                                                                            : null}
                                                                    <View className='d_flex jc_sb row ai_ct mt_5'>
                                                                        <Text className='info'>招生人数：{o2o.enrollNum}  报名人数：{o2o.registeryNum}</Text>

                                                                    </View>
                                                                    <View className='d_flex jc_sb row ai_ct pt_5'>
                                                                        <Text className='time'>{formatTimeStampToTime(o2o.beginTime * 1000)} - {formatTimeStampToTime(o2o.endTime * 1000)}</Text>
                                                                        {
                                                                            o2o.location.length === 0 ?
                                                                                null :
                                                                                <Text className='position'>地点：{o2o.location}</Text>
                                                                        }
                                                                    </View>
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                    {
                                                        trained.length > 0 ?
                                                            <View className='pb_15'>
                                                                <Text className=' c33_label fw_label lg_label ' >已结束</Text>
                                                            </View>
                                                            : null}
                                                    {
                                                        trained.map((o2o: any, index) => {
                                                            return (
                                                                <View className='item'
                                                                    key={'o2o' + index}
                                                                    onClick={this.o2oTDesc.bind(this, o2o, 1, 0)}
                                                                >
                                                                    <Image className='item_img' mode='aspectFill' src={o2o.squadImg} />
                                                                    <View className='d_flex  row ai_ct pt_5'>
                                                                        <Text className='name'>{subNumTxt(o2o.squadName, 44)}</Text>
                                                                    </View>
                                                                    {
                                                                        o2o.summary.length > 0 ?
                                                                            <Text className='gray_label sm_label'>{subNumTxt(o2o.summary, 40)}</Text>
                                                                            : null}
                                                                    <View className='d_flex jc_sb row ai_ct mt_5'>
                                                                        <Text className='info'>招生人数：{o2o.enrollNum}  报名人数：{o2o.registeryNum}</Text>
                                                                        {
                                                                            o2o.location.length === 0 ?
                                                                                null :
                                                                                <Text className='position'>地点：{o2o.location}</Text>
                                                                        }
                                                                    </View>
                                                                    <View className='d_flex jc_sb row ai_ct pt_5'>
                                                                        <Text className='time'>{formatTimeStampToTime(o2o.beginTime * 1000)} - {formatTimeStampToTime(o2o.endTime * 1000)}</Text>
                                                                    </View>
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </View>
                                                :
                                                <View>
                                                    {
                                                        O2oList.map((o2o: any, index) => {
                                                            return (
                                                                <View className='item'
                                                                    key={'o2o' + index}
                                                                    onClick={this.artDesc.bind(this, o2o)}
                                                                >
                                                                    <Image className='item_img' mode='aspectFill' src={o2o.articleImg} />
                                                                    <View className='findTip'>
                                                                        <Text className='findTip_tit'>{subNumTxt(o2o.title, 36)}</Text>
                                                                        <Text className='findTip_date mt_5'>{o2o.pubTimeFt}</Text>
                                                                    </View>
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </View>
                                        }
                                    </View>
                            }
                        </View>
                        :
                        <View className='content_wrap pt_50'>
                            {/* <View className='headbox_a'>
                                <View className='atabs'>
                                    <Tabs items={['专业技能培训']} atype={1} selected={0} />
                                </View>
                            </View> */}
                            {
                                training.length > 0 ?
                                    <View className='mb_10 mt_30'>
                                        <Text className='title'>正在进行中</Text>
                                    </View>
                                    : null}

                            {
                                training.map((ele: any, index) => {
                                    return (
                                        <View className='item' key={'ele' + index}
                                            onClick={this.o2oDesc.bind(this, ele, 0, 1)}
                                        >
                                            <Image className='item_img' mode='aspectFill' src={ele.squadImg} />
                                            <View className='d_flex jc_sb row ai_ct pt_5 pb_5'>
                                                <Text className='name'>{subNumTxt(ele.squadName, 36)}</Text>
                                            </View>
                                            <View className='d_flex jc_sb row ai_ct'>
                                            <Text className='info'>招生人数：{ele.enrollNum}</Text>
                                                {/* <Text className='info'>招生人数：{ele.enrollNum}  报名人数：{ele.registeryNum}</Text> */}
                                                {
                                                    ele.location.length === 0 ?
                                                        null :
                                                        <Text className='position'>地点：{ele.location}</Text>
                                                }
                                            </View>
                                            <Text className='time'>{formatTimeStampToTime(ele.beginTime * 1000)} - {formatTimeStampToTime(ele.endTime * 1000)}</Text>
                                        </View>
                                    )
                                })
                            }

                            {
                                trained.length > 0 ?
                                    <View className='mb_10'>
                                        <Text className='title border'>已结束</Text>
                                    </View>
                                    : null}

                            {
                                trained.map((ele: any, index) => {
                                    return (
                                        <View className='item' key={'ele' + index}
                                            onClick={this.o2oDesc.bind(this, ele, 1, 1)}
                                        >
                                            <Image className='item_img' mode='aspectFill' src={ele.squadImg} />
                                            <View className='d_flex jc_sb row ai_ct pt_5 pb_5'>
                                                <Text className='name'>{subNumTxt(ele.squadName, 36)}</Text>
                                            </View>
                                            <View className='d_flex jc_sb row ai_ct'>
                                            <Text className='info'>招生人数：{ele.enrollNum}</Text>
                                                {/* <Text className='info'>招生人数：{ele.enrollNum}  报名人数：{ele.registeryNum}</Text> */}
                                                {
                                                    ele.location.length === 0 ?
                                                        null :
                                                        <Text className='position'>地点：{ele.location}</Text>
                                                }
                                            </View>
                                            <Text className='time'>{formatTimeStampToTime(ele.beginTime * 1000)} - {formatTimeStampToTime(ele.endTime * 1000)}</Text>
                                        </View>
                                    )
                                })
                            }

                            {
                                hasspecial && O2oList.length === 0 ?
                                    <View className='d_flex fd_c jc_ct ai_ct' style={{ marginTop: 140 + 'rpx' }}>
                                        <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/89b7372a-9784-4f91-a04f-e3c1798a7c53.png'} className='notDataImg' />
                                        <Text className='sm_label gray_label mt_20'>暂无专业技能培训活动</Text>
                                    </View>
                                    : null}
                        </View>
                }

                {
                    loadding == true ?
                        <View className='loaddata d_flex ai_ct jc_ct  pb_10'>
                            <Text className='sm_label tip_label'>没有更多数据了</Text>
                        </View>
                        : null}
            </View>
        )
    }
}

export default profesSkill as ComponentClass