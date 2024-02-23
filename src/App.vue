<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import init from '@/utils/init'
onLaunch(async () => {
  await init()
})
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="less">
.textarea-popup {

  .uni-popup {
    .uni-popup__wrapper {
      // padding: 16px;
      position: fixed;
      left: 75%;
      top: 42%;
      transform: translate(-50%, -50%);
      border-radius: 5px;
      background-color: white !important;
      min-width: 280px;

      .header {
        .title {
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          padding: 12px;
        }
      }

      .main {
        padding: 0 16px 16px;
      }

      .footer {
        display: flex;
        border-top: 1px solid #e1e3e9;

        button {
          flex: 1;
          border-radius: 0px;
          background-color: transparent;

          &[type='primary'] {
            border-left: 1px solid #e1e3e9;
            color: #007aff;
          }

          &::after {
            display: none !important;
          }
        }
      }
    }
  }
}
</style>
