 const num = 10
 const timee = 20 // During `timee` spam `num` times will be banned
 module.exports.config = {
  name: "حظر_الدردشة",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "NTKhang", //fix get by  D-Jukie translated to en by Deku
  description: `حظر المستخدمين تلقائيًا في حالة وجود دردشات غير مرغوب فيها ${num} من الوقت/${timee}ثانية`,
   usePrefix:true,
  commandCategory: "النظام",
  cooldowns: 5
};

module.exports. run = async function ({api, event})  {
  return api.sendMessage(`حظر المستخدمين تلقائيا إذا كان هناك البريد العشوائي أكثر من ${num} مرات/ في ظرف ${timee}ثانية`, event.threadID, event.messageID);
};

module.exports.handleEvent = async function ({ Users, Threads, api, event})  {
  let { senderID, messageID, threadID } = event;
  var datathread = (await Threads.getData(event.threadID)).threadInfo;
  
  if (!global.client.autoban) global.client.autoban = {};
  
  if (!global.client.autoban[senderID]) {
    global.client.autoban[senderID] = {
      timeStart: Date.now(),
      number: 0
    }
  };
  
  const threadSetting = global.data.threadData.get(threadID) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  if (!event.body || event.body != 0) return;
  
  if ((global.client.autoban[senderID].timeStart + (timee*1000)) <= Date.now()) {
    global.client.autoban[senderID] = {
      timeStart: Date.now(),
      number: 0
    }
  }
  else {
    global.client.autoban[senderID].number++;
    if (global.client.autoban[senderID].number >= num) {
      var namethread = datathread.threadName;
      const moment = require("moment-timezone");
      const timeDate = moment.tz("Africa/Casablanca").format("DD/MM/YYYY HH:mm:ss");
      let dataUser = await Users.getData(senderID) || {};
      let data = dataUser.data || {}; 
      if (data && data.banned == true) return;
      data.banned = true;
      data.reason = `الدردشة غير المرغوب فيها ${num} مرة` || null;
      data.dateAdded = timeDate;
      await Users.setData(senderID, { data });
      global.data.userBanned.set(senderID, { reason: data.reason, dateAdded: data.dateAdded });
      global.client.autoban[senderID] = {
        timeStart: Date.now(),
        number: 0
      };
      api.sendMessage("⚠️لقد تم منعك من استخدام البوت\nآيدي: " + senderID + " \nالإسم: " + dataUser.name + `\nالسبب: دردشة غير مرغوب فيها ${num} مرة ${timee}s\n\nاتصل بالمسؤول لإلغاء الحظر على الفور`, threadID,
    () => {
    var idad = global.config.ADMINBOT;
    for(let ad of idad) {
        api.sendMessage(`مجرمي البريد العشوائي ${num} مرة/${timee}s\nالإسم: ${dataUser.name} \آيدي المرسل: ${senderID}\nآيدي المجموعة: ${threadID} \nإسم المجموعة: ${namethread} \nعلى الوقت: ${timeDate}`, 
          ad);
    }
    })
    }
  }
};

  