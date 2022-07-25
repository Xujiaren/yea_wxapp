import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image} from '@tarojs/components'

import menu from '../../../../config/menu';

import asset from '../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import  '../../../../config/theme.css';
import './fdBackDesc.less'

type PageState = {
    fbData:{
        helpId: number,
        title: string,
        categoryId: number,
        content: string,
        pubTime: number,
        pubTimeFt: string,
    },
    cateList:Array<{
        helpId: number,
        title: string,
        categoryId: number,
        content: string,
        pubTime: number,
        pubTimeFt: string,
    }>
}

class fdBackDesc extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '问题'
    }
    timer: any;

    constructor () {
        super(...arguments)
        this.state = {
            fbData:{},
            cateList:[]
        }
    }

    componentWillMount () {
        var that = this 

        const {title,fbData,cateList} = that.$router.params


        Taro.setNavigationBarTitle({
            title: title !== undefined ? title :'问题',
        })

        that.setState({
            fbData:JSON.parse(fbData),
            cateList:JSON.parse(cateList)
        })
    }

    componentDidMount () { 

       
    }

    componentWillUnmount () {

    }
    
    componentDidShow () { }
    componentDidHide () { }


    _backDesc(cts , title){
        Taro.navigateTo({
            url:menu.fdBackDesc + '?fbData=' + JSON.stringify(cts)  + '&title=' + title + '&cateList=[]'
        }) 
    }
    
    
    render () {

        const {fbData,cateList} = this.state

        return (
            <View  className='wrap'>
                <View className="wrapHead">
                    <View className='d_flex fd_c mb_20'>
                        <Text className='lg18_label black_label fw_label'>{fbData.title}</Text>
                        <Text className='gray_label default_label mt_10'>{fbData.content}</Text>
                    </View>
                </View>
                

                {
                    cateList.length > 0 ?
                    <View className='pt_20 pb_20 pl_25'>
                        <Text className='lg20_label c33_label fw_label'>其他相关问题</Text>
                    </View>
                :null}

                {
                    cateList.length > 0 ?
                    <View className='wrap_bottom'>
                        {
                            cateList.map((cts,index)=>{
                                return(
                                    <View className='d_flex fd_r jc_sb pt_10 pb_10 bd_bt' 
                                        key={'ccitem' + index}
                                        onClick={this._backDesc.bind(this,cts,cts.title)}
                                    >
                                        <Text className='gray_label sm_label'>{cts.title}</Text>
                                        <Image src={asset.arrow_right}  mode='aspectFit' className='arrow_icon_r' />
                                    </View>
                                )
                            })
                        }
                    </View>
                :null}
                
            </View>
        )
    }
}

export default fdBackDesc as ComponentClass