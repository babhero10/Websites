/* Global variables */
const port = 5000;

/* Server */
// Express
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// method override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Routers
const userRouter = require('./routers/user');

// Ejs
app.set('view engine', 'ejs');

// Layout
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

// Statics files
app.use('/statics/', express.static('statics'));


app.get('/', (req, res) => {
    const user = {name: "Abdallah Elsayed", img: "https://yt3.ggpht.com/yti/APfAmoE7bXPMNW4bdn9QcSwgQqk_mytQzn0O7SfuyzjqDg=s88-c-k-c0x00ffffff-no-rj-mo"};
    res.render('articles/index', {user: user, login: true, cancle: 0});
});

// Routers
app.use('/user', userRouter);

app.listen(port, ()=>{console.log(`Server running on port ${port}`)});