import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Image, Canvas, Button } from '@tarojs/components'



import inter from '../../../../config/inter'
import api from '../../../../services/api'


import menu from '../../../../config/menu'
import asset from '../../../../config/asset'

import { connect } from '@tarojs/redux'
import { usersType } from '../../../../constants/usersType'
import { subNumTxt, learnNum, percent2percent25 } from '../../../../utils/common'
import '../../../../config/theme.css';
import './pushClass.less'

import {
    getUser
} from '../../../../actions/user'


type PageStateProps = {
    user: usersType,
}

type PageDispatchProps = {
    getUser: () => any,
}

type PageOwnProps = {}

type PageState = {
    course: Array<any>,
    page: number,
    pages: number,
    total: number,
    loadding: boolean,
    isCanvas: boolean,
    shareType: number,
    nickname: string,
    userId: number,
    avatar: string,
    c_courseImg: string,
    c_courseName: string,
    c_courseComm: number,
    isAuth: number,
    push_price: any,
    ttyp: number,
    c_courseId: number,
    tempFilePath: string,
    backImg:string,
    ctype:number
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface pushClass {
    props: IProps;
}

@connect(({ user }) => ({
    user: user
}), (dispatch) => ({
    getUser() {
        dispatch(getUser())
    },
}))



class pushClass extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '推课赚钱',
        enablePullDownRefresh: true
    }

    constructor() {
        super(...arguments)
        this.state = {
            course: [], // 课程列表
            page: 0,
            pages: 0,
            total: 0,
            loadding: false,
            isCanvas: false,
            shareType: 0,
            nickname: '',
            userId: 0,
            avatar: '',
            c_courseImg: '',
            c_courseName: '',
            c_courseComm: 0,
            isAuth: 0, //  0  未实名 1  实名
            push_price: 0,
            ttyp: 0,
            c_courseId: 0,
            tempFilePath: '',
            backImg:'',
            ctype:0,
        }

        this.onShareAppMessage = this.onShareAppMessage.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        const { user } = nextProps;
        if (user !== this.props.user) {
            const { userData } = user

            this.setState({
                nickname: userData.nickname,
                userId: userData.userId,
                avatar: userData.avatar,
                isAuth: userData.isAuth,
            })
        }

    }

    componentWillMount() {
    }
    componentDidMount() {
        var that = this
        that.getCourseList()
        that.getUser();
        that.getConfig()
        wx.showShareMenu({

            withShareTicket: true,

            menus: ['shareAppMessage', 'shareTimeline']
        })

    }
    componentWillUnmount() { }
    componentDidShow() { }
    componentDidHide() { }
    getConfig=()=>{
        api.get(inter.Config)
        .then(res=>{
            this.setState({
                backImg:res.data.data.course_agent_img
            })
        })
    }
    getUser() {
        this.props.getUser()
    }

    // 课程接口
    getCourseList() {
        var that = this;

        const { page } = that.state

        api.get(inter.courseAgent, {
            ctype: 0,
            page: page,
        }).then(res => {
            if (res.data.status) {
                let courseList = res.data.data
                this.setState({
                    course: courseList.items,
                    page: courseList.page,
                    pages: courseList.pages,
                    total: courseList.total,
                })
            }
        })
    }


    // 加载数据
    loaddata() {
        var that = this;

        const { page, course } = that.state

        api.get(inter.courseAgent, {
            ctype: 0,
            page: page,
        }).then(res => {
            if (res.data.status) {
                let courseList = res.data.data
                const tempArray = course.concat(courseList.items)
                this.setState({
                    course: tempArray,
                    page: courseList.page,
                    pages: courseList.pages,
                    total: courseList.total,
                })
            }
        })
    }


    // onShareAppMessage(ops) {
    //     var that = this
    //     const { nickname, userId } = that.state

    //     this.setState({
    //         isCanvas: false
    //     })

    //     api.post(inter.userLog, {
    //         log_type: 1,
    //         type: 1,
    //         device_id: 0,
    //         intro: '分享邀请好友',
    //         content_id: 0,
    //         param: JSON.stringify({ name: '邀请好友', cctype: 11, ttype: 0 }),
    //         from: 0,
    //     }).then((res) => {
    //         console.log('ee')
    //     })

    //     return {
    //         title: '您的好友' + nickname + '邀请您一起使用油葱学堂！',
    //         path: 'pages/index/index?fromuser=' + userId,
    //     }
    // }


    _toggleCanvas(item, push_price, push_pricess) {
        if (item.integral == 0) {
            this.setState({
                isCanvas: true,
                c_courseImg: item.courseImg,
                c_courseName: item.courseName,
                c_courseComm: 100,
                push_price: push_price,
                ttyp: 0,
                c_courseId: item.courseId
            }, () => {
                this._drawPic();
            })
        } else {
            this.setState({
                isCanvas: true,
                c_courseImg: item.courseImg,
                c_courseName: item.courseName,
                c_courseComm: 100,
                push_price: push_pricess,
                ttyp: 1,
                c_courseId: item.courseId
            }, () => {
                this._drawPic();
            })
        }
        this.setState({
            ctype:item.ctype
        })

    }


    _drawPic() {
        let that = this;
        // let classpost = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/04cf4801-7a4d-4023-bcf5-e04d2a9e9d8b.png';

        const { avatar, c_courseImg, push_price,backImg } = that.state
        let classpost = backImg
        // console.log(avatar,'???')
        Taro.showLoading({
            title: '准备中'
        });
        Taro.getImageInfo({
            src: classpost + '?x-oss-process=image/resize,w_370',
        }).then((res) => {
            if (res.errMsg === "getImageInfo:ok") {
                Taro.setStorageSync('postImg', {
                    path: res.path,
                    width: res.width,
                    height: res.height
                });
                let ava = avatar.replace('https://thirdwx.qlogo.cn', 'https://wx.qlogo.cn')
                Taro.downloadFile({
                    url: ava,
                }).then(data => {
                    console.log(data)
                    Taro.getImageInfo({
                        src: data.tempFilePath,
                    }).then(res => {
                        if (res.errMsg === "getImageInfo:ok") {
                            Taro.setStorageSync('avatar', {
                                path: res.path,
                                width: res.width,
                                height: res.height
                            });
                            console.log(c_courseImg)
                            Taro.getImageInfo({
                                src: c_courseImg,
                            }).then((res) => {
                                if (res.errMsg === "getImageInfo:ok") {
                                    Taro.setStorageSync('c_courseImg', {
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
                })
            }
        })


    }


    _draw() {
        var that = this
        const { nickname, c_courseName, push_price, ttyp } = that.state

        var rpx;
        Taro.getSystemInfo({
            success: function (res) {
                rpx = res.windowWidth / 375
            }
        })

        var width: number = 284;
        var height: number = 500;

        const cvsCtx = Taro.createCanvasContext('PosterCanvas', that);
        cvsCtx.draw();
        cvsCtx.setFillStyle('#FFFFFF')
        cvsCtx.fillStyle = "#FFFFFF";
        cvsCtx.fillRect(0, 0, width + 20, height + 20);



        let postImg = Taro.getStorageSync('postImg');
        let avatarObj = Taro.getStorageSync('avatar');
        let c_courseImg = Taro.getStorageSync('c_courseImg');


        // 生成背景图片
        cvsCtx.drawImage(postImg.path, 0, 0, 284 * rpx, 264 * rpx); // 推进去图片

        // 头像
        cvsCtx.save();
        cvsCtx.beginPath();

        cvsCtx.arc(20 * rpx, (height - 201) * rpx, 20 * rpx, 0, Math.PI * 2, false);
        cvsCtx.clip();
        cvsCtx.drawImage(avatarObj.path, 0 * rpx, (height - 221) * rpx, 40 * rpx, 40 * rpx);
        cvsCtx.restore();

        // 昵称
        cvsCtx.setFillStyle('#000000')//字体颜色
        cvsCtx.setFontSize(16)//字体大小
        cvsCtx.fillText(nickname, 50 * rpx, (height - 197) * rpx)//字体内容和位置
        cvsCtx.setTextAlign('center')

        // 生成矩形
        cvsCtx.setStrokeStyle('#E1E1E1')
        cvsCtx.setLineWidth(1)
        cvsCtx.strokeRect(0, 338 * rpx, 268 * rpx, 86)

        // 生成课程图片
        cvsCtx.drawImage(c_courseImg.path, 10 * rpx, (height - 156) * rpx, 134 * rpx, 75 * rpx);


        let cvsArr: any = []

        let sbu_name = c_courseName.substring(0, 16);

        for (let i = 0; i < sbu_name.length; i += 8) {
            cvsArr.push(sbu_name.slice(i, i + 8))
        }

        for (let j = 0; j < cvsArr.length; j++) {
            cvsCtx.setFillStyle('#333333')//字体颜色
            cvsCtx.setFontSize(12)//字体大小
            cvsCtx.fillText(cvsArr[j], 205 * rpx, (height - 144 + 16 * j) * rpx)//字体内容和位置
            cvsCtx.setTextAlign('center')
        }

        cvsCtx.setFillStyle('#F4623F')//字体颜色
        cvsCtx.setFontSize(12)//字体大小
        if (ttyp == 0) {
            cvsCtx.fillText(`赚￥${push_price}`, 230 * rpx, (height - 85) * rpx, 100)//字体内容和位置
        } else {
            cvsCtx.fillText(`赚${push_price}学分`, 230 * rpx, (height - 85) * rpx, 100)//字体内容和位置
        }

        cvsCtx.setTextAlign('left')

        cvsCtx.draw();
        setTimeout(() => {
            that.getImgs()
        }, 500);

    }
    getImgs = () => {
        var that = this;
        Taro.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: 'PosterCanvas',
            success: function (res) {
                let tempFilePath = res.tempFilePath;
                console.log(tempFilePath, 'tempFilePath')
                if (res.errMsg = 'canvasToTempFilePath:ok') {
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
                                        that.setState({
                                            tempFilePath: tempFilePath
                                        })
                                    },
                                    fail: function (res) {
                                        console.log(res)
                                    }
                                })
                            })
                        }
                    })
                }
            }
        })
    }
    _onHide() {

    }


    // 下拉
    onPullDownRefresh() {
        var self = this

        self.setState({
            page: 0,
            course: [],
            loadding: false
        }, () => {
            self.getCourseList();

            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }


    onReachBottom() {
        var self = this;

        let { page, pages } = this.state

        if (page < pages) {
            self.setState({
                page: page + 1
            }, () => {
                self.loaddata();
            })
        } else {
            self.setState({
                loadding: true
            })
        }
    }

    onShareTimeline = (ops) => {
        return {
            imageUrl: ops
        }
    }
    onShareAppMessagess = (ops) => {
        var that = this;
        Taro.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: 'PosterCanvas',
            success: function (res) {
                let tempFilePath = res.tempFilePath;
                console.log(tempFilePath, 'tempFilePath')
                if (res.errMsg = 'canvasToTempFilePath:ok') {
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
                                        if (ops == 1) {
                                            // console.log(tempFilePath,'???')
                                            wx.showShareImageMenu({
                                                path: tempFilePath,
                                                success: resr => {
                                                    console.log(resr, '///')
                                                }
                                            })
                                        } else {
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
                                    },
                                    fail: function (res) {
                                        console.log(res)
                                    }
                                })
                            })
                         }
                    })
                }
            }
        })



    }
    onShareAppMessage(ops) {
        var that = this;
        const { c_courseName, c_courseId, userId, tempFilePath, c_courseImg,ctype } = that.state
        if (ops.from === 'button') {
            // 来自页面内转发按钮
            // console.log(ops.target)
        }
        this.setState({
            isCanvas: false
        })
        // console.log(tempFilePath,c_courseName,'???')
        if(ctype==0){
            return {
                // imageUrl:tempFilePath,
                imageUrl: c_courseImg,
                title: c_courseName,
                path: '/pages/index/courseDesc?course_id=' + c_courseId + '&courseName=' + percent2percent25(`${c_courseName}`) + '&fromuser=' + userId,
                success: function (res) {
                    Taro.navigateBack({
                        delta: 1
                    })
                },
                fail: function (res) {
    
                }
            }
        }else if(ctype==1){
            return {
                // imageUrl:tempFilePath,
                imageUrl: c_courseImg,
                title: c_courseName,
                path: '/pages/index/audioDesc?course_id=' + c_courseId + '&courseName=' + percent2percent25(`${c_courseName}`) + '&fromuser=' + userId,
                success: function (res) {
                    Taro.navigateBack({
                        delta: 1
                    })
                },
                fail: function (res) {
    
                }
            }
        }
        


    }
    onShareTimeline() {
        const { c_courseName, c_courseId, userId, tempFilePath, c_courseImg } = this.state
        return {
            title: c_courseName,
            query: '/pages/index/courseDesc?course_id=' + c_courseId + '&courseName=' + percent2percent25(`${c_courseName}`) + '&fromuser=' + userId,
            imageUrl: c_courseImg,
        }
    }
    sharelink = () => {
        const { c_courseName, c_courseId, userId, tempFilePath, c_courseImg } = this.state
        WeixinJSBridge.on('menu:share:timeline', function (argv) {
            WeixinJSBridge.invoke('shareTimeline', {
                title: c_courseName,
                link: '/pages/index/courseDesc?course_id=' + c_courseId + '&courseName=' + percent2percent25(`${c_courseName}`) + '&fromuser=' + userId,
                img_url: c_courseImg,
            });
        })
        // console.log(WeixinJSBridge,'???')
    }
    render() {

        const { course, loadding, isCanvas, shareType, isAuth } = this.state
        const { c_courseName, c_courseId, userId, tempFilePath, c_courseImg } = this.state
        let windowHeight = 500
        try {
            var res = Taro.getSystemInfoSync();
            windowHeight = res.windowHeight;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        let shareAvatar = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/header.png';



        return (
            <View className={isCanvas ? 'pushwrap pushfixed' : ' pushwrap'}>
                <View className='pushhead d_flex ai_ct jc_sb'>
                    <Text className='gray_label default_label pl_20'>邀请人数不设上限，邀请更多获益更多</Text>
                    <Text className='c33_label default_label pr_20 fw_label' style={{ textAlign: "right" }}
                        onClick={() => {
                            Taro.navigateTo({ url: menu.lectReturn })
                        }}
                    >查看收益</Text>
                </View>

                <View className='recomm_items pl_20 pr_20 mt_20'>
                    {
                        course.map((item: any, index) => {
                            let push_prices: any = 0;
                            let push_pricess: any = 0;
                            if (isAuth === 1) {
                                push_prices = (item.sellCash).toFixed(2);
                                push_pricess = item.sellIntegral
                            } else {
                                push_prices = (item.sellCash).toFixed(2);
                                push_pricess = item.sellIntegral
                            }

                            return (
                                <View className='item d_flex fd_r   pb_20 ' key={'item' + index}>
                                    <View className='item_cover_cons' >
                                        <Image src={item.courseImg} className='item_cover' />
                                        <View className='item_tips_hit'>
                                            <Image src={asset.cover_tips_icon} className='item_hit_cover' />
                                            <Text className='sm8_label white_label mt_3'>{item.chapter}讲</Text>
                                        </View>
                                    </View>
                                    <View className='d_flex fd_c pl_10 jc_sb col_1'>
                                        <View className='d_flex fd_c tt_xt'>
                                            <Text className='default_label c33_label fw_label dup_per_txt ' >{item.courseName}</Text>
                                            <Text className='sml_label tip_label item_txt'>{item.summary}</Text>
                                        </View>

                                        <View className='d_flex fd_r ai_ct mt_5 jc_sb'>
                                            {
                                                item.integral == 0 ?
                                                    <Text className='sm_label sred_label'>¥{item.courseCash}</Text>
                                                    :
                                                    <Text className='sm_label sred_label'>{item.integral}学分</Text>
                                            }
                                            <View className='view_play d_flex fd_r ai_ct ' onClick={this._toggleCanvas.bind(this, item, push_prices, push_pricess)} >

                                                {/* {
                                                    push_prices != '0.00' || push_pricess != 0 ?
                                                    <Text className='sm_label sred_label ml_5'>赚</Text>
                                                        :
                                                        <Text className='sm_label sred_label ml_5'>赚¥0.00</Text>
                                                } */}

                                                <Image src={asset.share_r_icon} className='view_icon mt_2' />
                                                <Text className='sm_label sred_label ml_5'>赚</Text>


                                                {
                                                    item.courseCash ?
                                                        <Text className='sm_label sred_label'>￥{push_prices}</Text>
                                                        : null
                                                }
                                                {
                                                    item.integral ?
                                                        <Text className='sm_label sred_label'>{push_pricess}学分</Text>
                                                        : null
                                                }
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
                <View className='layer' hidden={!isCanvas} >
                    <View className='layer_boxs'>
                        <View className="lay_tt" onClick={() => this.setState({ isCanvas: false })}></View>
                        <View className='layer_box'>
                            <View className='pfld'>
                                <Canvas style={{ height: '880rpx', width: '540rpx', marginTop: '30rpx', backgroundColor: '#ffffff' }} canvasId='PosterCanvas' />
                            </View>
                            <Text className='lg_label black_label black_label'>分享到</Text>
                            <View className='d_flex fd_r '>
                                <Button className='layer_btn mt_20 ' onClick={this.onShareAppMessagess}>
                                    <View className='item_box d_flex  jc_ct ai_ct'>
                                        <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/friends.png'} className='item_box' />
                                    </View>
                                </Button>
                                <Button className='layer_btn mt_20 layer_left' openType='share' onShareAppMessage={this.onShareAppMessages}>
                                    <View className='item_box d_flex  jc_ct ai_ct'>
                                        <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/wechat.png'} className='item_box' />
                                    </View>
                                </Button>
                            </View>
                            <View className='layer_word'>
                                <Text className="default_label c33_label">朋友圈</Text>
                                <Text className="default_label c33_label word_left">微信好友</Text>
                            </View>

                        </View>

                    </View>
                </View>

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

export default pushClass as ComponentClass