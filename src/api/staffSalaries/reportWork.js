import request from '@/utils/request'

// 分页
export function getWorkReportStatisticsPageList(data) {
  return request({
    url: '/manager/workReportStatistics/list',
    method: 'post',
    data: data
  })
}


// 审核
export function auditWorkReportStatistics(data) {
  return request({
    url: '/manager/workReportStatistics/examine',
    method: 'put',
    data: data
  })
}

// 计算总工资

export function salaryCalculation(data) {
  return request({
    url: '/manager/workReportStatistics/salaryCalculation',
    method: 'post',
    data: data
  })
}



// 获取信息
export function getUserInfo(name) {
  return request({
    url: `/manager/workReportStatistics/getuserInfo?name=${name}`,
    method: 'get'
  })
}
