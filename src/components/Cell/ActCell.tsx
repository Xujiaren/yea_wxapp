import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image} from '@tarojs/components'

import {formatTimeStampToTime} from '../../utils/common'

import '../../config/theme.css'
import './ActCell.less'

type Props = {
    findt:{
        beginTime:any,
        endTime:any,
        activityImg:string,
        title:string,
        num:number,
        atype:number,
    },
    ttype:number
}

type State = {
    findt:{
        beginTime:any,
        endTime:any,
        activityImg:string,
        title:string,
        num:number,
        atype:number,
    },
    ttype:number,
}


export default class ActCell extends Component<Props, State> {


    constructor () {
        super(...arguments)

        let findt = this.props.findt;
        let ttype = this.props.ttype;

        this.state = {
            findt:findt,
            ttype:ttype,
        }

    }
    componentWillReceiveProps (nextProps) {
        const {findt} = nextProps
        if(findt!==this.props.findt){
            this.setState({
                findt
            })
        }
    }

    componentWillMount () { }

    componentDidMount () { }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }



   

    render () {

        const {findt,ttype} = this.state;

        let tit = '未开始';
        if(ttype === 1 ){
            tit = '进行中';
        } else if(ttype === 2){
            tit = '已结束';
        }

        let val = '线上活动';
        if(findt.atype === 9||findt.stype==8){
            val = '线下活动';
        }

        return (
            <View className='article' >

                <View className='arthead'>
                    {
                        findt.stype==8?
                        <Image className='arthead_cover' mode='scaleToFill' src={findt.squadImg} />
                        :
                        <Image className='arthead_cover' mode='scaleToFill' src={findt.activityImg} />
                    }
                    <View className='topright'>
                        <Text className='toptxt'>{tit}</Text>
                    </View>
                    <View className='artbottom'>
                        <Text className='artbot'>{formatTimeStampToTime(findt.startTime * 1000)} - {formatTimeStampToTime(findt.endTime * 1000)}</Text>
                    </View>
                </View>
                <View className='d_flex fd_r  ai_ct jc_sb mt_15'>
                    <Text className='lg_label c33_label fw_label col_1 per_txt pl_10'>{findt.stype==8?findt.squadName:findt.title}</Text>
                    {
                        findt.atype !== 0 ?
                        <Text className='tip_label sm_label'>{findt.stype==8?findt.registeryNum:findt.num}人参与</Text>
                    :null}
                </View>
            </View>
        )
    }
}
