import { 
    GETCONFIG,
    GETCFGGAD,
    GETGOODSEDESC,
    GETGOODSCATE,
    GETSHOPSELLTOP,
    GETEXGIFTS,
    GETUSERORDER,
    GETORDERDESC
} from '../constants/mail'


import { mailType } from '../constants/mailType'



const INITIAL_STATE: mailType = {
    adList:[],
    cateGoods:[],
    shopSellTop:[],
    goodsDesc:{
        goodsId:0,
        categoryId:0,
        brandId:0,
        goodsName:null,
        goodsSn:null,
        goodsImg:null,
        summary:null,
        beginTime:0,
        endTime:0,
        isFree:0,
        gtype:0,
        stock:0,
        cost:null,
        delivery:null,
        goodsIntro:null,
        marketAmount:null,
        goodsAmount:null,
        goodsWeight:null,
        goodsLimit:0,
        goodsIntegral:0,
        saleNum:0,
        status:0,
        isDelete:0,
        galleryList:[],
        goodsAttr:[],
        goodsActivityDTO:{
            activityId:0,
            title:null,
            beginTime:0,
            endTime:0,
            condFir:null,
            condSec:null,
            way:0,
            goodsLimit:0
        },
        goodsAmountDTO:{
            goodsId:0,
            level:0,
            goodsAmount:0
        },
        goodsLevelDTO:{
            goodsId:0,
            ulevel:null,
            tlevel:null
        }
    },
    exGifts:{
        items:[],
        page:0,
        pages:0,
        total:0
    },
    config:{},
    userOrder:{
        items:[],
        page:0,
        pages:0,
        total:0
    },
    orderDesc:{
        orderId:0,
        otype:0,
        orderSn:"",
        userId:0,
        goodsAmount:0.00,
        orderAmount:0.00,
        shippingAmount:0.00,
        couponAmount:0.00,
        integralAmount:0.00,
        payStatus:0,
        orderStatus:0,
        shippingStatus:0,
        isDigital:0,
        realname:"",
        mobile:"",
        province:"",
        city:"",
        district:"",
        street:"",
        address:"",
        goodsWeight:0,
        shippingId:0,
        shippingSn:"",
        remark:"",
        activityId:0,
        status:0,
        payTime:0,
        payTimeFt:null,
        invoiceUrl:'',
        orderGoods:[{
            recId:0,
            orderId:0,
            userId:0,
            goodsId:0,
            goodsName:"",
            goodsAttr:"",
            attrId:"",
            goodsImg:"",
            goodsNum:0,
            integralAmount:0,
            marketAmount:0,
            goodsAmount:0.00,
            goodsWeight:0.00,
            warehouseId:0,
            isComment:0,
            activityId:0,
            ctype:0
        }]
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
        case GETCFGGAD:
            const {adList} = action.payload
            return{
                ...state,
                adList
            }
        case GETGOODSEDESC:
            const {goodsDesc} = action.payload
            return{
                ...state,
                goodsDesc
            }
        case GETGOODSCATE:
            const {cateGoods} = action.payload
            return{
                ...state,
                cateGoods
            }
        case GETSHOPSELLTOP:
            const {shopSellTop} = action.payload
            return{
                ...state,
                shopSellTop
            }
        case GETEXGIFTS:
            const {exGifts} = action.payload
            return{
                ...state,
                exGifts
            }
        case GETUSERORDER:
            const {userOrder} = action.payload
            return{
                ...state,
                userOrder
            }
        case GETORDERDESC:
            const {orderDesc} = action.payload
            return{
                ...state,
                orderDesc
            }
        default:
        return state
    }
  }