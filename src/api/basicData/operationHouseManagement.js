import request from '@/utils/request'

//查询分页列表
export function pageList(data){
    return request({
        url:'/manager/pwm/pageList',
        method:'post',
        data:data
    })
}
//删除
export function deletem(id){
    return request({
        url:`/manager/productCategory/${id}`,
        method:'delete'
    })
}
//产品工序库存
export function getProductStock(id) {
    return request({
      url: `/manager/pwm/info/${id}`,
      method: 'get'
     
    })
}
// 获取产品分页
export function getProductPageList(data) {
    return request({
      url: '/manager/pwm/oductionOrderPageList',
      method: 'post',
      data: data
    })
}
// 出库
export function outCustomerOrder(data) {
    return request({
      url: '/manager/pwm/outbound',
      method: 'post',
      data: data
    })
  }