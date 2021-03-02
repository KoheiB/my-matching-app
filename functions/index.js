const functions = require('firebase-functions');
const https = functions.region("asia-northeast1").https;
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth()

exports.onDeleteUser = functions.auth.user().onDelete(async (user) => {
  const batch = db.batch()

  // ユーザードキュメントの削除
  const userDoc = db.collection('users').doc(user.uid)
  batch.delete(userDoc)

  // プロフィールドキュメントの削除
  const profile = db.collection('profiles').doc(user.uid)
  batch.delete(profile)

  // サブコレクションの削除
  const userSubcollection = await userDoc.collection('likedProfiles').get()
  userSubcollection.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  const profileSubcollection = await profile.collection('likedProfileUsers').get()
  profileSubcollection.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  // 削除されたユーザーのリファレンスを持つドキュメントを削除
  const likedProfilesCollectionGroup = await db.collectionGroup('likedProfiles').where('likedProfileRef', '==', '/profiles/' + user.uid).get()
  likedProfilesCollectionGroup.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  const likedProfileUsersCollectionGroup = await db.collectionGroup('likedProfileUsers').where('likedUserRef', '==', '/profiles/' + user.uid).get()
  likedProfileUsersCollectionGroup.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  // 入室していたルームの削除
  const rooms = await db.collection('rooms').where('attendUsersId', 'array-contains', user.uid).get()
  rooms.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  // 一括処理
  await batch.commit()

  // Storageの削除
  const firebaseConfig = process.env.FIREBASE_CONFIG
  const firebaseConfigObj = JSON.parse(firebaseConfig)
  const bucket = admin.storage().bucket(firebaseConfigObj.storageBucket)
  return bucket.deleteFiles({
    prefix: `images/${user.uid}`
  })
});

exports.deleteSubcollectin = functions.firestore.document('rooms/{roomId}')
  .onDelete(async (snap, context) => {
    const deletedDocument = snap.data()
    if (!deletedDocument) {
      return
    }
    const roomId = context.params.roomId
    const firebaseTools = require('firebase-tools')
    
    try {
      await firebaseTools.firestore
        .delete(`rooms/${roomId}/messages`, {
          project: process.env.GCLOUD_PROJECT,
          recursive: true,
          yes: true,
          token: functions.config().fb.token
        })
    } catch (err) {
      console.error(err)
    }
  })
exports.profileLiked = functions.firestore.document('profiles/{profileId}/likedProfileUsers/{likedProfileUsersId}')
  .onCreate(async (snap, context) => {
    // プロフィールにいいねが追加されたら、プロフィールのlikedCountをIncrement
    db
      .collection('profiles')
      .doc(context.params.profileId)
      .update({ likedCount: admin.firestore.FieldValue.increment(1) })
  })
exports.profileUnliked = functions.firestore.document('profiles/{profileId}/likedProfileUsers/{likedProfileUsersId}')
  .onDelete(async (snap, context) => {
    // いいねが削除されたら、プロフィールのlikedCountをDecrement
    db
      .collection('profiles')
      .doc(context.params.profileId)
      .update({ likedCount: admin.firestore.FieldValue.increment(-1) })
  })

exports.sendMessage = functions.firestore.document('rooms/{roomId}/messages/{messageId}')
.onCreate(async (snap, context) => {
  // メッセージが送信された場合の処理
  db
    .collection('rooms')
    .doc(context.params.roomId)
    .update(
      {
        // 最新のメッセージを書き換える
        latestMessage: { senderId: snap.data().senderId, body: snap.data().body },
        // 相手の未読数を増やす
        [snap.data().receiverId]: admin.firestore.FieldValue.increment(1),
        // updatedAtを更新する
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    )
})
