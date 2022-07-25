import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View ,Text,Image,Input,ScrollView} from '@tarojs/components'

import menu from '../../../../config/menu';


import inter from '../../../../config/inter'
import api from '../../../../services/api'
import asset from '../../../../config/asset'

import {chatTime} from '../../../../utils/common';
import { emojis, emojiToPath, textToEmoji} from '../../../../utils/emoji';

import  '../../../../config/theme.css';
import './msgAdmin.less'

import { chatroom } from '../../../../config'

type PageState = {
    keyword:string,
    typeEmjio:boolean,
    inputBottom:number,
    emojiList:Array<{}>,
    userId:number,
    userAvatar:string,
    userName:string,
    chatList:Array<{
        chat_id: number,
        content: string,
        from_id: number,
        from_name: string,
        is_admin: number,
        mtype: number,
        to_id: number,
        to_name: string,
        type: number,
        avatar:string,
        time:string 
    }>,
    chatId1:any,
    page:number,
    pages:number,
    total:number,
    chatId:number,
}

class msgAdmin extends Component<{}, PageState> {
    // eslint-disable-next-line react/sort-comp
    config = {
        navigationBarTitleText: '管理员消息',
        enablePullDownRefresh: true
    }
    timer: any;
    socketTask: any;
    pingObj: NodeJS.Timeout;
    recontnum: any;
    page: any;

    

    constructor () {
        super(...arguments)

        this.recontnum = 0;

        this.state = {
            keyword:'',
            typeEmjio:false,
            inputBottom:0,
            emojiList:[],
            userId:0,
            userAvatar:'',
            userName:'',
            chatList:[],
            chatId1:'',
            page:0,
            pages:0,
            total:0,
            chatId:0,
        }

        this._onFocus = this._onFocus.bind(this);
        this._onBlur   = this._onBlur.bind(this);
    }

    componentWillMount () {
        var that = this
        const {chatId} = that.$router.params

        that.setState({
            chatId:parseInt(chatId)
        })
    }

    componentDidMount () { 
        var that = this
        // 获取表情包
        const emojiList = Object.keys(emojis).map(key => ({
            key: key,
            img: emojiToPath(key)
        }))

        that._chats()
        that.getUser()
        that.setState({
            emojiList:emojiList,
        })
       
    }

    componentWillUnmount () {
        Taro.closeSocket();
        if (this.socketTask) {
            this.socketTask.close({});
        }
    }
    
    componentDidShow () { }
    componentDidHide () { }

    // 获取个人信息
    getUser(){
        var that = this
        api.get(inter.User)
            .then((res)=>{
                if(res.data.status){
                    let userData = res.data.data
                   
                    that.setState({
                        userId:userData.userId,
                        userAvatar:userData.avatar,
                        userName:userData.nickname,
                    },()=>{
                        that._onChat();
                    })
                }
            })
    }

    // 历史记录
    _chats(){
        var that = this 
        const {page,chatId} = that.state
        api.get(inter.MessageChat+ chatId,{
            page:page
        }).then((res)=>{
            that.setState({
                chatList:(res.data.data.items).reverse(),
                page:res.data.data.page,
                pages:res.data.data.pages,
                total:res.data.data.total,
            })
        })
    }

    _onChat(){
        var that = this;
        const {userId,userName,userAvatar} = that.state

        // let chatroom = 'ws://perfect.whalew.com/admin/ws/chat/1?'
        const token = Taro.getStorageSync('token')

        if (this.socketTask == null || this.socketTask.readyState != 1) {
            Taro.connectSocket({
                url: chatroom +  'paramStr=' + token +  '&paramId=' + userId
            }).then(task => {
                that.socketTask = task;
                that.handleCallback();
            })
        }
    }

