const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "tikinfo",
    aliases: ["tiktokinfo", "ttinfo", "tik"],
    version: "4.0",
    author: "Ahmed Sumon",
    countDown: 5,
    role: 0,
    shortDescription: "TikTok profile info",
    longDescription: "TikTok username dile sundor profile info dibe",
    category: "info",
    guide: "{pn}tikinfo <username>\nExample: {pn}tikinfo gaanghor_official"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    let username = (args[0] || "").trim();

    if (!username) {
      return api.sendMessage("❌ Username de!\nExample: !tikinfo gaanghor_official", threadID, messageID);
    }

    username = username.replace("@", "").replace("https://www.tiktok.com/@", "").split("/")[0].split("?")[0].split(" ")[0];

    try {
      // TikWM API - BD server e chole
      const infoRes = await axios.get(`https://www.tikwm.com/api/user/info?unique_id=${username}`, {
        timeout: 15000,
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const u = infoRes.data?.data?.user;
      const stats = infoRes.data?.data?.stats;

      if (!u) {
        return api.sendMessage(`❌ @${username} nam e kono user pailam na.\nUsername ta check kor.`, threadID, messageID);
      }

      // Sundor kore sajano msg
      const msg = `╭───🎵 𝗧𝗜𝗞𝗧𝗢𝗞 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 ───╮\n` +
      `│\n` +
      `│ 👤 𝗡𝗮𝗺𝗲 : ${u.nickname}\n` +
      `│ 🆔 𝗨𝘀𝗲𝗿 : @${u.unique_id}\n` +
      `│ ✅ 𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱 : ${u.verified ? "Yes ✔️" : "No ✖️"}\n` +
      `│\n` +
      `│ 📝 𝗕𝗶𝗼 :\n` +
      `│ ${u.signature || "No Bio"}\n` +
      `│\n` +
      `│ ━━━━━━━━━━━━━━━\n` +
      `│ 👥 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀 : ${Number(u.follower_count || 0).toLocaleString()}\n` +
      `│ 👤 𝗙𝗼𝗹𝗹𝗼𝘄𝗶𝗻𝗴 : ${Number(u.following_count || 0).toLocaleString()}\n` +
      `│ ❤️ 𝗧𝗼𝘁𝗮𝗹 𝗟𝗶𝗸𝗲𝘀 : ${Number(u.total_favorited || 0).toLocaleString()}\n` +
      `│ 🎬 𝗩𝗶𝗱𝗲𝗼𝘀 : ${Number(u.video_count || 0).toLocaleString()}\n` +
      `│ 🌍 𝗥𝗲𝗴𝗶𝗼𝗻 : ${u.region || "BD"}\n` +
      `│\n` +
      `│ 🔗 𝗟𝗶𝗻𝗸 : tiktok.com/@${u.unique_id}\n` +
      `│\n` +
      `╰───💙 𝗔𝗵𝗺𝗲𝗱 𝗦𝘂𝗺𝗼𝗻 ───╯`;

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      const avatarPath = path.join(cacheDir, `tik_${Date.now()}.jpg`);

      let attachment = null;
      try {
        if (u.avatar_larger) {
          const avRes = await axios.get(u.avatar_larger, {
            responseType: "arraybuffer",
            timeout: 15000,
            headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://www.tiktok.com/" }
          });
          fs.writeFileSync(avatarPath, Buffer.from(avRes.data));
          attachment = fs.createReadStream(avatarPath);
        }
      } catch (e) { console.log("AVATAR FAIL:", e.message); }

      api.sendMessage(
        { body: msg, attachment: attachment || undefined },
        threadID,
        () => { if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath); },
        messageID
      );

    } catch (e) {
      console.log("TIKINFO ERROR:", e.message);
      api.sendMessage(`❌ Hoilo na!\nTikTok server busy. 1 min por abar try kor:\n!tikinfo ${username}`, threadID, messageID);
    }
  }
};
