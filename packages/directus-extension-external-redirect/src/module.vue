<template>
  <private-view title="Weiterleitung..."></private-view>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  setup() {
    const url = new URLSearchParams(location.search).get('url');
    if (url) {
      window.location.replace(url);
    }
  },
});
</script>
