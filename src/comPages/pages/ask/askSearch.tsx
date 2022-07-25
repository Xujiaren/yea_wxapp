import { ComponentClass } from 'react'
import Taro, { Component,Config } from '@tarojs/taro'
import { View ,Text,Image,Input} from '@tarojs/components'

import Tabs from '../../../components/Tabs'

import asset from '../../../config/asset'
import menu from '../../../config/menu'
import inter from '../../../config/inter'
import api from '../../../services/api'


import Askcell from '../../components/askcell'


import  '../../../config/theme.css';
import './askSearch.less'


type PageState = { 
    content:string,
    navHeight:number,//刘海高度
    capHeight:number,//胶囊高度

    type:number,
    keyword:string,
    historyList:Array<string>,
    historyLists:Array<string>,
    historyType:number,

    askList:Array<{
        askId:number,
        askReplyDTO:object,
        categoryId: number,
        collect: number,
        content: string,
        flag: string,
        gallery:Array<any>,
        hit: number,
        integral: number,
        isCollect: false
        isShare: number,
        isTop: number,
        pubIp: string,
        pubTime: number,
        replyId: number,
        replyNum: number,
        title: string,
        userId: number,
    }>,

    page:number,
    pages:number,
}


class askSearch extends Component<{}, PageState> {
    config:Config = {
        navigationStyle:"custom",
        enablePullDownRefresh:true
    }


    constructor (props) {
        super(props)

        this.state = {
            content:'',
            navHeight:0,
            capHeight:0,

            type:1, // 0 数据列表 1 历史搜索 2 搜索不到 东西展示
            keyword:'',
            historyList:[],
            historyLists:[],
            historyType:0, 

            askList:[],

            page:0,
            pages:0,
        }

    }

    componentWillMount () {   
        this._setbatHeight();

        var that = this

        if(Array.isArray(Taro.getStorageSync('a_keywords'))){

            let hisword = Taro.getStorageSync('a_keywords')

            that.setState({
                historyList: hisword.slice(0,3),
            })
        } else {
            that.setState({
                historyList: []
            })
        }
    }

    componentDidMount () { 

    }

    componentWillUnmount () {
        
    }
    componentDidHide () { }


    // 顶部高度适应
    _setbatHeight(){
        var that = this
        var sysinfo =  Taro.getSystemInfoSync()
        var navHeight:number = 44
        var cpHeight:number = 40
        var isiOS = sysinfo.system.indexOf('iOS') > -1
        if (!isiOS) {
            cpHeight = 48
            navHeight = sysinfo.statusBarHeight;
        } else {
            cpHeight = 40
            navHeight = sysinfo.statusBarHeight;
        }

        that.setState({
            navHeight: navHeight,
            capHeight: cpHeight
        })
    }


    //  下啦刷新
    onPullDownRefresh(){
        var that = this;

        Taro.showNavigationBarLoading();

        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }

    //搜索 问答

    _onSearch = () =>{
        var that = this
        const {keyword} = that.state

        if(keyword.length > 0 ){
            that._getkeywordHis(keyword);

            that._getAsk();
        }
    }


    // 判断关键字
    _getkeywordHis(keyword:string){
        var that = this
        let {historyList} = that.state


        if(historyList.indexOf(keyword) != -1){
            let index = historyList.indexOf(keyword);

            historyList.splice(index, 1)
            historyList.unshift(keyword)

            Taro.setStorageSync('a_keyword', historyList)
            that.setState({
                historyList:historyList
            })
        } else {

            historyList.unshift(keyword)


            Taro.setStorageSync('a_keywords', historyList)


            that.setState({
                historyList:historyList
            })
        }
    }

     //单个记录删除
    _onHistory(item,index){

        var that = this;
        let {historyType} = that.state

        let perhis =   Taro.getStorageSync('a_keywords')

        perhis.splice(index,1)

        
        if(historyType == 1){

            that.setState({
                
                historyList:perhis,
                historyType:1
            })
        }

        that.setState({
            historyList:perhis.slice(0,3),
            historyType:0
        })

        Taro.setStorageSync('a_keywords', perhis)

    }


    // 全部清除
    _allDelete = () => {

        var that = this
        let {historyList} = that.state
        that.setState({
            historyList:[],
            historyLists:[]
        })

        historyList = []

        Taro.setStorageSync('a_keywords', historyList)
    }


    // 热点
    _onHot = (item) => {

        var that = this;

        that.setState({
            keyword:item,
        },()=>{
            that._getAsk();
        })

    }


    // 全部搜索记录
    _allSearch = (type) => {

        var that = this
        let {historyList} = that.state
        historyList = Taro.getStorageSync('a_keywords')
        that.setState({
            historyList:historyList,
            historyType:1
        })

    }

