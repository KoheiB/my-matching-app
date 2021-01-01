<template>
  <v-select v-model="profile" class="mt-4" dense color="info" item-color="blue" :label="label" :items="items" :readonly="isReadonly"></v-select>
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
    },
    isReadonly: {
      type: Boolean,
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