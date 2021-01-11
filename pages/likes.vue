<template>
  <v-container>
    <!-- 画面タブ -->
    <v-tabs v-model="tab" background-color="#ECEFF1" grow color="green">
      <v-tab> 相手から </v-tab>
      <v-tab> 自分から </v-tab>
    </v-tabs>
    <!-- 画面タブここまで -->

    <!-- ローダー部分 -->
    <div v-if="loading && getLikes.length">
      <v-row>
        <v-col cols="6" sm="4" lg="3" v-for="n of 4" :key="n">
          <v-skeleton-loader type="card-heading, card" />
        </v-col>
      </v-row>
    </div>

    <!-- タブ内容 -->
    <v-tabs-items v-model="tab">
      <!-- 相手から -->
      <v-tab-item>
        <v-row>
          <v-col
            cols="6"
            sm="4"
            lg="3"
            v-for="getLike in getLikes"
            :key="getLike.id"
          >
            <v-card hover nuxt :to="`/users/${getLike.userId}`">
              <v-card-title>
                {{ getLike.displayName }}
              </v-card-title>
              <v-layout justify-center>
                <Avatar
                  :url="getLike.avatarUrl"
                  :size="avatarSize"
                  :likedCount="getLike.likedCount"
                ></Avatar>
              </v-layout>
              <v-card-subtitle>
                いいねされた日時:<br />{{ getLike.createdAt }}
              </v-card-subtitle>
              <v-card-actions>
                <v-btn
                  @click.prevent="approveLike(getLike)"
                  color="info"
                  block
                  rounded
                  height="50"
                  :disabled="getLike.isApproved"
                >
                  <v-icon>mdi-heart</v-icon>ありがとう！
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>

      <!-- 自分から -->
      <v-lazy>
        <v-tab-item>
          <v-row>
            <v-col
              cols="6"
              sm="4"
              lg="3"
              v-for="myLike in myLikes"
              :key="myLike.id"
            >
              <v-card hover nuxt :to="`/users/${myLike.userId}`">
                <v-card-title>
                  {{ myLike.displayname }}
                </v-card-title>
                <v-layout justify-center>
                  <Avatar
                    :url="myLike.avatarUrl"
                    :size="avatarSize"
                    :likedCount="myLike.likedCount"
                  ></Avatar>
                </v-layout>
                <v-card-subtitle>
                  いいねした日時:<br />{{ myLike.createdAt }}
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-lazy>
    </v-tabs-items>

    <v-skeleton-loader v-if="loading && !getLikes" type="card" />
  </v-container>
</template>

<script>
import Avatar from "~/components/Avatar.vue";
export default {
  layout: "navbar",
  components: {
    Avatar,
  },
  middleware: ["checkLogin"],
  data() {
    return {
      loading: true,
      getLikes: [],
      myLikes: [],
      tab: null,
    };
  },
  computed: {
    avatarSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 140;
        case "sm":
          return 160;
        case "md":
          return 190;
        case "lg":
          return 200;
        case "xl":
          return 200;
      }
    },
  },
  async created() {
    const currentUser = await this.$auth();
    // 相手からのいいねを取得
    try {
      const querySnapshot = await this.$firestore
        .collection("profiles")
        .doc(currentUser.uid)
        .collection("likedProfileUsers")
        .orderBy("createdAt", "desc")
        .get();
      const getLikes = querySnapshot.docs.map((doc) => {
        const result = doc.data();
        result.id = doc.id;
        return result;
      });
      getLikes.forEach(async (getLike) => {
        getLike.userId = getLike.likedUserRef.id;
        const likedUser = await getLike.likedUserRef.get();
        getLike.displayName = likedUser.data().displayName;
        getLike.likedCount = likedUser.data().likedCount;
        getLike.createdAt = getLike.createdAt
          .toDate()
          .toLocaleString("ja-JP-u-ca-japanese");
        getLike.avatarUrl = likedUser.data().avatarUrl;
        this.getLikes.push(getLike);
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
    }
    // 自分のいいねを取得。
    try {
      const querySnapshot = await this.$firestore
        .collection("users")
        .doc(currentUser.uid)
        .collection("likedProfiles")
        .get();
      const myLikes = querySnapshot.docs.map((doc) => {
        const result = doc.data();
        result.id = doc.id;
        return result;
      });
      myLikes.forEach(async (myLike) => {
        myLike.userId = myLike.likedProfileRef.id;
        const likedProfile = await myLike.likedProfileRef.get();
        myLike.displayName = likedProfile.data().displayName;
        myLike.likedCount = likedProfile.data().likedCount;
        myLike.createdAt = myLike.createdAt
          .toDate()
          .toLocaleString("ja-JP-u-ca-japanese");
        myLike.avatarUrl = likedProfile.data().avatarUrl;
        this.myLikes.push(myLike);
      });
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    async approveLike(like) {
      const batch = this.$firestore.batch();
      const currentUser = await this.$auth();

      // Firestore上のデータを更新。
      // １、ログインユーザーのプロフィールをいいねした該当ユーザーのデータを更新。
      const profileRef = this.$firestore
        .collection("profiles")
        .doc(like.userId);
      const likedQuerySnapshot = await this.$firestore
        .collection("profiles")
        .doc(currentUser.uid)
        .collection("likedProfileUsers")
        .where("likedUserRef", "==", profileRef)
        .get();
      const likedRef = likedQuerySnapshot.docs[0].ref;
      batch.update(
        this.$firestore
          .collection("profiles")
          .doc(currentUser.uid)
          .collection("likedProfileUsers")
          .doc(likedRef.id),
        {
          isApproved: true,
        }
      );

      // ２、該当ユーザーがいいねしたログインユーザーのデータを更新。
      const currentUserProfileRef = this.$firestore
        .collection("profiles")
        .doc(currentUser.uid);
      const likeQuerySnapshot = await this.$firestore
        .collection("users")
        .doc(like.userId)
        .collection("likedProfiles")
        .where("likedProfileRef", "==", currentUserProfileRef)
        .get();
      const likeRef = likeQuerySnapshot.docs[0].ref;
      batch.update(
        this.$firestore
          .collection("users")
          .doc(like.userId)
          .collection("likedProfiles")
          .doc(likeRef.id),
        {
          isApproved: true,
        }
      );

      // ルーム作成
      batch.set(this.$firestore.collection("rooms").doc(), {
        attendUsersId: [currentUser.uid, like.userId],
        [currentUser.uid]: 0,
        [like.userId]: 0,
        latestMessage: { senderId: "", body: "" },
        updatedAt: this.$firebase.firestore.FieldValue.serverTimestamp(),
      });

      // 一括処理
      await batch.commit();
      alert(
        like.displayName +
          "さんとメッセージのやりとりが出来るようになりました！"
      );
      like.isApproved = true;
    },
  },
};
</script>

<style>
.member-picture {
  border-radius: 50%;
  border: 1px solid #ccc;
  margin-left: 10px;
}
.v-tabs-items {
  background-color: #eceff1 !important;
}
</style>