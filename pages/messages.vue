<template>
  <v-app>
    <v-container class="primary">
      <v-row>
        <v-col>

        </v-col>
      </v-row>
      <v-card>
        <v-card-title>
          name
        </v-card-title>
        <v-card-text>
          content
        </v-card-text>
      </v-card>
    </v-container>
    <div>
      <div
        v-for="room in rooms"
        :key="room.id"
        class="bg-white max-w-sm rounded-lg overflow-hidden shadow m-4 mb-5 p-4 h-32"
      >
        <div>
          <img
            :src="room.topImageUrl"
            class="float-left object-cover rounded-lg w-24 h-24 mr-4"
          />
          <p class="font-mono text-darkGray">{{ room.name }}</p>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'navbar',

}
</script>

<style>

</style>