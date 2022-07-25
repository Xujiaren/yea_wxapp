import { ComponentClass } from 'react'
import Taro, { Component} from '@tarojs/taro'
import { View, Text, Image,Video,Button} from '@tarojs/components'
import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import Tabs from '../../../../components/Tabs'
import '../home.less'
import './cover.less'



type PageState = {
    moment:any,
    downloadList:Array<any>,
    photo:any,
    plist:Array<any>,
    current:any
}


class cover extends Component<{}, PageState> {
    config = {
        navigationStyle: 'custom',
    }
    page: number
    pages: number
    articleId:any
    downId:any
    constructor(props) {
        super(props)

        this.page = 0;
        this.pages = 0;
        this.articleId=0;
        this.downId=0
        this.state = {
            moment: {},
            downloadList: [],
            photo: {},
            plist: [],
            current: 0
        }

    }

    componentDidMount() {
        const{articleId,downId,current}=this.$router.params;
        this.articleId=articleId
        this.downId=downId
        this.setState({current:parseInt(current)})
        api.get(inter.moment+parseInt(this.articleId))
		.then(res=>{
            console.log(res)
			this.setState({
				moment:res.data.data,
                downloadList:res.data.data.downloadList,
                photo: res.data.data.downloadList.filter(item => item.downId == parseInt(this.downId))[0],
				plist: res.data.data.downloadList.filter(item => item.downId == parseInt(this.downId))[0].galleryList
			},()=>{
                this.ptime()
            })
		})
        api.post(inter.userHistory,{
            content_id:parseInt(downId),
            etype:108,
            ctype:39,
            cctype:1,
        }).then(res=>{})
    }
    ptime=()=>{
        api.post('/meet/moments/gallery/see/'+this.state.plist[this.state.current].galleryId,{
            duration: 1,
        }).then(res=>{

        })
    }
    componentDidShow() {
        
    }
    onLeft = () => {
		const { current, plist } = this.state
		if (current != 0) {
			this.setState({
				current: current - 1
			},()=>{this.ptime()})
		} else {
			this.setState({
				current: plist.length - 1
			},()=>{this.ptime()})
		}
	}
	onRight = () => {
		const { current, plist } = this.state
		if (current != plist.length - 1) {
			this.setState({
				current: current + 1
			},()=>{this.ptime()})
		} else {
			this.setState({
				current: 0
			},()=>{this.ptime()})
		}
	}
    onVant = () => {
        const { actions } = this.props
        const { photo } = this.state
        if (photo.like == false) {
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
                download_id: photo.downId,
            }).then(res=>{
                api.get(inter.moment+parseInt(this.articleId))
                .then(res=>{
                    console.log(res)
                    this.setState({
                        moment:res.data.data,
                        downloadList:res.data.data.downloadList,
                        photo: res.data.data.downloadList.filter(item => item.downId == parseInt(this.downId))[0],
                        plist: res.data.data.downloadList.filter(item => item.downId == parseInt(this.downId))[0].galleryList
                    })
                })
                Taro.showToast({
                        title: '点赞成功',
                        icon: 'success',
                        duration: 1500
                    })
            })
        } else {
           Taro.showToast({
                        title: '已点赞',
                        icon: 'none',
                        duration: 1500
                    })
        }
    }
    render() {

		const { photo, plist, current } = this.state

        return (
              <View className='box row ai_ct'>
				<View className='pic bg_white row ai_ct'>
					<Swiper className='picture'
						indicatorColor='#999'
						indicatorActiveColor='#333'
						circular
						current={current}
						onChange={(e) => {
							this.setState({
								current: e.detail.current
							})
						}}>
						{
							plist.map((item, index) => {
								return (
									<SwiperItem>
										<Image src={item.link} className='picture' />
									</SwiperItem>
								)
							})
						}
					</Swiper>
					<View className='left' onClick={this.onLeft}>
						{/* <IconFont name={'left_arrow'} size={80} color={'#EAEAEA'} /> */}
                        <Image src={asset.left_a} className='size_80'/>
					</View>
					<View className='right' onClick={this.onRight}>
						{/* <IconFont name={'right_arrow'} size={80} color={'#EAEAEA'} /> */}
                        <Image src={asset.right_a} className='size_80'/>
					</View>
				</View>
				{
					photo.like == false ?
						<View className='vant row ai_ct' onClick={this.onVant}>
							{/* <IconFont name={'dianzan'} color={'#FFFFFF'} size={26} /> */}
                            <Image src={asset.unvant} className='size_26'/>
							<View className='label_white label_12 ml_5'>{photo.praise}</View>
						</View>
						:
						<View className='vant row ai_ct' onClick={this.onVant}>
							{/* <IconFont name={'dianzan'} color={'#F4623F'} size={26} /> */}
                            <Image src={asset.onpraise} className='size_26'/>
							<View className='label_orange label_12 ml_5'>{photo.praise}</View>
						</View>
				}

			</View>
        )

    }
}

export default cover as ComponentClass