# trac-ticket-manager
Tracのチケット管理アプリ

## 仕様
- 複数プロジェクトにまたがるTracチケットを管理できるWEBアプリです
  - プロジェクト別にチケットを自動取得して管理できます
  - チケットごとにカテゴリやメモを設定することができます
  - 一度取得したチケットは非表示にしない限り表示され続けます
    - 担当者が変更されてもチケットは表示され続けます
  - 任意のチケットを表示するように登録することもできます
  - 一度非表示にしたチケットも過去チケット一覧で閲覧できます
- 詳細は[こちら](https://yaki-lab.firebaseapp.com/Product/TracTicketManager/Top)

## 環境
- OS：Windows
- サーバサイド：Next.js
- クライアントサイド：React.js
- DB：SQL Server

## 起動方法
### 0. インストール
- SQL Server
  - 公式サイトからインストール
- Node.js
  - 公式サイトからインストール
- Git
  - 公式サイトからインストール

### 1. DB設定
1. SQL Serverで任意のDBインスタンスを作成
1. リモート接続設定
  - SSMS > サーバ設定
    - 認証：SQL Server認証＋Win認証
    - リモート接続を許可
  - 構成マネージャ
    - メニューにない場合、`SQLServerManager14.msc`で起動
    - TCP-IPを有効にする
    - TCPのポート>動的ポート:ブランク、ポート:1433
  - SQL Serverのサービス再起動

### 2. ソース、npmパッケージ取得
- `git clone https://github.com/yakipudding/trac-ticket-manager.git`
- `npm install .`
- src/settingsフォルダ下に以下の内容で`dbconfig.tsx`を作成

```js
export const dbconfig = {
  user: 'DBユーザ名',
  password: 'DBパスワード',
  server: 'DBサーバ\\DBインスタンス名',
  database: 'DB名',
  options: {
    enableArithAbort: false,
  }
}
```

### 3. テーブル作成
- 作成したDBインスタンスに対してscriptフォルダ下のスクリプトを実行

### 4. ビルド
- `npm run build`

### 5. デプロイ
- `npm run start`
  - [localhost:3000](http://localhost:3000)を開くとTracTicketManagerが表示されます
  - PC起動時にTracTicketManagerを起動させたいときは上記コマンドをタスクスケジューラで起動時に実行させます

### オプション：Tracからのチケット取得を自動実行させる
- タスクスケジューラ等で以下コマンドを任意のタイミングで定期実行させる
  - `curl http://localhost:3000/api/trac-get-tickets`