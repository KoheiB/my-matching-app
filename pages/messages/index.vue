<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col>
        </v-col>
      </v-row>
      <nuxt-link :to="`${chatroom.id}`"
        v-for="chatroom in chatrooms"
        :key="chatroom.id"
      >
        <v-card 
        class="mb-2"
        >
          <v-card-title>
            {{ chatroom.attendUserName }}
          </v-card-title>
          <v-card-subtitle>
            {{ chatroom.updatedAt }}
          </v-card-subtitle>
          <v-card-text>
          </v-card-text>
        </v-card>
      </nuxt-link>
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: 'navbar',
  data () {
    return {
      chatrooms: [],
      currentUser: {},
    }
  },
  created() {
    this.$fireAuth.onAuthStateChanged(async(user) => {
      this.currentUser = user
      try {
        const querySnapshot = await this.$firestore
          .collection("users")
          .doc(user.uid)
          .collection("chatrooms")
          .get()
        const chatrooms = querySnapshot.docs.map((doc) => {
          const result = doc.data()
          result.id = doc.id
          return result
        });
        chatrooms.forEach(async (chatroom) => {
          const attendUserRef = chatroom.attendUserRef
          const attendUserSnapshot = await attendUserRef.get()
          const attendUserId = attendUserSnapshot.id
          const attendProfileSnapshot = await this.$firestore.collection('profiles').doc(attendUserId).get()
          const attendProfileData = attendProfileSnapshot.data()
          chatroom.attendUserName = attendProfileData.displayName
          chatroom.updatedAt = chatroom.updatedAt.toDate().toLocaleString('ja-JP-u-ca-japanese')
          this.chatrooms.push(chatroom)
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