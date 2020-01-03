/**
 * brandsシートの書き込み処理
 * @param {Spreadsheet} [spreadSheet] - SpreadsheetObject
 * @param {String} [sheetName] - データを取得するシート名
 */
function createBrandsSheet(spreadSheet, sheetName) {
  var sheet = createSheet(spreadSheet, "brands");
  var datas = getEliminateDuplicationData(sheetName);

  datas.forEach(function(data, index){
    sheet.getRange(index + 1, 1).setValue(data[Columns.ArrayValue(Columns.BrandID)]);
    sheet.getRange(index + 1, 2).setValue(data[Columns.ArrayValue(Columns.BrandName)]);
    sheet.getRange(index + 1, 3).setValue(data[Columns.ArrayValue(Columns.BrandPage)]);
  });
}

/**
 * game_castsシートの書き込み処理
 * @param {Spreadsheet} [spreadSheet] - SpreadsheetObject
 * @param {String} [sheetName] - データを取得するシート名
 */
function createGameCasts(spreadSheet, sheetName) {
  var sheet = createSheet(spreadSheet, "game_casts");
  var voiceActorDatas = getVoiceActorsByGameID(sheetName);
  var rowIndex = 1;

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
  var datas = getEliminateDuplicationData(sheetName);

  datas.forEach(function(data, index){
    sheet.getRange(index + 1, 1).setValue(data[Columns.ArrayValue(Columns.ID)]);
    sheet.getRange(index + 1, 2).setValue(data[Columns.ArrayValue(Columns.Title)]);
    sheet.getRange(index + 1, 3).setValue(data[Columns.ArrayValue(Columns.BrandID)]);
    sheet.getRange(index + 1, 4).setValue(data[Columns.ArrayValue(Columns.ReleaseDate)]);
    sheet.getRange(index + 1, 5).setValue(amountStringToPrice(data[Columns.ArrayValue(Columns.Price)]));
    sheet.getRange(index + 1, 6).setValue(data[Columns.ArrayValue(Columns.IntroductionPage)]);
  });
}
