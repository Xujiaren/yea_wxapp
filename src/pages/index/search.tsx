import { ComponentClass } from 'react'
import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'


import menu from '../../config/menu';
import api from '../../services/api'
import inter from '../../config/inter'
import { connect } from '@tarojs/redux'
import { homeType } from '../../constants/homeType'
import Course from '../../components/Course'
import GrapCourse from '../../components/GrapCourse'
import ConsultCourse from '../../components/ConsultCourse'

import { percent2percent25, formatTimeStampToTime, subNumTxt } from '../../utils/common'


import asset from '../../config/asset';


import '../../config/theme.css';
import './search.less'


import {
    getConfig
} from '../../actions/home'



type PageStateProps = {
    home: homeType,
    getSearchSite: Array<{}>,
    getConfig: {}
}

type PageDispatchProps = {
    getSearchSite: (object) => any,
    getConfig: () => any
}

type teacher = {
    teacherId: number,
    hit: number,
    userId: number,
    teacherName: number,
    teacherImg: string,
    userImg: string,
    follow: number,
    course: number,
    level: number,
    content: string,
    isFollow: boolean,
    reason: any,
    checkStatus: number,
    isLeaderRecomm: number,
    galleryList: Array<any>,
    courseNum: number,
    score: number,
    satisf: number,
    newCourse: number,
    honor: string,
}

type recom = {
    categoryId: number,
    chapter: number,
    chapterList: Array<{}>,
    collect: false
    content: string,
    courseId: number,
    courseImg: string,
    courseName: string,
    ctype: number,
    galleryList: Array<{}>,
    hit: number,
    integral: number,
    isRecomm: number,
    learn: number,
    pubTime: number,
    roomId: string,
    score: number,
    sortOrder: number,
    study: null
    summary: string,
    teacher: null
    teacherId: number,
    teacherName: string,
    ttype: number,
}

type audio = {
    categoryId: number,
    chapter: number,
    chapterList: Array<{}>,
    collect: false
    content: string,
    courseId: number,
    courseImg: string,
    courseName: string,
    ctype: number,
    galleryList: Array<{}>,
    hit: number,
    integral: number,
    isRecomm: number,
    learn: number,
    pubTime: number,
    roomId: string,
    score: number,
    sortOrder: number,
    study: null
    summary: string,
    teacher: null
    teacherId: number,
    teacherName: string,
    ttype: number,
}

type activity = {
    activityId: number,
    activityImg: string,
    atype: number,
    title: string,
    rule: string,
    content: string,
    mediaId: string,
    contentId: number,
    integral: number,
    beginTime: number,
    endTime: number,
    hit: number,
    pubTime: number,
    status: number,
    isDelete: number,
    flag: string,
    ctype: number,
    signendTime: number,
    voteendTime: number,
    num: number,
    follow: number,
    isFollow: false
    isApply: false
    collect: number,
    isCollect: false
    galleryList: Array<any>
    beginTimeFt: string,
    endTimeFt: string,
    pubTimeFt: string,
    signendTimeFt: string,
    voteendTimeFt: string,
    topicDTO: any
}

type special = {
    articleId: number,
    categoryId: number,
    teacherId: number,
    teacherName: string,
    atype: number,
    ctype: number,
    contentId: number,
    mediaId: string,
    title: string,
    articleImg: string,
    ttype: number,
    summary: string,
    content: string,
    canShare: number,
    isTop: number,
    hit: number,
    comment: number,
    likeNum: number,
    collectNum: number,
    pubTime: number,
    flag: string,
    isVote: number,
    voteId: number,
    endTime: number,
    link: string,
    isLink: number,
    isLike: false
    isCollect: false
    pubTimeFt: string,
    endTimeFt: string,
    gallery: Array<any>,
    voteInfo: any
}

type o2o = {
    articleId: number,
    categoryId: number,
    teacherId: number,
    teacherName: string,
    atype: number,
    ctype: number,
    contentId: number,
    mediaId: string,
    title: string,
    articleImg: string,
    ttype: number,
    summary: string,
    content: string,
    canShare: number,
    isTop: number,
    hit: number,
    comment: number,
    likeNum: number,
    collectNum: number,
    pubTime: number,
    flag: string,
    isVote: number,
    voteId: number,
    endTime: number,
    link: string,
    isLink: number,
    isLike: false
    isCollect: false
    pubTimeFt: string,
    endTimeFt: string,
    gallery: Array<any>,
    voteInfo: any
}

