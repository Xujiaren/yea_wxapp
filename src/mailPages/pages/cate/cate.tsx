import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View ,Text,ScrollView,Image} from '@tarojs/components'


import Tabs from '../../../components/Tabs'
import { percent2percent25} from '../../../utils/common'

import inter from '../../../config/inter'
import menu from '../../../config/menu';

import asset1 from '../../config/asset'
import api from '../../../services/api'

import  '../../../config/theme.css';
import './cate.less'



type PageState = {
    cateId:number,
    categoryId:number,
    status:number,
    cateItem:Array<{}>,
    cateCourse:Array<any>,
    course:Array<any>,
    page:number,
    pages:number,
    total:number,
    loadding:boolean,
    tabbar_bottom:Array<{
        text:string,
        link:string,
        icon:string,
        iconfull:string
    }>,
    tabbarIndex:number,
}

class cate extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '分类',
        enablePullDownRefresh: true
    }
    page: number

    constructor () {
        super(...arguments)
        this.state = {
            cateId:0, // 大分类id
            categoryId:0, // 二级分类id 
            status:0,
            cateCourse:[], // 总分类列表
            cateItem:[], // 二级分类
            course:[], // 课程列表
            page:0,
            pages:0,
            total:0,
            loadding:false,
            tabbar_bottom:[{
                text:'首页',
                link:menu.mailIndex,
                icon:asset1.mail_icon,
                iconfull:asset1.mail_icon_full
            },{
                text:'分类',
                link:'',
                icon:asset1.cate_icon,
                iconfull:asset1.cate_icon_full
            }
            ,{
                text:'购物车',
                link:menu.mailCart,
                icon:asset1.cart_icon,
                iconfull:asset1.cart_icon_full
            }
            ,{
                text:'订单',
                link:menu.mailOrder,
                icon:asset1.order_icon,
                iconfull:asset1.order_icon_full
            }],
            tabbarIndex:1,
        }
    }

    componentWillMount () {
        this.getConfig()
    }

    componentDidMount () { 
        

    }

    componentWillUnmount () {

    }
    
    componentDidShow () { 
        var that = this;        
        that._shopCategory();
    }
    componentDidHide () { }

    getConfig = ()=>{
        const {tabbar_bottom} = this.state
        try {
            api.get(inter.Config).then((res)=>{
                if(res.data.status){
                    const {data} = res.data
                    const {mall_light,mall_dark,cate_light,cate_dark,order_light,order_dark,card_light,card_dark} = JSON.parse(data['ui_choose_field'])
                    
                    if(typeof(mall_light) !== 'undefined'){
                        tabbar_bottom[0]['icon'] = mall_dark
                        tabbar_bottom[0]['iconfull'] = mall_light

                        tabbar_bottom[1]['icon'] = cate_dark
                        tabbar_bottom[1]['iconfull'] = cate_light

                        tabbar_bottom[2]['icon'] = card_dark
                        tabbar_bottom[2]['iconfull'] = card_light

                        tabbar_bottom[3]['icon'] = order_dark
                        tabbar_bottom[3]['iconfull'] = order_light

                        this.setState({ tabbar_bottom })
                    }
                }
            })
        } catch (error) {
            
        }
    }
    _shopCategory(){

        var that = this;
        const {cateId} = that.state;

        api.get(inter.shopCategory)
        .then(res=>{
            if(res.data.status){
                let cateCourse = res.data.data
                let cate_id = 0
                if(cateCourse.length > 0 && cateId == 0 ){
                    cate_id = cateCourse[0].categoryId
                    this.setState({
                        cateId:cate_id,
                        cateItem:cateCourse[0].child
                    },()=>{
                        that.getCourseList()
                    })
                }
                this.setState({
                    cateCourse:cateCourse,
                })
            }
        })
    }

    
    // 课程接口
    getCourseList(){
        var that = this;
        const {cateId,categoryId,page} = that.state;

        api.get(inter.shopSearch,{
            category_id:cateId,
            ccategory_id:categoryId,
            keyword:'', 
            gtype:0,
            sortOrder: 0,
            page:page,
        }).then(res=>{
            if(res.data.status){
                let courseList = res.data.data
                this.setState({
                    course:courseList.items,
                    page:courseList.page,
                    pages:courseList.pages,
                    total:courseList.total
                })
            }
        })
    }
    

    // 一级分类
    _onSelect = (index) =>{
        var that = this ;
        
        const {cateCourse} = that.state

        that.setState({
            status:index,
            cateItem:cateCourse[index].child,
            cateId:cateCourse[index].categoryId,
            categoryId:0,
            page:0,
            course:[],
            loadding:false
        },()=>{
            that.getCourseList();
        })
    }

    // 二级分类
    onCategory(item){

        var  that = this;
        that.setState({
            categoryId:item.categoryId,
            page:0,
            course:[],
            loadding:false
        },()=>{
            that.getCourseList()
        })
    }


    // 二级分类下面的全部
    _cateAll(){
        var  that = this;
        that.setState({
            categoryId:0,
            page:0,
            course:[],
            loadding:false
        },()=>{
            that.getCourseList();
        })
    }


     //数据加载
     loaddata(){
        var that = this 
        const {cateId,categoryId,course,page} = that.state 



        api.get(inter.shopSearch,{
            category_id:cateId,
            ccategory_id:categoryId,
            sort:1,
            ctype:0,
            page:page+1,
        }).then(res=>{
            if(res.data.status){
                let courseList = res.data.data
                const tempArray = course.concat(courseList.items)
                this.setState({
                    course:tempArray,
                    page:courseList.page,
                    pages:courseList.pages,
                    total:courseList.total
                })
            }
        })
    }



    //scrollView 上拉
    onReachBottom(){

        var self = this;
        
        const {page,pages} = self.state
        

        if(page < pages){
            self.loaddata()
        } else {
            self.setState({
                loadding:true
            })
        }

    }




    // 下拉
    onPullDownRefresh(){
        var self = this
        
        self.setState({
            page:0,
            course:[],
            loadding:false
        },()=>{
            self.getCourseList();
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }


    _goodsDesc(item){
        api.post(inter.inuserLogs,{
            logType:3,
            type:3,
            content_id:item.goodsId,
            from:1
        }).then(res=>{})
        Taro.navigateTo({
            url:menu.mailDesc  + "?goods_id=" + item.goodsId + "&goodsName=" + percent2percent25(item.goodsName) 
        })
    }


    render () {
        const {tabbar_bottom,tabbarIndex,course,status,cateItem,cateCourse,categoryId,loadding} = this.state;

        //视频的品读款度
        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }  catch (e) {
            
        }

        let cateList_b:any = new Array();

        cateCourse.map((cate,index)=>{
            cateList_b.push(cate.categoryName)
        })


        return (
            <View className='wrap'>
                {console.log(cateCourse)}
                {console.log(course)}
                <View className='head'>
                    <View className='tabbox'>
                        <Tabs items={cateList_b} atype={0} type={0} selected={status} onSelect={this._onSelect} />
                    </View>
                    <ScrollView className='tabswrap'  scrollX scrollWithAnimation>
                        <View className=' d_flex  fd_r ' style={{width:'100%',whiteSpace:'nowrap'}}>
                            <View className='items  pl_10 pr_10' onClick={this._cateAll}>
                                <Text className={categoryId === 0 ? 'sm_label red_label' : 'gray_label sm_label'}>全部 </Text>
                            </View>
                            {
                                cateItem.map((item:any,index)=>{
                                    const on = item.categoryId === categoryId
                                    return(
                                        <View key={'items'+index} onClick={this.onCategory.bind(this,item)} className='items  pl_10 pr_10' >
                                            <Text className={on ? 'sm_label red_label' : 'gray_label sm_label'}>{item.categoryName}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </ScrollView>
                </View>


                <View className='recommBox pl_15 pr_15'>
                    {
                        course.map((item,index)=>{
                            return(
                                <View key={'cates' + index} className='rcomItem' 
                                    style={item.stock==0?{width:((windowWidth-46)/2).toFixed(0)+ 'px',position:'relative',opacity:'0.7'}:{width:((windowWidth-46)/2).toFixed(0)+ 'px',position:'relative'}}
                                    onClick={this._goodsDesc.bind(this,item)}
                                >
                                    <Image  
                                        className='catesCover'
                                        src={item.goodsImg}
                                        mode='aspectFit'
                                        style={{width:((windowWidth-46)/2).toFixed(0)+ 'px',height:((windowWidth-46)/2).toFixed(0)+ 'px'}}
                                    />
                                    {
                                        item.stock==0?
                                        <Image  
                                        className='catesCover'
                                        src={asset1.shouqing}
                                        mode='aspectFit'
                                        style={{width:180+ 'rpx',height:180+ 'rpx',position:'absolute',left:'80rpx',top:'80rpx'}}
                                    />
                                    :null
                                    }
                                    <View className='pl_10 pr_10 d_flex fd_c'>
                                        {console.log(item)}
                                        <Text className='c33_label default_label mt_5 dup_per_txt'>{item.goodsName}</Text>
                                        <View className='d_flex fd_r jc_sb mt_15'>
                                            <View className='box_price'>
                                            {
                                              item.gtype==1?
                                                <Text className='default_label red_label '>免费</Text>
                                                :item.gtype==2?
                                                <Text className='default_label red_label '>¥{item.goodsAmountDTO.goodsAmount?item.goodsAmountDTO.goodsAmount:item.goodsAmount}</Text>
                                                :item.gtype==3?
                                                <Text className='default_label red_label '>{item.goodsIntegral}学分</Text>
                                                :item.gtype==4?
                                                <Text className='default_label red_label '>{item.goodsIntegral}学分</Text>
                                                :null
                                            }
                                            {
                                                item.marketAmount?
                                                <Text className='mark_price'>¥{item.marketAmount}</Text>
                                                :null
                                            }
                                            </View>
                                            <Text className='sm_label tip_label '>热销{item.saleNum}件</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>

                {
                    loadding ? 
                    <View className='d_flex ai_ct jc_ct pt_15 pb_15'>
                        <Text className='sm_label tip_label'>没有更多数据了</Text>
                    </View>
                :null}
            
                

                <View className='tabbar'>
                    {
                        tabbar_bottom.map((item,idx)=>{
                            const on = tabbarIndex === idx
                            return( 
                                <View key={'item'+idx} className='tabItem' 
                                    onClick={()=>Taro.redirectTo({url:item.link})}
                                >
                                    <Image src={on ? item.iconfull : item.icon} className= {on ? 'tabItem_cover' : 'tabItem_cover '} />
                                    <Text className={on ? 'red_label sm_label' : 'gray_label sm_label'}>{item.text}</Text>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    }
}

export default cate as ComponentClass