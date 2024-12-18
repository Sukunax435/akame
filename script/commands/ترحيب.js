module.exports.config = {
    name: "ترحيب",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "عمر",
    description: " تشغيل او يقاف رسالة لترحيب ",
    commandCategory: "مسؤولي المجموعات",
    usages: "اهلا بك في عزيزي انت الان عضو في هذه العائله اتمني ان تحترم القواعد كي لا تطرد يا عسل ان كنت تريد المساعدة في شئ فلا تتردد عزيزي انا هنا من اجلك ✨🕊🥰",
    cooldowns: 2
};

module.exports.languages = {
  "vi": {"on": "Bật","off": "Tắt","successText": "gửi tin nhắn chào mừng khi có thành viên mới tham gia nhóm chat của bạn",},
  "en": {"on": "تم تفعيل","off": "تم ايقاف","اهلا بك عزيزي نورت المجموعه بنور مطوري طبعاً 🥰✨": "رسالة الترحيب عند انضمام عضو جديد",}
}

module.exports.run = async function ({ api, event, Threads, getText }) {
  const { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;

  if (typeof data["joinNoti"] == "undefined" || data["joinNoti"] == true) data["joinNoti"] = false;
  else data["joinNoti"] = true;

  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);
  return api.sendMessage(`${(data["joinNoti"] == false) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
}