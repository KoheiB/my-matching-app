<template>
  <v-btn @click="onclick"
  color="info"
  height="40"
  block
  >
    <v-icon>mdi-thumb-up-outline</v-icon>いいね
  </v-btn>
</template>

<script>
export default {

  data() { 
    return {

    }
  },
  methods: {
    async onclick(user) {
      // 追加
      const batch = firestore.batch()
      const profileRef = this.$firestore.doc('users/user.uid/profile/user.uid')

      // usersコレクションのサブコレクションprofileのサブコレクションlikedUsersにプロフィールを見ていいねした人を追加
      batch.set(
        this.$firestore
          .collection('users')
          .doc(user.uid)
          .collection('profile')
          .doc(user.uid)
          .collection('likedUsers')
          .doc(anotherUserRef.id),
        {
          id: anotherUserRef.id,
          createTime: FieldValue.serverTimestamp()
        }
      )

      batch.set(
        this.$firestore
          .collection('users')
          .doc(anotherUserRef.path)
          .collection('likedPosts')
          .doc(postRef.id),
        {
          id: postRef.id,
          postRef: postRef,
          createTime: FieldValue.serverTimestamp()
        }
      )

      await batch.commit()
    }
  }
}
</script>

<style>

</style>