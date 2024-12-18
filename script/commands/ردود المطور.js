module.exports.config = {
  name: "ردود_البوت_خاصة_بالأدمن",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Jasper",
  description: "البوت سوف يرد إذا تم ذكر المالك أو البوت عن طريق المنشن ",
  commandCategory: "أخرى",
  usages: "",
  usePrefix:false,
  cooldowns: 1
};
module.exports.handleEvent = function({ api, event }) {
  if (event.senderID !== "61550232547706") {
    var aid = ["61550232547706"];
    for (const id of aid) {
    if ( Object.keys(event.mentions) == id) {
      var msg = ["توقف عن عمل منشن لمطوري، فهو مشغول 😗", "مطوري غير متصل حاليا 😢","منشن آخر على مالكي و, سوف أقوم بلكمك على وجهك 🙂","مشغول ألا تفهم 😒","آسف، اكن لان أسمح لأي أحد أن يقوم بإزعاجه 🙄","هل تحب مطوري ولهذا السبب قمت بعمل منشن عليه? لماذا لا ترسل له طلب صداقة  https://www.facebook.com/profile.php?id=61550232547706 😏"," منشن أخرى على مطوري، وسوف أركل مؤخرتك اللعينة"];
      return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
    }
    }}
};
module.exports.run = async function({}) {
}