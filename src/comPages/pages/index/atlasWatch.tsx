import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem, Button, Video, Canvas } from '@tarojs/components'

import { connect } from '@tarojs/redux'
import menu from '../../../config/menu'
import asset from '../../../config/asset'
import inter from '../../../config/inter'
import api from '../../../services/api'


import '../../../config/theme.css';
import './atlasWatch.less'



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
}


class atlasWatch extends Component<{}, PageState> {
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
        }

    }



    componentDidShow() {

    }

    componentWillMount() {
        var that = this;
        that._setbatHeight();
        that._getCode()

        const { downId, title } = that.$router.params;

        that.setState({
            downId: parseInt(downId)
        }, () => {
            this._getDown()
        })
        // api.get(inter.downCheck + parseInt(downId))
        //     .then(res => {
        //         if (res.message) {
        //             Taro.showModal({
        //                 title: '提示',
        //                 content: res.data.message,
        //                 success: function (res) {
        //                     if (res.confirm) {
        //                         Taro.switchTab({
        //                             url: '/pages/index/index'
        //                         })
        //                     } else if (res.cancel) {
        //                         Taro.switchTab({
        //                             url: '/pages/index/index'
        //                         })
        //                     }
        //                 }
        //             })
        //             setTimeout(() => {
        //                 Taro.switchTab({
        //                     url: '/pages/index/index'
        //                 })
        //             }, 3000);
        //         }
        //     })

    }
    _getCode=()=>{
        api.post(inter.userInvite).then((res) => {
            this.setState({
                codeImg: res.data.data
            })
        })
    }
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
    _drawPic() {
        Taro.showLoading({
            title: '准备中'
        });
        this.setState({
            drawStatus: 1
        }, () => {
            let that = this;
            const { galleryList, current } = that.state
            let classpost = galleryList[current].fpath
            Taro.downloadFile({
                url: classpost,
                success: function (ress) {
                    if (ress.statusCode === 200) {
                        Taro.getImageInfo({
                            src: ress.tempFilePath,
                        }).then((res) => {
                            if (res.errMsg === "getImageInfo:ok") {
                                Taro.setStorageSync('postImgs', {
                                    path: res.path,
                                    width: res.width,
                                    height: res.height
                                })
                                // Taro.hideLoading()
                                that._draw(res);

                            }
                        })
                    }
                }
            })
        })


    }
    _ondwon() {
        const { down_list, galleryList, current } = this.state
        Taro.showLoading({
            title: '准备中'
        });
        for (var i = 0; i < galleryList.length; i++) {
            this._draw(galleryList[i].fpath)
        }
    }
    _draw = (val) => {
        var that = this
        const { down_list, galleryList, current } = that.state
        var rpx;
        Taro.getSystemInfo({
            success: function (res) {
                rpx = res.windowWidth / 375
            }
        })

        var height: number = 960;
        var width: number = 540;

        const cvsCtx = Taro.createCanvasContext('PosterCanvass', that);
        // 生成背景图片
        cvsCtx.draw();
        cvsCtx.drawImage(val.path, 0, 0, width * rpx, height * rpx); // 推进去图片


        if (down_list.codeType == 1) {
            Taro.getImageInfo({
                src: down_list.codeUrl,
            }).then(res => {
                cvsCtx.drawImage(res.path, width - 130, height - 130, 120, 120)
                cvsCtx.draw();
                that._onDownload()
            })
        } else if (down_list.codeType == 2) {
            Taro.getImageInfo({
                src: this.state.codeImg,
            }).then(res => {
                cvsCtx.drawImage(res.path, width - 140, height - 160, 120, 120)
                cvsCtx.draw();
                that._onDownload()
            })
        } else {
            cvsCtx.draw();
            that._onDownload()
        }


    }
    _getDown() {
        Taro.showLoading({
            title: '加载中',
        })
        let that = this;
        const { down_list, galleryList } = that.state
        const { downId, index, page, ftype } = that.$router.params
        let current_num = parseInt(index) + 1
        api.get(inter.downCheck + parseInt(downId)).then(res => {
            if (res.data.status) {

                let arr = res.data.data;

                this.setState({
                    down_list: arr,
                    galleryList: arr.galleryList,
                    current: index,
                    current_num: current_num,
                }, () => {
                    Taro.setNavigationBarTitle({
                        title: this.state.down_list.name ? this.state.down_list.name : '图集'
                    })
                    this.shares()
                    Taro.hideLoading()
                })

            }
            if (res.data.message) {
                if (res.data.message == 'ACCESS_DENY') {
                    Taro.showModal({
                        title: '提示',
                        content: '请先登录',
                        success: function (res) {
                            if (res.confirm) {
                                Taro.switchTab({
                                    url: '/pages/user/user'
                                })
                            } else if (res.cancel) {
                                Taro.switchTab({
                                    url: '/pages/user/user'
                                })
                            }
                        }
                    })
                    setTimeout(() => {
                        Taro.switchTab({
                            url: '/pages/user/user'
                        })
                    }, 3000);
                } else {
                    Taro.showModal({
                        title: '提示',
                        content: res.data.message,
                        success: function (res) {
                            if (res.confirm) {
                                Taro.switchTab({
                                    url: '/pages/user/user'
                                })
                            } else if (res.cancel) {
                                Taro.switchTab({
                                    url: '/pages/user/user'
                                })
                            }
                        }
                    })
                    setTimeout(() => {
                        Taro.switchTab({
                            url: '/pages/user/user'
                        })
                    }, 3000);
                }

            }

        })
    }
    shares = () => {
        if (this.state.down_list.canShare == 0) {
            Taro.hideShareMenu()
        } else {
            wx.showShareMenu({

                withShareTicket: true,

                menus: ['shareAppMessage', 'shareTimeline']
            })
        }
    }
    _onDownload = () => {
        var that = this
        const { galleryList, current, down_list } = that.state
        // if (down_list.ftype == 3) {
        if (down_list.ftype == 2 && this.state.down_list.codeType != 0) {
            this.getsave().then(res => {
                Taro.showLoading({
                    title: '下载中',
                    mask: true
                })
                let lst = ''
                if (down_list.ftype == 2) {
                    lst = galleryList[current].fpath
                } else {
                    lst = galleryList[current].fpath
                }

                Taro.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    canvasId: 'PosterCanvass',
                    success: function (res) {
                        let tempFilePath = res.tempFilePath;
                        Taro.saveFile({
                            tempFilePath: tempFilePath,
                            success: function (res) {
                                if (res.errMsg ==='saveFile:ok') {
                                    let tempFilePath = res.savedFilePath
                                    if (down_list.ftype == 2) {
                                        Taro.saveImageToPhotosAlbum({
                                            filePath: tempFilePath
                                        }).then(res => {
                                            api.post(inter.downNums + down_list.downId, {
                                                galleryId: galleryList[current].galleryId
                                            }).then(res => {
                                                that._getDown()
                                            })

                                        })
                                        that.setState({
                                            drawStatus: 0
                                        })
                                        Taro.showToast({
                                            title: '下载完成',
                                            icon: 'success',
                                            duration: 3000
                                        })
                                    } else {
                                        Taro.saveVideoToPhotosAlbum({
                                            filePath: res.tempFilePath
                                        }).then(res => {
                                            api.post(inter.downNums + down_list.downId, {
                                                galleryId: galleryList[current].galleryId
                                            }).then(res => {
                                                that._getDown()
                                            })
                                        })
                                        Taro.showToast({
                                            title: '下载完成',
                                            icon: 'success',
                                            duration: 3000
                                        })
                                    }

                                }
                            }
                        })

                    }
                })

            })
        } else {
            this.getsave().then(res => {
                Taro.showLoading({
                    title: '下载中',
                    mask: true
                })
                let lst = ''
                if (down_list.ftype == 2) {
                    lst = galleryList[current].fpath
                } else {
                    lst = galleryList[current].fpath
                }
                Taro.downloadFile({
                    url: lst,
                    // url: tempFilePath,
                    success: function (res) {
                        // console.log(res, '111')
                        if (res.statusCode === 200) {
                            Taro.playVoice({
                                filePath: res.tempFilePath
                            })
                            let tempFilePath = res.tempFilePath
                            if (down_list.ftype == 2) {
                                Taro.saveImageToPhotosAlbum({
                                    filePath: res.tempFilePath,
                                    success(res) {
                                        if (res) {
                                            api.post(inter.downNums + down_list.downId, {
                                                galleryId: galleryList[current].galleryId
                                            }).then(res => {
                                                that._getDown()
                                            })
                                        }

                                    }
                                })
                            } else {
                                Taro.saveVideoToPhotosAlbum({
                                    filePath: res.tempFilePath
                                            success(res) {
                                        Taro.showToast({
                                            title: '下载完成',
                                            duration: 3000
                                        })
                                        api.post(inter.downNums + down_list.downId, {
                                            galleryId: galleryList[current].galleryId
                                        }).then(res => {
                                            that._getDown()
                                        })
                                    }
                                })
                            }

                        }
                    }
                    //             })
                    //         })
                    //     }
                    // })


                    // }
                })

            })
        }


    }
    onDownload() {
        const { galleryList, down_list } = this.state
        var urls = galleryList.map(item => item == item ? item.fpath : null)
        // 获取保存到相册权限
        this.getsave().then(res => {
            // 保存多张图片到相册
            this.downloadImgs(urls)
        })

    }


    downloadImgs(urls) {
        const { galleryList, current, down_list } = this.state
        if (this.state.down_list.ftype == 2) {
            Taro.showLoading({
                title: '图片下载中',
                mask: true
            })
        } else {
            Taro.showLoading({
                title: '视频下载中',
                mask: true
            })
        }
        const imageList = []
        // 循环数组
        for (let i = 0; i < urls.length; i++) {
            imageList.push(this.getTempPath(urls[i]))
        }
        const loadTask = []
        let index = 0
        while (index < imageList.length) {
            loadTask.push(
                new Promise((resolve, reject) => {
                    // 将数据分割成多个promise数组
                    Promise.all(imageList.slice(index, (index += 8)))
                        .then(res => {
                            resolve(res)
                        })
                        .catch(err => {
                            reject(err)
                        })
                })
            )
        }
        // Promise.all 所有图片下载完成后弹出
        Promise.all(loadTask)
            .then(res => {
                Taro.showToast({
                    title: '下载完成',
                    duration: 3000
                })
                api.post(inter.downNums + down_list.downId, {
                    galleryId: galleryList[current].galleryId
                }).then(res => {
                    this._getDown()
                })

            })
            .catch(err => {
                Taro.showToast({
                    title: `下载失败`,
                    icon: 'none',
                    duration: 3000
                })
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
        var that = this;
        const { down_list, galleryList, downId, current } = that.state;

        let url = '';
        let title = ''
        if (down_list.ftype == 2) {
            title = down_list.name
        }
        if (down_list.ftype == 1) {
            title = down_list.name
        }
        if (galleryList.length > 0 && down_list.ftype == 2) {
            url = galleryList[current].fpath;
        }
        if (galleryList.length > 0 && down_list.ftype == 1) {
            url = down_list.imgUrl;
        }
        if (ops.from === 'button') {
            // 来自页面内转发按钮
            // console.log(ops.target)
        }
        return {
            title: title,
            path: menu.atlasWatch + '?downId=' + downId + '&index=' + current + '&ftype=' + down_list.ftype,
            imageUrl: url,
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
    _onVant() {
        var that = this;
        const { down_list, galleryList, current } = that.state
        api.post(inter.downVants + galleryList[current].galleryId, {
            ctype: 56
        }).then(res => {
            // this._getDown()
            this.setState({
                galleryList: galleryList.map((item, index) => index == current ? { ...item, likeNum: item.likeNum + 1, like: true } : item)
            })
        })
    }
    _onVants() {
        var that = this;
        const { down_list, galleryList, current } = that.state
        api.post(inter.downUnvants + galleryList[current].galleryId, {
            ctype: 56
        }).then(res => {
            // this._getDown()
            this.setState({
                galleryList: galleryList.map((item, index) => index == current ? { ...item, likeNum: item.likeNum - 1, like: false } : item)
            })
        })
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
    render() {
        const { down_list, galleryList, current, current_num, drawStatus } = this.state
        return (
            <View className=''>
                <View className={down_list.ftype == 2 ? 'box_top' : 'box_tops'}>
                    <View onClick={this.goBack}>
                        <Image src={asset.lg_icon} className='size_34' />
                    </View>

                    <View className='page_num'>
                        <Text>{current_num}</Text>
                            /<Text>{galleryList.length}</Text>
                    </View>

                    {
                        down_list.canShare == 1 ?
                            <Button className='share' open-type='share' onShareAppMessage={this.onShareAppMessage}>
                                <Image src={asset.share_atlas} className='share_picture' />
                            </Button>
                            :
                            <Button className='share' onClick={() => {
                                Taro.showToast({
                                    title: '不支持分享',
                                    icon: 'none',
                                    duration: 1500
                                })
                            }}>
                                <Image src={asset.share_atlas} className='share_picture' />
                            </Button>
                    }

                </View>
                <View className={down_list.ftype == 2 ? 'picture' : 'pictures'}>
                    <Swiper
                        className={down_list.ftype == 2 ? 'test-h picture' : 'test-h pictures'}
                        indicatorColor='#999'
                        indicatorActiveColor='#333'
                        circular
                        current={current}
                        onChange={(e) => {
                            let num = e.detail.current + 1
                            this.setState({ current: e.detail.current, current_num: num })
                            if (down_list.ftype != 2) {
                                let video = Taro.createVideoContext(this.state.path)
                                video.pause()
                            }
                        }}
                    >
                        {
                            galleryList.map((item, index) => {
                                return (
                                    <View>
                                        {down_list.ftype == 2 ?
                                            <SwiperItem className='rows'>
                                                <Image src={item.fpath} style={{ height: '100%' }} mode='aspectFit' />
                                                {
                                                    down_list.codeType == 1 ?
                                                        <View className='code'>
                                                            <Image src={down_list.codeUrl} className='picture_icon' />
                                                        </View>
                                                        : down_list.codeType == 2 ?
                                                            <View className='code'>
                                                                <Image src={this.state.codeImg} className='picture_icon' />
                                                            </View>
                                                            : null
                                                }
                                            </SwiperItem>
                                            :
                                            <SwiperItem>
                                                <Video
                                                    src={item.fpath}
                                                    controls={true}
                                                    autoplay={false}
                                                    id={item.fpath}
                                                    loop={false}
                                                    muted={false}
                                                    className='zdx'
                                                    onPlay={() => {
                                                        this.setState({
                                                            play: 1,
                                                            path: item.fpath
                                                        })
                                                    }}

                                                />
                                                {/* {
                                                    down_list.codeType==2 ?
                                                        <View className='code'>
                                                            <Image src={down_list.codeUrl} className='picture_icon' />
                                                        </View>
                                                        : down_list.codeType==1 ?
                                                        <View className='code'>
                                                            <Image src={this.state.codeImg} className='picture_icon' />
                                                        </View>
                                                        :null
                                                } */}
                                            </SwiperItem>
                                        }
                                    </View>
                                )
                            })
                        }
                    </Swiper>
                </View>
                <View className={down_list.ftype == 2 ? 'box_foot' : 'box_foots'}>
                    <View className='words'>
                        {
                            galleryList[current].title ?
                                <Text selectable={true}>
                                    {galleryList[current].title}
                                </Text>
                                :
                                null
                        }

                        {
                            down_list.ftype != 2 ?
                                <View style={{ marginTop: '16px' }}>
                                    <Text style={{ fontSize: '24rpx' }} selectable={true}>{down_list.content}</Text>
                                </View>
                                : null
                        }

                    </View>


                    <View className='vant'>
                        {
                            galleryList[current].like == false ?
                                <Image src={asset.vant_white} onClick={this._onVant} className='picture_icon' />
                                :
                                <Image src={asset.onpraise} onClick={this._onVants} className='picture_icon' />
                        }
                    </View>
                    <View className='vant_num'>
                        {galleryList[current].likeNum}
                    </View>
                    {/* <View className='download' onClick={down_list.ftype == 2 ? this._draw.bind(this, galleryList[current].fpath) : this._onDownload}> */}
                    {
                        down_list.ftype == 2 ?
                            <View className='download' onClick={down_list.codeType == 0 ? this._onDownload : this._drawPic}>
                                <Image src={asset.download} className='picture_icon' />
                            </View>
                            :
                            <View className='download' onClick={this._onDownload}>
                                <Image src={asset.download} className='picture_icon' />
                            </View>
                    }

                    <View className='download_num'>
                        {galleryList[current].downNum}
                    </View>
                    {
                        down_list.ftype == 2 && down_list.codeType == 0 ?
                            <View className='btn' onClick={this.onDownload}>
                                一键保存所有图片
                        </View>
                            : down_list.ftype == 2 && (down_list.codeType == 1 || down_list.codeType == 2) ?
                                <View className='btn' onClick={this._drawPic}>
                                    保存图片
                        </View>
                                : null
                        //     <View className='btn' onClick={this.onDownload}>
                        //         一键保存所有
                        // </View>
                    }

                </View>
                {
                    drawStatus == 1 ?
                        <View className='cans'>
                            <Canvas style={{ width: '540px', height: '980px' }} canvasId='PosterCanvass' />
                        </View>
                        : null
                }

            </View>

        )

    }
}

export default atlasWatch as ComponentClass