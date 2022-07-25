import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button, Canvas } from '@tarojs/components'

import api from '../../../services/api'
import menu from '../../../config/menu'
import asset from '../../../config/asset'
import inter from '../../../config/inter'
import '../../../config/theme.css';
import './certificatedesc.less'

type PageState = {
    show: string,
    p_value: number,
    p_type: boolean,
    certImg: string,
    content: string,
    isCanvas: boolean,
    shareType: number,
    canvasImg: string
}

class certificatedesc extends Component<{}, PageState>  {

    // eslint-disable-next-line react/sort-comp
    config: Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '我的证书',
        navigationBarBackgroundColor: '#fff',
    }

    constructor() {
        super(...arguments)
        this.state = {
            show: '',
            p_value: 0,
            p_type: false,
            certImg: '',
            content: '',
            isCanvas: false,
            shareType: 0,
            canvasImg: ''
        }

        this._drawPic = this._drawPic.bind(this);
        this._draw = this._draw.bind(this);
    }

    componentWillReceiveProps(nextProps) { }
    componentWillMount() {
        var that = this
        const { certImg, content } = that.$router.params

        that.setState({
            certImg: certImg,
            content: content
        })
    }
    componentDidMount() {
        var that = this
        that._drawPic();
    }
    componentWillUnmount() { }
    componentDidShow() { }
    componentDidHide() { }


    // 生成图片
    _drawPic() {
        var that = this
        const { certImg } = that.state

        Taro.showLoading({
            title: '准备中'
        });

        Taro.getImageInfo({
            src: certImg
        }).then((res) => {
            if (res.errMsg === "getImageInfo:ok") {
                Taro.setStorageSync('picCert', {
                    path: res.path,
                    width: res.width,
                    height: res.height
                });

                that._draw();

                setTimeout(() => {
                    Taro.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        canvasId: 'certCanvas',
                        fileType: 'png',
                        success: function (res) {
                            let tempFilePath = res.tempFilePath;
                            that.setState({
                                canvasImg: tempFilePath
                            })

                            Taro.hideLoading();
                        }
                    })
                }, 500)
            }
        })
    }

    _draw() {

        var that = this
        const { content, } = that.state

        var rpx;
        Taro.getSystemInfo({
            success: function (res) {
                rpx = res.windowWidth / 375
            }
        })

        var height: number = 210;
        var width: number = 340;

        const cvsCtx = Taro.createCanvasContext('certCanvas', that);

        cvsCtx.draw();

        let picObj = Taro.getStorageSync('picCert');

        // 生成背景图片
        cvsCtx.drawImage(picObj.path, 0, 0, width * rpx, height * rpx); // 推进去图片


        // 昵称 不知什么原因 这个还必须有的
        cvsCtx.setFillStyle('#ffffff')//字体颜色
        cvsCtx.setFontSize(11)//字体大小
        cvsCtx.fillText('', width * rpx / 2, (height - 110) * rpx)//字体内容和位置
        cvsCtx.setTextAlign('center')


        // 昵称
        cvsCtx.setFillStyle('#333333')//字体颜色
        cvsCtx.setFontSize(10)//字体大小
        cvsCtx.fillText('《' + `${content}` + '》课程', width * rpx / 2, (height - 110) * rpx)//字体内容和
        cvsCtx.setTextAlign('left')


        cvsCtx.draw();

        this.setState({
            isCanvas: true
        })

    }

    // 保存图片
    _saveImg(type) {

        var that = this
        const { canvasImg } = that.state

        // that.setState({
        //     p_value:0,
        //     p_type:true
        // })

        // const DownloadTask =  Taro.downloadFile({
        //     header: {
        //         'Accept-Encoding': 'chunked',
        //     },
        //     url:canvasImg,
        //     success:function(res){
        //         const tempFilePath = res.tempFilePath;
        //         if (res.statusCode === 200) {
        //             Taro.saveImageToPhotosAlbum({
        //                 filePath:tempFilePath
        //             }).then((res)=>{
        //                 if(res.errMsg === 'saveImageToPhotosAlbum:ok'){
        //                     Taro.showToast({
        //                         title:'已保存到本地'
        //                     })
        //                 }
        //             })
        //         }
        //     }
        // })

        // DownloadTask.progress((res)=>{

        //     that.setState({
        //         p_value:res.progress
        //     })

        //     if(res.progress === 100){
        //         that.setState({
        //             p_type:false
        //         })
        //     }
        // })
        Taro.getFileSystemManager().readFile({
            filePath: canvasImg,
            encoding: 'base64',
            success: res => {
                console.log(res)
                api.post(inter.UploadSite, {
                    file: 'data:image/png;base64,' + res.data,
                }).then(ress => {
                    console.log(ress, 'ress')
                    Taro.downloadFile({
                        header: {
                            'Accept-Encoding': 'chunked',
                        },
                        url: ress.data.data,
                        success: function (resd) {
                            console.log(resd, 'res')
                            const tempFilePath = resd.tempFilePath;
                            // if (res.statusCode === 200) {
                            if (type == 1) {
                                wx.showShareImageMenu({
                                    path: tempFilePath,
                                    success: resr => {
                                        console.log(resr, '///')
                                    }
                                })
                            } else {
                                Taro.saveImageToPhotosAlbum({
                                    filePath: tempFilePath
                                }).then((res) => {
                                    console.log(res, 'resss')
                                    if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
                                        if (type === 0) {
                                            Taro.showToast({
                                                title: '已保存到本地'
                                            })
                                        } else {
                                            Taro.showToast({
                                                title: '保存成功，快分享到朋友圈吧~',
                                                icon: 'none'
                                            })
                                        }
                                    }
                                })
                            }

                            // }
                        },
                        fail: function (res) {
                            console.log(res)
                        }
                    })
                })
            }
        })



    }


    // 查看图片
    onViewImg(certImg) {
        let urls: string[] = new Array();

        urls.push(certImg)
        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: urls[0], // 当前显示图片的http链接，默认是第一个
        }).then((res) => {
            // console.log(res)
        })
    }

    _onHide() {
        this.setState({
            isCanvas: false
        })
    }


    render() {
        const { p_type, p_value, certImg, content, isCanvas, canvasImg } = this.state

        const savebtn = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/e9b9b59d-7d1b-4358-806f-959311629cb5.png'
        const sharebtn = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/24889223-5a1b-4d7b-a05f-4b26dd8bc3b9.png'

        let windowHeight = 500
        try {
            var res = Taro.getSystemInfoSync();
            windowHeight = res.windowHeight;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }


        return (
            <View className='root'>

                <View className='modal'>
                    <View className='certBox'>
                        <View className='layer_box'>
                            <Canvas style={{ height: '414rpx', width: '680rpx' }} canvasId='certCanvas' />
                        </View>
                    </View>

                    <View className='btn_wrap d_flex row jc_sb ai_ct'>
                        <View className='btn_item d_flex row jc_ct ai_ct'
                            onClick={this._saveImg.bind(this, 0)}
                        >
                            <Image className='save_icon' mode='aspectFit' src={savebtn} />
                            <Text>保存</Text>
                        </View>
                        <View className="btn_item d_flex row jc_ct ai_ct ml_30"
                            onClick={this._saveImg.bind(this, 1)}
                        >
                            <Image className='share_icon' mode='aspectFit' src={sharebtn} />
                            <Text>分享</Text>
                        </View>
                    </View>
                </View>

                {
                    p_type ?

                        <View className='layer'>
                            <View className='layerBox'>
                                <Text className='white_label default_label'>请稍等{p_value}%</Text>
                            </View>
                        </View>

                        : null}
            </View>
        )
    }
}

export default certificatedesc as ComponentClass