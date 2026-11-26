module.exports = {
  config: {
    name: "boss",
    aliases: ["owner", "sumon"],
    version: "1.0",
    author: "Ahmed Sumon",
    shortDescription: "Boss information",
    longDescription: "Shows boss information",
    category: "info",
    guide: "{pn}boss"
  },

  onStart: async function ({ api, event }) {
    const msg = `
╭━━━━━━━━━━━━━━━━━━╮
┃ 👑 𝗕𝗢𝗦𝗦 𝗜𝗡𝗙𝗢
╰━━━━━━━━━━━━━━━━━━╯

👤 𝗡𝗮𝗺𝗲 : 𝗔𝗵𝗺𝗲𝗱 𝗦𝘂𝗺𝗼𝗻

📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 : 𝗔𝗵𝗺𝗲𝗱 𝗦𝘂𝗺𝗼𝗻
📸 𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺 : @𝘀𝘂𝗺𝗼𝗻𝗮𝗵𝗺𝗲𝗱𝟳𝟴𝟵𝟬
🎵 𝗧𝗶𝗸𝗧𝗼𝗸 : @𝗮𝗵𝗺𝗲𝗱_𝘀𝘂𝗺𝗼𝗻𝟲𝟳𝟰𝟵
▶️ 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 : @𝗺𝗿𝘀𝘂𝗺𝗼𝗻𝟲𝟳𝟰𝟵
👥 𝗚𝗖 𝗧𝗧 : @𝘇𝗲𝗻𝘃𝗼_𝗼𝗳𝗳𝗶𝗰𝗶𝗮𝗹

💬 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 : 𝟬𝟭𝟲𝟭𝟱𝟭𝟵𝟳𝟬𝟬𝟯

╭━━━━━━━━━━━━━━━━━━╮
┃ 💙 𝗔𝗵𝗺𝗲𝗱 𝗦𝘂𝗺𝗼𝗻
┃ 👑 𝗕𝗼𝘀𝘀 𝗢𝗳 𝗧𝗵𝗲 𝗕𝗼𝘁
╰━━━━━━━━━━━━━━━━━━╯
`;

    return api.sendMessage(msg, event.threadID, event.messageID);
  }
};
