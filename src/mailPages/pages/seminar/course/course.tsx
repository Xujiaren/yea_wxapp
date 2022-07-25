import { ComponentClass } from 'react'
import Taro, { Component} from '@tarojs/taro'
import { View, Text, Image,Video,Button} from '@tarojs/components'
import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import Tabs from '../../../../components/Tabs'
import { subNumTxt, liveday, time_ms, learnNum, percent2percent25, formatTimeStampToTime, encryNumber } from '../../../../utils/common'
import '../home.less'
import './course.less'



type PageState = {
    status:number,
    compulsory:Array<any>
    elective:Array<any>
    type:number,
}


class course extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '课程列表',
	    enableShareAppMessage: true
    }
    page: number
    pages: number
    ctype:any
    constructor(props) {
        super(props)

        this.page = 0;
        this.pages = 0;
        this.ctype = 0;
        this.state = {
             status: 0,
            compulsory: [],
            elective: [],
            type:0,
            }

    }

    componentDidMount() {
        const{ctype}=this.$router.params;
        this.ctype = parseInt(ctype)
        api.get(inter.ChannelSite+parseInt(ctype),{
			sort:0
		}).then(res=>{
			console.log(res)
            this.setState({
                compulsory:res.data.data.filter(item=>item.isMust==1?item:null),
                elective:res.data.data.filter(item=>item.isMust==0?item:null),
            })
		})
    }
    componentDidShow() {
        
    }
    onChange(e){
        this.setState({status:e,type:0})
    }
    onOpen = (val) => {
		if(val.ctype==48){
			Taro.navigateTo({
				url: menu.courseDesc + `?course_id=${val.courseId}` + '&courseName=' + `${val.courseName}` + '&isback=0'
			})
		}else{
			Taro.navigateTo({
				url: '../read/read' + `?course_id=${val.courseId}`+'&ctype='+val.ctype+ '&isback=0' + '&courseName=' + `${val.courseName}`
			})
		}
	}
    onMine=()=>{
        Taro.navigateTo({
            url:'./myCourse'
        })
    }
    onShits=()=>{
        const { status, compulsory ,elective,type} = this.state
        if(type==0){
            if(status==0){
                let lst = []
                compulsory.map(item=>{
                    if(item.ctype==48){
                        if(!item.study){
                            lst=lst.concat(item)
                        }
                        if(item.study&&item.study.progress!=100){
                            lst=lst.concat(item)
                        }
                    }else if(item.ctype==49){
                        if(!item.prePaperList[0].pass){
                            lst=lst.concat(item)
                        }
                    }else{
                        lst=lst.concat(item)
                    }
                })
                this.setState({
                    type:1,
                    compulsory:lst
                })
            }else{
                let lst = []
                elective.map(item=>{
                    if(item.ctype==48){
                        if(!item.study){
                            lst=lst.concat(item)
                        }
                        if(item.study&&item.study.progress!=100){
                            lst=lst.concat(item)
                        }
                    }else if(item.ctype==49){
                        if(!item.prePaperList[0].pass){
                            lst=lst.concat(item)
                        }
                    }else{
                        lst=lst.concat(item)
                    }
                })
                this.setState({
                    type:1,
                    elective:lst
                })
            }
            
        }else{
            if(status==0){
                this.setState({
                    type:0,
                })
                api.get(inter.ChannelSite+this.ctype,{
                    sort:0
                }).then(res=>{
                    this.setState({
                        compulsory:res.data.data.filter(item=>item.isMust==1?item:null),
                        elective:res.data.data.filter(item=>item.isMust==0?item:null),
                    })
                })
            }else{
                this.setState({
                    type:0,
                })
                api.get(inter.ChannelSite+this.ctype,{
                    sort:0
                }).then(res=>{
                    this.setState({
                        compulsory:res.data.data.filter(item=>item.isMust==1?item:null),
                        elective:res.data.data.filter(item=>item.isMust==0?item:null),
                    })
                })
            }
        }
    }
    render() {

		const { status, compulsory ,elective,type} = this.state
        const items = ['必修', '选修']
        return (
            <View className='box row col'>
                <View className='row jc_sb with_100'>
                    <View></View>
                    <View className='label_orange label_14 mr_20 font_bold' onClick={this.onMine.bind(this)}>试卷</View>
                </View>   
                <View className='row jc_sb with_100 mt_10'>
                    <View></View>
                    {
                       type==0?
                       <View className='label_gray label_12 mr_20' onClick={this.onShits}>只显示未完成</View>
                       :
                       <View className='label_gray label_12 mr_20' onClick={this.onShits}>显示全部</View> 
                    }
                    
                </View>
                <View className='box row jc_ad bg_white mt_10'>
                {
                        items.map((item, index) => {
                            return (
                                <View className='row col' onClick={this.onChange.bind(this,index)}>
                                    {
                                        index==status?
                                        <View className='label_14 font_bold'>{item}</View>
                                        :
                                        <View className='label_gray label_14'>{item}</View>
                                    }
                                    <View className='row jc_ct mt_5'>
                                        {
                                            index==status?
                                            <View className='tip bg_orange'></View>
                                            :
                                            <View className='tip'></View>
                                        }
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
                {
                    status == 0 ?
                        <View className='live_box row jc_ct mt_5'>
                            <View className='row col'>
                                {
                                    compulsory.map((item, index) => {
                                        return (
                                            <View className='re_box row mt_15' onClick={this.onOpen.bind(this,item)}>
                                                <View className='live_pic'>
                                                    <Image src={item.courseImg} className='picture' />
                                                </View>
                                                <View className='row col ml_8'>
                                                    <View className='label_three label_14 font_bold with_172'>{subNumTxt(item.courseName,10)}</View>
                                                    <View className='label_light label_13'>{subNumTxt(item.summary,10)}</View>
                                                    <View className='row jc_sb mt_10 with_158'>
                                                        <View className='label_gray label_12'>{item.hit}人已学</View>
                                                        {
                                                            item.schedule != 100 ?
                                                                <View className='label_light label_12'>{item.ctype==48&&!item.study?0:item.ctype==48&&item.study?item.study.progress:item.ctype==49&&item.prePaperList[0].pass?100:item.ctype==49&&!item.prePaperList[0].pass?0:0}%</View>
                                                                :
                                                                <View className='label_light label_12'>已完成</View>
                                                        }
                                                    </View>
                                                    <View className='with_158 mt_12'>
                                                        {
                                                            item.ctype==48?
                                                            <Progress percent={item.study.progress} color='#F4623F' strokeWidth={2} />
                                                            :item.ctype==49?
                                                            <Progress percent={item.prePaperList[0].pass?100:0} color='#F4623F' strokeWidth={2} />
                                                            :
                                                            <Progress percent={0} color='#F4623F' strokeWidth={2} />
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        :
                        <View className='live_box row jc_ct mt_5'>
                            <View className='row col'>
                                {
                                    elective.map((item, index) => {
                                        return (
                                            <View className='re_box row mt_15' onClick={this.onOpen.bind(this,item)}>
                                                <View className='live_pic'>
                                                    <Image src={item.courseImg} className='picture' />
                                                </View>
                                                <View className='row col ml_8'>
                                                    <View className='label_three label_14 font_bold with_172'>{item.courseName}</View>
                                                    <View className='label_light label_13'>{item.summary}</View>
                                                    <View className='row jc_sb mt_10 with_158'>
                                                        <View className='label_gray label_12'>{item.hit}人已学</View>
                                                        {
                                                            item.schedule != 100 ?
                                                                <View className='label_light label_12'>{item.ctype==48&&!item.study?0:item.ctype==48&&item.study?item.study.progress:item.ctype==49&&item.prePaperList[0].pass?100:item.ctype==49&&!item.prePaperList[0].pass?0:0}%</View>
                                                                :
                                                                <View className='label_light label_12'>已完成</View>
                                                        }
                                                    </View>
                                                    <View className='with_158 mt_12'>
                                                    {
                                                            item.ctype==48?
                                                            <Progress percent={item.study.progress} color='#F4623F' strokeWidth={2} />
                                                            :item.ctype==49?
                                                            <Progress percent={item.prePaperList[0].pass?100:0} color='#F4623F' strokeWidth={2} />
                                                            :
                                                            <Progress percent={0} color='#F4623F' strokeWidth={2} />
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                }

            </View>
        )

    }
}

export default course as ComponentClass