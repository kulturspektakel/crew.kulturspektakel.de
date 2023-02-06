<template>
  <private-view title="Booking" smallHeader=true>
    <iframe class="iframe" src="/react" />
  </private-view>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({});
</script>

<style scoped>
.iframe {
  border: 0;
  width: 100%;
  height: calc(100% - 60px);
}
</style>
