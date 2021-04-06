import request from '@/utils/request'

export function login(data) {
  console.log(data)
  return request({
    url: '/oauth/login',
    method: 'post',
    params: data
  })
}

export function authToken(data) {
  const form = {
    username: data.username,
    password: data.password,
    code: data.code,
    rememberme: data.rememberme,
    grant_type: 'password',
    client_id: 'client_1',
    client_secret: '123456'
  }
  return request({
    url: '/oauth/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      // 'Authorization': 'Basic dGVzdF9jbGllbnQ6dGVzdF9zZWNyZXQ='
    },
    method: 'post',
    params: form
  })
}

export function getInfo(token) {
  return request({
    url: '/oauth/user',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/oauth/logout',
    method: 'get'
  })
}

export function getVerifySrcApi() {
  return request({
    url: '/oauth/kaptcha',
    method: 'get',
    responseType: 'blob'
    // params: { id: '1' }
  })
}

export function register(userInfo) {
  return request({
    url: '/oauth/register',
    method: 'post',
    params: { username: userInfo.username, password: userInfo.password, email: userInfo.email, code: userInfo.code }
  })
}

export function resetpass(data) {
  return request({
    url: '/oauth/reset',
    method: 'post',
    params: { userId: data.userId, code: data.code, pass: data.password, checkPass: data.checkPassword }
  })
}

export function forget(data) {
  return request({
    url: '/oauth/forget',
    method: 'get',
    params: { email: data.email, code: data.code }
  })
}

export function activation(userId, code) {
  return request({
    url: '/oauth/activation/' + userId + '/' + code,
    method: 'get',
  })
}
