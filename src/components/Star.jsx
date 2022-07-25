import Taro, { Component } from '@tarojs/taro'
import { View,Image} from '@tarojs/components'


import './Star.less'
import asset from '../config/asset'


export default class Star extends Component {


    constructor () {
        super(...arguments)
        let score = this.props.score;

        let canChoose = false;
        if (this.props.onChoose) {
			canChoose = true;
        }

        this.state = {
            value: 0,
			canChoose: canChoose,
        }
        this._onChoose = this._onChoose.bind(this);

    }

    componentWillMount () { }

    componentDidMount () { }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }


    _onChoose(val) {
		this.setState({
			value: val
		}, () => {
			this.props.onChoose && this.props.onChoose(val);
		})
	}


    render () {

        return (
            <View className='tabswrap'>
                {
                    [1, 2, 3, 4, 5].map((val, index) => {
                        let on = val <= this.state.value;
                        if (this.state.canChoose) {
							return (
                                <Image key={'star'+index} src={on ?  asset.star_full : asset.star}  className='star_icon' onClick={() => this._onChoose(val)} />
                            )
                        }
                    })
                }

            </View>
        )
    }
}


Star.defaultProps = {
	value: 5,
	fontSize: 14
};