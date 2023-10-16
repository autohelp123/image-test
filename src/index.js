const axios = require("axios");
const cheerio = require("cheerio");

async function getSEOInfo(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract title
    const title = $("title").text();

    // Extract headers (h1, h2, h3, etc.)
    const headers = {};
    for (let i = 1; i <= 6; i++) {
      headers[`h${i}`] = $(`h${i}`).length;
    }

    // Extract meta description
    const metaDescription = $("meta[name=description]").attr("content") || "";

    // Extract meta keywords
    const metaKeywords = $("meta[name=keywords]").attr("content") || "";

    // Extract number of images
    const images = $("img").length;

    // Extract canonical URL
    const canonicalURL = $("link[rel=canonical]").attr("href") || "";

    // Extract number of internal and external links
    const internalLinks = $('a[href^="/"]').length;
    const externalLinks = $('a[href^="http"]').length;

    return {
      title,
      headers,
      metaDescription,
      metaKeywords,
      images,
      canonicalURL,
      internalLinks,
      externalLinks,
    };
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}


module.exports = async ({ req, res, log, error }) => {
  if (req.method !== "GET") return error("Request method not supported");
  const { url } = req.query;

  const info = await getSEOInfo(url);
  if (!info) return error("failed to get SEO information");

  log("Executed!");
  return res.json(info);
};
