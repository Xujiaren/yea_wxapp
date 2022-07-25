import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Image, Video,Textarea } from '@tarojs/components'
import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import Tabs from '../../../../components/Tabs'
import '../home.less'
import './releaseMood.less'



type PageState = {
	picture: Array<any>,
	content: string,
	videos: Array<any>,
	add: Array<any>,
	num: number,
	pictres: Array<any>,
	file: any,
}


class releaseMood extends Component<{}, PageState> {
	config = {
		navigationStyle: 'custom',
	}
	page: number
	pages: number


	constructor(props) {
		super(props)

		this.page = 0;
		this.pages = 0;

		this.state = {
			picture: [],
			content: '',
			videos: [],
			add: [],
			num: 0,
			pictres: [],
			file: {},
		}

	}

	componentDidMount() {

	}

	componentDidShow() {

	}
	_onUp() {
		const { picture, videos, add, num, pictres } = this.state
		const { actions } = this.props
		var that = this
		if (videos.length > 0) {
			if (videos[0].slice(videos[0].length - 3, videos[0].length) == 'mp4') {
				Taro.showToast({
					title: '您已上传一个视频',
					icon: 'none',
					duration: 2000
				})
			}
		} else {
			if (picture.length > 0) {
				if (picture.length < 9) {
					Taro.showActionSheet({
						itemList: ['图片'],
						itemColor: '#F4623F',
					}).then(res => {
						Taro.chooseImage({
							count: 9 - num,
							sizeType: ['original', 'compressed'],
							sourceType: ['album', 'camera'],
							success: (res) => {
								let list = []
								list = list.concat(res.tempFilePaths)
								console.log(list)
								this.setState({
									num: num + list.length,
									picture: picture.concat(res.tempFilePaths),
									add: add.concat(res.tempFilePaths)
								})
								// list.map(_item=>{
								// 	Taro.getFileSystemManager().readFile({
								// 		filePath: _item, // 选择图片返回的相对路径
								// 		encoding: 'base64', // 编码格式
								// 		success: res => { // 成功的回调
								// 			api.post(inter.UploadSite,{
								// 				file:'data:image/png;base64,' + res.data,
								// 			}).then(res=>{
								// 			   that.setState({
								// 						picture: picture.concat(res.data.data),
								// 						add: add.concat(res.data.data)
								// 				})
								// 			})
								// 		}
								// 	})
								// })
							}
						})
					})
				} else {
					Taro.showToast({
						title: '最多选择9张图片',
						icon: 'none',
						duration: 2000
					})
				}
			} else {
				Taro.showActionSheet({
					itemList: ['图片', '视频'],
					itemColor: '#F4623F',
				}).then(res => {
					if (res.tapIndex == 0) {
						Taro.chooseImage({
							count: 9, // 默认9
							sizeType: ['original', 'compressed'],
							sourceType: ['album', 'camera'],
							success: (res) => {
								var list = picture.concat(res.tempFilePaths)
								that.setState({
									num: list.length,
									picture: list,
									add: add.concat(res.tempFilePaths)
								})
								// list.map(item=>{
								// 	console.log(item,'1111')
								// 	Taro.getFileSystemManager().readFile({
								// 		filePath: item, // 选择图片返回的相对路径
								// 		encoding: 'base64', // 编码格式
								// 		success: res => { // 成功的回调
								// 			console.log(res,'2222')
								// 			 api.post(inter.UploadSite,{
								// 				file:'data:image/png;base64,' + res.data,
								// 			}).then(res=>{
								// 				console.log(res,'3333')
								// 				that.setState({
								// 						picture: picture.concat(res.data.data),
								// 						add: add.concat(res.data.data)
								// 				})
								// 			})
								// 		}
								// 	})
								// })	
							}
						})
					}
					if (res.tapIndex == 1) {
						wx.chooseMedia({
							sourceType: ['album', 'camera'],
							mediaType:['video'],
							maxDuration: 60,
							camera: 'back',
							count:1,
							success: (res) => {
								console.log(res,'???')
								let tempFilePaths = res.tempFiles[0].tempFilePath;
								var pic = []
								pic=pic.concat(res.tempFiles[0].thumbTempFilePath)
								let fileArr = tempFilePaths.split(".");
								let fileName = fileArr[fileArr.length - 2]

								if (fileName.lastIndexOf('wxfile://') > -1) {
									fileName = fileName.split("//")[fileName.split("//").length - 1]
								}
								let n = tempFilePaths.lastIndexOf('.'); // 获取最后一个.在哪
								let type = tempFilePaths.substring(n);  // 得到视频是什么格式的


								api.get(inter.getSign)
									.then((res) => {
										Taro.showLoading({ title: '视频上传中' });
										if (res.statusCode === 200) {
											let post = res.data
											
											const aliyunFileKey = post.dir + fileName + type;

											Taro.uploadFile({
												url: post.host, //上传到OSS
												filePath: tempFilePaths,
												name: 'file',
												header: { 'content-type': 'multipart/form-data' },
												formData: {
													'key': aliyunFileKey,
													'OSSAccessKeyId': post.accessid,
													'policy': post.policy,
													'signature': post.signature,
													'expire': post.expire,
													'callback': post.callback,
													'success_action_status': '200',
												},
												success: function (res) {
													if (res.statusCode == 200) {
														Taro.hideLoading()
														Taro.showToast({
															title: '上传成功',
															icon: 'success',
															duration: 1200
														})
														let showUrl = post.host + '/' + aliyunFileKey
														let list = []
														list = list.concat(showUrl)
														that.setState({
															videos: list,
															add: pic
														});
													} else {
														Taro.showToast({
															title: '上传失败！',
															icon: 'none',
															duration: 1200
														})
													}
												},
												fail: function (res) {
													console.log(res)
												}
											})
										}
									})


								// var list = videos
								// var pic = []
								// console.log(res)
								// pic.push(res.thumbTempFilePath)
								// list.push(res.tempFilePath)
								// this.setState({
								// 	videos: list,
								// 	add: pic,
								// 	file:res,
								// })
							}
						})
					}
				})
			}

		}
	}
	onBack = () => {
		Taro.navigateBack({
			delta: 1
		})
	}
	onRelease = () => {
		var that = this
		const { content, picture, videos, pictres, file } = that.state
		// const { actions } = this.props
		if (!content && picture.length == 0 && videos.length == 0) {
			Taro.showToast({
				title: '请填写内容',
				icon: 'none',
				duration: 1500
			})
		} else {
			if (picture.length != 0) {
				let pic = []
				picture.map((item, index) => {
					Taro.getFileSystemManager().readFile({
						filePath: item, // 选择图片返回的相对路径
						encoding: 'base64', // 编码格式
						success: res => { // 成功的回调
							api.post(inter.UploadSite, {
								file: 'data:image/png;base64,' + res.data,
							}).then(res => {
								pic = pic.concat(res.data.data)
								that.setState({
									pictres: pictres.concat(res.data.data)
								})
								if (pic.length == picture.length) {
									// console.log(pic)
									api.post(inter.getMood, {
										content: content,
										pics: pic.toLocaleString(),
										videos: videos.toLocaleString(),
									}).then(res => {
										Taro.showToast({
											title: '发布成功',
											icon: 'success',
											duration: 1500
										})
										setTimeout(
											this.onBack
											, 1500)
									})
								}
							})
						}
					})
				})
			} else {
				api.post(inter.getMood, {
					content: content,
					pics: picture.toLocaleString(),
					videos: videos.toLocaleString(),
				}).then(res => {
					Taro.showToast({
						title: '发布成功',
						icon: 'success',
						duration: 1500
					})
					setTimeout(
						this.onBack
						, 1500)
				})
			}
		}
	}
	ondelete=(val)=>{
		const{add,picture,videos}=this.state
		console.log(val)
		if(videos.length>0){
			this.setState({
				add:[],
				videos:[],
				num:0
			})
		}else{
			let lst = add
			let vas = picture
			lst = add.filter(item=>item!==val)
			vas = picture.filter(item=>item!==val)
			this.setState({
				add:lst,
				picture:vas,
				num:add.length
			})
		}
	}
	render() {
		return (
			<View className='box row col'>
				<View className='head row jc_sb mt_65 ai_ct'>
					<View className='ml_20 mb_80' onClick={this.onBack.bind(this)}>
						{/* <IconFont name={'left_arrow'} size={32} color={'#000000'} /> */}
						<Image src={asset.lg_icon} className='size_37' />
					</View>
					<View className='btn mr_10 label_white label_14' onClick={this.onRelease}>发布</View>
				</View>
				<View className='row col ml_25 mr_25 mt_20'>
					<Textarea className='word label_light label_14' placeholder='想说些什么…' maxlength={-1} value={this.state.content} onInput={val => { this.setState({ content: val.detail.value }) }} />
				</View>
				<View className='row wrap mt_93 ml_25 mr_25 mt_10 '>
					{
						this.state.add.map((item) => {
							return (
								<View className='pic mr_5 mt_5'>
									<Image src={asset.i_dete} onClick={this.ondelete.bind(this,item)} className="commt_tip" />
									<Image src={item} className='picture bg_d' />
								</View>
							)
						})
					}
					<View className='fe_pic row jc_ct ai_ct mt_5' onClick={this._onUp.bind(this)}>
						{/* <IconFont name={'jia'} size={80} color={'#D8D8D8'} /> */}
						<Image src={asset.jia} className='size_80' />
					</View>
				</View>
			</View>
		)

	}
}

export default releaseMood as ComponentClass