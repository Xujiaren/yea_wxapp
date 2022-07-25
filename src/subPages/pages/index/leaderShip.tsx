import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text,Swiper ,SwiperItem,Image} from '@tarojs/components'



import Tabs from '../../../components/Tabs'
import {percent2percent25} from '../../../utils/common'

import menu from '../../../config/menu';
import asset from '../../../config/asset';
import Course from '../../../components/Course'
import inter from '../../../config/inter'
import api from '../../../services/api'
import Auth from '../../../components/Auth'
import ConsultCourse from '../../../components/ConsultCourse'

import  '../../../config/theme.css';
import './leaderShip.less'

type recom = {
    categoryId: number,
    ccategoryId:number,
    chapter: number,
    chapterList: Array<{}>,
    collect: false
    content: string,
    courseId: number,
    courseImg: string,
    courseName: string,
    ctype: number,
    galleryList: Array<{}>,
    hit: number,
    integral: number,
    isRecomm: number,
    learn: number,
    pubTime:number,
    roomId: string,
    score: number,
    sortOrder: number,
    study: null
    summary: string,
    teacher: null
    teacherId: number,
    teacherName: string,
    ttype: number,
}

type PageState = {
    load:boolean,
    categoryId:number,
    teacher_id:number,
    status:number,
    course:Array<recom>,
    teacher:{
        content: string,
        course: number,
        follow: number,
        hit: number,
        honor: string,
        isFollow: boolean,
        level: number,
        teacherId: number,
        teacherImg: string,
        teacherName: string,
        userId: number,
        galleryList:Array<{
            contentId: number,
            ctype: number,
            fpath: string,
            ftype: number,
            galleryId: number,
            link: string,
            status: number,
            teacherImg:string
        }>
    },
    category:Array<{
        categoryId: number,
        ccategoryId:number,
        categoryName: string,
        ctype: string,
        isDelete: number,
        sortOrder: number,
        status: string,
    }>,
    article:{
        items:Array<{
            articleId: number,
            articleImg: string,
            atype: number,
            canShare: number,
            categoryId: number,
            comment: number,
            content:string,
            contentId: number,
            ctype: number,
            gallery: Array<string>,
            hit: number,
            isTop: number,
            like: false,
            likeNum:number,
            pubTime: number,
            pubTimeFt: string,
            summary: string,
            teacherId: number,
            title: string,
            ttype:number,
        }>,
        total:number
    }
    isFollow:boolean,
    userId:number,
}

