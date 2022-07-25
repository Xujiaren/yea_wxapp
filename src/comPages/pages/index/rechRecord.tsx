import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image, Canvas} from '@tarojs/components'

type PageState = {
    list:Array<{}>,
    page:number,
    pages:number,
}

import {getExactTime} from '../../../utils/common'
import asset from '../../../config/asset'


import  '../../../config/theme.css';
import './rechRecord.less';


import api from '../../../services/api'
import inter from '../../../config/inter'



class rechRecord extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationStyle: 'custom',
    }
    timer: any;
    page: number
    pages: number

    constructor () {
        super(...arguments)

        this.page = 0;
        this.pages = 0;

        
        this.state = {
            list:[],
            page:0,
            pages:0,
        }
    }

    componentWillMount () {
    }

    componentDidMount () { 
        var that = this;
        that._getRecord();
    }

    componentWillUnmount () {

    }
    
    componentDidShow () { }
    componentDidHide () { }


    _getRecord(){
        var that = this ;
        const  {list} = that.state;

        api.get(inter.userOrderRecharge,{
            page:this.page
        }).then((res)=>{

            if(res.data.status){

                let rdList = res.data.data
                
                if(this.page === 0){

                    var tList = rdList.items
                } else {
                    var tList:any= list.concat(rdList.items)
                }
                that.setState({
                    list:tList,
                    page:rdList.page ,
                    pages:rdList.pages,
                })
                
            }

        })
    }

    // 下拉
    onPullDownRefresh(){
        var self = this

        this.page = 0 ;

        self.setState({
            page:0,
            list:[]
        },()=>{

            self._getRecord();
            
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }

    //上拉
    onReachBottom(){
        var self = this;
        
        const {page,pages} = self.state
        
        if(page < pages){
            this.page = this.page + 1
            
            self._getRecord();
        }
    }


    render () {

        const {list} = this.state
        return (
            <View className='wrap'>
                <View className='head'>
                    <View className='size_34' onClick={()=>{Taro.navigateBack({delta:1})}}>
                        <Image src={asset.lg_icon} className='size_34'/>
                    </View>
                    <View className='tit'>充值记录</View>
                    <View className='size_34'></View>
                </View>
                <View className='mt'>
                {
                    list.map((item:any,index)=>{

                        const on = list.length - 1  ===  index ;

                        let val = '余额支付' ;

                        if(item.payment === 1){
                            val = '支付宝支付' ;
                        } else if(item.payment === 2 || item.payment === 9){
                            val = '微信支付' ;
                        } else if(item.payment === 3){
                            val = '金币支付' ;
                        } else if(item.payment === 4){
                            val = '苹果支付' ;
                        }

                        let tip = item.remark.split(',')[1];

                        console.log(tip,'tip')

                        return(
                            <View key={'item' + index} className={on ?  'item pt_15 pb_15 ' : 'item pt_15 pb_15 border_bt'} >
                                <View className='d_flex fd_r jc_sb ai_ct  pl_25 pr_25'>
                                    <Text className='black_label default_label lab'>{val} {tip}</Text>
                                    <Text className='sred_label lab'>+ {tip.split('：')[1]}</Text>
                                </View>
                                <Text className='sm_label tip_label pl_25 pr_25'>{getExactTime(item.payTime)}</Text>
                            </View>
                        )
                    })
                }
                </View>
            </View>
        )
    }

}

export default rechRecord as ComponentClass