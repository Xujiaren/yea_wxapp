import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import  WxParse   from '../../../wxParse/wxParse'
import '../../../wxParse/wxParse.wxss'



type Props = {
    content:string,
}

type PageState = {

}

export default class GrapTmp extends Component<Props,PageState> {

    constructor () {
        super(...arguments)
        this.state = {

        }
    }
    componentWillReceiveProps(n_props){
        if(this.props.content !== n_props.content){
            if(n_props.content){
                WxParse.wxParse('article', 'html', n_props.content, this.$scope, 5)
            }
        }
    }
    componentDidMount () {
        if(typeof this.props.content !== 'undefined')
        WxParse.wxParse('article', 'html', this.props.content, this.$scope, 5)
    }

    shouldComponentUpdate(){
        return false
    }
    render () {
        return (
            <View>
                <View  className='wxParse'>
                         <import src='../../../wxParse/wxParse.wxml' />
                        <template is='wxParse' data='{{wxParseData:article.nodes}}' />
                </View>
            </View>
        )
    }

}