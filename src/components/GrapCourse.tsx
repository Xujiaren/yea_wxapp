import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image} from '@tarojs/components'

import '../config/theme.css'
import './GrapCourse.less'
import asset from '../config/asset'
import {learnNum,subNumTxt} from '../utils/common'

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
        galleryList: Array<{
            fpath:string,
        }>,
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
        comment:number,
        collectNum:number,

    },
}

type State = {

}



export default class GrapCourse extends Component<Props,State> {


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
        const {courseList} = this.props

        return (
            <View className='itemw d_flex fd_c' >
                {
                    courseList.ttype ===  2 ?
                    <View>
                        <Image src={courseList.galleryList[0].fpath} className='grap_imgs_cover' />
                    </View>
                : null}

                <Text className='lg_label c33_label fw_label '>{subNumTxt(courseList.courseName,36)}</Text>

                {
                    courseList.ttype === 0 ?
                    <Text className='lh20_label default_label gray_label mt_10'>{subNumTxt(courseList.summary,40)}</Text>
                : null}
                {
                    courseList.ttype === 0 || courseList.ttype === 2 ?
                    <View className='d_flex fd_r ai_ct mt_10 '>
                        <View className='d_flex fd_r ai_ct mr_10'>
                            <Image src={asset.evals_icon} className='item_head_cover' />
                            <Text className='sm_label c33_label ml_5'>{learnNum(courseList.comment)}</Text>
                        </View>
                        <View className='view_play d_flex fd_r ai_ct'>
                            {/* <Image src={asset.collect_icon} className='view_icon' /> */}
                            <Image src={asset.view_icon} className='view_icon' />
                            {/* <Text className='sm_label gray_label ml_5'>{courseList.collectNum}</Text> */}
                            <Text className='sm_label gray_label ml_5'>{courseList.hit}</Text>
                        </View>
                    </View>
                : null}

                {
                    courseList.ttype === 1 ?
                    <View className='d_flex fd_r jc_sb mt_10 '>
                        {
                            courseList.galleryList.map((img,i)=>{
                                return (
                                    <Image src={img.fpath}  className='grap_img_cover'  key={'img' + i}/>
                                );
                            })
                        }
                    </View>
                : null}

                {
                    courseList.ttype === 3 ?
                    <View className='d_flex fd_r mt_10'>
                        <View className='d_flex fd_c col_1 jc_sb'>
                            <Text className='default_label gray_label lh20_label'>{ subNumTxt(courseList.summary,23)}</Text>
                            <View className='d_flex fd_r ai_ct mt_10 '>
                                <View className='d_flex fd_r ai_ct mr_10'>
                                    <Image src={asset.evals_icon} className='item_head_cover' />
                                    <Text className='sm_label c33_label ml_5'>{learnNum(courseList.comment)}</Text>
                                </View>
                                <View className='view_play d_flex fd_r ai_ct'>
                                    {/* <Image src={asset.collect_icon} className='view_icon' /> */}
                                    <Image src={asset.view_icon} className='view_icon' />
                                    {/* <Text className='sm_label gray_label ml_5'>{courseList.collectNum}</Text> */}
                                    <Text className='sm_label gray_label ml_5'>{courseList.hit}</Text>
                                </View>
                            </View>
                        </View>
                        <Image src={courseList.galleryList[0].fpath} className='grap_per_img ml_15' />
                    </View>
                : null}
        </View>
        )
    }
}
