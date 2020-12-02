<template>
<!-- ユーザー登録モーダル -->
  <v-container>
    <v-dialog v-model="signUpDialog" max-width="400">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">signUp</v-btn>
      </template>
      <v-card>
        <v-card-title class="justify-center">
          メールアドレスで新規登録
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-form>
            <v-row class="text-center">
              <v-col cols="12">
                <v-text-field class="logInInput" v-model="displayName" outlined placeholder='Name (他のユーザーからの表示名）'></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field class="logInInput" v-model="email" outlined placeholder='Email'></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field class="logInInput" v-model="password" outlined placeholder='Password'></v-text-field>
              </v-col>
              <v-col>
                <v-btn @click="createUserWithEmailAndPassword" width="30%">SignUp</v-btn>
              </v-col>
              <v-col cols="12">
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12">
                <v-btn @click="signUpDialog=!signUpDialog" width="30%">Cancel</v-btn>
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
      signUpDialog: false,
      displayName: '',
      email: '',
      password: '',
    }
  },
  methods: {
    createUserWithEmailAndPassword() {
      this.$fireAuth.createUserWithEmailAndPassword(this.email, this.password)
      .then((result) => {
          alert('SingUp Success')
          this.createUser(result.user)
          this.signUpDialog=!this.signUpDialog
        })
      .catch(function(error) {
      // Handle Errors here.
      const errorMessage = error.message;
      alert(errorMessage);
      });
    },
    async createUser (user) {
      const batch = this.$firestore.batch()
      
      // usersコレクションに登録ユーザーを追加
      batch.set(
        this.$firestore
          .collection('users')
          .doc(user.uid),
        {
          'name': this.displayName,
          'email':user.email,
          'password':user.password,
          'createdAt': this.$firebase.firestore.FieldValue.serverTimestamp(),
          'updatedAt': this.$firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      )

      // profilesコレクションに登録ユーザーのプロフィールを追加
      batch.set(
        this.$firestore
          .collection('profiles')
          .doc(user.uid),
        {
          'id': user.uid,
          'displayName': this.displayName,
          'bodyType': "普通",
          'bloodType': "A",
          'residence': "東京",
          'birthplace': "東京",
          'createdAt': this.$firebase.firestore.FieldValue.serverTimestamp(),
          'updatedAt': this.$firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      ),

      // 一括更新をコミット
      await batch.commit()
    }
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