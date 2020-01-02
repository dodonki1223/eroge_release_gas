/**
 * voice_actorsファイルを取得する
 * @return {File} Fileオブジェクト
 */
function getVoiceActorsFile() {
  var erogeReleaseBotFolder = getErogeReleaseBotFolder();
  var files = erogeReleaseBotFolder.searchFiles('title = "voie_actors"');
  
  return files.hasNext() ? files.next() : "";
}

/**
 * voice_actorsSpreadSheetを取得する
 * @return {Spreadsheet} Spreadsheetオブジェクト
 */
function getVoiceActorsSpreadsheet(){
  return SpreadsheetApp.openById(getVoiceActorsFile().getId());
}

/**
 * voice_actorsスプレッドシート内のシート取得する
 * @return {Spreadsheet} Spreadsheetオブジェクト
 */
function getVoiceActorsSheet(sheetName){
  return getSheet(sheetName, getVoiceActorsSpreadsheet());
}
