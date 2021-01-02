export default async function ({ redirect, app }) {
  if (!await app.$auth()) {
    // ログインしていなかったらログイン/サインアップ画面にリダイレクト
    redirect('/')
  }
}