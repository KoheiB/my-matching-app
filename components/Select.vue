<template>
  <v-select
    @change="updateValue($event)"
    :value="profile"
    class="mt-4"
    dense
    color="info"
    item-color="blue"
    :label="label"
    :items="items"
    :readonly="isNotActive"
  ></v-select>
</template>

<script>
export default {
  model: {
    prop: "profile",
    event: "change",
  },
  props: {
    profile: {
      type: String || Number,
    },
    label: {
      type: String,
    },
    items: {
      type: Array,
    },
    isNotActive: {
      type: Boolean,
    },
  },
  methods: {
    updateValue: function (e) {
      this.$emit("change", e);
    },
  },
};
</script>

<style>
.theme--light.v-select .v-select__selection--disabled {
  color: black;
}
</style>