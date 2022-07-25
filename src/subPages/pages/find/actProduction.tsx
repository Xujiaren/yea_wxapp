import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input, Video, CoverView, Swiper, SwiperItem } from '@tarojs/components'

import asset from '../../../config/asset';

import { learnNum } from '../../../utils/common';

import menu from '../../../config/menu';
import inter from '../../../config/inter'
import api from '../../../services/api'
import '../../../config/theme.css';
import './actProduction.less'

type PageState = {
    userId: number,
    keyword: string,
    activityId: number,
    voteList: Array<{
        activityId: number,
        joinId: number,
        avatar: string,
        isVote: number,
        mobile: string,
        number: number,
        pubIp: string,
        pubTime: number,
        username: string,
        workIntro: string,
        workName: string,
        workUrl: string,
        galleryList: Array<{
            fpath: string
        }>,
        index: 0
    }>,
    leftList: Array<any>,
    rightList: Array<any>,
    ctype: number,
    videoType: boolean,
    P_m38u: string,
    act_number: number,
    searchtype: number,
    etype: number,
    votes: number,
    page: number,
    pages: number,
    votee: number,
    ttyp: number,
    activiType: number,
}

class actProduction extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '作品',
        enablePullDownRefresh: true,
    }
    page: number
    pages: number

    constructor() {
        super(...arguments)
        this.page = 0;
        this.pages = 0;
        this.state = {
            userId: 0,
            keyword: '',
            activityId: 0,
            voteList: [],
            leftList: [],
            rightList: [],
            ctype: 16,
            videoType: false,
            P_m38u: '',
            act_number: 0,
            searchtype: 0, // 0 未搜索 1 已搜索
            etype: 0,
            votes: 5,
            page: 0,
            pages: 0,
            votee: 5,
            ttyp: 0,
            activiType: 2,
        }
    }

    componentWillMount() {
        var that = this;
        const { activityId, ctype, etype, keyword, vote, ttyp, activiType } = that.$router.params
        that.setState({
            activityId: parseInt(activityId),
            ctype: parseInt(ctype),
            etype: parseInt(etype),
            keyword: keyword,
            activiType: parseInt(activiType)
        }, () => {
            this._getArtDesc()
        })
        if (vote) {
            that.setState({
                votee: parseInt(vote),
            })
        }
        if (ttyp) {
            that.setState({
                ttyp: parseInt(ttyp)
            })
        }

    }

    componentDidMount() {
        var that = this;
        that.getUser();
        that._getVoteInfo();
        that._getList();
        that._getActNumber();
    }

    componentWillUnmount() {

    }

    componentDidShow() { }
    componentDidHide() { }
    _getArtDesc = () => {
        api.get(inter.ActivityDesc + this.state.activityId)
            .then((res) => {
                if (res.data.status) {
                    if (res.data.data.canShare) {
                        Taro.showShareMenu({
                            withShareTicket: true
                        })
                    } else {
                        Taro.hideShareMenu()
                    }
                    this.setState({
                        votes: res.data.data.voteNum
                    })
                }
            })
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

    _getActNumber() {
        var that = this;
        const { activityId } = that.state

        api.get(inter.ActivityVote + activityId)
            .then((res) => {
                if (res.data.status) {
                    that.setState({
                        act_number: res.data.data
                    })
                }
            })

    }

    _getVoteInfo() {
        var that = this;
        const { activityId, keyword, ctype, searchtype, voteList } = that.state;

        api.get(inter.ActivityInfo + activityId, {
            keyword: keyword,
            page: this.page
        }).then((res) => {
            if (res.data.status) {
                let arr = res.data.data
                // console.log(voteList.items.length,voteList)
                if (arr.items.length === 0) {
                    Taro.showToast({
                        title: '没有搜到到相关结果',
                        icon: 'none',
                        duration: 2000
                    })
                }
                if (this.page === 0) {
                    this.page = arr.page
                    this.pages = arr.pages
                    var tList = arr.items
                } else {
                    var tList: any = voteList.concat(arr.items)
                }
                let prics = tList.filter(item => item.isVote == true).length
                that.setState({
                    voteList: tList,
                    page: arr.page,
                    pages: arr.pages,
                    ctype: ctype,
                    searchtype: 0,
                    // votes: 3 - prics
                }, () => {
                    that._getList();
                })
            }
        })
    }

    _onSearch() {

        var that = this;
        const { keyword, ctype, activityId, etype, ttyp } = that.state;

        // that.setState({
        //     rightList:[],
        //     leftList:[],
        // })

        if (keyword.length > 0) {
            if (ttyp == 0) {
                Taro.navigateTo({ url: menu.actProduction + '?activityId=' + activityId + '&ctype=' + ctype + '&etype=' + etype + '&keyword=' + keyword + '&activiType=' + this.state.activiType + '&vote=' + this.state.votes + '&ttyp=1', })
            } else {
                Taro.navigateTo({ url: menu.actProduction + '?activityId=' + activityId + '&ctype=' + ctype + '&etype=' + etype + '&keyword=' + keyword + '&activiType=' + this.state.activiType + '&vote=' + this.state.votee + '&ttyp=1', })
            }

            // that._getVoteInfo();
            // api.post(inter.userLog,{
            //     log_type:1,
            //     type:0,
            //     device_id:0,
            //     intro:'活动作品搜索',
            //     content_id:0,
            //     param:keyword,
            //     from:0,
            // }).then((res)=>{
            //     console.log('ee')
            // })
        } else {
            Taro.showToast({
                title: '请输入关键词',
                icon: 'none',
                duration: 2000
            })
        }

    }


    // 投票
    _onVote(vote, index, type) {
        var that = this;
        const { leftList, rightList, etype, votes, votee } = that.state;

        let toastStr = '点赞';
        if (etype === 20) {
            toastStr = '投票'
        }
        if (votes > 0 && votee > 0) {
            Taro.showModal({
                title: '提示',
                content: '确认投票',
                success: function (res) {
                    if (res.confirm) {
                        api.post(inter.ActivityVote + vote.joinId, {
                            number: 1
                        }).then((res) => {
                            if (res.data.status) {
                                if (type === 0) {
                                    // leftList[index].isVote = true
                                    leftList[index].number = leftList[index].number + 1
                                    that.setState({
                                        leftList: leftList,
                                        votes: votes - 1
                                    })
                                } else if (type === 1) {
                                    // rightList[index].isVote = true
                                    rightList[index].number = rightList[index].number + 1
                                    that.setState({
                                        rightList: rightList,
                                        votes: votes - 1
                                    })
                                }
                                Taro.showToast({
                                    title: toastStr + '成功',
                                    icon: 'none',
                                    duration: 1000
                                })
                                that._getActNumber();
                                // that. _getVoteInfo();
                                that._getArtDesc()
                            }
                        })
                    } else if (res.cancel) {
                        // console.log('用户点击取消')
                    }
                }
            })
        } else {
            Taro.showToast({
                title: '您的' + toastStr + '次数已用完',
                icon: 'none',
                duration: 1500
            })
        }

    }

    // 查看投票图片
    _overImg(vote) {
        // var that = this;
        // let urls: string[] = new Array();

        // let galleryList = vote.galleryList

        // for (let i = 0; i < galleryList.length; i++) {
        //     urls.push(galleryList[i].fpath)
        // }

        // Taro.previewImage({
        //     urls: urls, //需要预览的图片http链接列表，注意是数组
        //     current: urls[0], // 当前显示图片的http链接，默认是第一个
        // }).then((res) => {
        //     // console.log(res)
        // })
        console.log(vote)
        Taro.navigateTo({
            url: 'pictures' + '?urls=' + JSON.stringify(vote.galleryList)
        })
    }



    // 数据左右渲染  真是数据接口请求
    _getList() {

        var that = this;
        const { voteList, rightList, leftList } = that.state


        if (voteList.length > 0) {
            for (let i = 0; i < voteList.length; i++) {
                if (i % 2 == 0) {
                    leftList.push(voteList[i])
                } else {
                    rightList.push(voteList[i])
                }
            }

            that.setState({
                rightList: rightList,
                leftList: leftList
            })
        }



    }



    // 点击传播数据 弹窗有新的视频数据播放
    _coverplay(voteUrl) {

        var that = this

        const videoContext = Taro.createVideoContext('video')
        videoContext.stop();

        that.setState({
            P_m38u: voteUrl,
            videoType: true
        })
    }

    _onClose() {
        var that = this;
        const videoContext = Taro.createVideoContext('P_video')
        videoContext.stop()
        that.setState({
            videoType: false
        })
    }


    onPullDownRefresh = () => {
        var that = this;
        that.page = 0;

        that.setState({
            keyword: '',
            searchtype: 0,
            voteList: [],
            page: 0,
            pages: 0,
            leftList: [],
            rightList: []
        }, () => {
            that._getVoteInfo();
            api.post(inter.userLog, {
                log_type: 1,
                type: 0,
                device_id: 0,
                intro: '活动作品搜索',
                content_id: 0,
                param: this.state.keyword,
                from: 0,
            }).then((res) => {
                console.log('ee')
            })
        })


        Taro.showNavigationBarLoading()
        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }

    onReachBottom() {
        var self = this;

        const { page, pages } = this.state
        if (page + 1 < pages) {
            this.page = this.page + 1;

            self._getVoteInfo();
        }
    }
    render() {

        const { keyword, rightList, leftList, ctype, videoType, P_m38u, act_number, voteList, searchtype, etype, votes, votee, ttyp, activiType } = this.state

        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {

        }

        let textStr = '点赞';
        let textnum = '赞数'

        if (etype === 20) {
            textStr = '投票'
            textnum = '票数'
        }

        return (
            <View className='wrap'>
                <View className='wraphead  bg_white'>
                    <View className='wrapCons d_flex fd_r jc_sb ai_ct'>
                        <View className='d_flex fd_r ai_ct searchBox'>
                            <Image src={asset.search} className='s_img' />
                            <Input
                                className='default_label ml_10 col_1'
                                placeholder='搜索作品名称或作者'
                                value={keyword}
                                onConfirm={this._onSearch}
                                onInput={(e) => this.setState({ keyword: e.detail.value })}
                            />
                        </View>
                        {
                            activiType == 2 ?
                                <View>
                                    {/* {
                                        ttyp == 1 ?
                                            <Text className='c33_label default_label pr_15 ml_10'>我的{textnum}：{votee}</Text>
                                            : */}
                                    <Text className='c33_label default_label pr_15 ml_10'>我的{textnum}：{votes}</Text>
                                    {/* } */}
                                </View>
                                : null
                        }


                        {/* <Text className='c33_label default_label pr_15 ml_10'>我的{textnum}：{act_number}</Text> */}
                    </View>

                </View>

                {
                    voteList.length > 0 ?
                        <View className='items'>
                            <View className='left_items'>
                                {
                                    leftList.map((vote, index) => {
                                        return (
                                            <View className='item mb_10' style={{ width: (windowWidth - 40) / 2 + 'px' }} key={'vote' + index}>
                                                <View className='p_10 d_flex fd_c'>
                                                    <View className='d_flex fd_c  mb_5'>
                                                        <View className='d_flex fd_r jc_sb'>
                                                            <Text className='sm_label c33_label'>排名 {vote.index}</Text>
                                                            <Text className='sm_label c33_label'>编号 {index * 2 + 1}</Text>
                                                        </View>
                                                        <View className='d_flex fd_r ai_ct mt_2'>
                                                            <View className='avarar_cover'>
                                                                <Image src={vote.avatar} className='headerCover' />
                                                            </View>
                                                            <Text className='default_label c33_label fw_label ml_5 wordstyle'>{vote.username}</Text>
                                                        </View>
                                                    </View>
                                                    <Text className='default_label c33_label fw_label wordstyle'>{vote.workName}</Text>
                                                    <Text className='sm_label gray_label mb_10 wordstyle'>{vote.workIntro}</Text>
                                                    {
                                                        ctype === 17 ?
                                                            <Swiper
                                                                className='test-h'
                                                                indicatorColor='#999'
                                                                indicatorActiveColor='#333'
                                                                circular
                                                                autoplay>
                                                                {
                                                                    vote.galleryList.map(itm => {
                                                                        return (
                                                                            <SwiperItem>
                                                                                <Image src={itm.fpath} className='pic mt_15' onClick={this._overImg.bind(this, vote)} />
                                                                            </SwiperItem>
                                                                        )
                                                                    })
                                                                }

                                                            </Swiper>
                                                            :
                                                            <View>
                                                                {
                                                                    !videoType ?
                                                                        <Video
                                                                            src={vote.galleryList[0].fpath}
                                                                            // poster={vote.galleryList[0].fpath + '?x-oss-process=video/snapshot,t_2000,m_fast'}
                                                                            className='pic_video'
                                                                            id='video'
                                                                            objectFit='fill'
                                                                        >
                                                                            <CoverView className="coverPlay" onClick={this._coverplay.bind(this, vote.galleryList[0].fpath)}></CoverView>
                                                                        </Video> : null
                                                                }
                                                            </View>

                                                    }
                                                    <View className='d_flex fd_r ai_ct jc_sb'>
                                                        <Text className='default_label gray_label mr_10'>{textnum}:{learnNum(vote.number)}</Text>
                                                        {
                                                            activiType == 2 ?
                                                                <View className='wids'>
                                                                    {/* {
                                                                        vote.isVote ?
                                                                            <View className='voteBtn'>
                                                                                <Text className='white_label default_label'>已{textStr}</Text>
                                                                            </View>
                                                                            : */}
                                                                    <View className='voteonBtn' onClick={this._onVote.bind(this, vote, index, 0)}>
                                                                        <Text className='white_label default_label'>{textStr}</Text>
                                                                    </View>
                                                                    {/* } */}
                                                                </View>
                                                                :
                                                                <View className='wids'>
                                                                    <View className='voteBtn'>
                                                                        <Text className='white_label default_label'>{textStr}结束</Text>
                                                                    </View>
                                                                </View>
                                                        }

                                                    </View>

                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            <View className='right_items'>
                                {
                                    rightList.map((vote, index) => {
                                        return (
                                            <View className='item mb_10' style={{ width: (windowWidth - 40) / 2 + 'px' }} key={'vote' + index}>
                                                <View className='p_10 d_flex fd_c'>
                                                    <View className='d_flex fd_c mb_5'>
                                                        <View className='d_flex fd_r jc_sb'>
                                                            <Text className='sm_label c33_label'>排名 {vote.index}</Text>
                                                            <Text className='sm_label c33_label'>编号 {(index + 1) * 2}</Text>
                                                        </View>
                                                        <View className='d_flex fd_r ai_ct '>
                                                            <View className='avarar_cover'>
                                                                <Image src={vote.avatar} className='headerCover' />
                                                            </View>
                                                            <Text className='default_label c33_label fw_label ml_5 wordstyle'>{vote.username}</Text>
                                                        </View>
                                                    </View>
                                                    <Text className='default_label c33_label fw_label mb_5 wordstyle'>{vote.workName}</Text>
                                                    <Text className='sm_label gray_label mb_10 wordstyle'>{vote.workIntro}</Text>
                                                    {
                                                        ctype === 17 ?
                                                            <Swiper
                                                                className='test-h'
                                                                indicatorColor='#999'
                                                                indicatorActiveColor='#333'
                                                                circular
                                                                autoplay>
                                                                {
                                                                    vote.galleryList.map(itm => {
                                                                        return (
                                                                            <SwiperItem>
                                                                                <Image src={itm.fpath} className='pic mt_15' onClick={this._overImg.bind(this, vote)} />
                                                                            </SwiperItem>
                                                                        )
                                                                    })
                                                                }

                                                            </Swiper>
                                                            :
                                                            <View>
                                                                {
                                                                    !videoType ?
                                                                        <Video
                                                                            src={vote.galleryList[0].fpath}
                                                                            // poster={vote.galleryList[0].fpath + '?x-oss-process=video/snapshot,t_2000,m_fast'}
                                                                            className='pic_video'
                                                                            id='video'
                                                                            objectFit='fill'
                                                                        >
                                                                            <CoverView className="coverPlay" onClick={this._coverplay.bind(this, vote.galleryList[0].fpath)}></CoverView>
                                                                        </Video> : null
                                                                }
                                                            </View>

                                                    }

                                                    <View className='d_flex fd_r ai_ct jc_sb'>
                                                        <Text className='default_label gray_label mr_10'>{textnum}:{learnNum(vote.number)}</Text>
                                                        {
                                                            activiType == 2 ?
                                                                <View className='wids'>
                                                                    {/* {
                                                                        vote.isVote ?
                                                                            <View className='voteBtn'>
                                                                                <Text className='white_label default_label'>已{textStr}</Text>
                                                                            </View>
                                                                            : */}
                                                                    <View className='voteonBtn' onClick={this._onVote.bind(this, vote, index, 1)}>
                                                                        <Text className='white_label default_label'>{textStr}</Text>
                                                                    </View>
                                                                    {/* } */}
                                                                </View>
                                                                :
                                                                <View className='wids'>
                                                                    <View className='voteBtn'>
                                                                        <Text className='white_label default_label'>{textStr}结束</Text>
                                                                    </View>
                                                                </View>
                                                        }

                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        : null}

                { voteList.length === 0 && searchtype === 1 ?
                    <View className='nullItem'>
                        <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/5a11b059-7aa7-41c8-a219-ece12a6fef13.png'}
                            style={{ width: '280rpx', height: '260rpx' }}
                        />
                        <Text className='sm_label tip_label mt_15'>搜索记录为空</Text>
                    </View>
                    : null}



                {
                    videoType ?
                        <View className='layer'>
                            <View className='d_flex ai_ct jc_ct layer_box'>
                                <View className='closeBtn' onClick={this._onClose}>
                                    <Image src={asset.video_close} className='layer_icon' />
                                </View>
                                <Video
                                    src={P_m38u}
                                    className='cover_layer'
                                    style={{ width: windowWidth + 'px', height: '100vh' }}
                                    autoplay
                                    id='P_video'
                                    // objectFit='contain'
                                    initialTime={0.02}
                                />
                            </View>
                        </View>
                        : null}
            </View>
        )
    }
}

export default actProduction as ComponentClass