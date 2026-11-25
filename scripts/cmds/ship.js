module.exports = {
  config: {
    name: "ship",
    aliases: ["couple", "match"],
    version: "1.0",
    author: "Sumon",
    shortDescription: "Couple matching",
    longDescription: "Creates a random couple match between two members.",
    category: "fun",
    guide: "{pn}ship @mention1 @mention2"
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      const mentions = Object.keys(event.mentions || {});

      let firstID, secondID;

      if (mentions.length >= 2) {
        firstID = mentions[0];
        secondID = mentions[1];
      } else if (event.type === "message_reply" && event.messageReply) {
        firstID = event.senderID;
        secondID = event.messageReply.senderID;
      } else {
        return api.sendMessage(
          "💞 | দুজনকে Mention অথবা একজনের Message-এ Reply করে লিখো: ship",
          event.threadID,
          event.messageID
        );
      }

      if (firstID === secondID) {
        return api.sendMessage(
          "😂 নিজের সাথেই আবার Couple হবে নাকি?",
          event.threadID,
          event.messageID
        );
      }

      const firstUser = await usersData.get(firstID);
      const secondUser = await usersData.get(secondID);

      const name1 = firstUser?.name || "Unknown";
      const name2 = secondUser?.name || "Unknown";

      const percent = Math.floor(Math.random() * 101);

      let status;

      if (percent >= 90) {
        status = "💍 Perfect Couple!";
      } else if (percent >= 70) {
        status = "❤️ Made For Each Other!";
      } else if (percent >= 50) {
        status = "💕 Cute Couple!";
      } else if (percent >= 30) {
        status = "😅 Just Friends!";
      } else {
        status = "😂 Try Again!";
      }

      const message =
        `╭━━━〔 💞 SHIZU LOVE MATCH 💞 〕━━━╮\n` +
        `\n` +
        `👑 Partner 1: ${name1}\n` +
        `💖 Partner 2: ${name2}\n` +
        `\n` +
        `💘 Love Percentage: ${percent}%\n` +
        `✨ Status: ${status}\n` +
        `\n` +
        `💕 Made With Shizu Bot\n` +
        `╰━━━━━━━━━━━━━━━━━━━━╯`;

      return api.sendMessage(
        message,
        event.threadID,
        event.messageID
      );

    } catch (error) {
      console.error(error);
      return api.sendMessage(
        "❌ Couple Match তৈরি করা যায়নি!",
        event.threadID,
        event.messageID
      );
    }
  }
};
