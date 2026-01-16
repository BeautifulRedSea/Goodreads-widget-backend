const cheerio = require("cheerio");
const axios = require("axios");

module.exports = async (req, res) => {
  const userId = process.env.GOODREADS_USER_ID;
  const shelfUrl = `https://www.goodreads.com/review/list/${userId}?shelf=currently-reading`;

  try {
    const { data } = await axios.get(shelfUrl);
    const $ = cheerio.load(data);

    const books = [];

    $(".bookalike.review").each((i, el) => {
      const title = $(el).find(".title a").text().trim();
      const coverImage = $(el).find(".cover img").attr("src");
      const progressText = $(el).find(".progress .value").text().trim();
      const progress = parseInt(progressText.replace("%", "")) || 0;

      books.push({ title, coverImage, progress });
    });

    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to scrape Goodreads" });
  }
};
