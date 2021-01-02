<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" color="teal lighten-3" clipped app mobile-breakpoint="960">
      <v-list shaped>
        <v-list-item-group v-model="selectedItem" color="teal darken-3">
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar color="teal darken-1" elevation="2" app clipped-left>
      <v-app-bar-nav-icon @click="drawer=!drawer"></v-app-bar-nav-icon>
      <v-toolbar-title> MyMatchingApp </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="currentUser">
        <v-btn depressed x-large min-width="200">
          <v-avatar size="40"  color="white" class="mr-2">
            <v-img
              v-show="!userData.avatarUrl"
              :src="require('@/assets/image/default-user.jpg')"
            />
            <v-img v-show="userData.avatarUrl" :src="userData.avatarUrl" />
          </v-avatar>
          {{ userData.displayName }}
        </v-btn>
      </div>
      <div v-else>
        <v-btn @click="logIn"> ログイン </v-btn>
        <v-btn @click="logIn"> 新規登録 </v-btn>
      </div>
      <Login v-if="!currentUser"></Login>
      <Signup v-if="!currentUser"></Signup>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Login from "~/components/Login.vue";
import Signup from "~/components/Signup.vue";
export default {
  components: {
    Login,
    Signup,
  },
  data() {
    return {
      clipped: false,
      drawer: null,
      fixed: false,
      selectedItem: 1,
      currentUser: {},
      userData: "",
      items: [
        {
          icon: "mdi-magnify",
          title: "Search",
          to: "/users/",
        },
        {
          icon: "mdi-thumb-up",
          title: "Like",
          to: "/likes",
        },
        {
          icon: "mdi-email",
          title: "Message",
          to: "/messages/",
        },
        {
          icon: "mdi-account",
          title: "Profile",
          to: "/myprofile",
        },
        {
          icon: "mdi-cog",
          title: "Setting",
          to: "/setting",
        },
      ],
    };
  },
  created() {
    this.$fireAuth.onAuthStateChanged(async (user) => {
      this.currentUser = user;
      try {
        const documentSnapshot = await this.$firestore
          .collection("profiles")
          .doc(user.uid)
          .get();
        this.userData = documentSnapshot.data();
      } catch (error) {
        console.log(error);
      }
    });
  },
  methods: {
    logIn() {
      const provider = new this.$firebase.auth.GoogleAuthProvider();
      this.$fireAuth.signInWithPopup(provider).then((result) => {
        alert("Hello, " + result.user.displayName + "!");
        this.createUser(result.user);
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
    createUser(user) {
      this.$firestore.collection("users").doc(user.uid).set(
        {
          name: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
        },
        { merge: true }
      );
    },
    logInWithGithub() {
      const provider = new this.$firebase.auth.GithubAuthProvider();
      this.$fireAuth.signInWithPopup(provider).then((result) => {
        alert("Hello, " + result.user.displayName + "!");
        this.createUser(result.user);
      });
    },
  },
};
</script>

<style>
.btn {
  background-size: cover;
}

.v-main__wrap {
  background-color: #eceff1;
}
</style>