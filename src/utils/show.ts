import Taro from '@tarojs/taro'

export const showLoading = (message) => {

    if(Taro.showLoading()){
        Taro.showLoading({
            title: message,
            mask: true
        });
    } else {
        Taro.showToast({
            title: message,
            icon: 'loading',
            mask: true,
            duration: 20000
        });
    }

}

export const hideLoading = () => {
    if (Taro.hideLoading) {
        // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
        Taro.hideLoading();
      } else {
        Taro.hideToast();
    }
}