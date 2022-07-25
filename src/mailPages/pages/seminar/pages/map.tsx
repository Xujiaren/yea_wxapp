import { ComponentClass } from 'react'
import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Image, Video } from '@tarojs/components'
import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import Tabs from '../../../../components/Tabs'
import '../home.less'
import './map.less'



type PageState = {
	status: number,
	index: number,
	mapList: Array<any>,
	list: Array<any>,
	map:Array<any>,
	maps:Array<any>,
	mapss:Array<any>,
	formap:Array<any>,
	begin:string,
	end:string,
	begins:string,
	ends:string,
	beginss:string,
	endss:string,
	beginsss:string,
	endsss:string,
}


class map extends Component<{}, PageState> {
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
			status: 0,
			index: 2,
			mapList: [],
			map:[],
			maps:[],
			mapss:[],
			formap:[],
			begin:'',
			end:'',
			begins:'',
			ends:'',
			beginss:'',
			endss:'',
			beginsss:'',
			endsss:'',
			list: [
				{
					icon: asset.bofangtubiao,
					title: '观看一门课程',
					color: '#8F87D5',
					inum: 0,
					num: 1,
					font: '需要看完课程'
				},
				{
					icon: asset.kaoshi,
					title: '完成一场考试',
					color: '#E84F31',
					inum: 0,
					num: 1,
					font: '需要考试合格才算完成任务哦'
				},
				{
					icon: asset.leijikecheng,
					title: '完成一个专题课程',
					color: '#98DAF9',
					inum: 0,
					num: 1,
					font: '需要完成专题里所有课程'
				},
				{
					icon: asset.yonghutu,
					title: '观看一场直播',
					color: '#F89A00',
					inum: 0,
					num: 1,
					font: '需要进入直播间观看'
				},
				{
					icon: asset.pinfeng,
					title: '评分达到5次',
					color: '#E84F31',
					inum: 0,
					num: 1,
					font: '课程、直播、精彩瞬间、心情墙评分'
				},
				{
					icon: asset.kecheng,
					title: '观看组合课程',
					color: '#F89A00',
					inum: 0,
					num: 3,
					font: '观看完设置的所有课程'
				},
				{
					icon: asset.xinqin,
					title: '心情墙发布内容',
					color: '#2CA2F0',
					inum: 0,
					num: 1,
					font: '发布内容并审核通过'
				},
				{
					icon: asset.dashang,
					title: '兑换一堂课  ',
					color: '#36CBC1',
					inum: 0,
					num: 1,
					font: '用游学积分兑换课程'
				}
			]
		}

	}

	componentDidMount() {
		this.Map()
	}
	Map = () => {
		Date.prototype.Format = function (fmt) { //author: meizz 
			var o = {
				"M+": this.getMonth() + 1, //月份 
				"d+": this.getDate(), //日 
				"h+": this.getHours(), //小时 
				"m+": this.getMinutes(), //分 
				"s+": this.getSeconds(), //秒 
				"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
				"S": this.getMilliseconds() //毫秒 
			};
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		}
		const { list } = this.state
		api.get(inter.getMap, {
			status: 1,
		}).then(res => {
			var task = res.data.data
			var obj = {}
			var newArr = task.reduce((preItem, item, index, arr) => {
				obj[item.etype] ? '' : obj[item.etype] = true && preItem.push(item);
				return preItem
			}, [])
			let beg = new Date(task[0].beginTime*1000).Format("MM月dd日")
			let en = new Date(task[0].endTime*1000).Format("MM月dd日")
			this.setState({
				mapList: newArr,
				formap:newArr,
				begin:beg,
				end:en
			})
		})
		api.get(inter.getMap, {
			status: 2,
		}).then(res => {
			var task = res.data.data
			var obj = {}
			var newArr = task.reduce((preItem, item, index, arr) => {
				obj[item.etype] ? '' : obj[item.etype] = true && preItem.push(item);
				return preItem
			}, [])
			let beg = new Date(task[0].beginTime*1000).Format("MM月dd日")
			let en = new Date(task[0].endTime*1000).Format("MM月dd日")
			this.setState({
				map: newArr,
				begins:beg,
				ends:en
			})
		})
		api.get(inter.getMap, {
			status: 3,
		}).then(res => {
			var task = res.data.data
			var obj = {}
			var newArr = task.reduce((preItem, item, index, arr) => {
				obj[item.etype] ? '' : obj[item.etype] = true && preItem.push(item);
				return preItem
			}, [])
			let beg = new Date(task[0].beginTime*1000).Format("MM月dd日")
			let en = new Date(task[0].endTime*1000).Format("MM月dd日")
			this.setState({
				maps: newArr,
				beginss:beg,
				endss:en
			})
		})
		api.get(inter.getMap, {
			status: 4,
		}).then(res => {
			var task = res.data.data
			var obj = {}
			var newArr = task.reduce((preItem, item, index, arr) => {
				obj[item.etype] ? '' : obj[item.etype] = true && preItem.push(item);
				return preItem
			}, [])
			let beg = new Date(task[0].beginTime*1000).Format("MM月dd日")
			let en = new Date(task[0].endTime*1000).Format("MM月dd日")
			this.setState({
				mapss: newArr,
				beginsss:beg,
				endsss:en
			})
		})
	}
	componentDidShow() {

	}
	onChange = (val) => {
		this.setState({
			status: val,
		})
		if(val==0){
			this.setState({
				formap:this.state.mapList
			})
		}
		if(val==1){
			this.setState({
				formap:this.state.map
			})
		}
		if(val==2){
			this.setState({
				formap:this.state.maps
			})
		}
		if(val==3){
			this.setState({
				formap:this.state.mapss
			})
		}
	}

	onClick=(val)=>{
		if(val=='un'){
			Taro.showToast({
				title:'任务未开始',
				icon:'none',
				duration:1500,
			})
		}
		if(val=='in'){
			Taro.showToast({
				title:'任务已完成',
				icon:'none',
				duration:1500,
			})
		}
		if(val=='pass'){
			Taro.showToast({
				title:'任务已过期',
				icon:'none',
				duration:1500,
			})
		}
	}
	onRule=()=>{
		Taro.navigateTo({
			url:'read/rule'
		})
	}
	onOpen=(val)=>{
		if(val.etype==1){
			this.props.tolive('0')
		}
		if(val.etype==2){
			this.props.tolive('0')
		}
		if(val.etype==3){
			this.props.tolive('0')
		}
		if(val.etype==4){
			this.props.tolive('1')
		}
		if(val.etype==5){
			this.props.tolive('0')
		}
		if(val.etype==6){
			this.props.tolive('0')
		}
		if(val.etype==7){
			this.props.tolive('4')
		}
		if(val.etype==8){
			this.props.tolive('0')
		}
	}
	render() {
		const { status, mapList, list ,map,maps,mapss,formap,begin,begins,beginss,beginsss,end,ends,endss,endsss} = this.state
		const items = ['未开始', '进行中', '已完成', '已过期']
		return (
			<View className='box row col'>
				<View className='head'>
					<View className='labe'>
						<View className='label_white label_14 ml_20' onClick={this.onRule.bind(this)}>规则</View>
					</View>
					<Image src={'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/app/forum/forum.task.png'} className='picture' />
				</View>
				<View className='fe_box row jc_ct'>
					<View className='re_box row col mt'>
						<View className='re_box row jc_ad'>
							{
								items.map((e, index) => {
									return (
										<View className='row col jc_ct' onClick={this.onChange.bind(this, index)}>
											{
												index == status ?
													<View>
														<View className='label_white label_14 font_bold'>{e}</View>
														<View className='itn bg_white ml_16 mt_5'></View>
													</View>
													:
													<View>
														<View className='label_white label_14 font_light'>{e}</View>
														<View className='itn bg_fa ml_16 mt_5'></View>
													</View>
											}
										</View>
									)
								})
							}
						</View>
						<View className='item bg_white mt_5 row col'>
							<View className='row ai_ct mb_10'>
								<View className='label_16 font_bold'>任务时间</View>
								<View className='label_light label_14 ml_10'>{status==0?begin+'-'+end:status==1?begins+'-'+ends:status==2?beginss+'-'+endss:status==3?beginsss+'-'+endsss:null}</View>
							</View>
							{
								formap.map((item, idx) => {
									return (
										<View className='icon row jc_sb ai_ct'>
											<View className='row ai_ct'>
												<Image src={list[item.etype - 1].icon} className='size_40' />
												<View className='ml_20'>
													{/* {
														mapList.filter(_item => _item.etype == idx - 1).length != 0 ?
															<View className='row'>
																<View className='label_14 font_bold'>{item.title}</View>
																<View className='label_light label_14 ml_5'>{mapList.filter(_item => _item.etype == idx - 1)[0].finishCourseNum}/{mapList.filter(_item => _item.etype == idx - 1)[0].taskLimit}</View>
															</View>
															: */}
													<View className='row'>
														<View className='label_14 font_bold'>{list[item.etype - 1].title}</View>
														<View className='label_light label_14 ml_5'>{item.finishCourseNum}/{item.taskLimit}</View>
													</View>
													{/* } */}
													<View className='label_light label_12 mt_5'>{list[item.etype - 1].font}</View>
												</View>
											</View>
											{
												status==0?
												<View className='btn label_light label_12' onClick={this.onClick.bind(this,'un')}>未开始</View>
												:status==1?
												<View className='btn label_white label_12 bg_blue' onClick={this.onOpen.bind(this,item)}>去完成</View>
												:status==2?
												<View className='btn label_light label_12' onClick={this.onClick.bind(this,'in')}>已完成</View>
												:status==3?
												<View className='btn label_light label_12' onClick={this.onClick.bind(this,'pass')}>已过期</View>
												:null
											}
											
										</View>
									)
								})
							}

						</View>
					</View>
				</View>
			</View>
		)

	}
}

export default map as ComponentClass