/**
 * eroge_release_botフォルダ配下のフォルダ配下に新規でスプレッドシートを作成する
 *
 * @param {String} [folderName] - フォルダ名
 * @param {String} [spreadSheetName] - スプレッドシートファイル名
 * @return {Files resource} ref:https://developers.google.com/drive/api/v2/reference/files#resource
 */
function createSpreadSheet(folderName, spreadSheetName) {
  var erogeReleaseBotFolder = getErogeReleaseBotFolder();

  // 作成対象のフォルダが存在していたら削除する
  var alreadyCreatedFolder = getFolderForErogeReleaseBot(folderName);
  if (alreadyCreatedFolder != '') erogeReleaseBotFolder.removeFolder(alreadyCreatedFolder);

  // フォルダを新規で作成する
  // NOTE: 理由はよくわからないがなぜか作成後のフォルダもう一度検索しないと正しく取得できなかったOrz
  //       Folderオブジェクト経由だと正しく取得できない
  createFolder(folderName);
  var targetFolder = getFolderForErogeReleaseBot(folderName);
  var result = Drive.Files.insert({
      "title":    spreadSheetName,
      "mimeType": "application/vnd.google-apps.spreadsheet",
      "parents":  [{"id": targetFolder.getId()}]
  });
  
  return result;
}

/**
 * eroge_release_botフォルダを取得する
 *
 * @return {Folder} eroge_release_botフォルダ
 */
function getErogeReleaseBotFolder() {
  // フォルダは１件のみ取得されることを想定しているコードです
  var folders = DriveApp.getFoldersByName('eroge_release_bot');
  var erogeReleaseBotFolder = folders.next();
  
  return erogeReleaseBotFolder;
}

/**
 * eroge_release_botフォルダ配下のフォルダを名前で取得する
 * 取得できなかった場合は空文字を返す
 *
 * @param {String} [folderName] - フォルダ名
 * @return {Folder} eroge_release_botフォルダ配下のフォルダ
 */
function getFolderForErogeReleaseBot(folderName) {
  var erogeReleaseBotFolder = getErogeReleaseBotFolder();
  var folderForErogeReleaseBot = erogeReleaseBotFolder.getFoldersByName(folderName);

  return folderForErogeReleaseBot.hasNext() ? folderForErogeReleaseBot.next() : '';
}

/**
 * eroge_release_botフォルダ配下にフォルダを作成する
 *
 * @param {String} [folderName] - フォルダ名
 * @return {Folder} 作成したFolder
 */
function createFolder(folderName) {
  var erogeReleaseBotFolder = getErogeReleaseBotFolder();
  erogeReleaseBotFolder.createFolder(folderName);
  
  return erogeReleaseBotFolder;
}

/**
 * eroge_release_botフォルダ配下のスプレッドシートをスプレッドシート名で取得する
 * 取得できなかった場合は空文字を返す
 *
 * @param {Folder} [folder] - 検索対象のフォルダオブジェクト
 * @param {String} [spreadSheetName] - スプレッドシート名
 * @return {SpreadSheet} 検索できたSpreadSheetオブジェクト
 */
function getSpreadSheetForErogeReleaseBot(folder, spreadSheetName){
  var files = folder.searchFiles('title = "' + spreadSheetName + '"');
  var targetFile = files.hasNext() ? files.next() : '';
  
  if (targetFile === '') return '';
  
  return SpreadsheetApp.openById(targetFile.getId());
}

// スプレッドシート作成メソッドのデバッグ用
function TestCreateSpreadSheet() {
  createSpreadSheet("201911", "201911");
  createSpreadSheet("201912", "201912");
  createSpreadSheet("202001", "202001");
}

// eroge_release_botフォルダ配下のスプレッドシートを取得するメソッドのデバッグ用
function TestGetSpreadSheetForErogeReleaseBot(){
  Logger.log('201911のスプレッドシートのID：' + getSpreadSheetForErogeReleaseBot(getFolderForErogeReleaseBot('201911'), '201911').getId());
  Logger.log('201912のスプレッドシートのID：' + getSpreadSheetForErogeReleaseBot(getFolderForErogeReleaseBot('201912'), '201912').getId());
  Logger.log('202001のスプレッドシートのID：' + getSpreadSheetForErogeReleaseBot(getFolderForErogeReleaseBot('202001'), '202001').getId());
}
