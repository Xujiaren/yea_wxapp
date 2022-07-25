import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { View ,Text, Image,Picker} from '@tarojs/components'

import menu from '../../../config/menu';
import asset from '../../../config/asset'
import inter from '../../../config/inter'


import {liveday,time_ms,subNumTxt,learnNum,percent2percent25} from '../../../utils/common'
import api from '../../../services/api'




import  '../../../config/theme.css';
import './livePback.less'

type PageState = {
    liveList:Array<{}>,
    userId:number,
    liveResetTime:number,
    show_pannel:boolean,
    stype:Array<{}>,
    stype_idx:number,
}

class livePback extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '直播回放 ',
        navigationBarBackgroundColor:'#FFF',
        enablePullDownRefresh: true
    }
    page: number;

    constructor () {
        super(...arguments)

        this.page = 0 ;
        
        this.state = {
            liveList:[],
            userId:0,
            liveResetTime:0,
            show_pannel:false,
            stype:['全部','今天','昨天'],
            stype_idx:0,
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


     //直播数据
     getCourseLive(){
        var that = this;
        api.get(inter.CourseLive,{
            status:0,
            sort:0,
            page:0,
        }).then((res)=>{
            if(res.data.status){
                that.setState({
                    liveList:res.data.data.items.concat(res.data.data.items)
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

    _onSexChange = (e) => {

    }


    // 下拉
    onPullDownRefresh(){
        var self = this

        self.page = 0 ;

        setTimeout(function () {
            //执行ajax请求后停止下拉
            Taro.stopPullDownRefresh();
        }, 1000);
    }



    render () {

        const {liveList,liveResetTime,show_pannel,stype,stype_idx} = this.state;

        return (
            <View className='root'>
                
                <View className='goodsBox'>
                    <View className='popularItem'>
                        <View
                            // scrollX
                            style={{height:'260rpx',overflowY:'auto'}}
                        >
                            <View className='popu_items d_flex'> 
                                {
                                    liveList.map((lives:any,index)=>{
                                        return(
                                            <View className='popu_item  p_15 bg_white circle_5 mb_15' 
                                                key={'item'+index}
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
                                                    <Text className='c33_label lg_label fw_label'>{lives.courseName.length>12?lives.courseName.slice(0,12)+'...':lives.courseName}</Text>
                                                    <View className='d_flex fd_r jc_sb pt_5 ai_ct'  >
                                                        <Text className='sm_label gray_label col_1'>{lives.summary.length>15?lives.summary.slice(0,15)+'...':lives.summary}</Text>
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


                                                <Image className='popu_cover' src={''} />
                                            </View> 
                                        )
                                    })
                                }
                            </View> 
                        </View>   
                    </View>
                </View>

                <View className='sect_boxs d_flex pl_15 pr_15'>
                    <View className='sect_item d_flex fd_r ai_ct jc_sb  bg_white col_1 pl_25 pr_10'>
                        <Picker className='col_1 pb_5' mode='selector' value={stype_idx} range={stype} onChange={this._onSexChange}>
                            <Text className='default_label tip_label '>{stype[stype_idx]}</Text>
                        </Picker>
                        <Image src={asset.arrow_right}  className='icon_right' />
                    </View>
                    <View className='sect_item d_flex fd_r ai_ct jc_sb ml_25 bg_white col_1 pl_25 pr_10'>
                        <Picker className='col_1 pb_5' mode='selector' value={stype_idx} range={stype} onChange={this._onSexChange}>
                            <Text className='default_label tip_label '>{stype[stype_idx]}</Text>
                        </Picker>
                        <Image src={asset.arrow_right}  className='icon_right' />
                    </View>

                    <View className='sect_item d_flex fd_r ai_ct jc_sb ml_25 bg_white col_1 pl_25 pr_10'>
                        <Picker className='col_1 pb_5' mode='selector' value={stype_idx} range={stype} onChange={this._onSexChange}>
                            <Text className='default_label tip_label '>{stype[stype_idx]}</Text>
                        </Picker>
                        <Image src={asset.arrow_right}  className='icon_right' />
                    </View>

                </View>
                

                <View className='pt_20 pl_20 pr_20'>
                    {
                        liveList.map((lives:any,index)=>{
                            return(
                                <View className='liveBoxs d_flex fd_r mb_15' key={'item'+index}
                                    onClick={()=>Taro.navigateTo({
                                        url:menu.courseDesc+`?course_id=${lives.courseId}` + '&courseName='+ percent2percent25(`${lives.courseName}`) + '&isback=1'
                                    })}
                                >
                                    <Image src={lives.courseImg}  className='liveCover'/>
                                    <View className='d_flex fd_c jc_sb ml_10 col_1'>
                                        <View className='d_flex fd_c'>
                                            <Text className='default_label c33_label fw_label'>{subNumTxt(lives.courseName,12)}</Text>
                                            <View className='recom_bg'>
                                                <Text className='sm_label tip_label'>{lives.teacherName}{lives.teacher.honor.length > 0 && lives.teacher.honor !== undefined  ? '·' :''}{lives.teacher.honor}</Text>
                                            </View>
                                        </View>
                                        <View className='d_flex fd_r jc_sb ai_ct'>
                                            {
                                                lives.integral > 0 ?
                                                <Text className='red_label sm_label'>{lives.integral}学分</Text>
                                                :
                                                <Text className='red_label sm_label'>免费</Text>
                                            }
                                            <Text className='sm_label tip_label'>{learnNum(lives.hit)}</Text>
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

export default livePback as ComponentClass
