<template>
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
          class="card mb-5 teal lighten-5"
          nuxt
          :to="`/users/${profile.id}`"
          hover
          :ripple="false"
        >
          <v-card-title>
            {{ profile.displayName}}
          </v-card-title>
          <v-card-subtitle>
            {{ profile.id }}
          </v-card-subtitle>
          <v-layout justify-center>
            <v-avatar size="200">
              <v-img v-show="!profile.avatarUrl"
                :src="require('@/assets/image/default-user.jpg')"
              />
              <v-img v-show="profile.avatarUrl"
                :src="profile.avatarUrl"
              />
            </v-avatar>
          </v-layout>
          <v-card-text>
            <span>{{ profile.residence }}</span>
          </v-card-text>
          <v-card-actions>
            <LikeButton :profileId = "profile.id"></LikeButton>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  {{ this.profiles }}
  </v-container>
  <!-- プロフィール一覧END -->
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
        console.log(this.profiles)
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