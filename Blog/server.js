/* Global variables */
const port = 5000;

/* Set express app */
const express = require('express');
const app = express();
const expressLayout = require('express-ejs-layouts');

app.set('view engine', 'ejs');
app.use(expressLayout);
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/statics', express.static('statics'));

/* Set routers */
app.get('/', (req, res) => {
    lastArticle = [{link: 'https://google.com', name: 'Google'},{link: 'https://facebook.com', name: 'Facebook'}];
    articles = [{
            title:"post one",
            author:"author one",
            createAt:new Date(),
            description:"des one"
        },
        {
            title:"post two",
            author:"author two",
            createAt:new Date(),
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. At expedita odit nam voluptas ducimus animi tenetur? Similique quis unde non at culpa amet ipsam porro consequatur et, illum blanditiis nihil!"
        },
        {
            title:"post three",
            author:"author three",
            createAt:new Date(),
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. At expedita odit nam voluptas ducimus animi tenetur? Similique quis unde non at culpa amet ipsam porro consequatur et, illum blanditiis nihil!"
        },
        {
            title:"post three",
            author:"author three",
            createAt:new Date(),
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. At expedita odit nam voluptas ducimus animi tenetur? Similique quis unde non at culpa amet ipsam porro consequatur et, illum blanditiis nihil!"
        }
        ];
    res.render('articles/index', {title: "home", lastArticles:lastArticle, articles:articles});
});

app.listen(port, () => {console.log(`Server running on port ${port}`)});
