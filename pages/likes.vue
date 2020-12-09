<template>
  <v-app>
    <v-container class="primary">
      <v-row>
        <v-col cols="12" md="6" v-for="like in likes" :key="like.id">
          <v-card>
            <v-row>
              <v-col cols="2" align-self="center">
                <v-img
                  :src="like.picture"
                  class="member-picture"
                  width="100%"
                />
              </v-col>
              <v-col cols="6">
                <v-card-title>
                  {{ like.name }}
                </v-card-title>
                <v-card-subtitle>
                  {{ like.createdAt }}
                </v-card-subtitle>
              </v-col>
              <v-col cols="3" align-self="center" justify="center">
                <v-btn @click="approveLike(like)"
                color="info"
                height="40"
                :disabled = like.isApproved
                >
                  <v-icon>mdi-heart</v-icon>ありがとう！
                </v-btn>
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
import LikeButton from "~/components/LikeButton.vue";
import ProfileButton from "~/components/ProfileButton.vue";
export default {
  layout: "navbar",
  components: {
    LikeButton,
    ProfileButton,
  },
  data() {
    return {
      currentUser: {},
      likes: [],
    };
  },
  created() {
    this.$fireAuth.onAuthStateChanged(async(user) => {
      // this.$firestore
      //   .collection("profiles")
      //   .doc(user.uid)
      //   .collection("likedProfileUsers")
      //   .get()
      //   .then((querySnapshot) => {
      //     this.likes = querySnapshot.docs.map((doc) => doc.data());
      //     console.log(this.likes);
      //     console.log(this.likes[0].likedUserRef)
      //     const likedUserRef = this.likes[0].likedUserRef
      //     likedUserRef.get().then((likedUser) =>
      //       console.log(likedUser.data())
      //     )
      //   });
      this.currentUser = user
      try {
        const querySnapshot = await this.$firestore
          .collection("profiles")
          .doc(user.uid)
          .collection("likedProfileUsers")
          .get()
        const likes = querySnapshot.docs.map((doc) => {
          const result = doc.data()
          result.id = doc.id
          return result
        });
        likes.forEach(async (like) => {
          const likedUserRef = like.likedUserRef
          const likedUser = await likedUserRef.get()
          const likedUserName = likedUser.data().name
          like.name = likedUserName
          this.likes.push(like)
        })
        console.log(this.likes)
      } catch (error) {
        console.log(error)
      }
    });
  },
  methods: {
    approveLike(like) {
      this.$firestore.collection('profiles')
      .doc(this.currentUser.uid)
      .collection('likedProfileUsers')
      .doc(like.id)
      .update({
        isApproved: true,
      })
    },
    // onClickThankyou(like) {
    //   this.$fireAuth.onAuthStateChanged((user) => {
    //     this.approveLike(like)
    //   })
    // }
  }
};
</script>

<style>
.member-picture {
  border-radius: 50%;
  border: 1px solid #ccc;
  margin-left: 10px;
}
</style>