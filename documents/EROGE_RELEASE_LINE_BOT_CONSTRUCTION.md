# 発売リストくん環境構築

発売リストくんを動かすための環境構築を行います

## Messaging APIの設定

今回は `LINE BOT` として動作させるので `Messagging API` を使用して作成していきます  
LINEのエンジニアが書かれている下記記事を参考に `Messagging API` を作成して下さい

- [LINEのBot開発 超入門（前編） ゼロから応答ができるまで - Qiita](https://qiita.com/nkjm/items/38808bbc97d6927837cd)

## GoogleスプレッドシートをBOT化

Googleスプレッドシートを作成し `BOT` 機能をを作成します  
新規にGoogleスプレッドシートを作成しておいて下さい

### eroge_release_cmd設定

[eroge_release_cmd](https://github.com/dodonki1223/eroge_release_cmd) を導入しGoogleスプレッドシートへの書き込みができるように設定します

### Googleスプレッドシート設定

Googleスプレッドシートの設定方法について説明していきます

#### Google Apps Script GitHub アシスタントのインストール

スクリプトエディタ上でGitHubからソースをCloneするために [Google Apps Script GitHub アシスタント - Chrome ウェブストア](https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo?hl=ja) の拡張機能をChromeにインストールしてください  

#### ソースのclone

リポジトリとブランチを設定して `↓` ボタンをクリックします

![00_clone_source](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/line_bot_construction/00_clone_source.png)

`pull` をクリックします

![01_clone_source_pull](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/line_bot_construction/01_clone_source_pull.png)

なぜか失敗することもあるので失敗したらもう一度cloneを実行するか画面を再読み込みしてみてください

![02_complete_clone_source](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/line_bot_construction/02_complete_clone_source.png)

#### 環境変数の設定

`ファイルメニュー` の `プロジェクトのプロパティ` をクリックします

![03_project_property](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/line_bot_construction/03_project_property.png)

`スクリプトのプロパティ` タブを開きます  
以下の設定を追加してください

| 環境変数名         | 説明                       |
|:-------------------|:---------------------------|
| LINE_ACCESS_TOKEN  | LINEのアクセストークンです |

最後に `保存` をクリックします

![04_environment_variables](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/line_bot_construction/04_environment_variables.png)

**以上で 発売リストくん の環境構築は完了です**
