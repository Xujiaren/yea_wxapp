import { ComponentClass } from 'react'
import Taro, { Component, navigateTo } from '@tarojs/taro'
import { View, Text, Input, Image, WebView, CoverView } from '@tarojs/components'


import menu from '../../../config/menu';
import asset from '../../../config/asset';

import inter from '../../../config/inter'
import api from '../../../services/api'

import '../../../config/theme.css';
import './readyLottery.less'

type PageState = {
    load: boolean,
    gift: boolean,
    goldlay: boolean,
    layerinfo: boolean,
    data: object,
    ctype: number,
    cimg: string,
    cindex: number,
    cname: string,
    win_name: string,
    win_mobile: string,
    win_ads: string,
    rewardId: any,
    isSubmit: boolean,
    ts: number,
}


class ReadyLottery extends Component<{}, PageState>  {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '翻牌抽奖'
    }

    constructor() {
        super(...arguments)
        this.state = {
            load: false,
            data: {},
            gift: true,
            goldlay: false,
            layerinfo: false,
            ctype: 0,
            cimg: '',
            cindex: 0,
            cname: '',
            win_name: '',
            win_mobile: '',
            win_ads: '',
            rewardId: 0,
            isSubmit: true,
            ts: 0,
        }

        this._editAds = this._editAds.bind(this);
        this._noWin = this._noWin.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._onGold = this._onGold.bind(this);
    }
    componentWillMount() {

        var that = this;
        var nowTime = new Date();

        console.log(Taro.getStorageSync('ts'))

        if (!Taro.getStorageSync('ts')) {
            Taro.setStorageSync("ts", nowTime.getTime());
        } else {
            that.setState({
                ts: Taro.getStorageSync('ts')
            })
        }


        if (Taro.getStorageSync("lucky") == "") {

            Taro.navigateTo({
                url: menu.luckyDraw
            });

        }
    }
    componentDidMount() {


    }

    componentWillUnmount() { }

    componentDidShow() {
        var that = this


        if (Taro.getStorageSync("lucky") !== "") {
            Taro.setStorageSync("back", "");
            let luckydata: any = JSON.parse(Taro.getStorageSync("lucky"))

            let ts = Taro.getStorageSync('ts')
            let vas = Taro.getCurrentPages().length
            let lst = Taro.getCurrentPages()
            api.post(inter.activityFlop + 1 + '?ts=' + ts, {
                index: luckydata[0].index,
                action: 1,
            }).then(res => {
                console.log(res)
                if (res.data.status) {
                    let lettery = res.data.data
                    if(lettery.rewardId!==0){
                        this.setState({
                            rewardId: lettery.rewardId
                        })
                    }
                }
            })
            api.post(inter.activityFlop + 1 + '?ts=' + ts, {
                index: luckydata[0].index,
            }).then(res => {
                console.log(res)
                if (res.data.status) {
                    let lettery = res.data.data
                    if(lettery.rewardId!==0){
                        this.setState({
                            rewardId: lettery.rewardId
                        })
                    }
                }

            })

            api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    let userData = res.data.data
                    if(userData.userId==4382||userData.userId==419||userData.userId==63597){
                        this.setState({
                            load: true,
                            data: luckydata,
                            ctype: 0,
                            cimg: luckydata[0].img,
                            cindex: luckydata[0].index,
                            cname: luckydata[0].name
                        })
                    }else{
                        this.setState({
                            load: true,
                            data: luckydata,
                            ctype: luckydata[0].ctype,
                            cimg: luckydata[0].img,
                            cindex: luckydata[0].index,
                            cname: luckydata[0].name
                        })
                    }
                }

            })
           
        } else {
            if (Taro.getStorageSync("back") !== "") {
                Taro.setStorageSync("back", "");
                Taro.navigateBack();
            }
        }
    }


    //  填写地址
    _editAds() {
        var that = this;
        that.setState({
            ctype: 4,
            layerinfo: true,
        })
    }

    _noWin() {
        Taro.setStorageSync('lucky', "")
        Taro.setStorageSync("ts", "");
        this.setState({
            isSubmit: false,
        })
        Taro.switchTab({
            url: menu.user
        })
    }

    _onGold() {
        Taro.setStorageSync('lucky', "")
        const { rewardId } = this.state
        this.setState({
            isSubmit: false,
        })
        api.post(inter.lotteryReceive + rewardId, {
            realname: "",
            address: "",
            mobile: ""
        }).then(res => {
            if (res.data.status) {
                Taro.setStorageSync('lucky', "")
                Taro.setStorageSync("ts", "");
                Taro.showToast({
                    title: '获取成功',
                    icon: 'success',
                    duration: 1000
                })
                setTimeout(function () {
                    Taro.switchTab({
                        url: menu.user
                    })
                }, 1000);
            } else {
                Taro.showToast({
                    title: '获取失败',
                    icon: 'loading',
                    duration: 1000
                })
                this.setState({
                    isSubmit: true,
                })
            }
        })
    }
    //中奖填写地址
    _onSubmit() {
        var that = this
        const { win_ads, win_mobile, win_name, rewardId } = that.state

        this.setState({
            isSubmit: false,
        })
        let voild = true
        let msg = ''

        if (win_name == '') {
            voild = false,
                msg = '姓名不能为空'
        } else if (win_mobile == '') {
            voild = false,
                msg = '手机号码不能为空'
        } else if (win_mobile.length != 11) {
            voild = false,
                msg = '请输入正确的手机号码'
        } else if (win_ads == '') {
            voild = false,
                msg = '地址不能为空'
        }

        if (voild) {
            api.post(inter.lotteryReceive + rewardId, {
                realname: win_name,
                address: win_ads,
                mobile: win_mobile
            }).then(res => {
                if (res.data.status) {
                    if(res.data.data=='time_out'){
                        Taro.setStorageSync('lucky', "")
                        Taro.setStorageSync("ts", "");
                        Taro.showToast({
                            title: '奖品已过期',
                            icon: 'none',
                            duration: 1000
                        })
                    }else{
                        Taro.setStorageSync('lucky', "")
                        Taro.setStorageSync("ts", "");
                        Taro.showToast({
                            title: '提交成功',
                            icon: 'success',
                            duration: 1000
                        })
                    }
                    setTimeout(function () {
                        Taro.switchTab({
                            url: menu.user
                        })
                    }, 1000);
                } else {
                    Taro.showToast({
                        title: '提交失败',
                        icon: 'loading',
                        duration: 1000
                    })
                    this.setState({
                        isSubmit: true,
                    })
                }
            })
        } else {
            Taro.showToast({
                title: msg,
                icon: 'none',
                duration: 1000
            })
        }


    }

    render() {
        if (!this.state.load) return <View />;
        const { isSubmit, layerinfo, data, ctype, cimg, cname } = this.state;


        return (
            <View className='drawwrap'>
                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/readlottery.png'} style={{ width: '100vw', height: '100vh' }} />
                {
                    ctype == 0 ?
                        <View className='layer_wins_gold' >
                            <View className='layer_win'>
                                <View className='layer_box'>
                                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/lucky_glod.png'} className="layer_head" />
                                    <Text className='lg24_label black_label pt_20 pb_5'>再接再厉!</Text>
                                    <Text className='lg18_label c33_label'></Text>
                                    <View className='layer_icover d_flex fd_r jc_ct ai_ct'>
                                        <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/nulllucky.png'} className='layer_ncover' />
                                    </View>
                                    {
                                        isSubmit ?
                                            <View className='d_flex fd_r ai_ct jc_ct  layer_btns' onClick={this._noWin}>
                                                <Text className='default_label white_label'>确定</Text>
                                            </View>
                                            :
                                            <View className='d_flex fd_r ai_ct jc_ct  layer_btns'>
                                                <Text className='default_label white_label'>确定</Text>
                                            </View>
                                    }
                                </View>
                            </View>
                        </View>
                        : null}

                {
                    ctype == 1 ?
                        <View className='layer_wins_gold' >
                            <View className='layer_win'>
                                <View className='layer_box'>
                                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/lucky_glod.png'} className="layer_head" />
                                    <Text className='lg24_label black_label pt_20 pb_5'>恭喜您!</Text>
                                    <Text className='lg18_label c33_label'>获得 {cname}</Text>
                                    <View className='layer_icover d_flex fd_r jc_ct ai_ct'>
                                        <Image src={cimg} className='layer_cover' />
                                    </View>
                                    {
                                        isSubmit ?
                                            <View className='d_flex fd_r ai_ct jc_ct  layer_btns' onClick={this._onGold}>
                                                <Text className='default_label white_label'>确定</Text>
                                            </View>
                                            :
                                            <View className='d_flex fd_r ai_ct jc_ct  layer_btns'>
                                                <Text className='default_label white_label'>确定</Text>
                                            </View>
                                    }
                                </View>
                            </View>
                        </View>
                        : null}

                {
                    ctype == 2 ?
                        <View className='layer_wins'  >
                            <View className='layer_win'>
                                <View className='layer_box'>
                                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/lucky_glod.png'} className="layer_head" />
                                    <Text className='lg24_label black_label pt_20 pb_5'>恭喜您!</Text>
                                    <Text className='lg18_label c33_label'>获得 {data[0].name} </Text>
                                    <View className='layer_icover d_flex ai_ct jc_ct'>
                                        <Image src={data[0].img} className='layer_cover' />
                                    </View>
                                    <View className='d_flex fd_r jc_sb border_tp layer_btns mt_10'>
                                        <View className=' d_flex ai_ct jc_ct  white_ads' onClick={this._editAds}>
                                            <Text className='default_label white_label'>填写地址</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : null}


                {
                    layerinfo ?
                        <View className='layerInfo'>
                            <View className='layer_boxs'>
                                <View className='layer_box'>
                                    <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/lucky_ads.png'} className="layer_head" />
                                    <View className='layer_cons'>
                                        <View className='layer_item d_flex fd_r ai_ct mb_15'>
                                            <Input type='text' placeholder='姓名' className='layertext ml_10' name='name'
                                                onInput={(event) => this.setState({ win_name: event.detail.value })}
                                            />
                                        </View>
                                        <View className='layer_item d_flex fd_r ai_ct mb_15'>
                                            <Input type='number' placeholder='手机' className='layertext ml_10 ' name='mobile'
                                                onInput={(event) => this.setState({ win_mobile: event.detail.value })}
                                            />
                                        </View>
                                        <View className='layer_item d_flex fd_r ai_ct mb_10'>
                                            <Input type='text' placeholder='地址' className='layertext ml_10 ' name='adds'
                                                onInput={(event) => this.setState({ win_ads: event.detail.value })}
                                            />
                                        </View>
                                        <View className='layer_txt mb_15'>
                                            <Text className='tip_label sm_label'>请确保信息无误，一旦提交无法修改</Text>
                                        </View>
                                    </View>
                                    {
                                        isSubmit ?
                                            <View className='d_flex fd_r ai_ct jc_ct  layer_btns' onClick={this._onSubmit}>
                                                <Text className='default_label white_label'>确定</Text>
                                            </View>
                                            :
                                            <View className='d_flex fd_r ai_ct jc_ct  layer_btns'>
                                                <Text className='default_label white_label'>确定</Text>
                                            </View>
                                    }

                                </View>

                            </View>

                        </View>
                        : null}
            </View>
        )
    }
}


export default ReadyLottery as ComponentClass