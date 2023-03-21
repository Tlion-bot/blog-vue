import request from '@/utils/request'

// 更新时间
export function getLastUpdateTime(data) {
  return request({
    url: '/manager/index/getLastUpdateTime',
    method: 'post',
    data
  })
}


// 经营状况
export function getGeneralSituation(data) {
  return request({
    url: '/manager/index/generalSituation',
    method: 'post',
    data
  })
}


// 订单工序进度
export function getDispatchIndexPageList(data) {
  return request({
    url: '/manager/index/dispatchIndexPageList',
    method: 'post',
    data
  })
}


// 商品top10销量排行榜
export function getProductTop10List(data) {
  return request({
    url: '/manager/index/productTop10',
    method: 'post',
    data
  })
}


// 经营走势
export function getTrendData(data) {
  return request({
    url: '/manager/index/trendByYearMonth',
    method: 'post',
    data
  })
}


// 员工报工统计排行
export function getStaffStatisticsList(data) {
  return request({
    url: '/manager/index/indexDispatchStatistics',
    method: 'post',
    data
  })
}
