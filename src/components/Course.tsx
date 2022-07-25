import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image} from '@tarojs/components'

import '../config/theme.css'
import './Course.less'
import asset from '../config/asset'
import {learnNum,isHistory} from '../utils/common'

type Props = {
    courseList:{
        categoryId: number,
        chapter: number,
        chapterList: Array<{}>,
        collect: boolean,
        content: string,
        courseId: number,
        courseImg: string,
        courseName: string,
        ctype: number,
        galleryList: Array<{}>,
        hit: number,
        integral: number,
        isRecomm: number,
        learn: number,
        pubTime: number,
        roomId: string,
        score: number,
        sortOrder: number,
        study: null,
        summary: string,
        teacher: null
        teacherId: number,
        teacherName:string,
        ttype: number,
    },
    atype:number
}

type State = {

}



export default class Course extends Component<Props,State> {


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



   

    render () {
        const {courseList,atype} = this.props
        const {summary} = courseList
        let on = false;
        
        if (courseList) {
            on = isHistory(courseList.courseId);
        }
        

        return (
            <View className='item d_flex fd_r   pb_20 '>
                <View className='item_cover_cons'>
                    <Image src={courseList.courseImg} className='item_cover' />
                    <View className='item_tips_hit'>
                        <Image src={asset.cover_tips_icon}  className='item_hit_cover' />
                        <Text className='sm8_label white_label mt_3'>{courseList.chapter}讲</Text>
                    </View>
                </View>
                <View className='d_flex fd_c pl_10 jc_sb col_1'>
                    <View className='d_flex fd_c'>
                        {
                            atype === 1 ?
                            <Text className='default_label c33_label fw_label dup_per_txt'>{courseList.courseName}</Text>
                        :
                            <Text className={on ? 'default_label tip_label fw_label dup_per_txt' : 'default_label c33_label fw_label dup_per_txt'}>{courseList.courseName}</Text>
                        }
                        <Text className='sml_label tip_label dup_per_txt'>{summary}</Text>
                    </View>
                    {
                         courseList.payType >0 ?
                         <Text className='red_label sm_label mt_3'>{courseList.integral}学分</Text>
                         :
                         <Text className='red_label sm_label mt_3'>免费</Text>
                         
                        // courseList.payType ==1 ?
                        // <Text className='red_label sm_label mt_3'>{courseList.integral}学分</Text>
                        // :courseList.payType ==0 ?
                        // <Text className='red_label sm_label mt_3'>免费</Text>
                        // :null
                        // :courseList.payType ==2 ?
                        // <Text className='red_label sm_label mt_3'>¥{courseList.courseCash}</Text>
                        // :courseList.payType ==3 ?
                        // <Text className='red_label sm_label mt_3'>¥{courseList.courseCash}+{courseList.integral}学分</Text>
                        // :null
                    }
                    
                    <View className='d_flex fd_r ai_ct mt_5 '>
                        {
                            courseList.teacherId > 0 ?
                            <View className='d_flex fd_r ai_ct mr_15'>
                                <Image src={asset.per_icon} className='item_head_cover' />
                                <Text className='sm_label c33_label ml_5'>{courseList.teacherName}</Text>
                            </View>
                        :null}
                        <View className='view_play d_flex fd_r ai_ct '>
                            <Image src={asset.pay_icon} className='view_icon' />
                            <Text className='sm_label gray_label ml_5'>{learnNum(courseList.hit)}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
