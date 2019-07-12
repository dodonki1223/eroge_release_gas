/**
 * 声優名を取得する
 * 「来月の声優名」、「先月の声優名」、「声優名」の形式でLINE BOTから受け取るため、
 * 声優名の前に付加されている文字列を除去したものを返す
 * @param {String} [message] - LINE　BOTから受け取ったメッセージ
 * @return {String} 声優名
 */
function getVoiceActorName(message) {
  replaceMessage = message.replace(targetMonth.LastMonthString, '');
  return replaceMessage.replace(targetMonth.NextMonthString, '');
}

/**
 * リストページのURLを作成する
 * 年と月情報からリストページのURLを作成する
 * @param {Number} [year] - 年
 * @param {Number} [month] - 月
 * @return {String} リストページのURL
 */
function buildListPageUrl(year, month) {
  return 'http://www.getchu.com/all/price.html?genre=pc_soft&year=' + year + '&month=' + month + '&gage=&gall=all';
}

/**
 * Postするメッセージを作成する
 * @param {Sheet} [sheet] - シートObject
 * @param {Number} [row] - 対象のデータ行
 * @return {String} 対象のゲームのPostするメッセージ
 */
function postMessage(sheet, row) {
  // 対象の行データを全て取得する
  var rowValues        = sheet.getRange(row, 1, 1, maxColumnsCount).getValues()[0];
  
  // メッセージに表示するための情報を取得します
  var releaseDate      = Utilities.formatDate(rowValues[columns.ReleaseDate], "JST", "yyyy/MM/dd"),
      title            = rowValues[columns.Title],
      price            = rowValues[columns.Price],
      introductionPage = rowValues[columns.IntroductionPage],
      brandPage        = rowValues[columns.BrandPage];

  var message = releaseDate + '\n' +
                title + '\n' +
                price + '\n' +
                introductionPage + '\n' +
                '\n' +
                brandPage;
  
  // Logger.log('PostMessage：' + message);
  
  return message;
}

/**
 * 発売リストページの情報をPostするメッセージを作成する
 * @param {Number} [year] - 年
 * @param {Number} [month] - 月
 * @return {String} 発売リストページ情報をPostするメッセージ
 */
function listPagePostMessage(year, month) {
  var message = year + '年' + month + '月の発売リストページです\n' + buildListPageUrl(year, month);
  return message;
}

/**
 * 出演ゲームが存在しない時のPostするメッセージを作成する
 * @param {Number} [month] - 対象の月（yearMonth.gsのtargetMonthの値）
 * @param {String} [voiceActorName] - 声優名
 * @return {String} 対象の月に出演しない旨のメッセージ
 */
function notExistPostMessage(month, voiceActorName) {
  var message = '';
  
  if (month == targetMonth.LastMonth) {
    message = targetMonth.LastMonthString + voiceActorName;
  } else if (month == targetMonth.NextMonth) {
    message = targetMonth.NextMonthString + voiceActorName;
  } else {
    message = targetMonth.CurrentMonthString + voiceActorName;
  }
  
  message = message + 'はゲームに出演する予定はありません'
  
  return message;
}