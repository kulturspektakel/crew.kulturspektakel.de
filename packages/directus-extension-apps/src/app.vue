<template>
  <private-view class="kultapp" smallHeader="true" :title="'App'">
    <iframe ref="iframe" class="iframe" :src="iframeSrc" allow="clipboard-write"></iframe>

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
  computed: {
    iframeSrc() {
      if (this.navComponent === 'contactless' && this.feature === 'lists') {
        return 'https://www.kulturspektakel.de/crew/produkte';
      }
      if (this.navComponent === 'contactless' && this.feature === 'revenue') {
        return 'https://app.hex.tech/2d68bee1-7fb2-431f-b6d6-fcda5e55d400/app/Buden-030NfVP7MEymudGImXoKpz/latest';
      }
      if (this.navComponent === 'booking') {
        return `https://www.kulturspektakel.de/crew/booking/${this.feature}`;
      }
      return `https://app.kulturspektakel.de/${this.navComponent}/${this.feature}`;
    },
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
body {overflow: hidden;}
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
