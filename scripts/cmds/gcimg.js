
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "gcimg",
    version: "1.0",
    author: "Sumon",
    role: 0,
    countDown: 15,
    category: "fun",
    shortDescription: "All group members PP in one photo",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const file = path.join(__dirname, "cache", `gcimg_${event.threadID}.png`);

    try {
      await fs.ensureDir(path.dirname(file));

      const info = await api.getThreadInfo(event.threadID);
      const members = info.userInfo || [];
      const ids = info.participantIDs || members.map(m => m.id);

      const profiles = [];

      for (const id of ids) {
        try {
          const data = await api.getUserInfo(id);
          const url = data[id]?.thumbSrc || data[id]?.profileUrl;

          if (url) {
            const response = await axios.get(url, {
              responseType: "arraybuffer",
              timeout: 10000
            });
            profiles.push(await loadImage(response.data));
          }
        } catch (e) {}
      }

      if (!profiles.length) {
        throw new Error("No profile pictures found");
      }

      const size = 120;
      const gap = 8;
      const padding = 25;
      const columns = 7;
      const rows = Math.ceil(profiles.length / columns);

      const width = padding * 2 + columns * (size + gap) - gap;
      const height = padding * 2 + rows * (size + gap) - gap + 70;

      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#080d25");
      bg.addColorStop(1, "#25104a");

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      profiles.forEach((img, i) => {
        const x = padding + (i % columns) * (size + gap);
        const y = padding + Math.floor(i / columns) * (size + gap);

        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();

        ctx.strokeStyle = "#00d9ff";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.fillStyle = "#00d9ff";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("GROUP PHOTO", width / 2, height - 18);

      await fs.writeFile(file, canvas.toBuffer("image/png"));

      return api.sendMessage(
        {
          body: `💙 GROUP PP COLLECTION\n👥 ${profiles.length} Profile Pictures`,
          attachment: fs.createReadStream(file)
        },
        event.threadID,
        () => fs.unlink(file).catch(() => {}),
        event.messageID
      );

    } catch (error) {
      console.error(error);

      return api.sendMessage(
        "❌ Group photo তৈরি করা যায়নি!\nআমার বসের সাথে যোগাযোগ করো: 01615197003",
        event.threadID,
        event.messageID
      );
    }
  }
};
