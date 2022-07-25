
import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { Progress,View, Text ,Image} from '@tarojs/components'

import { connect } from '@tarojs/redux'
import { usersType } from '../../../constants/usersType'

import { 
    getUserMedal,
} from '../../../actions/user'


import menu from '../../../config/menu'


import  '../../../config/theme.css';
import './myMedal.less'

type PageStateProps = {
    user:usersType,
}


type PageDispatchProps = {
    getUserMedal:()=>any,
}

type PageOwnProps = {}

type PageState = {
    userMedal:Array<{
        title:string,
        mark:string,
        child:Array<{}>,
        have:boolean,
        img:string,
        lv:string,
        content:string,
        allNum:number,
        nowNum:number,
        cond:number
    }>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface MyMedal {
    props:IProps
}

@connect(({user}) => ({
    user:user
}),(dispatch)=>({
    getUserMedal(){
        dispatch(getUserMedal())
    }
}))


class MyMedal extends Component<PageDispatchProps & PageStateProps, PageState> {
    
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTitleText: '我的勋章',
        enablePullDownRefresh: true,
    }

    constructor () {
        super(...arguments)
        this.state = {
            userMedal:[]
        }
        
    }

    componentWillReceiveProps (nextProps) {

        const { user } = nextProps
        const { userMedal } = user 

        if(user !== this.props.user){
            this.setState({
                userMedal:userMedal
            })
        }
    }

    componentWillMount () {}
    componentDidMount () {
        var that = this 
        that.props.getUserMedal()
    }
    componentWillUnmount () {}
    componentDidShow () {}
    componentDidHide () {}




    _onSwiper = (e)=>{

    }


    // 勋章详情
    _medalDesc(med){
        Taro.navigateTo({
            url:menu.myMedalDetail + '?med='+ JSON.stringify(med)
        })
    }


    onPullDownRefresh(){
        var that = this
        Taro.showNavigationBarLoading()
        
        that.setState({
            userMedal:[]
        },()=>{
            that.props.getUserMedal()
        })

        setTimeout(()=>{
            Taro.stopPullDownRefresh()
            Taro.hideNavigationBarLoading()
        },1000)

    }



    render () {
        
        const {userMedal} = this.state

        let nullData = 0

        if(userMedal.length % 3 === 2){
            nullData = 1
        }

        return (
            <View className='root'>
                <View className='item_wrap'> 
                    {
                        userMedal.map((med,index)=>{
                            let parent:any = (med.nowNum / med.allNum).toFixed(2)
                            return(
                                <View className='item' key={'med' + index}
                                    onClick={this._medalDesc.bind(this,med)}
                                >
                                    <Image className='medal_icon' mode='aspectFit' src={med.img} style={{filter:med.have ? '' : 'grayscale(1)'}}/>
                                    <Text className='medal_name'>{med.title}Lv.{med.lv}</Text>
                                    <Progress
                                        className='progress'
                                        percent={med.nowNum === 0 ? 0 : parent * 100 }
                                        strokeWidth={4}
                                        active
                                        backgroundColor='#ECECEC'
                                        activeColor='#F4623F'
                                        borderRadius={5}
                                    />
                                </View>
                            )
                        })
                    }
                    {
                        nullData === 1 ?
                        <View className='item'></View>
                    :null}
                </View>
            </View>
        )
    }
}

export default MyMedal as ComponentClass
