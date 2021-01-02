<template>
  <v-container class="message-wrapper">
    <v-btn>相手のプロフィールを確認する</v-btn>
    <v-card
      class="teal lighten-4 mt-2 mb-2 overflow-auto d-flex flex-column"
      outlined
      height="500"
    >
    <v-row align="end">
      <v-col class="pa-0 ma-0">
        <div v-for="message in messages" :key="message.id" v-show="messages">
          <div v-if="isMyMessage(message.userId)" >
            <v-row align="center">
              <v-col cols="2"></v-col>
              <v-col cols="8" class="d-flex justify-end">
                <div class="teal lighten-5 pa-2 rounded-lg">
                  {{ message.body }}
                </div>
              </v-col>
              <v-col cols="2">
                <v-avatar size="40">
                  <v-img :src="require('@/assets/image/default-user.jpg')" />
                </v-avatar>
              </v-col>
            </v-row>
          </div>
          <div v-else>
            <v-row>
              <v-col cols="2" class="d-flex justify-end">
                <v-avatar size="40">
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

      </v-col>
    </v-row>
      <v-container v-show="!messages">
        <p>まだチャットがありません</p>
      </v-container>
    </v-card>
    <v-form @submit.prevent="onSubmit">
      <v-text-field v-model="sendingMessage" label="メッセージを入力" />
    </v-form>
  </v-container>
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
.message-wrapper {
  max-width: 600px;
}
</style>