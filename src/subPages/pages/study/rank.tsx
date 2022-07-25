import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'

import {
    getRankIntegral,
    getRankMonth,
    getRankTotal,
    getUser
} from '../../../actions/user'


import asset from '../../../config/asset'
import { connect } from '@tarojs/redux'
import { usersType } from '../../../constants/usersType'
import { subNumTxt } from '../../../utils/common'
import api from '../../../services/api'
import inter from '../../../config/inter'

import menu from '../../../config/menu'

import '../../../config/theme.css';
import './rank.less'


type PageStateProps = {
    user: usersType,
    getRankIntegral: Array<{}>,
    getRankMonth: Array<{}>,
    getRankTotal: Array<{}>,
    getUser: Array<{}>,
}

type PageDispatchProps = {
    getRankIntegral: () => any,
    getRankMonth: () => any,
    getRankTotal: () => any,
    getUser: () => any,
}

type PageOwnProps = {}

type PageState = {
    status: number,
    atabs: Array<string>,
    selected: number,


    new_rank: Array<{
        avatar: string,
        duration: 0,
        index: 0,
        integral: 0,
        isAuth: string,
        nickname: string,
        regionName: string,
        res: string,
        userId: 0
    }>,
    new_rank_rk: Array<{
        avatar: string,
        duration: 0,
        index: 0,
        integral: 0,
        isAuth: string,
        nickname: string,
        regionName: string,
        res: string,
        userId: 0
    }>,
    type: number,
    ttyp: number,
    rewardId: number,
    reward_list: any,
    tip: number,
    address: any,
    ads: string,
    realname: string,
    mobile: string,
    adss: string,
    realnames: string,
    mobiles: string,
    trues:number,
    userId:number,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Rank {
    props: IProps;
}

@connect(({ user }) => ({
    user: user
}), (dispatch) => ({
    getRankIntegral() {
        dispatch(getRankIntegral())
    },
    getRankMonth() {
        dispatch(getRankMonth())
    },
    getRankTotal() {
        dispatch(getRankTotal())
    },
    getUser() {
        dispatch(getUser())
    },
}))


class Rank extends Component<{}, PageState> {
    /**
   * 指定config的类型声明为: Taro.Config
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    // eslint-disable-next-line react/sort-comp
    config: Config = {
        navigationBarTextStyle: "white",
        navigationBarTitleText: '排行榜',
        navigationBarBackgroundColor: '#FF8137'
    }

    constructor() {
        super(...arguments)
        this.state = {
            status: 0,
            atabs: ['学霸周榜', '学分月榜', '活跃月榜'],
            selected: 0,

            new_rank: [],
            new_rank_rk: [],
            type: 2, // 2 学霸榜 3 学分榜 4 活跃榜 
            ttyp: 0,
            rewardId: 0,
            reward_list: {},
            tip: 0,
            address: {},
            ads: '',
            realname: '',
            mobile: '',
            adss: '',
            realnames: '',
            mobiles: '',
            trues:0,
            userId:0,
        }

        this._onSelect = this._onSelect.bind(this);
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.getRankReward();
    }

    componentWillUnmount() { }

    componentDidShow() {
        

        this.newRank();
        var that =this
        let tips = Taro.getStorageSync('ifmiss')
        this.setState({
            tip: tips
        })
        let pages = Taro.getCurrentPages();
        let currPage = pages[pages.length - 1];
        if (currPage.__data__.ads) { // 获取值
            this.setState({ 
                ads: currPage.__data__.ads,
                mobile:currPage.__data__.mobile,
                realname:currPage.__data__.realname,
                trues:currPage.__data__.trues,
                ttyp:currPage.__data__.ttyps,
             },()=>{
                this.getUser()
             })
          }else{
              this.getUser()
          }
    }

    componentDidHide() { }

    getRankReward = () => {
        const { type,ttyp,status } = this.state
        let val = 0
        if (status == 1) {
            val = 1
        }
        if (status == 2) {
            val = 2
        }
        api.get(inter.RankReward, {
            type: val
        }).then(res => {
            console.log(res)
            if (res.data.status) {
                if(ttyp==2){
                    this.setState({
                        rewardId: res.data.data.rewardId,
                        reward_list: res.data.data
                    })
                }
                if(ttyp!=2){
                    this.setState({
                        ttyp: res.data.data.ctype,
                        rewardId: res.data.data.rewardId,
                        reward_list: res.data.data
                    })
                }
            }
        })
    }
    newRank() {

        var that = this;
        const { status } = that.state;
        api.get(inter.newRank, {
            type: status
        }).then((res) => {
            if (res.data.status) {
                that.setState({
                    new_rank: res.data.data,
                    new_rank_rk: res.data.data
                })
            }

        })
    }


    _onSelect(index) {

        var that = this;
        let val = 2;
        let backBar = '#FF8137';

        if (index === 1) {
            val = 3;
            backBar = '#FEBC3A';
        } else if (index === 2) {
            val = 4;
            backBar = '#291CF9';
        }

        Taro.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: backBar,
        })
        this.setState({
            type: val,
            new_rank: [],
            new_rank_rk: [],
            status: index,
        }, () => {
            that.newRank();
            that.getRankReward()
            setTimeout(() => {
                that.newRank();
                that.getRankReward()
            }, 3000);
        })

    }

    getUser() {
        var that =this
        api.get(inter.User)
            .then(res => {
                if (res.data.status) {
                    let ads = res.data.data.addressList[0]
                    if(that.state.trues==1){
                        that.setState({
                            address:ads,
                            ads:that.state.ads,
                            realname:that.state.realname,
                            mobile:that.state.mobile,
                            userId:res.data.data.userId
                        })
                    }else{
                        that.setState({
                            address: ads,
                            ads: ads.province + ads.city + ads.district + ads.address,
                            realname: ads.realname,
                            mobile: ads.mobile,
                            userId:res.data.data.userId
                        })
                    }
                       
                }
            })
    }

    onOkey = () => {
        if (this.state.reward_list.integral == 0) {
            this.setState({
                ttyp: 2
            })
        } else {
            this.setState({
                ttyp: 1
            })
        }
        Taro.setStorageSync('ifmiss', 1)
    }
    onOkeys = () => {
        const { ads, realname, mobile, rewardId,trues,adss,realnames,mobiles } = this.state
        if(trues==0){
            api.post('/activity/lottery/receive/' + rewardId, {
                address: ads,
                mobile: mobile,
                realname: realname
            }).then(res => {
                Taro.showToast({
                    title: '操作成功',
                    icon: 'success',
                    duration: 1000
                })
                this.setState({
                    ttyp: 0
                })
            })
        }else{
            api.post('/activity/lottery/receive/' + rewardId, {
                address: adss,
                mobile: mobiles,
                realname: realnames
            }).then(res => {
                Taro.showToast({
                    title: '操作成功',
                    icon: 'success',
                    duration: 1000
                })
                this.setState({
                    ttyp: 0
                })
            })
        }
        
    }
    onGoads = () => {
        Taro.navigateTo({
            url: menu.address + '?nageType=3' + '&rewardId=' + this.state.rewardId
        })
    }
    render() {
        const { user } = this.props
        const { userData } = user
        const { status, atabs, new_rank, new_rank_rk, type, ttyp, reward_list, tip, address, ads, realname, mobile ,trues,adss,realnames,mobiles,userId} = this.state;
        let ranks = new_rank
        if (userData !== undefined) {
            if (new_rank.length > 0 && new_rank.length < 101) {
                ranks=ranks.filter((item,index)=>index!=ranks.length-1)
            }
        }

        let myRank: any = {}

        let rankList: any[] = new_rank_rk

        let rankhead: any[] = ranks.slice(0, 3);

        if (rankhead.length > 1) {
            let fuser = rankhead[0];
            rankhead[0] = rankhead[1];
            rankhead[1] = fuser;
        }

        let rankbody = ranks.slice(3, 100); //第四名以后展示的列表
        if(new_rank.length>0){
            myRank = new_rank[new_rank.length-1]
        }


        let backBar = '#FF8137';
        let bg_img = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/f86e9d5b-8970-47d8-87b7-19684d15f0a0.png';

        if (status === 1) {
            backBar = '#FEBC3A';
            bg_img = "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/bcfe5c61-be45-4b64-b1af-34e193ff4122.png";

        } else if (status === 2) {
            backBar = '#291CF9';
            bg_img = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/779b5f1d-f92a-4ced-a85f-5c509101dcc6.png';

        }

        let type_val = 2;
        if (status === 1) {
            type_val = 3;
        } else if (status === 2) {
            type_val = 4;
        }
        return (
            <View className='rankwrap'>
                <Image src={bg_img} className='headerImg' />
                <View className='rankCons'>
                    <View className='d_flex fd_r jc_fe pr_20'>
                        <Text className='default_label white_label fw_label pl_15' onClick={() => Taro.navigateTo({ url: menu.WinRecord + '?type=' + type_val })}>中奖纪录</Text>
                        <Text className='default_label white_label fw_label pl_15' onClick={() => Taro.navigateTo({ url: menu.WinRules + '?type=' + type_val })}>规则</Text>
                    </View>
                    <View className='ranktop d_flex fd_r ai_ct jc_sb'>
                        <View className='d_flex fd_r ai_end'>
                            {
                                rankhead.map((rank: any, index) => {
                                    let rank_icon = asset.rank_fir
                                    let idx = 0
                                    if (index == 0) {
                                        rank_icon = asset.rank_sec
                                        idx = 2
                                    } else if (index == 1) {
                                        rank_icon = asset.rank_fir
                                        idx = 1
                                    } else if (index == 2) {
                                        rank_icon = asset.rank_thr
                                        idx = 3
                                    }

                                    return (
                                        <View className='rankBox d_flex fd_c jc_ct ai_ct ' key={'item' + index}>
                                            {
                                                rank.userId.length !== 0 ?
                                                    <View className='rank_tips d_flex fd_c ai_ct '>
                                                        <View className='rank_head_box'>
                                                            <Image src={rank.avatar} className='rank_cover' />
                                                            {
                                                                rank.isAuth == 1 ?
                                                                    <View className='auth_icon_cover'>
                                                                        <Image src={asset.auth_iocn} className='auth_icon' />
                                                                    </View>
                                                                    : null}
                                                        </View>
                                                        <View className='rank_tip ' >
                                                            <Image src={rank_icon} className='rank_tip_icon' />
                                                            <View className='rank_tip_box'>
                                                                <Text className='sm_label white_label d_flex jc_ct ai_ct'>{idx}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    : null}

                                            <Text className='c33_label default_label mt_15'>{subNumTxt(rank.nickname, 5)}</Text>
                                            {
                                                rank.userId.length !== 0 ?
                                                    <View>
                                                        {
                                                            status == 1 ?
                                                                <Text className='sm_label' style={{ color: '#8B3B06' }}>{rank.integral}学分</Text>
                                                                : null}
                                                        {
                                                            status === 0 ?
                                                                <Text className='sm_label' style={{ color: '#8B3B06' }}> {(rank.duration / 3600).toFixed(1)}小时</Text>
                                                                : null}
                                                        {
                                                            status === 2 ?
                                                                <Text className='sm_label' style={{ color: '#8B3B06' }}>{rank.duration}次</Text>
                                                                : null}
                                                    </View>
                                                    : null}
                                        </View>

                                    )
                                })
                            }
                        </View>
                    </View>
                    <View className='rankList'>
                        <View className='atabs'>
                            {
                                atabs.map((tab, index) => {
                                    const on = status == index
                                    return (
                                        <View className='onItems pl_20 pr_20 d_flex fd_c ai_ct jc_ct ' key={'tab' + index} onClick={this._onSelect.bind(this, index)}>
                                            <Text className='default_label' style={on ? { color: '#333333', fontWeight: 'bold' } : { color: '#666666' }}>{tab}</Text>
                                            <View className={on ? 'border_bt_ed' : 'border_bt_ned'}></View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        {
                            Object.keys(myRank).length === 0 ?
                                null
                                :
                                <View className='items d_flex fd_r jc_sb ai_ct pt_10 pb_10 pl_10 pr_30 mt_10 ' style={{ backgroundColor: backBar }}>
                                    <View className='d_flex fd_r ai_ct col_1'>
                                        <View className='items_rank d_flex fd_c ai_ct'>
                                            <Text className='lg20_label ' style={{ color: '#FFFA70' }}>{myRank.index > 500 ? "500+" : myRank.index}</Text>
                                            <Text className='smm_label' style={{ color: '#FFFA70' }}>我的排名</Text>
                                        </View>
                                        <View className='item_rank_cover'>
                                            <Image src={myRank.avatar} className='rank_cover' />
                                            {
                                                myRank.isAuth == 1 ?
                                                    <View className='auth_icon_cover'>
                                                        <Image src={asset.auth_iocn} className='auth_icon' />
                                                    </View>
                                                    : null}
                                        </View>
                                        <View className='col_1 ml_5 mr_15'>
                                            <Text className='default_label  white_label wordstyle'>{myRank.nickname}</Text>
                                        </View>
                                    </View>
                                    {
                                        status == 1 ?
                                            <Text className='default_label white_label'>{myRank.integral}学分</Text>
                                            : null}
                                    {
                                        status === 0 ?
                                            <Text className='default_label white_label'>{(myRank.duration / 3600).toFixed(1)}小时</Text>
                                            : null}
                                    {
                                        status === 2 ?
                                            <Text className='default_label white_label'>{myRank.duration}次</Text>
                                            : null}
                                </View>
                        }

                        <View className='ranks'>
                            {
                                rankbody.map((rank: any, index) => {
                                    return (
                                        <View key={'rank' + index} className='items_bg'>
                                            <View className='rank_items d_flex fd_r jc_sb ai_ct pt_10 pb_10'>
                                                <View className='d_flex fd_r ai_ct col_1'>
                                                    <View className='items_rank'>
                                                        <Text className='default_label  fw_label' style={{ color: '#FEA800' }}>{index + 4}</Text>
                                                    </View>
                                                    <View className='item_rank_cover'>
                                                        <Image src={rank.avatar} className='rank_cover' />
                                                        {
                                                            rank.isAuth == 1 ?
                                                                <View className='auth_icon_cover'>
                                                                    <Image src={asset.auth_iocn} className='auth_icon' />
                                                                </View>
                                                                : null}
                                                    </View>
                                                    <View className='col_1 ml_5 mr_15'>
                                                        <Text className='default_label c33_label wordstyle'>{rank.nickname}</Text>
                                                    </View>
                                                </View>
                                                {
                                                    status == 1 ?
                                                        <Text className='sm_label c33_label'>{rank.integral}学分</Text>
                                                        : null}
                                                {
                                                    status == 0 ?
                                                        <Text className='sm_label tip_label'>{(rank.duration / 3600).toFixed(1)}小时</Text>
                                                        : null}
                                                {
                                                    status === 2 ?
                                                        <Text className='sm_label c33_label'>{rank.duration}次</Text>
                                                        : null}
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
                {
                    ttyp == 1 && reward_list.status == 0 && tip != 1 ?
                        <View className='intrue'></View>
                        : null
                }
                {
                    ttyp == 1 && reward_list.status == 0 && tip != 1 ?
                        <View className='tips'>
                            <View className='t_word'>恭喜您</View>
                            {
                                reward_list.integral > 0 ?
                                    <View className='s_word'>获得{reward_list.integral}学分</View>
                                    :
                                    <View className='s_word'>获得{reward_list.itemName}1个</View>
                            }

                            <View className='pics'>
                                <Image src={reward_list.itemImg} className='picss' />
                            </View>
                            <View className='btns' onClick={this.onOkey}>
                                <View className='btnss'>确定</View>
                            </View>
                        </View>
                        : null
                }
                {
                    ttyp == 2 ?
                        <View className='intrue'></View>
                        : null
                }
                {
                    ttyp == 2?
                        <View className='tipss'>
                            <View className='t_word'>恭喜亲，中奖啦</View>
                            <View className='s_word'>获得{reward_list.itemName}1个</View>
                            <View className='pics'>
                                <Image src={reward_list.itemImg} className='picss' />
                            </View>
                            <View className='onetip'>
                                <View className='onetips'>
                                    <Input className='inpt' value={realname} placeholder='联系人' onInput={(e) => { this.setState({ realname: e.detail.value }) }} />
                                </View>
                            </View>
                            <View className='onetip'>
                                <View className='onetips'>
                                    <Input className='inpt' value={mobile} placeholder='手机号' onInput={(e) => { this.setState({ mobile: e.detail.value }) }} />
                                </View>
                            </View>
                            <View className='onetip'>
                                <View className='onetips'>
                                    <Input className='inpt' value={ads} placeholder='收货地址' onInput={(e) => { this.setState({ ads: e.detail.value }) }} />
                                </View>
                            </View>
                            <View className='btns'>
                                <View className='okeys' onClick={this.onOkeys}>确定</View>
                                <View className='goadress' onClick={this.onGoads}>修改地址</View>
                            </View>
                        </View>
                        : null
                }
                {/* {
                    ttyp == 2&&adss ?
                        <View className='tipss'>
                            <View className='t_word'>恭喜亲，中奖啦</View>
                            <View className='s_word'>获得{reward_list.itemName}1个</View>
                            <View className='pics'>
                                <Image src={reward_list.itemImg} className='picss' />
                            </View>
                            <View className='onetip'>
                                <View className='onetips'>
                                    <Input className='inpt' value={realnames} placeholder='联系人' onInput={(e) => { this.setState({ realnames: e.detail.value }) }} />
                                </View>
                            </View>
                            <View className='onetip'>
                                <View className='onetips'>
                                    <Input className='inpt' value={mobiles} placeholder='手机号' onInput={(e) => { this.setState({ mobiles: e.detail.value }) }} />
                                </View>
                            </View>
                            <View className='onetip'>
                                <View className='onetips'>
                                    <Input className='inpt' value={adss} placeholder='收货地址' onInput={(e) => { this.setState({ adss: e.detail.value }) }} />
                                </View>
                            </View>
                            <View className='btns'>
                                <View className='okeys' onClick={this.onOkeys}>确定</View>
                                <View className='goadress' onClick={this.onGoads}>修改地址</View>
                            </View>
                        </View>
                        : null
                } */}

            </View>
        )
    }
}


export default Rank as ComponentClass