/**
 * 発売リスト一覧のメッセージをSlackに送信する
 */
function releaseListSendMessage() {
  // 送信するメッセージ情報を作成する
  var yearMonth = getYearMonth(0),
      sheet     = getSheet(yearMonth),
      foundRows = getAllRows(sheet);
  var attachments = (function(sheet, rows) {
    // 対象のデータを全て取得しそのデータからAttachementを作成する
    var rowsCount = rows[rows.length - 1] - 1,
        values    = sheet.getRange(2, 1, rowsCount, maxColumnsCount).getValues();
        
    Logger.log(values);
        
    return values.map(function(value) {
      var brandName        = value[columns.BrandName],
          title            = value[columns.Title],
          introductionPage = value[columns.IntroductionPage],
          releaseDate      = Utilities.formatDate(value[columns.ReleaseDate],"JST","yyyy/MM/dd"),
          price            = value[columns.Price],
          voiceActors      = value[columns.VoiceActor],
          packageImage     = value[columns.PackageImage];
      return createAttachement(brandName, title, introductionPage, releaseDate, price, voiceActors, packageImage);
    });
  }(sheet, foundRows));
  
  // メッセージを作成する
  var year    = yearMonth.slice(0,4),
      month   = yearMonth.slice(4),
      message = year + '年' + month + '月の発売リスト';
      
  // Slackにメッセージを送信する　
  sendMessage(message, 
              config.SlackPostChannel, 
              '発売リストくん', 
              config.SlackPostUserIcon, 
              attachments);
}

/**
 * Attachementを作成する
 * @param {String} [brandName] - ブランド名
 * @param {String} [title] - ゲームのタイトル名
 * @param {String} [introductionPage] - ゲームの紹介ページ
 * @param {String} [releaseDate] - 発売日
 * @param {String} [price] - ゲームの価格
 * @param {String} [voiceActors] - 声優情報
 * @param {String} [image] - ゲームのパッケージ画像
 * @param {Array} - SlackAPIで宣言されているAttachement
 */
function createAttachement(brandName, title, introductionPage, releaseDate, price, voiceActors, image) {
  return {
      "author_name": brandName,
      "color": "#a8bdff",
      "title": title,
      "title_link": introductionPage,
      "text": releaseDate + '\n' + 
              price + '\n' + 
              voiceActors,
      "image_url": image
  }
}

/**
 * Slackのあるチャンネルにメッセージを送信する
 * @param {String} [message] - Slackに表示するメッセージ
 * @param {String} [channel] - メッセージを送信するチャンネルID
 * @param {String} [username] - メッセージを送るユーザー名
 * @param {String} [iconUrl] - メッセージを送るユーザーのICON
 * @param {Array} [attachements] - コンテンツやメッセージリンクリスト
 */
function sendMessage(message, channel, username, iconUrl, attachments) {
  var payload = {
    channel: channel,
    text: message,
    username: username,
    icon_url: iconUrl,
    attachments: attachments,
  };
  
  var option = {
    'method': 'post',
    'payload': JSON.stringify(payload),
    'contentType': 'application/x-www-form-urlencoded; charset=utf-8',
    'muteHttpExceptions': true
  };
  
  // Slackにメッセージを送信
  var response = UrlFetchApp.fetch(config.SlackWebHookUrl, option);
}