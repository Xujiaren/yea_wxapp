import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { View, Text ,WebView} from '@tarojs/components'

type PageStateProps = {

}


type PageDispatchProps = {
}

type PageOwnProps = {}

type  PageState = {
    unioinId:string,
    nickname:string,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface kefu {
    props: IProps;
    
}





class kefu extends Component<PageDispatchProps & PageStateProps, PageState> {
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTitleText: '客服'
    }

    constructor () {
        super(...arguments)
        this.state = {
            unioinId:'',
            nickname:'',
        }
    }
    componentWillReceiveProps (nextProps) {

    }
    componentWillMount () { 
        var that = this
        const {unioinId,nickname} = that.$router.params

        that.setState({
            unioinId:unioinId,
            nickname:nickname,
        })
    }
    componentDidMount () { 
       
    }



    componentWillUnmount () { }
    componentDidShow () { }
    componentDidHide () { }
    
    render () {

        const {unioinId,nickname} = this.state ;

        return (
            <View  style={{paddingLeft:50+'rpx',paddingRight:50+ 'rpx' ,paddingTop:50+'rpx'}}>
                <WebView src={'https://ucccsr.perfect99.com/customer/index.html?origin=WX&unionId='+ unioinId +'&wxNickName='+nickname}></WebView>
            </View>
        )
    }
}

export default kefu as ComponentClass