/*
* method of pronunciation tool
*/
var URL_DEFAULT = "https://api.pearson.com/v2/dictionaries/ldoce5/entries?limit=1&headword=";
var URL_OXFORD_DEFAULT = "https://od-api.oxforddictionaries.com/api/v1/entries/en/";
var app_id = "10b95698";
var app_key = "b106b0098f5ba4be92a7f259021598bf";

var SPLIT_CHARACTER = "  ";
function onClickBtnConvert(thiz) {
  $(thiz).hide();
  var text = $(thiz).parents("div.panel").find("#txtSourceText").val().trim();
  var arrWord = splitWordFromSentence(text);
  var resultTranslate;
  if(arrWord != undefined && arrWord.length > 0){
    resultTranslate = translateArrayWord(arrWord);
  }else{
    alert("Bạn phải nhập nội dung cần dịch");
    $(thiz).show();
    return;
  }
  var panelBritish = $(thiz).parents("div.container").find("#resultBritish");
  var panelAmerican = $(thiz).parents("div.container").find("#resultAmerican");
  // bind value
  if(resultTranslate != undefined && resultTranslate.arrBritish.length >0){
    panelBritish.text(resultTranslate.arrBritish);
  }else{
    panelBritish.text("");
  }
  if(resultTranslate != undefined && resultTranslate.arrAmerican.length >0){
    panelAmerican.text(resultTranslate.arrAmerican);
  }else{
    panelAmerican.text("");
  }
  $(thiz).show();
}

function splitWordFromSentence(sourceText){
  var results=  sourceText.match(/[a-z'\-]+/gi);
  return results;
}

function translateArrayWord(arrWord){
  var strBritish = "";
  var strAmerican = "";
  arrWord.forEach(function (value, i) {
    var item = translateAWord(value);
    strBritish += item.british + SPLIT_CHARACTER;
    strAmerican += item.american + SPLIT_CHARACTER;
  });
  var result = new Object();
  result.arrBritish = strBritish;
  result.arrAmerican = strAmerican;
  return result;
}

function translateAWord(text){
  var urlApi = URL_DEFAULT + text.trim();
  var british = text.trim();
  var american = text.trim();
  var item ;
  $.ajax({async: false,url: urlApi, success: function(result){
        item = parsePronunciation(result,text);
    }});
  if(item == undefined){
    item = new Object();
    item.british = british;
    item.american = american;
  }
  return item;
}

function parsePronunciation(result,source){
  var british = "["+source+"]";
  var american = "["+source+"]";
  if(result.count >0){
    var item = result.results[0];
    if(item.pronunciations != undefined){
      if(item.pronunciations.length > 0){
        british = getFirstWord(item.pronunciations[0].ipa);
        if(item.pronunciations.length > 1){
          american = getFirstWord(item.pronunciations[1].ipa);
        }
      }
    }
  }
  var returnItem = new Object();
  returnItem.british = british;
  returnItem.american = american;
  return returnItem;
}

function getFirstWord(words){
  var item = "";
  if(words != undefined){
    res = words.split(",");
    item = res[0];
  }
  return item;
}
