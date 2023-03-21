import request from '@/utils/request'

// 分页
export function getProductionOrderPageList(data) {
  return request({
    url: '/manager/productionOrder/pageList',
    method: 'post',
    data: data
  })
}

// 新增
export function addProductionOrder(data) {
  return request({
    url: '/manager/productionOrder/add',
    method: 'post',
    data: data
  })
}

// 编辑
export function editProductionOrder(data) {
  return request({
    url: '/manager/productionOrder/edit',
    method: 'put',
    data: data
  })
}

// 详情
export function getProductionOrderDetail(id) {
  return request({
    url: `/manager/productionOrder/${id}`,
    method: 'get'
  })
}


// 调单
export function transferProductionOrder(data) {
  return request({
    url: '/manager/productionOrder/transfer',
    method: 'put',
    data: data
  })
}


// 审核
export function auditProductionOrder(data) {
  return request({
    url: '/manager/productionOrder/audit',
    method: 'put',
    data: data
  })
}

// 审核不通过
export function auditBackProductionOrder(data) {
  return request({
    url: '/manager/productionOrder/auditBack',
    method: 'put',
    data: data
  })
}


// 启用工序
export function enableProcedure(data) {
  return request({
    url: '/manager/productionOrder/enableProcedure',
    method: 'put',
    data: data
  })
}

// 取消工序
export function cancelProcedure(data) {
  return request({
    url: '/manager/productionOrder/cancelProcedure',
    method: 'put',
    data: data
  })
}


// 删除
export function deleteProductionOrder(id) {
  return request({
    url: `/manager/productionOrder/${id}`,
    method: 'delete'
  })
}

// 查看工序库存
export function getProductStockList(data) {
  return request({
    url: '/manager/productionOrder/productStockList',
    method: 'post',
    data: data
  })
}

// 查看工序库存详情
export function getProductionOrderProcedureDetail(id) {
  return request({
    url: `/manager/productionOrder/procedure/${id}`,
    method: 'get'
  })
}

// 锁定工序库存
export function enableProcedureStock(data) {
  return request({
    url: '/manager/productionOrder/enableProcedureStock',
    method: 'put',
    data: data
  })
}

// 释放工序库存
export function cancelProcedureStock(data) {
  return request({
    url: '/manager/productionOrder/cancelProcedureStock',
    method: 'put',
    data: data
  })
}
