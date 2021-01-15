<template>
  <v-container>
    <!--  検索窓-->
    <v-expansion-panels class="mb-4" v-show="currentUser">
      <v-expansion-panel>
        <v-expansion-panel-header color="info">
          <span>
            <v-icon>mdi-account-search</v-icon>
            条件を指定してフィルター/並べ替えする
          </span>
        </v-expansion-panel-header>
        <v-lazy>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12" sm="6">
                <div>
                  <v-row align="center" justify="end">
                    <v-col cols="6"> 性別 </v-col>
                    <v-col cols="6">
                      <v-select
                        @change="filterProfiles"
                        v-model="selectedItem.sex"
                        :items="items.sex"
                        item-color="blue"
                        color="info"
                      ></v-select>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div>
                  <v-row align="center">
                    <v-col cols="6">並び順</v-col>
                    <v-col cols="6">
                      <v-select
                        @change="orderProfiles"
                        v-model="selectedItem.orderBy"
                        :items="items.orderBy"
                        item-color="blue"
                      ></v-select>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-lazy>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- ローダー部分 -->
    <div v-if="loading">
      <v-row>
        <v-col cols="6" sm="4" lg="3" v-for="n of 4" :key="n">
          <v-skeleton-loader type="card-heading, card" />
        </v-col>
      </v-row>
    </div>
    <!-- プロフィール一覧 -->
    <v-row>
      <v-col
        cols="6"
        sm="4"
        lg="3"
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
          width="100%"
        >
          <v-card-title>
            <span class="white px-4 rounded-lg">{{ profile.displayName }}</span>
          </v-card-title>
          <v-layout justify-center>
            <Avatar :url="profile.avatarUrl" :size="avatarSize" :likedCount="profile.likedCount"></Avatar>
          </v-layout>
          <v-card-actions>
            <v-btn
              v-show="currentUser"
              @click.prevent="likeUser(currentUser, profile)"
              color="red darken-1 white--text"
              height="50"
              block
              rounded
              :disabled="profile.isLiked"
            >
              <v-icon>mdi-thumb-up-outline</v-icon>いいね！
            </v-btn>
          </v-card-actions>
        </v-card>
        <!-- カード部分END -->
      </v-col>
    </v-row>
  </v-container>
  <!-- プロフィール一覧END -->
</template>

