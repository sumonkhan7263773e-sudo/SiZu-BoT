module.exports = {
  config: {
    name: "intro",
    aliases: ["about", "botinfo"],
    version: "1.3",
    author: "Sumon",
    shortDescription: "Sizuka Introduction",
    longDescription: "Shows bot introduction",
    category: "info",
    guide: "{pn}intro"
  },

  onStart: async function ({ api, event }) {
    const intro = `
╭──── 🌸 ────╮
  𝗦𝗜𝗭𝗨𝗞𝗔 𝗠𝗜𝗡𝗔𝗠𝗢𝗧𝗢
╰──── 🌸 ────╯

💠 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢

👑 𝗡𝗔𝗠𝗘 : 𝗦𝗶𝘇𝘂𝗸𝗮 𝗠𝗶𝗻𝗮𝗺𝗼𝘁𝗼
🎂 𝗔𝗚𝗘 : 𝟭𝟴
🎓 𝗖𝗟𝗔𝗦𝗦 : 𝗜𝗻𝘁𝗲𝗿 𝟭𝘀𝘁 𝗬𝗲𝗮𝗿
💕 𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡 : 𝗦𝗶𝗻𝗴𝗹𝗲
🌷 𝗚𝗘𝗡𝗗𝗘𝗥 : 𝗙𝗘𝗠𝗔𝗟𝗘
⚡ 𝗦𝗧𝗔𝗧𝗨𝗦 : 𝗥𝗘𝗔𝗗𝗬

💗 𝗔𝗕𝗢𝗨𝗧 𝗠𝗘

𝗛𝗘𝗟𝗟𝗢 𝗘𝗩𝗘𝗥𝗬𝗢𝗡𝗘! 👋
𝗜 𝗔𝗠 𝗦𝗜𝗭𝗨𝗞𝗔 𝗠𝗜𝗡𝗔𝗠𝗢𝗧𝗢.
𝗬𝗢𝗨𝗥 𝗙𝗥𝗜𝗘𝗡𝗗𝗟𝗬 𝗕𝗢𝗧. 🌸
𝗦𝗧𝗔𝗬 𝗔𝗖𝗧𝗜𝗩𝗘 & 𝗘𝗡𝗝𝗢𝗬!

━━━━━━━━━━━━━━

👑 𝗕𝗢𝗧 𝗠𝗔𝗞𝗘𝗥 : 𝗔𝗛𝗠𝗘𝗗 𝗦𝗨𝗠𝗢𝗡
📱 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 : 𝟬𝟭𝟲𝟭𝟱𝟭𝟵𝟳𝟬𝟬𝟯

━━━━━━━━━━━━━━

💕 𝗧𝗛𝗔𝗡𝗞𝗦 𝗙𝗢𝗥 𝗨𝗦𝗜𝗡𝗚 𝗠𝗘
🌸 𝗛𝗔𝗩𝗘 𝗔 𝗡𝗜𝗖𝗘 𝗗𝗔𝗬
`;

    return api.sendMessage(intro, event.threadID, event.messageID);
  }
};
