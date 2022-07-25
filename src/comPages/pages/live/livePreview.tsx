import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { View ,Text, Image,Picker} from '@tarojs/components'

import ModalPannel from '../../../components/ModalPannel'

import menu from '../../../config/menu';
import asset from '../../../config/asset';
import inter from '../../../config/inter'


import {liveday,time_ms} from '../../../utils/common'
import api from '../../../services/api'


import  '../../../config/theme.css';
import './livePreview.less'

type PageState = {
    liveList:Array<{}>,
    userId:number,
    liveResetTime:number,
    show_pannel:boolean,
    stype:Array<{}>,
    stype_idx:number,
    ttype:Array<{}>,
    ttype_idx:number,

}


class livePreview extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '直播预告',
        navigationBarBackgroundColor:'#FFF',
    }

    constructor () {
        super(...arguments)
        this.state = {
            liveList:[],
            userId:0,
            liveResetTime:0,
            show_pannel:false,
            stype:['直播中','即将直播','已直播'],
            stype_idx:0, 
            ttype:['直播时间','预约人数'],
            ttype_idx:0,
        }
    }

    componentWillMount () {
    }

    componentDidMount () { 
        var that = this;
        that.getUser();
        that.getCourseLive();
    }

    componentWillUnmount () {

    }
    
    componentDidShow () { }
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


    //直播数据
    getCourseLive(){
        var that = this;

        const {stype_idx,ttype_idx} = that.state;

        api.get(inter.CourseLive,{
            status:stype_idx,
            sort:ttype_idx,
            page:0,
        }).then((res)=>{
            if(res.data.status){
                that.setState({
                    liveList:res.data.data.items
                })
            }
        })
    }

    handleStop = (e) => {
        e.stopPropagation()
    }

    _makelive = (lives) => {
        var that = this ;
        const {userId} = that.state;
        that.setState({
            liveResetTime:lives.resetTime
        })
        if(userId > 0 ){
            let tmpId = 'bH2whf7pY40T4COena9BrTi3jPQDM4Ls9CRaEW7ycqU'
            Taro.requestSubscribeMessage({
                tmplIds: [tmpId],
                success (res) {
                    if(res[tmpId] === 'accept'){
                        api.post(inter.bookCourse + lives.courseId,{
                            form_id:'wxapp'
                        }).then((res)=>{
                            if(res.data.status){
                                that.getCourseLive();
                                that.setState({
                                    show_pannel:true
                                })
                            }
                        })
                    } else {
                        console.log(' jijue')
                    }
                }
            })
            
        } else {
            that.refs.auth.doLogin();
        }
    }

    // 
    _onStype = (e) => {
        var that = this ;

        that.setState({
            stype_idx:e.detail.value
        },()=>{
            that.getCourseLive();
        })

    }

    // 
    _onTtype = (e) =>{
        var that = this;

        that.setState({
            ttype_idx:e.detail.value
        },()=>{
            that.getCourseLive();
        })

    }



    render () {
        const {liveList,liveResetTime,show_pannel,stype,stype_idx,ttype,ttype_idx} = this.state;

        return (
            <View className='root'>

                <View className='sect_boxs d_flex pl_15 pr_15'>
                    <View className='sect_item d_flex fd_r ai_ct jc_sb  bg_white col_1 pl_25 pr_10'>
                        <Picker className='col_1 pb_5' mode='selector' value={stype_idx} range={stype} onChange={this._onStype}>
                            <Text className='default_label tip_label '>{stype[stype_idx]}</Text>
                        </Picker>
                        <Image src={asset.arrow_right}  className='icon_right' />
                    </View>
                    <View className='sect_item d_flex fd_r ai_ct jc_sb ml_25 bg_white col_1 pl_25 pr_10'>
                        <Picker className='col_1 pb_5' mode='selector' value={ttype_idx} range={ttype} onChange={this._onTtype}>
                            <Text className='default_label tip_label '>{ttype[ttype_idx]}</Text>
                        </Picker>
                        <Image src={asset.arrow_right}  className='icon_right' />
                    </View>
                </View>

                {/* live */}
                {
                    liveList.length > 0 ?
                        <View className='live_box ml_15 mr_15 mt_15'>
                            {
                                liveList.map((lives:any,index)=>{
                                    return (
                                        <View className='p_15 bg_white circle_5 mb_15'  key={'live' + index}
                                            onClick={()=>Taro.navigateTo({url:menu.liveDesc+'?courseId='+ lives.courseId+'&liveStatus='+ lives.liveStatus + '&liveName=' + lives.courseName })}
                                        >
                                            <View className ='d_flex fd_r jc_sb pb_10 border_bt'>
                                                {
                                                    lives.liveStatus === 0  && lives.roomStatus === 0 ? 
                                                    <Text className='gray_label sm_label'>{liveday(lives.beginTime)}</Text>
                                                :null}
                                                {
                                                    lives.liveStatus === 1  && lives.roomStatus === 2 ? 
                                                    <Text className='red_label sm_label'>直播中</Text>
                                                :null}
                                                {
                                                    (lives.liveStatus === 2  && lives.roomStatus === 0) || (lives.liveStatus === 2  && lives.roomStatus === 1) ?
                                                    <Text className='gray_label sm_label'>休息中</Text>
                                                :null}
                                                {
                                                    lives.liveStatus === 2  && lives.roomStatus === 3 ? 
                                                    <Text className='red_label sm_label'>已结束</Text>
                                                :null}
                                                
                                                {
                                                    lives.liveStatus === 0 && lives.roomStatus === 0 ? 
                                                    <Text className='sm_label tip_label'>{lives.bookNum}人已预约</Text>
                                                    :
                                                    <Text className='sm_label tip_label'>{lives.hit}人在线</Text>
                                                }
                                            </View>
                                            <View className='pt_10'>
                                                <Text className='c33_label lg_label fw_label'>{lives.courseName}</Text>
                                                <View className='d_flex fd_r jc_sb pt_5 ai_ct'  >
                                                    <Text className='sm_label gray_label col_1'>{lives.summary}</Text>
                                                    {
                                                        lives.liveStatus === 0 && lives.roomStatus === 0 ?
                                                        <View>
                                                            {
                                                                lives.book ? 
                                                                
                                                                <View className ='live_btn ml_10'>
                                                                    <Text className='sm_label red_label}'>进入</Text>
                                                                </View>
                                                                :
                                                                <View onClick={this.handleStop.bind(this)}>
                                                                    <View className ='live_ofbtn ml_10'  onClick={this._makelive.bind(this,lives)} >
                                                                        <Text className='sm_label white_label}'>预约</Text>
                                                                    </View>
                                                                </View>
                                                            }
                                                        </View>
                                                        :
                                                        <View className = ' live_btn ml_10'>
                                                            <Text className ='sm_label red_label'>进入</Text>
                                                        </View>
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })
                            }
                        </View>
                :null}

                <ModalPannel title={'预约成功'} content={time_ms(liveResetTime)}  visible={show_pannel} onClose={()=>{ this.setState({show_pannel:false}) }}></ModalPannel>
            </View>
        )
    }
}

export default livePreview as ComponentClass