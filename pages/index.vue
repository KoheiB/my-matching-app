<template>
  <v-container>
    <v-btn x-large rounded nuxt to="/users/">ユーザー一覧ページへ</v-btn>
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-card-title>
            ログイン
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-card-title>
            新規登録
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {

}
</script>

<style>

</style>
