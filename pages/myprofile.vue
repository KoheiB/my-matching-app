<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
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
        <v-form>
          <v-text-field v-model="profile.displayName" outlined color="black" label="ニックネーム" class="mt-4"></v-text-field>
          <v-textarea v-model="profile.body" auto-grow color="black" outlined label="自己紹介文" class="mt-4"></v-textarea>
        </v-form>
      </v-col>
      <v-col cols="12" md="6">
        <v-container>
          <v-form>
            <Select :profile="profile.age" :label="labels.age" :items="selectAge"></Select>
            <Select :profile="profile.residence" :label="labels.residence" :items="items.locations"></Select>
            <Select :profile="profile.workLocation" :label="labels.workLocation" :items="items.locations"></Select>
            <Select :profile="profile.height" :label="labels.height" :items="selectHeight"></Select>
            <Select :profile="profile.bodyType" :label="labels.bodyType" :items="items.bodyType"></Select>
            <Select :profile="profile.occupation" :label="labels.occupation" :items="items.occupation"></Select>
            <Select :profile="profile.holiday" :label="labels.holiday" :items="items.holiday"></Select>
            <Select :profile="profile.drink" :label="labels.drink" :items="items.drink"></Select>
            <Select :profile="profile.tobacco" :label="labels.tobacco" :items="items.tobacco"></Select>
            <Select :profile="profile.housemate" :label="labels.housemate" :items="items.housemate"></Select>
            <Select :profile="profile.marriageDesire" :label="labels.marriageDesire" :items="items.marriageDesire"></Select>
          </v-form>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Select from '~/components/Select.vue'
export default {
  layout: "navbar",
  components: {
    Select,
  },
  data() {
    return {
      name: "aaa",
      profile: {
        avatarUrl: "",
      },
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
        marriageDesire: "結婚に対する意志"

      },
      items:{
        locations: [
          '未設定',
          '北海道',
          '青森県',
          '岩手県',
          '宮城県',
          '秋田県',
          '山形県',
          '福島県',
          '茨城県',
          '栃木県',
          '群馬県',
          '埼玉県',
          '千葉県',
          '東京都',
          '神奈川県',
          '新潟県',
          '富山県',
          '石川県',
          '福井県',
          '山梨県',
          '長野県',
          '岐阜県',
          '静岡県',
          '愛知県',
          '三重県',
          '滋賀県',
          '京都府',
          '大阪府',
          '兵庫県',
          '奈良県',
          '和歌山県',
          '鳥取県',
          '島根県',
          '岡山県',
          '広島県',
          '山口県',
          '徳島県',
          '香川県',
          '愛媛県',
          '高知県',
          '福岡県',
          '佐賀県',
          '長崎県',
          '熊本県',
          '大分県',
          '宮崎県',
          '鹿児島県',
          '沖縄県'
        ],
        bodyType: [
          '未設定',
          'スリム',
          'やや細め',
          '普通',
          'グラマー',
          '筋肉質',
          'ややぽっちゃり',
          '太め'
        ],
        occupation: [
          '未設定',
          '上場企業',
          '公務員',
          '自衛隊',
          '消防士',
          'コンサル',
          '経営者・役員',
          '外資金融',
          '営業・販売',
          '医師',
          '医療関係',
          '看護師',
          '美容関係',
          '弁護士',
          '公認会計士',
          '航空関係',
          '広告・マスコミ関係',
          'IT・通信関係',
          '食品関係',
          '製薬',
          '保険',
          '建築・不動産関係',
          '製造業',
          'サービス業',
          '調理師・栄養士',
          'アパレル',
          '芸能・モデル',
          '事務',
          '福祉',
          '保育士',
          '会社員',
          '学生',
          '自営業・自由業',
          'その他'
        ],
        holiday: [
          '未設定',
          '土日',
          '平日',
          '不定期',
          'その他'
        ],
        drink: [
          '未設定',
          '飲まない',
          '飲む',
          'ときどき飲む'
        ],
        tobacco: [
          '未設定',
          '吸わない',
          '相手が嫌ならやめる',
          '非喫煙者の前では吸わない',
          '吸う',
          '吸う（電子タバコ）'
        ],
        housemate: [
          '未設定',
          '一人暮らし',
          'ルームシェア',
          'ペットいます',
          '実家暮らし',
          'その他'
        ],
        marriageDesire: [
          '未設定',
          'すぐにでもしたい',
          '２〜３年のうちに',
          '良い人がいれば',
          '今のところ考えていない',
          'わからない'
        ]
      }
    };
  },
  computed: {
    selectAge() {
      const maxAge = 81;
      const ageRange = [...Array(maxAge).keys()].reverse()
      return ageRange.splice(0,63).reverse()
    },
    selectHeight() {
      const maxAge = 201;
      const ageRange = [...Array(maxAge).keys()].reverse()
      return ageRange.splice(0,80).reverse()
    }
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