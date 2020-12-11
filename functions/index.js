const functions = require('firebase-functions');
// const https = functions.region("asia-northeast1").https;
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.createChatroom = functions.firestore.document('profiles/{profileId}/likedProfileUsers/{likedProfileUsersId}')
.onUpdate((change, context) => {
  // const previousSnapshot = change.before
  const newSnapshot = change.after
  const newData = newSnapshot.data();
  const isApproved = newData.isApproved
  const likedUserRef = newData.likedUserRef
  const userId = context.params.profileId
  
  if (!isApproved) {
    return null;
  }
  
  db
  .collection('users').doc(userId)
  .collection('chatrooms').doc()
  .set({
    attendUserRef: likedUserRef,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, {merge: true});

  return null;
})
