# MyPartner
## Overview

男女関係なくマッチングできるマッチングアプリです。

あなたの人生を共に歩んでくれるパートナーを探すことができます。

### PC版
|Search|User|
|:---:|:---:|
|![search](https://user-images.githubusercontent.com/60537225/105991145-cba0f500-60e6-11eb-980d-31ad85ee8f07.png)|![user-profile](https://user-images.githubusercontent.com/60537225/105990914-7ebd1e80-60e6-11eb-8c9e-ed0576858b54.png)|

|Like|Message|
|:---:|:---:|
|![like](https://user-images.githubusercontent.com/60537225/105990910-7d8bf180-60e6-11eb-8881-d09dbc48fdca.png)|![message](https://user-images.githubusercontent.com/60537225/105991134-c774d780-60e6-11eb-92e4-1b2afaccbab7.png)|


### モバイル版
|Search|User|Like|Message|
|:---:|:---:|:---:|:---:|
|![search](https://user-images.githubusercontent.com/60537225/105988895-ae1e5c00-60e3-11eb-8fe6-f3e75bc2c1af.png)|![user-profile](https://user-images.githubusercontent.com/60537225/105988910-b2e31000-60e3-11eb-93d6-766183f0cf70.png)|![like](https://user-images.githubusercontent.com/60537225/105988898-af4f8900-60e3-11eb-9d97-02d4468385ca.png)|![message](https://user-images.githubusercontent.com/60537225/105988906-b1b1e300-60e3-11eb-8969-c6c410fac2b6.png)|

## Demo
### http://

## Installation/Usage

`$ git clone https://github.com/KoheiB/my-matching-app.git`

`$ npm run dev`

### テストアカウント

|メールアドレス|パスワード|
|:---:|:---:|
|testuser1@gmail.com|123456|
|testuser2@gmail.com|123456|

## Features

- 認証機能
- フィルタリング/ソートによる検索機能
- 登録ユーザーにいいねを送り、承認されたらマッチングする機能
- マッチングしたユーザーとメッセージのやり取りをする機能
- 未読メッセージ数を表示する機能
- プロフィール編集/写真アップロード機能

## 実装予定機能

- 無限スクロール機能
- 通知機能（新着いいね、新着メッセージ）
- 無料/有料会員ステータス切換機能
- メッセージ定型文機能
## Technology

- JavaScript Framework: Nuxt.js(v2.14.12)
- Styling: Vuetify,Sass
- BaaS: Firebase
  - IDaaS: Firebase Authentication
  - Database: Cloud Firestore
  - Hosting: Firebase Hosting
  - FaaS: Cloud Functions
  - Storage: Cloud Storage

## Requirements
- Node.js v12.16.0

## Author
### KoheiB
- [Github](https://github.com/KoheiB)
- [Twitter](https://twitter.com/KoheiB1)
- [Qiita](https://qiita.com/kou74)