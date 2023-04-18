import request from '@/utils/request'

// `src/store/modules/user.js`中调用这两个方法,规定形参和后台返回值
export function login(username, password) {
  return request({
    url: '/eduservice/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/eduservice/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
