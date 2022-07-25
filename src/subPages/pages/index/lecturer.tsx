import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'

import { connect } from '@tarojs/redux'
import { homeType } from '../../../constants/homeType'
import { getTeacher} from '../../../actions/home'
import menu from '../../../config/menu'

import inter from '../../../config/inter'
import api from '../../../services/api'

import  '../../../config/theme.css';
import './lecturer.less'





type PageStateProps = {
    home: homeType,
    getTeacher:Array<{}>
}

type PageState = {
    items:Array<{
        content: string,
        course: number,
        follow: number,
        hit: number,
        honor: string,
        isFollow: boolean,
        level:number,
        teacherId: number,
        teacherImg: string,
        teacherName: string,
        userId: number,
    }>,
    page:number,
    pages:number,
    total:number,
    keyword:string,
}


type IProps = PageStateProps & PageDispatchProps & PageOwnProps

type PageDispatchProps = {
    getTeacher:(object) => any
}

type PageOwnProps = {}


interface Lecturer {
    props: IProps;
}


@connect(({home}) => ({
    home:home
}),(dispatch) => ({
    getTeacher (object) {
        dispatch(getTeacher(object))
    }
}))


class Lecturer extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '讲师列表',
        enablePullDownRefresh: true
    }
    page: number
    pages: number

    constructor () {
        super(...arguments)

        this.page = 0;
        this.pages = 0;

        this.state = {
            items:[],
            page:0,
            pages:0,
            total:0,
            keyword:'',
        }
    }


    componentWillReceiveProps (nextProps) {    

        const {home} = nextProps
        const {teacherList} = home
        const {items} = this.state
        if (home !== this.props.home) {

            if(this.page === 0) {
                this.page = teacherList.page
                this.pages = teacherList.pages
                var tList = teacherList.items
            } else {
                var tList:any= items.concat(teacherList.items)
            }
            
            this.setState({
                items:tList,
                page:teacherList.page ,
                pages:teacherList.pages,
                total:teacherList.total
            })
        }
    }

    componentWillMount () { 
        const { keyword } = this.$router.params
        const {items} = this.state
        if(keyword){
            api.get(inter.SearchSite,{
                keyword:keyword
            }).then(res=>{
                if(res.data.status){
                    let searchList = res.data.data
                    if(this.page === 0) {
                        this.page = searchList.teacher.page
                        this.pages = searchList.teacher.pages
                        var tList = searchList.teacher.items
                    } else {
                        var tList:any= items.concat(searchList.teacher.items)
                    }
                    
                    this.setState({
                        items:tList,
                        page:searchList.teacher.page ,
                        pages:searchList.teacher.pages,
                        total:searchList.teacher.total
                    })
                }
            })
        }
    }

    componentDidMount () {
        const { keyword } = this.$router.params
        var that = this
        if(!keyword){
            that.getTeacher()
        }
    }
    
    componentDidShow () { 
        this.page = 0;
        // this.getTeacher()
    }

    //获取老师数据
    getTeacher(){
        this.props.getTeacher({
            sort:0,
            page:0
        })
    }

    //关注老师
    _onFollow(lect,index){
        const that = this
        const {items} = that.state
        api.post(inter.PublishFollow+lect.teacherId).then((res)=>{
            if(res.data.status){
                Taro.showToast({
                    title: '关注成功',
                    icon: 'none'
                })
                items[index].isFollow = !items[index].isFollow
                that.setState({
                    items:items
                })
            } else {
                Taro.showToast({
                    title: '关注失败',
                    icon: 'none'
                })
            }
        })
    }
    
    //取消关注
    _offFollow(lect,index){
        const that = this
        const {items} = that.state
        api.post(inter.RemoveFollow+lect.teacherId).then((res)=>{
            if(res.data.status){
                Taro.showToast({
                    title: '取消成功',
                    icon: 'none'
                })
                items[index].isFollow = !items[index].isFollow
                that.setState({
                    items:items
                })
            } else {
                Taro.showToast({
                    title: '取消失败',
                    icon: 'none'
                })
            }
        })
    }


    // 下拉
    onPullDownRefresh(){
        var self = this
        self.setState({
            page:0,
            items:[]
        },()=>{
            self.getTeacher();
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }

    //上拉
    onReachBottom(){
        var self = this;
        
        const {page,pages} = this.state
        
        if(page < pages){
            this.page = this.page + 1
            self.props.getTeacher({
                sort:0,
                page:page+1
            })
        } 
    }

    
    handleStop(e){
        e.stopPropagation()
    }

    compare(prop) {
        return function (obj1, obj2) {
            var val1 = obj1[prop];
            var val2 = obj2[prop];
            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                val1 = Number(val1);
                val2 = Number(val2);
            }
            if (val1 > val2) {
                return -1;
            } else if (val1 < val2) {
                return 1;
            } else {
                return 0;
            }            
        } 
    }


    render () {
        const {items} = this.state
        items.sort(this.compare("follow"))

        return (
            <View className='lectwrap'>
                <View className='items'>
                    {
                        items.map((lect:any,index)=>{
                            let lectArray:string [] = new Array()
                            let lectString:string = lect.honor
                            if(lectString.indexOf('&') != -1){
                                lectArray.push(lectString.split('&')[0],lectString.split('&')[1])
                            } else {
                                lectArray.push(lect.honor)
                            }

                            return(
                                <View className='item mb_15' key={'lect'+index} >
                                    <View className='d_flex item_right ' 
                                        onClick={()=>Taro.navigateTo({url:menu.teachZone+ '?teacher_id=' +`${lect.teacherId}`})}
                                    >
                                        <View className='item_cover'> 
                                            <Image className='item_cover'  src={lect.teacherImg} />
                                        </View>
                                        <View className='d_flex fd_c jc_sb ml_10 col_1'>
                                            <View>
                                                <View className='d_flex fd_r jc_sb ai_ct'>
                                                    <Text className='lg_label black_label fw_label'>{lect.teacherName}</Text>
                                                    {
                                                        lect.isFollow ?
                                                        <View onClick={this.handleStop.bind(this)}>
                                                            <View className='focuson d_flex jc_ct ai_ct' 
                                                                onClick={this._offFollow.bind(this,lect,index)}
                                                            >
                                                                <Text className='red_label sm_label'>已关注</Text>
                                                            </View>
                                                        </View>
                                                        :
                                                        <View onClick={this.handleStop.bind(this)}>
                                                            <View className='focuson d_flex jc_ct ai_ct' 
                                                                onClick={this._onFollow.bind(this,lect,index)}
                                                            >
                                                                <Text className='red_label sm_label'>+关注</Text>
                                                            </View>
                                                        </View>
                                                    }
                                                </View>
                                                <View className='d_flex fd_c'>
                                                    {
                                                        lectArray.map((lectstr:any,index)=>{
                                                            return(
                                                                <Text className='default_label gray_label mt_5' style={{lineHeight:'30rpx',}} key={'lect' + index}>{lectstr}</Text>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            </View>
                                            <Text className='sm_label tip_label' style={{lineHeight:'24rpx',}}>共 {lect.course} 课</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                    
                </View>
                
            
            </View>
        )
    }
}


export default Lecturer as unknown as ComponentClass<PageOwnProps, PageState>