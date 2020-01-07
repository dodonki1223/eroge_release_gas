// PropertiesService
var prop = PropertiesService.getScriptProperties();

// LineAccessToken   ：LINE developersのメッセージ送受信設定に記載のアクセストークン
// LinePostUrl       ：LINE Messaging APIのURL
// SlackWebHookUrl   ：SlackにPostするURL
// AwsAccessKeyID    ：AWSのアクセスキーID
// AwsSecretAccessKey：AWSのシークレットアクセスキー
// ファイル→プロジェクトのプロパティ→スクリプトのプロパティから設定してください
// 設定される値はすべて文字列になることに注意してください
var Config = {
  LineAccessToken    : prop.getProperty("LINE_ACCESS_TOKEN"),
  LinePostUrl        : 'https://api.line.me/v2/bot/message/reply',
  SlackWebHookUrl    : prop.getProperty("SLACK_WEB_HOOK_URL"),
  AwsAccessKeyID     : prop.getProperty("AWS_ACCESS_KEY_ID"),
  AwsSecretAccessKey : prop.getProperty("AWS_SECRET_ACCESS_KEY")
};


// Configが正しく設定されているか確認用のメソッド
function TestConfig(){
  Logger.log("LineAccessToken：" + Config.LineAccessToken);
  Logger.log("LinePostUrl：" + Config.LinePostUrl);
  Logger.log("SlackWebHookUrl：" + Config.SlackWebHookUrl);
  Logger.log("AwsAccessKeyID：" + Config.AwsAccessKeyID);
  Logger.log("AwsSecretAccessKey：" + Config.AwsSecretAccessKey);
}