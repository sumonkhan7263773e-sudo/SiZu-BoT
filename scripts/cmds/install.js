const fs = require("fs");
const path = require("path");
const https = require("https");

function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        return resolve(downloadFile(res.headers.location, filePath));
      }

      if (res.statusCode !== 200) {
        return reject(
          new Error(`Download failed: HTTP ${res.statusCode}`)
        );
      }

      const file = fs.createWriteStream(filePath);

      res.pipe(file);

      file.on("finish", () => {
        file.close();
        resolve();
      });

      file.on("error", reject);
    }).on("error", reject);
  });
}

module.exports = {
  config: {
    name: "install",
    version: "1.0.0",
    author: "Ahmed Sumon",
    countDown: 5,
    role: 2,
    shortDescription: "Install JS file",
    longDescription: "Download and install a JavaScript command file",
    category: "admin",
    guide: "{prefix}install <url> <filename>"
  },

  onStart: async function ({ message, args }) {
    const url = args[0];
    let fileName = args[1];

    if (!url || !fileName) {
      return message.reply(
        "❌ ব্যবহার:\n-install <raw-js-url> <filename>"
      );
    }

    if (!fileName.endsWith(".js")) {
      fileName += ".js";
    }

    const folder = path.join(
      process.cwd(),
      "scripts",
      "cmds"
    );

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    const filePath = path.join(folder, fileName);

    try {
      await downloadFile(url, filePath);

      return message.reply(
        `✅ File installed successfully!\n📁 ${fileName}`
      );
    } catch (error) {
      return message.reply(
        `❌ Install failed!\n${error.message}`
      );
    }
  }
};
