import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text,WebView } from '@tarojs/components'


type PageState = {
    link:string
}

class courseLink extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '问卷'
    }

    constructor () {
        super(...arguments)
        this.state = {
            link:'',
        }
    }

    componentWillMount () {
        var that = this;
        const {link,title} = that.$router.params;

        Taro.setNavigationBarTitle({
            title: title
        })

        that.setState({
            link:link
        })
    }

    componentDidMount () { 

    }

    componentWillUnmount () {
    }
    
    componentDidShow () { }
    componentDidHide () { }


    render () {
        const {link} = this.state;

        return (
            <View >
                <WebView src={link}></WebView>
            </View>
        )
    }
}

export default courseLink as ComponentClass