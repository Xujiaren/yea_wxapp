import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import inter from '../../../config/inter'
import api from '../../../services/api'

import asset from '../../../config/asset';
import menu from '../../../config/menu'

import '../../../config/theme.css';
import './ems.less'



type PageState = {
    orderId: number,
    list: Array<any>
}

class ems extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '物流信息'
    }

    constructor() {
        super(...arguments)
        this.state = {
            orderId: 0,
            list: [
                // {
                //     opOrgCode: "06576400",
                //     opTime: "2021-08-04 16:07:13",
                //     opName: "收寄",
                //     traceNo: "9883681600967",
                //     opDesc: "【霸州快包揽收部】已收寄,揽投员:赵阳集包,电话:18888888888",
                //     opOrgName: "霸州快包揽收部",
                //     opCode: "10",
                //     opOrgProvName: "河北省",
                //     opOrgCity: "廊坊市"
                // },
                // {
                //     opOrgCode: "06576400",
                //     opTime: "2021-08-04 21:35:04",
                //     opName: "运输",
                //     traceNo: "9883681600967",
                //     opDesc: "离开【霸州快包揽收部】,下一站【河北省环渤海邮件处理中心】",
                //     opOrgName: "霸州快包揽收部",
                //     opCode: "20",
                //     opOrgProvName: "河北省",
                //     opOrgCity: "廊坊市"
                // },
                // {
                //     opOrgCode: "06500083",
                //     opTime: "2021-08-05 01:33:51",
                //     opName: "运输",
                //     traceNo: "9883681600967",
                //     opDesc: "到达【河北省环渤海邮件处理中心】",
                //     opOrgName: "河北省环渤海邮件处理中心",
                //     opCode: "20",
                //     opOrgProvName: "河北省",
                //     opOrgCity: "廊坊市"
                // },
                // {
                //     opOrgCode: "06500083",
                //     opTime: "2021-08-06 05:03:59",
                //     opName: "运输",
                //     traceNo: "9883681600967",
                //     opDesc: "离开【河北省环渤海邮件处理中心】,下一站【无锡区域处理中心】",
                //     opOrgName: "河北省环渤海邮件处理中心",
                //     opCode: "20",
                //     opOrgProvName: "河北省",
                //     opOrgCity: "廊坊市"
                // },
                // {
                //     opOrgCode: "21403700",
                //     opTime: "2021-08-06 22:40:03",
                //     opName: "运输",
                //     traceNo: "9883681600967",
                //     opDesc: "到达【无锡区域处理中心】（经转）",
                //     opOrgName: "无锡区域处理中心",
                //     opCode: "20",
                //     opOrgProvName: "江苏省",
                //     opOrgCity: "无锡市"
                // },
                // {
                //     opOrgCode: "21403700",
                //     opTime: "2021-08-07 12:11:57",
                //     opName: "运输",
                //     traceNo: "9883681600967",
                //     opDesc: "离开【无锡区域处理中心】,下一站【常州市邮区中心局邮件处理中心】（经转）",
                //     opOrgName: "无锡区域处理中心",
                //     opCode: "20",
                //     opOrgProvName: "江苏省",
                //     opOrgCity: "无锡市"
                // },
                // {
                //     opOrgCode: "21305900",
                //     opTime: "2021-08-07 13:35:43",
                //     opName: "运输",
                //     traceNo: "9883681600967",
                //     opDesc: "到达【常州市邮区中心局邮件处理中心】",
                //     opOrgName: "常州市邮区中心局邮件处理中心",
                //     opCode: "20",
                //     opOrgProvName: "江苏省",
                //     opOrgCity: "常州市"
                // },
                // {
                //     opOrgCode: "21305900",
                //     opTime: "2021-08-08 05:46:42",
                //     opName: "运输",
                //     traceNo: "9883681600967",
                //     opDesc: "离开【常州市邮区中心局邮件处理中心】,下一站【城中区寄递事业部钟楼直投中心】",
                //     opOrgName: "常州市邮区中心局邮件处理中心",
                //     opCode: "20",
                //     opOrgProvName: "江苏省",
                //     opOrgCity: "常州市"
                // },
                // {
                //     opOrgCode: "21301604",
                //     opTime: "2021-08-08 06:38:02",
                //     opName: "运输",
                //     traceNo: "9883681600967",
                //     // opDesc: "到达【城中区寄递事业部钟楼直投中心】",
                //     opDesc: "",
                //     opOrgName: "城中区寄递事业部钟楼直投中心",
                //     opCode: "20",
                //     opOrgProvName: "江苏省",
                //     opOrgCity: "常州市"
                // },
                // {
                //     opOrgCode: "21301604",
                //     opTime: "2021-08-08 07:27:10",
                //     opName: "试投",
                //     traceNo: "9883681600967",
                //     // opDesc: "【城中区寄递事业部钟楼直投中心】安排投递,投递员:陈立广,电话:15706151901,揽投部电话:0519-83263700",
                //     opDesc: "",
                //     opOrgName: "城中区寄递事业部钟楼直投中心",
                //     opCode: "70",
                //     opOrgProvName: "江苏省",
                //     opOrgCity: "常州市"
                // },
                // {
                //     opOrgCode: "21301604",
                //     opTime: "2021-08-08 10:39:15",
                //     opName: "妥投",
                //     traceNo: "9883681600967",
                //     // opDesc: "邮件投递到常州弘阳上城12幢7号店菜鸟驿站,投递员:陈立广,电话:15706151901",
                //     opDesc: "",
                //     opOrgName: "城中区寄递事业部钟楼直投中心",
                //     opCode: "80",
                //     opOrgProvName: "江苏省",
                //     opOrgCity: "常州市"
                // },
                // {
                //     opOrgCode: "21301604",
                //     opTime: "2021-08-08 18:56:56",
                //     opName: "妥投",
                //     traceNo: "9883681600967",
                //     // opDesc: "收件人已取走邮件",
                //     opDesc: "",
                //     opOrgName: "城中区寄递事业部钟楼直投中心",
                //     opCode: "80",
                //     opOrgProvName: "江苏省",
                //     opOrgCity: "常州市"
                // }
            ]
        }

    }

    componentWillMount() {
        var that = this;
        const { orderId } = that.$router.params;
        this.setState({
            orderId: parseInt(orderId)
        })
        api.get('/order/shipping/info/' + parseInt(orderId))
            .then(res => {
                if (res.data.status) {
                    let lst = res.data.data
                    if(lst.length>0){
                        lst.reverse();
                    }
                    this.setState({
                        list: lst
                    })
                }
            })
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    componentDidShow() {

    }
    componentDidHide() { }




    render() {
        const { list } = this.state
        return (
            <View className='box'>
                {
                    list.length>0?
                    <View>
                    {
                        list.map((item, index) => {
                            return (
                                <View className={list[index + 1].opDesc && index != list.length - 1 ? 'ree_box' : !list[index + 1].opDesc && index != list.length - 1 ? 'see_box' : index == list.length - 1 ? 'nee_box' : null}>
                                    {
                                        item.opDesc ?
                                            <View className='gtip'>
                                                <View className='gtips'>
                                                </View>
                                            </View>
                                            :
                                            <View className='tip'>
                                            </View>

                                    }
                                    {
                                        item.opDesc ?
                                            <View className='words'>
                                                <View className='gcolor dsp f_16'>
                                                {item.opDesc} 
                                                </View>
                                                <View className='gcolor dsp f_13 mt_5'>
                                                    {item.opTime}
                                                </View>
                                            </View>
                                            :
                                            <View className='words'>
                                                <View className='ccolor dsp f_16'>
                                                    {item.opOrgName}
                                                </View>
                                                <View className='ccolor dsp f_13 mt_5'>
                                                    {item.opTime}
                                                </View>
                                            </View>

                                    }

                                </View>
                            )
                        })
                    }
                </View>
                :null
                }
            </View>
        )
    }
}

export default ems as ComponentClass