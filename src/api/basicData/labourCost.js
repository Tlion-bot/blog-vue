import request from '@/utils/request'

// 分页
export function getProductProcedureLabourPageList(data) {
  return request({
    url: '/manager/productProcedureLabour/pageList',
    method: 'post',
    data: data
  })
}

// 新增
export function addProductProcedureLabour(data) {
  return request({
    url: '/manager/productProcedureLabour/add',
    method: 'post',
    data: data
  })
}

// 编辑
export function editProductProcedureLabour(data) {
  return request({
    url: '/manager/productProcedureLabour/edit',
    method: 'put',
    data: data
  })
}


// 删除
export function deleteProductProcedureLabour(id) {
  return request({
    url: `/manager/productProcedureLabour/${id}`,
    method: 'delete'
  })
}
