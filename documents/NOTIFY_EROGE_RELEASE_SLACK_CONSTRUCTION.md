# 発売リストくんSlack通知

発売リストくんの内容を定期でSlackに通知するための環境構築を行います  
通知内容はGoogleスプレッドシートに書き込まれた今月の発売情報になります

## 通知用のアプリをSlackに作成する

Slackに通知させるためのアプリを作成します

### Slack API appページへ遷移

[Slack API: Applications](https://api.slack.com/apps) のリンクをクリックしてください

### 新規にアプリを作成する

`Create New App` をクリックしてください

![00_slack_api_app_page](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/notify_slack_construction/00_slack_api_app_page.png)

`App Name`、`Workspace` を設定し `Create App` をクリックします

![01_create_app](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/notify_slack_construction/01_create_app.png)

### WebhookURLを追加する

`Incoming Webhooks` をクリックします

![02_incoming_webhooks](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/notify_slack_construction/02_incoming_webhooks.png)

Incoming Webhooksを有効にします（右上の `OFF` を `On` に変更）  

![03_add_webhook_to_workspace_off](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/notify_slack_construction/03_add_webhook_to_workspace_off.png)

`Add New Webhook to Workspace` をクリックし Workspaceに Webhookを追加します

![04_add_webhook_to_workspace_on](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/notify_slack_construction/04_add_webhook_to_workspace_on.png)

`投稿するチャンネル` を選択し `許可する` をクリックします

![05_approval_app](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/notify_slack_construction/05_approval_app.png)

`Webhook URL` が追加されていたら完了です  
Webhook URLをクリップボードにコピーしたい時は `Copy` をクリックしてください

![06_get_webhook_url](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/notify_slack_construction/06_get_webhook_url.png)

## Slackに定期通知させるためのトリガーを設定する

Slackに定期通知させるためにGoogleスプレッドシートにトリガーを設定します

### Webhook URLを設定する

環境変数に先程作成した `Webhook URL` を追加します  
`プロジェクトのプロパティ` から `スクリプトのプロパティ` タグ開き以下の環境変数を設定します  a

| 環境変数名         | 説明                        |
|:-------------------|:----------------------------|
| SLACK_WEB_HOOK_URL | 通知用のアプリのWebhook URL |

最後に `保存` をクリックします

![07_add_slack_web_hook_url](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/notify_slack_construction/07_add_slack_web_hook_url.png)

### 定期通知するトリガーを追加する

`時計` のアイコンをクリックします

![08_open_project_trigger](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/notify_slack_construction/08_open_project_trigger.png)

右下の `トリガーを追加` をクリックします

![09_add_trigger](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/notify_slack_construction/09_add_trigger.png)

画面の設定だと 毎週金曜日の17時〜18時の間に定期実行する設定になっています  

`実行する関数を選択` には `releaseListSendMessage` を選択  
`イベントのソースを選択` には `時間主導型` を選択  
`時間ベースのトリガーのタイプを選択`、`曜日を選択`、`時刻を選択`、`エラー通知設定` に関してはお好みで設定します  

最後に `保存` をクリックします

![10_setting_trigger](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/notify_slack_construction/10_setting_trigger.png)

アプリの承認処理が必要になるので承認を行います  
下記のような画面になるので `詳細` をクリックします

![11_add_trigger_certification_01](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/notify_slack_construction/11_add_trigger_certification_01.png)

`プロジェクト名 に移動` をクリックします

![12_add_trigger_certification_02](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/notify_slack_construction/12_add_trigger_certification_02.png)

`許可` をクリックします

![13_add_trigger_certification_03](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/notify_slack_construction/13_add_trigger_certification_03.png)

トリガーが追加されていれば完了です

![14_add_complete_trigger](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/notify_slack_construction/14_add_complete_trigger.png)

**以上で 発売リストくんSlack通知 の環境構築は完了です**
