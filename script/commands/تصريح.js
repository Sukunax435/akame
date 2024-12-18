module.exports.config = {
  name: "ترخيص",
  version: "1.0.2",
  hasPermssion: 2,
  credits: "𝒚𝒐𝒅𝒂 𝒕𝒂𝒌𝒂𝒉𝒂𝒔𝒉𝒊",
  description: "الموافقه",
  commandCategory: "المطور",
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
  if (args[0] == "القاءمه") {
    msg = "قاءمه المجموعات! ";
    let count = 0;
    for (e of data) {
      msg += `\n${count += 1}. ID: ${e}`;
    }
    api.sendMessage(msg, threadID, messageID);
  }
  else if (args[0] == "مسح") {
    idBox = (args[1]) ? args[1] : event.threadID;
    if (isNaN(parseInt(idBox))) return api.sendMessage("ليس رقما.", threadID, messageID);
    if (!data.includes(idBox)) return api.sendMessage("الصندوق لم تتم الموافقة عليه من قبل! طلب استخدام [prefix]", threadID, messageID);
    api.sendMessage(` ${idBox} تمت ازاله المجموعه من قاءمه مجموعات البوت ويجب اعاده موافقه المطور `, threadID, () => {
      if (!pending.includes(idBox)) pending.push(idBox);
      data.splice(data.indexOf(idBox), 1);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));
    }, messageID)
  }
  else if (args[0] == "المعلقه") {
    msg = "قاءمه المجموعات المعلقه!";
    let count = 0;
    for (e of pending) {
      let name = (await api.getThreadInfo(e)).name || "Group Chat";
      msg += `\n${count += 1}. ${name}\nID: ${e}`;
    }
    api.sendMessage(msg, threadID, messageID);
  }
  else if (isNaN(parseInt(idBox))) api.sendMessage("المعرف غير صحيح", threadID, messageID);
  else if (data.includes(idBox)) api.sendMessage(`المجموعه ${idBox} تمت الموافقه عليها بنجاح ! `, threadID, messageID);
  else api.sendMessage(`اتيت 𝒚𝒐𝒅𝒂 𝒕𝒂𝒌𝒂𝒉𝒂𝒔𝒉𝒊`, idBox, (error, info) => {
    if (error) return api.sendMessage("حدث خطأ ، تأكد من أن المعرف الذي أدخلته صالح وأنني موجوده في المجموعه! ", threadID, messageID);
    else {
      data.push(idBox);
      pending.splice(pending.indexOf(idBox), 1);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));
      api.sendMessage(`» تمت الموافقه بنجاح 👀\n${idBox}\n\n°•𓆩🤍𓆪•°°•𓆩🤍𓆪•°°•𓆩𝒚𝒐𝒅𝒂 𝒕𝒂𝒌𝒂𝒉𝒂𝒔𝒉𝒊𓆪•°`, threadID, messageID);
    }
  });
         }