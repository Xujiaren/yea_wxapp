import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image} from '@tarojs/components'

import menu from '../../../../config/menu';

import asset from '../../../config/asset'

import inter from '../../../../config/inter'
import api from '../../../../services/api'

import {connect} from '@tarojs/redux'
import { usersType } from '../../../../constants/usersType'
import { getCateQuestion} from '../../../../actions/user'

import {subNumTxt} from '../../../../utils/common'

import  '../../../../config/theme.css';
import './fdBack.less'


type PageStateProps = {
    user:usersType,
    getCateQuestion:Array<{}>,
}

type PageState = {
    isArrow:boolean
    cateQuestion:Array<{
        categoryId: number,
        ctype: number,
        categoryName: string,
        summary: string,
        sortOrder: number,
        status: number,
        isDelete: number,
        courseNum: number,
        link: string,
        isMust: number,
        child: string,
    }>,
    category_id:number,
    cateList : Array<{
        helpId: number,
        title: string,
        categoryId: number,
        content: string,
        pubTime: number,
        pubTimeFt: string,
    }>,
    showId:number,
    unioinId:string,
    nickname:string,
}

type PageDispatchProps = {
    getCateQuestion:()=>any
}

type PageOwnProps = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


interface fdBack {
    props: IProps;
}

@connect(({user}) => ({
    user:user,
}),(dispatch) => ({
    getCateQuestion(){
        dispatch(getCateQuestion())
    }
}))




class fdBack extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '帮助反馈'
    }
    timer: any;

    constructor () {
        super(...arguments)
        this.state = {
            isArrow:false,
            cateQuestion:[],
            category_id:0,
            cateList:[],
            showId:0,
            unioinId:'',
            nickname:''
        }
    }

    componentWillReceiveProps (nextProps) {
        var that = this;

        const {user} = nextProps
        const {cateQuestion} = user

        if(user !== this.props.user){

            let cateFeed_id:number = cateQuestion[0].categoryId

            that.setState({
                cateQuestion:cateQuestion,
                category_id:cateFeed_id
            })
        }
    }

    componentWillMount () {
    }

    componentDidMount () { 
        var that = this;
        that.getCateQuestion()
        that._getUser();
    }
    componentDidShow () { 
        this.getCateQuestion()
    }

    componentWillUnmount () {

    }
    
    componentDidHide () { }


    // 帮助反馈列表
    getCateQuestion(){
        var that = this
        that.props.getCateQuestion()
    }

    // 点击分类
    _onCate(cate,idx){
        var that = this 
        const {showId} = that.state

        that.setState({
            cateList:[],
            showId:0
        })

        if(cate.categoryId !== showId){
            that._getHelpList(cate.categoryId)
            that.setState({
                showId:cate.categoryId
            })
        }
        
    }


    // 小分类
    _getHelpList(cateId){
        var that = this 

        api.get(inter.ConfigHelp ,{
            category_id:cateId,
            keyword:'',
            page:0 
        }).then((res)=>{
            if(res.data.status){
                let help = res.data.data.items
                that.setState({
                    cateList:help
                })
            }
        })
    }

    //  问题详解
    _backDesc(item,categoryName,cateList,idx){

        cateList.splice(idx,1)
        
        Taro.navigateTo({
            url:menu.fdBackDesc + '?fbData=' + JSON.stringify(item) + '&title=' + categoryName + '&cateList=' + JSON.stringify(cateList)
        }) 
    }

    _getUser(){
        var that = this ;

        api.get(inter.User)
        .then((res)=>{
            if(res.data.status){
                const userdata = res.data.data
                console.log(userdata,'???')
                that.setState({
                    nickname:userdata.nickname,
                    unioinId:userdata.unioinId
                })
            }
        })
    }

    
    render () {

        const {cateQuestion,showId,cateList,unioinId,nickname} = this.state

        return (
            <View className='wrap'>
                
                <View className='d_flex fd_r ai_ct jc_sb questBox' onClick={() => Taro.navigateTo({url:menu.feedBack})}>
                    <Text className=' lg_label fw_label'>问题反馈</Text>
                    <Image src={asset.arrow_right}  mode='aspectFit' className='arrow_icon_r' />
                </View>

                <View className='d_flex fd_r ai_ct jc_sb questBox' onClick={() => Taro.navigateTo({url:menu.kefu + '?unioinId=' + unioinId+'&nickname='+nickname})}>
                    <Text className=' lg_label fw_label'>联系客服</Text>
                    <Image src={asset.arrow_right}  mode='aspectFit' className='arrow_icon_r' />
                </View>


                <View className='pt_20 pb_20'>
                    <Text className='lg20_label c33_label fw_label'>常见问题</Text>
                </View>
                <View>
                    {
                        cateQuestion.map((cate,index)=>{

                            return(
                                <View key={'cate' + index }>
                                    <View className='d_flex fd_r ai_ct pt_10 '
                                        onClick={this._onCate.bind(this,cate,index)}
                                    >
                                        <Image src={cate.link} mode='aspectFit'  className='fd_icon' />
                                        <View className={showId === cate.categoryId && cateList.length > 0 ? 'bg_cate border_nbtm' : 'bg_cate border_obtm' }>
                                            <View className='d_flex fd_c '>
                                                <Text className='default_label c33_label fw_label'>{cate.categoryName}</Text>
                                                <Text className='tip_label sm_label'>{subNumTxt(cate.summary,36)}</Text>
                                            </View>
                                            {
                                                showId === cate.categoryId ? 
                                                <Image src={asset.arrow_top}  mode='aspectFit' className='arrow_icon_b' />
                                                :
                                                <Image src={asset.arrow_bottom}  mode='aspectFit' className='arrow_icon_b' />
                                            }
                                        </View>
                                    </View>
                                    
                                    {
                                        showId === cate.categoryId  && cateList.length > 0 ? 
                                        <View className='wrap_bottom'>
                                            {
                                                cateList.map((ccitem,idx)=>{
                                                    return(
                                                        <View className='d_flex fd_r jc_sb pt_10 pb_10 bd_bt' 
                                                            key={'ccitem' + idx}
                                                            onClick={this._backDesc.bind(this,ccitem,cate.categoryName,cateList,idx)}
                                                        >
                                                            <Text className='gray_label sm_label'>{ccitem.title}</Text>
                                                            <Image src={asset.arrow_right}  mode='aspectFit' className='arrow_icon_r' />
                                                        </View>
                                                    )
                                                   
                                                })
                                            }
                                        </View>
                                    :null}
                                    
                                </View>
                            )
                        })
                    }
                    
                </View>

            </View>
        )
    }
}

export default fdBack as ComponentClass