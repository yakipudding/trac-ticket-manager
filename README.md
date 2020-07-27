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
### 事前準備
- SQL Server
  - 公式サイトからインストール
  - 任意のDBインスタンスを作成
- Node.js
  - 公式サイトからインストール
- Git
  - 公式サイトからインストール

### ソース、パッケージ取得
- `git clone https://github.com/yakipudding/trac-ticket-manager.git`
- `npm install .`

### DB準備
- 作成したDBインスタンスに対してscriptフォルダ下のスクリプトを実行

### DBをリモート接続可能にする
- SQL Server
  - サーバ設定
    - 認証：SQL Server認証＋Win認証
    - リモート接続を許可
- 構成マネージャ（メニューにない場合、`SQLServerManager14.msc`で起動）
  - TCP-IPを有効にする
  - TCPのポート>動的ポート:ブランク、ポート:1433
- SQL Serverのサービス再起動

### 起動
- `npm run dev`
  - [localhost:3000](http://localhost:3000)を開くとTracTicketManagerが表示されます
  - PC起動時にTracTicketManagerを起動させたいときは上記コマンドをタスクスケジューラで起動時に実行させます

### （オプション）Tracからのチケット取得を自動実行させる
- タスクスケジューラで以下コマンドを任意のタイミングで定期実行させる
  - `curl http://localhost:3000/api/trac-get-tickets`