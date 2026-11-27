const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "all",
    version: "1.3",
    author: "NTKhang",
    countDown: 5,
    role: 1,
    description: {
      en: "Tag all members in your group chat"
    },
    category: "box chat",
    guide: {
      en: " {pn} [content | empty]"
    }
  },

  onStart: async function ({ message, event, args }) {
    const { participantIDs } = event;
    const text = args.join(" ") || "Hey Everyone! 👀";

    // Mention er jonno body banano
    let body = text + "\n\n";
    const mentions = [];

    for (const uid of participantIDs) {
      const fromIndex = body.length;
      body += "@";
      mentions.push({
        tag: "@",
        id: uid,
        fromIndex: fromIndex
      });
    }

    body += "\n\n👥 Sobai ekto attention dao!";

    try {
      const cacheDir = path.join(__dirname, "cache");
      const imgPath = path.join(cacheDir, "all.jpg");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const imgLink = "https://files.catbox.moe/qzsxe2.jpeg";
      const res = await axios.get(imgLink, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, Buffer.from(res.data));

      // message.reply diye mention + photo - eitai kaj korbe
      await message.reply({
        body: body,
        mentions: mentions,
        attachment: fs.createReadStream(imgPath)
      });
      fs.unlinkSync(imgPath);
    } catch (e) {
      console.log("ALL ERROR:", e.message);
      // Photo na asleo mention jabe
      await message.reply({ body, mentions });
    }
  }
};
