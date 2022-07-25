import { ComponentClass } from 'react'
import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text, Image, Video, ScrollView, Progress } from '@tarojs/components'




import Auth from '../../components/Auth'
import ConsultCourse from '../../components/ConsultCourse'
import Eval from '../../components/Eval'
import Comt from '../../components/General/Comt'

import menu from '../../config/menu';
import asset from '../../config/asset';
import api from '../../services/api'
import inter from '../../config/inter'

import { dateDiff, percent2percent25 } from '../../utils/common'

import GrapTmp from './grapTmp'

import '../../config/theme.css';
import './consultDesc.less'

type PageState = {
    article: any,
    load: boolean,
    collectNum: number,
    isLike: boolean,
    likeNum: number,
    consultDesc: {
        articleId: number,
        articleImg: string,
        atype: number,
        canShare: number,
        categoryId: number,
        comment: number,
        content: string,
        contentId: number,
        ctype: number,
        gallery: Array<{}>,
        hit: number,
        isTop: 1,
        isLike: false,
        pubTime: number,
        pubTimeFt: string,
        summary: string,
        teacherId: number,
        title: string,
        ttype: number,
    },
    relaList: Array<{
        articleId: number,
        articleImg: string,
        atype: number,
        canShare: number,
        categoryId: number,
        comment: number,
        content: string,
        contentId: number,
        ctype: number,
        gallery: Array<{}>,
        hit: number,
        isTop: 1,
        isLike: false,
        likeNum: number,
        pubTime: number,
        pubTimeFt: string,
        summary: string,
        teacherId: number,
        title: string,
        ttype: number,
    }>,
    topComms: Array<{
        avatar: string,
        childList: Array<{}>,
        commentId: number,
        content: string,
        contentId: number,
        ctype: string,
        galleryList: Array<{}>,
        isAdmin: number,
        parentId: number,
        praise: number,
        pubIp: string,
        pubTime: number,
        pubTimeFt: string,
        score: number,
        userId: number,
        username: string,
        like: boolean
    }>,
    arcticle_id: number,
    loginStatus: boolean,
    userId: number,
    voteType: number,
    voteList: Array<{
        progress: number,
        status: number,
        title: string,
    }>,
    voteInfo: {
        topicId: number,
        categoryId: number,
        userId: number,
        courseId: number,
        chapterId: number,
        cchapterId: number,
        title: string,
        ttype: number,
        mtype: number,
        answer: string,
        analysis: string,
        isAnswer: false
        url: string,
        userAnswer: {
            userId: number,
            testId: number,
            topicId: number,
            topicAnswer: string,
            answer: string,
            isCorrect: number,
            sortOrder: number,
            status: number,
        },
        canVote: boolean,
        optionList: Array<{}>,
        optionIds: Array<any>,
    },
    isVote: number,
    comment: number,
}

