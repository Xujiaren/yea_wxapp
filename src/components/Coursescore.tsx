import Taro, { Component } from '@tarojs/taro'
import { View,Image} from '@tarojs/components'


import './Coursescore.less'
import asset from '../config/asset'

type Props = {
    val:number,

}

type State = {

}

export default class Coursescore extends Component<Props, State> {


    constructor () {
        super(...arguments)
        let score = this.props.val;

        this.state = {
            value: score,

        }

    }

    componentWillMount () { }

    componentDidMount () { }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }


    _onChoose(val) {
		this.setState({
			value: val
		})
	}


    render () {
        const {val=5} = this.props;
        // let on = vall <= val;
        let vall_before:string = ''
        let vall_after:string = ''
        let halfstar:boolean = false  
        let vall_num:number = 0 


        if(val % 1 !== 0){
            vall_before = val.toString().split('.')[0]
            vall_after =  val.toString().split('.')[1]
            if(parseInt(vall_after) >= 5){
                halfstar = true
                vall_after= (parseInt(vall_after) - 1).toString()
                vall_num = 5 -  parseInt(vall_before) - 1
            }
        } else {
            vall_before = val.toString()

        }


        return (
            <View >
                {
                    halfstar ?
                    <View className='tabswrap'>
                        {
                            [1, 2, 3, 4, 5].map((vall, index) => {
                                let on = vall <= parseInt(vall_before);
                                return (
                                    <View key={'vall'+ index}>
                                        {
                                            on ? 
                                            <Image key={'star'+index} src={asset.star_full}  className='star_icon' />
                                        :null}
                                    </View>
                                )
                            })
                        }
                        {
                            halfstar ? 
                            <View>
                                <Image src={asset.halfstar}  className='star_icon' />
                            </View>
                        :null}
                        {
                            [1, 2, 3, 4, 5].map((vall, index) => {
                                let on = vall <= vall_num;
                                return (
                                    <View key={'vall'+ index}>
                                        {
                                            on  ?
                                            <Image key={'star'+index} src={asset.star}  className='star_icon' />
                                        :null}
                                    </View>
                                    
                                )
                            })
                        }
                    </View>
                    :
                    <View className='tabswrap'>
                        {
                            [1, 2, 3, 4, 5].map((vall, index) => {
                                let on = vall <= parseInt(vall_before);
                                return (
                                    <View key={'vall'+index}>
                                        <Image key={'star'+index} src={on ? asset.star_full : asset.star}  className='star_icon' />
                                    </View>
                                )
                            })
                        }
                    </View>
                }
                
                
            </View>
        )
    }
}


