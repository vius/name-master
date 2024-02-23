<template>
  <section class="conponent-container">
    <uni-card>
      <section class="row-container">
        <text v-for="label in state.labels" :key="label" :span="4" :class="{ active: label === state.label }" @click="labelChange(label)">{{ label }}</text>
      </section>
    </uni-card>
    <section class="list-container">
      <section class="list-item" v-for="item, index in state.list" :key="item.id" :class="['item-' + (index % 5 + 1)]" @click="jump2detail(item)">
        <view class="badge">
          <text class="square">{{ item.chuchu.charAt(0) }}</text>
          <text class="triangle"></text>
        </view>
        <view class="chuchu">
          {{ item.chuchu }}
        </view>
        <view class="text-content" v-if="item.wenan">
          <mp-html :content="getMarkdownText(item.wenan)"></mp-html>
        </view>
        <view class="name-list" v-if="item.tuijian">
          <text v-for="name in getNameList(item.tuijian)" :key="name">#{{ name }}</text>
        </view>
      </section>
    </section>
  </section>
</template>
<script lang="ts" setup>
import request from '@/utils/request'
import { reactive } from 'vue'
import { logined } from '@/utils/init'
import MpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html.vue'
import { getMarkdownText } from '@/pages/index/utils'

const state: any = reactive({
  label: '全部',
  labels: [],
  list: []
})
const labelChange = (label: string) => {
  state.label = label
  getList(label)
}
const getList = async (label: string = '') => {
  const data = await request({
    url: 'getShangxiList',
    data: {
      label: label === '全部' ? '' : label
    }
  })
  state.list = data.content || []
  state.labels = ['全部', ...(data.label || [])]
}
const jump2detail = (item: any) => {
  console.log('jump2detail')
  const data = JSON.stringify(item)
  const url = `/pages/index/shangxi-chat?data=${data}`
  uni.navigateTo({
    url
  })
}
const getNameList = (nameString: string) => {
  const list = nameString.split('#')
  return list.splice(0, 2).filter(name => name)
}
const afterLogin = () => {
  getList()
}
if (logined) {
  afterLogin()
} else {
  uni.$on('afterLogin', afterLogin)
}
</script>
<style lang="less" scoped>
.conponent-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  uni-card {
    border-bottom-left-radius: 24px !important;
    border-bottom-right-radius: 24px !important;

    :deep(view) {
      margin: 0 !important;
      padding: 0 !important;
      border-bottom-left-radius: 24px !important;
      border-bottom-right-radius: 24px !important;
      box-shadow: 0px 5px 6px 1px rgba(165, 165, 165, 0.2) !important;
      border: none !important;

      view {
        box-shadow: none !important;
      }
    }
  }

  .row-container {
    padding: 8px 0 16px 0px !important;
    line-height: 28px;

    text {
      width: 16.66%;
      display: inline-block;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.35);
      // text-align: center;
      padding-left: 18px;
      box-sizing: border-box;
      font-weight: 500;

      &.active {
        color: #5736FF;
        font-size: 14px;
      }
    }
  }

  .list-container {
    padding: 6px 16px 24px 16px;
    flex: 1;
    overflow: auto;

    .list-item {
      margin-top: 10px;
      border-radius: 10px;
      padding: 8px;
      position: relative;

      .badge {
        left: 0;
        top: 0;
        position: absolute;
        display: flex;
        flex-direction: column;

        .square {
          width: 32px;
          height: 23px;
          background-color: transparent;
          display: inline-block;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          line-height: 28px;
          text-align: center;
          font-size: 14px;
          color: white;
          font-weight: 500;
        }

        .triangle {
          display: inline-block;
          width: 0;
          height: 0;
          border-left: 16px solid transparent;
          border-right: 16px solid transparent;
          border-top: 12px solid transparent;
        }
      }

      .chuchu {
        display: block;
        height: 26px;
        overflow: hidden;
        padding-top: 0px;
        box-sizing: border-box;
        line-height: 26px;
        padding-left: 32px;
        font-size: 13px;
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .text-content {
        overflow: hidden;
        max-height: 48px;
        line-height: 24px;
        text-overflow: ellipsis;

        mp-html {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.7);
        }

        /* 控制显示的行数 */
      }

      .name-list {
        margin-top: 2px;

        text {
          font-size: 12px;
          font-weight: 500;
          // color: whitel;
          color: rgba(0, 0, 0, 0.75);
          margin-right: 8px;
        }
      }

      // #e5f3fe - #5781fb 
      // #fbf1ef - #ff8671
      // #dbf4f0 - #37c6b0
      // #e3e5fe - #9f88fd
      // #fff5ec - #ffab6b
      &.item-1 {
        background-color: #e5f3fe;

        .badge {
          .square {
            background-color: #5781fb;
          }

          .triangle {
            border-top-color: #5781fb;
          }
        }
      }

      &.item-2 {
        background-color: #fbf1ef;

        .badge {
          .square {
            background-color: #ff8671;
          }

          .triangle {
            border-top-color: #ff8671;
          }
        }
      }

      &.item-3 {
        background-color: #dbf4f0;

        .badge {
          .square {
            background-color: #37c6b0;
          }

          .triangle {
            border-top-color: #37c6b0;
          }
        }
      }

      &.item-4 {
        background-color: #e3e5fe;

        .badge {
          .square {
            background-color: #9f88fd;
          }

          .triangle {
            border-top-color: #9f88fd;
          }
        }
      }

      &.item-5 {
        background-color: #fff5ec;

        .badge {
          .square {
            background-color: #ffab6b;
          }

          .triangle {
            border-top-color: #ffab6b;
          }
        }
      }
    }
  }
}
</style>
