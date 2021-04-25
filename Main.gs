// masukkan token bot yang di dapat dari botfather
var token = "TOKEN_BOT";

var tg = new telegram.daftar(token);
var user = new telegram.user();
var tgl_mulai = 13;
var bln_mulai = "April";
var tgl_masehi = [13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,1,2,3,4,5,6,7,8,9,10,11,12];

function initDb(chat_id, message_ids) {
  var db = {message_id:message_ids};
  var data = [];
  for (var i = 1; i <= 30; i++) {
    data[i - 1] = 0;
  }
  db["data"] = data;
  user.setValue(chat_id, JSON.stringify(db));
}

//berfungsi untuk menangkap request http/s GET
function doGet(e) {

  //membuat output HTML yang akan ditampilkan ke klien
  return HtmlService.createHtmlOutput("<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Belajar Telegram Bot</title></head><body><center>Hai, Apakabar?</center></body></html>");

}

//berfungsi untuk menangkap request http/s POST
function doPost(e) {

  try {
    //jika type post data adalah 'application/json'
    if (e.postData.type == "application/json") {

      //parse isi konten data post ke JSON array
      var updates = JSON.parse(e.postData.contents);

      //jika update ada key message
      if (updates.message) {

        //simpan variable msg dari update.message untuk dipakai lagi dibawahnya agar tidak mengambilnya dari array update
        var msg = updates.message;
        var text = msg.text;
        var chat_id = msg.chat.id;
        var message_id = msg.message_id;

        if (text == "/start") {
          var pesan = "";
          var db = user.getValue(chat_id.toString());
          if (db == null) {
            pesan = "Data anda masih kosong, silakan mulai diisi.";
            initDb(chat_id.toString(), message_id.toString());
          } else {
            var jdb = JSON.parse(db);
            var jmlpuasa = 0;
            var jmltdkpuasa = 0;
            if (jdb["data"]) {
              for (var i in jdb["data"]) {
                if (jdb["data"][i] == 1) {
                  jmlpuasa++;
                } else if (jdb["data"][i] == -1) {
                  jmltdkpuasa++;
                }
              }
            }
            pesan = "Data 1 ~ 30 Ramadhan 1442H\n";
            pesan += "\nPuasa : " + jmlpuasa.toString();
            pesan += "\nTidak Puasa : " + jmltdkpuasa.toString();
            pesan += "\nTotal : " + (jmlpuasa + jmltdkpuasa).toString();
          }
          var keyboard = {
            "inline_keyboard": [
              [{text:"Data", callback_data:"nav_-9_0"}]
            ]
          }
          tg.sendMessage(String(chat_id), pesan, "HTML", true, false, null, keyboard);
        }
      } else if (updates.callback_query) {
        var query = updates.callback_query;
        var message_id = query.message.message_id;
        var chat_id = query.message.chat.id;
        var data = query.data;

        if (data == "home") {
          var pesan = "";
          var db = user.getValue(chat_id.toString());
          if (db == null) {
            pesan = "Data anda masih kosong, silakan mulai diisi.";
            initDb(chat_id.toString(), message_id.toString());
          } else {
            var jdb = JSON.parse(db);
            var jmlpuasa = 0;
            var jmltdkpuasa = 0;
            if (jdb["data"]) {
              for (var i in jdb["data"]) {
                if (jdb["data"][i] == 1) {
                  jmlpuasa++;
                } else if (jdb["data"][i] == -1) {
                  jmltdkpuasa++;
                }
              }
            }
            pesan = "Data 1 ~ 30 Ramadhan 1442H\n";
            pesan += "\nPuasa : " + jmlpuasa.toString();
            pesan += "\nTidak Puasa : " + jmltdkpuasa.toString();
            pesan += "\nTotal : " + (jmlpuasa + jmltdkpuasa).toString();
          }
          var keyboard = {
            "inline_keyboard": [
              [{text:"Data", callback_data:"nav_-9_0"}]
            ]
          }
          tg.request('editMessageText', tg.buildQuery({
            'chat_id': chat_id,
            'message_id': message_id,
            'text': pesan,
            'reply_markup': keyboard
          }));
        } else if (data.includes("data_")) {
          var index = parseInt(data.split("_")[1]);
          var cur_index = index;
          if (index >= 21) {
            cur_index = index - 21;
          } else if (index >= 11) {
            cur_index = index - 11;
          } else {
            cur_index = index - 1;
          }
          var keyboard = query.message.reply_markup;
          var db = user.getValue(chat_id.toString());
          var jdb = JSON.parse(db);
          if (jdb != null) {
            if (jdb["data"]) {
              for (var i in jdb["data"]) {
                if (i == index - 1) {
                  var text = keyboard["inline_keyboard"][cur_index][0].text;
                  if (text.split(" ").length == 5) {
                    keyboard["inline_keyboard"][cur_index][0].text = text + " ✅";
                    jdb["data"][i] = 1;
                  } else if (text.split(" ").length == 6 && text.substring(text.length - 1, text.length) == "❎") {
                    keyboard["inline_keyboard"][cur_index][0].text = text.substring(0, text.length - 2) + " ✅";
                    jdb["data"][i] = 1;
                  } else {
                    keyboard["inline_keyboard"][cur_index][0].text = text.substring(0, text.length - 2) + " ❎";
                    jdb["data"][i] = -1;
                  }
                }
              }
            }
          }
          user.setValue(chat_id.toString(), JSON.stringify(jdb));
          tg.request('editMessageText', tg.buildQuery({
            'chat_id': chat_id,
            'message_id': message_id,
            'text': "Update Data",
            'reply_markup': keyboard
          }));
        } else if (data.includes("nav_")) {
          var db = user.getValue(chat_id.toString());
          var jdb = JSON.parse(db);
          if (jdb != null && jdb["data"]) {
            var datas = data.split("_");
            var min = parseInt(datas[1]) + 10;
            var max = parseInt(datas[2]) + 10;
            var keyboards = [];
            for (;min <= max; min++) {
              if (tgl_masehi[min - 1] <= 12) {
                bln_mulai = "Mei";
              }
              if (jdb["data"][min - 1] == 0) {
                keyboards.push([{text:min.toString() + " Ramadhan / " + tgl_masehi[min - 1].toString() + " " + bln_mulai, callback_data:"data_" + min.toString()}]);
              } else if (jdb["data"][min - 1] == 1) {
                keyboards.push([{text:min.toString() + " Ramadhan / " + tgl_masehi[min - 1].toString() + " " + bln_mulai + " ✅", callback_data:"data_" + min.toString()}]);
              } if (jdb["data"][min - 1] == -1) {
                keyboards.push([{text:min.toString() + " Ramadhan / " + tgl_masehi[min - 1].toString() + " " + bln_mulai + " ❎", callback_data:"data_" + min.toString()}]);
              }
            }
            if (max == 30) {
              keyboards.push([{text:"<<", callback_data:"nav_1_10"}]);
            } else if (max == 10) {
              keyboards.push([{text:">>", callback_data:"nav_1_10"}]);
            } else {
              keyboards.push([{text:"<<", callback_data:"nav_-9_0"},{text:">>", callback_data:"nav_11_20"}]);
            }
            keyboards.push([{text:"Home", callback_data:"home"}]);
            var keyboard = {
              "inline_keyboard":keyboards
            }
            tg.request('editMessageText', tg.buildQuery({
              'chat_id': chat_id,
              'message_id': message_id,
              'text': (min - 10).toString() + " ~ " + max.toString() + " Ramadhan",
              'reply_markup': keyboard
            }));
          }
        }
      }
    }
  } catch (e) {
    //tg.sendMessage("ID", JSON.stringify(e.message));
  }
}

function setWebHookDeploy() {
  var url_deploy = "URL_DEPLOY";
  var result = tg.request('setWebhook', tg.buildQuery({
    'url': url_deploy
  }));
  Logger.log(result);
}
