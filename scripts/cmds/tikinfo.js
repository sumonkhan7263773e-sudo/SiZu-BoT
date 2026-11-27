const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "tikinfo",
    aliases: ["tiktokinfo", "ttinfo"],
    version: "3.0",
    author: "Ahmed Sumon",
    countDown: 5,
    role: 0,
    shortDescription: "TikTok profile screenshot",
    longDescription: "TikTok username dile profile er screenshot dibe",
    category: "info",
    guide: "{pn}tikinfo <username>"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    let username = (args[0] || "").trim();

    if (!username) {
      return api.sendMessage("❌ Username de!\nExample: !tikinfo mrbeast", threadID, messageID);
    }

    username = username.replace("@", "").replace("https://www.tiktok.com/@", "").split("/")[0].split("?")[0].split(" ")[0];

    api.sendMessage(`⏳ @${username} er profile er screenshot tultesi, ektu wait kor...`, threadID, messageID);

    try {
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      const shotPath = path.join(cacheDir, `tik_${Date.now()}.jpg`);

      // Screenshot API - 2 ta try korbo, ekta fail hoile arekta
      let done = false;
      const shotUrls = [
        `https://image.thum.io/get/width/720/crop/900/noanimate/https://www.tiktok.com/@${username}`,
        `https://s.wordpress.com/mshots/v1/https://www.tiktok.com/@${username}?w=720`
      ];

      for (const url of shotUrls) {
        try {
          const res = await axios.get(url, { responseType: "arraybuffer", timeout: 25000, headers: { "User-Agent": "Mozilla/5.0" } });
          if (res.data && res.data.length > 5000) {
            fs.writeFileSync(shotPath, Buffer.from(res.data));
            done = true;
            break;
          }
        } catch (e) { console.log("SHOT TRY FAIL:", e.message); }
      }

      if (!done) {
        return api.sendMessage(`❌ Screenshot tulte parlam na. TikTok hoyto block korse.\nLink ta nije dekh: https://www.tiktok.com/@${username}`, threadID, messageID);
      }

      // Info try korbo, na paileo screenshot jabe
      let infoText = "";
      try {
        const infoRes = await axios.get(`https://www.tikwm.com/api/user/info?unique_id=${username}`, { timeout: 10000 });
        const u = infoRes.data?.data?.user;
        if (u) {
          infoText = `\n👤 Name: ${u.nickname}\n🆔 Username: @${u.unique_id}\n👥 Followers: ${u.follower_count?.toLocaleString()}\n❤️ Likes: ${u.total_favorited?.toLocaleString()}\n🎬 Videos: ${u.video_count}\n📝 Bio: ${u.signature || "No Bio"}\n`;
        }
      } catch (e) { console.log("INFO FAIL:", e.message); }

      const msg = `🎵 𝗧𝗜𝗞𝗧𝗢𝗞 𝗣𝗥𝗢𝗙𝗜𝗟𝗘\n━━━━━━━━━━━━━━\n🔗 https://www.tiktok.com/@${username}${infoText}\n━━━━━━━━━━━━━━\n📸 Screenshot niche 👇`;

      api.sendMessage(
        { body: msg, attachment: fs.createReadStream(shotPath) },
        threadID,
        () => { if (fs.existsSync(shotPath)) fs.unlinkSync(shotPath); },
        messageID
      );

    } catch (e) {
      console.log("TIKINFO ERROR:", e.message);
      api.sendMessage(`❌ Error: ${e.message}\nLink: https://www.tiktok.com/@${username}`, threadID, messageID);
    }
  }
};
