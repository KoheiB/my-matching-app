<template>
  <v-container class="info">
    <v-row>
      <v-col cols="12" md="6" lg="4" class="green">
        <v-layout justify-center>
          <v-avatar size="200">
            <v-img
              v-show="!profile.avatarUrl"
              :src="require('@/assets/image/default-user.jpg')"
            />
            <v-img v-show="profile.avatarUrl" :src="profile.avatarUrl" />
          </v-avatar>
        </v-layout>
        <v-btn class="d-flex mt-4 mx-auto" @click="selectImage"
          >プロフィール写真をアップロードする</v-btn
        >
        <input
          ref="image"
          type="file"
          style="display: none"
          accept="image/*"
          @change="onSelectFile"
        />
      </v-col>
      <v-col cols="12" md="6" lg="8">
        <v-form class="red">
          <v-row>
            <v-col cols="6">
              <v-row v-for="item in items" :key="item.name">
                <v-col cols="3" align-self="center">
                  {{ item.name }}
                </v-col>
                <v-col cols="9" align-self="center">
                  <v-text-field v-model="name"></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row v-for="item in items" :key="item.name">
                <v-col cols="3" align-self="center">
                  {{ item.name }}
                </v-col>
                <v-col cols="9" align-self="center">
                  <v-text-field v-model="name"></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "navbar",
  data() {
    return {
      name: "aaa",
      profile: {
        avatarUrl: "",
      },
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
    selectImage() {
      this.$refs.image.click();
    },
    onSelectFile(e) {
      const files = e.target.files;
      if (files.length === 0) return;

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.addEventListener("load", () => {
        this.upload({
          localImageFile: files[0],
        });
      });
    },
    async upload({ localImageFile }) {
      const user = await this.$auth()

      // 未ログインの場合
      if (!user) this.$router.push('/users/')

      // ストレージオブジェクト作成
      const storageRef = this.$fireStorage.ref()

      // ファイルのパスを設定
      const imageRef = await storageRef.child(
        `images/${user.uid}/${localImageFile.name}`
      )
      // ファイルを適用してファイルアップロード開始
      const snapShot = await imageRef.put(localImageFile)
      this.profile.avatarUrl = await snapShot.ref.getDownloadURL()

      // Firestoreに登録
      this.$firestore.collection('profiles').doc(user.uid).set({
        avatarUrl: this.profile.avatarUrl
      }, { merge: true})
    }
  },
  async created () {
    const user = await this.$auth()
    const snapshot = await this.$firestore.collection('profiles').doc(user.uid).get()
    const profileData = snapshot.data()
    this.profile = profileData
  }
};
</script>

<style>
</style>