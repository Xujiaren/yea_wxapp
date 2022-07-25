import { ComponentClass } from 'react'
import Taro, { Component} from '@tarojs/taro'
import { View, Text, Image,Video,Button} from '@tarojs/components'
import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import {percent2percent25} from '../../../../utils/common'
import Tabs from '../../../../components/Tabs'
import GrapTmp from '../../../../pages/index/grapTmp'
import '../home.less'
import './read.less'



type PageState = {
    course_id:number,
    courseName:string,
    courseDesc:any,
    prePaperList:any
}


class read extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '电子书',
	    enableShareAppMessage: true
    }
    page: number
    pages: number
    status:number
    constructor(props) {
        super(props)

        this.page = 0;
        this.pages = 0;
        this.status=0
        this.state = {
             course_id:0,
             courseName:'',
             courseDesc:{},
             prePaperList:{},
            }

    }

    componentDidMount() {
        const{course_id,courseName,ctype}=this.$router.params
        this.status=parseInt(ctype)
        this.setState({
            courseName:courseName,
            course_id:parseInt(course_id),
        })
        Taro.setNavigationBarTitle({
            title:courseName
        })
        console.log(course_id)
        api.get(inter.CourseDesc+parseInt(course_id))
        .then(res=>{
            console.log(res)
            this.setState({
                courseDesc:res.data.data,
                prePaperList:res.data.data.prePaperList[0]
            })
        })
    }
    componentDidShow() {
        
    }
    onShareAppMessage(ops){
        const{courseDesc}=this.state
        if (ops.from === 'button') { 
            
        }
        return {
            title: courseDesc.courseName,
            imageUrl: courseDesc.courseImg,
            success: function (res) {
                Taro.navigateBack({
                    delta:1
                })
            },
            fail: function (res) {
                console.log(res)
            }
        }
    }
    onPaper=()=>{
        const{courseDesc,prePaperList}=this.state 
        api.get(inter.examPaper+prePaperList.paperId,{
            lessDuration:3600
        }).then(res=>{
            console.log(res)
            let val = res.data.data
            if(val.paperId==0){
                Taro.showToast({
                    title:'该试卷没有题目',
                    icon:'none',
                    duration:1500
                })
            }else{
                Taro.navigateTo({
                    url:menu.doingExam+'?paper_id='+val.paperId+'&e_duration=' + val.lessDuration + '&paperName='+percent2percent25(val.paperName)+'&lessDuration='+val.lessDuration+'&ttyp=1'
                })
            }
          
        })
    }
    onReadDec=()=>{
        const{courseDesc}=this.state
        Taro.navigateTo({
            url:'readDec?courseId='+courseDesc.courseId
        })
    }
    render() {
        const{courseDesc}=this.state
        return (
            <View className='box row col'>
                <View className='pic bg_white row ai_ct jc_ct'>
                    <Button className='share' open-type='share' onShareAppMessage={this.onShareAppMessage}>
                        {/* <IconFont name={'fenxiang'} color={'#333333'} size={44} /> */}
                        <Image src={asset.shares} className='size_44'/>
                    </Button>
                    <View className='pic_box'>
                        <Image src={courseDesc.courseImg} className='picture' />
                    </View>
                </View>
                <View className='details row col'>
                    <View className='font_bold label_16'>{courseDesc.courseName}</View>
                    <View className='label_gray label_12 mt_5 lh'>
                       <GrapTmp content={courseDesc.content} ></GrapTmp>
                    </View>
                </View>
                <View className='foot row ai_ct jc_ct'>
                    {
                        this.status!=49?
                        <View className='btn bg_orange label_white' onClick={this.onReadDec}>开始阅读</View>
                        :
                        <View className='btn bg_orange label_white' onClick={this.onPaper}>开始考试</View>
                    }  
                </View>
            </View>
        )

    }
}

export default read as ComponentClass