import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image,Picker} from '@tarojs/components'

import { connect } from '@tarojs/redux'
import { usersType } from '../../../../constants/usersType'
import { getUser} from '../../../../actions/user'

import inter from '../../../../config/inter'
import api from '../../../../services/api'
import {formatTimeStampToTime,formatDate,percent2percent25} from '../../../../utils/common'


import asset from '../../../../config/asset'
import menu from '../../../../config/menu';

import  '../../../../config/theme.css';
import './userInfo.less'
import GetInt from '../../../../components/GetInt'
type PageStateProps = {
    user:usersType,
    getUser:Array<{}>,
} 

type PageDispatchProps = {
    getUser:()=>any,

}

type PageOwnProps = {}

type PageState = {
    sexlist:Array<string>,
    dateSel:string ,
    header_cover:string,
    endDate:string,
    sex:number,
    userId:number,
    adress:Array<{}>,
    a_adress:Array<{}>
    area:string,
    index:number,
    region:Array<string>,
    ass:string,
    show:boolean,
    integral:number,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface UserInfo {
    props: IProps;
}

@connect(({ user }) => ({
    user:user
  }), (dispatch) => ({
    getUser () {
      dispatch(getUser())
    },
}))





class UserInfo extends Component<PageDispatchProps & PageStateProps, PageState>  {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '个人信息',
        enablePullDownRefresh: false
    }

    constructor () {
        super(...arguments)
        this.state = {
            dateSel:'',
            header_cover:'',
            sexlist:['保密','男','女'],
            endDate:'',
            sex:0,
            userId:0,
            adress:[],
            a_adress:[],
            area:'',
            index:0,
            region:['广东省','广州市'],
            ass:'广东省广州市',
            show:false,
            integral:0,
        }
        this._onChangeImg = this._onChangeImg.bind(this)
        this._onSexChange = this._onSexChange.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        const {user} = nextProps
        console.log(user)
        if(user.userData.userRegion!==''){
            let list = user.userData.userRegion.split(',')
            this.setState({
                header_cover:user.userData.avatar,
                dateSel:user.userData.birthday,
                sex:user.userData.sex,
                userId:user.userData.userId,
                // area:this.state.a_adress.filter(item=>item.regionId==user.userData.regionId)[0].regionName,
                region:list,
                ass:list[0]+list[1],
            })
        }else{
            console.log('6666')
            this.setState({
                header_cover:user.userData.avatar,
                dateSel:user.userData.birthday,
                sex:user.userData.sex,
                userId:user.userData.userId,
            })
        }
    }
    componentWillMount () { 
    }

    componentDidMount () { 
        // this.getAdress();
        this.getUser();
        this.setState({
            endDate:formatDate(new Date())
        })
    }

    componentWillUnmount () {
        this.getUser()
     }

    componentDidShow () { }

    componentDidHide () { }

    getUser(){
        this.props.getUser()
    }
    // getAdress(){
    //     api.get(inter.getAdress).then(res=>{
    //         console.log(res)
    //         this.setState({
    //             adress:res.data.data.map(item=>item==item?item.regionName:null)
    //             a_adress:res.data.data
    //         })
    //     })
    // }

    //选择拍照或者相册
    _onChangeImg(){
        var that = this;
        Taro.chooseImage({
            count:1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success:function(res){
                Taro.getFileSystemManager().readFile({
                    filePath: res.tempFilePaths[0], // 选择图片返回的相对路径
                    encoding: 'base64', // 编码格式
                    success: res => { // 成功的回调
                        api.post(inter.UploadSite,{
                            file:'data:image/png;base64,' + res.data,
                        }).then(res=>{
                            if(res.data.status){
                                api.post(inter.Puser,{
                                    field:'avatar',
                                    val:res.data.data,
                                }).then(res=>{
                                    if(res.data.status){
                                        api.get(inter.User).then(res=>
                                            that.setState({
                                                header_cover:res.data.data.avatar
                                            })
                                        )
                                        api.get(inter.checkEvents)
                                        .then(res=>{
                                            if(res.data.data){
                                                that.setState({
                                                    integral:parseInt(res.data.data),
                                                    show:true
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })                        
                    },
                    fail: msg => {

                    }
                })
            },
            fail:function(errmsg){

            }
        })
    }


    //日期的选择
    onDateChange = e => {

        const {dateSel} = this.state;
        var that = this
        if (formatTimeStampToTime(dateSel) == '1970-01-01') {
            this.setState({
                dateSel: e.detail.value
            },()=>{
                api.post(inter.Puser,{
                    field:'birthday',
                    val:e.detail.value,
                }).then(res=>{
                    Taro.showToast({
                        title: '上传成功',
                        icon:'loading',
                        duration: 1000
                    })
                    api.get(inter.checkEvents)
                    .then(res=>{
                        if(res.data.data){
                            that.setState({
                                integral:parseInt(res.data.data),
                                show:true
                            })
                        }
                    })
                })
            })
        } else {
            Taro.showModal({
                title:'编辑资料',
                content:'您修改生日次数已超过1次，\n 为保障您的权益，如需再次修\n 改请在帮助反馈中提出申请，\n 我们将尽快为您处理。',
                confirmText:'帮助反馈'
            }).then(res => {
                if(res.confirm){
                    Taro.navigateTo({url:menu.feedBack})
                }
            })
        }
        
    }

    //修改性别
    _onSexChange(e){
        var that = this
        api.post(inter.Puser,{
            field:'sex',
            val:e.detail.value,
        }).then(res=>{
                Taro.showToast({
                    title: '性别修改成功',
                    icon:'loading',
                    duration: 1000,
                }),
                this.setState({
                    sex:e.detail.value
                })
                api.get(inter.checkEvents)
                .then(res=>{
                    if(res.data.data){
                        that.setState({
                            integral:parseInt(res.data.data),
                            show:true
                        })
                    }
                })
            }
        )
    }
    _onAdressChange(e){
        const{a_adress,region}=this.state
        // console.log(a_adress[parseInt(e.detail.value)].regionId)
        // api.post(inter.postAdress,{
        //     regionId:a_adress[parseInt(e.detail.value)].regionId
        // }).then(res=>{
        //     console.log(res)
        //         Taro.showToast({
        //             title: '地区修改成功',
        //             icon:'loading',
        //             duration: 1000,
        //         }),
        //         this.setState({
        //             area:adress[parseInt(e.detail.value)]
        //         })
        //         this.getUser();
        //     }
        // )
        var that =this
        let areas = e.target.value.splice(0,2)
        let ass = areas[0]+','+areas[1]
        api.post('/user/bind/userRegion',{
            regionName:ass
        }).then(res=>{
            this.getUser()
            api.get(inter.checkEvents)
            .then(res=>{
                if(res.data.data){
                    that.setState({
                        integral:parseInt(res.data.data),
                        show:true
                    })
                }
            })
        })
        
    }
    onOkeys=()=>{
        this.setState({
            show:false
        })
    }

    render () {
        const {user} = this.props
        const {userData} = user
        const {nickname,sex,prestige,level,mobile,userId} = userData
        let {header_cover,dateSel,endDate,sexlist,area,adress,a_adress,region,ass,show,integral} = this.state

        return (
            <View className='infowrap'>
                
                <View className='d_flex p_15 pl_20 pr_20 bg_white fd_r jc_sb ai_ct  border_bt ' onClick={this._onChangeImg}>
                    <Text className='c33_label default_label'>头像</Text>
                    <View className='d_flex fd_r  ai_ct'>
                        <Image src={header_cover.length > 0 ? header_cover : 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/header.png'} className='header_cover' />
                        <Image src={asset.arrow_right}  className='icon_right' />
                    </View>
                </View>
                <View className='d_flex p_15 pl_20 pr_20 bg_white fd_r jc_sb ai_ct  border_bt'>
                    <Text className='c33_label default_label'>ID</Text>
                    <View className='d_flex fd_r  ai_ct'>
                        <Text className='default_label tip_label mr_12'>{userId}</Text>
                    </View>
                </View>
                <View className='d_flex p_15 pl_20 pr_20 bg_white fd_r jc_sb ai_ct  border_bt'
                  onClick={()=>Taro.navigateTo({url:menu.nickName+'?nickname='+ percent2percent25(`${nickname}`)})}
                >
                    <Text className='c33_label default_label'>昵称</Text>
                    <View className='d_flex fd_r  ai_ct'>
                        <Text className='default_label tip_label mr_12'>{nickname}</Text>
                        <Image src={asset.arrow_right}  className='icon_right' />
                    </View>
                </View>
                <View className='d_flex p_15 pl_20 pr_20 bg_white fd_r jc_sb ai_ct  border_bt'>
                    <Text className='c33_label default_label'>生日</Text>
                    <View className='d_flex fd_r  ai_ct'>
                        <Picker mode='date' end={endDate} value={formatTimeStampToTime(dateSel)} onChange={this.onDateChange}>
                            <Text className='default_label tip_label mr_12'>{formatTimeStampToTime(dateSel)}</Text>
                        </Picker>
                        <Image src={asset.arrow_right}  className='icon_right' />
                    </View>
                </View>
                <View className='d_flex p_15 pl_20 pr_20 bg_white fd_r jc_sb ai_ct  border_bt'>
                    <Text className='c33_label default_label'>性别</Text>
                    <View className='d_flex fd_r  ai_ct'>
                        <Picker mode='selector' value={sex} range={this.state.sexlist} onChange={this._onSexChange}>
                            <Text className='default_label tip_label mr_12'>{sexlist[sex]}</Text>
                        </Picker>
                        <Image src={asset.arrow_right}  className='icon_right' />
                    </View>
                </View>
                <View className='d_flex p_15 pl_20 pr_20 bg_white fd_r jc_sb ai_ct  border_bt'>
                    <Text className='c33_label default_label'>地区</Text>
                    <View className='d_flex fd_r  ai_ct'>
                        <Picker mode="region" value={region} onChange={this._onAdressChange}>
                            <Text className='default_label tip_label mr_12'>{ass}</Text>
                        </Picker>
                        <Image src={asset.arrow_right}  className='icon_right' />
                    </View>
                </View>
                <View className='d_flex p_15 pl_20 pr_20 bg_white fd_r jc_sb ai_ct  border_bt'>
                    <Text className='c33_label default_label'>联系方式</Text>
                    <View className='d_flex fd_r  ai_ct'>
                        <Text className='default_label tip_label mr_12'>{mobile}</Text>
                    </View>
                </View>
                <GetInt show={show} integral={integral} onOkeys={this.onOkeys}></GetInt>
            </View>
        )
    }
}

export default UserInfo as ComponentClass