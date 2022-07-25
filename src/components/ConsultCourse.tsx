import Taro, { Component } from '@tarojs/taro'
import { View, Text ,Image} from '@tarojs/components'

import '../config/theme.css'
import './ConsultCourse.less'
import asset from '../config/asset'
import {subNumTxt,dateDiff} from '../utils/common'

type Props = {
    articleList:{
        articleId: number,
        articleImg: string,
        atype: number,
        canShare: number,
        categoryId: number,
        comment: number,
        content: string,
        contentId: number,
        ctype: number,
        gallery: Array<{}>,
        hit: number,
        isTop: number,
        like: false,
        likeNum:number,
        pubTime: number,
        pubTimeFt: string,
        summary: string,
        teacherId: number,
        title: string,
        ttype: number,
    },
}

type State = {
    articleList:{
        articleId: number,
        articleImg: string,
        atype: number,
        canShare: number,
        categoryId: number,
        comment: number,
        content: string,
        contentId: number,
        ctype: number,
        gallery: Array<{}>,
        hit: number,
        isTop: number,
        like: false,
        likeNum:number,
        pubTime: number,
        pubTimeFt: string,
        summary: string,
        teacherId: number,
        title: string,
        ttype: number,
    },
}



export default class ConsultCourse extends Component<Props,State> {

    static defaultProps = {
        articleList:{
            like:false,
            galleryList:[],
            childList:[],
        }
    }


    constructor () {
        super(...arguments)

        let articleList = this.props.articleList;
        this.state = {
            articleList:articleList
        }

    }
    componentWillReceiveProps (nextProps) {
        const {articleList} = nextProps
        if(articleList!==this.props.articleList){
            this.setState({
                articleList
            })
        }
    }
    componentWillMount () { }

    componentDidMount () {

     }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }



   

    render () {
        const {articleList} = this.state

        return (
            <View className='item  d_flex fd_c'>
                    {
                        articleList.ttype ===  0 ?
                        <View className='gray_cover'>
                            {
                                articleList.gallery.map((img:any,i)=>{
                                    if(i==0)
                                        return (
                                            <Image src={img.fpath}  className='grap_imgs_cover'  key={'img' + i}/>
                                        );
                                })
                            }
                            {/* <Image src={articleList.articleImg} className='grap_imgs_cover' /> */}
                            <View className='graylay'>
                                {
                                    articleList.isTop === 1 ? 
                                    <Image src={asset.istop} className='grayisTop  ml_15' />
                                :null}
                                <Text className='fw_label white_label default_label ml_5 wordText'>{ subNumTxt(articleList.title,16)}</Text>
                            </View>
                        </View>
                    : null}
                    {
                        articleList.ttype === 1 ?
                        <View className={articleList.isTop === 1 ? 'recomm_title txtindent' : 'recomm_title'}>
                            {
                                articleList.isTop === 1 ? 
                                <Image src={asset.istop} className='istopCover mr_5' /> 
                            :null}
                            <Text className='lg_label c33_label fw_label wordText'>{subNumTxt(articleList.title,36)}</Text>
                        </View>
                    :null}
                    {
                        articleList.ttype === 1 ?
                        <View className='d_flex fd_r jc_sb pb_5 mt_10'>
                            {
                                articleList.gallery.map((img:any,i)=>{
                                    return (
                                        <Image src={img.fpath}  className='grap_img_cover'  key={'img' + i}/>
                                    );
                                })
                            }
                        </View>
                    : null}
                    {
                        articleList.ttype === 0 || articleList.ttype === 1 ?
                        <View className='d_flex fd_r ai_ct mt_5 '>
                            <View className='d_flex fd_r ai_ct mr_10'>
                                <Image src={asset.evals_icon} className='item_head_cover' />
                                <Text className='sm_label c33_label ml_5'>{articleList.comment}</Text>
                            </View>
                            <View className='view_play d_flex fd_r ai_ct mr_10'>
                                <Image src={asset.view_icon} className='view_icon' />
                                <Text className='sm_label gray_label ml_5'>{articleList.hit}</Text>
                            </View>
                            <View className='view_play d_flex fd_r ai_ct'>
                                <Image src={asset.vant_on} className='view_icons' />
                                <Text className='sm_label gray_label ml_5'>{articleList.likeNum}</Text>
                            </View>
                            <Text className='sm_label tip_label pl_10'>{dateDiff(articleList.pubTime)}</Text>
                        </View>
                    :null}


                    {
                        articleList.ttype === 2 ?
                        <View className='d_flex fd_r '>
                            <View className='d_flex fd_c col_1 jc_sb'>
                                <View className={articleList.isTop === 1 ? 'recomtit txtindent' : 'recomtit'}>
                                    {
                                        articleList.isTop === 1 ?
                                        <Image src={asset.istop} className='recomtitCover mr_5 ' />         
                                    :null}
                                    
                                    <Text className='lg_label c33_label fw_label wordText '>{ subNumTxt(articleList.title,18)}</Text>
                                </View>
                                <View className='d_flex fd_r ai_ct mt_5 '>
                                    <View className='d_flex fd_r ai_ct mr_10'>
                                        <Image src={asset.evals_icon} className='item_head_cover' />
                                        <Text className='sm_label c33_label ml_5'>{articleList.comment}</Text>
                                    </View>
                                    <View className='view_play d_flex fd_r ai_ct mr_10'>
                                        <Image src={asset.view_icon} className='view_icon' />
                                        <Text className='sm_label gray_label ml_5'>{articleList.hit}</Text>
                                    </View>
                                    <View className='view_play d_flex fd_r ai_ct'>
                                        <Image src={asset.collect_icon} className='view_icon' />
                                        <Text className='sm_label gray_label ml_5'>{articleList.likeNum}</Text>
                                    </View>
                                    <Text className='sm_label tip_label pl_10'>{dateDiff(articleList.pubTime)}</Text>
                                </View>
                            </View>
                            {
                                articleList.gallery.map((img:any,i)=>{
                                    if(i==0)
                                        return (
                                            <Image src={img.fpath}  className='grap_per_img ml_15'  key={'img' + i}/>
                                        );
                                })
                            }
                            {/* <Image src={articleList.articleImg} className='grap_per_img ml_15' /> */}
                        </View>
                    : null}
                </View>
        )
    }
}



