import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image} from '@tarojs/components'

import  '../../../config/theme.css';
import './myGold.less'
import Tabs from '../../../components/Tabs'

import { connect } from '@tarojs/redux'
import { usersType } from '../../../constants/usersType'

import { getUserIntegral} from '../../../actions/user'
import inter from '../../../config/inter'
import api from '../../../services/api'

type PageStateProps = {
    user:usersType,
    getUserIntegral:{
        page:number,
        total:number,
        pages:number,
        items:Array<{
            contentId:number,
            contentName:string,
            ctype:number,
            etype:number,
            integral:number,
            integralId:number,
            itype:number,
            pubTime:number,
            pubTimeFt:string,
            userId:number,
            userIntegral:number
        }>
    },
}

type PageDispatchProps = {
    getUserIntegral:(object)=>any
}

type PageOwnProps = {}

type  PageState = {
    status:number,
    integral:number,
    page:number,
    pages:number,
    total:number,
    interList:Array<{}>,
    loadding:boolean,
    integralnum:number,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface MyGold {
    props: IProps;
}

@connect(({ user }) => ({
    user:user
  }), (dispatch) => ({
    getUserIntegral(object){
        dispatch(getUserIntegral(object))
    }
}))



class MyGold extends Component<PageDispatchProps & PageStateProps, PageState> {
  
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '我的学分',
        enablePullDownRefresh: true
    }

    constructor () {
        super(...arguments)
        this.state = {
            status:0,
            integral:0,
            page:1,
            pages:1,
            total:0,
            interList:[],
            loadding:false,
            integralnum:0
        }
    }

    componentWillReceiveProps (nextProps) {
        const {user} = nextProps
        const {userIntegral} = user
        const {interList} = this.state
        
        if (user !== this.props.user) {
            var fList:any= interList.concat(userIntegral.items)
            this.setState({
                page:userIntegral.page + 1,
                pages:userIntegral.pages,
                total:userIntegral.total,
                interList:fList,
            })
        }
       
    }

    componentWillMount () { 
        const that = this 
        const {integral} = that.$router.params
        
        this.setState({
            integral:parseInt(integral)
        })

        
    }

    componentDidMount () { 
        this.getUserIntegral()
        api.get(inter.User)
                .then(res=>{
                if(res.data.status){
                    let userData = res.data.data
                    this.setState({
                        integralnum:userData.integral,
                    })
                }
            })
    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    _onSelect = (index) =>{
        var that = this
        const {page} = that.state
        this.setState({
            page:0,
            status:index,
            interList:[]
        },()=>{
            this.props.getUserIntegral({
                itype:index,
                page:1
            })
        })
    }

    getUserIntegral(){
        this.props.getUserIntegral({
            itype:0,
            page:1
        })
    }

    loaddata(){
        var that = this
        const {status,page} = that.state
        that.props.getUserIntegral({
            itype:status,
            page:page
        })
    }


    onPullDownRefresh(){
        var self = this
        self.setState({
            page:0,
            interList:[]
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
        
        let {page,pages,status} = this.state

        if(page < pages){
            self.props.getUserIntegral({
                itype:status,
                page:page+1,
            })
        } else {
            self.setState({
                loadding:true
            })
        }
    }

    render () {
        const {status,integral,interList,loadding,integralnum} = this.state

        return (
            <View className='goldwrap '>
                <View className='headwrap'>
                    <View style={{paddingLeft:32+'rpx',paddingRight:32+ 'rpx'}}>
                        <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/bg_gold.png'} className='bg_gold '>
                            <View className='headbox d_flex ai_ct pl_20'>
                                <Text className='lg40_label white_label'>{integralnum}</Text>
                                <Text className='white_label sm_label ml_5 mt_15'>学分</Text>
                            </View>
                        </Image>
                        <View className='atabs pl_20 pr_20'>
                            <Tabs items={['获得明细', '支出明细']}  atype={0} selected={status} onSelect={this._onSelect} />
                        </View>
                    </View>
                </View>
                <View className='h160'></View>
                <View style={{paddingLeft:32+'rpx',paddingRight:32+ 'rpx'}}>
                    {
                        interList.length > 0 ?
                        interList.map((item:any,index)=>{
                            return(
                                <View className=' pt_15 pb_15 d_flex fd_r ai_ct jc_sb' key={'gold' + index}>
                                    <View className='d_flex fd_c ml_5'>
                                        <Text className='default_label'>{item.contentName} </Text>
                                        <Text className='sm_label tip_label mt_5'>{item.pubTimeFt}</Text>
                                    </View>
                                    <Text className='default_label' style={{color:'#FFA71F'}}>{item.itype == 0 ? '+' : '-'}{item.integral}</Text>
                                </View>
                            )
                        })
                    :null}
                    {
                        loadding == true ?
                            <View className='loaddata d_flex ai_ct jc_ct bg_white pt_10 pb_10'>
                                <Text className='sm_label tip_label'>没有更多数据了</Text>
                            </View>
                        :null}
                </View>
            </View>
        )
    }
}

export default MyGold as ComponentClass
