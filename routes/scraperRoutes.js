const express = require('express');
const router = express.Router();
const scrapeWebsite = require('../scrapers/scraper');

// Route pour exécuter le scraper et récupérer les titres des articles
router.get('/scrape', async (req, res) => {
  try {
    // Appel de la fonction de scraping
    const articleTitles = await scrapeWebsite();

    // Envoyer les titres récupérés en réponse
    res.json({ titles: articleTitles });
  } catch (error) {
    console.error('Erreur lors du scraping :', error);
    res.status(500).json({ error: 'Une erreur est survenue lors du scraping' });
  }
});

module.exports = router;
