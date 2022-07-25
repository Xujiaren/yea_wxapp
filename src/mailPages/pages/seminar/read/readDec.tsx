import { ComponentClass } from 'react'
import Taro, { Component} from '@tarojs/taro'
import { View, Text, Image,Video,Button} from '@tarojs/components'
import menu from '../../../../config/menu'
import asset from '../../../../config/asset'
import inter from '../../../../config/inter'
import api from '../../../../services/api'
import {percent2percent25} from '../../../../utils/common'
import Tabs from '../../../../components/Tabs'
import '../home.less'
import './readDec.less'



type PageState = {
    course_id:number,
    courseName:string,
    courseDesc:any,
    coursewareList:Array<any>
}


class readDec extends Component<{}, PageState> {
    config = {
        navigationBarTitleText: '电子书',
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
             course_id:0,
             courseName:'',
             courseDesc:{},
             coursewareList:[],
            }

    }

    componentDidMount() {
        const{courseId}=this.$router.params
        api.get(inter.CourseDesc+parseInt(courseId))
        .then(res=>{
            this.setState({
                courseDesc:res.data.data,
                coursewareList:res.data.data.coursewareList,
                courseName:res.data.data.courseName,
                course_id:res.data.data.courseId
            })
            Taro.setNavigationBarTitle({
                title:res.data.data.courseName
            })
        })
    }
    componentDidShow() {
        
    }
  
    
    render() {
        const{courseDesc,coursewareList}=this.state
        return (
            <View className='read row jc_ct'>
                <View className='read row col'>
                    {
                        coursewareList.map(item=>{
                            return(
                                <View className='read mt_5'>
                                    <Image src={item.fpath} className='read'/>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )

    }
}

export default readDec as ComponentClass