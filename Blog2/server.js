/* Global variables */
const port = 5000;

/* Server */
// Express
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Data', {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true});


// Cookies
const cookieParser  = require('cookie-parser');
app.use(cookieParser());

// Sessions
const session = require('express-session');
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
}));

// flash
const flash = require('connect-flash');
app.use(flash());

// method override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Routers
const userRouter = require('./routers/user');
const articleRouter = require('./routers/articles');

// Ejs
app.set('view engine', 'ejs');

// Layout
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

// Statics files
app.use('/public/', express.static('public'));

const authorized = require('./middleware/authorization');

app.get('/', authorized, (req, res) => {  
    const user = {
        name: req.userData.name,
        img: req.userData.img
    }  

    const msg = req.flash('msg');
    let succ = false;
    let err = false;
    
    if (msg.length) {
        succ = msg[0].succ;
        err = msg[0].err;
    }

    res.render('articles/index', {user: user, login: true, cancle: 0, succ: succ, err: err});
});

// Routers
app.use('/user', userRouter);
app.use('/articles', articleRouter);

app.listen(port, ()=>{console.log(`Server running on port ${port}`)});