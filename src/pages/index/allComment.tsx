import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'

import  '../../config/theme.css';
import './allComment.less';
import { connect } from '@tarojs/redux'
import { homeType } from '../../constants/homeType'
import Tabs from '../../components/Tabs'

import Eval from '../../components/Eval'
import Auth from '../../components/Auth'

import { 
    getCourseCommt,
    getComments,
} from '../../actions/home'
import inter from '../../config/inter'
import api from '../../services/api'



type PageStateProps = {
    home: homeType,
    getCourseCommt:Array<{}>,
    getComments:Array<{}>,
}

type PageDispatchProps = {
    getCourseCommt:(object) => any,
    getComments:(object) => any,
}
type PageOwnProps = {}

type comment = {
    avatar:string,
    childList:Array<{}>,
    commentId:number,
    content:string,
    contentId:number,
    ctype:string,
    galleryList:Array<{}>,
    isAdmin:number,
    parentId:number,
    praise:number,
    pubIp:string,
    pubTime:number,
    pubTimeFt:string,
    score:number,
    userId:number,
    username:string ,
    like:boolean
}

type PageState = {
    userId:number,
    status:number,
    course_id:number,
    sort:number,
    page:number,
    pages:number,
    total:number,
    comment:Array<comment>,
    type:number,
    ctype:number,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface AllComment {
    props: IProps;
}

@connect(({home}) => ({
    home:home
}),(dispatch) => ({
    getCourseCommt(object){
        dispatch(getCourseCommt(object))
    },
    getComments(object){
        dispatch(getComments(object))
    }
}))

class AllComment extends Component<PageDispatchProps & PageStateProps, PageState>  {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '全部留言',
        enablePullDownRefresh: true
    }

    constructor () {
        super(...arguments)
        this.state = {
            userId:0,
            status:0,
            course_id:0,
            sort:0,
            page:0,
            pages:0,
            total:0,
            comment:[],
            type:0,
            ctype:0,
        }

        this._onSelect = this._onSelect.bind(this);
        this._parse = this._parse.bind(this);
    }


    componentWillReceiveProps (nextProps) {
        var that = this
        const {comment,type} = that.state
        const {home} = nextProps

        if (home !== this.props.home) {
            const {courseCommt,articleCommt,allComment} = home

            if(type === 0 ){
                const {pages,page,total} = courseCommt
                var tList:any = comment.concat(courseCommt.items)
                this.setState({
                    page:page + 1,
                    pages:pages,
                    total:total,
                    comment:tList
                })
            } else 
            if(type === 1) {
                const {pages,page,total} = allComment
                var tList:any = comment.concat(allComment.items)
    
                this.setState({
                    page:page + 1,
                    pages:pages,
                    total:total,
                    comment:tList
                })
            }
            
        }
        

    }


    componentWillMount () {
        var that = this
        const {course_id,type,ctype} = this.$router.params
        that.setState({
            course_id:parseInt(course_id),
            type:parseInt(type),
            ctype:parseInt(ctype)
        })
    }

    componentDidMount () {
        var that = this;
        const {type} = this.state;

        that.getUser();
        if(type === 0 ){
            that.getCourseCommt();
        } else if(type === 1) {
            that.getComment()
        }
       

    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    // 获取跟人信息 判断是否登录
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


    getCourseCommt(){
        var that = this;
        var {course_id,page,sort,ctype} = that.state
        console.log(ctype)
        this.props.getCourseCommt({
            course_id:course_id,
            sort:sort,
            page:page,
        })
        // that.props.getComments({
        //     content_id:course_id,
        //     ctype:ctype,
        //     sort:sort,
        //     page:page,
        // })
    }

    getComment(){
        var that = this;
        var {course_id,page,sort,ctype} = that.state
        that.props.getComments({
            content_id:course_id,
            ctype:ctype,
            sort:sort,
            page:page,
        })
    }


    _onSelect(index){
        var that = this;
        var {course_id,page,sort,type} = that.state
        this.setState({
            page:page,
            status:index,
            sort:index,
            comment:[]
        },()=>{
            if(type === 0 ){
                this.props.getCourseCommt({
                    course_id:course_id,
                    sort:index,
                    page:1,
                })
            } else if(type === 1) {
                that.getComment()
            } 
        })
    }

    _parse(val,comIdx){
        var that = this
        const {comment,userId} = that.state

        if(userId > 0){
            if(val.like){
                api.post(inter.RemoveLike+val.commentId).then((res)=>{
                    if(res.data.status){
                        comment[comIdx].like = !comment[comIdx].like 
                        comment[comIdx].praise = comment[comIdx].praise - 1
                        that.setState({
                            comment:comment
                        })
                    }
                })
            } else {
                api.post(inter.PublishLike + val.commentId).then((res)=>{
                    if(res.data.status){
                        comment[comIdx].like = !comment[comIdx].like 
                        comment[comIdx].praise = comment[comIdx].praise + 1
                        that.setState({
                            comment:comment
                        })
                    }
                })
            }
        } else {
            that.refs.auth.doLogin();
        }
        
    }

    onPullDownRefresh(){
        var self = this
        const { type } = self.state
        self.setState({
            page:0,
            comment:[]
        },()=>{
            if(type === 0){
                self.getCourseCommt();
            } else if(type === 1){
                self.getComment()
            }
            
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }

    onReachBottom(){
        var self = this;
        
        let {page,pages,type} = this.state
        if(page < pages){
            self.setState({
                page:page + 1
            },()=>{
                if(type === 0){
                    self.getCourseCommt();
                } else if(type === 1) {
                    self.getComment()
                } 
            })
        } 
    }

    onViewImg(galleryList,index){
        let urls:string[] = new Array() ;
        for(let i = 0 ; i < galleryList.length; i++){
            urls.push(galleryList[i].fpath)
        }

        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: urls[index], // 当前显示图片的http链接，默认是第一个
        }).then((res)=>{
            // console.log(res)
        })
    } 

    // 登录后回调
    _onLoadCallBack(){
        var that = this ;

        that.getUser();
    }

    render () {

        const {status,comment} = this.state

        return (
            <View className='comtwrap  '>
                <View className='atabs'>
                    <Tabs items={['最新', '最热']} atype={1} selected={status} onSelect={this._onSelect} />
                </View>
                <View className='lh40'></View>
                <View className = 'pl_12 pr_12'>
                    {
                        comment.map((comm ,index)=>{
                            return(
                                <View key={'comm' + index}>
                                    <Eval  
                                        comIdx={index}
                                        val = {comm} 
                                        type = {1}
                                        onParse={this._parse}
                                    />
                                </View>
                            )
                        })
                    }
                </View>
                
                <Auth ref={'auth'} success={() => {
                    this._onLoadCallBack()
                }}/>
            </View>
        )
    }
}


export default AllComment as ComponentClass