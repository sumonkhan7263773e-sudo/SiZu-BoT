
module.exports = {
  config: {
    name: "needbf",
    aliases: ["bf", "boy"],
    version: "1.0",
    author: "Sumon",
    shortDescription: "Random BF finder",
    longDescription: "Randomly selects and mentions a male group member.",
    category: "fun",
    guide: "{pn}needbf"
  },

  onStart: async function ({ api, event }) {
    try {
      // Get group information
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

      // Exclude sender and bot
      const botID = api.getCurrentUserID();

      const members = threadInfo.participantIDs.filter(
        id => id !== event.senderID && id !== botID
      );

      if (!members.length) {
        return api.sendMessage(
          "❌ কোনো Member পাওয়া যায়নি!",
          event.threadID
        );
      }

      // Get member information
      const userInfo = await new Promise((resolve, reject) => {
        api.getUserInfo(members, (err, info) => {
          if (err) return reject(err);
          resolve(info);
        });
      });

      if (!userInfo) {
        throw new Error("User information unavailable");
      }

      // Find male members
      const boys = members.filter(id => {
        const user = userInfo[id];

        if (!user || !user.gender) return false;

        const gender = String(user.gender).toLowerCase();

        return (
          gender === "male" ||
          gender === "m" ||
          gender.includes("male")
        );
      });

      if (!boys.length) {
        return api.sendMessage(
          "🥲 গ্রুপে Male Member খুঁজে পাওয়া গেল না!\n\nFacebook Profile Information-এ Gender দেওয়া আছে কি না চেক করো।",
          event.threadID
        );
      }

      // Random male selection
      const boyID = boys[
        Math.floor(Math.random() * boys.length)
      ];

      const boyName = userInfo[boyID].name || "Unknown";
      const mentionTag = "@" + boyName;

      // Final message
      const message =
`💙━━━━━━━━━━━━━━━━━━💙

       💙 𝐍𝐄𝐄𝐃 𝐁𝐎𝐘𝐅𝐑𝐈𝐄𝐍𝐃 💙

😎 এই নে তোর পছন্দের BF!

👦🏻 𝐁𝐨𝐲 ➤ ${mentionTag}

💌 𝐒𝐭𝐚𝐭𝐮𝐬 ➤ Single
🌸 𝐌𝐨𝐨𝐝 ➤ Cute
💙 𝐕𝐢𝐛𝐞 ➤ Premium

🥰 এবার কথা বলা শুরু কর!

💙━━━━━━━━━━━━━━━━━━💙

       𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐒𝐔𝐌𝐎𝐍`;

      return api.sendMessage(
        {
          body: message,
          mentions: [
            {
              tag: mentionTag,
              id: boyID
            }
          ]
        },
        event.threadID
      );

    } catch (error) {
      console.error("NeedBF Error:", error);

      return api.sendMessage(
        "❌ BF খুঁজতে সমস্যা হয়েছে!\nএকটু পরে আবার চেষ্টা করো।",
        event.threadID
      );
    }
  }
};
