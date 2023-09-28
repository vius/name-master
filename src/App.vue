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
<style></style>
