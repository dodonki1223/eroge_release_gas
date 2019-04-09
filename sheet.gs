/**
 * シート名からシートを取得する
 * @param {String} [sheetName] - シート名
 * @return {Sheet} Googleスプレッドシートのシートオブジェクト
 */
function getSheet(SheetName) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet(),
      sheet = ss.getSheetByName(SheetName);

  // Logger.log('シート名：' + sheet.getName());

  return sheet;
}

/**
 * 全ての行を取得する
 * @param {Sheet} [sheet] - シートObject
 * @return {Array} 全ての行番号を保持している配列
 */
function getAllRows(sheet) {
  var startRow  = 2,
      foundRows = [];
 
  // 全ての行を配列にセットする
  for(var row = startRow; row <= sheet.getLastRow(); row++) {
    foundRows.push(row);
  }
  
  return foundRows;
}

/**
 * 声優名列から対象の声優が出演している行を取得する
 * @param {Sheet} [sheet] - シートObject
 * @param {String} [voiceActorName] - 検索する声優名
 * @return {Array} 見つかった行番号を保持している配列
 */
function　getRowsByVoiceActor(sheet, voiceActorName) {
  var startRow  = 2,
      searchRangeArea = 'I' + startRow + ':I' + sheet.getLastRow(),
      range     = sheet.getRange(searchRangeArea),
      foundRows = [];

  // 声優名列から対象の声優が出演しているか検索し結果を配列にセット
  for(var row = startRow; row <= range.getNumRows(); row++) {
    cellValue = sheet.getRange("I" + row).getValue();
    if (cellValue.indexOf(voiceActorName) != -1) 
      foundRows.push(row);
  }

  // Logger.log(voiceActorName + '：' + foundRows);

  // APIの制限で５件までしか送信できないため、最初から５件のみを取り出す
  return foundRows.slice(0, 5);
}