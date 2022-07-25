    import { 
        GETINDEX,
        GETSHIPFREE,
        GETINDEXDETAIL,
        GETCOURSEDESC,
        GETCOURSELIST,
        GETTEACHER,
        GETCONFIG,
        GETCFGGAD,
        GETCFGCATECOURSE,
        GETCONFIGCATECERT,
        GETCONFIGCATENEWCERT,
        GETCFGCATEFD,
        GETCONFIGGIFT,
        GETCOURSECOMMT,
        GETARTICLECOMMT,
        GETCOURSERECOMM,
        GETCOMMENTS,
        GETTEACHERLEADER,
        GETSITE,
        GETSITEINDEX,
        GETSEARCHSITE,
        GETSEARCHCOURSE,
        GETTEACHERDESC,
        GETUSERMESSAGE,
        GETUSERMSGUREAD,
        GETREMINDCOURSE,
        GETUSERREMIND,
        GETSITECHANNEL,
        GETTEACHERRECOM,
        GETSITEMENU,
        UPDATEPLAYSTATUS,
    } from '../constants/home'
  
    import { homeType } from '../constants/homeType'
  
    const INITIAL_STATE: homeType = {
        indexList:{
            recommend_list:[],
            page:'',
        },
        shipFree:{
            goods_list:[],
            page:''
        },
        goodsInfo:{
            goods_details:[],
        },
        courseList:{
            items:[],
            page:0,
            pages:0,
            total:0
        },
        courseDesc:{
            categoryId:0,
            chapter: 0,
            chapterList:[],
            content: '',
            courseId:0,
            courseImg: '',
            courseName: '',
            ctype: 0,
            galleryList:[],
            hit: 0,
            integral: 0,
            isRecomm: 0,
            learn: 0,
            pubTime: 0,
            roomId: '',
            score: 0,
            sortOrder: 0,
            summary: '',
            teacher:{
                content: '',
                course:0,
                follow:0,
                hit:0,
                honor:'',
                isFollow:false,
                level:0,
                teacherId:0,
                teacherImg:'',
                teacherName:'',
                userId:0,
                isLeaderRecomm:0,
            },
            teacherId: 0,
            teacherName: '',
            ttype: 0,
            payType:0,
            canBuy:true,
        },
        teacherList:{
            items:[],
            page:0,
            pages:0,
            total:0
        },
        teacherDesc:{
            category:[],
            course:[],
            teacher:{
                content:'',
                course:0,
                follow:0,
                hit:0,
                honor:'',
                isFollow:false,
                level:0,
                teacherId:0,
                teacherImg:'',
                teacherName:'',
                userId:0
            }
        },
        teachLeader:[{
            content: '',
            course: 0,
            follow: 0,
            galleryList: [],
            hit: 0,
            honor: '',
            isFollow: false,
            level: 0,
            teacherId: 0,
            teacherImg: '',
            teacherName:'',
            userId: 0,
            userImg: '',
        }],
        config:{},
        adList:[],
        cateCourse:[],
        cateCert:[],
        cateNewCert:[],
        cateFeedback:[],
        giftList:[],
        courseCommt:{
            items:[],
            page:0,
            pages:0,
            total:0
        },
        articleCommt:{
            items:[],
            page:0,
            pages:0,
            total:0
        },
        allComment:{
            items:[],
            page:0,
            pages:0,
            total:0
        },
        courseRecomm:[],
        siteList:[],
        searchList:[],
        searchCourse:{
            items:[],
            page:0,
            pages:0,
            total:0
        },
        userMessage:{
            items:[],
            page:0,
            pages:0,
            total:0
        },
        userMsguRead:{
            remind:0,
            message:0,
            courseRemind:0,
        },
        userRemind:{
            items:[],
            page:0,
            pages:0,
            total:0
        },
        remindCourse:{
            items:[],
            page:0,
            pages:0,
            total:0
        },
        siteChannel:[],
        teacherRecomm:[],
        siteListIndex:[],
        siteListMenu:{
            data:[] || {},
            menu:[]
        },
        updateData:{
            isPlaying:false,
            cmic_audioName:'',
            cmic_audioId:0,
            cmic_audioImg:'',
            cmic_siger:'',
            cmic_duration:0
        }
    }
  
  export default function home (state = INITIAL_STATE, action) {
    switch (action.type) {
        case GETCONFIG:
            const {config} = action.payload
            return {
                ...state,
                config
            }
        case GETINDEX:
            const {indexList } = action.payload
            return {
                ...state,
                indexList
            } 
        case GETSHIPFREE:
            const {shipFree} = action.payload
            return {
                ...state,
                shipFree
            }
        case GETINDEXDETAIL:
            const {goodsInfo} = action.payload
            return{
                ...state,
                goodsInfo
            }
        case GETCOURSELIST:
            const {courseList} = action.payload
            return{
                ...state,
                courseList
            }
        case GETCOURSEDESC:
            const {courseDesc} = action.payload
            return{
                ...state,
                courseDesc
            }
        case GETTEACHER:
            const {teacherList} = action.payload
            return{
                ...state,
                teacherList
            }
        case GETTEACHERRECOM:
            const {teacherRecomm} = action.payload
            return{
                ...state,
                teacherRecomm
            }
        case GETCOMMENTS:
            const {allComment} = action.payload
            return{
                ...state,
                allComment
            }
        case GETTEACHERDESC:
            const {teacherDesc} = action.payload
            return{
                ...state,
                teacherDesc
            }
        case GETTEACHERLEADER:
            const {teachLeader} = action.payload
            return{
                ...state,
                teachLeader
            }
        case GETCFGGAD:
            const {adList} = action.payload
            return{
                ...state,
                adList
            }
        case GETCFGCATECOURSE:
            const {cateCourse} = action.payload
            return{
                ...state,
                cateCourse
            }
        case GETCONFIGCATECERT:
            const {cateCert} = action.payload
            return{
                ...state,
                cateCert
            }
        case GETCONFIGCATENEWCERT:
            const {cateNewCert} = action.payload
            return{
                ...state,
                cateNewCert
            }
        case GETCFGCATEFD:
            const {cateFeedback} = action.payload
            return{
                ...state,
                cateFeedback
            }
        case GETCONFIGGIFT:
            const { giftList } = action.payload
            return {
                ...state,
                giftList
            }
        case GETCOURSECOMMT:
            const { courseCommt } = action.payload
            return{
                ...state,
                courseCommt
            }
        case GETARTICLECOMMT:
            const { articleCommt } = action.payload
            return{
                ...state,
                articleCommt
            }
        case GETCOURSERECOMM:
            const {courseRecomm} = action.payload
            return{
                ...state,
                courseRecomm
            }
        case GETSITE:
            const {siteList} = action.payload
            return{
                ...state,
                siteList
            }
        case GETSITEINDEX:
            const {siteListIndex} = action.payload
            return{
                ...state,
                siteListIndex
            }
        case GETSEARCHSITE:
            const {searchList} = action.payload
            return{
                ...state,
                searchList
            }
        case GETSEARCHCOURSE:
            const {searchCourse} = action.payload
            return{
                ...state,
                searchCourse
            }
        case GETUSERMESSAGE:
            const {userMessage} = action.payload
            return{
                ...state,
                userMessage
            }
        case GETUSERMSGUREAD:
            const {userMsguRead} = action.payload
            return {
                ...state,
                userMsguRead
            }
        case GETUSERREMIND:
            const {userRemind} = action.payload
            return {
                ...state,
                userRemind
            }
        case GETREMINDCOURSE:
            const {remindCourse} = action.payload
            return {
                ...state,
                remindCourse
            }
        case GETSITECHANNEL:
            const {siteChannel} = action.payload
            return {
                ...state,
                siteChannel
            }
        case GETSITEMENU:
            const {siteListMenu} = action.payload
            return {
                ...state,
                siteListMenu
            }
        case UPDATEPLAYSTATUS:
            const { updateData } = action.payload
            return {
                ...state,
                updateData
            }
        default:
        return state
    }
  }
  