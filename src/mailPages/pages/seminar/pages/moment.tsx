import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Image,Video,ScrollView} from '@tarojs/components'
import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import Tabs from '../../../../components/Tabs'
import '../home.less'
import './moment.less'



type PageState = {
    moment: Array<any>
    page:number,
    pages:number,
    refush:boolean
}


class moment extends Component<{}, PageState> {
    config = {
        navigationStyle: 'custom',
        enablePullDownRefresh: true,
    }
    page: number
    pages: number


    constructor(props) {
        super(props)

        this.page = 0;
        this.pages = 0;

        this.state = {
            moment: [],
            page:0,
            pages:0,
            refush:false
        }

    }

    componentDidMount() {
       this.getMoment()
    }
    getMoment=()=>{
         api.get(inter.moments,{
            page:this.page
        }).then(res=>{
            if (res.data.status) {

                let arr = res.data.data;
                if (this.page === 0) {
                    this.page = arr.page
                    this.pages = arr.pages
                    var tList = arr.items
                } else {
                    var tList: any = this.state.moment.concat(arr.items)
                }

                this.setState({
                    moment: tList,
                    page: arr.page,
                    pages: arr.pages,
                    refush:false,
                })

            }
        })
    }
    top=()=>{
        var that = this;

        Taro.showNavigationBarLoading();
        that.setState({refush:true})
        that.page = 0;

        that.setState({
            moment: [],
        }, () => {
            that.getMoment()
        })

        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }

    foot=()=>{
        var self = this;
        const { page, pages} = this.state
        if (page < pages-1) {
            this.page=this.page+1
            self.getMoment()
        }
    }

    onClick=(val)=>{
		Taro.navigateTo({
			url: 'momentPage/momentPage'+'?articleId='+val.articleId
		})
	}


    render() {

        const { moment,refush} = this.state

        return (
            <ScrollView
				scrollY
				className={'scrollStyle'}
				refresherEnabled={true}
				refresherTriggered={refush}

				onRefresherRefresh={(e) => {
					this.top()
				}}

				onScrollToLower={(e) => {
					this.foot()
				}}
			>
            <View className='box row jc_ct mb_50'>
            <View className='row col mt_5'>
                {
                    moment.map((item, index) => {
                        return (
                            <View className='moment_box row col bg_white mt_15' onClick={this.onClick.bind(this,item)}>
                                <View className='moment_pic'>
                                    <Image src={item.articleImg} className='picture' />
                                    {
                                        item.isTop==1?
                                        <View className='tops'>置顶</View>
                                        :null
                                    }
                                </View>
                                <View className='label_14 mt_12 text_ct'>{item.title}</View>
                            </View>
                        )
                    })
                }
            </View>
        </View>
        </ScrollView>
        )

    }
}

export default moment as ComponentClass