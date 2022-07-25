import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { View, Text } from '@tarojs/components'


import inter from '../../../config/inter';
import api from '../../../services/api';

import  '../../../config/theme.css';

type PageStateProps = {

}


type PageDispatchProps = {
    getUserIntegral:(object)=>any
    getActivityFlop:() => any
}

type PageOwnProps = {}

type  PageState = {
    
    type:number,
    rule:string,
    rules:Array<any>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface WinRules {
    props: IProps;
}




class WinRules extends Component<PageDispatchProps & PageStateProps, PageState> {
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTitleText: '规则'
    }

    constructor () {
        super(...arguments)
        this.state = {
           
            type:0,
            rule:'',
            rules:[]
        }
    }
    componentWillReceiveProps (nextProps) {
       
    }

    componentWillMount () { 

        var that = this;
        const {type} = that.$router.params;

        that.setState({
            type:parseInt(type)
        })
    }

    componentDidMount () { 
        this._rule();
        api.get(inter.Config)
        .then(res=>{
            if(res.data.status){
                let list = res.data.data.teacher_ranks_text.split(';')
                this.setState({
                    rules:list
                })
            }
        })
    }


    componentWillUnmount () { }
    componentDidShow () { }
    componentDidHide () { }

    _rule(){
        var that = this ;
        const {type} = that.state;

        api.get(inter.ActivityDesc + type,{
        }).then((res)=>{
            that.setState({
                rule:res.data.data.rule
            })
        })
    }
    
    render () {

        const {rule,rules} = this.state

        return (
            <View  style={{paddingLeft:50+'rpx',paddingRight:50+ 'rpx' ,paddingTop:50+'rpx'}}>
                <View className='d_flex fd_c'>
                    {
                        rules.map(item=>{
                            return(
                                <Text className='black_label default_label lh20_label'>{item}</Text>
                            )
                        })
                    }
                    
                </View>
            </View>
        )
    }
}

export default WinRules as ComponentClass