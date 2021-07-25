const express = require('express');
const userRouter = express.Router();

userRouter.get('/login', (req, res) => {
    res.render('user/login', {cancle: true})
});

userRouter.get('/sign_up', (req, res) => {
    res.render('user/signup', {cancle: true})
});

userRouter.post('/login', (req, res) => {
    const user = {name: "Abdallah Elsayed", img: "https://yt3.ggpht.com/yti/APfAmoE7bXPMNW4bdn9QcSwgQqk_mytQzn0O7SfuyzjqDg=s88-c-k-c0x00ffffff-no-rj-mo"};
    res.render('articles/index', {user: user, login: true});
});

userRouter.post('/logout', (req, res) => {
    res.render('articles/index', {login: false});
});

module.exports = userRouter;