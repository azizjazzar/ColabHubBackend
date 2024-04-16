const axios = require('axios');
const cheerio = require('cheerio');

const isSpam = (title) => {
  const spamKeywords = ['spam', 'promotion', 'free', 'tiktok', 'sale']; // Liste de mots-clés de spam
  const lowerCaseTitle = title.toLowerCase();
  for (const keyword of spamKeywords) {
    const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'i'); // Crée une expression régulière pour trouver le mot-clé complet
    if (keywordRegex.test(lowerCaseTitle)) {
      return true; // Le titre contient un mot-clé de spam
    }
  }
  return false; // Le titre ne contient pas de mots-clés de spam
};


const scrapeWebsite = async () => {
  try {
    const response = await axios.get('https://www.creative-tim.com/blog');
    const $ = cheerio.load(response.data);

    const titles = [];
    $('a.post-title-link').each((index, element) => {
      const title = $(element).text().trim();
      if (!isSpam(title)) {
        titles.push(title);
      }
    });

    return titles;
  } catch (error) {
    console.error('Erreur lors du scraping :', error);
    throw error;
  }
};

module.exports = scrapeWebsite;
