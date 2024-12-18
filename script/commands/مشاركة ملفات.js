const axios = require("axios");
const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");
const moment = require("moment-timezone");
const { PasteClient } = require("pastebin-api");
const { join, resolve } = require("path");

const axiosClient = axios.create();
axiosClient.defaults.timeout = 10000;

module.exports.config = {
  name: "مشاركة",
  version: "2.6",
  hasPermission: 0,
  credits: "Arjhil",
  description: "( يقوم بمشاركة ملف من الأوامر )",
  usePrefix: true,
  commandCategory: "المالك",
  usages: "( قم بمشاركة ملف في الخاص )",
  cooldowns: 0,
  dependencies: {
    "pastebin-api": "",
    cheerio: "",
    request: ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  const permission = ["61550232547706", "61550232547706"];
  if (!permission.includes(event.senderID)) {
    return api.sendMessage(
      "‼️ عذرا أنت لست صائد الأرواح..",
      event.threadID,
      event.messageID
    );
  }

  const picture = (
    await axios.get(
      "https://drive.google.com/uc?export=download&id=1rKtZI_KT-vT_DvDRDhhdtZ-nCEGWbx2U",
      { responseType: "stream" }
    )
  ).data;

  const hmm = moment.tz("Africa/Casablanca").format("DD/MM/YYYY || HH:mm:ss");
  const { senderID, threadID, messageID, messageReply, type } = event;
  var name = args[0];

  var uid, text;

  if (type == "message_reply") {
    text = messageReply.body;
    uid = event.messageReply.senderID;
  } else {
    uid = event.senderID;
  }

  if (!text && !name) {
    return api.sendMessage(
      { body: `الوقت: ${hmm} `, attachment: picture },
      threadID,
      messageID
    );
  }

  var data = fs.readFile(
    `./YumiModules/commands/${args[0]}.js`,
    "utf-8",
    async (err, data) => {
      if (err) {
        return api.sendMessage(
          { body: `الوقت: ${hmm}\n\n😿 آسفة, الملف '${args[0]}' لا يوجد أرجوك قم بإعادة المحاولة لاحقا.`, attachment: picture },
          threadID,
          messageID
        );
      }

      const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb");

      async function createPaste(name) {
        const url = await client.createPaste({
          code: data,
          expireDate: "N",
          format: "javascript",
          name: name,
          publicity: 1
        });

        var id = url.split("/")[3];
        return "https://pastebin.com/raw/" + id;
      }

      var link = await createPaste(args[1] || "noname");

      const threadInfo = await api.getThreadInfo(event.threadID);
      const groupName = threadInfo.name;
      const senderName = global.data.userName.get(event.senderID);

      api.sendMessage(
        `➤ مشاركة ملف\n\nالإسم: ${groupName}\nالوقت: ${hmm}\nإسم الملف: ${args.join(
          " "
        )}\nتم الإرسال من طرف: ${senderName} `,
        threadID,
        messageID
      );

      api.sendMessage(
        {
          body: `➤ مشاركة الملفات\n\nالوقت: ${hmm}\nرابط الملف: ${link}\nإسم الملف: ${args[0]}\nإسم المجموعة: ${groupName}\nتمت المشاركه من طرف: ${senderName}`,
          attachment: picture
        },
        uid
      );
    }
  );
};