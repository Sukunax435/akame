const axios = require('axios');

module.exports.config = {
  name: 'ميراي',
  version: '1.0.0',
  hasPermission: 0,
  credits: 'August Quinn',
  description: 'قم بالحصول على الأجوبة من ميراي',
  commandCategory: 'الذكاء الإصطناعي',
  usages: 'ميراي [سؤالك]',
  usePrefix:false,
  cooldowns: 5,
};

module.exports.run = async function ({ api, event }) {
  try {
    const apiUrl = 'https://gptgo.august-api.repl.co/response';
    const response = await axios.get(apiUrl);

    if (response.data) {
      api.sendMessage(response.data, event.threadID, event.messageID);
    } else {
      api.sendMessage('فشل جلب الاستجابة من Gptgo API.', event.threadID, event.messageID);
    }
  } catch (error) {
    console.error('خطأ في أمر Gptgo:', error);
    api.sendMessage('حدث خطأ. الرجاء معاودة المحاولة في وقت لاحق.', event.threadID, event.messageID);
  }
};
                      