    handleCallback() {
        var that = this;
        const { socketTask } = that
        const {userId,chatList} = that.state;

        const timestape =  Date.parse(new Date());

        socketTask.onOpen(() => {
            console.log('onOpen');

            this.pingObj = setInterval(()=> {
                // console.info('ping')

                let data = {
                    mtype: 'ping',
                    content: ''
                }

                Taro.sendSocketMessage({
                    data:JSON.stringify(data),
                })
            }, 10 * 1000)
        })

        socketTask.onMessage(async ({ data }) => {
            let chatLists = JSON.parse(data)

            chatList.push(chatLists)

            that.setState({
                chatList:chatList,
                chatId1:'chat1' + (chatList.length - 1)
            })
        })

        socketTask.onError(() => {
            console.log('Error!')
            if (this.pingObj) clearInterval(this.pingObj)

            this.setState({

            },()=>{
                this.recontnum++;
                if(this.recontnum < 6){
                    setTimeout(()=>{
                        this._onChat();
                    },3000)
                } else {
                    Taro.showModal({
                        title: '直播提示',
                        content: '您当前网络不稳定， 请退出后检查您的网络。',
                        showCancel:false,
                        success: function (res) {
                            if (res.confirm) {
                                Taro.switchTab({
                                    url:menu.index
                                })
                            }
                        }
                    })
                }
            })
        })

        socketTask.onClose((ev) => {
            console.info(ev)
            if (this.pingObj) clearInterval(this.pingObj)

            if (ev.code == 1006) {

                this.setState({
                },()=>{
                    this.recontnum++;

                    if(this.recontnum < 6){
                        setTimeout(()=>{
                            this._onChat();
                        },3000)
                    } else {
                        Taro.showModal({
                            title: '直播提示',
                            content: '您当前网络不稳定， \n 请退出后检查您的网络。',
                            showCancel:false,
                            success: function (res) {
                                if (res.confirm) {
                                    Taro.switchTab({
                                        url:menu.index
                                    })
                                }
                            }
                        })
                    }
                    
                })
            }
        })

    }


    // 发送消息
    _onSend(type){
        var that = this
        const {userId,userName,keyword,userAvatar,chatId} = that.state

        var nowTime = (new Date()).getTime();


        if(type === 0){
            Taro.chooseImage({
                count:1,
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
                success:function(res){
                    Taro.getFileSystemManager().readFile({
                        filePath: res.tempFilePaths[0], // 选择图片返回的相对路径
                        encoding: 'base64', // 编码格式
                        success: res => { // 成功的回调
                            api.post(inter.UploadSite,{
                                file:'data:image/png;base64,' + res.data,
                            }).then(res=>{
                                let data = {
                                    to_id:42,
                                    chat_id:chatId,
                                    to_name:'w',
                                    from_id:userId,
                                    from_name:userName,
                                    mtype:0,
                                    is_admin:0,
                                    type:1,
                                    content:res.data.data,
                                    pubTime:(nowTime/1000).toFixed(0),
                                    avatar:userAvatar
                                }
                                Taro.sendSocketMessage({
                                    data:JSON.stringify(data),
                                })
                            })                        
                        },
                        fail: msg => {
    
                        }
                    })
                },
                fail:function(errmsg){
    
                }
            })
        } else {

            let data = {
                to_id:42,
                chat_id:chatId,
                to_name:'w',
                from_id:userId,
                from_name:userName,
                mtype:1,
                is_admin:0,
                type:1,
                content:keyword,
                pubTime:(nowTime/1000).toFixed(0),
                avatar:userAvatar
            }
            Taro.sendSocketMessage({
                data:JSON.stringify(data),
            })

            that.setState({
                keyword:'',
                typeEmjio:false
            })

        }
    }


    // 显示和隐藏表情
    _typeEmjio(){
        var that = this;
        const {typeEmjio} = that.state;

        if(typeEmjio){
            that.setState({
                // inputBottom:0,
                typeEmjio:!typeEmjio
            })
        } else {
            that.setState({
                // inputBottom:152,
                typeEmjio:true
            })
        }
        

    }



    // 选择表情
    _clickEmoji(item,index){
        var that = this;
        const {keyword} = that.state;
        that.setState({
            keyword:keyword+item.key
        })
    }


    /**
     * input 的 事件
     */
    
    _onBlur(e){
        var that = this;
        that.setState({
            inputBottom:0
        })
    }

    _onFocus(e){
        var that = this;
        that.setState({
            typeEmjio:false
        })
        setTimeout(function () {
            //执行ajax请求后停止下拉
            that.setState({
                inputBottom:e.detail.height
            })
        }, 100);
    }


