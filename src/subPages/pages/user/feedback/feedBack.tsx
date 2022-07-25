import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image,Textarea,Picker,Input,Video,CoverView} from '@tarojs/components'


import asset from '../../../../config/asset'
import Tabs from '../../../../components/Tabs'


import { connect } from '@tarojs/redux'
import { usersType } from '../../../../constants/usersType'
import { getUserFeedback,getCateFeedback} from '../../../../actions/user'

import inter from '../../../../config/inter'
import api from '../../../../services/api'

import {showLoading,hideLoading} from '../../../../utils/show'

import  '../../../../config/theme.css';
import './feedback.less'
import { uniqueId } from 'lodash'


type PageStateProps = {
    user:usersType,
    getUserFeedback:Array<{}>,
    getConfig:{},
    getCateFeedback:Array<{}>
}
type PageState = {
    question:string,
    content:string,
    imgs:Array<string>,
    mobile:string,
    status:number,
    page:number,
    pages:number,
    total:number,
    fdList:Array<{}>,
    loadding:boolean,
    selectstatus:number,
    category_id:number,
    picArray:Array<{}>,
    picStr:String,
    f_submit:boolean,
    cateFeedback:Array<{
        categoryId: number,
        categoryName: string,
        ctype: number,
        isDelete: number,
        sortOrder: number,
        status: number
    }>,
    uploadType:Array<{}>,
    uploadTypeidx:number,
    videoUrl:string ,
    videoType:boolean,
    P_m38u:string ,
    passBtn:boolean,
    num:number,
}
type PageDispatchProps = {
    getUserFeedback:(object)=>any,
    getConfig:()=>any,
    getCateFeedback:()=>any
}

type PageOwnProps = {}


type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface FeedBack {
    props: IProps;
}

@connect(({user}) => ({
    user:user,
}),(dispatch) => ({
    getUserFeedback(object){
        dispatch(getUserFeedback(object))
    },
    getCateFeedback(){
        dispatch(getCateFeedback())
    }
}))




