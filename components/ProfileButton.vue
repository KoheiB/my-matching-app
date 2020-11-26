<template>
  <v-btn @click="onclick"
  color="info"
  height="40"
  outlined
  block
  >
    プロフィール詳細
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