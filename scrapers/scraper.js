const axios = require('axios');
const cheerio = require('cheerio');
const Blog = require('../models/blog');
const levenshtein = require('js-levenshtein');

const isSpam = (title) => {
  const spamKeywords = ['spam', 'promotion', 'free', 'tiktok', 'sale'];
  const lowerCaseTitle = title.toLowerCase();
  for (const keyword of spamKeywords) {
    const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (keywordRegex.test(lowerCaseTitle)) {
      return true;
    }
  }
  return false;
};

function getCategoryFromDescription(description) {
  const keywords = description.toLowerCase();

  // Liste de mots-clés pour chaque catégorie
  const categoryKeywords = {
      'Mobile': ['ios', 'iphone', 'ipad', 'apple', 'android', 'google', 'play store', 'mobile', 'smartphone', 'tablet', 'app', 'application', 'mobile development', 'react native', 'flutter', 'xamarin', 'mobile app', 'mobile application', 'mobile design', 'native app', 'hybrid app', 'mobile ui', 'mobile ux', 'mobile operating system', 'mobile platform', 'app store', 'google play', 'mobile technology'],
      'Web': ['web', 'website', 'frontend', 'backend', 'html', 'css', 'javascript', 'react', 'angular', 'vue', 'node.js', 'express', 'web development', 'full stack', 'website design', 'web application', 'web design', 'web developer', 'responsive design', 'ui design', 'ux design', 'web ui', 'web ux', 'front-end', 'back-end', 'server-side', 'client-side', 'web framework', 'web technology', 'web platform', 'web server', 'web hosting', 'web security'],
      'Design': ['ui', 'ux', 'design', 'graphic', 'illustrator', 'photoshop', 'figma', 'sketch', 'ui/ux', 'user interface', 'user experience', 'designer', 'ui/ux design', 'ui designer', 'ux designer', 'graphic design', 'ui/ux designer', 'ui/ux developer', 'design principles', 'design patterns', 'branding', 'logo design', 'typography', 'color theory', 'layout design', 'visual design', 'interaction design', 'product design', 'interface design', 'web design principles', 'user-centered design', 'responsive design', 'design thinking'],
      'Blockchain': ['blockchain', 'crypto', 'bitcoin', 'ethereum', 'cryptocurrency', 'smart contract', 'decentralized', 'blockchain technology', 'blockchain development', 'blockchain platform', 'crypto development', 'blockchain app', 'cryptocurrency exchange', 'blockchain network', 'blockchain consensus', 'blockchain ledger', 'blockchain mining', 'blockchain security', 'crypto mining', 'crypto wallet', 'crypto trading', 'blockchain protocol', 'tokenization', 'digital currency', 'crypto investment'],
      'Cybersecurity': ['cybersecurity', 'security', 'infosec', 'hacking', 'cyberattack', 'pentesting', 'vulnerability', 'cyber defense', 'network security', 'cybercrime', 'security breach', 'security audit', 'ethical hacking', 'cybersecurity strategy', 'security measures', 'cybersecurity risk', 'security analyst', 'endpoint security', 'firewall', 'intrusion detection', 'security operations', 'data protection', 'incident response', 'security awareness', 'threat intelligence', 'information security', 'cybersecurity framework', 'security policy'],
      'Data Science': ['data', 'data science', 'analytics', 'big data', 'data mining', 'data analysis', 'data visualization', 'data scientist', 'data analytics', 'big data analytics', 'data engineering', 'data architecture', 'data processing', 'data-driven', 'data insights', 'data modeling', 'data warehouse', 'data integration', 'data governance', 'data quality', 'machine learning', 'deep learning', 'data mining', 'predictive analytics', 'data lake', 'data pipeline', 'business intelligence', 'data analysis tools'],
      'Cloud': ['cloud', 'cloud computing', 'aws', 'azure', 'google cloud', 'cloud platform', 'cloud services', 'cloud infrastructure', 'cloud deployment', 'cloud solutions', 'cloud engineer', 'cloud architecture', 'cloud migration', 'cloud security', 'cloud storage', 'serverless', 'containerization', 'kubernetes', 'docker', 'serverless computing', 'cloud-native', 'cloud automation', 'cloud networking', 'cloud monitoring', 'multi-cloud', 'cloud scalability', 'cloud performance', 'cloud cost']
  };

  // Liste des catégories
  const categories = Object.keys(categoryKeywords);

  let maxMatchCount = 0;
  let selectedCategory = 'Other';

  // Parcourir chaque catégorie et compter les correspondances de mots-clés
  categories.forEach(category => {
      const categoryWords = categoryKeywords[category];
      let matchCount = 0;

      // Vérifier chaque mot-clé de la catégorie
      categoryWords.forEach(keyword => {
          // Vérifier la présence de chaque mot-clé dans la description
          if (keywords.includes(keyword)) {
              matchCount++;
          } else {
              // Si le mot-clé n'est pas présent, vérifier s'il y a des mots similaires dans la description
              const similarWords = keywords.split(' ').filter(word => levenshtein(word, keyword) <= 2);
              if (similarWords.length > 0) {
                  matchCount++;
              }
          }
      });

      // Mettre à jour la catégorie sélectionnée si le nombre de correspondances est le plus élevé
      if (matchCount > maxMatchCount) {
          maxMatchCount = matchCount;
          selectedCategory = category;
      }
  });

  return selectedCategory;
}

const scrapeWebsite = async () => {
  try {
    const response = await axios.get('https://www.creative-tim.com/blog');
    const $ = cheerio.load(response.data);

    const savePromises = [];

    const userId = '65d9cf70627d92f6a1c70e30'; // Identifiant d'utilisateur

    $('.post-excerpt').each(async (index, element) => {
      const title = $(element).text().trim();
      const description = $(element).contents().filter((_, node) => node.nodeType === 3).text().trim();
      
      // Vérifier si un article avec le même titre existe déjà dans la base de données
      const existingArticle = await Blog.findOne({ title });

      // Si un article avec le même titre est trouvé, ignorer cet article
      if (existingArticle) {
        console.log("Article déjà existant. Ignorer cet article:", title);
        return;
      }

      // Déterminer la catégorie de l'article
      const category = getCategoryFromDescription(description);

      // Créer un nouvel article et le sauvegarder dans la base de données
      const newBlog = new Blog({ 
        title, 
        description, 
        content: description, // Utiliser la description comme contenu de l'article
        category, // Ajouter la catégorie déterminée
        userId, // Utiliser l'identifiant d'utilisateur spécifié
      });

      savePromises.push(newBlog.save().then(savedBlog => {
        console.log("Article saved:", savedBlog);
      }).catch(error => {
        console.error("Erreur lors de l'enregistrement de l'article:", error);
      }));
    });

    await Promise.all(savePromises);

  } catch (error) {
    console.error('Erreur lors du scraping :', error);
    throw error;
  }
};

module.exports = scrapeWebsite;
