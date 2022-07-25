import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image} from '@tarojs/components'

import menu from '../../../config/menu';


import inter from '../../../config/inter'
import api from '../../../services/api'
import  '../../../config/theme.css';
import './voteDesc.less'

type PageState = {

}

class voteDesc extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '活动详情'
    }

    constructor () {
        super(...arguments)
        this.state = {

        }
    }

    componentWillMount () {
    }

    componentDidMount () { 
        var that = this;
        that.getUser();
    }

    componentWillUnmount () {

    }
    
    componentDidShow () { }
    componentDidHide () { }

    getUser(){
        var that = this
        api.get(inter.User)
        .then((res)=>{
            if(res.data.status){
                let userData = res.data.data
                that.setState({
                    userId:userData.userId,
                })
            }
        })
    }

    
    
    render () {

        let windowWidth = 375
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }  catch (e) {
            
        }

        return (
            <View className='wrap'>
                <View className='wrapdesc'> 
                    <Image src={''} className='headCover' />
                    <View className='d_flex fd_c mt_5'>
                        <Text className='lg18_label c33_label fw_label'>评选中国完美中山市最美员工活动专题</Text>
                        <Text className='sm_label tip_label mt_5'>活动时间：2018.12.18 - 12.30</Text>
                        <View className='d_flex fd_r jc_sb ai_ct'>
                            <Text className='sm_label tip_label'>332人关注·222人参加</Text>
                            <View className='focusBtn'>
                                <Text className='sred_label sm_label'>关注</Text>
                            </View>
                        </View>
                    </View>
                    <View className='d_flex fd_c mt_15'>
                        <Text className='lg_label c33_label fw_label '>投票内容</Text>
                        <View className='wrapTxt mt_5'>
                            <Text className='default_label c33_label lh20_label'>一改以往教科书式的教学模式，告别枯燥的理论、数字和公式，把风光摄影基础知识和常用技巧…
数字和公式，把风光摄影基础知识和常用技巧，数字和公式，把风光摄影基础知识和常用技巧数字和公式，把风光摄影基础知识和常用技巧数字和公式，把风光摄影基础知识和常用技巧数字和公式，把风光摄影基础知识和常用技巧数字和公式，把风光摄影基础知识和常用技巧数字和公式，把风光摄影基础知识和常用技巧数字和公式，把风光摄影基础知识和常用技巧。</Text>
                            <Image src={''} className='imgCover mt_15' /> 
                        </View>
                    </View>
                    <View className='d_flex fd_c mt_15'>
                        <Text className='lg_label c33_label fw_label '>投票规则</Text>
                        <View className='wrapTxt mt_5'>
                            <Text className='default_label c33_label lh20_label'>数字和公式，把风光摄影基础知识和常用技巧，数字和公式，把风光摄影基础知识和常用技巧数字和公式，把风光摄影基础知识和常用技巧数字和公式，把风光摄影基础知识和常用技巧数字和公式。</Text>
                        </View>
                    </View>
                    <View className='votes'>
                        <View className='vote d_flex fd_r jc_sb ai_ct mb_10'> 
                            <Text className='default_label c33_label pl_20 fw_label'>徐可可老师</Text>
                            <View className='d_flex fd_r ai_ct pr_10'>
                                <Text className='default_label sred_label'>23322票</Text>
                                <View className='voteBtn'>
                                    <Text className='white_label default_label'>投票</Text>
                                </View>
                            </View>
                        </View>
                        <View className='vote d_flex fd_r jc_sb ai_ct mb_10'> 
                            <Text className='default_label c33_label pl_20 fw_label'>徐可可老师</Text>
                            <View className='d_flex fd_r ai_ct pr_10'>
                                <Text className='default_label sred_label'>23322票</Text>
                                <View className='voteBtn'>
                                    <Text className='white_label default_label'>投票</Text>
                                </View>
                            </View>
                        </View>
                        <View className='vote d_flex fd_r jc_sb ai_ct mb_10'> 
                            <Text className='default_label c33_label pl_20 fw_label'>徐可可老师</Text>
                            <View className='d_flex fd_r ai_ct pr_10'>
                                <Text className='default_label sred_label'>23322票</Text>
                                <View className='voteBtn'>
                                    <Text className='white_label default_label'>投票</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className='voteList'>
                        <View className='item' style={{width:(windowWidth - 40)/2 + 'px'}}>
                            <View className='m_10 d_flex fd_c '>
                                <Image src={''} className='itemCover' />
                                <View className='d_flex fd_r jc_sb mt_10'>
                                    <Text className='default_label c33_label'>李美玲</Text>
                                    <Text className='sred_label default_label'>1223票</Text>
                                </View>
                                <View className='voteBtn'>
                                    <Text className='white_label default_label'>投票</Text>
                                </View>
                            </View> 
                        </View>
                        <View className='item' style={{width:(windowWidth - 40)/2 + 'px'}}>
                            <View className='m_10 d_flex fd_c '>
                                <Image src={''} className='itemCover' />
                                <View className='d_flex fd_r jc_sb mt_10'>
                                    <Text className='default_label c33_label'>李美玲</Text>
                                    <Text className='sred_label default_label'>1223票</Text>
                                </View>
                                <View className='voteBtn'>
                                    <Text className='white_label default_label'>投票</Text>
                                </View>
                            </View> 
                        </View>
                        <View className='item' style={{width:(windowWidth - 40)/2 + 'px'}}>
                            <View className='m_10 d_flex fd_c '>
                                <Image src={''} className='itemCover' />
                                <View className='d_flex fd_r jc_sb mt_10'>
                                    <Text className='default_label c33_label'>李美玲</Text>
                                    <Text className='sred_label default_label'>1223票</Text>
                                </View>
                                <View className='voteBtn'>
                                    <Text className='white_label default_label'>投票</Text>
                                </View>
                            </View> 
                        </View>
                    </View>
                </View>

            </View>
        )
    }
}

export default voteDesc as ComponentClass