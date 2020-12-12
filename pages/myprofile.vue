<template>
  <v-container>
    <div class="text-h4">Name</div>
    <v-img :src="picture"
    width="100px"
    />
    <v-divider />
    <div class="text-h4">Profile</div>
    <v-form>
      <v-container>
        <v-row v-for="item in items"
          :key="item.name">
          <v-col cols="2"></v-col>
          <v-col cols="2"
          align-self="center"
          >
            {{ item.name }}
          </v-col>
          <v-col cols="6"
          align-self="center"
          >
            <v-text-field v-model="name"></v-text-field>
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>
export default {
  layout: 'navbar',
  data () {
    return {
      picture: require('@/assets/image/html.png'),
      name: 'aaa',
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