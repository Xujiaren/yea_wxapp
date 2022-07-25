/**
 * @Wang
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image, Button} from '@tarojs/components'

import './modalPannel.less'

type Props = {
    title:string,
    content:string,
    visible:boolean,
    onClose:() => void,
    gotoApp:boolean
}
type PageState = {
    flag:boolean
}
export default class ModalPannel extends Component<Props, PageState>  {

    constructor () {
        super(...arguments)
        this.state = {
            flag:false
        }
        
    }

    componentWillReceiveProps () {}
    componentWillMount () {
        const sys_info = Taro.getLaunchOptionsSync()
        if(sys_info.scene ==1069||sys_info.scene ==1036 ){
            this.setState({ flag:true })
        }
    }
    componentDidMount () {}
    componentWillUnmount () {}
    componentDidShow () {}
    componentDidHide () {}

    render () {
        
        const modal_img = "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/box-live.png"
        const {gotoApp,title,content,onClose,visible} = this.props
        const {flag} = this.state

        return (
            <View className='root'>
                <View className={visible ? 'show_modal modal':'modal'}>
                    <View className='pannel'>
                        <Image className='modal_img' mode='widthFix' src={modal_img}/>
                        <View className='pannel_cons'>
                            <Text className='modal_txt'>{title}</Text>
                            <Text className='modal_sum'>{content}</Text>
                            {
                                gotoApp&&flag?
                                <View onClick={onClose} className='modal_btn' hoverClass='hover'>
                                    <Button className='confirm_btn' openType='launchApp' appParameter='perfectapp' onError={(e)=>{
                                        Taro.navigateBack();
                                    }}></Button>
                                    <Text className='modal_btn_txt'>确定</Text>
                                </View>
                                :
                                <View onClick={onClose} className='modal_btn' hoverClass='hover'>
                                    <Text className='modal_btn_txt'>确定</Text>
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

