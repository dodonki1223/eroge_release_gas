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
**`MB4837UymyETXyn8cv3fNXZc9ncYTrHL9` についてはドキュメントの `Installation` に書かれています**

![01_add_library_input_script_id](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/01_add_library_input_script_id.png)

バージョンは最新バージョンの `4` を指定します

![02_add_library_edit_version](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/02_add_library_edit_version.png)

最後に `保存` をクリックします

![03_add_alibrary_save](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/03_add_alibrary_save.png)

## Drive API を有効化する

スプレッドシートの作成やフォルダの作成のために [Drive API](https://developers.google.com/apps-script/advanced/drive) を使用しています  
Google拡張サービスから [Drive API](https://developers.google.com/apps-script/advanced/drive) を有効化させます

![04_enable_drive_api_open](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/04_enable_drive_api_open.png)

無効から `ON` にし最後に `OK` をクリックします

![05_enable_drive_api](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/05_enable_drive_api.png)

## Amazon S3にバケットを作成する

S3にアップロードするためにアップロード先のバケットを作成します

### バケット作成画面を開く

`バケット作成` をクリックします

![06_create_bucket_open](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/06_create_bucket_open.png)

### 一般的な設定

`バケット名` には任意の名前を入力し `リージョン` の設定を追加します

![07_create_bucket_general_setting](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/07_create_bucket_general_setting.png)

### ブロックパブリックアクセスのバケット設定

今回の用途ではパブリックアクセスさせる必要はないのでデフォルトのままで大丈夫です

![08_create_bucket_public_access](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/08_create_bucket_public_access.png)

### 詳細設定

今回の用途ではバージョニングの必要は無いのでデフォルトのままで大丈夫です  
最後に `バケットを作成` をクリックします

![09_create_bucket_detail_setting](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/09_create_bucket_detail_setting.png)

### 作成完了

無事、作成されたことを確認できます

![10_create_bucket_created](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/10_create_bucket_created.png)

## S3にアップロードするための IAM ユーザーを作成する

S3にファイルをアップロードするための IAM ユーザーを作成します  
作成する IAM ユーザーには最小限の権限を与え、アップロードしか出来ないようにします

### IAM ポリシーの作成

IAM ユーザーに付与する IAM ポリシーをまずは作成します  

#### ポリシー作成画面を開く

`ポリシーの作成` ボタンをクリックします

![11_create_iam_policy_open](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/11_create_iam_policy_open.png)

#### JSON

`JSON` をクリックし以下の内容のものをエディタ内に貼り付けて下さい  
最後に `ポリシーの確認` をクリックします  

それぞれの項目については下記のドキュメントを参照してください 

- [IAM JSON ポリシーエレメントのリファレンス - AWS Identity and Access Management](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_elements.html)

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ErogeReleaseOnlyPutObject",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::バケット名/*"
        }
    ]
