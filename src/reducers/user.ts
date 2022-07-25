
import { 
    GETUSER, 
    GETCOLLECTCOURSE,
    GETUSERCOURSE,
    GETUSERFEEDBACK,
    GETUSERINTEGRAL,
    GETUSERLEVEL,
    GETUSERLOTTERY,
    GETUSERSTUDY,
    GETUSERTASK,
    GETRANKINTEGRAL,
    GETRANKMONTH,
    GETRANKTOTAL,
    GETCODE,
    GETLOGOUT,
    GETLEARNCOURSE,
    GETLEARNRECOMM,
    GETUSERINVITE,
    GETINVITERSTAT,
    GETCATEFEEDBACK,
    GETCATEQUESTION,
    GETACTIVITYFLOP,
    GETLOTTERYREWARD,
    GETVIDEOLEARN,
    GETEXAMPAPER,
    GETSTUDYTOPIC,
    GETINVITEIMGS,
    GETUSERCERT,
    GETUSERMEDAL,
    GETABOUTUS,
    GETSYSCONTACT,
    GETCOPYRIGHT,
    GETSYSPOLICY,
    GETPRIVACY,
} from '../constants/user'
  
import { usersType } from '../constants/usersType'

  
const INITIAL_STATE: usersType = {
    userData:{
        avatar:'',
        birthday:'',
        equityList:[],
        follow:0,
        identity:'',
        integral:0,
        learn:0,
        level:0,
        loginIp:'',
        loginTime:0,
        lottery:0,
        mobile:'',
        nickname:'',
    
        parentId:0,
        password:'',
        praise:0,
        prestige:0,
        regTime:0,
        salt:'',
        sex:0,
        status:'',
        token:'',
        userId:0,
        username:'',
    },
    collectCourse:{
        items:[],
        page:0,
        pages:0,
        total:0
    },
    usercourse:{
        items:[],
        page:0,
        pages:0,
        total:0
    },
    userFeedback:{
        items:[],
        page:0,
        pages:0,
        total:0
    },
    userIntegral:{
        items:[],
        page:0,
        pages:0,
        total:0
    },
    userLevel:[],
    userlottery:{
        items:[],
        page:0,
        pages:0,
        total:0
    },
    userStudy:{
        learnList:[],
        learn:0,
        rank:0,
        today:0,
        total:0, 
    },
    userTask:[],
    rankintegral:[],
    rankmonth:[],
    rankTotal:[],
    isCode:false,
    isLogout:false,
    learnCourse:{
        items:[],
        page:0,
        pages:0,
        total:0
    },
    learnRecomm:[],
    userInvite:{
        items:[],
        page:0,
        pages:0,
        total:0
    },
    inviteStat:{},
    cateFeedback:[],
    cateQuestion:[],
    activityFlop:{
        items:[],
        ritem:[],
        activity:{
            activityId: 0,
            atype: 0,
            title: '',
            rule: '',
            content: '',
            integral: 0,
            beginTime: 0,
            endTime: 0,
            hit: 0,
            pubTime: ''
        },
    },
    lotteryReward:{
        items:[],
        page:0,
        pages:0,
        total:0
    },

    userVideoLearn:{
        items:[],
        page:0,
        pages:0,
        total:0
    },
    examPaper:{
        cchapterId: 0,
        chapterId: 0,
        correctNum: 0,
        courseId: 0,
        duration: 0,
        paperId: 0,
        pubTime: 0,
        pubTimeFt: "",
        score: 0,
        status: 0,
        testId: 0,
        topicList: [],
        topicNum: 0,
        userId: 0,
    },
    topicPaper:{
        testInfo:{
            cchapterId: 0,
            chapterId: 0,
            correctNum: 0,
            courseId: 0,
            duration: 0,
            paperId: 0,
            pubTime: 1590560645,
            pubTimeFt: "",
            score: 0,
            status: 0,
            testId: 0,
            topicList: [],
            topicNum: 0,
            userId: 25,
        },
        topicList:[]
    },
    userCert:{
        items:[],
        page:0,
        pages:0,
        total:0
    },
    userMedal:[{
        title:'',
        mark:'',
        child:[],
        have:false,
        img:'',
        lv:'',
        content:'',
        allNum:0,
        nowNum:0,
        cond:0
    }],
    InviteImgs:[],
    aboutsUs:'',
    contact:'',
    copyRight:'',
    policy:'',
    privacy:'',
}
  
