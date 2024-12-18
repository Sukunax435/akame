module.exports.config = {
    name: "آيدي_الكل",
    version: "1.0.5",
    hasPermssion: 0,
    credits: "Md Rajib",
    description: "احصل على جميع الآيديات والأسماء في المجموعة.",
    usePrefix:true,
    commandCategory: "خدمات",
    cooldowns: 2,
};
module.exports.run = async function ({ api, event, args, Users }) {
  
  function reply(d) {
    api.sendMessage(d, event.threadID, event.messageID)
  }
  var ep = event.participantIDs;
  msg = ""
  msgs = ""
  m = 0;
  for (let i of ep) {
    m += 1;
    const name = await Users.getNameUser(i);
    msg += m+". "+name+"\n\n•┄┅════❁🌺❁════┅┄•\n\nآيدي: "+i+"\nرابط الفيسبوك: https://facebook.com/"+i+"\n\n";
  }
  msgs += "قائمة كل الآيديات في المجموعة.\n\n•┄┅════❁🌺❁════┅┄•\n\n"+msg;
  reply(msgs)
    }