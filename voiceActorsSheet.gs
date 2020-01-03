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
 * @param {String} [sheetName] - シート名
 * @return {Spreadsheet} Spreadsheetオブジェクト
 */
function getVoiceActorsSheet(sheetName){
  return getSheet(sheetName, getVoiceActorsSpreadsheet());
}

/**
 * voice_actorsスプレッドシート内のシート取得する
 * @return {Spreadsheet} Spreadsheetオブジェクト
 */
function getVoiceActorsData() {
  var voiceActorsSheet = getVoiceActorsSheet("voice_actors");
  // ヘッダーは対象に入れないようにするため1だったら2にする
  var lastRow = voiceActorsSheet.getLastRow() == 1 ? 2 : voiceActorsSheet.getLastRow();
  
  return voiceActorsSheet.getRange("B2:B" + lastRow).getValues();
}

/**
 * voice_actorsシートに声優情報を書き込む
 * @param {String} [sheetName] - シート名（eroge_release_botスプレッドシート）
 */
function writeVoiceActorsInfo(sheetName) {
  var voiceActorsSheet = getVoiceActorsSheet("voice_actors");
  var existsVoiceActors = getVoiceActorsData().map(function(voiceActor){
    return voiceActor[0];
  });

  // 書き込み対象の情報を取得する
  var writeVoiceActors = getVoiceActorsByGameID(sheetName);
  var writeRow = voiceActorsSheet.getLastRow() + 1;
  
  // 存在していない声優情報を書き込む
  Object.keys(writeVoiceActors).forEach(function(data){
    writeVoiceActors[data].forEach(function(voiceActor){
      if (existsVoiceActors.indexOf(voiceActor) == -1) {
        var writeCell = "B" + writeRow;
        voiceActorsSheet.getRange(writeCell).setValue(voiceActor);
        existsVoiceActors.push(voiceActor);
        writeRow = writeRow + 1;
      }
    });
  });
  
  // ID列を最終行までコピー
  var copyRange = "A2:A" + (writeRow - 1);
  voiceActorsSheet.getRange(1, 1).copyTo(voiceActorsSheet.getRange(copyRange));
}

