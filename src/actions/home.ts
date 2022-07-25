import {
    GETCONFIG,
    GETCFGGAD,
    GETCFGCATECOURSE,
    GETCFGCATEFD,
    GETCONFIGGIFT,
    GETCONFIGCATECERT,
    GETCONFIGCATENEWCERT,
    GETCOMMENTS,

    GETINDEX,
    GETINDEXDETAIL,
    GETSHIPFREE,
    GETCOURSELIST,
    GETCOURSEDESC,
    GETCOURSECOMMT,
    GETARTICLECOMMT,
    GETCOURSERECOMM,
    GETTEACHERLEADER,

    GETTEACHER,
    GETTEACHERDESC,
    GETTEACHERRECOM,

    GETSITE,
    GETSITEINDEX,
    GETSITEMENU,
    GETSEARCHSITE,
    GETSEARCHCOURSE,


    GETUSERMESSAGE,
    GETUSERMSGUREAD,
    GETUSERREMIND,
    GETREMINDCOURSE,
    GETSITECHANNEL,


    UPDATEPLAYSTATUS,
    
} from '../constants/home'

import api from '../services/api'


// 配置
export const getConfig = () => {
    return dispatch => {
        api.get('/config').then((res)=>{
            let config = res.data.data
            dispatch({
                type:GETCONFIG,
                payload:{
                    config
                }
            })
        })
    }
}

//广告位
export const getConfigAd = () => {

    return dispatch => {
        api.get('/config/ad/1').then((res)=>{
            let adList = res.data.data
            dispatch({
                type:GETCFGGAD,
                payload:{
                    adList
                }
            })
        })
    }
}


//课程分类
export const getCfgCateCourse = () => {
    return dispatch => {
        api.get('/config/category/course').then((res)=>{
            let cateCourse = res.data.data
            dispatch({
                type:GETCFGCATECOURSE,
                payload:{
                    cateCourse
                }
            })
        })
    }
}



// 题目分类
export const getConfigCateCert = (payload) => {
    const {ctype} = payload
    return dispatch => {
        api.get('/config/category/certification',{
            ctype:ctype
        }).then((res)=>{
            let cateCert = res.data.data
            dispatch({
                type:GETCONFIGCATECERT,
                payload:{
                    cateCert
                }
            })
        })
    }
}

// 题目新分类
export const getConfigCateNewCert = (payload) => {
    const {ctype,squadId} = payload
    return dispatch => {
        api.get('/config/category/certification/new',{
            squadId:squadId,
            ctype:ctype
        }).then((res)=>{
            let cateNewCert = res.data.data
            dispatch({
                type:GETCONFIGCATENEWCERT,
                payload:{
                    cateNewCert
                }
            })
        })
    }
}

//留言分类

export const getCfgCateFd = () => {
    return dispatch => {
        api.get('/config/category/feedback').then((res)=>{
            let cateFeedback = res.data.data
            dispatch({
                type:GETCFGCATEFD,
                payload:{
                    cateFeedback
                }
            })
        })
    }
}

//GETCONFIGGIFT  打赏礼物

export const getConfigGift = (payload) => {
    const {gtype} = payload
    return dispatch => {
        api.get('/config/gift',{
            gtype:gtype
        }).then((res)=>{
            let giftList = res.data.data
            dispatch({
                type:GETCONFIGGIFT,
                payload:{
                    giftList
                }
            })
        })
    }
}


//首页
export const getIndex = () => {
    return dispatch => {
        api.get('/index').then((res) => {
            let indexList = res.data.data
            dispatch({
                type:GETINDEX,
                payload: {
                    indexList
                }
            })
        })
    }
}


//shipfree
export const getShipFree = () => {
    return dispatch => {
        api.get('/goods/shipfree').then((res) => {
            let shipFree = res.data.data
            dispatch({
                type:GETSHIPFREE,
                payload: {
                  shipFree
                }
            })
        })
    }
}


//
export const getIndexDetail = (payload) =>{
    const {item_id} = payload
    return dispatch => {

        api.get('/goods/detail',{
            item_id:item_id
        }).then((res) => {
            let goodsInfo = res.data.data
            dispatch({
                type:GETINDEXDETAIL,
                payload:{
                    goodsInfo
                }
            })
        })
        
    }
} 


// 课程列表
export const getCourseList = (payload) =>{
    const {category_id,ctype,sort,page} = payload
    return dispatch => {
        api.get('/course',{
            category_id:category_id,
            ctype:ctype,
            sort:sort,
            page:page
        }).then((res) => {
            let courseList = res.data.data
            dispatch({
                type:GETCOURSELIST,
                payload: {
                    courseList
                }
            })
        })
    }
}


// 课程详情
export const getCourseDesc = (payload) => {
    const {course_id} = payload
    return dispatch => {
        api.get('/course/'+course_id).then((res)=>{
            let courseDesc = res.data.data
            dispatch({
                type:GETCOURSEDESC,
                payload:{
                    courseDesc
                }
            })
        })
    }
}

//课程评论
export const getCourseCommt = (payload) => {
    const {course_id,page,sort} = payload
    return dispatch => {
        api.get('/course/comment/' + course_id ,{
            sort:sort,
            page:page,
        }).then((res)=>{
            let courseCommt = res.data.data
            dispatch({
                type:GETCOURSECOMMT,
                payload:{
                    courseCommt
                }
            })
        })
    }
}

// 资讯评论
export const getArticleCommt = (payload) => {
    const {article_id,page,sort} = payload
    return dispatch => {
        api.get('/article/comment/' + article_id ,{
            sort:sort,
            page:page,
        }).then((res)=>{
            let articleCommt = res.data.data
            dispatch({
                type:GETARTICLECOMMT,
                payload:{
                    articleCommt
                }
            })
        })
    }
}

