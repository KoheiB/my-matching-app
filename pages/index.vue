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
                    <v-btn @click="logInWithEmailAndPassword" width="30%"
                      >Login</v-btn
                    >
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
                    <v-btn @click="logInWithEmailAndPassword" width="30%"
                      >SignUp</v-btn
                    >
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
        email: '',
        password: '',
      },
      signup: {
        nickname: '',
        sex: null,
        email: '',
        password: '',
      },
      items: {
        sex: ['男性', '女性']
      }
    };
  },
};
</script>

<style>
</style>
