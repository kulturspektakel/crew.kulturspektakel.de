<template>
  <private-view class="kultapp" smallHeader="true" :title="'App'">
    <iframe
      ref="iframe"
      class="iframe"
      :src="`https://app.kulturspektakel.de/${navComponent}/${feature}`"
    ></iframe>

    <template #navigation>
      <v-list nav>
        <component v-if="navComponent" :is="navComponent" :feature="feature" />
      </v-list>
    </template>

    <template #sidebar> </template>
  </private-view>
</template>

<script lang="ts">
import booking from './booking.vue';
import contactless from './contactless.vue';
import {RouteLocationNormalizedLoaded} from 'vue-router';

function dataFromRoute(route: RouteLocationNormalizedLoaded) {
  return {
    feature: String(route.params.feature ?? ''),
    navComponent: route.path.split('/')[1],
  };
}

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
    $route() {
      const {navComponent, feature} = dataFromRoute(this.$route);
      this.navComponent = navComponent;
      this.feature = feature;
    },
  },
  data() {
    return dataFromRoute(this.$route);
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
  height: calc(100% - 7px);
}
</style>
