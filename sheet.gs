// Googleスプレッドシートのカラム用Object
var Columns = {
  Id              : 1,
  ReleaseDate     : 2,
  Title           : 3,
  PackageImage    : 4,
  Price           : 5,
  IntroductionPage: 6,
  BrandName       : 7,
  BrandPage       : 8,
  VoiceActor      : 9,
  ArrayValue: function(value) {
    return value -1;
  }
};

// Googleスプレッドシートのカラム数
var maxColumnsCount = Object.keys(Columns).length;

/**
 * シート名からシートを取得する
 * @param {String} [sheetName] - シート名
 * @return {Sheet} Googleスプレッドシートのシートオブジェクト
 */
function getSheet(SheetName) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet(),
      sheet = ss.getSheetByName(SheetName);

  // Logger.log('シート名：' + sheet.getName());

  return sheet;
}

/**
 * 全ての行を取得する
 * @param {Sheet} [sheet] - シートObject
 * @return {Array} 全ての行番号を保持している配列
 */
function getAllRows(sheet) {
  var startRow  = 2,
      foundRows = [];
 
  // 全ての行を配列にセットする
  for(var row = startRow; row <= sheet.getLastRow(); row++) {
    foundRows.push(row);
  }
  
  return foundRows;
}

/**
 * 声優名列から対象の声優が出演している行を取得する
 * @param {Sheet} [sheet] - シートObject
 * @param {String} [voiceActorName] - 検索する声優名
 * @return {Array} 見つかった行番号を保持している配列
 */
function　getRowsByVoiceActor(sheet, voiceActorName) {
  var startRow  = 2,
      searchRangeArea = 'I' + startRow + ':I' + sheet.getLastRow(),
      range     = sheet.getRange(searchRangeArea),
      foundRows = [];

  // Rangeのスタートが２行目のため、Rangeの行数＋１する
  var searchMaxRow = range.getNumRows() + 1;

  // 声優名列から対象の声優が出演しているか検索し結果を配列にセット
  for(var row = startRow; row <= searchMaxRow; row++) {
    cellValue = sheet.getRange("I" + row).getValue();
    if (cellValue.indexOf(voiceActorName) != -1) 
      foundRows.push(row);
  }

  // Logger.log(voiceActorName + '：' + foundRows);
  // APIの制限で５件までしか送信できないため、最初から５件のみを取り出す
  return foundRows.slice(0, 5);
}

/**
 * シート内の全データを取得する
 * @param {String} [sheetName] - シート名
 * @return {Array} シート内の全データ
 */
function getAllData(sheetName) {
  var sheet = getSheet(sheetName);
  var range = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());

  return range.getValues();
}

/**
 * シート内の全データから声優名が存在しているゲーム
 * @param {String} [sheetName] - シート名
 * @return {Array} シート内の全データ（声優名が存在している）
 */
function getAllDataExistsVoiceActor(sheetName) {
  var allData = getAllData(sheetName);
  var allDataExistsVoiceActor = allData.filter(function(value){
    return (!value[Columns.ArrayValue(Columns.VoiceActor)] == "");
  });
  
  return allDataExistsVoiceActor;
}

/**
 * シート内のブランドデータを取得する
 * ref:https://stackoverflow.com/questions/20339466/how-to-remove-duplicates-from-multidimensional-array
 * @param {String} [sheetName] - シート名
 * @return {Array} ブランドデータ
 */
function getBrandData(sheetName) {
  var sheet = getSheet(sheetName);

  var brandRange = sheet.getRange("G2:H" + sheet.getLastRow());
  var brandData = brandRange.getValues();
  var brandDataUniques = [];  

  var itemsFound = {};
  for(var i = 0, l = brandData.length; i < l; i++) {
    // 配列を文字列に変換しすでに存在しているものだったら次の要素へ
    var stringified = JSON.stringify(brandData[i]);
    if(itemsFound[stringified]) continue;

    // ブランドデータを追加する（重複はいれない）
    brandDataUniques.push(brandData[i]);
    itemsFound[stringified] = true;
  }

  return brandDataUniques;
}

/**
 * ブランド単位にデータを分ける（声優名が存在しない箇所は除く） 
 * @param {String} [sheetName] - シート名
 * @return {Object} キーがブランド名で分けられたデータ
 */
function getAllDataByBrand(sheetName) {
  var allData = getAllDataExistsVoiceActor(sheetName);
  var brandData = getBrandData(sheetName);
  
  // キーがブランド名になった連想配列を作成する
  var dataByBrand = {};
  for(var i = 0, l = brandData.length; i < l;i++) {
    var addData = allData.filter(function(data){
      return brandData[i][0] == data[Columns.ArrayValue(Columns.BrandName)];
    });
    dataByBrand[brandData[i][0]] = addData;
  }
  
  return dataByBrand;
}

/**
 * 重複を排除したデータ（声優名があってブランドごと１件分のデータ）
 * 作成されるデータが完璧ではないので雰囲気で入れるためのものと認識すること
 * @param {String} [sheetName] - シート名
 * @return {Array} 重複を排除したデータ
 */
function getEliminateDuplicationData(sheetName){
  var allDataByBrand = getAllDataByBrand(sheetName);
  var result = [];
 
  Object.keys(allDataByBrand).forEach(function(brandName){
    if (allDataByBrand[brandName].length === 1) {      // ブランドのデータが１件のもの
      result.push(allDataByBrand[brandName])
    } else if (allDataByBrand[brandName].length > 1) { // ブランドのデータが複数件のもの
      // １ヶ月に複数タイトル出すメーカーはそんなに居ないため一番上のデータのみを対象とする（かなりの妥協 - 雰囲気でデータを入れるようにする）
      // 声優名のないタイトルはリメイクや特別版などの可能性があるため声優名のないデータでおこなう（まれに声優情報を公開していないものもあるがそれは対象外とする）
      var title1 = allDataByBrand[brandName][0][Columns.ArrayValue(Columns.Title)];
      var title2 = allDataByBrand[brandName][1][Columns.ArrayValue(Columns.Title)];
      var duplicatesTitle = duplicatesString(title1, title2);
      
      allDataByBrand[brandName][0][Columns.ArrayValue(Columns.Title)] = duplicatesTitle;
      result.push(allDataByBrand[brandName][0]);
    }
  });
  
  return result;
}
