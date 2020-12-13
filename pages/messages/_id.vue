<template>
  <v-row>
    <!-- 左半分 プロフィール画面 -->
    <v-col cols="6">
      <v-container>
        <div class="text-h4">Name</div>
        <v-img :src="picture"
        width="100px"
        />
        <v-divider />
        <v-container class="text-h4">Profile</v-container>
          <v-form>
            <v-container>
              <v-row v-for="item in items"
                :key="item.name">
                <v-col cols="2"></v-col>
                <v-col cols="2"
                align-self="center"
                >
                  {{ item.name }}
                </v-col>
                <v-col cols="6"
                align-self="center"
                >
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
        <v-card
        outlined
          class="info mb-2 overflow-auto"
          max-height="50%"
        >
          <v-container
            v-show="chats"
            v-for="chat in chats"
            :key="chat.id"
          >
            <v-sheet rounded>
              {{ chat.content }}
            </v-sheet>
          </v-container>
          <v-container
            v-show="!chats.length"
          >
            <p>まだチャットがありません</p>
          </v-container>
        </v-card>
        <v-form @submit.prevent="onSubmit">
          <v-text-field
            v-model="content"
            placeholder="チャット"
          />
          <v-btn type="submit">submit</v-btn>
        </v-form>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'navbar',
  data() {
    return {
      attendUserId: this.$route.params.id,
      currentUser: {},
      chats: [],
      content: '',
      picture: require('@/assets/image/html.png'),
      name: 'aaa',
      items: [
        { name: '身長'},
        { name: '体型'},
        { name: '血液型'},
        { name: '居住地'},
        { name: '出身地'},
      ],

    }
  },
  created() {
    this.$fireAuth.onAuthStateChanged(async(user) => {
      this.currentUser = user
      const querySnapshot = await this.$firestore
      .collection('users')
      .doc(user.uid)
      .collection('chatrooms')
      .doc(this.attendUserId)
      .collection('chats')
      .get();
      const chats = querySnapshot.docs.map((doc) => {
        const result = doc.data()
        return result
      });
      this.chats = chats
    })
  },
  methods: {
    onSubmit() {
      this.$firestore.collection('users').doc(this.currentUser.uid)
      .collection('chatrooms').doc(this.attendUserId)
      .collection('chats').add(),
      {
        'content': this.content,
        'createdAt': this.$firebase.firestore.FieldValue.serverTimestamp(),
      }
      console.log('submit');
    }
  }
}

</script>

<style>
.box {
  height: 80%;
}

</style>