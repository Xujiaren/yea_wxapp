import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Video } from '@tarojs/components'
import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import Tabs from '../../../../components/Tabs'
import '../home.less'
import './myMood.less'



type PageState = {
    selector: Array<any>,
    selectorChecked: string,
    mood: Array<any>,
    userId: number,
    idx: number,
    user: any,
    wall: string,
    page: number,
    pages: number,
    refush: boolean,
}


class mymood extends Component<{}, PageState> {
    config = {
        navigationStyle: 'custom',
    }
    page: number
    pages: number
    userId: any
    img: any

    constructor(props) {
        super(props)

        this.page = 0;
        this.pages = 0;
        this.userId = 0
        this.img = ''
        this.state = {
            selector: ['拍照', '从相册选'],
            selectorChecked: '美国',
            mood: [],
            userId: 0,
            idx: 0,
            user: {},
            page: 0,
            pages: 0,
            refush: false,
            wall: '',
        }

    }

    componentDidMount() {
        const { userId, img } = this.$router.params;
        this.userId = userId
        this.img = img
        api.get(inter.User)
            .then(res => {
                this.setState({
                    user: res.data.data
                })
            })
        this.Mood()
        this.wall()
    }
    wall = () => {
        api.get(inter.postWall)
            .then(res => {
                this.setState({
                    wall: res.data.data.fpath
                })
            })
    }
    Mood = () => {
        api.get(inter.getMood, {
            target_id: parseInt(this.userId),
            page: this.page
        }).then(res => {
            if (res.data.status) {

                let arr = res.data.data;
                if (this.page === 0) {
                    this.page = arr.page
                    this.pages = arr.pages
                    var tList = arr.items
                } else {
                    var tList: any = this.state.mood.concat(arr.items)
                }

                this.setState({
                    mood: tList,
                    page: arr.page,
                    pages: arr.pages,
                    refush: false,
                })

            }
        })
    }
    componentDidShow() {

    }
    _onClick = () => {
        var that = this
        Taro.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var list = res.tempFilePaths
                Taro.getFileSystemManager().readFile({
                    filePath: list.toLocaleString(), // 选择图片返回的相对路径
                    encoding: 'base64', // 编码格式
                    success: res => { // 成功的回调
                        api.post(inter.UploadSite, {
                            file: 'data:image/png;base64,' + res.data,
                        }).then(res => {
                            var pic = res.data.data
                            api.post(inter.postWall, {
                                pics: pic
                            }).then(res => {
                                that.wall()
                            })
                        })
                    }
                }
        })
    }

    _onRelease = () => {
        Taro.navigateTo({
            url: 'moodPage/releaseMood'
        })
    }

    onVant = (val) => {
        // const { actions, user } = this.props
        // console.log(user.userId, val.moodId)
        // actions.meet.likeMood({
        // 	mood_id: val.moodId,
        // 	resolved: (res) => {
        // 		console.log(res)
        // 		this.getMood()
        // 	},
        // 	rejected: (err) => {
        // 		console.log(err)
        // 	}
        // })
        api.post(inter.likeMood + val.moodId)
            .then(res => {
                this.Mood()
            })
    }
    downVant = (val) => {
        // console.log(val)
        // const { actions, user } = this.props
        // actions.meet.unlikeMood({
        // 	mood_id: val.moodId,
        // 	resolved: (res) => {
        // 		console.log(res)
        // 		this.getMood()
        // 	},
        // 	rejected: (err) => {
        // 		console.log(err)
        // 	}
        // })
        api.post(inter.unlikeMood + val.moodId)
            .then(res => {
                this.Mood()
            })
    }
    onView = (val, ele) => {
        console.log(ele)
        let urls = []
        urls.push(ele.galleryList.map(item => item == item ? item.fpath : null))
        Taro.previewImage({
            current: val.fpath,
            urls: urls[0]
        })
    }
    myMood = () => {
        Taro.navigateTo({
            url: './moodPage/myMood' + '?userId=' + this.props.user.userId
        })
    }
    top = () => {
        var that = this;

        Taro.showNavigationBarLoading();
        that.setState({ refush: true })
        that.page = 0;

        that.setState({
            mood: [],
        }, () => {
            that.Mood()
        })

        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }

    foot = () => {
        var self = this;
        const { page, pages } = this.state
        if (page < pages - 1) {
            this.page = this.page + 1
            self.Mood()
        }
    }
    onOther = (val) => {
        Taro.navigateTo({
            url: './moodPage/myMood' + '?userId=' + val.userId + '&img=' + val.avatar
        })
    }
    onPlay = (val) => {
        this.setState({
            idx: val.moodId
        })
    }
    onBack = () => {
        Taro.navigateBack({
            delta: 1
        })
    }
    render() {

        const { mood, idx, user, wall, refush } = this.state

        return (
            <View className='box row col jc_ct'>
                <View className='back' onClick={this.onBack}>
                    {/* <IconFont name={'left_arrow'} size={32} color={'#000000'} /> */}
                    <Image src={asset.lg_icon} className='size_37' />
                </View>
                <View className='top_pic' onClick={this._onClick.bind(this)}>
                    {
                        wall ?
                            <Image src={wall} className='picture' />
                            :
                            <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/48955bfc-ec96-4e92-9ba3-57f3e3c6766a.png'} className='picture' />
                    }
                </View>
                <View className='release row ai_ct' onClick={this._onRelease.bind(this)}>
                    {/* <IconFont name={'bianji'} color={'#ffffff'} size={28} /> */}
                    <Image src={asset.share_w} className='size_28' />
                    <Text className='label_white font_bold label_14 ml_2'>发布心情</Text>
                </View>
                <View className='avatar'>
                    <Image src={this.img ? this.img : user.avatar} className='avatar_pic' />
                </View>
                <View className='row col pl_15 pr_30 pt_35'>
                    <ScrollView
                        scrollY
                        className={'scrollStyle'}
                        refresherEnabled={true}
                        refresherTriggered={refush}

                        onRefresherRefresh={(e) => {
                            this.top()
                        }}

                        onScrollToLower={(e) => {
                            this.foot()
                        }}
                    >
                        {
                            mood.map((item, index) => {
                                return (
                                    <View className='row mt_30'>
                                        <View className='avatar_itm'>
                                            <Image src={item.avatar} className='avatar_itm' />
                                        </View>
                                        <View className='row col ml_10'>
                                            <View className='label_three label_14 font_bold'>{item.nickname}</View>
                                            <View className='mt_10 label_three label_14 mt_10'>{item.content}</View>
                                            {
                                                item.galleryList.length > 0 ?
                                                    <View>
                                                        {
                                                            item.galleryList[0].ftype == 0 ?
                                                                <View className='pic_box row wrap mt_10'>
                                                                    {
                                                                        item.galleryList.map(ele => {
                                                                            return (
                                                                                <View className='pic_item mr_6'>
                                                                                    <Image src={ele.fpath} className='pic' onClick={this.onView.bind(this, ele, item)} />
                                                                                </View>
                                                                            )
                                                                        })
                                                                    }
                                                                </View>
                                                                : item.galleryList[0].ftype == 1 ?
                                                                    <View className={item.moodId == idx ? 'videos bg_yellow mt_10' : 'video bg_yellow mt_10'}>
                                                                        <Video
                                                                            id='video'
                                                                            src={item.galleryList[0].fpath}
                                                                            // poster='https://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg'
                                                                            initialTime='0'
                                                                            controls={true}
                                                                            autoplay={item.moodId == idx ? true : false}
                                                                            loop={false}
                                                                            muted={false}
                                                                            className='pic'
                                                                            onPlay={() => {
                                                                                this.setState({
                                                                                    idx: item.moodId
                                                                                })
                                                                            }}
                                                                            onEnded={() => {
                                                                                this.setState({
                                                                                    idx: 0
                                                                                })
                                                                            }}
                                                                        />
                                                                    </View>
                                                                    : null
                                                        }
                                                    </View>
                                                    : null
                                            }
                                            <View className='vant row jc_sb ai_ct mt_20'>
                                                <View className='label_light label_12'>{item.getTime}</View>
                                                <View className='row ai_ct'>
                                                    {
                                                        item.isLike == false ?
                                                            <View className='row' onClick={this.onVant.bind(this, item)}>
                                                                {/* <IconFont name={'dianzan'} color={'#999999'} size={24} /> */}
                                                                <Image src={asset.praise} className='size_24' />
                                                                <View className='label_light label_12 ml_2'>点赞</View>
                                                            </View>
                                                            :
                                                            <View className='row' onClick={this.downVant.bind(this, item)}>
                                                                {/* <IconFont name={'dianzan'} color={'#F4623F'} size={24} /> */}
                                                                <Image src={asset.onpraise} className='size_24' />
                                                                <View className='label_12 ml_2 label_orange'>取消</View>
                                                            </View>
                                                    }
                                                </View>
                                            </View>
                                            {
                                                item.names.length > 0 ?
                                                    <View className='vant_item row ai_ct mt_10'>
                                                        <View className='ml_5'>
                                                            {/* <IconFont name={'dianzan'} color={'#999999'} size={24} /> */}
                                                            <Image src={asset.praise} className='size_24' />
                                                        </View>
                                                        {
                                                            item.names.map((_item, _index) => {

                                                                return (
                                                                    <View className='label_12 label_gray ml_5'>{_index == item.names.length - 1 ? _item : _item + ';'}</View>
                                                                )

                                                            })
                                                        }
                                                    </View>
                                                    : <View></View>
                                            }
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </View>
                <View className='mb_50'></View>
            </View>
        )

    }
}

export default mymood as ComponentClass