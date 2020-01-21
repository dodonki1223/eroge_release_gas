// PropertiesService
var prop = PropertiesService.getScriptProperties();

// LineAccessToken   ：LINE developersのメッセージ送受信設定に記載のアクセストークン
// LinePostUrl       ：LINE Messaging APIのURL
// SlackWebHookUrl   ：SlackにPostするURL
// AwsAccessKeyID    ：AWSのアクセスキーID
// AwsSecretAccessKey：AWSのシークレットアクセスキー
// AwsS3BucketName   ：AWSのS3のバケット名（ファイルのアップロード先バケット名）
// ファイル→プロジェクトのプロパティ→スクリプトのプロパティから設定してください
// 設定される値はすべて文字列になることに注意してください
var Config = {
  LineAccessToken    : prop.getProperty("LINE_ACCESS_TOKEN"),
  LinePostUrl        : 'https://api.line.me/v2/bot/message/reply',
  SlackWebHookUrl    : prop.getProperty("SLACK_WEB_HOOK_URL"),
  AwsAccessKeyID     : prop.getProperty("AWS_ACCESS_KEY_ID"),
  AwsSecretAccessKey : prop.getProperty("AWS_SECRET_ACCESS_KEY"),
  AwsS3BucketName    : prop.getProperty("AWS_S3_BUCKET_NAME")
};


// Configが正しく設定されているか確認用のメソッド
function TestConfig(){
  Logger.log("LineAccessToken：" + Config.LineAccessToken);
  Logger.log("LinePostUrl：" + Config.LinePostUrl);
  Logger.log("SlackWebHookUrl：" + Config.SlackWebHookUrl);
  Logger.log("AwsAccessKeyID：" + Config.AwsAccessKeyID);
  Logger.log("AwsSecretAccessKey：" + Config.AwsSecretAccessKey);
  Logger.log("AwsS3BucketName：" + Config.AwsS3BucketName);
}