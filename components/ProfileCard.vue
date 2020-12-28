<template>
  <v-card 
    class="card mb-5 teal lighten-5"
    nuxt
    :to="`/users/${profileId}`"
    hover
    :ripple="false"
  >
    <v-card-title>
      <span class="white px-4 rounded-lg">{{ name }}</span>
    </v-card-title>
    <v-layout justify-center>
      <v-avatar size="200">
        <v-img v-show="!avatarUrl"
          :src="require('@/assets/image/default-user.jpg')"
        />
        <v-img v-show="avatarUrl"
          :src="avatarUrl"
        />
      </v-avatar>
    </v-layout>
    <v-card-actions>
      <v-btn @click.prevent="onclick(currentUser)"
        color="red darken-1 white--text"
        height="50"
        block
        rounded
        :disabled = !currentUser
      >
        <v-icon>mdi-thumb-up-outline</v-icon>いいね！
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      currentUser: {}
    }
  },
  props: {
    prodileId: {
      type: String,
      required: true
    },
    avatarUrl: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    likedCount: {
      type: Number,
      required: true
    }
  },
  
  methods: {
    async onclick(user) {
      // 追加
      const batch = this.$firestore.batch()
      
      // likedProfiles: ログインユーザーがいいねしたProfileのリスト
      // usersのサブコレクションlikedProfilesにいいねしたユーザーのデータを追加
      const likedProfileRef = await this.$firestore.collection('profiles').doc(`${this.profileId}`)
      batch.set(
        // エラーが起きて、言われるがままにインデックスの除外を追加した。
        // 参考：https://note.com/fsxfcu7y/n/nf195177b6e23
        this.$firestore
          .collection('users')
          .doc(user.uid)
          .collection('likedProfiles')
          .doc(),
        {
          likedProfileRef: likedProfileRef,
          isApproved: false,
          createdAt: this.$firebase.firestore.FieldValue.serverTimestamp()
        }
      )
      
      // 該当ユーザーをいいねしたuserのリスト
      // いいねされた該当ユーザーのコレクションprofileのサブコレクションlikedProfileUsersにログインユーザーのデータを追加
      const likedUserRef = await this.$firestore.collection('users').doc(user.uid)
      batch.set(
        this.$firestore
          .collection('profiles')
          .doc(this.profileId)
          .collection('likedProfileUsers')
          .doc(),
        {
          likedUserRef: likedUserRef,
          isApproved: false,
          createdAt: this.$firebase.firestore.FieldValue.serverTimestamp()
        }
      )

      await batch.commit()
      alert('you liked')
    },
  },
  created() {
    this.currentUser = this.$fireAuth.currentUser
  }
}
</script>

<style>

</style>