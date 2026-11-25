const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "wlc",
    aliases: ["welcome"],
    version: "1.0",
    author: "Sumon",
    shortDescription: "Welcome member with photo",
    longDescription: "Creates a stylish welcome image using member profile picture.",
    category: "fun",
    guide: "{pn}wlc @mention"
  },

  onStart: async function ({ api, event, usersData }) {
    let filePath;

    try {
      const mentions = Object.keys(event.mentions || {});

      let uid;

      if (mentions.length >= 1) {
        uid = mentions[0];
      } else if (event.type === "message_reply" && event.messageReply) {
        uid = event.messageReply.senderID;
      } else {
        return api.sendMessage(
          "💙 | কাউকে Mention অথবা তার Message-এ Reply করে লিখো: wlc",
          event.threadID,
          event.messageID
        );
      }

      const user = await usersData.get(uid);
      const name = user?.name || event.mentions?.[uid] || "New Member";

      api.sendMessage(
        "🎨 | Welcome Photo তৈরি হচ্ছে...",
        event.threadID,
        event.messageID
      );

      const profileUrl =
        `https://graph.facebook.com/${uid}/picture?width=500&height=500`;

      const response = await axios.get(profileUrl, {
        responseType: "arraybuffer",
        timeout: 20000
      });

      const profile = await loadImage(Buffer.from(response.data));

      const width = 1000;
      const height = 1000;

      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 1000, 1000);
      gradient.addColorStop(0, "#030712");
      gradient.addColorStop(0.5, "#102A50");
      gradient.addColorStop(1, "#020617");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Decorative circles
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 5 + 2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(0,190,255,0.5)";
        ctx.fill();
      }

      // Border
      ctx.strokeStyle = "#00BFFF";
      ctx.lineWidth = 7;
      ctx.strokeRect(20, 20, 960, 960);

      // Main title
      ctx.textAlign = "center";
      ctx.shadowColor = "#00BFFF";
      ctx.shadowBlur = 30;
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 100px Arial";
      ctx.fillText("WELCOME", 500, 140);

      ctx.shadowBlur = 0;

      ctx.fillStyle = "#55D8FF";
      ctx.font = "bold 42px Arial";
      ctx.fillText("✦ NEW MEMBER ✦", 500, 205);

      // Profile border
      ctx.beginPath();
      ctx.arc(500, 430, 165, 0, Math.PI * 2);
      ctx.fillStyle = "#00BFFF";
      ctx.shadowColor = "#00BFFF";
      ctx.shadowBlur = 35;
      ctx.fill();

      // Profile image
      ctx.save();
      ctx.beginPath();
      ctx.arc(500, 430, 150, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(profile, 350, 280, 300, 300);
      ctx.restore();

      ctx.shadowBlur = 0;

      // Member name
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "#00BFFF";
      ctx.shadowBlur = 20;
      ctx.font = "bold 48px Arial";
      ctx.fillText(name.substring(0, 25), 500, 650);

      ctx.shadowBlur = 0;

      // Welcome messages
      ctx.fillStyle = "#FFD166";
      ctx.font = "bold 38px Arial";
      ctx.fillText("✦ STAY ACTIVE & ENJOY ✦", 500, 735);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 29px Arial";
      ctx.fillText("Make Memories • Spread Happiness", 500, 795);

      ctx.fillStyle = "#9EDFFF";
      ctx.font = "27px Arial";
      ctx.fillText("Stay Connected • Stay Together", 500, 845);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 27px Arial";
      ctx.fillText("Welcome To Our Community!", 500, 900);

      // Footer
      ctx.fillStyle = "#9CAFC8";
      ctx.font = "20px Arial";
      ctx.fillText("ᴘᴏᴡᴇʀᴇᴅ ʙʏ sᴜᴍᴏɴ", 500, 955);

      // Save image
      filePath = path.join(
        os.tmpdir(),
        `welcome_${uid}_${Date.now()}.png`
      );

      await fs.writeFile(filePath, canvas.toBuffer("image/png"));

      return api.sendMessage(
        {
          body:
            `💙 Welcome ${name}!\n\n` +
            `✨ Stay Active & Enjoy!\n` +
            `💕 Make Memories Together!`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => {
          if (filePath) fs.remove(filePath).catch(() => {});
        },
        event.messageID
      );

    } catch (error) {
      console.error("WLC ERROR:", error);

      if (filePath) await fs.remove(filePath).catch(() => {});

      return api.sendMessage(
        "❌ Welcome Photo তৈরি করা যায়নি!\n\n" +
        "আবার চেষ্টা করো।\n" +
        "Contact Boss: Sumon\n" +
        "WhatsApp: 01615197003",
        event.threadID,
        event.messageID
      );
    }
  }
};
