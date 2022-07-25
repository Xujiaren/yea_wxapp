import { ComponentClass } from 'react'
import Taro, { Component} from '@tarojs/taro'
import { View, Text, Image,Video,Button} from '@tarojs/components'
import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import Tabs from '../../../../components/Tabs'
import '../home.less'
import './photo.less'



type PageState = {
    moment:any,
    downloadList:Array<any>,
    plist:Array<any>
}


class photo extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '相册',
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
            plist: []
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
                plist:res.data.data.downloadList.filter(item => item.ftype == 0),
			})
		})
    }
    componentDidShow() {
        
    }
   onCover=(val)=>{
        console.log(val)
        Taro.navigateTo({ url: 'photoDec'+'?articleId='+this.articleId+'&downId='+val.downId})
    }
    render() {

		const { downloadList, plist } = this.state

        return (
             <View className='box row jc_ct pt_10'>
                <View className='row col'>
                    {
                        plist.map((item, index) => {
                                return (
                                    <View className='photo_box jc_ct row col mt_10' onClick={this.onCover.bind(this, item)}>
                                        <View className='photo_box row wrap ml_5'>
                                            {
                                                item.galleryList.map((e,idx) => {
                                                    return (
                                                        <View className='photo_pic mt_10 mr_10'>
                                                            <Image src={e.link} className='picture' />
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                        <View className='vant_box row jc_sb ai_ct mt_20 ml_5 mr_5'>
                                            <View className='row ai_ct'>
                                                {
                                                    item.like == false?
                                                    <View className='row' onClick={this.onVant.bind(this,item)}>
                                                        {/* <IconFont name={'dianzan'} color={'#666666'} size={26}/> */}
                                                        <Image src={asset.praise} className='size_26'/>
                                                        <View className='label_gray label_12 ml_10 mr_30'>{item.praise}</View>
                                                    </View>
                                                    :
                                                    <View className='row' onClick={this.onVant.bind(this,item)}>
                                                        {/* <IconFont name={'dianzan'} color={'#F4623F'} size={26}/> */}
                                                        <Image src={asset.onpraise} className='size_26'/>
                                                        <View className='label_orange label_12 ml_10 mr_30'>{item.praise}</View>
                                                    </View>
                                                } 
                                                <View className='bg_white btn'>      
                                                    {/* <IconFont name={'fenxiang'} color={'#666666'} size={26}/> */}
                                                    <Image src={asset.shares} className='size_26'/>
                                                </View>
                                                <View className='label_gray label_12 ml_5'>{item.hit}</View>
                                            </View>
                                            <View className='label_gray label_12'>{item.time}</View>
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

export default photo as ComponentClass