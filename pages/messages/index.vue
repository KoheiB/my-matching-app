<template>
  <v-container>
    <div v-if="loading && rooms.length">
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
            <v-badge
              color="info"
              :content="room.myUnreadCount"
              :value="room.myUnreadCount"
              offset-x="20"
              offset-y="20"
            >
              <Avatar
                :url="room.partnerAvatarUrl"
                :size="avatarSize"
                :likedCount="room.partnerLikedCount"
              ></Avatar>
            </v-badge>
          </v-layout>
          <v-card-subtitle>
            最新のメッセージ:<br />{{ room.updatedAt }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Avatar from "~/components/Avatar.vue";
export default {
  layout: "navbar",
  components: {
    Avatar,
  },
  middleware: ["checkLogin"],
  data() {
    return {
      loading: true,
      rooms: [],
    };
  },
  computed: {
    avatarSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 140;
        case "sm":
          return 160;
        case "md":
          return 190;
        case "lg":
          return 200;
        case "xl":
          return 200;
      }
    },
  },
  async created() {
    const currentUser = await this.$auth();
    try {
      const roomsQuerySnapshot = await this.$firestore
        .collection("rooms")
        .where("attendUsersId", "array-contains", currentUser.uid)
        .orderBy("updatedAt", "desc")
        .get();
      const rooms = roomsQuerySnapshot.docs.map((doc) => {
        const result = doc.data();
        result.id = doc.id;
        return result;
      });
      rooms.map(async (room) => {
        const partnerId = room.attendUsersId.filter(
          (attendUserId) => attendUserId !== currentUser.uid
        )[0];
        const partnerProfileSnapshot = await this.$firestore
          .collection("profiles")
          .doc(partnerId)
          .get();
        const partnerProfile = partnerProfileSnapshot.data();
        room.partnerId = partnerId;
        room.partnerName = partnerProfile.displayName;
        room.partnerAvatarUrl = partnerProfile.avatarUrl;
        room.partnerLikedCount = partnerProfile.likedCount;
        room.myUnreadCount = room[currentUser.uid];
        room.updatedAt = room.updatedAt
          .toDate()
          .toLocaleString("ja-JP-u-ca-japanese");
        this.rooms.push(room);
      });
    } catch (error) {
      console.log(error);
    }
    this.loading = await false;
  },
};
</script>

<style>
</style>