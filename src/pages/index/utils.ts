import request from '@/utils/request'
import { reactive, computed, nextTick } from "vue";
// @ts-ignore
import MarkdownIt from 'markdown-it/dist/markdown-it.min.js'
const md = new MarkdownIt();
export const getMarkdownText = (content: string) => {
  let htmlStr = content || ''
  try {
    // console.log('content', content)
    htmlStr = md.render(content)
  } catch (e) {
    console.error(e)
  }
  return htmlStr || content
}

export const getContentById = async (data: any) => {
  const res: any = await request({
    url: 'getchatcontent',
    data
  })
  const { chatId = '', promptId = '' } = res
  data.chatId = chatId
  data.promptId = promptId
  return res
}


export const useChat = () => {
  const state: any = reactive({
    chatList: [],
    tokenNum: '',
    message: '',
    scrollTop: 0,
    timeCycleMap: [],
    timeCycle: 0,
    pickerIndex: 0
  })
  const isLoading = computed(() => {
    return state.chatList.some((item: any) => !!item.loading)
  })
  const canSendMessage = computed(() => {
    return state.message && !isLoading.value
  })
  const scrollTobBottom = () => {
    nextTick(() => {
      const query = uni.createSelectorQuery()
      const node = query.select('.scroll-y-container')
      if (node) {
        node.boundingClientRect((data: any) => {
          console.log('height', data)
          console.log('state.scrollTop', state.scrollTop)
          // const height = data.height
          // state.scrollTop = height + 24
        }).exec();
      }
    })
  }
  const updateRequestNum = async () => {
    const { tokenNum = 0 } = await request({
      url: 'getUserInfo'
    })
    state.tokenNum = tokenNum
  }
  return {
    state,
    canSendMessage,
    isLoading,
    scrollTobBottom,
    updateRequestNum
  }
}