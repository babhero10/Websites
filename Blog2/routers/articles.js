const express = require('express');
const articleRouter = express.Router();
const Article = require('./../modules/artilce');
const authorized = require('./../middleware/authorization');


articleRouter.get('/', async (req, res) => {
    res.send(await Article.find());
});

articleRouter.use(authorized);

articleRouter.get('/me_articles', async (req, res) => {
    res.send(await Article.find({auther_id: req.cookies.userData.id}));
});

articleRouter.get('/add', async (req, res) => {
    const article = new Article({
        auther_id: req.cookies.userData.id,
        title: "hello",
        description: "HELLLO",
        markdown: "Bye"
    });

    await article.save();
    res.send("saved!");
});

articleRouter.post('/add', async (req, res) => {

});

module.exports = articleRouter;