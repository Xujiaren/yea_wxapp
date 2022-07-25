import { ComponentClass } from 'react'
import Taro, { Component, Config,getApp } from '@tarojs/taro'
import { View, Text ,Image,Swiper,SwiperItem,Video,Audio, ScrollView} from '@tarojs/components'

import {countDown} from '../../../../utils/common'

import menu from '../../../../config/menu'

import Timer from '../../../components/Timer'

import api from '../../../../services/api';
import inter from '../../../../config/inter';
import asset from '../../../../config/asset'

import  '../../../../config/theme.css';
import './doingTopic.less'

import { connect } from '@tarojs/redux'
import { usersType } from '../../../../constants/usersType'

import { 
    getStudyTopic
} from '../../../../actions/user'


const app = getApp();

type PageStateProps = {
    user:usersType,
}

type PageDispatchProps = {
    getStudyTopic:(object)=>any
}

type PageOwnProps = {}

type PageState = {
    isHide:boolean,
    hide:string,
    category_id:number,
    show_pannel:string,
    topic_index:number,
    all: number,
    count: number,
    left: number,
    total: number,
    worry: number,
    topicPaper:Array<{
        analysis:string,
        answer: string,
        categoryId: number,
        cchapterId: number,
        chapterId: number,
        courseId: number,
        mtype: number,
        url:string,
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

    answer_list:Array<any>,
    duration:number,
    page:number,
    isAnswer:boolean,
    topic_id:number,
    test_id:number,
    correctNum:number,
    doneNum:number,
    topicNum:number,
    realAnswer:Array<any>
    isAudio:boolean,
    isJump:boolean,
    examTitle:string,
    examImg:string,
    less:number,
    id:number,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface DoingTopic {
    props: IProps;
}

@connect(({user})=>({
    user:user
}),(dispatch)=>({
    getStudyTopic(object){
        dispatch(getStudyTopic(object))
    }
}))


class DoingTopic extends Component<{}, PageState>  {
    
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '测试',
        navigationBarBackgroundColor:'#ffffff',
        enablePullDownRefresh: true,
        backgroundColor:'#FAFAFA'
    }

    static card_icon:"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/9ae54da2-cec8-4a4d-9f48-5dad17d8d1af.png"
    timer: NodeJS.Timeout
    backgroundAudioManager: any

    constructor () {
        super(...arguments)
        this.state = {
            isHide:false,
            hide:'',
            show_pannel:'',
            category_id:0,
            all: 0,
            count: 0,
            left: 0,
            total: 0,
            worry: 0,
            topic_index:0,
            topicPaper:[],
            answer_list:[],
            duration:0,
            page:0,
            isAnswer:true,
            topic_id:0,
            test_id:0,
            correctNum:0, //做了多少道
            doneNum:0,
            topicNum:0,
            realAnswer:[],
            isAudio:false,
            isJump:false,
            examTitle:'',
            examImg:'',
            less:0,
            id:0
        }
        
        // this._renderTopic = this._renderTopic.bind(this);
        this._onCountDown = this._onCountDown.bind(this);

        
    }
   

    componentWillReceiveProps (nextProps) {
        const {user} = nextProps
        const {topicPaper} = user
        const {isJump} = this.state

        if(user !== this.props.user){


            this.setState({
                test_id:topicPaper.testInfo.testId,
                topicPaper:topicPaper.topicList,
                correctNum:topicPaper.testInfo.correctNum,
                topicNum:topicPaper.testInfo.topicNum,
                doneNum:topicPaper.testInfo.doneNum,
            },()=>{
                // this.timer = setInterval(() => this._onCountDown(), 1000);

                if(!isJump){
                    if(topicPaper.topicList.length > 0 && Array.isArray(topicPaper.topicList)){
                        for(let i = 0 ; i < topicPaper.topicList.length ; i++){
                            if(topicPaper.topicList[i].userAnswer.answer === ''){
    
                                this.setState({
                                    topic_index:i
                                })
    
                                break;
                            }
                        }
                    }
                }
                
            })
            
        }
    }

    componentWillMount () {
        var that = this ;
        const { categoryId ,test_id,examTitle,examImg} = this.$router.params

        that.setState({
            category_id:parseInt(categoryId),
            test_id:parseInt(test_id),
            examTitle:examTitle,
            examImg:examImg
        })

        this.backgroundAudioManager = app.globalData.backgroundPlayer;
    }
    componentDidMount () {
        var that = this 
        const {category_id,test_id} = that.state
        
        that._getCateInfo();
        that.props.getStudyTopic({
            category_id,
            test_id
        })

    }
    componentWillUnmount () {
        clearInterval(this.timer);
        this._parseAudio();
    }

   
    componentDidHide () {}
    
    onPullDownRefresh(){
        Taro.showNavigationBarLoading()
        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }

    // 得到题目分类做题情况
    _getCateInfo(){

        var that = this ;
        const {category_id} = that.state

        api.get(inter.StudyInfo + category_id)
        .then((res)=>{
            if(res.data.status){
                let studyInfo = res.data.data
                that.setState({
                    all: studyInfo.all,
                    count: studyInfo.count,
                    left: studyInfo.left,
                    total: studyInfo.total,
                    worry: studyInfo.worry,
                })
            }
        })
    }

    swiper_box = (props)=>{
        return
    }
    _onCountDown(){
        var that = this ;
        let {duration} = that.state

        duration++;

        that.setState({
            duration:duration
        })
    }

 // 上一题
    _onPrev(){
        var that = this;
        let {topic_index} = that.state;

        if (topic_index > 0) {
			topic_index--;
		}

		this.setState({
            topic_index: topic_index,
            realAnswer:[],
            isJump:true
        })  
        
        that._parseAudio();
    }


    //  下一题
    _onNext(){
        var that = this;
        let {topic_index,topicPaper} = that.state;

        if (topic_index < (topicPaper.length - 1)) {
			topic_index++;

			this.setState({
                topic_index: topic_index,
                isJump:true
			})
        } else if(topic_index == (topicPaper.length - 1)) {
            that.setState({
                isJump:true
            })
            Taro.showToast({
                title:'已是最后一题',
                icon:'none',
                duration:1000
            })
        }
        
        that.setState({
            realAnswer:[]
        })

        that._parseAudio();

    }

    // 选择答题卡中题目
    _selectCard(index,topic){

        var that = this ;
        that.setState({
            topic_index:index,
            isAnswer:true,
        })        
    }



    // 答题

    _onAnswer(ttype,topic_id,ctopic_id,index,optionId){
        

        var that = this
        const {answer_list,category_id,test_id,realAnswer} = that.state

        let answer_str = ''

        that.setState({
            isJump:true
        })

        if(ttype === 0 ||  ttype === 1){

            answer_str = optionId
            answer_list[0] = optionId
            realAnswer[0] = optionId

            api.post(inter.UserStudyAnswer + test_id,{
                topic_id:topic_id,
                answer:answer_str
            }).then((res)=>{
                if(res.data.status){
                    that.props.getStudyTopic({
                        category_id,
                        test_id
                    })
                }
            })
            
        } else if(ttype === 3){
            if(answer_list.indexOf(optionId) > -1){
                answer_list.splice(answer_list.indexOf(optionId),1)
                realAnswer.splice(answer_list.indexOf(optionId),1)
            } else {
                answer_list.push(optionId)
                realAnswer.push(optionId)
            }

            answer_list.sort();
            realAnswer.sort();

            answer_str = answer_list.sort().join(",");

        }

        that.setState({
            answer_list:answer_list,
            realAnswer:realAnswer,
            topic_id:topic_id,
        })

    }

    // 多选提交
    _mutiSibmit(){
        var that = this;
        const {answer_list,test_id,topic_id,category_id,realAnswer} = that.state 

        let answer_str = ''
        answer_str = realAnswer.sort().join(",");

        api.post(inter.UserStudyAnswer + test_id,{
            topic_id:topic_id,
            answer:answer_str
        }).then((res)=>{
            if(res.data.status){
                that.props.getStudyTopic({
                    category_id,
                    test_id
                })
            }
        })
    }

    //音频开始
    _playAudio(){
        var that = this
        const {topicPaper,topic_index} = that.state
        this.backgroundAudioManager.coverImgUrl = 'qw';
        this.backgroundAudioManager.src = topicPaper[topic_index].url;
        this.backgroundAudioManager.title = 'qw';
        this.backgroundAudioManager.singer = 's';

        this.backgroundAudioManager.play();

        that.setState({
            isAudio:true
        })

    }


    // 音频暂停
    _parseAudio(){
        var that = this
        that.backgroundAudioManager.pause();
        that.setState({
            isAudio:false
        })
    }



    // 练习
    _toTopic(){
        var that = this 
        const {all} = that.state

        if(all > 0){
            Taro.setNavigationBarTitle({title:'练习'})
            that.setState({
                isHide:true
            })
        } else {

            Taro.showToast({
                title:'暂无试题',
                icon:'none',
                duration:1000
            })

        }
    }


    // 提交
    _onSumit(){
        var that = this
        const {doneNum,topicNum,test_id,examTitle,examImg} = that.state

        let ishow = 0 ; // 默认不显示
        if(doneNum === topicNum){
            ishow = 1
        }

        Taro.navigateTo({url:menu.practiceResult+'?test_id=' + test_id + '&ishow=' + ishow  + '&examTitle=' + examTitle + '&examImg=' + examImg})

    }

    _renderTopic(){
        var that = this ;
        const {topic_index,answer_list,topicPaper,correctNum,topicNum,doneNum,isAudio} = that.state;
        let qust = topicPaper[topic_index]

        if(qust.ttype === 0 || qust.ttype ===1){
            return(
                <View className='topic_content_wrap' >
                    <View className='topic_type'>
                        <Text className='topic_type_title'>{qust.ttype === 0?'单选':'判断'}</Text>
                        <Text className='topic_type_num'><Text className='text_bold'>{topic_index+1}</Text>/{topicPaper.length}</Text>
                    </View>
                    <View className='topic_content'>
                        <View className='topic_title'><Text>{qust.title}</Text></View>

                        <View className='topic_box'>
                            {
                                qust.mtype === 1 ?
                                <Image src={qust.url} className='topic_box_pic' />
                            :null}
                            {
                                qust.mtype === 2 ?
                                <Video  
                                    src={qust.url}
                                    className='topic_box_vid'
                                    autoplay
                                    id='video'
                                /> 
                            :null}
                            {
                                qust.mtype === 3 ?
                                <View className = 'topic_box_aud d_flex fd_r ai_ct'>
                                    <View className='cmic_cover' onClick={isAudio ?  this._parseAudio : this._playAudio}> 
                                        <Image src={isAudio ? asset.cmic_beg  : asset.cmic_parse  } className='cmic_parse' />
                                    </View>
                                    <Text className='default_label c33_label pl_10'>音频</Text>
                                </View>
                            :null}
                        </View>
                        {
                            topicPaper[topic_index].optionList.map((qustion,index)=>{

                                let _on  = parseInt(answer_list[0]) === qustion.optionId

                                if(topicPaper[topic_index].userAnswer.answer.length > 0){
                                    _on = parseInt(topicPaper[topic_index].userAnswer.answer) === qustion.optionId
                                }
                                

                                let _ok:boolean  = parseInt( topicPaper[topic_index].answer) === qustion.optionId

                                return(
                                    <View key={index+'_index'}>
                                        
                                        { topicPaper[topic_index].userAnswer.answer == "" ? 
                                            <View className='choosen_item' onClick={this._onAnswer.bind(this,qust.ttype,qust.topicId,0,index,qustion.optionId)}>
                                                <View className={'item_icon'}>
                                                    <Text>{String.fromCodePoint(index+65)}</Text>
                                                </View>
                                                <View    className='viewEword'>
                                                    <Text className={'item_txt'}>{qustion.optionLabel}</Text>
                                                </View>
                                            </View>
                                        :
                                            <View>
                                                {
                                                    _ok ? 
                                                        <View className='choosen_item'>
                                                            <View className='item_onicon'>
                                                                <Text>{String.fromCodePoint(index+65)}</Text>
                                                            </View>
                                                            <View className='viewEword'>
                                                                <Text className='item_txt'>{qustion.optionLabel}<Text className='item_ontxt pl_10'>正确</Text></Text>
                                                            </View>
                                                        </View>
                                                        :
                                                        <View>
                                                            {
                                                                _on ?
                                                                <View className='choosen_item'>
                                                                    <View className='item_onerr'>
                                                                        <Text>{String.fromCodePoint(index+65)}</Text>
                                                                    </View>
                                                                    <View className='viewEword'>
                                                                        <Text className='item_txt'>{qustion.optionLabel}<Text className='error_txt pl_10'>错误</Text></Text>
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
                                                }
                                            </View>
                                        }
                                    </View>   
                                )
                            })
                        }
        
    
                        {
                            topicPaper[topic_index].userAnswer.answer !== ""  ?
                            <View className='answer_wrap'>
                                <View className='answer_title'><Text>解析</Text></View>
                                <Text className='answer_content'>{topicPaper[topic_index].analysis}</Text>
                            </View>
                        :null}
                        
                    </View>
                </View>
            )
        } else  if(qust.ttype === 3){
            return(
                <View className='topic_content_wrap' >
                    <View className='topic_type'>
                        <Text className='topic_type_title'>{'多选'}</Text>
                        <Text className='topic_type_num'><Text className='text_bold'>{topic_index+1}</Text>/{topicPaper.length}</Text>
                    </View>
                    <View className='topic_content'>
                        <View className='topic_title'><Text>{qust.title}</Text></View>
                        <View className='topic_box'>
                            {
                                qust.mtype === 1 ?
                                <Image src={qust.url} className='topic_box_pic' />
                            :null}
                            {
                                qust.mtype === 2 ?
                                <Video  
                                    src={qust.url}
                                    className='topic_box_vid'
                                    id='video'
                                /> 
                            :null}
                            {
                                qust.mtype === 3 ?
                                <View className = 'topic_box_aud d_flex fd_r ai_ct'>
                                    <View className='cmic_cover' onClick={isAudio ?  this._parseAudio : this._playAudio}> 
                                        <Image src={isAudio ? asset.cmic_beg  : asset.cmic_parse } className='cmic_parse' />
                                    </View>
                                    <Text className='default_label c33_label pl_10'>音频</Text>
                                </View>
                            :null}
                        </View>
                        {
                            topicPaper[topic_index].optionList.map((qustion,index)=>{
                                let on:boolean;
                                let ok:boolean;

                                let answer_str = topicPaper[topic_index].answer.split(",");

                                on = answer_list.indexOf(qustion.optionId)  > -1;

                                if(topicPaper[topic_index].userAnswer.answer.length > 0){
                                    on = topicPaper[topic_index].userAnswer.answer.split(",").indexOf(qustion.optionId.toString()) > -1
                                }



                                ok = answer_str.indexOf(qustion.optionId.toString()) > -1 ;


                                return(
                                    <View key={index+'_index'}>
                                        { 
                                            topicPaper[topic_index].userAnswer.answer == "" ? 

                                            <View className='choosen_item' onClick={this._onAnswer.bind(this,qust.ttype,qust.topicId,0,index,qustion.optionId)}>
                                                 <View className={on ? 'item_onicon' : 'item_icon'}>
                                                    <Text>{String.fromCodePoint(index+65)}</Text>
                                                </View>
                                                {
                                                    topicPaper[topic_index].userAnswer.answer == ""  ? 
                                                    <View    className='viewEword'>
                                                        <Text className={ on ? 'item_ontxt' : 'item_txt'}>{qustion.optionLabel}</Text>
                                                    </View>
                                                    :
                                                    <View className='viewEword'>
                                                        <Text className={ on ? 'item_ontxt' : 'item_txt'}>{qustion.optionLabel}</Text>
                                                    </View>    
                                                }
                                               
                                            </View>
                                            :
                                            <View>
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
                                                    : on ? 
                                                        <View className='choosen_item'>
                                                            <View className='item_onerr'>
                                                                <Text>{String.fromCodePoint(index+65)}</Text>
                                                            </View>
                                                            <View className='viewEword'>
                                                                <Text className='item_txt'>{qustion.optionLabel}<Text className='error_txt pl_10'>错误</Text></Text>
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
                                        }
                                    </View>
                                )
                            })
                        }
    
                        {
                            topicPaper[topic_index].userAnswer.answer != ""  ?
                            <View className='answer_wrap'>
                                <View className='answer_title'><Text>解析</Text></View>
                                <Text className='answer_content'>
                                    {topicPaper[topic_index].analysis}
                                </Text>
                            </View>
                        :null} 
                    </View>
                    {
                        topicPaper[topic_index].userAnswer.answer == ""  ?
                        <View className='submitBtn'>
                            <View className='Btn' onClick={this._mutiSibmit}>
                                <Text className='c33_label default_label'>确认提交</Text>
                            </View>
                        </View>
                        
                    :null}
                </View>
            )
        }

       
    }

    render () {
        const {isHide, hide,duration,isAnswer,topicPaper,topic_index,count,left,total,worry,correctNum,topicNum,doneNum,answer_list,test_id} = this.state

        let outside_box:any [] = new Array()
        for(let i = 0 ; i < topicPaper.length ; i+=15){
            outside_box.push(topicPaper.slice(i,i+15));
        }
        
        return (
            <View className='root'>  

            {   !isHide  ?
                <View className='intro'>
                    <View className='box_wrap'>
                        <Text className='title'>目前练习情况</Text>
                        <View className='item_wrap'>
                            <Text className='label'>未做题目</Text>
                            <Text className='value'>{left}</Text>
                        </View>
                        <View className='item_wrap'>
                            <Text className='label'>错题</Text>
                            <Text className='value'>{worry}</Text>
                        </View>
                        <View className='item_wrap'>
                            <Text className='label'>累计做题</Text>
                            <Text className='value'>{count}</Text>
                        </View>
                        <View className='item_wrap'>
                            <Text className='label'>已完成</Text>
                            <Text className='value'>{total}</Text>
                        </View>
                    </View>
                    <View className='btn' hoverClass='on_tap'
                        onClick={ this._toTopic }
                    >
                        <Text>开始答题</Text>
                    </View>
                </View>
            :
                <View>
                    <View className='head  d_flex fd_r ai_ct'>
                        <View className='d_flex fd_r ai_ct pl_20'>
                            <View className='col_1 text_c ' onClick={this._onNext}>
                                <Text>下一题</Text>
                            </View>
                            <View className='col_1 pl_20' onClick={this._onPrev}>
                                <Text className='col_1 text_c'>上一题</Text>
                            </View>
                        </View>
                        <View className='time_cost pr_20'>
                            <Timer />
                        </View>
                    </View>
                    <ScrollView  scrollX scrollWithAnimation style={{paddingBottom:50+ 'px',paddingTop:50+'px'}}>
                        {
                            topicPaper.length > 0 ?
                            <View className='topic_wrap pl_20 pr_20'>
                                {this._renderTopic()}
                            </View>
                        :null}
                    </ScrollView>
                    
                    
                    {/* 底部 */}
                    <View className='topic_menu'>
                        <View className='btn_wrap col_1'>
                            <View className='submit_btn col_1'
                                onClick = {this._onSumit}
                            >
                                <Text>交卷</Text>
                            </View>
                            <View className='card_btn col_1'
                                onClick={()=>this.setState({isAnswer:false})}
                            >
                                <Image className='card_icon' mode='aspectFit' src={DoingTopic.card_icon}/>
                                <Text>答题卡</Text>
                            </View>
                        </View>
                        
                        <View className='result_wrap'>
                            <View className='radius'></View>
                            <Text space='nbsp'>正确 {correctNum}</Text>
                            <View className='radius bg_orange'></View>
                            <Text space='nbsp'>错误  {doneNum - correctNum}</Text>
                        </View>
                       
                    </View>
                </View>  
            
            }
            

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
                            <Text space='nbsp' className='pannel_tips'>未做  {(topicPaper.length -  doneNum) < 0 ? 0 : (topicPaper.length -  doneNum)}</Text>
                            <View className='tips_wrap'>
                                <View className='disc'></View>
                                <Text className='pannel_tips' space='nbsp'>正确  {correctNum}</Text>
                            </View>
                            <View className='tips_wrap'>
                                <View className='disc bg_orange'></View>
                                <Text className='pannel_tips' space='nbsp'>错误  {doneNum - correctNum }</Text>
                            </View>
                            <Text className='gray_label'>{topic_index + 1}/{topicPaper.length}</Text>
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
                                {
                                    outside_box.map((ele,index)=>{
                                        return(
                                            <SwiperItem key={'_swiper_item' + index}>
                                                <View className='swiper_single_box'>
                                                    {
                                                        ele.map((_ele,idx)=>{
                                                            const on = index * 15 + idx === topic_index
                                                            return(
                                                                <View className='w_20' key={'ele'+ idx}>
                                                                    {
                                                                        _ele.userAnswer.answer == ""  ?
                                                                            <View className='swiper_item_wrap bg_white'
                                                                                style={on ? {borderColor:'#99D321'} : {}}
                                                                                key={index+'_the_item'}
                                                                                onClick={this._selectCard.bind(this,15*index + idx,_ele)}
                                                                            >
                                                                                <Text>{index * 15 + idx + 1 }</Text>
                                                                            </View>
                                                                            : _ele.userAnswer.isCorrect === 0 ?
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
                                        )
                                    })
                                }
                            </Swiper>
                        </View>
                    </View>
                </View>

            </View>
        )
    }
}

export default DoingTopic as ComponentClass
