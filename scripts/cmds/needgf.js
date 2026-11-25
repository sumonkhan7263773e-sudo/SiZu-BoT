const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "needgf",
    version: "1.0.0",
    author: "Sumon",
    countDown: 5,
    role: 0,
    shortDescription: "Random GF card",
    longDescription: "Random group member দিয়ে GF card তৈরি করে।",
    category: "fun",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);

      let members = threadInfo.participantIDs.filter(
        id => String(id) !== String(api.getCurrentUserID())
      );

      if (!members.length) {
        return api.sendMessage(
          "কোনো group member পাওয়া যায়নি 😅",
          event.threadID
        );
      }

      // Random member
      const targetID =
        members[Math.floor(Math.random() * members.length)];

      let userInfo = {};

      try {
        userInfo = await api.getUserInfo(targetID);
      } catch (e) {}

      const name =
        userInfo[targetID]?.name || "Unknown Member";

      const avatar =
        `https://graph.facebook.com/${targetID}/picture?width=720&height=720`;

      const image = await makeGFCard(avatar, name);

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      const filePath = path.join(
        cacheDir,
        `needgf_${Date.now()}.png`
      );

      await fs.writeFile(filePath, image);

      api.sendMessage(
        {
          body: `💘 এই নে tor GF ❤️\n👑 GF: ${name}`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => {
          setTimeout(() => {
            try {
              fs.unlinkSync(filePath);
            } catch (e) {}
          }, 15000);
        }
      );

    } catch (error) {
      console.error("needgf error:", error);

      return api.sendMessage(
        "❌ GF card বানাতে সমস্যা হয়েছে।",
        event.threadID
      );
    }
  }
};


async function makeGFCard(avatarURL, name) {

  const W = 1080;
  const H = 1350;

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);

  bg.addColorStop(0, "#08000d");
  bg.addColorStop(0.5, "#25002f");
  bg.addColorStop(1, "#050008");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);


  // Glow
  const glow = ctx.createRadialGradient(
    250,
    300,
    20,
    250,
    300,
    500
  );

  glow.addColorStop(
    0,
    "rgba(255,0,180,.35)"
  );

  glow.addColorStop(
    1,
    "rgba(255,0,180,0)"
  );

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);


  // Hearts
  ctx.font = "80px Arial";

  ctx.fillStyle = "#ff38cf";

  ctx.fillText("♥", 80, 120);
  ctx
