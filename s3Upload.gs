function test(){
  // バイナリに変換
  csv = Utilities.newBlob( '"Uwaaaaa2","Iyaaaaaaaa2"' + "\n" + '"Guoooooo2","Juraaaaaaa2"' );
 
  var s3 = S3.getInstance( Config.AwsAccessKeyID, Config.AwsSecretAccessKey );
  s3.putObject( 'eroge-release-bot', '202001/test.csv', csv, {logRequests:true} );
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
  sheet.getRange(1, 5).setValue('価格');
  sheet.getRange(1, 6).setValue('ゲーム紹介ページ');
  
  var datas = getEliminateDuplicationData(sheetName);

  datas.forEach(function(data, index){
    // indexが０始まりなので+1、ヘッダー行より下に書き込むのでさらに+1
    row = index + 1 + 1;  
    sheet.getRange(row, 1).setValue(data[Columns.ArrayValue(Columns.ID)]);
    sheet.getRange(row, 2).setValue(data[Columns.ArrayValue(Columns.Title)]);
    sheet.getRange(row, 3).setValue(data[Columns.ArrayValue(Columns.BrandID)]);
    sheet.getRange(row, 4).setValue(data[Columns.ArrayValue(Columns.ReleaseDate)]);
    sheet.getRange(row, 5).setValue(amountStringToPrice(data[Columns.ArrayValue(Columns.Price)]));
    sheet.getRange(row, 6).setValue(data[Columns.ArrayValue(Columns.IntroductionPage)]);
  });
}
