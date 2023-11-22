<template>
  <section class="page" @touchstart="touchStart" @touchend="touchEnd">
    <section class="nav-bar" :style="{ height: globalData.height + 'px', paddingTop: globalData.top + 'px' }">
      <text v-for="item in tabs" :key="item.value" @click="tabChange(item.value)" :class="{ active: item.value === tab }">{{ item.label }}</text>
    </section>
    <uni-transition mode-class="slide-right" ref="animationRef" :styles="styles" :duration="0" :show="true">
      <Chat class="tab-container"></Chat>
      <ShangXi class="tab-container"></ShangXi>
    </uni-transition>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Chat from '@/components/chat/chat.vue'
import ShangXi from '@/components/shangxi/shangxi.vue'
const tabs = [{
  label: '对话',
  value: 1
}, {
  label: '赏析',
  value: 2
}]
const styles = {
  'width': '200vw',
  'height': '100%',
  "overflow": "hidden"
}
const animationRef = ref()
const tab = ref(1)
let translateX = 0
const tabChange = (value: number) => {
  const oldTab = tab.value
  tab.value = value
  translateX += (oldTab - value) * 50
  translate()
}
const translate = () => {
  const target = animationRef.value
  if (target) {
    target.step({
      translateX: translateX + '%'
    }, {
      duration: 550,
      timingFunction: 'ease',
    })
    target.run()
  }
}
const globalData: any = reactive({
  height: 32,
  top: 32
})
const calcNavBarInfo = () => {
  // 获取系统信息
  const systemInfo: any = uni.getSystemInfoSync();
  // 胶囊按钮位置信息
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
  globalData.height = menuButtonInfo.height
  globalData.top = menuButtonInfo.top
}
calcNavBarInfo()
const touchState = {
  touchStartX: 0,
  touchStartY: 0
}
/**  
* 触摸开始  
**/
const touchStart = (e: any) => {
  touchState.touchStartX = e.touches[0].clientX;
  touchState.touchStartY = e.touches[0].clientY;
}

/**  
* 触摸结束  
**/
const touchEnd = (e: any) => {
  let deltaX = e.changedTouches[0].clientX - touchState.touchStartX;
  let deltaY = e.changedTouches[0].clientY - touchState.touchStartY;
  if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
    const value = tab.value
    if (deltaX > 0 && value > 1) {
      tabChange(value - 1)
    }
    if (deltaX < 0 && value < 2) {
      tabChange(value + 1)
    }
  }
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
.page {
  height: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
  flex-direction: column;

  .nav-bar {
    display: flex;
    // justify-content: center;
    padding-left: 16px;
    align-items: center;
    width: 100%;
    flex-shrink: 0;

    text {
      color: rgba(0, 0, 0, 0.4);
      font-size: 17px;
      margin-right: 12px;
      position: relative;
      font-weight: 500;

      &.active {
        color: rgba(0, 0, 0, 0.85);

        &::after {
          content: ' ';
          width: 18px;
          height: 4px;
          border-radius: 3px;
          display: inline-block;
          background-color: #5736FF;
          opacity: 0.8;
          position: absolute;
          bottom: -8px;
          left: 50%;
          translate: -50%;
        }
      }
    }
  }

  uni-transition {
    overflow: hidden;
    flex: 1;

    &> :deep(view) {
      display: flex;
    }

    .tab-container {
      flex-shrink: 0;
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow: hidden;
      padding-top: 8px;
    }
  }
}
</style>
