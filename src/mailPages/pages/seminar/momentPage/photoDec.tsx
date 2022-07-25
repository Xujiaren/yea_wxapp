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
    plist:Array<any>,
    downId:number
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
            plist: [],
            downId:0,
        }

    }

    componentDidMount() {
        const{articleId,downId}=this.$router.params;
        this.articleId=articleId
        this.setState({downId:parseInt(downId)})
        api.get(inter.moment+parseInt(this.articleId))
		.then(res=>{
            console.log(res)
			this.setState({
				moment:res.data.data,
                downloadList:res.data.data.downloadList,
                plist:res.data.data.downloadList.filter(item => item.downId == parseInt(downId)),
			})
            Taro.setNavigationBarTitle({
                title: res.data.data.downloadList.filter(item => item.downId == parseInt(downId))[0].name
            })
		})
        api.post(inter.userHistory,{
            content_id:parseInt(downId),
            etype:108,
            ctype:39,
            cctype:1,
        }).then(res=>{})
    }
   
    componentDidShow() {
        
    }
   onCover=(val,ele)=>{
        Taro.navigateTo({ url: 'cover'+'?articleId='+this.articleId+'&downId='+val.downId+'&current='+ele })
    }
    render() {

		const { downloadList, plist ,downId} = this.state
        console.log(plist)
        return (
             <View className='box row jc_ct pt_10'>
                <View className='row col'>
                    {
                        plist.map((item, index) => {
                                return (
                                    <View className='photo_box jc_ct row col mt_10'>
                                        <View className='photo_box row wrap ml_5'>
                                            {
                                                item.galleryList.map((e,idx) => {
                                                    return (
                                                        <View className='photo_pic mt_10 mr_10' onClick={this.onCover.bind(this, item,idx)}>
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
                    <View className='label_gray label_12 mt_15'>
                        {plist[0].content}
                    </View>
                </View>
            </View>
        )

    }
}

export default photo as ComponentClass