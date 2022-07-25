import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image,Canvas} from '@tarojs/components'


import api from '../../../services/api'
import inter from  '../../../config/inter'
import menu from '../../../config/menu'
import asset from '../../../config/asset'

import '../../../config/theme.css'
import './Scratch.less'

type Props = {
    isShow:boolean,
    isBack:number,
    scratchId:number,
}

type PageState = {
    scratch:boolean,
    haveChance:boolean,
    itemName:string,
    isReceive:boolean,
    isNotaward:boolean,
    content:string,
    canvasbg:string,
    isScroll:boolean,
    activityId:number,
    itemIndex:number,
    itemIntegral:number,
    itemImg:string,
}

export default class Scratch extends Component<Props,PageState> {

    r: number;
    lastY: number;
    minX: any;
    minY: any;
    maxX: any;
    maxY: any;
    isStart: boolean;
    width: number;
    height: number;
    rpx:number
    lastX: number;


    constructor () {
        super(...arguments)

        this.r = 8;
        this.lastX = 0
        this.lastY = 0
        this.minX = ''
        this.minY = ''
        this.maxX = ''
        this.maxY = ''
        this.isStart = false

        const {isShow} = this.props;


        this.state = {
            scratch:false,
            haveChance:false,
            itemName:'',
            isReceive:false,
            isNotaward:false,
            content:'',
            canvasbg:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/07f54c7a-fbf2-4820-bef5-2f0aa5f1d8e0.png',
            isScroll:false,
            activityId:0,
            itemIndex:0,
            itemIntegral:0,
            itemImg:'',
        }

        this._drawScratch = this._drawScratch.bind(this);
        this.touchStart = this.touchStart.bind(this)
        this.touchMove = this.touchMove.bind(this)
        this.touchEnd = this.touchEnd.bind(this)
        
    }

    componentWillReceiveProps (nextProps) {
        const {isShow} = nextProps;

        this.setState({
            scratch:isShow
        })
    }

    componentWillMount () {
        
    }

    componentDidMount () { 
        var that = this;
        that.rpx = 3;
        Taro.getSystemInfo({
            success:function(res: { windowWidth: number; }){
                that.rpx = res.windowWidth / 375 
            }
        })

        that.width = 250;
        that.height  = 125;


        that.context = Taro.createCanvasContext('Scratch',that);

        that.isStart = true;

        that._drawPic();
    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }




    disMove(e){
        e.preventDefault();
        e.stopPropagation();
        return;
    }


    //  点击刮卡
    _scratchBtn(scratchId){
        var that = this ;
        api.get(inter.lotteryInfo,{
            activity_id:18,
            ctype:2,
            content_id:scratchId
        }).then((res)=>{
            if(res.data.status){
                let info = res.data.data
                that.setState({
                    itemName:info.itemName,
                    itemIndex:info.itemIndex,
                    itemIntegral:info.integral,
                    haveChance:true,
                    itemImg:info.itemImg
                })
            }
        })
    }

    drawRect (x, y) {
        const { r, minX, minY, maxX, maxY } = this


        const x1 = x - r > 0 ? x - r : 0
        const y1 = y - r > 0 ? y - r : 0
        if ('' != minX) {
            this.minX = minX > x1 ? x1 : minX
            this.minY = minY > y1 ? y1 : minY
            this.maxX = maxX > x1 ? maxX : x1
            this.maxY = maxY > y1 ? maxY : y1
        } else {
            this.minX = x1
            this.minY = y1
            this.maxX = x1
            this.maxY = y1
        }
        this.lastX = x1
        this.lastY = y1

        return [x1, y1, 2 * r]
    }

    //  生成刮刮卡画布
   _drawPic(){
        let that = this;
        const {canvasbg} = this.state;
        Taro.showLoading({
            title: '准备中'
        });

        Taro.getImageInfo({
            src:canvasbg  + '?x-oss-process=image/resize,w_250',
        }).then((res)=>{
            Taro.setStorageSync('pic_img', {
                path: res.path,
                width: res.width,
                height: res.height
            });
            Taro.hideLoading();
            that._drawScratch();
        })
    }

    //  生成刮刮卡画布
    _drawScratch(){

        var that = this

        let picObj = Taro.getStorageSync('pic_img');
        
        // let context = Taro.createCanvasContext('Scratch',that);

        // 生成背景图片
        that.context.drawImage(picObj.path, 0, 0, 280  , 136  ); // 推进去图片
        that.context.draw();
        that.setState({
            scratch:true
        })
    }

