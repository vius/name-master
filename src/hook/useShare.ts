import request from '@/utils/request'
const useShare = (): any => {
  const updateShareTimes = async () => {
    await request({
      url: 'share'
    })
  }
  const getShareMessage = () => {
    updateShareTimes()
    return {
      title: '网名匠，AI赋能',
      path: '/pages/index/index'
    }
  }
  return {
    getShareMessage
  }
}
export default useShare