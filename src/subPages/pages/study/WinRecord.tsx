import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { View, Text ,Image} from '@tarojs/components'


import  '../../../config/theme.css';
import './WinRecord.less'

import inter from '../../../config/inter'
import api from '../../../services/api'
import menu from '../../../config/menu'

type PageStateProps = {

}


type PageDispatchProps = {
    getUserIntegral:(object)=>any
    getActivityFlop:() => any
}

type PageOwnProps = {}

type  PageState = {
    list:Array<number>,
    type:number,
    page:number,
    pages:number,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface WinRecord {
    props: IProps;
}




class WinRecord extends Component<PageDispatchProps & PageStateProps, PageState> {
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTitleText: '中奖纪录',
        enablePullDownRefresh: true
    }
    page: number;
    pages: number;

    constructor () {
        super(...arguments)

        this.page = 0 ;
        this.pages = 0 ;

        this.state = {
            list:[],
            type:0,
            page:0,
            pages:0,
        }
    }
    componentWillReceiveProps (nextProps) {
       
    }

    componentWillMount () { 

        var that = this ;
        
        const {type} = that.$router.params;

        that.setState({
            type:parseInt(type),
        })

    }

    
    componentDidMount () { 
        var that = this ;

        that._getRecord();
    }

    componentWillUnmount () { 
        let pages = Taro.getCurrentPages();
        let prevPage = pages[pages.length-2];
        prevPage.setData({ //设置上一个页面的值
            ttyps:0,
          });
    }
    componentDidShow () { }
    componentDidHide () { }


    _getRecord(){
        var that = this ;
        const {type,list} = that.state;
        let atype = 2
        if(type==2){
            atype=11
        }
        if(type==3){
            atype=12
        }
        if(type==4){
            atype=13
        }
        api.get('/activity/rank/rewards',{
            atype:atype,
            page:this.page,
        }).then((res)=>{
            console.log(res,'??')
            if(res.data.status){

                let record = res.data.data ;

                if(this.page === 0 ){
                    this.page = record.page
                    this.pages = record.pages
                    var fList:any= record.items
                } else {
                    var fList:any= list.concat(record.items)
                }
    
                that.setState({
                    list:fList,
                    page:record.page,
                    pages:record.pages,
                })
            }
        })
    }


    onPullDownRefresh(){
        var self = this

        self.page = 0 ;

        self.setState({
            page:0,
            list:[],
        },()=>{

            self._getRecord();
           
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }

 
    onReachBottom(){
        var self = this;
        
        const {page,pages} = self.state

        if(page < pages){
            this.page = this.page + 1

            self._getRecord();
        }
    }
    onOpen=(val)=>{
        if(val.integral==0){
            if(!val.address){
                Taro.showModal({
                    title:'提示',
                    content:'现在就去填写地址',
                    success: function (res) {
                        if (res.confirm) {
                          Taro.navigateTo({
                            url: menu.address + '?nageType=4' + '&rewardId=' + val.rewardId
                        })
                        } else if (res.cancel) {
        
                        }
                      }
                })
            }
        }
       
    }
    
    render () {

        const {list,type} = this.state

        let type_val = '学霸榜';
        if(type === 3){
            type_val = '财富榜';
        } else if( type === 4){
            type_val = '活跃榜';
        }


        return (
            <View  className='wrap' >

                {
                    list.map((item:any,index)=>{

                        return(
                            <View className='item d_flex fd_r mb_1' key={'item' + index} onClick={this.onOpen.bind(this,item)}>
                                <View className='cover_box'>
                                    <Image src={item.itemImg} className='cover' />
                                </View>
                                <View className='d_flex jc_sb fd_c'>
                                    <View className='d_flex fd_c'>
                                        <Text className='default_label gray_label fw_label'>{item.itemName}</Text>
                                        <Text className='default_label black_label fw_label '>{`${type_val}名次：${item.contentId}名   奖品：${item.itemName}`}</Text>
                                    </View>
                                    <Text className='tip_label sm_label'>{item.pubTimeFt}</Text>
                                </View>
                            </View>
                        )
                    })
                }
               
            </View>
        )
    }
}

export default WinRecord as ComponentClass