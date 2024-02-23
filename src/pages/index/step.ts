import { reactive, ref } from 'vue'
import { take, interval, map, noop } from 'rxjs'
import { chat } from '@/utils/chat'
export class Process {
  kaichangbai = ''
  step = ref(0)
  questions: any[] = []
  state: any = {}
  commitdata: any[] = []
  extend: string = ''
  constructor(state: any) {
    this.state = state
  }
  initQuestions(data: any) {
    const { kaichangbai, list } = data
    this.kaichangbai = kaichangbai
    this.questions = list.filter((item: any) => item.groupId === 3)
    console.log('list', this.questions)
    this.init()
  }
  add(data: any = {}) {
    const row = reactive({
      role: 'assistant',
      content: '',
      loading: true,
      ...data
    })
    this.state.chatList.push(row)
    return row
  }
  textToStream(target: any, text: string, options: {
    after?: Function
  } = {}) {
    const timer = 50
    return interval(timer)
      .pipe(take(text.length), map(index => {
        return text.substring(index, index + 1)
      }))
      .subscribe({
        next: (char: any) => {
          target.content += char
        },
        complete: () => {
          target.loading = false
          options.after && options.after()
        }
      })
  }
  init() {
    const introduce = this.add({
      first: true
    })
    this.step.value = 0;
    this.commitdata = []
    this.textToStream(introduce, this.kaichangbai, {
      after: () => {
        this.next()
      }
    })
  }

  refresh() {
    this.step.value = 0;
    this.commitdata = []
    this.init()
  }

  next(after: Function = noop) {
    if (this.isLast()) {
      this.submit()
      return
    }
    this.step.value++
    const step = this.step.value
    const data = this.questions[step - 1]
    const row = this.add(data)
    this.textToStream(row, data.question, {
      after
    })
  }

  isLast() {
    return this.step.value >= this.questions.length
  }

  async submit(message: string = '') {
    if (this.state.tokenNum === 0) {
      uni.showToast({
        icon: 'error',
        title: '聊天次数不足,请分享获取聊天次数',
      })
      return
    }
    const item = reactive({
      role: 'assistant',
      content: '',
      loading: true,
      error: false,
      last: true
    })
    this.state.chatList.push(item)
    chat({
      data: this.commitdata,
      message
    },
      {
        onMessage: (data: any) => {
          const { choices = [] } = data
          const { delta = {} } = choices[0]
          const { content = '' } = delta
          if (!content)
            return
          item.content += content
        },
        success: noop,
        fail: () => {
          item.loading = false
          item.error = true
          this.step.value++
        },
        complete: () => {
          item.loading = false
          item.error = false
          this.step.value++
          this.state.tokenNum--
        }
      })
  }
}