const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "intro",
    aliases: ["about", "botinfo"],
    version: "1.1",
    author: "Sumon",
    shortDescription: "Sizuka Minamoto Introduction",
    longDescription: "Shows bot introduction",
    category: "info",
    guide: "{pn}intro"
  },

  onStart: async function ({ api, event }) {
    const intro = ` ╔════════════════════╗
🌸 𝗦𝗜𝗭𝗨𝗞𝗔 𝗠𝗜𝗡𝗔𝗠𝗢𝗧𝗢 🌸
╚════════════════════╝
╭━━━━━━━━━━━━━━━━━━╮
💠 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡
╰━━━━━━━━━━━━━━━━━━╯
➤ 👑 𝗡𝗔𝗠𝗘 : 𝗦𝗶𝘇𝘂𝗸𝗮 𝗠𝗶𝗻𝗮𝗺𝗼𝘁𝗼
➤ 🎂 𝗔𝗚𝗘 : 𝟭𝟴
➤ 🎓 𝗖𝗟𝗔𝗦𝗦 : 𝗜𝗻𝘁𝗲𝗿 𝟭𝘀𝘁 𝗬𝗲𝗮𝗿
➤ 💕 𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡𝗦𝗛𝗜𝗣 : 𝗦𝗶𝗻𝗴𝗹𝗲
➤ 🌷 𝗚𝗘𝗡𝗗𝗘𝗥 : 𝗙𝗘𝗠𝗔𝗟𝗘
➤ ⚡ 𝗦𝗧𝗔𝗧𝗨𝗦 : 𝗔𝗟𝗪𝗔𝗬𝗦 𝗥𝗘𝗔𝗗𝗬
╭━━━━━━━━━━━━━━━━━━╮
💗 𝗔𝗕𝗢𝗨𝗧 𝗠𝗘
╰━━━━━━━━━━━━━━━━━━╯
𝗛𝗘𝗟𝗟𝗢 𝗘𝗩𝗘𝗥𝗬𝗢𝗡𝗘! 👋
𝗜 𝗔𝗠 𝗦𝗜𝗭𝗨𝗞𝗔 𝗠𝗜𝗡𝗔𝗠𝗢𝗧𝗢.
𝗬𝗢𝗨𝗥 𝗙𝗥𝗜𝗘𝗡𝗗𝗟𝗬 𝗠𝗘𝗦𝗦𝗘𝗡𝗚𝗘𝗥 𝗕𝗢𝗧.
𝗜 𝗔𝗠 𝗛𝗘𝗥𝗘 𝗧𝗢 𝗠𝗔𝗞𝗘 𝗬𝗢𝗨𝗥 𝗚𝗥𝗢𝗨𝗣 𝗠𝗢𝗥𝗘 𝗙𝗨𝗡 𝗔𝗡𝗗 𝗘𝗡𝗝𝗢𝗬𝗔𝗕𝗟𝗘! 🌸
━━━━━━━━━━━━━━━━━━━━
👑 𝗕𝗢𝗧 𝗠𝗔𝗞𝗘 𝗕𝗬 𝗔𝗛𝗠𝗘𝗗 𝗦𝗨𝗠𝗢𝗡
📱 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝟬𝟭𝟲𝟭𝟱𝟭𝟵𝟳𝟬𝟬𝟯
━━━━━━━━━━━━━━━━━━━━
💕 𝗧𝗛𝗔𝗡𝗞𝗦 𝗙𝗢𝗥 𝗨𝗦𝗜𝗡𝗚 𝗠𝗘 💕
🌸 𝗛𝗔𝗩𝗘 𝗔 𝗡𝗜𝗖𝗘 𝗗𝗔𝗬 🌸 `;

    try {
      const cacheDir = path.join(__dirname, "cache");
      const videoPath = path.join(cacheDir, "intro.mp4");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const videoLink = "https://files.catbox.moe/oyosmx.mp4";

      const res = await axios.get(videoLink, { responseType: "arraybuffer" });
      fs.writeFileSync(videoPath, Buffer.from(res.data));

      api.sendMessage(
        {
          body: intro,
          attachment: fs.createReadStream(videoPath)
        },
        event.threadID,
        () => fs.unlinkSync(videoPath),
        event.messageID
      );
    } catch (e) {
      api.sendMessage(intro, event.threadID, event.messageID);
      console.log("INTRO ERROR:", e.message);
    }
  }
};
