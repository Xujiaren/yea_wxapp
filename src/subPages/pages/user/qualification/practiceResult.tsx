/**
 * @wang
 */
import { ComponentClass } from 'react'
import Taro, { Component,Config } from '@tarojs/taro'
import { View, Text ,Image,Swiper,SwiperItem,Canvas,Button} from '@tarojs/components'

import menu from '../../../../config/menu'
import api from '../../../../services/api'
import inter from '../../../../config/inter'
import asset from '../../../../config/asset'

import  '../../../../config/theme.css';
import './practiceResult.less'

type PageState = {
    type:string,
    paper_id:number,
    topicNum:number,
    correctNum:number,
    status:number,
    great_img:string,
    good_img:string,
    nopass_img:string,
    share_icon:string,
    percentage:number,
    topicList:Array<{
        answer: string,
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
    score:number,
    squadId:number,
    test_id:number,
    exerciseStatus:boolean,
    examTitle:string,
    examImg:string,

    isCanvas:boolean,
    avatar:string,
    tempFilePath:string
}
class practiceResult extends Component<{}, PageState>  {
    
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTextStyle: "black",
        navigationBarTitleText: '练习结果',
        navigationBarBackgroundColor:'#ffffff',
        enablePullDownRefresh: true,
        backgroundColor:'#FAFAFA'
    }

    constructor () {
        super(...arguments)
        this.state = {
            type:'',
            test_id:0,
            topicNum:0,
            correctNum:0,
            status:0,
            topicList:[],
            great_img:"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/55aa1ef3-1c03-428d-a9c5-7d380dc1150e.png",
            good_img:"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/c94fdd9e-3727-4fb0-8934-7e03faaefb6a.png",
            nopass_img:"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/04650cfa-e390-4418-b88c-4e1e124ffe1b.png",
            share_icon:"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/24889223-5a1b-4d7b-a05f-4b26dd8bc3b9.png",
            percentage:0,
            score:0,
            squadId:0,
            exerciseStatus:false,
            examTitle:'',
            examImg:'',
            isCanvas:false,
            avatar:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/623e777f-c4f2-4bf9-83bb-fecceadb9195.png',
            tempFilePath:''
        }
        
    }


    componentWillReceiveProps (nextProps) {}
    componentWillMount () {

        const {test_id,examTitle,examImg} = this.$router.params



        this.setState({ 
            test_id:parseInt(test_id),
            examTitle:examTitle,
            examImg:examImg
        })
        this._draw();

    }

    componentDidMount () {
        var that = this ;
        that._getReport();
        that._studyStatus();
    }
    componentWillUnmount () {
        var that = this 
    }
    
    componentDidShow () {}
    componentDidHide () {}


    // 资格认证状态
    _studyStatus(){
        var that = this 
        const {squadId} = that.state

        api.get(inter.studyStatus,{
            squadId	: squadId
        }).then((res)=>{

            let studyData = res.data.data

            that.setState({
                exerciseStatus:studyData.exerciseStatus
            })
        })
    }


    // 试卷报告
    _getReport(){
        var that = this ;
        const {test_id} = that.state

        api.get(inter.TestInfo,{
            testId:test_id
        }).then((res)=>{
            if(res.data.status){
                let report = res.data.data
                that.setState({
                    topicNum:report.topicNum,
                    correctNum:report.correctNum,
                    status:report.status,
                    topicList:report.topicList,
                    score:report.score
                })
            }

        })
    }


    
    onPullDownRefresh(){
        Taro.showNavigationBarLoading()
        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }

    _toTest(){
        Taro.redirectTo({url:menu.topicSort })
    }


    _onshare = () =>{
        var that = this ;
        const {examImg,avatar} = that.state;

        Taro.showLoading({
            title: '准备中'
        });

        Taro.getImageInfo({
            src: examImg + '?x-oss-process=image/resize,w_370/rounded-corners,r_10/format,png',
        }).then((res)=>{
            if(res.errMsg === "getImageInfo:ok"){
                Taro.setStorageSync('pic', {
                    path: res.path,
                    width: res.width,
                    height: res.height
                });
                this.setState({
                    isCanvas:true
                })
                Taro.getImageInfo({
                    src: avatar,
                }).then((res)=>{
                    if(res.errMsg === "getImageInfo:ok"){
                        Taro.setStorageSync('avatar', {
                            path: res.path,
                            width: res.width,
                            height: res.height
                        });
                        Taro.hideLoading();
                        that._canvasToimg()
                    }
                })
            }

        }) 
    }

    _draw=()=>{
        var that = this ;
        const {topicNum,correctNum,score,examTitle} = this.state

        var rpx:any ;
        Taro.getSystemInfo({
            success:function(res){
                rpx = res.windowWidth / 375 
            }
        })

        var height:number  = 450;
        var width:number = 270;
        

        const cvsCtx = Taro.createCanvasContext('CanvasId',that);

        cvsCtx.draw();

        let picObj = Taro.getStorageSync('pic');
        let avatarObj = Taro.getStorageSync('avatar');

        cvsCtx.fillStyle="#FFFFFF";
        cvsCtx.fillRect(0,0,width,height);


        cvsCtx.setFillStyle('#222222')//字体颜色
        cvsCtx.setFontSize(20 * rpx)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText('恭喜您顺利完成练习',106 * rpx   , 40 * rpx)//字体内容和位置
        


        cvsCtx.drawImage(picObj.path, 0, 60 * rpx , 212 * rpx , 104 * rpx ); // 推进去图片


        cvsCtx.setFillStyle('#333333')//字体颜色
        cvsCtx.setFontSize(14 * rpx)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText('《' + examTitle + '》', 106 * rpx , 190 * rpx)//字体内容和位置

        // 
        cvsCtx.setFillStyle('#F4623F')//字体颜色
        cvsCtx.setFontSize(14 * rpx)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText(score.toString(), 30 * rpx , 240 * rpx )//字体内容和位置
        
        //
        cvsCtx.setFillStyle('#4A90E2')//字体颜色
        cvsCtx.setFontSize(14 * rpx)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText(correctNum.toString(), 106 * rpx , 240 * rpx )//字体内容和位置
        
        //
        cvsCtx.setFillStyle('#B9B9B9')//字体颜色
        cvsCtx.setFontSize(14 * rpx)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText((topicNum - correctNum).toString(), 182 * rpx  , 240 * rpx )//字体内容和位置

        // 
        cvsCtx.setFillStyle('#666666')//字体颜色
        cvsCtx.setFontSize(14 * rpx)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText("成绩", 30 * rpx , 270 * rpx )//字体内容和位置
        
        //
        cvsCtx.setFillStyle('#666666')//字体颜色
        cvsCtx.setFontSize(14 * rpx)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText("正确", 106 * rpx , 270 * rpx )//字体内容和位置
        
        //
        cvsCtx.setFillStyle('#666666')//字体颜色
        cvsCtx.setFontSize(14 * rpx)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText("错误", 182 * rpx , 270 * rpx)//字体内容和位置
        

        // logo
        cvsCtx.drawImage(avatarObj.path, 32 * rpx , 300 * rpx , 60 * rpx  , 60 * rpx); // 推进去图片

        cvsCtx.setFillStyle('#000000')//字体颜色
        cvsCtx.setFontSize(14 * rpx)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText("油葱学堂", 132 * rpx  , 340 * rpx )//字体内容和位置


        cvsCtx.draw();

        
    }

    _canvasToimg=()=>{

        var that = this;
        Taro.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: 'CanvasId',
            success: function (res) {
                let tempFilePath = res.tempFilePath;
                if(res.errMsg = 'canvasToTempFilePath:ok') {
                    that.setState({tempFilePath:tempFilePath})
                         Taro.saveImageToPhotosAlbum({filePath: tempFilePath}).then((res)=>{
                            if(res.errMsg = 'saveImageToPhotosAlbum:ok'){
                                Taro.showToast({
                                    title:'保存成功，快分享到朋友圈吧~',
                                    icon: 'none'
                                })
                            }
                      }) 
                }
            }
        })
    }

      onShareMessage=()=>{
        Taro.showToast({
            title:'图片已保存，请打开微信进行分享～',
            icon: 'none'
        })
      }

    _canvasTo=()=>{
        Taro.showToast({
            title:'图片已保存，请打开朋友圈进行分享～',
            icon: 'none'
        })
    }


    render () {
        const {topicNum,correctNum,great_img,share_icon,topicList,score,exerciseStatus,examTitle,examImg,isCanvas} = this.state


        let all_box:any [] = new Array()
        for(let i = 0 ; i < topicList.length ; i+=15){
            all_box.push(topicList.slice(i,i+15));
        }


        let windowHeight = 500
        try {
            var res = Taro.getSystemInfoSync();
            windowHeight = res.windowHeight;
        }  catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        return (
            <View className='root'>
                <View className='img_bg_wrap'>
                    <Image src={great_img} className='img_bg' mode='aspectFit'/>
                    <Image className='share_icon' mode='aspectFit' src={share_icon}  onClick={this._onshare}/>
                    <View className='result_wrap'>
                        <View className='text_wrap'>
                            <Text className='text_top'>{score}</Text>
                            <Text className='text_bottom'>成绩</Text>
                        </View>
                        <View className='text_wrap'>
                            <Text className='text_top'>{correctNum}</Text>
                            <Text className='text_bottom'>答对</Text>
                        </View>
                        <View className='text_wrap'>
                            <Text className='text_top'>{topicNum - correctNum > 0 ? topicNum - correctNum : 0}</Text>
                            <Text className='text_bottom'>答错</Text>
                        </View>
                    </View>
                </View>
                <View className='title_wrap'>
                    <Text className='title_bold'>练习回顾</Text>
                    <View className='tips_wrap'>
                        <View className='radius'></View>
                        <Text space='nbsp'>正确</Text>
                        <View className='radius bg_orange'></View>
                        <Text space='nbsp'>错误</Text>
                    </View>
                </View>
                
                <View className='swiper_wrap'>
                    <Text className='swiper_name'>单选题</Text>
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
                        {all_box.map((ele, index) => (
                            <SwiperItem key={index + '_swiper_item'}>
                                <View className='swiper_single_box'>
                                    {
                                        ele.map((_ele , idx)=>{
                                            return(
                                                <View className='w_20' key={idx + '_the_item'}>
                                                    <View className={_ele.userAnswer.answer === _ele.userAnswer.topicAnswer ?  'swiper_item_wrap bg_green' : 'swiper_item_wrap bg_orange'}  >
                                                        <Text>{index * 15 + idx + 1}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </SwiperItem>
                        ))}
                    </Swiper>
                </View>
                
                <View className='hr_line'></View>
                {
                    exerciseStatus  ?
                    <View className='bottom_btn'>
                        <View className='inner_btn' 
                            onClick={this._toTest}
                        >
                            <Text>再次练习</Text>
                        </View>
                    </View>
                :null}
                


                <View className='layer' style={{height:windowHeight}} hidden={!isCanvas}>
                    <View className='layer_boxs'>
                        <View className='layer_box'>
                            <View className='layer_head' onClick={()=>this.setState({isCanvas:false})}>
                                <Text className='black_label default_label'>关闭</Text>
                            </View>
                            <Canvas canvasId='CanvasId' 
                                style={{height:'760rpx',width:'424rpx',backgroundColor:'#ffffff'}} 
                                className='canvasId'
                            >
                            </Canvas>
                            <View className='shareBox'>
                                <View className='share_tit'>
                                    <Text className='lg_label black_label fw_label'>分享到</Text>
                                </View>
                                <View className='share_items'>
                                    <View className='share_item'>
                                        <Button className='share_item bg_white bod'  onClick={this.onShareMessage}>
                                            <Image  src={asset.wechat_icon}  className='icons'/>
                                        </Button>
                                        <View className='c33_label sm_label mt_10'>微信好友</View>
                                    </View>
                                    <View className='share_item'>
                                        <Button className='share_item bg_white bod' onClick={this._canvasTo}>
                                            <Image  src={asset.firends_icon}  className='icons'/>
                                        </Button>
                                        <View className='c33_label sm_label mt_10'>朋友圈</View>
                                    </View>  
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

export default practiceResult as ComponentClass
