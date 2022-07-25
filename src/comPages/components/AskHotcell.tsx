import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'


import asset from '../../config/asset'
import { learnNum, isHistory, subNumTxt } from '../../utils/common'

import '../../config/theme.css'
import './AskHotcell.less'

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
    },
    idx: number,
    onClick: (any) => any,
}

type State = {

}



export default class AskHotcell extends Component<Props, State> {


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
        const { ask, idx, onClick } = this.props

        return (
            <View>
                <View className='item d_flex fd_r   pb_20 ' onClick={() => onClick && onClick(ask)}>
                    <View className='tip'>
                        <Text className={idx > 3 ? 'tip_label lg_label' : 'sred_label lg_label'}>{idx}</Text>
                    </View>
                    <View className='d_flex fd_c jc_sb col_1 pl_5'>
                        <View className='item_text'>
                            <Text className='lg_label c33_label fw_label '>{ask.title}</Text>
                        </View>
                        {
                            ask.integral > 0 ?
                                <View className='item_tips'>
                                    <Image src={asset.gold_icon} className='gold_icon' />
                                    <Text className='smm_label'>{ask.integral}学分</Text>
                                </View>
                                : null
                        }
                        <Text className='tip_label sm_label'>{ask.replyNum}{' '}热度</Text>
                    </View>
                    {
                        ask.gallery.length > 0 ?
                            <View className='img_box'>
                                <Image src={ask.gallery[0].fpath} className='img_cover' />
                            </View>
                            : null}

                </View>
            </View>

        )
    }
}
