

import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text ,Image,Swiper,SwiperItem} from '@tarojs/components'

import {countDown} from '../../../../utils/common'

import  '../../../../config/theme.css';
import './paperAnalysis.less'
import menu from '../../../../config/menu'
import api from '../../../../services/api';
import inter from '../../../../config/inter';

import { connect } from '@tarojs/redux'
import { usersType } from '../../../../constants/usersType'

import { 
    getExanPaper
} from '../../../../actions/user'

type PageStateProps = {
    user:usersType,
}

type PageDispatchProps = {
    getExanPaper:(object)=>any
}

type PageOwnProps = {}

type PageState = {
    isAnswer:boolean,
    status:number,
    topicNum:number,
    categoryId:number,
    topic_index:number,
    answer_list:any,
    answer_lists:any,
    topicList:Array<{
        answer: string,
        analysis:string,
        categoryId: number,
        cchapterId: number,
        chapterId: number,
        courseId: number,
        mtype: number,
        optionList:Array<{
            num: number,
            optionId: number,
            optionLabel: string,
            optionType: number,
            topicId: number,
        }>,
        title: string,
        topicId: number,
        ttype: number,
        userAnswer:{
            answer: string,
            isCorrect: number,
            testId: number,
            topicAnswer: string,
            topicId: number,
            userId: number,
        },
        userId: number,
    }>,
    duration:number,
    page:number,
    paper_id:number,
    ttype:number,
    testId:number,
    paperIsExam:boolean,
    userAnswer:string,
    topicAnswer:string,
    correctNum:number,
}


type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface paperAnalysis {
    props: IProps;
}

@connect(({user})=>({
    user:user
}),(dispatch)=>({
    getExanPaper(object){
        dispatch(getExanPaper(object))
    }
}))



