<template>
  <div>
    <!-- 画面タブ -->
    <v-tabs
      v-model="tab"
      background-color="#ECEFF1"
      grow
      color="grey"
    >
      <v-tab>
        相手から
      </v-tab>
      <v-tab>
        自分から
      </v-tab>
    </v-tabs>
    <!-- 画面タブここまで -->

    <!-- タブ内容 -->
    <v-tabs-items v-model="tab" class="primary">
      <!-- 相手から -->
      <v-tab-item>
        <v-row>
          <v-col cols="12" md="6" v-for="like in likes" :key="like.id">
            <v-card
              hover
              nuxt
              :to="`/users/${like.id}`"
            >
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
                  <v-btn @click.prevent="approveLike(like)"
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
      </v-tab-item>
      <!-- 自分から -->
      <v-tab-item>
        bbb
      </v-tab-item>
    </v-tabs-items>

    <v-skeleton-loader v-if="loading" type="card"/>
  </div>
</template>

<script>
import LikeButton from "~/components/LikeButton.vue";
export default {
  layout: "navbar",
  components: {
    LikeButton,
  },
  data() {
    return {
      loading: true,
      currentUser: {},
      likes: [],
      tab: null,
    };
  },
  created() {
    this.$fireAuth.onAuthStateChanged(async(user) => {
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
          const likedUser = await like.likedUserRef.get()
          const likedUserName = likedUser.data().name
          like.userId = like.likedUserRef.id
          like.name = likedUserName
          like.createdAt = like.createdAt.toDate().toLocaleString('ja-JP-u-ca-japanese')
          this.likes.push(like)
          this.loading = false
        })
      } catch (error) {
        console.log(error)
      }
    });
  },
  methods: {
    async approveLike(like) {
      const batch = this.$firestore.batch()
      like.isApproved = true

      // Firestore上のデータを更新
      batch.update(
        this.$firestore
        .collection('profiles')
        .doc(this.currentUser.uid)
        .collection('likedProfileUsers')
        .doc(like.id),
        {
          isApproved: true,
        }
      )

      // ルーム作成
      batch.set(
        this.$firestore
        .collection('rooms')
        .doc(),
        {
          attendUsersId: [this.currentUser.uid, like.userId],
          updatedAt: this.$firebase.firestore.FieldValue.serverTimestamp()
        }
      )

      // 一括処理
      await batch.commit()
    },
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