<template>
  <v-container class="message-wrapper">
    <v-btn @click="dialog = true">相手のプロフィールを確認する</v-btn>
    <div
      class="teal lighten-4 mt-2 mb-2 overflow-y-auto d-flex flex-column"
      style="height: 500px; overflow-y: scroll; overflow-x: hidden"
      outlined
      ref="targetContent"
    >
      <v-row align="end">
        <v-col class="pa-0 ma-0">
          <div v-for="message in messages" :key="message.id" v-show="messages">
            <div v-if="isMyMessage(message.userId)">
              <v-row align="center">
                <v-col cols="2"></v-col>
                <v-col cols="8" class="d-flex justify-end">
                  <div class="teal lighten-5 pa-2 rounded-lg">
                    {{ message.body }}
                  </div>
                </v-col>
                <v-col cols="2">
                  <v-avatar size="40">
                    <v-img
                      v-show="!myAvatarUrl"
                      :src="require('@/assets/image/default-user.jpg')"
                    />
                    <v-img :src="myAvatarUrl" v-show="myAvatarUrl" />
                  </v-avatar>
                </v-col>
              </v-row>
            </div>
            <div v-else>
              <v-row>
                <v-col cols="2" class="d-flex justify-end">
                  <v-avatar size="40" style="cursor: pointer">
                    <v-img
                      @click="dialog = true"
                      v-show="!profile.avatarUrl"
                      :src="require('@/assets/image/default-user.jpg')"
                    />
                    <v-img
                      v-show="profile.avatarUrl"
                      @click="dialog = true"
                      :src="profile.avatarUrl"
                    />
                  </v-avatar>
                </v-col>
                <v-col cols="8" class="d-flex">
                  <div class="teal lighten-5 pa-2 rounded-lg">
                    {{ message.body }}
                  </div>
                </v-col>
                <v-col cols="2"></v-col>
              </v-row>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-container v-show="!messages.length">
        <p>まだチャットがありません</p>
      </v-container>
    </div>
    <v-form @submit.prevent="onSubmit">
      <v-text-field
        v-model="sendingMessage"
        label="メッセージを入力"
        color="info"
      />
    </v-form>
    <v-lazy>
      <v-dialog
        v-model="dialog"
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card>
          <v-toolbar color="info">
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <!-- 相手のプロフィールを確認する画面 -->
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-layout justify-center>
                  <Avatar :url="profile.avatarUrl" :size="avatarSize"></Avatar>
                </v-layout>
                <v-form>
                  <v-row>
                    <v-col cols="8">
                      <v-text-field
                        v-model="profile.displayName"
                        outlined
                        color="info"
                        label="ニックネーム"
                        class="mt-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        class="mt-4"
                        v-model="profile.age"
                        color="info"
                        outlined
                        label="年齢"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-textarea
                    v-model="profile.body"
                    auto-grow
                    color="info"
                    outlined
                    label="自己紹介文"
                    class="mt-4"
                    readonly
                  ></v-textarea>
                </v-form>
              </v-col>
              <v-col cols="12" md="6">
                <v-container>
                  <v-form>
                    <Select
                      :profile="profile.residence"
                      :label="labels.residence"
                      :items="items.locations"
                      :isNotActive="true"
                    ></Select>
                    <Select
                      :profile="profile.workLocation"
                      :label="labels.workLocation"
                      :items="items.locations"
                      :isNotActive="true"
                    ></Select>
                    <Select
                      :profile="profile.height"
                      :label="labels.height"
                      :items="selectHeight"
                      :isNotActive="true"
                    ></Select>
                    <Select
                      :profile="profile.bodyType"
                      :label="labels.bodyType"
                      :items="items.bodyType"
                      :isNotActive="true"
                    ></Select>
                    <Select
                      v-model="profile.occupation"
                      :label="labels.occupation"
                      :items="items.occupation"
                      :isNotActive="true"
                    ></Select>
                    <Select
                      v-model="profile.holiday"
                      :label="labels.holiday"
                      :items="items.holiday"
                      :isNotActive="true"
                    ></Select>
                    <Select
                      v-model="profile.drink"
                      :label="labels.drink"
                      :items="items.drink"
                      :isNotActive="true"
                    ></Select>
                    <Select
                      v-model="profile.tobacco"
                      :label="labels.tobacco"
                      :items="items.tobacco"
                      :isNotActive="true"
                    ></Select>
                    <Select
                      v-model="profile.housemate"
                      :label="labels.housemate"
                      :items="items.housemate"
                      :isNotActive="true"
                    ></Select>
                    <Select
                      v-model="profile.marriageDesire"
                      :label="labels.marriageDesire"
                      :items="items.marriageDesire"
                      :isNotActive="true"
                    ></Select>
                  </v-form>
                </v-container>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-lazy>
  </v-container>
</template>