type PageState = {
    initType: number,
    keyword: string,
    type: number,
    status: number,
    acourseList: Array<{
        categoryId: number,
        chapter: number,
        chapterList: Array<{}>,
        collect: boolean,
        content: string,
        courseId: number,
        courseImg: string,
        courseName: string,
        ctype: number,
        galleryList: Array<{}>,
        hit: number,
        integral: number,
        isRecomm: number,
        learn: number,
        pubTime: number,
        roomId: string,
        score: number,
        sortOrder: number,
        study: null
        summary: string,
        teacher: null
        teacherId: number,
        teacherName: string,
        ttype: number,
    }>,
    articleList: Array<{
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
        isTop: number,
        like: false,
        likeNum: number,
        pubTime: number,
        pubTimeFt: string,
        summary: string,
        teacherId: number,
        title: string,
        ttype: number,
    }>,
    replayList: Array<{
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
        isTop: number,
        like: false,
        likeNum: number,
        pubTime: number,
        pubTimeFt: string,
        summary: string,
        teacherId: number,
        title: string,
        ttype: number,
    }>,
    vcourseList: Array<{
        categoryId: number,
        chapter: number,
        chapterList: Array<{}>,
        collect: boolean,
        content: string,
        courseId: number,
        courseImg: string,
        courseName: string,
        ctype: number,
        galleryList: Array<{}>,
        hit: number,
        integral: number,
        isRecomm: number,
        learn: number,
        pubTime: number,
        roomId: string,
        score: number,
        sortOrder: number,
        study: null
        summary: string,
        teacher: null
        teacherId: number,
        teacherName: string,
        ttype: number,
    }>,
    teacherList: Array<teacher>,
    teacherTotal: number,
    activityList: Array<activity>,
    activityTotal: number,
    specialList: Array<special>,
    specialTotal: number,
    audioList: Array<audio>,
    search_hot: string,
    search_def: string,
    historyList: Array<string>,
    historyLists: Array<string>,
    o2oList: Array<o2o>,
    o2oTotal: number,
    recommList: Array<recom>,
    inputxt: string,
    vcourseTotal: number,
    historyType: number,
    atabs: Array<string>,
    ctype: number,
    sort: number,
    page: number,
    acourseTotal: number,
    articleTotal: number,
    audioTotal: number,
    replayTotal: number,
    nowdate: number,
    teacherIds:Array<any>,
    ids:Array<any>
}

type PageOwnProps = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface Search {
    props: IProps;
}

@connect(({ home }) => ({
    home: home
}), (dispatch) => ({
    getConfig() {
        dispatch(getConfig())
    }
}))



