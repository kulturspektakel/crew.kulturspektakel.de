<template>
  <private-view class="kultapp" smallHeader="true" :title="'App'">
    <iframe
      ref="iframe"
      class="iframe"
      :src="'https://app.kulturspektakel.de/' + iframeSrc"
    ></iframe>

    <template #navigation>
      <component :is="navComponent" />
    </template>

    <template #sidebar> </template>
  </private-view>
</template>

<script lang="ts">
import booking from './booking.vue';
import contactless from './contactless.vue';
import {useRouter} from 'vue-router';

export default {
  mounted() {
    setTimeout(() => {
      this.$refs.iframe.contentWindow.focus();
    }, 200);
  },
  components: {
    booking,
    contactless,
  },
  watch: {
    $route(to) {
      console.log(to.path.split('/')[1]);
      this.navComponent = to.path.split('/')[1];
    },
  },
  data() {
    const router = useRouter();
    return {
      iframeSrc: 'booking/kult2023',
      navComponent: router.currentRoute.value.path.split('/')[1],
    };
  },
};
</script>

<style>
.kultapp #sidebar,
.kultapp #main-content .header-bar {
  display: none;
}
</style>

<style scoped>
.iframe {
  border: 0;
  width: 100%;
  height: 100%;
}
</style>
