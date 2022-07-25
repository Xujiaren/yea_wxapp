import { ComponentClass } from 'react'
import Taro, { Component} from '@tarojs/taro'
import { View, Text, Image,Video,Button} from '@tarojs/components'
import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import Tabs from '../../../../components/Tabs'
import { subNumTxt} from '../../../../utils/common'
import '../home.less'
import './myCourse.less'



type PageState = {
    compulsory:Array<any>,
    page: number,
    pages: number,
}


class mycourse extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '我的试卷',
	    enableShareAppMessage: true
    }
    page: number
    pages: number
    constructor(props) {
        super(props)

        this.page = 0;
        this.pages = 0;
        this.state = {
            page: 0,
            pages: 0,
             compulsory: [{ learn: 1334, schedule: 39 }, { learn: 14674, schedule: 89 }, { learn: 1334, schedule: 100 },
            { learn: 1334, schedule: 39 }, { learn: 14674, schedule: 89 }, { learn: 1334, schedule: 100 }],
        }

    }

    componentDidMount() {
       this.getList()
    }
    getList=()=>{
        const{page,compulsory}=this.state
        api.get('/course/courses',{
            page:this.page
        }).then(res=>{
           if(res.data.status){
            let arr = res.data.data;
            if (page === 0) {
                this.page = arr.page
                this.pages = arr.pages
                var tList = arr.items
            } else {
                var tList: any = compulsory.concat(arr.items)
            }
            this.setState({
                compulsory:tList,
                page:arr.page,
                pages:arr.pages
            })
           }
        })
    }
      //  下啦刷新
      onPullDownRefresh(){
        var that = this;

        Taro.showNavigationBarLoading();

        that.setState({
            compulsory:[]
        },()=>{
            that.getList();
        })

        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading()
        }, 1000);
    }
    onReachBottom() {

        const { page, pages} = this.state

        if (page < pages) {
            this.page = this.page + 1;
            this.setState({
                page:this.page + 1
            },()=>{
                this.getList()  
            })
            
        }
    }
    render() {

		const { compulsory} = this.state
        return (
             <View className='box row col'>
                <View className='live_box row jc_ct mt_5'>
                    <View className='row col'>
                        {
                            compulsory.map((item, index) => {
                                return (
                                    <View className='re_box row mt_15' onClick={()=>{Taro.navigateTo({url:'../read/read'+'?status='+'1'})}}>
                                        <View className='live_pic'>
                                            <Image src={item.courseImg} className='picture' />
                                        </View>
                                        <View className='row col ml_8'>
                                            <View className='label_three label_14 font_bold with_172'>{subNumTxt(item.courseName, 10)}</View>
                                            <View className='label_light label_13'>{subNumTxt(item.summary, 12)}</View>
                                            <View className='row jc_sb mt_10 with_158'>
                                                <View className='label_gray label_12'>{item.hit}人已学</View>
                                                {
                                                    item.prePaperList[0].pass?
                                                        <View className='label_light label_12'>100%</View>
                                                        :
                                                        <View className='label_light label_12'>0%</View>
                                                }
                                            </View>
                                            <View className='with_158 mt_12'>
                                                <Progress percent={item.prePaperList[0].pass?100:0} color='#F4623F' strokeWidth={2} />
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        )

    }
}

export default mycourse as ComponentClass