class Search extends Component<{}, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '油葱学堂'
    }

    constructor() {
        super(...arguments)
        this.state = {
            initType: 0,
            keyword: '',
            type: 0, //0未搜索 1没有搜索到   2 搜索到
            status: 0,
            teacherList: [], // 讲师
            acourseList: [],
            vcourseList: [],
            articleList: [],
            replayList: [],
            audioList: [],
            specialList: [],
            o2oList: [],
            historyList: [],
            historyLists: [],
            recommList: [],
            activityList: [],

            teacherTotal: 0,
            activityTotal: 0,
            specialTotal: 0,
            o2oTotal: 0,
            inputxt: '',
            vcourseTotal: 0,
            historyType: 0,
            acourseTotal: 0,
            articleTotal: 0,
            audioTotal: 0,
            replayTotal: 0,

            search_hot: "",
            search_def: "",
            atabs: ['最新发布', '最多播放'],
            ctype: 0,
            sort: 0,
            page: 0,
            nowdate: 0,
            teacherIds:[],
            ids:[],
        }
        this._onHot = this._onHot.bind(this);
        this._onHistory = this._onHistory.bind(this);
        this._liteSearch = this._liteSearch.bind(this);
        this._allDelete = this._allDelete.bind(this);
        this._oncourseDesc = this._oncourseDesc.bind(this);
        this._onLect = this._onLect.bind(this);
    }

    componentWillReceiveProps(nextProps) {
    }
    componentWillMount() {
        var that = this
        const { keyword } = that.$router.params
        var nowTime = new Date();

        that.setState({
            initType: 0,
            keyword: keyword,
            nowdate: nowTime.getTime()
        })

        if (Array.isArray(Taro.getStorageSync('keywords'))) {
            let hisword = Taro.getStorageSync('keywords')
            that.setState({
                historyList: hisword.slice(0, 3),
            })
        } else {
            that.setState({
                historyList: []
            })
        }


    }

    componentDidMount() {
        var that = this;
        that.getRecomm()
        that._getConfig();
    }

    componentWillUnmount() { 
        let pages = Taro.getCurrentPages(); // 获取当前的页面栈 
        let prevPage = pages[pages.length - 2]; //  获取上一页面
        prevPage.setData({ //设置上一个页面的值
            keywords: this.state.keyword
        });
        console.log(prevPage)
        Taro.navigateBack({
            delta: 1
        });
    }

    componentDidShow() {
        
    }
 

    componentDidHide() {
        
     }

    // GET CONFIG

    _getConfig() {
        var that = this;
        api.get(inter.Config)
            .then((res) => {
                if (res.data.status) {
                    let config = res.data.data
                    let searchdefult: string[] = new Array()
                    searchdefult = config.search_def.split("|")

                    that.setState({
                        search_hot: config.search_hot,
                        search_def: config.search_def,
                    })
                }
            })
    }

    // 点击搜索  点击热媒搜索
    _getkeywordHis(keyword: string) {
        var that = this
        let { historyList } = that.state
        var nowTime = new Date();

        if (historyList.indexOf(keyword) != -1) {
            let index = historyList.indexOf(keyword);

            historyList.splice(index, 1)
            historyList.unshift(keyword)

            Taro.setStorageSync('keyword', historyList)
            that.setState({
                historyList: historyList
            })
        } else {

            historyList.unshift(keyword)


            Taro.setStorageSync('keywords', historyList)


            that.setState({
                historyList: historyList
            })
        }


        that.setState({
            nowdate: nowTime.getTime()
        })


    }

    getConfig() {
        this.props.getConfig()
    }

    onChange(value) {
        var that = this

        that.setState({
            keyword: value,
            initType: 1,
        })
    }

    getRecomm() {
        api.get(inter.CourseRecomm, {
            limit: 8
        }).then((res) => {
            this.setState({
                recommList: res.data.data
            })
        })
    }

    _onSearch = () => {
        var that = this
        const { keyword } = that.state
        var nowTime = new Date();

        if (keyword.length > 0) {


            this._getkeywordHis(keyword);
            that.setState({
                historyType: 0,
                type: 2,
                status: 0,
                initType: 1,
                nowdate: nowTime.getTime()
            })

            api.get(inter.SearchSite, {
                keyword: keyword
            }).then((res) => {
                console.log(res)
                if (res.data.status) {
                    let searchList = res.data.data
                    let acourseList = searchList.acourse.items.slice(0, 3)
                    let acourseTotal = searchList.acourse.total
                    let vcourseList = searchList.vcourse.items.slice(0, 3)
                    let vcourseTotal = searchList.vcourse.total
                    let articleList = searchList.article.items.slice(0, 3)
                    let articleTotal = searchList.article.total
                    let audioList = searchList.audiocourse.items.slice(0, 3)
                    let audioTotal = searchList.audiocourse.total
                    let replayList = searchList.replaycourse.items.slice(0, 3)
                    let replayTotal = searchList.replaycourse.total
                    let activityList = searchList.activity.items.slice(0, 3)
                    let activityTotal = searchList.activity.total
                    let specialList = searchList.special.items.slice(0, 3)
                    let specialTotal = searchList.special.total
                    let ids = []
                    if(searchList.special.items.length>0){
                        searchList.special.items.map(item=>{
                            ids = ids.concat(item.articleId)
                        })
                        that.setState({
                            ids:ids
                        })
                    }
                    let teacherList = searchList.teacher.items.slice(0, 3)
                    let teacherTotal = searchList.teacher.total
                    // let o2oList = searchList.o2o.items
                    // let o2oTotal = searchList.o2o.total

                    // if(acourseList.length > 0  || vcourseList.length > 0 || articleList.length > 0 || audioList.length > 0 || replayList.length > 0 || activityList.length > 0 || specialList.length > 0 || o2oList.length > 0){   
                    if (acourseList.length > 0 || vcourseList.length > 0 || articleList.length > 0 || audioList.length > 0 || replayList.length > 0 || specialList.length > 0 || teacherList.length > 0 || activityList.length > 0) {

                        that.setState({
                            type: 2
                        })

                    } else {

                        that.setState({
                            type: 1
                        })

                    }
                    that.setState({
                        acourseList: acourseList,
                        vcourseList: vcourseList,
                        articleList: articleList,
                        audioList: audioList,
                        replayList: replayList,
                        vcourseTotal: vcourseTotal,
                        acourseTotal: acourseTotal,
                        articleTotal: articleTotal,
                        audioTotal: audioTotal,
                        replayTotal: replayTotal,
                        activityList: activityList,
                        activityTotal: activityTotal,
                        specialList: specialList,
                        specialTotal: specialTotal,

                        teacherList: teacherList,
                        teacherTotal: teacherTotal,
                        // o2oList:o2oList,
                        // o2oTotal:o2oTotal
                    })
                }
            })

            api.post(inter.userLog, {
                log_type: 1,
                type: 0,
                device_id: 0,
                intro: '首页搜索',
                content_id: 0,
                param: keyword,
                from: 0,
            }).then((res) => {
                console.log('ee')
            })



        } else {
            Taro.showToast({
                title: '请输入关键词',
                icon: 'none',
                duration: 2000
            })
        }

    }

    //热搜
    _onHot(item) {
        var that = this;
        // this._getkeywordHis(item);
        that.setState({
            historyType: 0,
            type: 2,
            keyword: item,
            initType: 1,
        })
        if (item.length > 0) {
            api.get(inter.SearchSite, {
                keyword: item
            }).then((res) => {
                if (res.data.status) {
                    let searchList = res.data.data
                    let acourseList = searchList.acourse.items.slice(0, 3)
                    let vcourseList = searchList.vcourse.items.slice(0, 3)
                    let vcourseTotal = searchList.vcourse.total
                    let acourseTotal = searchList.acourse.total
                    let articleList = searchList.article.items.slice(0, 3)
                    let articleTotal = searchList.article.total
                    let audioList = searchList.audiocourse.items.slice(0, 3)
                    let audioTotal = searchList.audiocourse.total
                    let replayList = searchList.replaycourse.items.slice(0, 3)
                    let replayTotal = searchList.replaycourse.total
                    let activityList = searchList.activity.items.slice(0, 3)
                    let activityTotal = searchList.activity.total
                    let specialList = searchList.special.items.slice(0, 3)
                    let specialTotal = searchList.special.total
                   
                    // let o2oList = searchList.o2o.items
                    // let o2oTotal = searchList.o2o.total

                    let teacherList = searchList.teacher.items.slice(0, 3)
                    let teacherTotal = searchList.teacher.total
                    
                    // if(acourseList.length > 0  || vcourseList.length > 0 || articleList.length > 0 || audioList.length > 0 || replayList.length > 0 || activityList.length > 0 || specialList.length > 0 || o2oList.length > 0){
                    if (acourseList.length > 0 || vcourseList.length > 0 || articleList.length > 0 || audioList.length > 0 || replayList.length > 0 || specialList.length > 0 || teacherList.length > 0 || activityList.length > 0) {
                        that.setState({
                            type: 2
                        })
                    } else {
                        that.setState({
                            type: 1
                        })
                    }

                    that.setState({
                        acourseList: acourseList,
                        vcourseList: vcourseList,
                        articleList: articleList,
                        audioList: audioList,
                        replayList: replayList,
                        vcourseTotal: vcourseTotal,
                        acourseTotal: acourseTotal,
                        articleTotal: articleTotal,
                        audioTotal: audioTotal,
                        replayTotal: replayTotal,
                        activityList: activityList,
                        activityTotal: activityTotal,
                        specialList: specialList,
                        specialTotal: specialTotal,
                        teacherList: teacherList,
                        teacherTotal: teacherTotal,
                        // o2oList:o2oList,
                        // o2oTotal:o2oTotal
                    })
                }
            })
        }
    }

    //单个记录删除
    _onHistory(item, index) {
        var that = this;
        let { historyType } = that.state

        let perhis = Taro.getStorageSync('keywords')

        perhis.splice(index, 1)


        if (historyType == 1) {

            that.setState({

                historyList: perhis,
                historyType: 1
            })
        }

        that.setState({
            historyList: perhis.slice(0, 3),
            historyType: 0
        })

        Taro.setStorageSync('keywords', perhis)

    }

    // 全部记录删除
    _allDelete() {
        var that = this
        let { historyList } = that.state
        that.setState({
            historyList: [],
            historyLists: []
        })
        historyList = []

        Taro.setStorageSync('keywords', historyList)

    }


    _allSearch(type) {

        var that = this
        let { historyList } = that.state
        historyList = Taro.getStorageSync('keywords')
        that.setState({
            historyList: historyList,
            historyType: 1
        })

    }



    _liteSearch(type) {

        var that = this
        let { historyList } = that.state
        that.setState({
            historyList: historyList.slice(0, 3),
            historyType: 0
        })
    }

    _onDelete = () => {

    }

    //详情页
    _oncourseDesc(recom) {
        if (recom.ctype === 3) {
            Taro.navigateTo({
                url: menu.grapWbdesc + `?course_id=${recom.courseId}` + '&courseName=' + percent2percent25(`${recom.courseName}`)
            })
        } else if (recom.ctype === 0 || recom.ctype === 2) {
            Taro.navigateTo({
                url: menu.courseDesc + `?course_id=${recom.courseId}` + '&courseName=' + percent2percent25(`${recom.courseName}`) + '&isback=0'
            })
        } else if (recom.ctype === 1) {
            Taro.navigateTo({ url: menu.audioDesc + '?course_id=' + recom.courseId + '&audioName=' + percent2percent25(recom.courseName) })
        }
    }

    // 活动 详情
    activityDesc(findt) {
        Taro.navigateTo({
            url: menu.activityDesc + '?activityId=' + findt.activityId + '&articleName=' + percent2percent25(findt.title) + '&atype=' + findt.atype
        })
    }

    // 精彩回顾
    artDesc(o2o) {

        Taro.navigateTo({
            url: menu.artDesc + '?articleId=' + o2o.articleId + '&articleName=' + percent2percent25(o2o.title)
        })
    }


    // 专题详情
    specialDesc(article) {
        Taro.navigateTo({
            url: menu.projectDesc + '?articleId=' + article.articleId + '&articleName=' + percent2percent25(article.title)
        })
    }

    //换一批
    _update_recom() {
        api.get(inter.CourseRecomm, {
            limit: 8
        }).then((res) => {
            this.setState({
                recommList: res.data.data
            })
        })
    }


    //选择
    _onLoadcourse() {
        const { keyword, ctype, sort, page } = this.state
        api.get(inter.CourseSearchSite, {
            keyword: keyword,
            ctype: ctype,
            sort: sort,
            page: page
        }).then((res) => {
            if (res.data.status) {
                let searchList = res.data.data
                this.setState({
                    vcourseList: searchList.items
                })
            }
        })
    }

    _onSelect(index) {
        this.setState({
            status: index,
            sort: index,
            vcourseList: []
        }, () => {
            this._onLoadcourse()
        })
    }


    //图文课程详情页
    _onGrapDesc(grap) {
        Taro.navigateTo({
            url: menu.grapWbdesc + `?course_id=${grap.courseId}` + '&courseName=' + percent2percent25(`${grap.courseName}`)
        })
    }

    // 资讯详情
    _consultDesc(art) {

        if (art.isLink === 1) {
            Taro.navigateTo({ url: menu.adWebView + '?link=' + `${art.link}` + '&ad=""' })
        } else {
            Taro.navigateTo({ url: menu.consultDesc + '?articleId=' + art.articleId + '&cousultName=' + percent2percent25(art.title) })
        }

    }

    _onLect(lect) {

        Taro.navigateTo({ url: menu.teachZone + '?teacher_id=' + `${lect.teacherId}` })
    }


    render() {

        const { initType, type, vcourseList, search_hot, keyword, recommList,ids, status, historyLists, atabs, acourseList, acourseTotal, articleList, articleTotal, audioList, replayList, replayTotal, activityList, activityTotal, specialList, specialTotal, nowdate, o2oList, o2oTotal, vcourseTotal, teacherList, teacherTotal } = this.state

        let { historyList, historyType } = this.state
        let searchHot: string[] = new Array()
        searchHot = search_hot.split("|")

        // console.log(specialList,'activityList',specialTotal)

        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {

        }



        return (
            <View className='searchwrap'>
                <View className='searchbox'>
                    <View className='d_flex fd_r ai_ct pl_15 pr_15 searchhead' >
                        <View className='col_1 searchleft d_flex fd_r ai_ct'>
                            <Image src={asset.search} className='s_img' />
                            <Input
                                className='default_label ml_10 col_1'
                                placeholder={keyword}
                                value={initType === 0 ? '' : this.state.keyword}
                                onConfirm={this._onSearch}
                                onInput={(e) => this.setState({ keyword: e.detail.value, initType: 1 })}
                            />
                        </View>
                        <View className='searchbtn' onClick={this._onSearch}>
                            <Text className='black_label default_label'>搜索</Text>
                        </View>
                    </View>



                    {
                        type == 1 ?
                            <View className='pt_20 pb_20 search_his d_flex ai_ct jc_ct mt_10'>
                                <View className='d_flex fd_c ai_ct search_full'>
                                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/d09e51f0-633e-4fa5-82ed-6335ae27f814.png'} className='no_search' />
                                    <Text className='sred_label sm_label mt_15'>没有找到相关内容</Text>
                                </View>
                            </View>
                            : null}



                </View>

                {
                    type == 0 ?
                        <View>
                            <View className='search_his mt_15  '>
                                {
                                    historyList.length > 0 ?
                                        <View className='d_flex fd_r jc_fe ai_ct  pb_5 pr_15' onClick={this._allDelete}>
                                            <Text className='default_label tip_label'>清除历史</Text>
                                        </View>
                                        : null}

                                {
                                    historyList && historyList.map((item, index) => {
                                        return (
                                            <View key={'item' + index} className='p_15  d_flex fd_r jc_sb ai_ct border_bt'>
                                                <View onClick={() => this._onHot(item)} className='col_1'>
                                                    <Text className='default_label tip_label'>{item}</Text>
                                                </View>
                                                <View onClick={this._onHistory.bind(this, item, index)}>
                                                    <Image src={asset.dete_icon} className='dete_icon' />
                                                </View>

                                            </View>
                                        )
                                    })
                                }
                                {
                                    historyList.length > 0 ?
                                        <View>
                                            {
                                                historyType == 0 ?
                                                    <View className='d_flex jc_ct ai_ct pt_15 pb_15' onClick={this._allSearch.bind(this, 0)}>
                                                        <Text className='sm_label gray_label'>全部搜索记录</Text>
                                                    </View>
                                                    :
                                                    <View className='d_flex jc_ct ai_ct pt_15 pb_15' onClick={this._liteSearch.bind(this, 1)}>
                                                        <Text className='sm_label gray_label'>收回全部搜索记录</Text>
                                                    </View>
                                            }

                                        </View>

                                        : null}

                            </View>

                            <View className='search_box d_flex fd_c ml_20 mr_20'>
                                <Text className='lg_label pt_15 pb_20 c33_label fw_label'>热门搜索</Text>
                                <View className='search_hot'>
                                    {
                                        searchHot.length > 0 && searchHot.map((item, index) => {
                                            return (
                                                <View className='search_item ' key={'item' + index} onClick={() => this._onHot(item)}>
                                                    <Text className='sm_label sred_label'>{item}</Text>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                        </View>
                        : null}
                {
                    type == 1 ?
                        <View>
                            <View className='recomm pl_12 pr_12' >
                                <View className='head pl_2 pr_2 pt_12 pb_12 d_flex fd_r jc_sb ai_ct'>
                                    <Text className='lg_label c33_label '>猜你喜欢</Text>
                                    <View className='d_flex fd_r ai_ct jc_ct' onClick={this._update_recom}>
                                        <Text className='tip_label default_label'>换一批</Text>
                                        <Image src={asset.update_icon} className=' update_icon ml_5' />
                                    </View>
                                </View>
                                <View className='recomm_items'>
                                    {
                                        recommList.map((recom, index) => {
                                            return (
                                                <View className='pb_20 ' key={'recom' + index}
                                                    onClick={this._oncourseDesc.bind(this, recom)}
                                                >
                                                    <Course courseList={recom} atype={1} />
                                                </View>

                                            )
                                        })
                                    }
                                </View>
                            </View>
                        </View>
                        : null}
                {
                    type == 2 ?
                        <View>

                            {/* 讲师*/}
                            {
                                teacherList.length > 0 ?
                                    <View className='recomm pl_12 pr_12 search_his' >
                                        <View className='head pl_2 pt_12 pb_12 d_flex fd_r jc_sb ai_ct'>
                                            <Text className='default_label gray_label '>讲师 {teacherTotal > 99 ? '99+' : teacherTotal}</Text>
                                            <View className='d_flex fd_r ai_ct jc_ct pl_12'
                                                onClick={() => Taro.navigateTo({ url: menu.lecturer+'?keyword='+keyword})}
                                            >
                                                <Text className='tip_label sm_label fw_label'>查看更多</Text>
                                                <Image src={asset.arrow_right} className='arrow_right' />
                                            </View>
                                        </View>
                                        <View className='recomm_items pb_20'>
                                            {
                                                teacherList.map((lect, index) => {
                                                    let on = index === teacherList.length - 1;
                                                    return (
                                                        <View key={'lect' + index} className={on ? 'lect_box d_flex fd_r pt_10 ' : 'lect_box d_flex border_bt fd_r pt_10 pb_10'} >
                                                            <View className='d_flex fd_r  col_1 mr_15'>
                                                                <View className='lect_img'>
                                                                    <Image src={lect.teacherImg} mode='scaleToFill' className='lect_img' />
                                                                </View>
                                                                <View className='d_flex fd_c jc_sb ml_5'>
                                                                    <View className='d_flex  fd_c'>
                                                                        <Text className=' c33_label default_label fw_label '>{lect.teacherName}</Text>
                                                                        {
                                                                            lect.honor !== '' ?
                                                                                <Text className='tip_label sm_label wordstyle'>{subNumTxt(lect.honor, 30)}</Text>
                                                                                : null}
                                                                    </View>
                                                                    <Text className='tip_label sm_label'>共{lect.course}讲</Text>
                                                                </View>
                                                            </View>
                                                            <View className='d_flex fd_r ai_ct jc_fe'>
                                                                <View className='lect_btn' onClick={this._onLect.bind(this, lect)}>
                                                                    <Text className='sm_label sred_label'>进入主页</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>

                                    </View>
                                    : null}

                            {/* 视频 */}

                            {
                                vcourseList.length > 0 ?
                                    <View className='recomm pl_12 pr_12 search_his' >
                                        <View className='head pl_2 pt_12 pb_12 d_flex fd_r jc_sb ai_ct'>
                                            <Text className='default_label gray_label '>视频课程 {vcourseTotal > 99 ? '99+' : vcourseTotal}</Text>
                                            <View className='d_flex fd_r ai_ct jc_ct pl_12'
                                                onClick={() => Taro.navigateTo({ url: menu.searchList + '?ctype=0&btype=0' + '&keyword=' + percent2percent25(`${keyword}`) })}
                                            >
                                                <Text className='tip_label sm_label fw_label'>查看更多</Text>
                                                <Image src={asset.arrow_right} className='arrow_right' />
                                            </View>
                                        </View>
                                        <View className='recomm_items'>
                                            {
                                                vcourseList.map((recom, index) => {
                                                    let on = index === vcourseList.length - 1;
                                                    return (
                                                        <View className={on ? 'mb_10  pb_10 ' : 'mb_10 border_bt pb_10'} key={'recom' + index}
                                                            onClick={this._oncourseDesc.bind(this, recom)}>
                                                            <Course courseList={recom} atype={0} />
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                    : null}

                            {
                                replayList.length > 0 ?
                                    <View className='recomm pl_12 pr_12 search_his' >
                                        <View className='head pl_2  pt_12 pb_12 d_flex fd_r jc_sb ai_ct'>
                                            <Text className='default_label gray_label '>回播课程 {replayTotal > 99 ? '99+' : replayTotal}</Text>
                                            <View className='d_flex fd_r ai_ct jc_ct pl_12'
                                                onClick={() => Taro.navigateTo({ url: menu.searchList + '?ctype=2&btype=0' + '&keyword=' + percent2percent25(`${keyword}`) })}
                                            >
                                                <Text className='tip_label sm_label'>查看更多</Text>
                                                <Image src={asset.arrow_right} className='arrow_right' />
                                            </View>
                                        </View>
                                        <View className='recomm_items'>
                                            {
                                                replayList.map((recom, index) => {

                                                    let on = index === replayList.length - 1;

                                                    return (
                                                        <View className={on ? 'mb_10  pb_10 ' : 'mb_10 border_bt pb_10 '} key={'recom' + index}
                                                            onClick={this._oncourseDesc.bind(this, recom)}>
                                                            <Course courseList={recom} atype={0} />
                                                        </View>

                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                    : null}


                            {/* 图文 */}
                            {
                                acourseList.length > 0 ?
                                    <View className='graphic'>
                                        <View className='head pl_2 pr_2   d_flex fd_r jc_sb ai_ct'>
                                            <Text className='default_label gray_label'>图文课程 {acourseTotal > 99 ? '99+' : acourseTotal}</Text>
                                            <View className='d_flex fd_r ai_ct jc_ct pl_12'
                                                onClick={() => Taro.navigateTo({ url: menu.searchList + '?ctype=3&btype=1' + '&keyword=' + percent2percent25(`${keyword}`) })}
                                            >
                                                <Text className='tip_label sm_label'>查看更多</Text>
                                                <Image src={asset.arrow_right} className='arrow_right' />
                                            </View>
                                        </View>
                                        <View className='items'>
                                            {
                                                acourseList.map((grap: any, index) => {

                                                    let on = index === acourseList.length - 1;

                                                    return (
                                                        <View className={on ? 'item  pt_15 pb_15 d_flex fd_c' : 'item border_bt pt_15 pb_15 d_flex fd_c'} key={'items' + index}
                                                            onClick={() => {
                                                                Taro.navigateTo({
                                                                    url: menu.grapWbdesc + `?course_id=${grap.courseId}` + '&courseName=' + percent2percent25(`${grap.courseName}`)
                                                                })
                                                            }}
                                                        >
                                                            <GrapCourse courseList={grap} />
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                    : null}

                            {/* 资讯 */}

                            {
                                articleList.length > 0 ?
                                    <View className='article search_his'>
                                        <View className='head pl_2 pr_2   d_flex fd_r jc_sb ai_ct'>
                                            <Text className='default_label gray_label'>资讯 {articleTotal > 99 ? '99+' : articleTotal}</Text>
                                            <View className='d_flex fd_r ai_ct jc_ct pl_12'
                                                onClick={() => Taro.navigateTo({ url: menu.consultList + '?type=0'+'&keyword='+keyword })}
                                            >
                                                <Text className='tip_label sm_label'>查看更多</Text>
                                                <Image src={asset.arrow_right} className='arrow_right' />
                                            </View>
                                        </View>
                                        <View className='consult'>
                                            {
                                                articleList.map((recom, index) => {

                                                    let on = index === articleList.length - 1;

                                                    return (
                                                        <View className={on ? 'itemr pb_10 pt_10' : 'itemr border_bt pb_10 pt_10'} key={'items' + index}
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

                            {/* 音频 */}
                            {
                                audioList.length > 0 ?
                                    <View className='recomm pl_12 pr_12 search_his' style={{ borderTop: '20rpx solid #f5f5f5' }}>
                                        <View className='head pl_2 pr_2 pt_12 pb_12 d_flex fd_r jc_sb ai_ct'>
                                            <Text className='default_label gray_label '>音频课程 {audioList.length > 99 ? '99+' : audioList.length}</Text>
                                            <View className='d_flex fd_r ai_ct jc_ct pl_12'
                                                onClick={() => Taro.navigateTo({ url: menu.searchList + '?ctype=1&btype=0' + '&keyword=' + percent2percent25(`${keyword}`) })}
                                            >
                                                <Text className='tip_label sm_label'>查看更多</Text>
                                                <Image src={asset.arrow_right} className='arrow_right' />
                                            </View>
                                        </View>
                                        <View className='recomm_items'>
                                            {
                                                audioList.map((recom, index) => {
                                                    let on = index === audioList.length - 1;

                                                    return (
                                                        <View className={on ? 'mb_10  pb_10 ' : 'mb_10 border_bt pb_10 '} key={'recom' + index}
                                                            onClick={this._oncourseDesc.bind(this, recom)}>
                                                            <Course courseList={recom} atype={0} />
                                                        </View>

                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                    : null}

                            {/* 活动 */}

                            {
                                activityList.length > 0 ?
                                    <View className='active pl_12 pr_12 search_his mt_20' >
                                        <View className='head pl_2 pr_2   d_flex fd_r jc_sb ai_ct'>
                                            <Text className='default_label gray_label'>活动 {activityTotal > 99 ? '99+' : activityTotal}</Text>
                                            <View className='d_flex fd_r ai_ct jc_ct pl_12'
                                                onClick={() => Taro.switchTab({ url: menu.find })}
                                            >
                                                <Text className='tip_label sm_label'>查看更多</Text>
                                                <Image src={asset.arrow_right} className='arrow_right' />
                                            </View>
                                        </View>
                                        <View className='mt_10'>
                                            {
                                                activityList.map((findt, index) => {
                                                    // const on = index === activityList.length - 1

                                                    let tip = '未开始'

                                                    if (nowdate < findt.beginTime * 1000) {
                                                        tip = '未开始'
                                                    } else if (nowdate > findt.beginTime * 1000 && nowdate < findt.endTime * 1000) {
                                                        tip = '进行中'
                                                    } else {
                                                        tip = '已结束'
                                                    }

                                                    return (
                                                        <View className='articleItems bdr_bt' onClick={this.activityDesc.bind(this, findt)} key={'item' + index} >
                                                            <View className='arthead'>
                                                                <Image className='arthead_cover' mode='scaleToFill' src={findt.activityImg} />
                                                                <View className='topright'>
                                                                    <Text className='toptxt'>{tip}</Text>
                                                                </View>
                                                                <View className='artbottom'>
                                                                    <Text className='artbot'>{formatTimeStampToTime(findt.beginTime * 1000)} - {formatTimeStampToTime(findt.endTime * 1000)}</Text>
                                                                </View>
                                                            </View>
                                                            <View className='d_flex fd_r  jc_sb mt_15'>
                                                                <Text className='lg_label c33_label fw_label col_1'>{subNumTxt(findt.title, 26)}</Text>
                                                                {
                                                                    findt.atype !== 0 ?
                                                                        <Text className='tip_label sm_label'>{findt.num}人参与</Text>
                                                                        : null}

                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                    : null}

                            {/* 专题 */}

                            {
                                specialList.length > 0 ?
                                    <View className='special pl_12 pr_12 search_his mt_20'>
                                        <View className='head pl_2 pr_2   d_flex fd_r jc_sb ai_ct'>
                                            <Text className='default_label gray_label'>专题 {specialTotal > 99 ? '99+' : specialTotal}</Text>
                                            <View className='d_flex fd_r ai_ct jc_ct pl_12'
                                                onClick={() => {
                                                    getApp().globalData.showDialog=keyword
                                                    getApp().globalData.showDialogs=1
                                                    Taro.switchTab({ 
                                                        url: menu.find,
                                                        success:(res)=>{
                                                            
                                                        }
                                                    })
                                                }}
                                            >
                                                <Text className='tip_label sm_label'>查看更多</Text>
                                                <Image src={asset.arrow_right} className='arrow_right' />
                                            </View>
                                        </View>
                                        <View className='mt_10'>
                                            {
                                                specialList.map((article: any, index) => {

                                                    let on = specialList.length === index + 1;

                                                    return (
                                                        <View className={on ? 'subJectItems' : 'subJectItems bdr_bt'} key={'o2o' + index}
                                                            onClick={this.specialDesc.bind(this, article)}
                                                        >
                                                            <Image className='subJectItem_cover' src={article.articleImg} />
                                                            <View className='findTip d_flex fd_c'>
                                                                <Text className='lg_label c33_label fw_label'>{subNumTxt(article.title, 36)}</Text>
                                                                <View className='recom_bg'>
                                                                    <Text className='gray_label default_label'>{article.summary}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                    : null}

                            {/* 精彩回顾 */}

                            {
                                o2oList.length > 0 ?
                                    <View className='special pl_12 pr_12 search_his mt_20'>
                                        <View className='head pl_2 pr_2   d_flex fd_r jc_sb ai_ct'>
                                            <Text className='default_label gray_label'>精彩回顾 {o2oTotal > 99 ? '99+' : o2oTotal}</Text>
                                            <View className='d_flex fd_r ai_ct jc_ct pl_12'
                                                onClick={() => Taro.navigateTo({ url: menu.profesSkill })}
                                            >
                                                <Text className='tip_label sm_label'>查看更多</Text>
                                                <Image src={asset.arrow_right} className='arrow_right' />
                                            </View>
                                        </View>
                                        <View className='mt_10'>
                                            {
                                                o2oList.map((o2o: any, index) => {
                                                    let on = index === o2oList.length - 1;
                                                    return (
                                                        <View className={on ? 'subJectItems' : 'subJectItems bdr_bt'}
                                                            key={'o2o' + index}
                                                            onClick={this.artDesc.bind(this, o2o)}
                                                        >
                                                            <Image className='subJectItem_cover' mode='aspectFill' src={o2o.articleImg} />
                                                            <View className='findTip d_flex fd_c '>
                                                                <Text className='lg_label fw_label c33_label'>{subNumTxt(o2o.title, 36)}</Text>
                                                                <Text className='sm_label tip_label mt_5'>{o2o.pubTimeFt}</Text>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                    : null}
                        </View>
                        : null}
            </View>
        )
    }
}


export default Search as ComponentClass