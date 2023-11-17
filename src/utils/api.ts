const env = import.meta.env
export const apiMap: any = {
  baseinfo: 'qm/api/baseinfo',  // 获取基础信息
  changeTextByBatch: 'qm/api/scene', // 换一批文案
  submit: 'qm/api/commit', // 提交数据,
  getContent: 'qm/api/content', // 获取历史信息
  login: 'qm/api/login',
  share: 'qm/api/share',
  getUserInfo: 'qm/api/info',
  getShangxiList: 'qm/api/shangxilist'
}

// const protocol = 'https'
// const host = 'www.yongqitang.cn'
const protocol = 'http'
const host = '10.250.17.13:8082/'
export const getFullUrl = (key: string) => {
  const path = apiMap[key]
  if (!path) {
    console.error('未找到相应的请求地址！')
    return
  }
  const url = `${protocol}://${host}/${path}`
  return url
}