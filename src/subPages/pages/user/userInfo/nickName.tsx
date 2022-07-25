import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Input} from '@tarojs/components'

import { connect } from '@tarojs/redux'
import { usersType } from '../../../../constants/usersType'
import { getUser} from '../../../../actions/user'

import inter from '../../../../config/inter'
import api from '../../../../services/api'


import  '../../../../config/theme.css';
import './nickName.less'


type PageStateProps = {
    user:usersType,
    getUser:Array<{}>,
} 

type PageDispatchProps = {
    getUser:()=>any,

}

type PageOwnProps = {}

type PageState = {
    content:string
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface NickName {
    props: IProps;
}

@connect(({ user }) => ({
    user:user
  }), (dispatch) => ({
    getUser () {
      dispatch(getUser())
    },
}))



class NickName extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '个人信息',
        enablePullDownRefresh: false
    }

    constructor () {
        super(...arguments)
        this.state = {
            content:'',
        }
    }

    componentWillMount () { 
        const that = this 
        const {nickname} = that.$router.params
        this.setState({
            content:nickname
        })
        this.getUser();
    }
    componentDidMount () { }
    componentWillUnmount () { }
    componentDidShow () { }
    componentDidHide () { }


    getUser(){
        this.props.getUser()
    }
    

    _onNickname = () => {
        var that = this;
        const {content} = that.state

        let nickname:string = content.replace(/\s+/g,"")

        if(nickname.length  >  0 ){
            if(nickname.length > 5){
                Taro.showToast({
                    title:'昵称不大于五个字',
                    icon:'none'
                })
            } else {
                api.post(inter.Puser,{
                    field:'nickname',
                    val:nickname,
                }).then(res=>{
                    this.getUser();
                    Taro.showToast({
                        title: '修改成功',
                        icon:'loading',
                        duration: 1000
                    })
                    setTimeout(()=>Taro.navigateBack(),1000)
                })
            }
            
        } else {
            Taro.showToast({
                title:'昵称不能为空',
                icon:'none'
            })
        }
    }

    render () {
        const {content} = this.state
        return (
            <View className='nickwrap'>
                <View className='pt_15 pb_15 pl_30 bg_white mt_10'>
                    <Input className='input' 
                        placeholder={content}
                        onInput={(e):void =>this.setState({content:e.detail.value})} 
                        value={content}
                    />
                </View>
                
                <View className='m_20  btn pt_10 pb_10' onClick={this._onNickname} >
                    <Text className='white_label'>确认</Text>
                </View>
            </View>
        )
    }
}

export default NickName as ComponentClass