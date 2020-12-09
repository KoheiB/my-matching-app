const functions = require('firebase-functions');
const https = functions.region("asia-northeast1").https;
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.createChatroom = functions.firestore.document('profiles/{profileId}/likedProfileUsers/{likedProfileUsersId}')
.onUpdate((change, context) => {
  // const previousSnapshot = change.before
  const newSnapshot = change.after
  const newData = newSnapshot.data();
  const isApproved = newData.isApproved
  const likedUserRef = newData.likedUserRef
  console.log(isApproved)
  console.log(likedUserRef)

  if (!isApproved) {
    return null;
  }

  db.collection('rooms').doc()
  .set({
    chatPartnerRef: likedUserRef,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }, {merge: true});
  console.log('chatroom is created.')
  return null;
})
