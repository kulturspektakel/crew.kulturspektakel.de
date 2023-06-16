<template>
  <v-list nav>
    <v-list-item
      v-for="item in items"
      clickable
      :key="item.url"
      :to="`/contactless/${item.url}`"
      :active="activeUrl === item.url"
    >
      <v-list-item-content>
        <v-text-overflow :text="'tset'" />
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
export default {
  props: {
    activeUrl: {
      type: String,
      default: 'lists',
    },
  },
  setup() {
    return {
      items: [
        {icon: 'calendar_month', label: 'Preislisten', url: 'lists'},
        {icon: 'calendar_month', label: 'Geräte', url: 'devices'},
        {icon: 'calendar_month', label: 'Umsätze', url: 'revenue'},
        {icon: 'calendar_month', label: 'Token', url: 'token'},
      ],
    };
  },
};
</script>
