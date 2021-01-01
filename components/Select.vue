<template>
  <v-select v-bind:value="profile" @change="updateProfile" class="mt-4" dense color="info" item-color="blue" :label="label" :items= items></v-select>
</template>

<script>
export default {
  props: {
    profile: {
      type: String || Number,
    },
    label: {
      type: String,
    },
    items: {
      type: Array
    }
  },
  methods: {
    updateProfile: function(e) {
      this.$emit("input", e.target.value);
    }
  },
}
</script>

<style>
</style>