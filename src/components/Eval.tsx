import Taro, { Component } from '@tarojs/taro'
import { View,Image,Text} from '@tarojs/components'


import './Eval.less'
import Coursescore from './Coursescore'
import asset from '../config/asset'

import '../config/theme.css'

import { emojis, emojiToPath, textToEmoji} from '../utils/emoji';

type Props = {
    val:{
        avatar:string,
        childList:Array<{}>,
        commentId:number,
        content:string,
        contentId:number,
        ctype:string,
        galleryList:Array<{}>,
        isAdmin:number,
        parentId:number,
        praise:number,
        pubIp:string,
        pubTime:number,
        pubTimeFt:string,
        score:number,
        userId:number,
        username:string ,
        like:boolean
    },
    comIdx:number,
    type:number,
    onParse:(val,comIdx) => void
}

type State = {
    val:{
        avatar:string,
        childList:Array<{}>,
        commentId:number,
        content:string,
        contentId:number,
        ctype:string,
        galleryList:Array<{}>,
        isAdmin:number,
        parentId:number,
        praise:number,
        pubIp:string,
        pubTime:number,
        pubTimeFt:string,
        score:number,
        userId:number,
        username:string ,
        like:boolean
    },
    type:number,
    comIdx:number,
}

export default class Eval extends Component<Props, State> {


    // static defaultProps = {
    //     val:{
    //         // like:false,
    //         galleryList:[],
    //         childList:[],
    //     }
    // }

    constructor () {
        super(...arguments)
        let val = this.props.val;
        let comIdx = this.props.comIdx
        let type = this.props.type

        this.state = {
            val: val,
            type:type,
            comIdx:comIdx
        }
        this.onParse = this.onParse.bind(this);

    }

    componentWillReceiveProps (nextProps) {
        const {val,comIdx,type} = nextProps;
        this.setState({
            val: val,
            type:type,
            comIdx:comIdx
        })
    }

    componentWillMount () { }

    componentDidMount () { }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }




    onParse(val,comIdx){        
        this.props.onParse && this.props.onParse(val,comIdx);
    }


    // 查看评论图片
    onViewImgs(galleryList,index){
        let urls:string[] = new Array() ;
        for(let i = 0 ; i < galleryList.length; i++){
            urls.push(galleryList[i].fpath)
        }
        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: urls[index], // 当前显示图片的http链接，默认是第一个
        }).then((res)=>{
            // console.log(res)
        })
    }


    render () {
        const {val,comIdx,type} = this.props;
        
        let chatSpekList:any [] = textToEmoji(val.content) 

        return (
            <View className='commtwrap pt_10 pb_10 border_bt d_flex fd_r'>
                <View>
                    <Image src={val.avatar} className='comm_cover' />
                </View>
                <View className='d_flex fd_c  pl_10 col_1'>
                    <View className='d_flex fd_r ai_ct jc_sb'>
                        <View className='d_flex fd_c '>
                            <Text className='default_label c33_label'>{val.username}</Text>
                            <View className='d_flex fd_r ai_ct '>
                                {
                                    type === 0 ?
                                    <Coursescore val={val.score} />
                                :null}
                                
                                <Text className={type === 0 ? 'sm_label tip_label ml_10' : 'sm_label tip_label'}>{val.pubTimeFt}</Text>
                            </View>
                        </View>
                        <View className='praisebox' onClick={this.onParse.bind(this,val,comIdx)}>
                            <Image src={val.like ? asset.onpraise : asset.praise} className='praise' />
                            <Text className='smm_label tip_label ml_5' style={val.like ? {color:"red"}:{}}>{val.praise}</Text>
                        </View>
                    </View>
                    <View className='bg_white chatdesc_txt mt_5' >
                        {
                            chatSpekList.map((emjio:any,index)=>{
                                return(
                                    <View key={'emjio'+ index} className='chatmsg_txt'>
                                        {
                                            emjio.msgType === 'text' ?
                                            <Text className='default_label c33_label'>{emjio.msgCont}</Text>  
                                        :
                                            <Image src={emjio.msgImage}  style={{width:40+'rpx',height:40+'rpx',verticalAlign:'middle'}}/>
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>
                    {
                        val.galleryList.length > 0 ?
                        <View className='d_flex fd_r mt_10 mb_10 comm_pics'>
                            {
                                val.galleryList.map((iitem:any,i)=>{
                                    return(
                                        <Image src={iitem.fpath}  key={'iitem'+i} className='comms_cover mr_10'
                                            onClick={this.onViewImgs.bind(this,val.galleryList,i)}
                                        />
                                    )
                                })
                            }
                        </View>
                    :null}   
                    {
                        val.childList.length > 0 ?
                        <View className='replyBox'>
                            {
                                val.childList.map((iitem:any,index)=>{
                                    let replyList:any [] = textToEmoji(iitem.content) 
                                    return(
                                        <View className='reply  p_12 mt_5' key={'ittem'+index}>
                                            <Text className='brown_label default_label'>管理员回复：</Text>
                                            {
                                                replyList.map((emjio:any,index)=>{
                                                    return(
                                                        <View key={'emjio'+ index} className='chatmsg_txt'>
                                                            {
                                                                emjio.msgType === 'text' ?
                                                                <Text className='default_label c33_label'>{emjio.msgCont}</Text>  
                                                            :
                                                                <Image src={emjio.msgImage}  style={{width:40+'rpx',height:40+'rpx',verticalAlign:'middle'}}/>
                                                            }
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    )
                                })
                            }
                        </View>
                    :null}             
                </View>
            
            
            </View>
        )
    }
}

