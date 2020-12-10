<template>
  <v-app>
    <v-container class="primary">
      <v-row>
        <v-col>

        </v-col>
      </v-row>
      <v-card
        v-for="chatroom in chatrooms"
        :key="chatroom.id">
        <v-card-title>
          {{ room.name }}
        </v-card-title>
        <v-card-text>
          content
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: 'navbar',
  data () {
    return {
      chatrooms: []
    }
  }
}
</script>

<style>

</style>