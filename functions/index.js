// const functions = require('firebase-functions');
// const https = functions.region("asia-northeast1").https;
// const admin = require("firebase-admin");
// admin.initializeApp();
// const db = admin.firestore();
// const auth = admin.auth()

// exports.addImageUrl = functions.storage.object().onFinalize((object) => {
//   console.log('OBJECT', object)
//   const userId = object.name.split('/')[1]
//   console.log(userId)
//   try {
//     db.collection('profiles')
//       .doc(userId)
//       .set({
//         'avatarUrl': object.metadata.downloadUrl
//       }, { merge: true })
//     console.log('added URL')
//   } catch (error) {
//     console.log('ERROR!',error)
//   }
// })
// exports.createChatroom = functions.firestore.document('profiles/{profileId}/likedProfileUsers/{likedProfileUsersId}')
// .onUpdate(async (change, context) => {
//   const batch = db.batch()

//   const newSnapshot = change.after //プロフィールをいいねしたユーザーのQueryDocumentSnapshot
//   const newData = newSnapshot.data(); //プロフィールをいいねしたユーザーのデータ（likedUserRef: いいねしたユーザーのリファレンス, isApproved: いいねを承諾するか）
//   const isApproved = newData.isApproved //もらったいいねを承諾するか
//   const likedUserRef = newData.likedUserRef //いいねしたユーザーのリファレンス
//   const likedUserId = likedUserRef.id
//   const userId = context.params.profileId //いいねされたユーザーのID
//   const userRef = db.collection('users').doc(userId) //いいねを承諾したユーザーのリファレンス
//   // いいねをfalseにする処理なら何もしない（デバッグ用）
//   if (!isApproved) {
//     return null;
//   }

//   // いいねを承諾したユーザーのチャットルームを追加
//   batch.set(
//     db
//     .collection('users')
//     .doc(userId)
//     .collection('chatrooms')
//     .doc(),
//     {
//       'attendUserRef': likedUserRef,// いいねしたユーザーのリファレンス
//       'updatedAt': admin.firestore.FieldValue.serverTimestamp()
//     },
//     {merge: true}
//   )

//   // いいねを承諾されたユーザーのチャットルームを追加
//   batch.set(
//     db
//     .collection('users')
//     .doc(likedUserId)
//     .collection('chatrooms')
//     .doc(),
//     {
//       'attendUserRef': userRef,//いいねを承諾したユーザーのリファレンス
//       'updatedAt': admin.firestore.FieldValue.serverTimestamp()
//     },
//     {merge: true}
//   )

//   // 一括処理
//   await batch.commit()

//   return null;
// })
