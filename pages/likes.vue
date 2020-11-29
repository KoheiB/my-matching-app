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
                  {{ like.name }}
                </v-card-title>
                <v-card-subtitle>
                  {{ like.date }}
                </v-card-subtitle>
              </v-col>
              <v-col cols="3"
              align-self="center"
              justify="center">
                <ThankyouButton></ThankyouButton>
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
      likes: [
        // {
        //   id: 1,
        //   name: "aaa",
        //   picture: require('@/assets/image/html.png'),
        //   date: "2020/11/11"
        // },
        // {
        //   id: 2,
        //   name: "bbb",
        //   picture: require('@/assets/image/html.png'),
        //   date: "2020/11/11"
        // },
      ],
    }
  },
  created() {
    this.$fireAuth.onAuthStateChanged(user => {
      this.currentUser = user
      console.log(this.currentUser)
      this.$firestore.collection('users').doc(this.currentUser.uid)
      .collection('profile').doc(this.currentUser.uid)
      .collection('likedUsers')
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