import request from '@/utils/request'


// 查询下拉列表
export function getProcedureSelectList() {
  return request({
    url: '/manager/procedure/selectList',
    method: 'get'
  })
}


// 分页
export function getProcedurePageList(data) {
  return request({
    url: '/manager/procedure/pageList',
    method: 'post',
    data: data
  })
}

// 新增
export function addProcedure(data) {
  return request({
    url: '/manager/procedure/add',
    method: 'post',
    data: data
  })
}

// 编辑
export function editProcedure(data) {
  return request({
    url: '/manager/procedure/edit',
    method: 'put',
    data: data
  })
}

// 启用/禁用
export function eableProcedure(data) {
  return request({
    url: '/manager/procedure/eable',
    method: 'put',
    data: data
  })
}

// 删除
export function deleteProcedure(id) {
  return request({
    url: `/manager/procedure/${id}`,
    method: 'delete'
  })
}
