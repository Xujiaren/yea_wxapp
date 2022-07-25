
import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'


import Tabs from '../../../components/Tabs'
import Course from '../../../components/Course'
import GrapCourse from '../../../components/GrapCourse'
import api from '../../../services/api'

import inter from '../../../config/inter'
import menu from '../../../config/menu';

import  '../../../config/theme.css';
import './searchList.less'


type courseList = {
    categoryId: number,
    chapter: number,
    chapterList: Array<{}>,
    collect: boolean,
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
    pubTime: number,
    roomId: string,
    score: number,
    sortOrder: number,
    study: null,
    summary: string,
    teacher: null
    teacherId: number,
    teacherName:string,
    ttype: number,
} 


type  PageState = {
    keyword:string,
    ctype:number,
    status:number,
    sort:number,
    page:number,
    pages:number,
    total:number,
    items:Array<courseList>,
    btype:number
}

class SearchList extends Component<{}, PageState> {

    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '油葱学堂',
        enablePullDownRefresh: true
    }

    constructor () {
        super(...arguments)
        this.state = {
            keyword:'',
            ctype:0,
            btype:0,
            status:0,
            sort:0,
            page:0,
            pages:0,
            total:0,
            items:[]
        }
    }

    componentWillMount () {
        var that = this
        const {ctype,keyword,btype} = that.$router.params

        that.setState({
            ctype:parseInt(ctype),
            keyword:keyword,
            btype:parseInt(btype)
        })

    }

    componentDidMount () { 
        this._onLoadcourse()
    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    _onLoadcourse(){
        const {keyword,ctype,sort,page,items} = this.state
        api.get(inter.CourseSearchSite,{
            keyword:keyword,
            ctype:ctype,
            sort:sort,
            page:page
        }).then((res)=>{
            console.log(res)
            if(res.data.status){
                let searchList = res.data.data

                var fitems:any = items.concat(searchList.items)

                this.setState({
                    page:searchList.page,
                    pages:searchList.pages,
                    total:searchList.total,
                    items:fitems
                })
            }
        })
    }


    _onSelect = (index) =>{
        this.setState({
            page:0,
            status:index,
            sort:index,
            items:[]
        },()=>{
            this._onLoadcourse()
        })
    }

    onPullDownRefresh(){
        var self = this
        self.setState({
            page:0,
            items:[]
        },()=>{
            self._onLoadcourse();
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }

    onReachBottom(){
        var self = this;
        
        let {page,pages} = this.state

        if(page < pages){
            self.setState({
                page:page + 1
            },()=>{
                self._onLoadcourse();
            })
        } 
    }



   //详情页
   _oncourseDesc(c_vert){
       if(c_vert.ctype === 1){
            Taro.navigateTo({
                url:menu.audioDesc +'?course_id='+ c_vert.courseId+ '&audioName=' + c_vert.courseName
            })
       } else {
            Taro.navigateTo({
                url:menu.courseDesc+`?course_id=${c_vert.courseId}` + '&courseName='+ `${c_vert.courseName}` + '&isback=0'
            })
       }
        
    }

    //图文课程详情页
    _onGrapDesc(grap){
        Taro.navigateTo({
            url:menu.grapWbdesc +`?course_id=${grap.courseId}` + '&courseName='+ `${grap.courseName}`
        })
    }


    render () {
        const {status,items,btype,ctype} = this.state
        
        let val = '播放';
        if(ctype === 3) {
            val = '浏览';
        }

        return (
            <View className='searchwrap'>
                <View className='atabs'>
                        <Tabs items={['最新发布', '最多' + val ]} atype={1} selected={status} onSelect={this._onSelect} />
                </View>
                <View className='lh40'></View>
                {
                    btype === 0 ?
                    <View className='platevert'>
                        {
                            items.map((c_vert,index)=>{
                                return(
                                    <View key={'c_vert'+index} className='pt_10 pb_10 border_bt platevert_it' onClick={this._oncourseDesc.bind(this,c_vert)}>
                                        <Course courseList={c_vert} atype={1}/>
                                    </View>
                                    
                                )
                            })
                        }
                    </View>
                    :
                    <View className='grapwrap'>
                        <View className='items pl_15 pr_15'>
                            {
                                items.map((grap:any,index)=>{
                                    return(
                                        <View className='item border_bt pb_15 pt_15' key={'items' + index}
                                            onClick={this._onGrapDesc.bind(this,grap)}
                                        >
                                            <GrapCourse courseList={grap} />
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                }
                
            </View>
        )
    }
}

export default SearchList as ComponentClass