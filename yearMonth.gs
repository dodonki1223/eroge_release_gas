// 検索する対象月の値定数
var targetMonth = {
  LastMonth          : -1,
  NextMonth          : 1,
  CurrentMonth       : 0,
  LastMonthString    : '先月の',
  NextMonthString    : '来月の',
  CurrentMonthString : '今月の'
}

/**
 * 対象の月情報を取得する
 * 来月、今月、先月なのかの情報を取得し返す
 * @param {String} [message] - 文字列（来月の声優名、先月の声優名、声優名の形式）
 * @return {Number} 月情報（-1,0,1）を返す
 */
function getTargetMonth(message) {
  if (message.indexOf(targetMonth.LastMonthString) != -1) {
    return targetMonth.LastMonth
  } else if (message.indexOf(targetMonth.NextMonthString) != -1) {
    return targetMonth.NextMonth;
  } else {
    return targetMonth.CurrentMonth;
  }
}

/**
 * 年月の文字列を返す
 * @param {Number} [addMonth] - ◯ヶ月前、◯ヶ月後の情報
 * @return {String} 日付の文字列 YYYYMMの形式を返す
 */
function getYearMonth(addMonth) {
  var date = new Date();

  // addMonthの内容により◯ヶ月前、◯ヶ月後の情報をセットする
  date.setMonth(date.getMonth() + addMonth);

  // 月は-1で取得されるため、+1する
  var year  = date.getFullYear(), 
      month = date.getMonth() + 1;

  // Logger.log('年月：' + year + ('0' + month).slice(-2));

  // 月が１桁時は前０を付加して年月の文字列を返す
  return year + ('0' + month).slice(-2);
}
