import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem, Audio, Canvas } from '@tarojs/components'
import menu from '../../../config/menu'
import asset from '../../../config/asset'
import inter from '../../../config/inter'
import api from '../../../services/api'
import Tabs from '../../../components/Tabs'
import '../../../config/theme.css';
import './Niandu.less'
import { bUrl } from '../../../config'
import { Barcode, QRCode } from 'taro-code'


type PageState = {
    content: string,
    page: number,
    pages: number,
    status: number,
    bills: Array<any>,
    music: string,
    key: any,
    regDate: string,
    regDays: string,
    keys: any,
    coverUrl: string,
    can_move: boolean,
    current: number,
    open: number,
    keyword: string,
    img: string,
    words: string,
    indexs: string,
    cover_img: string,
    id:number,
}


class Niandu extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '年度账单',
        // enablePullDownRefresh: true
    }
    page: number
    pages: number


    constructor(props) {
        super(props)

        this.page = 0;
        this.pages = 0;

        this.state = {
            content: '',
            page: 0,
            pages: 0,
            status: 0,
            bills: [],
            music: '',
            key: [],
            keys: [],
            regDays: '',
            regDate: '',
            coverUrl: '',
            can_move: false,
            current: 0,
            open: 0,
            keyword: '',
            img: '',
            words: '',
            indexs: '',
            cover_img: '',
            id:0,
        }

    }

    componentDidMount() {
        let date=new Date()
        let year = date.getFullYear()
        api.get('/user/bill', {
            year: year
        }).then(res => {
            if (res.data.status) {
                let list = res.data.data
                let bill = JSON.parse(list.bill_info.data)
                let key = JSON.parse(list.bill_data.data)
                let bills = Object.values(bill)
                let keys = Object.values(key)
                let keyss = Object.keys(key)
                let wds = '${keyword}'
                this.setState({
                    id:list.bill_info.billId,
                    bills: bills,
                    key: keys,
                    keys: keyss,
                    coverUrl: list.bill_info.coverUrl,
                    indexs: key[wds]
                }, () => {
                    this.getKeys()
                    this.getMusic()
                })
            } else {
                Taro.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1500,
                })
            }

        })
        this.getCover()
    }
    getCover = () => {
        api.get('/site/preview', {
            course_id: 0,
            ctype: 10,
        }).then(res => {
            if (res.data.status) {
                console.log(res.data.data)
                this.setState({
                    cover_img: res.data.data
                })
            }
        })
    }
    getKeys = () => {
        const { indexs } = this.state
        api.get(inter.Config)
            .then(res => {
                if (res.data.status) {
                    let list = res.data.data
                    let imgs = list.yearbill_yearbill_imgs.split(',')
                    let words = list.yearbill_yearbill_words.split(',')
                    let keys = list.yearbill_yearbill_key.split(',')
                    if (indexs != '关键词') {
                        this.setState({
                            img: imgs[parseInt(indexs)],
                            words: words[parseInt(indexs)],
                            keyword: keys[parseInt(indexs)]
                        })
                    }
                }
            })
    }
    getMusic = () => {
        const { coverUrl } = this.state
        api.post(inter.CourseVideo, {
            media_id: coverUrl
        }).then(res => {
            if (res.data.status) {
                const videodesc = res.data.data
                if (videodesc.m38u) {
                    this.setState({
                        music: videodesc.m38u,
                        open: 1
                    }, () => {
                        let audioCtx = Taro.createAudioContext('greetings');
                        audioCtx.play()
                    })
                }
            }
        })
    }
    componentDidShow() {

    }
    onStop = () => {
        let audioCtx = Taro.createAudioContext('greetings');
        audioCtx.pause()
        this.setState({
            open: 0
        })
    }
    onContinue = () => {
        let audioCtx = Taro.createAudioContext('greetings');
        audioCtx.play()
        this.setState({
            open: 1
        })
    }
    onOpens = () => {
        this.setState({
            can_move: true
        }, () => {
            this.setState({
                current: 1
            })
        })
    }
    onPullDownRefresh() {
        Taro.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 3000,
        })
        api.get('/user/bill', {
            year: 2021
        }).then(res => {
            if (res.data.status) {
                let list = res.data.data
                let bill = JSON.parse(list.bill_info.data)
                let key = JSON.parse(list.bill_data.data)
                let bills = Object.values(bill)
                let keys = Object.values(key)
                let keyss = Object.keys(key)
                let wds = '${keyword}'
                this.setState({
                    bills: bills,
                    key: keys,
                    keys: keyss,
                    coverUrl: list.bill_info.coverUrl,
                    indexs: key[wds]
                }, () => {
                    this.getKeys()
                    this.getMusic()
                })
            } else {
                Taro.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1500,
                })
            }

        })
    }
    _draw(ele) {
        var that = this
        const { words, keyword, img, cover_img,id } = this.state
        api.post(inter.userHistory,{
            cctype:1,
            content_id:id,
            ctype:53,
            etype:16,
        }).then(res=>{
            
        })
        Taro.showLoading({
            title: '准备中'
        });
        var rpx;
        Taro.getSystemInfo({
            success: function (res) {
                rpx = res.windowWidth / 375
            }
        })

        var width: number = 284;
        var height: number = 500;

        const cvsCtx = Taro.createCanvasContext('niandu', that);


        cvsCtx.fillStyle = "#FFFFFF";
        cvsCtx.fillRect(0, 0, width, height);
        cvsCtx.setFillStyle('#000000')//字体颜色
        cvsCtx.setFontSize(16)//字体大小
        cvsCtx.fillText('我的年度关键字', 80, 30)
        cvsCtx.fillText(keyword, 110, 56)
        cvsCtx.save();
        cvsCtx.beginPath();
        Taro.getImageInfo({
            src: img,
        }).then(res => {
            cvsCtx.drawImage(res.path, 20, 90, 230 * rpx, 130 * rpx)
            cvsCtx.fillText(words, 20, 240)
            cvsCtx.save();
            cvsCtx.beginPath();
            Taro.getImageInfo({
                src: cover_img,
            }).then(ress => {
                cvsCtx.drawImage(ress.path, 80, 280, 100 * rpx, 100 * rpx)
                cvsCtx.draw();
                if (ele == 1) {
                    that.onShares()
                } else {
                    that.onDowns()
                }
            })

        })

    }
    onShares = () => {
        var that = this
        Taro.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: 'niandu',
            success: function (res) {
                let tempFilePath = res.tempFilePath;
                console.log(tempFilePath, 'tempFilePath')
                Taro.getFileSystemManager().readFile({
                    filePath: tempFilePath,
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
                                    api.post(inter.userHistory,{
                                        etype:16,
                                        ctype:53,
                                        content_id:that.state.id,
                                        cctype:1
                                    }).then(res=>{})
                                    wx.showShareImageMenu({
                                        path: tempFilePath,
                                        success: resr => {
                                            console.log(resr, '///')
                                        }
                                    })
                                }
                            })
                        })
                    }

                })
            }
        })
    }
    onDowns = () => {
        var that = this
        Taro.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: 'niandu',
            success: function (res) {
                let tempFilePath = res.tempFilePath;
                console.log(tempFilePath, 'tempFilePath')
                Taro.getFileSystemManager().readFile({
                    filePath: tempFilePath,
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
                                    Taro.saveImageToPhotosAlbum({ filePath: tempFilePath }).then((res) => {
                                        if (res.errMsg = 'saveImageToPhotosAlbum:ok') {
                                            Taro.showToast({
                                                title: '保存成功，快分享到朋友圈吧~',
                                                icon: 'none'
                                            })
                                            that.setState({
                                                isCanvas: false
                                            })
                                        }
                                    })
                                }
                            })
                        })
                    }
                })
            }
        })
    }
    render() {

        const { bills, key, keys, music, can_move, current, open, keyword, img, words, indexs } = this.state
        return (
            <View className='box'>
                <View className='mic'>
                    {
                        open == 1 ?
                            <Image src={asset.aud_pause} className='pic' onClick={this.onStop} />
                            :
                            <Image src={asset.aud_pay} className='pic' onClick={this.onContinue} />
                    }

                </View>
                {
                    can_move ?
                        <Swiper
                            className='box'
                            indicatorColor='#999'
                            indicatorActiveColor='#333'
                            easingFunction='easeInOutCubic'
                            vertical
                            current={current}
                            onChange={(e) => {
                                if (can_move == true) {
                                    this.setState({
                                        current: e.detail.current
                                    })
                                }
                            }}
                        >
                            {
                                bills.map((item, index) => {
                                    let word = item.text.split(';')
                                    return (
                                        <SwiperItem>
                                            <View className='pic'>
                                                <Image src={item.img} className='pics' />
                                                <View className='word'>
                                                    {
                                                        word.map((itm, idx) => {
                                                            var its = itm
                                                            var itt = []
                                                            let vas = ''
                                                            for (var i = 0; i < key.length; i++) {

                                                                if (itm.indexOf(keys[i]) > -1) {
                                                                    itt = its.split(keys[i])
                                                                    vas = key[i]?key[i]:'无'
                                                                }

                                                            }
                                                            return (
                                                                <View style={item.isRough == 0 ? { fontSize: parseInt(item.frontSize) * 2 + 'rpx', color: item.frontColor, fontFamily: item.frontSpace, lineHeight: item.rowSpace, textAlign: item.alignType }
                                                                    : { fontSize: parseInt(item.frontSize) * 2 + 'rpx', color: item.frontColor, fontFamily: item.frontSpace, lineHeight: item.rowSpace, fontWeight: 'bolder', textAlign: item.alignType }
                                                                }>
                                                                    {
                                                                        itt.length == 0 ?
                                                                            <Text style={{ letterSpacing: item.textSpace + 'px' }}>{its}</Text>
                                                                            :
                                                                            <Text style={{ letterSpacing: item.textSpace + 'px' }}>{itt[0]}</Text>
                                                                    }
                                                                    {
                                                                        itt.length == 0 ?
                                                                            null
                                                                            :
                                                                            <Text style={{ fontSize: parseInt(item.frontSize2) * 2 + 'rpx', fontFamily: item.frontSpace, color: item.frontColor2 }}>{vas}</Text>
                                                                    }

                                                                    {
                                                                        itt.length == 0 ?
                                                                            null
                                                                            :
                                                                            <Text style={{ letterSpacing: item.textSpace + 'px' }}>{itt[1]}</Text>
                                                                    }

                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </View>
                                                {
                                                    index == 0 ?
                                                        <View className='opns'>
                                                            <View className='opens' onClick={this.onOpens}>开启年度账单</View>
                                                        </View>
                                                        : null
                                                }
                                            </View>

                                        </SwiperItem>
                                    )
                                })
                            }
                            <SwiperItem>
                                <View className='pic'>
                                    {/* {
                                        item.img && item.img != '0' ?
                                            <Image src={item.img} className='pics' />
                                            : null
                                    } */}
                                    {
                                        indexs == '关键词' ?
                                            <View className='hids'>
                                                <View className='keyword'>
                                                    <View>您暂未有关键词</View>
                                                </View>

                                            </View>
                                            :
                                            <View className='hids'>

                                                <View className='keyword'>
                                                    <View>我的年度关键词</View>
                                                    <View>{keyword}</View>
                                                </View>

                                                <View className='bdy'>
                                                    <View className='picss'>
                                                        <Image src={img} style={{ width: '100%', height: '100%' }} />
                                                    </View>
                                                </View>
                                                <View className='bdy'>
                                                    <View className='wds'>
                                                        {words}
                                                    </View>
                                                </View>
                                                <View className='bdys'>
                                                    <View className='erweima'>
                                                        <Image src={this.state.cover_img} style={{ width: '242rpx', height: '242rpx' }} />
                                                        {/* <QRCode text={'/compages/pages/user/Niandu'} size={121} scale={4} errorCorrectLevel='M' className='barcode' /> */}
                                                    </View>
                                                    <View className='watch'>查看我的年度账单</View>
                                                </View>
                                                <View className='bdyd'>
                                                    <View className='share'>
                                                        <View className='jcct'>
                                                            <View className='cts' onClick={this._draw.bind(this, 1)}>
                                                                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/friends.png'} style={{ width: '80rpx', height: '80rpx' }} />
                                                            </View>
                                                            <View className='mt_5 sm_label'>微信好友</View>
                                                        </View>
                                                        <View className='jcct'>
                                                            <View className='cts' onClick={this._draw.bind(this, 2)}>
                                                                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/wechat.png'} style={{ width: '80rpx', height: '80rpx' }} />
                                                            </View>
                                                            <View className='mt_5 sm_label'>朋友圈</View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                    }

                                </View>
                            </SwiperItem>
                        </Swiper>
                        :
                        <View className='pic'>
                            <Image src={bills[0].img} className='pics' />
                            <View className='word'>
                                {
                                    bills[0].text.split(';').map((itm, idx) => {
                                        var its = itm
                                        var itt = []
                                        let vas = ''
                                        for (var i = 0; i < key.length; i++) {

                                            if (itm.indexOf(keys[i]) > -1) {
                                                itt = its.split(keys[i])
                                                vas = key[i]?key[i]:'无'
                                            }

                                        }
                                        console.log(its)
                                        return (
                                            <View style={bills[0].isRough == 0 ? { fontSize: parseInt(bills[0].frontSize) * 2 + 'rpx', color: bills[0].frontColor, fontFamily: bills[0].frontSpace, lineHeight: bills[0].rowSpace, textAlign: bills[0].alignType }
                                                : { fontSize: parseInt(bills[0].frontSize) * 2 + 'rpx', color: bills[0].frontColor, fontFamily: bills[0].frontSpace, lineHeight: bills[0].rowSpace, fontWeight: 'bolder', textAlign: bills[0].alignType }
                                            }>
                                                {
                                                    itt.length == 0 ?
                                                        <Text style={{ letterSpacing: bills[0].textSpace + 'px' }}>{its}</Text>
                                                        :
                                                        <Text style={{ letterSpacing: bills[0].textSpace + 'px' }}>{itt[0]}</Text>
                                                }
                                                {
                                                    itt.length == 0 ?
                                                        null
                                                        :
                                                        <Text style={{ fontSize: parseInt(bills[0].frontSize2) * 2 + 'rpx', fontFamily: bills[0].frontSpace, color: bills[0].frontColor2 }}>{vas}</Text>
                                                }

                                                {
                                                    itt.length == 0 ?
                                                        null
                                                        :
                                                        <Text style={{ letterSpacing: bills[0].textSpace + 'px' }}>{itt[1]}</Text>
                                                }
                                            </View>
                                        )
                                    })
                                }
                            </View>

                            <View className='opns'>
                                <View className='opens' onClick={this.onOpens}>开启年度账单</View>
                            </View>
                        </View>
                }

                <View className='music'>
                    <Audio
                        src={music}
                        controls={true}
                        autoplay={false}
                        loop={true}
                        initialTime='30'
                        id='greetings'
                    />
                </View>
                <View className='niandu'>
                    <Canvas style={{ height: '880rpx', width: '540rpx', marginTop: '30rpx' }} canvasId='niandu' />
                </View>
            </View>
        )

    }
}

export default Niandu as ComponentClass