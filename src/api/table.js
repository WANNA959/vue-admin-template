import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/hello',
    method: 'get',
    params
  })
}
