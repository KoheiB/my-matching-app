<template>
  <v-container class="info">
    <v-row>
      <v-col cols="12" md="6" lg="4" class="green">
        <v-layout justify-center>
          <v-avatar size="200">
            <v-img v-show="!profile.avatarUrl"
              :src="require('@/assets/image/default-user.jpg')"
            />
            <v-img v-show="profile.avatarUrl"
              :src="profile.avatarUrl"
            />
          </v-avatar>
        </v-layout>
        <v-btn class="d-flex mt-4 mx-auto">プロフィール写真をアップロードする</v-btn>
      </v-col>
      <v-col cols="12" md="6" lg="8">
        <v-form class="red">
          <v-row>
            <v-col cols="6">
              <v-row v-for="item in items"
                :key="item.name">
                <v-col cols="3"
                  align-self="center"
                >
                  {{ item.name }}
                </v-col>
                <v-col cols="9"
                align-self="center"
                >
                  <v-text-field v-model="name"></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row v-for="item in items"
                :key="item.name">
                <v-col cols="3"
                  align-self="center"
                >
                  {{ item.name }}
                </v-col>
                <v-col cols="9"
                align-self="center"
                >
                  <v-text-field v-model="name"></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          
        </v-form>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
export default {
  layout: 'navbar',
  data () {
    return {
      picture: require('@/assets/image/html.png'),
      name: 'aaa',
      profile: {
        picture: require('@/assets/image/html.png'),
      },
      items: [
        { name: '身長'},
        { name: '体型'},
        { name: '血液型'},
        { name: '居住地'},
        { name: '出身地'},
      ]
    }
  }
}
</script>

<style>

</style>