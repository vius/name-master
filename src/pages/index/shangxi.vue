<template>
  <section class="conponent-container">
    <uni-card>
      <section class="row-container">
        <text v-for="label in state.labels" :key="label" :span="4" :class="{ active: label === state.label }" @click="labelChange(label)">{{ label }}</text>
      </section>
    </uni-card>
  </section>
</template>
<script lang="ts" setup>
import request from '@/utils/request'
import { reactive } from 'vue'
import { logined } from '@/utils/init'

const state = reactive({
  label: '孤独',
  labels: [
    "孤独",
    "伤感",
    "浪漫",
    "温暖",
    "平静",
    "唯美",
    "爱慕",
    "积极",
    "怀念",
    "坚定",
    "自信",
    "无奈",
    "憧憬",
    "深沉",
    "乐观",
    "自由",
    "矛盾",
    "活泼"
  ]
})
const labelChange = (label: string) => {
  state.label = label
}
const getList = async () => {
  const data = await request({
    url: 'getShangxiList',
  })
  console.log('data', data)
}
if (logined) {
  getList()
} else {
  uni.$on('afterLogin', getList)
}
</script>
<style lang="less" scoped>
.conponent-container {
  height: 100%;
  width: 100%;

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
}
</style>
