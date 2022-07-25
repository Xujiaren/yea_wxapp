import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'





import { connect } from '@tarojs/redux'
import { usersType } from '../../../constants/usersType'
import menu from '../../../config/menu';
import { getCollectCourse } from '../../../actions/user'


import inter from '../../../config/inter'
import api from '../../../services/api'

import Tabs from '../../../components/Tabs'
import Course from '../../../components/Course'
import { percent2percent25 } from '../../../utils/common'

import asset from '../../../config/asset'
import sub_asset from '../../config/asset'

import '../../../config/theme.css';
import './myCollect.less'


type PageStateProps = {
    user: usersType,
    getCollectCourse: Array<{}>,
}

type PageDispatchProps = {
    getCollectCourse: (object) => any
}

type PageOwnProps = {}

type PageState = {
    page: number,
    pages: number,
    total: number,
    choosedata: Array<string>,
    colltype: boolean,
    allType: boolean,
    ids: Array<number>,
    c_course: Array<{
        courseId: number
    }>,
    status: number,
    cctype: number,
    articleList: Array<any>
    reply: Array<any>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface MyCollect {
    props: IProps;
}

@connect(({ user }) => ({
    user: user
}), (dispatch) => ({
    getCollectCourse(object) {
        dispatch(getCollectCourse(object))
    }
}))


class MyCollect extends Component<PageDispatchProps & PageStateProps, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '我的收藏',
        enablePullDownRefresh: true
    }
    page: number;
    pages: number;
    itemtype: any;

    constructor() {
        super(...arguments)

        this.page = 1;
        this.pages = 1;

        this.itemtype = null;

        this.state = {
            page: 1,
            pages: 0,
            total: 0,
            choosedata: [],
            colltype: false,
            allType: false, // 全选
            ids: [], //选择删除id集合
            c_course: [],
            status: 0,
            cctype: 0,
            articleList: [],
            reply: [],
        }
        this._change = this._change.bind(this);
        this._onSelect = this._onSelect.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { user } = nextProps

        if (user !== this.props.user) {
            const { collectCourse } = user
            const { c_course } = this.state

            if (this.page === 1) {

                this.page = collectCourse.page > 0 ? collectCourse.page : 1
                this.pages = collectCourse.pages
                var cc_course: any = collectCourse.items

            } else {
                var cc_course: any = c_course.concat(collectCourse.items)
            }

            this.itemtype = [];

            this.setState({
                page: collectCourse.page > 0 ? collectCourse.page : 1,
                pages: collectCourse.pages,
                total: collectCourse.total,
                c_course: cc_course
            })
        }

    }

    componentWillMount() {
        // this.getCollectCourse();
    }

    componentDidMount() {
        this.getCollectCourse();
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }




    handleChange(e) {
        this.setState({
            choosedata: e.detail.value
        })
    }


    //单选
    _change(item, index) {

        var that = this

        const { c_course, ids, status, articleList } = that.state

        if (status < 2) {
            const id = c_course[index].courseId
            if (ids.indexOf(id) != -1) {

                let index = ids.indexOf(id);
                ids.splice(index, 1); //删除

            } else {

                ids.unshift(id); // 数组最前面
            }
        } else {

            if (status === 2) {

                const aid = articleList[index].articleId
                if (ids.indexOf(aid) != -1) {

                    let index = ids.indexOf(aid);
                    ids.splice(index, 1); //删除

                } else {

                    ids.unshift(aid); // 数组最前面
                }

            } else if (status === 3) {

                const aid = articleList[index].activityId
                if (ids.indexOf(aid) != -1) {

                    let index = ids.indexOf(aid);
                    ids.splice(index, 1); //删除

                } else {

                    ids.unshift(aid); // 数组最前面
                }

            } else if (status === 4) {

                const aid = articleList[index].articleId
                if (ids.indexOf(aid) != -1) {

                    let index = ids.indexOf(aid);
                    ids.splice(index, 1); //删除

                } else {

                    ids.unshift(aid); // 数组最前面
                }

            } else if (status === 5) {
                const aid = articleList[index].replyId
                if (ids.indexOf(aid) != -1) {

                    let index = ids.indexOf(aid);
                    ids.splice(index, 1); //删除

                } else {

                    ids.unshift(aid); // 数组最前面
                }
            }



        }


        this.setState({
            ids: ids
        }, () => {
            this._judge();
        })
    }


    //单选判断是否选完
    _judge() {
        var that = this;
        const { c_course, ids, articleList, status } = that.state;
        let judge: number[] = new Array();

        if (status < 2) {
            for (var i = 0; i < c_course.length; i++) {
                judge.push(c_course[i].courseId);
                if (judge.sort().toString() == ids.sort().toString()) {
                    this.setState({
                        allType: true
                    })
                } else {
                    this.setState({
                        allType: false
                    })
                }
            }
        } else {

            if (status === 2) {

                for (var i = 0; i < articleList.length; i++) {
                    judge.push(articleList[i].articleId);
                    if (judge.sort().toString() == ids.sort().toString()) {
                        this.setState({
                            allType: true
                        })
                    } else {
                        this.setState({
                            allType: false
                        })
                    }
                }

            } else if (status === 3) {

                for (var i = 0; i < articleList.length; i++) {
                    judge.push(articleList[i].activityId);
                    if (judge.sort().toString() == ids.sort().toString()) {
                        this.setState({
                            allType: true
                        })
                    } else {
                        this.setState({
                            allType: false
                        })
                    }
                }

            }

        }



    }


    //全选
    _onAllselect() {
        var that = this
        const { c_course, ids, articleList, status } = that.state

        let allchoose: number[] = new Array()

        if (status < 2) {
            for (var i = 0; i < c_course.length; i++) {
                allchoose.push(c_course[i].courseId);
                if (allchoose.sort().toString() == ids.sort().toString()) {
                    this.setState({
                        ids: [],
                        allType: false,
                    })
                } else {
                    this.setState({
                        ids: allchoose,
                        allType: true
                    })
                }
            }
        } else {
            if (status === 2) {

                for (var i = 0; i < articleList.length; i++) {
                    allchoose.push(articleList[i].articleId);
                    if (allchoose.sort().toString() == ids.sort().toString()) {
                        this.setState({
                            ids: [],
                            allType: false,
                        })
                    } else {
                        this.setState({
                            ids: allchoose,
                            allType: true
                        })
                    }
                }

            } else if (status === 3) {

                for (var i = 0; i < articleList.length; i++) {
                    allchoose.push(articleList[i].activityId);
                    if (allchoose.sort().toString() == ids.sort().toString()) {
                        this.setState({
                            ids: [],
                            allType: false,
                        })
                    } else {
                        this.setState({
                            ids: allchoose,
                            allType: true
                        })
                    }
                }

            }else if (status === 4) {

                for (var i = 0; i < articleList.length; i++) {
                    allchoose.push(articleList[i].articleId);
                    if (allchoose.sort().toString() == ids.sort().toString()) {
                        this.setState({
                            ids: [],
                            allType: false,
                        })
                    } else {
                        this.setState({
                            ids: allchoose,
                            allType: true
                        })
                    }
                }

            }
            else if (status === 5) {

                for (var i = 0; i < articleList.length; i++) {
                    allchoose.push(articleList[i].replyId);
                    if (allchoose.sort().toString() == ids.sort().toString()) {
                        this.setState({
                            ids: [],
                            allType: false,
                        })
                    } else {
                        this.setState({
                            ids: allchoose,
                            allType: true
                        })
                    }
                }

            }

        }


    }

    _colltype = () => {
        this.setState({
            colltype: !this.state.colltype
        })
    }


    // 课程收藏
    getCollectCourse() {
        var that = this;
        const { cctype, page } = that.state;
        console.log(cctype)
        this.props.getCollectCourse({
            cctype: cctype,
            page: page
        })
    }

    // 资讯 收藏
    _getCollectArticle = () => {
        var that = this;
        const { cctype, articleList } = that.state;

        api.get(inter.aCollect, {
            ctype: cctype,
            page: this.page
        }).then((res) => {
            console.log(res)
            let artList = res.data.data
            if (this.page == 0) {
                var tList: any = artList.items
            } else {
                var tList: any = articleList.concat(artList.items);
            }

            that.itemtype = [];

            that.setState({
                articleList: tList,
                page: artList.page,
                pages: artList.pages,
                total: artList.total
            })
        })
    }
    getAskreply = () => {
        var that = this
        const { cctype, reply } = that.state;
        api.get(inter.aCollect, {
            ctype: cctype,
            page: this.page
        }).then(res => {
            let artList = res.data.data
            if (this.page == 0) {
                var tList: any = artList.items
            } else {
                var tList: any = reply.concat(artList.items);
            }

            that.itemtype = [];

            that.setState({
                reply: tList,
                page: artList.page,
                pages: artList.pages,
                total: artList.total
            })
        })
    }

    _onDelete = () => {

        var that = this
        let { ids, cctype, status } = that.state

        var course_id = ids.join(",")

        if (status < 2) {
            api.post(inter.removeArtCollect, {
                ids: course_id,
                ctype: 3
            }).then((res) => {
                if (res.data.status) {
                    api.get(inter.collectcourse, {
                        cctype: cctype,
                        page: 1
                    }).then((res) => {
                        if (res.data.status) {
                            that.setState({
                                c_course: res.data.data.items,
                                allType: false,
                                colltype: false,
                                ids: []
                            })
                        }
                    })
                    Taro.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000
                    })
                } else {
                    Taro.showToast({
                        title: '删除失败',
                        icon: 'flied',
                        duration: 2000
                    })
                }
            })
        } else if(status<5) {
            let ptype = 15
            if (status === 3) {
                ptype = 2
            }
            if(status === 4){
                ptype = 13
            }
            api.post(inter.removeArtCollect, {
                ids: course_id,
                ctype: ptype
            }).then((res) => {
                if (res.data.status) {
                    api.get(inter.aCollect, {
                        ctype: ptype,
                        page: 0
                    }).then((res) => {
                        if (res.data.status) {
                            that.setState({
                                articleList: res.data.data.items,
                                allType: false,
                                colltype: false,
                                ids: []
                            })
                        }
                    })
                    Taro.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000
                    })
                } else {
                    Taro.showToast({
                        title: '删除失败',
                        icon: 'flied',
                        duration: 2000
                    })
                }
            })
        }else{
            api.post(inter.removeArtCollect, {
                ids: course_id,
                ctype: 34
            }).then((res) => {
                if (res.data.status) {
                    api.get(inter.collectArticle, {
                        ctype: cctype,
                        page: 0
                    }).then((res) => {
                        if (res.data.status) {
                            that.setState({
                                articleList: res.data.data.items,
                                allType: false,
                                colltype: false,
                                ids: []
                            })
                        }
                    })
                    Taro.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000
                    })
                } else {
                    Taro.showToast({
                        title: '删除失败',
                        icon: 'flied',
                        duration: 2000
                    })
                }
            })
        }


    }


    //详情页
    _oncourseDesc(item) {
        if (item.ctype === 0) {
            Taro.navigateTo({
                url: menu.courseDesc + `?course_id=${item.courseId}` + '&courseName=' + percent2percent25(`${item.courseName}`) + '&isback=0'
            })
        } else if (item.ctype === 1) {
            Taro.navigateTo({
                url: menu.audioDesc + '?course_id=' + item.courseId + '&audioName=' + percent2percent25(item.courseName)
            })
        }
    }

    artDesc(article) {
        var that = this;
        const { status } = that.state;

        if (status === 2 || status === 4) {
            Taro.navigateTo({
                url: menu.projectDesc + '?articleId=' + article.articleId + '&articleName=' + percent2percent25(article.title)
            })
        } else if (status === 3) {
            Taro.navigateTo({
                url: menu.activityDesc + '?activityId=' + article.activityId + '&articleName=' + percent2percent25(article.title) + '&atype=' + article.atype + 'ztype=' + 1
            })
        }

    }

    _onSelect(index) {
        var that = this;

        that.itemtype = null;
        if (index === 0 || index === 1) {
            this.page = 1;
            that.setState({
                status: index,
                cctype: index,
                c_course: [],
                allType: false,
                colltype: false,
                ids: []
            }, () => {
                that.getCollectCourse();
            })
        }

        if (index === 2 || index === 3 || index == 4) {

            this.page = 0;
            let cctype = 15;

            if (index == 3) {
                cctype = 2
            }
            if (index == 4) {
                cctype = 13
            }


            that.setState({
                status: index,
                cctype: cctype,
                c_course: [],
                articleList: [],
                allType: false,
                colltype: false,
                ids: []
            }, () => {
                that._getCollectArticle();
            })
        }
        if (index === 5) {
            this.page = 0;
            let cctype = 34;
            that.setState({
                status: index,
                cctype: cctype,
                c_course: [],
                articleList: [],
                allType: false,
                colltype: false,
                ids: []
            }, () => {
                that.getAskreply()
            })
        }

    }

    loaddata() {
        var self = this
        const { page, cctype, status } = self.state
        if (status == 0 || status == 1) {
            self.props.getCollectCourse({
                cctype: cctype,
                page: page
            })
        }
    }

    onPullDownRefresh() {
        var self = this
        const { status, cctype, articleList } = self.state
        this.page = 1;

        this.itemtype = null;

        if (status < 2) {
            self.setState({
                page: 1,
                c_course: []
            }, () => {
                self.loaddata();
                setTimeout(function () {
                    //执行ajax请求后停止下拉
                    Taro.stopPullDownRefresh();
                }, 1000);
            })
        } else {
            self.setState({
                page: 0,
                articleList: []
            }, () => {
                api.get(inter.aCollect, {
                    ctype: cctype,
                    page: 0
                }).then((res) => {
                    console.log(res)
                    let artList = res.data.data
                    var tList: any = artList.items

                    self.itemtype = [];

                    self.setState({
                        articleList: tList,
                        page: artList.page,
                        pages: artList.pages,
                        total: artList.total
                    })
                })
                setTimeout(function () {
                    //执行ajax请求后停止下拉
                    Taro.stopPullDownRefresh();
                }, 1000);
            })
        }

    }

    onReachBottom() {
        var self = this;

        const { page, pages, cctype, status } = self.state

        if (status < 2) {
            if (page < pages) {
                this.page = this.page + 1
                self.props.getCollectCourse({
                    cctype: cctype,
                    page: this.page
                })
            }
        } else {
            if (page < pages) {
                this.page = this.page + 1
                self._getCollectArticle();
            }
        }

    }
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
    _actions = (type, value, index) => {
        var that = this;
        const { } = that.state;

           if (type === 'Approval') {

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
                        // that._replyAsk();

                        // let rList = replyList;
                        // rList[index].approval = rList[index].approval + 1

                        // that.setState({
                        //     replyList: rList
                        // })
                    }
                })

            } else if (type === 'AskComment') {
                Taro.navigateTo({ url: menu.awriteComt + '?askId=' + value.replyId + '&ctype=' + 34 })
            }

    }
    render() {
        const { c_course, ids, allType, colltype, status, articleList, reply } = this.state
        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {

        }
        console.log(reply)
        return (
            <View className='collectwrap'>
                <View className='headwrap'>
                    <View className='pt_10 pb_10 pr_15 ' style={{ textAlign: 'right' }} onClick={this._colltype}>
                        <Text className='c33_label default_label fw_label'>管理收藏</Text>
                    </View>
                    <View className='atabs'>
                        <Tabs items={['视频', '音频', '专题', '活动', 'O2O', '回答']} atype={1} selected={status} onSelect={this._onSelect} />
                        {/* <Tabs items={['视频', '音频' ,'专题']} atype={1} selected={status} onSelect={this._onSelect} /> */}
                    </View>
                </View>
                <View style={{ paddingTop: 180 + 'rpx' }}>
                    {
                        status === 0 || status === 1 ?
                            <View>
                                {
                                    c_course.length > 0 ?
                                        c_course.map((item: any, index) => {
                                            const hasdata = ids.indexOf(item.courseId) > -1 ? true : false;
                                            return (
                                                <View className='item d_flex fd_r  p_12 ' key={'collect' + index} >
                                                    {
                                                        colltype ?
                                                            <View className='radio_box d_flex jc_ct ai_ct' onClick={() => this._change(item, index)}>
                                                                <Image src={hasdata ? asset.radio_full : asset.radio} className='radio' />
                                                            </View>
                                                            : null}

                                                    <View onClick={this._oncourseDesc.bind(this, item)} className=''>
                                                        <Course courseList={item} atype={1} />
                                                    </View>
                                                </View>
                                            )
                                        })
                                        : null}

                                {
                                    c_course.length === 0 && this.itemtype !== null ?
                                        <View className='d_flex fd_c jc_ct mt_30 ai_ct'>
                                            <Image src={sub_asset.pf_colllect} className='nocolllect' />
                                            {/* <Text className='sred_label sm_label mt_10'>还没有收藏记录</Text> */}
                                        </View>
                                        : null}
                            </View>
                            : status === 5 ?
                                <View className='ml_20 mr_20'>
                                    {
                                        reply.map((item, index) => {
                                            const on =  reply.length-1 === index
                                            return (
                                                <View key={'item' + index} className={on ? ' pb_15 d_flex fd_c ' : ' pb_15 d_flex fd_c border_bt'}
                                                onClick={() => Taro.navigateTo({ url: menu.AskComment + '?askId=' + item.replyId + '&ctype=' + 34 })}
                                            >

                                                <View className='d_flex fd_r ai_ct '>
                                                    {
                                                        item.avatar.length > 0 ?
                                                            <Image src={item.avatar} className='q_cover' />
                                                            : null}

                                                    <Text className='c33_label default_label fw_label ml_10'>{item.nickname}</Text>
                                                </View>

                                                <Text className='c33_label lg_label mt_15'>{item.title}</Text>
                                                <Text className='c33_label sm_label mt_10'>{item.content}</Text>

                                                <View className='d_flex fd_r ai_ct mt_10'>
                                                    <View className='d_flex fd_r ai_ct '>
                                                        <Image src={sub_asset.parse} mode='aspectFit' className='icon_cover' />
                                                        <Text className='sm_label tip_label ml_5'>{`${item.approval}赞同`}</Text>
                                                    </View>
                                                    <View className='d_flex fd_r ai_ct ml_30'>
                                                        <Image src={sub_asset.comt} mode='aspectFit' className='icon_cover' />
                                                        <Text className='sm_label tip_label ml_5'>{item.comment}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            )
                                        })
                                    }
                                </View>
                                :
                                <View className='findO2O' >
                                    {
                                        articleList.map((article: any, index) => {

                                            const on = articleList.length === index + 1
                                            let hasdata;

                                            if (status === 2||status === 4) {
                                                hasdata = ids.indexOf(article.articleId) > -1 ? true : false;
                                            } else if (status === 3) {
                                                hasdata = ids.indexOf(article.activityId) > -1 ? true : false;
                                            }

                                            return (
                                                <View key={'o2o' + index} className='d_flex fd_r' style={{ width: (windowWidth * 0.92).toFixed(0) + 'px' }}>
                                                    {
                                                        colltype ?
                                                            <View className='radio_sbox d_flex jc_ct ai_ct' onClick={() => this._change(article, index)}
                                                                style={{ width: (windowWidth * 0.08).toFixed(0) + 'px' }}
                                                            >
                                                                <Image src={hasdata ? asset.radio_full : asset.radio} className='radio' />
                                                            </View>
                                                            :
                                                            <View style={{ width: (windowWidth * 0.08).toFixed(0) + 'px', height: 20 + 'rpx' }}>

                                                            </View>
                                                    }
                                                    <View className='O2OItems' style={on ? { borderBottom: 0 + 'rpx', width: (windowWidth * 0.84).toFixed(0) + 'px' } : { width: (windowWidth * 0.84).toFixed(0) + 'px' }}
                                                        onClick={this.artDesc.bind(this, article)}
                                                    >
                                                        {
                                                            status === 2 ?
                                                                <Image className='O2OItem_cover' src={article.articleImg} />
                                                                : null}
                                                        {
                                                            status === 3 ?
                                                                <Image className='O2OItem_cover' src={article.activityImg} />
                                                                : null}
                                                        {
                                                            status === 4 ?
                                                                <Image className='O2OItem_cover' src={article.articleImg} />
                                                                : null}

                                                        <View className='findTip'>
                                                            <Text className='findTip_tit'>{article.title}</Text>
                                                            <Text className='findTip_date mt_5'>{article.pubTimeFt}</Text>
                                                        </View>
                                                    </View>
                                                </View>

                                            )
                                        })
                                    }
                                    {
                                        articleList.length === 0 && this.itemtype !== null ?
                                            <View className='d_flex fd_c jc_ct mt_30 ai_ct'>
                                                <Image src={sub_asset.pf_colllect} className='nocolllect' />
                                                {/* <Text className='sred_label sm_label mt_10'>还没有收藏记录</Text> */}
                                            </View>
                                            : null}
                                </View>
                    }





                </View>
                {
                    colltype ?
                        <View className='consbtn'>
                            <View className='d_flex fd_r jc_sb ai_ct pl_12 pr_5 pt_5'>
                                <View className='d_flex fd_r ai_ct ' onClick={() => this._onAllselect()}>
                                    <Image src={allType ? asset.radio_full : asset.radio} className='radio' />
                                    <Text className='lg_label c33_label pl_10'> 全选</Text>
                                </View>
                                {
                                    ids.length > 0 ?
                                        <View className='consdete' onClick={this._onDelete}>
                                            <Text className='lg_label white_label'>删除</Text>
                                        </View>
                                        :
                                        <View className='consdeted' >
                                            <Text className='lg_label white_label'>删除</Text>
                                        </View>
                                }

                            </View>

                        </View>
                        : null}
            </View>
        )
    }
}


export default MyCollect as ComponentClass