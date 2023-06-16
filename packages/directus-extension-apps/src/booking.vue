<template>
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

<script lang="ts">
import {useItems} from '@directus/extensions-sdk';
import {ref} from 'vue';

export default {
  props: {
    eventId: {
      type: String,
      default: null,
    },
  },
  setup() {
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
    return {items: items ?? []};
  },
};
</script>
