import { ComponentClass } from 'react'
import Taro, { Component, saveImageToPhotosAlbum } from '@tarojs/taro'
import { View, Text ,Image} from '@tarojs/components'

import  '../../../config/theme.css';
import asset from '../../../config/asset'
import './myCollect.less'

import { connect } from '@tarojs/redux'
import { usersType } from '../../../constants/usersType'
import menu from '../../../config/menu';
import { getCollectCourse} from '../../../actions/user'
import {learnNum,percent2percent25} from '../../../utils/common'

import inter from '../../../config/inter'
import api from '../../../services/api'

import Tabs from '../../../components/Tabs'

type PageStateProps = {
    user:usersType,
    getCollectCourse:Array<{}>,
}

type PageDispatchProps = {
    getCollectCourse:(object)=>any
}

type PageOwnProps = {}

type PageState = {
    page:number,
    pages:number,
    total:number,
    choosedata:Array<string>,
    colltype:boolean,
    allType:boolean,
    ids:Array<number>,
    c_course:Array<{
        courseId:number
    }>,
    status:number,
    cctype:number,
    articleList:Array<{
        articleId:number,
    }>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface MyCollect {
    props: IProps;
}

@connect(({ user }) => ({
    user:user
  }), (dispatch) => ({
    getCollectCourse(object){
        dispatch(getCollectCourse(object))
    }
}))


class MyCollect extends Component<PageDispatchProps & PageStateProps, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '我的收藏',
        enablePullDownRefresh: true
    }

    constructor () {
        super(...arguments)

        this.page = 1;
        this.pages = 1;


        this.state = {
            page:1,
            pages:0,
            total:0,
            choosedata:[],
            colltype:false,
            allType:false, // 全选
            ids:[], //选择删除id集合
            c_course:[],
            status:0,
            cctype:0,
            articleList:[],
        }
        this._change = this._change.bind(this);
        this._onSelect = this._onSelect.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        const {user} = nextProps

        if (user !== this.props.user) {
            const {collectCourse} = user
            const  {c_course} = this.state

            if(this.page === 1){

                this.page = collectCourse.page > 0 ? collectCourse.page  : 1
                this.pages = collectCourse.pages
                var cc_course:any= collectCourse.items

            } else {
                var cc_course:any = c_course.concat(collectCourse.items)
            }
    
            this.setState({
                page:collectCourse.page  > 0 ? collectCourse.page : 1,
                pages:collectCourse.pages,
                total:collectCourse.total,
                c_course:cc_course
            })
        }
       
    }

    componentWillMount () { 
        // this.getCollectCourse();
    }

    componentDidMount () { 
        this.getCollectCourse();
    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    


    handleChange(e){
        this.setState({
            choosedata:e.detail.value
        })
    }


    //单选
    _change(item,index){
        
        var that = this 

        const {c_course,ids,status,articleList} = that.state

        if(status != 3){
            const id = c_course[index].courseId 
            if(ids.indexOf(id) != -1){

                let index = ids.indexOf(id);
                ids.splice(index,1); //删除
    
            } else {
    
                ids.unshift(id); // 数组最前面
            }
        } else {
            const aid = articleList[index].articleId
            if(ids.indexOf(aid) != -1){

                let index = ids.indexOf(aid);
                ids.splice(index,1); //删除
    
            } else {
    
                ids.unshift(aid); // 数组最前面
            }
        }
        

        this.setState({
            ids:ids
        },()=>{
            this._judge();
        })
    }


    //单选判断是否选完
    _judge(){
        var that = this ;
        const {c_course,ids,articleList,status} = that.state;
        let judge:number[] = new Array();

        if(status != 3){
            for(var i = 0 ; i < c_course.length ; i++ ){
                judge.push(c_course[i].courseId);
                if(judge.sort().toString() == ids.sort().toString()){
                    this.setState({
                        allType:true
                    })
                } else {
                    this.setState({
                        allType:false
                    })
                }
            }
        } else {
            for(var i = 0 ; i < articleList.length ; i++ ){
                judge.push(articleList[i].articleId);
                if(judge.sort().toString() == ids.sort().toString()){
                    this.setState({
                        allType:true
                    })
                } else {
                    this.setState({
                        allType:false
                    })
                }
            }
        }

        

    }


    //全选
    _onAllselect(){
        var that = this
        const {c_course,ids,articleList,status} = that.state

        let allchoose:number[] = new Array()

        if(status != 3){
            for(var i = 0 ; i < c_course.length ; i++ ){
                allchoose.push(c_course[i].courseId);
                if(allchoose.sort().toString() == ids.sort().toString()){
                    this.setState({
                        ids:[],
                        allType:false,
                    })
                } else {
                    this.setState({
                        ids:allchoose,
                        allType:true
                    })
                }
            }
        } else {
            for(var i = 0 ; i < articleList.length ; i++ ){
                allchoose.push(articleList[i].articleId);
                if(allchoose.sort().toString() == ids.sort().toString()){
                    this.setState({
                        ids:[],
                        allType:false,
                    })
                } else {
                    this.setState({
                        ids:allchoose,
                        allType:true
                    })
                }
            }
        }
        

    }

    _colltype = () => {
        this.setState({
            colltype:!this.state.colltype
        })
    }


    // 课程收藏
    getCollectCourse(){
        var that = this;
        const {cctype,page} = that.state;
        this.props.getCollectCourse({
            cctype:cctype,
            page:page
        })
    }

    // 资讯 收藏
    _getCollectArticle(){
        var that = this;
        const {cctype,articleList} = that.state;

        api.get(inter.collectArticle,{
            ctype:cctype,
            page:this.page
        }).then((res)=>{
            let artList = res.data.data
            if(this.page == 1){
                var tList:any = artList.items
            } else {
                var tList:any = articleList.concat(artList.items);
            }

            that.setState({
                articleList:tList,
                page:artList.page ,
                pages:artList.pages,
                total:artList.total
            })
        })
    }


    _onDelete = () =>{

        var that = this
        let {ids,cctype,status} = that.state

        var course_id=ids.join(",")

        if(status != 3){
            api.post(inter.removeArtCollect,{
                ids:course_id,
                ctype:3
            }).then((res)=>{
                if(res.data.status){
                    api.get(inter.collectcourse,{
                        cctype:cctype,
                        page:1
                    }).then((res)=>{
                        if(res.data.status){
                            that.setState({
                                c_course:res.data.data.items,
                                allType:false,
                                colltype:false,
                                ids:[]
                            })
                        }
                    })
                    Taro.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000
                    })
                } else {
                    Taro.showToast({
                        title: '删除失败',
                        icon: 'flied',
                        duration: 2000
                    })
                }
            })
        } else {
            api.post(inter.removeArtCollect,{
                ids:course_id,
                ctype:11
            }).then((res)=>{
                if(res.data.status){
                    api.get(inter.collectArticle,{
                        ctype:cctype,
                        page:1
                    }).then((res)=>{
                        if(res.data.status){
                            that.setState({
                                articleList:res.data.data.items,
                                allType:false,
                                colltype:false,
                                ids:[]
                            })
                        }
                    })
                    Taro.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000
                    })
                } else {
                    Taro.showToast({
                        title: '删除失败',
                        icon: 'flied',
                        duration: 2000
                    })
                }
            })
        }

        
    }


     //详情页
    _oncourseDesc(item){
        if(item.ctype === 0) {
            Taro.navigateTo({
                url:menu.courseDesc+`?course_id=${item.courseId}` + '&courseName='+ percent2percent25(`${item.courseName}`)  + '&isback=0'
            })
        } else if(item.ctype === 1){
            Taro.navigateTo({
                url:menu.audioDesc +'?course_id='+ item.courseId+ '&audioName=' + percent2percent25(item.courseName)
            })
        } else if(item.ctype === 2){
            if(item.liveStatus === 2 && item.roomStatus === 4){
                Taro.navigateTo({
                    url:menu.courseDesc+`?course_id=${item.courseId}` + '&courseName='+ percent2percent25(`${item.courseName}`)  + '&isback=0'
                })
            } else {
                Taro.navigateTo({
                    url:menu.liveDesc+'?courseId='+ item.courseId+'&liveStatus='+ item.liveStatus + '&liveName=' + percent2percent25(item.courseName)
                })
            }
        } else if(item.ctype === 3){
            Taro.navigateTo({
                url:menu.grapWbdesc +`?course_id=${item.courseId}` + '&courseName='+ percent2percent25(`${item.courseName}`)
            })
        }
    }

    artDesc(article){
        Taro.navigateTo({
            url: menu.artDesc + '?articleId=' + article.articleId + '&articleName=' + percent2percent25(article.title)
        })
    }

    _onSelect(index){
        var that = this ;
        this.page = 1;

        if(index !== 3){
            that.setState({
                status:index,
                cctype:index,
                c_course:[],
                allType:false,
                colltype:false,
                ids:[]
            },()=>{
                that.getCollectCourse();
            })
        } else {
            that.setState({
                status:index,
                cctype:11,
                c_course:[],
                articleList:[],
                allType:false,
                colltype:false,
                ids:[]
            },()=>{
                that._getCollectArticle();
            })
        }
        
    }

    loaddata(){
        var self = this

        const {page,cctype} = self.state


        self.props.getCollectCourse({
            cctype:cctype,
            page:page
        })

        
    }

    onPullDownRefresh(){
        var self = this
        const {status} = self.state
        this.page = 1;

        if(status !== 3){
            self.setState({
                page:1,
                c_course:[]
            },()=>{
                self.loaddata();
                setTimeout(function () {
                    //执行ajax请求后停止下拉
                    Taro.stopPullDownRefresh();
                }, 1000);
            })
        } else {
            self.setState({
                page:0,
                articleList:[]
            },()=>{
                self._getCollectArticle();
                setTimeout(function () {
                    //执行ajax请求后停止下拉
                    Taro.stopPullDownRefresh();
                }, 1000);
            })
        }
        
    }

    onReachBottom(){
        var self = this;
        
        const {page,pages,cctype,status} = self.state

        if(status !== 3){
            if(page < pages){
                this.page = this.page + 1
                self.props.getCollectCourse({
                    cctype:cctype,
                    page:this.page
                })
            }
        } else {
            if(page < pages){
                this.page = this.page + 1
                self._getCollectArticle();
            }
        }
        
    }


    render () {
        const {c_course,ids,allType,colltype,status,articleList} = this.state
        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }  catch (e) {
            
        }
        
        return (
            <View className='collectwrap'>
                <View className='headwrap'>
                    <View className='pt_10 pb_10 pr_15 ' style={{textAlign:'right'}} onClick={this._colltype}>
                        <Text className='c33_label default_label fw_label'>管理收藏</Text>
                    </View>
                    <View className='atabs'>
                        <Tabs items={['视频', '音频' ,'直播','O2O']} atype={1} selected={status} onSelect={this._onSelect} />
                    </View>
                </View>
                <View style={{paddingTop:180+'rpx'}}>
                    {
                        status === 0 || status === 1 || status === 2 ?
                        <View>
                            {
                                c_course.length > 0 ? 
                                c_course.map((item:any,index)=>{
                                    const hasdata = ids.indexOf(item.courseId) > -1 ? true : false ;
                                    return(
                                        <View className='item d_flex fd_r  p_12 ' key={'collect'+ index} >
                                            {
                                                colltype ?
                                                <View className='radio_box d_flex jc_ct ai_ct' onClick={() => this._change(item,index)}>
                                                    <Image src={hasdata ?  asset.radio_full : asset.radio} className='radio' />
                                                </View>
                                            :null}

                                            <View onClick={this._oncourseDesc.bind(this,item)} className='d_flex fd_r col_1'>
                                                <Image src={item.courseImg} className='goods_cover' />
                                                <View className='d_flex fd_c ml_10 jc_sb col_1'> 
                                                    <View className='d_flex fd_c '>
                                                        <View className='item_text'>
                                                            <Text className='default_label c33_label fw_label'>{item.courseName}</Text>
                                                        </View>
                                                        <Text className='sm_label tip_label mt_5'>{item.pubTimeFt}</Text>
                                                    </View>
                                                    
                                                    <View className='d_flex fd_r ai_ct mt_5 '>
                                                        {
                                                            item.teacherId > 0 ?
                                                            <View className='d_flex fd_r ai_ct mr_10'>
                                                                <Image src={asset.per_icon} className='item_head_cover' />
                                                                <Text className='sm_label c33_label ml_5'>{item.teacherName}</Text>
                                                            </View>
                                                        :null}
                                                        <View className='view_play d_flex fd_r ai_ct mr_15'>
                                                            <Image src={asset.pay_icon} className='view_icon' />
                                                            <Text className='sm_label gray_label ml_5'>{learnNum(item.hit)}人</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        
                                        </View>
                                    )
                                })
                            :null}
                        </View>
                        :
                        <View className='findO2O' >
                            {
                                articleList.map((article:any,index)=>{
                                    const on = articleList.length  === index + 1
                                    const hasdata = ids.indexOf(article.articleId) > -1 ? true : false ;
                                    return(
                                        <View key={'o2o'+index} className='d_flex fd_r' style={{width:(windowWidth*0.92).toFixed(0) + 'px'}}>
                                            {
                                                colltype ?
                                                <View className='radio_sbox d_flex jc_ct ai_ct' onClick={() => this._change(article,index)}
                                                    style={{width:(windowWidth*0.08).toFixed(0) + 'px'}}
                                                >
                                                    <Image src={hasdata ?  asset.radio_full : asset.radio} className='radio' />
                                                </View>
                                            :
                                                <View style={{width:(windowWidth*0.08).toFixed(0) + 'px',height:20+'rpx'}}>
                                                    
                                                </View>
                                            }
                                            <View className='O2OItems'  style={on? {borderBottom:0+ 'rpx',width:(windowWidth*0.84).toFixed(0) + 'px'}:{width:(windowWidth*0.84).toFixed(0) + 'px'}}
                                                onClick={this.artDesc.bind(this,article)}
                                            >
                                                <Image className='O2OItem_cover'  src={article.articleImg} />
                                                <View className='findTip'>
                                                    <Text className='findTip_tit'>{article.title}</Text>
                                                    <Text className='findTip_date mt_5'>{article.pubTimeFt}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        
                                    )
                                })
                            }
                        </View>
                    }
                    
                </View>
                {
                    colltype ?
                    <View className='consbtn'>
                        <View className='d_flex fd_r jc_sb ai_ct pl_12 pr_5 pt_5'>
                            <View className='d_flex fd_r ai_ct ' onClick={()=>this._onAllselect()}>
                                <Image src={allType ?  asset.radio_full : asset.radio} className='radio' />
                                <Text className='lg_label c33_label pl_10'> 全选</Text>
                            </View>
                            {
                                ids.length > 0 ?
                                <View className='consdete'   onClick={this._onDelete}>
                                    <Text className='lg_label white_label'>删除</Text>
                                </View>
                                :
                                <View className='consdeted' >
                                    <Text className='lg_label white_label'>删除</Text>
                                </View>
                            }
                           
                        </View>
                        
                    </View>
                :null}
            </View>
        )
    }
}


export default MyCollect as ComponentClass