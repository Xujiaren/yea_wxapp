/**
 * @Wang
 */
import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { Progress,Swiper,SwiperItem,View, Text ,Image,Button} from '@tarojs/components'

import menu from '../../../config/menu'

import inter from '../../../config/inter'
import api from '../../../services/api'

import  '../../../config/theme.css';
import './myMedalDetail.less'

type PageState = {
    current:number,
    percent:number,
    content:string,
    title:string,
    lv:string,
    nowNum:number,
    allNum:number,
    childList:Array<{
        title:string,
        mark:string,
        child:Array<{
            description:string,
            lv:number
        }>,
        have:boolean,
        img:string,
        lv:string,
        content:string,
        allNum:number,
        nowNum:number,
        cond:number,
        
    }>,
    description:string
}
class MyMedalDetail extends Component<{}, PageState>  {
    
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '我的勋章',
        navigationBarBackgroundColor:'#FFF',
        enablePullDownRefresh: false,
        backgroundColor:'#fff',
        backgroundTextStyle:'dark',
    }

    constructor () {
        super(...arguments)
        this.state = {
            current:0,
            percent:25,
            content:'',
            title:'',
            lv:'',
            nowNum:0,
            allNum:0,
            childList:[],
            description:''
        }
        
    }

    componentWillReceiveProps (nextProps) {}
    componentWillMount () {
        var that = this 
        const  {med} = that.$router.params
        
        let mediadesc = JSON.parse(med)

        that.setState({
            lv:mediadesc.lv,
            nowNum:mediadesc.nowNum,
            allNum:mediadesc.allNum,
            childList:mediadesc.child,
            content:mediadesc.content,
            title:mediadesc.title,
            description:mediadesc.child[0].description
        })
    }
    componentDidMount () {}
    componentWillUnmount () {}
    componentDidShow () {}
    componentDidHide () {}



    // 分享详情页
    onShareAppMessage(ops){
        var that = this ;
        const {title} = that.state;

        api.post(inter.userLog,{
            log_type:1,
            type:1,
            device_id:0,
            intro:'分享勋章页面',
            content_id:0,
            param:JSON.stringify({name:'',cctype:10,ttype:0}),
            from:0,
        }).then((res)=>{
            console.log('ee')
        })

        if (ops.from === 'button') {
            // 来自页面内转发按钮
            // console.log(ops.target)
        }
        return {
            title: title,
            path: menu.index,
            imageUrl:'' ,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }


    _onSwiper(e){

        var that = this 
        const {childList} = that.state
        let current = e.detail.current

        this.setState({ 
            current,
            content:childList[current].content,
            description:childList[current].description,
            lv:childList[current].lv
        })

    }


    onPullDownRefresh(){
        Taro.showNavigationBarLoading()
        
        setTimeout(()=>{
            Taro.stopPullDownRefresh()
            Taro.hideNavigationBarLoading()
        },1000)

    }


    render () {

        const btn_icon = "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/24889223-5a1b-4d7b-a05f-4b26dd8bc3b9.png"

        const {current,percent,content,title,lv,nowNum,allNum,childList,description} = this.state

        let parent:any = 0 

        if(nowNum === 0 ){
            
            parent = 0 

        } else  if(nowNum <= allNum ) {
            
            parent = (nowNum / allNum).toFixed(2)

        }
        
        let parentNum = parent * 100

        // console.log(childList)
       
        return (
            <View className='root'>


                <Swiper
                    className='swiper'
                    easing-function='linear'
                    interval={1000}
                    indicatorDots={false}
                    displayMultipleItems={1}
                    autoplay={false}
                    previousMargin={'188rpx'}
                    nextMargin={'188rpx'}
                    onChange={(e)=>this._onSwiper(e)}
                    current = {current}
                >
                    {childList.map((ele,index)=>(
                        <SwiperItem className='s_item'  key={index+'_s_item'}>
                            <Image className={current === index ? 'active s_img':'s_img' }  style={{filter:ele.have ? '' : 'grayscale(1)'}} src={ele.img} mode='aspectFit'
                                onClick={()=>{
                                    this.setState({current:index})
                                }}
                            />
                        </SwiperItem>
                    ))}
                </Swiper>


                <View className='progress_wrap'>
                    <Progress
                        className='progress'
                        duration={10}
                        percent={parentNum}
                        strokeWidth={2}
                        active
                        backgroundColor='#ECECEC'
                        activeColor='#F4623F'
                        borderRadius={5}
                    />
                        {
                            childList.length > 1 ?
                            <View>
                                <View className='progress_dot'>
                                    {
                                        childList.map((med,index)=>{
                                            return(
                                                <View className={med.have ?  'dot_active dot' : 'dot'} style={{transitionDelay:'80ms'}} key={'med' + index}/>
                                            )
                                        })
                                    }
                                </View>
                                <View className='progress_txt'>
                                    {
                                        childList.map((med,index)=>{
                                            return(
                                                <Text className={med.have ? 'txt_active txt':'txt'} style={{transitionDelay:'80ms'}} key={'med_txx' + index}>{index + 1}级</Text>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                            :
                            <View>
                                <View className='prog_dot'>
                                    {
                                        childList.map((med,index)=>{
                                            return(
                                                <View className={med.have ?  'dot_active dot' : 'dot'} style={{transitionDelay:'80ms'}} key={'med' + index}/>
                                            )
                                        })
                                    }
                                </View>
                                <View className='prog_txt'>
                                    {
                                        childList.map((med,index)=>{
                                            let on = lv >= med.lv
                                            return(
                                                <Text className={med.have ? 'txt_active txt':'txt'} style={{transitionDelay:'80ms'}} key={'med_txx' + index}>{index + 1}级</Text>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                        }
                        
                    
                </View>

                {
                    childList.length > 1 ?
                    <View className='title'>
                        <Text>{title+'LV.'+lv}</Text>
                    </View>
                    :
                    <View className='title'>
                        <Text>{title}</Text>
                    </View>
                }
                
                <View className='sub_txt'>{'当前进度'+nowNum+'/'+allNum}</View>

                <View className='content pt_20'>
                    <Text>{content}</Text>
                </View>
                <View className='content pb_20'>
                    <Text>{description}</Text>
                </View>

                <Button open-type='share' onShareAppMessage={this.onShareAppMessage} className='btn_item'>
                    <Image className='share_icon' mode='aspectFit' src={btn_icon} />
                    <Text>分享</Text>
                </Button>
            </View>
        )
    }
}

export default MyMedalDetail as ComponentClass
