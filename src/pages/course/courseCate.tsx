import { ComponentClass } from 'react'
import Taro, { Component, saveImageToPhotosAlbum } from '@tarojs/taro'
import { View ,Text,ScrollView,Image} from '@tarojs/components'


import Tabs from '../../components/Tabs'
import { subNumTxt,learnNum,percent2percent25 } from '../../utils/common'

import asset from '../../config/asset';
import inter from '../../config/inter'
import menu from '../../config/menu';


import api from '../../services/api'

import  '../../config/theme.css';
import './courseCate.less'



type PageState = {
    cateId:number,
    categoryId:number,
    status:number,
    cateItem:Array<{}>,
    cateCourse:Array<any>,
    course:Array<any>,
    defaultcate:Array<string>,
    coursecate:Array<string>,
    defaultIndex:number,
    coursecateIdx:number,
    defaultType:boolean,
    cateType:boolean,
    page:number,
    pages:number,
    total:number,
    loadding:boolean,
    today:number,
    typeList:Array<string>,
    typeidx:number,
    types:boolean,
}


const orderSort = function({arr,flag,orderBy=false}){
    arr = arr||[]
    if(arr.length>0 && Object.keys(arr[0]).indexOf(flag)>-1){   //判断是否存在排序字段,比如sordOrder
        arr.sort((objA,objB)=>{
            if(orderBy)
                return objA[flag]>objB[flag]?1:-1
            return objA[flag]<objB[flag]?1:-1
        })
    }
    return arr
}



