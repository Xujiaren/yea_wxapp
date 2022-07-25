import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View,Text,Textarea,Image} from '@tarojs/components'

import Star from '../../../components/Star'

import  '../../../config/theme.css';
import './writeCommt.less'
import asset from '../../../config/asset';

import { emojis, emojiToPath, textToEmoji} from '../../../utils/emoji';

import inter from '../../../config/inter'
import api from '../../../services/api'

type PageState = {
    tip:boolean,
    score:number,
    content:string,
    imgs:Array<string>,
    course_id:number,
    picArray:Array<string>,
    picStr:string,
    whiteTip:number,
    type:number,
    ctype:number,
    emojiList:Array<{}>,
    emojiType:boolean,
    isStar:number,
}

class WriteCommt extends Component<{}, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '写评论'
    }

    constructor () {
        super(...arguments)
        this.state = {
            tip:true,
            score: 5,
            course_id:0,
            content:'',
            imgs:[],
            picArray:[],
            picStr:'',
            whiteTip:0,
            type:0,
            ctype:0,
            emojiList:[],
            emojiType:false,
            isStar:0 
        }
        this._onStar = this._onStar.bind(this);
    }

    componentWillMount () { 
        const that = this 
        const { course_id ,whitetip,type,ctype,isStar} = that.$router.params

        if(parseInt(whitetip) == 1){
            that.setState({
                whiteTip:parseInt(whitetip)
            })
        }

        that.setState({
            course_id:parseInt(course_id),
            type:parseInt(type),
            ctype:parseInt(ctype),
            isStar:parseInt(isStar)
        })
    }

    componentDidMount () { 
        var that = this ;
        // 获取表情包
        const emojiList = Object.keys(emojis).map(key => ({
            key: key,
            img: emojiToPath(key)
        }))

        that.setState({
            emojiList:emojiList,
        })
    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }


   

    
    //不在提示
    _onClose(){
        var that = this
        Taro.setStorageSync('whiteTip',1)
        that.setState({
            tip:false
        })

    }

    //  关闭提示
    _onDelete(){
        var that = this
        Taro.setStorageSync('whiteTip',0)
        that.setState({
            tip:false
        })

    }

    _onStar(score){
		this.setState({
			score: score
        })
	}
    

    _onChangeImg = () => {
        var that = this;
        const {picArray} = that.state
        //  选择图片 转 base64
        Taro.chooseImage({
            count:4,
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
                                        picArray:picArray
                                    })
                                }
                            })
                        },
                        fail: msg => {
                            // console.log(msg)
                        }
                    })
                }

            },
            fail:function(errmsg){
                console.log(errmsg)
            }
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

    _onSubmit = () => {

        var that = this;
        const {score,content,course_id,picArray,type,ctype} = that.state;
        var picStr = picArray.join(",")
        let isPush:boolean = true


        if(content.length > 5){
        } else {
            isPush = false
            Taro.showToast({
                title: '评论字数需5个字符以上',
                icon: 'none',
                duration: 2000
            })
        }

        
        if(isPush){
            if(ctype==48||ctype==54){
                if(type ===  0 ){
                    api.post(inter.pubComment+course_id,{
                        score:5,
                        teacher_score:5,
                        content:content,
                        gallery:picStr,
                        ctype:ctype
                    }).then(res=>{
                        if(res.data.status){
                            Taro.showToast({
                                title: '提交成功，请耐心等待审核',
                                icon: 'none',
                                duration: 2000
                            })
                            that.setState({
                                content:'',
                                picArray:[],
                                score:0
                            })
            
                            setTimeout(()=>Taro.navigateBack(),2000)
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
                        }
                    })
                } else if(type === 1){
                    api.post(inter.pubComment+course_id,{
                        ctype:ctype,
                        content:content,
                        score:score,
                        gallery:picStr
                    }).then(res=>{
                        if(res.data.status){
                            Taro.showToast({
                                title: '提交成功，请耐心等待审核',
                                icon: 'none',
                                duration: 2000
                            })
                            that.setState({
                                content:'',
                                picArray:[],
                                score:0
                            })
            
                            setTimeout(()=>Taro.navigateBack(),2000)
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
                        }
                    })
                }
            }else{
                if(type ===  0 ){
                    api.post(inter.PublishComment+course_id,{
                        score:5,
                        teacher_score:5,
                        content:content,
                        gallery:picStr,
                        ctype:ctype
                    }).then(res=>{
                        if(res.data.status){
                            Taro.showToast({
                                title: '提交成功，请耐心等待审核',
                                icon: 'none',
                                duration: 2000
                            })
                            that.setState({
                                content:'',
                                picArray:[],
                                score:0
                            })
            
                            setTimeout(()=>Taro.navigateBack(),2000)
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
                        }
                    })
                } else if(type === 1){
                    api.post(inter.pubComment+course_id,{
                        ctype:ctype,
                        content:content,
                        score:score,
                        gallery:picStr
                    }).then(res=>{
                        if(res.data.status){
                            Taro.showToast({
                                title: '提交成功，请耐心等待审核',
                                icon: 'none',
                                duration: 2000
                            })
                            that.setState({
                                content:'',
                                picArray:[],
                                score:0
                            })
            
                            setTimeout(()=>Taro.navigateBack(),2000)
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
                        }
                    })
                }
            } 
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

    _clickEmoji(item,index){
        var that = this;
        const {content} = that.state;
        that.setState({
            content:content + item.key,
        })
    }


    // 切换选择表情
    _emojiType(){
        var that = this
        const {emojiType} = that.state
        that.setState({
            emojiType:!emojiType
        })
    }

    
    render () {
        const {content,picArray,whiteTip,tip,emojiList,emojiType} = this.state
        let canvaswidth:number = 320
        var res = Taro.getSystemInfoSync()
        canvaswidth = res.windowWidth;


        return (
            <View className='commtwrap'> 
                <View className='wrap pt_10'>
                    
                    {/* <View> */}
                    {
                        whiteTip == 0 && tip ?
                        <View className='textbox'>
                            <Text className='sm_label black_label'>{content.length == 0 ? '分享一下对课程的意见（选填）' : content}</Text>
                        </View>
                        :
                        <Textarea  
                            style={{width:(canvaswidth-80)+'px'}}
                            className='writecons' maxlength={-1} 
                            placeholder='评论字数需5个字符以上，并且筛选审核后对所有人显示。' 
                            placeholderStyle='fize-size:28rpx'
                            value={content}
                            onInput={(event)=>this.setState({content:event.detail.value})}
                        />
                    }

                    <View className=' d_flex fd_r ai_ct pt_15 pb_10' onClick={this._emojiType}>
                        <Image src={asset.smeil_icon} className = 'smeil_icon'  />
                        <Text className='default_label tip_label ml_5'>表情</Text>
                    </View> 
                    {
                        emojiType ?
                        <View className=' emojiBox'>
                            {
                                emojiList.map((item:any,index)=>{
                                    return(
                                        <View className='emoji_wrap' key={'item'+index}>
                                            <Image src={item.img} className='emojiBox_cover'   onClick={this._clickEmoji.bind(this,item,index)} />
                                        </View>
                                        
                                    )
                                })
                            }
                        </View>
                    :null}
                    
                
                    <View className='commtbox  d_flex  fd_r pt_15 pb_15 bg_white mt_1 mb_10'>
                        <View className='from_img'>
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
                                picArray.length > 3 ?
                                null
                                :
                                <View  className='commt_imgs d_flex ai_ct jc_ct,mb_10' onClick={this._onChangeImg}>
                                    <Image src={asset.add} className='commt_img_covers' />
                                </View>
                            }
                        </View>
                        
                    </View>
                </View>

                
                <View onClick={this._onSubmit} className='submit d_flex fd_r ai_ct jc_ct p_10' >
                    <Text className='lg_label white_label'>提交</Text>
                </View>
                


                {/* {
                    emojiType ?
                    <View className='emoji_layer'>
                        
                            <View className='layers bg_fa d_flex fd_r jc_ct'>
                                <View className=' emojiBox'>
                                    {
                                        emojiList.map((item:any,index)=>{
                                            return(
                                                <View className='emoji_wrap' key={'item'+index}>
                                                    <Image src={item.img} className='emojiBox_cover'   onClick={this._clickEmoji.bind(this,item,index)} />
                                                </View>
                                                
                                            )
                                        })
                                    }
                                </View>
                            </View>
                            
                        
                    </View>
                :null} */}
 
                <View>
                    {
                        whiteTip == 0 ?
                        <View>
                            {
                                tip ?
                                <View className='layer'>
                                    <View className='commt_layer pt_12  '>
                                        <View className='d_flex fd_c mb_15 pl_20 pr_20'>
                                            <View className='d_flex ai_ct jc_ct'>
                                                <Text className='lg18_label pt_10 black_label'>留言规则</Text>
                                            </View>
                                            <Text className='default_label pt_15 c33_label red_label'>用户留言不得发布以下内容：</Text>
                                            <Text className='default_label pt_5 c33_label'>1、捏造、散播和宣传危害国家统一、公共安全、社会秩序等言论；</Text>
                                            <Text className='default_label pt_5 c33_label'>2、恶意辱骂、中伤、诽谤他人及企业；</Text>
                                            <Text className='default_label pt_5 c33_label'>3、涉及色情、污秽、低俗的的信息及言论；</Text>
                                            <Text className='default_label pt_5 c33_label'>4、广告信息；</Text>
                                            <Text className='default_label pt_5 c33_label'>5、《直销管理条例》、《禁止传销条例》、《反不正当竞争法》等法律法规禁止的内容；</Text>
                                            <Text className='default_label pt_5 c33_label'>6、政治性话题及言论；</Text>
                                            <Text className='default_label pt_5 c33_label'>7、对任何企业、组织现行规章制度的评论和讨论，及传播任何未经官方核实的信息； 如违反以上规定，平台有权实施账户冻结、注销等处理，情节严重的，将保留进一步法律追责的权利。</Text>
                                        </View>
                                        <View className='layer_btns pl_20 pr_20 d_flex jc_sb ai_ct mt_30' >
                                            <View className='layer_btn d_flex jc_ct ai_ct' onClick={this._onClose.bind(this)}>
                                                <Text className='lg_label c33_label'>不再提示</Text>
                                            </View>
                                            <View className='layer_btn d_flex d_flex jc_ct ai_ct' onClick={this._onDelete.bind(this)}>
                                                <Text className='lg_label c33_label'>关闭</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                
                            :null}
                        </View> 
                    :null}
                </View>
                
                
            </View>
        )
    }
}


export default WriteCommt as ComponentClass