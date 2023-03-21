import request from '@/utils/request'


// 查询车间下拉列表
export function getWorkshopSelectList() {
  return request({
    url: '/manager/workshop/selectList',
    method: 'get'
  })
}



export function getWorkshopPageList(data) {
  return request({
    url: '/manager/workshop/pageList',
    method: 'post',
    data: data
  })
}

// 新增
export function addWorkshop(data) {
  return request({
    url: '/manager/workshop/add',
    method: 'post',
    data: data
  })
}

// 编辑
export function editWorkshop(data) {
  return request({
    url: '/manager/workshop/edit',
    method: 'put',
    data: data
  })
}

// 启用/禁用
export function eableWorkshop(data) {
  return request({
    url: '/manager/workshop/eable',
    method: 'put',
    data: data
  })
}

// 删除
export function deleteWorkshop(id) {
  return request({
    url: `/manager/workshop/${id}`,
    method: 'delete'
  })
}
