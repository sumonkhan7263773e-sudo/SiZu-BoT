const axios = require("axios");

module.exports = {
  config: {
    name: "needgf",
    aliases: ["gf", "girl"],
    version: "3.0",
    author: "Sumon",
    shortDescription: "Random GF finder",
    longDescription: "Selects a random member using name-based matching.",
    category: "fun",
    guide: "{pn}needgf"
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;

    try {
      const threadInfo = await new Promise((resolve, reject) => {
        api.getThreadInfo(threadID, (err, info) => {
          if (err) return reject(err);
          resolve(info);
        });
      });

      const members = threadInfo.participantIDs || [];
      const botID = api.getCurrentUserID();

      const excludedNames = [
        "sumon", "ahmed", "robin", "sakib",
        "rakib", "hasan", "rahim", "karim",
        "emon", "fahim", "tanvir", "shakil",
        "arif", "imran", "sajid", "sohel"
      ];

      const femaleNames = [
        "jannat", "sumaiya", "sumaya", "mim",
        "nusrat", "sadia", "sadia", "maria",
        "mariya", "ritika", "riya", "priya",
        "tania", "tasnim", "tamanna", "sanjida",
        "sanjana", "afrin", "maisha", "mou",
        "nisha", "sneha", "sneha", "anjum",
        "lamia", "lima", "mim", "sumi",
        "sabrina", "farzana", "jui", "akhi",
        "ishrat", "nabila", "nusrat"
      ];

      const candidates = members.filter(id =>
        id !== event.senderID && id !== botID
      );

      const girls = [];

      for (const id of candidates) {
        try {
          const info = await new Promise((resolve, reject) => {
            api.getUserInfo(id, (err, data) => {
              if (err) return reject(err);
              resolve(data);
            });
          });

          const user = info && info[id];
          if (!user || !user.name) continue;

          const name = user.name.toLowerCase();

          const isFemaleName = femaleNames.some(word =>
            name.split(/[\s._-]+/).includes(word)
          );

          const isMaleName = excludedNames.some(word =>
            name.split(/[\s._-]+/).includes(word)
          );

          if (isFemaleName && !isMaleName) {
            girls.push({
              id,
              name: user.name
            });
          }
        } catch (e) {
          console.log("Member error:", id, e.message);
        }
      }

      if (!girls.length) {
        return api.sendMessage(
          "🥲 মেয়েদের নামের কোনো ID খুঁজে পাওয়া যায়নি!",
          threadID
        );
      }

      const selected =
        girls[Math.floor(Math.random() * girls.length)];

      const imageUrl = "https://i.imgur.com/1G4ZhU7.jpeg";

      const response = await axios.get(imageUrl, {
        responseType: "stream",
        timeout: 15000
      });

      const message =
`💞 𝐘𝐎𝐔𝐑 𝐆𝐅 𝐑𝐄𝐒𝐔𝐋𝐓 💞

😎 এই নে তোর সরকারি GF!

👩🏻 𝐆𝐅 ➤ ${selected.name}
💗 𝐒𝐭𝐚𝐭𝐮𝐬 ➤ Official GF
💍 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧 ➤ Just Started

❤️ এখন থেকে ভালোভাবে যত্ন নিস!

━━━━━━━━━━━━━━━━━━
🤖 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐒𝐮𝐦𝐨𝐧
━━━━━━━━━━━━━━━━━━`;

      return api.sendMessage({
        body: message,
        mentions: [{
          tag: selected.name,
          id: selected.id
        }],
        attachment: response.data
      }, threadID);

    } catch (error) {
      console.error("NEEDGF ERROR:", error);

      return api.sendMessage(
        "❌ সমস্যা হয়েছে: " + error.message,
        threadID
      );
    }
  }
};
