module.exports = {
  config: {
    name: "needbf",
    aliases: ["bf", "boy"],
    version: "2.0",
    author: "Sumon",
    shortDescription: "Random Boy Finder",
    longDescription: "Randomly selects and mentions only a male group member.",
    category: "fun",
    guide: "{pn}needbf"
  },

  onStart: async function ({ api, event }) {
    try {
      const threadID = event.threadID;
      const senderID = event.senderID;
      const botID = api.getCurrentUserID();

      // Get group members
      const threadInfo = await new Promise((resolve, reject) => {
        api.getThreadInfo(threadID, (err, info) => {
          if (err) return reject(err);
          resolve(info);
        });
      });

      if (!threadInfo || !threadInfo.participantIDs) {
        return api.sendMessage(
          "❌ গ্রুপের Member List পাওয়া যায়নি!",
          threadID
        );
      }

      // Exclude command sender and bot
      const members = threadInfo.participantIDs.filter(
        id => id !== senderID && id !== botID
      );

      if (!members.length) {
        return api.sendMessage(
          "❌ অন্য কোনো Member পাওয়া যায়নি!",
          threadID
        );
      }

      // Get user information
      const userInfo = await new Promise((resolve, reject) => {
        api.getUserInfo(members, (err, info) => {
          if (err) return reject(err);
          resolve(info);
        });
      });

      if (!userInfo) {
        throw new Error("User information unavailable");
      }

      // Strictly filter male members
      const boys = members.filter(id => {
        const user = userInfo[id];

        if (!user) return false;

        const gender = String(user.gender || "").toLowerCase().trim();

        return gender === "male" || gender === "m";
      });

      if (!boys.length) {
        return api.sendMessage(
          "🥲 গ্রুপে কোনো Male Member পাওয়া যায়নি!\n\nছেলেদের Profile Gender Information পাওয়া যাচ্ছে কি না চেক করো।",
          threadID
        );
      }

      // Select random boy
      const boyID = boys[
        Math.floor(Math.random() * boys.length)
      ];

      const boyName = userInfo[boyID].name || "Unknown";
      const mentionTag = "@" + boyName;

      // Final message
      const message =
`💙━━━━━━━━━━━━━━━━━━━━💙

       💙 𝐍𝐄𝐄𝐃 𝐁𝐎𝐘𝐅𝐑𝐈𝐄𝐍𝐃 💙

😎 এই নে তোর LoYaL BF!

👦🏻 𝐁𝐨𝐲 ➤ ${mentionTag}

💌 𝐒𝐭𝐚𝐭𝐮𝐬 ➤ Single
🌸 𝐌𝐨𝐨𝐝 ➤ Cute
💙 𝐕𝐢𝐛𝐞 ➤ Premium

🥰 এবার কথা বলা শুরু কর!

💙━━━━━━━━━━━━━━━━━━━━💙

       𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐒𝐔𝐌𝐎𝐍`;

      return api.sendMessage({
        body: message,
        mentions: [
          {
            tag: mentionTag,
            id: boyID
          }
        ]
      }, threadID);

    } catch (error) {
      console.error("NeedBF Error:", error);

      return api.sendMessage(
        "❌ BF খুঁজতে সমস্যা হয়েছে!\nএকটু পরে আবার চেষ্টা করো।",
        event.threadID
      );
    }
  }
};
