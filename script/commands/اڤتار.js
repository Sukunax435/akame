const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: 'افتار',
  version: '1.0.0',
  hasPermission: 0,
  credits: 'August Quinn',
  description: 'تصميم صور رمزية لربوتات',
  commandCategory: 'الذكاء الإصطناعي',
  usePrefix: false,
  usages: '/أڤتار_روبوت [نص]',
  cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const text = args.join(' ');
    const apiUrl = `https://robohash.org/${encodeURIComponent(text)}.png`;

    api.sendMessage('إنشاء صورة رمزية للروبوت. انتظر من فضلك...', event.threadID, event.messageID);

    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    if (response.status === 200 && response.data) {
      const pathToAvatar = path.join(__dirname, 'cache', 'robohash.png');
      fs.writeFileSync(pathToAvatar, Buffer.from(response.data, 'binary'));

      api.sendMessage({
        body: 'هذه هي النتيجة:',
        attachment: fs.createReadStream(pathToAvatar),
      }, event.threadID, () => fs.unlinkSync(pathToAvatar));
    } else {
      api.sendMessage('فشل في إنشاء الصورة الرمزية للروبوت.', event.threadID, eventMessageID);
    }
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage('حدث خطأ أثناء إنشاء الصورة الرمزية للروبوت.', event.threadID, eventMessageID);
  }
};