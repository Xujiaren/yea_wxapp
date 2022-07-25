/**
 * @wang
 */
import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { View, Text ,Image,} from '@tarojs/components'
import { Barcode ,QRCode} from 'taro-code'

import inter from '../../../../config/inter'
import api from '../../../../services/api'

import { bUrl } from '../../../../config'

import './myIDCard.less'


type PageState = {
    learn:number,
    username:string,
    userId:number,
    avatar:string,
    mobile:string,
    totalLearn:number,
    squadList:Array<{
        squadId:number
    }>
}
class myIDCard extends Component<{}, PageState>  {
    
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '我的学生证',
        navigationBarBackgroundColor:'#ffffff',
        enablePullDownRefresh: true,
        backgroundColor:'#FAFAFA'
    }

    constructor () {
        super(...arguments)
        this.state = {
            learn:0,
            userId:0,
            username:'',
            avatar:'',
            mobile:'',
            totalLearn:0,
            squadList:[]
        }
        
    }


    componentWillReceiveProps (nextProps) {}
    componentWillMount () {}
    componentDidMount () {
        var that = this;
        that.getUser();
        that._getStudy();
        that._getSquad();
    }
    componentWillUnmount () {}
    componentDidShow () {}
    componentDidHide () {}


    // 获取个人信息
    getUser(){
        var that = this
        api.get(inter.User)
            .then((res)=>{
                if(res.data.status){
                    let userData = res.data.data
                    that.setState({
                        username:userData.nickname,
                        userId:userData.userId,
                        avatar:userData.avatar,
                        mobile:userData.mobile,
                        learn:userData.learn,
                        totalLearn:userData.totalLearn
                    })
                }
            })
    }

    _getSquad(){
        var that = this 

        api.get(inter.userSquad,{
            page:0,
            stype:0
        }).then((res)=>{
            if(res.data.status){
                let squadList = res.data.data.items

                that.setState({
                    squadList:squadList
                })
            }
        })
        
        
    }


    // 获取个人学习情况
    _getStudy(){
        var that = this;
        api.get(inter.Study)
            .then((res)=>{
                if(res.data.status){
                    let study = res.data.data;
                    that.setState({
                        learn:study.learn,
                    })
                }
            })
    }
    
    onPullDownRefresh(){
        Taro.showNavigationBarLoading()
        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }


    render () {
        const idcard_icon = "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/3856b50f-8505-469d-99a9-bd49abb4f43d.png"

        const {learn,userId,username,avatar,mobile,totalLearn,squadList} = this.state

        let squardId = 0
        if(squadList.length > 0 ){
            squardId = squadList[0].squadId
        }


        return (
            <View className='root'>
                <View className='img_wrap'>
                    <Image className='idcard_img' src={idcard_icon}/>
                    <Text className='num'>学号：{userId}</Text>
                    <View className='card_info_wrap'>
                        <View className='avatar_wrap'>
                            <Image className='avatar' src={avatar}/>
                            <View className='username'>
                                <Text>{username}</Text>
                            </View>
                        </View>
                        <View className='learn'>
                            <Text>学习天数：<Text className='bold'>{totalLearn}</Text></Text>
                        </View>
                        <View className='learn'>
                            <Text>连续学习天数：<Text className='bold'>{learn}</Text></Text>
                        </View>
                    </View>
                </View>
                <View className='barcodeBox'>
                    <QRCode text={bUrl+'/#/userCheck/' + squardId + '/' +  userId} size={100} scale={4}  errorCorrectLevel='M'  className='barcode' />
                </View>
                <Text className='scan_txt'>扫码签到</Text>
            </View>
        )
    }
}

export default myIDCard as ComponentClass
