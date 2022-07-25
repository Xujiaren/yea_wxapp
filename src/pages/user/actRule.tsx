import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import { connect } from '@tarojs/redux'
import { usersType } from '../../constants/usersType'
import { getActivityFlop} from '../../actions/user'

type PageStateProps = {
    user:usersType,
    getActivityFlop:Array<{}>
}


type PageDispatchProps = {
    getUserIntegral:(object)=>any
    getActivityFlop:() => any
}

type PageOwnProps = {}

type  PageState = {
    activity:{
        activityId: 0,
        atype: 0,
        title: '',
        rule: '',
        content: '',
        integral: 0,
        beginTime: 0,
        endTime: 0,
        hit: 0,
        pubTime: ''
    }
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface ActRule {
    props: IProps;
}

@connect(({ user }) => ({
    user:user
  }), (dispatch) => ({
    getActivityFlop () {
        dispatch(getActivityFlop())
    },
}))



class ActRule extends Component<PageDispatchProps & PageStateProps, PageState> {
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTitleText: '翻牌规则'
    }

    constructor () {
        super(...arguments)
        this.state = {
            activity:{
                activityId: 0,
                atype: 0,
                title: '',
                rule: '',
                content: '',
                integral: 0,
                beginTime: 0,
                endTime: 0,
                hit: 0,
                pubTime: ''
            }
        }
    }
    componentWillReceiveProps (nextProps) {
        var that = this
        const {user} = nextProps
        const {activityFlop} = user;
        if(user !== this.props.user){
            that.setState({
                activity:activityFlop.activity
            })
        }
    }
    componentWillMount () { }
    componentDidMount () { 
        this.getActRule()
    }

    getActRule(){
        this.props.getActivityFlop()
    }

    componentWillUnmount () { }
    componentDidShow () { }
    componentDidHide () { }
    
    render () {

        const {activity} = this.state

        return (
            <View  style={{paddingLeft:50+'rpx',paddingRight:50+ 'rpx' ,paddingTop:50+'rpx'}}>
                <Text style={{color:'#000000',fontSize:28+'rpx'}}>{activity.rule}</Text>
            </View>
        )
    }
}

export default ActRule as ComponentClass