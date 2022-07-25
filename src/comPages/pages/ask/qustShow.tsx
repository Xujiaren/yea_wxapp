import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'

import Eval from '../../components/comment'
import { formatTimeStampToTime } from '../../../utils/common'
import Comt from '../../../components/General/Comt'

import asset from '../../../config/asset'
import menu from '../../../config/menu'
import inter from '../../../config/inter'
import api from '../../../services/api'

import asste1 from '../../config/asset'

import '../../../config/theme.css';
import './qustShow.less'


type PageState = {
    content: string,
    askId: number,
    desc: {
        title: string,
        content: string,
        gallery: Array<any>,
        hit: number,
        replyNum: number,
        followNum: number,
        categoryId: number,
        askId: number,
        integral:number,
    },
    replyList: Array<{
        replyId: number,
        askId: number,
        parentId: number,
        rtype: number,
        fromUserId: number,
        userId: number,
        content: string,
        approval: number,
        oppose: number,
        score: number,
        pubTime: number,
    }>,
    comts: Array<any>,
    replyTotal: number,
    status: number,
    categoryId: number,

    replyId: number,
    integral: number,
    typ: number,
    page: number,
    pages: number,
}


class qustShow extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '问题展开页',
        enablePullDownRefresh: true
    }

    page: number
    pages: number
    constructor(props) {
        super(props)
        this.page = 0;
        this.pages = 0;
        this.state = {
            content: '',
            askId: 0,
            desc: {},
            comts: [],
            replyList: [],
            replyTotal: 0,
            status: 1000,
            categoryId: 0,
            replyId: 0,
            integral: 0,
            typ: 0,
            page: 0,
            pages: 0,
        }

    }

    componentWillMount() {
        var that = this;

        const { askId, title } = that.$router.params;

        that.setState({
            askId: parseInt(askId)
        })

        Taro.setNavigationBarTitle({
            title: title === undefined ? '提问详情' : title,
        })
    }

    componentDidMount() {
        let that = this;

        that._askdesc();
        that._getComt();
        that._replyAsk();
       
    }

    componentDidShow() {
        let that = this;
        that._askdesc();
    }

    componentWillUnmount() {

    }

    componentDidHide() { }


    //回答的问题
    _replyAsk() {

        let that = this;
        const { askId, replyList } = that.state;


        api.get(inter.replyAsk + askId, {
            suid: 0,
            page: 0,
            sort: 0
        }).then((res) => {

            if (res.data.status) {
                let arr = res.data.data;
                if (this.page === 0) {
                    this.page = arr.page
                    this.pages = arr.pages
                    var tList = arr.items
                } else {
                    var tList: any = replyList.concat(arr.items)
                }

                that.setState({
                    replyList: tList,
                    replyTotal: arr.total,
                    page: arr.page,
                    pages: arr.pages,
                })
            }

        })

    }

    _askdesc() {

        var that = this;
        const { askId } = that.state;

        api.get(inter.askdesc + askId)
            .then((res) => {
                if (res.data.status) {
                    wx.showShareMenu({

                        withShareTicket: true,
            
                        menus: ['shareAppMessage', 'shareTimeline']
                    })
                    that.setState({
                        desc: res.data.data,
                        replyId: res.data.data.replyId,
                        integral: res.data.data.integral,
                    })
                }
            })

    }



    //  下啦刷新
    onPullDownRefresh() {
        var that = this;

        Taro.showNavigationBarLoading();

        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }


    // 评论
    _onComt = () => {
        let that = this;
        const { askId } = that.state;

        Taro.navigateTo({
            url: menu.awriteComt + '?askId=' + askId + '&whitetip=' + Taro.getStorageSync('whiteTips')
        })
    }

    // 评论
    _getComt() {
        let that = this;
        const { askId } = that.state;

        api.get(inter.askPinlun + askId).then((res) => {
            if (res.data.status) {

                that.setState({
                    comts: res.data.data.items.filter(item => item.isTop == 1 ? item : null)
                })
            }
        })
    }

    _parse = (val, comIdx) => {

        let that = this;
        const { comts } = that.state

        if (val.like) {
            api.post(inter.RemoveLike + val.commentId).then((res) => {
                if (res.data.status) {
                    comts[comIdx].like = !comts[comIdx].like
                    comts[comIdx].praise = comts[comIdx].praise - 1
                    that.setState({
                        comts: comts
                    })
                }
            })
        } else {
            api.post(inter.PublishLike + val.commentId).then((res) => {
                if (res.data.status) {
                    comts[comIdx].like = !comts[comIdx].like
                    comts[comIdx].praise = comts[comIdx].praise + 1
                    that.setState({
                        comts: comts
                    })
                }
            })
        }

    }

    // 分享详情页
    onShareAppMessage(ops) {
        var that = this;
        const { desc } = that.state;

        let url = '';
        if (desc.gallery.length > 0) {
            url = desc.gallery[0].fpath;
        }

        if (ops.from === 'button') {
            // 来自页面内转发按钮
            // console.log(ops.target)
        }
        return {
            title: desc.title,
            path: menu.question + '?askId=' + desc.askId + '&title=' + desc.title,
            imageUrl: url,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
    onShareTimeline() {
        const { desc } = this.state;
        let url = '';
        if (desc.gallery.length > 0) {
            url = desc.gallery[0].fpath;
        }
        return {
            title:desc.title,
            query: menu.question + '?askId=' + desc.askId + '&title=' + desc.title,
            imageUrl: url
        }
    }

    handleStop = (e) => {
        e.stopPropagation()
    }

    _onSelect = (index) => {
        var that = this;
        that.setState({
            status: index
        })
    }

    _onEdit = () => {

        var that = this;
        const { desc, askId } = that.state;

        let arr_img: Array<any> = [];

        if (desc.gallery.length > 0) {
            for (let i = 0; i < desc.gallery.length; i++) {
                arr_img.push(desc.gallery[i].fpath)
            }
        }

        Taro.navigateTo({
            url: menu.askQust + '?askId=' + askId + '&categoryId=' + desc.categoryId + '&gallery=' + JSON.stringify(arr_img) + '&content=' + desc.content + '&title=' + desc.title + '&integral=' + this.state.integral + '&whitetip=' + Taro.getStorageSync('whiteTipss')
        })

    }



    _onDelete = () => {
        var that = this;

        const { askId, desc } = that.state;

        let arr_img: Array<any> = [];

        if (desc.gallery.length > 0) {
            for (let i = 0; i < desc.gallery.length; i++) {
                arr_img.push(desc.gallery[i].fpath)
            }
        }


        api.post(inter.askPublish, {
            content: desc.content,
            pics: arr_img.join(','),
            title: desc.title  ,
            videos: 'xc',
            category_id: 0,
            integral: 0,
            is_delete: 1,
            ask_id: askId,
        }).then((res) => {
            if (res.data.status) {
                Taro.showToast({
                    title: '删除成功',
                    icon: 'none',
                    duration: 1000,
                })

                setTimeout(() => {
                    Taro.navigateBack();
                }, 1000)
            }
        })


    }

    _approval = (ask, index) => {
        var that = this;
        const { replyList } = that.state;

        api.post(inter.askPost + ask.replyId, {
            ctype: 34,
            etype: 100,
        }).then((res) => {
            if (res.data.status) {
                Taro.showToast({
                    title: '赞同',
                    icon: 'none',
                    duration: 1000
                })
                this.setState({
                    replyList: replyList.map(item => item.replyId == ask.replyId ? { ...item, accept: true, approval: item.approval + 1 } : item),
                })
            }
        })

    }
    _approvals = (value, index) => {
        var that = this;
        const { replyList } = that.state;

        api.post(inter.inApproval + value.replyId, {
            ctype: 34,
            etype: 100,
        }).then((res) => {
            console.log(res)
            if (res.data.status) {
                Taro.showToast({
                    title: '已取消',
                    icon: 'none',
                    duration: 1000
                })
                this.setState({
                    replyList:replyList.map(item=>item.replyId==value.replyId?{...item,accept:false,approval:item.approval-1}:item),
                })
            }
        })
                

    }


    // 采纳
    _adopt = (replyId) => {
        var that = this;

        api.post(inter.askConfirmReply, {
            reply_id: replyId
        }).then((res) => {
            if (res.data.status) {
                Taro.showToast({
                    title: '采纳成功',
                    icon: 'none',
                    duration: 1000,
                })

                that._askdesc();
            }
        })
    }

    // 查看评论图片
    onViewImgs = (galleryList, index) => {

        let urls: string[] = new Array();
        for (let i = 0; i < galleryList.length; i++) {
            urls.push(galleryList[i].fpath)
        }
        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: urls[index], // 当前显示图片的http链接，默认是第一个
        }).then((res) => {
            // console.log(res)
        })
    }
    onMore = () => {
        var self = this;

        const { page, pages } = this.state

        if (page < pages) {
            this.page = this.page + 1;

            self._replyAsk();
        }
    }

    render() {

        const { desc, comts, askId, typ, replyList, status, integral, replyId, replyTotal, page, pages } = this.state;

        let comments = comts.slice(0, 5);
        let replyList_r = replyList.slice(0, 5);
        let replyList_t = replyList;

        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {

        }

        if (Object.keys(desc).length === 0) return null;

        return (
            <View className='wrap fade'>
                {console.log(integral,'???')}
                <View style={{ paddingBottom: 120 + 'rpx' }}>
                    <View className='pl_20 pr_20'>
                        <View className='d_flex pt_20  pt_15'>
                            {
                                integral > 0 ?
                                    <View className='item_tips'>
                                        <Image src={asset.gold_icon} className='gold_icon' />
                                        <Text className='smm_label acs'>{integral}学分</Text>
                                    </View>
                                    : null
                            }

                            <Text className='lg_label c33_label fw_label'>{desc.title}</Text>
                        </View>
                        <Text className='sm_label c33_label'>{desc.content}</Text>

                        {
                            desc.gallery.map((item, index) => {
                                return (
                                    <Image src={item.fpath} mode="widthFix" className='q_img mt_10' key={'item' + index} />
                                )
                            })
                        }


                        <View className='d_flex fd_r jc_sb ai_ct mt_10 mb_20'>
                            <Text className='sm_label tip _label'>{desc.followNum}关注</Text>
                            <View className='d_flex fd_r ai_ct'>
                                <View className='toggle_btn d_flex fd_r ai_ct jc_ct' onClick={this._onDelete}>
                                    <Image src={asste1.delete} mode="widthFix" className='cover_icon' />
                                    <Text className='sm_label gray_label ml_5'>删除</Text>
                                </View>
                                <View className='toggle_btn d_flex fd_r ai_ct jc_ct' onClick={this._onEdit}>
                                    <Image src={asste1.edit} mode="widthFix" className='cover_icon' />
                                    <Text className='sm_label gray_label ml_5'>编辑</Text>
                                </View>
                                <Button open-type='share' onShareAppMessage={this.onShareAppMessage} className='btn d_flex fd_r ai_ct jc_ct'>
                                    <Image src={asste1.share} mode="widthFix" className='cover_icon' />
                                    <Text className='sm_label gray_label ml_5'>分享</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                    <View className='tog_boxs d_flex fd_r ai_ct'>
                        <View className='tog_box tog_left' onClick={() => Taro.navigateTo({ url: menu.askInvite + '?askId=' + desc.askId })}>
                            <Image src={asste1.invite} mode="widthFix" className='icon_cover' />
                            <Text className='c33_label sm_label fw_label'>邀请回答</Text>
                        </View>
                        <View className='tog_box' onClick={() => Taro.navigateTo({ url: menu.whiteQust + '?askId=' + askId + '&title=' + desc.title + '&whitetip=' + Taro.getStorageSync('whiteTips') })}>
                            <Image src={asste1.edit} mode="widthFix" className='icon_cover' />
                            <Text className='c33_label sm_label fw_label'>写回答</Text>
                        </View>
                    </View>


                    <View className='d_flex fd_r ai_ct jc_sb p_15 layer_bt'>
                        <View className='d_flex fd_r ai_ct'>
                            <Text className='c33_label lg_label fw_label'>回答</Text>
                            <Text className='default_label tip_label pl_5'>{replyTotal}</Text>
                        </View>
                    </View>
                    <View className='qusts'>
                        {
                            replyList_t.map((ask: any, index) => {

                                const on = status === index

                                return (
                                    <View className={on ? 'qust pt_10 pb_15 border_bt bg_box pl_20 pr_20' : 'qust pt_10 pb_15 border_bt pl_20 pr_20'} key={'ask' + index}>
                                        <View className='d_flex fd_r ai_ct jc_sb pb_10'>
                                            <View className='d_flex fd_r ai_ct'>
                                                <Image src={ask.avatar} className='qust_img' />
                                                <View className='d_flex fd_c ml_10'>
                                                    <View className='d_flex fd_r ai_ct '>
                                                        <Text className='default_label c33_label fw_label'>{ask.nickname}</Text>
                                                        {
                                                            replyId === 0 ?
                                                                <View className='adopt_btn ml_10' onClick={this._adopt.bind(this, ask.replyId)}>
                                                                    <Text className='sm_label sred_label'>采纳</Text>
                                                                </View>
                                                                : null}
                                                        {
                                                            replyId === ask.replyId ?
                                                                <View className='adopt_onbtn ml_10 d_flex fd_r ai_ct'>
                                                                    <Image src={asset.gold_icon} className='gold_icon' />
                                                                    <Text className='orange_label sm_label ml_5'>{`已悬赏${integral}学分`}</Text>
                                                                </View>
                                                                : null}
                                                    </View>
                                                    <Text className='default_label c33_label'>{formatTimeStampToTime(ask.pubTime * 1000)}</Text>
                                                </View>
                                            </View>
                                            <View className='rows' onClick={() => { Taro.navigateTo({ url: menu.awriteComt + '?askId=' + ask.replyId + '&ctype=' + 34 }) }}>
                                                <Image src={asste1.edit} mode="widthFix" className='icon_cover' />
                                                <Text className='sm_label tip_label'>评论</Text>
                                            </View>
                                        </View>
                                        <View className='mb_10'>
                                            <Text className='default_label c33_label'>{ask.content}</Text>
                                        </View>
                                        <View className='d_flex fd_r jc_sb'>
                                            {
                                                ask.galleryDTOList.length > 0 && ask.galleryDTOList.map((it, idx) => {
                                                    return (
                                                        <Image className='mr_10' key={'it' + idx} src={it.fpath}
                                                            style={{ width: ((windowWidth - 60) / 2).toFixed(0) + 'rpx', height: ((windowWidth - 60) / 2).toFixed(0) + 'rpx' }}
                                                            onClick={this.onViewImgs.bind(this, ask.galleryDTOList, idx)}
                                                        />
                                                    )
                                                })
                                            }
                                        </View>


                                        <View className='d_flex fd_r jc_sb pt_10 '>
                                            {
                                                ask.accept == true ?
                                                    <View className='d_flex fd_r ai_ct jc_ct col_1' onClick={this._approvals.bind(this, ask, index)}>
                                                        <Image src={asste1.parse_on} mode="widthFix" className='ask_icon' />
                                                        <Text className='sm_label tip_label ml_5 sred_label'>{ask.approval}赞同</Text>
                                                    </View>
                                                    :
                                                    <View className='d_flex fd_r ai_ct jc_ct col_1' onClick={this._approval.bind(this, ask, index)}>
                                                        <Image src={asste1.parse} mode="widthFix" className='ask_icon' />
                                                        <Text className='sm_label tip_label ml_5'>{ask.approval}赞同</Text>
                                                    </View>
                                            }

                                            <View className='d_flex fd_r ai_ct jc_ct col_1' onClick={() => Taro.navigateTo({ url: menu.AskComment + '?askId=' + ask.replyId + '&ctype=' + 34 })}>
                                                <Image src={asste1.comt} mode="widthFix" className='ask_icon' />
                                                <Text className='sm_label tip_label ml_5'>{ask.comment}</Text>
                                            </View>
                                            <Button open-type='share' onShareAppMessage={this.onShareAppMessage} className='btn_c d_flex fd_r ai_ct jc_ct'>
                                                <Image src={asste1.share} mode="widthFix" className='cover_icon' />
                                                <Text className='sm_label gray_label ml_5'>分享</Text>
                                            </Button>
                                        </View>
                                    </View>
                                )
                            })
                        }
                        {
                            replyList_t.length == 0 ?
                                <Comt />
                                : null
                        }
                    </View>
                    {
                        page < pages - 1 ?
                            <View className='pt_15 pb_15 d_flex fd_r ai_ct jc_ct border_bt border_tp mb_15' onClick={this.onMore}>
                                <Text className='sm_label gray_label'>更多回答</Text>
                            </View>
                            : null
                    }
                    <View className='pl_15 pr_15 pt_20 pb_10' >
                        <Text className='lg18_label c33_label fw_label'>{`评论(${comts.length})`}</Text>
                    </View>

                    {
                        comments.length > 0 ?

                            <View className='pl_15 pr_15' style={{ paddingBottom: 40 + 'rpx' }}  >
                                {
                                    comments.map((item, index) => {
                                        const on = comments.length - 1 === index;
                                        return (
                                            <View key={'item' + index} className={on ? '' : 'item_bt'}>
                                                <Eval
                                                    comIdx={index}
                                                    val={item}
                                                    onParse={this._parse}
                                                />
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            :
                            <Comt />
                    }

                    {/* {
                    comments.length > 0  ?  */}
                    <View className='pt_12 pb_12 d_flex fd_r ai_ct jc_ct border_tp'
                        onClick={() => Taro.navigateTo({ url: menu.AskComment + '?askId=' + askId })}
                    >
                        <Text className='gray_label sm_label'>查看全部评论 &gt;</Text>
                    </View>
                    {/* :null} */}


                </View>

                <View className='footer'>
                    <Text className='default_label gray_label pl_20'>{`${comts.length}人评论`}</Text>
                    <View className='input ml_10 mr_20' onClick={this._onComt}>
                        <Text className='tip_label default_label'>请输入评论</Text>
                    </View>
                </View>
            </View>
        )

    }
}

export default qustShow as ComponentClass