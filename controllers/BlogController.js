const Blog = require('../models/blog');
const scrapeWebsite = require('../scrapers/scraper');

const levenshtein = require('js-levenshtein');

function getCategoryFromTitle(title) {
    const keywords = title.toLowerCase();

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
            // Vérifier la présence de chaque mot-clé dans le titre
            if (keywords.includes(keyword)) {
                matchCount++;
            } else {
                // Si le mot-clé n'est pas présent, vérifier s'il y a des mots similaires dans le titre
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


exports.createBlog = async (req, res) => {
    try {
        const { title, description, content, userId } = req.body; // Ajout de userId
        const category = getCategoryFromTitle(title);
        const newBlog = new Blog({ title, description, content, category, userId }); // Ajout de userId
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        Object.assign(blog, req.body);
        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        await blog.remove();
        res.json({ message: "Blog deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a comment to a blog post
exports.addComment = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const newComment = {
            userId: req.body.userId, // you can get the userId from the request
            text: req.body.text,
        };

        blog.comments.push(newComment);
        const updatedBlog = await blog.save();

        res.status(201).json(updatedBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getCommentsByBlogId = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json(blog.comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getBlogsByUser = async (req, res) => {
    try {
        const userId = req.params.userId; // Assuming you get the userId from the request parameters
        const blogs = await Blog.find({ userId: userId });

        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ message: "Blogs not found for the specified user" });
        }

        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Like a comment
exports.likeComment = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const commentId = req.params.commentId;
        const userId = req.body.userId;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const comment = blog.comments.id(commentId);
        comment.likes.push({ userId });

        const updatedBlog = await blog.save();

        res.status(201).json(updatedBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Dislike a comment
exports.dislikeComment = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const commentId = req.params.commentId;
        const userId = req.body.userId;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const comment = blog.comments.id(commentId);
        comment.dislikes.push({ userId });

        const updatedBlog = await blog.save();

        res.status(201).json(updatedBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
