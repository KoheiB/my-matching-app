<template>
  <v-app>
    <v-container>
      <v-skeleton-loader v-if="loading" type="card"/>
      <v-card
        v-for="room in rooms"
        :key="room.id"
        class="mb-2"
        hover
        nuxt
        :to="`${room.partnerId}`"
      >
        <v-card-title>
          {{ room.partnerName }}
        </v-card-title>
        <v-card-subtitle>
          {{ room.updatedAt }}
        </v-card-subtitle>
        <v-card-text>
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
      loading: true,
      rooms: [],
      currentUser: {},
    }
  },
  created() {
    this.$fireAuth.onAuthStateChanged(async(user) => {
      this.currentUser = user
      try {
        const querySnapshot = await this.$firestore
          .collection("rooms")
          .where('attendUsersId', 'array-contains', user.uid)
          .get()
        const rooms = querySnapshot.docs.map((doc) => {
          const result = doc.data()
          result.id = doc.id
          return result
        });
        rooms.forEach(async (room) => {
          const partnerId = room.attendUsersId.filter((attendUserId) => attendUserId !== this.currentUser.uid)[0]
          const documentSnapshot = await this.$firestore.collection('profiles').doc(partnerId).get()
          const documentData = documentSnapshot.data()

          room.partnerId = partnerId
          room.partnerName = documentData.displayName
          room.updatedAt = room.updatedAt.toDate().toLocaleString('ja-JP-u-ca-japanese')
          this.rooms.push(room)
          this.loading = false
        })
      } catch (error) {
        console.log(error);
      }
    })
  },
}
</script>

<style>

</style>