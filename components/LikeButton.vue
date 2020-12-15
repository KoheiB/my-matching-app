<template>
  <v-btn @click.prevent="onclick(currentUser)"
  color="info"
  height="40"
  :disabled = !currentUser
  >
    <v-icon>mdi-thumb-up-outline</v-icon>いいね
  </v-btn>
</template>

<script>
export default {

  data() { 
    return {
      currentUser: {}
    }
  },
  props: {
    profileId: {
      type: String,
      required: true
    }
  },
  created () {
    this.$fireAuth.onAuthStateChanged(user => {
      this.currentUser = user
    })
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
  }
}
</script>

<style>

</style>