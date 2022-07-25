import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import menu from '../../../config/menu';

import inter from '../../../config/inter'
import api from '../../../services/api'

import asset from '../../config/asset'


import '../../../config/theme.css';
import './s_Map.less'

type PageState = {
    userId: number,
    mapList: Array<any>,
    mapSList: Array<any>,
    load: boolean,
}

function sideArr(arr, level) {
    let side_arr = [];
    side_arr = arr.find(item => item.level === level).maplevels;

    return side_arr;
}

class s_Map extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config: Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '地图',
        navigationBarBackgroundColor: '#FFF',
    }

    constructor() {
        super(...arguments)
        this.state = {
            mapList: [],
            userId: 0,
            mapSList: [],
            load: false,
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        var that = this;
        // that.getUser();
        // that._getMap();

    }

    componentWillUnmount() {

    }

    componentDidShow() {

        var that = this
        that.getUser();
        that._getMap();
        // Taro.showToast({
        //     title: '',
        //     icon: 'loading',
        //     duration: 3000
        // })
    }

    componentDidHide() { }


    getUser() {

        var that = this
        api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    let userData = res.data.data
                    that.setState({
                        userId: userData.userId,
                    })
                    if (userData.isAuth == 0) {
                        Taro.showModal({
                            title: '提示',
                            content: '学习地图仅对特定对象可见',
                            success: function (res) {
                                if (res.confirm) {
                                    Taro.navigateBack({
                                        delta: 1
                                    })
                                } else if (res.cancel) {
                                    Taro.navigateBack({
                                        delta: 1
                                    })
                                }
                            }
                        })
                    }
                }
            })
    }

    _getMap() {
        // Taro.showLoading({
        //     title: '加载中',
        // })
        Taro.hideLoading()
        var that = this;
        api.get(inter.courseMap)
            .then((res) => {

                if (res.data.status) {
                    that.setState({
                        mapList: res.data.data,
                        load: true
                    }, () => {
                        // setTimeout(function () {
                        //     Taro.hideLoading()
                        // }, 800)
                    })
                }
                if (res.data.message == 'Under maintenance') {
                    Taro.showModal({
                        title: '提示',
                        content: '学习地图正在维护',
                        success: function (res) {
                            if (res.confirm) {
                                Taro.navigateBack({ delta: 1 })
                            } else if (res.cancel) {
                                Taro.navigateBack({ delta: 1 })
                            }
                        }
                    })
                }
            })



        api.get(inter.courseMapDary)
            .then((res) => {

                if (res.data.status) {

                    that.setState({
                        mapSList: res.data.data
                    })

                }

            })
    }


    _onPass = (topic, type, isLock) => {

        // 解锁， 或者 继续答题 finishStatus  0:未解锁   1:解锁了未完成  2:完成了
        // console.log(isLock,'///')
        if (isLock) {
            Taro.showToast({
                title: '该关卡未关联任务',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        // console.log(topic, '????')
        if (topic.finishStatus === 0) {

            api.get(inter.LevelJudge + topic.levelId)
                .then((res) => {
                    if (res.data.status) {
                        const levelDesc = res.data.data

                        if (levelDesc.lockStatus === 2) {
                            Taro.showToast({
                                title: '开始闯关',
                                icon: 'none',
                                duration: 1000
                            })
                            setTimeout(function () {

                                if (topic.contentSort === 0) {
                                    if (topic.paperId > 0 && !topic.paperDTO.finish) {
                                        Taro.navigateTo({
                                            url: menu.studyAnswer + '?paper_id=' + topic.paperId + '&levelId=' + topic.levelId
                                        })
                                    } else {
                                        if (topic.courseId > 0) {
                                            if (topic.ctype == 1) {
                                                Taro.navigateTo({ url: menu.audioDesc + `?course_id=${topic.courseId}` + '&levelId=' + topic.levelId+'&ltype=1' })
                                            } else if (topic.ctype == 3) {
                                                Taro.navigateTo({
                                                    url: menu.grapWbdesc + `?course_id=${topic.courseId}` + '&levelId=' + topic.levelId+'&ltype=1'
                                                })
                                            } else {
                                                Taro.navigateTo({
                                                    url: menu.courseDesc + `?course_id=${topic.courseId}` + '&levelId=' + topic.levelId+'&ltype=1'
                                                })
                                            }

                                        }
                                    }
                                } else if (topic.contentSort === 1) {
                                    if (topic.courseDTO.finish && topic.paperId > 0) {
                                        Taro.navigateTo({
                                            url: menu.studyAnswer + '?paper_id=' + topic.paperId + '&levelId=' + topic.levelId
                                        })
                                    } else {
                                        if (topic.ctype == 1) {
                                            Taro.navigateTo({ url: menu.audioDesc + `?course_id=${topic.courseId}` + '&levelId=' + topic.levelId+'&ltype=1' })
                                        } else if (topic.ctype == 3) {
                                            Taro.navigateTo({
                                                url: menu.grapWbdesc + `?course_id=${topic.courseId}` + '&levelId=' + topic.levelId+'&ltype=1'
                                            })
                                        } else {
                                            Taro.navigateTo({
                                                url: menu.courseDesc + `?course_id=${topic.courseId}` + '&levelId=' + topic.levelId+'&ltype=1'
                                            })
                                        }
                                    }
                                } else if (topic.contentSort === 2) {
                                    if (topic.squadId > 0) {
                                        api.post('/course/pass/map/squad/' + topic.levelId)
                                            .then(res => {
                                                if (res.data.status) {
                                                    Taro.navigateTo({
                                                        url: menu.myTranDetail + '?squadId=' + topic.squadId + '&stype=0'
                                                    })
                                                } else {
                                                    Taro.showToast({
                                                        title: '赶快参加线下O2O培训班吧，惊喜等着你，加油',
                                                        icon: 'info',
                                                        duration: 1500,
                                                    })
                                                }
                                            })
                                        // Taro.showToast({
                                        //     title: '赶快参加线下O2O培训班吧，惊喜等着你，加油',
                                        //     icon: 'info',
                                        //     duration: 1500,
                                        // })

                                    }
                                }
                            }, 1000);

                        } else if (levelDesc.lockStatus === 0) {
                            Taro.showToast({
                                title: '未达到关卡等级',
                                icon: 'none',
                                duration: 1000
                            })
                        } else if (levelDesc.lockStatus === 1) {
                            Taro.showToast({
                                title: '上一关卡任务未完成',
                                icon: 'none',
                                duration: 1000
                            })
                        }

                    }
                })

        } else {

            if (topic.contentSort === 0) {
                if (topic.courseDTO.finish && topic.courseId > 0) {
                    if (topic.ctype == 1) {
                        Taro.navigateTo({ url: menu.audioDesc + `?course_id=${topic.courseId}` + '&levelId=' + topic.levelId+'&ltype=1' })
                    } else if (topic.ctype == 3) {
                        Taro.navigateTo({
                            url: menu.grapWbdesc + `?course_id=${topic.courseId}` + '&levelId=' + topic.levelId+'&ltype=1'
                        })
                    } else {
                        Taro.navigateTo({
                            url: menu.courseDesc + `?course_id=${topic.courseId}` + '&levelId=' + topic.levelId+'&ltype=1'
                        })
                    }
                } else {
                    Taro.navigateTo({
                        url: menu.studyAnswer + '?paper_id=' + topic.paperId + '&levelId=' + topic.levelId + `?course_id=${topic.courseId}`
                    })
                }
            } else if (topic.contentSort === 1) {
                if (topic.paperDTO.finish&& topic.paperId > 0) {
                    Taro.navigateTo({
                        url: menu.studyAnswer + '?paper_id=' + topic.paperId + '&levelId=' + topic.levelId + `?course_id=${topic.courseId}`
                    })
                } else {
                    if (topic.ctype == 1) {
                        Taro.navigateTo({ url: menu.audioDesc + `?course_id=${topic.courseId}` + '&levelId=' + topic.levelId+'&ltype=1' })
                    } else if (topic.ctype == 3) {
                        Taro.navigateTo({
                            url: menu.grapWbdesc + `?course_id=${topic.courseId}` + '&levelId=' + topic.levelId+'&ltype=1'
                        })
                    } else {
                        Taro.navigateTo({
                            url: menu.courseDesc + `?course_id=${topic.courseId}` + '&levelId=' + topic.levelId+'&ltype=1'
                        })
                    }
                }
            } else if (topic.squadId > 0) {
                Taro.navigateTo({
                    url: menu.myTranDetail + '?squadId=' + topic.squadId + '&stype=0'
                })
                // Taro.showToast({
                //     title: '您已经完成O2O培训，奖励20金币！继续完成课程学习吧！',
                //     icon: 'none',
                //     duration: 1500,
                // })
            }

        }

    }
    _onPasss = (topic, type, isLock) => {

        // 解锁， 或者 继续答题 finishStatus  0:未解锁   1:解锁了未完成  2:完成了
        // console.log(isLock,'///')
        if (isLock) {
            Taro.showToast({
                title: '该关卡未关联任务',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        // console.log(topic, '????')
        if (topic.finishStatus === 0) {

            api.get(inter.LevelJudge + topic.levelId)
                .then((res) => {
                    console.log(res, '???')
                    if (res.data.status) {
                        const levelDesc = res.data.data

                        if (levelDesc.lockStatus === 2) {
                            Taro.showToast({
                                title: '开始闯关',
                                icon: 'none',
                                duration: 1000
                            })
                            setTimeout(function () {

                                if (topic.contentSort === 0) {
                                    if (topic.paperId > 0 && !topic.paperDTO.finish) {
                                        Taro.navigateTo({
                                            url: menu.studyAnswer + '?paper_id=' + topic.paperId + '&levelId=' + topic.levelId
                                        })
                                    } else {
                                        if (topic.courseId > 0) {
                                            Taro.navigateTo({
                                                url: menu.courseDesc + `?course_id=${topic.courseId}` + '&levelId=' + topic.levelId+'&ltype=1'
                                            })
                                        }
                                    }
                                } else if (topic.contentSort === 1) {
                                    if (topic.courseDTO.finish && topic.paperId > 0) {
                                        Taro.navigateTo({
                                            url: menu.studyAnswer + '?paper_id=' + topic.paperId + '&levelId=' + topic.levelId
                                        })
                                    } else {
                                        Taro.navigateTo({
                                            url: menu.courseDesc + `?course_id=${topic.courseId}` + '&levelId=' + topic.levelId+'&ltype=1'
                                        })
                                    }
                                } else if (topic.contentSort === 2) {
                                    if (topic.squadId > 0) {
                                        api.post('/course/pass/map/squad/' + topic.levelId)
                                            .then(res => {
                                                if (res.data.status) {
                                                    Taro.navigateTo({
                                                        url: menu.myTranDetail + '?squadId=' + topic.squadId + '&stype=0'
                                                    })
                                                } else {
                                                    Taro.showToast({
                                                        title: '赶快参加线下O2O培训班吧，惊喜等着你，加油',
                                                        icon: 'info',
                                                        duration: 1500,
                                                    })
                                                }
                                            })
                                        // Taro.showToast({
                                        //     title: '赶快参加线下O2O培训班吧，惊喜等着你，加油',
                                        //     icon: 'info',
                                        //     duration: 1500,
                                        // })

                                    }
                                }
                            }, 1000);

                        } else if (levelDesc.lockStatus === 0) {
                            Taro.showToast({
                                title: '您的权限不足',
                                icon: 'none',
                                duration: 1000
                            })
                        } else if (levelDesc.lockStatus === 1) {
                            Taro.showToast({
                                title: '上一关卡任务未完成',
                                icon: 'none',
                                duration: 1000
                            })
                        }

                    }
                })

        } else {

            if (topic.contentSort === 0) {
                if (topic.courseDTO.finish && topic.courseId > 0) {
                    Taro.navigateTo({
                        url: menu.courseDesc + `?course_id=${topic.courseId}` + '&levelId=' + topic.levelId+'&ltype=1'
                    })
                } else {
                    Taro.navigateTo({
                        url: menu.studyAnswer + '?paper_id=' + topic.paperId + '&levelId=' + topic.levelId + `?course_id=${topic.courseId}`
                    })
                }
            } else if (topic.contentSort === 1) {
                if (topic.paperDTO.finish) {
                    Taro.navigateTo({
                        url: menu.studyAnswer + '?paper_id=' + topic.paperId + '&levelId=' + topic.levelId + `?course_id=${topic.courseId}`
                    })
                } else {
                    Taro.navigateTo({
                        url: menu.courseDesc + `?course_id=${topic.courseId}` + '&levelId=' + topic.levelId+'&ltype=1'
                    })
                }
            } else if (topic.squadId > 0) {
                Taro.navigateTo({
                    url: menu.myTranDetail + '?squadId=' + topic.squadId + '&stype=0'
                })
                // Taro.showToast({
                //     title: '您已经完成O2O培训，奖励20金币！继续完成课程学习吧！',
                //     icon: 'none',
                //     duration: 1500,
                // })
            }

        }

    }
    messages = () => {
        Taro.showToast({
            title: '未达到关卡等级',
            icon: 'none',
            duration: 1000
        })
    }
    render() {

        const { mapList, mapSList, load } = this.state;

        let r_mapList = mapList.reverse();

        let arr_btm = r_mapList.slice(r_mapList.length - 1, r_mapList.length);
        let arr_list = r_mapList.slice(0, r_mapList.length - 1);

        // if (!load) return null

        return (
            <View>
                {
                    !load ?
                        <View style={{ width: '750rpx', height: '100vh',backgroundColor:'#ffffff' }}>
                            <Image src={asset.mebib} style={{ width: '750rpx', marginTop: '26vh' }} />
                        </View>
                        :
                        <View className='root'>
                            <View className='map_cons'>
                                {
                                    arr_list.map((item, index) => {
                                        console.log(mapSList, '???')
                                        let on = item.levelName.length > 6;

                                        let side_map = [];
                                        side_map = sideArr(mapSList, item.level)
                                        // console.log(mapSList[index].lockStatus,'///',index)
                                        return (
                                            <View className='map_con' key={'item' + index}>
                                                {
                                                    item.data.length > 3 ?
                                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                                        : null
                                                }
                                                {
                                                    item.data.length > 6 ?
                                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                                        : null
                                                }
                                                {
                                                    item.data.length > 9 ?
                                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                                        : null
                                                }
                                                {
                                                    item.data.length > 12 ?
                                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                                        : null
                                                }
                                                {
                                                    item.data.length > 15 ?
                                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                                        : null
                                                }
                                                {
                                                    item.data.length > 18 ?
                                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                                        : null
                                                }
                                                {
                                                    item.data.length > 21 ?
                                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                                        : null
                                                }
                                                {
                                                    item.data.length > 24 ?
                                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                                        : null
                                                }
                                                {
                                                    item.data.length > 27 ?
                                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                                        : null
                                                }
                                                {
                                                    item.data.length > 30 ?
                                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                                        : null
                                                }
                                                {
                                                    item.data.length > 33 ?
                                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                                        : null
                                                }
                                                {
                                                    item.data.length > 36 ?
                                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                                        : null
                                                }
                                                {
                                                    item.data.length > 39 ?
                                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                                        : null
                                                }
                                                {
                                                    item.data.length > 42 ?
                                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                                        : null
                                                }
                                                {
                                                    item.data.length > 45 ?
                                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                                        : null
                                                }
                                                {
                                                    item.data.length > 48 ?
                                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                                        : null
                                                }

                                                <Image src={asset.tree_side} className='map_img_side' />

                                                {
                                                    side_map.length > 0 ?
                                                        <View className='branch_box'>

                                                            {
                                                                side_map.map((sens: any, idx) => {

                                                                    //不存在课程以及试卷
                                                                    let isLock = sens.courseId == 0 && sens.paperId == 0 && sens.squadId == 0;

                                                                    return (
                                                                        <View key={'sens' + idx} className='map_top' onClick={this._onPasss.bind(this, sens, 0, isLock)}>
                                                                            <View className='d_flex fd_c jc_ct map_top_item csj'>
                                                                                <Text className='map_tit'>{idx + 1}</Text>
                                                                                {
                                                                                    sens.finishStatus ?
                                                                                        <Image src={asset.deep} className='map_top_img' />
                                                                                        :
                                                                                        <Image src={sens.lockStatus == 2 || sens.lockStatus == 1 || isLock ? asset.finish : asset.unfinish} className='map_top_img' />
                                                                                }

                                                                                {
                                                                                    sens.lockStatus != 2 || isLock ?
                                                                                        <Image src={asset.suo_guan} className='suo' />
                                                                                        : <Image src={asset.suo_kai} className='suo' />
                                                                                }
                                                                            </View>
                                                                        </View>
                                                                    )
                                                                })
                                                            }

                                                        </View>
                                                        : null
                                                }
                                                {
                                                    item.data.length > 0 ?
                                                        <View className='map_tops'>
                                                            {
                                                                item.data.map((sen, idx) => {
                                                                    //不存在课程以及试卷
                                                                    let isLock = sen.courseId == 0 && sen.paperId == 0;
                                                                    // let isfn = item.data[idx-1]
                                                                    return (
                                                                        <View key={'item' + idx} className='map_top' onClick={this._onPass.bind(this, sen, 0, isLock)} >
                                                                            <View className='d_flex fd_c jc_ct csj'>
                                                                                <Text className='map_tit'>{idx + 1}</Text>
                                                                                {
                                                                                    sen.finishStatus ?
                                                                                        <Image src={asset.deep} className='map_top_img' />
                                                                                        :
                                                                                        <Image src={sen.lockStatus == 2 || sen.lockStatus == 1 || isLock ? asset.finish : asset.unfinish} className='map_top_img' />
                                                                                }

                                                                                {
                                                                                    sen.lockStatus != 2 || isLock ?
                                                                                        <Image src={asset.suo_guan} className='suo' />
                                                                                        : <Image src={asset.suo_kai} className='suo' />
                                                                                }


                                                                            </View>
                                                                        </View>
                                                                    )
                                                                })
                                                            }

                                                        </View>
                                                        : null
                                                }


                                                {
                                                    index != 0 ?
                                                        <View className='branceBtn'>
                                                            <Image src={asset.cloud5} mode='aspectFit' className='phase_img' />
                                                            <View className='branceBtn_box'>
                                                                <Text className='line_txt' style={on ? { fontSize: 24 + 'rpx' } : { fontSize: 32 + 'rpx' }} >{arr_list[index - 1].levelName}</Text>
                                                            </View>
                                                        </View>
                                                        : null
                                                }


                                            </View>
                                        )
                                    })
                                }
                            </View>

                            <View className='map_btm map_con' >
                                {
                                    arr_btm[0].data.length > 0 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }
                                {
                                    arr_btm[0].data.length > 3 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }
                                {
                                    arr_btm[0].data.length > 6 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }
                                {
                                    arr_btm[0].data.length > 9 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }
                                {
                                    arr_btm[0].data.length > 12 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }
                                {
                                    arr_btm[0].data.length > 15 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }
                                {
                                    arr_btm[0].data.length > 18 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }
                                {
                                    arr_btm[0].data.length > 21 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }
                                {
                                    arr_btm[0].data.length > 24 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }
                                {
                                    arr_btm[0].data.length > 27 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }
                                {
                                    arr_btm[0].data.length > 30 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }
                                {
                                    arr_btm[0].data.length > 33 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }
                                {
                                    arr_btm[0].data.length > 36 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }
                                {
                                    arr_btm[0].data.length > 39 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }
                                {
                                    arr_btm[0].data.length > 42 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }
                                {
                                    arr_btm[0].data.length > 45 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }
                                {
                                    arr_btm[0].data.length > 48 ?
                                        <Image src={asset.tree_sg} className='map_img_sides' />
                                        : null
                                }

                                <Image src={asset.tree_side_btm} className='map_img' />
                                {
                                    Array.isArray(arr_btm) && arr_btm.map((item, index) => {
                                        return (
                                            <View className='map_topss' key={'item' + index}>
                                                {
                                                    item.data.map((sen, idx) => {

                                                        //不存在课程以及试卷
                                                        let isLock = sen.courseId == 0 && sen.paperId == 0;
                                                        // let isfn = item.data[idx-1]
                                                        return (
                                                            <View key={'item' + idx} className={'map_top'} onClick={this._onPass.bind(this, sen, 0, isLock)}>
                                                                <View className='d_flex fd_c jc_ct csj'>
                                                                    <Text className='map_tit'>{idx + 1}</Text>
                                                                    {
                                                                        sen.finishStatus ?
                                                                            <Image src={asset.deep} className='map_top_img' />
                                                                            :
                                                                            <Image src={sen.lockStatus == 2 || sen.lockStatus == 1 || isLock ? asset.finish : asset.unfinish} className='map_top_img' />
                                                                    }

                                                                    {
                                                                        sen.lockStatus != 2 || isLock ?
                                                                            <Image src={asset.suo_guan} className='suo' />
                                                                            : <Image src={asset.suo_kai} className='suo' />
                                                                    }

                                                                </View>
                                                            </View>
                                                        )

                                                    })
                                                }
                                            </View>
                                        )
                                    })
                                }


                                <View className='branceBtns'>
                                    <Image src={asset.cloud5} mode='aspectFit' className='phase_img' />
                                    <View className='branceBtn_box'>
                                        <Text className='line_txt' style={{ fontSize: 32 + 'rpx' }} >{arr_list[4].levelName}</Text>
                                    </View>
                                </View>
                                <View className='branceBtnss'>
                                    <Image src={asset.cloud5} mode='aspectFit' className='phase_img' />
                                    <View className='branceBtn_box'>
                                        <Text className='line_txt' style={{ fontSize: 32 + 'rpx' }} >客户代表</Text>
                                    </View>
                                </View>

                            </View>


                        </View>
                }
            </View>

        )
    }
}

export default s_Map as ComponentClass