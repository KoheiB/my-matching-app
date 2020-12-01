<template>
  <v-btn @click="onclick(currentUser)"
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
    profileId: String
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
      // ログインユーザーのサブコレクションlikedProfilesにいいねしたユーザーのデータを追加
      // profileId: いいねした相手のプロフィールID
      // profileRef: いいねした相手のプロフィールのDocumentReference
      // const profileRef = await this.$firestore.collectionGroup('profile').where('id', '==', this.profileId).get();
      batch.set(
        // エラーが起きて、言われるがままにインデックスの除外を追加した。
        // 参考：https://note.com/fsxfcu7y/n/nf195177b6e23
        this.$firestore
          .collection('users')
          .doc(user.uid)
          .collection('likedProfiles')
          .doc(),
        {
          'profileId': this.profileId,
          // 'profileRef': profileRef,
          // createTime: this.$firestore.FieldValue.serverTimestamp()
        }
      )
      

      // 該当ユーザーをいいねしたuserのリスト
      // いいねされた該当ユーザーのサブコレクションprofileのサブコレクションlikedUsersにログインユーザーのデータを追加
      // userIdWhoLiked: 該当ユーザーをいいねしたログインユーザーのID

      batch.set(
        this.$firestore
          .collection('profiles')
          .doc(this.profileId)
          .collection('likedProfileUsers')
          .doc(),
        {
          userIdWhoLiked: user.uid,
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