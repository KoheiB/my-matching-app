<template>
<!-- ログインモーダル -->
  <v-container>
    <v-dialog v-model="logInDialog" max-width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">logIn</v-btn>
      </template>
      <v-card>
        <v-card-title class="justify-center">
          ログイン
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-row class="text-center">
            <v-col cols="12">
              メールアドレスでログイン
            </v-col>
            <v-col cols="12">
              <v-btn width="80%" @click="emailLogInDialog=!emailLogInDialog">Email and Password</v-btn>
            </v-col>
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12">
              SNSでログイン
            </v-col>
            <v-col cols="12">
              <v-btn width="80%" @click="logInWithGoogle">Google</v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn width="80%" @click="logInWithTwitter">Twitter</v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn width="80%" @click="logInWithFacebook">Facebook</v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn width="80%" @click="logInWithGithub">Github</v-btn>
            </v-col>
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12">
              <v-btn width="40%" @click="logInDialog=!logInDialog">Cancel</v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- メールアドレスログインモーダル -->
    <v-dialog v-model="emailLogInDialog" max-width="400">
      <v-card>
        <v-card-title class="justify-center">
          メールアドレスでログイン
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-form>
            <v-row class="text-center">
              <v-col cols="12">
                <v-text-field class="logInInput" v-model="email" outlined placeholder='Email'></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field class="logInInput" v-model="password" outlined placeholder='Password'></v-text-field>
              </v-col>
              <v-col>
                <v-btn @click="logInWithEmailAndPassword" width="30%">Login</v-btn>
              </v-col>
              <v-col cols="12">
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12">
                <v-btn @click="emailLogInDialog=!emailLogInDialog" width="30%">Cancel</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-actions>
      </v-card>

    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data (){
    return {
      logInDialog: false,
      emailLogInDialog: false,
      email: '',
      password: '',
    }
  },
  methods: {
    logInWithEmailAndPassword() {
      this.$fireAuth.signInWithEmailAndPassword(this.email, this.password).catch(function(error) {
        // Handle Errors here.
      const errorMessage = error.message;
      alert(errorMessage);
      });
    },
    logInWithGoogle() {
      const provider = new this.$firebase.auth.GoogleAuthProvider()
      this.$fireAuth.signInWithPopup(provider)
      .then((result) => {
        this.createUser(result.user)
      })
    },
    logInWithTwitter() {
      const provider = new this.$firebase.auth.TwitterAuthProvider()
      this.$fireAuth.signInWithPopup(provider)
      .then((result) => {
        this.createUser(result.user)
      })
    },
    logInWithFacebook() {
      const provider = new this.$firebase.auth.FacebookAuthProvider()
      this.$fireAuth.signInWithPopup(provider)
      .then((result) => {
        this.createUser(result.user)
      })
    },
    logInWithGithub() {
      const provider = new this.$firebase.auth.GithubAuthProvider()
      this.$fireAuth.signInWithPopup(provider)
      .then((result) => {
        alert('Hello, '+result.user.displayName+'!')
        this.createUser(result.user)
      })
    },
    createUser (user) {
      this.$firestore.collection('users').doc(user.uid).set({
        'name': user.displayName,
        'photoURL': user.photoURL,
        'email':user.email
      }, { merge: true })
    },

  }
}
</script>

<style>
.logInInput {
  display: inline-block;
  width: 80%;
  margin: 0 auto;
}
</style>