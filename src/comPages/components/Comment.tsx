import Taro, { Component } from '@tarojs/taro'
import { View,Image,Text} from '@tarojs/components'


import asset1  from '../../config/asset'
import asset from '../config/asset'

import '../../config/theme.css'
import './Comment.less'
import { emojis, emojiToPath, textToEmoji} from '../../utils/emoji';

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
    comIdx:number,
}

export default class Comment extends Component<Props, State> {


    constructor () {
        super(...arguments)

        let val = this.props.val;
        let comIdx = this.props.comIdx

        this.state = {
            val: val,
            comIdx:comIdx
        }
        this.onParse = this.onParse.bind(this);

    }

    componentWillReceiveProps (nextProps) {
        const {val,comIdx} = nextProps;
        this.setState({
            val: val,
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

    render () {
        const {val,comIdx} = this.props;
        return (
            <View className={'item_box  pt_15 pb_15 '}>
                <View className='d_flex fd_r'>
                    <Image src={val.avatar} className='avatar' />
                    <View className='d_flex fd_c col_1 ml_10'>
                        <View className='d_flex  fd_r  ai_ct jc_sb'>
                            <Text className='default_label c33_label'>{val.username}</Text>
                            <View className='d_flex fd_r ai_ct' onClick={this.onParse.bind(this,val,comIdx)}>
                                <Image src={val.like ? asset1.onpraise : asset1.praise} className='icon_cover mr_5' />
                                <Text className='sm_label tip_label ml_5' style={val.like ? {color:"red"}:{}}>{val.praise}</Text>
                            </View>
                        </View>
                        <Text className='sm_label tip_label'>{val.pubTimeFt}</Text>
                        <Text className='lh18_label default_label c33_label mt_10'>{val.content}</Text>
                    </View>
                </View>
                
                {
                        val.childList.length > 0 ?
                        <View className='replyBox'>
                            {
                                val.childList.map((iitem:any,index)=>{
                                    let replyList:any [] = textToEmoji(iitem.content) 
                                    return(
                                        <View className='reply d_flex p_12 mt_2' key={'ittem'+index}>
                                            <Text className='brown_label default_label mt_2'>管理员回复：</Text>
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
        )
    }
}

