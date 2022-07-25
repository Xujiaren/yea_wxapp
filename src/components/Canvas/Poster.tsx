import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image,Canvas} from '@tarojs/components'

import '../../config/theme.css'
import './Poster.less'


type Props = {
    poster:{
        title:string,
        summary:string,
        hit:number,
        score:number,
        posterImg:string,
    },
    isShow:boolean
}

type State = {
    poster:{
        title:string,
        summary:string,
        hit:number,
        score:number,
        posterImg:string,
    },
    isCanvas:boolean,
    isShow:boolean,
}



export default class Poster extends Component<Props,State> {


    constructor () {
        super(...arguments)

        let poster = this.props.poster;
        let isShow = this.props.isShow;

        this.state = {
            poster:poster,
            isCanvas:false,
            isShow:isShow,
        }

        this._onSave = this._onSave.bind(this);

    }

    componentWillReceiveProps (nextProps) {
        const {poster,isShow} = nextProps
        if(poster!==this.props.poster){
            this.setState({
                poster,
                isShow
            })
        }
    }

    componentWillMount () { }

    componentDidMount () {

        var that = this ;
        that._drawPic();
    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }


    _drawPic(){
        let that = this;

        const {poster} = that.state;

        let star_full = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/ac85ca43-9728-438a-907a-a5fc6b9fc61a.png';
        let star = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/611dd3ae-f67a-4e0b-814d-f4457cb448d5.png';

        Taro.showLoading({
            title: '准备中'
        });

        Taro.getImageInfo({
            src: poster.posterImg + '?x-oss-process=image/resize,w_250',
        }).then((res)=>{

            if(res.errMsg === "getImageInfo:ok"){

                Taro.setStorageSync('postImg', {
                    path: res.path,
                    width: res.width,
                    height: res.height
                });

                Taro.getImageInfo({
                    src: star_full + '?x-oss-process=image/resize,w_12',
                }).then((res)=>{
                    if(res.errMsg === "getImageInfo:ok"){

                        Taro.setStorageSync('star_full', {
                            path: res.path,
                            width: res.width,
                            height: res.height
                        });

                        Taro.getImageInfo({
                            src: star + '?x-oss-process=image/resize,w_12',
                        }).then((res)=>{
                            if(res.errMsg === "getImageInfo:ok"){
        
                                Taro.setStorageSync('star', {
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
        })
    }

    _draw(){
        let that = this;

        const {poster} = that.state;

        var rpx ;
        Taro.getSystemInfo({
            success:function(res){
                rpx = res.windowWidth / 375 
            }
        })

        var width:number = 286;
        var height:number  = 333;

        let cvsArr:any = [];
        let title= poster.title;
        let hit = poster.hit;
        let score = poster.score ;


        const cvsCtx = Taro.createCanvasContext('PosterCanvas', that);

        cvsCtx.draw();  

        // cvsCtx.fillStyle="#FFFFFF";
        // cvsCtx.fillRect(0,0,width,height);

        let postImg = Taro.getStorageSync('postImg');
        let star_full = Taro.getStorageSync('star_full');
        let star = Taro.getStorageSync('star');


        // 生成背景图片
        cvsCtx.drawImage(postImg.path, 18, 18, 250 * rpx, 125 * rpx); // 推进去图片

        // cvsCtx.draw();



        for(let i = 0 ; i < title.length ; i+=16){
            cvsArr.push(title.slice(i,i+16))
        }

        for(let j = 0 ; j < cvsArr.length ; j++){
            cvsCtx.setFillStyle('#333333')//字体颜色
            cvsCtx.setFontSize(16)//字体大小
            cvsCtx.fillText(cvsArr[j], 18 * rpx, (164 + 20 * j)* rpx )//字体内容和位置
            cvsCtx.setTextAlign('left')
        }

        // 
        cvsCtx.setFillStyle('#999999')//字体颜色
        cvsCtx.setFontSize(14)//字体大小
        cvsCtx.fillText('轻轻松松做选择',18 * rpx, (164 + cvsArr.length * 20) * rpx)//字体内容和位置
        cvsCtx.setTextAlign('left')

        // 评分图片
        for(let i = 0 ; i < 5 ; i++){
            cvsCtx.drawImage(score - 1 < i  ?  star.path  : star_full.path , (18 + i * 14) * rpx , (180 + cvsArr.length * 20) * rpx, 12 * rpx, 12 * rpx); // 推进去图片
        }

        // 评分
        cvsCtx.setFillStyle('#666666')//字体颜色
        cvsCtx.setFontSize(12)//字体大小
        cvsCtx.fillText(`评分 ${score}`,(24 + 5 * 14) * rpx, (190 + cvsArr.length * 20) * rpx,)//字体内容和位置
        cvsCtx.setTextAlign('left')
        
        cvsCtx.drawImage(postImg.path, 190 , (180 + cvsArr.length * 20) * rpx, 80 * rpx, 80 * rpx); // 推进去图片
        
        cvsCtx.setFillStyle('#333333')//字体颜色
        cvsCtx.setFontSize(14)//字体大小
        cvsCtx.fillText(`已播放${hit}次`,18 * rpx, (280 + cvsArr.length * 20) * rpx,)//字体内容和位置
        cvsCtx.setTextAlign('left')

        cvsCtx.setFillStyle('#999999')//字体颜色
        cvsCtx.setFontSize(14)//字体大小
        cvsCtx.fillText('长按打开',200 * rpx, (280 + cvsArr.length * 20) * rpx,)//字体内容和位置
        cvsCtx.setTextAlign('left')

        cvsCtx.draw();


        
    }
   
    _onSave(){

        var that  = this ;

        Taro.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: 'PosterCanvas',
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
                                isShow:false
                            })
                        }
                    })
                }
            }
        },that);

        that.setState({
            isShow:false
        })
    }
    
    render () {
        const {isShow} = this.state
        return (
            <View className='layer' hidden={!isShow}>
                <View className='layer_boxs'>
                    <View className='layer_box'>
                        <Canvas style={{height:'666rpx',width:'576rpx'}}  canvasId='PosterCanvas' />
                    </View> 
                    <View className='btn' onClick={this._onSave}>
                        <Text>保存</Text>
                    </View>
                </View> 
            </View>
        )
    }
}
