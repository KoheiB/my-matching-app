<template>
  <v-container>
    <v-btn x-large rounded nuxt to="/users/">ユーザー一覧ページへ</v-btn>
    <v-container style="max-width: 500px">
      <v-card tile elevation="0" background-color="white">
        <v-tabs v-model="tab" grow color="green">
          <v-tab> ログイン </v-tab>
          <v-tab> 新規登録 </v-tab>
        </v-tabs>

        <!-- ログイン画面 -->
        <v-tabs-items v-model="tab">
          <v-tab-item class="white">
            <v-card-actions>
              <v-form>
                <v-row class="text-center">
                  <v-col cols="12">
                    <v-text-field
                      v-model="login.email"
                      outlined
                      label="Email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="login.password"
                      outlined
                      label="Password"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-btn @click="logIn" width="30%">Login</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-actions>
          </v-tab-item>

          <!-- 新規登録画面 -->
          <v-tab-item class="white">
            <v-card-actions>
              <v-form>
                <v-row class="text-center">
                  <v-col cols="12">
                    <v-text-field
                      v-model="signup.nickname"
                      outlined
                      label="Nickname"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="signup.sex"
                      outlined
                      label="Sex"
                      :items="items.sex"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="signup.email"
                      outlined
                      label="Email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="signup.password"
                      outlined
                      label="Password"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-btn @click="signUp" width="30%">SignUp</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-actions>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      tab: null,
      login: {
        email: "",
        password: "",
      },
      signup: {
        nickname: "",
        sex: null,
        email: "",
        password: "",
      },
      items: {
        sex: ["男性", "女性"],
      },
    };
  },
  methods: {
    logIn() {
      this.$fireAuth
        .signInWithEmailAndPassword(this.login.email, this.login.password)
        .then((user) => {
          this.$router.push("/users/");
        })
        .catch(function (error) {
          const errorMessage = error.message;
          alert(errorMessage);
        });
    },
    signUp() {
      this.$fireAuth
        .createUserWithEmailAndPassword(this.signup.email, this.signup.password)
        .then(async (result) => {
          const user = result.user
          user.updateProfile({
            displayName: this.signup.nickname,
          });
          try {
            const batch = this.$firestore.batch();

            // usersコレクションに登録ユーザーを追加
            batch.set(
              this.$firestore.collection("users").doc(user.uid),
              {
                name: this.signup.nickname,
                createdAt: this.$firebase.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            );

            // profilesコレクションに登録ユーザーのプロフィールを追加
            batch.set(
              this.$firestore.collection("profiles").doc(user.uid),
              {
                id: user.uid,
                avatarUrl: "",
                displayName: this.signup.nickname,
                sex: this.signup.sex,
                age: "未設定",
                body: "未設定",
                residence: "未設定",
                workLocation: "未設定",
                height: "未設定",
                bodyType: "未設定",
                occupation: "未設定",
                holiday: "未設定",
                drink: "未設定",
                tobacco: "未設定",
                housemate: "未設定",
                marriageDesire: "未設定",
                likedCount: 0,
                createdAt: this.$firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: this.$firebase.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            ),
              // 一括更新をコミット
              await batch.commit();
              this.$router.push("/users/");
          } catch (error) {
            await this.fireAuth.user.delete();
            console.log(error);
            alert("エラーが発生しました。もう一度登録し直してください。");
          }
        })
        .catch(function (error) {
          const errorMessage = error.message;
          alert(errorMessage);
        });
    },
  },
};
</script>

<style>
</style>
