const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "intro",
    aliases: ["about", "botinfo"],
    version: "1.2",
    author: "Sumon",
    shortDescription: "Sizuka Minamoto Introduction",
    longDescription: "Shows bot introduction with video",
    category: "info",
    guide: "{pn}intro"
  },

  onStart: async function ({ api, event }) {

    const intro = `╭━━━━━━━━━━━━━━━━━━╮
🌸 𝗦𝗜𝗭𝗨𝗞𝗔 𝗠𝗜𝗡𝗔𝗠𝗢𝗧𝗢 🌸
╰━━━━━━━━━━━━━━━━━━╯

💠 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢
➤ 👑 𝗡𝗔𝗠𝗘 : 𝗦𝗶𝘇𝘂𝗸𝗮 𝗠𝗶𝗻𝗮𝗺𝗼𝘁𝗼
➤ 🎂 𝗔𝗚𝗘 : 𝟭𝟴
➤ 🎓 𝗖𝗟𝗔𝗦𝗦 : 𝗜𝗻𝘁𝗲𝗿 𝟭𝘀𝘁 𝗬𝗲𝗮𝗿
➤ 💕 𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡𝗦𝗛𝗜𝗣 : 𝗦𝗶𝗻𝗴𝗹𝗲
➤ 🌷 𝗚𝗘𝗡𝗗𝗘𝗥 : 𝗙𝗲𝗺𝗮𝗹𝗲
➤ ⚡ 𝗦𝗧𝗔𝗧𝗨𝗦 : 𝗔𝗹𝘄𝗮𝘆𝘀 𝗥𝗲𝗮𝗱𝘆

💗 𝗔𝗕𝗢𝗨𝗧 𝗠𝗘
𝗛𝗲𝗹𝗹𝗼 𝗘𝘃𝗲𝗿𝘆𝗼𝗻𝗲! 👋
𝗜 𝗔𝗠 𝗦𝗜𝗭𝗨𝗞𝗔 𝗠𝗜𝗡𝗔𝗠𝗢𝗧𝗢.
𝗬𝗼𝘂𝗿 𝗙𝗿𝗶𝗲𝗻𝗱𝗹𝘆 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿 𝗕𝗼𝘁.
𝗛𝗲𝗿𝗲 𝗧𝗼 𝗠𝗮𝗸𝗲 𝗬𝗼𝘂𝗿 𝗚𝗿𝗼𝘂𝗽
𝗠𝗼𝗿𝗲 𝗙𝘂𝗻 & 𝗘𝗻𝗷𝗼𝘆𝗮𝗯𝗹𝗲! 🌸

━━━━━━━━━━━━━━━━━━
👑 𝗕𝗢𝗧 𝗠𝗔𝗗𝗘 𝗕𝗬 : 𝗔𝗛𝗠𝗘𝗗 𝗦𝗨𝗠𝗢𝗡
📱 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 : 𝟬𝟭𝟲𝟭𝟱𝟭𝟵𝟳𝟬𝟬𝟯
━━━━━━━━━━━━━━━━━━

💕 𝗧𝗛𝗔𝗡𝗞𝗦 𝗙𝗢𝗥 𝗨𝗦𝗜𝗡𝗚 𝗠𝗘 💕
🌸 𝗛𝗔𝗩𝗘 𝗔 𝗡𝗜𝗖𝗘 𝗗𝗔𝗬 🌸`;

    try {
      const cacheDir = path.join(__dirname, "cache");
      const videoPath = path.join(cacheDir, "intro.mp4");

      // Create cache folder if it doesn't exist
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Intro video
      const videoLink = "https://files.catbox.moe/jxdb6v.mp4";

      const res = await axios.get(videoLink, {
        responseType: "arraybuffer",
        timeout: 30000
      });

      fs.writeFileSync(videoPath, Buffer.from(res.data));

      // Send intro + video
      api.sendMessage(
        {
          body: intro,
          attachment: fs.createReadStream(videoPath)
        },
        event.threadID,
        () => {
          try {
            if (fs.existsSync(videoPath)) {
              fs.unlinkSync(videoPath);
            }
          } catch (err) {
            console.log("CACHE DELETE ERROR:", err.message);
          }
        },
        event.messageID
      );

    } catch (e) {

      console.log("INTRO VIDEO ERROR:", e.message);

      // If video fails, send text only
      api.sendMessage(
        intro,
        event.threadID,
        event.messageID
      );
    }
  }
};
