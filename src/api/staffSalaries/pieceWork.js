import request from '@/utils/request'

// 分页
export function getUserSalaryPageList(data) {
  return request({
    url: '/manager/userSalary/pageList',
    method: 'post',
    data: data
  })
}


// 审核
export function auditUserSalary(data) {
  return request({
    url: '/manager/userSalary/audit',
    method: 'put',
    data: data
  })
}
