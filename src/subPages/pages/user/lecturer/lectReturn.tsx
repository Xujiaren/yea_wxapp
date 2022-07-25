import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image,Picker} from '@tarojs/components'


import asset from '../../../../config/asset'
import menu from '../../../../config/menu';
import inter from '../../../../config/inter'
import api from '../../../../services/api'


import  '../../../../config/theme.css';
import './lectReturn.less'

type PageState = {
    course:Array<any>,
    page:number,
    pages:number,
    total:number,
    loadding:boolean,
    list:Array<any>,
    ilist:Array<any>,
    name:string,
    status:number,
    balances:any,
    Integrals:any,
    selector:any,
}

class lectReturn extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '查看收益',
        enablePullDownRefresh: true
    }

    constructor () {
        super(...arguments)
        this.state = {
            course:[], // 课程列表
            page:0,
            pages:0,
            total:0,
            loadding:false,
            list:[],
            ilist:[],
            name:'',
            status:0,
            balances:0,
            Integrals:0,
            selector:['收益明细']
        }
    }

    componentWillMount () {
    }

    componentDidMount () { 
        var that = this
        // that.getCourseList()
        // that.balance()
        that.agent()
        api.get(inter.User)
        .then(res=>{
            console.log(res)
            that.setState({
                name:res.data.data.nickname,
                balances:res.data.data.agentBalance,
                Integrals:res.data.data.agentIntegral,
            })
        })
    }

    componentWillUnmount () {

    }
    
    componentDidShow () { }
    componentDidHide () { }
    //学分
    agent=()=>{
        const{page,ilist}=this.state
        api.get(inter.agent,{
            page:page,
        }).then(res=>{
            let arr = res.data.data;
            if (page === 0) {
                var tList = arr.items
            } else {
                var tList: any = ilist.concat(arr.items)
            }
            this.setState({
                ilist:tList
            })
        })
    }
    //现金
    // balance=()=>{
    //     const{page,list}=this.state
    //     api.get(inter.balance,{
    //         page:page,
    //         type:2
    //     }).then(res=>{
    //         let arr = res.data.data;
    //             if (page === 0) {
    //                 var tList = arr.items
    //             } else {
    //                 var tList: any = list.concat(arr.items)
    //             }
    //         this.setState({
    //             list:tList,
    //             page: arr.page,
    //             pages: arr.pages,
    //         })
    //     })
    // }
    // 课程接口
    getCourseList(){
        var that = this;

        const {page} = that.state


        api.get(inter.Index,{
            category_id:22,
            ccategory_id:0,
            ctype:9,
            sort: 1,
            page:page,
        }).then(res=>{
            if(res.data.status){
                let courseList = res.data.data
                this.setState({
                    course:courseList.items,
                    page:courseList.page,
                    pages:courseList.pages,
                    total:courseList.total,
                })
            }
        })
    }



    // 加载数据
    loaddata(){
        var that = this;

        const {page,course} = that.state


        api.get(inter.Index,{
            category_id:22,
            ccategory_id:0,
            ctype:9,
            sort: 1,
            page:page,
        }).then(res=>{
            if(res.data.status){
                let courseList = res.data.data
                const tempArray = course.concat(courseList.items)
                this.setState({
                    course:tempArray,
                    page:courseList.page,
                    pages:courseList.pages,
                    total:courseList.total,
                })
            }
        })
    }



     // 下拉
     onPullDownRefresh(){
        var self = this
        
        self.setState({
            page:0,
            course:[],
            loadding:false
        },()=>{
            self.agent();
            self.balance();
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
            self.setState({
                page:page + 1
            },()=>{
                if(status==0){
                    self.balance();
                }else{
                    self.agent();
                }
                
            })
        } else {
            self.setState({
                loadding:true
            })
        }
    }
    onChanges=(e)=>{
        this.setState({
            status:e.detail.value
        })
    }
    render () {

        const bg_gold = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/56450068-c0a1-459f-9cc8-5053fd4cd7f8.png'
        const {course,loadding,list,name,ilist,status,balances,Integrals} = this.state
        return (
            <View className='wrap'>
                <View className='head  border_bt'>
                    <View className='pl_25 pr_25 pt_20'>
                        <Image src={bg_gold} className='bg_gold' >
                            <View className='headbox'>
                                <View className='d_flex ai_ct pl_20'>
                                    <Text className='mt_10 sm_label white_label'>累计收益:</Text>
                                    {/* {
                                        status==0?
                                        <Text className='mt_10 default_label white_label ml_5'>￥</Text>
                                        :null
                                    }
                                    {
                                        status==0?
                                        <Text className='lg30_label white_label fw_label'>{balances}</Text>
                                        : */}
                                        <Text className='lg30_label white_label fw_label'>{Integrals}</Text>
                                    {/* } */}
                                    {/* {
                                        status!=0? */}
                                        <Text className='mt_10 default_label white_label ml_5'>学分</Text>
                                        {/* :null
                                    } */}
                                    {/* <View className='ml_20'>
                                        <Picker mode='selector' range={this.state.selector} onChange={this.onChanges}>
                                            <View style={{color:'#ffffff',fontSize:'28rpx'}}>{this.state.selector[status]}</View>
                                        </Picker>
                                    </View> */}
                                </View>
                            </View>
                        </Image>
                    </View>
                    <View className='d_flex   border_box'>
                        <View onClick={()=>{this.setState({status:0})}}>
                            <Text className='default_label c33_label fw_label'>收益明细</Text>
                            <View className={status==0?'border_tip mt_5 ml_20':'border_tips mt_5 ml_20'}></View>
                        </View>
                        {/* <View className='ml_20' onClick={()=>{this.setState({status:1})}}>
                            <Text className='default_label c33_label fw_label'>学分收益</Text>
                            <View className={status==1?'border_tip mt_5 ml_20':'border_tips mt_5 ml_20'}></View>
                        </View> */}
                    </View>
                </View>
                {/* {
                    status==0?
                    <View className='wrapbox pl_20 pr_20'>
                    {
                        list.map((lect,index)=>{
                            return(
                                <View className='d_flex fd_c pt_10 pb_10' key={ 'lect' + index}>
                                    <Text className='c33_label default_label'>{lect.contentName}</Text>
                                    <View className='d_flex jc_sb fd_r ai_ct mt_5'>
                                        <Text className='sm_label tip_label'>{lect.pubTimeFt}    推荐人：{name}</Text>
                                        <Text className='sm_label fw_label' style={{color:'#FFA349'}}>佣金：￥{lect.amount}</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                    
                </View>
                : */}
                <View className='wrapbox pl_20 pr_20'>
                {
                    ilist.map((lect,index)=>{
                        return(
                            <View className='d_flex fd_c pt_10 pb_10' key={ 'lect' + index}>
                                <Text className='c33_label default_label'>{lect.contentName}</Text>
                                <View className='d_flex jc_sb fd_r ai_ct mt_5'>
                                    <Text className='sm_label tip_label'>{lect.pubTimeFt}    推荐人：{name}</Text>
                                    <Text className='sm_label fw_label' style={{color:'#FFA349'}}>佣金：{lect.integral}学分</Text>
                                </View>
                            </View>
                        )
                    })
                }
                
            </View>
                {/* } */}
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

export default lectReturn as ComponentClass