import { USER_LOGIN, USER_LOGOUT } from '../constants/user'

export const dispatchLogin = () => {
  return {
    type: USER_LOGIN
  }
}

export const dispatchLogout = () => {
  return {
    type: USER_LOGOUT
  }
}