class courseCate extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '课程分类',
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
            defaultcate:['最热','最新'], // 最新分类
            coursecate:['全部课程','视频课程','音频课程','直播回放','图文课程'], //课程分类
            typeList:['全部','学分','免费'],
            defaultIndex:0,
            coursecateIdx:0,
            defaultType:false,
            cateType:false,
            page:0,
            pages:0,
            total:0,
            loadding:false,
            today:0,
            typeidx:0,
            types:false,
        }
    }

    componentWillMount () {
    }

    componentDidMount () { 
        

    }

    componentWillUnmount () {

    }
    
    componentDidShow () { 
        var that = this;
        const {cateId} = that.state;
        let today = new Date().getTime()

        api.get(inter.ConfigCateCourse)
            .then(res=>{
                console.log(res)
                if(res.data.status){
                    let cateCourse = res.data.data
                    cateCourse = orderSort({arr:cateCourse,flag:'sortOrder'})
                    let cate_id = 0
                    if(cateCourse.length > 0 && cateId == 0 ){
                        cate_id = cateCourse[0].categoryId
                        let cateItem = cateCourse[0].child
                        cateItem = orderSort({arr:cateItem,flag:'sortOrder'})

                        this.setState({
                            cateId:cate_id,
                            cateItem:cateItem,
                            today:today,
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
    componentDidHide () { }

    
    // 课程接口
    getCourseList(){
        var that = this;
        const {cateId,categoryId,defaultIndex,coursecateIdx,page,typeidx} = that.state;

        let  ctypeidx = 0; 
        if(coursecateIdx === 0){
            ctypeidx = 9; 
        } else if (coursecateIdx === 1){
            ctypeidx = 0;  // 点播
        } else if(coursecateIdx === 2){
            ctypeidx = 1;  // 音频
        } else if(coursecateIdx === 3){
            ctypeidx = 2   // 直播
        } else if(coursecateIdx === 4){
            ctypeidx = 3   // 图文
        }
        let paytype = -1;
        if(typeidx==1){
            paytype = 1
        }else if(typeidx==2){
            paytype = 2
        }else if(typeidx==4){
            paytype = 3
        }else if(typeidx==3){
            paytype = 0
        }else if(typeidx==5){
            paytype = 4
        }

        api.get(inter.Index,{
            category_id:cateId,
            ccategory_id:categoryId,
            ctype:ctypeidx,
            sort: defaultIndex == 0 ? 1 : 0,
            paytype:paytype,
            // plant:1,
            page:page,
        }).then(res=>{
            console.log(res)
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
    _Types=()=>{
        var that = this
        that.setState({
            types:true,
            cateType:false,
            defaultType:false,
        })
    }
    // 课程分类 ，音频图文
    _cateType(){
        var that = this
        that.setState({
            cateType:true,
            defaultType:false,
            types:false,
        })
    }

    // 最新最热
    _defaultType(){
        var that = this
        that.setState({
            defaultType:true,
            cateType:false,
        })
    }


    offlayer(){
        var that = this
        that.setState({
            defaultType:false,
            cateType:false,
            types:false,
        })
    }

    // 选择课程分类
    _coursecate(index){
        var that = this
        if(index === 0){
            that.setState({
                categoryId:0,
                loadding:false
            })
        }
        that.setState({
            coursecateIdx:index,
            course:[],
            page:0,
        },()=>{
            this.getCourseList()
        })
    }

    _defaultcate(index){
        var that = this

        that.setState({
            defaultIndex:index,
            defaultType:false,
            course:[],
            page:0,
        },()=>{
            this.getCourseList()
        })
    }
    _typecate=(index)=>{
        var that = this
        let val = index
        if(index==2){
            val=3
        }
        that.setState({
            typeidx:val,
            defaultType:false,
            course:[],
            page:0,
        },()=>{
            this.getCourseList()
        })
    }


    //数据加载
    loaddata(){
        var that = this 
        const {cateId,categoryId,defaultIndex,course,page,coursecateIdx} = that.state 

        let  ctypeidx = 0; 
        if(coursecateIdx === 0){
            ctypeidx = 9; 
        } else if (coursecateIdx === 1){
            ctypeidx = 0; 
        } else if(coursecateIdx === 2){
            ctypeidx = 3; 
        }

        api.get(inter.Index,{
            category_id:cateId,
            ccategory_id:categoryId,
            sort:defaultIndex == 0 ? 1 : 0,
            ctype:ctypeidx,
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


    // 进入列表详情页
    _oncourseDesc(recom){
        if(recom.ctype === 3){
            Taro.navigateTo({
                url:menu.grapWbdesc +`?course_id=${recom.courseId}` + '&courseName='+ percent2percent25(`${recom.courseName}`)
            })
        } else if(recom.ctype === 1){
            Taro.navigateTo({url:menu.audioDesc +'?course_id='+ recom.courseId+ '&audioName=' + percent2percent25(recom.courseName)   })
        }  else{
            Taro.navigateTo({
                url:menu.courseDesc+`?course_id=${recom.courseId}` + '&courseName='+ percent2percent25(`${recom.courseName}`) + '&isback=0'
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


    render () {
        const {course,status,cateItem,cateCourse,categoryId,coursecate,typeList,typeidx,types,defaultcate,coursecateIdx,defaultIndex,cateType,defaultType,loadding,total} = this.state;

        let cateList_b:any = new Array();

        cateCourse.map((cate,index)=>{
            cateList_b.push(cate.categoryName)
        })

        return (
            <View className='wrap'>
                <View className='head'>
                    <View className='tabbox'>
                        <Tabs items={cateList_b} atype={0} type={0} selected={status} onSelect={this._onSelect} />
                    </View>
                    <ScrollView className='tabswrap'  scrollX scrollWithAnimation>
                        <View className=' d_flex  fd_r ' style={{width:'100%',whiteSpace:'nowrap'}}>
                            <View className='items  pl_10 pr_10' onClick={this._cateAll}>
                                <Text className={categoryId === 0 ? 'default_label red_label' : 'gray_label default_label'}>全部 </Text>
                            </View>
                            {
                                cateItem.map((item:any,index)=>{
                                    const on = item.categoryId === categoryId
                                    return(
                                        <View key={'items'+index} onClick={this.onCategory.bind(this,item)} className='items  pl_10 pr_10' >
                                            <Text className={on ? 'default_label red_label' : 'gray_label default_label'}>{item.categoryName}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </ScrollView>
                    <View className='cate_box bg_white pt_12 pb_12 pl_20 pr_20 d_flex  fd_r jc_sb border_bt'>
                        <Text className='tip_label sm_label'>共有{total}个内容</Text>
                        <View className='  d_flex fd_r ai_ct '>
                        <View className='d_flex fd_r ai_ct '>
                                <View className='d_flex fd_r ai_ct ' onClick={this._Types}>
                                    <Text className='default_label gray_label'>{typeidx==3?typeList[typeidx-1]:typeList[typeidx]}</Text>
                                    <Image src={asset.arrow_bt} className='arrow ml_5' />
                                </View>
                            </View>
                            <View className='d_flex fd_r ai_ct ml_20'>
                                <View className='d_flex fd_r ai_ct ' onClick={this._cateType}>
                                    <Text className='default_label gray_label'>{coursecate[coursecateIdx]}</Text>
                                    <Image src={asset.arrow_bt} className='arrow ml_5' />
                                </View>
                            </View>
                            <View className='d_flex fd_r ai_ct ml_20'>
                                <View className='d_flex fd_r ai_ct ' onClick={this._defaultType }>
                                    <Text className='default_label gray_label'>{defaultcate[defaultIndex]}</Text>
                                    <Image src={asset.arrow_bt} className='arrow ml_5' />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            
                
                <View style={{paddingLeft:40+'rpx',paddingRight:40+'rpx',paddingTop:280 + 'rpx'}}>
                    <View className='recomm_items'> 
                        {
                            course.map((recom:any,index)=>{ 
                                return(
                                    <View className='item d_flex fd_r pt_10 pb_10' key={'recom'+index}  
                                        onClick={this._oncourseDesc.bind(this,recom)} 
                                    >
                                        {/* {
                                            this.state.today-604800000<new Date(recom.pubTimeFt).getTime()?
                                            <View className='new'>
                                                new
                                            </View>
                                            :null
                                        } */}
                                         
                                        
                                        <View className='item_cover_cons'>
                                            <Image src={recom.courseImg} className='item_cover' />
                                            {
                                                recom.ctype  !== 3 ? 
                                                <View className='item_tips_hit'>
                                                    <Image src={asset.cover_tips_icon}  className='item_hit_cover' />
                                                    <Text className='sm8_label white_label mt_3'>{recom.chapter}讲</Text>
                                                </View>
                                            :null}
                                            {
                                               recom.isNew == 1 ?
                                                <View className='cate_new_cover'>
                                                    <Image src={asset.cate_new_icon} className='cate_new_icon' />
                                                </View>
                                            :null}
                                        </View>
                                        <View className='d_flex fd_c pl_10 jc_sb col_1'>
                                            <View className='d_flex fd_c '>
                                                <View className='item_text'>
                                                    <Text className='default_label c33_label fw_label' >{ subNumTxt(recom.courseName,12)}</Text>
                                                </View>
                                                {/* {
                                                    recom.payType == 1 ?
                                                    <Text className='red_label default_label mt_3'>{recom.integral}学分</Text>
                                                    : recom.payType == 0 ?
                                                    <Text className='red_label default_label mt_3'>免费</Text>
                                                    : recom.payType == 2 ?
                                                    <Text className='red_label default_label mt_3'>¥{recom.courseCash}</Text>
                                                    :recom.payType == 3 ?
                                                    <Text className='red_label default_label mt_3'>¥{recom.courseCash}+{recom.integral}学分</Text>
                                                    :null
                                                } */}
                                                 {
                                                    recom.payType == 1 ?
                                                    <Text className='red_label default_label mt_3'>{recom.integral}学分</Text>
                                                    : recom.payType == 0 ?
                                                    <Text className='red_label default_label mt_3'>免费</Text>
                                                    : null
                                                }
                                            </View>
                                            <View className='d_flex fd_r  mt_5 jc_sb'>
                                                {
                                                    recom.teacherId > 0 ?
                                                    <View className='d_flex fd_r ai_ct'>
                                                        <Image src={asset.per_icon} className='item_head_cover' />
                                                        <Text className='default_label c33_label ml_5'>{recom.teacherName}</Text>
                                                    </View>
                                                :null}
                                                {
                                                    recom.ctype !== 3 ? 
                                                    <View className='view_play d_flex fd_r ai_ct'>
                                                        <Image src={asset.pay_icon} className='view_icon' />
                                                        <Text className='default_label gray_label ml_5'>{learnNum(recom.hit)}</Text>
                                                    </View>
                                                    :
                                                    <View className='view_play d_flex fd_r ai_ct'>
                                                        <Image src={asset.collect_icon} className='view_icon' />
                                                        <Text className='default_label gray_label ml_5'>{recom.collectNum}</Text>
                                                    </View>
                                                }
                                                
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                        {
                            loadding ? 
                            <View className='d_flex ai_ct jc_ct pt_15 pb_15'>
                                <Text className='sm_label tip_label'>没有更多数据了</Text>
                            </View>
                        :null}
                    </View>  
                </View>
                


                {
                    defaultType ?
                    <View className='layer'  onClick={this.offlayer}>
                        <View className='bg_white'>
                            {
                                defaultcate.map((type,index)=>{
                                    const on = index == defaultIndex
                                    return(
                                        <View className='pt_12 pb_12 pl_15 border_tp d_flex fd_r ai_ct jc_sb pr_20' key={'type'+index} onClick={this._defaultcate.bind(this,index)}>
                                            {
                                                on ?
                                                <Text className='red_label default_label'>{type}</Text>
                                                :
                                                <Text className='default_label c33_label'>{type}</Text>
                                            }
                                            
                                            {
                                                on ?
                                                <Image src={asset.gou} className=' gou'></Image>
                                            :null}
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                :null}
                {
                    types ?
                    <View className='layer'  onClick={this.offlayer}>
                        <View className='bg_white'>
                            {
                                typeList.map((type,index)=>{
                                    const on = index == typeidx
                                    return(
                                        <View className='pt_12 pb_12 pl_15 border_tp d_flex fd_r ai_ct jc_sb pr_20' key={'type'+index} onClick={this._typecate.bind(this,index)}>
                                            {
                                                on ?
                                                <Text className='red_label default_label'>{type}</Text>
                                                :
                                                <Text className='default_label c33_label'>{type}</Text>
                                            }
                                            
                                            {
                                                on ?
                                                <Image src={asset.gou} className=' gou'></Image>
                                            :null}
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                :null}


                {
                    cateType ?
                    <View className='layer'  onClick={this.offlayer}>
                        <View className='bg_white'>
                            {
                                coursecate.map((type,index)=>{
                                    const on = index == coursecateIdx
                                    return(
                                        <View className='pt_12 pb_12 pl_15 border_tp d_flex fd_r ai_ct jc_sb pr_20' key={'type'+index} onClick={this._coursecate.bind(this,index)}>
                                            {
                                                on ?
                                                <Text className='red_label default_label'>{type}</Text>
                                                :
                                                <Text className='default_label c33_label'>{type}</Text>
                                            }
                                            
                                            {
                                                on ?
                                                <Image src={asset.gou} className=' gou'></Image>
                                            :null}
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                :null}
            </View>
        )
    }
}

export default courseCate as ComponentClass