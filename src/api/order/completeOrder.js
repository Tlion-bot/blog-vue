import request from '@/utils/request'

// 分页
export function getCompleteOrderPageList(data) {
  return request({
    url: '/manager/dispatchOrder/pageListWork',
    method: 'post',
    data: data
  })
}

// 查看工序编号
export function getWorkProcedureCode(params) {
  return request({
    url: '/manager/dispatchOrder/workProcedureCode',
    method: 'get',
    params
  })
}


// 报工
export function reportWork(data) {
  return request({
    url: '/manager/dispatchOrder/workCode',
    method: 'put',
    data
  })
}

// 审核
export function auditDispatchOrder(data) {
  return request({
    url: '/manager/dispatchOrder/audit',
    method: 'put',
    data: data
  })
}

// 删除
export function deleteDispatchOrder(id) {
  return request({
    url: `/manager/dispatchOrder/${id}`,
    method: 'delete'
  })
}
