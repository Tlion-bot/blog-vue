import request from '@/utils/request'

// 根据id查询导入结果
export function getRusultByMessageId(id) {
  return request({
    url: `/manager/message/${id}`,
    method: 'get',
  })
}

// 根据id查询导入失败列表
export function getFailRusultByMessageId(id) {
  return request({
    url: `/manager/importFailRecord/getImportFailList?messageId=${id}`,
    method: 'get'
  })
}

// 下载模板
export function downloadTemplate(fileName) {
  return request({
    url: `/common/download/importTemplate?fileName=${fileName}`,
    method: 'get',
    responseType: 'blob'
  })
}
