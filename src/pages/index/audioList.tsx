import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView,Text } from '@tarojs/components'

import Tabs from '../../components/Tabs'


import inter from '../../config/inter'
import api from '../../services/api'

import  '../../config/theme.css';
import './audioList.less'

type PageState = {
    userId:number,
    status:number,
    cateCourse:Array<{
        categoryId: number,
        categoryName: string,
        ctype: number,
        isDelete: number,
        sortOrder: number,
        status: number,
        child:Array<{
            categoryId:number
        }>
    }>,
    cateChid:Array<{
        categoryId: number,
        categoryName: string,
        ctype: number,
        isDelete: number,
        sortOrder: number,
        status: number,
        child:Array<{
            categoryId:number
        }>
    }>,
    cateChidId:number,
}

class audioList extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '音频分类'
    }

    constructor () {
        super(...arguments)
        this.state = {
            userId:0,
            status:0,
            cateCourse:[],
            cateChid:[],
            cateChidId:0, // 二级分类 child 中的 id
        } 
    }

    componentWillMount () {

    }

    componentDidMount () { 
        var that = this;
        that.getUser();
    }

    componentWillUnmount () {
       
    }
    
    componentDidShow () { 
        var that = this ;
        api.get(inter.ConfigCateCourse)
        .then(res=>{
            if(res.data.status){
                let cateCourse = res.data.data
                let cateChids = cateCourse[0].child[0]

                that.setState({
                    cateCourse:cateCourse,
                    cateChid:cateCourse[0].child,
                    cateChidId:cateChids.categoryId,
                })
            }
        })

    }
    componentDidHide () { }

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



    //一级分类选择
    _onSelect = (index) =>{
        var that = this ;
        const {cateCourse} = that.state
        let cateChid:any []  =  new Array();
        cateChid = cateCourse[index].child

        if(cateChid.length > 0){
            that.setState({
                cateChidId:cateChid[0].categoryId
            })
        } else {
            that.setState({
                cateChidId:0
            })
        }
        
        that.setState({
            status:index,
            cateChid:cateChid,
        })
    }

    // 二级分类选择
    _sectScate(c_cate,index){
        var that = this;
        const {cateChid} = that.state;
        that.setState({
            cateChidId:cateChid[index].categoryId
        })
    }
    
    render () {
        const {cateCourse,cateChid,cateChidId,status} = this.state
        let tabList:String []  =  new Array();
        for(let i = 0  ; i < cateCourse.length ; i++){
            tabList.push(cateCourse[i].categoryName)
        }

        return (
            <View className='audioWrap'>
                <View className='atabs'>
                    <Tabs items={tabList}  selected={status} onSelect={this._onSelect} type={0}  />
                </View>
                {
                    cateChid.length > 0 ?
                    <View className='d_flex cateSbox'>
                        {
                            cateChid.map((c_cate:any,index)=>{
                                let on = cateChidId === c_cate.categoryId 
                                return(
                                    <View className='pl_10 pr_10' key={'c_cate'+index} onClick={this._sectScate.bind(this,c_cate,index)}>
                                        <Text className={ on ? 'red_label sm_label' : 'gray_label sm_label' }>{c_cate.categoryName}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                :null}
                
            </View>
        )
    }
}

export default audioList as ComponentClass