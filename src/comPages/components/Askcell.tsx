import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import GrapTmp from '../../pages/index/grapTmp'

import { formatTimeStampToTime, subNumTxt } from '../../utils/common'

import asset from '../../config/asset'
import asset1 from '../config/asset'

import '../../config/theme.css'
import './Askcell.less'

type Props = {
    ask: {
        askId: number,
        askReplyDTO: object,
        categoryId: number,
        collect: number,
        content: string,
        flag: string,
        gallery: Array<any>,
        hit: number,
        integral: number,
        isCollect: false
        isShare: number,
        isTop: number,
        pubIp: string,
        pubTime: number,
        replyId: number,
        replyNum: number,
        title: string,
        userId: number,
        avatar: string,
        comment: number,
        nickname: string,
    },
    type: number,
    onClick: (any) => any,
}

type State = {

}



export default class Askcell extends Component<Props, State> {


    constructor() {
        super(...arguments)
        this.state = {

        }


    }

    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }





    render() {
        const { ask, type, onClick } = this.props

        return (
            <View className='item d_flex fd_c   pb_20 ' onClick={() => onClick && onClick(ask)}>

                {
                    type === 0 && ask.integral > 0 ?
                        <View className='item_head'>
                            <View className='item_tips'>
                                <Image src={asset.gold_icon} className='gold_icon' />
                                <Text className='smm_label'>{ask.integral}学分</Text>
                            </View>
                            <Text className={'c33_label lg_label fw_label item_tit '} >{subNumTxt(ask.title, 36)}</Text>
                            {
                                ask.isTop === 1 ?
                                    <Text className='top_tips'>置顶</Text>
                                    : null}
                        </View>
                        :
                        <View className='item_head'>
                            <Text className={'c33_label lg_label fw_label '} >{subNumTxt(ask.title, 36)}</Text>
                            {
                                ask.isTop === 1 ?
                                    <Text className='top_tips_b'>置顶</Text>
                                    : null}
                        </View>
                }

                {
                    ask.gallery.length > 0 ?

                        <View className='d_flex fd_r'>
                            <View className='col_1 mr_5'>
                                {
                                    ask.isAdmin?
                                    <Text className='dup_txt'>{ask.title}</Text>
                                    :
                                    <Text className='dup_txt'>{ask.content}</Text>
                                }
                                
                            </View>
                            <Image src={ask.gallery[0].fpath} className='sum_img' />
                        </View>
                        :
                        <View>
                            {
                                    ask.isAdmin?
                                    <Text className='dup_txt'>{ask.title}</Text>
                                    :
                                    <Text className='dup_txt'>{ask.content}</Text>
                                }
                                
                        </View>
                }

                <View className='d_flex fd_r ai_ct mt_10'>
                    {
                        type === 0 ?
                            <View className='d_flex fd_r ai_ct'>
                                {
                                    ask.userId === 0 ?
                                        <Image src={asset1.logo} className='item_cover' />
                                        :
                                        <Image src={ask.avatar.length > 0 ? ask.avatar : asset1.header} className='item_cover' />
                                }
                                <Text className='sm_label c33_label mr_10'>{ask.userId === 0 ? '油葱官方' : ask.nickname}</Text>
                            </View>
                            : null}

                    <Text className='sm_label tip_label'>{`${ask.replyNum}个回答 · ${ask.comment}个评论`}</Text>
                    {
                        type === 1 ?
                            <Text className='tip_label sm_label ml_10'>{formatTimeStampToTime(ask.pubTime * 1000)}</Text>
                            : null}

                </View>
            </View>
        )
    }
}
