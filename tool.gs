/**
 * 2つの文字で一致している部分だけを抜き出す
 * @param {String} [string1] - 文字列１
 * @param {String} [string2] - 文字列２
 * @return {String} ２つの文字列が一致している箇所
 */
function duplicatesString(string1, string2) {
  var value1 = string1.split("");
  var value2 = string2.split("");
  var result = "";
  
  value1.some(function(value, index){
    if (value != value2[index]) return true;
    result = result + value;
  });

  return result.replace(" ", "").replace("　", "");
}

// duplicatesStringメソッドのテスト用
function TestDuplicatesString(){
  var string1 = "あまいろショコラータ げっちゅ屋限定版WスウェードB2タペストリー付＜早期予約キャンペーン特典付き＞　";
  var string2 = "あまいろショコラータ しらたま描き下ろし抱き枕カバー付き限定版 げっちゅ屋限定版WスウェードB2タペストリー付＜早期予約キャンペーン特典付き＞　";
  Logger.log("結果が「あまいろショコラータ」であること：" + duplicatesString(string1, string2));
  
  string1 = "あかさたなはまやらわ";
  string2 = "かきくけこさしすせそ";
  
  Logger.log("結果が「」であること：" + duplicatesString(string1, string2));
}
