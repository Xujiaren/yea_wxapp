import Taro, { Component } from '@tarojs/taro'
import { View,Image,Text} from '@tarojs/components'



import '../../config/theme.css'
import './Comt.less'

type Props = {

}

type State = {

}

export default class Comt extends Component<Props, State> {


    constructor () {
        super(...arguments)

        this.state = {

        }

    }

    componentWillMount () { }

    componentDidMount () { }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }


    render () {

        return (
            <View className='comt d_flex  fd_c  ai_ct jc_ct pt_15 pb_20'>
                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/289f1c16-c466-4ab0-8460-c0629a741688.png'} className='comt_null' />
                <Text className='mt_15 sm_label tip_label'>还没有评论，快来抢沙发~</Text>
            </View>
        )
    }
}


