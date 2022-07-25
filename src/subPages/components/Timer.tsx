import Taro, { Component } from '@tarojs/taro'
import { View, Text} from '@tarojs/components'

import {countDown} from '../../utils/common'

export default class Timer extends Component {
    config = {
        navigationBarTitleText: ''
    }

    
    constructor () {
        super(...arguments)
        this.state = {
            duration:0
        }

        this._onCountDown = this._onCountDown.bind(this)
    }
    componentWillMount () {
        this.timer = setInterval(() => {
           
            this._onCountDown()
            
        }, 1000);
    }

    componentDidMount () { 
    }

    componentWillUnmount () {
        clearInterval(this.timer);
    }

    componentDidShow () { }

    componentDidHide () { }


    _onCountDown(){
        var that = this ;
        var {duration} = that.state

        duration++;

        that.setState({
            duration:duration
        })
    }

    render(){
        const {duration} = this.state
        return(
            <View>
                <Text>{countDown(duration)}</Text>
            </View>
        )
    }
}