```

![12_create_iam_policy_input_json](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/12_create_iam_policy_input_json.png)

#### ポリシーの確認

`名前`、`説明` を入力し `ポリシーの作成` をクリックします

![13_create_iam_policy_name](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/13_create_iam_policy_name.png)

#### 作成後

無事、IAM ポリシーが作成されました

![14_create_iam_policy_created](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/14_create_iam_policy_created.png)

### IAM ユーザーを作成する

IAM ユーザーを作成していきます

#### ユーザー追加画面を開く

`ユーザーを追加` ボタンをクリックします

![15_create_iam_user_open](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/15_create_iam_user_open.png)

#### ユーザー詳細の設定

`ユーザー名` を入力します  
GoogleスプレッドシートからS3へアップロードするだけの権限なのでコンソールへのアクセスは必要ありません  
`プログラムによるアクセス` のみにチェックをし `次のステップ:アクセス権限` をクリックします

![16_create_iam_user_detail](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/16_create_iam_user_detail.png)

#### アクセス許可の設定

`既存のポリシーを直接アタッチ` から先程作成したポリシーを選択し、 `次のステップ:タグ` をクリックします

![17_create_iam_user_attach_policy](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/17_create_iam_user_attach_policy.png)

`アクセス権限の境界の設定` は今回は使用しません  
詳しくは以下の記事が参考になります

- [Permissions Boundaryによる利用者へのIAM権限移譲と権限昇格の防止 - Qiita](https://qiita.com/f-daiki/items/e435159db6bde4d0c0ec)

#### タグの追加（オプション）

`キー`、 `値` を入力しタグ情報を追加し `次のステップ:確認` をクリックします

![18_create_iam_user_add_tags](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/18_create_iam_user_add_tags.png)

#### 確認

設定した内容が表示されていることを確認し `ユーザーの作成` をクリックします

![19_create_iam_user_confirm](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/19_create_iam_user_confirm.png)

#### アクセスキー、シークレットアクセスキー

`.csvのダウンロード` をクリックし `アクセスキー`、`シークレットアクセスキー` 情報をダウンロードします  
**Googleスプレッドシートの設定で使用します**

![20_create_iam_user_download_csv](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/20_create_iam_user_download_csv.png)

#### 作成後

ユーザー一覽画面に作成したユーザーが表示されています  
ユーザー名をクリックします

![21_create_iam_user_created](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/21_create_iam_user_created.png)

アクセス権限に先程作成したポリシーがアタッチされて入れば IAM ユーザーの作成完了です

![22_create_iam_user_attached_policy](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/22_create_iam_user_attached_policy.png)

## S3にアップロード後、Slack通知させるための設定を行う

S3にアップロード後にSlack通知させるために設定を行います

### Incoming Webhookをインストール

[https://ワークスペース名.slack.com/apps](https://ワークスペース名.slack.com/apps) にアクセスし `webhook` と入力します  
検索のリストに出てきた `Incoming Webhook` をクリックします

![23_incoming_webhook_search](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/23_incoming_webhook_search.png)

`Slackに追加` をクリックします

![24_incoming_webhook_add_slack](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/24_incoming_webhook_add_slack.png)

`通知させるチャンネル` を選択し `Incoming Webhook インテグレーションの追加` をクリックします  
このサンプルでは `general` チャンネルに通知されるように設定しています

![25_incoming_webhook_select_channel](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/25_incoming_webhook_select_channel.png)

詳細の設定画面では 名前とアイコンをカスタマイズすることでなんの通知かわかりやすくなるので設定しておきましょう

![26_incoming_webhook_customize_name_and_icon](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/26_incoming_webhook_customize_name_and_icon.png)

通知用の `Webhook URL` をコピーしておきます  
後で環境変数に設定します

![27_incoming_webhook_save_webhook_url](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/27_incoming_webhook_save_webhook_url.png)

`設定を保存する` をクリックして下記の画面になれば大丈夫です

![28_incoming_webhook_setting_end](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/28_incoming_webhook_setting_end.png)

## 環境変数を設定する

`プロジェクトのプロパティ` から `スクリプトのプロパティ` タブを開き以下の環境変数を設定します  

| 環境変数名                            | 説明                                              |
|:--------------------------------------|:--------------------------------------------------|
| AWS_ACCESS_KEY_ID                     | IAMユーザーのアクセスキー                         |
| AWS_SECRET_ACCESS_KEY                 | IAMユーザーのシークレットアクセスキー             |
| AWS_S3_BUCKET_NAME                    | アップロード先のS3のバケット名                    |
| SLACK_S3_UPLOAD_COMPLETE_WEB_HOOK_URL | S3へアップロード後Slackへ通知するためのWebHookURL |

以下のように設定できていれば大丈夫です

![29_set_environment_values](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/29_set_environment_values.png)

## 手動実行し結果を確認する

環境が整ったで実際に実行して `Slackに通知が来る` ことと `S3にファイルがアップロードされていること` の確認をします  

### allUploadThisMonthメソッドの実行

関数を選択から `s3Upload.gs` ファイルの `allUploadThisMonth` を選択します

![30_run_s3_upload_set_method](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/30_run_s3_upload_set_method.png)

▶ボタンをクリックし関数の実行を行います

![31_run_s3_upload_run_button](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/31_run_s3_upload_run_button.png)

下記表示が消えるまで待ちます

![32_run_s3_upload_running](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/32_run_s3_upload_running.png)

### Slack通知

実行が完了したらSlackに下記通知が来ていれば問題ないです

![33_run_s3_upload_notify_slack](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/33_run_s3_upload_notify_slack.png)

### 成果物の確認

実際に出来上がったものを確認します

#### voice_actors

![34_run_s3_upload_voice_actors](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/34_run_s3_upload_voice_actors.png)

#### games

![35_run_s3_upload_games](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/35_run_s3_upload_games.png)

#### game_casts

![36_run_s3_upload_game_casts](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/36_run_s3_upload_game_casts.png)

#### brands

![37_run_s3_upload_brands](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/37_run_s3_upload_brands.png)

#### s3

![38_run_s3_upload_s3](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/38_run_s3_upload_s3.png)

## 自動実行されるようにトリガーを追加

`編集` メニューの `現在のプロジェクトのトリガー` をクリックします

![39_add_trigger_open](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/39_add_trigger_open.png)

右下の `トリガーを追加` をクリックします

![40_add_trigger](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/40_add_trigger.png)

画面の設定だと 毎週金曜日の18時〜19時の間に定期実行する設定になっています  

`実行する関数を選択` には `allUploadThisMonth` を選択  
`イベントのソースを選択` には `時間主導型` を選択  
`時間ベースのトリガーのタイプを選択`、`曜日を選択`、`時刻を選択`、`エラー通知設定` に関してはお好みで設定します  

最後に `保存` をクリックします

![41_add_trigger_edit](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/41_add_trigger_edit.png)

トリガーが追加されていれば完了です

![42_add_trigger_added](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_s3_upload/s3_upload_construction/42_add_trigger_added.png)

**以上で 美少女ゲーム情報S3アップロード機能 の環境構築は完了です**
