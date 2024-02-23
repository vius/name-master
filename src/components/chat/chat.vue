<template>
  <section class="page-container">
    <section class="invite">
      <view class="left">
        <view>
          <text>免费问答次数</text>
          <text class="tips">{{ state.tokenNum }}</text>
        </view>
        <view class="tips">邀请好友免费问答次数 +5</view>
      </view>
      <button open-type="share">邀请好友</button>
    </section>
    <scroll-view scroll-y class="content" enable-back-to-top :scroll-top="state.scrollTop" scroll-with-animation :enable-flex="true">
      <section class="scroll-y-container">
        <section v-for="item, index in state.chatList" :title="item.name" :key="item.id" class="message-row" :id="'message-' + index"
          :class="{ 'assistant-row': item.role === 'assistant', 'user-row': item.role === 'user', 'loading': !!item.loading && !item.content, 'error': !!item.error }">
          <section v-if="state.chatList[index - 1] && state.chatList[index - 1].last && item.last" class="divider">
            <div class="divider-text">再次生成结果</div>
          </section>
          <section v-if="state.chatList[index - 1] && item.first" class="divider">
            <div class="divider-text">新一轮对话</div>
          </section>
          <section class="row-main">
            <mp-html class="text-content" :content="getMarkdownText(item.content)"></mp-html>
            <section v-if="item.groupId === 3 && !item.loading" class="question-choose-like-text">
              <p>从下面选择您喜欢的文案</p>
              <p class="text-container">
                <mp-html class="text-content" :content="getMarkdownText(item.list[currentTextIndex])"></mp-html>
              </p>
              <p class="button-container">
                <button type="primary" size="mini" plain @click="likeText(item.list[currentTextIndex])" :disabled="index !== state.chatList.length - 1">确认</button>
                <button type="primary" size="mini" plain v-if="currentTextIndex !== 0" @click="changeCrrentTextIndex(-1)" :disabled="index !== state.chatList.length - 1">上一个</button>
                <button type="primary" size="mini" plain v-if="currentTextIndex < item.list.length - 1" @click="changeCrrentTextIndex(1)" :disabled="index !== state.chatList.length - 1">下一个</button>
                <button type="primary" size="mini" plain @click="inputText" :disabled="index !== state.chatList.length - 1">手动写入</button>
              </p>
            </section>
            <section v-if="item.last && !item.loading" class="question-choose-like-text">
              <p class="button-container">
                <button type="primary" size="mini" plain @click="submitAgain" :disabled="index !== state.chatList.length - 1">重新生成</button>
                <picker @change="(data: any) => { bindPickerChange(data, item.content) }" :value="index" :range="getNameList(item.content)">
                  <button type="primary" size="mini" plain>复制</button>
                </picker>
              </p>
            </section>
          </section>
        </section>
      </section>
    </scroll-view>
    <section class="footer">
      <uni-icons type="refresh" size="30" @click="newChat"></uni-icons>
      <uni-easyinput :suffixIcon="canSendMessage ? 'paperplane-filled' : 'paperplane'" v-model="state.message" @iconClick="sendMessage" @confirm="sendMessage" :disabled="inputDisable"></uni-easyinput>
    </section>
  </section>
  <uni-popup ref="inputDialog" :mask-click="false" class="textarea-popup">
    <section class="header">
      <p class="title">自定义文案</p>
    </section>
    <section class="main">
      <uni-easyinput type="textarea" autoHeight v-model="text" placeholder="请输入"></uni-easyinput>
    </section>
    <section class="footer">
      <button @click="close">取消</button>
      <button type="primary" @click="confirm">确认</button>
    </section>
  </uni-popup>
</template>

<script setup lang="ts">
import request from '@/utils/request'
import { ref, watch, computed, getCurrentInstance } from 'vue'
import { useChat, getMarkdownText } from '@/pages/index/utils'
import { Process } from '@/pages/index/step'
import MpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html.vue'
import { logined } from '@/utils/init'
import useShare from '@/hook/useShare'
import { onShareAppMessage, onShareTimeline, onShow } from "@dcloudio/uni-app";
const { getShareMessage } = useShare()
const { state, canSendMessage, isLoading, scrollTobBottom, updateRequestNum } = useChat()
// 分享逻辑
onShareAppMessage(getShareMessage)
onShareTimeline(getShareMessage)
const inputDisable = computed(() => {
  return isLoading.value || process.step.value < 2
})
// 获取基础步骤
const getBaseInfo = async () => {
  const data = await request({
    url: 'baseinfo'
  })
  process.initQuestions(data)
}
// 登录相关逻辑
const afterLogin = () => {
  updateRequestNum()
  getBaseInfo()
}
onShow(() => {
  if (logined) {
    updateRequestNum()
  }
})
if (logined) {
  afterLogin()
} else {
  uni.$on('afterLogin', afterLogin)
}

// 处理步骤相关
const process = new Process(state)
const currentTextIndex = ref(0)
const changeCrrentTextIndex = (lift: number) => {
  currentTextIndex.value = currentTextIndex.value + lift
}
const instance = getCurrentInstance();
// 滚动相关
watch(() => [state.chatList,currentTextIndex.value], () => {
  scrollTobBottom(instance)
}, {
  deep: true
})

