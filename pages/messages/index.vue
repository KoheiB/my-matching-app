<template>
  <v-container>
    <div v-if="loading && rooms">
      <v-row>
        <v-col cols="6" sm="4" lg="3" v-for="n of 4" :key="n">
          <v-skeleton-loader type="card-heading, card" />
        </v-col>
      </v-row>
    </div>
    <v-row>
      <v-col cols="6" sm="4" lg="3" v-for="room in rooms" :key="room.id">
        <v-card hover nuxt :to="`/messages/${room.id}`">
          <v-card-title>
            {{ room.partnerName }}
          </v-card-title>
          <v-layout justify-center>
            <v-avatar size="200">
              <v-img
                v-show="!room.partnerAvatarUrl"
                :src="require('@/assets/image/default-user.jpg')"
              />
              <v-img
                v-show="room.partnerAvatarUrl"
                :src="room.partnerAvatarUrl"
              />
            </v-avatar>
          </v-layout>
          <v-card-subtitle>
            最新のメッセージ:<br />{{ room.updatedAt }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
    {{ rooms }}
  </v-container>
</template>

<script>
export default {
  layout: "navbar",
  data() {
    return {
      loading: true,
      rooms: [],
      currentUser: {},
    };
  },
  created() {
    this.$fireAuth.onAuthStateChanged(async (user) => {
      this.currentUser = user;
      try {
        const querySnapshot = await this.$firestore
          .collection("rooms")
          .where("attendUsersId", "array-contains", user.uid)
          .get();
        const rooms = querySnapshot.docs.map((doc) => {
          const result = doc.data();
          result.id = doc.id;
          return result;
        });
        rooms.forEach(async (room) => {
          const partnerId = room.attendUsersId.filter(
            (attendUserId) => attendUserId !== this.currentUser.uid
          )[0];
          const documentSnapshot = await this.$firestore
            .collection("profiles")
            .doc(partnerId)
            .get();
          const documentData = documentSnapshot.data();
          room.partnerId = partnerId;
          room.partnerName = documentData.displayName;
          room.partnerAvatarUrl = documentData.avatarUrl;
          room.updatedAt = room.updatedAt
            .toDate()
            .toLocaleString("ja-JP-u-ca-japanese");
          this.rooms.push(room);
          this.loading = false;
        });
      } catch (error) {
        console.log(error);
      }
    });
  },
};
</script>

<style>
</style>