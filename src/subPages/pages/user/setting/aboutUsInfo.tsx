import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { View ,Text} from '@tarojs/components'


import GrapTmp from '../../../../components/grapTmp'

import { connect } from '@tarojs/redux'
import { usersType } from '../../../../constants/usersType'

import { 
    getAboutUs,
    getContact,
    getCopyright,
    getPolicy,
    getPrivacy,
} from '../../../../actions/user'


import  '../../../../config/theme.css';
import './aboutUsInfo.less'
import api from '../../../../services/api'


type PageStateProps = {
    user:usersType,
}

type PageDispatchProps = {
    getAboutUs:()=>any,
    getContact:()=>any,
    getCopyright:()=>any,
    getPolicy:()=>any,
    getPrivacy:()=>any,
}

type PageOwnProps = {}



type PageState = {
    title:string,
    content:string,
    idx:number,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface aboutUsInfo {
    props: IProps;
}


@connect(({ user }) => ({
    user:user
  }), (dispatch) => ({
    getAboutUs(){
        dispatch(getAboutUs())
    },
    getContact(){
        dispatch(getContact())
    },
    getCopyright(){
        dispatch(getCopyright())
    },
    getPolicy(){
        dispatch(getPolicy())
    },
    getPrivacy(){
        dispatch(getPrivacy())
    }
}))


class aboutUsInfo extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '',
        navigationBarBackgroundColor:'#FFF',
    }

    constructor () {
        super(...arguments)
        this.state = {
            title:'',
            content:'',
            idx:0,
        }
    }


    componentWillReceiveProps (nextProps) {
        var that = this ;
        const {idx} = that.state
        console.log(idx)
        const {user} = nextProps;
        if (user !== that.props.user) {

            const {aboutsUs,privacy,copyRight,contact,policy} = user

            if(idx === 0 ){
                that.setState({
                    content:aboutsUs
                })
            } else if(idx === 1){
                that.setState({
                    content:policy
                })
            } else if(idx === 2){
                that.setState({
                    content:privacy
                })
            } else if(idx === 3){
                that.setState({
                    content:copyRight
                })
            } else if(idx === 4){
                that.setState({
                    content:contact
                })
            }
            
        }
    }

    componentWillMount () {
        let { index ,title} = this.$router.params

        Taro.setNavigationBarTitle({
            title:title,
        })

        this.setState({
            title:title,
            idx:parseInt(index)
        })
    }

    componentDidMount () { 

        var that = this
        const {idx} = that.state

        if(idx === 0 ){
            that.props.getAboutUs()
        } else if(idx === 1){
            that.props.getPolicy()
        } else if(idx === 2){
            that.props.getPrivacy() //
        } else if(idx === 3){
            that.props.getCopyright() // 版权声明
        } else if(idx === 4){
            that.props.getContact() // 联系我们
        }else if(idx===11){
           this.getcotent()
        }
    
    }
    getcotent=()=>{
        api.get('/article/system/deal',{})
        .then(res=>{
            this.setState({
                content:res.data.data
            })
        })
    }
    componentWillUnmount () {
    }
    
    componentDidShow () { }
    componentDidHide () { }

    render () {

        const {content} = this.state

        return (
            <View className='root'>
                <GrapTmp content={content}></GrapTmp>
            </View>
        )
    }
}

export default aboutUsInfo as ComponentClass