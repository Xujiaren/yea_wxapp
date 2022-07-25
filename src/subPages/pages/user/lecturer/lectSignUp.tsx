import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'

import { View, Text, Image, Input, Textarea, Button, Picker } from '@tarojs/components'

import menu from '../../../../config/menu';
import asset from '../../../../config/asset'

import inter from '../../../../config/inter'
import api from '../../../../services/api'

import '../../../../config/theme.css';
import './lectSignUp.less'
import { parseInt } from 'lodash';

type PageState = {
    applyId: number,
    type: number,
    name: string,
    IdCard: string,
    level: string,
    mobile: string,
    ads: string,
    sexList: Array<string>
    sexIdx: number,
    eduBack: Array<string>,
    eduBackIdx: number,
    serviceCenter: string,
    age: string,
    specialty: string,
    lectType: Array<string>,
    lectTypeIdx: number,
    rangeIcon: string,
    speaker: string,
    record: string,
    experie: string,
    picArray: Array<{}>,
    barehead: string,
    applyList: Array<{
        text: string,
        status: number
    }>,
    checkLogList: Array<{}>,
    checkReason: '',
    status: number,
    reason: string,
    isEdit:boolean,
    companylist:any,
    comps:any,
    company_index:number,
    companyNo:any,
}

class lectSignUp extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '我的申请',
        enablePullDownRefresh: true
    }


    constructor() {
        super(...arguments)
        this.state = {
            applyId: 0,
            type: 0, // 是否可以申请讲师  0 暂未开启  1  开启  
            name: '', // 姓名
            IdCard: '', // 卡号
            level: '', // 级别
            mobile: '', // 电话
            ads: '', // 地址省份
            sexList: [ '男', '女'], // 性别
            sexIdx: 0,
            eduBack: ['初级中学', '普通高中', '技工学校', '职业高中', '中等专科', '大学专科', '大学本科', '硕士研究生', '博士研究生'], // 学历
            eduBackIdx: 0,
            serviceCenter: '91000', // 服务中心 
            age: '',
            specialty: '', // 特长
            lectType: ['无', '企业文化', '健康管理', '日化', '美容', '专业素质', '自我发展'],//讲师类型
            lectTypeIdx: 0,
            speaker: '',// 主讲课程
            rangeIcon: "https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/7db72a4f-eb0b-4ed5-84e2-aa6aad198a5e.png",
            record: '', // 履历
            experie: '', // 经验
            picArray: [], // 职业资格证书
            barehead: '', // 免冠证书
            applyList: [{
                text: '提交申请',
                status: 2
            }, {
                text: '业务中心',
                status: 0
            }, {
                text: '市场中心',
                status: 0
            }, {
                text: '完美大学',
                status: 0
            }],
            checkLogList: [],
            checkReason: '',
            status: 0,
            reason: '',
            isEdit:true,
            companylist: [],
            comps:[],
            company_index:0,
            companyNo:'',
        }
    }

    componentWillMount() {

        var that = this
        const { type } = that.$router.params
        that.setState({
            type: parseInt(type)
        })
    }

    componentDidMount() {
        var that = this
        that.getUser();
        that.getApplystatus();
        that.getCompany();
    }

    componentWillUnmount() {

    }

    componentDidShow() { }
    componentDidHide() { }
    //公司
    getCompany=()=>{
        api.get('/user/company/list')
        .then(res=>{
            let companylist = res.data.data
            let lst:any = []
            companylist.map(item => {
                lst.push(item.companyName)
            })
            this.setState({
                companylist: companylist,
                comps: lst
            })
        })
    }
    // 我的
    getUser() {
        var that = this
        api.get(inter.User)
            .then((res) => {
                if (res.data.status) {
                    let userData = res.data.data
                    console.log(userData, 'IdCard')
                    that.setState({
                        IdCard: userData.sn,
                        sexIdx: userData.sex,
                        mobile: userData.mobile,
                        level: userData.level,
                        name: userData.username,
                        serviceCenter:userData.agentNo?userData.agentNo:'91000',
                        ads:userData.companyName
                    })
                }
            })
    }


    // 申请的状态
    getApplystatus() {
        var that = this;
        const { lectType, lectTypeIdx,eduBack } = that.state


        api.get(inter.applyTechStatus)
            .then((res) => {
                if (res.data.status) {
                    let applyData = res.data.data
                    if (applyData !== null) {

                        let obj = {
                            checkInfo: {
                                checkStatus: 1
                            },
                            isCheck: 1,
                            name: "提交申请",
                            role_id: 0,
                            rule_order: 0,
                        }

                        let gareList = [];
                        let lectidx = 0


                        applyData.checkLogList.unshift(obj)

                        if (Array.isArray(applyData.galleryList)) {
                            for (let j = 0; j < applyData.galleryList.length; j++) {
                                gareList.push(applyData.galleryList[j].fpath)
                            }
                        }

                        // for (let z = 0; z < lectType.length; z++) {
                        //     if (lectType[z] === applyData.categoryIds) {
                        //         lectidx = z
                        //     }
                        // }
                        if (applyData.categoryIds == '159') {
                            lectidx = 1
                        } else if (applyData.categoryIds == '160') {
                            lectidx = 2
                        } else if (applyData.categoryIds == '161') {
                            lectidx = 3
                        } else if (applyData.categoryIds == '162') {
                            lectidx = 4
                        } else if (applyData.categoryIds == '163') {
                            lectidx = 5
                        } else if (applyData.categoryIds == '164') {
                            lectidx = 6
                        }else{
                            lectidx = 0
                        }
                        let gareLists = gareList.slice(0, 4)
                        let idx = eduBack.indexOf(applyData.edu)

                        setTimeout(() => {
                            that.setState({
                                applyId: applyData.applyId,
                                sexIdx: applyData.sex-1<0?0:applyData.sex-1,
                                barehead: applyData.photo,
                                picArray: gareLists,
                                ads: applyData.companyName,
                                companyNo: applyData.province,
                                age: applyData.age,
                                experie: applyData.trainExp,
                                record: applyData.selfExp,
                                mobile: applyData.mobile,
                                serviceCenter: applyData.service,
                                IdCard: applyData.sn,
                                name: applyData.name,
                                specialty: applyData.strong,
                                checkLogList: applyData.checkLogList,
                                lectTypeIdx: lectidx,
                                eduBackIdx:idx,
                                status: applyData.status,
                                reason: applyData.reason,
                                isEdit:false
                            })
                        }, 500);
                        


                        for (let i = 0; i < applyData.checkLogList.length; i++) {
                            if (applyData.checkLogList[i].checkInfo !== '') {
                                if (applyData.checkLogList[i].checkInfo.checkStatus === 2) {
                                    that.setState({
                                        checkReason: applyData.checkLogList[i].checkInfo.reason
                                    })
                                    break;
                                } else {
                                    that.setState({
                                        checkReason: ''
                                    })
                                }
                            }
                        }
                    } else {
                        that.setState({
                            checkLogList: []
                        })
                    }
                }
            })
    }



    //选择照片或者拍照
    _onChangeImg = () => {
        var that = this;
        const { picArray } = that.state

        Taro.chooseImage({
            count: 4,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success: function (res) {

                for (let i = 0; i < res.tempFilePaths.length; i++) {
                    Taro.getFileSystemManager().readFile({
                        filePath: res.tempFilePaths[i], // 选择图片返回的相对路径
                        encoding: 'base64', // 编码格式
                        success: res => { // 成功的回调
                            api.post(inter.UploadSite, {
                                file: 'data:image/png;base64,' + res.data,
                            }).then(res => {
                                if (res.data.status) {
                                    picArray.push(res.data.data)
                                    that.setState({
                                        picArray: picArray
                                    })
                                }
                            })
                        },
                        fail: msg => {
                        }
                    })
                }

            },
            fail: function (errmsg) {

            }
        })
    }

    // 查看图片
    onViewImgs(galleryList, index) {

        Taro.previewImage({
            urls: galleryList, //需要预览的图片http链接列表，注意是数组
            current: galleryList[index], // 当前显示图片的http链接，默认是第一个
        }).then(res => {
            // console.log(res)
        })
    }

    // 删除图片
    _onDetele(index) {
        var that = this
        const { picArray } = that.state
        picArray.splice(index, 1)

        that.setState({
            picArray: picArray
        })
    }

    // 免冠照
    _onChooseImg() {
        var that = this
        Taro.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success: function (res) {
                Taro.getFileSystemManager().readFile({
                    filePath: res.tempFilePaths[0], // 选择图片返回的相对路径
                    encoding: 'base64', // 编码格式
                    success: res => { // 成功的回调
                        api.post(inter.UploadSite, {
                            file: 'data:image/png;base64,' + res.data,
                        }).then(res => {
                            if (res.data.status) {
                                that.setState({
                                    barehead: res.data.data,
                                })
                            }
                        })
                    },
                    fail: msg => {
                    }
                })

            },
            fail: function (errmsg) {

            }
        })
    }

    // 查看图拍
    onViewImg(url) {

        let urls: string[] = new Array();

        urls.push(url)

        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: urls[0], // 当前显示图片的http链接，默认是第一个
        }).then((res) => {
            // console.log(res)
        })
    }

    // 免冠照 删除
    _onbareDetele() {
        var that = this

        that.setState({
            barehead: ''
        })
    }


    onChange = (e) => {
        console.log(e)
    }



    // 讲师申请提交
    _onSubmit() {
        var that = this;
        const { applyId, IdCard, name, age, mobile, ads, sexIdx, eduBack, eduBackIdx, lectType, lectTypeIdx, record, experie, picArray, barehead, serviceCenter, specialty, status ,checkLogList,companyNo} = that.state
        let lst:any = []
        let vas = checkLogList
        lst = vas.filter((item,index)=>index!==0)
        if(lst.length>0&&lst.filter(item=>item.isCheck==1).length>0&&!this.state.isEdit){
            Taro.showToast({
                title:'审核中，不可重复提交',
                icon:'none',
                duration:1000
            })
            return;
        }
        let train_certs = picArray.join(',')

        let isPush: boolean = true
        let tip: string = ''
        // let pattern = /0?(13|14|15|17|18)[0-9]{9}/; // 手机号
        // var pattern = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/; // 手机号
        var pattern = /^1[3-9]\d{9}$/; // 手机号
        let ids = ''
        if (lectTypeIdx == '1') {
            ids = '159'
        } else if (lectTypeIdx == '2') {
            ids = '160'
        } else if (lectTypeIdx == '3') {
            ids = '161'
        } else if (lectTypeIdx == '4') {
            ids = '162'
        } else if (lectTypeIdx == '5') {
            ids = '163'
        } else if (lectTypeIdx == '6') {
            ids = '164'
        }

        if (name == '') {
            isPush = false
            tip = '请填写姓名'
        } else if (serviceCenter == '') {
            isPush = false
            tip = '服务中心不能为空'
        } else if (age == '') {
            isPush = false
            tip = '请填写年龄'
        }else if (!pattern.test(mobile)) {
            isPush = false
            tip = '请填写正确的手机号'
        } else if (specialty == '') {
            isPush = false
            tip = '请填写特长'
        } else if (experie == '') {
            isPush = false
            tip = '请填写授课经历'
        } else if (record == '') {
            isPush = false
            tip = '请填写个人履历'
        } else if (barehead == '') {
            isPush = false
            tip = '请上传蓝底免冠照片'
        }
        // else if (ads == '') {
        //     isPush = false
        //     tip = '请填写省份'
        // } 


        if (isPush) {
            api.post(inter.applyTeacher, {
                apply_id: applyId,
                sn: IdCard,
                name: name,
                age: age,
                sex: sexIdx+1,
                province: companyNo,
                edu: eduBack[eduBackIdx],
                mobile: mobile,
                serviceCenter: serviceCenter,
                category_ids: ids,
                strong: specialty,
                train_exp: experie,
                self_exp: record,
                train_cert: train_certs,
                photo: barehead
            }).then((res) => {
                if (res.data.status) {
                    Taro.showToast({
                        title: '申请成功，待审核',
                        icon: 'success',
                        duration: 1000
                    })

                    setTimeout(() => {
                        that.getApplystatus()
                        Taro.navigateBack({
                            delta: 1
                        })
                    }, 1000)
                } else {
                    if (res.data.message === 'already teacher') {
                        Taro.showToast({
                            title: '已是讲师',
                            icon: 'none',
                            duration: 1000,
                        })
                    } else if (res.data.message === 'already apply') {
                        Taro.showToast({
                            title: '已经申请，请等待审核',
                            icon: 'none',
                            duration: 1000,
                        })
                    }
                }
            })
        } else {
            Taro.showToast({
                title: tip,
                icon: 'none',
                duration: 1000,
            })
        }

    }
    _downSubmit=()=>{
        var that =this
        api.post('/user/teacher/apply/cancel')
        .then(res=>{
            if(res.data.status){
                setTimeout(() => {
                    Taro.showToast({
                        title:'取消成功',
                        icon:'none',
                        duration:1500
                    })
                }, 1500);
                that.getUser();
                that.getApplystatus();
                this.setState({
                    status:0,
                    applyId:0
                })
            }
        })
    }
    // 下拉
    onPullDownRefresh() {
        var self = this

        self.getApplystatus()
        setTimeout(function () {
            //执行ajax请求后停止下拉
            Taro.stopPullDownRefresh();
        }, 1000);
    }

    render() {

        const { applyId, applyList,specialty, type, name, IdCard, serviceCenter, age, mobile, rangeIcon, sexList, sexIdx, ads, eduBack, eduBackIdx, lectType, lectTypeIdx, record, experie, picArray, barehead, checkLogList, checkReason, status, reason } = this.state

        const lectNotImg = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/5b9b8ec5-3594-49c1-8671-f6cce47a6b3c.png'

        let canvaswidth = 375
        var res = Taro.getSystemInfoSync()
        canvaswidth = res.windowWidth;

        const adressList = ['北京市', '天津市', '上海市', '重庆市', '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '海南省', '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省', '台湾省', '内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区']

        return (
            <View className='wrap'>
                {
                    type === 0 ?
                        <View className='wrapImg'>
                            <Image src={lectNotImg} className='wrapCover' />
                            <Text className='sm_label tip_label m_20'>线上申请讲师即将开启敬请期待</Text>
                        </View>
                        :
                        <View>
                            {
                                applyId > 0 ?
                                    <View className='lect_status'>
                                        <View className='lect_box'>
                                            {/* {
                                                checkLogList.map((apy: any, index) => {
                                                    // 0 未做  1  未通过  // 2  通过
                                                    let nextcolor = '#ECECEC'
                                                    let precolor = '#ECECEC'
                                                    let imgtxt = asset.lect_null

                                                    let on = index === 0
                                                    let ok = index === checkLogList.length - 1

                                                    console.log(apy)
                                                    if (apy.isCheck === 1) {
                                                        if (index > 0) {
                                                            if (checkLogList[index - 1].checkInfo.checkStatus === 1) {
                                                                precolor = '#7ED321'
                                                            }
                                                        }
                                                        if (apy.checkInfo.checkStatus === 2) {
                                                            imgtxt = asset.lect_fail
                                                        } else if (apy.checkInfo.checkStatus === 1) {
                                                            nextcolor = '#7ED321'
                                                            imgtxt = asset.lect_da
                                                        }
                                                    } else if (apy.isCheck === 0) {
                                                        if (index > 0) {
                                                            if (checkLogList[index - 1].checkInfo.checkStatus === 1) {
                                                                precolor = '#7ED321'
                                                            }
                                                        }
                                                    }


                                                    return (
                                                        <View className='lineBox col_1' key={'apy' + index}>
                                                            <View className='d_flex fd_r ai_ct'>
                                                                {
                                                                    on ?
                                                                        <View className='line' style={{ backgroundColor: '#fafafa' }}></View>
                                                                        :
                                                                        <View className='line' style={{ backgroundColor: precolor }}></View>
                                                                }
                                                                <Image src={imgtxt} className={apy.status === 2 ? 'lect_pdot' : 'lect_fdot'} />
                                                                {
                                                                    ok ?
                                                                        <View className='line' style={{ backgroundColor: '#fafafa' }}></View>
                                                                        :
                                                                        <View className='line' style={{ backgroundColor: nextcolor }}></View>
                                                                }
                                                            </View>
                                                            <View className='d_flex fd_r ai_ct jc_ct mt_10'>
                                                                <Text className='sm_label'>{apy.name}</Text>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            } */}
                                            {
                                                status == 1 ?
                                                    <View className='tipss'>
                                                        <Text style={{ color: '#7ED321' }} >审核通过</Text>
                                                    </View>
                                                    : null
                                            }
                                            {
                                                status == 0 ?
                                                    <View className='tipss'>
                                                        {
                                                            checkLogList.length>0&&checkLogList.filter((item:any)=>item.isCheck==1).length>1?
                                                            <Text style={{ color: '#BA634C' }}>审核中</Text>
                                                            :
                                                            <Text style={{ color: '#BA634C' }}>待审核</Text>
                                                        }
                                                        
                                                    </View>
                                                    : null
                                            }
                                            {
                                                status == 2 ?
                                                    <View className='tiss'>
                                                        <View className='tipss'>
                                                            <Text style={{ color: '#BA634C' }}>审核不通过</Text>
                                                        </View>
                                                        <View className='rtt'>
                                                            <Text style={{ color: 'red', fontSize: '24rpx' }}>原因：{reason}</Text>
                                                        </View>
                                                    </View>

                                                    : null
                                            }

                                        </View>
                                        {/* {
                                            checkReason.length > 0 ?
                                                <View className='tips'>
                                                    <Text style={{ color: '#BA634C' }} className='sm_label'>驳回原因：{checkReason}</Text>
                                                </View>
                                                : null} */}
                                    </View>
                                    : null}






                            {/* <View className='lect_status'>
                            <View className='lect_box'>
                                {
                                    applyList.map((apy,index)=>{
                                        // 0 未做  1  未通过  // 2  通过
                                        let nextcolor = '#ECECEC'
                                        let precolor = '#ECECEC'
                                        let imgtxt = asset.lect_null

                                        let on = index === 0
                                        let ok = index === applyList.length - 1

                                        if(index > 0){
                                            if(applyList[index - 1].status === 2 ){
                                                precolor = '#7ED321'
                                            }
                                        }
                                        
                                        if(apy.status === 1){
                                            imgtxt = asset.lect_fail
                                        } else if(apy.status === 2){
                                            nextcolor = '#7ED321'
                                            imgtxt = asset.lect_da
                                        }
                                        return(
                                            <View className='lineBox col_1' key={'apy' + index}>
                                                <View className='d_flex fd_r ai_ct'>
                                                    {
                                                        on ? 
                                                        <View className='line' style={{backgroundColor:'#fafafa'}}></View>
                                                        :
                                                        <View className='line' style={{backgroundColor:precolor}}></View>
                                                    }
                                                    <Image src={imgtxt} className={apy.status === 2 ? 'lect_pdot' : 'lect_fdot'} />
                                                    {
                                                        ok ? 
                                                        <View className='line' style={{backgroundColor:'#fafafa'}}></View>
                                                        :
                                                        <View className='line' style={{backgroundColor:nextcolor}}></View>
                                                    }
                                                </View>
                                                <View className='d_flex fd_r ai_ct jc_ct mt_10'>
                                                    <Text className='sm_label'>{apy.text}</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>

                            <View className='tips'>
                                <Text style={{color:'#BA634C'}} className='sm_label'>驳回原因：分公司审批未通过，请根据要求修改信息后再提交</Text>
                            </View>
                            
                        </View> */}

                            {/* <View className='lect_condit'>
                            <View className='lect_condit_item d_flex fd_r ai_ct'>
                                <Text className='sm_label c33_label'>客户总监以上级别</Text>
                                <Image src={asset.pass_icon} className='pass_icon ml_5' />
                            </View>
                            <View className='lect_condit_item d_flex fd_r ai_ct '>
                                <Text className='sm_label c33_label'>客户总监以上级别</Text>
                                <Image src={asset.pass_icon} className='pass_icon ml_5' />
                            </View>
                        </View> */}

                            <View className='form'>
                                <View className='form_item d_flex ai_ct jc_sb' >
                                    <Text className='be_333 fs_15 fw_label'>姓名</Text>
                                    <Input className='input default_label tip_label'
                                        placeholder='请填写姓名'
                                        type='text'
                                        value={name}
                                        onInput={(e) => this.setState({ name: e.detail.value })}
                                    />
                                </View>
                                <View className='form_item d_flex ai_ct jc_sb' >
                                    <Text className='be_333 fs_15 fw_label'>卡号</Text>
                                    <Input className='input default_label tip_label'
                                        type='number'
                                        value={IdCard}
                                        disabled
                                    />
                                </View>
                                <View className='form_item d_flex ai_ct jc_sb' >
                                    <Text className='be_333 fs_15 fw_label'>服务中心</Text>
                                    <Input className='input default_label tip_label'
                                        placeholder=''
                                        type='number'
                                        value={serviceCenter}
                                        onInput={(e) => this.setState({ serviceCenter: e.detail.value })}
                                    />
                                </View>
                                <View className='form_item d_flex ai_ct jc_sb' >
                                    <Text className='be_333 fs_15 fw_label'>年龄</Text>
                                    <Input className='input default_label tip_label'
                                        placeholder='请输入年龄'
                                        type='number'
                                        value={age}
                                        onInput={(e) => this.setState({ age: e.detail.value })}
                                    />
                                </View>
                                <View className='form_item d_flex ai_ct jc_sb'>
                                    <Text className='be_333 fs_15 fw_label se_label'>性别</Text>
                                    <Input className='input default_label tip_label'
                                        type='number'
                                        value={sexList[sexIdx]}
                                        disabled
                                    />
                                    {/* <View className='picker_wrap'>
                                        <Picker
                                            className='picker'
                                            mode='selector'
                                            range={sexList}
                                            onChange={(e) => { this.setState({ sexIdx: parseInt(e.detail.value) }) }}
                                        >
                                            <View className="d_flex row ai_ct col_1 jc_fe ">
                                                <Text className='default_label tip_label'>{sexList[sexIdx]}</Text>
                                                <Image className='arrow_icon' mode='aspectFit' src={rangeIcon} />
                                            </View>
                                        </Picker>
                                    </View> */}
                                </View>
                                {/* <View className='form_item d_flex ai_ct jc_sb' >
                                    <Text className='be_333 fs_15 fw_label'>省份</Text>
                                    <Picker mode='selector' range={adressList} onChange={(e) => { this.setState({ ads: adressList[parseInt(e.target.value)] }) }}>
                                        <View className="d_flex row ai_ct col_1 jc_fe ">
                                            <Input className='input default_label tip_label'
                                                type='text'
                                                value={ads}
                                                disabled={true}
                                            // onInput={(e) => this.setState({ ads: e.detail.value })}
                                            />
                                        </View>
                                    </Picker>
                                </View> */}
                                <View className='form_item d_flex ai_ct jc_sb'>
                                    <Text className='be_333 fs_15 fw_label se_label'>省份</Text>
                                    <View className='picker_wrap'>
                                        <Picker
                                            className='picker'
                                            mode='selector'
                                            range={this.state.comps}
                                            onChange={e => {
                                                this.setState({
                                                    ads:this.state.companylist[parseInt(e.detail.value)].companyName,
                                                    companyNo:this.state.companylist[parseInt(e.detail.value)].companyNo
                                                })
                                            }}
                                        >
                                            <View className="d_flex row ai_ct col_1 jc_fe ">
                                                <Text className='default_label tip_label '>{ads}</Text>
                                                <Image className='arrow_icon' mode='aspectFit' src={rangeIcon} />
                                            </View>
                                        </Picker>
                                    </View>
                                </View>
                                <View className='form_item d_flex ai_ct jc_sb' >
                                    <Text className='be_333 fs_15 fw_label'>联系电话</Text>
                                    <Input className='input default_label tip_label'
                                        placeholder='请填写联系电话'
                                        type='number'
                                        value={mobile}
                                        disabled
                                    />
                                </View>
                                <View className='form_item d_flex ai_ct jc_sb'>
                                    <Text className='be_333 fs_15 fw_label se_label'>学历</Text>
                                    <View className='picker_wrap'>
                                        <Picker
                                            className='picker'
                                            mode='selector'
                                            range={eduBack}
                                            onChange={e => {
                                                this.setState({
                                                    eduBackIdx: e.detail.value
                                                })
                                            }}
                                        >
                                            <View className="d_flex row ai_ct col_1 jc_fe ">
                                                <Text className='default_label tip_label '>{eduBack[eduBackIdx]}</Text>
                                                <Image className='arrow_icon' mode='aspectFit' src={rangeIcon} />
                                            </View>
                                        </Picker>
                                    </View>
                                </View>
                                <View className='form_item d_flex ai_ct jc_sb' >
                                    <Text className='be_333 fs_15 fw_label'>特长</Text>
                                    <Input className='input default_label tip_label'
                                        placeholder=''
                                        type='text'
                                        value={specialty}
                                        onInput={(e) => this.setState({ specialty: e.detail.value })}
                                    />
                                </View>
                                <View className='form_item d_flex ai_ct jc_sb'>
                                    <Text className='be_333 fs_15 fw_label se_label'>申报讲师类型</Text>
                                    <View className='picker_wrap'>
                                        <Picker
                                            className='picker'
                                            mode='selector'
                                            range={lectType}
                                            onChange={(e) => { this.setState({ lectTypeIdx: e.detail.value }) }}
                                        >
                                            <View className="d_flex row ai_ct col_1 jc_fe ">
                                                <Text className='default_label tip_label'>{lectType[lectTypeIdx]}</Text>
                                                <Image className='arrow_icon' mode='aspectFit' src={rangeIcon} />
                                            </View>
                                        </Picker>
                                    </View>
                                </View>
                                {/* <View className='form_item d_flex ai_ct jc_sb' >
                            <Text className='be_333 fs_15 fw_label'>主讲课程</Text>
                            <Input className='input default_label tip_label'
                                placeholder=''
                                type='text'
                                onInput={(e)=>this.setState({speaker:e.detail.value})}
                            />
                        </View> */}
                                <View className='form_item'>
                                    <Text className='be_333 fs_15 fw_label'>培训授课经历</Text>
                                    <Textarea
                                        className='fromInput default_label tip_label'
                                        placeholderStyle='fize-size:28rpx'
                                        placeholder='50字以内'
                                        style={{ width: (canvaswidth - 100) + 'px' }}
                                        value={experie}
                                        autoHeight
                                        onInput={(e) => this.setState({ experie: e.detail.value })}
                                    />
                                </View>
                                <View className='form_item'>
                                    <Text className='be_333 fs_15 fw_label'>个人履历及能力自述</Text>
                                    <Textarea className='fromInput default_label tip_label'
                                        placeholderStyle='fize-size:28rpx'
                                        placeholder='50字以内'
                                        style={{ width: (canvaswidth - 100) + 'px' }}
                                        value={record}
                                        autoHeight
                                        onInput={(e) => this.setState({ record: e.detail.value })}
                                    />
                                </View>
                                <View className='form_item'>
                                    <Text className='be_333 fs_15 fw_label se_label'>职业资格证书</Text>
                                    <View className='photo_wraps'>
                                        {
                                            picArray.map((fditem: any, index) => {
                                                return (
                                                    <View className='commt_img d_flex ai_ct jc_ct mr_15 mb_10' key={'index' + index} >
                                                        <View onClick={this.onViewImgs.bind(this, picArray, index)}>
                                                            <Image src={fditem} className='commt_img_cover' />
                                                        </View>
                                                        <View onClick={this._onDetele.bind(this, index)}>
                                                            <Image src={asset.i_dete} className="commt_tip" />
                                                        </View>
                                                    </View>
                                                )
                                            })
                                        }
                                        {
                                            picArray.length > 3 ?
                                                null
                                                :
                                                <View className='photo_wrap' onClick={this._onChangeImg.bind(this, 0)}>
                                                    <Image src={asset.uppic} className='photoImg' />
                                                    <Text className='smm_label tip_label'>添加图片</Text>
                                                </View>
                                        }

                                    </View>
                                </View>
                                <View className='form_item' >
                                    <Text className='be_333 fs_15 fw_label se_label'>蓝底照片上传</Text>
                                    <View className='photo_wraps'>
                                        {
                                            barehead.length > 0 ?
                                                <View className='commt_img d_flex ai_ct jc_ct mr_15 mb_10'  >
                                                    <View onClick={this.onViewImg.bind(this, barehead, 0)}>
                                                        <Image src={barehead} className='commt_img_cover' />
                                                    </View>
                                                    <View onClick={this._onbareDetele.bind(this,)}>
                                                        <Image src={asset.i_dete} className="commt_tip" />
                                                    </View>
                                                </View>
                                                :
                                                <View className='photo_wrap' onClick={this._onChooseImg.bind(this, 0)}>
                                                    <Image src={asset.uppic} className='photoImg' />
                                                    <Text className='smm_label tip_label'>添加图片</Text>
                                                </View>
                                        }

                                    </View>
                                </View>
                            </View>
                            {/* {
                                 applyId > 0&&status == 0 ?
                                    <View className='btn'>
                                        <View className='btn_text' hoverClass='on_tap' onClick={this._downSubmit}>
                                            <Text>取消申请</Text>
                                        </View>
                                    </View>
                                    : */}
                                    <View className='btn'>
                                        <View className='btn_text' hoverClass='on_tap' onClick={this._onSubmit}>
                                            <Text>{checkLogList.length>0&&checkLogList[0].isCheck==1?'修改提交':'提交'}</Text>
                                        </View>
                                    </View>
                            {/* } */}

                        </View>
                }

            </View>
        )
    }
}

export default lectSignUp as ComponentClass