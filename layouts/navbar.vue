<template>
  <v-app>
    <v-navigation-drawer
    color="teal lighten-3"
    clipped
    app
    fixed>
      <v-list shaped>
        <v-list-item-group
        v-model="selectedItem"
        color="teal darken-3"
        >
          <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact>
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
          <v-btn block>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar
    color="teal darken-1"
    elevation="2"
    app
    clipped-left>
      MyMatchingApp
      <v-container v-if="currentUser">
        <v-btn
          class="btn"
          icon
          :style="'background-image: url('+currentUser.photoURL+')'" 
          ></v-btn>
        <v-btn @click="logOut">
          ログアウト
        </v-btn>
      </v-container>
      <v-container v-else>
        <v-btn @click="logIn">
          ログイン
        </v-btn>
        <v-btn @click="logIn">
          新規登録
        </v-btn>
      </v-container>
      <Login v-if="!currentUser"></Login>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Login from '~/components/Login.vue'
export default {
  components: {
    Login,
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      selectedItem: 1,
      currentUser: {},
      items:[
        {
          icon: 'mdi-magnify',
          title: 'Search',
          to: '/search'
        },
        {
          icon: 'mdi-thumb-up',
          title: 'Like',
          to: '/likes'
        },
        {
          icon: 'mdi-email',
          title: 'Message',
          to: '/messages'
        },
        {
          icon: 'mdi-account',
          title: 'Profile',
          to: '/profile'
        },
        {
          icon: 'mdi-cog',
          title: 'Setting',
          to: '/setting'
        },
      ],
    }
  },
  created () {
    this.$fireAuth.onAuthStateChanged(user => {
      this.currentUser = user
    })
  },
  methods: {
    logIn() {
      const provider = new this.$firebase.auth.GoogleAuthProvider()
      this.$fireAuth.signInWithPopup(provider)
      .then((result) => {
        alert('Hello, '+result.user.displayName+'!')
        this.createUser(result.user)
      })
    },
    logOut () {
      if (window.confirm('Are You Sure to Sign Out?')) {
        this.$fireAuth.signOut()
        .then(() => {
          alert('You Safely Signed Out.')
          this.$router.push('/'),
          location.reload()
        })
      }
    },
    createUser (user) {
      this.$firestore.collection('users').doc(user.uid).set({
        'name': user.displayName,
        'photoURL': user.photoURL,
        'email':user.email
      }, { merge: true })
    },
    logInWithGithub() {
      const provider = new this.$firebase.auth.GithubAuthProvider()
      this.$fireAuth.signInWithPopup(provider)
      .then((result) => {
        alert('Hello, '+result.user.displayName+'!')
        this.createUser(result.user)
      })
    },
  }
}
</script>

<style>
.btn {
  background-size: cover;
}
</style>