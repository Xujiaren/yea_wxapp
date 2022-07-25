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
        api.get('/config/ad/4').then((res)=>{
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

// 商品详情
export const getGoodsDesc = (payload) => {
    const {goods_id} = payload
    return dispatch => {
        api.get('/shop/goods/' + goods_id).then((res)=>{
            let goodsDesc = res.data.data
            dispatch({
                type:GETGOODSEDESC,
                payload:{
                    goodsDesc
                }
            })
        })
    }
}



//商品分类
export const getGoodsCate = () => {
    return dispatch => {
        api.get('/config/category/goods').then((res)=>{
            let cateGoods = res.data.data
            dispatch({
                type:GETGOODSCATE,
                payload:{
                    cateGoods
                }
            })
        })
    }
}


//人气
export const getShopSellTop = () => {

    return dispatch => {
        api.get('/shop/sellTop').then((res)=>{
            let shopSellTop = res.data.data
            dispatch({
                type:GETSHOPSELLTOP,
                payload:{
                    shopSellTop
                }
            })
        })
    }
}

export const getExGifts = (payload) => {
    const {page,sortOrder} = payload

    return dispatch => {
        api.get('/shop/exchange',{
            exchange_type:0,
            ctype:0,
            page:page,
            sortOrder:sortOrder,
        }).then((res)=>{
            let exGifts = res.data.data
            dispatch({
                type:GETEXGIFTS,
                payload:{
                    exGifts
                }
            })
        })
    }
}


export const getUserOrder = (payload) => {
    const {status,page} = payload

    return dispatch => {
        api.get('/user/order',{
            status:status,
            page:page
        }).then((res)=>{
            let userOrder = res.data.data
            dispatch({
                type:GETUSERORDER,
                payload:{
                    userOrder
                }
            })
        })
    }
}



export const getOrderDesc = (payload) => {
    const {order_id} = payload

    return dispatch => {
        api.get('/order/' + order_id).then((res)=>{
            let orderDesc = res.data.data
            dispatch({
                type:GETORDERDESC,
                payload:{
                    orderDesc
                }
            })
        })
    }
}






