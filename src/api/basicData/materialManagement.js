import request from '@/utils/request'


// 查询下拉列表
export function getProductCategorySelectList() {
  return request({
    url: '/manager/productCategory/selectList',
    method: 'get'
  })
}


// 分页
export function getProductCategoryPageList(data) {
  return request({
    url: '/manager/productCategory/pageList',
    method: 'post',
    data: data
  })
}

// 新增
export function addProductCategory(data) {
  return request({
    url: '/manager/productCategory/add',
    method: 'post',
    data: data
  })
}

// 编辑
export function editProductCategory(data) {
  return request({
    url: '/manager/productCategory/edit',
    method: 'put',
    data: data
  })
}

// 启用/禁用
export function eableProductCategory(data) {
  return request({
    url: '/manager/productCategory/eable',
    method: 'put',
    data: data
  })
}

// 删除
export function deleteProductCategory(id) {
  return request({
    url: `/manager/productCategory/${id}`,
    method: 'delete'
  })
}
