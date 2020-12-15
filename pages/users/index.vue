<template>
  <v-app>
    <v-container>
      <v-skeleton-loader v-if="loading" type="card"/>
      <!-- プロフィール一覧 -->
      <v-row>
        <v-col
        cols="6" sm="4" md="4" lg="3" xl="3"
        v-for="profile in profiles"
        :key="profile.id"
        >
          <v-card
            class="card mb-5"
            nuxt
            :to="`/users/${profile.id}`"
            hover
          >
            <v-card-title>
              {{ profile.displayName}}
            </v-card-title>
            <v-card-subtitle>
              {{ profile.id }}
            </v-card-subtitle>
            <v-card-text>
              <v-container
              >
                <!-- <img
                :src="member.picture"
                class="picture"
                > -->
              </v-container>
              <p>{{ profile.residence }}</p>
            </v-card-text>
            <v-card-actions>
              <v-container>
                <ProfileButton class="mb-2"></ProfileButton>
                <LikeButton :profileId = "profile.id"></LikeButton>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- プロフィール一覧END -->
    {{ this.profiles }}
  </v-app>
</template>

<script>
import LikeButton from '~/components/LikeButton.vue'
import ProfileButton from '~/components/ProfileButton.vue'
export default {
  layout: 'navbar',
  components: {
    LikeButton,
    ProfileButton
  },
  data() {
    return {
      loading: true,
      currentUser: {},
      profiles: [],
      model: 0,
      colors: [
        'primary',
        'secondary',
        'yellow darken-2',
        'red',
        'orange',
      ],
    }
  },
  // 表示するプロフィールの配列をコレクショングループで取得しておく。
  created () {
    this.$fireAuth.onAuthStateChanged(async(user) => {
      this.currentUser = user
      this.$firestore.collection('profiles').where('id', '!=', this.currentUser.uid).get().then((querySnapshot) => {
        this.profiles = querySnapshot.docs.map(doc => doc.data())
        this.loading = false
      })
    })
  },
}
</script>

<style>
* {
  text-decoration: none;
}
.card {
  width: 100%;
  height: auto;
  /* レスポンシブで％指定 1:100 2:50  */
}
.picture {
  display: block;
  margin: 0 auto;
  width: 70%;
  border: 1px solid rgb(200, 200, 200)
}


</style>