# eroge_release_gas

スクレイピングした美少女ゲーム情報が書き込まれたGoogleスプレッドシートツールです

**注意：「Chrome V8 を搭載した新しい Apps Script ランタイム」の設定を有効にすると正しくスクリプトが動作しなくなります。無効にしておいてください！**

## 概要

主に以下の２つの機能を持ちます

- 声優名で話しかけると出演するゲームを教えてくれる `LINE BOT` （発売リストくん）
- 美少女ゲームの情報を格納するデータベースの情報に整形しS3にアップロードする機能

## 発売リストくん

声優名で話しかけると出演するゲームを教えてくれる `LINE BOT` です

![00_release_list_line_bot](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/readme/00_release_list_line_bot.png)

### 仕組み

大まかな仕組みを説明します

#### 処理の流れ

1. [eroge_release_cmd](https://github.com/dodonki1223/eroge_release_cmd)を使用し、[げっちゅ屋](http://www.getchu.com/top.html?gc=gc)の[発売日リスト](http://www.getchu.com/all/price.html?genre=pc_soft&year=2019&month=3&gage=&gall=all)ページをスクレイピングしスクレイピング結果をCSV出力する
2. 出力されたCSV結果をGoogleスプレッドシートに書き込み
3. 発売リストくん（LINE BOT）に声優名を入力
4. Googleスプレッドシートから声優の出演情報を元にゲームの情報を検索
5. ゲームの情報を発売リストくん（LINE BOT）に返す

#### その他

Googleスプレッドシートには以下のような感じで書き込まれています  
データの検索、発売リストくん（LINE BOT）への結果通知は `Google Apps Script` で書かれています

![01_google_spread_sheet_sample](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/readme/01_google_spread_sheet_sample.png)

### 登録方法

`友だち追加` ボタンをクリックするか `QRコード` から友達追加をして下さい

| <a href="https://line.me/R/ti/p/%40kox6824y"><img height="36" border="0" alt="友だち追加" src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png"></a> | ![02_qr_code](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/readme/02_qr_code.png) |
|:-------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------:|

### 使用方法

登録した `発売リストくん（LINE BOT）` に `声優名` もしくは `リスト` と話しかけるだけです  
`声優名` と `リスト` それぞれ話しかけ方は３パターンあります

- 声優名 or リスト
- 先月の 声優名 or リスト
- 来月の 声優名 or リスト

| ![03_voice_actor_sample](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/readme/03_voice_actor_sample.png) | ![04_release_list_sample](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/readme/04_release_list_sample.png) |
|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------:|

サンプル画像は2019年4月に実行したものになります。

### Slack通知

Slackに発売のリスト情報を定期で通知させます

![05_notify_slack_sample](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/readme/05_notify_slack_sample.png)

### 環境構築

- [発売リストくん構築手順書](https://github.com/dodonki1223/eroge_release_gas/blob/master/documents/EROGE_RELEASE_LINE_BOT_CONSTRUCTION.md)
- [発売リストくんSlack通知構築手順書](https://github.com/dodonki1223/eroge_release_gas/blob/master/documents/NOTIFY_EROGE_RELEASE_SLACK_CONSTRUCTION.md)

### 資料

- [Messaging APIリファレンス](https://developers.line.biz/ja/reference/messaging-api/)
- [Google Apps Script ドキュメント](https://developers.google.com/apps-script/guides/services/quotas)

## 美少女ゲーム情報S3アップロード機能

スクレイピングした美少女ゲーム情報を [eroge_release_db](https://github.com/dodonki1223/eroge_release_db) のテーブルデータにあった形に整え、データをS3にアップロードする機能です

![00_release_list_s3_upload](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/readme/00_release_list_s3_upload.png)

### 概要

[eroge_release_cmd](https://github.com/dodonki1223/eroge_release_cmd) でGoogleスプレッドシートに書き込まれた美少女ゲームの情報を [eroge_release_db](https://github.com/dodonki1223/eroge_release_db) で使用するテーブルの形にデータを変換し、そのテーブルごとのデータをCSVに変換してS3にアップロードします  

- brands（ブランド情報）
- games（ゲーム情報）
- game_casts（出演声優ゲーム情報）
- voice_actors（声優マスタ情報）

![eroge_release_db](https://raw.githubusercontent.com/dodonki1223/eroge_release_db/master/db/erd/eroge_release_db.png)

[Rails ERD](https://github.com/voormedia/rails-erd)を使用して出力したER図です

### データについて

[eroge_release_cmd](https://github.com/dodonki1223/eroge_release_cmd) で書き込まれたGoogleスプレッドシートを起点に2つのGoogleスプレッドシートにデータを書き込みます

![01_eroge_release_output_data](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/readme/01_eroge_release_output_data.png)

#### 対象月Googleスプレッドシート

対象月スプレッドシートには対象月のゲームの発売リストを元に作成するものになります  
シート毎にゲーム情報、出演声優ゲーム情報、ブランド情報と分けれてデータが管理されます

#### 声優マスタGoogleスプレッドシート

声優マスタスプレッドシートには声優名とその声優のIDを管理しています  
[げっちゅ屋](http://www.getchu.com/top.html?gc=gc) にはゲーム、ブランドに関してはシステム側でIDが振られているが声優にはIDが振られていないため、この声優マスタGoogleスプレッドシートでIDを自動採番して管理する

### フォルダ構成 - Googleドライブ

Googleドライブ上でのフォルダ構成は画像の通りになります  
年月のフォルダが毎月、作成されていきます

| ![02_google_drive_folder_structure_01](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/readme/02_google_drive_folder_structure_01.png) | ![03_google_drive_folder_structure_02](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/readme/03_google_drive_folder_structure_02.png) | ![04_google_drive_folder_structure_03](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/readme/04_google_drive_folder_structure_03.png) |
|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| フォルダのTOPです                                                                                                                                                                                 | 年月ごとのフォルダ、eroge_releaseスプレッドシート、voice_actorsスプレッドシート                                                                                                                   |  年月スプレッドシート                                                                                                                                                                             |


#### eroge_releaseスプレッドシート

[eroge_release_cmd](https://github.com/dodonki1223/eroge_release_cmd) で書き込まれたGoogleスプレッドシートになります  
月ごとシートが作成され、美少女ゲームの発売リストが管理されています

#### 年月スプレッドシート

対象月Googleスプレッドシートになります  
毎月、年月のフォルダと共に作成され以下のような構成になっています

- gamesシート（ゲーム情報）
- game_castsシート（出演声優ゲーム情報）
- brandsシート（ブランド情報）

#### voice_actorsスプレッドシート

声優マスタGoogleスプレッドシートになります  
発売リストに書き込まれた声優が一意になるよう管理されています

### フォルダ構成 - S3

S3のフォルダ構成は画像の通りになります  
アップロードされているCSVファイルは [eroge_release_db](https://github.com/dodonki1223/eroge_release_db) にインポートするデータになります  

| ![05_s3_folder_structure_01](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/readme/05_s3_folder_structure_01.png) | ![06_s3_folder_structure_02](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/readme/06_s3_folder_structure_02.png) | ![07_s3_folder_structure_03](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/readme/07_s3_folder_structure_03.png) |
|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| フォルダのTOPです                                                                                                                                                             | 年月ごとのフォルダが作成されます                                                                                                                                              |  brands.csv（ブランド情報）、game_casts.csv（出演声優ゲーム情報）、games.csv（ゲーム情報）、voice_actors.csv（声優マスタ情報）                                                |

### 環境構築

- [美少女ゲーム情報S3アップロード機能構築手順書](https://github.com/dodonki1223/eroge_release_gas/blob/master/documents/EROGE_RELEASE_S3_UPLOAD_CONSTRUCTION.md)
