import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Swiper, SwiperItem,Image} from '@tarojs/components'

import  '../../../config/theme.css';
import asset from '../../../config/asset'

import './equityState.less'

type PageState ={
    current:number,
    shareDesc:Array<{
        title:string,
        level:string,
        sumary:string,
        pic:string
    }>,
    levelist:Array<{
        content: string,
        equityId: number,
        equityImg: string,
        equityName: string,
        integral: number,
        tag: string,
    }>
}
class EquityState extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '权益详情'
    }

    constructor () {
        super(...arguments)
        this.state = {
            current:0,
            shareDesc:[{
                title:'新人礼包',
                level:'L0',
                sumary:'首次注册、登录的用户可获得50个学分的奖励。',
                pic:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/growth_1.png'
            },{
                title:'分享礼包',
                level:'L0~L6',
                sumary:'会员向他人推荐 油葱学堂 小程序，被邀请者成功安装注册登录后，推荐者根据自身会员级别可获得对应学分奖励，Lv0会员可获得20枚，Lv1会员获得25枚，Lv2会员获得30枚，Lv3会员获得35枚，Lv4会员获得40枚，Lv5会员获得45枚，Lv6会员获得50枚，多推荐多得！',
                pic:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/growth_2.png'
            },{
                title:'抽奖资格',
                level:'L1~L6',
                sumary:'会员向朋友推荐油葱学堂小程序 ,被推荐者新装并完成新手任务后，推荐者可获得1次抽奖资格，被推荐者每成功增加1个，即可增加1次抽奖资格，抽奖资格不限次数，多劳多得。同时会员在晋级时可额外获得1次抽奖资格。',
                pic:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/growth_3.png'
            },{
                title:'生日特权',
                level:'L1~L6',
                sumary:'在会员生日当天，在完成相应任务后，可获得奖励翻倍的特权，同时收到一份来自完美精心定制的生日祝福！',
                pic:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/growth_4.png'
            }],
            levelist:[]
        }
    }

    componentWillMount () { 
        var that = this

        const {equityId,levelist} = this.$router.params

        let levelIndex = 0
        let levellist = JSON.parse(levelist)

        for(let i = 0 ; i < levellist.length ; i++){

            if(levellist[i].equityId === parseInt(equityId)){
                levelIndex = i
            }

        }

        that.setState({
            current:levelIndex,
            levelist:JSON.parse(levelist)
        })
    }
    componentDidMount () { }
    componentWillUnmount () { }
    componentDidShow () { }
    componentDidHide () { }
    

    _onSwiper(e){
        var that = this
        that.setState({
            current:e.detail.current
        })
    }


    render () {
        const {current,levelist} = this.state

        return (
            <View className='nickwrap'>
                <Swiper
                      className='sharecons'
                      indicatorColor='#999'
                      indicatorActiveColor='#333'
                      circular
                      current={current}
                      indicatorDots={false}
                      previous-margin="100rpx"
                      next-margin="100rpx"
                      onChange={(e)=>this._onSwiper(e)}
                    >
                        {
                            levelist.map((share:any,index)=>{
                                const on = current  == index
                                let pic_icon = asset.g_share
                                if(index == 0){
                                    pic_icon = asset.g_share
                                } else if (index == 1){
                                    pic_icon = asset.g_share
                                } else if (index == 2){
                                    pic_icon = asset.g_filp
                                } else if (index == 3){
                                    pic_icon = asset.g_breath
                                }
                                return(
                                    <SwiperItem className='levels' key={'share'+index}>
                                        {/* 图片的尺寸  812*1209*/}
                                        <View className={ on ? 'sharebox active_img' : 'sharebox' }>
                                            <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/equity_head.png'} className='share_head'/> 
                                            <View className='headbox d_flex fd_c ai_ct jc_ct'>
                                                <View className='head_icon d_flex ai_ct jc_ct'>
                                                    <Image src={share.equityImg}  className='c_gift' />
                                                </View>
                                                <Text className='lg_label black_label fw_label' style={{marginTop:'14rpx'}}>{share.equityName}</Text>
                                            </View>
                                            <View className='d_flex fd_c mt_20 pr_20 pl_12'>
                                                <Text className='black_label lg_label border_let ml_5  pl_15 mb_10 fw_label'>服务用户</Text>
                                                <Text className='sm_label tip_label ml_25'> {share.leveStr}</Text>
                                                <Text className='lg_label black_label border_let ml_5 mt_30 mb_20 pl_15 fw_label'> 权益说明</Text>
                                                <View className='share_txt pl_25'> 
                                                    <Text className='gray_label sm_label'>{share.content}</Text>
                                                </View>
                                            </View>
                                            <View className='share_cover'>
                                                <Image src={share.bottomImg}  className='share_pic' />
                                            </View>
                                        </View>
                                        
                                    </SwiperItem>
                                )
                            })
                        }
                    </Swiper>
            </View>
        )
    }
}

export default EquityState as ComponentClass