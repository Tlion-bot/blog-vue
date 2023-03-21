import request from '@/utils/request'

// 分页
export function getCustomerOrderPageList(data) {
  return request({
    url: '/manager/customerOrder/pageList',
    method: 'post',
    data: data
  })
}

// 新增
export function addCustomerOrder(data) {
  return request({
    url: '/manager/customerOrder/add',
    method: 'post',
    data: data
  })
}

// 编辑
export function editCustomerOrder(data) {
  return request({
    url: '/manager/customerOrder/edit',
    method: 'put',
    data: data
  })
}


// 删除
export function deleteCustomerOrder(id) {
  return request({
    url: `/manager/customerOrder/${id}`,
    method: 'delete'
  })
}

// 详情
export function getCustomerOrderDetail(id) {
  return request({
    url: `/manager/customerOrder/${id}`,
    method: 'get'
  })
}

// 出库
export function outCustomerOrder(data) {
  return request({
    url: '/manager/customerOrder/out',
    method: 'put',
    data: data
  })
}
