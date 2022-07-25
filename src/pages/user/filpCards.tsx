
import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'


import { connect } from '@tarojs/redux'
import { usersType } from '../../constants/usersType'
import { getLotteryReward} from '../../actions/user'

import  '../../config/theme.css';
import './filpCards.less'

type PageStateProps = {
    user:usersType,
    getLotteryReward:{
        page:number,
        total:number,
        pages:number,
        items:Array<{
            rewardId:number,
            activityId:number,
            userId:number,
            nickname:string,
            realname:string,
            mobile:string,
            address:string,
            itemIndex:number,
            itemName:string,
            ctype:number,
            integral:number,
            pubTime:any,
            pubTimeFt:string
        }>
    }
}


type PageDispatchProps = {
    getLotteryReward:(object) => any
}

type PageOwnProps = {}

type  PageState = {
    loadding:boolean,
    page:number,
    pages:number,
    total:number,
    rewardList:Array<{}>,
    
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface FilpCards {
    props: IProps;
}

@connect(({ user }) => ({
    user:user
  }), (dispatch) => ({
    getLotteryReward(object){
        dispatch(getLotteryReward(object))
    }
}))

class FilpCards extends  Component<PageDispatchProps & PageStateProps, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '中奖记录',
        enablePullDownRefresh: true
    }

    constructor () {
        super(...arguments)
        this.state = {
            page:1,
            pages:1,
            total:0,
            loadding:false,
            rewardList:[],
        }
    }

    componentWillReceiveProps (nextProps) {
        const {user} = nextProps
        const {lotteryReward} = user
        const {rewardList} = this.state


        if(user !== this.props.user){
            var fList:any= rewardList.concat(lotteryReward.items)
            this.setState({
                page:lotteryReward.page ,
                pages:lotteryReward.pages,
                total:lotteryReward.total,
                rewardList:fList,
            })
        }
    }

    componentWillMount () {
        
    }
    componentDidMount () { 
        this.getLotteryReward()
    }
    componentWillUnmount () { }
    componentDidShow () { }
    componentDidHide () { }
    

    getLotteryReward(){
        this.props.getLotteryReward({
            page:0
        })
    }

    loaddata(){
        var that = this
        const {page} = that.state
        that.props.getLotteryReward({
            page:page
        })
    }

    onPullDownRefresh(){
        var self = this
        self.setState({
            page:0,
            rewardList:[]
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
            self.props.getLotteryReward({
                page:page+1,
            })
        } else {
            self.setState({
                loadding:true
            })
        }
    }


    render () {

        const {loadding,rewardList} =this.state


        return (
            <View className='filpwrap '>
                {
                    rewardList.map((reward:any,index)=>{
                        return(
                            <View className='d_flex fd_c mb_1 bg_white pl_20 pt_15 pb_15 mt_15' key={'item'+index}>
                                <Text className='default_label c33_label'>获得 {reward.itemName}</Text>
                                <Text className='sm_label tip_label mt_5'>{reward.pubTimeFt}</Text>
                            </View>
                        )
                    })
                }
                {
                    loadding == true ?
                    <View className='loaddata d_flex ai_ct jc_ct bg_white pt_10 pb_10'>
                        <Text className='sm_label tip_label'>没有更多数据了</Text>
                    </View>
                :null}
            </View>
        )
    }
}

export default FilpCards as ComponentClass