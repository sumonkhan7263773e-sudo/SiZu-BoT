const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.3.0",
    author: "Sumon",
    role: 0,
    shortDescription: "Owner information with image",
    category: "Information",
    guide: "{pn}owner"
  },

  onStart: async function ({ api, event }) {
    const ownerText = `╭─ 👑 Oᴡɴᴇʀ Iɴғᴏ 👑 ─╮
│ 👤 Nᴀᴍᴇ : ᴀʜᴍᴇᴅ Sᴜᴍᴏɴ 亗
│ 🧸 Nɪᴄᴋ : Sᴜᴍᴏɴ
│ 🎂 Aɢᴇ : 19+
│ 💘 Rᴇʟᴀᴛɪᴏɴ : Sɪɴɢʟᴇ
│ 🎓 Pʀᴏғᴇssɪᴏɴ : Job
│ 📚 Eᴅᴜᴄᴀᴛɪᴏɴ : SSC - 2024
│ 🏡 Lᴏᴄᴀᴛɪᴏɴ : ᴍʏᴍᴇɴsɪɴɢʜ
├─ 🔗 Cᴏɴᴛᴀᴄᴛ ─╮
│ 📘 Facebook : fb.com/AhmedSumon8790
│ 💬 Messenger: m.me/61576385979018
│ 📞 WhatsApp : wa.me/01615197003
╰────────────────╯`;

    try {
      const cacheDir = path.join(__dirname, "cache");
      const imgPath = path.join(cacheDir, "owner.png");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const imgLink = "https://files.catbox.moe/0o0920.png";
      const res = await axios.get(imgLink, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, Buffer.from(res.data));

      api.sendMessage(
        {
          body: ownerText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    } catch (e) {
      // pic na asleo lekha ta jeno ase
      api.sendMessage(ownerText + "\n\n[Pic load hoy nai, link check kor]", event.threadID, event.messageID);
      console.log("OWNER ERROR:", e.message);
    }
  }
};
