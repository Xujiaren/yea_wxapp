import Taro, { Component } from '@tarojs/taro'
import { View, Text} from '@tarojs/components'
import '../config/theme.css'
import './DateTime.less'

export default class DateTime extends Component {
    config = {
        navigationBarTitleText: ''
    }
    constructor () {
        super(...arguments)
        this.state = {
            datetime:false,
            day:'',
            hour:'',
            min:'',
            sec:'',
        }
    }
    componentWillMount () {
        this.timer = setInterval(() => {
            this.getCountDown(this.props.refs);
            var nowTime = new Date();
            var endTime = new Date(this.props.refs * 1000);
            var t = endTime.getTime() - nowTime.getTime();
            if(t<1){
                clearInterval(this.timer);
                this.setState({
                    datetime:true
                })
                this.props.datecall();
            }
        }, 1000);
    }

    componentDidMount () { 
    }

    componentWillUnmount () {
        clearInterval(this.timer);
    }

    componentDidShow () { }

    componentDidHide () { }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    getCountDown(timestamp){
        var nowTime = new Date();
        var endTime = new Date(timestamp * 1000);
        var t = endTime.getTime() - nowTime.getTime();
        var d=Math.floor(t/1000/60/60/24);
        var hour=Math.floor(t/1000/60/60%24);
        var min=Math.floor(t/1000/60%60);
        var sec=Math.floor(t/1000%60);
        if (hour < 10) {
                hour = "0" + hour;
        }
        if (min < 10) {
                min = "0" + min;
        }
        if (sec < 10) {
                sec = "0" + sec;
        }
        const datetimes = d +'天'+' '+ hour + ":" + min + ":" + sec;
        
        this.setState({
            day:d,
            hour:hour,
            min:min,
            sec:sec,
        })
    }

    render(){
        const {datetime} = this.state
        return(
            <View>
                {
                    datetime ? 
                    null :
                    <View className='wrap d_flex fd_r ai_ct'>
                        <Text className='white_label default_label ml_5 mr_5'>{day}天</Text>
                        <View className='wrap_item'>
                            <Text  className='white_label sm_label'>{hour}</Text>
                        </View>
                        <Text className='white_label sm_label fw_label mr_2 ml_2'>:</Text>
                        <View className='wrap_item'>
                            <Text className='white_label sm_label'>{min}</Text>
                        </View>
                        <Text className='white_label sm_label fw_label ml_2 mr_2'>:</Text>
                        <View className='wrap_item'>
                            <Text className='white_label sm_label'> {sec}</Text>
                        </View>
                    </View>
                }
            </View>
        )
    }
}