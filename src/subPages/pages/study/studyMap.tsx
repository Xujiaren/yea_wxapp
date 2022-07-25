import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View ,Text, ScrollView,Image} from '@tarojs/components'

import menu from '../../../config/menu';
import Auth from '../../../components/Auth'

import inter from '../../../config/inter'
import api from '../../../services/api'

import  '../../../config/theme.css';
import './studyMap.less'


type PageState = {
    load:boolean
    topNum:number,
    level:number,
    MapList:Array<{
        child:Array<{}>,
        data:Array<{}>,
        level:string,
        levelName:string
    }>,
    branch:Array<{
        finish:boolean
    }>,
    isUnlock:boolean,
}

class studyMap extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '学习地图'
    }
    doLogin:any = null
    showPanel:boolean = true

    constructor () {
        super(...arguments)
        this.state = {
            load:false,
            topNum:0,
            level:1,
            MapList:[],
            branch:[{
                finish:false
            },{
                finish:false
            },{
                finish:false
            },{
                finish:false
            }],
            isUnlock:false
        }
        this.doLogin = ()=>{}
    }

    componentWillMount () {   
             
    }

    componentDidMount () { 
        var that = this
        that.setState({
            load:true
        },()=>{
            that.getScollBottom();
        })
    }

    componentWillUnmount () {
        
    }
    
    componentDidShow () { 
        var that = this
        that._getStudyMap();
    }
    componentDidHide () { }

    // _onLoadCallBack = ()=>{
    //     this.getUser()
    // }
    
    onAuth = (ref)=>{
        this.doLogin = ref
        this.getUser(ref)
    }
    getUser = (ref)=>{
        var that = this
        api.get(inter.User).then(res=>{
            if(res.data.status){
                let {isAuth} = res.data.data
                if(!isAuth&&that.showPanel)
                Taro.showModal({
                    title: '提示',
                    content: '认证用户方可开启学习地图',
                    showCancel:true,
                    success: function (res) {
                        that.showPanel = false
                        if (res.confirm) {
                            const url =`${menu.realAuth}`
                            Taro.redirectTo({ url })
                        } else if (res.cancel) {
                            Taro.navigateBack()
                        }
                        
                    }
                })
            }else{
                if(ref) ref.doLogin()
                else if (that.doLogin) that.doLogin.doLogin()
            }
        })
    }
    // 学习地图
    _getStudyMap(){

        var that =this
        const {} = that.state

        api.get(inter.StudyMap)
        .then((res)=>{
            if(res.data.status){
                that.setState({
                    MapList:res.data.data
                })
            }
        })
    }

    getScollBottom(){
        // var that = this ;
        // const {level,MapList} = that.state
        // if(level === 0){
        //     Taro.pageScrollTo({
        //         scrollTop: 667 * (MapList.length)
        //     })
        // } else if(level === 1){
        //     Taro.pageScrollTo({
        //         scrollTop: 667 * (MapList.length)
        //     })
        // }
        
    }


    _onPass(topic,type,isLock){

        var that = this 


        // 解锁， 或者 继续答题 finishStatus  0:未解锁   1:解锁了未完成  2:完成了
        if(isLock){
            Taro.showToast({
                title:'该关卡未关联任务',
                icon:'none',
                duration:1000
            })
            return
        }
        if(topic.finishStatus === 0){
            api.get(inter.LevelJudge + topic.levelId)
            .then((res)=>{
                if(res.data.status){
                    const levelDesc = res.data.data 

                    if(levelDesc.lockStatus === 2){
                        Taro.showToast({
                            title:'开始闯关',
                            icon:'none',
                            duration:1000
                        })
                        setTimeout(function () {

                            if(topic.contentSort === 0){
                                if(topic.paperId>0&&!topic.paperDTO.finish){
                                    Taro.navigateTo({
                                        url:menu.studyAnswer + '?paper_id=' + topic.paperId + '&levelId=' + topic.levelId
                                    })
                                }else{
                                    if(topic.courseId > 0){
                                        Taro.navigateTo({
                                            url:menu.courseDesc +`?course_id=${topic.courseId}` + '&levelId=' + topic.levelId
                                        })
                                    }
                                }
                            } else if(topic.contentSort === 1) {
                                if(topic.courseDTO.finish&&topic.paperId > 0){
                                    Taro.navigateTo({
                                        url:menu.studyAnswer + '?paper_id=' + topic.paperId + '&levelId=' + topic.levelId
                                    })
                                } else {
                                    Taro.navigateTo({
                                        url:menu.courseDesc +`?course_id=${topic.courseId}` + '&levelId=' + topic.levelId
                                    })
                                }
                            }
                        }, 1000);

                    } if(levelDesc.lockStatus === 0){
                        Taro.showToast({
                            title:'未达到关卡等级',
                            icon:'none',
                            duration:1000
                        })
                    } else if(levelDesc.lockStatus === 1){
                        Taro.showToast({
                            title:'上一关卡任务未完成',
                            icon:'none',
                            duration:1000
                        })
                    }

                }
            })
        } else {

            if(topic.contentSort === 0){
                if(topic.courseDTO.finish&&topic.paperId>0){
                    Taro.navigateTo({
                        url:menu.studyAnswer + '?paper_id=' + topic.paperId + '&levelId=' + topic.levelId   +`?course_id=${topic.courseId}`
                    })
                } else {
                    Taro.navigateTo({
                        url:menu.courseDesc +`?course_id=${topic.courseId}` + '&levelId=' + topic.levelId
                    })
                }
            } else if(topic.contentSort === 1) {
                
                if(topic.paperDTO.finish){
                    Taro.navigateTo({
                        url:menu.courseDesc +`?course_id=${topic.courseId}` + '&levelId=' + topic.levelId
                    })
                } else {
                    Taro.navigateTo({
                        url:menu.studyAnswer + '?paper_id=' + topic.paperId + '&levelId=' + topic.levelId +`?course_id=${topic.courseId}`
                    })
                }
            }
        }
    }
    
    render () {
        if (!this.state.load) return null;

        const {MapList,branch,isUnlock} = this.state

        MapList.reverse()

        var rpx ;
        var heightrpx = 350;

        Taro.getSystemInfo({
            success:function(res){
                rpx = res.windowWidth / 375 
            }
        })


        let level_s = "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/5e22b36e-f1f9-4593-a52a-f600fb7c0b40.png"
        let level_s_m = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/057eccd7-f710-4025-bd5a-35073001f85a.png'
        let level_s_m_l = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/f2b4740d-fd96-4d9c-b2ab-cedf55dc801b.png'


        let level_m = "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/0e94ff66-6d2c-4b37-bd59-48e120e7f65f.png"
        let level_m_m = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1583589d-91b5-4c32-b1a4-7fa766bac20f.png'
        let level_m_m_l = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/bc456bf2-fce5-4fa7-865b-6b7139c5f8eb.png'


        let level_p = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/a186a5b3-1d6c-4965-8218-9b944c2c04b6.png'
        let level_p_m = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/f9445388-1c13-424d-8172-e9ba9581214d.png'
        let level_p_m_l = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/171700b2-9d6e-440a-b838-f179aa2adcf6.png'


        const hight_goal = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/43715a04-afb7-4fb4-a897-27f302566d45.png'

        const unlock = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/24190639-6591-421a-b79a-9072e7867371.png' 

        return (
            <View className='wrap'>
                <ScrollView
                    scrollY
                    scrollWithAnimation
                    enableBackToTop={true}
                    className='wrapScroll'
                >
                    {
                        MapList.map((mapItem,index)=>{
                            let backImg = ''
                            let classname = ''
                            let tit_size = 0
                            

                            if(mapItem.levelName.length < 5){
                                tit_size = 36
                            } else if( mapItem.levelName.length >= 5   && mapItem.levelName.length < 8){
                                tit_size = 28
                            }  else if(mapItem.levelName.length >= 8){
                                tit_size = 22
                            }

                            if((index + 3) % 3 === 0){
                                backImg = level_s
                                classname = 'wrapSenior'
                                
                            } else if((index + 2) % 3 === 0){
                                backImg = level_m
                                classname = 'wrapMiddle'
                                
                            } else if((index + 1) % 3 === 0){
                                backImg = level_p
                                classname = 'wrapPrimary'
                            }

                            

                            return(
                                <View key={'map' + index} className={classname}>
                                    <Image src={backImg}   mode='widthFix' />
                                    <View className='wrapbox'>
                                        {
                                            mapItem.data.map((sen:any,i)=>{
                                                let l_m = ''
                                                let l_m_l = ''
                                                if((index + 3) % 3 === 0){
                                                    l_m = level_s_m
                                                    l_m_l = level_s_m_l
                                                } else if((index + 2) % 3 === 0){
                                                    l_m = level_m_m
                                                    l_m_l = level_m_m_l
                                                } else if((index + 1) % 3 === 0){
                                                    l_m = level_p_m
                                                    l_m_l = level_p_m_l
                                                } 
                                                //不存在课程以及试卷
                                                let isLock = sen.courseId == 0&&sen.paperId == 0
                                                return(
                                                    <View className={'wrapbox_item p_item_' + (i+1)}  onClick={this._onPass.bind(this,sen,0,isLock)} key={'sen' + i}>
                                                        <Image src={sen.finishStatus === 0||isLock ? l_m_l : l_m} className='wrapbox_item_cover' />
                                                        {
                                                            sen.finishStatus !== 0 && !isLock? 
                                                            <Text className='white_label fw_label wrap_txt'>0{i+1}</Text>
                                                        :null}
                                                    </View>
                                                )
                                            })
                                        }
                                        <View className='goal_box'>
                                            <Image src={hight_goal} className='ultimate_goal' />
                                            <View className='goal_box_txts'>
                                                <Text className='white_label fw_label' style={{fontSize:tit_size + 'rpx'}}>{mapItem.levelName}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }


                </ScrollView>

                {
                    isUnlock ? 
                    <View className='lockLayer'>
                        <View className='box'>
                            <Image src={unlock}  style={{width:100 + 'px',height:100 + 'px'}} />
                        </View>
                    </View>
                    
                :null}
                <Auth ref={this.onAuth} success={()=>{ this.getUser(null) }}/>
            </View>
        )
    }
}

export default studyMap as ComponentClass