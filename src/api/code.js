import request from '@/utils/request'

export function fetchDbList(query) {
  return request({
    url: '/api/code/getDbList',
    method: 'get',
    params: query
  })
}

export function deleteDbItem(query) {
  return request({
    url: '/api/code/deleteDbItem',
    method: 'post',
    params: query
  })
}

export function updateDbItem(query) {
  return request({
    url: '/api/code/updateDbItem',
    method: 'post',
    params: query
  })
}

export function insertDbItem(query) {
  return request({
    url: '/api/code/insertDbItem',
    method: 'post',
    params: query
  })
}

export function generatorMybatis(query) {
  return request({
    url: '/api/code/mybatiscode',
    method: 'get',
    params: query
  })
}

export function generatorDbDoc(query) {
  return request({
    url: '/api/doc/dbInfo',
    method: 'get',
    params: query
  })
}

export function fetchList(query) {
  return request({
    url: '/api/code/getList',
    method: 'get',
    params: query
  })
}

export function downloadItem(query) {
  return request({
    url: '/api/code/downloadItem',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function deleteItem(query) {
  return request({
    url: '/api/code/deleteItem',
    method: 'post',
    params: query
  })
}
