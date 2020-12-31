<template>
  <v-select class="mt-2" dense color="" :label="label" v-model="profile" :items= items></v-select>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
    },
    profile: {
      type: Object
    },
    items: {
      type: Array
    }
  }

}
</script>

<style>

</style>