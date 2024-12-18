module.exports.config = {
  name: "تخيل",
  version: "1.0",
  hasPermssion: 0,
  credits: "عمر",
  description: "يولد صورة تخيلية بناءً على النص المدخل",
  commandCategory: "الــتــرفــيــه والــالــعــاب",
  usages: "اكتب نص التخيل",
  cooldowns: 2,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require("axios");
  const fs = require("fs-extra");
  let { threadID, messageID } = event;
  let query = args.join(" ");

  if (!query) {
    return api.sendMessage("الرجاء كتابة نص التخيل بعد الأمر.", threadID, messageID);
  }

  api.setMessageReaction("⏱️", event.messageID, (err) => {}, true); // Add wait reaction

  try {
    // ترجمة النص إلى الإنجليزية
    const translationResponse = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(query)}`
    );
    const translation = translationResponse.data[0][0][0];

    // استدعاء API للحصول على الصورة
    const response = await axios.get(
      `https://nash-api.onrender.com/api/bb-image-gen?query=${encodeURIComponent(translation)}`
    );
    const imageUrl = response.data.imageUrl;

    let path = `${__dirname}/cache/imagination.png`;

    // تنزيل الصورة
    const image = (await axios.get(imageUrl, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(path, Buffer.from(image, "utf-8"));

    // إرسال الصورة
    api.sendMessage(
      {
        body: "◆❯━━━━━▣✦▣━━━━━━❮◆\n✅ | تـفـضـل تـخـيـلـك:\n◆❯━━━━━▣✦▣━━━━━━❮◆",
        attachment: fs.createReadStream(path),
      },
      threadID,
      () => {
        fs.unlinkSync(path);
        api.setMessageReaction("✅", event.messageID, (err) => {}, true); // Success reaction
      },
      messageID
    );
  } catch (error) {
    api.sendMessage("⚠️ | حدث خطأ أثناء معالجة الطلب. يرجى المحاولة لاحقاً.", threadID, messageID);
  }
};