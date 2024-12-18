const fs = require("fs");
const moment = require("moment-timezone");

module.exports.config = {
    name: "مضاد",
    version: "1.2.0",
    hasPermssion: 2,
    credits: "JOHN RÉ PORAS",
    description: "منع المستخدمين من إضافة بوت إلى مجموعات أخرى دون موافقة.",
    usePrefix: true,
    commandCategory: "النظام",
    cooldowns: 0
};

module.exports.handleEvent = async function({ api, event }) {
    if (event.type === "thread-add" && event.author) {
        const authorID = event.author;
        const threadID = event.threadID;
        const botAdmins = getBotAdmins();
        const botOwnerID = botAdmins[0]; 

        if (botAdmins.includes(authorID)) {
            return;
        }

        api.sendMessage("أنت ليس لديك الإذن لكي تقوم بإضافتي إلى هذه المجموعة.", authorID);

        const threadInfo = await api.getThreadInfo(threadID);
        const threadName = threadInfo.threadName || "هذه المجموعة";
        const timestamp = moment.tz("Africa/Casablanca").format("YYYY-MM-DD HH:mm:ss");
        const adminMessage = `${event.senderID} يحاول إضافتي إلى مجموعة ${threadName} في ${timestamp}.`;
        api.sendMessage(adminMessage, botOwnerID);
    }
};

function getBotAdmins() {
    try {
        const data = fs.readFileSync(__dirname + "/system/bot_admins.json", "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
  }
  