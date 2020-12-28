<template>
  <v-container>
    <!-- ローダー部分 -->
    <div v-if="loading">
      <v-row>
        <v-col cols="6" sm="4" md="4" lg="3" xl="3"
          v-for="n of 12" :key="n"
        >
          <v-skeleton-loader type="card-heading, card"
          />
        </v-col>
      </v-row>
    </div>
    <!-- プロフィール一覧 -->
    <v-row>
      <v-col
      cols="6" sm="4" md="4" lg="3" xl="3"
      v-for="profile in profiles"
      :key="profile.id"
      >
      <!-- カード部分 -->
        <v-card 
          class="card mb-5 teal lighten-5"
          nuxt
          :to="`/users/${profile.id}`"
          hover
          :ripple="false"
        >
          <v-card-title>
            <span class="white px-4 rounded-lg">{{ profile.displayName}}</span>
          </v-card-title>
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
          <v-card-actions>
            <LikeButton :profileId = "profile.id"></LikeButton>
          </v-card-actions>
        </v-card>
        <!-- カード部分END -->
      </v-col>
    </v-row>
  {{ this.profiles }}
  </v-container>
  <!-- プロフィール一覧END -->
</template>

<script>
import LikeButton from '~/components/LikeButton.vue'
export default {
  layout: 'navbar',
  components: {
    LikeButton,
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