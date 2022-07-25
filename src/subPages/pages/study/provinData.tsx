import { ComponentClass } from 'react'
import Taro, { Component ,Config, saveImageToPhotosAlbum} from '@tarojs/taro'
import { View, Text ,Image,ScrollView} from '@tarojs/components'

import asset from '../../../config/asset';
import api from '../../../services/api';
import inter from '../../../config/inter'

import  '../../../config/theme.css';
import './provinData.less';


type PageStateProps = {

}


type PageDispatchProps = {
    getUserIntegral:(object)=>any
    getActivityFlop:() => any
}

type PageOwnProps = {}

type  PageState = {
    list:Array<{}>,
    tabs:Array<string>,
    status:number,
    navHeight:number,//刘海高度
    capHeight:number,//胶囊高度
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface provinData {
    props: IProps;
}


class provinData extends Component<PageDispatchProps & PageStateProps, PageState> {
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationStyle:"custom",
        enablePullDownRefresh: false
    }

    constructor () {
        super(...arguments)
        this.state = {
            navHeight:0,
            capHeight:0,
            list:[],
            tabs:['人数','签到','学习'],
            status:0,
        }
    }
    componentWillReceiveProps (nextProps) {
       
    }

    componentWillMount () {
        this._setbatHeight();
    }


    componentDidMount () { 
        var that = this ;
        that._region();
    }


    componentWillUnmount () { }
    componentDidShow () { }
    componentDidHide () { }

    _onSelect = (index) => {

        var that = this; 

        that.setState({
            status:index,
            list:[],
        },()=>{
           that._region(); 
        })

    }


    
    _region(){

        var that = this ;
        const {status} = that.state

        api.get(inter.region,{
            type:status
        }).then((res)=>{
            if(res.data.status){
                that.setState({
                    list:res.data.data
                })
            }

        })
    }


    // 顶部高度适应
    _setbatHeight(){
        var that = this
        var sysinfo =  Taro.getSystemInfoSync()
        var navHeight:number = 44
        var cpHeight:number = 40
        var isiOS = sysinfo.system.indexOf('iOS') > -1
        if (!isiOS) {
            cpHeight = 48
            navHeight = sysinfo.statusBarHeight;
        } else {
            cpHeight = 40
            navHeight = sysinfo.statusBarHeight;
        }

        that.setState({
            navHeight: navHeight,
            capHeight: cpHeight
        })
    }

    
    render () {

        const {list,tabs,status,navHeight,capHeight} = this.state;

        let bg_img = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/75ff8dfa-4821-4756-80a3-2c599b6dd094.png';
        let tit = '人数';

        if(status === 1){
            bg_img = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/f6776fd5-49e0-4d56-baaa-215a851da346.png';
            tit = '签到';
        } else if(status === 2) {
            bg_img = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/ea392b49-2089-453a-8bb3-7171a3c07b86.png';
            tit = '学习'
        } 

        return (
            <View  className='wrap'>
                <View className='wraper'>
                    <Image src={bg_img}  className='bg_img'/>
                    <View className='wrapper'>
                        <View className='mb_5 d_flex fd_r ' style={{height:32+'px',width:'100%'}}
                            onClick={()=>Taro.navigateBack()}
                        >
                            <Image src={asset.back_w} mode='aspectFit' className='left_arrow' /> 
                        </View>
                        <View className='d_flex fd_c wrap_tit'>
                            <Text className='white_label' style={{fontSize:56+'rpx'}}>{'各省' + `${tit}`}</Text>
                            <Text className='white_label fw_label' style={{fontSize:72 + 'rpx'}}>排行榜</Text>
                        </View>
                        <View className='cons'>
                            <View className='tabs d_flex fd_r ai_ct'>
                                {
                                    tabs.map((item,index)=>{
                                        const on = status === index ;

                                        return(
                                            <View className='d_flex fd_c ai_ct jc_ct' key={'item' + index} onClick={()=>this._onSelect(index)}>
                                                <Text className={on ?  'c33_label default_label fw_label' : 'gray_label default_label'}>{item}</Text>
                                                <View className={on ? 'onTips' : 'tips'}></View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </View>
                </View>
                

                <View className='wrap_list'>
                    {
                        list.map((item:any,index)=>{
                            console.log(item)
                            let list_tip = asset.list_1;
                            let list_val = '人';
                            

                            if(status === 1){
                                list_tip = asset.list_2;
                                list_val = '次';
                            } else if(status === 2){
                                list_tip = asset.list_3;
                                list_val = '小时'
                            }

                            return(
                                <View className='d_flex fd_r jc_sb ai_ct pt_10 pb_10' key={'item' + index}>
                                    <View className='d_flex fd_r ai_ct'>
                                        {
                                            index < 3 ? 
                                            <View className='hit_cover'>
                                                <Image src={list_tip} mode='aspectFit' className='hit_tip' />
                                            </View>
                                            :
                                            <View className='hit_cover d_flex fd_r jc_ct ai_ct'>
                                                <Text className='lg_label tip_label'>{index}</Text>
                                            </View>
                                        }
                                        
                                        <Text className='c33_label lg_label fw_label pl_20'>{item.regionName}</Text>
                                    </View>
                                    <Text className='lg_label c33_label '>{item.res}{list_val}</Text>
                                </View>
                            )
                        })
                    }
                </View>

            </View>

        )
    }
}

export default provinData as ComponentClass