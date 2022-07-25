import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image} from '@tarojs/components'

import '../config/theme.css'
import './RowCourse.less'
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
    }
}

type State = {

}


export default class RowCourse extends Component<Props, State> {


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
        let {courseList} = this.props
        
        return (
            <View className='plate_item d_flex fd_c mb_15'>
                <View className='item_cover_cons'>
                    <Image src={courseList.courseImg} className='platerows_img' />
                    <View className='item_tips_hit'>
                        <Image src={asset.cover_tips_icon}  className='item_hit_cover' />
                        <Text className='sm8_label white_label mt_3'>{courseList.chapter}讲</Text>
                    </View>
                </View>
                <View className='d_flex fd_c'>
                    <View className='item_text'>
                        <Text className='default_label c33_label fw_label' >{courseList.courseName}</Text>
                    </View>
                    <View className='recom_bg'>
                        <Text className='sml_label tip_label'>{courseList.summary}</Text>
                    </View>
                    {
                        courseList.paytype > 0 ?
                        <Text className='red_label sm_label mt_3'>{courseList.integral}学分</Text>
                        :
                        <Text className='red_label sm_label mt_3'>免费</Text>
                    }
                    <View className='d_flex fd_r ai_ct jc_sb mt_5'>
                        {
                            courseList.teacherId > 0 ?
                            <View className='d_flex fd_r ai_ct'>
                                <Image src={asset.per_icon} className='item_head_cover' />
                                <Text className='sm_label c33_label ml_5'>{courseList.teacherName}</Text>
                            </View>
                        :null}
                        <View className='view_play d_flex fd_r ai_ct'>
                            <Image src={asset.pay_icon} className='view_icon' />
                            <Text className='sm_label gray_label ml_5'>{learnNum(courseList.hit)}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
