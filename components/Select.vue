<template>
  <v-select class="mt-4" dense color="info" item-color="blue" :label="label" v-model="profileData" :items= items></v-select>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
    },
    profile: {
      type: String || Number,
    },
    items: {
      type: Array
    }
  },
  data() {
    return {
      profileData: this.profile
    }
  },
  watch: {
    profile() {
      this.profileData = this.profile
    }
  }

}
</script>

<style>
</style>