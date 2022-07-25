import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Swiper,SwiperItem} from '@tarojs/components'

import menu from '../../../../config/menu';
import {percent2percent25} from '../../../../utils/common'

import inter from '../../../../config/inter'
import api from '../../../../services/api'
import  '../../../../config/theme.css';
import './cateExam.less'

type PageState = {
    paperList:Array<{
        cchapterId: number,
        chapterId: number,
        courseId: number,
        duration: number,
        examed: number,
        isExam: boolean,
        num: number,
        paperId: number,
        paperName: string,
        percentage:number,
        ptype: number,
        pubTime: number,
        pubTimeFt: string,
        score: number,
        teacherId: number,
        topicList: []
        total: number,
        finish:boolean,
    }>,
    status:number,
    paperIsExam:boolean,
    paperIsFinsh:boolean,
    paper:{
        cchapterId: number,
        chapterId: number,
        courseId: number,
        duration: number,
        examed: number,
        isExam: boolean,
        num: number,
        paperId: number,
        percentage:number,
        paperName: string,
        ptype: number,
        pubTime: number,
        pubTimeFt: string,
        score: number,
        teacherId: number,
        topicList: []
        total: number,
    },
    errNumber:number,
    begin:string,
    end:string,
    passNumber:number,
    perp:number,
    exerciseStatus:boolean
    passStatus:number,
    squadId:number,
    examTitle:string,
    examImg:string,
    less:number,
    id:number
}

