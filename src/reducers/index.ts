import { combineReducers } from 'redux'
import home from './home'
import user from './user'
import mail from './mail'

export default combineReducers({
  home,
  user,
  mail,
})