    // onPullDownRefresh(){
    //     var self = this
        
    //     var  {page,pages,chatList,chatId} = this.state
        
        
        
    //     if(page < pages){
            
    //         page = page + 1
    //         api.get(inter.MessageChat+ chatId,{
    //             page:page
    //         }).then((res)=>{
    //             let chats = res.data.data
    //             let rchats = (chats.items).reverse().concat(chatList)
    //             self.setState({
    //                 chatList:rchats,
    //                 page:res.data.data.page,
    //                 pages:res.data.data.pages,
    //                 total:res.data.data.total,
    //             })
    //         })
            
    //         self.setState({
    //             page:page,

    //         })

    //         setTimeout(function () {
    //             //执行ajax请求后停止下拉
    //             Taro.stopPullDownRefresh();
    //         }, 1000);

    //     } else {
           
    //     }

        
    // }

    _overImgs(chatList ,index){

        let urls:string[] = new Array() ;
        for(let i = 0 ; i < chatList.length; i++){
            if(chatList[i].mtype === 0){
                urls.push(chatList[i].content)
            }
        }


        Taro.previewImage({
            urls: urls, //需要预览的图片http链接列表，注意是数组
            current: chatList[index].content, // 当前显示图片的http链接，默认是第一个
        }).then(res=>{
            // console.log(res)
        })
        
    }

    _pullChat(){
        var self = this
        
        var  {page,pages,chatList,chatId} = this.state
        
        
        
        if(page < pages){
            
            page = page + 1
            api.get(inter.MessageChat+ chatId,{
                page:page
            }).then((res)=>{
                let chats = res.data.data
                let rchats = (chats.items).reverse().concat(chatList)
                self.setState({
                    chatList:rchats,
                    page:res.data.data.page,
                    pages:res.data.data.pages,
                    total:res.data.data.total,
                })
            })
            
            self.setState({
                page:page,

            })

            setTimeout(function () {
                //执行ajax请求后停止下拉
                Taro.stopPullDownRefresh();
            }, 1000);

        } else {
           
        }
    }

    

