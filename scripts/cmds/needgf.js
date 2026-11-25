const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "needgf",
    aliases: ["gf", "girlfriend"],
    version: "1.0",
    author: "Sumon",
    shortDescription: "Get a random GF",
    longDescription: "Create a random girlfriend image with a fun message",
    category: "fun",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {

    const gifURLs = [
      "https://i.imgur.com/Xw6JTfn.gif",
      "https://i.imgur.com/mW0yjZb.gif",
      "https://i.imgur.com/KQBcxOV.gif"
    ];

    const randomURL =
      gifURLs[Math.floor(Math.random() * gifURLs.length)];

    const cacheFolder = path.join(__dirname, "cache");

    if (!fs.existsSync(cacheFolder)) {
      fs.mkdirSync(cacheFolder, { recursive: true });
    }

    const fileName = path.basename(randomURL);
    const filePath = path.join(cacheFolder, fileName);

    try {
      if (!fs.existsSync(filePath)) {
        await downloadFile(randomURL, filePath);
      }

      const name =
        message?.senderID
          ? "তোর"
          : "তোমার";

      const msg =
`╭━━━━━━━━━━━━━━━━━━╮
   💕 𝐆𝐈𝐑𝐋𝐅𝐑𝐈𝐄𝐍𝐃 𝐑𝐄𝐒𝐔𝐋𝐓 💕
╰━━━━━━━━━━━━━━━━━━╯

💌 ${name} 𝐆𝐅 𝐍𝐢𝐬𝐞 𝐆𝐞𝐥𝐨 😎

👩🏻 𝐒𝐭𝐚𝐭𝐮𝐬 : 𝐑𝐚𝐧𝐝𝐨𝐦 𝐆𝐅
💝 𝐌𝐨𝐨𝐝 : 𝐂𝐮𝐭𝐞
✨ 𝐕𝐢𝐛𝐞 : 𝐏𝐫𝐞𝐦𝐢𝐮𝐦

💬 𝐄𝐲 𝐧𝐞 𝐭𝐨𝐫 𝐆𝐅 😌❤️

━━━━━━━━━━━━━━━━━━
🤖 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐒𝐮𝐦𝐨𝐧`;

      return message.reply({
        body: msg,
        attachment: fs.createReadStream(filePath)
      });

    } catch (error) {
      console.error("NeedGF Error:", error);

      return message.reply(
`❌ 𝐆𝐅 𝐈𝐦𝐚𝐠𝐞 𝐋𝐨𝐚𝐝 𝐇𝐨𝐲𝐧𝐢!

🔄 আবার ${global.GoatBot?.config?.prefix || "-"}needgf ট্রাই করো।`
      );
    }
  }
};

function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {

    const file = fs.createWriteStream(destination);

    https.get(url, (response) => {

      if (
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        file.close();
        fs.unlink(destination, () => {});

        return downloadFile(
          response.headers.location,
          destination
        ).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(destination, () => {});
        return reject(
          new Error(`HTTP ${response.statusCode}`)
        );
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close(resolve);
      });

    }).on("error", (error) => {

      file.close();
      fs.unlink(destination, () => {});
      reject(error);

    });
  });
               }
