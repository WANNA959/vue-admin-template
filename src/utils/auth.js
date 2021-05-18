import Cookies from 'js-cookie'

const TokenKey = 'work-platform-token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, expire) {
  console.log('expire time' + expire)
  const millisecond = new Date().getTime()
  const expiresTime = new Date(millisecond + expire * 1000)
  // return Cookies.set(TokenKey, token, { expires: Math.ceil(expire / 3600) })
  return Cookies.set(TokenKey, token, { expires: expiresTime })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
