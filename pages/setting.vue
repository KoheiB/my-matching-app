<template>
  <v-container class="">
    <div class="text-h4">ユーザー設定</div>
    <v-divider class="mt-2 mb-6"></v-divider>
    <div>
      <span>現在登録されているメールアドレス：</span>
      <div class="d-inline">
        <div class="my-5" v-show="change">
          {{ email }}
        </div>
        <v-form v-show="!change" style="width: 500px">
          <v-row align="center">
            <v-col cols="10">
          <v-text-field type="text" color="info" label="新しいメールアドレス"></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn rounded @click='changeEmail'>変更</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </div>
      <v-btn @click="change = !change" rounded>メールアドレスを変更する</v-btn>
    </div>
    <v-divider class="mt-2 mb-6"></v-divider>
    <div>
      <v-btn rounded @click="passwordReset">パスワードを変更する</v-btn>
      <p class="mt-4">
        現在登録されているメールアドレスにパスワード変更メールが送信されます。
      </p>
    </div>
    <v-divider class="mt-2 mb-6"></v-divider>
    <div>
      <v-btn rounded @click="logOut">ログアウト</v-btn>
      <v-btn @click="unregister" class="red white--text ml-2" rounded
        >退会する</v-btn
      >
    </div>
  </v-container>
</template>

<script>
export default {
  layout: "navbar",
  middleware: ["checkLogin"],
  data() {
    return {
      email: "",
      change: true,
    };
  },
  methods: {
    changeEmail() {
      const user = this.$auth();
      user
        .updateEmail(this.email)
        .then(function () {
          this.email = "";
          alert("メールアドレスが正常に変更されました。");
        })
        .catch(function (error) {
          console.log("error");
          alert(
            "メールアドレスが正常に変更されませんでした。もう一度入力し直してください。"
          );
          this.email = "";
        });
    },
    passwordReset() {
      if (
        window.confirm(
          "パスワードを変更しますか？登録メールアドレスにパスワード変更のメールが送信されます。"
        )
      ) {
        const user = this.$fireAuth.currentUser;
        this.$fireAuth
          .sendPasswordResetEmail(user.email)
          .then(function () {
            // Email sent.
            console.log("Email sent.");
            alert("Email sent");
          })
          .catch(function (error) {
            // An error happened.
            console.log(error);
          });
      }
    },
    logOut() {
      if (window.confirm("ログアウトしますか？")) {
        this.$fireAuth.signOut().then(() => {
          this.$router.push("/");
        });
      }
    },
    async unregister() {
      if (window.confirm("本当に退会しますか？")) {
        await this.$fireAuth.currentUser.delete().then(() => {
          this.$router.push("/");
        });
      }
    },
  },
  async created() {
    const user = await this.$auth();
    this.email = user.email;
  },
};
</script>

<style>
</style>