const sendMessage = async () => {
  if (isLoading.value || !state.message) {
    return
  }
  state.chatList.push({
    role: 'user',
    content: state.message
  })
  if (process.step.value === 3) {
    process.commitdata.push({
      groupId: process.step.value,
      value: state.message
    })
    process.next()
  } else {
    process.submit(state.message)
  }
  state.message = ''
}
const addUserMessage = (msg: string) => {
  state.chatList.push({
    role: 'user',
    content: msg
  })
}
const likeText = (text: string = '') => {
  const data = {
    groupId: 3,
    value: text
  }
  process.commitdata.push(data)
  addUserMessage(text)
  process.next()
}
const submitAgain = () => {
  process.submit()
}
const newChat = () => {
  if (isLoading.value) {
    return
  }
  process.refresh()
  currentTextIndex.value = 0
}
const getNameList = (content: string) => {
  // 匹配 `*** ***` 包裹的内容的正则表达式
  let regex = /\*\*(.*?)\*\*/g;

  // 使用正则表达式进行匹配
  let matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  return matches
}
const bindPickerChange = (data: any, content: string) => {
  const nameList = getNameList(content)
  const index = data.detail.value * 1
  const name = nameList[index]
  uni.setClipboardData({
    data: name,
    success() {
      console.log('name', name)
    }
  })
}
const inputDialog = ref()
const text = ref('')
const inputText = () => {
  inputDialog.value.open()
}
const confirm = (data: any) => {
  if (!text.value) {
    return
  }
  likeText(text.value)
  close()
}
const close = () => {
  inputDialog.value.close()
}
</script>

<style lang="less">
uni-page-wrapper>uni-page-body {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<style lang="less" scoped>
.page-container {
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  // background-color: #f6f6f6;
  background-color: white;
  overflow: hidden;

  .invite {
    height: 54px;
    min-height: 54px;
    background: url('@/static/juxing.png') no-repeat;
    background-size: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 12px;
    box-sizing: border-box;

    .left {
      font-size: 12px;
      font-weight: 400;
      line-height: 12px;
      color: rgba(0, 0, 0, 0.6);

      text {
        margin-right: 4px;
      }

      .tips {
        color: #15BC38;
        margin-top: 5px;
      }
    }

    button {
      margin: 0;
      height: 30px;
      line-height: 30px;
      color: white;
      background: url('@/static/button-bg.png') no-repeat;
      width: 84px;
      background-size: 100%;
      font-size: 13px;

      &::after {
        border: none !important;
      }
    }
  }

  .content {
    flex: 1;
    flex-direction: column;
    overflow: auto;
    width: 100%;

    .scroll-y-container {
      padding: 6px 0 0 0;
    }

    .message-row {
      padding: 6px 12px;

      .row-main {
        // color: rgba(0, 0, 0, 0.9);
        color: rgba(56, 57, 60, 1);
        padding: 10px 14px;
        background-color: rgba(248, 247, 252, 1);
        min-width: 36px;
        text-align: center;
        border-radius: 19px 19px 19px 0;
        text-align: left;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        display: inline-block;

        uni-view {
          line-height: 24px;
          padding: 0;
          font-size: 16px;
          font-weight: 400;
        }

        .tag-container {
          margin-top: 8px;

          .tag {
            display: inline-block;
            background-color: white;
            border-radius: 4px;
            padding: 2px 5px;
            margin-right: 8px;
            margin-top: 2px;
            min-width: 48px;
            text-align: center;
            font-size: 13px;
            line-height: 2;
          }
        }

        .question-choose-like-text {
          margin-top: 8px;

          .text-container {
            background-color: rgba(255, 255, 255, 0.95);
            border-radius: 8px;
            padding: 6px 10px;
            margin: 8px 0;
            min-height: 22px;
          }

          .button-container {
            text-align: right;
            height: 32px;

            picker {
              display: inline-block;
            }

            button {
              margin-left: 5px;
              padding: 0 12px;
              border: 1px solid #5736FF;
              color: #5736FF;

              &[disabled] {
                opacity: 0.3;
              }
            }
          }
        }
      }

      &.error {
        opacity: 0.6;
      }

      &.loading {
        .row-main::after {
          content: '';
          display: inline-block;
          vertical-align: baseline;
          width: 4px;
          height: 18px;
          position: relative;
          top: 3px;
          left: 5px;
          background-color: black;
          animation: blink 1.2s infinite steps(2, start);
        }
      }

      &.user-row {
        text-align: right;

        .row-main {
          // background: #15BC38;
          background: #5736FF;
          border-radius: 19px 19px 0 19px;
          color: white;
        }
      }

      .choose-list {
        margin-top: 8px;

        :deep(.uni-list) {
          background-color: transparent !important;

          .uni-list-item {
            &.uni-list-item--hover {
              background-color: white !important;
            }

            border: none;
            border-radius: 10px;
            margin-top: 6px;

            .uni-list--border {
              display: none;
            }

            .uni-list-item__content-title {
              color: #292A2E;
              font-weight: 500;
              font-size: 15px;
            }

          }
        }
      }

      .divider {
        width: 100%;
        height: 1px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #e1e3e9;
        margin: 24px 0;

        .divider-text {
          background-color: white;
          padding: 0 12px;
          color: #303133;
        }
      }
    }
  }

  .footer {
    // position: fixed;
    // left: 0;
    // bottom: 0px;
    width: 100%;
    background: white;
    box-sizing: border-box;
    padding: 8px 12px 32px 12px;
    border-top: 1px solid #e1eeef;
    display: flex;
    align-items: center;

    // border-top-right-radius: 20px;
    // border-top-left-radius: 20px;
    uni-icons {
      margin-right: 10px;
    }


    :deep(.uni-easyinput__content) {
      height: 42px;
      border-radius: 19px;
      padding: 0 6px;
      border: none;
      background-color: #F2F4F8 !important;
      border-radius: 30px;

      &.is-focused {
        border-color: #15BC38 !important;
      }

      input {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 600;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.4)
      }

      .uniui-paperplane-filled {
        color: #15BC38 !important;
      }
    }
  }
}
</style>
