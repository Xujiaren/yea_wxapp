
import Taro, { Component ,Config} from '@tarojs/taro'
import { View, Text ,Image,ScrollView} from '@tarojs/components'

import asset from '../../../../config/asset'
import menu from '../../../../config/menu';
import asset1 from '../../../config/asset'
import {formatdaymonths,subNumTxt,percent2percent25} from '../../../../utils/common'


import inter from '../../../../config/inter'
import api from  '../../../../services/api'

import './signIn.less'
import  '../../../../config/theme.css';


type PageState = {
    day:Array<number>,
    checkin:number,
    integral:number,
    findsList:Array<{}>,
    isTips:boolean,
    lottery:number,
    status:number,
    text:Array<string>,
    checkType:string,
    checkInt:number,
    checkLot:number,
}

class signIn extends Component<{}, PageState>   {

    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTitleText: '签到',
        enablePullDownRefresh: false
    }

    constructor () {
        super(...arguments)
        this.state = {
            day:[1,2,3,4,5,6,7],
            checkin:0,
            integral:0,
            findsList:[],  // 活动
            isTips:false,
            lottery:0,
            status:0,
            text:[],
            checkType:'0',
            checkInt:0,
            checkLot:0
        }
        
    }

    componentWillReceiveProps(){}
    componentWillMount () { }
    componentDidMount () {
        var that = this
        that.getUser()
        that._articleList()
        that.getSigins()
        that.getText()
        that.check()
    }


    componentWillUnmount () { }
    componentDidShow () { }
    componentDidHide () { }
    getSigins=()=>{
        Date.prototype.format = function(fmt) { 
            var o = { 
            "M+" : this.getMonth()+1,                 //月份 
            "d+" : this.getDate(),                    //日 
            "h+" : this.getHours(),                   //小时 
            "m+" : this.getMinutes(),                 //分 
            "s+" : this.getSeconds(),                 //秒 
            "q+" : Math.floor((this.getMonth()+3)/3), //季度 
            "S" : this.getMilliseconds()             //毫秒 
            }; 
            if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
            }
            for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
            }
            return fmt; 
           }
        let dates = new Date().format("yyyy-MM-dd");
        api.get(inter.getSigns)
        .then(res=>{
            console.log(res)
            let time = res.data.data.filter(item=>item.date==dates)
            this.setState({status:time[0].status})
        })
    }
    getText=()=>{
        api.get(inter.Config)
        .then(res=>{
            console.log(res)
            let list = res.data.data.teacher_qiandao_text.split(";")
            this.setState({
                text:list
            })
        })
    }
    // 签到
    _signIn(){
        var that = this
        
        api.post(inter.signIn).then((res)=>{
            console.log(res)
            that.getSigins()
            if(res.data.status){
                Taro.showToast({
                    title:'签到成功',
                    icon:'none',
                    duration:1000
                })
                that.getUser()
            } else {
                Taro.showToast({
                    title:'已经签到',
                    icon:'none',
                    duration:1000
                })
            }
        })
    }
    //签到规则
    check=()=>{
        api.get(inter.Config)
        .then(res=>{
            if(res.data.status){
                let int = res.data.data.user_week_checkin_integral.split(',')
                let lst = res.data.data.user_week_checkin_lottery.split(',')
                this.setState({
                    checkType:res.data.data.user_week_checkin_type,
                    checkInt:parseInt(int[6]),
                    checkLot:parseInt(lst[6])
                })
            }
        })
    }

    // 获取个人信息判断是否登录
    getUser(){
        var that = this
        api.get(inter.User)
        .then((res)=>{
            if(res.data.status){
                let userData = res.data.data
                that.setState({
                    checkin:userData.checkin,
                    integral:userData.integral,
                    lottery:userData.lottery,
                })
            }
        })
    }


    // 活动列表
    _articleList(){
        var that = this 

        api.get(inter.Activity,{
            keyword:'',
            page:0,
        }).then((res)=>{
            if(res.data.status){
                let findList = res.data.data

                that.setState({
                    findsList:findList.items,
                })
            }
        })
    }

    //  活动详情
    artDesc(article){
        Taro.navigateTo({
            url: menu.activityDesc + '?activityId=' + article.activityId + '&articleName=' + percent2percent25(article.title) + '&atype=' + article.atype
        })
    }

    //去商城
    _toMail(){
        Taro.redirectTo({url:menu.mailIndex})
    }

    render(){

        const {checkin,integral,findsList,isTips,lottery,status,text,checkInt,checkType,checkLot} = this.state

        const bg = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/32623f00-073c-459e-8a41-bc685a49abc5.png'
        const mail = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/8791aef8-c132-4a25-a46d-c2e6c870b816.png'
        const tip = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/417e0af5-6456-438e-8e29-10ec0000ef03.png'

        return(
            <View className='signBox'>
                <Image src={asset1.qiandao} className='signCover' />
                <View className='d_flex fd_r jc_sb ai_ct pl_20 pr_20'>
                    <View className='d_flex fd_r ai_ct'>
                        <Text className='default_label c33_label'>学分：{integral}</Text>
                        <Text className='default_label c33_label ml_5'>抽奖机会：{lottery}</Text>
                    </View>
                    
                    <View className='d_flex fd_r ai_ct mt_5'
                        onClick={this._toMail}
                    >
                        <Image src={mail} className='main_icon mr_10' />
                        <Text className='sm_label c33_label'>学分换购</Text>
                    </View>
                </View>

                <View className='d_flex fd_c ai_ct signcons mt_15'>
                    <Text className='lg_label' style={{color:'#45B750'}}>已连续签到</Text>
                    <Text className='lg_label mt_10' style={{color:'#45B750'}}>{checkin}天</Text>
                    <View className='d_flex fd_r ai_ct mt_10 mb_2'>
                        {
                            checkType=='0'?
                            <Text className='default_label'>连续签到，奖励更多</Text>
                            :
                            <Text className='default_label'>连续签到，奖励更多</Text>
                        }
                        
                        <Image src={tip} className='quest_icon ml_5'  onClick={()=>this.setState({
                            isTips:true
                        })}/>
                    </View>
                    <View className='signLines mt_30'>
                        <View className='sign_line'></View>
                        <View className='d_flex fd_r jc_sb sign_dayt'>
                            {
                                [1,2,3,4,5,6,7].map((day,index)=>{
                                    const on = index < checkin;

                                    return(
                                        <View key={'day'+index} className={on ? 'sign_day' : 'sign_ofday'}>
                                            <Text className='lg_label white_label'>{day}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
                {
                    status==0?
                    <View className='m_20 d_flex ai_ct jc_ct circle_5  pt_10 pb_10  signInBtn' onClick={this._signIn}>
                        <Text className='lg_label white_label'>今日签到</Text>
                    </View>
                    :
                    <View className='m_20 d_flex ai_ct jc_ct circle_5  pt_10 pb_10  signInBtns' onClick={this._signIn}>
                        <Text className='lg_label white_label'>已经签到</Text>
                    </View>
                }

                {
                    findsList.length > 0 ?

                    <View className='pl_15 '>
                        <View className='teachzone  pb_20 pl_15 '>
                            <View className='head pl_2 pr_15   d_flex fd_r jc_sb ai_ct'>
                                <Text className='lg_label c33_label fw_label'>精彩活动</Text>
                                <View className='d_flex fd_r ai_ct jc_ct' onClick={()=>Taro.switchTab({
                                    url:menu.find
                                })}>
                                    <Text className='tip_label sm_label fw_label'>查看全部</Text>
                                    <Image src={asset.arrow_right}  className='arrow_right' />
                                </View>
                            </View>  
                            <View  
                                style={{height:'320rpx',overflowY:'auto'}}
                            >
                                <View className='teach d_flex mt_15 '> 
                                    {
                                        findsList.map((item:any,index)=>{
                                            return(
                                                <View className='teach_item mr_20 d_flex fd_c' key={'item'+index}
                                                    onClick={this.artDesc.bind(this,item)}
                                                >
                                                    <Image className='teach_cover' src={item.activityImg} />
                                                    <Text className='c33_label default_label fw_label mt_10'>{subNumTxt(item.title,6)}</Text>
                                                    <Text className='smm_label gray_label'>活动时间：{formatdaymonths(item.beginTime * 1000)}-{formatdaymonths(item.endTime * 1000)}</Text>
                                                </View> 
                                            )
                                        })
                                    }
                                </View> 
                            </View>
                            
                        </View>
                    </View>

                :null}

                {
                    isTips ?
                    <View className='layer'>
                        <View className='tips'>
                            <View className='tipdesc'>
                                <View className='d_flex fd_r jc_ct mb_20'>
                                    <Text className='lg18_label c33_label fw_label'>签到规则</Text>
                                </View>
                                <View className='bg_ye'>
                                    <ScrollView
                                        className='bg_ye'
                                        scrollY
                                        scrollWithAnimation
                                    >
                                        <View className='d_flex fd_c pt_10'>
                                            <Text className='lg_label c33_label fw_label pb_10'>{text}</Text>
                                        </View>  
                                    </ScrollView>
                                </View>
                                <View className='lat'>
                                </View>
                                <View className='tip_btn' onClick={()=>this.setState({
                                        isTips:false
                                })}>
                                    <Text className='lg_label c33_label fw_label'>我知道了</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                :null}
                

            </View>
        )
    }

}

export default signIn






