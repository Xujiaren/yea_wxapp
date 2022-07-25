import Taro, { Component } from '@tarojs/taro'
import { View, Text,ScrollView } from '@tarojs/components'
import '../config/theme.css'
import './index.less'
import './Tabs.less'
export default class Tabs extends Component {


    constructor () {
        super(...arguments)
        this.state = {

        }


    }

    componentWillMount () { }

    componentDidMount () { }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }



    _onPress(index){
        this.props.onSelect && this.props.onSelect(index);
    }

    renderItems = () => {
        const {items,selected= 0,atype=0 ,type=1,cctype=0} = this.props;

        return items && items.map((item,index)=>{
            const on = (selected === index);
            return(
                <View key={'items'+index} onClick={() => this._onPress(index)} className='items col_1' style={type == 0 ? {paddingLeft:30+'rpx',paddingRight:30+'rpx'}:{}}>
                    {
                        on ? 
                        <View className='onItems  d_flex fd_c ai_ct jc_ct '>
                            <Text className={cctype === 1 ? 'sred_label default_label fw_label' : 'c33_label default_label fw_label'}>{item}</Text>
                            <View className='border_bt_ed mt_5'></View>
                        </View>
                        :
                        <View className='offItems  d_flex fd_c ai_ct jc_ct '>
                            <Text className='default_label gray_label'>{item}</Text>
                            <View className='border_bt_ned mt_5'></View>
                        </View>
                    }
                </View>
            )
        }) 
    }

    render () {
        const {type=1 ,atype = 0} = this.props;
        return (
            <View>
                {
                    type == 0 ?
                    <ScrollView className='tabswrap pt_15 '  scrollX scrollWithAnimation>
                        <View className=' d_flex  fd_r ' style={{width:'100%',whiteSpace:'nowrap'}}>
                            {this.renderItems()}
                        </View>
                    </ScrollView>
                    :
                    <View  style={atype == 1 ? {borderBottom:'4rpx solid #f5f5f5'} : null } className='tabswrap d_flex pl_30 pr_30 fd_r jc_sb pt_10'>
                        {this.renderItems()}
                    </View>
                }
                
            </View>
            
        )
    }
}
