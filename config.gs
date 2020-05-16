// PropertiesService
var prop = PropertiesService.getScriptProperties();

// LineAccessToken                 ：LINE developersのメッセージ送受信設定に記載のアクセストークン
// LinePostUrl                     ：LINE Messaging APIのURL
// SlackReleaseListWebHookUrl      ：SlackにPostするURL(発売リスト通知)
// SlackS3UploadCompleteWebHookUrl ：SlackにPostするURL(S3へのアップロード完了通知)
// AwsAccessKeyID                  ：AWSのアクセスキーID
// AwsSecretAccessKey              ：AWSのシークレットアクセスキー
// AwsS3BucketName                 ：AWSのS3のバケット名（ファイルのアップロード先バケット名）
// ファイル→プロジェクトのプロパティ→スクリプトのプロパティから設定してください
// 設定される値はすべて文字列になることに注意してください
var Config = {
  LineAccessToken                 : prop.getProperty("LINE_ACCESS_TOKEN"),
  LinePostUrl                     : 'https://api.line.me/v2/bot/message/reply',
  SlackReleaseListWebHookUrl      : prop.getProperty("SLACK_RELEASE_LIST_WEB_HOOK_URL"),
  SlackS3UploadCompleteWebHookUrl : prop.getProperty("SLACK_S3_UPLOAD_COMPLETE_WEB_HOOK_URL"),
  AwsAccessKeyID                  : prop.getProperty("AWS_ACCESS_KEY_ID"),
  AwsSecretAccessKey              : prop.getProperty("AWS_SECRET_ACCESS_KEY"),
  AwsS3BucketName                 : prop.getProperty("AWS_S3_BUCKET_NAME")
};


// Configが正しく設定されているか確認用のメソッド
function TestConfig(){
  Logger.log("LineAccessToken：" + Config.LineAccessToken);
  Logger.log("LinePostUrl：" + Config.LinePostUrl);
  Logger.log("SlackReleaseListWebHookUrl：" + Config.SlackReleaseListWebHookUrl);
  Logger.log("SlackS3UploadCompleteWebHookUrl：" + Config.SlackS3UploadCompleteWebHookUrl);
  Logger.log("AwsAccessKeyID：" + Config.AwsAccessKeyID);
  Logger.log("AwsSecretAccessKey：" + Config.AwsSecretAccessKey);
  Logger.log("AwsS3BucketName：" + Config.AwsS3BucketName);
}
