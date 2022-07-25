import { ComponentClass } from 'react'
import Taro, { Component} from '@tarojs/taro'
import { View, Text, Image,Video} from '@tarojs/components'
import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import Tabs from '../../../../components/Tabs'
import '../home.less'
import './momentPage.less'



type PageState = {
    moment:any,
    downloadList:Array<any>,
    plist:Array<any>,
    vlist:Array<any>
}


class momentpage extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '精彩瞬间',
	    enableShareAppMessage: true
    }
    page: number
    pages: number
    articleId:any
    constructor(props) {
        super(props)

        this.page = 0;
        this.pages = 0;
        this.articleId=0;
        this.state = {
             moment: {},
            downloadList: [],
            plist: [],
            vlist: []
        }

    }

    componentDidMount() {
        const{articleId}=this.$router.params;
        this.articleId=articleId
        api.get(inter.moment+parseInt(this.articleId))
		.then(res=>{
			this.setState({
				moment:res.data.data,
                downloadList:res.data.data.downloadList,
                plist:res.data.data.downloadList.filter(item => item.ftype == 0),
                vlist:res.data.data.downloadList.filter(item => item.ftype == 1),
			})
            Taro.setNavigationBarTitle({
                title: res.data.data.title,
            })
		})
    }
    componentDidShow() {
        
    }
    onMuch(val) {
        if (val == 'video') {
            Taro.navigateTo({ url: 'momentVideo' + '?articleId=' + this.articleId })
        } else {
            Taro.navigateTo({ url: 'photo' + '?articleId=' + this.articleId })
        }
    }
    onVideo(val) {
        Taro.navigateTo({ url: 'videoDetils'+'?articleId='+this.articleId+'&downId='+val.downId })
    }
    onCover(val) {
        Taro.navigateTo({ url: 'photoDec'+'?articleId='+this.articleId+'&downId='+val.downId })
    }
	
    render() {

		const { moment, downloadList, plist, vlist } = this.state

        return (
            <View className='box row jc_ct'>
                <View className='row col mr_20 ml_10'>
                    <View className='moment_pci mt_15 ml_10'>
                        <Image src={moment.articleImg} className='picture' />
                    </View>
                    <View className='title_box row col mt_15 ml_10'>
                        <Text className='font_blod label_16'>{moment.title}</Text>
                        <Text className='label_gray label_12 mt_10'>{moment.content}</Text>
                    </View>
                    {
                        vlist.length > 0 ?
                            <View className='row jc_sb ai_ct mt_15 ml_10'>
                                <Text className='label_16 font_blod'>视频</Text>
                                <View className='row ai_ct'>
                                    <Text className='label_light label_14' onClick={this.onMuch.bind(this, 'video')}>更多</Text>
                                    {/* <IconFont name={'right'} size={24} color={'#999999'} /> */}
                                    <Image src={asset.rights} className='size_24'/>
                                </View>
                            </View>
                            : null
                    }
                    <View className='video_high mt_15 row wrap '>
                        {
                            vlist.map((item, index) => {
                                if(index<4){
                                    return (
                                        <View className='video_box row col ml_15 mt_10' onClick={this.onVideo.bind(this, item)}>
                                            <View className='video_pic'>
                                                <Image src={item.imgUrl} className='picture' />
                                            </View>
                                            <View className='label_gray label_12 mt_5'>{item.name}</View>
                                        </View>
                                    )
                                } else{
                                    null
                                }    
                            })
                        }
                    </View>
                    {
                        plist.length > 0 ?
                            <View className='row jc_sb ai_ct mt_15 ml_10'>
                                <Text className='label_16 font_blod'>相册</Text>
                                <View className='row ai_ct'>
                                    <Text className='label_light label_14' onClick={this.onMuch.bind(this, 'picture')}>更多</Text>
                                    {/* <IconFont name={'right'} size={24} color={'#999999'} /> */}
                                    <Image src={asset.rights} className='size_24'/>
                                </View>
                            </View>
                            : null
                    }
                    <View className='row mt_15 row wrap mb_50'>
                        {
                            plist.map((item, index) => {
                                if(index<6){
                                    return (
                                        <View className={'photo ml_15 mt_15'} onClick={this.onCover.bind(this, item)}>
                                            <Image src={item.imgUrl} className='picture' />
                                        </View>
                                    )
                                }else{
                                    null
                                }
                            })
                        }
                    </View>
                </View>
            </View>
        )

    }
}

export default momentpage as ComponentClass