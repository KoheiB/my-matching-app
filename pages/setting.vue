<template>
  <v-container class="">
    <div class="text-h4">ユーザー設定</div>
    <v-divider class="mt-2 mb-6"></v-divider>
    <div class="">
      <span>現在登録されているメールアドレス：</span>
      <div class="d-inline">
        <div class="d-inline" v-if="true">
          {{ email }}
        </div>
        <div class="d-inline" v-if="false">
          <v-text-field></v-text-field>
        </div>
      </div>
      <v-btn @click="onClick" rounded>変更</v-btn>
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
      <v-btn class="red white--text ml-2" rounded>退会する</v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  layout: "navbar",
  middleware: ['checkLogin'],
  data() {
    return {
      email: "sss@gmail.com",
      bool: true,
    };
  },
  methods: {
    onClick() {
      const user = this.$fireAuth.currentUser;
      user
        .updateEmail("user@example.com")
        .then(function () {
          // Update successful.
        })
        .catch(function (error) {
          // An error happened.
        });
    },
    passwordReset() {
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
    },
    logOut() {
      if (window.confirm("Are You Sure to Sign Out?")) {
        this.$fireAuth.signOut().then(() => {
          alert("You Safely Signed Out.");
          this.$router.push("/"), location.reload();
        });
      }
    },
    unregister() {
      if (window.confirm("Are You Sure to unregister?")) {
      }
    }
  },
  created() {
    console.log(this.user);
  },
};
</script>

<style>
</style>