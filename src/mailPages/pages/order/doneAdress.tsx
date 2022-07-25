import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Picker,Input,Image,Switch} from '@tarojs/components'

import inter from '../../../config/inter'
import api from '../../../services/api'


import  '../../../config/theme.css';
import './doneAdress.less'


type PageState = {
    Name:string,
    Phone:string,
    Adsdesc:string,
    Default:boolean,
    region:Array<string>,
    ads:object,
    type:number,
    address_id:number,
    nageType:number
}

class doneAdress extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '地址'
    }

    constructor () {
        super(...arguments)
        this.state = {
            Name:'',
            Phone:'',
            Adsdesc:'',
            Default:false,
            region: ['', '', ''],
            ads:{},
            type:0,
            address_id:0,
            nageType:0
        }

        this._onSwitch = this._onSwitch.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    componentWillMount () {
        var that = this;
        const {type,ads,} = that.$router.params

        Taro.setNavigationBarTitle({
            title: parseInt(type) ===  0 ? '添加地址' : '修改地址' ,
        })

        that.setState({
            type:parseInt(type),
            ads:JSON.parse(ads),
            Name:JSON.parse(ads).realname != undefined ?  JSON.parse(ads).realname : '',
            Phone:JSON.parse(ads).mobile  != undefined ? JSON.parse(ads).mobile  : '',
            Adsdesc:JSON.parse(ads).address != undefined ? JSON.parse(ads).address  : '',
            Default:JSON.parse(ads).isFirst === 0 ?  false : true,
            region: [JSON.parse(ads).province != undefined ? JSON.parse(ads).province : '', JSON.parse(ads).city != undefined ? JSON.parse(ads).city : '', JSON.parse(ads).district != undefined ? JSON.parse(ads).district : ''],
            address_id:JSON.parse(ads).addressId != undefined ? JSON.parse(ads).addressId : ''
        })
    }

    componentDidMount () { 
        

    }

    componentWillUnmount () {
        
    }
    
    componentDidShow () { }
    componentDidHide () { }

    //  选择地区 
    onRegionChange = (e ) =>{
        var that = this;
        that.setState({
            region: e.detail.value
        })
    }

    // 默认
    _onSwitch = (e) => {
        var that = this ;
        that.setState({
            Default:e.detail.value
        })
    }

    _onSubmit(){
        var that = this ;
        const  {Name,Phone,region,Adsdesc,Default,address_id}  = that.state;


        let isPush:boolean = true
        let tip:string = '' 

        if(Name == '' ){
            isPush = false
            tip = '请填写你的姓名'
        } else if (Phone == '' || Phone.length != 11) {
            isPush = false
            tip = '请填写正确的号码'
        }else if(region[0].length == 0){
            isPush = false
            tip = '请选择地区'
        } else if(Adsdesc == ''){
            isPush = false
            tip = '请填写你的详细地址'
        }

        if(isPush){
            api.post(inter.DoneAddress,{
                address_id:address_id,
                realname:Name,
                mobile:Phone,
                province:region[0],
                city:region[1],
                district:region[2],
                address:Adsdesc,
                is_first:Default ? 1 : 0,
            }).then((res)=>{
                if(res.data.status){
                    Taro.showToast({
                        title:'保存地址',
                        icon:'success',
                        duration:1000,
                    })
                    setTimeout(()=>{
                        Taro.navigateBack();
                    },1000)
                }
            })
        } else {
            Taro.showToast({
                title:tip,
                icon:'none',
                duration:2000,
            })
        }
        


    }

    render () {
        const {Name,Phone,region,Adsdesc,Default} = this.state

        return (
            <View  className='wrap'>

                <View className='form mt_10'>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>姓名</Text>
                        <Input className='input default_label tip_label'
                            placeholder='请填写姓名'
                            type='text'
                            value={Name}
                            onInput={(e)=>this.setState({Name:e.detail.value})}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>手机号</Text>
                        <Input className='input default_label tip_label'
                            placeholder='请填写手机号'
                            type='text'
                            value={Phone}
                            maxLength={11}
                            onInput={(e)=>this.setState({Phone:e.detail.value})}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>地区</Text>
                        <View className='picker_wrap'>
                            <Picker 
                                mode="region"
                                value={region}
                                onChange={this.onRegionChange}
                            >
                                <View className="picker">
                                    {
                                        region[0].length > 0 ?
                                        <Text className='c33_label default_label'>{region[0] + ' ' + region[1] + ' ' +region[2] }</Text>
                                    :
                                        <Text className='default_label tip_label'>请选择地区</Text>
                                    }
                                    
                                    <Image className='arrow_icon' mode='aspectFit' src="https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/7db72a4f-eb0b-4ed5-84e2-aa6aad198a5e.png" />
                                </View>
                            </Picker>
                        </View>
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>详细地址</Text>
                        <Input className='input default_label tip_label'
                            placeholder='请填写详细地址'
                            type='text'
                            value={Adsdesc}
                            onInput={(e)=>this.setState({Adsdesc:e.detail.value})}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>设为默认</Text>
                        <Switch checked={Default}  className='switch' onChange={this._onSwitch}/>
                    </View>
                </View>
                
                <View className='m_20 keepBtn' onClick={this._onSubmit}>
                    <Text className='lg_label white_label'>保存</Text>
                </View>
            </View>
        )
    }
}

export default doneAdress as ComponentClass