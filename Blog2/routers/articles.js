const express = require('express');
const articleRouter = express.Router();
const Article = require('./../modules/artilce');
const User = require('./../modules/user');
const authorized = require('./../middleware/authorization');


articleRouter.get('/', async (req, res) => {
    const articles = await Article.find().sort({createdAt: -1});
    
    for (let i = 0; i < articles.length; i++) {
        const name = await User.findById(articles[i].auther_id).select('name');
        articles[i].auther = name.name;
    }

    let login = 0;
    let user = 0;

    if (req.cookies.userData) {
        user = {
            name: req.cookies.userData.name,
            img: req.cookies.userData.img
        }
        login = 1;
    }

    const msg = req.flash('msg');
    let succ = false;
    let err = false;
    
    if (msg.length) {
        succ = msg[0].succ;
        err = msg[0].err;
    }
    
    res.render('articles/index', {articles: articles, succ: succ, err: err, login: login, cancle: 0, user: user});
});

articleRouter.get('/show/:slug', async (req, res) => {
    let login = 0;
    let user = 0;

    if (req.cookies.userData) {
        user = {
            name: req.cookies.userData.name,
            img: req.cookies.userData.img
        }
        login = 1;
    }

    const msg = req.flash('msg');
    let succ = false;
    let err = false;
    
    if (msg.length) {
        succ = msg[0].succ;
        err = msg[0].err;
    }
    
    try {
        const article = await Article.findOne({ slug: req.params.slug});
        res.render('articles/show', {article: article, succ: succ, err: err, login: login, cancle: 0, user: user});
    } catch (err) {
        console.log(err);
    }
});

articleRouter.use(authorized);

articleRouter.get('/remove', async (req, res) => {
    await Article.remove({}, ()=>{});
    res.send('Removed!');
})

articleRouter.get('/me_articles', async (req, res) => {
    res.send(await Article.find({auther_id: req.cookies.userData.id}));
});

articleRouter.get('/add', (req, res) => {
    let login = 0;
    let user = 0;

    if (req.cookies.userData) {
        user = {
            name: req.cookies.userData.name,
            img: req.cookies.userData.img
        }
        login = 1;
    }

    const msg = req.flash('msg');
    let succ = false;
    let err = false;
    
    if (msg.length) {
        succ = msg[0].succ;
        err = msg[0].err;
    }
    
    res.render('articles/add', {article: new Article(), succ: succ, err: err, login: login, cancle: 0, user: user});
});


articleRouter.get('/edit/:id', async (req, res) => {
    let login = 0;
    let user = 0;

    if (req.cookies.userData) {
        user = {
            name: req.cookies.userData.name,
            img: req.cookies.userData.img
        }
        login = 1;
    }

    const msg = req.flash('msg');
    let succ = false;
    let err = false;
    
    if (msg.length) {
        succ = msg[0].succ;
        err = msg[0].err;
    }

    try {
        const article = await Article.findById(req.params.id);
        res.render('articles/edit', {article: article, succ: succ, err: err, login: login, cancle: 0, user: user});
    } catch(err) {
        console.log(err);
    }
});

articleRouter.delete('/remove/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.send("Hello")
});

articleRouter.post('/', async (req, res) => {

    const newArticle = new Article({
        auther_id: req.cookies.userData.id,
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    });

    try {
        await newArticle.save();
        req.flash('msg', {succ: "Add successfully!", err: false});
    } catch (e) {
        req.flash('msg', {succ: false, err: "Something went wrong!"});
    }
    res.redirect('/articles/me');
});

articleRouter.get('/me', async (req, res) => {
    const articles = await Article.find({auther_id: req.cookies.userData.id}).sort({createdAt: -1});

    let login = 0;
    let user = 0;

    if (req.cookies.userData) {
        user = {
            name: req.cookies.userData.name,
            img: req.cookies.userData.img
        }
        login = 1;
    }

    const msg = req.flash('msg');
    let succ = false;
    let err = false;
    
    if (msg.length) {
        succ = msg[0].succ;
        err = msg[0].err;
    }

    res.render('articles/user_articles', {articles: articles, succ: succ, err: err, login: login, cancle: 0, user: user});
});

module.exports = articleRouter;