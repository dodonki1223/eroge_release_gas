function test(){
  createS3UploadFiles('201911');
  csv = buildCSV('201911', 'games');
  var s3 = S3.getInstance( Config.AwsAccessKeyID, Config.AwsSecretAccessKey );
  s3.putObject( 'eroge-release-bot', '202001/test.csv', csv, {logRequests:true} );
}

/**
 * CSV用のデータを作成する
 * @param {String} [spreadSheetName] - 対象のスプレッドシート名
 * @param {String} [csvSheetName] - 作成するCSV対象のシート名
 * @return {Blob} CSV用のBlogオブジェクト
 */
function buildCSV(spreadSheetName, csvSheetName){
  var targetFolder = getFolderForErogeReleaseBot(spreadSheetName);
  var ss = getSpreadSheetForErogeReleaseBot(targetFolder, spreadSheetName);
  var sheet = getSheet(csvSheetName, ss);
  
  var csvDatas = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  var csvContent = '';
  csvDatas.forEach(function(data){
    for($i = 0; $i < sheet.getLastColumn(); $i++){
      csvContent += '"' + data[$i] + '",';
    }
    // 上の処理で常に末尾にカンマを付加しているので一番最後の末尾だけカンマを削除する
    csvContent = csvContent.slice(0, -1) + '\n';
  });
  
  // バイナリに変換
  return Utilities.newBlob(csvContent);
}

/**
 * S3にアップロードするようのファイルにへの書き込み処理を行う
 * @param {String} [sheetName] - データを取得するシート名
 */
function createS3UploadFiles(sheetName){
  // ブランド・ゲームの出演情報・ゲーム情報を書き込む
  var createSpreadSheetResult = createSpreadSheet(sheetName, sheetName);
  var ss = SpreadsheetApp.openById(createSpreadSheetResult["id"]);
  createBrandsSheet(ss, sheetName);
  createGameCasts(ss, sheetName);
  createGamesSheet(ss, sheetName);
}

/**
 * 今月のゲーム情報からS3にアップロードするようのファイルにへの書き込み処理を行う
 */
function createS3UploadFilesForThisMonth(){
  createS3UploadFiles(getNowYearMonth());
}

/**
 * brandsシートの書き込み処理
 * TODO：同じブランド情報が書き込まれてしまう問題あり（解決するかどうかはまた別問題）
 * @param {Spreadsheet} [spreadSheet] - SpreadsheetObject
 * @param {String} [sheetName] - データを取得するシート名
 */
function createBrandsSheet(spreadSheet, sheetName) {
  var sheet = createSheet(spreadSheet, "brands");

  // ヘッダー行の書き込み
  sheet.getRange(1, 1).setValue('ブランドID');
  sheet.getRange(1, 2).setValue('ブランド名');
  sheet.getRange(1, 3).setValue('ブランドURL');
  
  var datas = getEliminateDuplicationData(sheetName);

  datas.forEach(function(data, index){
    // indexが０始まりなので+1、ヘッダー行より下に書き込むのでさらに+1
    row = index + 1 + 1;
    sheet.getRange(row, 1).setValue(data[Columns.ArrayValue(Columns.BrandID)]);
    sheet.getRange(row, 2).setValue(data[Columns.ArrayValue(Columns.BrandName)]);
    sheet.getRange(row, 3).setValue(data[Columns.ArrayValue(Columns.BrandPage)]);
  });
}

/**
 * game_castsシートの書き込み処理
 * @param {Spreadsheet} [spreadSheet] - SpreadsheetObject
 * @param {String} [sheetName] - データを取得するシート名
 */
function createGameCasts(spreadSheet, sheetName) {
  var sheet = createSheet(spreadSheet, "game_casts");
  
  // ヘッダー行の書き込み
  sheet.getRange(1, 1).setValue('ゲームID');
  sheet.getRange(1, 2).setValue('声優ID');
  sheet.getRange(1, 3).setValue('声優名');
  
  var voiceActorDatas = getVoiceActorsByGameID(sheetName);
  var rowIndex = 2; // ヘッダー行より下に書き込むのでさらに2始まりとする

  Object.keys(voiceActorDatas).forEach(function(gameID){
    voiceActorDatas[gameID].forEach(function(voiceActor){
      sheet.getRange(rowIndex, 1).setValue(gameID);
      sheet.getRange(rowIndex, 2).setValue(getVoiceActorID(voiceActor));
      sheet.getRange(rowIndex, 3).setValue(voiceActor);
      rowIndex = rowIndex + 1;
    });
  });
}

/**
 * gamesシートの書き込み処理
 * @param {Spreadsheet} [spreadSheet] - SpreadsheetObject
 * @param {String} [sheetName] - データを取得するシート名
 */
function createGamesSheet(spreadSheet, sheetName) {
  var sheet = createSheet(spreadSheet, "games");
  
  // ヘッダー行の書き込み
  sheet.getRange(1, 1).setValue('ゲームID');
  sheet.getRange(1, 2).setValue('タイトル');
  sheet.getRange(1, 3).setValue('ブランドID');
  sheet.getRange(1, 4).setValue('発売日');
  sheet.getRange(1, 5).setValue('ゲーム紹介ページ');
  
  var datas = getEliminateDuplicationData(sheetName);

  datas.forEach(function(data, index){
    // indexが０始まりなので+1、ヘッダー行より下に書き込むのでさらに+1
    row = index + 1 + 1;  

    // スクレイピングで変な文字列を取得されてしまうため末尾の文字を削除する
    var title = data[Columns.ArrayValue(Columns.Title)];
    if (title.slice(-1) == '　') title = title.slice(0, -1);
   
    sheet.getRange(row, 1).setValue(data[Columns.ArrayValue(Columns.ID)]); 
    sheet.getRange(row, 2).setValue(title);
    sheet.getRange(row, 3).setValue(data[Columns.ArrayValue(Columns.BrandID)]);
    sheet.getRange(row, 4).setValue(data[Columns.ArrayValue(Columns.ReleaseDate)]);
    sheet.getRange(row, 5).setValue(data[Columns.ArrayValue(Columns.IntroductionPage)]);
  });
}