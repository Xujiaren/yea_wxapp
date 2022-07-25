/**
 * @Wang
 */
import { ComponentClass } from 'react'
import Taro, { Component,Config } from '@tarojs/taro'
import { View, Text ,Image,Picker,Input,Textarea} from '@tarojs/components'

import inter from '../../../../config/inter'
import api from '../../../../services/api'

import  '../../../../config/theme.css';
import './myTrainClassSignUp.less'
import ModalPannel from '../../../../components/ModalPannel'
import menu from '../../../../config/menu'

type PageState = {
    show_pannel:boolean,
    sexIndex:number,
    dietaryIndex:number,
    tasteIndex:number,
    sexList:Array<string>,
    
    squad_id:number,
    NickName:string,
    RealName:string,
    Card:string,
    Age:string,
    IdCard:any,
    PostCard:number,
    Phone:string,
    Address:string,
    Email:string,
    Note:string,
    adres:{},
    dietaryList:Array<string>,
    tasteList:Array<string>,

    applyBegin:number,
    applyend:number,
    ones:boolean,
    twos:boolean,
    threes:boolean,
    fours:boolean,
}

class myTrainClassSignUp extends Component<{}, PageState>  {
    
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '立即报名',
        navigationBarBackgroundColor:'#FFF'
    }

    constructor () {
        super(...arguments)
        this.state = {
            
            sexIndex:0, //性别选择
            dietaryIndex:0, //  膳食选择
            tasteIndex:0,  //　 口味选择
            
            show_pannel:false,

            adres:{},
            squad_id:0,
            NickName:'',
            RealName:'', //  姓名
            Card:'',  // 卡号
            Age:'',   // 年龄
            IdCard:'', // 身份证
            PostCard:0, // 正副卡
            Phone:'',  // 电话
            Address:'', //地址
            Email:'', // 邮箱
            Note:'',  // 备注
            sexList:['保密','男','女'],
            tasteList:['无特别要求','咸','甜','辣','清淡'], // 口味要求
            dietaryList:['无特别要求','素食','清真'], // 膳食要求

            applyBegin:0,
            applyend:0,
            ones:false,
            twos:false,
            threes:false,
            fours:false,
        }

        this._selectRequire = this._selectRequire.bind(this);
        this._selectTaste = this._selectTaste.bind(this);
        this._selectSex = this._selectSex.bind(this);
        this._onSubmit = this._onSubmit.bind(this);

        
    }
    componentWillReceiveProps (nextProps) {}
    
    componentWillMount () {
        const {squad_id,applyBegin,applyend} = this.$router.params
        this.setState({
            squad_id:parseInt(squad_id),
            applyBegin:parseInt(applyBegin),
            applyend:parseInt(applyend),
        })
    }

    componentDidMount () {
        var that = this ;
        that.getUser();
        that._getAddress();
    }
    componentWillUnmount () {}

    componentDidShow () {

        var that = this

        let pages = Taro.getCurrentPages();
        let currPage = pages[pages.length - 1]; // 获取当前页面
        if (currPage.__data__.adsData) { // 获取值
            let ads = currPage.__data__.adsData
            
            that.setState({ 
                Address: ads.province + ads.city + ads.district + ads.address
            })
        }

    }
    componentDidHide () {}

    getUser(){
        var that = this
        api.get(inter.User)
            .then((res)=>{
                if(res.data.status){
                    let userData = res.data.data
                    that.setState({
                        NickName:userData.nickname,
                        Card:userData.sn,
                        sexIndex:userData.sex,
                        PostCard:userData.isPrimary, // 0 副卡  正卡
                        Phone:userData.mobile,
                        RealName:userData.username,
                        Age:userData.age<=99&&userData.age>0?userData.age:'',
                        IdCard:userData.idcard,
                        // RealName:userData.realName
                    })
                    if(userData.username){
                        this.setState({
                            ones:true
                        })
                    }
                    if(userData.idcard){
                        this.setState({
                            twos:true
                        })
                    }
                    if(userData.age&&userData.age<=99&&userData.age>0){
                        this.setState({
                            threes:true
                        })
                    }
                }
            })
    }

    _getAddress(){
        var that = this;
        api.get(inter.Address)
        .then((res)=>{
            if(res.data.status){
                let adres = res.data.data;
                adres.map((addr, index) => {
                    if (addr.isFirst == 1) {
                        that.setState({
                            adres: addr,
                            Address:addr.province + addr.city + addr.district + addr.address
                        })
                    }
                })
            }
        })
    }

    // 选择膳食要求
    _selectRequire = (e) => {
        var that = this;
        that.setState({
            dietaryIndex:e.detail.value
        })
    }

    // 选择口味
    _selectTaste = (e) => {
        var that = this;
        that.setState({
            tasteIndex:e.detail.value
        })
    }


    // 选择性别
    _selectSex = (e) =>{
        var that = this;
        that.setState({
            sexIndex:e.detail.value
        })
    }



    _onSubmit(){
        var that = this;
        const {PostCard,Card,squad_id,sexIndex,dietaryIndex,tasteIndex,NickName,RealName,Age,IdCard,Phone,Address,Email,Note,tasteList,dietaryList,applyend,applyBegin} = that.state;

        let isPush:boolean = true
        let tip:string = '' 

        var szReg=/^([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; // 判断邮箱
        // var pattern = /0?(13|14|15|17|18)[0-9]{9}/; // 手机号
        var pattern = /^1[3-9]\d{9}$/;
        // var pattern = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/; // 手机号
        var paId =/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/; // 身份证

        var nowTime = (new Date()).getTime();


    
        if(RealName == ''){
            isPush = false
            tip = '请填写你的真实姓名'
        } else if(Card == ''){
            isPush = false
            tip = '卡号不能为空'
        } else if(Age == ''){
            isPush = false
            tip = '请填写你的年龄'
        } else if(!paId.test(IdCard)){
            isPush = false
            tip = '请填写正确的身份证号码'
        }  else if(!pattern.test(Phone)){
            isPush = false
            tip = '请填写正确的手机号'
        } else if(Address == ''){
            isPush = false
            tip = '请填写你的地址'
        } else if(Email.length > 0){
            if(!szReg.test(Email)){
                isPush = false
                tip = '请填写正确的邮箱格式' 
            }
        }


        if(applyBegin * 1000 < nowTime &&  applyend * 1000 > nowTime){
            if(isPush){
                api.post(inter.squadApply + squad_id,{
                    sn:Card,
                    name:NickName,
                    realname:RealName,
                    age:Age,
                    sex:sexIndex,
                    identity_sn:IdCard,
                    is_primary:PostCard,
                    mobile:Phone,
                    address:Address,
                    email:Email,
                    taste:tasteList[tasteIndex],
                    meal:dietaryList[dietaryIndex],
                    remark:Note,
                }).then((res)=>{
                    if(res.data.status){
                        Taro.showToast({
                            title:'报名成功',
                            icon:'success', 
                            duration:1000,
                        })
                        setTimeout(()=>{
                            Taro.navigateBack();
                        },1000)
                    } else {
                        let msg = '';
                        if(res.data.message == 'SQUAD_ERROR'){
                            msg = '不在报名时间内'
                        } else if(res.data.message == 'SQUAD_MAX_NUM'){
                            msg = '人数已满'
                        } else if(res.data.message == 'USER_ERROR'){
                            msg = '已报名'
                        }
                        Taro.showToast({
                            title:msg,
                            icon:'filed', 
                            duration:1000,
                        })
                    }
                })
            } else {
                Taro.showToast({
                    title:tip,
                    icon:'none',
                    duration:1000,
                })
            }
        } else {
            Taro.showToast({
                title:'不在可报名时间内',
                icon:'none',
                duration:1000,
            })

        }

        

    }

    render () {
        const {PostCard,adres,show_pannel,sexList,sexIndex,dietaryIndex,tasteIndex,NickName,RealName,Card,Age,IdCard,Phone,Address,Email,Note,tasteList,dietaryList} = this.state

        return (
            <View className='root'>
                <View className='apply_type'></View>
                <View className='form pb_50'>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>昵称</Text>
                        <Input className='input default_label tip_label col_1'
                            type='text'
                            value={NickName}
                            placeholderClass='p_color'
                            disabled
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>真实姓名</Text>
                        <Input className='input default_label tip_label col_1'
                            placeholder='请输入你的真实姓名'
                            placeholderClass='p_color'
                            type='text'
                            value={RealName}
                            onInput={(e)=>this.setState({RealName:e.detail.value})}
                            disabled={this.state.ones}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>卡号</Text>
                        <Input className='input default_label tip_label col_1'
                            type='number'
                            placeholderClass='p_color'
                            value={Card}
                            disabled
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb'>
                        <Text className='be_333 fs_15 fw_label se_label'>性别</Text>
                        <View className='picker_wrap'>
                            <Picker
                                className='picker'
                                mode='selector'
                                range={sexList}
                                onChange={this._selectSex}
                                disabled
                            >
                                <View className="d_flex row ai_ct col_1 jc_fe ">
                                    <Text className='default_label tip_label '>{sexList[sexIndex]}</Text>
                                    <Image className='arrow_icon' mode='aspectFit' src="https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/7db72a4f-eb0b-4ed5-84e2-aa6aad198a5e.png" />
                                </View>
                            </Picker>
                        </View>
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>年龄</Text>
                        <Input className='input default_label tip_label col_1'
                            placeholder='请输入年龄'
                            maxLength='2'
                            placeholderClass='p_color'
                            type='number'
                            value={Age}
                            onInput={(e)=>this.setState({Age:e.detail.value})}
                            disabled={this.state.threes}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>身份证</Text>
                        <Input className='input default_label tip_label col_1'
                            placeholder='请输入身份证'
                            type='idcard'
                            value={IdCard}
                            placeholderClass='p_color'
                            onInput={(e)=>this.setState({IdCard:e.detail.value})}
                            disabled={this.state.twos}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>正副卡</Text>
                        <Input className='input default_label tip_label col_1'
                            type='text'
                            placeholderClass='p_color'
                            value={PostCard === 0 ? '副卡' :'正卡'}
                            disabled
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>联系电话(可修改)</Text>
                        <Input className='input default_label tip_label col_1'
                            placeholder='请填写联系电话'
                            maxLength={11}
                            placeholderClass='p_color'
                            type='number'
                            value={Phone}
                            onInput={(e)=>this.setState({phone:e.detail.value})}
                            // disabled
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>联系地址</Text>
                        <View className="d_flex row ai_ct col_1 jc_fe  txtcons">
                            {/* <Textarea className='txtinput default_label tip_label'
                                placeholderStyle='fize-size:28rpx'
                                value={Address}
                                autoHeight
                                onInput={(e)=>this.setState({Address:e.detail.value})}
                            /> */}
                            <View className='d_flex fd_r ai_ct'
                                onClick={()=>Taro.navigateTo({url:menu.address + '?nageType=1'})}
                            >
                                <View className='col_1 pl_30'>
                                    {
                                        Address === '' ? 
                                        <Text className='none_label default_label'>请添加地址</Text>
                                        :
                                        <Text className='sect_label default_label'>{Address}</Text>
                                    }
                                    
                                </View>
                                <Image className='arrow_icon' mode='aspectFit' src="https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/7db72a4f-eb0b-4ed5-84e2-aa6aad198a5e.png"   />
                            </View>
                        </View>
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>邮箱</Text>
                        <Input className='input default_label tip_label col_1'
                            placeholder='请输入邮箱'
                            type='text'
                            placeholderClass='p_color'
                            value={Email}
                            onInput={(e)=>this.setState({Email:e.detail.value})}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>备注(非必填)</Text>
                        <Input className='input default_label tip_label col_1'
                            placeholder='请输入备注'
                            type='text'
                            placeholderClass='p_color'
                            value={Note}
                            onInput={(e)=>this.setState({Note:e.detail.value})}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb'>
                        <Text className='be_333 fs_15 fw_label se_label'>口味偏好</Text>
                        <View className='picker_wrap'>
                            <Picker
                                className='picker'
                                mode='selector'
                                range={tasteList}
                                onChange={this._selectTaste}
                            >
                                <View className="d_flex row ai_ct col_1 jc_fe ">
                                    <Text className='default_label sect_label '>{tasteList[tasteIndex]}</Text>
                                    <Image className='arrow_icon' mode='aspectFit' src="https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/7db72a4f-eb0b-4ed5-84e2-aa6aad198a5e.png" />
                                </View>
                            </Picker>
                        </View>
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb'>
                        <Text className='be_333 fs_15 fw_label se_label'>膳食要求</Text>
                        <View className='picker_wrap'>
                            <Picker
                                className='picker'
                                mode='selector'
                                range={dietaryList}
                                onChange={this._selectRequire}
                            >
                                <View className="d_flex row ai_ct col_1 jc_fe ">
                                    <Text className='default_label sect_label '>{dietaryList[dietaryIndex]}</Text>
                                    <Image className='arrow_icon' mode='aspectFit' src="https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/7db72a4f-eb0b-4ed5-84e2-aa6aad198a5e.png" />
                                </View>
                            </Picker>
                        </View>
                    </View>
                </View>
                <View className='btn'>
                    <View className='btn_text' hoverClass='on_tap'
                        onClick={this._onSubmit}
                    >
                        <Text>提交</Text>
                    </View>
                </View>
                <ModalPannel content='提交成功' visible={show_pannel} onClose={()=>{ this.setState({show_pannel:false}) }}/>
            </View>
        )
    }
}

export default myTrainClassSignUp as ComponentClass
