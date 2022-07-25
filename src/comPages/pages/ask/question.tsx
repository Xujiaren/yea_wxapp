

import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'

import Eval from '../../components/comment'
import Auth from '../../../components/Auth'
import Comt from '../../../components/General/Comt'
import { formatTimeStampToTime } from '../../../utils/common'
import GrapTmp from '../../../pages/index/grapTmp'
import { emojis, emojiToPath, textToEmoji } from '../../../utils/emoji';
import asset from '../../../config/asset'
import menu from '../../../config/menu'
import inter from '../../../config/inter'
import api from '../../../services/api'

import asste1 from '../../config/asset'


import '../../../config/theme.css';
import './question.less'


type PageState = {
    content: string,
    navHeight: number,//刘海高度
    capHeight: number,//胶囊高度
    status: number,
    askId: number,
    desc: {
        title: string,
        content: string,
        gallery: Array<any>,
        hit: number,
        replyNum: number,
        nickname: string,
        avatar: string,
        comment: number,
        followNum: number,
        isFollow: boolean,
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
    replyTotal: number,
    sort: Array<string>,
    sortIdx: number,
    comts: Array<any>,
    userId: 0,
    isFollow: boolean,
    comment: number,
    typ: number,
    isShare: number,
    page: number,
    pages: number,
}


class question extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '我的提问',
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
            navHeight: 0,
            capHeight: 0,
            status: 1000,
            desc: {},
            replyList: [],
            sort: ['最新', '最热'],
            sortIdx: 0,
            comts: [],
            userId: 0,
            isFollow: false,
            comment: 0,
            typ: 0,
            isShare: 0,
            page: 0,
            pages: 0,
        }

    }

    componentWillMount() {
        var that = this;
        that._setbatHeight();


        const { askId, title } = that.$router.params;

        that.setState({
            askId: parseInt(askId)
        })


        Taro.setNavigationBarTitle({
            title: title === undefined ? '提问详情' : title,
        })

    }

    componentDidMount() {
        var that = this;

        that._askdesc();
        that._replyAsk();
        that._getComt();
        that._getUser();
    }

    componentDidShow() {

        var that = this;
        that._replyAsk();
        that._getComt();
    }

    componentWillUnmount() {

    }

    componentDidHide() { }


    // 顶部高度适应
    _setbatHeight() {

        var that = this
        var sysinfo = Taro.getSystemInfoSync()
        var navHeight: number = 44
        var cpHeight: number = 40
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


    //  下啦刷新
    onPullDownRefresh() {
        var that = this;

        Taro.showNavigationBarLoading();

        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);

    }

    _getUser() {
        var that = this;

        api.get(inter.User)
            .then((res) => {
                console.log(res)
                if (res.data.status) {
                    let userData = res.data.data;

                    that.setState({
                        userId: userData.userId,
                    })
                }

            })
    }


    _askdesc() {

        var that = this;
        const { askId, isShare } = that.state;

        api.get(inter.askdesc + askId)
            .then((res) => {
                if (res.data.status) {
                    that.setState({
                        desc: res.data.data,
                        isFollow: res.data.data.isFollow,
                        comment: res.data.data.comment,
                        isShare: res.data.data.isShare
                    })
                    if (res.data.data.isShare == 1) {
                        Taro.hideShareMenu()
                    }else{
                        wx.showShareMenu({

                            withShareTicket: true,
                
                            menus: ['shareAppMessage', 'shareTimeline']
                        })
                    }
                }
            })

    }

    //回答的问题
    _replyAsk() {

        let that = this;
        const { askId, sortIdx, replyList } = that.state;

        api.get(inter.replyAsk + askId, {
            suid: 0,
            page: this.page,
            sort: sortIdx
        }).then((res) => {
            if (res.data.status) {
                let arr = res.data.data;
                if (this.page === 0) {
                    this.page = arr.page
                    this.pages = arr.pages
                    var tList = arr.items
                } else {
                    // if(replyList.filter(itm=>itm.replyId==arr.items[0].replyId).length>0){
                    //     var tList: any = replyList.splice(this.page*10-1,arr.items.length,arr.items[0],arr.items[1],arr.items[2],arr.items[3],arr.items[4],arr.items[5],arr.items[6],arr.items[7],arr.items[8],arr.items[9])
                    // }else{
                        var tList: any = replyList.concat(arr.items)
                    // }
                    
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

    // 评论
    _getComt() {
        let that = this;
        const { askId } = that.state;

        api.get(inter.askPinlun + askId).then((res) => {
            console.log(res)
            if (res.data.status) {

                that.setState({
                    comts: res.data.data.items.filter(item => item.isTop == 1 ? item : null)
                })
            }
        })
    }

    _parse = (val, comIdx) => {

        let that = this;
        const { comts, userId } = that.state;

        if (userId > 0) {

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

        } else {
            that._onLogin();
        }



    }


    _onSelect = (index) => {
        var that = this;
        that.setState({
            status: index
        })
    }

    handleStop = (e) => {
        e.stopPropagation()
    }



    _actions = (type, value, index) => {
        var that = this;
        const { userId, isFollow, askId, comts, desc, replyList } = that.state;

        if (userId > 0) {
            if (type === 'Follow') {

                if (isFollow) {

                    api.post(inter.RemovesFollow + askId, {
                        ctype: 10
                    }).then((res) => {
                        if (res.data.status) {
                            that.setState({
                                isFollow: false
                            })

                            Taro.showToast({
                                title: '取消成功',
                                icon: 'none',
                                duration: 1000,
                            })
                        }
                    })

                } else {

                    api.post(inter.PushlishFollow + askId, {
                        ctype: 10
                    }).then((res) => {
                        if (res.data.status) {
                            that.setState({
                                isFollow: true
                            })

                            Taro.showToast({
                                title: '关注成功',
                                icon: 'none',
                                duration: 1000,
                            })
                        }
                    })
                }
            } else if (type === 'Comment') {

                Taro.navigateTo({
                    url: menu.awriteComt + '?askId=' + askId + '&whitetip=' + Taro.getStorageSync('whiteTipsss')
                })

            } else if (type === 'Invite') {
                Taro.navigateTo({ url: menu.askInvite + '?askId=' + desc.askId + '&title=' + desc.title + '&img=' + (desc.gallery.length === 0 ? '' : desc.gallery[0].fpath) })
            } else if (type === 'whiteQust') {
                Taro.navigateTo({ url: menu.whiteQust + '?askId=' + askId + '&title=' + desc.title + '&whitetip=' + Taro.getStorageSync('whiteTips') })
            } else if (type === 'Approval') {

                api.post(inter.askPost + value.replyId, {
                    ctype: 34,
                    etype: 100,
                }).then((res) => {
                    console.log(res)
                    if (res.data.status) {
                        Taro.showToast({
                            title: '赞同',
                            icon: 'none',
                            duration: 1000
                        })
                        this.setState({
                            replyList:replyList.map(item=>item.replyId==value.replyId?{...item,accept:true,approval:item.approval+1}:item),
                        })
                        // that._replyAsk();

                        // let rList = replyList;
                        // rList[index].approval = rList[index].approval + 1

                        // that.setState({
                        //     replyList: rList
                        // })
                    }
                })

            } else if(type ==='inApproval'){
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
                        // that._replyAsk();

                        // let rList = replyList;
                        // rList[index].approval = rList[index].approval + 1

                        // that.setState({
                        //     replyList: rList
                        // })
                    }
                })

            }else if (type === 'AskComment') {
                Taro.navigateTo({ url: menu.awriteComt + '?askId=' + value.replyId + '&ctype=' + 34 })
            }

        } else {
            that._onLogin();
        }
    }

    // 分享详情页
    onShareAppMessage = (ops) => {
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
    onShares = () => {
        Taro.showToast({
            title: '不可分享',
            icon: 'none',
            duration: 1500
        })
    }
    _onLogin = () => {

        var that = this
        that.refs.auth.doLogin();

    }

    _onLoadCallBack = () => {
        var that = this

        that._getUser();
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


    _askQust = (item) => {

        var that = this;
        const { userId } = that.state;

        if (userId > 0) {
            Taro.navigateTo({ url: menu.askQust });

        } else {

            that._onLogin();
        }


    }
    onMore = () => {
        var self = this;

        const { page, pages } = this.state

        if (page < pages) {
            this.page = this.page + 1;

            self._replyAsk();
        }
    }
    onRight = (val) => {
        console.log(val)
        api.post(inter.aCollect + val.replyId, {
            ctype: 34
        }).then(res => {
            if (res.data.status) {
                Taro.showToast({
                    title: '收藏成功',
                    icon: 'success',
                    duration: 1500
                })
                this._replyAsk()
            } else {
                Taro.showToast({
                    title: '已收藏',
                    icon: 'none',
                    duration: 1500
                })
            }
        })
    }
    render() {

        const { status, askId, desc, typ, replyList, replyTotal, sort, sortIdx, comts, isFollow, comment, isShare, page, pages } = this.state;

        let comments = comts.slice(0, 5);

        let replyList_r = replyList.slice(0, 5);
        let replyList_t = replyList;
        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {

        }

        return (
            <View className='wrap fade bg'>
                <View style={{ paddingBottom: 120 + 'rpx' }}>
                    <View className='pl_20 pr_20'>
                        <View className='dsf pt_20  pt_15'>
                        {
                                desc.integral > 0 ?
                                    <View className='item_tips'>
                                        <Image src={asset.gold_icon} className='gold_icon' />
                                        <Text className='smm_label'>{desc.integral}学分</Text>
                                    </View>
                                    : null
                            }
                            <Text className='lg_label c33_label fw_label'>{desc.title}</Text>
                        </View>
                        <View className='header d_flex fd_r ai_ct pt_15 pb_10'>
                            <Image src={desc.avatar} className='header_img ' />
                            <Text className='default_label c33_label fw_label pl_10'>{desc.nickname}</Text>
                        </View>


                        <View className='sm_label c33_label'>
                            <GrapTmp content={desc.content} ></GrapTmp>
                        </View>

                        {
                            desc.gallery.map((item, index) => {
                                return (
                                    <Image src={item.fpath} mode="widthFix" className='q_img mt_10' key={'item' + index} />
                                )
                            })
                        }


                        <View className='d_flex fd_r jc_sb ai_ct mt_10 mb_20'>
                            <View>
                                <Text className='tip_label sm_label'>{desc.replyNum}个回答 · {desc.followNum}个关注 · {desc.hit}个浏览</Text>
                            </View>
                            <View className='d_flex fd_r ai_ct'>

                                <View className='focus_btn d_flex fd_r ai_ct jc_ct' onClick={this._actions.bind(this, 'Follow')}>
                                    <Text className='sm_label sred_label'>{!isFollow ? '+关注问题' : '已关注'}</Text>
                                </View>
                                {
                                    isShare == 1 ?
                                        <Button onClick={this.onShares} className='btn d_flex fd_r ai_ct jc_ct'>
                                            <Image src={asste1.share} mode="widthFix" className='cover_icon' />
                                            <Text className='sm_label gray_label ml_5'>分享</Text>
                                        </Button>
                                        :
                                        <Button open-type='share' onShareAppMessage={this.onShareAppMessage} className='btn d_flex fd_r ai_ct jc_ct'>
                                            <Image src={asste1.share} mode="widthFix" className='cover_icon' />
                                            <Text className='sm_label gray_label ml_5'>分享</Text>
                                        </Button>
                                }
                            </View>
                        </View>
                    </View>
                    <View className='tog_boxs d_flex fd_r ai_ct'>
                        <View className='tog_box tog_left' onClick={this._actions.bind(this, 'Invite')}   >
                            <Image src={asste1.invite} mode="widthFix" className='icon_cover' />
                            <Text className='c33_label sm_label fw_label'>邀请回答</Text>
                        </View>
                        <View className='tog_box' onClick={this._actions.bind(this, 'whiteQust')}>
                            <Image src={asste1.edit} mode="widthFix" className='icon_cover' />
                            <Text className='c33_label sm_label fw_label'>写回答</Text>
                        </View>
                    </View>

                    <View className='d_flex fd_r ai_ct jc_sb p_15 layer_bt'>
                        <View className='d_flex fd_r ai_ct'>
                            <Text className='c33_label lg_label fw_label'>回答</Text>
                            <Text className='default_label tip_label pl_5'>{replyTotal}</Text>
                        </View>
                        <View className='d_flex fd_r ai_ct '>
                            {
                                sort.map((item, index) => {
                                    const on = sortIdx === index;
                                    return (
                                        <Text className={on ? 'default_label sred_label ml_5' : 'default_label c33_label ml_5'} key={'item' + index} onClick={() => this.setState({ sortIdx: index }, () => {
                                            this._replyAsk()
                                        })}>{item}</Text>
                                    )
                                })
                            }
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
                                                    <Text className='default_label c33_label fw_label'>{ask.nickname}</Text>
                                                    <Text className='default_label c33_label'>{formatTimeStampToTime(ask.pubTime * 1000)}</Text>
                                                </View>
                                                {
                                                    ask.collect ?
                                                        <View className='adopt_btn ml_10'>
                                                            <Text className='sm_label sred_label'>已采纳</Text>
                                                        </View>
                                                        : null
                                                }
                                            </View>
                                            <View className='rows'>
                                                <View onClick={this._actions.bind(this, 'AskComment', ask)}>
                                                    <Image src={asste1.edit} mode="widthFix" className='icon_cover' />
                                                    <Text className='sm_label tip_label'>评论</Text>
                                                </View>
                                                <View className='ml_20' onClick={() => {
                                                    this.setState({
                                                        replyList: replyList.map((item, idx) => idx == index ? { ...item, istrue: 1 } : item)
                                                    })
                                                }}>...</View>
                                            </View>
                                        </View>
                                        {
                                            ask.istrue == 1 ?
                                                <View className='hhbox' onClick={() => {
                                                    this.setState({
                                                        replyList: replyList.map((item, idx) => idx == index ? { ...item, istrue: 0 } : item)
                                                    })
                                                }}>
                                                    <View className='tipss'></View>
                                                </View>
                                                : null
                                        }
                                        {
                                            ask.istrue == 1 ?
                                                <View className='posts'>
                                                    <View className='wordss'>
                                                        <View className='bodd' onClick={this.onRight.bind(this, ask)}>
                                                            <Image src={ask.collect ? asset.likess_o : asset.likess} className='size' />
                                                            <Text className={ask.collect ? 'color_0' : 'asd'}>收藏</Text>
                                                        </View>
                                                        <View className='bods' onClick={() => { Taro.navigateTo({ url: menu.fdback }) }}>
                                                            <Image src={asset.posts} className='sizes' />
                                                            <Text className='asd'>举报</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                : null
                                        }

                                        <View className='mb_10'>
                                            <Text className='default_label c33_label' >{ask.content}</Text>
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
                                                ask.accept ?
                                                    <View className='d_flex fd_r ai_ct jc_ct col_1' onClick={this._actions.bind(this, 'inApproval', ask, index)}
                                                    >
                                                        <Image src={asste1.parse_on} mode="widthFix" className='ask_icon' />
                                                        <Text className='sm_label tip_label ml_5 sred_label'>{ask.approval}赞同</Text>
                                                    </View>
                                                    :
                                                    <View className='d_flex fd_r ai_ct jc_ct col_1' onClick={this._actions.bind(this, 'Approval', ask, index)}
                                                    >
                                                        <Image src={asste1.parse} mode="widthFix" className='ask_icon' />
                                                        <Text className='sm_label tip_label ml_5'>{ask.approval}赞同</Text>
                                                    </View>
                                            }

                                            <View className='d_flex fd_r ai_ct jc_ct col_1' onClick={() => Taro.navigateTo({ url: menu.AskComment + '?askId=' + ask.replyId + '&ctype=' + 34 })}
                                            >
                                                <Image src={asste1.comt} mode="widthFix" className='ask_icon' />
                                                <Text className='sm_label tip_label ml_5'>{ask.comment}</Text>
                                            </View>
                                            {/* <View className='d_flex fd_r ai_ct jc_ct col_1' onClick={this._actions.bind(this, 'AskComment', ask)}
                                            >
                                                <Image src={asste1.comt} mode="widthFix" className='ask_icon' />
                                                <Text className='sm_label tip_label ml_5'>{ask.comment}</Text>
                                            </View> */}
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

                    <View className={'pl_15 pr_15'} >
                        <Text className='lg18_label c33_label fw_label'>{`精选评论(${comts.length})`}</Text>
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
                    {/* 
                    {
                        comments.length > 0 ? */}
                    <View className='pt_12 pb_12 d_flex fd_r ai_ct jc_ct border_tp'
                        onClick={() => Taro.navigateTo({ url: menu.AskComment + '?askId=' + askId })}
                    >
                        <Text className='gray_label sm_label'>查看全部评论 &gt;</Text>
                    </View>
                    {/* : null} */}


                </View>
                <View className='footer '>
                    <Text className='default_label gray_label pl_20'>{`${comment}人评论`}</Text>
                    <View className='input ml_10 mr_20' onClick={this._actions.bind(this, 'Comment')}>
                        <Text className='tip_label default_label'>请输入评论</Text>
                    </View>
                </View>


                <View className='top' onClick={this._askQust}>
                    <Image src={asset.edit_icon} className='edit_icon' />
                    <Text className='default_label white_label mt_2'>提问</Text>
                </View>

                <Auth ref={'auth'} success={() => {
                    this._onLoadCallBack()
                }} />
            </View>
        )

    }
}

export default question as ComponentClass





// import { ComponentClass } from 'react'
// import Taro, { Component, } from '@tarojs/taro'
// import { View ,Text,Image,Button} from '@tarojs/components'

// import Eval from '../../components/comment'
// import Auth from '../../../components/Auth'
// import Comt from '../../../components/General/Comt'
// import {formatTimeStampToTime} from '../../../utils/common'

// import asset from '../../../config/asset'
// import menu from '../../../config/menu'
// import inter from '../../../config/inter'
// import api from '../../../services/api'

// import asste1 from '../../config/asset'


// import  '../../../config/theme.css';
// import './question.less'



// class question extends Component<{}, PageState> {
//     config = {
//         navigationBarTitleText: '我的提问',
//         enablePullDownRefresh:true
//     }


//     constructor (props) {
//         super(props)

//         this.state = {
//             content:'',
//             askId:0,
//             navHeight:0,
//             capHeight:0,
//             status:1000,
//             desc:{},
//             replyList:[],
//             sort:['最新','最热'],
//             sortIdx:0,
//             comts:[],
//             userId:0,
//             isFollow:false,
//             comment:0,
//         }

//     }



//     componentWillMount () {   
//         var that = this;
//         that._setbatHeight();


//         const {askId,title} = that.$router.params;

//         that.setState({
//             askId:parseInt(askId)
//         })


//         Taro.setNavigationBarTitle({
//             title: title === undefined ? '提问详情' : title,
//         })

//     }

//     componentDidMount () { 
//         var that = this ;

//         that._askdesc();
//         that._replyAsk();
//         that._getComt();
//         that._getUser();
//     }

//     componentDidShow(){

//         var that = this ;
//         that._replyAsk();
//         that._getComt();
//     }

//     componentWillUnmount () {

//     }

//     componentDidHide () { }


//     // 顶部高度适应
//     _setbatHeight(){

//         var that = this
//         var sysinfo =  Taro.getSystemInfoSync()
//         var navHeight:number = 44
//         var cpHeight:number = 40
//         var isiOS = sysinfo.system.indexOf('iOS') > -1
//         if (!isiOS) {
//             cpHeight = 48
//             navHeight = sysinfo.statusBarHeight;
//         } else {
//             cpHeight = 40
//             navHeight = sysinfo.statusBarHeight;
//         }

//         that.setState({
//             navHeight: navHeight,
//             capHeight: cpHeight
//         })

//     }


//     // //  下啦刷新
//     onPullDownRefresh(){
//         var that = this;

//         Taro.showNavigationBarLoading();

//         setTimeout(function () {
//             Taro.stopPullDownRefresh();
//             Taro.hideNavigationBarLoading()
//         }, 1000);

//     }

//     _getUser(){
//         var that  = this ;

//         api.get(inter.User)
//         .then((res)=>{

//             if(res.data.status){
//                 let userData = res.data.data;

//                 that.setState({
//                     userId:userData.userId,
//                 })
//             }

//         })
//     }


//     _askdesc(){

//         var that = this ;
//         const {askId} = that.state;

//         api.get(inter.askdesc + askId)
//         .then((res)=>{
//             if(res.data.status){
//                 that.setState({
//                     desc:res.data.data,
//                     isFollow:res.data.data.isFollow,
//                     comment:res.data.data.comment,
//                 })
//             }
//         })

//     }

//     //回答的问题
//     _replyAsk(){

//         let that = this ;
//         const {askId,sortIdx} = that.state;

//         that.setState({
//             replyList:[]
//         })

//         api.get(inter.replyAsk + askId,{
//             suid:0,
//             page:0,
//             sort:sortIdx
//         }).then((res)=>{

//             if(res.data.status){
//                 let ask = res.data.data ;

//                 that.setState({
//                     replyList:ask.items,
//                     replyTotal:ask.total
//                 })
//             }

//         })

//     }

//     // // 评论
//     _getComt(){
//         let that = this ;
//         const {askId} = that.state ;

//         api.get(inter.pubComment + askId,{
//             ctype:10
//         }).then((res)=>{
//             if(res.data.status){

//                 that.setState({
//                     comts:res.data.data
//                 })
//             }
//         })
//     }

//     _parse = (val,comIdx) => {

//         let that = this ;
//         const {comts,userId} = that.state;

//         if(userId > 0){

//             if(val.like){
//                 api.post(inter.RemoveLike+val.commentId).then((res)=>{
//                     if(res.data.status){
//                         comts[comIdx].like = !comts[comIdx].like 
//                         comts[comIdx].praise = comts[comIdx].praise - 1
//                         that.setState({
//                             comts:comts
//                         })
//                     }
//                 })
//             } else {
//                 api.post(inter.PublishLike+val.commentId).then((res)=>{
//                     if(res.data.status){
//                         comts[comIdx].like = !comts[comIdx].like 
//                         comts[comIdx].praise = comts[comIdx].praise + 1
//                         that.setState({
//                             comts:comts
//                         })
//                     }
//                 })
//             }

//         } else {
//             that._onLogin();
//         }



//     } 


//     _onSelect = (index) =>{
//         var that = this;
//         that.setState({
//             status : index
//         })
//     }

//     handleStop = (e) =>{
//         e.stopPropagation()
//     }



//     _actions(type,value,index){
//         var that = this;
//         const  {userId,isFollow,askId,comts,desc,replyList} =  that.state;

//         if(userId > 0){
//             if(type === 'Follow'){

//                 if(isFollow){

//                     api.post(inter.RemovesFollow + askId,{
//                         ctype:10
//                     }).then((res)=>{
//                         if(res.data.status){
//                             that.setState({
//                                 isFollow:false
//                             })

//                             Taro.showToast({
//                                 title:'取消成功',
//                                 icon:'none',
//                                 duration:1000,
//                             })
//                         }
//                     })

//                 } else {

//                     api.post(inter.PushlishFollow + askId,{
//                         ctype:10
//                     }).then((res)=>{
//                         if(res.data.status){
//                             that.setState({
//                                 isFollow:true
//                             })

//                             Taro.showToast({
//                                 title:'关注成功',
//                                 icon:'none',
//                                 duration:1000,
//                             })
//                         }
//                     })
//                 }
//             }  else if(type === 'Comment'){

//                 Taro.navigateTo({
//                     url:menu.awriteComt + '?askId=' + askId
//                 })

//             } else if(type === 'Invite'){
//                 Taro.navigateTo({url:menu.askInvite + '?askId=' + desc.askId + '&title=' + desc.title + '&img=' + (desc.gallery.length === 0  ? '' :  desc.gallery[0].fpath) })
//             }  else if(type === 'whiteQust'){
//                 Taro.navigateTo({url:menu.whiteQust + '?askId=' + askId + '&title=' + desc.title})
//             }  else if(type === 'Approval'){

//                 api.post(inter.askPost + value.replyId,{
//                     ctype:34,
//                     etype:100,
//                 }).then((res)=>{
//                     if(res.data.status){
//                         Taro.showToast({
//                             title:'赞同',
//                             icon:'none',
//                             duration:1000
//                         })
//                         // that._replyAsk();

//                         let rList = replyList;
//                         rList[index].approval = rList[index].approval + 1

//                         that.setState({
//                             replyList:rList
//                         })
//                     }
//                 })

//             }  else if(type === 'AskComment'){
//                 Taro.navigateTo({url:menu.AskComment + '?askId=' + value.replyId+ '&ctype=' + 34})
//             }

//         } else {
//             that._onLogin();
//         }
//     }

//     // 分享详情页
//     onShareAppMessage = (ops) =>{
//         var that = this ;
//         const {desc} = that.state;

//         let url = '' ;
//         if(desc.gallery.length > 0){
//             url = desc.gallery[0].fpath ;
//         }

//         if (ops.from === 'button') {
//             // 来自页面内转发按钮
//             // console.log(ops.target)
//         }
//         return {
//             title: desc.title,
//             path: menu.question + '?askId=' + desc.askId + '&title=' + desc.title ,
//             imageUrl:url,
//             success: function (res) {
//                 // 转发成功
//             },
//             fail: function (res) {
//                 // 转发失败
//             }
//         }
//     }



//     _askQust = (item) => {

//         var that = this ;
//         const {userId} = that.state ;

//         if(userId > 0 ){
//             Taro.navigateTo({url:menu.askQust});

//         } else {

//             that._onLogin();
//         }


//     }

//     _onLogin = () => {

//         var that  = this 
//         that.refs.auth.doLogin();

//     }

//     _onLoadCallBack = () => {
//         var that = this

//         that._getUser();
//     }




//     render(){


//         const {status,askId,desc,replyList,replyTotal,sort,sortIdx,comts,isFollow,comment} = this.state;

//         // let comments = comts.slice(0,5);

//         // let replyList_r = replyList.slice(0,5);

//         // let windowWidth = 375
//         // try {
//         //     var res = Taro.getSystemInfoSync();
//         //     windowWidth = res.windowWidth;
//         // }  catch (e) {

//         // }

//         // if (Object.keys(desc).length === 0) return null;

//         return (
//             <View className='wrap fade bg'>


//                 <View className='footer '>
//                      <Text className='default_label gray_label pl_20'>{`${comment}人评论`}</Text>
//                      <View className='input ml_10 mr_20' onClick={this._actions.bind(this,'Comment')}>
//                          <Text className='tip_label default_label'>请输入评论</Text>
//                      </View>
//                 </View>
//                 <View className='top'   onClick={this._askQust}>
//                      <Image src={asset.edit_icon} className='edit_icon' />
//                      <Text className='default_label white_label mt_2'>提问</Text>
//                 </View>

//                 <Auth ref={'auth'} success={() => {
//                     console.log('dsddd')
//                     this._onLoadCallBack()
//                 }}/>
//             </View>

//         )
//     }

// }

// export default question as ComponentClass