// 评论列表
export const getComments = (payload) => {
    const {content_id,ctype,sort,page} = payload
    return dispatch => {
        api.get('/site/comments/' + content_id,{
            ctype:ctype,
            sort:sort,
            page:page,
        }).then((res)=>{
            let allComment = res.data.data
            dispatch({
                type:GETCOMMENTS,
                payload:{
                    allComment
                }
            })
        })
    }
}

//课程推荐
export const getCourseRecomm = (payload) => {
    const {limit} = payload
    return dispatch => {
        api.get('/course/recommend',{
            limit:limit
        }).then((res)=>{
            let courseRecomm = res.data.data
            dispatch({
                type:GETCOURSERECOMM,
                payload:{
                    courseRecomm
                }
            })
        })
    }
}

//领导风采
export const getTeacherLeader = () => {
    return dispatch => {
        api.get('/teacher/leader',{
        }).then((res)=>{
            let teachLeader = res.data.data || []
            dispatch({
                type:GETTEACHERLEADER,
                payload:{
                    teachLeader
                }
            })
        })
    }
}




//老师列表
export const getTeacher = (payload) => {
    const {sort,page} = payload
    return dispatch => {
        api.get('/teacher',{
            sort:sort,
            page:page
        }).then((res) => {
            let teacherList  = res.data.data
            dispatch({
                type:GETTEACHER,
                payload: {
                    teacherList
                }
            })
        })
    }
}

//老师列表页详情
export const getTeacherDesc = (payload) => {
    const {teacher_id} = payload
    return dispatch => {
        api.get('/teacher/'+teacher_id).then((res)=>{
            let teacherDesc = res.data.data
            dispatch({
                type:GETTEACHERDESC,
                payload:{
                    teacherDesc
                }
            })
        })
    }
}

//老师专区

export const getTeacherRecom = () => {
    return dispatch => {
        api.get('/teacher/recomm').then((res)=>{
            let teacherRecomm = res.data.data
            dispatch({
                type:GETTEACHERRECOM,
                payload:{
                    teacherRecomm
                }
            })
        })
    }
}




// site首页
export const getSite = () => {
    return dispatch => {
        api.get('/site').then((res)=>{
            let siteList = res.data.data
            dispatch({
                type:GETSITE,
                payload:{
                    siteList
                }
            })
        })
    }
}

// siteIndex 首页排序

export const getSiteIndex = () => {
    return dispatch => {
        api.get('/site/index').then((res)=>{
            let siteListIndex = res.data.data
            dispatch({
                type:GETSITEINDEX,
                payload:{
                    siteListIndex
                }
            })
        })
    }
}

// 首页菜单
export const getSiteMenu = (payload) =>{
    const {type,mark,page} = payload
    return dispatch => {
        api.get('/site/index/menu',{
            type:type,
            mark:mark,
            page:page
        }).then((res)=>{
            let siteListMenu = res.data.data
            dispatch({
                type:GETSITEMENU,
                payload:{
                    siteListMenu
                }
            })
        })
    }
}


// 搜索
export const getSearchSite = (payload) => {
    const {keyword} = payload
    return dispatch => {
        api.get('/site/search',{
            keyword:keyword
        }).then((res)=>{
            let searchList = res.data.data
            dispatch({
                type:GETSEARCHSITE,
                payload:{
                    searchList
                }
            })
            
        })
    }
}

// 视频课程搜索
export const getSearchCourse = (payload) => {
    const {page,keyword,ctype} = payload
    return dispatch => {
        api.get('/site/search/course',{
            page:page,
            keyword:keyword,
            ctype:ctype
        }).then((res)=>{
            let searchCourse = res.data.data
            dispatch({
                type:GETSEARCHCOURSE,
                payload:{
                    searchCourse
                }
            })
        })
    } 
}


// 我的消息
export const getUserMessage = (payload) => {
    const {page,etype} = payload
    return dispatch => {
        api.get('/user/message',{
            page:page,
            etype:etype,
        }).then((res)=>{
            let userMessage = res.data.data
            dispatch({
                type:GETUSERMESSAGE,
                payload:{
                    userMessage
                }
            })
        })
    }
}

//我的未读消息
export const getUserMsgUread = () => {
    return dispatch => {
        api.get('/user/message/unread').then((res) => {
            let userMsguRead = res.data.data
            dispatch({
                type:GETUSERMSGUREAD,
                payload: {
                    userMsguRead
                }
            })
        })
    }
}

//提醒 系统
export const getUserRemind = (payload) => {
    const {page} = payload
    return dispatch => {
        api.get('/user/remind',{
            page:page
        }).then((res)=>{
            let userRemind = res.data.data
            dispatch({
                type:GETUSERREMIND,
                payload:{
                    userRemind
                }
            })
        })
    }
}

// 课程消息

export const getRemindCourse = (payload) => {
    const {page} = payload
    return dispatch => {
        api.get('/user/remind/course',{
            page:page
        }).then((res)=>{
            let remindCourse = res.data.data
            dispatch({
                type:GETREMINDCOURSE,
                payload:{
                    remindCourse
                }
            })
        })
    }
}

// 课程列表
export const getSiteChannel = (payload) => {
    const {channel_id,sort} = payload
    return dispatch => {
        api.get('/site/channel/'+channel_id,{
            sort:sort
        }).then((res)=>{
            let siteChannel = res.data.data
            dispatch({
                type:GETSITECHANNEL,
                payload:{
                    siteChannel
                }
            })
        })
    }
}


// 更新播放状态
export const updatePlayStatus = (payload) => {
    const {updateData} = payload
    return {
      type: UPDATEPLAYSTATUS,
      payload:{
          updateData
      }
    }
  }


  
  