<template>
  <v-btn @click="onclick"
  color="primary"
  height="40"
  outlined
  >
    プロフィール
  </v-btn>
</template>

<script>
export default {

  data() { 
    return {

    }
  },
  methods: {
    onclick() {
      console.log("click")
    }
  }
}
</script>

<style>

</style>