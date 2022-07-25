import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem, Canvas, Button } from '@tarojs/components'


import { connect } from '@tarojs/redux'
import { usersType } from '../../../constants/usersType'

import {
    getUserStudy,
    getInviteStat,
    getInviteImgs,
    getUser
} from '../../../actions/user'

import inter from '../../../config/inter'
import api from '../../../services/api'

import asset from '../../../config/asset'

import '../../../config/theme.css';
import './shareInvite.less'



type PageStateProps = {
    user: usersType,
    getInviteStat: {}
}

type PageDispatchProps = {
    getUserStudy: () => any,
    getInviteStat: () => any,
    getUser: () => any,
    getInviteImgs: () => any
}

type PageOwnProps = {}

type PageState = {
    content: string,
    current: number,
    status: number,
    integral: number,
    user: number,
    page: number,
    pages: number,
    total: number,
    items: Array<{
        integral: number,
        nickname: string,
        pubTimeFt: string
    }>,
    isCanvas: boolean,
    codeImg: string,
    shareType: number,
    loadding: boolean,

    shareTotal: number,
    shareToday: number,
    shareRank: number,

    nickname: string,
    userId: number,
    avatar: string,
    InviteImgs: Array<{}>,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface ShareInvite {
    props: IProps;
}

@connect(({ user }) => ({
    user: user
}), (dispatch) => ({
    getUserStudy() {
        dispatch(getUserStudy())
    },
    getInviteStat() {
        dispatch(getInviteStat())
    },
    getUser() {
        dispatch(getUser())
    },
    getInviteImgs() {
        dispatch(getInviteImgs())
    }
}))

class ShareInvite extends Component<PageDispatchProps & PageStateProps, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '邀请好友一起学习',
        enablePullDownRefresh: true
    }

    constructor() {
        super(...arguments)

        this.state = {
            shareTotal: 0,
            shareToday: 0,
            shareRank: 0,

            content: '',
            current: 0,
            status: 0,
            integral: 0,
            user: 0,
            page: 1,
            pages: 1,
            total: 0,
            items: [],
            isCanvas: false,
            codeImg: '',
            shareType: 0,
            loadding: false,
            nickname: '',
            userId: 0,
            avatar: '',
            InviteImgs: []
        }

        this.onShareAppMessage = this.onShareAppMessage.bind(this)
        this._drawPic = this._drawPic.bind(this);
        this._draw = this._draw.bind(this);
        this._toggleCanvas = this._toggleCanvas.bind(this);
        this._onHide = this._onHide.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        const { user } = nextProps;
        if (user !== this.props.user) {
            const { inviteStat, userStudy, userData, InviteImgs } = user

            let invitImg = []
            for (let i = 0; i < InviteImgs.length; i++) {
                invitImg.push(InviteImgs[i].fpath)
            }

            this.setState({
                nickname: userData.nickname,
                userId: userData.userId,
                avatar: userData.avatar,
                integral: inviteStat.integral,
                user: inviteStat.user,
                shareTotal: userStudy.total,
                shareToday: userStudy.today,
                shareRank: userStudy.rank,
                InviteImgs: invitImg
            })
        }

    }

    componentDidMount() {
        var that = this;

        that.getUser();
        that.getInviteImgs();
        that.getUserStudy();
        that.getUserInvite();
        that.getInviteStat();
        that._getCode();

    }



    getInviteImgs() {
        var that = this;
        that.props.getInviteImgs()
    }


    _getCode() {
        api.post(inter.userInvite).then((res) => {
            this.setState({
                codeImg: res.data.data
            })
        })
    }

    _onSwiper(e) {
        this.setState({
            current: e.detail.current
        })
    }

    _drawPic() {
        let that = this;

        const { avatar, codeImg, current, InviteImgs } = that.state;

        Taro.showLoading({
            title: '准备中'
        });

        Taro.getImageInfo({
            src: InviteImgs[current] + '?x-oss-process=image/resize,w_370',
        }).then((res) => {
            if (res.errMsg === "getImageInfo:ok") {
                Taro.setStorageSync('pic_' + current, {
                    path: res.path,
                    width: res.width,
                    height: res.height
                });
                console.log(codeImg)
                Taro.getImageInfo({
                    src: codeImg + '?x-oss-process=image/resize,m_lfit,h_100,w_100',
                }).then((res) => {
                    if (res.errMsg === "getImageInfo:ok") {
                        Taro.setStorageSync('code', {
                            path: res.path,
                            width: res.width,
                            height: res.height
                        });
                        let ava = avatar.replace('https://thirdwx.qlogo.cn', 'https://wx.qlogo.cn')
                        Taro.getImageInfo({
                            src: ava,
                        }).then((res) => {
                            if (res.errMsg === "getImageInfo:ok") {
                                Taro.setStorageSync('avatar', {
                                    path: res.path,
                                    width: res.width,
                                    height: res.height
                                });
                                Taro.hideLoading();
                                that._draw();
                            }
                        })
                    }
                })
            }
        })


    }

    _draw() {

        var that = this
        const { nickname, shareRank, shareToday, shareTotal, current } = that.state

        var rpx;
        Taro.getSystemInfo({
            success: function (res) {
                rpx = res.windowWidth / 375
            }
        })

        var height: number = 450;
        var width: number = 270;

        const cvsCtx = Taro.createCanvasContext('PosterCanvas', that);

        cvsCtx.draw();

        let picObj = Taro.getStorageSync('pic_' + current);
        let codeObj = Taro.getStorageSync('code');
        let avatarObj = Taro.getStorageSync('avatar');

        // 生成背景图片
        cvsCtx.drawImage(picObj.path, 0, 0, width * rpx, height * rpx); // 推进去图片

        // 头像
        if(current<=1){
            cvsCtx.save();
            cvsCtx.beginPath();
            cvsCtx.arc(40 * rpx, (height - 140) * rpx, 10 * rpx, 0, Math.PI * 2, false);
            cvsCtx.clip();
            cvsCtx.drawImage(avatarObj.path, 30 * rpx, (height - 150) * rpx, 20 * rpx, 20 * rpx);
            cvsCtx.restore();

            cvsCtx.setFillStyle('#333333')//字体颜色
            cvsCtx.setFontSize(9)//字体大小
            cvsCtx.fillText(nickname, 60 * rpx, (height - 138) * rpx)//字体内容和位置
            cvsCtx.setTextAlign('center')
    
            // 
            cvsCtx.setFillStyle('#666666')//字体颜色
            cvsCtx.setFontSize(10)//字体大小
            cvsCtx.fillText("累计学习", 50 * rpx, (height - 115) * rpx)//字体内容和位置
            cvsCtx.setTextAlign('center')
            //
            cvsCtx.setFillStyle('#666666')//字体颜色
            cvsCtx.setFontSize(10)//字体大小
            cvsCtx.fillText("今日学习", 125 * rpx, (height - 115) * rpx)//字体内容和位置
            cvsCtx.setTextAlign('center')
            //
            cvsCtx.setFillStyle('#666666')//字体颜色
            cvsCtx.setFontSize(10)//字体大小
            cvsCtx.fillText("行动力超过", 205 * rpx, (height - 115) * rpx)//字体内容和位置
            cvsCtx.setTextAlign('center')
    
            cvsCtx.setFillStyle('#000000')//字体颜色
            cvsCtx.setFontSize(12)//字体大小
            cvsCtx.fillText(parseFloat((shareTotal / 3600).toString()).toFixed(1), 45 * rpx, (height - 100) * rpx)
    
            cvsCtx.setFillStyle('#000000')//字体颜色
            cvsCtx.setFontSize(9)//字体大小
            cvsCtx.fillText('小时', 70 * rpx, (height - 100) * rpx)
    
            cvsCtx.setFillStyle('#000000')//字体颜色
            cvsCtx.setFontSize(12)//字体大小
            cvsCtx.fillText(parseFloat((shareToday / 3600).toString()).toFixed(1), 120 * rpx, (height - 100) * rpx)
    
            cvsCtx.setFillStyle('#000000')//字体颜色
            cvsCtx.setFontSize(9)//字体大小
            cvsCtx.fillText('小时', 140 * rpx, (height - 100) * rpx)
    
    
            cvsCtx.setFillStyle('#000000')//字体颜色
            cvsCtx.setFontSize(12)//字体大小
            cvsCtx.fillText(shareRank.toString(), 200 * rpx, (height - 100) * rpx)
    
            cvsCtx.setFillStyle('#000000')//字体颜色
            cvsCtx.setFontSize(9)//字体大小
            cvsCtx.fillText('%同学', 225 * rpx, (height - 100) * rpx)
        }
        // 昵称
       

        // 头像
        cvsCtx.drawImage(codeObj.path, 200 * rpx, (height - 80) * rpx, 40 * rpx, 40 * rpx);
        cvsCtx.draw();

        this.setState({
            isCanvas: true
        })
    }

    getInviteStat() {
        this.props.getInviteStat()
    }

    getUserStudy() {
        this.props.getUserStudy()
    }

    getUser() {
        this.props.getUser()
    }


    onShareAppMessage(ops) {

        let that = this;
        const { nickname, userId, } = that.state


        this.setState({
            isCanvas: false
        })

        api.post(inter.userLog, {
            log_type: 1,
            type: 1,
            device_id: 0,
            intro: '分享邀请好友',
            content_id: 0,
            param: JSON.stringify({ name: '邀请好友', cctype: 11, ttype: 0 }),
            from: 0,
        }).then((res) => {
            console.log('ee')
        })



        if (this.state.shareType == 0) {
            return {
                title: '您的好友' + nickname + '邀请您一起使用油葱学堂！',
                path: 'pages/index/index?fromuser=' + userId,
            }
        }

        Taro.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: 'PosterCanvas',
            success: function (res) {
                let tempFilePath = res.tempFilePath;
                console.log(tempFilePath, 'tempFilePath')
                if (res.errMsg = 'canvasToTempFilePath:ok') {
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
            }
        })

    }


    // 显示canvas
    _toggleCanvas(shareType) {
        this.setState({
            shareType: shareType,
        }, () => {
            this._drawPic();
        })
    }

    _onHide() {
        this.setState({
            isCanvas: false
        })
    }


    getUserInvite() {
        var that = this;

        api.get(inter.userInvite, {
            page: 0,
        }).then(res => {
            if (res.data.status) {
                let userInvite = res.data.data;
                that.setState({
                    page: userInvite.page,
                    pages: userInvite.pages,
                    total: userInvite.total,
                    items: userInvite.items,
                })
            }
        })
    }

    loaddata() {
        var that = this
        const { items, page } = that.state

        api.get(inter.userInvite, {
            page: page + 1,
        }).then(res => {
            if (res.data.status) {
                let userInvite = res.data.data;
                const tempArray = items.concat(userInvite.items)
                that.setState({
                    items: tempArray,
                    page: userInvite.page,
                    pages: userInvite.pages,
                    total: userInvite.total
                })
            }
        })

    }

    onReachBottom() {
        var self = this;
        let { page, pages } = this.state

        if (page < pages) {
            self.loaddata();
        } else {
            self.setState({
                loadding: true
            })
        }
    }



    render() {
        const { current, integral, user, items, isCanvas, codeImg, shareType, loadding, nickname, avatar, shareTotal, shareRank, shareToday, InviteImgs } = this.state;

        let windowHeight = 500
        try {
            var res = Taro.getSystemInfoSync();
            windowHeight = res.windowHeight;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        let shareAvatar = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/header.png';

        if (avatar != '') {
            shareAvatar = avatar;
        }



        return (
            // 图片的尺寸  812*1209
            <View className='invitewrap' style={isCanvas ? { height: '100vh', overflow: 'hidden' } : null}>

                <View className='headbox  pt_25 d_flex fd_c jc_ct ai_ct'>
                    <Swiper
                        className='sharecons'
                        indicatorColor='#999'
                        indicatorActiveColor='#333'
                        circular
                        indicatorDots={false}
                        previous-margin="100rpx"
                        next-margin="100rpx"
                        onChange={(e) => this._onSwiper(e)}
                    >
                        {
                            InviteImgs.map((pic: any, index) => {
                                const on = current == index
                                return (
                                    <SwiperItem className='levels' key={'share' + index}>
                                        <View className={on ? 'sharebox active_img' : 'sharebox'}>
                                            <Image src={pic} className='shareImg' />
                                            <View className='sharecon'>
                                                {
                                                    index == 0 || index == 1 ?
                                                        <View className='sharecons_header d_flex fd_r ai_ct'>
                                                            <Image src={shareAvatar} className='sharecons_header_img' />
                                                            <Text className='sm9_label black_label ml_5'>{nickname}</Text>
                                                        </View>
                                                        : null
                                                }
                                                {
                                                    index == 0 || index == 1 ?
                                                        <View className='d_flex fd_r jc_sb mt_5'>
                                                            <View className='d_flex fd_c ai_ct'>
                                                                <Text className='smm_label tip_label'>累计学习</Text>
                                                                <View className='d_flex fd_r'  >
                                                                    <Text className='default_label black_label'>{parseFloat((shareTotal / 3600).toString()).toFixed(1)}</Text>
                                                                    <Text className='sm9_label black_label mt_5'>小时</Text>
                                                                </View>
                                                            </View>
                                                            <View className='d_flex fd_c ai_ct'>
                                                                <Text className='smm_label tip_label'>今日学习</Text>
                                                                <View className='d_flex fd_r'  >
                                                                    <Text className='default_label black_label'>{parseFloat((shareToday / 3600).toString()).toFixed(1)}</Text>
                                                                    <Text className='sm9_label black_label mt_5'>小时</Text>
                                                                </View>
                                                            </View>
                                                            <View className='d_flex fd_c ai_ct'>
                                                                <Text className='smm_label tip_label'>行动力超过</Text>
                                                                <View className='d_flex fd_r'  >
                                                                    <Text className='default_label black_label'>{shareRank}</Text>
                                                                    <Text className='sm9_label black_label mt_5'>%的同学</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        : null
                                                }
                                            </View>
                                            <Image className='shareImgcode' src={codeImg} />
                                        </View>
                                    </SwiperItem>
                                )
                            })
                        }
                    </Swiper>


                    <View className='d_flex fd_c jc_ct ai_ct mt_20'>
                        <Text className='lg_label  c33_label'>成功邀请新用户</Text>
                    </View>
                    <View className='items d_flex fd_r ai_ct mt_15'>

                        <View className='item d_flex fd_c jc_ct ai_ct ' >
                            <View className='item_box d_flex  jc_ct ai_ct' onClick={() => this._toggleCanvas(0)}>
                                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/wechat.png'} className='item_box' />
                            </View>
                            <Text className='default_label m_5'>微信好友</Text>
                        </View>

                        <View className='item d_flex  fd_c jc_ct ai_ct ml_20 mr_20'>
                            <View className='item_box d_flex  jc_ct ai_ct' onClick={() => this._toggleCanvas(1)}>
                                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/friends.png'} className='item_box' />
                            </View>
                            <Text className='default_label m_5'>朋友圈</Text>
                        </View>

                        <View className='item d_flex fd_c jc_ct ai_ct' onClick={() => this._toggleCanvas(2)}>
                            <View className='item_box d_flex  jc_ct ai_ct'>
                                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/local.png'} className='item_box' />
                            </View>
                            <Text className='default_label m_5'>保存本地</Text>
                        </View>

                    </View>
                </View>

                <View className='invitebox mt_10'>
                    <View className='d_flex fd_c'>
                        <Text className='lg_label c33_label'>邀请明细</Text>
                        <View className='d_flex fd_r jc_sb mt_5'>
                            <View className='d_flex fd_r ai_ct'><Text className='gray_label sm_label'>已邀请<Text style={{ color: '#FFA71F' }}>{user}</Text><Text>个好友，获得</Text><Text style={{ color: '#FFA71F' }}>{integral}</Text>学分</Text></View>
                            <View className='d_flex  fd_r ai_ct'>
                                <Text className='gray_label sm_label'>展开</Text>
                                <Image src={asset.arrow_bt} className='arrowbt' />
                            </View>
                        </View>
                    </View>

                    <View className='invite_items p_20'>
                        {
                            items.map((item, index) => {

                                return (
                                    <View key={'item' + index} className='border_bt d_flex fd_r ai_ct jc_sb pt_10 pb_10'>
                                        <Text className='default_label c33_label ' style={{ width: '200rpx' }}>{item.nickname}</Text>
                                        <Text className='default_label' style={{ width: '60rpx', color: '#FFA71F' }}>+{item.integral}</Text>
                                        <Text className='default_label tip_label ' style={{ textAlign: 'right' }}>{item.pubTimeFt}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                    {
                        loadding == true ?
                            <View className='loaddata d_flex ai_ct jc_ct bg_white pt_10 pb_10'>
                                <Text className='sm_label tip_label'>没有更多数据了</Text>
                            </View>
                            : null}
                </View>

                <View className='layer' style={{ height: windowHeight }} hidden={!isCanvas}>
                    <View className='layer_boxs'>
                        <View className='layer_box'>
                            <Canvas style={{ height: '900rpx', width: '540rpx' }} canvasId='PosterCanvas' />
                        </View>
                        <View className='d_flex fd_r '>
                            <View className='layer_btn mt_20 mr_20' onClick={this._onHide}>
                                <Text className="default_label white_label">取消</Text>
                            </View>
                            {
                                shareType == 0 ?
                                    <View className='layer_btn mt_20'>
                                        <Button className="default_label white_label" openType='share' onShareAppMessage={this.onShareAppMessage}>分享好友</Button>
                                    </View>
                                    : null}
                            {
                                shareType == 1 ?
                                    <View className='layer_btn mt_20' onClick={this.onShareAppMessage}>
                                        <Text className="default_label white_label">分享</Text>
                                    </View>
                                    : null}

                            {
                                shareType == 2 ?
                                    <View className='layer_btn mt_20' onClick={this.onShareAppMessage}>
                                        <Text className="default_label white_label">保存</Text>
                                    </View>
                                    : null}
                        </View>

                    </View>
                </View>
            </View>
        )
    }
}

export default ShareInvite as ComponentClass