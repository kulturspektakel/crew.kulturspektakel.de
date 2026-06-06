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
        {
          icon: 'sell',
          label: 'Preislisten',
          url: 'lists',
          href: 'https://kulturspektakel.de/crew/produkte',
        },
        {
          icon: 'monitoring',
          label: 'Umsätze',
          url: 'revenue',
          href: 'https://app.hex.tech/2d68bee1-7fb2-431f-b6d6-fcda5e55d400/app/Buden-030NfVP7MEymudGImXoKpz/latest',
        },
        {icon: 'code', label: 'Token', url: 'token'},
      ],
    };
  },
};
</script>
