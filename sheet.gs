/**
 * シート名からシートを取得する
 * @param {String} [sheetName] - シート名
 * @return {Sheet} Googleスプレッドシートのシートオブジェクト
 */
function getSheet(SheetName, ss) {
  if (ss === undefined) ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SheetName);

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
 * シート新規に作成する
 * @param {SpreadSheet} [spreadSheet] - SpreadSheetオブジェクト
 * @param {String} [sheetName] - シート名
 * @return {Sheet} 新しく作成したSheet
 */
function createSheet(spreadSheet, sheetName) {
  var sheet = spreadSheet.insertSheet(0);
  sheet.setName(sheetName);
  
  return sheet;
}