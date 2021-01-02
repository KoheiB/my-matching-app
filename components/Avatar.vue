<template>
  <v-avatar :size="size" rounded="xl">
    <v-img
      v-show="!url"
      :src="require('@/assets/image/default-user.jpg')"
    />
    <v-img v-show="url" :src="url" />
  </v-avatar>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
    },
    size: {
      type: Number,
    }
  }
};
</script>

<style>
</style>