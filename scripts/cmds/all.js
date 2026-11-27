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
    const text = args.join(" ") || "Hey Everyone! 👀";
    
    // Body ta age banai, tarpor prottek member er jonno 1 ta kore char rakhbo
    let body = text + "\n";
    const mentions = [];
    
    // Prottek member er jonno alada position
    for (let i = 0; i < participantIDs.length; i++) {
      const uid = participantIDs[i];
      const fromIndex = body.length;
      body += "•"; // 1 ta char = 1 ta mention
      mentions.push({ tag: "•", id: uid, fromIndex });
    }

    body += "\n\n👥 Sobai ke mention dewa hoise!";

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
      message.reply({ body, mentions });
      console.log("ALL ERROR:", e.message);
    }
  }
};
