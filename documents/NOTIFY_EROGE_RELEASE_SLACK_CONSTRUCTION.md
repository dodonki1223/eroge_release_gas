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