class cateExam extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '试卷',
        enablePullDownRefresh: true,
    }

    constructor () {
        super(...arguments)
        this.state = {
            paperList:[],
            status:0,
            paperIsExam:false,
            paperIsFinsh:false,
            paper:{
                cchapterId: 0,
                chapterId: 0,
                courseId: 0,
                duration: 0,
                examed: 0,
                isExam: false,
                num: 0,
                paperId: 0,
                percentage:0,
                paperName: "",
                ptype: 0,
                pubTime: 0,
                pubTimeFt: "",
                score: 0,
                teacherId: 0,
                topicList: [],
                total: 0,
            },
            errNumber:0,
            begin:'',
            end:'',
            passNumber:0,
            perp:0,
            exerciseStatus:false,
            passStatus:0,
            squadId:0,
            examTitle:'',
            examImg:'',
            less:0,
            id:0
        }
    }

    componentWillMount () {
        var that = this 
        const {squadId,examTitle,examImg} = that.$router.params

        
        that.setState({
            squadId: parseInt(squadId) !== undefined ? parseInt(squadId) : 0,
            examTitle:examTitle,
            examImg:examImg
        })
    }

    componentDidMount () {
    }

    componentWillUnmount () {
    }
    
    componentDidShow () {
        var that = this

        let pages = Taro.getCurrentPages();
        let currPage = pages[pages.length - 1]; // 获取当前页面

        console.log(currPage.__data__.squadId,'pages')


        if (currPage.__data__.squadId) { // 获取值

            let squadId = currPage.__data__.squadId
            
            that.setState({ 
                squadId: squadId
            },()=>{
                that._cateExam()
                that._studyStatus();
            })

        } 

       // 对应onShow，只有在onShow中才会监听到当前页面的改变
            
             
             if (currPage.__data__.holder) { // 获取值
               this.setState({ less: currPage.__data__.less,id:currPage.__data__.id })
             } 
            //  console.log(currPage.__data__.less)
         

        
    }

    componentDidHide () { }

    // 资格认证状态
    _studyStatus(){
        var that = this 
        const {squadId} = that.state

        api.get(inter.studyStatus,{
            squadId	: squadId
        }).then((res)=>{

            let studyData = res.data.data

            if(!studyData.exerciseStatus){
                Taro.showToast({
                    title:'请先完成考题练习才能进行考试',
                    icon:'none',
                    duration:3000
                })
            } else {
                if(studyData.passStatus === 0){
                    Taro.showToast({
                        title:'对不起，考核不通过',
                        icon:'none',
                        duration:2000
                    })
                } else if(studyData.passStatus === 1){

                    Taro.showModal({
                        title:'在线考试',
                        content:'您只有最后一次机会， \n 请回到考题练习认真学习，\n 是否继续考试',
                        confirmText:'是',
                        cancelText:'否'
                    }).then(res => {
                        if(res.confirm){
                            that.setState({
                                passStatus:3
                            })
                        }  else if(res.cancel){
                            Taro.redirectTo({url:menu.topicSort + '?squadId=' + squadId})
                        }
                    })

                } else if(studyData.passStatus === 2){
                    Taro.showToast({
                        title:'考试通过',
                        icon:'none',
                        duration:2000
                    })
                }
            }

            that.setState({
                exerciseStatus:studyData.exerciseStatus,
                passStatus:studyData.passStatus,
            })
        })
    }


    // 全部试卷
    _cateExam(){

        var that = this;
        const {squadId} = that.state
        
        api.get(inter.StudyExanPaper,{
            squadId:squadId
        }).then((res)=>{
            if(res.data.status){
                let paperdesc = res.data.data
                let paperlist = paperdesc.data
                let errNumber = 0;

                for(let i = 0 ; i < paperlist.length ; i++){
                    if(paperlist[i].isExam){
                        if(paperlist[i].userScore <  paperlist[i].score * (paperlist[i].percentage/100)){
                            errNumber++
                        }
                    }
                }

                that.setState({
                    paperList:paperlist,
                    errNumber:errNumber,
                    begin:paperdesc.begin,
                    end:paperdesc.end,
                    passNumber:paperdesc.passNumber,
                    perp:paperdesc.perp
                },()=>{
                    if(paperlist.length > 0){
                        that.setState({
                            paper:paperlist[0],
                            paperIsExam:paperlist[0].isExam,
                            paperIsFinsh:paperlist[0].finish,
                        })
                    }
                })
            }
        })
    }

    // 试卷
    _paper(index){
        var that = this;
        const {paperList} = that.state

        that.setState({
            status:index,
            paper:paperList[index],
            paperIsExam:paperList[index].isExam,
            paperIsFinsh:paperList[index].finish,
        })
    }


    _onExam(){
        var that = this ;
        const {paper,errNumber,perp,exerciseStatus,passStatus,squadId,examTitle,examImg}  = that.state
        console.log(this.state.less)
        if(exerciseStatus){
            if(passStatus === 3){
                if(paper.num > 0){

                    if(errNumber > 3 ){
        
                        Taro.showModal({
                            title: '考试提示',
                            content: '考试机会已不多，\n 请重新练习再来考试',
                            showCancel:false,
                            success: res=> {
                                if (res.confirm) {
                                    if(paper.paperId==this.state.id){
                                        Taro.navigateTo({url:menu.doingExam + '?paper_id=' + paper.paperId  + '&e_duration=' + paper.duration + '&e_percentage=' + perp + '&paperName=' + percent2percent25(paper.paperName) + '&squadId='+ squadId  + '&examTitle=' + examTitle +'&lessDuration=' + this.state.less + '&examImg=' + examImg }) 
                                    }else{
                                        Taro.navigateTo({url:menu.doingExam + '?paper_id=' + paper.paperId  + '&e_duration=' + paper.duration + '&e_percentage=' + perp + '&paperName=' + percent2percent25(paper.paperName) + '&squadId='+ squadId  + '&examTitle=' + examTitle +'&lessDuration=' + paper.lessDuration + '&examImg=' + examImg }) 
                                    }
                                    
                                }
                            }
                        })
        
                    } else {
                        Taro.navigateTo({url:menu.doingExam + '?paper_id=' + paper.paperId  + '&e_duration=' + paper.duration + '&e_percentage=' + perp + '&paperName=' + percent2percent25(paper.paperName ) + '&squadId='+ squadId  + '&examTitle=' + examTitle +'&lessDuration=' + paper.lessDuration + '&examImg=' + examImg} )
                    }
        
                } else {
                    Taro.showToast({
                        title:'暂无试题',
                        icon:'none'
                    })
                }

            }  else if(passStatus === 0){
                Taro.showToast({
                    title:'对不起，考核不通过',
                    icon:'none',
                    duration:2000
                })
            } else if(passStatus === 1){
                Taro.showModal({
                    title:'在线考试',
                    content:'您只有最后一次机会， \n 请回到考题练习认真学习，\n 是否继续考试',
                    confirmText:'是',
                    cancelText:'否'
                }).then(res => {
                    if(res.confirm){
                        that.setState({
                            passStatus:3
                        })
                    }  else if(res.cancel){
                        Taro.redirectTo({url:menu.topicSort})
                    }
                })
            } else if(passStatus === 2){
                Taro.showToast({
                    title:'考试通过',
                    icon:'none',
                    duration:2000
                })
            }
            

        } else {

            Taro.showToast({
                title:'请先完成考题练习才能进行考试',
                icon:'none',
                duration:2000
            })

        }
        
    }

    onPullDownRefresh(){
        var that = this;
        that._cateExam();
        Taro.showNavigationBarLoading()
        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }
    
    render () {

        const { paperList ,status,paper,paperIsExam,paperIsFinsh,begin,end,perp,passNumber} = this.state

        let outside_box:any [] = new Array()
        for(let i = 0 ; i < paperList.length ; i+=5){
            outside_box.push(paperList.slice(i,i+5));
        }

        return (
            <View className='root'>
                
               <View className='intro'>
                    <View className='swiper_wrap'>
                        <Swiper
                            className='swiper'
                            easing-function='linear'
                            interval={1000}
                            indicatorDots
                            displayMultipleItems={1}
                            autoplay={false}
                            vertical={false}
                            indicatorColor='#fafafa'
                            indicatorActiveColor='#fafafa'
                        >
                            {outside_box.map((ele, index) => (
                                <SwiperItem key={index + '_swiper_item'}>
                                    {console.log(ele)}
                                    <View className='swiper_single_box'>
                                        {
                                            ele.map((_ele,idx)=>{
                                                const on = status === index*5 + idx

                                                return(
                                                    <View className='w_20' key={'_ele'+index}>
                                                        {
                                                            _ele.finish ? 
                                                            <View className='d_flex fd_c ai_ct' onClick={this._paper.bind(this,index*5 + idx)}>
                                                                <View className={ _ele.userScore < perp   ? 'swiper_item_wrap bg_orange' : 'swiper_item_wrap bg_green'} >
                                                                    <Text>{index*5 + idx+1}</Text>
                                                                </View>
                                                                <Text 
                                                                    className='sm_label mt_5'
                                                                    style={  _ele.userScore < perp  ? {color:'#F4623F'} : {color:'#99D321'}  }
                                                                >
                                                                    {  _ele.userScore <  perp   ? '不及格' : '及格' }
                                                                </Text>
                                                            </View>
                                                            :
                                                            <View className='d_flex fd_c ai_ct' onClick={this._paper.bind(this,index*5 + idx)}>
                                                                <View className={ on ? 'swiper_item_wrap bg_white onItem_wrap' :'swiper_item_wrap bg_white' }>
                                                                    <Text>{index*5 + idx+1}</Text>
                                                                </View>
                                                                <Text className='sm_label mt_5 tip_label'>待做 </Text>
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
                    <View className='pl_25 pr_25'>
                        <Text className='default_label tip_label '>请在{begin}-{end}完成{passNumber}次合格考核，及格分数为{perp}以上。</Text>
                    </View>
                    <View className='box_wrap'>
                        <Text className='title'>考试类型：{paper.paperName}</Text>
                        <View className='item_wrap'>
                            <Text className='label'>考试时间</Text>
                            <Text className='value'>{(paper.duration / 60).toFixed(1)}分钟</Text>
                        </View>
                        <View className='item_wrap'>
                            <Text className='label'>考试标准</Text>
                            <Text className='value'>{paper.num}题</Text>
                        </View>
                        <View className='item_wrap'>
                            <Text className='label'>合格标准</Text>
                            <Text className='value'>{paper.score * (perp/100)}分（满分100分）</Text>
                        </View>
                    </View>

                    {
                        paperIsExam ?
                        <View>
                            {
                                paperIsFinsh ? 
                                <View className='btn' hoverClass='on_tap'
                                    onClick={()=>Taro.navigateTo({url:menu.paperAnalysis + '?paper_id=' + paper.paperId + '&paperName=' +  percent2percent25(paper.paperName) })}
                                >
                                    <Text>试卷解析</Text>
                                </View>
                                :
                                <View className='btn' hoverClass='on_tap'
                                    onClick={this._onExam}
                                >
                                    <Text>继续考试</Text>
                                </View>
                            }
                        </View>
                       
                        :
                        <View className='btn' hoverClass='on_tap'
                            onClick={this._onExam}
                        >
                            <Text>开始考试</Text>
                        </View>
                    }
                    
                </View>
            </View>
        )
    }
}

export default cateExam as ComponentClass