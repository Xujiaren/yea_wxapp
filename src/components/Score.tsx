import Taro, { Component } from '@tarojs/taro'
import { View,Image} from '@tarojs/components'


import './Score.less'
import asset from '../config/asset'

type Props = {
    val:number,

}

type State = {

}

export default class Score extends Component<Props, State> {


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
        return (
            <View className='tabswrap'>
                {
                    [1, 2, 3, 4, 5].map((vall, index) => {
                        let on = vall <= val;
                        return (
                            <Image key={'star'+index} src={on ?  asset.star_full : asset.star}  className='star_icon' />
                        )
                    })
                }
            </View>
        )
    }
}


