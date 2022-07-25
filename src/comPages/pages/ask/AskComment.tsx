import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View ,Text,Textarea} from '@tarojs/components'

import Eval from '../../components/comment'

import inter from '../../../config/inter'
import api from '../../../services/api'


import  '../../../config/theme.css';
import './AskComment.less'


type PageState = { 
    content:string,
    isShow:boolean,
    askId:number,
    comts:Array<any>,
    ctype:number,
    page: number,
    pages: number,
}


class AskComment extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '全部评论',
        enablePullDownRefresh:true
    }

    page: number
    pages: number
    constructor (props) {
        super(props)

        this.page = 0;
        this.pages = 0;

        this.state = {
            content:'',
            isShow:false,
            askId:0,
            comts:[],
            ctype:0,
            page: 0,
            pages: 0,
        }

    }

    componentWillMount () {   
        var that = this;

        const {askId,ctype} = that.$router.params;

        that.setState({
            askId:parseInt(askId),
            ctype:ctype === undefined ? 10 : parseInt(ctype)
        })
    }

    componentDidMount () { 
        let that = this ;
        that._getComt();
    }

    componentWillUnmount () {
        
    }

    componentDidHide () { }


    //  下啦刷新
    onPullDownRefresh(){
        var that = this;

        Taro.showNavigationBarLoading();

        that.setState({
            comts:[]
        },()=>{
            that._getComt();
        })

        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }

    _getComt(){
        let that = this ;
        const {askId,ctype,comts,page} = that.state ;

        api.get(inter.askPinluns + askId,{
            page:page,
            ctype:ctype
        }).then((res)=>{
            console.log(res)
            if(res.data.status){
                let arr = res.data.data;
                if (page === 0) {
                    this.page = arr.page
                    this.pages = arr.pages
                    var tList = arr.items
                } else {
                    var tList: any = comts.concat(arr.items)
                }
                that.setState({
                    comts:tList,
                    page:arr.page,
                    pages:arr.pages
                })
            }
        })
    }
    onReachBottom() {

        const { page, pages} = this.state

        if (page < pages) {
            this.page = this.page + 1;
            this.setState({
                page:this.page + 1
            },()=>{
                this._getComt()  
            })
            
        }
    }

    _parse = (val,comIdx) => {

        let that = this ;
        const {comts} = that.state

        if(val.like){
            api.post(inter.RemoveLike+val.commentId).then((res)=>{
                if(res.data.status){
                    comts[comIdx].like = !comts[comIdx].like 
                    comts[comIdx].praise = comts[comIdx].praise - 1
                    that.setState({
                        comts:comts
                    })
                }
            })
        } else {
            api.post(inter.PublishLike+val.commentId).then((res)=>{
                if(res.data.status){
                    comts[comIdx].like = !comts[comIdx].like 
                    comts[comIdx].praise = comts[comIdx].praise + 1
                    that.setState({
                        comts:comts
                    })
                }
            })
        }

    } 


    render () {

        const {content,isShow,comts} = this.state;

        return (
            <View className='wrap fade '>

                <View className='pl_15 pr_15' style={!isShow ? {paddingBottom:120 + 'rpx'} : {paddingBottom:0 + 'rpx'}}>
                    {
                        comts.map((item,index)=>{
                            const on = comts.length - 1 === index ;
                            return(
                                <View  key={'item' + index} className={on ? '' : 'item_bt'}>
                                    <Eval  
                                        comIdx={index}
                                        val = {item} 
                                        onParse={this._parse}
                                    />
                                </View>
                            )
                        })
                    }
                </View>

            
            </View>
        )
       
    }
}

export default AskComment as ComponentClass