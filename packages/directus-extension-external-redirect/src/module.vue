<template>
  <private-view title="Weiterleitung..."></private-view>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
const url = new URLSearchParams(location.search).get('url');
if (url) {
  window.location.replace(url);
}

export default defineComponent({});
</script>