export default function user (state = INITIAL_STATE, action) {
    switch (action.type) {
        
        case GETUSER:
            const {userData} = action.payload
            return{
                ...state,
                userData
            }
        case GETCOLLECTCOURSE:
            const {collectCourse} = action.payload
            return{
                ...state,
                collectCourse
            }
        case GETUSERCOURSE:
            const {usercourse} = action.payload
            return{
                ...state,
                usercourse
            }
        case GETUSERFEEDBACK:
            const {userFeedback} = action.payload
            return{
                ...state,
                userFeedback
            }
        case GETUSERINTEGRAL:
            const {userIntegral} = action.payload
            return{
                ...state,
                userIntegral
            }
        case GETUSERLEVEL:
            const {userLevel} = action.payload
            return{
                ...state,
                userLevel
            }
        case GETUSERLOTTERY:
            const {userlottery} = action.payload
            return {
                ...state,
                userlottery
            }
        case GETUSERSTUDY:
            const {userStudy} = action.payload
            return {
                ...state,
                userStudy
            }
        case GETUSERTASK:
            const {userTask} = action.payload
            return {
                ...state,
                userTask
            }
        case GETRANKINTEGRAL:
            const {rankintegral} = action.payload
            return{
                ...state,
                rankintegral
            }
        case GETRANKMONTH:
            const {rankmonth} = action.payload
            return{
                ...state,
                rankmonth
            }
        case GETRANKTOTAL:
            const {rankTotal} = action.payload
            return{
                ...state,
                rankTotal
            }
        case GETCODE:
            const {isCode} = action.payload
            return{
                ...state,
                isCode
            }
        case GETLOGOUT:
            const {isLogout} = action.payload
            return{
                ...state,
                isLogout
            }
        case GETLEARNCOURSE:
            const {learnCourse} = action.payload
            return{
                ...state,
                learnCourse
            }
        case GETLEARNRECOMM:
            const {learnRecomm} = action.payload
            return {
                ...state,
                learnRecomm
            }
        case GETUSERINVITE:
            const {userInvite} = action.payload
            return{
                ...state,
                userInvite
            }
        case GETINVITERSTAT:
            const {inviteStat} = action.payload
            return{
                ...state,
                inviteStat
            }
        case GETCATEFEEDBACK:
            const {cateFeedback} = action.payload
            return{
                ...state,
                cateFeedback
            }
        case GETCATEQUESTION:
            const {cateQuestion} = action.payload
            return{
                ...state,
                cateQuestion
            }
            
        case GETACTIVITYFLOP:
            const {activityFlop} = action.payload
            return{
                ...state,
                activityFlop
            }
        case GETLOTTERYREWARD:
            const {lotteryReward} = action.payload
            return{
                ...state,
                lotteryReward
            }
        case GETVIDEOLEARN:
            const {userVideoLearn} = action.payload
            return{
                ...state,
                userVideoLearn
            }
        case GETEXAMPAPER:
            const {examPaper} = action.payload
            return{
                ...state,
                examPaper
            }
        case GETSTUDYTOPIC:
            const {topicPaper} = action.payload
            return{
                ...state,
                topicPaper
            }
        case GETINVITEIMGS:
            const {InviteImgs} = action.payload
            return{
                ...state,
                InviteImgs
            }
        case GETUSERCERT:
            const {userCert} = action.payload
            return{
                ...state,
                userCert
            }
        case GETUSERMEDAL:
            const {userMedal} = action.payload
            return{
                ...state,
                userMedal
            }
        case GETABOUTUS:
            const {aboutsUs} = action.payload
            return{
                ...state,
                aboutsUs
            }
        case GETSYSCONTACT:
            const {contact} = action.payload
            return{
                ...state,
                contact
            }
        case GETCOPYRIGHT:
            const {copyRight} = action.payload
            return{
                ...state,
                copyRight
            }
        case GETSYSPOLICY:
            const {policy} = action.payload
            return{
                ...state,
                policy
            }
        case GETPRIVACY:
            const {privacy} = action.payload
            return{
                ...state,
                privacy
            }
        default:
            return state
    }
}
  