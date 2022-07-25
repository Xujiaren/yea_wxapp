import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import Tabs from '../../../../components/Tabs'
import { subNumTxt, liveday, time_ms, learnNum, percent2percent25, formatTimeStampToTime, encryNumber } from '../../../../utils/common'
import '../home.less'
import './seminar.less'



type PageState = {
	live: any,
	unlive: any,
	know: Array<any>,
	travel: Array<any>,
	column: Array<any>,
	columns: Array<any>,
	courseId: number,
	advert: Array<any>,
	current: number,
	title: string,
	seminarList: Array<any>,
	user: any,
}


class seminar extends Component<{}, PageState> {
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
			live: [],
			unlive: [],
			know: [],
			travel: [],
			column: [],
			columns: [],
			courseId: 0,
			advert: [],
			current: 0,
			title: '',
			seminarList: [],
			user: {}
		}

	}

	componentDidMount() {
		this.getChannel()
		api.get(inter.User)
			.then(res => {
				this.setState({
					user: res.data.data
				})
			})
	}

	componentDidShow() {

	}
	getChannel = () => {
		var that = this
		api.get(inter.seminarList, {})
			.then(ress => {
				let data = ress.data.data
				that.setState({
					seminarList: data
				})
				if (data.length > 0) {
					api.get(inter.ChannelSite + data[0].channelId, {
						sort: 0
					}).then(res => {
						that.setState({
							column: res.data.data
						})
					})
					if (data.length > 1) {
						api.get(inter.ChannelSite + data[1].channelId, {
							sort: 0
						}).then(res => {
							that.setState({
								know: res.data.data
							})
						})
					}
					if (data.length > 2) {
						api.get(inter.ChannelSite + data[2].channelId, {
							sort: 0
						}).then(res => {
							that.setState({
								travel: res.data.data
							})
						})
					}
					if (data.length > 3) {
						api.get(inter.ChannelSite + data[3].channelId, {
							sort: 0
						}).then(res => {
							console.log(res)
							that.setState({
								columns: res.data.data
							})
						})
					}
				}
			})

		api.get(inter.ConfigAd + 7)
			.then(res => {
				this.setState({
					advert: res.data.data,
					title: res.data.data[0].billboardName
				})
			})
		api.get(inter.CourseLive, {
			status: 1,
			page: 0,
			ctype: 51
		})
			.then(res => {
				this.setState({
					unlive: res.data.data.items
				})
			})
		api.get(inter.CourseLive, {
			status: 0,
			sort: 0,
			page: 0,
			ctype: 51,
		})
			.then(res => {
				console.log(res, "///")
				this.setState({
					live: res.data.data.items
				})
			})
	}
	onHeadOpen = (val) => {
		let adlink = val.link
		api.post(inter.saveHistory, {
			type: 1,
			billboard_id: val.billboardId
		})
			.then(res => {
				// console.log(res)
			})
		if (adlink !== '') {
			if (adlink.substring(0, 4) == 'http') {
				let adl = encodeURIComponent(val.link)
				console.log(adl)
				let dl = decodeURIComponent(adl)
				console.log(dl)
				Taro.navigateTo({ url: menu.adWebView + '?link=' + `${adl}` })
			} else {
				Taro.navigateTo({
					url: adlink
				})
			}
		}

	}
	onOpen = (val) => {
		this.setState({
			courseId: val.courseId
		})
		console.log(val.ctype)
		if (val.ctype == 48) {
			Taro.navigateTo({
				url: menu.courseDesc + `?course_id=${val.courseId}` + '&courseName=' + `${val.courseName}` + '&isback=0'
			})
		} else {
			Taro.navigateTo({
				url: 'read/read' + `?course_id=${val.courseId}` + '&ctype=' + val.ctype + '&isback=0' + '&courseName=' + `${val.courseName}`
			})
		}

	}
	onMuch = (val) => {
		const { seminarList } = this.state
		if (val == 'kaohe') {
			Taro.navigateTo({
				url: 'course/course' + '?ctype=' + seminarList[0].channelId
			})
		}
		if (val == 'chuyou') {
			Taro.navigateTo({
				url: 'course/course' + '?ctype=' + seminarList[1].channelId
			})
		}
		if (val == 'liyi') {
			Taro.navigateTo({
				url: 'course/course' + '?ctype=' + seminarList[2].channelId
			})
		}
		if (val == 'youxue') {
			Taro.navigateTo({
				url: 'course/course' + '?ctype=' + seminarList[3].channelId
			})
		}
		if (val == 'zhibo') {
			this.props.tolive('1')
		}
	}
	onRoom = (item) => {
		const { live } = this.state
		console.log(live)
		if (item.ctype == 53) {
			Taro.navigateTo({ url: menu.actveLive + '?courseId=' +item.courseId })
		} else {
			Taro.navigateTo({
				url: menu.liveDesc + '?courseId=' + item.courseId + '&liveStatus=' + item.liveStatus + '&liveName=' + item.courseName + '&typs=2'
			})
		}

	}
	_livedesc() {
		const { unlive } = this.state
		Taro.navigateTo({
			url: menu.courseDesc + `?course_id=${unlive[0].courseId}` + '&courseName=' + percent2percent25(`${unlive[0].courseName}`) + '&isback=1'
		})
	}
	handleStop(e) {
		e.stopPropagation()
	}
	onReservation = (val) => {
		const { user } = this.state;
		var page = this.page
		var that = this
		if (user.userId > 0) {
			console.log(val)
			let tmpId = 'bH2whf7pY40T4COena9BrTi3jPQDM4Ls9CRaEW7ycqU'
			Taro.requestSubscribeMessage({
				tmplIds: [tmpId],
				success(res) {
					api.post(inter.bookCourse + val.courseId, {
						form_id: 'wxapp',
					}).then(res => {
						that.getChannel()
						// api.get(inter.CourseLive,{
						//     status:1,
						//     page:0
						// })
						// .then(res=>{
						//     this.setState({
						//         livess:res.data.data.items
						//     })
						// })
						// api.get(inter.CourseLive,{
						//     status:0,
						//     sort:0,
						//     page:0
						// })
						// .then(res=>{
						//     this.setState({
						//         lives:res.data.data.items
						//     })
						// })
					})
				}
			})
		}
	}
	render() {

		const { live, know, travel, column, unlive, advert, current, title, columns, seminarList } = this.state

		return (
			<View className='box row jc_ct'>
				<View className='seminar row col'>
					<View className='seminar_pic'>
						<Swiper
							className='seminar_pic'
							indicatorColor='#999'
							indicatorActiveColor='#333'
							circular
							ndicatorDots
							autoplay
							current={current}
							onChange={(e) => {
								this.setState({
									current: e.detail.current,
									title: advert[e.detail.current].billboardName
								})
							}}>
							{
								advert.map((item, ele) => {
									return (
										<SwiperItem className='picture'>
											<Image src={item.fileUrl} className='picture' onClick={this.onHeadOpen.bind(this, item)} />
										</SwiperItem>
									)
								})
							}
						</Swiper>
					</View>
					<View className='label_word label_light label_light mt_10'>{title}</View>
					{/* 考核条件须知 */}
					{
						seminarList.length > 0 ?
							<View className='seminar_box bg_white pl_15 pr_15'>
								<View className='row jc_sb mt_20 ai_ct'>
									<Text className='text label_18 font_blod'>{seminarList[0].channelName}</Text>
									<View className='row ai_ct'>
										<Text className='label_text label_light' onClick={this.onMuch.bind(this, 'kaohe')}>更多</Text>
										{/* <IconFont name={'right'} size={24} color={'#999999'} /> */}
										<Image src={asset.rights} className='size_24' />
									</View>
								</View>
								<View className='main_box row col'>
									{
										column.map((item, index) => {
											if (index < 3) {
												return (
													<View className='main_box mt_15 row' onClick={this.onOpen.bind(this, item)}>
														<View className='main_pic'>
															<Image src={item.courseImg} className='picture' />
															<View className='ismust'>{item.isMust == 1 ? '必修' : '选修'}</View>
														</View>
														<View className='row col ml_7'>
															<View className='width_172'>
																<View className='text label_14 font_blod'>{subNumTxt(item.courseName, 20)}</View>
																<View className='label_light label_13'>{subNumTxt(item.summary, 12)}</View>
															</View>
															<View className='row mt_3 ai_ct'>
																{/* <IconFont name={'bofangtubiao'} color={'#FFA349'} size={24} /> */}
																<Image src={asset.bofang} className='size_24' />
																<Text className='label_gray label_12 ml_5'>{item.hit}人已学</Text>
															</View>
														</View>
													</View>
												)
											}
										})
									}
								</View>
							</View>
							: null
					}

					{/* 精彩直播 */}
					{
						live.length > 0 || unlive.length > 0 ?
							<View className='row jc_sb mt_20 ai_ct ml_20 mr_20'>
								<Text className='text label_18 font_blod'>精彩直播</Text>
								<View className='row ai_ct'>
									<Text className='label_text label_light' onClick={this.onMuch.bind(this, 'zhibo')}>更多</Text>
									{/* <IconFont name={'right'} size={24} color={'#999999'} /> */}
									<Image src={asset.rights} className='size_24' />
								</View>
							</View>
							: null
					}
					{
						live.length > 0 || unlive.length > 0 ?
							<View className='live_box bg_white pl_15 pr_15'>
								{
									live.length != 0 ?
										(
											live.map((item, index) => {
												return (
													<View onClick={this.onRoom.bind(this,item)}>
														<View className='live_top row jc_sb as_ct pb_10'>
															<Text className='label_gray label_12'>{item.beginTimeFt}开播</Text>
															{
																item.liveStatus === 0 && item.roomStatus === 0 ?
																	<Text className='label_light label_12'>{item.bookNum}人已预约</Text>
																	:
																	<Text className='label_light label_12'>{item.hit}在上课</Text>
															}
														</View>
														<View className='live_auto row col mt_9'>
															<View className='text font_blod label_16'>{subNumTxt(item.courseName, 18)}</View>
															<View className='row jc_sb ai_ct mt_5'>
																<Text className='label_gray label_12'>{subNumTxt(item.summary, 18)}</Text>
																{
																	item.liveStatus == 0 && item.roomStatus == 0 ?
																		<View onClick={this.handleStop.bind(this)}>
																			{
																				item.book ?
																					<View className='btn_into label_orange' onClick={this.onRoom}>进入</View>
																					:
																					<View className='live_btn label_white' onClick={this.onReservation.bind(this, item)}>预约</View>
																			}
																		</View>
																		:
																		<View className='btn_into label_orange' onClick={this.onRoom.bind(this,item)}>进入</View>
																}
															</View>
														</View>
													</View>
												)
											})
										)
										: null
								}
								{
									unlive.length != 0 ?
										<View className='main_box mt_15 row' onClick={this._livedesc}>
											<View className='main_pic'>
												<Image src={unlive[0].courseImg} className='picture' />
											</View>
											<View className='row col ml_7'>
												<View className='width_172'>
													<View className='text label_14 font_blod'>{subNumTxt(unlive[0].courseName, 20)}</View>
													<View className='label_light label_13'>{subNumTxt(unlive[0].summary, 12)}</View>
												</View>
												<View className='row mt_3 ai_ct'>
													{/* <IconFont name={'bofangtubiao'} color={'#FFA349'} size={24} /> */}
													<Image src={asset.bofang} className='size_24' />
													<Text className='label_gray label_12 ml_5'>{unlive[0].hit}人已学</Text>
												</View>
											</View>
										</View>
										: null
								}

							</View>
							: null
					}
					{/* 出游小知识 */}
					{
						seminarList.length > 1 ?
							<View className='know_box bg_white pl_15 pr_15'>
								<View className='row jc_sb mt_20 ai_ct'>
									<Text className='text label_18 font_blod'>{seminarList[1].channelName}</Text>
									<View className='row ai_ct'>
										<Text className='label_text label_light' onClick={this.onMuch.bind(this, 'chuyou')}>更多</Text>
										{/* <IconFont name={'right'} size={24} color={'#999999'} /> */}
										<Image src={asset.rights} className='size_24' />
									</View>
								</View>
								<View className='main_boxs row wrap jc_sb mt_10'>
									{
										know.map((item, index) => {
											if (index < 4) {
												return (
													<View className='twin_box mt_15 row col jc_sb' onClick={this.onOpen.bind(this, item)}>
														<View className='twin_pic'>
															<Image src={item.courseImg} className='picture' />
															<View className='ismust'>{item.isMust == 1 ? '必修' : '选修'}</View>
														</View>
														<View className='row col'>
															<View className='wid'>
																<View className='text label_14 font_blod mt_5'>{subNumTxt(item.courseName, 20)}</View>
																<View className='label_light label_13 mt_3'>{subNumTxt(item.summary, 10)}</View>
															</View>
															<View className='row mt_5 ai_ct'>
																{/* <IconFont name={'bofangtubiao'} color={'#FFA349'} size={24} /> */}
																<Image src={asset.bofang} className='size_24' />
																<Text className='label_gray label_12 ml_5'>{item.hit}人已学</Text>
															</View>
														</View>
													</View>
												)
											}
										})
									}
								</View>
							</View>
							: null
					}

					{/* 旅游礼仪 */}
					{
						seminarList.length > 2 ?
							<View className='know_box bg_white pl_15 pr_15'>
								<View className='row jc_sb mt_20 ai_ct'>
									<Text className='text label_18 font_blod'>{seminarList[2].channelName}</Text>
									<View className='row ai_ct'>
										<Text className='label_text label_light' onClick={this.onMuch.bind(this, 'liyi')}>更多</Text>
										{/* <IconFont name={'right'} size={24} color={'#999999'} /> */}
										<Image src={asset.rights} className='size_24' />
									</View>
								</View>
								<View className='main_boxs row wrap jc_sb mt_10'>
									{
										travel.map((item, index) => {
											if (index < 4) {
												return (
													<View className='twin_box mt_15 row col jc_sb' onClick={this.onOpen.bind(this, item)}>
														<View className='twin_pic'>
															<Image src={item.courseImg} className='picture' />
															<View className='ismust'>{item.isMust == 1 ? '必修' : '选修'}</View>
														</View>
														<View className='row col'>
															<View className='wid'>
																<View className='text label_14 font_blod mt_5'>{subNumTxt(item.courseName, 20)}</View>
																<View className='label_light label_13 mt_3'>{subNumTxt(item.summary, 10)}</View>
															</View>
															<View className='row mt_5 ai_ct'>
																{/* <IconFont name={'bofangtubiao'} color={'#FFA349'} size={24} /> */}
																<Image src={asset.bofang} className='size_24' />
																<Text className='label_gray label_12 ml_5'>{item.hit}人已学</Text>
															</View>
														</View>
													</View>
												)
											}
										})
									}
								</View>
							</View>
							: null
					}

					{/* 某某专栏 */}
					{/* <View className='know_box bg_white pl_15 pr_15'>
						<View className='row jc_sb mt_20 ai_ct'>
							<Text className='text label_18 font_blod'>某某专栏</Text>
							<View className='row ai_ct'>
								<Text className='label_text label_light' onClick={this.onMuch.bind(this, 'zhuanlan')}>更多</Text>
								<IconFont name={'right'} size={24} color={'#999999'} />
							</View>
						</View>
						<View className='main_box row wrap jc_sb mt_10'>
							{
								column.map((item, index) => {
									return (
										<View className='twin_box mt_20 row col jc_sb' onClick={this.onOpen.bind(this, item)}>
											<View className='twin_pic'>
												<Image src={item.courseImg} className='picture' />
											</View>
											<View className='row col'>
												<Text className='title_box text label_14 font_blod mt_5'>{subNumTxt(item.courseName, 20)}</Text>
												<Text className='label_light label_13'>{subNumTxt(item.summary, 10)}</Text>
												<View className='row mt_3 ai_ct'>
													<IconFont name={'bofangtubiao'} color={'#FFA349'} size={24} />
													<Text className='label_gray label_12 ml_5'>{item.hit}人已学</Text>
												</View>
											</View>
										</View>
									)
								})
							}
						</View>
					</View> */}
					<View className='mb_50'></View>
					{/* 游学积分兑换 */}
					{/* <View className='seminar_box bg_white pl_15 pr_15 mb_50'>
						<View className='row jc_sb mt_20 ai_ct'>
							<Text className='text label_18 font_blod'>游学积分兑换</Text>
							<View className='row ai_ct'>
								<Text className='label_text label_light' onClick={this.onMuch.bind(this, 'youxue')}>更多</Text>
								<Image src={asset.rights} className='size_24' />
							</View>
						</View>
						<View className='main_box row col'>
							{
								columns.map((item, index) => {
									if (index < 3) {
										return (
											<View className='main_box mt_15 row' onClick={this.onOpen.bind(this, item)}>
												<View className='main_pic'>
													<Image src={item.courseImg} className='picture' />
													<View className='ismust'>{item.isMust == 1 ? '必修' : '选修'}</View>
												</View>
												<View className='row col ml_7'>
													<View className='width_172'>
														<View className='text label_14 font_blod'>{subNumTxt(item.courseName, 20)}</View>
														<View className='label_light label_13'>{subNumTxt(item.summary, 12)}</View>
													</View>
													<View className='row jc_sb ai_ct'>
														<View className='row ai_ct'>
															<Text className='change_btn label_orange label_11'>兑换</Text>
															<Text className='label_orange label_11 ml_3'>{item.integral}游学积分</Text>
														</View>
														<Text className='label_gray label_10'>{item.learn}人已兑换</Text>
													</View>
												</View>
											</View>
										)
									}
								})
							}
						</View>
					</View> */}
				</View>
			</View>
		)

	}
}

export default seminar as ComponentClass