    touchStart(e){
        var that = this ;

        if (!that.isStart) return
        const pos = that.drawRect(e.touches[0].x, e.touches[0].y)

        that.context.clearRect(pos[0], pos[1], pos[2], pos[2])
        that.context.draw(true)

        
    }       

    touchMove(e){
        if (!this.isStart) return
        const pos = this.drawRect(e.touches[0].x, e.touches[0].y)
        this.context.clearRect(pos[0], pos[1], pos[2], pos[2])
        this.context.draw(true)
    }
    

    touchEnd(e){
        if (!this.isStart) return
        // 自动清楚采用点范围值方式判断
        const { width, height, minX, minY, maxX, maxY} = this
        const {itemIntegral} = this.state


        if (maxX - minX > .7 * width && maxY - minY > .7 * height) {
            this.context.draw()
            this.endCallBack && this.endCallBack()
            this.isStart = false
            
            if(itemIntegral > 0 ){
                this.setState({
                    isScroll: true,
                    isReceive: true
                })
            } else {
                this.setState({
                    isScroll: true,
                })
            }
        }
    }

    // 刮刮卡 中奖
    endCallBack(){
        var that = this;
        const {itemName,itemIntegral} = that.state

        Taro.showToast({
            title:itemName,
            icon:'success',
            duration:1000,
        })

        if(itemIntegral === 0){
            that.setState({
                isNotaward:true,
            })
        }
    }


    // 领取奖品
    _receive(isBack){
        var that = this ;

        Taro.showToast({
            title:'领取成功',
            icon:'success',
            duration:1000,
        })

        if(isBack === 1){
            setTimeout(()=>{
                Taro.navigateBack();
            },1000)
        } else {
            that.setState({
                scratch:false
            })
            this.props.success && this.props.success();
        }

        
    }

    //未获奖
    _notAward(isBack){
        if(isBack === 1){
            Taro.navigateBack();
        } else {
            this.setState({
                scratch:false
            })
            this.props.success && this.props.success();
        }
    }

    render () {

        const {scratch,haveChance,itemName,isReceive,isNotaward,itemImg} = this.state;
        const {isShow,isBack,scratchId} = this.props;


        return (
            <View className='layer' hidden={!scratch} onTouchMove={e => this.disMove(e)} catchtouchmove="ture">
                    <View className='layerBox'>
                        <View className='layerDesc d_flex fd_c ai_ct'>
                            <Image className='modal_img' mode='widthFix' src={"https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/573f0f5c-8e9f-4d9b-b1c2-f3ae79b45326.png"}/>
                            <View className='layerCons'>
                                
                                {
                                    haveChance ?
                                    <Canvas canvasId='Scratch' 
                                        onTouchStart={this.touchStart}
                                        onTouchMove={this.touchMove}
                                        onTouchEnd={this.touchEnd}
                                        style={{width:'500rpx',height:'250rpx',zIndex:99,marginTop:100+'rpx'}} >
                                    </Canvas>
                                :
                                    <View style={{width:'500rpx',height:'250rpx',zIndex:99,marginTop:100+'rpx'}} >
                                    </View>
                                }
                                
                                <View className='drawBox'>
                                    <View className={isReceive?'jcct mts':'jcct mt_200'}>
                                         <Text className='c33_label default_label'>{itemName}</Text>
                                    </View>
                                   
                                    {
                                        isReceive?
                                        <View className='jcct'>
                                            <Image src={itemImg} className='ws_60'/>
                                        </View>
                                        
                                        :null
                                    }
                                </View>
                                {
                                    !haveChance  ? 
                                    <View className='drawBox_lay d_flex jc_ct ai_ct' >
                                        <Text className='lg_label fw_label' style={{color:'#949494'}}>获得一张刮刮卡</Text>
                                    </View>
                                :null}
                                
                                {
                                    !haveChance  ? 
                                    <View className='scratchBtn' onClick={this._scratchBtn.bind(this,scratchId)}>
                                        <Text className='white_label default_label'>点击刮卡</Text>
                                    </View> 
                                :null}

                                {
                                    isReceive ?
                                    <View className='scratchBtn' onClick={this._receive.bind(this,isBack)}>
                                        <Text className='white_label default_label'>点击领取</Text>
                                    </View> 
                                :null}

                                {
                                    isNotaward ? 
                                    <View className='scratchBtn' onClick={this._notAward.bind(this,isBack)}>
                                        <Text className='white_label default_label'>再接再厉</Text>
                                    </View> 
                                :null}
                                
                            </View>
                            <View onClick={()=>this.setState({scratch:false})} className='dete_box'>
                                <Image src={asset.dete_icon} style={{width:50+'rpx',height:50+'rpx'}} />
                            </View>
                        </View>
                    </View>
                </View>
        )
    }
}