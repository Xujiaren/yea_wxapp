import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image, Canvas} from '@tarojs/components'

type PageState = {
    isCanvas:boolean,
    img:string,
    avatar:string,
}

import asset from '../../../config/asset'
import  '../../../config/theme.css';


class modules extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: 'canvas'
    }
    timer: any;

    constructor () {
        super(...arguments)
        this.state = {
            isCanvas:false,
            img:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/943f8a9d-568b-46e0-bfad-2c99b989e807.jpg',
            avatar:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/623e777f-c4f2-4bf9-83bb-fecceadb9195.png',
        }
    }

    componentWillMount () {
    }

    componentDidMount () { 
        var that = this;
        that._drawPic();

    }

    componentWillUnmount () {

    }
    
    componentDidShow () { }
    componentDidHide () { }


    _drawPic(){
        var that = this ;
        const {img,avatar} = that.state;

        Taro.getImageInfo({
            src: img + '?x-oss-process=image/resize,w_370',
        }).then((res)=>{
            if(res.errMsg === "getImageInfo:ok"){
                Taro.setStorageSync('pic', {
                    path: res.path,
                    width: res.width,
                    height: res.height
                });

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
                        that._draw();
                    }
                })
            }

        })    
    }


    _draw(){

        var that = this ;

        var rpx:any ;
        Taro.getSystemInfo({
            success:function(res){
                rpx = res.windowWidth / 375 
            }
        })

        var height:number  = 450;
        var width:number = 270;
        
        console.log(rpx);

        const cvsCtx = Taro.createCanvasContext('CanvasId',that);

        cvsCtx.draw();

        let picObj = Taro.getStorageSync('pic');
        let avatarObj = Taro.getStorageSync('avatar');

        cvsCtx.fillStyle="#FFFFFF";
        cvsCtx.fillRect(0,0,width,height);


        cvsCtx.setFillStyle('#222222')//字体颜色
        cvsCtx.setFontSize(21 * rpx)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText('恭喜您顺利完成考试',106 * rpx   , 40 * rpx)//字体内容和位置
        

        cvsCtx.drawImage(picObj.path, 0, 60 * rpx , 212 * rpx , 104 * rpx ); // 推进去图片


        cvsCtx.setFillStyle('#333333')//字体颜色
        cvsCtx.setFontSize(14 * rpx)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText('《路在脚下，梦在前方》', 106 * rpx , 190 * rpx)//字体内容和位置

        // 
        cvsCtx.setFillStyle('#F4623F')//字体颜色
        cvsCtx.setFontSize(14)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText("90", 30 * rpx , 240 * rpx )//字体内容和位置
        
        //
        cvsCtx.setFillStyle('#4A90E2')//字体颜色
        cvsCtx.setFontSize(14)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText("19", 106 * rpx , 240 * rpx )//字体内容和位置
        
        //
        cvsCtx.setFillStyle('#B9B9B9')//字体颜色
        cvsCtx.setFontSize(14)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText("0", 182 * rpx  , 240 * rpx )//字体内容和位置

        // 
        cvsCtx.setFillStyle('#666666')//字体颜色
        cvsCtx.setFontSize(14)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText("成绩", 30 * rpx , 270 * rpx )//字体内容和位置
        
        //
        cvsCtx.setFillStyle('#666666')//字体颜色
        cvsCtx.setFontSize(14)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText("正确", 106 * rpx , 270 * rpx )//字体内容和位置
        
        //
        cvsCtx.setFillStyle('#666666')//字体颜色
        cvsCtx.setFontSize(14)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText("错误", 182 * rpx , 270 * rpx)//字体内容和位置
        

        // logo
        cvsCtx.drawImage(avatarObj.path, 32 * rpx , 300 * rpx , 60 * rpx  , 60 * rpx); // 推进去图片

        cvsCtx.setFillStyle('#000000')//字体颜色
        cvsCtx.setFontSize(14)//字体大小
        cvsCtx.setTextAlign('center')
        cvsCtx.fillText("油葱学堂", 132 * rpx  , 340 * rpx )//字体内容和位置


        cvsCtx.draw();

        this.setState({
            isCanvas:true
        })

    }

    _canvasToimg = () => {
        var that = this;
        Taro.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: 'CanvasId',
            success: function (res) {
                let tempFilePath = res.tempFilePath;
                if(res.errMsg = 'canvasToTempFilePath:ok') {
                    Taro.saveImageToPhotosAlbum({filePath: tempFilePath}).then((res)=>{
                        if(res.errMsg = 'saveImageToPhotosAlbum:ok'){
                            Taro.showToast({
                                title:'保存成功，快分享到朋友圈吧~',
                                icon: 'none'
                            })
                            that.setState({
                                isCanvas:false
                            })
                        }
                    })
                }
            }
        })
    }

    render () {

        const {isCanvas} = this.state;

        let windowHeight = 500
        try {
            var res = Taro.getSystemInfoSync();
            windowHeight = res.windowHeight;
        }  catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        return (
            <View >
                <View className='layer' style={{height:windowHeight}} hidden={!isCanvas}>
                    <View className='layer_boxs'>
                        <View className='layer_box'>
                            <View className='layer_head'>
                                <Text className='black_label default_label'>关闭</Text>
                            </View>
                            {
                                isCanvas ? 
                                <Canvas canvasId='CanvasId' 
                                    style={{height:'760rpx',width:'424rpx',backgroundColor:'#ffffff'}} 
                                    className='canvasId'
                                >
                                </Canvas>
                            :null}
                            <View className='shareBox'>
                                <View className='share_tit'>
                                    <Text className='lg_label black_label fw_label'>分享到</Text>
                                </View>
                                <View className='share_items'>
                                    <View className='share_item' onClick={this._canvasToimg}>
                                        <Image  src={asset.wechat_icon}  className='icons'/>
                                        <Text className='c33_label sm_label mt_10'>微信好友</Text>
                                    </View>
                                    <View className='share_item'>
                                        <Image  src={asset.firends_icon}  className='icons'/>
                                        <Text className='c33_label sm_label mt_10'>朋友圈</Text>
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

export default modules as ComponentClass