import Taro, { Component ,getApp} from '@tarojs/taro'
import { View, Text ,Image,Slider} from '@tarojs/components'

import asset from '../../config/asset'
import menu from '../../config/menu'
import { set as setGlobalData, get as getGlobalData } from '../../utils/global_data'
import '../../config/theme.css'
import './index.less'

import {forTime} from '../../utils/common'



type Props = {
    cmic_type:number,
    cmic_duration:number,
    updateData:{
        isPlaying:boolean,
        cmic_audioName:string,
        cmic_audioId:number,
        cmic_audioImg:string,
        cmic_siger:string,
        cmic_duration:number,
        isCMusic:boolean
    }

    onUpdatePlayStatus:()=>any,
};

type State = {
    cmic_duration:number,
    current:number,
    cmic_type:number,
    cmic_audioId:number,
    cmic_audioName:string,
    cmic_audioImg:string,
    cmic_siger:string,
    isCMusic:boolean
}

const app = getApp();



export default class Course extends Component<Props,State> {
    backgroundAudioManager: any


    constructor () {
        super(...arguments)

        const {cmic_type=1,cmic_duration=0,updateData,} = this.props
        if(updateData !== undefined){
            this.state = {
                cmic_duration:cmic_duration,
                current:0,
                cmic_type:cmic_type,
                cmic_audioId:updateData.cmic_audioId,
                cmic_audioName:updateData.cmic_audioName,
                cmic_audioImg:updateData.cmic_audioImg,
                cmic_siger:updateData.cmic_siger,
                isCMusic:updateData.isCMusic
            }
        }
        

        this.switchPlayStatus = this.switchPlayStatus.bind(this);

    }

    

    componentWillMount () { 
        this.backgroundAudioManager = app.globalData.backgroundPlayer;
    }

    componentDidMount () { }

    componentWillUnmount () { }

    componentDidShow () { 
        var that= this ;
        const {cmic_type=1,cmic_duration=0,updateData,} = this.props

        // console.log(updateData)

        if(updateData !== undefined){
            that.state = {
                cmic_duration:cmic_duration,
                current:0,
                cmic_type:cmic_type,
                cmic_audioId:updateData.cmic_audioId,
                cmic_audioName:updateData.cmic_audioName,
                cmic_audioImg:updateData.cmic_audioImg,
                cmic_siger:updateData.cmic_siger,
                isCMusic:updateData.isCMusic
            }
        }

       
    }

    componentDidHide () { }


    _sliderChange(e){

        var that = this
    }



    _onCourse(){
        var that = this;
        const {cmic_audioId,cmic_audioName} = that.state
        Taro.navigateTo({url:menu.audioDesc +'?course_id='+ cmic_audioId + '&audioName=' + cmic_audioName})
    }


    switchPlayStatus(){
        var that = this;
        const {cmic_type} = that.state

        if(cmic_type){
            setGlobalData('cmic_type',0)
            this.backgroundAudioManager.pause();
            that.setState({
                cmic_type:0
            })
        } else {
            this.backgroundAudioManager.play();
            setGlobalData('cmic_type',1)
            that.setState({
                cmic_type:1
            })
        }

    }

    handleStop(e){
        e.stopPropagation()
    }
   

    _isCMusic(){

        var that = this 

        that.setState({
            isCMusic:true
        })
    }

    render () {
        const {cmic_duration,cmic_type,cmic_audioImg,cmic_audioName,cmic_siger,isCMusic} = this.state

        // console.log(cmic_duration,cmic_type,cmic_audioImg,cmic_audioName,cmic_siger,isCMusic)

        return (
            <View className='cmic d_flex fd_r   pb_20 ' hidden={isCMusic}>
                <View className='cmic_cons'
                    onClick={this._onCourse}
                >
                    <View className='cmic_desc'>
                        <Image src={cmic_audioImg}  className='cmic_img'/>
                        <View className='d_flex fd_c pl_10 col_1'>
                            <Text className='c33_label sm_label fw_label'>{cmic_audioName}</Text>
                            <Text className='tip_label smm_label'>时长 {forTime(cmic_duration)}   {cmic_siger.length > 0 ? `主讲人：${cmic_siger}`  :null}  </Text>
                        </View>
                        <View onClick={this.handleStop} className='d_flex fd_r ai_ct'>
                            <View className='cmic_parse' 
                                onClick={this.switchPlayStatus}
                            >
                                <Image src={cmic_type  === 0 ?  asset.cmic_parse : asset.cmic_beg}     className='cmic_beg'/>
                            </View>
                            <Image src={asset.dete_icon} className='dete_icon'  onClick={this._isCMusic}/>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
