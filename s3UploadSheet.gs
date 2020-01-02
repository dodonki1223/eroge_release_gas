/**
 * brandsシートの書き込み処理
 * @param {Spreadsheet} [spreadSheet] - SpreadsheetObject
 * @param {Sheet} [datas] - 書き込むデータ（getEliminateDuplicationDataのデータ）
 */
function createBrandsSheet(spreadSheet, datas) {
  var sheet = createSheet(spreadSheet, "brands");

  datas.forEach(function(data, index){
    sheet.getRange(index + 1, 1).setValue(data[Columns.ArrayValue(Columns.BrandID)]);
    sheet.getRange(index + 1, 2).setValue(data[Columns.ArrayValue(Columns.BrandName)]);
    sheet.getRange(index + 1, 3).setValue(data[Columns.ArrayValue(Columns.BrandPage)]);
  });
}

/**
 * gamesシートの書き込み処理
 * @param {Spreadsheet} [spreadSheet] - SpreadsheetObject
 * @param {Sheet} [datas] - 書き込むデータ（getEliminateDuplicationDataのデータ）
 */
function createGamesSheet(spreadSheet, datas) {
  var sheet = createSheet(spreadSheet, "games");

  datas.forEach(function(data, index){
    sheet.getRange(index + 1, 1).setValue(data[Columns.ArrayValue(Columns.ID)]);
    sheet.getRange(index + 1, 2).setValue(data[Columns.ArrayValue(Columns.Title)]);
    sheet.getRange(index + 1, 3).setValue(data[Columns.ArrayValue(Columns.BrandID)]);
    sheet.getRange(index + 1, 4).setValue(data[Columns.ArrayValue(Columns.ReleaseDate)]);
    sheet.getRange(index + 1, 5).setValue(amountStringToPrice(data[Columns.ArrayValue(Columns.Price)]));
    sheet.getRange(index + 1, 6).setValue(data[Columns.ArrayValue(Columns.IntroductionPage)]);
  });
}
