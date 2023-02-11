<template>
  <private-view
    :title="'Booking ' + eventId.replace('kult', '')"
    smallHeader="true"
  >
    <iframe class="iframe" :src="'/react?eventId=' + eventId"></iframe>

    <template #navigation>
      <v-list nav>
        <v-list-item
          v-for="item in items"
          clickable
          :key="id"
          :to="`/booking/${item.id}`"
          :active="eventId === item.id"
        >
          <v-list-item-icon><v-icon name="calendar_month" /></v-list-item-icon>
          <v-list-item-content>
            <v-text-overflow :text="new Date(item.start).getFullYear()" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

    <template #sidebar>
      <sidebar-detail icon="info_outline" :title="t('information')" close>
      </sidebar-detail>
    </template>
  </private-view>
</template>

<script lang="ts">
import {useItems} from '@directus/extensions-sdk';
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';

export default {
  props: {
    eventId: {
      type: String,
      default: null,
    },
  },
  setup() {
    const {t} = useI18n();

    const {items} = useItems(ref('Event'), {
      sort: ref(['-start']),
      fields: ref(['*']),
      filter: ref({
        eventType: {
          _eq: 'Kulturspektakel',
        },
        bandApplicationStart: {
          _nnull: true,
        },
      }),
    });
    return {items, t};
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
