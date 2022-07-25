import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image} from '@tarojs/components'

import '../config/theme.css'
import './index.less'
import asset from '../config/asset'

import {forTime} from '../utils/common'

type Props = {
    chapterList:any,
    chapterId:number,
    atype:number

    clickPress?:(object1,object2)=>any
}

type State = {

}

export default class Menu extends Component<Props, State> {


    constructor () {
        super(...arguments)
        this.state = {

        }


    }

    componentWillMount () { }

    componentDidMount () { }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }



    _onPress(iitem,item){
        if(this.props.clickPress){
            this.props.clickPress(iitem,item);
        }
    }


    render () {
        let {chapterList,chapterId,atype = 0} = this.props
        let isSeries = true;

        if (chapterList && chapterList.length == 0) return null;

        if (chapterList && chapterList.length < 1) {
            isSeries = false;
        }

        return (
            <View className=' d_flex  fd_c jc_sb pt_10 menuwrap' >
                {
                    chapterList&&chapterList.map((item:any, index)=>{
                        return(
                            <View key={'item'+index} className='menu_item'>
                                {isSeries ?
                                <View className='menu_head'>
                                    <Text className='default_label c33_label'>{'第' + (index + 1) +'章 ' +  item.chapterName}</Text>
                                </View>
                                : null}
                                {
                                    item.child.map((iitem, cindex)=>{

                                        const on = iitem.chapterId == chapterId

                                        return(
                                            <View key={'iitem'+ cindex} className='d_flex fd_r ai_ct jc_sb pt_10 pb_10 pr_15' style={{paddingLeft:'36rpx'}} onClick={this._onPress.bind(this, index, cindex)}>
                                                <View className='d_flex fd_r ai_ct  col_1 pr_15'>
                                                    {
                                                        on ?
                                                        <View className='menu_tip_cover'>
                                                            <Image src={asset.audioing}  className='menu_tip' />
                                                        </View>
                                                        :
                                                        <View className='menu_tips'></View>
                                                    }
                                                    <Text className='default_label c33_label ml_10' style = {on ? {color:"#FF5047"} : {color:"#333333"}}>{(index + 1) + '-' + (cindex + 1) + ' ' + iitem.chapterName}</Text>
                                                    {
                                                        iitem.isFree==1?
                                                        <Text style={{color:'#F4623F',fontSize:'26rpx', marginLeft:'20rpx'}}>试看</Text>
                                                        :null
                                                    }
                                                </View>
                                                <Text className='sm_label tip_label'>{forTime(iitem.duration)}</Text>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        )
                    })
                }
            </View>
        )
    }
}
