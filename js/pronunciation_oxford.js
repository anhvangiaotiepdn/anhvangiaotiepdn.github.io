/*
* method of pronunciation tool
*/
var URL_DEFAULT = "https://api.pearson.com/v2/dictionaries/ldoce5/entries?limit=1&headword=";
var URL_OXFORD_DEFAULT = "https://od-api.oxforddictionaries.com/api/v1/entries/en/";
var app_id = "10b95698";
var app_key = "b106b0098f5ba4be92a7f259021598bf";

var SPLIT_CHARACTER = "  ";
function onClickBtnConvert2(thiz) {
  var text = $(thiz).parents("div.panel").find("#txtSourceText").val().trim();
  var arrWord = splitWordFromSentence(text);
  var resultTranslate;
  if(arrWord != undefined && arrWord.length > 0){
    resultTranslate = translateArrayWord(arrWord);
  }else{
    alert("Bạn phải nhập nội dung cần dịch");
    return;
  }
  var panelBritish = $(thiz).parents("div.container").find("#resultBritish");
  // bind value
  if(resultTranslate != undefined && resultTranslate.arrBritish.length >0){
    panelBritish.text(resultTranslate.arrBritish);
  }else{
    panelBritish.text("");
  }
}

var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://od-api.oxforddictionaries.com/api/v1/entries/en/hello",
  "method": "GET",
  "headers": {
    "app_id": "10b95698",
    "app_key": "b106b0098f5ba4be92a7f259021598bf",
    "cache-control": "no-cache",
    "postman-token": "9c0a53b2-fcea-19d5-6886-01e167481b48"
  }
}



function onClickBtnConvert(thiz) {
  $.ajax(settings).done(function (response) {
    console.log(response);
  });
}

function splitWordFromSentence(sourceText){
  var results=  sourceText.match(/[a-z'\-]+/gi);
  return results;
}

function translateArrayWord(arrWord){
  var strBritish = "";
  arrWord.forEach(function (value, i) {
    var item = translateAWord(value);
    strBritish += item.british + SPLIT_CHARACTER;
  });
  var result = new Object();
  result.arrBritish = strBritish;
  return result;
}

function logResults(json){
  console.log(json);
}

function translateAWord(text){
  var urlApi = URL_OXFORD_DEFAULT + text.trim();
  var british = text.trim();
  var item ;
  var contentType ="application/x-www-form-urlencoded; charset=utf-8";
  if(window.XDomainRequest) //for IE8,IE9
    contentType = "text/plain";
  $.get({async: false,url: urlApi,
      type:"GET",
      headers: {
        'app_id':app_id,
        'app_key':app_key,
        'Access-Control-Allow-Origin' : '*'
      },
      //dataType:"json",
      crossDomain: true,
      dataType: 'jsonp',
      //contentType:contentType,
      //success: function(result){
        //item = parsePronunciation(result,text);
  //  }
    jsonpCallback: "logResults"
  });
  if(item == undefined){
    item = new Object();
    item.british = british;
  }
  return item;
}

function parsePronunciation(result,source){
  var british = source;
  british = result.results[0].lexicalEntries[result.results[0].lexicalEntries.length -1].pronunciations[0].phoneticSpelling;
  var returnItem = new Object();
  returnItem.british = british;
  return returnItem;
}
