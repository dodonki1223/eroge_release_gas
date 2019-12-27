// スプレッドシート作成メソッドのデバッグ用
function debugCreateSpreadSheet() {
  createSpreadSheet("201911", "201911");
  // createSpreadSheet("201912", "201912");
  // createSpreadSheet("201912", "201912");
  // createSpreadSheet("202001", "gorira");
}

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
  var alreadyCreatedFolder = getErogeReleaseBotFoldersByName(folderName);
  if (alreadyCreatedFolder.hasNext()) {
    erogeReleaseBotFolder.removeFolder(alreadyCreatedFolder.next());
  }

  // フォルダを新規で作成する
  // NOTE: 理由はよくわからないがなぜか作成後のフォルダもう一度検索しないと正しく取得できなかったOrz
  //       Folderオブジェクト経由だと正しく取得できない
  createFolder(folderName);
  var targetFolder = getErogeReleaseBotFoldersByName(folderName);
  var result = Drive.Files.insert({
      "title":    spreadSheetName,
      "mimeType": "application/vnd.google-apps.spreadsheet",
      "parents":  [{"id": targetFolder.next().getId()}]
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
 *
 * @param {String} [folderName] - フォルダ名
 * @return {Folder} eroge_release_botフォルダ配下のフォルダ
 */
function getErogeReleaseBotFoldersByName(folderName) {
  var erogeReleaseBotFolder = getErogeReleaseBotFolder();
  return  erogeReleaseBotFolder.getFoldersByName(folderName);
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
