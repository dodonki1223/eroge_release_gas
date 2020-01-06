// voice_actorsシートオブジェクト
var VoiceActorsSheet = getVoiceActorsSheet("voice_actors");

// voice_actorsシートの最終行
var VoiceActorsSheetLastRow = getVoiceActorsSheetLastRow();

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
 * voice_actorsシートの最終行を取得する
 * ヘッダーは対象に入れないようにするため1だったら2にする
 * @return {Number} 最終行
 */
function getVoiceActorsSheetLastRow() {
  return VoiceActorsSheet.getLastRow() == 1 ? 2 : VoiceActorsSheet.getLastRow();
}


function getVoiceActorID(voiceActorName) {
  var voiceActors = VoiceActorsSheet.getRange("A2:B" + VoiceActorsSheetLastRow).getValues();
  for (i = 0; i < voiceActors.length; i++) {
    if (voiceActorName != voiceActors[i][1]) continue;
    return voiceActors[i][0];
  }
  return "";
}

/**
 * voice_actorsスプレッドシート内のシート取得する
 * @return {Spreadsheet} Spreadsheetオブジェクト
 */
function getVoiceActorsData() {
  return VoiceActorsSheet.getRange("B2:B" + VoiceActorsSheetLastRow).getValues();
}

/**
 * voice_actorsシートに声優情報を書き込む
 * @param {String} [sheetName] - シート名（eroge_release_botスプレッドシート）
 */
function writeVoiceActorsInfo(sheetName) {
  var existsVoiceActors = getVoiceActorsData().map(function(voiceActor){
    return voiceActor[0];
  });

  // 書き込み対象の情報を取得する
  var writeVoiceActors = getVoiceActorsByGameID(sheetName);
  var writeRow = VoiceActorsSheet.getLastRow() + 1;
  
  // 存在していない声優情報を書き込む
  Object.keys(writeVoiceActors).forEach(function(data){
    writeVoiceActors[data].forEach(function(voiceActor){
      if (existsVoiceActors.indexOf(voiceActor) == -1) {
        var writeCell = "B" + writeRow;
        VoiceActorsSheet.getRange(writeCell).setValue(voiceActor);
        existsVoiceActors.push(voiceActor);
        writeRow = writeRow + 1;
      }
    });
  });
  
  // ID列を最終行までコピー
  var copyRange = "A2:A" + (writeRow - 1);
  VoiceActorsSheet.getRange(1, 1).copyTo(VoiceActorsSheet.getRange(copyRange));
}

/**
 * 今月のゲーム情報からvoice_actorsシートに声優情報を書き込む
 * @param {String} [sheetName] - シート名（eroge_release_botスプレッドシート）
 */
function writeVoiceActorsInfoByThisMonth() {
  writeVoiceActorsInfo(getNowYearMonth());
}