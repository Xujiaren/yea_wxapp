
import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, Label, Radio, Icon } from '@tarojs/components'

import asset from '../../../../config/asset'
import menu from '../../../../config/menu';
import inter from '../../../../config/inter'
import api from '../../../../services/api'




import '../../../../config/theme.css';
import './promotion.less'

type PageState = {
    teacherDTO: any,
    teachData: Array<{}>,
    status: number,
    teacher_apply_dates:string,
    ttyp:number,
    // list: Array<{}>,
}

class promotion extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp

    config = {
        navigationBarTitleText: '讲师晋级'
    }

    constructor() {
        super(...arguments)
        this.state = {
            teacherDTO: {},
            teachData: [],
            status: 0,
            teacher_apply_dates:'',
            ttyp:0,
            // list: [
            //     {
            //         value: '0',
            //         text: '讲师',
            //         checked: false
            //     },
            //     {
            //         value: '1',
            //         text: '初级讲师',
            //         checked: false
            //     },
            //     {
            //         value: '2',
            //         text: '中级讲师',
            //         checked: false
            //     },
            //     {
            //         value: '3',
            //         text: '高级讲师',
            //         checked: false
            //     },
            // ]
        }
    }

    componentWillMount() {
    }

    componentDidMount() {

        var that = this;
        that.getUser();
        that._teacherUpInfo();
        api.get(inter.Config)
        .then(res=>{
            that.setState({
                teacher_apply_dates:res.data.data.teacher_apply_dates
            })
        })
    }

    componentWillUnmount() {

    }

    componentDidShow() { }
    componentDidHide() { }


    // 我的
    getUser() {
        var that = this
        api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    let userData = res.data.data
                    that.setState({
                        teacherDTO: userData.teacherDTO,
                        ttyp:1
                    })
                }
            })
    }
    onLevel = (val) => {
        const { teacherDTO, teachData } = this.state
        console.log(val)
        api.post(inter.upLevel,{
                teacherLevle_id:val.level
            }).then((res)=>{
                console.log(res)
                Taro.showToast({
                    title:'提交中',
                    icon:'loading',
                    duration:1500
                })
                setTimeout(() => {
                    Taro.showToast({
                        title:'提交成功',
                        icon:'success',
                        duration:1000
                    })
                }, 1500);
            })
        // if(teacherDTO.level==0){
        //     api.post(inter.upLevel,{
        //         teacherLevle_id:1
        //     }).then((res)=>{
        //         console.log(res)
        //     })
        // }
        // if(teacherDTO.level==1){
        //     api.post(inter.upLevel,{
        //         teacherLevle_id:2
        //     }).then((res)=>{
        //         console.log(res)
        //     })
        // }
        // if(teacherDTO.level==2){
        //     api.post(inter.upLevel,{
        //         teacherLevle_id:3
        //     }).then((res)=>{
        //         console.log(res)
        //     })
        // }
    }

    _teacherUpInfo() {
        var that = this;
        api.get(inter.teacherUpInfo)
            .then((res) => {
                if (res.data.status) {
                    let teachInfo = res.data.data
                    that.setState({
                        teachData: teachInfo
                    })
                }
            })
    }

    // check=(val)=>{
    //     const{list}=this.state
    //     console.log(val)
    //     if(val.checked==false){
    //         var idx = {
    //             value: val.value,
    //             text: val.text,
    //             checked: true
    //         }
    //         this.setState({
    //             list:list.map(item=>item==val?{item:idx}:item)
    //         })idx
    //     }else{
    //         var idx = {
    //             value: val.value,
    //             text: val.text,
    //             checked: false
    //         }
    //         this.setState({
    //             list:list.map(item=>item==val?{item:idx}:item)
    //         })
    //     }
    // }


    render() {
        const { teacherDTO, teachData, status,teacher_apply_dates,ttyp } = this.state

        const promImg = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/46844174-4dab-4b6e-a026-3d27e8f5b7df.png'

        let levelName = '讲师'
        if (teacherDTO.level === 1) {
            levelName = '初级讲师'
        } else if (teacherDTO.level === 2) {
            levelName = '中级讲师'
        } else if (teacherDTO.level === 3) {
            levelName = '高级讲师'
        }
        //  else if (teacherDTO.level === 3) {
        //     levelName = '特级讲师'
        // }
         Date.prototype.format=function(fmt) { 
            var o = { 
            "M+" : this.getMonth()+1,                 //月份 
            "d+" : this.getDate(),                    //日 
            "h+" : this.getHours(),                   //小时 
            "m+" : this.getMinutes(),                 //分 
            "s+" : this.getSeconds(),                 //秒 
            "q+" : Math.floor((this.getMonth()+3)/3), //季度 
            "S" : this.getMilliseconds()             //毫秒 
            }; 
            if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
            }
            for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
            }
            return fmt; 
           }
        return (
            <View className='wrap'>
                <Image src={promImg} className='wrapImg' />
                {console.log(teacherDTO,teachData)}
                <View className='wrapbox'>
                    <View className='head'>
                        <Text className='lg_label white_label pl_25'>当前级别：<Text className='fw_label'>{levelName}</Text></Text>
                        {
                           ttyp?
                           <View className='btn'>聘期:{teacherDTO.beginTime!=0?new Date(teacherDTO.beginTime*1000).format("yyyy-MM-dd"):''} 至 {teacherDTO.endTime!=0?new Date(teacherDTO.endTime*1000).format("yyyy-MM-dd"):'不限期'}</View>
                           :null
                        }
                        
                    </View>
                    <View className='list'>
                        <View className='listHead d_flex'>
                            <View className='col_1'></View>
                            {/* <View className='col_1 text_c'>
                            <Text className='gray_label sm_label'>授课数</Text>
                        </View> */}
                            <View className='col_1 text_c'>
                                <Text className='gray_label sm_label'>授课课时</Text>
                            </View>
                            <View className='col_1 text_c'>
                                <Text className='gray_label sm_label'>学员满意度</Text>
                            </View>
                            <View className='col_1 text_c'>
                                <Text className='gray_label sm_label'>新课数</Text>
                            </View>
                            <View className='col_1 text_c'></View>
                        </View>
                        <View className='listWrap'>
                            {
                                teachData.map((teach: any, index) => {
                                    if(teacherDTO.level+1>=index)
                                    return (
                                        <View className='listWrap_list d_flex ai_ct' key={'teach' + index}>
                                            <View className='col_1 text_c'>
                                                <Text className='gray_label sm_label fw_label'>{teach.levelName}</Text>
                                            </View>
                                            {/* <View className='col_1 text_c'>
                                                <Text className='tip_label sm_label'>≥{teach.courseNum}</Text>
                                                <Image src={teacherDTO.courseNum >= teach.courseNum ? asset.lect_da : ''} className='lect_da' />
                                            </View> */}
                                            <View className='col_1 text_c'>
                                                <Text className='tip_label sm_label'>≥{teach.score/10}</Text>
                                                <Image src={teacherDTO.score >= teach.score ? asset.lect_da : ''} className='lect_da' />
                                            </View>
                                            <View className='col_1 text_c'>
                                                <Text className='tip_label sm_label'>≥{5*(teach.satisf/100)}</Text>
                                                <Image src={teacherDTO.satisf >= teach.satisf ? asset.lect_da : ''} className='lect_da' />
                                            </View>
                                            <View className='col_1 text_c'>
                                                <Text className='tip_label sm_label'>≥{teach.newCourse}</Text>
                                                <Image src={teacherDTO.newCourse >= teach.newCourse ? asset.lect_da : ''} className='lect_da' />
                                            </View>
                                            <View className='col_1 text_c'>
                                                {
                                                    // teacherDTO.courseNum >= teach.courseNum && teacherDTO.score >= teach.score && teacherDTO.satisf >= teach.satisf && teacherDTO.newCourse >= teach.newCourse ?
                                                    teach.storard == true ?
                                                        <View className='row'>
                                                            <View className='listWrap_btn'>
                                                                <Text className='smm_label white_label'>达标</Text>
                                                            </View>
                                                            {/* {
                                                                teach.nowLevel == false && teach.storard ==true&&teacherDTO.level<teach.level ?
                                                                 <View className='bt' onClick={this.onLevel.bind(this,teach)}>晋级</View>
                                                                 :null
                                                            } */}
                                                            
                                                        </View>
                                                        : null}
                                            </View>
                                        </View>
                                    )
                                })
                            }

                        </View>
                    </View>
                    <View className='mt_20 pl_20 pr_20'>
                        <Text className='c33_label sm_label'>备注：晋级结果待考核结束后由完美大学通知</Text>
                    </View>
                    <View className='mt_20 pl_20 pr_20'>
                        <Text className='c33_label sm_label'>考核周期：{teacher_apply_dates}</Text>
                    </View>
                </View>
                {/* {
                    status == 1 ?
                        <View className='level'>
                            <View className='tx'>请选择您想申请的等级</View>
                            {
                                list.map((item) => {
                                    return (
                                        <View className='ml mt_10'>
                                            <Label><Radio value={item.value} checked={item.checked} onClick={this.check.bind(this,item)}/>{item.text}</Label>
                                        </View>
                                    )
                                })
                            }
                            <View className='foot'>
                                <View className='bttn rgt' onClick={() => { this.setState({ status: 0 }) }}>取消</View>
                                <View className='bttn bg_orange'>确定</View>
                            </View>
                        </View>
                        : null
                } */}

            </View>
        )
    }
}

export default promotion as ComponentClass