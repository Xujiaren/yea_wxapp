
  
    export type indexListType = {
        recommend_list:Array<string | undefined>,
        page:string
    }

    export type shipFreeType = {
        goods_list:Array<string | undefined>,
        page:string
    }
  
    export type goodsInfoType = {
        goods_details:Array<string | undefined>,
    }

    export type courseListType = {
        items:Array<string | undefined>,
        page:number,
        pages:number,
        total:number
    }
    
    export type teacherListType = {
        items:Array<string | undefined>,
        page:number,
        pages:number,
        total:number
    }

    export type courseDescType = {
        categoryId:number,
        chapter: number,
        chapterList:Array<string | undefined>,
        content: string,
        courseId:number,
        courseImg: string,
        courseName: string,
        ctype: number,
        galleryList:Array<string | undefined>,
        hit: number,
        integral: number,
        isRecomm: number,
        learn: number,
        pubTime: number,
        roomId: string,
        score: number,
        sortOrder: number,
        summary: string,
        teacher:{
            content: string,
            course:number,
            follow:number,
            hit:number,
            honor:string,
            isFollow:boolean,
            level:number,
            teacherId:number,
            teacherImg:string,
            teacherName:string,
            userId:number,
            isLeaderRecomm:number,
        },
        teacherId: number,
        teacherName: string,
        ttype: number,
        payType:number,
        canBuy:boolean,
    }

    export type  courseCommtType = {
        items:Array<string | undefined>,
        page:number,
        pages:number,
        total:number
    }

    export type allCommentType = {
        items:Array<string | undefined>,
        page:number,
        pages:number,
        total:number
    }

    export type  articleCommtType = {
        items:Array<string | undefined>,
        page:number,
        pages:number,
        total:number
    }

   

    export type  searchCourseType = {
        items:Array<string | undefined>,
        page:number,
        pages:number,
        total:number
    }
    
    export type teacherDescType = {
        category:Array<string | undefined>,
        course:Array<string | undefined>,
        teacher:{
            content:string,
            course:number,
            follow:number,
            hit:number,
            honor:string,
            isFollow:boolean,
            level:number,
            teacherId:number,
            teacherImg:string,
            teacherName:string,
            userId:number
        }
    }
    
    
    
    export type userMessageType = {
        items:Array<string| undefined>,
        page:number,
        pages:number,
        total:number
    }
    
    export type userMsguReadType = {
        message:number,
        remind:number,
        courseRemind:number,
    }
    
    export type userRemindType = {
        items:Array<string| undefined>,
        page:number,
        pages:number,
        total:number
    }

    export type remindCourseType = {
        items:Array<string| undefined>,
        page:number,
        pages:number,
        total:number
    }

    export type teachLeaderType = {
        content: string,
        course: number,
        follow: number,
        galleryList: Array<{}>,
        hit: number,
        honor: string,
        isFollow: boolean,
        level: number,
        teacherId: number,
        teacherImg: string,
        teacherName: string,
        userId: number,
        userImg: string
    }

    export type cateCertType = {
        categoryId:number,
        ctype:number,
        categoryName:string,
        sortOrder:number,
        status:number,
        isDelete:number,
        child:Array<{}>
    }

    export type cateNewCertType = {
        categoryId:number,
        ctype:number,
        categoryName:string,
        sortOrder:number,
        status:number,
        isDelete:number,
        child:Array<{}>
    }

    export type siteListMenuType = {
        data:any,
        menu:Array<{
            type: string,
            name: string,
            mark: string
        }>
    }

    export type updateDataType = {

        isPlaying:boolean,
        cmic_audioName:string,
        cmic_audioId:number,
        cmic_audioImg:string,
        cmic_siger:string,
        cmic_duration:0
    }



    export type homeType = {

        indexList: indexListType,
        siteListIndex:Array<{}>,

        shipFree:shipFreeType,
        goodsInfo:goodsInfoType,
        courseList:courseListType
        courseDesc:courseDescType,
        teacherList:teacherListType,
        teacherDesc:teacherDescType,
        teacherRecomm:Array<{}>,
        teachLeader:Array<teachLeaderType>,
        config:{},
        adList:Array<{}>,
        cateCourse:Array<{}>,
        cateCert:Array<cateCertType>,
        cateNewCert:Array<cateNewCertType>,
        cateFeedback:Array<{}>,
        giftList:Array<{}>,
        courseCommt:courseCommtType,
        articleCommt:articleCommtType,
        courseRecomm:Array<{}>,
        allComment:allCommentType,
        siteList:Array<{}>,
        searchList:Array<{}>,
        searchCourse:searchCourseType,

        userMessage:userMessageType,
        userMsguRead:userMsguReadType,
        userRemind:userRemindType,
        remindCourse:remindCourseType,
        siteChannel:Array<{}>,
        siteListMenu:siteListMenuType,

        updateData:updateDataType
    }

