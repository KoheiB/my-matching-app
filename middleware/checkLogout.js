export default async function ({ redirect, app }) {
  if (await app.$auth()) {
    // ログインしていたらユーザー一覧画面にリダイレクト
    redirect('/users/')
  }
}