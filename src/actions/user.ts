
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

import api from '../services/api'


//我的
export const getUser = () => {
    return dispatch => {
        api.get('/user').then((res) => {
            let userData = res.data.data
            dispatch({
                type:GETUSER,
                payload: {
                    userData
                }
            })
        })
    }
}

//我的收藏课程
export const getCollectCourse = (payload) => {
    const {cctype,page} = payload
    return dispatch => {
        api.get('/user/collect/course',{
            cctype:cctype,
            page:page
        }).then((res)=>{
            let collectCourse = res.data.data
            dispatch({
                type:GETCOLLECTCOURSE,
                payload:{
                    collectCourse
                }
            })
        })
    }
}

// 我的课程
export const getUserCourse = (payloay) => {
    const {page} = payloay
    return dispatch => {
        api.get('/user/course',{
            page:page
        }).then((res)=>{
            let usercourse  = res.data.data
            dispatch({
                type:GETUSERCOURSE,
                payload:{
                    usercourse
                }
            })
        })
    }
}

// o2o学习视频列表
export const getUserVideoLearn = (payloay) => {
    const {type,squadId} = payloay
    return dispatch => {
        api.get('/o2o/study/video/new',{
            squadId:squadId,
            type:type,
            
        }).then((res)=>{
            let userVideoLearn  = res.data.data
            dispatch({
                type:GETVIDEOLEARN,
                payload:{
                    userVideoLearn
                }
            })
        })
    }
}

//我的反馈列表
export const getUserFeedback = (payloay) => {
    const {page} = payloay
    return dispatch => {
        api.get('/user/feedback',{
            page:page
        }).then((res)=>{
            let userFeedback  = res.data.data
            dispatch({
                type:GETUSERFEEDBACK,
                payload:{
                    userFeedback
                }
            })
        })
    }
}

//我的金币
export const getUserIntegral = (payloay) => {
    const {itype,page} = payloay
    return dispatch => {
        api.get('/user/integral',{
            itype:itype,
            page:page
        }).then((res)=>{
            let userIntegral  = res.data.data
            dispatch({
                type:GETUSERINTEGRAL,
                payload:{
                    userIntegral
                }
            })
        })
    }
}


//我的等级
export const getUserLevel = () => {
    return dispatch => {
        api.get('/user/level').then((res)=>{
            let userLevel = res.data.data || []
            dispatch({
                type:GETUSERLEVEL,
                payload:{
                    userLevel
                }
            })
        })
    }
}


// 抽奖
export const getUserLottery = (payload) => {
    const {activity_id} = payload
    return dispatch => {
        api.get('/user/lottery/' + activity_id).then((res)=>{
            let userlottery = res.data.data
            dispatch({
                type:GETUSERLOTTERY,
                payload:{
                    userlottery
                }
            })
        })
    }
}


// 考试试卷
export const getExanPaper = (payload) => {
    const {paper_id,levelId	} = payload

    return dispatch => {
        api.get('/exam/' + paper_id,{
            levelId:levelId
        }).then((res)=>{
            let examPaper = res.data.data
            dispatch({
                type:GETEXAMPAPER,
                payload:{
                    examPaper
                }
            })
        })
    }

}


// 学习练习
export const getStudyTopic = (payload) => {
    const {category_id,test_id} = payload

    return dispatch =>{
        api.get('/o2o/study/topic/' + category_id,{
            test_id:test_id
        }).then((res)=>{
            let topicPaper = res.data.data
            dispatch({
                type:GETSTUDYTOPIC,
                payload:{
                    topicPaper
                }
            })
        })
    }

}

// 获奖
export const getLotteryReward = (payload) => {
    const {page} = payload
    return dispatch => {
        api.get('/activity/lottery/reward',{
            page:page
        }).then((res)=>{
            let lotteryReward = res.data.data
            dispatch({
                type:GETLOTTERYREWARD,
                payload:{
                    lotteryReward
                }
            })
        })
    }
}


//学习
export const getUserStudy = () => {
    return dispatch => {
        api.get('/user/study').then((res)=>{
            let userStudy = res.data.data
            dispatch({
                type:GETUSERSTUDY,
                payload:{
                    userStudy
                }
            })
        })
    }
}

//课程学习

export const getLearnCourse = (payload) => {
    const {status,page} = payload
    return dispatch => {
        api.get('/user/course',{
            status:status,
            page:page
        }).then((res)=>{
            let learnCourse = res.data.data
            dispatch({
                type:GETLEARNCOURSE,
                payload:{
                    learnCourse
                }
            })
        })
    }
}

// 学习课程推荐
export const getLearnRecomm = (payload) => {
    const {limit} = payload
    return dispatch => {
        api.get('/course/recommend',{
            limit:limit
        }).then((res)=>{
            let learnRecomm = res.data.data
            dispatch({
                type:GETLEARNRECOMM,
                payload:{
                    learnRecomm
                }
            })
        })
    }
}


//会员任务
export const getUserTask = () => {
    return dispatch => {
        api.get('/user/task').then((res)=>{
            let userTask = res.data.data || []
            dispatch({
                type:GETUSERTASK,
                payload:{
                    userTask
                }
            })

        })
    }
}

