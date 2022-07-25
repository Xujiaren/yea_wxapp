import { ComponentClass } from 'react'
import Taro, { Component} from '@tarojs/taro'
import { View, Text, Image,Video,Button} from '@tarojs/components'
import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import Tabs from '../../../../components/Tabs'
import '../home.less'
import './rule.less'




type PageState = {
    list:Array<any>
}


class rule extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '规则',
	    enableShareAppMessage: true
    }
    page: number
    pages: number
    status:number
    constructor(props) {
        super(props)

        this.page = 0;
        this.pages = 0;
        this.status=0
        this.state = {
            list:[]
            }

    }

    componentDidMount() {
      api.get(inter.Config).then(res=>{
          let abs = res.data.data.teacher_meet_rule.split(';')
          this.setState({
              list:abs
          })
      })
    }
    componentDidShow() {
        
    }
    render() {
        const{list}=this.state
        return (
            <View className='box row jc_ct'>
            <View className='rule mt_20 label_gray'>
                {
                    list.map(item=>{
                        return(
                            <View className='lh_18'>{item}</View>
                        )
                    })
                }
            </View>
        </View>
        )

    }
}

export default rule as ComponentClass