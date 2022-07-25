import { ComponentClass } from 'react'
import Taro, { Component} from '@tarojs/taro'
import { View, Text, Image,Video} from '@tarojs/components'
import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import Tabs from '../../../../components/Tabs'
import '../home.less'
import './momentVideo.less'



type PageState = {
    moment:any,
    downloadList:Array<any>,
    vlist:Array<any>
}


class momentvideo extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '视频列表',
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
            vlist: []
        }

    }

    componentDidMount() {
        const{articleId}=this.$router.params;
        this.articleId=articleId
        api.get(inter.moment+parseInt(this.articleId))
		.then(res=>{
            console.log(res)
			this.setState({
				moment:res.data.data,
                downloadList:res.data.data.downloadList,
                vlist:res.data.data.downloadList.filter(item => item.ftype == 1),
			})
		})
    }
    componentDidShow() {
        
    }
   onVideo(val) {
        Taro.navigateTo({ url: 'videoDetils'+'?articleId='+this.articleId+'&downId='+val.downId })
    }
    render() {

		const { moment, downloadList, vlist } = this.state

        return (
             <View className='box'>
                <View className='row col pl_15 pr_20'>
                    {
                        vlist.map((item, index) => {
                            return (
                                <View className='video_box row ai_ct mt_15' onClick={this.onVideo.bind(this, item)}>
                                    <View className='cover'>
                                        <Image src={item.imgUrl} className='picture' />
                                    </View>
                                    <View className='row col ml_8'>
                                        <View className='label_three font_bold label_14 with_172'>{item.name}</View>
                                        <View className='row jc_sb ai_ct mt_42 with_130'>
                                            <View className='row ai_ct'>
                                                {/* <IconFont name={'bofangtubiao'} color={'#999999'} size={24} /> */}
                                                <Image src={asset.bofang_t} className='size_24'/>
                                                <View className='label_light label_12 ml_2'>{item.hit}</View>
                                            </View>
                                            <View className='row ai_ct'>
                                                {/* <IconFont name={'dianzan'} color={'#999999'} size={24} /> */}
                                                <Image src={asset.praise} className='size_24'/>
                                                <View className='label_light label_12 ml_2'>{item.praise}</View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )

    }
}

export default momentvideo as ComponentClass