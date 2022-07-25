import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { subNumTxt } from '../../../utils/common'
import menu from '../../../config/menu'
import asset from '../../../config/asset'
import inter from '../../../config/inter'
import api from '../../../services/api'


import '../../../config/theme.css';
import './atlas.less'




type PageState = {
    page: number,
    pages: number,
    status: number,
    navHeight: number,//刘海高度
    capHeight: number,//胶囊高度
    downId: number,
    down_list: Object,
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
    content: string,

}


class atlas extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '图集',
        enablePullDownRefresh: true
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
            down_list: {},
            galleryList: [],
            content: '',
        }

    }

    componentWillMount() {
        var that = this;
        that._setbatHeight();


        const { downId, title } = that.$router.params;

        that.setState({
            downId: parseInt(downId)
        })

        api.get(inter.downCheck+parseInt(downId))
        .then(res=>{
            if(res.message){
                Taro.showModal({
                    title: '提示',
                    content: res.data.message,
                    success: function (res) {
                      if (res.confirm) {
                        Taro.switchTab({
                            url:'/pages/index/index'
                        })
                      } else if (res.cancel) {
                        Taro.switchTab({
                            url:'/pages/index/index'
                        })
                      }
                    }
                  })
                setTimeout(() => {
                    Taro.switchTab({
                        url:'/pages/index/index'
                    })
                }, 3000);
            }
        })
        Taro.setNavigationBarTitle({
            title: title === undefined ? '图集' : title,
        })
        this._getDown()
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

    _getDown() {
        Taro.showLoading({
            title: '加载中',
          })
        let that = this;
        const { down_list } = that.state
        const { downId, ftype, page } = that.$router.params;
        api.get(inter.downCheck+parseInt(downId)).then(res => {
            if (res.data.status) {

                let arr = res.data.data;

                this.setState({
                    down_list: arr,
                    galleryList: arr.galleryList,
                    content: arr.content
                },()=>{
                    this.shares()
                    Taro.hideLoading()
                })

            }
            if (res.data.message) {
                Taro.showModal({
                    title: '提示',
                    content: res.data.message,
                    success: function (res) {
                        if (res.confirm) {
                            Taro.switchTab({
                                url: '/pages/index/index'
                            })
                        } else if (res.cancel) {
                            Taro.switchTab({
                                url: '/pages/index/index'
                            })
                        }
                    }
                })
                setTimeout(() => {
                    Taro.switchTab({
                        url: '/pages/index/index'
                    })
                }, 3000);
            }
        })
    }

    shares=()=>{
        if(this.state.down_list.canShare==1){
            Taro.showShareMenu({
                withShareTicket: true
            })
        }else{
            Taro.hideShareMenu()
        }
    }
    //  下啦刷新
    onPullDownRefresh() {
        var that = this;

        const { status } = that.state;

        Taro.showNavigationBarLoading();

        that.page = 0;

        that.setState({
            down_list: [],
        }, () => {
            that._getDown();
        })

        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }

    //上拉
    onReachBottom() {
        var self = this;

        const { page, pages, status } = this.state

        if (page < pages) {
            this.page = this.page + 1;
            self._getDown();
        }
    }


    onView = (index) => {
        let that = this
        const { ftype, page } = that.$router.params;
        Taro.navigateTo({
            url: menu.atlasWatch + '?downId=' + this.state.downId + '&page=' + page + '&ftype=' + ftype + '&index=' + index
        })


    }




    render() {
        const { down_list, galleryList, content } = this.state
        return (
            <View className='bdy'>
                <View className='atlas_body'>
                    <View className='wid ml_2'>
                        {galleryList.map((item, index) => {
                            if (index == 0 || (index + 1) % 2 == 1) {
                                return (
                                    <View className='atlas_box'>
                                        <View className={'atlas_pictures'} onClick={this.onView.bind(this, index)}>
                                        <Image src={item.fpath} mode='aspectFill' />
                                            {/* {
                                        item.ftype==2?
                                        <Image src={item.fpath} className='picture' />
                                        :
                                        <Image src={down_list.imgUrl} className='picture' />
                                    } */}
                                            {
                                                down_list.codeUrl ?
                                                    <View className='code'>
                                                        <Image src={down_list.codeUrl} className='code_picture' />
                                                    </View>
                                                    : null
                                            }
                                        </View>
                                        <View className='atlas_words'>
                                            {
                                                item.title ?
                                                    <View className='atl gray_label'>
                                                        {subNumTxt(item.title, 32)}
                                                    </View>
                                                    :
                                                    <Text className='gray_label'> </Text>
                                            }
                                        </View>
                                    </View>
                                )
                            }

                        })}
                    </View>
                    <View className='wid mr_2'>
                        {galleryList.map((item, index) => {
                            if (index == 1 || (index + 1) % 2 == 0) {
                                return (
                                    <View className='atlas_box'>
                                        <View className='atlas_pictures' onClick={this.onView.bind(this, index)}>
                                        <Image src={item.fpath} mode='aspectFill'/>
                                            {/* {
                                        item.ftype==2?
                                        <Image src={item.fpath} className='picture' />
                                        :
                                        <Image src={down_list.imgUrl} className='picture' />
                                    } */}
                                            {
                                                down_list.codeUrl ?
                                                    <View className='code'>
                                                        <Image src={down_list.codeUrl} className='code_picture' />
                                                    </View>
                                                    : null
                                            }
                                        </View>
                                        <View className='atlas_words'>
                                            {
                                                item.title ?
                                                    <View className='atl gray_label'>
                                                        {subNumTxt(item.title, 32)}
                                                    </View>
                                                    :
                                                    <Text className='gray_label'> </Text>
                                            }
                                        </View>
                                    </View>
                                )
                            }

                        })}
                    </View>

                </View>
                <View className='foot'>
                    <Text className='wsd' selectable={true}>{content}</Text>
                </View>
            </View>

        )

    }
}

export default atlas as ComponentClass