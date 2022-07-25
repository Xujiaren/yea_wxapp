import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import menu from '../../../config/menu';


import inter from '../../../config/inter'
import api from '../../../services/api'

import '../../../config/theme.css';
import './myReward.less'

type PageState = {
    rewardList: Array<{
        courseId: number,
        courseName: string,
        ctype: number,
        giftId: number,
        giftImg: string,
        giftName: string,
        integral: number,
        nickname: string,
        pubTime: number,
        pubTimeFt: string,
        rewardId: number,
        teacherId: number,
        teacherIntegral: number,
        teacherName: string,
        tuserId: number,
        userId: number,
        teacherImg: string,
        noImg: string
    }>,
    userId: number,
    page: number,
    pages: number,
    total: number,
    loadding: boolean
    intotal: number,
    itype: number,
    teacher: boolean,
}

class myReward extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '我的打赏',
        enablePullDownRefresh: true
    }
    page: number;
    pages: number;

    constructor() {
        super(...arguments)

        this.page = 0;
        this.pages = 0;

        this.state = {
            rewardList: [],
            userId: 0,
            page: 0,
            pages: 0,
            total: 0,
            loadding: false,
            intotal: 0,
            itype: 1,
            teacher: false
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        var that = this;
        that.getUser();
        that.getReward();
        that.getAll()
    }

    componentWillUnmount() {

    }

    componentDidShow() { }
    componentDidHide() { }
    getAll = () => {
        api.get('/user/reward/total', {
            itype: this.state.itype
        }).then(res => {
            if (res.data.status) {
                this.setState({
                    intotal: res.data.data
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
                        teacher: userData.teacher
                    })
                }
            })
    }

    getReward() {
        var that = this;
        const { rewardList, itype } = that.state;
        api.get(inter.UserReward, {
            itype: itype,
            page: this.page
        }).then((res) => {
            console.log(res)
            if (res.data.status) {
                let rdList = res.data.data
                if (this.page === 0) {
                    var tList = rdList.items
                } else {
                    var tList: any = rewardList.concat(rdList.items)
                }
                that.setState({
                    rewardList: tList,
                    page: rdList.page,
                    pages: rdList.pages,
                    total: rdList.total
                })

            }
        })
    }


    // 下拉
    onPullDownRefresh() {
        var self = this

        this.page = 0;

        self.setState({
            page: 0,
            rewardList: []
        }, () => {

            self.getReward();

            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
        self.setState({
            loadding: false
        })
    }

    //上拉
    onReachBottom() {
        var self = this;

        const { page, pages } = self.state

        if (page < pages) {
            this.page = this.page + 1

            self.getReward();
        } else {
            self.setState({
                loadding: true
            })
        }
    }
    onChange = (val) => {
        this.setState({
            itype: val
        }, () => {
            this.getAll()
            this.getReward()
        })
    }


    render() {

        const { loadding, rewardList, intotal, itype, teacher } = this.state;
        const items = ['收到的礼物', '送出的礼物']
        // ctype 0 点播  1  音频  2  直播  3 图文
        return (
            <View className='rewardwrap'>
                {
                    teacher ?
                        <View className='box row jc_ad bg_white'>
                            {
                                items.map((item, index) => {
                                    return (
                                        <View className='row col' onClick={this.onChange.bind(this, index)}>
                                            {
                                                index == itype ?
                                                    <View className='label_14 font_bolds'>{item}</View>
                                                    :
                                                    <View className='label_gray label_14'>{item}</View>
                                            }
                                            <View className='row jc_ct mt_5'>
                                                {
                                                    index == itype ?
                                                        <View className='tip bg_orange'></View>
                                                        :
                                                        <View className='tip'></View>
                                                }
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        : null
                }

                <View className='rigt pt_10'>
                    <View></View>
                    <View style={{ fontSize: '24rpx', color: '#F4623F' }}>
                        打赏总金额：{intotal}学分
                    </View>
                </View>
                {
                    rewardList.map((reward, index) => {

                        let title = '课程'
                        if (reward.ctype === 1) {
                            title = '音频'
                        } else if (reward.ctype === 2) {
                            title = '直播'
                        } else if (reward.ctype === 3) {
                            title = '图文'
                        }

                        return (
                            <View className='d_flex fd_r  rwItem' key={'reward' + index}>

                                <Image src={reward.teacherImg.length > 0 ? reward.teacherImg : reward.noImg} className='rw_cover' />
                                <View className='d_flex fd_c col_1'>
                                    <View className='d_flex fd_r jc_sb'>
                                        <View className='col_1 mr_10' style={{ lineHeight: 32 + 'rpx' }}>
                                            {
                                                reward.teacherName ?
                                                    <View>
                                                        <Text className='gray_label default_label'>{reward.teacherName}</Text>
                                                        <Text className='wid'></Text>
                                                        <Text className='gray_label default_label'>{title + '《' + reward.courseName + '》'}</Text>
                                                    </View>
                                                    :
                                                    <Text className='gray_label default_label'>{title + '《' + reward.courseName + '》'}</Text>
                                            }

                                        </View>
                                        <View className='d_flex fd_r ai_ct'>
                                            <Image src={reward.giftImg} className='re_icon' />
                                            <Text className='sred_label sm_label'>x1</Text>
                                            <Text className='sred_label sm_label ml_15'>{reward.integral + '  '} 学分</Text>
                                        </View>
                                    </View>
                                    <Text className='sm_label tip_label'>{reward.pubTimeFt}</Text>
                                </View>
                            </View>
                        )
                    })
                }

                {
                    loadding == true ?
                        <View className='loaddata d_flex ai_ct jc_ct bg_white pt_10 pb_10'>
                            <Text className='sm_label tip_label'>没有更多数据了</Text>
                        </View>
                        : null}

            </View>
        )
    }
}

export default myReward as ComponentClass