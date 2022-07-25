import { ComponentClass } from 'react'
import Taro, { Component, saveImageToPhotosAlbum } from '@tarojs/taro'
import { View ,Text,Image} from '@tarojs/components'

import menu from '../../../../config/menu';
import asset from '../../../../config/asset';

import inter from '../../../../config/inter'
import api from '../../../../services/api'
import  '../../../../config/theme.css';
import './offlineSign.less'



type PageState = {
    squadId:number,
    bsquadId:number,
    O2oList:Array<any>,
    stype:number,
    page:number,
    pages:number,
    total:number,
    loadding:boolean,
    enrollNum:number,
    registeryNum:number,
    canApply:boolean,
    type:number,
    passStatus:number,
    canSign:boolean
}

class offlineSign extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '线下课程报名',
        enablePullDownRefresh: true
    }
    page: any;

    constructor () {
        super(...arguments)

        this.page = 0;
        this.page = 0;
        this.state = {
            squadId:0,
            bsquadId:0,
            O2oList:[],
            stype:0,
            page:0,
            pages:0,
            total:0,
            loadding:false,
            enrollNum:0,
            registeryNum:0,
            canApply:true,
            type:10,
            passStatus:10,
            canSign:true, // 已报名  true 可以报名
        }
    }

    componentWillMount () {
        var that = this 
        const {squadId} = that.$router.params

        that.setState({
            bsquadId: parseInt(squadId)
        })
    }

    componentDidMount () { 
        
        
    }

    componentWillUnmount () {

    }
    
    componentDidShow () { 
        var that = this;
        
        that._getO2o()
        that._studyStatus()
    }
    componentDidHide () { }



    // 状态
    _studyStatus(){
        var that = this 
        const {bsquadId} = that.state
        api.get(inter.studyStatus,{
            squadId: bsquadId
        }).then((res)=>{

            let studyData = res.data.data

            if(studyData.passStatus !== 2){
                Taro.showToast({
                    title:'请先通过在线考试！',
                    icon:'none',
                    duration:2000
                })
            }

            that.setState({
                passStatus:studyData.passStatus
            })
        })
    }


     // 线下报名
     _getO2o(){
        var that = this ;
        const {O2oList} = that.state;

        api.get(inter.o2olist,{
            stype:3,
            page:this.page
        }).then((res)=>{
            if(res.data.status){
                let oList = res.data.data;
                if(this.page === 0){
                    var tList:any = oList.items
                } else {
                    var tList:any = O2oList.concat(oList.items)
                }
                that.setState({
                    O2oList:tList,
                    page:oList.page ,
                    pages:oList.pages,
                    total:oList.total
                })

            }
        })
    }



    // 选择课程报名
    _selectCourse(course){

        var that = this;
        const {squadId,bsquadId} = that.state;
        var nowTime = (new Date()).getTime();


        if(squadId === course.squadId){
            that.setState({
                squadId:0,
                enrollNum:0,
                registeryNum:0,
                type:10,
            })
        } else {
            api.get(inter.o2oDesc + course.squadId,{
            }).then((res)=>{
                let o2odesc = res.data.data
                that.setState({
                    canSign:o2odesc.canSign
                })
            })
            that.setState({
                squadId:course.squadId,
                enrollNum:course.enrollNum,
                registeryNum:course.registeryNum,
                canApply:course.canApply,
            },()=>{
                let type = 0 ;

                if(nowTime < course.beginTime * 1000){
                    type = 4 // 未开始
                } else if(course.endTime * 1000 > nowTime && nowTime > course.beginTime * 1000){
                    if(course.enrollNum <= course.registeryNum){
                        type = 2 // 人数已满
                    } 

                    if(course.canApply){
                        type = 1  // 已报名
                    }

                } else if(course.endTime * 1000 < nowTime)  {
                    type = 3 // 已截止
                }
                that.setState({
                    type:type
                })
            })
        }
    }
    

    // 下拉刷新
    onPullDownRefresh(){
        var that = this;
        Taro.showNavigationBarLoading()
        this.page = 0 ;
        that.setState({
            O2oList:[],
            page:0,
            loadding:false
        },()=>{
            that._getO2o();
            setTimeout(function () {
                Taro.stopPullDownRefresh();
                Taro.hideNavigationBarLoading()
            }, 1000);
        })
    }

    //上拉
    onReachBottom(){
        var self = this;
        
        const {page,pages} = self.state
        
        if(page < pages){
            this.page = this.page + 1
            this._getO2o();
        }  else {
            self.setState({
                loadding:true
            })
        }
    }


    // 提交报名 
    _onSubmittip(){

        var that = this;
        const {passStatus} = that.state


        if(passStatus === 2){
            Taro.showModal({
                title: '线下报名',
                content: '一旦报名，不能更改，是否提交',
                // showCancel:false,
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        that._onSubmit()
                    }
                }
            })
        } else {
            Taro.showToast({
                title:'请先通过在线考试！',
                icon:'none',
                duration:2000
            })
        }

       

    }

    
    // 线下报名
    _onSubmit(){
        var that = this ;
        const {squadId,passStatus,canSign,bsquadId} = that.state

        if(canSign){
            if(passStatus === 2){

                if(squadId > 0){
    
                    api.post(inter.SquadApplys + squadId,{
                        stype:3,
                        from_id:bsquadId,
                    }).then((res)=>{
                        if(res.data.status){
                            Taro.showToast({
                                title:'报名成功',
                                icon:'none',
                                duration:1000
                            })
                            Taro.navigateTo({url:menu.hasCourse + '?squadId=' + squadId +'&page='+ this.page})
                        } else {
                            let tip = '报名失败'
        
                            if(res.data.message === 'SQUAD_MAX_NUM'){
                                tip = '超出人数范围'
                            }
                            Taro.showToast({
                                title:tip,
                                icon:'none',
                                duration:1000
                            })
                        }
                    })
        
                } else {
                    Taro.showToast({
                        title:'请选择线下课程',
                        icon:'none',
                        duration:1000
                    })
                }
            } else {
    
                Taro.showToast({
                    title:'请先通过在线考试！',
                    icon:'none',
                    duration:2000
                })
    
            }
        } else {
            Taro.showToast({
                title:'您已报名同分类的线下培训班，你选择其他班级报名！',
                icon:'none',
                duration:1000,
            })
        }
        
    }
    
    render () {
        const {O2oList,squadId,type,canSign} = this.state


        return (
            <View className='wrap'>
                <View className='courses'>
                    {
                        O2oList.map((course,index)=>{
                            const on = squadId === course.squadId
                            return(
                                <View key={'course' + index} className='course d_flex fd_r ai_ct mt_20'
                                    onClick={this._selectCourse.bind(this,course)}
                                >
                                    <View className='d_flex fd_c col_1'>
                                        <Text className='lg_label c33_label mb_15 fw_label'>{course.squadName}</Text>
                                        <View className='d_flex fd_r mb_15'>
                                            <Text  className='default_label c33_label'>班级人数：{course.enrollNum}</Text>
                                            <Text  className='default_label c33_label pl_10'>已报名：{course.registeryNum}</Text>
                                        </View>
                                        <Text className='default_label gray_label mb_5'>报名时间：{course.applyBeginFt}至{course.applyEndFt}</Text>
                                        <Text className='default_label gray_label'>上课地点：{course.location}</Text>
                                    </View>
                                    <View className='iconCover'>
                                        <Image  src={on ? asset.radio_full : asset.radio} className='icon' />
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
                <View className='btm'>
                    {
                        type === 0 ?
                        <View className='submit'
                            onClick={this._onSubmittip}
                        >
                            <Text className='white_label default_label'>提交</Text>
                        </View>
                    :null}
                    {
                        type === 1 ?
                        <View className='submit lock'
                            onClick={()=>Taro.navigateTo({url:menu.hasCourse + '?squadId=' + squadId+'&page='+ this.page})}
                        >
                            <Text className='white_label default_label'>已报名</Text>
                        </View>
                    :null}
                    {
                        type === 2 ?
                        <View className='submit lock' onClick={()=>Taro.navigateTo({url:menu.hasCourse + '?squadId=' + squadId +'&page='+ this.page})}>
                            <Text className='white_label default_label'>人数已满</Text>
                        </View>
                    :null}
                    {
                        type === 3 ?
                        <View className='submit lock'>
                            <Text className='white_label default_label'>已截止</Text>
                        </View>
                    :null}
                    {
                         type === 4 ?
                         <View className='submit lock'>
                             <Text className='white_label default_label'>未开始</Text>
                         </View>
                    :null}
                    {
                        type === 10 ?
                        <View className='submit lock'>
                            <Text className='white_label default_label'>提交</Text>
                        </View>
                    :null}
                </View>
            </View>
        )
    }
}

export default offlineSign as ComponentClass