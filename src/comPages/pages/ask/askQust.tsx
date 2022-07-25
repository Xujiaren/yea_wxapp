import { ComponentClass } from 'react'
import Taro, { Component ,Config} from '@tarojs/taro'
import { View, Text ,Image,Picker,Input,Textarea} from '@tarojs/components'

import Tabs from '../../../components/Tabs'

import asset from '../../../config/asset'
import menu from '../../../config/menu';
import inter from '../../../config/inter'
import api from '../../../services/api'

import  '../../../config/theme.css';
import './askQust.less'

const getInf = (str, key) => str.toString().replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%');


type  PageState = {
    tap:Array<string>,
    tap_idx:number,
    title:string,
    content:string,
    picArray:Array<string>,
    list:Array<{}>,
    category_id:number,
    integral:string,
    cate_arr:Array<string>,
    userIngral:number,
    listDataCopy:Array<any>,
    askId:number,
    whiteTip:number,
    tip:boolean,
}

class askQust extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config:Config = {
        navigationBarTitleText: '提问',
        enablePullDownRefresh: true
    }

    constructor () {
        super(...arguments)
        this.state = {
            tap:[],
            tap_idx:0,
            category_id:0,
            title:'',
            content:'',
            picArray:[],
            list:[],
            integral:'0',
            cate_arr:[],
            userIngral:0,
            listDataCopy: [],
            askId:0,
            whiteTip:0,
            tip:true,
        }
    }


    componentWillReceiveProps (nextProps) {
    }


    componentWillMount () {

        var that = this ;
        const {title,content,askId,categoryId,gallery,whitetip,integral} = that.$router.params;
        if(parseInt(whitetip) == 1){
            that.setState({
                whiteTip:parseInt(whitetip)
            })
        }
        let arr_gallery = [];

        if(gallery !== undefined){
            arr_gallery = JSON.parse(gallery);
        } 
        

        that.setState({
            picArray: arr_gallery,
            title : title === undefined ? '' : title,
            content : content === undefined ? '' : content,
            askId : askId === undefined ? 0 : parseInt(askId),
            category_id : categoryId === undefined ? 0 : parseInt(categoryId),
            integral:integral?integral:'0'
        })


        
    }
    componentDidMount () { 
        let that = this;
        that._getCate();
        that._getUser();
    }
    componentWillUnmount () { }
    componentDidShow () { }
    componentDidHide () { }

    _onClose(){
        var that = this
        Taro.setStorageSync('whiteTipss',1)
        that.setState({
            tip:false
        })

    }

    //  关闭提示
    _onDelete(){
        var that = this
        Taro.setStorageSync('whiteTipss',0)
        that.setState({
            tip:false
        })

    }
    // 分类
    _getCate(){
        var that = this;
        const {} = that.state;

        api.get(inter.configAsk)
        .then((res)=>{
            if(res.data.status){
                
                let cate = res.data.data;
                let cateList:any = [];

                if(cate.length > 0){
                    for(let i = 0 ; i < cate.length ; i++){
                        cateList.push(cate[i].categoryName)
                    }

                    that.setState({
                        category_id:cate[0].categoryId
                    })
                }

                that.setState({
                    tap:cateList,
                    cate_arr:cate,
                })
            }
        })
    }

    // 相似提问
    _askSimilar(){
        let that = this ;
        const {title} = that.state;

        if(title !== ''){

            api.get(inter.askSimilar,{
                keyword:title
            }).then((res)=>{
                if(res.data.status){
                    let arr = res.data.data ;

                    that.setState({
                        list:arr,
                        listDataCopy:arr
                    },()=>{
                        that.searchTap();
                    })
                }
            })

        }
        
    }

    // 模糊搜索
    searchTap(){
        let that = this ;
        const {title,list,} = that.state;

        var newData = that.state.listDataCopy;

        for (var i = 0; i < list.length; i++) {
            var dic = list[i];
            var newDic = newData[i];
            var fund_name = dic["title"];
            newDic.title = getInf(fund_name, title);     
            
            if(fund_name === title){
                Taro.showModal({
                    title: '提示',
                    content: '请查看相同类型的问题或重新修改问题',
                    success: function (res) {
                      if (res.confirm) {
                       that.setState({
                           title:''
                       })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
            }
        }

        that.setState({
            listDataCopy: newData,
        })

    }

    // 去除首尾的空格
    trim =  (s) => {
        return s.replace(/(^\s*)|(\s*$)/g, "");
    }


    // 获取个人信息判断是否登录
    _getUser(){
        var that = this
        api.get(inter.User)
        .then((res)=>{
            if(res.data.status){
                let userData = res.data.data

                that.setState({
                    userIngral:userData.integral+userData.rintegral,
                })
            }
        })
    }

    //  标题 相似
    _title = (e) => {
        let that = this;
        let val = e.detail.value ;



        that.setState({
            title:that.trim(val)
        },()=>{
            that._askSimilar();
        })
    }

    //选择分类
    _onCateChange = (e) => {

        var that = this ;
        const {cate_arr} = that.state;

        that.setState({
            tap_idx:e.detail.value,
            category_id:cate_arr[e.detail.value].categoryId,
        })
    }


    // 查看图片
    onViewImgs = (picArray,index) => {

        let urls:string[] = new Array() ;
        for(let i = 0 ; i < picArray.length; i++){
            urls.push(picArray[i])
        }
        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: urls[index], // 当前显示图片的http链接，默认是第一个
        }).then(res=>{})

    }


    // 删除 上传的图片
    _onDetele = (index) => {

        var that = this
        let {picArray} = that.state
        picArray.splice(index,1)

        that.setState({
            picArray,
        })
    }

     //选择照片或者拍照
    _onChangeImg = () => {
        var that = this;
        const {picArray} = that.state

        Taro.chooseImage({
            count:4,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success:function(res){
                
                for(let i = 0 ; i < res.tempFilePaths.length ; i++){
                    Taro.getFileSystemManager().readFile({
                        filePath: res.tempFilePaths[i], // 选择图片返回的相对路径
                        encoding: 'base64', // 编码格式
                        success: res => { // 成功的回调
                            api.post(inter.UploadSite,{
                                file:'data:image/png;base64,' + res.data,
                            }).then(res=>{
                                if(res.data.status){
                                    picArray.push(res.data.data)
                                    that.setState({
                                        picArray:picArray
                                    })
                                }
                            })
                        },
                        fail: msg => {
                        }
                    })
                }
                
            },
            fail:function(errmsg){

            }
        })
    }

    
    // 发布
    _onPub = () => {
        var that = this;
        const {title,content,picArray,integral,tap_idx,cate_arr,askId,category_id} = that.state;

        let isPush:boolean = true;
        let tip:string = '' ;

        if(title == ''){
            isPush = false
            tip = '请输入完整问题'
        } else if(content == ''){
            isPush = false
            tip = '请补充问题背景'
        }


        if(isPush){

            api.post(inter.askPublish,{
                title:title,
                content:content,
                pics:picArray.join(','),
                category_id:category_id,
                integral:parseInt(integral),
                ask_id:askId,
            }).then((res)=>{
                if(res.data.status){
                    Taro.showToast({
                        title:'提交成功，请耐心等待审核',
                        icon:'none',
                        duration:1000,
                    })

                    setTimeout(()=>{
                        Taro.navigateBack();
                    },1000)
                }else{
                    if(res.data.message == 'WORD_ERROR'){
                        Taro.showModal({
                            title: '评论提示',
                            content: '尊敬的用户，\n 系统检测您触发违禁词，\n 请注意言辞、文明上网',
                            showCancel:false
                        }).then(res => console.log(res.confirm, res.cancel))
                    } else if(res.data.message == 'ACCOUNT_DENY') {
                        Taro.showModal({
                            title: '评论提示',
                            content: '尊敬的用户， \n 系统检测您触发违禁词的 \n 次数已超限，即将关闭您的评论权限，\n 15天后恢复，祝您学习愉快！',
                            showCancel:false
                        }).then(res => console.log(res.confirm, res.cancel))
                    }
                }
            })

        } else {

            Taro.showToast({
                title:tip,
                icon:'none',
                duration:1000,
            })

        }
        

    }

    
    render () {

        const {whiteTip,tip,tap,tap_idx,content,title,picArray,integral,userIngral,listDataCopy} = this.state;

        let on =  parseInt(integral) > userIngral ;

        return (
            <View  className='wrap'>
                <View className='from'>
                    <View className='d_flex p_15 pl_20 pr_20 bg_white fd_r jc_sb ai_ct  border_bt mt_10'>
                        <Text className='c33_label lg_label fw_label'>选择标签</Text>
                        <View className='d_flex fd_r  ai_ct'>
                            <Picker mode='selector' value={tap_idx} range={tap} onChange={this._onCateChange}>
                                <Text className='default_label tip_label mr_12'>{tap[tap_idx]}</Text>
                            </Picker>
                            <Image src={asset.arrow_right}  className='icon_right' />
                        </View>
                    </View>

                    <View className='d_flex fd_c pl_20 pr_20 pt_15  mt_10 bg_white '>
                        <View className='title_bt pb_10'>
                            <Input className='textinput col_1' 
                                placeholder={'请输入一个完整的问题'}
                                onInput={this._title} 
                                value={title}
                            />
                        </View>
                        <View>
                            <Textarea 
                                placeholder='补充问题背景，条件等详细信息' 
                                className='from_atext pt_15 pb_15 pr_15 default_label' 
                                value={content}
                                maxlength={-1}
                                onInput={(e:any) : void =>this.setState({content:e.detail.value})}
                            />
                        </View>

                        <View className='from_item fd_r  pb_15 '>
                            <View className='from_img'>
                                {
                                    picArray.map((fditem:any,index)=>{
                                        return(
                                            <View  className='commt_img d_flex ai_ct jc_ct mr_15 mb_10'  key={'index'+index} >
                                                <View onClick={this.onViewImgs.bind(this,picArray,index)}>
                                                    <Image src={fditem} className='commt_img_cover' />
                                                </View>
                                                <View onClick={this._onDetele.bind(this,index)}>
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
                                    <View  className='commt_imgs d_flex ai_ct jc_ct,mb_10' 
                                        onClick={this._onChangeImg}
                                    >
                                        <Image src={asset.add} className='commt_img_covers' />
                                    </View>
                                }
                            </View>
                        </View>

                    </View>

                
                    <View className='d_flex p_15 pl_20 pr_20 bg_white fd_r ai_ct jc_sb mt_10'>
                        <View className='d_flex fd_r ai_ct'>
                            <Text className='c33_label lg_label fw_label mr_5'>悬赏 </Text>
                            <Text className={!on ? 'gray_label sm_label' : 'sred_label sm_label'}>{ !on ? `（可用学分${userIngral})` : '  学分不足' }</Text>
                        </View>
                        <View className='d_flex  fd_r ai_ct text_r'>
                            <Input className='inte_input mr_5' 
                                placeholder={'0'}
                                onInput={(e):void =>this.setState({integral:e.detail.value})} 
                                value={integral}
                            />
                            <Text className='gray_label default_label ' style={{lineHeight:50+'rpx'}}>学分</Text>
                        </View>
                        
                    </View>
                </View>
                
                <View className='d_flex fd_c list pl_20 pr_20 mt_10'>
                    
                    {
                        listDataCopy.length > 0 ?
                        <Text className='c33_label fw_label default_label'>相似问题</Text>
                    :null}
                    
                    {
                        listDataCopy&&listDataCopy.map((item:any,index)=>{

                            return(
                                <View className='d_flex fd_c pt_10 pb_10 list_bt' key={'item' + index} 
                                    onClick={()=>Taro.navigateTo({url:menu.question + '?askId=' + item.askId + '&title=' + item.title.join('')})}
                                >
                                    {
                                        Array.isArray(item.title) ?
                                        <View>
                                            {
                                                item.title.map((val,idx)=>{

                                                    let ok = val === title ;
        
                                                    return(
                                                        <Text className={ok ? 'default_label sred_label fw_label' : 'default_label c33_label fw_label' } style={{fontWeight:600}} key={'val' + idx}>{val}</Text>
                                                    )
                                                })
                                            } 
                                        </View>
                                    :null}
                                    
                                    <Text className='sm_label tip_label mt_5'>{item.replyNum}个回答 · {item.followNum}个关注</Text>
                                </View>
                            )
                        })
                    }

                </View>
                
                {
                    !on ?
                    <View className='btn' onClick={this._onPub}>
                        <Text className='lg_label white_label fw_label'>发布问题</Text>
                    </View>
                    :
                    <View className='btn btn_opc'>
                        <Text className='lg_label white_label fw_label'>发布问题</Text>
                    </View>
                }
                <View>
                    {
                        whiteTip == 0 ?
                        <View>
                            {
                                tip ?
                                <View className='layer'>
                                    <View className='commt_layer pt_12  '>
                                        <View className='d_flex fd_c mb_15 pl_20 pr_20'>
                                            <View className='d_flex ai_ct jc_ct'>
                                                <Text className='lg18_label pt_10 black_label'>留言规则</Text>
                                            </View>
                                            <Text className='default_label pt_15 c33_label red_label'>用户留言不得发布以下内容：</Text>
                                            <Text className='default_label pt_5 c33_label'>1、捏造、散播和宣传危害国家统一、公共安全、社会秩序等言论；</Text>
                                            <Text className='default_label pt_5 c33_label'>2、恶意辱骂、中伤、诽谤他人及企业；</Text>
                                            <Text className='default_label pt_5 c33_label'>3、涉及色情、污秽、低俗的的信息及言论；</Text>
                                            <Text className='default_label pt_5 c33_label'>4、广告信息；</Text>
                                            <Text className='default_label pt_5 c33_label'>5、《直销管理条例》、《禁止传销条例》、《反不正当竞争法》等法律法规禁止的内容；</Text>
                                            <Text className='default_label pt_5 c33_label'>6、政治性话题及言论；</Text>
                                            <Text className='default_label pt_5 c33_label'>7、对任何企业、组织现行规章制度的评论和讨论，及传播任何未经官方核实的信息； 如违反以上规定，平台有权实施账户冻结、注销等处理，情节严重的，将保留进一步法律追责的权利。</Text>
                                        </View>
                                        <View className='layer_btns pl_20 pr_20 d_flex jc_sb ai_ct mt_30' >
                                            <View className='layer_btn d_flex jc_ct ai_ct' onClick={this._onClose.bind(this)}>
                                                <Text className='lg_label c33_label'>不再提示</Text>
                                            </View>
                                            <View className='layer_btn d_flex d_flex jc_ct ai_ct' onClick={this._onDelete.bind(this)}>
                                                <Text className='lg_label c33_label'>关闭</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                
                            :null}
                        </View> 
                    :null}
                </View>
            </View>
        )
    }
}

export default askQust as ComponentClass