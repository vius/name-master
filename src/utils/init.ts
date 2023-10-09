import request from '@/utils/request'
export let logined = false
const login = async () => {
  await uni.login({
    provider: 'weixin',
    onlyAuthorize: true
  }).then(async res => {
    if (res.code) {
      const data = await request({
        url: 'login',
        data: {
          code: res.code
        }
      });
      const { birth_time = 0, avatar_url = '', nick_name = '', token = '', ...rest } = data
      const user = {
        nickName: nick_name,
        avatarUrl: avatar_url,
        birthTime: birth_time,
        ...rest
      }
      uni.setStorageSync('user', user)
      uni.setStorageSync('token', token)
      logined = true
      console.log('after login', token)
      uni.$emit('afterLogin', user)
    }
  })
}
const init = async () => {
  await login()
}
export default init