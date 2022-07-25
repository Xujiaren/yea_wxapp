
export type  goodsDescType = {
    goodsId:number,
    categoryId:number,
    brandId:number,
    goodsName:null,
    goodsSn:null,
    goodsImg:null,
    summary:null,
    beginTime:number,
    endTime:number,
    isFree:number,
    gtype:number,
    stock:number,
    cost:null,
    delivery:null,
    goodsIntro:null,
    marketAmount:null,
    goodsAmount:null,
    goodsWeight:null,
    goodsLimit:number,
    goodsIntegral:number,
    saleNum:number,
    status:number,
    isDelete:number,
    galleryList:[],
    goodsAttr:[],
    goodsActivityDTO:{
        activityId:number,
        title:null,
        beginTime:number,
        endTime:number,
        condFir:null,
        condSec:null,
        way:number,
        goodsLimit:number
    },
    goodsAmountDTO:{
        goodsId:number,
        level:number,
        goodsAmount:any
    },
    goodsLevelDTO:{
        goodsId:number,
        ulevel:null,
        tlevel:null
    },
}

export type userOrderType = {
    items:Array<string | undefined>,
    page:number,
    pages:number,
    total:number
}

export type exGiftsType = {
    items:Array<string| undefined>,
    page:number,
    pages:number,
    total:number
}

export type orderDescType = {
    orderId:number,
    otype:number,
    orderSn:string,
    userId:number,
    goodsAmount:number,
    orderAmount:number,
    shippingAmount:number,
    couponAmount:number,
    integralAmount:number,
    payStatus:number,
    orderStatus:number,
    shippingStatus:number,
    isDigital:number,
    realname:string,
    mobile:string,
    province:string,
    city:string,
    district:string,
    street:string,
    address:string,
    goodsWeight:number,
    shippingId:number,
    shippingSn:string,
    remark:string,
    activityId:number,
    status:number,
    payTime:number,
    payTimeFt:null,
    invoiceUrl:string,
    orderGoods:[{
        recId:number,
        orderId:number,
        userId:number,
        goodsId:number,
        goodsName:string,
        goodsAttr:string,
        attrId:string,
        goodsImg:string,
        goodsNum:number,
        integralAmount:number,
        marketAmount:number,
        goodsAmount:number,
        goodsWeight:number,
        warehouseId:number,
        isComment:number,
        activityId:number,
        ctype:number,
    }]
}


export type mailType = {
    adList:Array<{}>,
    goodsDesc:goodsDescType,
    cateGoods:Array<{}>,
    shopSellTop:Array<{}>,
    exGifts:exGiftsType,
    config:{},
    userOrder:userOrderType,
    orderDesc:orderDescType
}