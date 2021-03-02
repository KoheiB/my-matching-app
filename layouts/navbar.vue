<template>
  <v-app id="app">
    <v-navigation-drawer
      v-model="drawer"
      color="teal lighten-3"
      clipped
      app
      mobile-breakpoint="960"
    >
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
    </v-navigation-drawer>
    <v-app-bar color="teal darken-1" elevation="2" app clipped-left>
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        class="d-none d-md-block"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold"> MyPartner </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="currentUser">
        <v-btn style="text-transform: none" depressed x-large min-width="200" nuxt to="/setting">
          <v-avatar size="40" color="white" class="mr-3">
            <v-img
              v-if="!userData.avatarUrl"
              :src="require('@/assets/image/default-user.jpg')"
            />
            <v-img v-if="userData.avatarUrl" :src="userData.avatarUrl" />
          </v-avatar>
          {{ userData.displayName }}
        </v-btn>
      </div>
      <div v-else>
        <v-btn nuxt to="/"> ログインまたは新規登録 </v-btn>
      </div>
    </v-app-bar>
    <v-bottom-navigation app grow class="d-md-none" fixed>
      <v-btn v-for="(item, i) in items" :key="i" nuxt :to="item.to">
        <span>{{ item.title }}</span>
        <v-icon>{{ item.icon }} </v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
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
  async created() {
    await this.getUserData();
    this.setListener();
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
      if (user) {
        this.$firestore.collection("users").doc(user.uid).set(
          {
            name: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
          },
          { merge: true }
        );
      }
    },
    setListener() {
      this.$nuxt.$on("updateProfile", this.updateProfile);
    },
    async getUserData() {
      this.currentUser = await this.$auth();
      if (this.currentUser) {
        try {
          const documentSnapshot = await this.$firestore
            .collection("profiles")
            .doc(this.currentUser.uid)
            .get();
          this.userData = documentSnapshot.data();
        } catch (error) {
        }
      }
    },
    updateProfile(profile) {
      this.userData.displayName = profile.displayName;
      this.userData.avatarUrl = profile.avatarUrl;
    },
  },
};
</script>

<style>
#app {
  background-color: #eceff1;
  text-decoration: none;
}
</style>