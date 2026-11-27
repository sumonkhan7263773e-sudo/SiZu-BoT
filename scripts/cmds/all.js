const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "all",
    version: "1.2",
    author: "NTKhang",
    countDown: 5,
    role: 1,
    description: {
      vi: "Tag tất cả thành viên trong nhóm chat của bạn",
      en: "Tag all members in your group chat"
    },
    category: "box chat",
    guide: {
      vi: " {pn} [nội dung | để trống]",
      en: " {pn} [content | empty]"
    }
  },

  onStart: async function ({ message, event, args, api }) {
    const { participantIDs } = event;
    const lengthAllUser = participantIDs.length;
    const mentions = [];
    let body = args.join(" ") || "@all";
    let bodyLength = body.length;
    let i = 0;
    for (const uid of participantIDs) {
      let fromIndex = 0;
      if (bodyLength < lengthAllUser) {
        body += body[bodyLength - 1];
        bodyLength++;
      }
      if (body.slice(0, i).lastIndexOf(body[i]) != -1) fromIndex = i;
      mentions.push({ tag: body[i], id: uid, fromIndex });
      i++;
    }

    try {
      const cacheDir = path.join(__dirname, "cache");
      const imgPath = path.join(cacheDir, "all.jpg");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const imgLink = "https://files.catbox.moe/qzsxe2.jpeg";

      const res = await axios.get(imgLink, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, Buffer.from(res.data));

      api.sendMessage(
        {
          body,
          mentions,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    } catch (e) {
      // Photo na asle sudhu mention jabe
      message.reply({ body, mentions });
      console.log("ALL ERROR:", e.message);
    }
  }
};
