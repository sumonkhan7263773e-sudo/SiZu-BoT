module.exports = {
  config: {
    name: "needgf",
    aliases: ["gf", "girl"],
    version: "3.0",
    author: "Sumon",
    shortDescription: "Random GF finder",
    longDescription: "Randomly selects and mentions a female group member.",
    category: "fun",
    guide: "{pn}needgf"
  },

  onStart: async function ({ api, event }) {
    try {
      // Group information
      const threadInfo = await new Promise((resolve, reject) => {
        api.getThreadInfo(event.threadID, (err, info) => {
          if (err) return reject(err);
          resolve(info);
        });
      });

      if (!threadInfo || !threadInfo.participantIDs) {
        return api.sendMessage(
          "❌ গ্রুপের Member List পাওয়া যায়নি!",
          event.threadID
        );
      }

      // Bot এবং command sender বাদ
      let members = threadInfo.participantIDs.filter(
        id => id !== event.senderID &&
              id !== api.getCurrentUserID()
      );

      if (!members.length) {
        return api.sendMessage(
          "❌ কোনো Member পাওয়া যায়নি!",
          event.threadID
        );
      }

      // Member information
      const userInfo = await new Promise((resolve, reject) => {
        api.getUserInfo(members, (err, info) => {
          if (err) return reject(err);
          resolve(info);
        });
      });

      if (!userInfo) {
        throw new Error("User information unavailable");
      }

      // Female member filter
      const girls = members.filter(id => {
        const user = userInfo[id];

        if (!user || !user.gender) return false;

        const gender = String(user.gender).toLowerCase();

        return (
          gender === "female" ||
          gender === "f" ||
          gender.includes("female")
        );
      });

      if (!girls.length) {
        return api.sendMessage(
          "🥲 গ্রুপে Female Member খুঁজে পাওয়া গেল না!\n\nFacebook Profile Information-এ Gender দেখা যাচ্ছে কি না চেক করো।",
          event.threadID
        );
      }

      // Random girl selection
      const girlID = girls[
        Math.floor(Math.random() * girls.length)
      ];

      const girlName = userInfo[girlID].name || "Unknown";

      const mentionTag = "@" + girlName;

      // Final message
      const message =
`💗━━━━━━━━━━━━━━━━━━💗

       💞 𝐍𝐄𝐄𝐃 𝐆𝐈𝐑𝐋 💞

😎 এই নে তোর পছন্দের GF!

👩🏻 𝐆𝐢𝐫𝐥 ➤ ${mentionTag}

💌 𝐒𝐭𝐚𝐭𝐮𝐬 ➤ Single
🌸 𝐌𝐨𝐨𝐝 ➤ Cute
💖 𝐕𝐢𝐛𝐞 ➤ Premium

🥰 এবার কথা বলা শুরু কর!

💗━━━━━━━━━━━━━━━━━━💗

       𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐒𝐔𝐌𝐎𝐍`;

      return api.sendMessage(
        {
          body: message,
          mentions: [
            {
              tag: mentionTag,
              id: girlID
            }
          ]
        },
        event.threadID
      );

    } catch (error) {
      console.error("NeedGF Error:", error);

      return api.sendMessage(
        "❌ সমস্যা হয়েছে!\nএকটু পরে আবার চেষ্টা করো।",
        event.threadID
      );
    }
  }
};
