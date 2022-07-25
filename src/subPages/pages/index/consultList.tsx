import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image,Input} from '@tarojs/components'


import api from '../../../services/api'
import inter from '../../../config/inter'

import {percent2percent25} from '../../../utils/common'
import ConsultCourse from '../../../components/ConsultCourse'

import menu from '../../../config/menu';
import asset from '../../../config/asset';
import sub_asset from '../../config/asset'

import  '../../../config/theme.css';
import './consultList.less'



type PageState = {
    keyword:string,
    articleList:Array<{
        articleId: number,
        articleImg: string,
        atype: number,
        canShare: number,
        categoryId: number,
        comment: number,
        content: string,
        contentId: number,
        ctype: number,
        gallery: Array<{}>,
        hit: number,
        isTop: number,
        like: false,
        likeNum:number,
        pubTime: number,
        pubTimeFt: string,
        summary: string,
        teacherId: number,
        title: string,
        ttype: number,
    }>,
    page:number,
    pages:number,
    total:number,
    teacherId:number,
    type:number,
}

class consultList extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '资讯',
        enablePullDownRefresh: true
    }
    page: any;
    pages: number;
    itemtype: any;

    constructor () {
        super(...arguments)

        this.page = 0;
        this.pages = 0;

        this.itemtype = null;
        this.state = {
            keyword:'',
            articleList:[],
            page:0,
            pages:0,
            total:0,
            teacherId:0,
            type:0,
        }

        this._onSearch = this._onSearch.bind(this);
    }

    componentWillMount () {
        var that = this;
        const {teacher_id , type} = that.$router.params
        let teacherId = 0 ;
        if(teacher_id !== undefined){
            teacherId = parseInt(teacher_id)
        }
        that.setState({
            teacherId : teacherId,
            type:parseInt(type)
        })

        Taro.setNavigationBarTitle({
            title: parseInt(type) === 0 ? '资讯' : '领导风采',
        })
    }
    componentDidMount () { 
        var that = this;
        const {type} = that.state
        if(type === 1){
            that._articleTeacher();
        } else {
            that._articleList();
        }
        
    }
    componentWillUnmount () { }
    componentDidShow () { 
        const {keyword} = this.$router.params
        if(keyword){
            this.setState({
                keyword:keyword
            })
        }
    }
    componentDidHide () { }
    
    _articleTeacher(){
        var that = this;
        const {teacherId,page,articleList} = that.state;
        api.get(inter.ArticleTeacher + teacherId ,{
            page:this.page,
        }).then((res)=>{
                if(res.data.status){
                    let artList = res.data.data;

                    if(this.page === 0){
                        var tList = artList.items
                    } else {
                        var tList:any= articleList.concat(artList.items)
                    }

                    this.setState({
                        articleList:tList,
                        page:artList.page ,
                        pages:artList.pages,
                        total:artList.total
                    })
                } 
            })
    }

    _articleList(){
        var that = this 
        const {keyword,page,articleList} = that.state;
        api.get(inter.Article,{
            category_id:0,
            keyword:keyword,
            page:this.page,
        }).then((res)=>{
            console.log(res)
            if(res.data.status){
                let artList = res.data.data

                if(this.page === 0){
                    var tList = artList.items
                } else {
                    var tList:any= articleList.concat(artList.items)
                }

                this.itemtype = [];

                this.setState({
                    articleList:tList,
                    page:artList.page ,
                    pages:artList.pages,
                    total:artList.total
                })
            }
        })
    }


    // 咨询搜索
    _onSearch(){
        var that = this 
        const {keyword} = that.state;

        if(keyword.length > 0){


            api.get(inter.Article,{
                category_id:0,
                keyword:keyword,
                page:0,
            }).then((res)=>{
                if(res.data.status){
                    let artList = res.data.data
                    
                    var tList = artList.items

                    this.setState({
                        articleList:tList,
                        page:artList.page ,
                        pages:artList.pages,
                        total:artList.total
                    })
                }
            })


            api.post(inter.userLog,{
                log_type:1,
                type:0,
                device_id:0,
                intro:'资讯搜索',
                content_id:0,
                param:keyword,
                from:0,
            }).then((res)=>{
                console.log('ee')
            })

        } else {
            Taro.showToast({
                title:'请输入关键词',
                icon:'none',
                duration:2000
            })
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

    // 下拉
    onPullDownRefresh(){
        var self = this

        const {type} = self.state;

        this.page = 0 ;
        this.itemtype = null;
        self.setState({
            page:0,
            articleList:[]
        },()=>{
            if(type === 0){
                self._articleList();
            } else {
                self._articleTeacher();
            }
            
            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);
        })
    }

    //上拉
    onReachBottom(){
        var self = this;
        
        const {page,pages,type} = self.state
        
        if(page < pages){
            this.page = this.page + 1
            if(type === 0 ){
                self._articleList();
            } else {
                self._articleTeacher();
            }
            
        } 
    }



    render () {

        const {keyword,articleList,type} = this.state

        return (
            <View className='wrap'>
                {
                    type === 0 ?
                    <View className='head'>
                        <View  className='d_flex fd_r ai_ct pl_15 pr_15 border_bt pt_12 pb_12  searchhead' >
                            <View className='col_1 searchleft d_flex fd_r ai_ct'>
                                <Image src={asset.search} className='s_img' />
                                <Input
                                    className='default_label ml_10 col_1'
                                    placeholder='最新资讯'
                                    value={keyword}
                                    onConfirm={this._onSearch}
                                    onInput={(e)=>this.setState({keyword:e.detail.value})}
                                />
                            </View>
                            <View className='searchbtn' onClick={this._onSearch}>
                                <Text className='black_label default_label'>搜索</Text>
                            </View>
                        </View>
                    </View>
                :null}
                

                <View className='pl_15 pr_15' style={type === 0 ? { paddingTop:50+'px'}:{}}>
                    <View className='recomm pt_5' > 
                        
                        <View className='consult'>
                            {
                                articleList.map((recom,index)=>{
                                    return(
                                        <View key={'items' + index} className=' border_bt pb_10 pt_10'
                                            onClick={this._consultDesc.bind(this,recom)}
                                        >
                                            <ConsultCourse  articleList={recom} />
                                        </View>
                                    )
                                })
                            }
                        </View>

                        {
                            type === 0 && articleList.length === 0 && this.itemtype !== null ?
                            <View className='d_flex fd_c jc_ct mt_30 ai_ct'>
                                <Image src={sub_asset.pf_colllect} className='nocolllect' /> 
                                <Text className='sred_label sm_label mt_10'>没有找到相关内容</Text>
                            </View>
                        :null}
                    </View>
                </View>
            </View>
        )
    }
}

export default consultList as ComponentClass