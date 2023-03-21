import request from '@/utils/request'

// 分页
export function getProductPageList(data) {
  return request({
    url: '/manager/product/pageList',
    method: 'post',
    data: data
  })
}

// 新增
export function addProduct(data) {
  return request({
    url: '/manager/product/add',
    method: 'post',
    data: data
  })
}

// 编辑
export function editProduct(data) {
  return request({
    url: '/manager/product/edit',
    method: 'put',
    data: data
  })
}


// 删除
export function deleteProduct(id) {
  return request({
    url: `/manager/product/${id}`,
    method: 'delete'
  })
}