class consultDesc extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '资讯详情',
        enablePullDownRefresh: true
    }

    constructor() {
        super(...arguments)
        this.state = {
            article: "",
            load: false,
            arcticle_id: 0,
            collectNum: 0,
            consultDesc: {},
            relaList: [],
            isLike: false,
            likeNum: 0,
            topComms: [],
            loginStatus: true,
            userId: 0,
            canShare: 0,
            voteType: 0, // 0 文字  1 图片
            voteList: [{
                progress: 4300,
                status: 0,
                title: '北京去玩儿',
            }, {
                progress: 390,
                status: 0,
                title: '南京夫子庙',
            }, {
                progress: 189,
                status: 1,
                title: '杭州西湖',
            }],
            voteInfo: {},
            isVote: 0,
            comment: 0,
        }

        this.onShareAppMessage = this.onShareAppMessage.bind(this)
        this._whiteCommt = this._whiteCommt.bind(this);
        this._onLoadCallBack = this._onLoadCallBack.bind(this);
        this._parse = this._parse.bind(this);
    }

    componentWillMount() {
        const { articleId, cousultName, scene, fromuser } = this.$router.params


        this.setState({
            arcticle_id: parseInt(articleId)
        })
        Taro.setNavigationBarTitle({
            title: cousultName !== undefined ? cousultName : '资讯详情',
        })


        if (scene) {
            const fuser = decodeURIComponent(scene).split('=');
            if (fuser.length > 1) {
                Taro.setStorageSync('fuser', fuser[1]);
            }
        }
        if (fromuser) {
            Taro.setStorageSync('fuser', fromuser);
        }


    }
    componentDidMount() {
        this.getUser();
        this._artDesc();
        this._relaRecomm();
        this._consultComt();
    }
    componentWillUnmount() { }
    componentDidShow() {
        this._consultComt();
    }
    componentDidHide() { }

    componentDidUpdate() {
    }


    //分享课程
    onShareAppMessage = (res) => {

        const { consultDesc, userId, arcticle_id } = this.state

        api.post(inter.userLog, {
            log_type: 1,
            type: 1,
            device_id: 0,
            intro: '分享资讯',
            content_id: consultDesc.articleId,
            param: JSON.stringify({ name: consultDesc.title, cctype: 6, ttype: 0 }),
            from: 0,
        }).then((res) => {
            console.log('ee')
        })
        if (res.from === 'button') {
            // 来自页面内转发按钮
        }
        api.post(inter.userHistory, {
            cctype: 1,
            content_id: consultDesc.articleId,
            ctype: 11,
            etype: 16,
        }).then(res => {
            console.log(res)
        })
        return {
            title: consultDesc.title,
            path: menu.consultDesc + '?articleId=' + consultDesc.articleId + '&cousultName=' + percent2percent25(consultDesc.title) + '&fromuser=' + userId,
            imageUrl: consultDesc.articleImg + '?x-oss-process=image/resize,w_500,h_380,m_pad'
        }
    }
    onShareTimeline() {
        const { consultDesc, userId } = this.state
        api.post(inter.userHistory, {
            cctype: 1,
            content_id: consultDesc.articleId,
            ctype: 11,
            etype: 16,
        }).then(res => {
            console.log(res)
        })
        return {
            title: consultDesc.title,
            query: menu.consultDesc + '?articleId=' + consultDesc.articleId + '&cousultName=' + percent2percent25(consultDesc.title) + '&fromuser=' + userId,
            imageUrl: consultDesc.articleImg,
        }
    }

    onPullDownRefresh() {
        var that = this;
        Taro.showNavigationBarLoading()
        that._artDesc();
        that.getUser();
    }

    _onLoadCallBack() {
        var that = this

        api.get(inter.User)
            .then(res => {
                if (res.data.status) {
                    let userData = res.data.data
                    that.setState({
                        userId: userData.userId,
                    })
                }
            })
        that._consultComt();

    }

    getUser() {
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
    //资讯详情
    _artDesc() {
        var that = this;
        const { arcticle_id } = that.state;
        api.get(inter.ArticleDesc + arcticle_id)
            .then((res) => {
                if (res.data.status) {
                    Taro.hideNavigationBarLoading()
                    Taro.stopPullDownRefresh()
                    let consultDesc = res.data.data;
                    this.setState({
                        load: true,
                        consultDesc: consultDesc,
                        isLike: consultDesc.isLike,
                        likeNum: consultDesc.likeNum,
                        article: consultDesc.content,
                        voteInfo: consultDesc.voteInfo,
                        isVote: consultDesc.isVote,
                        comment: consultDesc.comment
                    })
                    if (consultDesc.canShare === 0) {
                        Taro.hideShareMenu()
                    } else {
                        wx.showShareMenu({

                            withShareTicket: true,

                            menus: ['shareAppMessage', 'shareTimeline']
                        })
                    }

                    if (res.data.message) {
                        if(res.data.message=='您尚未实名认证，请认证后再来！'){
                            Taro.showModal({
                                title: '提示',
                                content: res.data.message,
                                success: function (res) {
                                    if (res.confirm) {
                                        Taro.navigateTo({ url: menu.realAuth })
                                    } else if (res.cancel) {
                                        Taro.navigateTo({ url: menu.realAuth })
                                    }
                                }
                            })
                        }else if(res.data.message=='您不属于本内容的特定开放对象，其他内容同样精彩！'){
                            Taro.showModal({
                                title: '提示',
                                content: res.data.message,
                                success: function (res) {
                                    if (res.confirm) {
                                        Taro.navigateTo({ url:  menu.consultList + '?type=0' })
                                    } else if (res.cancel) {
                                        Taro.navigateTo({ url:  menu.consultList + '?type=0' })
                                    }
                                }
                            })
                            setTimeout(() => {
                                Taro.navigateTo({ url:  menu.consultList + '?type=0' })
                            }, 3000);
                        }else if (res.data.message == '请先登录！') {
                            Taro.showToast({
                                title: res.data.message,
                                icon: 'none',
                                duration: 4000,
                            })
                            setTimeout(() => {
                                getApp().globalData.showLogs = 1
                                Taro.switchTab({
                                    url: '/pages/user/user'
                                })
                            }, 4000);
                        }else{
                            Taro.showModal({
                                title: '提示',
                                content: res.data.message,
                                success: function (res) {
                                    if (res.confirm) {
                                        Taro.navigateTo({ url:  menu.consultList + '?type=0' })
                                    } else if (res.cancel) {
                                        Taro.navigateTo({ url:  menu.consultList + '?type=0' })
                                    }
                                }
                            })
                            setTimeout(() => {
                                Taro.navigateTo({ url:  menu.consultList + '?type=0' })
                            }, 3000);
                        }
                    }
                }else{
                    if(res.data.message=='请先登录！'){
                        Taro.showToast({
                            title:res.data.message,
                            icon:'none',
                            duration:4000,
                        })
                        setTimeout(() => {
                            getApp().globalData.showLogs=1
                            Taro.switchTab({
                                url:'/pages/user/user'
                            })
                        }, 4000);
                    }
                }

            })
    }

    // 相关推荐
    _relaRecomm() {
        var that = this;
        const { arcticle_id } = that.state;

        api.get(inter.Articlerelation + arcticle_id)
            .then((res) => {
                if (res.data.status) {
                    that.setState({
                        relaList: res.data.data
                    })
                }
            })
    }

    // 资讯评论
    _consultComt() {
        var that = this;
        const { arcticle_id } = that.state;

        api.get(inter.SiteComments + arcticle_id, {
            sort: 2,
            page: 0,
            ctype: 11,
        }).then((res) => {
            if (res.data.status) {
                let topComms = res.data.data
                this.setState({
                    topComms: topComms.items
                })
            }
        })
    }

    //点赞
    _articleLike() {
        var that = this;
        const { arcticle_id, isLike, likeNum, userId } = that.state;

        if (userId > 0) {
            api.post(inter.ArticleLike + arcticle_id)
                .then((res) => {
                    if (res.data.status) {
                        Taro.showToast({
                            title: '点赞成功',
                            icon: 'success',
                            duration: 2000
                        })
                        let likenumber = likeNum + 1
                        this.setState({
                            isLike: !isLike,
                            likeNum: likenumber
                        })
                    }
                })
        } else {
            this.refs.auth.doLogin();
        }

    }

    //取消点赞
    _articleReLike() {

        var that = this;
        const { arcticle_id, isLike, likeNum, userId } = that.state;


        if (userId) {
            api.post(inter.ArticleRmLike + arcticle_id)
                .then((res) => {
                    if (res.data.status) {
                        Taro.showToast({
                            title: '取消点赞',
                            icon: 'success',
                            duration: 2000
                        })
                        let likenumber = likeNum - 1

                        this.setState({
                            isLike: !isLike,
                            likeNum: likenumber < 0 ? 0 : likenumber
                        })
                    }
                })
        } else {
            this.refs.auth.doLogin();
        }

    }


    // 评论点赞
    _parse(val, comIdx) {
        var that = this
        const { topComms, userId } = that.state



        if (userId > 0) {
            if (val.like) {
                api.post(inter.RemoveLike + val.commentId).then((res) => {
                    if (res.data.status) {
                        topComms[comIdx].like = !topComms[comIdx].like
                        topComms[comIdx].praise = topComms[comIdx].praise - 1

                        that.setState({
                            topComms: topComms
                        })
                    }
                })
            } else {
                api.post(inter.PublishLike + val.commentId).then((res) => {
                    if (res.data.status) {
                        topComms[comIdx].like = !topComms[comIdx].like
                        topComms[comIdx].praise = topComms[comIdx].praise + 1
                        that.setState({
                            topComms: topComms
                        })
                    }
                })
            }
        } else {
            this.refs.auth.doLogin();
        }

    }



    // 评论 查看大图
    onViewImg(galleryList, index) {
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

    // 投票 图片 点击查看
    _onVoteImg(url) {

        let urls: string[] = new Array();
        urls.push(url)

        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: urls[0], // 当前显示图片的http链接，默认是第一个
        }).then((res) => {
            // console.log(res)
        })
    }

    // 写评论
    _whiteCommt() {
        var that = this
        const { arcticle_id, userId } = that.state
        if (userId > 0) {
            Taro.navigateTo({
                url: menu.writeCommt + '?course_id=' + `${arcticle_id}` + '&whitetip=' + Taro.getStorageSync('whiteTip') + '&type=1&ctype=11&isStar=0'
            })
        } else {
            this.refs.auth.doLogin();
        }

    }


    // 投票
    _articleVote(vt, ttype) {

        var that = this
        const { arcticle_id } = that.state

        api.get(inter.ArticleVote + arcticle_id, {
            answer: vt.optionId
        }).then((res) => {
            api.get(inter.ArticleDesc + arcticle_id)
                .then((res) => {
                    if (res.data.status) {
                        Taro.hideNavigationBarLoading()
                        Taro.stopPullDownRefresh()
                        let consultDesc = res.data.data;
                        this.setState({
                            voteInfo: consultDesc.voteInfo
                        })
                    }
                })
            if (res.data.message == '请先登录') {
                Taro.showToast({
                    title: '请先登录',
                    icon: 'none',
                    duration: 1500
                })
                that.getUserInfo({})
            }
        })

    }
    getUserInfo = (userInfo) => {

        const that = this;
        wx.getUserProfile({
            lang: 'zh_CN',
            desc: '用户登录',
            success: (res) => {
                let userInfo = res
                if (userInfo.errMsg === 'getUserProfile:ok') {
                    Taro.login({
                        success: res => {
                            let iv = encodeURIComponent(userInfo.iv)
                            let encryptedData = encodeURIComponent(userInfo.encryptedData)
                            api.post(inter.wxpro, {
                                iv: iv,
                                encryptedData: encryptedData,
                                fuser: 0,
                                code: res.code,
                                nickName: userInfo.userInfo.nickName,
                                avatar: userInfo.userInfo.avatarUrl,
                                sex: userInfo.userInfo.gender,
                            }).then((res) => {
                                if (res.data.status) {
                                    Taro.setStorageSync('token', res.data.data.token);
                                    that.props.success && this.props.success();

                                    that.getUser();

                                    let authdata = res.data.data;
                                } else {
                                    Taro.showModal({
                                        title: '登录',
                                        content: '账户已禁用',
                                        showCancel: false
                                    }).then(res => console.log(res.confirm, res.cancel))
                                }
                            })
                        },
                        fail: res => {
                            console.log('拒绝')
                        }
                    })
                }


            }
        })

    }
    // 资讯详情
    _consultDesc(art) {

        if (art.isLink === 1) {
            Taro.navigateTo({ url: menu.adWebView + '?link=' + `${art.link}` + '&ad=""' })
        } else {
            Taro.navigateTo({ url: menu.consultDesc + '?articleId=' + art.articleId })
        }

    }


    render() {
        if (!this.state.load) return null;
        const { isLike, topComms, consultDesc, relaList, likeNum, arcticle_id, voteType, voteList, voteInfo, isVote, comment, userId } = this.state;

        let relaLists = relaList.slice(0, 4)

        //宽度
        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {

        }

        let sumVt: number = 0

        voteInfo.optionList.map((vts: any, index) => {
            sumVt += vts.num
        })

        setTimeout(() => {
            if (!userId) {
                this.refs.auth.doLogin()
            }
        }, 3500);
        return (
            <View className='wrap '>
                <ScrollView className='pb_50'>
                    <View className='head pl_15 pr_15 pt_15'>
                        <Image src={consultDesc.articleImg} className='headImg' />
                        <Text className='lg_label c33_label fw_label'>{consultDesc.title}</Text>
                        <View className='d_flex fd_r jc_fe'>
                            <Text className='sm_label tip_label'>{consultDesc.comment}评论 · {dateDiff(consultDesc.pubTime)}</Text>
                        </View>
                    </View>
                    <View className='cons  bg_white pb_10 p_15'>
                        <GrapTmp content={this.state.article} ></GrapTmp>
                    </View>
                    {/* 0 文字 1 图片 mtype   */}

                    {
                        isVote === 1 && voteInfo.optionList.length > 0 ?
                            <View>
                                {
                                    voteInfo.mtype === 0 ?
                                        <View className='voteBox'>
                                            <View className='voteHead border_bt d_flex fd_c' style={{ width: (windowWidth - 30) * 2 + 'rpx' }}>
                                                <Text className='c33_label lg_label fw_label'>投票</Text>
                                                <Text className='lg_label c33_label mt_15 pb_10'>{voteInfo.title}{voteInfo.ttype === 0 ? '' : '（多选）'}</Text>
                                            </View>
                                            <View className='voteLists'>
                                                {
                                                    voteInfo.optionList.map((vt: any, index) => {

                                                        return (
                                                            <View className='voteItem' key={'vt' + index}>
                                                                <Text className='c33_label default_label'>{vt.optionLabel}</Text>
                                                                <View className='d_flex fd_r ai_ct'>
                                                                    <View className='col_1'>
                                                                        <Progress
                                                                            percent={parseFloat((vt.num / sumVt).toFixed(2)) * 100}
                                                                            strokeWidth={5}
                                                                            active
                                                                            backgroundColor='#fafafa'
                                                                            activeColor='#FFB3A1'
                                                                        />
                                                                    </View>
                                                                    <View className='vt_tit'>
                                                                        <Text className='red_label sm_label' style={{ width: '120rpx' }}>{vt.num}票</Text>
                                                                    </View>

                                                                    {
                                                                        voteInfo.ttype === 0 ?
                                                                            <View>
                                                                                {
                                                                                    vt.canVote ?
                                                                                        <View className={voteInfo.canVote ? 'voteBtn ml_10' : 'voteBtn ml_10 voteno_btn'}
                                                                                            onClick={voteInfo.canVote ? this._articleVote.bind(this, vt, voteInfo.ttype) : null}
                                                                                        >
                                                                                            <Text className='sm_label white_label fw_label'>投票</Text>
                                                                                        </View>
                                                                                        :
                                                                                        <View className='voteBtn ml_10' style={{ backgroundColor: '#BFBFBF' }}>
                                                                                            <Text className='sm_label white_label fw_label'>已投票</Text>
                                                                                        </View>
                                                                                }
                                                                            </View>
                                                                            :
                                                                            <View>
                                                                                {
                                                                                    vt.canVote ?
                                                                                        <View className={voteInfo.canVote ? 'voteBtn ml_10' : 'voteBtn ml_10 voteno_btn'}
                                                                                            onClick={voteInfo.canVote ? this._articleVote.bind(this, vt, voteInfo.ttype) : null}
                                                                                        >
                                                                                            <Text className='sm_label white_label fw_label'>投票</Text>
                                                                                        </View>
                                                                                        :
                                                                                        <View className='voteBtn ml_10' style={{ backgroundColor: '#BFBFBF' }}>
                                                                                            <Text className='sm_label white_label fw_label'>已投票</Text>
                                                                                        </View>
                                                                                }
                                                                            </View>
                                                                    }



                                                                </View>
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>
                                        :
                                        <View className='voteBox'>
                                            <View className='voteHead border_bt d_flex fd_c' style={{ width: (windowWidth - 30) * 2 + 'rpx' }}>
                                                <Text className='c33_label lg_label fw_label'>投票</Text>
                                                <Text className='lg_label c33_label mt_15 pb_10'>{voteInfo.title} {voteInfo.ttype === 0 ? '' : '（多选）'}</Text>
                                            </View>
                                            <View className='voteRLists'>
                                                {
                                                    voteInfo.optionList.map((vt: any, index) => {
                                                        return (
                                                            <View key={'vt' + index} className='rowItem' style={{ width: (windowWidth - 80) / 2 + 'px' }}>
                                                                <Image src={vt.url} className='rowItem_img' onClick={this._onVoteImg.bind(this, vt.url)} />
                                                                <View className='row_height'>
                                                                    <Text className='fw_label c33_label default_label'>{vt.optionLabel}</Text>
                                                                </View>
                                                                {
                                                                    voteInfo.ttype === 0 ?
                                                                        <View className='d_flex fd_r jc_sb ai_ct mt_10'>
                                                                            <Text className='red_label sm_label'>{vt.num}票</Text>
                                                                            {
                                                                                vt.canVote ?
                                                                                    <View className={voteInfo.canVote ? 'rowItem_btn ml_10' : 'rowItem_btn ml_10 voteno_btn'}
                                                                                        onClick={voteInfo.canVote ? this._articleVote.bind(this, vt, voteInfo.ttype) : null}
                                                                                    >
                                                                                        <Text className='white_label default_label fw_label'>投票</Text>
                                                                                    </View>
                                                                                    :
                                                                                    <View className='rowItem_btn' style={{ backgroundColor: '#BFBFBF' }}>
                                                                                        <Text className='white_label default_label fw_label'>已投票</Text>
                                                                                    </View>
                                                                            }

                                                                        </View>
                                                                        :
                                                                        <View className='d_flex fd_r jc_sb ai_ct mt_10'>
                                                                            <Text className='red_label sm_label'>{vt.num}票</Text>
                                                                            {
                                                                                vt.canVote ?
                                                                                    <View className={voteInfo.canVote ? 'rowItem_btn' : 'rowItem_btn voteno_btn'}
                                                                                        onClick={voteInfo.canVote ? this._articleVote.bind(this, vt, voteInfo.ttype) : null}
                                                                                    >
                                                                                        <Text className='white_label default_label fw_label'>投票</Text>
                                                                                    </View>
                                                                                    :
                                                                                    <View className='rowItem_btn' style={{ backgroundColor: '#BFBFBF' }}>
                                                                                        <Text className='white_label default_label fw_label'>已投票</Text>
                                                                                    </View>
                                                                            }

                                                                        </View>
                                                                }
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>
                                }
                            </View>
                            : null}


                    {
                        relaLists.length > 0 ?
                            <View className='pl_15 pr_15 mt_10 pt_10 bg_white'>
                                <Text className='lg_label c33_label fw_label'>相关推荐</Text>
                                <View className='consult'>
                                    {
                                        relaLists.map((recom, index) => {
                                            return (
                                                <View className='itemr border_bt pb_10 pt_10' key={'items' + index}
                                                    onClick={this._consultDesc.bind(this, recom)}
                                                >
                                                    <ConsultCourse articleList={recom} />
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                            : null}

                    <View className='p_15 mt_10 bg_white'>
                        <Text className='lg18_label c33_label fw_label'>精选评论</Text>
                        {
                            topComms.length > 0 ?
                                <View>
                                    {
                                        topComms.map((comm, index) => {
                                            return (
                                                <View key={'comm' + index}>
                                                    <Eval
                                                        comIdx={index}
                                                        val={comm}
                                                        type={1}
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

                    </View>
                    <View className='pt_12 pb_12 d_flex fd_r ai_ct jc_ct border_tp bg_white'
                        onClick={() => Taro.navigateTo({ url: menu.allComment + '?course_id=' + `${arcticle_id}` + '&type=1' + '&ctype=11' })}
                    >
                        <Text className='gray_label sm_label'>查看全部评论 &gt;</Text>
                    </View>

                </ScrollView>
                <View className='comments d_flex fd_r ai_ct' >
                    <View className='input' onClick={this._whiteCommt}>
                        <Text className='tip_label default_label'>写留言，发表看法</Text>
                    </View>
                    <View className='countBox'
                        onClick={isLike ? this._articleReLike : this._articleLike}
                    >
                        <Image src={isLike ? asset.onpraise : asset.praise} className='heart_icon' />
                        {
                            likeNum > 0 ?
                                <View className='count'>
                                    <Text className='sm9_label white_label'>{likeNum > 999 ? '999+' : likeNum}</Text>
                                </View>
                                : null}

                    </View>
                </View>
                <Auth ref={'auth'} type={1} success={() => {
                    this._onLoadCallBack()
                }} />
            </View>
        )
    }
}

export default consultDesc as ComponentClass