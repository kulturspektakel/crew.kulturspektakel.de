<template>
  <private-view title="Booking" smallHeader="true">
    <iframe class="iframe" src="/react" />

    <template #navigation>
      tset
      <v-list>
        <v-list-item v-for="col in collection" v-bind:key="col.collection">
          {{ col.collection }}
        </v-list-item>
      </v-list>
    </template>
  </private-view>
</template>

<script lang="ts">
import {useCollection} from '@directus/extensions-sdk';
export default {
  setup() {
    const collection = useCollection('Events');
    console.log(collection);
  },
};
</script>

<style scoped>
.iframe {
  border: 0;
  width: 100%;
  height: calc(100% - 60px);
}
</style>
