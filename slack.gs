/**
 * 発売リスト一覧のメッセージをSlackに通知する
 */
function releaseListSendMessage() {
  // メッセージを作成する
  var yearMonth = getYearMonth(0),
      year      = yearMonth.slice(0,4),
      month     = yearMonth.slice(4),
      message   = year + '年' + month + '月の発売リスト';
  // スプレッドシートからゲーム情報を取得
  var sheet     = getSheet(yearMonth),
      foundRows = getAllRows(sheet);

  // ゲーム情報を元にblocksを作成する
  var blocks = buildReleaseListBlocks(sheet, foundRows, message);

  // Slackにメッセージを送信する
  // var gameSectionCount = 3,
  //     sendCount        = 16;
  var gameSectionCount = 2,
      sendCount        = 25;
      additionValue    = gameSectionCount * sendCount;
  var releaseListTitle = buildSection(buildBoldText(buildLinkText(message, buildListPageUrl(year, month)))); 
  sendMessage([releaseListTitle]);
  for($i = 0; $i < blocks.length; $i = $i + additionValue){
    // １回に送信できるsectionの数が５０までのため複数回に分けて送信する
    // https://api.slack.com/reference/messaging/blocks
    sendMessage(blocks.slice($i, $i + additionValue));
  }
}

/**
 * S3へのアップロード完了メッセージをSlackに通知する
 * @param {String} [yearMonth] - 年月
 */
function notifyCompleteS3Upload(yearMonth) {
  var yearMonthText               = yearMonth.slice(0,4) + '年' + yearMonth.slice(4) + '月';
  var title                       = buildBoldText(yearMonthText + 'のデータをS3にアップロードが完了しました') + ' :sparkles:';
  var voiceActorsMstText          = buildLinkText('・Googleドライブ - 声優マスタ', getVoiceActorsSpreadsheet().getUrl());
  var otherThanVoiceActorsMstText = buildLinkText('・Googleドライブ - 声優マスタ以外', getUploadSpreadSheet(yearMonth).getUrl());
  var s3Text                      = buildLinkText('・S3', 'https://console.aws.amazon.com/s3/buckets/' + Config.AwsS3BucketName + '/' + yearMonth + '/');
  
  var blocks = [buildSection(title + ' \n\n ' + voiceActorsMstText + ' \n ' + otherThanVoiceActorsMstText + ' \n ' + s3Text)];
  sendMessage(blocks);
}

/**
 * Bold用テキストの作成
 * @param {String} [text] - テキスト
 * @return {String} Boldのテキスト
 */
function buildBoldText(text) {
  return '*' + text + '*';
}

/**
 * リンクテキストを作成する
 * @param {String} [text] - テキスト
 * @param {String} [url] - URL
 * @return {String} リンクテキスト
 */
function buildLinkText(text, url) {
  return (url.trim() == '') ? text : '<' + url + '|' + text + '>';
}

/**
 * Secionを作成する
 * @param {String} [text] - テキスト
 * @return {object} Sectionオブジェクト
 */
function buildSection(text) {
  return {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": text
    }
  }
}

/**
 * Blocksのゲーム情報用Secionを作成する
 * @param {String} [text] - テキスト
 * @return {object} ゲーム情報Sectionオブジェクト
 */
function buildGameInfoSection(text) {
  return {
    "type": "context",
    "elements": [
      {
        "type": "mrkdwn",
        "text": text
      }
    ]
  }
}

/**
 * Blocksの画像Secionを作成する
 * @param {String} [text] - テキスト
 * @param {String} [altText] - 画像のAlternalText
 * @return {object} 画像Sectionオブジェクト
 */
function buildImageSection(url, altText) {
  return {
    "type": "image",
    "image_url": url,
    "alt_text": altText
  }
}

/**
 * 発売リスト通知用のBlocksを作成する
 * @param {Sheet} [sheet] - シートObject
 * @param {Array} [rows] - 対象のデータ行配列
 * @return {object} Blocksオブジェクト
 */
function buildReleaseListBlocks(sheet, rows) {
  // 対象のデータを全て取得する
  var rowsCount = rows[rows.length - 1] - 1,
      values    = sheet.getRange(2, 1, rowsCount, maxColumnsCount).getValues()
      blocks    = [];
  // ゲーム情報からメッセージを作成する
  values.forEach(function(value) {
    var brandName        = value[Columns.ArrayValue(Columns.BrandName)],
        barandPage       = value[Columns.ArrayValue(Columns.BrandPage)],
        title            = value[Columns.ArrayValue(Columns.Title)],
        introductionPage = value[Columns.ArrayValue(Columns.IntroductionPage)],
        releaseDate      = Utilities.formatDate(value[Columns.ArrayValue(Columns.ReleaseDate)],"JST","yyyy/MM/dd"),
        price            = value[Columns.ArrayValue(Columns.Price)],
        voiceActors      = value[Columns.ArrayValue(Columns.VoiceActor)],
        packageImage     = value[Columns.ArrayValue(Columns.PackageImage)];
    var titleText = buildBoldText(buildLinkText(title, introductionPage)) + 
                    ' (' + buildBoldText(buildLinkText(brandName, barandPage)) + ')';
    var gameInfoText = releaseDate + '\n' + price + '\n' + voiceActors;
    blocks.push(buildSection(titleText));
    blocks.push(buildGameInfoSection(gameInfoText));
    // リファラーがげっちゅ屋でないと「Forbidden」になるように設定されているっぽいので
    // 直リンクができないようになったので画像のリンクを貼る処理はなくす
    // blocks.push(buildImageSection(packageImage, title));
    // blocks.push(buildSection(packageImage));
  });
  return blocks;
}

/**
 * Slackのチャンネルにメッセージを送信する
 * @param {Array} [blocks] - blocksオブジェクト
 */
function sendMessage(blocks) {
  var payload = {
    blocks: blocks,
  };

  var option = {
    'method': 'post',
    'payload': JSON.stringify(payload),
    'contentType': 'application/x-www-form-urlencoded; charset=utf-8',
    'muteHttpExceptions': true
  };
  
  // Slackにメッセージを送信
  var response = UrlFetchApp.fetch(Config.SlackWebHookUrl, option);
  Logger.log(response);
}
