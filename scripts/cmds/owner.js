const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    aliases: ["ownerinfo"],
    version: "2.0.0",
    author: "Ahmed Sumon",
    role: 0,
    shortDescription: "Owner information with rotating photos",
    longDescription: "Show owner information with a different photo on every use.",
    category: "Information",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {

    const ownerText = `
╭━━━━━━━━━━━━━━━━━━━━╮
       👑 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 👑
╰━━━━━━━━━━━━━━━━━━━━╯

👤 𝐍𝐀𝐌𝐄   ➤ 𝐀𝐡𝐦𝐞𝐝 𝐒𝐮𝐦𝐨𝐧 亗
🧸 𝐍𝐈𝐂𝐊   ➤ 𝐒𝐮𝐦𝐨𝐧
🎂 𝐀𝐆𝐄    ➤ 𝟏𝟗+
💘 𝐒𝐓𝐀𝐓𝐔𝐒 ➤ 𝐒𝐢𝐧𝐠𝐥𝐞
🎓 𝐏𝐑𝐎𝐅𝐄𝐒𝐒𝐈𝐎𝐍 ➤ 𝐉𝐨𝐛
📚 𝐄𝐃𝐔𝐂𝐀𝐓𝐈𝐎𝐍 ➤ 𝐒𝐒𝐂 - 𝟐𝟎𝟐𝟒
🏡 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 ➤ 𝐌𝐲𝐦𝐞𝐧𝐬𝐢𝐧𝐠𝐡

╭━━━ 🔗 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 ━━━╮
┃ 📘 Facebook ➤ fb.com/AhmedSumon8790
┃ 💬 Messenger ➤ m.me/61576385979018
┃ 📞 WhatsApp ➤ wa.me/01615197003
╰━━━━━━━━━━━━━━━━━━━━╯

        ❤️ 𝐌𝐘 𝐎𝐖𝐍𝐄𝐑 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 ❤️
`;

    // ৪টি ছবি
    const photos = [
      path.join(__dirname, "owner1.jpg"),
      path.join(__dirname, "owner2.jpg"),
      path.join(__dirname, "owner3.jpg"),
      path.join(__dirname, "owner4.jpg")
    ];

    // কোন ছবিটি পরেরবার যাবে সেটা সংরক্ষণ করবে
    const indexFile = path.join(__dirname, "owner_index.json");

    let index = 0;

    // আগের index থাকলে সেটা পড়বে
    try {
      if (fs.existsSync(indexFile)) {
        const data = JSON.parse(
          fs.readFileSync(indexFile, "utf8")
        );

        if (
          typeof data.index === "number" &&
          data.index >= 0 &&
          data.index < photos.length
        ) {
          index = data.index;
        }
      }
    } catch (error) {
      index = 0;
    }

    // বর্তমান ছবিটি নির্বাচন
    const selectedPhoto = photos[index];

    // পরেরবারের জন্য index বাড়িয়ে রাখবে
    const nextIndex = (index + 1) % photos.length;

    try {
      fs.writeFileSync(
        indexFile,
        JSON.stringify({
          index: nextIndex
        })
      );
    } catch (error) {
      // index save না হলেও command চলবে
    }

    // ছবি না থাকলে error
    if (!fs.existsSync(selectedPhoto)) {
      return api.sendMessage(
        `❌ Owner photo পাওয়া যায়নি!

প্রয়োজনীয় ফাইল:
owner1.jpg
owner2.jpg
owner3.jpg
owner4.jpg`,
        event.threadID,
        event.messageID
      );
    }

    // Owner information + selected photo পাঠাবে
    return api.sendMessage(
      {
        body: ownerText,
        attachment: fs.createReadStream(selectedPhoto)
      },
      event.threadID,
      event.messageID
    );
  }
};
