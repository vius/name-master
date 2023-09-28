const env = import.meta.env
export const apiMap: any = {
  baseinfo: 'qm/api/baseinfo',  // 获取基础信息
  changeTextByBatch: 'qm/api/scene', // 换一批文案
  submit: 'qm/api/commit', // 提交数据,
  getContent: 'qm/api/content', // 获取历史信息
  login: 'qm/api/login',
  share: 'qm/api/share',
  getUserInfo: 'qm/api/info',
}

const protocol = 'https'
// const host = 'www.yongqitang.cn'
const host = 'yapi.zuoyebang.cc/mock/9171'
export const getFullUrl = (key: string) => {
  const path = apiMap[key]
  if (!path) {
    console.error('未找到相应的请求地址！')
    return
  }
  if (env.DEV) {
    return `http://localhost:5173/${path}`
  }
  const url = `${protocol}://${host}/${path}`
  return url
}