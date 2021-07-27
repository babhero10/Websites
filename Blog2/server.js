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
app.use('/user_images/', express.static('users_images'));

const authorized = require('./middleware/authorization');

app.get('/', authorized, (req, res) => {  
    const user = {
        name: req.userData.name,
        img: req.userData.img
    }  

    console.log(user);
    res.render('articles/index', {user: user, login: true, cancle: 0});
});

// Routers
app.use('/user', userRouter);

app.listen(port, ()=>{console.log(`Server running on port ${port}`)});