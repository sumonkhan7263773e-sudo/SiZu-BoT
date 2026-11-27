const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "tikinfo",
    aliases: ["tiktokinfo", "ttinfo"],
    version: "2.0",
    author: "Ahmed Sumon",
    countDown: 5,
    role: 0,
    shortDescription: "TikTok profile info + screenshot",
    longDescription: "TikTok username dile profile info + screenshot dibe",
    category: "info",
    guide: "{pn}tikinfo <tiktok username>\nExample: {pn}tikinfo @mrbeast"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    let username = (args[0] || "").trim();

    if (!username) {
      return api.sendMessage("❌ Username de!\nExample: !tikinfo @ahmed_sumon6749", threadID, messageID);
    }

    // @ thakle soraiya de
    username = username.replace("@", "").replace("https://www.tiktok.com/@", "").split("/")[0].split("?")[0];

    try {
      // 1. TikTok Info - tikwm API (BD server e chole)
      const infoRes = await axios.get(`https://www.tikwm.com/api/user/info?unique_id=${username}`, {
        timeout: 15000,
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const data = infoRes.data?.data?.user;

      if (!data) {
        return api.sendMessage(`❌ @${username} nam e kono TikTok user pailam na. Username ta thik ache kina check kor.`, threadID, messageID);
      }

      const msg = `╭━━━━━━━━━━━━━━━━━━╮
┃ 🎵 𝗧𝗜𝗞𝗧𝗢𝗞 𝗜𝗡𝗙𝗢
╰━━━━━━━━━━━━━━━━━━╯
👤 𝗡𝗮𝗺𝗲 : ${data.nickname || "N/A"}
🆔 𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲 : @${data.unique_id}
🆔 𝗨𝗜𝗗 : ${data.uid || "N/A"}
✅ 𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱 : ${data.verified ? "Yes ✅" : "No ❌"}
📝 𝗕𝗶𝗼 : ${data.signature || "No Bio"}
👥 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀 : ${data.follower_count?.toLocaleString() || "0"}
👤 𝗙𝗼𝗹𝗹𝗼𝘄𝗶𝗻𝗴 : ${data.following_count?.toLocaleString() || "0"}
❤️ 𝗟𝗶𝗸𝗲𝘀 : ${data.total_favorited?.toLocaleString() || "0"}
🎬 𝗩𝗶𝗱𝗲𝗼𝘀 : ${data.video_count?.toLocaleString() || "0"}
🌍 𝗥𝗲𝗴𝗶𝗼𝗻 : ${data.region || "N/A"}
🔗 𝗟𝗶𝗻𝗸 : https://www.tiktok.com/@${data.unique_id}
╭━━━━━━━━━━━━━━━━━━╮
┃ 💙 𝗔𝗵𝗺𝗲𝗱 𝗦𝘂𝗺𝗼𝗻
╰━━━━━━━━━━━━━━━━━━╯`;

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      // 2. Screenshot - thum.io diye (puppeteer lagbe na)
      const shotPath = path.join(cacheDir, `tik_${username}.jpg`);
      const avatarPath = path.join(cacheDir, `tik_av_${username}.jpg`);

      let attachments = [];

      try {
        // Screenshot
        const shotUrl = `https://image.thum.io/get/width/720/crop/900/noanimate/https://www.tiktok.com/@${username}`;
        const shotRes = await axios.get(shotUrl, { responseType: "arraybuffer", timeout: 20000 });
        fs.writeFileSync(shotPath, Buffer.from(shotRes.data));
        attachments.push(fs.createReadStream(shotPath));
      } catch (e) { console.log("SHOT ERROR:", e.message); }

      try {
        // Avatar
        if (data.avatar_larger) {
          const avRes = await axios.get(data.avatar_larger, { responseType: "arraybuffer", timeout: 15000, headers: { "User-Agent": "Mozilla/5.0" } });
          fs.writeFileSync(avatarPath, Buffer.from(avRes.data));
          attachments.push(fs.createReadStream(avatarPath));
        }
      } catch (e) { console.log("AVATAR ERROR:", e.message); }

      api.sendMessage(
        { body: msg, attachment: attachments.length ? attachments : undefined },
        threadID,
        () => {
          if (fs.existsSync(shotPath)) fs.unlinkSync(shotPath);
          if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
        },
        messageID
      );

    } catch (e) {
      console.log("TIKINFO ERROR:", e.message);
      return api.sendMessage(`❌ Hoilo na re! TikTok server busy ba username vul.\nAbar try kor: !tikinfo ${username}`, threadID, messageID);
    }
  }
};
