const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "propose",
    aliases: ["proposal", "love"],
    version: "3.0",
    author: "Sumon",
    shortDescription: "Proposal with mentioned member PP",
    longDescription: "Creates a proposal image using the mentioned member's profile picture.",
    category: "fun",
    guide: "{pn}propose @person"
  },

  onStart: async function ({ api, event }) {
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    try {
      const mentions = event.mentions
        ? Object.keys(event.mentions)
        : [];

      if (mentions.length === 0) {
        return api.sendMessage(
          "💍 একজনকে mention করে লিখো:\n\npropose @person",
          event.threadID
        );
      }

      const targetID = mentions[0];

      // Mention করা ব্যক্তির তথ্য
      const info = await api.getUserInfo(targetID);
      const user = info[targetID] || info;

      const name =
        user.name ||
        user.firstName ||
        "Someone";

      // Facebook PP URL
      const ppUrl =
        user.thumbSrc ||
        user.profileUrl ||
        user.avatarUrl ||
        user.image;

      if (!ppUrl) {
        return api.sendMessage(
          "❌ Mention করা ব্যক্তির PP পাওয়া যায়নি।",
          event.threadID
        );
      }

      // PP download
      const ppResponse = await axios.get(ppUrl, {
        responseType: "arraybuffer",
        timeout: 30000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36"
        }
      });

      const ppBuffer = Buffer.from(ppResponse.data);

      // PP square/crop
      const pp = await sharp(ppBuffer)
        .resize(330, 330, {
          fit: "cover",
          position: "centre"
        })
        .png()
        .toBuffer();

      // PP কে base64 করা
      const ppBase64 = pp.toString("base64");

      // পুরো proposal background SVG
      // কোনো external image লাগবে না
      const svg = `
      <svg width="1080" height="1350" viewBox="0 0 1080 1350"
           xmlns="http://www.w3.org/2000/svg">

        <defs>

          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#080018"/>
            <stop offset="50%" stop-color="#16002d"/>
            <stop offset="100%" stop-color="#02000b"/>
          </linearGradient>

          <radialGradient id="glow">
            <stop offset="0%" stop-color="#ff1493" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#ff1493" stop-opacity="0"/>
          </radialGradient>

          <filter id="blur">
            <feGaussianBlur stdDeviation="35"/>
          </filter>

          <filter id="shadow">
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="12"
              flood-color="#000000"
              flood-opacity="0.8"/>
          </filter>

          <clipPath id="girlClip">
            <circle cx="820" cy="300" r="165"/>
          </clipPath>

        </defs>

        <!-- Background -->
        <rect width="1080" height="1350" fill="url(#bg)"/>

        <!-- Pink glow -->
        <circle
          cx="820"
          cy="300"
          r="300"
          fill="url(#glow)"
          filter="url(#blur)"/>

        <!-- Blue glow -->
        <circle
          cx="250"
          cy="600"
          r="280"
          fill="#0066ff"
          opacity="0.18"
          filter="url(#blur)"/>

        <!-- Stars -->
        <g fill="#ffffff">
          <circle cx="100" cy="130" r="4"/>
          <circle cx="190" cy="220" r="3"/>
          <circle cx="350" cy="110" r="4"/>
          <circle cx="520" cy="190" r="3"/>
          <circle cx="720" cy="100" r="4"/>
          <circle cx="930" cy="150" r="3"/>
          <circle cx="1000" cy="260" r="4"/>
          <circle cx="130" cy="420" r="3"/>
          <circle cx="960" cy="500" r="4"/>
        </g>

        <!-- Moon -->
        <circle
          cx="540"
          cy="170"
          r="70"
          fill="#fff5ff"
          opacity="0.9"/>

        <circle
          cx="565"
          cy="145"
          r="70"
          fill="#12001f"/>

        <!-- Top title -->
        <text
          x="540"
          y="70"
          text-anchor="middle"
          font-size="46"
          font-family="Arial"
          font-weight="900"
          fill="#ffffff">
          𝙋𝙍𝙊𝙋𝙊𝙎𝙀
        </text>

        <!-- Girl PP frame -->
        <circle
          cx="820"
          cy="300"
          r="180"
          fill="#ff1493"
          opacity="0.35"/>

        <circle
          cx="820"
          cy="300"
          r="170"
          fill="#0b0014"
          stroke="#ff1493"
          stroke-width="12"/>

        <!-- Mentioned user's PP -->
        <image
          href="data:image/png;base64,${ppBase64}"
          x="655"
          y="135"
          width="330"
          height="330"
          preserveAspectRatio="xMidYMid slice"
          clip-path="url(#girlClip)"/>

        <!-- Frame -->
        <circle
          cx="820"
          cy="300"
          r="170"
          fill="none"
          stroke="#ffffff"
          stroke-width="5"
          opacity="0.9"/>

        <!-- Crown -->
        <text
          x="820"
          y="100"
          text-anchor="middle"
          font-size="70">
          👑
        </text>

        <!-- Boy -->
        <g filter="url(#shadow)">

          <!-- Head -->
          <circle
            cx="300"
            cy="600"
            r="85"
            fill="#f0b48d"/>

          <!-- Hair -->
          <path
            d="M220 590
               Q235 490 315 500
               Q390 515 380 600
               Q350 550 310 560
               Q270 540 220 590"
            fill="#15121b"/>

          <!-- Body -->
          <path
            d="M205 690
               Q300 640 395 690
               L450 900
               L170 900 Z"
            fill="#09090d"/>

          <!-- Pants -->
          <path
            d="M215 880
               L340 880
               L370 1120
               L285 1120
               L250 980
               L215 1120
               L125 1120
               Z"
            fill="#111119"/>

          <!-- Shoes -->
          <path
            d="M115 1100
               Q190 1080 270 1115
               L270 1160
               L100 1160
               Q70 1135 115 1100"
            fill="#ffffff"/>

          <!-- Arm -->
          <path
            d="M365 700
               Q500 720 590 640
               L620 675
               Q510 800 370 785 Z"
            fill="#09090d"/>

          <!-- Hand -->
          <circle
            cx="615"
            cy="655"
            r="27"
            fill="#f0b48d"/>

          <!-- Ring box -->
          <rect
            x="585"
            y="600"
            width="85"
            height="60"
            rx="8"
            fill="#b00035"/>

          <rect
            x="585"
            y="590"
            width="85"
            height="20"
            rx="8"
            fill="#ff2f81"/>

          <!-- Ring -->
          <circle
            cx="627"
            cy="590"
            r="15"
            fill="none"
            stroke="#ffffff"
            stroke-width="6"/>

          <circle
            cx="627"
            cy="575"
            r="7"
            fill="#ffffff"/>

        </g>

        <!-- Hearts -->
        <text x="450" y="430" font-size="80" fill="#ff1493">♥</text>
        <text x="570" y="500" font-size="55" fill="#ffffff">♥</text>
        <text x="380" y="300" font-size="45" fill="#ff1493">♥</text>

        <!-- Roses -->
        <g font-size="55">
          <text x="80" y="1240">🌹</text>
          <text x="180" y="1280">🌹</text>
          <text x="820" y="1260">🌹</text>
          <text x="920" y="1220">🌹</text>
        </g>

        <!-- Bottom message -->
        <text
          x="540"
          y="1010"
          text-anchor="middle"
          font-size="42"
          font-family="Arial"
          font-weight="900"
          fill="#ffffff">
          WILL YOU BE MINE?
        </text>

        <text
          x="540"
          y="1070"
          text-anchor="middle"
          font-size="28"
          font-family="Arial"
          fill="#ff8ad8">
          💖 ${escapeXml(name)} 💖
        </text>

        <!-- Bottom hearts -->
        <text
          x="540"
          y="1160"
          text-anchor="middle"
          font-size="100"
          fill="#ff1493">
          ♥
        </text>

      </svg>
      `;

      // SVG → PNG
      const output = await sharp(Buffer.from(svg))
        .png()
        .toBuffer();

      const outputPath = path.join(
        cacheDir,
        `propose_${Date.now()}.png`
      );

      await fs.writeFile(outputPath, output);

      // Send
      return api.sendMessage(
        {
          body:
            `💍 𝙋𝙍𝙊𝙋𝙊𝙎𝙀 💗\n\n` +
            `💖 Hey ${name}, will you be mine?`,
          attachment: fs.createReadStream(outputPath),
          mentions: [
            {
              tag: name,
              id: targetID,
              fromIndex: 12,
              toIndex: 12 + name.length - 1
            }
          ]
        },
        event.threadID,
        () => {
          fs.unlink(outputPath).catch(() => {});
        }
      );

    } catch (error) {
      console.error("PROPOSE ERROR:", error);

      return api.sendMessage(
        "❌ Proposal image তৈরি করা যায়নি।\n\n" +
        "চেক করো: npm install axios sharp",
        event.threadID
      );
    }
  }
};

// XML-এর জন্য নাম safe করা
function escapeXml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
    }
