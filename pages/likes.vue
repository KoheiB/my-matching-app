<template>
  <v-app>
    <v-container class="primary">
      <v-row>
        <v-col cols="12" md="6"
        v-for="like in likes"
        :key="like.id">
          <v-card>
            <v-row>
              <v-col cols="2"
              align-self="center">
                <v-img :src="like.picture"
                class="member-picture"
                width="100%"
                />
              </v-col>
              <v-col cols="6">
                <v-card-title>
                  {{ like.name }}
                </v-card-title>
                <v-card-subtitle>
                  {{ like.date }}
                </v-card-subtitle>
              </v-col>
              <v-col cols="4"
              align-self="center"
              justify="center">
                <v-btn
                color="info"
                class="mb-2"
                width="80%"
                >
                <v-icon>mdi-thumb-up-outline</v-icon>
                  いいね
                </v-btn>
                <v-btn
                color="primary"
                width="80%"
                >
                <v-icon></v-icon>
                  よくないね
                </v-btn>
              </v-col>
            </v-row>
          </v-card>

        </v-col>
      </v-row>
    </v-container>
  </v-app>
  
</template>

<script>
export default {
  layout: 'navbar',
  data () {
    return {
      likes: [
        {
          id: 1,
          name: "aaa",
          picture: require('@/assets/image/html.png'),
          date: "2020/11/11"
        },
        {
          id: 2,
          name: "bbb",
          picture: require('@/assets/image/html.png'),
          date: "2020/11/11"
        },
      ],
    }
  }

}
</script>

<style>
.member-picture {
  border-radius: 50%;
  border: 1px solid #ccc;
  margin-left: 10px;
}
</style>