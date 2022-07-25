/**
 * @Wang
 */
import { ComponentClass } from 'react'
import Taro, { Component,Config } from '@tarojs/taro'
import { View, Text ,Image,Picker,Input,Textarea, Block} from '@tarojs/components'

import ModalPannel from '../../../../components/ModalPannel'

import api from '../../../../services/api'
import inter from '../../../../config/inter'
import asset from '../../../../config/asset';
import menu from '../../../../config/menu'

import  '../../../../config/theme.css';
import './certificateSignUp.less'

type PageState = {
    squad_id:number,
    show_pannel:boolean,
    name:string,
    IdCard:string,
    idLevel:any,
    mobile:string,
    ads:string,
    sexList:Array<string>
    sexIdx:number,
    eduBack:Array<string>,
    eduBackIdx:number,
    age:string,
    height:string,
    sell_sn:string,
    hasPaper:Array<string>,
    hasPaperIdx:number,
    card_forward_img:string,
    card_backward_img:string,
    certificate_img:string,
    certImg:Array<string>,
    rangeIcon:string,
    ephoto:string,
    adres:{}
}

class CertificateSignUp extends Component<{}, PageState>  {
    
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '资格认证报名',
        navigationBarBackgroundColor:'#FFF'
    }

    constructor () {
        super(...arguments)
        this.state = {
            squad_id:0,
            show_pannel:false,
            name:'',
            IdCard:'',
            idLevel:0,
            mobile:'',
            ads:'',
            sexList:['保密','男','女'],
            sexIdx:0,
            eduBack:['初级中学','普通高中','技工学校','职业高中','中等专科','大学专科','大学本科','硕士研究生','博士研究生'],
            eduBackIdx:0,
            age:'',
            height:'',
            sell_sn:'',
            hasPaper:['有','无'],//是否有学历证书
            hasPaperIdx:0,
            card_forward_img:'',//身份证正面
            card_backward_img:'',//身份证反面
            certificate_img:'',//学历图片   
            certImg:["https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/6499edba-5cdd-4951-bc52-227d1993bde5.png",
                    "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/02af99a2-c706-430e-97f2-5fa8826c7aa8.png",
                    "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/e9a43155-831d-4239-8b88-8d513b642df8.png"
                    ],
            rangeIcon:"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/7db72a4f-eb0b-4ed5-84e2-aa6aad198a5e.png",
            ephoto:'',
            adres:{}
        }
        
    }
    componentWillReceiveProps (nextProps) {}
    componentWillMount () {
        var that = this;
        const {squad_id} = that.$router.params

        that.setState({
            squad_id:parseInt(squad_id),
        })
    }
    componentDidMount () {

        var that = this;
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
                ads: ads.province + ads.city + ads.district + ads.address
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
                        IdCard:userData.sn,
                        sexIdx:userData.sex,
                        mobile:userData.mobile,
                        idLevel:userData.idLevel,
                        name:userData.username
                    })
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
                            ads:addr.province + addr.city + addr.district + addr.address
                        })
                    }
                })
            }
        })
    }

    // 上传图片
    _onChooseImg(type){
        let that = this
        Taro.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                
                Taro.getFileSystemManager().readFile({
                    filePath: res.tempFilePaths[0], // 选择图片返回的相对路径
                    encoding: 'base64', // 编码格式
                    success: res => { // 成功的回调
                        api.post(inter.UploadSite,{
                            file:'data:image/png;base64,' + res.data,
                        }).then(res=>{
                            if(res.data.status){
                                if(type === 0)
                                that.setState({ card_forward_img:res.data.data })
                                else if(type === 1)
                                    that.setState({ card_backward_img:res.data.data })
                                else if(type === 2)
                                    that.setState({ certificate_img:res.data.data })
                                else 
                                    that.setState({ephoto:res.data.data})
                            }
                        })
                    },
                    fail: msg => {
                    }
                })
                

            }
        })
    }

    // 选择有无学历
    _hasPaper = (e) =>{

        var that = this ;
        that.setState({
            hasPaperIdx:parseInt(e.detail.value)
        })
    }


    // 判断 是否上传毕业证
    _typeSubmit(){
        var that = this
        const {squad_id,name,IdCard,idLevel,mobile,ads,age,height,sell_sn,card_forward_img,card_backward_img,certificate_img,sexIdx,eduBack,eduBackIdx,hasPaperIdx,ephoto} = that.state

        let isPush:boolean = true
        let tip:string = '' 

        // var pattern = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/; // 手机号
        var pattern = /^1[3-9]\d{9}$/;

        if(name == ''){
            isPush = false
            tip = '请填写姓名'
        }else if(IdCard == ''){
            isPush = false
            tip = '请填写卡号'
        } else if(idLevel == 0){
            isPush = false
            tip = '请填写级别'
        }  else if(!pattern.test(mobile)){
            isPush = false
            tip = '请填写正确的手机号'
        } else if(ads == ''){
            isPush = false
            tip = '请填写你的地址'
        } else if( age == ''){
            isPush = false
            tip = '请填写年龄' 
        } else if( height == '' ){
            isPush = false
            tip = '请填写你的身高'
        } else if(sell_sn == ''){
            isPush = false
            tip = '请填写专卖号'
        } else if(card_forward_img == ''){
            isPush = false
            tip = '请上传身份证正面照'
        } else if(card_backward_img == ''){
            isPush = false
            tip = '请上传身份证背面照'
        } else if(certificate_img == '' && hasPaperIdx === 0 ){
            isPush = false
            tip = '请上传学历证书内页'
        } else if(ephoto == ''){
            isPush = false
            tip = '请上传一寸彩色白底照片'
        }


        if(isPush){

            if(hasPaperIdx === 1){
                Taro.showModal({
                    title: '未上传学历证书',
                    content: "后期会有工作人员联系补充资料",
                    cancelText:'去上传',
                    confirmText: '提交',
                    success: res=> {
                        if(res.cancel){
                        }   
                        if(res.confirm){
                            that._onSubmit()
                        }
                    }
                })
            } else {
                that._onSubmit()
            }

        } else {
            Taro.showToast({
                title:tip,
                icon:'none',
                duration:1000,
            })
        }
        
       
    }



    // 删除尺寸相片
    _onDetele(){
        
        var that = this 

        that.setState({
            ephoto:''
        })
    }


    // 报名
    _onSubmit(){
        var that = this;
        const {squad_id,name,IdCard,idLevel,mobile,ads,age,height,sell_sn,card_forward_img,card_backward_img,certificate_img,sexIdx,eduBack,eduBackIdx,ephoto} = that.state;


        let identity_imgs = card_forward_img + ','+ card_backward_img
 

            api.post(inter.SquadCert + squad_id,{
                name:name,
                sn:IdCard,
                level:idLevel,
                mobile:mobile,
                address:ads,
                sex:sexIdx,
                edu:eduBack[eduBackIdx],
                age:age,
                height:height,
                sell_sn:sell_sn,
                identity_imgs:identity_imgs,
                edu_cert:certificate_img,
                ephoto:ephoto
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
                    let msg = res.data.message;
                    if(msg == 'SQUAD_ERROR'){
                        msg = '不在报名时间内'
                    } else if(msg == 'SQUAD_MAX_NUM'){
                        msg = '人数已满'
                    } else if(msg == 'USER_ERROR'){
                        msg = '已报名'
                    }
                    Taro.showToast({
                        title:msg,
                        icon:'filed', 
                        duration:1000,
                    })
                }
            })
    }


    render () {

        const {name,IdCard,idLevel,mobile,ads,rangeIcon,show_pannel,card_forward_img,card_backward_img,certificate_img,sexList,sexIdx,eduBack,eduBackIdx,hasPaper,hasPaperIdx,certImg,ephoto} = this.state

        let levelName = ''
        
        if(idLevel == 1){
            levelName = '直销员工'
        }else if(idLevel == 3){
            levelName = '服务中心员工'
        }else if(idLevel == 4){
            levelName = '服务中心负责人'
        } else if(idLevel == 5){
            levelName = '优惠顾客'
        } else if(idLevel == 6) {
            levelName = '初级经理'
        } else if(idLevel == 7){
            levelName = '中级经理'
        } else if(idLevel == 8){
            levelName = '客户总监'
        } else if(idLevel == 9){
            levelName = '高级客户经监'
        } else if(idLevel == 'gg'){
            levelName = '高级客户总监及以上'
        } 


        return (
            <View className='root'>
                <View className='apply_type'></View>
                <View className='form'>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <View style={{width:'180rpx'}}>
                            <Text className='be_333 fs_15 fw_label' style={{display:'block'}}>真实姓名</Text>
                        </View>
                        <Input className='input default_label tip_label'
                            placeholder='请填写姓名'
                            placeholderClass='p_color'
                            type='text'
                            value={name}
                            onInput={(e)=>this.setState({name:e.detail.value})}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <View style={{width:'180rpx'}}>
                            <Text className='be_333 fs_15 fw_label' style={{display:'block'}}>卡号</Text>
                        </View>
                        <Input className='input default_label tip_label'
                             placeholderClass='p_color'
                            type='number'
                            value={IdCard}
                            // disabled
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <View style={{width:'180rpx'}}>
                            <Text className='be_333 fs_15 fw_label' style={{display:'block'}}>级别</Text>
                        </View>
                        <Input className='input default_label tip_label'
                             placeholderClass='p_color'
                            type='text'
                            value={levelName}
                            disabled
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <View style={{width:'180rpx'}}>
                            <Text className='be_333 fs_15 fw_label' style={{display:'block'}}>联系电话</Text>
                        </View>
                        <Input className='input default_label tip_label'
                            type='number'
                            value={mobile}
                            // disabled
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <View style={{width:'180rpx'}}>
                            <Text className='be_333 fs_15 fw_label' style={{display:'block'}}>邮寄地址</Text>
                        </View>
                        
                        <View className="d_flex row ai_ct col_1 jc_fe  txtcons">
                            <View className='d_flex fd_r ai_ct'
                                onClick={()=>Taro.navigateTo({url:menu.address + '?nageType=1'})}
                            >
                                <View className='col_1 '>
                                    {
                                        ads === '' ? 
                                        <Text className='none_label default_label'>请添加地址</Text>
                                        :
                                        <Text className='sect_label default_label'>{ads}</Text>
                                    }
                                </View>
                                <Image className='arrow_icon' mode='aspectFit' src="https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/7db72a4f-eb0b-4ed5-84e2-aa6aad198a5e.png"   />
                            </View>
                        </View>
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb'>
                        <View style={{width:'180rpx'}}>
                            <Text className='be_333 fs_15 fw_label' style={{display:'block'}}>性别</Text>
                        </View>
                        <Input className='input default_label tip_label'
                            type='number'
                            placeholderClass='p_color'
                            value={sexList[sexIdx]}
                            disabled
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb'>
                        <View style={{width:'180rpx'}}>
                            <Text className='be_333 fs_15 fw_label' style={{display:'block'}}>学历</Text>
                        </View>
                        <View className='picker_wrap'>
                            <Picker
                                className='picker'
                                mode='selector'
                                range={eduBack}
                                onChange={e=>{
                                    this.setState({
                                        eduBackIdx:e.detail.value
                                    })
                                }}
                            >
                                <View className="d_flex row ai_ct col_1 jc_fe ">
                                    <Text className='sect_label default_label'>{eduBack[eduBackIdx]}</Text>
                                    <Image className='arrow_icon' mode='aspectFit' src={rangeIcon} />
                                </View>
                            </Picker>
                        </View>
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <View style={{width:'180rpx'}}>
                            <Text className='be_333 fs_15 fw_label' style={{display:'block'}}>年龄</Text>
                        </View>
                        <Input className='input default_label tip_label'
                            placeholder='请输入年龄'
                            placeholderClass='p_color'
                            type='number'
                            maxLength='2'
                            onInput={(e)=>this.setState({age:e.detail.value})}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <View style={{width:'180rpx'}}>
                            <Text className='be_333 fs_15 fw_label' style={{display:'block'}}>身高</Text>
                        </View>
                        <View className='d_flex fd_r ai_ct ' style={{paddingRight:'80rpx'}}>
                            <Input className='input default_label tip_label '
                                placeholder='请输入身高'
                                placeholderClass='p_color'
                                maxLength='3'
                                type='number'
                                onInput={(e)=>this.setState({height:e.detail.value})}
                                style={{paddingRight:'20rpx'}}
                            />
                            <Text className='default_label tip_label'>cm</Text>
                        </View>
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb' >
                        <View style={{width:'180rpx'}}>
                            <Text className='be_333 fs_15 fw_label' style={{display:'block'}}>专卖号</Text>
                        </View>
                        <Input className='input default_label tip_label'
                            placeholder='请输入专卖号'
                            placeholderClass='p_color'
                            type='number'
                            onInput={(e)=>this.setState({sell_sn:e.detail.value})}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb'>
                        <Text className='be_333 fs_15 fw_label se_label'>是否有学历证书</Text>
                        <View className='picker_wrap'>
                            <Picker
                                className='picker'
                                mode='selector'
                                range={hasPaper}
                                onChange={this._hasPaper}
                            >
                                <View className="d_flex row ai_ct col_1 jc_fe ">
                                    <Text className='sect_label default_label'>{hasPaper[hasPaperIdx]}</Text>
                                    <Image className='arrow_icon' mode='aspectFit' src={rangeIcon} />
                                </View>
                            </Picker>
                        </View>
                    </View>
                    <View className='form_item'>
                        <Text className='be_333 fs_15 fw_label se_label'>身份证照</Text>
                        <View className='photo_wrap'>
                            <View className='photo' onClick={this._onChooseImg.bind(this,0)}>
                                {card_forward_img?
                                <Image className='preview_img' mode='aspectFill' src={card_forward_img}/>
                                :
                                <Image mode='aspectFit' className='photo_img' src={certImg[0]}/>
                                }
                                <View className='photo_txt'>
                                    <Text>上传身份证正面</Text>
                                </View>
                                
                            </View>
                            <View className='photo' onClick={this._onChooseImg.bind(this,1)}>
                                {card_backward_img?
                                <Image className='preview_img' mode='aspectFill' src={card_backward_img}/>
                                :
                                <Image mode='aspectFit' className='photo_img' src={certImg[1]}/>
                                }
                                <View className='photo_txt'>
                                    <Text>上传身份证反面</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {
                        hasPaperIdx === 0 ?
                        <View className='form_item'>
                            <Text className='be_333 fs_15 fw_label se_label'>学历证书</Text>
                            <View className='photo_wrap'>
                                <View className='photo' onClick={this._onChooseImg.bind(this,2)}>
                                    {certificate_img?
                                    <Image className='preview_img' mode='aspectFill' src={certificate_img}/>
                                    :
                                    <Image mode='aspectFit' className='photo_img' src={certImg[2]}/>
                                    }
                                    <View className='photo_txt'>
                                        <Text>上传学历证书内页</Text>
                                    </View>
                                </View>
                                {
                                    certificate_img?null:
                                    <View className='photo_tips'>
                                        <Text>后期会有工作人员联系补充资料</Text>
                                    </View>
                                }
                            </View>
                        </View>
                        :
                    null}
                    <View className='from_item border_tp pt_15 pb_15'>
                        <Text className='be_333 fs_15 fw_label se_label'>彩色白底证件照片</Text>   
                        <View className='photo_wrap pt_15'>
                            {
                                ephoto.length > 0 ?
                                <View className='inch_pics'>
                                    <Image src={ephoto} className = 'inch_pic' />
                                    <Image src={asset.i_dete} className="commt_tip" onClick={this._onDetele} />
                                </View>
                                :
                                <View className='add_inch d_flex fd_c ai_ct jc_ct' onClick={this._onChooseImg.bind(this,3)}>
                                    <Image src={asset.uppic} className='inch_Icon' />
                                    <View className='inch_bt'>
                                        <Text className='smm_label white_label fw_label'>上传一寸照片</Text>
                                    </View>
                                </View>
                            }
                        </View>
                    </View>
                    
                </View>
                <View className='btn'>
                    <View className='btn_text' hoverClass='on_tap' onClick={this._typeSubmit}>
                        <Text>提交</Text>
                    </View>
                </View>
                <ModalPannel content='提交成功' visible={show_pannel} onClose={()=>{ this.setState({show_pannel:false}) }}></ModalPannel>
            </View>
        )
    }
}

export default CertificateSignUp as ComponentClass
