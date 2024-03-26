<template>
  <scroll-view :scroll-y="true" class="conponent-container">
    <!-- <section :scroll-y="true" class="conponent-container"> -->
    <section class="list-container">
      <section>
        <image class="list-item" v-for="item, index in getHalfList(0)" :key="item.id" :src="item.img" :alt="item.name" mode="widthFix" @click="jump2Chat(item)">
          <section class="list-item-footer">
            <section class="list-item-content-title">{{ item.name }}</section>
            <section class="list-item-content-desc">{{ item.desc }}</section>
          </section>
        </image>
      </section>
      <section>
        <image class="list-item" v-for="item, index in getHalfList(1)" :key="item.id" :src="item.img" :alt="item.name" mode="widthFix" @click="jump2Chat(item)">
          <section class="list-item-footer">
            <section class="list-item-content-title">{{ item.name }}</section>
            <section class="list-item-content-desc">{{ item.desc }}</section>
          </section>
        </image>
      </section>
    </section>
  </scroll-view>
</template>
<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
const state: any = reactive({
  list: []
})
onMounted(() => {
  state.list = [{
    name: '黛玉文学',
    desc: '天上掉下个林妹妹，在大观园里陪你聊天',
    id: 1,
    img: "https://p6-flow-imagex-sign.byteimg.com/ocean-cloud-tos/add84e441dad46acadebdaf9f59a1fb9.png~tplv-a9rns2rl98-image.png?rk3s=18ea6f23&x-expires=1742904004&x-signature=%2F%2BHQQv9ovhVPowNCW88vRqBXOWE%3D",
    list: ['吃了吗您那?','聊了聊你呢?','我在这里等着你回来，等着你回来把那桃花采。我在这儿等着你回来，等着你回来balabalbal']
  }, {
    name: '鲁迅文学',
    id: 2,
    desc: '世界上本没有路，走的人多了也就成了路',
    img: 'https:////img.tukuppt.com/png_preview/00/04/78/nINQUGPNHy.jpg!/fw/960'
  }, {
    name: '李白',
    desc: '他的性格丰富多变，以高度字符、傲岸不羁和理想主义著称。他的诗歌充满了浪漫色彩！',
    id: 4,
    img: 'https://img.tukuppt.com/png_preview/00/04/18/6WH6FKZjL6.jpg!/fw/720'
  }, {
    name: '名侦探柯南',
    desc: '真相只有一个！',
    id: 3,
    img: 'https://img.tukuppt.com/png_preview/00/51/82/wNEdVO4EM1.jpg!/fw/1060'
  }, {
    name: '诸葛亮',
    desc: '臣亮字孔明，号卧龙居士，蜀汉丞相，寄身于南阳。辅佐刘备，与刘备共事，与刘备共谋。',
    id: 5,
    img: 'https://img.tukuppt.com/png_preview/00/41/32/Rx4TEqwmG3.jpg!/fw/780'
  }]
})
const getHalfList = (type: number) => {
  return state.list.filter((item: any, index: number) => {
    return index % 2 === type
  })
}
const jump2Chat = (item: any) => {
  // const data = JSON.stringify(item)
  // console.log('string', data)
  uni.setStorage({
    key: 'role-data',
    data: item
  });
  const url = `/pages/person/index?id=${item.id}&name=${item.name}`
  uni.navigateTo({
    url
  })
}
</script>
<style lang="less" scoped>
.conponent-container {
  height: 100%;
  width: 100%;
  padding: 0 6px;
  box-sizing: border-box;

  .list-container {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    width: 100%;
    box-sizing: border-box;

    &>view {
      flex: 1;
      padding: 0 6px;
      width: 50%;
    }

    .list-item {
      width: 100%;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      border-radius: 6px;
      margin-top: 10px;
      min-height: 150px;

      .list-item-footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        // height: 40px;
        background-color: rgba(0, 0, 0, 0.35);
        color: #fff;
        padding: 5px 8px;
        box-sizing: border-box;

        view {
          text-overflow: ellipsis;
          overflow: hidden;
          height: 20px;
          white-space: nowrap;
          font-size: 14px;
          font-weight: bold;

          &.list-item-content-desc {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.85);
            line-height: 24px;
          }
        }
      }
    }
  }
}
</style>
