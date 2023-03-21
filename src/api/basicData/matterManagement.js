import request from '@/utils/request'

//查询分页列表
export function pageList(data){
    return request({
        url:'/manager/materialCategory/pageList',
        method:'post',
        data:data
    })
}
//新增
export function add(data){
    return request({
        url:'/manager/materialCategory/add',
        method:'post',
        data:data
    })
}
//编辑
export function edit(data){
    return request({
        url:'/manager/materialCategory/edit',
        method:'put',
        data:data
    })
}
//启用/禁用
export function eablematerial(data){
    return request({
        url:'/manager/materialCategory/eable',
        method:'put',
        data:data
    })
}
//删除
export function deletem(id){
    return request({
        url:`/manager/materialCategory/${id}`,
        method:'delete'
    })
}
//保存表格
export function addtable(data){
    return request({
        url:'/manager/storage/add',
        method:'post',
        data:data
    })
}
//物料采购查询分页
export function materList(data){
    return request({
        url:'/manager/storageProduct/pageList',
        method:'post',
        data:data
    })
}
//查询下拉物料列表
export function getMatterCategorySelectList(){
    return request({
      url: '/manager/materialCategory/selectList',
      method: 'get'
    })
}
//生成订单编号
export function getGenerateNum(){
    return request({
        url: '/manager/storage/generateNum',
      method: 'get'
    })
}
//物料采购编辑
export function getMatterEdit(data){
    return request({
        url:'/manager/storageProduct/edit',
        method:'put',
        data:data
    })
}
//确认入库
export function confirm(data){
    return request({
        url:'/manager/storageProduct/confirm',
        method:'put',
        data:data
    })
}

