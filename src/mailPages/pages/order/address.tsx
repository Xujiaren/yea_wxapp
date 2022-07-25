import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image} from '@tarojs/components'

import inter from '../../../config/inter'
import api from '../../../services/api'

import asset from '../../../config/asset';
import menu from '../../../config/menu'

import  '../../../config/theme.css';
import './address.less'



type PageState = {
    adsList:Array<{}>,
    nageType:number,
    rewardId:number,
    iftype:number,
}

class address extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '地址管理'
    }

    constructor () {
        super(...arguments)
        this.state = {
            adsList:[],
            nageType:0,
            rewardId:0,
            iftype:0,
        }
        this._doneAddress = this._doneAddress.bind(this);
        this._doneDefault = this._doneDefault.bind(this);
        this._onDelete = this._onDelete.bind(this);
    }

    componentWillMount () {

        var that = this ; 
        const {nageType,rewardId} = that.$router.params

        if(parseInt(nageType) === 1){
            that.setState({
                nageType:1
            })
        }
        if(parseInt(nageType) === 2){
            that.setState({
                nageType:2,
                rewardId:parseInt(rewardId)
            })
            Taro.showToast({
                title:'请选择地址',
                duration:1500,
            })
        }
        if(parseInt(nageType) === 3){
            that.setState({
                nageType:3,
                rewardId:parseInt(rewardId)
            })
            Taro.showToast({
                title:'请选择地址',
                duration:1500,
            })
        }
        if(parseInt(nageType) === 4){
            that.setState({
                nageType:4,
                rewardId:parseInt(rewardId)
            })
            Taro.showToast({
                title:'请选择地址',
                duration:1500,
            })
        }
    }

    componentDidMount () { 
        
    }

    componentWillUnmount () {
        // const{nageType,iftype}=this.state
        // if(nageType==2){
        //     if(iftype==0){
                
        //     }
        // }
    }
    
    componentDidShow () { 
        var that = this;
        that.getAddress();
    }
    componentDidHide () { }

    getAddress(){
        var that = this;
        api.get(inter.Address)
        .then((res)=>{
            if(res.data.status){
                that.setState({
                    adsList:res.data.data
                })
            }
        })
    }

    _doneAddress(type,ads){
        Taro.navigateTo({
            url:menu.doneAdress + '?type=' + type  + '&ads=' + JSON.stringify(ads)
        })
    }

    _onDelete(addressId){
        var that = this;
        api.post(inter.DeleteAddress ,{
            address_id:addressId
        }).then((res)=>{
            if(res.data.status){
                that.getAddress();
                Taro.showToast({
                    title:'删除成功',
                    icon:'none',
                    duration:2000,
                })
            }
        })

    }

    _doneDefault(addressId,index){
        var that = this;
        const {nageType,adsList} = that.state

        api.post(inter.DefaultAddress,{
            address_id:addressId
        }).then((res)=>{
            if(res.data.status){
                that.getAddress();


                Taro.showToast({
                    title:'设置默认地址成功',
                    icon:'none',
                    duration:1000,
                })

                setTimeout(()=>{
                    that._goBackData(adsList[index])
                },1000)
            
            }
        })
    }

    _goBackData(ads){


        let pages = Taro.getCurrentPages(); // 获取当前的页面栈 
        let prevPage = pages[pages.length-2]; //  获取上一页面

        prevPage.setData({ //设置上一个页面的值
            adsData: ads
        });

        Taro.navigateBack({
            delta: 1
        });

    }


    handleStop(e){
        e.stopPropagation()
    }
    _goOndata=(val)=>{
        var that = this
        const{rewardId,nageType}=that.state
        if(nageType==2){
            Taro.showModal({
                title: '确认地址',
                content: val.province+val.city+val.district+val.address,
                success: function (res) {
                  if (res.confirm) {
                    api.post(inter.recaddress+rewardId,{
                        address:val.province+val.city+val.district+val.address,
                        mobile:val.mobile,
                        realname:val.realname
                    }).then(res=>{
                        that.setState({
                            iftype:1
                        })
                        Taro.showToast({
                            title:'操作成功',
                            icon:'success',
                            duration:1000
                        })
                        setTimeout(() => {
                            Taro.navigateBack({
                                delta:3
                            })
                        }, 1000);
                    })
                  } else if (res.cancel) {
                    Taro.showToast({
                        title:'请选择地址',
                        icon:'none',
                        duration:1500,
                    })
                  }
                }
              })
        }
        if(nageType==3){
            Taro.showModal({
                title: '确认地址',
                content: val.province+val.city+val.district+val.address,
                success: function (res) {
                  if (res.confirm) {
                //       console.log(rewardId,'???')
                //     api.post('/activity/lottery/receive/'+rewardId,{
                //         address:val.province+val.city+val.district+val.address,
                //         mobile:val.mobile,
                //         realname:val.realname
                //     }).then(res=>{
                //         that.setState({
                //             iftype:1
                //         })
                //         Taro.showToast({
                //             title:'操作成功',
                //             icon:'success',
                //             duration:1000
                //         })
                //         setTimeout(() => {
                //             Taro.navigateBack({
                //                 delta:1
                //             })
                //         }, 1000);
                //     })
                // }
                    let pages = Taro.getCurrentPages();
                    let prevPage = pages[pages.length-2];
                    prevPage.setData({ //设置上一个页面的值
                        ads:val.province+val.city+val.district+val.address,
                        mobile:val.mobile,
                        realname:val.realname,
                        trues:1,
                        ttyps:2,
                      });
                      Taro.navigateBack({
                        delta: 1
                      });
                  } else if (res.cancel) {
                    Taro.showToast({
                        title:'请选择地址',
                        icon:'none',
                        duration:1500,
                    })
                  }
                }
            })
        }
        if(nageType==4){
            Taro.showModal({
                title: '确认地址',
                content: val.province+val.city+val.district+val.address,
                success: function (res) {
                  if (res.confirm) {
                      console.log(rewardId,'???')
                    api.post('/activity/lottery/receive/'+rewardId,{
                        address:val.province+val.city+val.district+val.address,
                        mobile:val.mobile,
                        realname:val.realname
                    }).then(res=>{
                        that.setState({
                            iftype:1
                        })
                        Taro.showToast({
                            title:'操作成功',
                            icon:'success',
                            duration:1000
                        })
                        setTimeout(() => {
                            Taro.navigateBack({
                                delta:1
                            })
                        }, 1000);
                    })
                }
                //     let pages = Taro.getCurrentPages();
                //     let prevPage = pages[pages.length-2];
                //     prevPage.setData({ //设置上一个页面的值
                //         ads:val.province+val.city+val.district+val.address,
                //         mobile:val.mobile,
                //         realname:val.realname,
                //         trues:1,
                //         ttyps:2,
                //       });
                //       Taro.navigateBack({
                //         delta: 1
                //       });
                //   } else if (res.cancel) {
                //     Taro.showToast({
                //         title:'请选择地址',
                //         icon:'none',
                //         duration:1500,
                //     })
                //   }
                }
            })
        }
        
    }

    render () {
        const {adsList,nageType} = this.state
        return (
            <View  className="adswrap">
                {
                    adsList.length > 0 ?
                    <View className='pb_50'>
                        {
                            adsList.map((ads:any,index)=>{
                                return(
                                    <View className='d_flex fd_c adsList' key={'ads' + index} 
                                        onClick = {nageType === 1 ? this._goBackData.bind(this,ads) :nageType === 2||nageType === 3||nageType === 4?this._goOndata.bind(this,ads): null}
                                    >
                                        <View className='d_flex fd_r jc_sb pl_25 pr_25'>
                                            <Text className='lg_label c33_label fw_label'>{ads.realname}</Text>
                                            <Text className='default_label c33_label'>{ads.mobile}</Text>
                                        </View>
                                        <Text className='default_label c33_label pt_15 pb_15 pl_25 pr_25'>{ads.province + ads.city + ads.district + ads.address}</Text>
                                        <View className='d_flex fd_r jc_sb  ai_ct adsList_bottom' onClick={this.handleStop.bind(this)}>
                                            <View className='d_flex fd_r  ai_ct pl_25' onClick={this._doneDefault.bind(this,ads.addressId,index)}>
                                                <Image src={ads.isFirst == 0 ? asset.radio : asset.radio_full} className='adsList_cover' />
                                                <Text className={ads.isFirst == 0 ? ' tip_label  default_label ml_10' : 'red_label default_label ml_10'} >{ads.isFirst == 0 ? '设为默认'  : '默认地址'
                                                }</Text>
                                            </View>
                                            <View className='d_flex fd_r pr_25'>
                                                <View className='adsList_Btn d_flex fd_r ai_ct jc_ct' 
                                                    onClick={this._doneAddress.bind(this,1,ads)}
                                                >
                                                    <Text className='default_label c33_label'>编辑</Text>
                                                </View>
                                                <View className='adsList_Btn d_flex fd_r ai_ct jc_ct ml_10'
                                                    onClick={this._onDelete.bind(this,ads.addressId)}
                                                >
                                                    <Text className='default_label c33_label'>删除</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                :
                    <View className='adsBox'>
                        <Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/empty_addr.png'}  className='ads_cover' />
                        <Text className='sm_label tip_label'>您尚未添加收货地址</Text>
                        <View className='doneBtn' onClick={this._doneAddress.bind(this,0,{})}>
                            <Text className='lg_label red_label'>去添加</Text>
                        </View>
                    </View>
                }
                
                {
                    adsList.length > 0 ?
                    <View className='add_address d_flex fd_r ai_ct jc_ct' onClick={this._doneAddress.bind(this,0,{})}>
                        <Text className='lg_label white_label'>新增收货地址</Text>
                    </View>
                :null}
                
            </View>
        )
    }
}

export default address as ComponentClass