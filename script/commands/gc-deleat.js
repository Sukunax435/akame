module.exports.config = {
	name: "👍",
	version: "1.0.0", 
	hasPermssion: 1,
  credits: "S H A D O W",
	description: "حذف رسائل البوت",
  commandCategory: "الــــجـــروب", 
	usages: "", 
	cooldowns: 0,
	dependencies: [] 
};

module.exports.run = async function({ api, event, args, Users }) {
	if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage(getText('unsendErr1'), event.threadID, event.messageID);
			if (event.type != "message_reply") return api.sendMessage(getText('unsendErr2'), event.threadID, event.messageID);
			return api.unsendMessage(event.messageReply.messageID, err => (err) ? api.sendMessage(getText('error'), event.threadID, event.messageID) : '');
		}
