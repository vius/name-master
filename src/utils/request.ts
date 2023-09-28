
import { getFullUrl } from './api'
const request = (params:any): any=>{
  const { url, header = {} } = params
  params.url = getFullUrl(url)
  const token = uni.getStorageSync('token')
  if(token){
    params.header = {
      ...header,
      token: token
    }
  }
  console.log('请求地址', params.url, '\n请求参数', params)
  return new Promise(async (resolve,reject)=>{
    const res: any = await uni.request(params)
    const { statusCode = 200, data: {code = 0, data = {}, msg = ''}, errMsg = '' } = res
    if(statusCode === 200 && code === 0){
      resolve(data)
    }else{
      const errorMsg = msg || errMsg
      uni.showToast({
        title: errorMsg,
        icon: 'error'
      })
      reject(errorMsg)
    }
  })
}
export default request