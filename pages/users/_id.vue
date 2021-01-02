<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-layout justify-center>
          <!-- ローダー部分 -->
          <div v-if="loading">
            <v-skeleton-loader type="image" />
          </div>
          <!-- ローダーここまで -->
          <v-avatar size="200">
            <v-img
              v-show="!profile.avatarUrl"
              :src="require('@/assets/image/default-user.jpg')"
            />
            <v-img v-show="profile.avatarUrl" :src="profile.avatarUrl" />
          </v-avatar>
        </v-layout>
        <v-layout class="mt-4" justify-space-around>
          <v-btn
            :disabled="relationStatus.hasLiked"
            rounded
            @click="likeProfile(profile)"
            v-show="!relationStatus.isLiked"
          >
            <v-icon>mdi-thumb-up-outline</v-icon>いいね！
          </v-btn>
          <v-btn
            @click="approveLike(profile)"
            v-show="relationStatus.isLiked"
            :disabled="relationStatus.isMatched"
            rounded
          >
            <v-icon>mdi-heart</v-icon>ありがとう！
          </v-btn>
          <v-btn
            :disabled="!relationStatus.isMatched"
            rounded
            nuxt
            :to="`/messages/${roomId}`"
          >
            <v-icon>mdi-email</v-icon>メッセージを送る
          </v-btn>
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
        {{ relationStatus }}
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
          {{ profile }}
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import Select from "~/components/Select.vue";
export default {
  layout: "navbar",
  components: {
    Select,
  },
  data() {
    return {
      loading: true,
      profile: {},
      roomId: "",
      relationStatus: {
        hasLiked: false,
        isLiked: false,
        isMatched: false,
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
  },
  methods: {
    async likeProfile(profile) {
      const currentUser = await this.$auth();
      const batch = this.$firestore.batch();

      // いいねしたプロフィールのリファレンスを取得。
      const likedProfileRef = this.$firestore
        .collection("profiles")
        .doc(`${profile.id}`);

      // ログインユーザーのサブコレクションにいいねしたプロフィールのデータを追加
      batch.set(
        this.$firestore
          .collection("users")
          .doc(currentUser.uid)
          .collection("likedProfiles")
          .doc(),
        {
          likedProfileRef: likedProfileRef,
          isApproved: false,
          createdAt: this.$firebase.firestore.FieldValue.serverTimestamp(),
        }
      );
      // ログインユーザーのリファレンスを追加
      const likedUserRef = this.$firestore
        .collection("profiles")
        .doc(currentUser.uid);

      // いいねされたプロフィールのサブコレクションにログインユーザーのデータを追加
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

      // 一括処理
      await batch.commit();
      alert("you liked");
      this.relationStatus.hasLiked = true;
    },
    async approveLike(profile) {
      const currentUser = await this.$auth();
      const batch = this.$firestore.batch();

      // Firestore上のデータを更新。
      // １、ログインユーザーのプロフィールをいいねした該当ユーザーのデータを更新。
      const profileRef = this.$firestore.collection("profiles").doc(profile.id);
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
        .doc(profile.id)
        .collection("likedProfiles")
        .where("likedProfileRef", "==", currentUserProfileRef)
        .get();
      const likeRef = likeQuerySnapshot.docs[0].ref;
      batch.update(
        this.$firestore
          .collection("users")
          .doc(profile.id)
          .collection("likedProfiles")
          .doc(likeRef.id),
        {
          isApproved: true,
        }
      );

      // ３、ルーム作成
      batch.set(this.$firestore.collection("rooms").doc(), {
        attendUsersId: [currentUser.uid, profile.id],
        updatedAt: this.$firebase.firestore.FieldValue.serverTimestamp(),
      });

      // 一括処理
      await batch.commit();
      alert("approved");
      this.relationStatus.isMatched = true;
    },
  },
  async created() {
    // ログインユーザーを取得。
    const currentUser = await this.$auth();

    // 該当ユーザーのプロフィールのデータを取得。
    const profileId = this.$route.params.id;
    const snapshot = await this.$firestore
      .collection("profiles")
      .doc(profileId)
      .get();
    const profileData = snapshot.data();
    this.profile = profileData;

    // ログインユーザーがいいねしているユーザーをクエリし、該当ユーザーをいいねしているか確認。
    const profileRef = this.$firestore.collection("profiles").doc(profileId);
    const hasLiked = await this.$firestore
      .collection("users")
      .doc(currentUser.uid)
      .collection("likedProfiles")
      .where("likedProfileRef", "==", profileRef)
      .get()
      .then((querySnapshot) => querySnapshot.size);
    if (hasLiked) {
      this.relationStatus.hasLiked = true;
    }

    // ログインユーザーがいいねされているユーザーをクエリし、該当ユーザーにいいねされているか確認。
    const isLiked = await this.$firestore
      .collection("profiles")
      .doc(currentUser.uid)
      .collection("likedProfileUsers")
      .where("likedUserRef", "==", profileRef)
      .get()
      .then((querySnapshot) => querySnapshot.size);
    if (isLiked) {
      this.relationStatus.isLiked = true;
    }

    // 参加ユーザーがログインユーザーと該当ユーザーのルームを取得して存在するか確認。配列の並び順により２パターン検証。
    const isMatched1 = await this.$firestore
      .collection("rooms")
      .where("attendUsersId", "==", [currentUser.uid, profileId])
      .get();
    const isMatched2 = await this.$firestore
      .collection("rooms")
      .where("attendUsersId", "==", [profileId, currentUser.uid])
      .get();
    if (isMatched1.size == 1) {
      this.relationStatus.isMatched = true;
      this.roomId = isMatched1.docs[0].ref.id;
      return;
    } else if (isMatched2.size == 1) {
      this.relationStatus.isMatched = true;
      this.roomId = isMatched2.docs[0].ref.id;
      return;
    }
    this.loading = await false;
  },
};
</script>

<style>
</style>