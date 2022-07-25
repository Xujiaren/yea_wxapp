import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { subNumTxt } from '../../../utils/common'

import Askcell from '../../components/askcell'

import menu from '../../../config/menu'
import inter from '../../../config/inter'
import api from '../../../services/api'

import Tabs from '../../../components/Tabs'

import '../../../config/theme.css';
import './userAsk.less'


type PageState = {
    content: string,
    askList: Array<{
        askId: number,
        askReplyDTO: object,
        categoryId: number,
        collect: number,
        content: string,
        flag: string,
        gallery: Array<any>,
        hit: number,
        integral: number,
        isCollect: false
        isShare: number,
        isTop: number,
        pubIp: string,
        pubTime: number,
        replyId: number,
        replyNum: number,
        title: string,
        userId: number,
        avatar: string,
        comment: number,
        nickname: string,
    }>,
    page: number,
    pages: number,
    status: number,
    
}


class userAsk extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '我的内容',
        enablePullDownRefresh: true
    }
    page: number
    pages: number


    constructor(props) {
        super(props)

        this.page = 0;
        this.pages = 0;

        this.state = {
            content: '',
            askList: [],
            page: 0,
            pages: 0,
            status: 0,
            
        }

    }

    componentWillMount() {

    }

    componentDidMount() {
        let that = this;
        that._userAnswer();
    }

    componentDidShow() {
        let that = this;
        const { status } = that.state;

        if (status === 0) {
            that._userAnswer();
        } else {
            that._userAsk();
        }
    }

    componentWillUnmount() {

    }
    componentDidHide() { }


    _userAsk() {

        let that = this;
        const { askList } = that.state;

        api.get(inter.askUserAsk, {
            page: this.page
        }).then((res) => {
            if (res.data.status) {

                let arr = res.data.data;
                if (this.page === 0) {
                    this.page = arr.page
                    this.pages = arr.pages
                    var tList = arr.items
                } else {
                    var tList: any = askList.concat(arr.items)
                }

                this.setState({
                    askList: tList,
                    page: arr.page,
                    pages: arr.pages,
                })

            }
        })

    }


    _userAnswer() {
        var that = this;
        const { askList } = that.state;

        api.get(inter.askUserAnswer, {
            page: this.page,
        }).then((res) => {
            console.log(res)
            if (res.data.status) {

                let arr = res.data.data;
                if (this.page === 0) {
                    this.page = arr.page
                    this.pages = arr.pages
                    var tList = arr.items
                } else {
                    var tList: any = askList.concat(arr.items)
                }

                this.setState({
                    askList: tList,
                    page: arr.page,
                    pages: arr.pages,
                })

            }
        })
    }


    //  下啦刷新
    onPullDownRefresh() {
        var that = this;

        const { status } = that.state;

        Taro.showNavigationBarLoading();

        that.page = 0;

        that.setState({
            askList: [],
        }, () => {

            if (status === 0) {
                that._userAnswer();
            } else {
                that._userAsk();
            }

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

            if (status === 0) {
                self._userAnswer();
            } else {
                self._userAsk();
            }

        }
    }

    // 详情页
    _toQust = (item) => {

        var that = this;
        const { status } = that.state;

        if (status === 0) {
            Taro.navigateTo({
                url: menu.question + '?askId=' + item.askId + '&title=' + item.title
            })
        } else {
            Taro.navigateTo({
                url: menu.qustShow + '?askId=' + item.askId + '&title=' + item.title
            })
        }

    }


    _onSelect = (idx) => {
        var that = this;
        this.page = 0;

        that.setState({
            status: idx,
            askList: [],
        }, () => {
            if (idx === 0) {
                that._userAnswer();
            } else {
                that._userAsk();
            }
        })


    }
   

    render() {

        const { askList, status } = this.state;

        return (
            <View className='wrap fade bg pl_20 pr_15'>
                <View className='atabs'>
                    <Tabs items={['回答', '提问']} atype={1} selected={status} cctype={1} onSelect={this._onSelect} />
                </View>

                {
                    status === 0 ?
                        <View>
                            {
                                askList.map((item, index) => {
                                    return (
                                        <View key={'item' + index} className='border_bt pt_10 pb_10' >
                                            <View onClick={this._toQust.bind(this, item)}>

                                                <Text className='lg_label black_label'>{subNumTxt(item.title, 18)}</Text>

                                                <View className='d_flex fd_r ai_ct mb_10 mt_10'>
                                                    {
                                                        item.avatar.length > 0 ?
                                                            <Image src={item.avatar} mode="widthFix" className='avatar_cover' />
                                                            : null}
                                                    <Text className='c33_label sm_label ml_10'>{item.nickname}</Text>
                                                </View>
                                                {item.collect == 0?
                                                    <Text className='sm_label c33_label mt_10'>{subNumTxt(item.content, 54)}</Text>
                                                    :
                                                    <Text className='sm_label c33_label mt_10'>{item.content}</Text>
                                                }


                                            </View>
                                            {
                                                item.content.length > 54 && item.collect == 0 ?
                                                    <View className='all_read d_flex .mt_15' onClick={val=>{this.setState({ askList:askList.map((_item,_index)=>_index==index?{..._item,collect:1}:_item )})}}>
                                                        <Text className='sm_label tip_label'>阅读全文</Text>
                                                        {/* <Text className='sm_label tip_label mt_3'></Text> */}
                                                    </View>
                                                    : null
                                            }
                                            {
                                                item.content.length > 54 && item.collect == 1 ?
                                                    <View className='all_reads d_flex .mt_15' onClick={val => { this.setState({ askList:askList.map((_item,_index)=>_index==index?{..._item,collect:0}:_item )})}}>
                                                        <Text className='sm_label tip_label'>收起</Text>
                                                    </View>
                                                    : null
                                            }


                                        </View>
                                    )
                                })
                            }
                        </View>
                        :
                        <View>
                            {
                                askList.map((item, index) => {
                                    let on = askList.length - 1 === index;

                                    return (
                                        <View key={'item' + index} className={on ? 'mt_15' : 'border_bt mt_15'}>
                                            <Askcell ask={item} type={0} onClick={this._toQust} />
                                        </View>
                                    )
                                })
                            }
                        </View>
                }


            </View>
        )

    }
}

export default userAsk as ComponentClass