class paperAnalysis extends Component<{}, PageState>  {
    
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '试卷一',
        navigationBarBackgroundColor:'#ffffff',
        backgroundColor:'#FAFAFA'
    }
    timer: null;

    static  card_icon:string = "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/9ae54da2-cec8-4a4d-9f48-5dad17d8d1af.png"

    constructor () {
        super(...arguments)

       
        this.state = {
            status:2,
            topicNum:0,
            isAnswer:true,
            categoryId:0,
            paper_id:0,
            topic_index:0,
            answer_list:{},
            answer_lists:{},
            duration:0,
            topicList:[],
            page:0,
            ttype:0, // 0 单选 1判断 3 多选
            testId:0,
            userAnswer:'',
            topicAnswer:'',
            correctNum:0
        }
        
    }


    componentWillReceiveProps (nextProps) {

        const {user} = nextProps
        const {examPaper} = user

        if(user !== this.props.user){

            let answer_list = {}
            let answer_lists = {}

            examPaper.topicList.map((topic,index)=>{

                answer_list[topic.topicId] = null
                answer_lists[topic.topicId] = null

                answer_list[topic.topicId] =  topic.userAnswer.answer;
                answer_lists[topic.topicId] =  topic.userAnswer.topicAnswer;
            })



            this.setState({
                answer_lists:answer_lists,
                topicList:examPaper.topicList,
                topicNum:examPaper.topicNum,
                status:examPaper.status,
                answer_list:answer_list,
                correctNum:examPaper.correctNum
            })
        }
    }


    componentWillMount () {

        var that = this ;
        const { categoryId ,paper_id,paperIsExam,paperName} = this.$router.params


        Taro.setNavigationBarTitle({
            title: paperName,
        })
        
        that.setState({
            categoryId:parseInt(categoryId),
            paper_id:parseInt(paper_id)
        })

        

    }

    componentDidMount () {

        var that = this 
        const {paper_id} = that.state

        that.props.getExanPaper({
            paper_id,
            levelId:0
        })

    }

    componentWillUnmount () {
    }

    componentDidShow () {}
    componentDidHide () {}

    
    onPullDownRefresh(){
        Taro.showNavigationBarLoading()
        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }


    swiper_box = (props)=>{
        return
    }

    


    // 上一题
    _onPrev(){
        var that = this;
        let {topic_index} = that.state;

        if (topic_index > 0) {
			topic_index--;
		}

		this.setState({
			topic_index: topic_index
		})  
    }


    //  下一题
    _onNext(){
        var that = this;
        let {topic_index,topicList} = that.state;

        if (topic_index < (topicList.length - 1)) {
			topic_index++;

			this.setState({
				topic_index: topic_index
			})
		} else if(topic_index == (topicList.length - 1)) {
            Taro.showToast({
                title:'已是最后一题',
                icon:'none',
                duration:1000
            })
        }

    }

    // 答题

    _onAnswer(ttype,topic_id,ctopic_id,index,optionId){

        var that = this
        const {answer_list,answer_lists} = that.state

        if(ttype === 0 ||  ttype === 1){
            let answer_arr_num = (optionId + '' ).split(",").map(Number)
            answer_list[parseInt(topic_id)] = (optionId + '' ).split(",")
            answer_lists[parseInt(topic_id)] = answer_arr_num

        }  else if(ttype === 3 ) {
            if(answer_list[topic_id] === undefined || answer_list[topic_id] === "" ){
                let answer_ids:Array<any> = []
                if(answer_ids.indexOf(optionId) > -1){
                    answer_ids.splice(answer_ids.indexOf(optionId),1)
                } else {
                    answer_ids.push(optionId)
                }
                let answer_str:string =  answer_ids.join(",")
                
                answer_list[topic_id] = answer_str
                answer_lists[topic_id] = answer_ids

            } else {
                let  answer_ids  = answer_list[topic_id].split(",")
                if(answer_ids.indexOf(optionId) > -1){
                    answer_ids.splice(answer_ids.indexOf(optionId),1)
                } else {
                    answer_ids.push(optionId)
                }
                let answer_str =  answer_ids.join(",")

                let answer_ar = answer_ids.map(Number)

                answer_list[topic_id] = answer_str
                answer_lists[topic_id] = answer_ar

            } 
        }



        that.setState({
            answer_list:answer_list,
            answer_lists:answer_lists
        })



    }


    // 选择答题卡中题目
    _selectCard(index,topic){

        var that = this ;
        that.setState({
            topic_index:index,
            isAnswer:true,
        })        
    }


    //提交答案
    _onSubmit(){
        var that = this ;
        const { duration ,testId,paper_id,answer_lists} = that.state

        api.post(inter.UserExam +  testId ,{
            answer:JSON.stringify(answer_lists),
            // answer:answer_lists,
            duration:duration
        }).then((res)=>{
            if(res.data.status){
                Taro.showToast({
                    title:'提交成功',
                    icon:'none',
                    duration:1000
                })

                Taro.navigateTo({ url:menu.exerciseResult+'?type=exam' + '&paper_id=' + paper_id})
            }
        })
    }




    _renderTopic(){
        var that = this ;
        const {topic_index,answer_list,topicList,answer_lists} = that.state;


        let qust = topicList[topic_index]



        if(qust.ttype === 0 || qust.ttype === 1){
            return(
                <View className='topic_content_wrap' >
                    <View className='topic_type'>
                        <Text className='topic_type_title'>{qust.ttype === 0?'单选':'判断'}</Text>
                        <Text className='topic_type_num'><Text className='text_bold'>{topic_index+1}</Text>/{topicList.length}</Text>
                    </View>
                    <View className='topic_content'>
                        <View className='topic_title'><Text>{qust.title}</Text></View>
                        {
                            topicList[topic_index].optionList.map((qustion,index)=>{
                                
                                const on = answer_list[topicList[topic_index].topicId].split(",").indexOf(qustion.optionId + '') > -1
                                const ok = answer_lists[topicList[topic_index].topicId].split(",").indexOf(qustion.optionId + '') > -1
                             
                                return(
                                    <View key={index+'_index'}>
                                        {
                                            ok ?
                                            <View className='choosen_item'>
                                                <View className='item_onicon'>
                                                    <Text>{String.fromCodePoint(index+65)}</Text>
                                                </View>
                                                <View className='viewEword'>
                                                    <Text className='item_txt'>{qustion.optionLabel}<Text className='item_ontxt pl_10'>正确</Text></Text>
                                                </View>
                                            </View>
                                            :
                                            on ?
                                                <View className='choosen_item'>
                                                    <View className='item_onerr'>
                                                        <Text>{String.fromCodePoint(index+65)}</Text>
                                                    </View>
                                                    <View className='viewEword'>
                                                        <Text className='error_txt'>{qustion.optionLabel} <Text className='error_txt pl_10'>错误</Text></Text>
                                                    </View>
                                                    
                                                </View>
                                            :
                                                <View className='choosen_item'>
                                                    <View className='item_icon'>
                                                        <Text>{String.fromCodePoint(index+65)}</Text>
                                                    </View>
                                                    <View className='viewEword'>
                                                        <Text className='item_txt'>{qustion.optionLabel}</Text>
                                                    </View>
                                                </View>
                                        }    
                                    </View>
                                )
                            })
                        }
        
                        <View className='answer_wrap'>
                            <View className='answer_title'><Text>解析</Text></View>
                            <Text className='answer_content'>
                                {topicList[topic_index].analysis}
                            </Text>
                        </View>
                    </View>
                </View>
            )
        }  else  if(qust.ttype === 3){
            
            return(
                <View className='topic_content_wrap' >
                    <View className='topic_type'>
                        <Text className='topic_type_title'>{'多选'}</Text>
                        <Text className='topic_type_num'><Text className='text_bold'>{topic_index+1}</Text>/{topicList.length}</Text>
                    </View>
                    <View className='topic_content'>
                        <View className='topic_title'><Text>{qust.title}</Text></View>
                        {
                            topicList[topic_index].optionList.map((qustion,index)=>{
                                let on:boolean = false;
                                const ok = answer_lists[topicList[topic_index].topicId].split(",").indexOf(qustion.optionId + '')  > -1
                                if(answer_list[topicList[topic_index].topicId] !== undefined){
                                    on = (answer_list[topicList[topic_index].topicId]).indexOf(qustion.optionId + '')  > -1 ;
                                }
                                return( 
                                    <View key={index+'_index'}>
                                        {
                                            ok ?
                                            <View className='choosen_item'>
                                                <View className='item_onicon'>
                                                    <Text>{String.fromCodePoint(index+65)}</Text>
                                                </View>
                                                <View className='viewEword'>
                                                    <Text className='item_txt' style={{fontSize:30+'rpx'}}>{qustion.optionLabel}<Text className='item_ontxt pl_10'>正确</Text></Text>
                                                </View>
                                                
                                            </View>
                                            :
                                            on ?
                                            <View className='choosen_item'>
                                                <View className='item_onerr'>
                                                    <Text>{String.fromCodePoint(index+65)}</Text>
                                                </View>
                                                <View className='viewEword'>
                                                    <Text className='error_txt' style={{fontSize:30+'rpx'}}>{qustion.optionLabel}<Text className='error_txt pl_10'>错误</Text></Text>
                                                </View>
                                                
                                            </View>
                                            :
                                            <View className='choosen_item'>
                                                <View className='item_icon'>
                                                    <Text>{String.fromCodePoint(index+65)}</Text>
                                                </View>
                                                <View className='viewEword'>
                                                    <Text className='item_txt' style={{fontSize:30+'rpx'}}>{qustion.optionLabel}</Text>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                )
                            })
                        }
        
    
                        <View className='answer_wrap'>
                            <View className='answer_title'><Text>解析</Text></View>
                            <Text className='answer_content'>
                                {topicList[topic_index].analysis}
                            </Text>
                        </View>
                        
                    </View>
                </View>
            )
        }
    }




    render () {
        const {duration,topicList ,isAnswer,status,answer_list,paper_id,answer_lists,topic_index,correctNum} = this.state

        let outside_box:any [] = new Array()
        for(let i = 0 ; i < topicList.length ; i+=15){
            outside_box.push(topicList.slice(i,i+15));
        }


        return (
            <View className='root'>  
                <View className='pb_50'>
                    {
                        status === 0 || status === 1 ?
                        <View className='topic_wrap pl_20 pr_20'>
                            {this._renderTopic()}
                        </View>
                    :null}
                </View>
                
                {/* 底部 */}
                <View className='topic_menu'>
                        <View className='btn_wrap'>
                            <View className='btn_wrap'>
                                <View className='col_1 text_c  d_flex ai_ct jc_ct' onClick={this._onNext}>
                                    <Text>下一题</Text>
                                </View>
                                <View className='col_1 d_flex ai_ct jc_ct' onClick={this._onPrev}>
                                    <Text className='col_1 text_c '>上一题</Text>
                                </View>
                            </View>
                            <View className='card_btn'
                                onClick={()=>{this.setState({ isAnswer:false })}}
                            >
                                <Image className='card_icon' mode='aspectFit' src={paperAnalysis.card_icon}/>
                                <Text>答题卡</Text>
                            </View>
                        </View>
                    </View>

                {/* 弹窗显示答题情况 */}

                
                <View className='answer_pannel_wrap'
                    hidden={isAnswer}
                >
                    <View className='layerpannel' onClick={()=>this.setState({isAnswer:true})}></View>
                    <View className='pannel'
                        onClick={(e)=>{ e.stopPropagation() }}
                    >
                        <View className='pannel_head'>
                            <Text className='pannel_head_title'>答题卡</Text>
                            {/* <Text space='nbsp' className='pannel_tips'>未做  20</Text> */}
                            <View className='tips_wrap'>
                                <View className='disc'></View>
                                <Text className='pannel_tips' space='nbsp'>正确  {correctNum}</Text>
                            </View>
                            <View className='tips_wrap'>
                                <View className='disc bg_orange'></View>
                                <Text className='pannel_tips' space='nbsp'>错误  { topicList.length - correctNum}</Text>
                            </View>
                            <Text className='gray_label'>{topic_index+1}/{topicList.length}</Text>
                        </View>
                        <View className='swiper_wrap'>
                            <Swiper
                                className='swiper'
                                easing-function='linear'
                                interval={1000}
                                indicatorDots
                                displayMultipleItems={1}
                                autoplay={false}
                                vertical={false}
                                indicatorColor='#f0f0f0'
                                indicatorActiveColor='#c3c3c3'
                            >
                                {outside_box.map((ele,index)=>(
                                    <SwiperItem key={ele+'_swiper_item'}>
                                        <View className='swiper_single_box'>
                                            {
                                                ele.map((_ele,idx)=>{
                                                    let on:boolean = false
                                                    if(Object.keys(answer_lists).length > 0){
                                                        on = answer_lists[_ele.topicId]  !== undefined
                                                    }

                                                    return(
                                                        <View className='w_20' key={'ele'+ idx}>
                                                            {
                                                                _ele.userAnswer.isCorrect === 0 ?
                                                                <View className='swiper_item_wrap bg_orange' key={index+'_the_item'}
                                                                    onClick={this._selectCard.bind(this,15*index + idx,_ele)}
                                                                >
                                                                    <Text>{index * 15 + idx + 1 }</Text>
                                                                </View>
                                                                :
                                                                <View className='swiper_item_wrap bg_green' key={index+'_the_item'}
                                                                    onClick={this._selectCard.bind(this,15*index + idx,_ele)}
                                                                >
                                                                    <Text>{index * 15 + idx + 1 }</Text>
                                                                </View>
                                                            }
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </SwiperItem>
                                ))}
                            </Swiper>
                        </View>
                    </View>
                </View>

            </View>
        )
    }
}

export default paperAnalysis as ComponentClass
