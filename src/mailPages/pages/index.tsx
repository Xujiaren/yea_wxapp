import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image} from '@tarojs/components'

// import Mail from './mail/mail'
// import Cate from './cate/cate'
// import Cart from './cart/cart'
// import Order from './order/order'


import '../../config/theme.css'
import './index.less'

type PageState = {
    tabbar_bottom:Array<{
        text:string
    }>,
    tabbarIndex:number
}

class index extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: ''
    }

    constructor () {
        super(...arguments)
        this.state = {
            tabbarIndex:0,
            tabbar_bottom:[{
                text:'首页'
            },{
                text:'分类'
            },{
                text:'购物车'
            },{
                text:'订单'
            }]
        }
    }

    componentWillMount () {
                
    }

    componentDidMount () {
        
    }

    componentWillUnmount () {

    }
    
    componentDidShow () { 
        var that = this ;
        that._switchTitle();
    }
    componentDidHide () { }

 
    _switchTitle(){
        var that = this ;
        const {tabbarIndex} = that.state;

        let title = '商城'

        if(tabbarIndex === 0){
            title = '商城'
        } else if(tabbarIndex === 1){
            title = '分类'
        } else if(tabbarIndex === 2){
            title = '购物车'
        } else if(tabbarIndex === 3){
            title = '订单'
        }

        Taro.setNavigationBarTitle({
            title: title
        })
    }

    _onSwtch(idx){
        var that = this

        console.log(idx)
        that.setState({
            tabbarIndex:idx
        },()=>{
            that._switchTitle();
        })
    }
    
    render () {
        const {tabbar_bottom,tabbarIndex} = this.state

        return (
            <View  className='wrap'>

                {/* {
                    tabbarIndex === 0 ?
                        <Mail />        
                :null}
               {
                    tabbarIndex === 1 ?
                        <Cate />        
                :null}
                {
                    tabbarIndex === 2 ?
                        <Cart />        
                :null}
                {
                    tabbarIndex === 3 ?
                        <Order />        
                :null} */}

                <View className='tabbar'>
                    {
                        tabbar_bottom.map((item,idx)=>{
                            const on = tabbarIndex === idx
                            return( 
                                <View key={'item'+idx} className='tabItem' 
                                    onClick={this._onSwtch.bind(this,idx)}
                                >
                                    <Image src={''} className= {on ? 'tabItem_cover bg_red' : 'tabItem_cover '} />
                                    <Text className={on ? 'red_label sm_label' : 'gray_label sm_label'}>{item.text}</Text>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    }
}

export default index as ComponentClass