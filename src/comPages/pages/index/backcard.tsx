import { ComponentClass } from 'react'
import Taro, { Component ,Config, saveImageToPhotosAlbum} from '@tarojs/taro'
import { View, Text,Image ,Input,Picker} from '@tarojs/components'


import  '../../../config/theme.css';
import './backcard.less';

type PageStateProps = {

}


type PageDispatchProps = {
}

type PageOwnProps = {}

type  PageState = {
    accountType:Array<string>,
    accountIdx:number,
    accountName:string,
    bankAccount:string,
    name:string,
    idCard:string,
    mobile:string,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface backcard {
    props: IProps;
}


class backcard extends Component<PageDispatchProps & PageStateProps, PageState> {
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTitleText: '添加银行卡'
    }

    constructor () {
        super(...arguments)
        this.state = {
            accountType:['中国银行','农业银行','建设银行','工商银行','交通银行','招商银行'],
            accountIdx:0,
            accountName:'',
            bankAccount:'',
            name:'',
            idCard:'',
            mobile:'',
        }
    }
    componentWillReceiveProps (nextProps) {

    }

    componentWillMount () { 
        
    }

    componentDidMount () { 
       
    }



    componentWillUnmount () { }
    componentDidShow () { }
    componentDidHide () { }


    // 选择
    _onPicker = (e) => {
        var that = this ;

        that.setState({
            accountIdx:e.detail.value
        })
    }

    // 银行卡号
    _bankvalue = (e) =>{

        var that = this ;

        let yhkd=e.detail.value;

        var yhkchange = yhkd.replace(/(\d{4})(?=\d)/g, "$1 ");

        that.setState({
            bankAccount:yhkchange
        })

    }

    _onSubmit = () => {
        
    }
    
    render () {

        const {accountType,accountIdx,accountName,bankAccount,name,idCard,mobile} = this.state ;

        return (
            <View className='root'>
                <View className='apply_type'></View>
                <View className='form'>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>开户行类型</Text>
                        <View className='picker_wrap'>
                            <Picker
                                className='picker'
                                mode='selector'
                                range={accountType}
                                onChange={this._onPicker}
                            >
                                <View className="d_flex row ai_ct col_1 jc_fe ">
                                    <Text className='default_label tip_label '>{accountType[accountIdx]}</Text>
                                    <Image className='arrow_icon' mode='aspectFit' src="https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/7db72a4f-eb0b-4ed5-84e2-aa6aad198a5e.png" />
                                </View>
                            </Picker>
                        </View>
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>开户行名称</Text>
                        <Input className='input default_label tip_label col_1'
                            placeholder='例：霸州支行'
                            placeholderClass='p_color'
                            type='text'
                            value={accountName}
                            onInput={(e)=>this.setState({accountName:e.detail.value})}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>银行账号</Text>
                        <Input className='input default_label tip_label col_1'
                            placeholder='输入银行账号'
                            placeholderClass='p_color'
                            type='text'
                            value={bankAccount}
                            onInput={this._bankvalue}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>姓名</Text>
                        <Input className='input default_label tip_label col_1'
                            placeholder='输入姓名'
                            placeholderClass='p_color'
                            type='text'
                            value={name}
                            onInput={(e)=>this.setState({name:e.detail.value})}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>身份证</Text>
                        <Input className='input default_label tip_label col_1'
                            placeholder='输入身份证号'
                            type='number'
                            placeholderClass='p_color'
                            value={idCard}
                            onInput={(e)=>this.setState({idCard:e.detail.value})}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <Text className='be_333 fs_15 fw_label'>手机</Text>
                        <Input className='input default_label tip_label col_1'
                            placeholder='请输入手机号'
                            placeholderClass='p_color'
                            type='number'
                            value={mobile}
                            onInput={(e)=>this.setState({mobile:e.detail.value})}
                        />
                    </View>
                </View>

                <View className='btn' onClick={this._onSubmit}>
                    <Text className='white_label lg_label fw_label'>确定</Text>
                </View>
            </View>
        )
    }
}

export default backcard as ComponentClass