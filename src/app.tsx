import '@tarojs/async-await'
import Taro, { Component, Config, Events } from '@tarojs/taro'
import { Provider} from '@tarojs/redux'
// import 'taro-ui/dist/style/index.scss'
import Index from './pages/index'

// import users from './utils/user'//注意改路径
import configStore from './store'

import {Ets} from './constants/event';
import api from './services/api'
import './app.less'
import JMessage from './utils/jmessage-wxapplet-sdk-1.4.3.min.js'
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
// var JMessage = require('./utils/jmessage-wxapplet-sdk-1.4.3.min.js'); 
const store = configStore()

type PageState = {
  type:number
}

class App extends Component<{}, PageState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/index/search',
      'pages/index/courseDesc',
      'pages/index/allComment',
      'pages/index/adWebView',
      
      'pages/index/grapWbdesc',
      'pages/index/consultDesc',
      'pages/index/liveDesc',
      'pages/index/audioDesc',
      'pages/index/audioList',


      'pages/find/find',


      'pages/course/courseCate',

      'pages/study/study',


      'pages/user/user',
      'pages/user/luckyDraw',
      'pages/user/actRule',
      'pages/user/filpCards',
    ],
    subPackages:[{
      "root":"subPages",
      "pages":[
          'pages/index/message/message',
          'pages/index/message/msgList',
          'pages/index/message/remindList',
          'pages/index/message/msgDesc',
          'pages/index/message/msgAdmin',
          'pages/index/message/msgCourse',
          
          
          'pages/index/courseLink',
          'pages/index/writeCommt',
          'pages/index/linkview',
          'pages/index/lecturer',
          'pages/index/teachZone',
          'pages/index/leaderShip',
          'pages/index/consultList',
          'pages/index/indexGraphic',
          'pages/index/liveBack',
          'pages/index/indexCourse',
          'pages/index/buyCourse',



          'pages/study/studyRecord',
          'pages/study/studyData',
          'pages/study/studyMap',
          'pages/study/rank',
          'pages/study/studyAnswer',
          'pages/study/WinRules',
          'pages/study/provinData',
          'pages/study/WinRecord',
          

          'pages/find/projectDesc',
          'pages/find/artDesc',
          'pages/find/activityDesc',
          'pages/find/activitySignup',
          'pages/find/voteDesc',
          'pages/find/actProduction',
          'pages/find/questSurvey',
          'pages/find/pictures',


          'pages/user/setting',
          'pages/user/myReward',
          'pages/user/myCollect',
          'pages/user/shareInvite',
          'pages/user/realAuth',
          
          
          'pages/user/equityState',
          'pages/user/myGold',

          'pages/user/modules',

          'pages/user/ownCourse',
          'pages/user/myCertificate',
          'pages/user/certificatedesc',
          

          //lecturer
          'pages/user/lecturer/promotion',
          'pages/user/lecturer/lectCourse',
          'pages/user/lecturer/lectReturn',
          'pages/user/lecturer/pushClass',
          'pages/user/lecturer/lectSignUp',
          
          // qualification
          'pages/user/qualification/profesSkill',
          'pages/user/qualification/practiceRoom',
          'pages/user/qualification/videoLearn',
          'pages/user/qualification/learnDesc',
          'pages/user/qualification/offlineSign',
          'pages/user/qualification/hasCourse',
          'pages/user/qualification/certificateSignUp',
          'pages/user/qualification/myTranDetail',
          'pages/user/qualification/myTrainClassDetail',
          'pages/user/qualification/myTrainClassSignUp',
          'pages/user/qualification/paperAnalysis',
          'pages/user/qualification/topicSort',
          'pages/user/qualification/cateExam',
          'pages/user/qualification/exerciseResult',
          'pages/user/qualification/practiceResult',
          'pages/user/qualification/doingTopic',
          'pages/user/qualification/doingExam',
          'pages/user/qualification/downActivity',
          'pages/user/atlas',

          //setting
          'pages/user/setting/aboutUs',
          'pages/user/setting/aboutUsInfo',
          'pages/user/setting/zhenZhao',
          'pages/user/setting/settingUser',
          // userinfo
          'pages/user/userInfo/nickName',
          'pages/user/userInfo/userInfo',
          'pages/user/userInfo/signIn',
          'pages/user/userInfo/myIDCard',
          'pages/user/userInfo/userCoupon',


          // feedback
          'pages/user/feedback/fdBack',
          'pages/user/feedback/fdBackDesc',
          'pages/user/feedback/feedBack',
        
      ]
    },{
      "root":"mailPages",
      "pages":[
        'pages/index',
        'pages/mail/mail',
        'pages/mail/mailDesc',
        'pages/mail/flash',
        'pages/mail/search',
        'pages/mail/mailList',
        'pages/mail/payOrder',
        'pages/mail/generalList',
        'pages/cate/cate',
        "pages/cart/cart",
        "pages/cart/settlement",
        'pages/order/order',
        'pages/order/orderDesc',
        'pages/order/address',
        'pages/order/doneAdress',
        'pages/order/orderPay',
        'pages/order/ems',
        'pages/seminar/home',
        'pages/seminar/moodPage/releaseMood',
        'pages/seminar/moodPage/myMood',
        'pages/seminar/momentPage/momentPage',
        'pages/seminar/momentPage/momentVideo',
        'pages/seminar/momentPage/photo',
        'pages/seminar/momentPage/photoDec',
        'pages/seminar/momentPage/videoDetils',
        'pages/seminar/momentPage/cover',
        'pages/seminar/course/course',
        'pages/seminar/course/myCourse',
        'pages/seminar/read/read',
        'pages/seminar/read/rule',
        'pages/seminar/read/readDec',
      ]
    },{
      "root":"comPages",
      "pages":[

          'pages/index/searchList',
          'pages/index/Recharge',
          'pages/index/rechRecord',
          'pages/index/userAccount',
          'pages/index/withdrawal',
          'pages/index/offlineAct',
          'pages/index/registInfo',
          'pages/index/rePay',
          'pages/index/backcard',
          'pages/index/atlasWatch',
          'pages/index/mylive',
          'pages/course/coursePaper',
          
          

          'pages/live/livePback',
          'pages/live/livePreview',

          'pages/ask/ask',
          'pages/ask/askQust',
          'pages/ask/userAsk',
          'pages/ask/whiteQust',
          'pages/ask/askSearch',
          'pages/ask/question',
          'pages/ask/qustShow',
          'pages/ask/askInvite',
          'pages/ask/AskComment',
          'pages/ask/writeComt',

          'pages/user/user',
          'pages/user/growthEquity',
          'pages/user/myMedal',
          'pages/user/myMedalDetail',
          'pages/user/myFous',
          'pages/user/readyLottery',
          

          'pages/user/kefu',
          'pages/user/AnnualBill',


          'pages/map/s_Map',
          'pages/user/downLoad',
          'pages/index/activeLive',
          'pages/index/qiandaoImg',
          'pages/index/bangDan',
          'pages/index/liveNotice',
          'pages/user/Niandu',
          'pages/user/steps',
      ]
    }],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      navigationStyle:"default",
    },
    tabBar:{
      color: '#999999',
      selectedColor: '#FF5047',
      backgroundColor: '#FFFFFF',
      borderStyle: 'black',
      list:[{
          pagePath: 'pages/index/index',
          text: '主页',
          iconPath: './asset/home.png',
          selectedIconPath: './asset/home_full.png'
      }
      ,{
          pagePath: 'pages/find/find',
          text: '活动',
          iconPath: './asset/find.png',
          selectedIconPath: './asset/find_full.png'
      }
      // ,{
      //   pagePath: 'pages/course/courseCate',
      //   text: '分类',
      //   iconPath: './asset/cate.png',
      //   selectedIconPath: './asset/cate_full.png'
      // }
      ,{
        pagePath: 'pages/study/study',
        text: '学习',
        iconPath: './asset/study.png',
        selectedIconPath: './asset/study_full.png'
      },{
        pagePath: 'pages/user/user',
        text: '我的',
        iconPath: './asset/user.png',
        selectedIconPath: './asset/user_full.png'
      }]
    },
    networkTimeout: {
      request: 30000,
      downloadFile: 30000
    },
    requiredBackgroundModes: ["audio"],
    navigateToMiniProgramAppIdList: [
      "wxf2bb2960b32a82c3"
    ],
  }


  constructor(){
      super(...arguments)

      try {
        // 全局方法 删除a小程序带来的信息
        global.updateMsgParams = function() {
            global.msgParams = undefined
          }
      } catch (e) {
      }

      this.state = {
          type:6,
      }
  }

  globalData = {
    loginType: false,
    userInfo: {},
    backgroundPlayer:null,
    cmic_audioId:0,
    cmic_audioName:'',
    cmic_audioImg:''
  }

  componentWillMount(){
      if (Taro.canIUse('getUpdateManager')) {
          const updateManager = Taro.getUpdateManager()
          updateManager.onCheckForUpdate(function (res) {
              // 请求完新版本信息的回调
              if (res.hasUpdate) {
                  updateManager.onUpdateReady(function () {
                    Taro.showModal({
                      title: '更新提示',
                      content: '新版本已经准备好，是否重启应用？',
                      showCancel:false,
                      success: function (res) {
                        if (res.confirm) {
                          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                          updateManager.applyUpdate()
                        }
                      }
                    })
                  })
                  updateManager.onUpdateFailed(function () {
                      // 新的版本下载失败
                      Taro.showModal({
                        title: '已经有新版本了哟~',
                        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                      })
                  })
              }
          })
      } else {
          // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
          Taro.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
      }
      
      

      this.globalData.backgroundPlayer = Taro.getBackgroundAudioManager();
  }

  componentDidMount () {
    Ets.on('test', (arg) => {
      console.info("test");
    });
    // Taro.setTabBarItem({
    //   index: 0,
    //   text:"wa",
    //   iconPath:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1597993644360.png',
    //   selectedIconPath:'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/1597993663281.png'
    // })
    
  }

  componentDidShow () {
    const that = this 
    const {referrerInfo} = that.$router.params;
    // console.log(referrerInfo);
    global.msgParams = referrerInfo.extraData;
    this.init();

  }
init(){
    var jim = new JMessage({
      debug : true
    });
    // console.log('jim',jim);
    api.post('/site/JMessage')
    .then(res=>{
      let min = res.data.data
      jim.init({
      appkey:'704efcd6d9ff0d48e859403e',
      random_str:min.random_str,
      signature:min.signature,
      timestamp:min.timestamp
    }).onSuccess(function(data) {
      // console.log('data',data);
      //TODO
    }).onFail(function(data) {
      // console.log('data',data);
      //TODO
    });
    })
  }
  componentDidHide () {}

  componentDidCatchError () {}

  




    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render () {
        return (
          <Provider store={store}>
              <Index />
          </Provider>
        )
    }
}

Taro.render(<App />, document.getElementById('app'))
