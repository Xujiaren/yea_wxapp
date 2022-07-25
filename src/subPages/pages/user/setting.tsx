import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import menu from '../../../config/menu';
import asset from '../../../config/asset'

import inter from '../../../config/inter'
import api from '../../../services/api'

import Auth from '../../../components/Auth'

import { conver } from '../../../utils/common'

import '../../../config/theme.css';

import './setting.less'

type PageState = {
    keyList: Array<string>,
    userId: number,
}

class setting extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '设置'
    }

    constructor() {
        super(...arguments)
        this.state = {
            keyList: [],
            userId: 0,
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        var that = this;
        that.getUser();

    }

    componentWillUnmount() {

    }

    componentDidShow() { }
    componentDidHide() { }

    getUser() {
        var that = this
        api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    let userData = res.data.data
                    that.setState({
                        userId: userData.userId,
                    })
                }
            })
    }


    _onAddress = () => {
        var that = this;

        const { userId } = that.state;

        if (userId > 0) {
            Taro.navigateTo({ url: menu.address })
        } else {
            that._onLogin();
        }

    }

    _onLogin() {
        var that = this
        that.refs.auth.doLogin();
    }


    _onLoadCallBack = () => {

        var that = this
        that.getUser();

    }


    render() {
        const { userId } = this.state
        return (
            <View className='root'>
                {
                    userId > 0 ?
                        <View className='li_item d_flex jc_sb ai_ct bg_white' onClick={()=>Taro.navigateTo({url:menu.settingUser})} >
                            <Text className='li_text c33_label'>账号设置</Text>
                            <Image src={asset.arrow_right} className='arrow_icon' />
                        </View>
                        : null
                }
                <View className='li_item d_flex jc_sb ai_ct bg_white' onClick={this._onAddress} >
                    <Text className='li_text c33_label'>地址管理</Text>
                    <Image src={asset.arrow_right} className='arrow_icon' />
                </View>
                <View className='li_item d_flex jc_sb ai_ct bg_white' onClick={() => Taro.navigateTo({ url: menu.aboutUs })}>
                    <Text className='li_text c33_label'>关于我们</Text>
                    <Image src={asset.arrow_right} className='arrow_icon' />
                </View>

                <Auth ref={'auth'} success={() => {
                    this._onLoadCallBack()
                }} />
            </View>
        )
    }
}

export default setting as ComponentClass