<script>
import Select from "~/components/Select.vue";
import Avatar from "~/components/Avatar.vue";
export default {
  layout: "navbar",
  components: {
    Select,
    Avatar,
  },
  middleware: ["checkLogin"],
  data() {
    return {
      roomId: this.$route.params.id,
      partnerId: "",
      unsubscribe: null,
      currentUser: {},
      myAvatarUrl: "",
      profile: {},
      messages: [],
      dialog: false,
      sendingMessage: "",
      labels: {
        age: "年齢",
        residence: "居住地",
        workLocation: "勤務地",
        height: "身長",
        bodyType: "体型",
        occupation: "職種",
        holiday: "休日",
        drink: "お酒を飲むか",
        tobacco: "タバコを吸うか",
        housemate: "同居人",
        marriageDesire: "結婚に対する意志",
      },
      items: {
        locations: [
          "未設定",
          "北海道",
          "青森県",
          "岩手県",
          "宮城県",
          "秋田県",
          "山形県",
          "福島県",
          "茨城県",
          "栃木県",
          "群馬県",
          "埼玉県",
          "千葉県",
          "東京都",
          "神奈川県",
          "新潟県",
          "富山県",
          "石川県",
          "福井県",
          "山梨県",
          "長野県",
          "岐阜県",
          "静岡県",
          "愛知県",
          "三重県",
          "滋賀県",
          "京都府",
          "大阪府",
          "兵庫県",
          "奈良県",
          "和歌山県",
          "鳥取県",
          "島根県",
          "岡山県",
          "広島県",
          "山口県",
          "徳島県",
          "香川県",
          "愛媛県",
          "高知県",
          "福岡県",
          "佐賀県",
          "長崎県",
          "熊本県",
          "大分県",
          "宮崎県",
          "鹿児島県",
          "沖縄県",
        ],
        bodyType: [
          "未設定",
          "スリム",
          "やや細め",
          "普通",
          "グラマー",
          "筋肉質",
          "ややぽっちゃり",
          "太め",
        ],
        occupation: [
          "未設定",
          "上場企業",
          "公務員",
          "自衛隊",
          "消防士",
          "コンサル",
          "経営者・役員",
          "外資金融",
          "営業・販売",
          "医師",
          "医療関係",
          "看護師",
          "美容関係",
          "弁護士",
          "公認会計士",
          "航空関係",
          "広告・マスコミ関係",
          "IT・通信関係",
          "食品関係",
          "製薬",
          "保険",
          "建築・不動産関係",
          "製造業",
          "サービス業",
          "調理師・栄養士",
          "アパレル",
          "芸能・モデル",
          "事務",
          "福祉",
          "保育士",
          "会社員",
          "学生",
          "自営業・自由業",
          "その他",
        ],
        holiday: ["未設定", "土日", "平日", "不定期", "その他"],
        drink: ["未設定", "飲まない", "飲む", "ときどき飲む"],
        tobacco: [
          "未設定",
          "吸わない",
          "相手が嫌ならやめる",
          "非喫煙者の前では吸わない",
          "吸う",
          "吸う（電子タバコ）",
        ],
        housemate: [
          "未設定",
          "一人暮らし",
          "ルームシェア",
          "ペットいます",
          "実家暮らし",
          "その他",
        ],
        marriageDesire: [
          "未設定",
          "すぐにでもしたい",
          "２〜３年のうちに",
          "良い人がいれば",
          "今のところ考えていない",
          "わからない",
        ],
      },
    };
  },
  computed: {
    selectHeight() {
      const maxAge = 201;
      const ageRange = [...Array(maxAge).keys()].reverse();
      return ageRange.splice(0, 80).reverse();
    },
    avatarSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 180;
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
  methods: {
    getMessages() {
      this.unsubscribe = this.$firestore
        .collection("rooms")
        .doc(this.roomId)
        .collection("messages")
        .orderBy("createdAt", "asc")
        .onSnapshot(
          (snapshot) => {
            snapshot.docs.map((doc) => {
              const docData = doc.data();
              docData.id = doc.id;
              const ids = [];
              this.messages.map((msg) => {
                ids.push(msg.id);
              });
              if (!ids.includes(docData.id)) {
                this.messages.push(docData);
              }
            });
          },
          function (error) {
            console.log(error);
          }
        );
    },
    isMyMessage(userId) {
      const { uid } = this.$fireAuth.currentUser;
      return userId === uid;
    },
    async onSubmit() {
      if (this.sendingMessage.trim()) {
        try {
          await this.$firestore
            .collection("rooms")
            .doc(this.roomId)
            .collection("messages")
            .add({
              userId: this.currentUser.uid,
              body: this.sendingMessage,
              createdAt: this.$firebase.firestore.FieldValue.serverTimestamp(),
            });
          console.log("submit");
          this.sendingMessage = "";
          this.scrollOnSubmit();
        } catch (error) {
          alert(error);
        }
      }
    },
    scrollOnCreated() {
      this.$refs.targetContent.scrollTo({
        top: this.$refs.targetContent.scrollHeight,
      });
    },
    scrollOnSubmit() {
      this.$refs.targetContent.scrollTo({
        top: this.$refs.targetContent.scrollHeight,
        behavior: "smooth",
      });
    },
  },
  async created() {
    this.getMessages();
    const currentUser = await this.$auth();
    this.currentUser = currentUser
    const roomId = this.$route.params.id;
    const docData = await this.$firestore
      .collection("rooms")
      .doc(roomId)
      .get()
      .then((doc) => doc.data());
    this.partnerId = docData.attendUsersId.filter(
      (id) => id !== currentUser.uid
    )[0];

    // 自分の画像を取得。
    const myProfileData = await this.$firestore
      .collection("profiles")
      .doc(currentUser.uid)
      .get()
      .then((doc) => doc.data());
    this.myAvatarUrl = myProfileData.avatarUrl;

    // 該当ユーザーのプロフィールのデータを取得。
    const snapshot = await this.$firestore
      .collection("profiles")
      .doc(this.partnerId)
      .get();
    const profileData = snapshot.data();
    this.profile = profileData;
    this.scrollOnCreated();
  },
  destroyed() {
    this.messages = [];
    if (this.unsubscribe) {
      console.log("unsubscribe");
      this.unsubscribe();
    }
  },
};
</script>
<style>
.message-wrapper {
  max-width: 600px;
}
</style>