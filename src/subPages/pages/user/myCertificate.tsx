import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { View, Text ,Image,Textarea,Picker,Input} from '@tarojs/components'


import menu from '../../../config/menu'
import asset from '../../../config/asset'
import {formatTimeStampToTime,percent2percent25} from '../../../utils/common'


import { connect } from '@tarojs/redux'
import { usersType } from '../../../constants/usersType'

import { getUserCert} from '../../../actions/user'

import  '../../../config/theme.css';
import './myCertificate.less'

type PageStateProps = {
    user:usersType,
}

type PageDispatchProps = {
    getUserCert:(object)=>any
}

type PageOwnProps = {}

type PageState = {
    show:string,
    page:number,
    pages:number,
    total:number,
    certList:Array<{}>,
    loadding:boolean,
    imgs:string
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface myCertificate {
    props: IProps;
}

@connect(({ user }) => ({
    user:user
  }), (dispatch) => ({
    getUserCert(object){
        dispatch(getUserCert(object))
    }
}))


class myCertificate extends Component<PageDispatchProps & PageStateProps, PageState> {
    
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '我的证书',
        navigationBarBackgroundColor:'#fff',
        enablePullDownRefresh: true
    }

    constructor () {
        super(...arguments)
        this.state = {
            show:'',
            page:0,
            pages:0,
            total:0,
            certList:[],
            loadding:false,
            imgs:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/045f86a9-71b6-490f-aa64-c1f0ac1ed43e.png'
        }
    }

    componentWillReceiveProps (nextProps) {

        const {user} = nextProps
        const {userCert} = user
        const {certList} = this.state

        if(user !== this.props.user){
            if(userCert !== null){
                var fList:any= certList.concat(userCert.items)

                this.setState({
                    page:userCert.page + 1,
                    pages:userCert.pages,
                    total:userCert.total,
                    certList:fList,
                })
            }
            
        }
    }


    componentWillMount () { }

    componentDidMount () {
        var that = this 
        that.getUserCert();
    }

    componentWillUnmount () {}
    componentDidShow () {}
    componentDidHide () {}

    //我的证书
    getUserCert(){
        var that = this 
        const {page} = that.state
        that.props.getUserCert({
            page:page
        })
    }

    
    // 证书详情
    _certdesc(item){
        var that = this 
        const {imgs} = that.state
        Taro.navigateTo({
            url:menu.certificatedesc + '?certImg=' + imgs + '&content=' + percent2percent25(item.content)
        })
    }



    loaddata(){
        var that = this
        const {page} = that.state
        that.props.getUserCert({
            page:page
        })
    }

    onPullDownRefresh(){
        var self = this
        self.setState({
            page:0,
            certList:[]
        },()=>{
            self.loaddata();
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }

    onReachBottom(){
        var self = this;
        
        let {page,pages} = this.state

        if(page < pages){
            self.props.getUserCert({
                page:page+1,
            })
        } else {
            self.setState({
                loadding:true
            })
        }
    }

    render () {
        
        const { certList,imgs} = this.state

        return (
            <View className='root d_flex row'>

                {
                    certList.map((item:any,index)=>{
                        return(
                            <View className='item d_flex fd_c ai_ct' key={'item' + index}
                                onClick={ this._certdesc.bind(this,item)}
                            >
                                <Image className='img' src={imgs}/>
                                <Text className='name'>{item.content}</Text>
                                <Text className='time'>获得时间 {formatTimeStampToTime(item.getTime)}</Text>
                            </View>
                        )
                    })
                }

                {/* <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/045f86a9-71b6-490f-aa64-c1f0ac1ed43e.png'} /> */}
            </View>
        )
    }
}

export default myCertificate as ComponentClass