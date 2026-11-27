const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "fun",
    version: "1.1",
    author: "Ahmed Sumon",
    countDown: 5,
    role: 1,
    shortDescription: "Random fun pic/video",
    longDescription: "Prottek bar alada alada pic/video dibe",
    category: "fun",
    guide: "{pn}fun"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;

    const mediaList = [
      "https://files.catbox.moe/aut8y0.mp4",
      "https://files.catbox.moe/sg9ely.mp4",
      "https://files.catbox.moe/l9c7kk.mp4",
      "https://files.catbox.moe/4lefxi.jpeg",
      "https://files.catbox.moe/0defk0.jpeg",
      "https://files.catbox.moe/pi6j80.jpeg",
      "https://files.catbox.moe/hg9exi.jpeg",
      "https://files.catbox.moe/mmhi5d.jpeg",
      "https://files.catbox.moe/dvzhyj.png",
      "https://files.catbox.moe/zgbvi7.jpeg",
      "https://files.catbox.moe/8nainv.jpeg",
      "https://files.catbox.moe/p1sgbt.jpg",
      "https://files.catbox.moe/zo8yn9.jpg",
      "https://files.catbox.moe/j5bvxe.jpeg",
      "https://files.catbox.moe/8r67hi.jpeg",
      "https://files.catbox.moe/jznvnu.jpg",
      "https://files.catbox.moe/1xrgab.jpeg",
      "https://files.catbox.moe/amch2e.jpeg",
      "https://files.catbox.moe/ollzau.jpeg",
      "https://files.catbox.moe/3s8lae.jpeg",
      "https://files.catbox.moe/w33vhp.jpeg",
      "https://files.catbox.moe/ob9z7g.jpeg",
      "https://files.catbox.moe/ff4y9a.jpeg",
      "https://files.catbox.moe/e5h7x7.jpeg",
      "https://files.catbox.moe/qzsxe2.jpeg"
    ];

    const funTexts = [
      "😂 DEKHO EITA! 🤣",
      "🔥 MOJA HOBE! 😆",
      "👀 EITA MISS KOIRO NA! 😹",
      "🤣 HASO EKTU! 😂",
      "😈 DHORLAM! 🔥",
      "💥 READY TO? 😆"
    ];

    const randomMedia = mediaList[Math.floor(Math.random() * mediaList.length)];
    const randomText = funTexts[Math.floor(Math.random() * funTexts.length)];

    try {
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const isVideo = randomMedia.includes(".mp4");
      const fileName = isVideo ? "fun.mp4" : "fun.jpg";
      const filePath = path.join(cacheDir, fileName);

      const res = await axios.get(randomMedia, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(res.data));

      api.sendMessage(
        { body: randomText, attachment: fs.createReadStream(filePath) },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );
    } catch (e) {
      console.log("FUN ERROR:", e.message);
      api.sendMessage(randomText, threadID, messageID);
    }
  }
};
