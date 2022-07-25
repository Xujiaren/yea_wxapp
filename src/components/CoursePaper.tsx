import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text ,Image, ScrollView ,Swiper,SwiperItem,Video,Audio } from '@tarojs/components'

import '../config/theme.css'
import asset from '../config/asset'
import './CoursePaper.less'
import api from '../services/api';
import inter from '../config/inter';

const app = getApp();

type Props = {
    value?:any,
}

type State  = {
    value:{},
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
    isJump:boolean
}

export default class CoursePaper extends Component<Props,State> {

    static defaultProps = {
        value:{}
    }
    backgroundAudioManager: any

    constructor () {
        super(...arguments)
        this.state = {
            value:{},
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
            isJump:false
        }
    }

    componentWillMount () {
        this.backgroundAudioManager = app.globalData.backgroundPlayer;
    }
    componentDidMount () {
        const {topicList,testId} = this.props.value
        this.setState({ topicPaper:topicList,test_id:testId, })
    }
    componentWillUnmount () {
        this._parseAudio();
    }
    //音频开始
    _playAudio(){
        
        const {topicPaper,topic_index} = this.state
        this.backgroundAudioManager.coverImgUrl = 'qw';
        this.backgroundAudioManager.src = topicPaper[topic_index].url;
        this.backgroundAudioManager.title = 'qw';
        this.backgroundAudioManager.singer = 's';

        this.backgroundAudioManager.play();

        this.setState({
            isAudio:true
        })

    }


    // 音频暂停
    _parseAudio(){
        this.backgroundAudioManager.pause();
        this.setState({
            isAudio:false
        })
    }
    // 答题
    _getReport = (test_id)=>{

        api.get(inter.TestInfo,{
            testId:test_id
        }).then((res)=>{
            if(res.data.status){
                let report = res.data.data
                console.log(res)
                this.setState({
                    test_id:report.testId,
                    topicPaper:report.topicList,
                    correctNum:report.correctNum,
                    topicNum:report.topicNum,
                    doneNum:report.doneNum,
                },()=>{
                    if(!this.state.isJump){
                        if(report.topicList.length > 0 && Array.isArray(report.topicList)){
                            for(let i = 0 ; i < report.topicList.length ; i++){
                                if(report.topicList[i].userAnswer.answer == ''){
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

        })
    }
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
                    this._getReport(test_id)
                    // that.props.getStudyTopic({
                    //     category_id,
                    //     test_id
                    // })
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
                                                <View className='viewEword'>
                                                    <Text className={'item_txt'}>{qustion.optionLabel}</Text>
                                                </View>
                                            </View>
                                        :
                                            <View>
                                                {
                                                    _ok ? 
                                                        <View className='choosen_item' onClick={this._onAnswer.bind(this,qust.ttype,qust.topicId,0,index,qustion.optionId)}>
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
    render () {
        const {value, isHide, hide,duration,isAnswer,topicPaper,topic_index,count,left,total,worry,correctNum,topicNum,doneNum,answer_list,test_id} = this.state

        return (
            <View className='paper_wrap'>
                <View className='icon_wrap' style={{padding:'10rpx'}}>
                    <Image src={asset.dete_icon} className='close_icon' style={{width:'50rpx',height:'50rpx'}}/>
                </View>
                <ScrollView  scrollX scrollWithAnimation style={{paddingBottom:50+ 'px'}}>
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
                            onClick={this._onNext}
                        >
                            <Text>上一题</Text>
                        </View>
                        <View className='card_btn col_1'
                            onClick={this._onPrev}
                        >
                            <Text>下一题</Text>
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
        )
    }
    
}



