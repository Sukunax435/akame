module.exports.config = {
  name: 'راندر',
  version: '1.1.1',
  hasPermssion: 0,
  credits: 'Black Amex',
  description: 'الصور',
  commandCategory: 'خدمات',
  usages: 'قم بالرد على الصورة التي تريد إزالة الخلفية منها',
  usePrefix:true,
  cooldowns: 2,
  dependencies: {
       'form-data': '',
       'image-downloader': ''
    }
};

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const {image} = require('image-downloader');
module.exports.run = async function({
    api, event, args
}){
    try {
        if (event.type !== "message_reply") return api.sendMessage("🖼️ | يجب عليك الرد على الصورة التي تريد إزالة الخلفية منها ", event.threadID, event.messageID); api.sendMessage("🖼 | جاري إزالة صورة الخلفية التي تقدمها. انتظر من فضلك....", event.threadID, event.messageID);
        if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("✅ | تمت إزالة الخلفية بنجاح ", event.threadID, event.messageID);
        if (event.messageReply.attachments[0].type != "photo") return api.sendMessage("❌ | هذه الوسائط غير متوفرة", event.threadID, event.messageID);

        const content = (event.type == "message_reply") ? event.messageReply.attachments[0].url : args.join(" ");
        const MtxApi = ["ToQX2FRYSXjWGSvmL5vNCzvT"]
        const inputPath = path.resolve(__dirname, 'cache', `photo.png`);
         await image({
        url: content, dest: inputPath
    });
        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));
        axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            responseType: 'arraybuffer',
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': MtxApi[Math.floor(Math.random() * MtxApi.length)],
            },
            encoding: null
        })
            .then((response) => {
                if (response.status != 200) return console.error('Error:', response.status, response.statusText);
                fs.writeFileSync(inputPath, response.data);
                return api.sendMessage({ attachment: fs.createReadStream(inputPath) }, event.threadID, () => fs.unlinkSync(inputPath));
            })
            .catch((error) => {
                return console.error('فشل أمر إزالة_الخلفية api', error);
            });
     } catch (e) {
        console.log(e)
        return api.sendMessage(`خطأ في إزالة_الخلفية من API`, event.threadID, event.messageID);
  }
    }