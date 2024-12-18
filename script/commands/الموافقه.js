module.exports.config = {
  name: "موافقة",
  version: "1.0.2",
  hasPermssion: 2,
  credits: "DungUwU",
  description: "الموافقة على قائمة/حذف/الإنتظار",
  commandCategory: "المجموعة",
  usePrefix: true,
  cooldowns: 5
};


const dataPath = __dirname + "/cache/approvedThreads.json";
const pendingPath = __dirname + "/cache/pendingThreads.json";
const fs = require("fs");

module.exports.onLoad = () => {
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));
  if (!fs.existsSync(pendingPath)) fs.writeFileSync(pendingPath, JSON.stringify([]));
}

module.exports.run = async ({ event, api, args }) => {
  const { threadID, messageID, senderID } = event;
  let data = JSON.parse(fs.readFileSync(dataPath));
  let pending = JSON.parse(fs.readFileSync(pendingPath));
  let msg = "";
  let idBox = (args[0]) ? args[0] : threadID;
  if (args[0] == "قائمة") {
    msg = "قائمة المجموعات الموافقة عليهم! ";
    let count = 0;
    for (e of data) {
      msg += `\${count += 1}. آيدي: ${e}`;
    }
    api.sendMessage(msg, threadID, messageID);
  }
  else if (args[0] == "حذف") {
    idBox = (args[1]) ? args[1] : event.threadID;
    if (isNaN(parseInt(idBox))) return api.sendMessage("ليس رقما.", threadID, messageID);
    if (!data.includes(idBox)) return api.sendMessage("المجموعة لم تتم الموافقة عليها أرجوك أكتب ®طلب", threadID, messageID);
    api.sendMessage(`⚠️ مجموعة ${idBox} تمت إزالة مجموعتك من قائمة أذونات الروبوت ويحتاج إلى موافقة المسؤول مرة أخرى⛔ `, threadID, () => {
      if (!pending.includes(idBox)) pending.push(idBox);
      data.splice(data.indexOf(idBox), 1);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));
    }, messageID)
  }
  else if (args[0] == "الإنتظار") {
    msg = "قائمة المجموعات التي تنتظر موافقتك!";
    let count = 0;
    for (e of pending) {
      let name = (await api.getThreadInfo(e)).name || "Group Chat";
      msg += `\${count += 1}. ${name}\آيدي: ${e}`;
    }
    api.sendMessage(msg, threadID, messageID);
  }
  else if (isNaN(parseInt(idBox))) api.sendMessage("الآيدي اللذي أدخلته غير صالح ", threadID, messageID);
  else if (data.includes(idBox)) api.sendMessage(`آيدي المجموعة ${idBox} تم الموافقة عليها في تقدم! `, threadID, messageID);
  else api.sendMessage("» ⚠️المجموعة تم الموافقة عليها من طرف المسؤول.\إستخدم مساعدة من أجل رؤية كافة الأوامر☑", idBox, (error, info) => {
    if (error) return api.sendMessage("حدث خطأ في التأكد من صحة الآيدي الذي أدخلته ولن يكون بذالك البوت موجود في المجموعة! ", threadID, messageID);
    else {
      data.push(idBox);
      pending.splice(pending.indexOf(idBox), 1);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));
      api.sendMessage(`» ✅تم بنجاح/الموافقة على المجموعة:\${آيدي المجموعة}\إستمتع بإستخدام البوت ☑`, threadID, messageID);
    }
  });
  }