    // 限制显示个数
    _liteSearch = (type) => {

        var that = this
        let {historyList} = that.state
        that.setState({
            historyList:historyList.slice(0,3),
            historyType:0
        })
    }



    // 得到问答的数量
    _getAsk(){
        var that = this ;
        const {keyword} = that.state;

        api.get(inter.ask,{
            category_id:0,
            keyword:keyword,
            sort:0,
            page:0,
        }).then((res)=>{

            let arr = res.data.data;

            if(arr.items.length >  0){
                that.setState({
                    type:0,
                })
            } else {
                that.setState({
                    type:2,
                })
            }
            
            if(res.data.status){

                that.setState({
                    askList:arr.items,
                })
            }
        })
    }

    // 详情页
    _toQust = (item) =>{

        Taro.navigateTo({
            url:menu.question + '?askId=' + item.askId
        })
        
    }

    render () {

        const {navHeight,capHeight,keyword,historyList,historyType,type,askList} = this.state;


        return (
            <View className='wrap fade bg'>

                <View className='head'>

                    <View style={{height:navHeight+'px',width:'100%'}}></View>
                    <View style={{height:capHeight+'px',width:'100%'}} className='d_flex jc_ct ai_ct'></View>
                    <View className='search mb_10'>
                        <Image src={asset.lg_icon}  className='left_angle' mode='aspectFit' onClick={()=>Taro.navigateBack()} />
                        <View className='input ml_15 mr_20 pl_15'>
                            <Image src={asset.search} className='search_icon'  />
                            <Input
                               className='default_label ml_10 col_1'
                               placeholder='搜索问题'
                               value={keyword}
                               onConfirm={this._onSearch}
                               onInput={(e)=>this.setState({keyword:e.detail.value})}
                            />
                        </View>

                        <Text className='gray_label default_label' onClick={this._onSearch}>搜索</Text>
                    </View>

                </View>

                {
                    type === 1 ?
                    <View className='search_his mt_30 '>
                        {
                            historyList.length > 0 ?
                            <View className='d_flex fd_r jc_sb ai_ct pl_15  pb_10 pr_15 border_bt_sch' >
                                <Text className='default_label tip_label'>搜索记录</Text>
                                <Text className='default_label tip_label' onClick={this._allDelete}>清除</Text>
                            </View>
                        :null}
                    
                        {
                            historyList && historyList.map((item,index)=>{
                                return(
                                    <View key={'item'+index}  className='p_15  d_flex fd_r jc_sb ai_ct border_bt'>
                                        <View onClick={()=>this._onHot(item)} className='col_1'>
                                            <Text className='default_label tip_label'>{item}</Text>
                                        </View>
                                        <View onClick={this._onHistory.bind(this,item,index)}>
                                            <Image src={asset.dete_icon} className='dete_icon'  />
                                        </View>
                                        
                                    </View>
                                )
                            })
                        }

                        {
                            historyList.length > 0 ?
                            <View>
                                {
                                    historyType == 0 ?
                                    <View className='d_flex jc_ct ai_ct pt_15 pb_15' onClick={this._allSearch.bind(this,0)}>
                                        <Text className='sm_label gray_label'>全部搜索记录</Text>
                                    </View>
                                    :
                                    <View className='d_flex jc_ct ai_ct pt_15 pb_15' onClick={this._liteSearch.bind(this,1)}>
                                        <Text className='sm_label gray_label'>收回全部搜索记录</Text>
                                    </View>
                                }
                                
                            </View>
                            
                        :null}
                    </View> 

                :null}

                {
                    type === 0 ?
                    <View className='list pl_20 pr_20 mt_30'>
                        {
                            askList.map((item,index)=>{
                                const on = index === askList.length - 1;
                                return (
                                    <View key={'item' + index} className={on ? 'mt_15' :'border_bt mt_15'}>
                                        <Askcell ask={item} type={0} idx={index + 1}  onClick={this._toQust.bind(this,item)}  />
                                    </View>
                                    
                                )
                            })
                        }
                    </View>
                :null}

                {
                    type === 2 ?
                    <View className='list'>
                        <View className='pt_20 pb_20 search_his d_flex ai_ct jc_ct mt_10'>
                            <View className='d_flex fd_c ai_ct search_full'>
                                <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/d09e51f0-633e-4fa5-82ed-6335ae27f814.png'} className='no_search' />
                                <Text className='sred_label sm_label mt_15'>没有找到相关内容</Text>
                            </View>
                        </View>
                    </View>
                :null}
                
            </View>
        )
       
    }
}

export default askSearch as ComponentClass