    render () {

        const {keyword,typeEmjio,emojiList,inputBottom,chatList,chatId1,userAvatar} = this.state

        //视频的品读款度
        let windowWidth = 375
        let windowHeight = 667
        try {
            var res = Taro.getSystemInfoSync();
            windowWidth = res.windowWidth;
            windowHeight = res.windowHeight;
        }  catch (e) {
            
        }

        let chatMsgWidth = Math.floor(windowWidth*0.65 - 24) * 2;

        return (
            <View className='wrapper'>
                <View>
                        <ScrollView 
                            scrollY  
                            className= {' d_flex col_1 scroll_box' } 
                            scrollIntoView={chatId1}
                            scrollWithAnimation={true}
                            // style={{height:(windowHeight - 80) * 2 + 'rpx'}}
                            upperThreshold={0}
                            onScrollToUpper={this._pullChat}
                        >
                        {
                            chatList.map((chat:any,index)=>{

                                let chatMsgList:any [] = textToEmoji(chat.content) 

                                let timeShow:boolean = true ;

                                if(index !== 0 ){

                                    let preTime = chatList[index-1].pubTime ;
                                    let nextTime = chatList[index].pubTime ;


                                    if(nextTime - preTime < 600){
                                        timeShow =  false
                                    } 
                                }

                                return(
                                    <View key={'item' + index} className='chatBox mb_20' id={'chat1' + index }> 
                                    
                                        {
                                            timeShow ?
                                            <View className='d_flex fd_r jc_ct pt_10 pb_10'>
                                                <Text className='sm_label gray_label'>{chatTime(chat.pubTime)}</Text>
                                            </View>
                                        :null}

                                        {
                                            chat.is_admin === 1 ? 
                                            <View className='d_flex fd_r  ai_ct ml_15 chatLeft' >
                                                <Image src={asset.adminIcon} className='adminIcon' />
                                                <View className="d_flex fd_r ai_ct mt_5 ml_10">
                                                    <View className='dot_box'>
                                                        <View className='dot'></View>
                                                    </View>
                                                    <View className='bg_white chatdesc_txt mt_5' style={{maxWidth:chatMsgWidth + 'rpx'}}>
                                                        {
                                                            chat.mtype === 1 ?
                                                            <View>
                                                                {
                                                                    chatMsgList.map((emjio:any,index)=>{
                                                                        return(
                                                                            <View key={'emjio'+ index} className='chatmsg_txt'>
                                                                                {
                                                                                    emjio.msgType === 'text' ?
                                                                                    <Text className='default_label c33_label'>{emjio.msgCont}</Text>  
                                                                                :
                                                                                    <Image src={emjio.msgImage}  
                                                                                        style={{width:40+'rpx',height:40+'rpx'}}
                                                                                    />
                                                                                }
                                                                            </View>
                                                                        )
                                                                    })
                                                                }
                                                            </View>
                                                            :
                                                            <View>
                                                                <Image src={chat.content}  
                                                                    onClick={this._overImgs.bind(this,chatList,index)}
                                                                mode="aspectFit" className='chatImg' />
                                                            </View>
                                                        }
                                                        
                                                        
                                                    </View>
                                                </View>
                                            </View>
                                            :
                                            <View className='d_flex fd_r ai_ct mr_5 chatRight'>
                                                
                                                <View className=' d_flex fd_r ai_ct ml_15'>
                                                    <View className='chatmsg mt_5' style={{maxWidth:chatMsgWidth + 'rpx'}}>
                                                        {
                                                            chat.mtype === 1 ?
                                                            <View>
                                                                {
                                                                    chatMsgList.map((emjio:any,index)=>{
                                                                        return(
                                                                            <View key={'emjio'+ index} className='chatmsg_txt'>
                                                                                {
                                                                                    emjio.msgType === 'text' ?
                                                                                    <Text className='default_label white_label'>{emjio.msgCont}</Text>  
                                                                                :
                                                                                    <Image src={emjio.msgImage}    
                                                                                        style={{width:40+'rpx',height:40+'rpx'}}
                                                                                    />
                                                                                }
                                                                            </View>
                                                                        )
                                                                    })
                                                                }
                                                            </View>
                                                            :
                                                            <Image src={chat.content} 
                                                            onClick={this._overImgs.bind(this,chatList,index)}   
                                                            mode="aspectFit" className='chatImg' />
                                                        }
                                                    </View>
                                                    <View className='dot'></View>
                                                </View>
                                                <Image src={userAvatar} className='adminIcon' />
                                            </View>
                                        }
                                    
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </View>
                
                <View className='comt_box' style={{bottom:inputBottom+'px'}}>
                    <View className='comments d_flex fd_r ai_ct' >
                        <Image src={asset.emjio_icon} className='uppic ' onClick={this._typeEmjio}/>
                        <Image src={asset.uppic}  className='uppic ml_10' onClick={this._onSend.bind(this,0)}/>
                            <View className='d_flex fd_r ai_ct col_1'>
                                <Input
                                    className='input ml_15 mr_10 default_label'
                                    placeholder='写留言，发表看法'
                                    value={keyword}
                                    adjustPosition={false}
                                    onFocus={this._onFocus}
                                    onBlur={this._onBlur}
                                    onConfirm={this._onSend.bind(this,1)}
                                    onInput={(e)=>this.setState({keyword:e.detail.value})}
                                />
                                <View onClick={this._onSend.bind(this,1)}>
                                    <Text className='default_label gray_label'>发送</Text>
                                </View>
                            </View>
                    </View>

        
                    {
                        typeEmjio ?
                        <View className='bg_fa d_flex fd_r jc_ct'>
                            <View className=' emojiBox'>
                                {
                                    emojiList.map((item:any,index)=>{
                                        return(
                                            <View className='emoji_wrap' key={'item'+index}>
                                                <Image src={item.img} className='emojiBox_cover'   onClick={this._clickEmoji.bind(this,item,index)} />
                                            </View>
                                            
                                        )
                                    })
                                }
                            </View>
                        </View>
                        
                    :null}
                </View>
            </View>
        )
    }
}

export default msgAdmin as ComponentClass