class leaderShip extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '领导风采'
    }

    constructor () {
        super(...arguments)
        this.state = {
            load:false,
            teacher_id:0,
            status:0,
            course:[],
            teacher:{
                content:'',
                course: 0,
                follow: 0,
                hit: 0,
                honor: '',
                isFollow: false,
                level: 0,
                teacherId: 0,
                teacherImg: '',
                teacherName: '',
                userId: 0,
                galleryList:[]
            },
            category:[],
            categoryId:0,
            article:{
                items:[],
                total:0,
            },
            isFollow:false,
            userId:0,
            
        }

        this._onLoadCallBack = this._onLoadCallBack.bind(this);
    }

    componentWillMount () {
        const that = this 
        const {teach_id} = that.$router.params

        this.setState({
            teacher_id:parseInt(teach_id)
        })
    }
    componentDidMount () {
        this.getUser();
        this.getTeacherDesc();
    }
    componentWillUnmount () { }
    componentDidShow () { }
    componentDidHide () { }

    _onLoadCallBack(){
        var that = this
        that.getTeacherDesc();
        api.get(inter.User)
            .then(res=>{
            if(res.data.status){
                let userData = res.data.data
                that.setState({
                    userId:userData.userId,
                })
            }
        })
    }

    getUser(){
        var that = this
        api.get(inter.User)
            .then((res)=>{
                if(res.data.status){
                    let userData = res.data.data
                    that.setState({
                        userId:userData.userId,
                    })
                }
            })
    }

    _onSelect = (index) =>{
        var that = this
        const {category} = that.state

        that.setState({
            status:index
        })
        if(index > 0){
            const cateId = category[index - 1].categoryId
            that.setState({
                categoryId:cateId
            })
        }
    }

    getTeacherDesc(){
        var that = this
        const {teacher_id} = that.state

        api.get(inter.TeacherDesc+teacher_id)
            .then((res)=>{
                if(res.data.status){

                    let cateItems:Array<any> = []
                    let teacherDesc = res.data.data
                    let category = teacherDesc.category

                    for(let i = 0 ; i < category.length; i++){

                        if(category[i].child.length > 0){

                            for(let j = 0 ; j < category[i].child.length ; j++){

                                cateItems.push(category[i].child[j])
                            }
                        }
                    }

                    that.setState({
                        teacher:teacherDesc.teacher,
                        category:cateItems,
                        course:teacherDesc.course,
                        article:teacherDesc.article,
                        isFollow:teacherDesc.teacher.isFollow,
                        load: true,
                    })
                }
            })
    }

    //分享课程
    onShareAppMessage = (res) =>{
        
        const {userId,teacher_id,teacher} = this.state

        api.post(inter.userLog,{
            log_type:1,
            type:1,
            device_id:0,
            intro:'分享领导风采',
            content_id:teacher_id,
            param:JSON.stringify({name:teacher.teacherName,cctype:9,ttype:0}),
            from:0,
        }).then((res)=>{
            console.log('ee')
        })

        if (res.from === 'button') {
            // 来自页面内转发按钮
        }
        return{
            title:teacher.teacherName,
            path:menu.leaderShip + '?teach_id=' + teacher_id +'&fromuser=' + userId,
            imageUrl:teacher.galleryList[0].fpath + '?x-oss-process=image/resize,w_500,h_380,m_pad' 
        }
    }


    
    _onfoncus(){
        const that = this
        const {teacher,userId} = that.state
        

        if(userId > 0 ){
            api.post(inter.PublishFollow+teacher.teacherId).then((res)=>{
                if(res.data.status){
                    Taro.showToast({
                        title: '关注成功',
                        icon: 'none'
                    })
                    that.setState({
                        isFollow:true
                    })
                } else {
                    Taro.showToast({
                        title: '关注失败',
                        icon: 'none'
                    })
                }
            })
        } else {
            this.refs.auth.doLogin();
        }
        
    }

    _offoncus(){
        const that = this
        const {teacher,userId} = that.state

        if(userId > 0){
            api.post(inter.RemoveFollow+teacher.teacherId).then((res)=>{
                if(res.data.status){
                    Taro.showToast({
                        title: '取消成功',
                        icon: 'none'
                    })
                    that.setState({
                        isFollow:false
                    })
                } else {
                    Taro.showToast({
                        title: '取消失败',
                        icon: 'none'
                    })
                }
            })
        } else {
            this.refs.auth.doLogin();
        }
        

    }

    //详情页
    _oncourseDesc(recom){
        if(recom.ctype === 3){
            Taro.navigateTo({
                url:menu.grapWbdesc +`?course_id=${recom.courseId}` + '&courseName='+ percent2percent25(`${recom.courseName}`)
            })
        } else if(recom.ctype === 0){
            Taro.navigateTo({
                url:menu.courseDesc+`?course_id=${recom.courseId}` + '&courseName='+ percent2percent25(`${recom.courseName}`) + '&isback=0'
            })
        } else if(recom.ctype === 1){
            Taro.navigateTo({url:menu.audioDesc +'?course_id='+ recom.courseId+ '&audioName=' + percent2percent25(recom.courseName)  })
        }
    }

    // 资讯详情
    _consultDesc(art){

        if(art.isLink === 1){
            Taro.navigateTo({url:menu.adWebView+'?link='+`${art.link}` + '&ad=""' })
        } else {
            Taro.navigateTo({url:menu.consultDesc + '?articleId=' + art.articleId + '&cousultName=' + percent2percent25(art.title)})
        }
        
    }

    render () {
        if (!this.state.load) return null;
        const {course,status,teacher,category,categoryId,article,isFollow} = this.state;

        let cateTit:string[] = new Array("全部")

        for(let i = 0 ; i < category.length ; i++){
            cateTit.push(category[i].categoryName)
        }


        let articles = article.items.slice(0,3)

        return (
            <View className='wrap'>
                <View className='teachHead'>
                    <Swiper
                        className='swiper'
                        indicatorColor='rgba(255,255,355,0.49)'
                        indicatorActiveColor='#ffffff'
                        vertical={false}
                        circular
                        indicatorDots
                        autoplay
                    >
                        {
                            teacher.galleryList.map((gallery,index)=>{
                                return(
                                    <SwiperItem key={'teacher_gallery_'+index}>
                                        <Image src={gallery.fpath} className='swiper_item' />
                                    </SwiperItem>
                                )
                                
                            })
                        }
                    </Swiper>
                    <View className='d_flex fd_r headTop'>
                        <View className='d_flex fd_c jc_sb col_1'>
                            <View className='d_flex fd_r jc_sb'>
                                <View className='d_flex fd_r ai_end'>
                                    <Text className='lg18_label c33_label mr_5 fw_label'>{teacher.teacherName}</Text>
                                    <Text className='sm_label tip_label mb_2'>粉丝 {teacher.follow}</Text>
                                </View>
                                <View className='fourseBtn' onClick={isFollow ? this._offoncus : this._onfoncus}>
                                    <Text className='sred_label sm_label'>{isFollow ?  '已关注':'+关注'}</Text>
                                </View>
                            </View>
                            <Text className='default_label c33_label'>{teacher.honor}</Text>
                        </View>
                    </View>
                    <View className='d_flex fd_c intro'>
                        <Text className='gray_label default_label lh16_label'>{teacher.content}</Text>
                    </View>
                </View>

                {
                    articles.length > 0 ? 
                    <View className='grapwrap mb_20'>
                        <View className='head pl_2 pr_2  pb_5 d_flex fd_r jc_sb ai_ct'>
                            <View className='d_flex fd_r ai_ct'>
                                <Text className='lg_label c33_label fw_label'>动态</Text>
                                <Text className='default_label tip_label ml_5'>({article.total})</Text>
                            </View>
                            <View className='d_flex fd_r ai_ct jc_ct' onClick={()=>Taro.navigateTo({url:menu.consultList+'?teacher_id='+ teacher.teacherId +'&type=1'})}>
                                <Text className='tip_label default_label fw_label'>查看全部</Text>
                                <Image src={asset.arrow_right}  className='arrow_right' />
                            </View>
                        </View>
                        <View className='items pl_15 pr_15'>
                            {
                                articles.map((grap:any,index)=>{
                                    return(
                                        <View className='border_bt pb_10 pt_10 itemg' key={'grap' + index}
                                            // onClick={()=>Taro.navigateTo({url:menu.consultDesc + '?articleId=' + grap.articleId + '&cousultName=' + percent2percent25(grap.title)})}
                                            onClick={this._consultDesc.bind(this,grap)}
                                        >
                                            <ConsultCourse  articleList={grap} />
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                :null}
                
                {
                    course.length > 0 ?
                    <View className='coursewrap mt_15 bg_white'>
                        <View className='d_flex fd_r ai_end pl_20 pt_20' >
                            <Text className='lg18_label c33_label fw_label'>课程作品</Text>
                            <Text className='default_label tip_label ml_10'>({course.length})</Text>
                        </View>

                        <View className='atabs border_bt'>
                            <Tabs items={cateTit}  selected={status} onSelect={this._onSelect} type={0}  />
                        </View>
                        
                        <View className='recomm ' > 
                            {
                                status == 0 ? 
                                <View className='recomm_items pl_10 pr_10  pb_30 bg_white'> 
                                    {
                                        course.map((recom,index)=>{
                                            const on = course.length  === index + 1
                                            return(
                                                <View className='item  pt_12 pb_12 ' key={'recom'+index} style={on ? '' : {borderBottom:'2rpx solid #f5f5f5'}}
                                                    onClick={this._oncourseDesc.bind(this,recom)}
                                                >
                                                    <Course  courseList={recom} atype={1} />
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                                :
                                <View className='recomm_items pl_10 pr_10  pb_30 bg_white'> 
                                    {
                                        course.map((recom,index)=>{
                                            const on = recom.ccategoryId == categoryId
                                            const onrem = course.length  === index + 1
                                            return(
                                                <View key={'course_' + index}>
                                                    {
                                                        on ?
                                                            <View key={'recom'+index} className='item  pt_12  pb_12' style={onrem ?   '':{borderBottom:'2rpx solid #f5f5f5'}}
                                                                onClick={this._oncourseDesc.bind(this,recom)}
                                                            >
                                                                <Course  courseList={recom} atype={1}/>
                                                            </View>
                                                            
                                                        :null
                                                    }
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            }
                        </View>
                    </View>
                :null}
                
                <Auth ref={'auth'} success={() => {
                    this._onLoadCallBack()
                }}/>
            </View>
        )
    }
}

export default leaderShip as ComponentClass