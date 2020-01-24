// voice_actorsシートオブジェクト
var VoiceActorsSheet = getVoiceActorsSheet('voice_actors');

/**
 * voice_actorsファイルを取得する
 * @return {File} Fileオブジェクト
 */
function getVoiceActorsFile() {
  var erogeReleaseBotFolder = getErogeReleaseBotFolder();
  var files = erogeReleaseBotFolder.searchFiles('title = "voice_actors"');
  
  return files.hasNext() ? files.next() : '';
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
 * 声優IDの取得
 * 声優名に一意に割り振られたIDを取得する。取得できなかった時は空文字を返す
 * @param {String} [voiceActorName] - 声優名
 * @return {Number} 声優ID
 */
function getVoiceActorID(voiceActorName) {
  var lastRow = VoiceActorsSheet.getLastRow() + 1;
  var voiceActors = VoiceActorsSheet.getRange('A2:B' + lastRow).getValues();
  for (i = 0; i < voiceActors.length; i++) {
    if (voiceActorName != voiceActors[i][1]) continue;
    return voiceActors[i][0];
  }
  return "";
}

/**
 * 声優名を全部取得する
 * @return {Array} 声優名を格納した配列
 */
function getVoiceActorNames() {
  var lastRow = VoiceActorsSheet.getLastRow() + 1;
  return VoiceActorsSheet.getRange('B2:B' + lastRow).getValues();
}

/**
 * voice_actorsシートに声優情報を書き込む
 * @param {String} [sheetName] - シート名（eroge_releaseスプレッドシート）
 */
function writeVoiceActorsInfo(sheetName) {
  var existsVoiceActors = getVoiceActorNames().map(function(voiceActor){
    return voiceActor[0];
  });

  // 書き込み対象の情報を取得する
  var writeVoiceActors = getVoiceActorsByGameID(sheetName);
  var writeRow = VoiceActorsSheet.getLastRow() + 1;
  
  // 存在していない声優情報を書き込む
  Object.keys(writeVoiceActors).forEach(function(data){
    writeVoiceActors[data].forEach(function(voiceActor){
      if (existsVoiceActors.indexOf(voiceActor) == -1) {
        var idCell = 'A' + writeRow;
        var nameCell = 'B' + writeRow;
        VoiceActorsSheet.getRange(nameCell).setValue(voiceActor);
        VoiceActorsSheet.getRange(idCell).setValue(writeRow - 1);
        existsVoiceActors.push(voiceActor);
        writeRow = writeRow + 1;
      }
    });
  });
}

/**
 * 今月のゲーム情報からvoice_actorsシートに声優情報を書き込む
 * @param {String} [sheetName] - シート名（eroge_release_botスプレッドシート）
 */
function writeVoiceActorsInfoByThisMonth() {
  writeVoiceActorsInfo(getNowYearMonth());
}