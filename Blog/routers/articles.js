const express = require('express');
const router = express.Router();
const Article = require('./../modules/articles');

router.get('/add', (req, res) => {
    res.render('articles/add', {title: 'Add article', article: new Article()});
});

router.get('/show/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug});
        res.render('articles/show', {title: article.title, article: article});
    } catch (err) {
        console.log(err);
    }
});

router.get('/edit/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        res.render('articles/edit', {title: "Edit", article: article});
    } catch(err) {
        console.log(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        let article = await Article.findById(req.params.id);
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        await article.save();
        res.redirect('/articles/all');
    } catch (err) {
        console.log(err);
    }
});


router.get('/all', async (req, res) => {

    
    try {
        const lastArticle = await Article.find().sort({createAt: -1}).limit(5);
        const articles = await Article.find().sort({createAt: -1});
        res.render('articles/index', {title: "home", lastArticles:lastArticle, articles:articles});
   } catch(e) {
        console.log(e);
   }
});

router.get('/:id', (req, res) => {
    res.send(req.params.id);
});


router.post('/', async (req, res) => {
    const article = new Article({
        author: 'Abdallah',
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    });
    
    try {
        const result = await article.save();
        res.redirect(`/articles/show/${result.slug}`);
    } catch (err) {
        console.log(err)
        res.render('articles/add', {title: 'Add article', article: article});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.redirect('/articles/all');
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;