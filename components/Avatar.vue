<template>
  <div>
    <v-avatar :size="size" rounded="xl">
      <v-img v-show="!url" :src="require('@/assets/image/default-user.jpg')" />
      <v-img v-show="url" :src="url" />
      <span class="liked-count"
        ><v-icon class="mr-1">mdi-thumb-up</v-icon>{{ likedCount }}</span
      >
    </v-avatar>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
    },
    size: {
      type: Number,
    },
    likedCount: {
      type: Number,
    },
  },
};
</script>

<style>
.liked-count {
  position: absolute;
  bottom: 5px;
  right: 5px;
  /*以下装飾*/
  color: white;
  background: #74c1f8;
  padding: 0 8px;
  line-height: 1.5;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
}
</style>