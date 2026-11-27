const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "all",
    version: "1.4",
    author: "NTKhang",
    countDown: 5,
    role: 1,
    description: { en: "Tag all members" },
    category: "box chat",
    guide: { en: "{pn} [content]" }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const { participantIDs } = event;
    const text = args.join(" ") || "Hey Everyone! 👀";

    let body = text + "\n\n";
    const mentions = [];

    // Prottek jon er nam diye mention
    for (const uid of participantIDs) {
      try {
        const name = await usersData.getName(uid) || "Member";
        const fromIndex = body.length;
        body += `@${name} `;
        mentions.push({
          tag: `@${name}`,
          id: uid,
          fromIndex: fromIndex
        });
      } catch (e) {}
    }

    body += "\n\n👥 Sobai asho!";

    try {
      const cacheDir = path.join(__dirname, "cache");
      const imgPath = path.join(cacheDir, "all.jpg");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const res = await axios.get("https://files.catbox.moe/qzsxe2.jpeg", { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, Buffer.from(res.data));

      await message.reply({
        body: body,
        mentions: mentions,
        attachment: fs.createReadStream(imgPath)
      });
      fs.unlinkSync(imgPath);
    } catch (e) {
      console.log("ALL ERROR:", e.message);
      await message.reply({ body, mentions });
    }
  }
};
