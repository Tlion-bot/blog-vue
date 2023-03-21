import request from '@/utils/request'

// 分页
export function getDispatchOrderPageList(data) {
  return request({
    url: '/manager/dispatchOrder/pageListDispatch',
    method: 'post',
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

// 用户派工
export function workUser(data) {
  return request({
    url: '/manager/dispatchOrder/workUser',
    method: 'put',
    data: data
  })
}

// 批量用户派工
export function workUserBatch(data) {
  return request({
    url: '/manager/dispatchOrder/workUserBatch',
    method: 'put',
    data: data
  })
}

// 分派工序详情
export function getWorkProcedureDetail(id) {
  return request({
    url: `/manager/dispatchOrder/workProcedureList/${id}`,
    method: 'get'
  })
}

// 获取导出工序编号列表
export function getPrintWorkCodeList(id) {
  return request({
    url: `/manager/dispatchOrder/printWorkCode/${id}`,
    method: 'get'
  })
}
