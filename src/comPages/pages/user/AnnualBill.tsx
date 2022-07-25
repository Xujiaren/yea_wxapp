import { ComponentClass } from 'react'
import Taro, { Component ,Config, navigateBack} from '@tarojs/taro'
import { View ,WebView} from '@tarojs/components'


type PageStateProps = {

}


type PageDispatchProps = {
}

type PageOwnProps = {}

type  PageState = {
    nickname:string,
    avatar:string,
    link:string,
    status:number,
    title:string,
   
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface AnnualBill {
    props: IProps;
    
}


class AnnualBill extends Component<PageDispatchProps & PageStateProps, PageState> {
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTitleText: this.state.title
        
    }

    constructor () {
        super(...arguments)
        this.state = {
            nickname:'',
            avatar:'',
            link:'',
            status:1,
            title:'年度账单'
            
        }
        
        
    }
    
    componentWillReceiveProps (nextProps) {

        
    }
    componentWillMount () { 
        var that = this
        const {nickname,avatar} = that.$router.params
        that.setState({
            nickname:nickname,
            avatar:avatar,
        })
    }
    getSnapshotBeforeUpdate(prevProps, prevState){
        console.log(prevProps)
        console.log(prevState)
    }
    componentDidMount () { 
    }
    componentWillUnmount () {
       
     }
    componentDidShow () { 
        var that = this
        const {link,status} = that.$router.params
        that.setState({
            link:link,
            status:parseInt(status),
        })
        if(parseInt(status)==2){
            this.setState({
                title:'问卷'
            })
        }
    }
    componentDidHide () { }


    onmessage(event){
        console.log("On Message", event.nativeEvent.data )
    }
    loadSuccess(){
        console.log('加载成功')
    }
    loadFail(){
        console.log('加载失败')
    }
    
    render () {

        const {avatar,nickname,link,status} = this.state ;


        const token = Taro.getStorageSync('token')

        // let link = 'http://127.0.0.1:8000?v=6&avatar='+ avatar +  '&nickname=' + nickname +'&token=' + token ;

        let c_link = 'https://perfect.whalew.com/event/bill/index.html?v=4&avatar=' + avatar +  '&nickname=' + nickname +'&token=' + token ;

        return (
            <View className='body' style={{paddingLeft:50+'rpx',paddingRight:50+ 'rpx' ,paddingTop:50+'rpx'}}>
                <WebView src={status==2?link:status==1?c_link:null}  onMessage={this.onmessage} onLoad={this.loadSuccess} onError={this.loadFail}></WebView>
            </View>
        )
    }
}

export default AnnualBill as ComponentClass