<script>
import Avatar from "~/components/Avatar.vue";
export default {
  layout: "navbar",
  components: {
    Avatar,
  },
  data() {
    return {
      loading: true,
      currentUser: {},
      allProfiles: [],
      profiles: [],
      model: 0,
      colors: ["primary", "secondary", "yellow darken-2", "red", "orange"],
      items: {
        sex: ["全て", "男性", "女性"],
        orderBy: ["おまかせ", "登録日が新しい順", "いいね数が多い順"],
      },
      selectedItem: {
        sex: "全て",
        orderBy: "おまかせ",
      },
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
  // 表示するプロフィールの配列を取得する。
  async created() {
    const currentUser = await this.$auth();
    this.currentUser = currentUser

    if (currentUser) {
      // いいねしたユーザーの一覧を取得。
      const likedProfilesData = await this.$firestore
        .collection("users")
        .doc(currentUser.uid)
        .collection("likedProfiles")
        .get()
        .then((querySnapshot) => {
          return querySnapshot.docs.map((doc) => {
            return doc.data();
          });
        });
      const likedProfilesRef = likedProfilesData.map((data) => {
        return data.likedProfileRef;
      });

      //いいねされたユーザーの一覧を取得。
      const likedProfileUsersData = await this.$firestore
        .collection("profiles")
        .doc(currentUser.uid)
        .collection("likedProfileUsers")
        .get()
        .then((querySnapshot) => {
          return querySnapshot.docs.map((doc) => {
            return doc.data();
          });
        });
      const likedProfileUsersRef = likedProfileUsersData.map((data) => {
        return data.likedUserRef;
      });

      // すべてのユーザー一覧を取得。
      const allUsersQuerySnapshot = await this.$firestore
        .collection("profiles")
        .where("id", "!=", currentUser.uid)
        .get();
      const allUsersRef = allUsersQuerySnapshot.docs.map((doc) => doc.ref);

      // いいねした/いいねされたユーザーの一覧をマージ。
      const excludeProfilesRef = [...likedProfilesRef, ...likedProfileUsersRef];

      // すべてのユーザーからいいねしたユーザーを弾く。
      const usersRef = [];
      const likedProfilesId = excludeProfilesRef.map((ref) => ref.id);
      allUsersRef.forEach((ref) => {
        if (!likedProfilesId.includes(ref.id)) {
          usersRef.push(ref);
        }
      });

      // ユーザーを表示する。
      usersRef.map(async (user) => {
        const userRef = await user.get();
        const userData = userRef.data();
        userData.isLiked = false;
        this.profiles.push(userData);
      });
      this.loading = await false;
      this.allProfiles = this.profiles;
    } else {
      const allUsersQuerySnapshot = await this.$firestore
        .collection("profiles")
        .get();
      this.profiles = allUsersQuerySnapshot.docs.map((doc) => doc.data());
      this.loading = await false;
    }
  },
  methods: {
    async likeUser(user, profile) {
      // 追加
      const batch = this.$firestore.batch();

      // likedProfiles: ログインユーザーがいいねしたProfileのリスト
      // usersのサブコレクションlikedProfilesにいいねしたユーザーのデータを追加
      const likedProfileRef = await this.$firestore
        .collection("profiles")
        .doc(`${profile.id}`);
      batch.set(
        // エラーが起きて、言われるがままにインデックスの除外を追加した。
        // 参考：https://note.com/fsxfcu7y/n/nf195177b6e23
        this.$firestore
          .collection("users")
          .doc(user.uid)
          .collection("likedProfiles")
          .doc(),
        {
          likedProfileRef: likedProfileRef,
          isApproved: false,
          createdAt: this.$firebase.firestore.FieldValue.serverTimestamp(),
        }
      );

      // 該当ユーザーをいいねしたuserのリスト
      // いいねされた該当ユーザーのコレクションprofileのサブコレクションlikedProfileUsersにログインユーザーのデータを追加
      const likedUserRef = await this.$firestore
        .collection("profiles")
        .doc(user.uid);
      batch.set(
        this.$firestore
          .collection("profiles")
          .doc(profile.id)
          .collection("likedProfileUsers")
          .doc(),
        {
          likedUserRef: likedUserRef,
          isApproved: false,
          createdAt: this.$firebase.firestore.FieldValue.serverTimestamp(),
        }
      );

      await batch.commit();
      alert(profile.displayName + "さんにいいねを贈りました！");
      profile.isLiked = true;
    },
    filterProfiles(sex) {
      switch (sex) {
        case "全て":
          this.profiles = this.allProfiles;
          break;
        case "男性":
          this.profiles = this.allProfiles.filter(
            (profile) => profile.sex == "男性"
          );
          break;
        case "女性":
          this.profiles = this.allProfiles.filter(
            (profile) => profile.sex == "女性"
          );
          break;
        default:
          console.log(`Sorry, we are out of ${sex}.`);
          break;
      }
    },
    orderProfiles(orderBy) {
      switch (orderBy) {
        case "おまかせ":
          this.profiles = this.allProfiles;
          break;
        case "登録日が新しい順":
          this.profiles = this.allProfiles.slice().sort(function (a, b) {
            if (a.createdAt < b.createdAt) {
              return 1;
            } else {
              return -1;
            }
          });
          break;
        case "いいね数が多い順":
          this.profiles = this.allProfiles.slice().sort(function (a, b) {
            if (a.likedCount < b.likedCount) {
              return 1;
            } else {
              return -1;
            }
          });
          break;
        default:
          console.log(`Sorry, we are out of ${orderBy}.`);
          break;
      }
    },
  },
};
</script>

<style>
.picture {
  display: block;
  margin: 0 auto;
  width: 70%;
  border: 1px solid rgb(200, 200, 200);
}
</style>