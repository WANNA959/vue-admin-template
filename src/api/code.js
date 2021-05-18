import request from '@/utils/request'

export function fetchDbList(query) {
  return request({
    url: '/api/db/getDbList',
    method: 'get',
    params: query
  })
}

export function deleteDbItem(query) {
  return request({
    url: '/api/db/deleteDbItem',
    method: 'post',
    params: query
  })
}

export function updateDbItem(query) {
  return request({
    url: '/api/db/updateDbItem',
    method: 'post',
    params: query
  })
}

export function insertDbItem(query) {
  return request({
    url: '/api/db/insertDbItem',
    method: 'post',
    params: query
  })
}

export function batchExport(query) {
  return request({
    url: '/api/db/getinfo',
    method: 'get',
    params: query
  })
}

export function batchInsert(query) {
  return request({
    url: '/api/db/dbinsert',
    headers: {
      'Content-Type': 'multipart/form-data',
      'test': 'hello'
    },
    method: 'post',
    data: query
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
    url: '/api/db/getList',
    method: 'get',
    params: query
  })
}

export function downloadItem(query) {
  return request({
    url: '/api/db/downloadItem',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function deleteItem(query) {
  return request({
    url: '/api/db/deleteItem',
    method: 'post',
    params: query
  })
}
