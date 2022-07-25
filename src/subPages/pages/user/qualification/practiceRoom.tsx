import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image} from '@tarojs/components'

import menu from '../../../../config/menu';
import inter from '../../../../config/inter'
import api from '../../../../services/api'


import  '../../../../config/theme.css';
import './practiceRoom.less'

type PageState = {
    Imgs:Array<string>,
    squadId:number,
    examTitle:string,
    examImg:string,
}

class practiceRoom extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '练习室'
    }
    timer: any;

    constructor () {
        super(...arguments)
        this.state = {
            Imgs:["https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/34607234-a60b-4906-a48e-dfb136db378d.png",
                  "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/08d4f40b-9cab-4a64-a956-47e738318eba.png",
                  "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/d8f29a0e-bcbd-48dc-aab7-923fba9116e2.png",
                  "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/6bbbdada-9dec-4aa3-941b-c675c8009956.png"
            ],
            squadId:0,
            examTitle:'',
            examImg:'',
        }
    }

    componentWillMount () {
        var that = this 
        const {squadId,examTitle,examImg} = that.$router.params

        that.setState({
            squadId:parseInt(squadId),
            examTitle:examTitle,
            examImg:examImg
        })
    }

    componentDidMount () { 

    }

    componentWillUnmount () {

    }
    
    componentDidShow () { }
    componentDidHide () { }

    

    
    render () {

        const {Imgs,squadId,examTitle,examImg} = this.state

        return (
            <View className='wrap'>
                <View className='study_item_wrap'>
                    <View className='studyItem'>
                        <Image className='study_item' mode='aspectFit' src={Imgs[0]}
                            onClick={()=>{ Taro.navigateTo({url:menu.videoLearn + '?squadId=' + squadId })}}
                        />
                    </View>
                    <View className='studyItem'>
                        <Image className='study_item' mode='aspectFit' src={Imgs[1]}
                            onClick={()=>{ Taro.navigateTo({ url:menu.topicSort  + '?squadId=' + squadId + '&examTitle=' + examTitle + '&examImg=' + examImg}) }}
                        />
                    </View>
                    <View className='studyItem'>
                        <Image className='study_item' mode='aspectFit' src={Imgs[2]}
                            onClick={()=>Taro.navigateTo({url:menu.cateExam + '?squadId=' + squadId + '&examTitle=' + examTitle + '&examImg=' + examImg})}
                        />
                    </View>

                    <View className='studyItem'>
                        <Image className='study_item' mode='aspectFit' src={Imgs[3]}
                            onClick={()=>Taro.navigateTo({url:menu.offlineSign + '?squadId=' + squadId})}
                        />
                    </View>

                </View>
            </View>
        )
    }
}

export default practiceRoom as ComponentClass