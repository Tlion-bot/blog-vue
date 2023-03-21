import request from '@/utils/request'


// 分页
export function getProcedureFieldPageList(data) {
  return request({
    url: '/manager/procedureField/pageList',
    method: 'post',
    data: data
  })
}

// 新增
export function addProcedureField(data) {
  return request({
    url: '/manager/procedureField/add',
    method: 'post',
    data: data
  })
}

// 编辑
export function editProcedureField(data) {
  return request({
    url: '/manager/procedureField/edit',
    method: 'put',
    data: data
  })
}

// 启用/禁用
export function eableProcedureField(data) {
  return request({
    url: '/manager/procedureField/eable',
    method: 'put',
    data: data
  })
}

// 删除
export function deleteProcedureField(id) {
  return request({
    url: `/manager/procedureField/${id}`,
    method: 'delete'
  })
}
