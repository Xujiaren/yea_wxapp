import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View ,Text,Image,Textarea} from '@tarojs/components'

import api from '../../../services/api'

import inter from '../../../config/inter'
import menu from '../../../config/menu'
import asset from '../../../config/asset';
import { emojis, emojiToPath, textToEmoji } from '../../../utils/emoji';

import  '../../../config/theme.css';
import './whiteQust.less'

type PageState = {
    content:string,
    askId:number,
    title:string,
    whiteTip:number,
    picArray:Array<string>,
    tip:boolean,
    emojiList: Array<{}>,
    emojiType: boolean,
}


class whiteQust extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '写回答',
        enablePullDownRefresh:true
    }
    page: number
    pages: number


    constructor (props) {
        super(props)

        this.page = 0;
        this.pages = 0;
        this.state = {
            content:'',
            askId:0,
            title:'',
            picArray:[],
            whiteTip:0,
            tip:true,
            emojiList:[],
            emojiType:false,
        }
    }

    componentWillMount () {   
        var that = this;
        const {askId,title,whitetip} = that.$router.params;

        if(parseInt(whitetip) == 1){
            that.setState({
                whiteTip:parseInt(whitetip)
            })
        }

        that.setState({
            askId:parseInt(askId),
            title:title
        })

        Taro.setNavigationBarTitle({
            title: title === undefined ? '写回答' : title,
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

    componentWillUnmount () {
        
    }
    componentDidHide () { }

    _onClose(){
        var that = this
        Taro.setStorageSync('whiteTips',1)
        that.setState({
            tip:false
        })

    }

    //  关闭提示
    _onDelete(){
        var that = this
        Taro.setStorageSync('whiteTips',0)
        that.setState({
            tip:false
        })

    }
    
    //  写回答
    _onPub = () => {

        var that = this ;
        const {content,askId,picArray} = that.state;

        api.post(inter.replyAsk + askId,{
            fuser_id:0,
            content:content,
            pics:picArray.join(','),
        }).then((res)=>{
            if(res.data.message == 'WORD_ERROR'){
                Taro.showModal({
                    title: '评论提示',
                    content: '尊敬的用户，\n 系统检测您触发违禁词，\n 请注意言辞、文明上网',
                    showCancel:false
                }).then(res => console.log(res.confirm, res.cancel))
                ;return;
            } else if(res.data.message == 'ACCOUNT_DENY') {
                Taro.showModal({
                    title: '评论提示',
                    content: '尊敬的用户， \n 系统检测您触发违禁词的 \n 次数已超限，即将关闭您的评论权限，\n 15天后恢复，祝您学习愉快！',
                    showCancel:false
                }).then(res => console.log(res.confirm, res.cancel))
                ;return;
            }
            if(res.data.status){

                Taro.showToast({
                    title:'提交成功，请耐心等待审核',
                    icon:'none',
                    duration:1000,
                })

                setTimeout(() => {
                    Taro.navigateBack()
                }, 1000);
                
            }
        })
    }


    onViewImgs = (picArray,index) => {
        
        let urls:string[] = new Array() ;
        for(let i = 0 ; i < picArray.length; i++){
            urls.push(picArray[i])
        }
        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: urls[index], // 当前显示图片的http链接，默认是第一个
        }).then(res=>{
            // console.log(res)
        })
    }

    _onDetele = (index) => {

        var that = this
        let {picArray} = that.state
        picArray.splice(index,1)

        that.setState({
            picArray,
        })
    }

     //选择照片或者拍照
    _onChangeImg = () => {
        var that = this;
        const {picArray} = that.state

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
                        }
                    })
                }
                
            },
            fail:function(errmsg){

            }
        })
    }
    _emojiType(){
        var that = this
        const {emojiType} = that.state
        that.setState({
            emojiType:!emojiType
        })
    }
    _clickEmoji(item,index){
        var that = this;
        const {content} = that.state;
        that.setState({
            content:content + item.key,
        })
    }
    render () {

        const {whiteTip,tip,content,title,picArray, emojiList, emojiType, } = this.state;

        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }  catch (e) {
            
        }

        return (
            <View className='wrap fade bg'>
                <View className='content'>
                    <Textarea 
                        placeholder='请填写回答内容' 
                        style={{width:(windowWidth-60)+'px'}}
                        className='from_atext p_15 m_15  default_label' 
                        value={content}
                        maxlength={-1}
                        onInput={(e:any) : void =>this.setState({content:e.detail.value})}
                    />
                    <View className=' d_flex fd_r ai_ct pt_15 pb_10 ml_15 mb_15' onClick={this._emojiType}>
                    <Image src={asset.smeil_icon} className='smeil_icon' />
                    <Text className='default_label tip_label ml_5'>表情</Text>
                </View>
                {
                    emojiType ?
                        <View className=' emojiBox'>
                            {
                                emojiList.map((item: any, index) => {
                                    return (
                                        <View className='emoji_wrap' key={'item' + index}>
                                            <Image src={item.img} className='emojiBox_cover' onClick={this._clickEmoji.bind(this, item, index)} />
                                        </View>

                                    )
                                })
                            }
                        </View>
                        : null}
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
                            picArray.length > 3 ?
                            null
                            :
                            <View  className='commt_imgs d_flex fd_c ai_ct jc_ct mb_10' 
                                onClick={this._onChangeImg}
                            >
                                <Image src={asset.uppic} className='commt_img_covers' />
                                <Text className='tip_label smm_label'>添加图片</Text>
                            </View>
                        }
                    </View>
                </View>
                <View className='btn' onClick={this._onPub}>
                    <Text className='white_label lg_label'>发布</Text>
                </View>
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

export default whiteQust as ComponentClass