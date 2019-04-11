/**
 * Postするメッセージを作成する（複数バージョン）
 * LINEのMessagingAPIの仕様だと送信できるメッセージの最大件数は５件
 * https://developers.line.biz/ja/reference/messaging-api/#webhook-event-objects
 * @param {Sheet} [sheet] - シートObject
 * @param {Array} [rows] - 対象のデータ行配列
 * @return {String} 見つかった行数分のゲームのPostするメッセージ
 */
function createPostMessages(sheet, rows) {
  return rows.map(function(row) {
    return {
      'type': 'text',
      'text': postMessage(sheet, row),
    }
  });
}

/**
 * 出演するゲームがなかった時にPostするメッセージを作成する
 * @param {Number} [year] - 年
 * @param {Number} [month] - 月
 * @return {String} 出演するゲームがなかった時のPostするメッセージ
 */
function createListPagePostMessage(year, month) {
  return [{
    'type': 'text',
    'text': listPagePostMessage(year, month),
  }]
}

/**
 * 出演するゲームがなかった時にPostするメッセージを作成する
 * @param {Number} [sheet] - 月情報（-1,0,1）
 * @param {String} [rows] - 声優名
 * @return {String} 出演するゲームがなかった時のPostするメッセージ
 */
function createNotExistsPostMessage(month, voiceActorName) {
  return [{
    'type': 'text',
    'text': notExistPostMessage(month, voiceActorName),
  }]
}

/**
 * リクエスト情報（JSON）を作成する
 * @param {String} [replyToken] - WebHookで受信した応答用Token（LINE BOTより）
 * @param {CallBack} [callback] - calllback関数
 * @return {String} リクエスト情報（JSON）
 */
function createRequest(replyToken, callback) {
  return {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + config.LineAccessToken,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': callback,
    }),
  }
}

/**
 * Postを実行する
 * @param {JSON} [e] - POSTされた情報
 * @return {JSON} Postが成功した情報をJSON形式で返す
 */
function doPost(e) {
  // LineBotからPostされたデータを取得
  // Webhookイベントオブジェクトの返す値について
  // →https://developers.line.biz/ja/reference/messaging-api/#webhook-event-objects
  var replyToken  = JSON.parse(e.postData.contents).events[0].replyToken,　 // WebHookで受信した応答用Token
      userMessage = JSON.parse(e.postData.contents).events[0].message.text; // ユーザーのメッセージを取得（声優名）

  // 対象の月を取得する
  var targetMonth = getTargetMonth(userMessage);
  
  // 対象のシートを取得
  var yearMonth = getYearMonth(targetMonth),
      sheet     = getSheet(yearMonth);
  
  // 声優名を取得する
  var voiceActorName = getVoiceActorName(userMessage)
  
  // 声優名から対象のスプレッドシートの行を取得
  var foundRows = getRowsByVoiceActor(sheet, voiceActorName);

  // LineにPostする
  if (voiceActorName == 'リスト') {
    var year  = yearMonth.slice(0,4),
        month = yearMonth.slice(4);
    UrlFetchApp.fetch(config.LinePostUrl, createRequest(replyToken, createListPagePostMessage(year, month)));
  } else {
    if (foundRows.length == 0) {
      UrlFetchApp.fetch(config.LinePostUrl, createRequest(replyToken, createNotExistsPostMessage(targetMonth, voiceActorName)));
    } else {
      UrlFetchApp.fetch(config.LinePostUrl, createRequest(replyToken, createPostMessages(sheet, foundRows)));
    }
  }
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}
