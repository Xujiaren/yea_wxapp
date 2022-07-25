import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem, Button, Video, Canvas } from '@tarojs/components'

import { connect } from '@tarojs/redux'
import menu from '../../../config/menu'
import asset from '../../../config/asset'
import inter from '../../../config/inter'
import api from '../../../services/api'


import '../../../config/theme.css';
import './qiandaoImg.less'



type PageState = {
    page: number,
    pages: number,
    status: number,
    navHeight: number,//刘海高度
    capHeight: number,//胶囊高度
    downId: number,
    index: number,
    down_list: any,
    galleryList: Array<{
        contentId: number,
        ctype: number,
        fpath: string,
        ftype: number,
        galleryId: number,
        link: string,
        status: number,
        title: string
    }>
    current: number,
    current_num: number,
    play: number,
    like: boolean,
    path: string,
    codeImg: string,
    drawStatus: number,
    fpath: any,
}


class qiandaoImg extends Component<{}, PageState> {
    config = {
        navigationStyle: 'custom',
    }

    page: number
    pages: number
    constructor(props) {
        super(props)

        this.page = 0;
        this.pages = 0;

        this.state = {
            page: 0,
            pages: 0,
            status: 0,
            navHeight: 0,
            capHeight: 0,
            downId: 0,
            index: 0,
            down_list: {},
            galleryList: [],
            current: 0,
            current_num: 0,
            play: 0,
            like: false,
            path: '',
            codeImg: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1656035822581.png',
            drawStatus: 0,
            fpath: ''
        }

    }



    componentDidShow() {

    }

    componentWillMount() {
        const { path } = this.$router.params;
        this.setState({
            fpath:path
        })
        Taro.setNavigationBarTitle({
            title: '每日签到',
        })
        wx.showShareMenu({

            withShareTicket: true,

            menus: ['shareAppMessage', 'shareTimeline']
        })
    }

    getTempPath(url) {
        if (this.state.down_list.ftype == 2) {
            return new Promise((resolve, reject) => {
                Taro.downloadFile({
                    url: url,
                    success: function (res) {
                        var temp = res.tempFilePath
                        Taro.saveImageToPhotosAlbum({
                            filePath: temp,
                            success(res) {
                                return resolve(res)
                            },
                            fail(err) {
                                reject(url + JSON.stringify(err))
                            }
                        })
                    },
                    fail(err) {
                        reject(url + JSON.stringify(err))
                    }
                })
            })
        } else {
            return new Promise((resolve, reject) => {
                Taro.downloadFile({
                    url: url,
                    success: function (res) {
                        var temp = res.tempFilePath
                        Taro.saveVideoToPhotosAlbum({
                            filePath: temp,
                            success(res) {
                                return resolve(res)
                            },
                            fail(err) {
                                reject(url + JSON.stringify(err))
                            }
                        })
                    },
                    fail(err) {
                        reject(url + JSON.stringify(err))
                    }
                })
            })
        }

    }
    getsave() {
        return new Promise((resolve, reject) => {
            Taro.getSetting({
                success(res) {
                    if (!res.authSetting['scope.writePhotosAlbum']) {
                        // 如果没有写入权限，则获取写入相册权限
                        Taro.authorize({
                            scope: 'scope.writePhotosAlbum',
                            success() {
                                resolve()
                            },
                            fail(err) {
                                reject(err)
                                // 用户拒绝授权
                                Taro.showModal({
                                    content: '检测到您没打开的相册权限，是否去设置打开？',
                                    confirmText: '确认',
                                    cancelText: '取消',
                                    success(res) {
                                        if (res.confirm) {
                                            Taro.openSetting({
                                                success: res => { }
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    } else {
                        resolve()
                    }
                },
                fail(e) {
                    reject(e)
                }
            })
        })
    }
    onShareAppMessage(ops) {
        if (ops.from === 'button') {
            // 来自页面内转发按钮
            // console.log(ops.target)
        }
        return {
            title: '每日签到',
            path: menu.qiandaoImg + '?path='+this.state.fpath,
            imageUrl: this.state.fpath,
            success: function (res) {
                Taro.navigateBack({
                    delta: 1
                })
            },
            fail: function (res) {
                // 转发失败
                Taro.navigateTo({
                    url: menu.downLoad
                })
            }
        }
    }

    goBack = () => {
        let pages = Taro.getCurrentPages()
        console.log(pages)
        if (pages.length == 1) {
            Taro.switchTab({
                url: menu.index
            })
        } else {
            Taro.navigateBack({
                delta: 1
            })
        }

    }
    onDown=()=>{
        Taro.showLoading({
            title: '下载中',
            mask: true
        })
        Taro.downloadFile({
            url:this.state.fpath,
            success:function(res){
                if (res.statusCode === 200) {
                    Taro.playVoice({
                        filePath: res.tempFilePath
                    })
                    Taro.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success(ress){
                            Taro.showToast({
                                title: '下载完成',
                                duration: 3000
                            })
                        }
                    })
                }
            }
        })
    }
    render() {
        const { down_list, galleryList, current, current_num, drawStatus, fpath } = this.state
        return (
            <View className=''>
                <View className={'box_top'}>
                    <View onClick={this.goBack}>
                        <Image src={asset.lg_icon} className='size_34' />
                    </View>

                    <Button className='share' open-type='share' onShareAppMessage={this.onShareAppMessage}>
                        <Image src={asset.share_atlas} className='share_picture' />
                    </Button>

                </View>
                <View className={'picture'}>
                    <Image src={fpath} style={{ height: '100%' }} mode='aspectFit' />
                </View>
                <View className={'box_foot'}>

                    <View className='btn' onClick={this.onDown}>
                        保存图片
                        </View>

                </View>


            </View>

        )

    }
}

export default qiandaoImg as ComponentClass