import { USER_INFO, USER_LOGIN, USER_LOGOUT } from '../constants/user'

const INITIAL_STATE = {
  user: {}
}

export default function cate(state = INITIAL_STATE, action) {
  switch(action.type) {
    case USER_INFO:
      return {
        ...state
      }
    case USER_LOGIN:
      return {
        ...state
      }
    case USER_LOGOUT:
      return {
        ...INITIAL_STATE
      }
    default:
      return state
  }
}
