<template>
  <v-app>
    <v-container class="primary">
      <v-row>
        <v-col>

        </v-col>
      </v-row>
      <v-card
        v-for="room in rooms"
        :key="room.id">
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
import { mapGetters } from 'vuex'
export default {
  layout: 'navbar',
  computed: {
    ...mapGetters('rooms', ['rooms'])
  },

  async asyncData({ store }) {
    const unsubscribe = await store.dispatch('rooms/subscribe')
    return {
      unsubscribe
    }
  },

  destroyed() {
    this.$store.dispatch('rooms/clear')
    if (this.unsubscribe) this.unsubscribe()
  },

}
</script>

<style>

</style>