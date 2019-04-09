function postCheckTest() {
  var name    = '遥そら',
      sengetu = '先月の' + name,
      raigetu = '来月の' + name;
  var replyToken = '12345';
  var userMessage = name;
  
  // 対象の月を取得する
  var targetMonth = getTargetMonth(userMessage);
  
  // 対象のシートを取得
  var yearMonth = getYearMonth(targetMonth),
      sheet     = getSheet(yearMonth);
  
  // 声優名を取得する
  var voiceActorName = getVoiceActorName(userMessage)
  
  // 声優名から対象のスプレッドシートの行を取得
  var foundRows = getRowsByVoiceActor(sheet, voiceActorName);
  
  // リストページメッセージ確認用
  var year  = yearMonth.slice(0,4),
      month = yearMonth.slice(4);
  Logger.log(createRequest(replyToken, createListPagePostMessage(year, month)));
  
  // 見つかりませんでした確認用
  Logger.log(' ');
  Logger.log(createRequest(replyToken, createNotExistsPostMessage(targetMonth, voiceActorName)));

  // 通常メッセージ確認用
  Logger.log(' ');
  Logger.log(createRequest(replyToken, createPostMessages(sheet, foundRows)));
}
