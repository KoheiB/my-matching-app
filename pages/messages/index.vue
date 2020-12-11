<template>
  <v-app>
    <v-container class="primary">
      <v-row>
        <v-col>
          <!-- {{ chatrooms }} -->
        </v-col>
      </v-row>
      <v-card
        v-for="chatroom in chatrooms"
        :key="chatroom.id"
        >
        <v-card-title>
          {{ chatroom.updatedAt }}
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
        // console.log(chatrooms);
        chatrooms.forEach((chatroom) => {
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