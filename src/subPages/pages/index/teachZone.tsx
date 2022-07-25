
import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'

import menu from '../../../config/menu'

import Tabs from '../../../components/Tabs'

import Course from '../../../components/Course'
import inter from '../../../config/inter'
import api from '../../../services/api'

import { connect } from '@tarojs/redux'
import { homeType } from '../../../constants/homeType'

import { percent2percent25 } from '../../../utils/common'

import '../../../config/theme.css';
import './teachZone.less'


import {
    getTeacher,
} from '../../../actions/home'

type PageStateProps = {
    home: homeType,
    teacherDesc: {},
}

type PageDispatchProps = {
    getTeacher: (object) => any,
}

type recom = {
    categoryId: number,
    ccategoryId: number,
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


type PageState = {
    status: number,
    teacher_id: number,
    teacher: {
        content: string,
        course: number,
        follow: number,
        hit: number,
        honor: string,
        isFollow: boolean,
        level: number,
        teacherId: number,
        teacherImg: string,
        teacherName: string,
        userId: number,
        galleryList: Array<{
            contentId: number,
            ctype: number,
            fpath: string,
            ftype: number,
            galleryId: number,
            link: string,
            status: number,
            teacherImg: string
        }>
    },
    category: Array<{
        categoryId: number,
        ccategoryId: number,
        categoryName: string,
        ctype: string,
        isDelete: number,
        sortOrder: number,
        status: string
    }>,
    course: Array<recom>,
    categoryId: number
}
type PageOwnProps = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface TeachZone {
    props: IProps;
}


@connect(({ home }) => ({
    home: home
}), (dispatch) => ({
    getTeacher(object) {
        dispatch(getTeacher(object))
    }
}))

class TeachZone extends Component<PageDispatchProps & PageStateProps, PageState>{
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '讲师主页'
    }

    constructor() {
        super(...arguments)
        this.state = {
            status: 0,
            teacher_id: 0,
            teacher: {
                content: '',
                course: 0,
                follow: 0,
                hit: 0,
                honor: '',
                isFollow: false,
                level: 0,
                teacherId: 0,
                teacherImg: '',
                teacherName: '',
                userId: 0,
                galleryList: []
            },
            category: [],
            course: [],
            categoryId: 0
        }
    }

    componentWillReceiveProps() {
    }

    componentWillMount() {
        const that = this
        const { teacher_id } = that.$router.params

        that.setState({
            teacher_id: parseInt(teacher_id)
        })
    }

    componentDidMount() {
        this.getTeacherDesc()
    }

    componentWillUnmount() {

    }

    componentDidShow() { }

    componentDidHide() { }

    getTeacherDesc() {
        var that = this
        const { teacher_id } = that.state

        api.get(inter.TeacherDesc + teacher_id)
            .then((res) => {
                console.log(res)
                if (res.data.status) {
                    let cateItems: Array<any> = []
                    let teacherDesc = res.data.data
                    let category = teacherDesc.category

                    for (let i = 0; i < category.length; i++) {

                        if (category[i].child.length > 0) {

                            for (let j = 0; j < category[i].child.length; j++) {

                                cateItems.push(category[i].child[j])
                            }
                        }
                    }

                    that.setState({
                        teacher: teacherDesc.teacher,
                        category: cateItems,
                        course: teacherDesc.course,
                    })
                }
            })
    }


    //关注
    _onFollow() {

        var that = this
        const { teacher_id, teacher } = that.state

        api.post(inter.PublishFollow + teacher_id).then((res) => {
            if (res.data.status) {

                teacher.isFollow = !teacher.isFollow
                that.setState({
                    teacher: teacher
                })
                api.get(inter.TeacherDesc + teacher_id,).then((res) => {
                    Taro.showToast({
                        title: '关注成功',
                        icon: 'none',
                        duration: 2000,
                    })
                })
            } else {
                Taro.showToast({
                    title: '关注失败',
                    icon: 'none'
                })
            }
        })
    }


    //取消关注
    _offFollow() {

        var that = this
        const { teacher_id, teacher } = that.state

        api.post(inter.RemoveFollow + teacher_id).then((res) => {
            if (res.data.status) {
               
                teacher.isFollow = !teacher.isFollow
                that.setState({
                    teacher: teacher
                })
                api.get(inter.TeacherDesc + teacher_id,).then((res) => {
                    Taro.showToast({
                        title: '已取消关注',
                        icon: 'none',
                        duration: 2000,
                    })
                })
            } else {
                Taro.showToast({
                    title: '取消失败',
                    icon: 'none'
                })
            }
        })
    }

    _onSelect = (index) => {
        var that = this
        const { category } = that.state

        that.setState({
            status: index
        })
        if (index > 0) {
            const cateId = category[index - 1].categoryId
            that.setState({
                categoryId: cateId
            })
        }
    }


    //详情页
    _oncourseDesc(recom) {
        if (recom.ctype === 0) {
            Taro.navigateTo({
                url: menu.courseDesc + `?course_id=${recom.courseId}` + '&courseName=' + percent2percent25(`${recom.courseName}`) + '&isback=0'
            })
        } else if (recom.ctype === 1) {
            Taro.navigateTo({ url: menu.audioDesc + '?course_id=' + recom.courseId + '&audioName=' + percent2percent25(recom.courseName) })
        } else if (recom.ctype === 3) {
            Taro.navigateTo({
                url: menu.grapWbdesc + `?course_id=${recom.courseId}` + '&courseName=' + percent2percent25(`${recom.courseName}`)
            })
        }

    }


    render() {

        const { course, status, teacher, category, categoryId } = this.state

        let cateTit: string[] = new Array("全部")
        for (let i = 0; i < category.length; i++) {
            cateTit.push(category[i].categoryName)
        }


        var rpx;
        var heightrpx = 350;
        Taro.getSystemInfo({
            success: function (res) {
                rpx = res.windowWidth / 375
            }
        })
        let lectArray: string[] = new Array()
        let lectString: string = teacher.honor
        if (lectString.indexOf('&') != -1) {
            lectArray.push(lectString.split('&')[0], lectString.split('&')[1])
        } else {
            lectArray.push(lectString)
        }
        return (
            <View className='teachwrap'>
                <View className='teachHead'>
                    <Swiper
                        className='swiper'
                        indicatorColor='rgba(255,255,355,0.49)'
                        indicatorActiveColor='#ffffff'
                        vertical={false}
                        circular
                        indicatorDots
                        autoplay
                    >
                        {
                            teacher.galleryList.map((gallery, index) => {
                                return (
                                    <SwiperItem key={'teacher_gallery_' + index}>
                                        <Image src={gallery.fpath} className='swiper_item' />
                                    </SwiperItem>
                                )

                            })
                        }
                    </Swiper>
                    <View className='teach_head bg_white d_flex fd_c p_10'>
                        <View className='d_flex fd_r ai_ct jc_sb'>
                            <Text className='lg18_label c33_label fw_label'>讲师：{teacher.teacherName}</Text>
                            {
                                teacher.isFollow ?
                                    <View className='focuson'
                                        onClick={this._offFollow.bind(this)}
                                    >
                                        <Text className='default_label red_label'>已关注</Text>
                                    </View>
                                    :
                                    <View className='focuson'
                                        onClick={this._onFollow.bind(this)}
                                    >
                                        <Text className='default_label red_label'>+关注</Text>
                                    </View>
                            }
                        </View>
                        {
                            lectArray.length > 1 ?
                                <View className='d_flex fd_c'>
                                    {
                                        lectArray.map((lectstr: any, index) => {
                                            return (
                                                <Text className='default_label tip_label mt_5' style={{ lineHeight: '30rpx' }} key={'index' + index}>{lectstr}</Text>
                                            )
                                        })
                                    }
                                </View>
                                :
                                <Text className='default_label tip_label mt_20'>{teacher.honor}</Text>
                        }
                        <View style={{ width: '100%', paddingRight: '10rpx', wordWrap: 'break-word', wordBreak: 'break-all', overflow: ' hidden' }}>
                            <Text className='default_label tip_label'>{teacher.content}</Text>
                        </View>


                    </View>
                    {
                        course.length > 0 ?
                            <View className='atabs'>
                                <Tabs items={cateTit} selected={status} onSelect={this._onSelect} type={0} />
                            </View>
                            : null}
                </View>


                {
                    course.length > 0 ?
                        <View className='recomm ' >

                            {
                                status == 0 ?
                                    <View className='recomm_items pl_10 pr_10  pb_30 bg_white'>
                                        {
                                            course.map((recom, index) => {
                                                return (
                                                    <View className='item   pb_12 pt_12 mb_12 border_bt' key={'recom' + index} onClick={this._oncourseDesc.bind(this, recom)}>
                                                        <Course courseList={recom} atype={1} />
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                    :
                                    <View className='recomm_items pl_10 pr_10  pb_30 bg_white'>
                                        {
                                            course.map((recom, index) => {
                                                const on = recom.ccategoryId == categoryId
                                                return (
                                                    <View key={'course_' + index}>
                                                        {
                                                            on ?
                                                                <View key={'recom' + index} className='item  pt_12 pb_12 mb_12 border_bt' onClick={this._oncourseDesc.bind(this, recom)}>
                                                                    <Course courseList={recom} atype={1} />
                                                                </View>

                                                                : null
                                                        }
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                            }
                        </View>
                        : null}
            </View>
        )
    }

}


export default TeachZone as ComponentClass
