<template>
  <v-container>
    <div>
      <span>現在登録されているメールアドレス：</span>
      <div class="d-inline">
        <div class="my-5">
          {{ email }}
        </div>
        <v-form v-show="!change" style="width: 500px">
          <v-row align="center">
            <v-col cols="10">
          <v-text-field type="text" color="info" label="新しいメールアドレス"></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn class="save white--text" @click='changeEmail'>変更</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </div>
      <v-btn class="save white--text" @click="change = !change">メールアドレスを変更する</v-btn>
    </div>
    <v-divider class="mt-2 mb-6"></v-divider>
    <div>
      <v-btn class="save white--text" @click="passwordReset">パスワードを変更する</v-btn>
      <p class="mt-4">
        現在登録されているメールアドレスにパスワード変更メールが送信されます。
      </p>
    </div>
    <v-divider class="mt-2 mb-6"></v-divider>
    <div>
      <v-btn @click="logOut">ログアウト</v-btn>
      <v-btn @click="unregister" class="red white--text ml-6"
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
          alert(
            "メールアドレスが正常に変更されませんでした。もう一度入力し直してください。"
          );
          this.email = "";
        });
    },
    passwordReset() {
      if (
        window.confirm(
          "現在登録されているメールアドレスにパスワード変更のメールを送信しますか？"
        )
      ) {
        const user = this.$fireAuth.currentUser;
        this.$fireAuth
          .sendPasswordResetEmail(user.email)
          .then(function () {
            // Email sent.
            alert("Email sent");
          })
          .catch(function (error) {
            // An error happened.
          });
      }
    },
    logOut() {
      if (window.confirm("ログアウトしますか？")) {
        this.$fireAuth.signOut().then(() => {
          alert('ログアウトしました。')
          this.$router.push("/");
        });
      }
    },
    async unregister() {
      const user = await this.$auth();
      if(user.uid === 'ZdnYuNDKkefVxOyyJLQoSlAngIx2'||'CRcfFOhBobQOea3nDqTwCLsi8te2' ) {
        alert('テストユーザーは退会出来ません。退会機能を試したい場合は、ユーザーを新規登録して行ってください。')
        return
      }
      if (window.confirm("本当に退会しますか？")) {
        await this.$fireAuth.currentUser.delete().then(() => {
          alert('退会が完了しました。ユーザーに関わるすべてのデータを削除しました。')
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