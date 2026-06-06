<template>
  <v-list-item
    v-for="item in items"
    clickable
    :key="item.url"
    :to="item.href ? undefined : `/contactless/${item.url}`"
    :href="item.href"
    :target="item.href ? '_blank' : undefined"
    :active="feature === item.url"
  >
    <v-list-item-icon><v-icon :name="item.icon" /></v-list-item-icon>
    <v-list-item-content>
      <v-text-overflow :text="item.label" />
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
export default {
  props: {
    feature: {
      type: String,
    },
  },
  setup() {
    return {
      items: [
        {icon: 'sell', label: 'Preislisten', url: 'lists'},
        {icon: 'monitoring', label: 'Umsätze', url: 'revenue'},
        {icon: 'code', label: 'Token', url: 'token'},
      ],
    };
  },
};
</script>
