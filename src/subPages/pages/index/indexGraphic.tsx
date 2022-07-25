import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'


import menu from '../../../config/menu';
import { percent2percent25 } from '../../../utils/common'
import GrapCourse from '../../../components/GrapCourse'

import { connect } from '@tarojs/redux'
import { homeType } from '../../../constants/homeType'

import {
    getSiteChannel
} from '../../../actions/home'


import '../../../config/theme.css';
import './indexGraphic.less'

type PageStateProps = {
    home: homeType,
    getSiteChannel: Array<{}>

}

type PageDispatchProps = {
    getSiteChannel: (object) => any
}

type PageOwnProps = {}

type courseList = {
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
    study: null,
    summary: string,
    teacher: null
    teacherId: number,
    teacherName: string,
    ttype: number,

}


type PageState = {
    course: Array<courseList>,
    sort: number,
    channel_id: number,
    tabs: Array<string>,
    status: number,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface IndexGraphic {
    props: IProps;
}


@connect(({ home }) => ({
    home: home,
}), (dispatch) => ({
    getSiteChannel(object) {
        dispatch(getSiteChannel(object))
    }
}))

class IndexGraphic extends Component<{}, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '图文课程',
        enablePullDownRefresh: true
    }

    constructor() {
        super(...arguments)
        this.state = {
            course: [],
            sort: 0,
            channel_id: 0,
            tabs: ['最新', '最热'],
            status: 0,
        }
    }

    componentWillReceiveProps(nextProps) {
        const { home } = nextProps
        const { siteChannel } = home

        if (home !== this.props.home) {
            this.setState({
                course: siteChannel
            })
        }
    }
    componentWillMount() {
        var that = this
        const { channel_id, channelName } = this.$router.params
        Taro.setNavigationBarTitle({
            title: channelName,
        })

        that.setState({
            channel_id: parseInt(channel_id)
        })
    }

    componentDidMount() {
        this.getSiteChannel()
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }


    getSiteChannel() {
        var that = this
        const { channel_id } = that.state
        that.props.getSiteChannel({
            channel_id,
            sort: 0
        })
    }

    //图文课程详情页
    _onGrapDesc(grap) {
        Taro.navigateTo({
            url: menu.grapWbdesc + `?course_id=${grap.courseId}` + '&courseName=' + percent2percent25(`${grap.courseName}`)
        })
    }

    loaddata() {
        var that = this
        const { channel_id } = that.state
        that.props.getSiteChannel({
            channel_id,
            sort: 0
        })
    }

    onPullDownRefresh() {

        this.getSiteChannel();

        setTimeout(function () {
            //执行ajax请求后停止下拉
            Taro.stopPullDownRefresh();
        }, 1000);

    }

    _onSelect(index){
        var that = this
        const {channel_id} = that.state
        that.setState({
            status:index
        })
        that.props.getSiteChannel({
            channel_id,
            sort: index
        })
    }

    render() {
        const { course, tabs, status } = this.state;

        return (
            <View className='grapwrap'>
                <View>
                    <View className='d_flex fd_r ai_ct jc_sb head_box col_1'>
                        {
                            tabs.map((tab, index) => {
                                const on = index == status
                                return (
                                    <View key={'tab' + index} className='head_box_item d_flex fd_c ai_ct' onClick={this._onSelect.bind(this, index)}>
                                        <Text className='default_label ' style={on ? { color: '#333333', fontWeight: 'bold' } : { color: '#666666' }}>{tab}</Text>
                                        <View className='border_btn' style={on ? { backgroundColor: '#F4623F' } : {}} ></View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
              
                <View className='items pl_15 pr_15'>
                    {
                        course.map((grap: any, index) => {
                            return (
                                <View className='border_bt pb_15 pt_15' onClick={this._onGrapDesc.bind(this, grap)} key={'items' + index}>
                                    <GrapCourse courseList={grap} />
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    }
}

export default IndexGraphic as ComponentClass
