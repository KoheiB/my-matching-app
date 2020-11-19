<template>
  <v-app>
    <v-container>
      <v-carousel v-model="model">
        <v-carousel-item
          v-for="(color, i) in colors"
          :key="color"
        >
          <v-sheet
            :color="color"
            height="100%"
            tile
          >
            <v-row
              class="fill-height"
              align="center"
              justify="center"
            >
              <div class="display-3">
                Slide {{ i + 1 }}
              </div>
            </v-row>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
      <v-row>
        <v-col
        cols="6" sm="4" md="4" lg="3" xl="3"
        v-for="member in members"
        :key="member.id"
        >
          <nuxt-link :to="`/users/${member.id}`">
            <v-card
            class="card mb-5"
            elevation="4"
            >
              <v-card-title>
                {{ member.id }}
                {{ member.name}}
              </v-card-title>
              <v-card-text>
                <v-container
                >
                  <img
                  :src="member.picture"
                  class="picture"
                  >

                </v-container>
                <p>{{ member.comment }}</p>

              </v-card-text>
              <v-card-actions>
                <v-container>
                  <v-row
                  justify="space-between">
                    <v-btn
                    width="48%"
                    color="primary"
                    >
                    <v-icon></v-icon>
                      よくないね
                    </v-btn>
                    <v-btn
                    width="48%"
                    color="info"
                    >
                    <v-icon>mdi-thumb-up-outline</v-icon>
                      いいね
                    </v-btn>
                  </v-row>
                </v-container>
              </v-card-actions>
            </v-card>
          </nuxt-link>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: 'navbar',
  data() {
    return {
      members: [
        {id: 1, name: "John", picture: require("~/assets/image/html.png"), comment: "hi"},
        {id: 2, name: "Jane", picture: require("~/assets/image/html.png"), comment: "hi"},
        {id: 3, name: "Bob", picture: require("~/assets/image/html.png"), comment: "hi"},
        {id: 4, name: "Kate", picture: require("~/assets/image/html.png"), comment: "hi"},
        {id: 5, name: "Nancy", picture: require("~/assets/image/html.png"), comment: "hi"},
      ],
      model: 0,
      colors: [
        'primary',
        'secondary',
        'yellow darken-2',
        'red',
        'orange',
      ],
    }
  }
}
</script>

<style>
* {
  text-decoration: none;
}
.card {
  width: 100%;
  height: auto;
  /* レスポンシブで％指定 1:100 2:50  */
}
.picture {
  display: block;
  margin: 0 auto;
  width: 70%;
  border: 1px solid rgb(200, 200, 200)
}


</style>