//金币排行榜
export const getRankIntegral = () => {
    return dispatch => {
        api.get('/study/rank/integral').then((res)=>{
            let rankintegral = res.data.data
            dispatch({
                type:GETRANKINTEGRAL,
                payload:{
                    rankintegral
                }
            })
        })
    }
}
// 阅读排行榜
export const getRankMonth = () => {
    return dispatch => {
        api.get('/study/rank/month').then((res)=>{
            let rankmonth = res.data.data
            dispatch({
                type:GETRANKMONTH,
                payload:{
                    rankmonth
                }
            })
        })
    }
}

// 总排行榜

export const getRankTotal = () => {
    return dispatch => {
        api.get('/study/rank/total').then((res)=>{
            let rankTotal = res.data.data
            dispatch({
                type:GETRANKTOTAL,
                payload:{
                    rankTotal
                }
            })
        })
    }
}


//小程序二维码
export const getCode = () => {
    return dispatch => {
        api.get('/passport/code').then((res)=>{
            let isCode = res.data.data
            dispatch({
                type:GETCODE,
                payload:{
                    isCode
                }
            })
        })
    }
}

//退出登录
export const getLogout = () => {
    return dispatch => {
        api.get('/passport/code').then((res)=>{
            let isLogout = res.data.data
            dispatch({
                type:GETLOGOUT,
                payload:{
                    isLogout
                }
            })
        })
    }
}


//邀请好友
export const getUserInvite = (payload) => {
    const {page} = payload
    return dispatch => {
        api.get('/user/invite',{
            page:page
        }).then((res)=>{
            let userInvite = res.data.data
            dispatch({
                type:GETUSERINVITE,
                payload:{
                    userInvite
                }
            })
        })
    }
}

// 邀请好友统计
export const getInviteStat = () => {
    return dispatch => {
        api.get('/user/invite/stat').then((res)=>{
            let inviteStat = res.data.data
            dispatch({
                type:GETINVITERSTAT,
                payload:{
                    inviteStat
                }
            })
        })
    }
}

//留言分类
export const getCateFeedback = () => {
    return dispatch => {
        api.get('/config/category/feedback').then((res)=>{
            let cateFeedback = res.data.data
            dispatch({
                type:GETCATEFEEDBACK,
                payload:{
                    cateFeedback
                }
            })
        })
    }
}

// 问题解答
export const getCateQuestion = () => {
    return dispatch => {
        api.get('/config/category/qa').then((res)=>{
            let cateQuestion = res.data.data
            dispatch({
                type:GETCATEQUESTION,
                payload:{
                    cateQuestion
                }
            })
        })
    }
}



//翻牌 规则  中奖记录
export const getActivityFlop = () => {
    return dispatch => {
        api.get('/activity/flop/1').then((res)=>{
            let activityFlop = res.data.data
            dispatch({
                type:GETACTIVITYFLOP,
                payload:{
                    activityFlop
                }
            })
        })
    }
}


// 分享 背景
export const getInviteImgs = () => {
    return dispatch => {
        api.get('/site/inviteImgs').then((res)=>{
            let InviteImgs = res.data.data
            dispatch({
                type:GETINVITEIMGS,
                payload:{
                    InviteImgs
                }
            })
        })
    }
}

// 我的证书
export const getUserCert = (payload) => {
    const {page} = payload
    return dispatch => {
        api.get('/user/cert',{
            page:page
        }).then((res)=>{
            let userCert = res.data.data
            dispatch({
                type:GETUSERCERT,
                payload:{
                    userCert
                }
            })
        })
    }
}

// 我的勋章
export const getUserMedal = () => {
    return dispatch => {
        api.get('/user/medal')
        .then((res)=>{
            let userMedal = res.data.data
            dispatch({
                type:GETUSERMEDAL,
                payload:{
                    userMedal
                }
            })
        })
    }

}


// 关于我们
export const getAboutUs = () => {
    return dispatch => {
        api.get('/article/system/aboutus')
        .then((res)=>{
            let aboutsUs = res.data.data
            dispatch({
                type:GETABOUTUS,
                payload:{
                    aboutsUs
                }
            })
        })
    }
}
// 联系我们
export const getContact = () => {
    return dispatch => {
        api.get('/article/system/contact')
        .then((res)=>{
            let contact = res.data.data
            dispatch({
                type:GETSYSCONTACT,
                payload:{
                    contact
                }
            })
        })
    }
}
// 版权声明 
export const getCopyright = () => {
    return dispatch => {
        api.get('/article/system/copyright')
        .then((res)=>{
            let copyRight = res.data.data
            dispatch({
                type:GETCOPYRIGHT,
                payload:{
                    copyRight
                }
            })
        })
    }
}
// 服务协议
export const getPolicy = () => {
    return dispatch => {
        api.get('/article/system/policy')
        .then((res)=>{
            let policy = res.data.data
            dispatch({
                type:GETSYSPOLICY,
                payload:{
                    policy
                }
            })
        })
    }
}
// 隐私条款
export const getPrivacy = () => {
    return dispatch => {
        api.get('/article/system/privacy')
        .then((res)=>{
            let privacy = res.data.data
            dispatch({
                type:GETPRIVACY,
                payload:{
                    privacy
                }
            })
        })
    }
}
