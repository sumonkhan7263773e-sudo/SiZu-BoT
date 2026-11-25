const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands"],
    version: "7.0",
    author: "Sumon",
    shortDescription: "Show all commands",
    longDescription: "Show all available commands in a stylish category menu",
    category: "system",
    guide: "{pn}help [command name]"
  },

  onStart: async function ({ message, args, prefix }) {
    const allCommands = global.GoatBot.commands;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 𝐅𝐀𝐍𝐂𝐘 𝐅𝐎𝐍𝐓
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const fancyFont = (str) => {
      const map = {
        A:"𝐀",B:"𝐁",C:"𝐂",D:"𝐃",E:"𝐄",F:"𝐅",G:"𝐆",H:"𝐇",
        I:"𝐈",J:"𝐉",K:"𝐊",L:"𝐋",M:"𝐌",N:"𝐍",O:"𝐎",P:"𝐏",
        Q:"𝐐",R:"𝐑",S:"𝐒",T:"𝐓",U:"𝐔",V:"𝐕",W:"𝐖",X:"𝐗",
        Y:"𝐘",Z:"𝐙",
        a:"𝐚",b:"𝐛",c:"𝐜",d:"𝐝",e:"𝐞",f:"𝐟",g:"𝐠",h:"𝐡",
        i:"𝐢",j:"𝐣",k:"𝐤",l:"𝐥",m:"𝐦",n:"𝐧",o:"𝐨",p:"𝐩",
        q:"𝐪",r:"𝐫",s:"𝐬",t:"𝐭",u:"𝐮",v:"𝐯",w:"𝐰",x:"𝐱",
        y:"𝐲",z:"𝐳"
      };

      return String(str)
        .split("")
        .map(c => map[c] || c)
        .join("");
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘 𝐅𝐎𝐍𝐓
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const categoryFont = (str) => {
      const map = {
        A:"𝐀",B:"𝐁",C:"𝐂",D:"𝐃",E:"𝐄",F:"𝐅",G:"𝐆",H:"𝐇",
        I:"𝐈",J:"𝐉",K:"𝐊",L:"𝐋",M:"𝐌",N:"𝐍",O:"𝐎",P:"𝐏",
        Q:"𝐐",R:"𝐑",S:"𝐒",T:"𝐓",U:"𝐔",V:"𝐕",W:"𝐖",X:"𝐗",
        Y:"𝐘",Z:"𝐙"
      };

      return String(str)
        .toUpperCase()
        .split("")
        .map(c => map[c] || c)
        .join("");
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 𝐂𝐋𝐄𝐀𝐍 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const cleanCategoryName = (text) => {
      return text
        ? String(text).toLowerCase().trim()
        : "others";
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 𝐈𝐍𝐃𝐈𝐕𝐈𝐃𝐔𝐀𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (args[0]) {
      const cmdName = String(args[0]).toLowerCase();

      const cmd =
        allCommands.get(cmdName) ||
        [...allCommands.values()].find(
          c => c.config.aliases?.some(
            alias => String(alias).toLowerCase() === cmdName
          )
        );

      if (!cmd) {
        return message.reply(
`╭━━━━━━━━━━━━━━━━━━╮
┃  ❌ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐍𝐎𝐓 𝐅𝐎𝐔𝐍𝐃
╰━━━━━━━━━━━━━━━━━━╯

✦ Command : ${fancyFont(cmdName)}
✦ Status  : Not Available

➤ Try ${prefix}help
➤ See the full command list`
        );
      }

      const usage =
        typeof cmd.config.guide === "string"
          ? cmd.config.guide.replace("{pn}", cmd.config.name)
          : cmd.config.name;

      const aliases =
        cmd.config.aliases?.length
          ? cmd.config.aliases.join(", ")
          : "None";

      const infoMsg =
`╭━━━━━━━━━━━━━━━━━━━━╮
┃   🧩 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎
╰━━━━━━━━━━━━━━━━━━━━╯

✦ 𝐍𝐚𝐦𝐞      ➤ ${fancyFont(cmd.config.name)}
✦ 𝐀𝐥𝐢𝐚𝐬𝐞𝐬   ➤ ${fancyFont(aliases)}
✦ 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲   ➤ ${categoryFont(cmd.config.category || "Others")}
✦ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧    ➤ v${cmd.config.version || "1.0"}
✦ 𝐀𝐮𝐭𝐡𝐨𝐫     ➤ ${fancyFont(cmd.config.author || "Sumon")}

━━━━━━━━━━━━━━━━━━━━

📌 𝐔𝐒𝐀𝐆𝐄
➤ ${prefix}${usage}

📝 𝐃𝐄𝐒𝐂𝐑𝐈𝐏𝐓𝐈𝐎𝐍
➤ ${cmd.config.longDescription ||
   cmd.config.shortDescription ||
   "No description available."}

━━━━━━━━━━━━━━━━━━━━
👑 𝐇𝐄𝐋𝐏 𝐒𝐘𝐒𝐓𝐄𝐌
➤ ${prefix}help
➤ ${prefix}help ${cmd.config.name}`;

      return message.reply(infoMsg);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘 𝐆𝐑𝐎𝐔𝐏𝐈𝐍𝐆
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const categories = {};

    for (const [name, cmd] of allCommands) {
      if (!cmd || !cmd.config) continue;

      const cat = cleanCategoryName(cmd.config.category);

      if (!categories[cat]) {
        categories[cat] = [];
      }

      categories[cat].push(name);
    }

    // Sort commands inside categories
    for (const cat of Object.keys(categories)) {
      categories[cat].sort((a, b) =>
        String(a).localeCompare(String(b))
      );
    }

    const totalCommands = allCommands.size;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    let msg =
`╭━━━━━━━━━━━━━━━━━━━━━━╮
┃   👑 𝐒𝐔𝐌𝐎𝐍 𝐁𝐎𝐓 𝐌𝐄𝐍𝐔
╰━━━━━━━━━━━━━━━━━━━━━━╯

┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🤖 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎
┣━━━━━━━━━━━━━━━━━━━━━━┫
┃ ✦ Prefix  ➤ ${prefix}
┃ ✦ Total   ➤ ${totalCommands} Commands
┃ ✦ Author  ➤ 𝐒𝐔𝐌𝐎𝐍
┃ ✦ Version ➤ 7.0
┗━━━━━━━━━━━━━━━━━━━━━━┛

💠 𝐀𝐋𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒
`;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐈𝐄𝐒
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const sortedCategories = Object.keys(categories).sort();

    for (const cat of sortedCategories) {
      const commands = categories[cat];

      msg += `\n╭─── ${categoryFont(cat)} ───╮\n`;

      for (const cmdName of commands) {
        msg += `│ ⎙ ${fancyFont(cmdName)}\n`;
      }

      msg += `╰──────────────────╯\n`;
    }

    msg +=
`\n╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ 📖 𝐇𝐎𝐖 𝐓𝐎 𝐔𝐒𝐄
╰━━━━━━━━━━━━━━━━━━━━━━╯

➤ ${prefix}help
➤ ${prefix}help <command>

💡 Example:
➤ ${prefix}help weather
➤ ${prefix}help ai

━━━━━━━━━━━━━━━━━━━━━━
👑 𝐒𝐔𝐌𝐎𝐍 𝐁𝐎𝐓
⚡ 𝐒𝐓𝐀𝐘 𝐀𝐂𝐓𝐈𝐕𝐄 • 𝐄𝐍𝐉𝐎𝐘`;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 𝐑𝐀𝐍𝐃𝐎𝐌 𝐆𝐈𝐅
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const gifURLs = [
      "https://i.imgur.com/Xw6JTfn.gif",
      "https://i.imgur.com/mW0yjZb.gif",
      "https://i.imgur.com/KQBcxOV.gif"
    ];

    const randomGifURL =
      gifURLs[Math.floor(Math.random() * gifURLs.length)];

    const gifFolder = path.join(__dirname, "cache");

    if (!fs.existsSync(gifFolder)) {
      fs.mkdirSync(gifFolder, { recursive: true });
    }

    const gifName = path.basename(randomGifURL);
    const gifPath = path.join(gifFolder, gifName);

    try {
      if (!fs.existsSync(gifPath)) {
        await downloadGif(randomGifURL, gifPath);
      }

      return message.reply({
        body: msg,
        attachment: fs.createReadStream(gifPath)
      });
    } catch (error) {
      // GIF download fail হলেও help menu কাজ করবে
      return message.reply(msg);
    }
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 𝐆𝐈𝐅 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function downloadGif(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    https.get(url, (res) => {
      if (
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        file.close();
        fs.unlink(dest, () => {});

        return downloadGif(res.headers.location, dest)
          .then(resolve)
          .catch(reject);
      }

      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(
          new Error(`GIF download failed: ${res.statusCode}`)
        );
      }

      res.pipe(file);

      file.on("finish", () => {
        file.close(resolve);
      });

      file.on("error", (err) => {
        file.close();
        fs.unlink(dest, () => {});
        reject(err);
      });
    }).on("error", (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
        }
