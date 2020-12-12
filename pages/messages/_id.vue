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
    <v-col cols="1">
      <v-divider vertical></v-divider>
    </v-col>

    <!-- 右半分 メッセージ画面 -->
    <v-col cols="5">
      マナーを守って楽しくチャットしよう！
      <v-container v-if="!this.chats.docs">
        チャットを送ってみよう！
      </v-container>
      <v-sheet v-for="chat in chats" :key="chat.id">
        {{ chats }}
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'navbar',
  data() {
    return {
      attendUserId: this.$route.params.id,
      chats: [],
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
      const querySnapshot = await this.$firestore
      .collection('users')
      .doc(user.uid)
      .collection('chatrooms')
      .doc(this.attendUserId)
      .collection('chats')
      .get();
      console.log(querySnapshot)
      const chats = querySnapshot.docs.map((doc) => {
        const result = doc.data()
        console.log(result)
        return result
      });
      this.chats = chats
    })
  }
}
</script>

<style>

</style>