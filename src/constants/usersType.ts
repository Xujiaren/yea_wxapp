 
export type userDataType = {
    avatar:string,
    birthday:string,
    equityList:Array<string | undefined>,
    follow:number,
    identity:string,
    integral:number,
    learn:number,
    level:number,
    loginIp:string,
    loginTime:number,
    lottery:number,
    mobile:string,
    nickname:string,

    parentId:number,
    password:string,
    praise:number,
    prestige:number,
    regTime:number,
    salt:string,
    sex:number,
    status:string,
    token:string,
    userId:number,
    username:string,
    
}
   
export type collectCourseType = {
    items:Array<string| undefined>,
    page:number,
    pages:number,
    total:number
}


export type usercourseType = {
    items:Array<string| undefined>,
    page:number,
    pages:number,
    total:number
}

export type userFeedbackType = {
    items:Array<string| undefined>,
    page:number,
    pages:number,
    total:number
}


export type userIntegralType = {
    items:Array<string| undefined>,
    page:number,
    pages:number,
    total:number
}

export type userlotteryType = {
    items:Array<string| undefined>,
    page:number,
    pages:number,
    total:number
}


export type userStudyType = {
    learnList:Array<string| undefined>,
    learn:number,
    rank:number,
    today:number,
    total:number, 
}


export type learnCourseType = {
    items:Array<string| undefined>,
    page:number,
    pages:number,
    total:number
}

export type userInviteType = {
    items:Array<string| undefined>,
    page:number,
    pages:number,
    total:number
} 

export type activityFlopType = {
    items:Array<string| undefined>,
    ritem:Array<string| undefined>,
    activity:{
        activityId: number,
        atype: number,
        title: string,
        rule: string,
        content: string,
        integral: number,
        beginTime: number,
        endTime: number,
        hit: number,
        pubTime: string
    },
} 

export type lotteryRewardType = {
    items:Array<string| undefined>,
    page:number,
    pages:number,
    total:number
} 

export type userVideoLearnType = {
    items:Array<string| undefined>,
    page:number,
    pages:number,
    total:number
}

export type examPaperType = {
    cchapterId: number,
    chapterId: number,
    correctNum: number,
    courseId: number,
    duration: number,
    paperId: number,
    pubTime: number,
    pubTimeFt: string,
    score: number,
    status: number,
    testId: number,
    topicList: Array<{}>
    topicNum: number,
    userId: number,
}

export type topicPaperType = {
    testInfo:{
        cchapterId: number,
        chapterId: number,
        correctNum: number,
        courseId: number,
        duration: number,
        paperId: number,
        pubTime: number,
        pubTimeFt: string,
        score: number,
        status: number,
        testId: number,
        topicList: Array<any>,
        topicNum: number,
        userId: number,
    },
    topicList:Array<{}>
}

export type InviteImgsType = {
    galleryId:string,
    ctype:string,
    contentId:number,
    ftype:number,
    fpath:string,
    link:string,
    status:number,
    title:string,
}

export type userCertType = {
    items:Array<string| undefined>,
    page:number,
    pages:number,
    total:number
}



export type usersType = {
    userData: userDataType,
    collectCourse:collectCourseType,
    usercourse:usercourseType,
    userFeedback:userFeedbackType,
    userIntegral:userIntegralType,
    userLevel:Array<{}>,
    userlottery:userlotteryType,
    userStudy:userStudyType,
    userTask:Array<{}>,
    rankintegral:Array<{}>,
    rankmonth:Array<{}>,
    rankTotal:Array<{}>,
    isCode:boolean,
    isLogout:boolean,
    learnCourse:learnCourseType,
    learnRecomm:Array<{}>,
    userInvite:userInviteType,
    inviteStat:{},
    cateFeedback:Array<{}>,
    cateQuestion:Array<{}>,
    activityFlop:activityFlopType,
    lotteryReward:lotteryRewardType,
    userVideoLearn:userVideoLearnType,
    examPaper:examPaperType,
    topicPaper:topicPaperType,
    InviteImgs:Array<{InviteImgsType}>,
    userCert:userCertType,
    userMedal:Array<{}>,
    aboutsUs:string,
    contact:string,
    copyRight:string,
    policy:string,
    privacy:string,
}


