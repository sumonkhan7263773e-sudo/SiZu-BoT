const axios = require("axios");

module.exports = {
  config: {
    name: "needgf",
    aliases: ["gf", "girl"],
    version: "2.0",
    author: "Sumon",
    shortDescription: "Random GF finder",
    longDescription: "Automatically selects and mentions a random female member from the group.",
    category: "fun",
    guide: "{pn}needgf"
  },

  onStart: async function ({ api, event }) {
    try {
      const threadInfo = await new Promise((resolve, reject) => {
        api.getThreadInfo(event.threadID, (err, info) => {
          if (err) return reject(err);
          resolve(info);
        });
      });

      let members = threadInfo.participantIDs || [];

      // Bot/user নিজেকে বাদ
      members = members.filter(id => id !== event.senderID);

      if (!members.length) {
        return api.sendMessage(
          "❌ এই গ্রুপে অন্য কোনো member পাওয়া যায়নি।",
          event.threadID
        );
      }

      // সব member-এর profile info নেওয়া
      const userInfo = await new Promise((resolve, reject) => {
        api.getUserInfo(members, (err, info) => {
          if (err) return reject(err);
          resolve(info);
        });
      });

      // Female member খোঁজা
      const girls = members.filter(id => {
        const user = userInfo[id];
        if (!user) return false;

        const gender = String(user.gender || "").toLowerCase();

        return (
          gender === "female" ||
          gender === "f" ||
          gender.includes("female")
        );
      });

      if (!girls.length) {
        return api.sendMessage(
          "🥲 এই গ্রুপে কোনো female member খুঁজে পাওয়া গেল না!",
          event.threadID
        );
      }

      // Random female নির্বাচন
      const girlID = girls[Math.floor(Math.random() * girls.length)];
      const girl = userInfo[girlID];

      const girlName = girl.name || "Unknown";

      // তোমার image URL এখানে
      const imageUrls = [
        "https://i.imgur.com/1G4ZhU7.jpeg"
      ];

      const imageUrl =
        imageUrls[Math.floor(Math.random() * imageUrls.length)];

      // Image download
      const image = await axios.get(imageUrl, {
        responseType: "stream"
      });

      const message =
`💞 𝐆𝐈𝐑𝐋𝐅𝐑𝐈𝐄𝐍𝐃 𝐑𝐄𝐒𝐔𝐋𝐓 💞

💌 তোমার GF Neo 😎

👩🏻 𝐆𝐢𝐫𝐥 ➤ ${girlName}
💗 𝐒𝐭𝐚𝐭𝐮𝐬 ➤ Single 🌚💋
💖 𝐌𝐨𝐨𝐝 ➤ Cute
✨ 𝐕𝐢𝐛𝐞 ➤ Premium

💬 এই নে তোর GF 😌❤️

━━━━━━━━━━━━━━━━━━
🤖 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐒𝐮𝐦𝐨𝐧
━━━━━━━━━━━━━━━━━━`;

      return api.sendMessage(
        {
          body: message,
          mentions: [
            {
              tag: girlName,
              id: girlID
            }
          ],
          attachment: image.data
        },
        event.threadID
      );

    } catch (error) {
      console.error("NeedGF Error:", error);

      return api.sendMessage(
        "❌ GF খুঁজতে সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করো।",
        event.threadID
      );
    }
  }
};
