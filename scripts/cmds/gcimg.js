const axios = require("axios");
const { Jimp } = require("jimp");
const { Readable } = require("stream");

module.exports = {
  config: {
    name: "gcimg",
    aliases: ["groupimg", "gcpp"],
    version: "1.1",
    author: "Sumon",
    shortDescription: "Group members profile collage",
    longDescription: "Creates a collage of group members profile pictures",
    category: "group",
    guide: "{pn}gcimg"
  },

  onStart: async function ({ api, event }) {
    try {
      const threadID = event.threadID;

      api.sendMessage(
        "🌸 𝗚𝗥𝗢𝗨𝗣 𝗣𝗛𝗢𝗧𝗢 𝗖𝗥𝗘𝗔𝗧𝗜𝗡𝗚...\n⏳ Please wait!",
        threadID
      );

      const threadInfo = await api.getThreadInfo(threadID);
      const members = threadInfo.participantIDs || [];

      if (!members.length) {
        throw new Error("No group members found");
      }

      const userInfo = await new Promise((resolve, reject) => {
        api.getUserInfo(members, (err, info) => {
          if (err) reject(err);
          else resolve(info);
        });
      });

      const profiles = [];

      for (const id of members.slice(0, 40)) {
        try {
          const user = userInfo[id];
          const url = user && (user.profileUrl || user.thumbSrc);

          if (!url) continue;

          const response = await axios.get(url, {
            responseType: "arraybuffer",
            timeout: 15000
          });

          const image = await Jimp.read(
            Buffer.from(response.data)
          );

          image.cover({ w: 180, h: 180 });
          profiles.push(image);

        } catch (err) {
          console.log("Profile download failed:", id, err.message);
        }
      }

      if (!profiles.length) {
        throw new Error("No profile pictures available");
      }

      const columns = 5;
      const cellSize = 180;
      const rows = Math.ceil(profiles.length / columns);

      const collage = new Jimp({
        width: columns * cellSize,
        height: rows * cellSize,
        color: 0x202020ff
      });

      profiles.forEach((img, index) => {
        const x = (index % columns) * cellSize;
        const y = Math.floor(index / columns) * cellSize;
        collage.composite(img, x, y);
      });

      const buffer = await collage.getBuffer("image/jpeg");

      return api.sendMessage(
        {
          body:
            "╭━━━━━━━━━━━━━━━━━━╮\n" +
            "  🌸 𝗚𝗥𝗢𝗨𝗣 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𝗖𝗢𝗟𝗟𝗔𝗚𝗘\n" +
            "╰━━━━━━━━━━━━━━━━━━╯\n\n" +
            `👥 𝗧𝗢𝗧𝗔𝗟 𝗣𝗜𝗖𝗧𝗨𝗥𝗘𝗦 : ${profiles.length}\n\n` +
            "👑 𝗠𝗔𝗗𝗘 𝗕𝗬 : 𝗔𝗛𝗠𝗘𝗗 𝗦𝗨𝗠𝗢𝗡\n" +
            "💕 𝗦𝗜𝗭𝗨𝗞𝗔 𝗕𝗢𝗧",
          attachment: Readable.from(buffer)
        },
        threadID,
        event.messageID
      );

    } catch (error) {
      console.error("GCIMG ERROR:", error);

      return api.sendMessage(
        "╭━━━━━━━━━━━━━━━━━━╮\n" +
        "       ❌ 𝗖𝗥𝗘𝗔𝗧𝗜𝗢𝗡 𝗙𝗔𝗜𝗟𝗘𝗗\n" +
        "╰━━━━━━━━━━━━━━━━━━╯\n\n" +
        "😔 দুঃখিত! 𝗚𝗥𝗢𝗨𝗣 𝗜𝗠𝗔𝗚𝗘 তৈরি করা যায়নি।\n\n" +
        "📩 সমস্যার সমাধানের জন্য আমার বসের সাথে যোগাযোগ করুন।\n\n" +
        "👑 𝗕𝗢𝗦𝗦 : 𝗔𝗛𝗠𝗘𝗗 𝗦𝗨𝗠𝗢𝗡\n" +
        "📱 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 : 01615197003\n\n" +
        "╰━━ 💗 𝗦𝗜𝗭𝗨𝗞𝗔 𝗕𝗢𝗧 ━━╯",
        threadID,
        event.messageID
      );
    }
  }
};
