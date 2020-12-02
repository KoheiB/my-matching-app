<template>
  <v-app>
    <v-container class="primary">
      <v-row>
        <v-col cols="12" md="6"
        v-for="like in likes"
        :key="like.id">
          <v-card>
            <v-row>
              <v-col cols="2"
              align-self="center">
                <v-img :src="like.picture"
                class="member-picture"
                width="100%"
                />
              </v-col>
              <v-col cols="6">
                <v-card-title>
                  {{ like.likedUserRef }}
                </v-card-title>
                <v-card-subtitle>
                  {{ like.createdAt }}
                </v-card-subtitle>
              </v-col>
              <v-col cols="3"
              align-self="center"
              justify="center">
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>
          </v-card>

        </v-col>
      </v-row>
    </v-container>
  </v-app>
  
</template>

<script>
import LikeButton from '~/components/LikeButton.vue'
import ProfileButton from '~/components/ProfileButton.vue'
export default {
  layout: 'navbar',
  components: {
    LikeButton,
    ProfileButton,
  },
  data () {
    return {
      currentUser: {},
      likes: [],
    }
  },
  created() {
    this.$fireAuth.onAuthStateChanged(user => {
      this.$firestore.collection('profiles').doc(user.uid)
      .collection('likedProfileUsers')
      .get().then((querySnapshot) => {
        this.likes = querySnapshot.docs.map(doc => doc.data())
      })
    })
  }
}
</script>

<style>
.member-picture {
  border-radius: 50%;
  border: 1px solid #ccc;
  margin-left: 10px;
}
</style>