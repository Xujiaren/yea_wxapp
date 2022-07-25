import { ComponentClass } from 'react'
import Taro, { Component} from '@tarojs/taro'
import { View, Text, Image,Video,Button} from '@tarojs/components'
import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import Tabs from '../../../../components/Tabs'
import '../home.less'
import './videoDetils.less'



type PageState = {
    moment:any,
    downloadList:Array<any>,
    video:any,
    videos:Array<any>,
    link:string,
    ts:number,
    now_time:string,
}


class photo extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '视频',
	    enableShareAppMessage: true,
        enablePullDownRefresh: false
    }
    page: number
    pages: number
    articleId:any
    downId:any
    ts: number;
    constructor(props) {
        super(props)

        this.page = 0;
        this.pages = 0;
        this.articleId=0;
        this.downId=0;
        this.ts = 0;
        this.state = {
            moment: {},
            downloadList: [],
            video: {},
            videos:[],
            link: '',
            ts:0,
            now_time: '',
        }

    }

    componentDidMount() {
        const{articleId,downId}=this.$router.params;
        this.articleId=articleId
        this.downId=downId
        api.get(inter.moment+parseInt(this.articleId))
		.then(res=>{
            console.log(res)
			this.setState({
				moment:res.data.data,
                downloadList:res.data.data.downloadList,
                video:res.data.data.downloadList.filter(item => item.downId == parseInt(this.downId))[0],
                videos:res.data.data.downloadList.filter(item => item.downId != parseInt(this.downId)&&item.ftype==1),
                link: res.data.data.downloadList.filter(item => item.downId == parseInt(this.downId))[0].galleryList[0].link
			})
            Taro.setNavigationBarTitle({
                title: res.data.data.downloadList.filter(item => item.downId == parseInt(this.downId))[0].name,
            })
		})
        api.post(inter.userHistory,{
            content_id:parseInt(downId),
            etype:108,
            ctype:39,
            cctype:1,
        }).then(res=>{})
        api.post(inter.postdownload + downId).then(res => {
            
        })
    }
    ptime=(e)=>{
        this.ts++;
        if (this.ts % 4 == 0) {
            api.post('/meet/moments/gallery/see/'+this.state.video.galleryList[0].galleryId,{
                duration: parseInt(e.detail.currentTime),
            }).then(res=>{

            })
        }
    }
    componentDidShow() {
        
    }
    onVant = () => {
        const { actions } = this.props
        const { video } = this.state
        if (video.like == false) {
            // actions.user.downLike({
            //     download_id: video.downId,
            //     resolved: (data) => {
            //         actions.meet.getMoment({
            //             article_id: parseInt(this.articleId)
            //         })
            //         Taro.showToast({
            //             title: '点赞成功',
            //             icon: 'success',
            //             duration: 1500
            //         })
            //     },
            //     rejected: (msg) => {
            //         console.log(msg)
            //         Taro.showToast({
            //             title: '已点赞',
            //             icon: 'none',
            //             duration: 1500
            //         })
            //     }
            // })
            api.post(inter.postdown,{
                download_id: video.downId,
            }).then(res=>{
                console.log(res)
                if(res.data.status){
                    api.get(inter.moment+parseInt(this.articleId))
                    .then(res=>{
                        console.log(res)
                        this.setState({
                            moment:res.data.data,
                            downloadList:res.data.data.downloadList,
                            video:res.data.data.downloadList.filter(item => item.downId == parseInt(this.downId))[0],
                            videos:res.data.data.downloadList.filter(item => item.downId != parseInt(this.downId)&&item.ftype==1),
                            link: res.data.data.downloadList.filter(item => item.downId == parseInt(this.downId))[0].galleryList[0].link
                        })
                    })
                    Taro.showToast({
                            title: '点赞成功',
                            icon: 'success',
                            duration: 1500
                        })
                }
                
            })
        } else {
           Taro.showToast({
                        title: '已点赞',
                        icon: 'none',
                        duration: 1500
                    })
        }
    }
    onShareAppMessage(ops){
        const{video}=this.state
        console.log(video.imgUrl)
        if (ops.from === 'button') { 
            
        }
        return {
            title: video.name,
            imageUrl: video.imgUrl,
            success: function (res) {
                Taro.navigateBack({
                    delta:1
                })
                this.userDown()
            },
            fail: function (res) {
                console.log(res)
            }
        }
    }
   onchange=(val)=>{
        Taro.navigateTo({
            url:'videoDetils'+'?articleId='+this.articleId+'&downId='+val.downId
        })
    }
    render() {

		const { video, link,videos } = this.state

        return (
              <View className='box row jc_ct'>
                <View className='row col mr_20 ml_20'>
                    <View className='moment_pci bg_yellow mt_15'>
                        <Video
                            id='video'
                            src={link}
                            poster={video.imgUrl}
                            initialTime='0'
                            controls={true}
                            autoplay={false}
                            loop={false}
                            muted={false}
                            className='picture'
                            objectFit='cover'
                            onTimeUpdate={this.ptime}
                        />
                    </View>
                    <View className='title_box row col mt_15'>
                        <Text className='font_blod label_16'>{video.name}</Text>
                        <Text className='label_gray label_12'>{video.content}</Text>
                    </View>
                    <View className='click_box row jc_sb ai_ct mt_26 pb_15'>
                        <View className='row ai_ct'>
                            {/* <IconFont name={'bofangtubiao'} color={'#666666'} size={30} /> */}
                            <Image src={asset.bofang_t} className='size_30'/>
                            <View className='ml_5 label_gray label_12'>{video.hit}</View>
                        </View>
                        {
                            video.like == false ?
                                <View className='row ai_ct' onClick={this.onVant}>
                                    {/* <IconFont name={'dianzan'} color={'#666666'} size={30} /> */}
                                    <Image src={asset.praise} className='size_30'/>
                                    <View className='ml_5 label_gray label_12'>{video.praise}</View>
                                </View>
                                :
                                <View className='row ai_ct' onClick={this.onVant}>
                                    {/* <IconFont name={'dianzan'} color={'#F4623F'} size={30} /> */}
                                    <Image src={asset.onpraise} className='size_30'/>
                                    <View className='ml_5 label_orange label_12'>{video.praise}</View>
                                </View>
                        }
                        <View className='row ai_ct'>
                            <View className='bg_white btn'>
                                {/* <IconFont name={'fenxiang'} color={'#666666'} size={30} /> */}
                                <Button className='bg_white bton' open-type='share' onShareAppMessage={this.onShareAppMessage}><Image src={asset.share_icon} className='size_37 icn'/></Button>
                            </View>
                            <View className='label_gray label_12'>{video.hit}</View>
                        </View>
                    </View>
                    <View className='label_16 font_blod mt_20'>推荐</View>
                    <View className='recommend row col mb_50'>
                        {
                            videos.map((item, index) => {
                                if(index<3){
                                    return (
                                        <View className='video_box row ai_ct mt_15' onClick={this.onchange.bind(this,item)}>
                                            <View className='cover'>
                                                <Image src={item.imgUrl} className='picture'/> 
                                            </View>
                                            <View className='row col ml_8'>
                                                <View className='label_three font_bold label_14 with_172'>{item.name}</View>
                                                <View className='row jc_sb ai_ct mt_42 with_130'>
                                                    <View className='row ai_ct'>
                                                        {/* <IconFont name={'bofangtubiao'} color={'#999999'} size={24} /> */}
                                                        <Image src={asset.bofang_t} className='size_24'/>
                                                        <View className='label_light label_12 ml_5'>{item.hit}</View>
                                                    </View>
                                                    <View className='row ai_ct'>
                                                        {/* <IconFont name={'dianzan'} color={'#999999'} size={24} /> */}
                                                        <Image src={asset.praise} className='size_24'/>
                                                        <View className='label_light label_12 ml_5 mt_2'>{item.praise}</View>
                                                    </View>
                                                </View>
                                            </View>
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

export default photo as ComponentClass