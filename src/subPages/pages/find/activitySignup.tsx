import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Input,Image,Textarea,Video} from '@tarojs/components'

import menu from '../../../config/menu';
import asset from '../../../config/asset'

import inter from '../../../config/inter'
import api from '../../../services/api'



import  '../../../config/theme.css';
import './activitySignup.less'


type PageState = {
    userId:number,
    activityId:number,

    user_name:string,
    mobile:string,
    work_name:string,
    work_intro:string,
    work_url:string,
    w_videoUrl:string,
    type:boolean,
    ctype:number,
    picArray:Array<string>,

    signendTime:number,
    beginTime:number,
}

class activitySignup extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '报名'
    }

    constructor () {
        super(...arguments)
        this.state = {
            userId:0,
            activityId:0,

            user_name:'',
            mobile:'',
            work_name:'',
            work_intro:'',
            work_url:'',
            w_videoUrl:'',
            ctype:16,   // 16 视频  17 图片
            type:false,
            picArray:[],
            signendTime:0,
            beginTime:0,
        }
    }

    componentWillMount () {
        var that = this;
        const {activityId,ctype,signendTime,beginTime} = that.$router.params
        console.log(signendTime,beginTime)
        that.setState({
            activityId:parseInt(activityId),
            ctype:parseInt(ctype),
            signendTime:signendTime === undefined ? 0 : parseInt(signendTime),
            beginTime:beginTime === undefined ? 0 : parseInt(beginTime),
        })

    }

    componentDidMount () { 
        var that = this;
        that.getUser();
    }

    componentWillUnmount () {

    }
    
    componentDidShow () { }
    componentDidHide () { }

    getUser(){
        var that = this
        api.get(inter.User)
        .then((res)=>{
            if(res.data.status){
                let userData = res.data.data
                that.setState({
                    userId:userData.userId,
                })
            }
        })
    }

    _onChangeImg(){
        var that = this;
        const {picArray} = that.state
        //  选择图片 转 base64
        Taro.chooseImage({
            count:5-picArray.length,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success:function(res){
                for(let i = 0 ; i < res.tempFilePaths.length ; i++){

                    Taro.getFileSystemManager().readFile({
                        filePath: res.tempFilePaths[i], // 选择图片返回的相对路径
                        encoding: 'base64', // 编码格式
                        success: res => { // 成功的回调
                            api.post(inter.UploadSite,{
                                file:'data:image/png;base64,' + res.data,
                            }).then(res=>{
                                if(res.data.status){
                                    if(res.data.status){
                                        picArray.push(res.data.data)
                                        that.setState({
                                            picArray:picArray
                                        })
                                    }
                                }
                            })                        
                        },
                        fail: msg => {
    
                        }
                    })

                }
            },
            fail:function(errmsg){

            }
        })
    }


    // 选择上传视频
    _onChangeVideo(){
        var that = this;
        Taro.chooseVideo({
            sourceType: ['album', 'camera'],  //视频来源相册和相机都可以
            maxDuration: 30,	//相机拍摄最大时长为30S
            camera: 'back', //默认摄像头是后置摄像头
            success(res) {
                let tempFilePaths = res.tempFilePath;  
                let fileArr = tempFilePaths.split(".");
                let fileName = fileArr[fileArr.length - 2]

                if(fileName.lastIndexOf('wxfile://') > -1){
                    fileName = fileName.split("//")[fileName.split("//").length - 1]
                }
                let n = tempFilePaths.lastIndexOf('.'); // 获取最后一个.在哪
                let type = tempFilePaths.substring(n);  // 得到视频是什么格式的
                

                api.get(inter.getSign)
                .then((res)=>{
                    Taro.showLoading({ title: '视频上传中' });
                    if(res.statusCode === 200){
                        let post = res.data

                        const aliyunFileKey = post.dir  + fileName  + type;
                        
                        Taro.uploadFile({
                            url: post.host, //上传到OSS
                            filePath: tempFilePaths,
                            name: 'file',
                            header: {'content-type': 'multipart/form-data'},
                            formData: {
                                'key': aliyunFileKey,
                                'OSSAccessKeyId': post.accessid,
                                'policy': post.policy,
                                'signature': post.signature,
                                'expire': post.expire,
                                'callback': post.callback,
                                'success_action_status': '200',
                            },
                            success: function (res) {
                                if (res.statusCode == 200) {
                                    Taro.hideLoading()
                                    Taro.showToast({
                                        title: '上传成功',
                                        icon: 'success',
                                        duration: 1200
                                    })                      
                                    let  showUrl = post.host + '/' + aliyunFileKey
                                    that.setState({
                                        w_videoUrl: showUrl
                                    });
                                } else {
                                    Taro.showToast({
                                    title: '上传失败！',
                                    icon: 'none',
                                    duration: 1200
                                    })
                                }
                            },
                            fail:function(res){
                                console.log(res)
                            }
                          })
                    }
                })
            },
            fail(res){
                Taro.showModal({
                  content: '视频格式不正确，请重新选择',
                  showCancel: false
                })
            }
        })
    }


    // 表单提交
    _onSubmit(){
        var that = this;
        const {activityId,user_name,mobile,work_name,work_intro,picArray,ctype,w_videoUrl,signendTime,beginTime} = that.state;

        var nowTime = new Date();
        let newtime = nowTime.getTime();

        var picStr = picArray.join(",");
        // var pattern = /0?(13|14|15|17|18)[0-9]{9}/; // 手机号
        // var pattern = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/; // 手机号
        // var pattern = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
        var pattern = /^1[3-9]\d{9}$/;
        let isPush:boolean = true;
        let tip:string = '' ;


        if(!(newtime < signendTime * 1000 && newtime > beginTime * 1000) ){
            isPush = false
            tip = '时间已截止'
        } else if(user_name == ''){
            isPush = false
            tip = '姓名不能为空'
        } else if(!pattern.test(mobile)){
            isPush = false
            tip = '请填写正确的手机号'
        } else if(work_name == ''){
            isPush = false
            tip = '请输入作品名称'
        } else if(work_intro == ''){
            isPush = false
            tip = '请输入作品描述'
        } else {
            if(ctype === 16){
                if(w_videoUrl.length === 0 || w_videoUrl === undefined){
                    isPush = false
                    tip = '请上传作品描述'
                }
            }
    
            if(ctype === 17){
                if(picStr == ''){
                    isPush = false
                    tip = '请上传作品描述'
                }
            }
        }

        if(isPush){
            api.post(inter.ActivityJoin + activityId,{
                user_name:user_name,
                mobile:mobile,
                work_name:work_name,
                work_intro:work_intro,
                work_url:ctype === 16 ? w_videoUrl : picStr ,
            }).then((res)=>{
                console.log(res)
                if(res.data.status){
                    Taro.showToast({
                        title:'报名成功',
                        icon:'success',
                        duration:1000,
                    })

                    setTimeout(function () {
                        //执行ajax请求后停止下拉
                        Taro.navigateBack()
                    }, 1000);                    
                } else {
                    if(res.data.message === 'has joined'){
                        Taro.showToast({
                            title:'已报名',
                            icon:'none',
                            duration:1000
                        })
                    }
                    if(res.data.message === 'save error'){
                        Taro.showToast({
                            title:'无法报名,请不要使用表情符号',
                            icon:'none',
                            duration:1000
                        })
                    }
                }
            })
        } else {
            Taro.showToast({
                title:tip,
                icon:'none',
                duration:1000,
            })
        }
        


    }

    onViewImgs(galleryList,index){
        let urls:string[] = new Array() ;
        for(let i = 0 ; i < galleryList.length; i++){
            urls.push(galleryList[i])
        }
        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: urls[index], // 当前显示图片的http链接，默认是第一个
        }).then(res=>{
            // console.log(res)
        })
    }

    _onDetele(index){
        var that = this
        let {picArray} = that.state
        picArray.splice(index,1)
        that.setState({
            picArray:picArray
        })
    }

    _onVideoDetele(){
        var that = this

        that.setState({
            w_videoUrl:''
        })
    }
    
    
    render () {
        let canvaswidth = 375
        var res = Taro.getSystemInfoSync()
        canvaswidth = res.windowWidth;


        const {user_name,mobile,work_name,work_intro,w_videoUrl,ctype,picArray} = this.state;


        return (
            <View className='root'>
                <View className='form'>
                    <View className='form_item d_flex ai_ct jc_sb border_bt' >
                        <Text className='be_333 fs_15 fw_label'>姓名</Text>
                        <Input className='input default_label tip_label col_1'
                            type='text'
                            value={user_name}
                            placeholder={'请填写姓名'}
                            placeholderClass='placestyle'
                            onInput={(e)=>this.setState({user_name:e.detail.value})}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb border_bt' >
                        <Text className='be_333 fs_15 fw_label'>联系方式</Text>
                        <Input className='input default_label tip_label col_1'
                            type='number'
                            value={mobile}
                            placeholder={'请填写手机号'}
                            placeholderClass='placestyle'
                            onInput={(e)=>this.setState({mobile:e.detail.value})}
                        />
                    </View>
                    <View className='form_item d_flex ai_ct jc_sb border_bt' >
                        <Text className='be_333 fs_15 fw_label'>作品名称</Text>
                        <Input className='input default_label tip_label col_1'
                            type='text'
                            value={work_name}
                            placeholder={'请填写'}
                            placeholderClass='placestyle'
                            onInput={(e)=>this.setState({work_name:e.detail.value})}
                        />
                    </View>
                    <View className='form_item d_flex fd_c  border_bt' >
                        <Text className='be_333 fs_15 fw_label'>作品描述</Text>
                        <Textarea 
                            placeholder='请填写' 
                            maxlength={-1}
                            autoHeight
                            style={{width:(canvaswidth-60)+'px',height:400+'rpx'}}
                            className='from_atext  mt_15 default_label' 
                            value={work_intro}
                            onInput={(e:any) : void =>this.setState({work_intro:e.detail.value})}
                        />
                    </View>
                    
                    <View className='commtbox  d_flex  fd_c pt_15 pb_15 bg_white mt_1  mb_10 '>
                        <Text className='be_333 fs_15 fw_label'>上传作品{ctype===16 ? '(视频)':'(图片)'}</Text>
                        {
                            ctype === 16 ?
                            <View className='from_imgs'>
                                {
                                    w_videoUrl.length > 0 ?
                                    <View  className='commt_imgs d_flex ai_ct jc_ct mb_10 mt_15' >
                                        <Video  
                                            src={w_videoUrl} 
                                            className='commt_video'
                                            id='video'
                                        /> 
                                        <View onClick={this._onVideoDetele.bind(this)}>
                                            <Image src={asset.i_dete} className="commt_tip" />
                                        </View>
                                    </View>
                                    :
                                    <View  className='commt_imgs d_flex ai_ct jc_ct mb_10 mt_15'  onClick={this._onChangeVideo}>
                                        <Image src={asset.uppic} className='commt_img_covers' />
                                    </View>
                                }
                            </View>
                            :
                            <View className='from_img mt_15'>
                                {
                                    picArray.map((fditem:any,index)=>{
                                        return(
                                            <View  className='commt_img d_flex ai_ct jc_ct mr_15 mb_10'  key={'index'+index}>
                                                <View onClick={this.onViewImgs.bind(this,picArray,index)}>
                                                    <Image src={fditem} className='commt_img_cover' />
                                                </View>
                                                <View onClick={this._onDetele.bind(this,index)}>
                                                    <Image src={asset.i_dete} className="commt_tip" />
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                                {
                                    picArray.length > 4 ?
                                    null
                                    :
                                    <View  className='commt_imgs d_flex ai_ct jc_ct,mb_10' onClick={this._onChangeImg}>
                                        <Image src={asset.add} className='commt_img_covers' />
                                    </View>
                                }
                            </View>
                        }
                    </View>
                    
                </View>
                <View className='makeBtn' onClick={this._onSubmit}>
                    <Text className='default_label white_label'>确定</Text>
                </View>
            </View>
        )
    }
}

export default activitySignup as ComponentClass