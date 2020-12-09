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
  const newValue = change.after.data();
  const previousValue = change.before.data();
  const isApproved = newValue.isApproved
  const likedUserRef = newValue.likedUserRef

  if (!isApproved) {
    return null;
  }

  db.collection('rooms').doc()
  .set({
    chatPartnerRef: likedUserRef,
    createdAt: db.FieldValue.serverTimestamp(),
  }, {merge: true});
  
})
