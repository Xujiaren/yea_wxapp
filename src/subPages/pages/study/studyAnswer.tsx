import { ComponentClass } from 'react'
import Taro, { Component,getApp} from '@tarojs/taro'
import { View ,Text,Image,Video} from '@tarojs/components'

import menu from '../../../config/menu';
import inter from '../../../config/inter'
import asset from '../../../config/asset'
import api from '../../../services/api'

import {countDown} from '../../../utils/common'

import { connect } from '@tarojs/redux'
import { usersType } from '../../../constants/usersType'

import { 
    getExanPaper
} from '../../../actions/user'



import  '../../../config/theme.css';
import './studyAnswer.less'

const app = getApp();

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
    duration:number,
    page:number,
    paper_id:number,
    ttype:number,
    testId:number,
    paperIsExam:boolean,
    topicStaus:number,
    isAudio:boolean,
    percentage:number,
    levelId:number,
    course_id:number
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface studyAnswer {
    props: IProps;
}

@connect(({user})=>({
    user:user
}),(dispatch)=>({
    getExanPaper(object){
        dispatch(getExanPaper(object))
    }
}))

class studyAnswer extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '闯关答题'
    }
    timer: null;
    backgroundAudioManager: any;

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
            duration:60,
            topicList:[],
            page:0,
            ttype:0, // 0 单选  3 多选
            testId:0,
            paperIsExam:true,
            topicStaus:0, // 考试中
            isAudio:false,
            percentage:0,
            levelId:0,
            course_id:0,
        }

        this._onCountDown = this._onCountDown.bind(this);
    }

    componentWillReceiveProps (nextProps) {

        const {user} = nextProps
        const {examPaper} = user
        console.log(user,'????')
        const {topicStaus} = this.state

        if(user !== this.props.user){

            let answer_list = {}
            let answer_lists = {}

            examPaper.topicList.map((topic,index)=>{


                answer_list[topic.topicId] = null
                answer_lists[topic.topicId] = null

                answer_list[topic.topicId] =  ''
                answer_lists[topic.topicId] = ''

            })

            this.setState({
                topicList:examPaper.topicList,
                topicNum:examPaper.topicNum,
                status:examPaper.status,
                testId:examPaper.testId,
                answer_list:answer_list,
                answer_lists:answer_lists
            },()=>{
                if(topicStaus === 0 ){
                    this.timer = setInterval(() => this._onCountDown(), 1000);
                }
            })
        }
    }

    componentWillMount () {
        var that = this;

        const {paper_id,levelId,course_id} = that.$router.params
        that.setState({
            paper_id:parseInt(paper_id),
            levelId:parseInt(levelId),
            course_id:parseInt(course_id)
        })
        if(levelId)
            api.get(inter.LevelStatus,{levelId}).then((res)=>{
                if(res.data.status){
                    const {paperDTO} = res.data.data
                    if(paperDTO){
                        that.setState({ duration:parseInt(paperDTO['duration'])||60 })
                    }
                }
            })
            
        this.backgroundAudioManager = app.globalData.backgroundPlayer;
    }

    componentDidMount () { 

        var that = this 
        const {paper_id,levelId} = that.state

        that.props.getExanPaper({
            paper_id,
            levelId
        })
    }

    componentWillUnmount () {
        var that = this
        clearInterval(this.timer);

        that._parseAudio();
    }
    
    componentDidShow () { }


    _onCountDown(){
        var that = this ;
        let {duration} = that.state

        duration--;

        if(duration === 0 ){
            that.setState({
                topicStaus:1
            })
            clearInterval(this.timer);

            Taro.showModal({
                title: '考试',
                content: '考试时间到',
                showCancel:false,
                success: function (res) {
                    if (res.confirm) {
                        that._onSubmit()
                    }
                }
              })
        }

        that.setState({
            duration:duration
        })
    }
    //音频开始
    _playAudio(){
        var that = this
        const {topicList,topic_index} = that.state
        this.backgroundAudioManager.coverImgUrl = '1';
        this.backgroundAudioManager.src = topicList[topic_index].url;
        this.backgroundAudioManager.title = '考题音频';
        this.backgroundAudioManager.singer = '未知';

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

    // 下一题
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

        that._parseAudio();
    }

    _onAnswer(ttype,topic_id,ctopic_id,index,optionId){
        var that = this
        const {answer_list,answer_lists} = that.state


        if(ttype === 0 ||  ttype === 1){
            let answer_arr_num = (optionId + '' ).split(",").map(Number)
            answer_list[parseInt(topic_id)] = (optionId + '' ).split(",")
            answer_lists[parseInt(topic_id)] = answer_arr_num

        } else if(ttype === 3 ) {
            if(answer_list[topic_id] === undefined || answer_list[topic_id] === "" ){
                let answer_ids:Array<any> = []

                if(answer_ids.indexOf(optionId + '') > -1){
                    answer_ids.splice(answer_ids.indexOf(optionId+''),1)
                } else {
                    answer_ids.push(optionId + '')
                }
                let answer_str:string =  answer_ids.join(",")
                
                answer_list[topic_id] = answer_str
                answer_lists[topic_id] = answer_ids.map(Number)

            } else {
                let  answer_ids  = answer_list[topic_id].split(",")
                if(answer_ids.indexOf(optionId + '') > -1){
                    answer_ids.splice(answer_ids.indexOf(optionId+ ''),1)
                } else {
                    answer_ids.push(optionId + '')
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

    //提交试卷
    _onSubmit(){
        var that = this ;
        const {testId,paper_id,answer_lists,percentage,levelId,course_id} = that.state

        api.post(inter.UserExam +  testId ,{
            answer:JSON.stringify(answer_lists),
            duration:10,
            levelId:levelId,
        }).then((res)=>{
            if(res.data.status){
                let val = res.data.data.split('-')
                if(val[0] == 'true'){
                    api.get('/exam/review/score/'+testId)
                    .then(res=>{
                        let score = res.data.data.score
                        if(res.data.data.pass){
                            Taro.showModal({
                                title: '提示',
                                content: '试卷已提交，当前分数'+val[1]+'分，及格分数为'+val[2]+'分，历史最高分'+score+'分',
                                success: function (res) {
                                  if (res.confirm) {
                                    api.get(inter.LevelStatus,{
                                        levelId:levelId
                                    }).then((res)=>{
                                        if(res.data.status){
                                            let levelData = res.data.data
                                            if(levelData.levelStatus === 0){
                                                if(levelData.type === 'Course'){
                                                    Taro.redirectTo({
                                                        url:menu.courseDesc  +`?isback=1&course_id=${levelData.nextId}`  +`&levelId=${levelId}`+ '&courseName='+ `${'课程'}`
                                                    })
                                                } else {
                                                    setTimeout(()=>{
                                                        Taro.navigateBack({complete:that.onBack})
                                                    },2000)
                                                }
                                            } else {
                                                setTimeout(()=>{
                                                    Taro.navigateBack({complete:that.onBack})
                                                },2000)
                                            }
                                        } 
                                    })
                    
                                  } else if (res.cancel) {
                                    api.get(inter.LevelStatus,{
                                        levelId:levelId
                                    }).then((res)=>{
                                        if(res.data.status){
                                            let levelData = res.data.data
                                            if(levelData.levelStatus === 0){
                                                if(levelData.type === 'Course'){
                                                    Taro.redirectTo({
                                                        url:menu.courseDesc  +`?isback=1&course_id=${levelData.nextId}`  +`&levelId=${levelId}`+ '&courseName='+ `${'课程'}`
                                                    })
                                                } else {
                                                    setTimeout(()=>{
                                                        Taro.navigateBack({complete:that.onBack})
                                                    },2000)
                                                }
                                            } else {
                                                setTimeout(()=>{
                                                    Taro.navigateBack({complete:that.onBack})
                                                },2000)
                                            }
                                        } 
                                    })
                    
                                  }
                                }
                              })
                        }else{
                            Taro.showModal({
                                title: '提示',
                                content:  '试卷已提交，当前分数'+val[1]+'分，及格分数为'+val[2]+'分，历史最高分'+score+'分',
                                success: function (res) {
                                  if (res.confirm) {
                                    api.get(inter.LevelStatus,{
                                        levelId:levelId
                                    }).then((res)=>{
                                        if(res.data.status){
                                            let levelData = res.data.data
                                            if(levelData.levelStatus === 0){
                                                if(levelData.type === 'Course'){
                                                    Taro.redirectTo({
                                                        url:menu.courseDesc  +`?isback=1&course_id=${levelData.nextId}`  +`&levelId=${levelId}`+ '&courseName='+ `${'课程'}`
                                                    })
                                                } else {
                                                    setTimeout(()=>{
                                                        Taro.navigateBack({complete:that.onBack})
                                                    },2000)
                                                }
                                            } else {
                                                setTimeout(()=>{
                                                    Taro.navigateBack({complete:that.onBack})
                                                },2000)
                                            }
                                        } 
                                    })
                    
                                  } else if (res.cancel) {
                                    api.get(inter.LevelStatus,{
                                        levelId:levelId
                                    }).then((res)=>{
                                        if(res.data.status){
                                            let levelData = res.data.data
                                            if(levelData.levelStatus === 0){
                                                if(levelData.type === 'Course'){
                                                    Taro.redirectTo({
                                                        url:menu.courseDesc  +`?isback=1&course_id=${levelData.nextId}`  +`&levelId=${levelId}`+ '&courseName='+ `${'课程'}`
                                                    })
                                                } else {
                                                    setTimeout(()=>{
                                                        Taro.navigateBack({complete:that.onBack})
                                                    },2000)
                                                }
                                            } else {
                                                setTimeout(()=>{
                                                    Taro.navigateBack({complete:that.onBack})
                                                },2000)
                                            }
                                        } 
                                    })
                    
                                  }
                                }
                              })
                        }
                       
                    })
                    // Taro.showToast({
                    //     title:'答题成功',
                    //     icon:'none',
                    //     duration:2000
                    // })
                } else {
                    let vas = res.data.data.slice(6)
                    api.get('/exam/review/score/'+testId)
                    .then(res=>{
                        let score = res.data.data.score
                        Taro.showModal({
                            title: '提示',
                            content: '试卷已提交，当前分数'+val[1]+'分，及格分数为'+val[2]+'分，历史最高分'+score+'分，答题不及格，未通过',
                            success: function (res) {
                              if (res.confirm) {
                                api.get(inter.LevelStatus,{
                                    levelId:levelId
                                }).then((res)=>{
                                    if(res.data.status){
                                        let levelData = res.data.data
                                        if(levelData.levelStatus === 0){
                                            if(levelData.type === 'Course'){
                                                Taro.redirectTo({
                                                    url:menu.courseDesc  +`?isback=1&course_id=${levelData.nextId}`  +`&levelId=${levelId}`+ '&courseName='+ `${'课程'}`
                                                })
                                            } else {
                                                setTimeout(()=>{
                                                    Taro.navigateBack({complete:that.onBack})
                                                },2000)
                                            }
                                        } else {
                                            setTimeout(()=>{
                                                Taro.navigateBack({complete:that.onBack})
                                            },2000)
                                        }
                                    } 
                                })
                
                              } else if (res.cancel) {
                                api.get(inter.LevelStatus,{
                                    levelId:levelId
                                }).then((res)=>{
                                    if(res.data.status){
                                        let levelData = res.data.data
                                        if(levelData.levelStatus === 0){
                                            if(levelData.type === 'Course'){
                                                Taro.redirectTo({
                                                    url:menu.courseDesc  +`?isback=1&course_id=${levelData.nextId}`  +`&levelId=${levelId}`+ '&courseName='+ `${'课程'}`
                                                })
                                            } else {
                                                setTimeout(()=>{
                                                    Taro.navigateBack({complete:that.onBack})
                                                },2000)
                                            }
                                        } else {
                                            setTimeout(()=>{
                                                Taro.navigateBack({complete:that.onBack})
                                            },2000)
                                        }
                                    } 
                                })
                
                              }
                            }
                          })
                    })
                    // Taro.showToast({
                    //     title:'答题不及格，未通过',
                    //     icon:'none',
                    //     duration:2000
                    // })

                }
                

               
                
                
            }
        })
    }
     //onBack
     onBack = ()=>{
        
        const {levelId} = this.state
        
        console.log('onBack',levelId)
        if(levelId)
        api.get(inter.LevelStatus,{
            levelId:levelId
        })
    }



    _renderTopic(){
        var that = this ;
        const {topic_index,answer_list,topicList,isAudio} = that.state;


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
                            topicList[topic_index].optionList.map((qustion,index)=>{
                                
                                const on = answer_list[topicList[topic_index].topicId] == qustion.optionId;
                             
                                return(
                                    <View className='choosen_item' key={index+'_index'} onClick={this._onAnswer.bind(this,qust.ttype,qust.topicId,0,index,qustion.optionId)}>
                                        <View className={on ? 'item_onicon' : 'item_icon'}><Text>{String.fromCodePoint(index+65)}</Text></View>
                                        <View className='viewEword'  >
                                            <Text className={ on ? 'item_ontxt' : 'item_txt'}>{qustion.optionLabel}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }                    
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
                            topicList[topic_index].optionList.map((qustion,index)=>{
                                let on:boolean = false;
                                if(answer_list[topicList[topic_index].topicId] !== undefined){
                                    on = (answer_list[topicList[topic_index].topicId]).indexOf(qustion.optionId)  > -1 ;
                                }
                                return( 
                                    <View className='choosen_item' key={index+'_index'} onClick={this._onAnswer.bind(this,qust.ttype,qust.topicId,0,index,qustion.optionId)}>
                                        <View className={on ? 'item_onicon' : 'item_icon'}><Text>{String.fromCodePoint(index+65)}</Text></View>
                                        <View  className='viewEword' >
                                            <Text className={ on ? 'item_ontxt' : 'item_txt'}>{qustion.optionLabel}</Text>
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
    
    render () {
        const {duration,status} = this.state
        return (
            <View className='wrapper'>
               
               <View className='time_cost'>
                    <Text>{countDown(duration)}</Text>
                </View>
               {
                    status === 0 || status === 1 ?
                    <View className='topic_wrap pl_20 pr_20 pb_20'>
                        {this._renderTopic()}
                    </View>
                :null}

               {/* 底部 */}
               <View className='topic_menu'>
                    <View className='col_1 btn_prv' onClick={this._onPrev}>
                        <Text className='col_1 text_c'>上一题</Text>
                    </View>
                    <View className='col_1 text_c  btn_nxt' onClick={this._onNext}>
                        <Text>下一题</Text>
                    </View>
                    <View className='submit_btn'
                        onClick={this._onSubmit}
                    >
                        <Text>交卷</Text>
                    </View>
                </View>
            </View>
        )
    }
}

export default studyAnswer as ComponentClass