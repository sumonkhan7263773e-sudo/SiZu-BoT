const axios = require("axios");
const Canvas = require("canvas");
const fs = require("fs");
const path = require("path");

const BACKGROUNDS = [
  "https://i.imgur.com/0aEluTM.jpeg",
  "https://i.imgur.com/0geTIBC.jpeg",
  "https://i.imgur.com/3Y3C1Yr.jpeg",
  "https://i.imgur.com/2zz53lV.jpeg",
  "https://i.imgur.com/S1hIuc7.jpeg",
  "https://i.imgur.com/2lDJNM3.jpeg",
  "https://i.imgur.com/2PrkMNy.jpeg",
  "https://i.imgur.com/TF9diX2.jpeg",
  "https://i.imgur.com/fK7OtYq.jpeg",
  "https://i.imgur.com/5OO802y.jpeg"
];

module.exports = {
  config: {
    name: "pair",
    version: "9.5",
    author: "Saan",
    role: 0,
    countDown: 5,
    shortDescription: "Romantic pair system with random background",
    category: "LOVE"
  },

  onStart: async function ({ api, event, usersData, args }) {
    const { threadID, messageID, senderID, messageReply } = event;

    try {
      let targetID = senderID;
      let targetName = null;

      if (messageReply) {
        targetID = messageReply.senderID;
        try {
          const userData = await usersData.get(targetID);
          targetName = userData.name || "User";
        } catch {
          targetName = "User";
        }
      }

      const [senderData, threadInfo] = await Promise.all([
        usersData.get(targetID),
        api.getThreadInfo(threadID)
      ]);

      const senderName = targetName || senderData.name || "User";
      const senderGender = senderData.gender;

      const members = threadInfo.participantIDs.filter(uid => uid != targetID);
      
      let targetGender;
      if (senderGender === 1) {
        targetGender = 2;
      } else if (senderGender === 2) {
        targetGender = 1;
      } else {
        targetGender = Math.random() > 0.5 ? 1 : 2;
      }

      let partnerList = [];
      const randomMembers = members.sort(() => 0.5 - Math.random());

      for (const uid of randomMembers) {
        try {
          const data = await usersData.get(uid);
          if (data && data.gender === targetGender) {
            partnerList.push({ id: uid, name: data.name, gender: data.gender });
          }
        } catch {}
      }

      let partner;
      
      if (partnerList.length > 0) {
        partner = partnerList[Math.floor(Math.random() * partnerList.length)];
      } else {
        let fallbackPartner = null;
        for (const uid of randomMembers) {
          try {
            const data = await usersData.get(uid);
            if (data && data.gender !== senderGender && data.gender !== undefined) {
              fallbackPartner = { id: uid, name: data.name, gender: data.gender };
              break;
            }
          } catch {}
        }
        if (fallbackPartner) {
          partner = fallbackPartner;
        } else {
          const fallbackId = randomMembers[Math.floor(Math.random() * randomMembers.length)];
          partner = {
            id: fallbackId,
            name: "Someone Special",
            gender: targetGender
          };
        }
      }

      if (partner.gender === senderGender && senderGender !== undefined) {
        for (const uid of randomMembers) {
          try {
            const data = await usersData.get(uid);
            if (data && data.gender !== senderGender && data.gender !== undefined) {
              partner = { id: uid, name: data.name, gender: data.gender };
              break;
            }
          } catch {}
        }
      }

      const match = Math.floor(Math.random() * 31) + 70;

      let x1 = 0.20, y1 = 0.55, x2 = 0.80, y2 = 0.55;
      if (args.length >= 4) {
        const parsed = args.slice(0, 4).map(Number);
        if (parsed.every(n => !isNaN(n) && n >= 0 && n <= 1)) {
          [x1, y1, x2, y2] = parsed;
        }
      }

      const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
      const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

      const templateResponse = await axios.get(randomBg, {
        responseType: "arraybuffer",
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      const templateImg = await Canvas.loadImage(templateResponse.data);

      const avt1 = `https://graph.facebook.com/${targetID}/picture?width=1024&height=1024&access_token=${token}`;
      const avt2 = `https://graph.facebook.com/${partner.id}/picture?width=1024&height=1024&access_token=${token}`;

      async function loadImage(url) {
        const response = await axios.get(url, {
          responseType: "arraybuffer",
          headers: { "User-Agent": "Mozilla/5.0" }
        });
        return await Canvas.loadImage(response.data);
      }

      const [img1, img2] = await Promise.all([loadImage(avt1), loadImage(avt2)]);

      const canvas = Canvas.createCanvas(templateImg.width, templateImg.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

      const W = canvas.width;
      const H = canvas.height;
      const centerX1 = W * x1;
      const centerY1 = H
