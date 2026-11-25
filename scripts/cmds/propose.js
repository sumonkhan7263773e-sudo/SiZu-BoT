const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "propose",
    aliases: ["proposal", "love"],
    version: "2.0",
    author: "Sumon",
    shortDescription: "Propose with mentioned member's PP",
    longDescription: "Creates a proposal image using the mentioned member's profile picture.",
    category: "fun",
    guide: "{pn}propose @person"
  },

  onStart: async function ({ api, event }) {
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    try {
      // একজনকে mention করতেই হবে
      const mentionedIds = event.mentions
        ? Object.keys(event.mentions)
        : [];

      if (mentionedIds.length < 1) {
        return api.sendMessage(
          "❌ একজনকে mention করে লিখো:\npropose @person",
          event.threadID
        );
      }

      const targetID = mentionedIds[0];

      // Mention করা member-এর তথ্য
      const users = await api.getUserInfo([targetID]);
      const target = users[targetID] || {};

      const targetName = target.name || "Someone";

      // PP URL বের করা
      const getProfileUrl = (user) =>
        user.profileUrl ||
        user.thumbSrc ||
        user.avatarUrl ||
        user.image ||
        null;

      const targetUrl = getProfileUrl(target);

      if (!targetUrl) {
        return api.sendMessage(
          "❌ ওই member-এর profile picture পাওয়া যায়নি।",
          event.threadID
        );
      }

      // Proposal background image
      const templateUrl =
        "https://i.imgur.com/REPLACE_WITH_YOUR_PROPOSAL_IMAGE.png";

      async function downloadImage(url) {
        const response = await axios.get(url, {
          responseType: "arraybuffer",
          timeout: 20000,
          headers: {
            "User-Agent": "Mozilla/5.0"
          }
        });

        return Buffer.from(response.data);
      }

      // PP-কে গোল করে তৈরি করা
      async function makeCirclePP(buffer, size = 300) {
        const mask = Buffer.from(`
          <svg width="${size}" height="${size}">
            <circle
              cx="${size / 2}"
              cy="${size / 2}"
              r="${size / 2}"
              fill="white