class FeedBack extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '帮助反馈',
        enablePullDownRefresh: true
    }

    constructor () {
        super(...arguments)
        this.state = {
            page:1,
            pages:1,
            total:0,
            fdList:[],
            loadding:false,
            question:'',
            content:'',
            imgs:[],
            mobile:'',
            status:0,
            selectstatus:0,
            category_id:1,
            picArray:[],
            picStr:'',
            f_submit:false,
            cateFeedback:[],
            uploadType:['图片','视频'],
            uploadTypeidx:0, // 0  图片  1 视频 
            videoUrl:'',
            videoType:false,
            P_m38u:'',
            passBtn:true,
            num:0,
        }
        this.onViewImgs = this.onViewImgs.bind(this);
        this.onViewImg = this.onViewImg.bind(this);
    }

    componentWillMount () {
        const {status} = this.$router.params

        if(parseInt(status) === 1 ){
            this.setState({
                status:1
            })
        }
        
    }
    componentDidMount(){
        this.getCateFeedback()
        this.loaddata()
        
    }
    componentDidShow () {
        this.getCateFeedback()
        this.loaddata()
    }

    componentWillReceiveProps (nextProps) {
        const {user} = nextProps
        const {userFeedback,cateFeedback} = user
        const {fdList} = this.state

        if(user!==this.props.user){

            var fList:any= []
            if(userFeedback.page==0){
                fList=userFeedback.items
            }else{
                fList=fdList.concat(userFeedback.items)
            }
            let cateFeed_id:number = cateFeedback[0].categoryId

            this.setState({
                page:userFeedback.page + 1,
                pages:userFeedback.pages,
                total:userFeedback.total,
                fdList:fList,
                cateFeedback:cateFeedback,
                category_id:cateFeed_id,
            })
        }

        
    }

    componentWillUnmount () {
        
     }
    componentDidHide () { }
    getCateFeedback(){
        this.props.getCateFeedback()
    }

    // tab页切换
    _onSelect = (index) => {
        var that = this


        if(index === 0){
            that.setState({
                passBtn:true,
            })
        }

        this.setState({
            status:index,
            fdList:[],
            page:1
        },()=>{
            if(index == 1){
                this.loaddata()
            }
        })
    }


    loaddata(){
        var self = this
        const {page} = self.state
        self.props.getUserFeedback({
            page:page
        })
    }

    onPullDownRefresh(){
        var self = this
        self.setState({
            page:1,
            fdList:[]
        },()=>{
            self.loaddata();
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }

    onReachBottom(){
        var self = this;
        
        const {page,pages} = this.state

        if(page < pages){
            self.props.getUserFeedback({
                page:page+1
            })
        } else {
            this.setState({
                loadding:true
            })
        }
    }

    //选择照片或者拍照
    _onChangeImg = () => {
        var that = this;
        const {picArray,num} = that.state

        Taro.chooseImage({
            count:5-num,
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
                                    picArray.push(res.data.data)
                                    that.setState({
                                        picArray:picArray,
                                        num:picArray.length,
                                    })
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

     // 选择什么原因 picker
     onChange = e => {

        var that = this 
        const {cateFeedback} = that.state

        let cateId:number =  cateFeedback[e.detail.value].categoryId

        this.setState({
            selectstatus:e.detail.value,
            category_id:cateId
        })
    }

    // 选择方式
    onUploadChange =  e => {
        var that = this 
        that.setState({
            uploadTypeidx:parseInt(e.detail.value)
        })

        console.log(e.detail.value)
    }


    _onDetele(index){
        var that = this
        const {picArray} = that.state
        picArray.splice(index,1)

        that.setState({
            picArray:picArray
        })
    }

    _onSubmit(){
        // selectstatus
        var that = this;
        let {category_id,mobile,content,picArray,uploadTypeidx,videoUrl} = that.state;
        let {f_submit} = that.state
        var picStr = picArray.join(",")

        var pattern = /0?(13|14|15|17|18)[0-9]{9}/; // 手机号

        content = content.toString().trim()
        mobile = mobile.toString().trim()

        if( !content ){
            Taro.showModal({
                title: '提示',
                complete:()=>{f_submit = false},
                showCancel: false,
                content: '请填写反馈内容',
                confirmColor: '#000'
            })
            return
        }
        if( !content ){
            Taro.showModal({
                title: '提示',
                complete:()=>{f_submit = false},
                showCancel: false,
                content: '请填写反馈内容',
                confirmColor: '#000'
            })
            return
        }
        if (content.length < 10){
            Taro.showModal({
                title: '提示',
                complete:()=>{f_submit = false},
                showCancel: false,
                content: '反馈内容须大于10个字符',
                confirmColor: '#000'
            })
            return
        }
        if( !mobile ){
            Taro.showModal({
                title: '提示',
                complete:()=>{f_submit = false},
                showCancel: false,
                content: '请填写手机号',
                confirmColor: '#000'
            })
            return
        }
        if( !pattern.test(mobile) ){
            Taro.showModal({
                title: '提示',
                complete:()=>{f_submit = false},
                showCancel: false,
                content: '请输入正确的手机号',
                confirmColor: '#000'
            })
            return
        }
        that.setState({
            passBtn:false,
        })
        showLoading('提交中...')
        api.post(inter.PublishFeedback,{
            category_id:category_id,
            mobile:mobile,
            content:content,
            gallery:uploadTypeidx === 1 ? videoUrl : picStr
        }).then(res=>{
            if(res.data.status){
                hideLoading();
                that.setState({
                    content:'',
                    picArray:[],
                    mobile:'',
                    status:1,
                    fdList:[]
                },()=>{
                    this.props.getUserFeedback({
                        page:0
                    })
                })
                Taro.showToast({
                    title: '反馈成功',
                    icon: 'success',
                    duration: 2000
                })

                
            } else {
                if(res.data.message == 'WORD_ERROR'){
                    Taro.showModal({
                        title: '评论提示',
                        content: '尊敬的用户，\n 系统检测您触发违禁词，\n 请注意言辞、文明上网',
                        showCancel:false
                    }).then(res => console.log(res.confirm, res.cancel))
                } else if(res.data.message == 'ACCOUNT_DENY') {
                    Taro.showModal({
                        title: '评论提示',
                        content: '尊敬的用户， \n 系统检测您触发违禁词的 \n 次数已超限，即将关闭您的评论权限，\n 15天后恢复，祝您学习愉快！',
                        showCancel:false
                    }).then(res => console.log(res.confirm, res.cancel))
                }
                that.setState({
                    passBtn:true,
                })
            }
        })
        
        
    }

    onViewImg(galleryList,index){

        let urls:string[] = new Array() ;
        for(let i = 0 ; i < galleryList.length; i++){
            urls.push(galleryList[i].fpath)
        }

        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: urls[index], // 当前显示图片的http链接，默认是第一个
        }).then(res=>{
            // console.log(res)
        })
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
                                        videoUrl: showUrl
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

    // 删除视频
    _onVideoDetele(){
        var that = this

        that.setState({
            videoUrl:''
        })
    }

   // 点击传播数据 弹窗有新的视频数据播放
   _coverplay(voteUrl){

        var that = this 

        const videoContext = Taro.createVideoContext('video')
        videoContext.stop();

        that.setState({
            P_m38u:voteUrl,
            videoType:true
        })
    }

    _onClose(){
        var that = this;
        const videoContext = Taro.createVideoContext('P_video')
        videoContext.stop()
        that.setState({
            videoType:false
        })
    }

    render () {
        let canvaswidth = 320
        var res = Taro.getSystemInfoSync()
        canvaswidth = res.windowWidth;
        const {status,fdList,picArray,cateFeedback,selectstatus,category_id,uploadType,videoUrl,uploadTypeidx,videoType,P_m38u,passBtn} = this.state    
        

        let selector:string[] = new Array()
        for(let i = 0 ; i < cateFeedback.length ; i++){
            selector.push(cateFeedback[i].categoryName)
        }


        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }  catch (e) {
            
        }

        return (
            <View className='feedwrap'>
                <View className='headbox'>
                    <View className='atabs pl_30 pr_30 bg_white'>
                        <Tabs items={['填写问题', '我的反馈']}  selected={status} onSelect={this._onSelect} />
                    </View>
                </View>
                <View className='h40'></View>
                {
                    status == 0 ?
                    <View>
                        <View className='from pt_15   bg_white mt_10'>
                            <View className='from_item d_flex ai_ct jc_sb pb_15 pl_30 pr_20'>
                                <Text className='c33_label lg15_label fw_label'>问题类型<Text className='default_label tip_label'>(必选)</Text></Text>
                                <View className='d_flex fd_r  ai_ct'>
                                    <Picker  
                                      mode='selector' 
                                      range={selector} onChange={this.onChange}>
                                        <Text className='default_label tip_label '>{cateFeedback[selectstatus].categoryName}</Text>
                                    </Picker>
                                    <Image src={asset.arrow_right}  className='icon_right mt_2 ml_5' />
                                </View>
                            </View>
                            <View className='from_item d_flex fd_c  pt_15 pb_15 pl_30 pr_20'>
                                <Text className='c33_label lg15_label fw_label'>问题描述<Text className='default_label tip_label'>(必填)</Text></Text>
                                <Textarea 
                                  placeholder='请详细描述你的问题' 
                                  style={{width:(canvaswidth-80)+'px'}}
                                  className='from_atext p_15 mt_15 default_label' 
                                  value={this.state.content}
                                  onInput={(e:any) : void =>this.setState({content:e.detail.value})}
                                />
                            </View>
                            <View className='from_item d_flex ai_ct jc_sb pb_15 pl_30 pr_20'>
                                <Text className='c33_label lg15_label fw_label'>上传方式</Text>
                                <View className='d_flex fd_r  ai_ct'>
                                    <Picker  
                                        mode='selector' 
                                        range={uploadType} onChange={this.onUploadChange}>
                                        <Text className='default_label tip_label '>{uploadType[uploadTypeidx]}</Text>
                                    </Picker>
                                    <Image src={asset.arrow_right}  className='icon_right mt_2 ml_5' />
                                </View>
                            </View>
                            {
                                uploadTypeidx === 1 ? 
                                <View className='from_item fd_r  pb_15 bg_white  mb_10 pl_30 pr_20'>
                                    <View className='from_imgs'>
                                        {
                                            videoUrl.length > 0 ?
                                            <View  className='commt_imgs d_flex ai_ct jc_ct mb_10 mt_15' >
                                                <Video  
                                                    src={videoUrl} 
                                                    className='commt_video'
                                                    id='video'
                                                /> 
                                                <View onClick={this._onVideoDetele.bind(this)}>
                                                    <Image src={asset.i_dete} className="commt_tip" />
                                                </View>
                                            </View>
                                            :
                                            <View  className='commt_imgs d_flex ai_ct jc_ct mb_10 mt_15'  onClick={this._onChangeVideo}>
                                                <Image src={asset.up_video} className='commt_img_covers' />
                                            </View>
                                        }
                                    </View>                                    
                                </View>
                                :
                                <View className='from_item fd_r  pb_15 bg_white  mb_10 pl_30 pr_20'>
                                    <View className='from_img'>
                                        {
                                            picArray.map((fditem:any,index)=>{
                                                return(
                                                    <View  className='commt_img d_flex ai_ct jc_ct mr_15 mb_10'  key={'index'+index} >
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
                                            <View  className='commt_imgs d_flex ai_ct jc_ct,mb_10' 
                                                onClick={this._onChangeImg}
                                            >
                                                <Image src={asset.add} className='commt_img_covers' />
                                            </View>
                                        }
                                    </View>
                                </View>
                            }
                            
                            <View className='from_item d_flex ai_ct jc_sb pb_15 pt_15 border_bt border_tp pl_30 pr_30' style={{clear:"both"}}>
                                <View style={{width:200+'rpx'}}>
                                    <Text className='c33_label lg15_label fw_label'>联系方式</Text>
                                </View>
                                <Input className='input default_label tip_label' 
                                  placeholder='请填写手机号' 
                                  type='number'
                                  value={this.state.mobile}
                                  onInput={(e):void=>this.setState({mobile:e.detail.value})} 
                                />
                            </View>
                            <View className='pt_15 pb_15 pl_30'>
                                <Text className='sm_label gray_label'>联系我们：邮箱 help@perfect99.com</Text>
                            </View>
                        </View>
                        {
                            passBtn ? 
                            <View className='m_20 btn pt_10 pb_10' onClick={this._onSubmit}>
                                <Text className='white_label'>提交</Text>
                            </View>
                            :
                            <View className='m_20 btn pt_10 pb_10'>
                                <Text className='white_label'>提交</Text>
                            </View>
                        }
                        
                    </View>
                    :

                    <View className='mt_10 myfeed'>
                        {
                            fdList.map((item:any,index)=>{
                                let title:string = ''
                                for(let i = 0 ; i < cateFeedback.length; i++){
                                    if(cateFeedback[i].categoryId == item.categoryId){
                                        title = cateFeedback[i].categoryName
                                    }
                                }
                                return(
                                    <View className='feed_item d_flex fd_c mb_1' key={'item'+index}>
                                        <Text className='lg_label c33_label fw_label'>{index+1}.{title}</Text>
                                        <Text className='sm_label tip_label mt_5 '>{item.pubTimeFt}</Text>
                                        <Text className='gray_label default_label mt_10'>{item.content}</Text>
                                        {
                                           item.galleryList.length > 0 ?
                                           <View className='d_flex fd_r mt_10 mb_10 picbox'>
                                            {
                                                item.galleryList.map((iitem,i)=>{
                                                    return(
                                                        <View>
                                                            {
                                                                iitem.fpath.indexOf('.mp4')  >= 0 || iitem.fpath.indexOf('.m3u8')  >= 0 ?
                                                                <Video  
                                                                    src={iitem.fpath} 
                                                                    className='pic_video'
                                                                    id='video'
                                                                >
                                                                    <CoverView className="coverPlay"  onClick={this._coverplay.bind(this,iitem.fpath)}></CoverView>
                                                                </Video> :
                                                                <Image src={iitem.fpath}  key={'iitem'+i} className='feed_cover mr_10' onClick={this.onViewImg.bind(this,item.galleryList,i)} />
                                                            }
                                                        </View>
                                                        
                                                    )
                                                })
                                            }
                                            </View>
                                        :null}
                                        
                                        {
                                            item.reply ?
                                            <View className='bg_brown'>
                                                <Text className='brown_label default_label'>回复：{item.reply}</Text>
                                            </View>
                                        :null}
                                    </View> 
                                )
                            })
                        }
                        {
                            this.state.loadding == true ?
                                <View className='loaddata d_flex ai_ct jc_ct bg_white pt_10 pb_10'>
                                    <Text className='sm_label tip_label'>没有更多数据了</Text>
                                </View>
                            :null}
                    </View>
                }
                

                {
                    videoType ?
                    <View className='layer'>
                        <View className='d_flex ai_ct jc_ct layer_box'>
                            <View className='closeBtn' onClick={this._onClose}>
                                <Image src={asset.video_close} className='layer_icon' />
                            </View>
                            {
                                P_m38u.length > 0 ?
                                <Video 
                                    src={P_m38u} 
                                    className='cover_layer'
                                    style={{width:windowWidth + 'px'}}
                                    autoplay
                                    id='P_video'
                                    initialTime={0.02}
                                />          
                            :null}
                            
                        </View>
                    </View>
                :null}
            </View>
        )
    }
}

export default FeedBack as ComponentClass