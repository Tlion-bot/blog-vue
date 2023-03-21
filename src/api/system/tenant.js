import request from '@/utils/request'

// 列表
export function tenantList(data) {
  return request({
    url: '/system/tenant/list',
    method: 'post',
    data
  })
}

// 工厂下拉列表
export function tenantSelectList() {
  return request({
    url: '/system/tenant/selectList',
    method: 'get'
  })
}

// 新增
export function tenantAdd(data) {
  return request({
    url: '/system/tenant',
    method: 'post',
    data: data
  })
}

// 修改
export function tenantEdit(data) {
  return request({
    url: '/system/tenant',
    method: 'put',
    data: data
  })
}

// 删除
export function tenantDel(ids) {
  return request({
    url: '/system/tenant/' + ids,
    method: 'delete'
  })
}

// 详情
export function tenantDetail(id) {
  return request({
    url: '/system/tenant/' + id,
    method: 'get'
  })
}

// 修改状态
export function tenantChangeStatus(data) {
  return request({
    url: '/system/tenant/changeStatus',
    method: 'put',
    data: data
  })
}
