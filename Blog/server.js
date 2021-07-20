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

/* Set routers */
app.get('/', (req, res) => {
    res.render('articles/index', {title: "home"});
});

app.listen(port, () => {console.log(`Server running on port ${port}`)});
