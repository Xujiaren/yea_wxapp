import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import menu from '../../../config/menu'
import asset from '../../../config/asset'
import inter from '../../../config/inter'
import api from '../../../services/api'
import Tabs from '../../../components/Tabs'
import '../../../config/theme.css';
import './downLoad.less'



type PageState = {
    content: string,
    down_list:any,
    vido_list:any,
    page: number,
    pages: number,
    vpage: number,
    vpages: number,
    status: number,

}


class downLoad extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '下载专区',
        enablePullDownRefresh: true
    }
    page: number
    pages: number


    constructor(props) {
        super(props)

        this.page = 0;
        this.pages = 1;

        this.state = {
            content: '',
            down_list:[],
            vido_list:[],
            page: 0,
            pages: 1,
            vpage: 0,
            vpages: 1,
            status: 0,

        }

    }

    componentDidMount() {
        let that = this;
        that._getVido();
    }

    componentDidShow() {
       
    }
    componentWillMount(){
        let that = this;
        const { status } = that.state;
        if (status === 0) {
            that._getDown();
        } else {
            that._getVido();
        }
    }

    _getDown() {

        let that = this;
        const{down_list} = that.state
        api.get(inter.getdown, {
            page: this.page,
            ftype:2,
        }).then(res => {
            if (res.data.status) {

                let arr = res.data.data;
                if (this.page === 0) {
                    this.page = arr.page
                    this.pages = arr.pages
                    var tList = arr.items
                } else {
                    var tList: any = down_list.concat(arr.items)
                }

                this.setState({
                    down_list: tList,
                    page: arr.page,
                    pages: arr.pages,
                })

            }
        })



    }


    _getVido() {
        let that = this;
        const{vido_list} = that.state
        api.get(inter.getdown, {
            page: this.page,
            ftype:1,
        }).then(res => {
            if (res.data.status) {

                let arr = res.data.data;
                if (this.page === 0) {
                    this.page = arr.page
                    this.pages = arr.pages
                    var tList = arr.items
                } else {
                    var tList: any = vido_list.concat(arr.items)
                }

                this.setState({
                    vido_list: tList,
                    vpage: arr.page,
                    vpages: arr.pages,
                })

            }
        })

    }


    //  下啦刷新
    onPullDownRefresh() {
        var that = this;

        const { status } = that.state;

        Taro.showNavigationBarLoading();

        that.page = 0;

        that.setState({
            down_list: [],
        }, () => {

            if (status === 0) {
                that._getDown();
            } else {
                that._getVido();
            }

        })

        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }

    //上拉
    onReachBottom() {
        var self = this;
        const { page, pages, status ,vpage,vpages} = this.state
        if (status === 0) {
            if (page < pages) {
            this.page = this.page + 1;
            self._getDown();
            }
        } else {
            if (vpage < vpages) {
            this.page = this.page + 1;
            self._getVido();
            }
        }
    }

    // 详情页
    _toQust = (item,index) => {
        let idx = index
        var that = this;
        const { status } = that.state;
        var current = 0
        if(idx<10){
            current = 0
        }else{
            current = parseInt(idx/10)
        }
        if (status === 0) {
            Taro.navigateTo({
                url: menu.atlas + '?downId=' + item.downId + '&title=' + item.name + '&page='+current + '&ftype='+item.ftype
            })
        } else {
            Taro.navigateTo({
                url: menu.atlasWatch + '?downId=' + item.downId + '&title=' + item.name + '&page='+current + '&ftype='+item.ftype+'&index=0'
            })
        }

    }


    _onSelect = (idx) => {
        var that = this;
        this.page = 0;

        that.setState({
            status: idx,
            // down_list: [],
        }, () => {
            if (idx === 0) {
                that._getDown();
            } else {
                that._getVido();
            }
        })


    }


    render() {

        const { down_list, status,vido_list } = this.state;

        return (
            <View className='wrap fade bg pl_10 pr_10'>
                <View className='atabs'>
                    <Tabs items={['图集', '视频']} atype={1} selected={status} cctype={1} onSelect={this._onSelect} />
                </View>
                

                {
                    status === 0 ?
                    <View className='box_body'>
                        { down_list.map((item:any,index)=>{
                                return(
                                <View key={'item' + index} className='box_down ml_15'>
                                    <View className='picture_down mb_10' onClick={this._toQust.bind(this,item,index)}>
                                        <Image src={item.imgUrl} className='cover'/>
                                    </View>
                                    <View className='title_down mb_5'>
                                        <Text className='.black_label .default_label summary'>{item.name}</Text>
                                    </View>
                                    <View className='down_place d_flex ai_ct'>
                                        <View className='icon mr_8'>
                                            <Image src={asset.picture_down} className='picture'  />
                                        </View>
                                        <Text  className='.sm_label .tip_label'>{item.galleryList.length}</Text>
                                        <View className='icon icon_right mr_3'>
                                            <Image src={asset.vant} className='picture' />
                                        </View>
                                        <Text  className='.sm_label .tip_label'>{item.praise}</Text>
                                    </View>
                                </View>
                                )
                            })
                        }
                        </View>
                        :
                        <View className='box_body'>
                        { vido_list.map((item:any,index)=>{
                                return(
                                <View key={'item' + index} className='box_down ml_15'>
                                    <View className='picture_down mb_10' onClick={this._toQust.bind(this,item,index)}>
                                        <Image src={item.imgUrl} className='cover'/>
                                    </View>
                                    <View className='title_down mb_5'>
                                        <Text className='.black_label .default_label summary'>{item.name}</Text>
                                    </View>
                                    <View className='down_place d_flex ai_ct'>
                                        <View className='icon mr_3'>
                                            <Image src={asset.vant} className='picture' />
                                        </View>
                                        <Text  className='.sm_label .tip_label'>{item.praise}</Text>
                                    </View>
                                </View>
                                )
                            })
                        }
                        </View>
                }
                </View>        
        )

    }
}

export default downLoad as ComponentClass