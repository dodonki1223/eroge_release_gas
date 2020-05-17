# 美少女ゲーム情報S3アップロード機能環境構築

美少女ゲーム情報をS3にアップロードするための環境構築を行います  
[発売リストくん](https://github.com/dodonki1223/eroge_release_gas/blob/master/documents/EROGE_RELEASE_LINE_BOT_CONSTRUCTION.md)、[発売リストくんSlack通知](https://github.com/dodonki1223/eroge_release_gas/blob/master/documents/NOTIFY_EROGE_RELEASE_SLACK_CONSTRUCTION.md)の環境構築が終わっている状態からの手順書となります  
**発売リストくんSlack通知の環境構築を行っていなくても大丈夫です**

## S3-for-Google-Apps-Scriptライブラリを追加

[S3-for-Google-Apps-Script](https://github.com/eschultink/S3-for-Google-Apps-Script/) は Google Apps Scriptから Amazon S3 を使用するためのシンプルなAPIを提供してくれるライブラリです  
S3へのアップロードはこのライブラリを使用して実装しています  

詳しくは以下のGitHub及びドキュメントを確認してください

- [S3-for-Google-Apps-Script - GitHub](https://github.com/eschultink/S3-for-Google-Apps-Script/)
- [Amazon S3 API Binding for Google Apps Script - Document](https://engetc.com/projects/amazon-s3-api-binding-for-google-apps-script/)

### プロジェクトにライブラリを追加

スクリプトエディタの `リソース` メニューの `ライブラリ` をクリックします

![00_add_library_open](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/00_add_library_open.png)

`Add a library` に `MB4837UymyETXyn8cv3fNXZc9ncYTrHL9` を入力し `追加` ボタンをクリックします  
**`MB4837UymyETXyn8cv3fNXZc9ncYTrHL9` についてははsドキュメントの `Installation` に書かれています**

![01_add_library_input_script_id](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/01_add_library_input_script_id.png)

バージョンは最新バージョンの `4` を指定します

![02_add_library_edit_version](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/02_add_library_edit_version.png)

最後に `保存` をクリックします

![03_add_alibrary_save](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/03_add_alibrary_save.png)

## Amazon S3にバケットを作成する

S3にアップロードするためにアップロード先のバケットを作成します

### バケット作成画面を開く

`バケット作成` をクリックします

![04_create_bucket_open](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/04_create_bucket_open.png)

### 一般的な設定

`バケット名` には任意の名前を入力し `リージョン` の設定を追加します

![05_create_bucket_general_setting](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/05_create_bucket_general_setting.png)

### ブロックパブリックアクセスのバケット設定

今回の用途ではパブリックアクセスさせる必要はないのでデフォルトのままで大丈夫です

![06_create_bucket_public_access](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/06_create_bucket_public_access.png)

### 詳細設定

今回の用途ではバージョニングの必要は無いのでデフォルトのままで大丈夫です  
最後に `バケットを作成` をクリックします

![07_create_bucket_detail_setting](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/07_create_bucket_detail_setting.png)

### 作成完了

無事、作成されたことを確認できます

![08_create_bucket_created](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/08_create_bucket_created.png)
