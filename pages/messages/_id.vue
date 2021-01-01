<template>
  <v-row>
    <!-- 左半分 プロフィール画面 -->
    <v-col cols="6">
      <v-container>
        <div class="text-h4">Name</div>
        <v-img :src="picture" width="100px" />
        <v-divider />
        <v-container class="text-h4">Profile</v-container>
        <v-form>
          <v-container>
            <v-row v-for="item in items" :key="item.name">
              <v-col cols="2"></v-col>
              <v-col cols="2" align-self="center">
                {{ item.name }}
              </v-col>
              <v-col cols="6" align-self="center">
                <v-text-field v-model="name"></v-text-field>
              </v-col>
              <v-col cols="2"></v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-container>
    </v-col>

    <!-- ディバイダー -->
    <v-divider vertical></v-divider>

    <!-- 右半分 メッセージ画面 -->
    <v-col cols="5">
      <v-container class="box">
        <v-card class="teal lighten-4 mb-2 overflow-auto" outlined height="500">
          <div v-for="message in messages" :key="message.id" v-show="messages">
            <div v-if="isMyMessage(message.userId)">
              <v-row>
                <v-col cols="2"> </v-col>
                <v-col cols="8" class="d-flex justify-end">
                  <div class="teal lighten-5 pa-2 rounded-lg">
                    {{ message.body }}
                  </div>
                </v-col>
                <v-col cols="2" class="d-flex">
                  <v-avatar size="30">
                    <v-img :src="require('@/assets/image/default-user.jpg')" />
                  </v-avatar>
                </v-col>
              </v-row>
            </div>
            <div v-else>
              <v-row>
                <v-col cols="2" class="d-flex justify-end">
                  <v-avatar size="30">
                    <v-img :src="require('@/assets/image/default-user.jpg')" />
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
          <v-container v-show="!messages">
            <p>まだチャットがありません</p>
          </v-container>
        </v-card>
        <v-form @submit.prevent="onSubmit">
          <v-text-field
            v-model="sendingMessage"
            placeholder="メッセージを入力"
          />
          <div class="d-flex justify-end">
            <v-btn type="submit">送信</v-btn>
          </div>
        </v-form>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: "navbar",
  data() {
    return {
      roomId: this.$route.params.id,
      unsubscribe: null,
      currentUser: {},
      messages: [],
      sendingMessage: "",
      picture: require("@/assets/image/html.png"),
      name: "aaa",
      items: [
        { name: "身長" },
        { name: "体型" },
        { name: "血液型" },
        { name: "居住地" },
        { name: "出身地" },
      ],
    };
  },
  methods: {
    getMessages() {
      this.$fireAuth.onAuthStateChanged(async (user) => {
        this.currentUser = user;
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
      });
    },
    isMyMessage(userId) {
      const { uid } = this.$fireAuth.currentUser;
      return userId === uid;
    },
    onSubmit() {
      if (this.sendingMessage.trim()) {
        this.$firestore
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
      }
    },
  },
  created() {
    this.getMessages();
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
</style>