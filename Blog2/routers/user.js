const express = require('express');
const User = require('./../modules/user');
const multer = require('multer');
const path = require('path');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const fs = require('fs');
const saltRounds  = 10;

const storage = multer.diskStorage({
    destination: './public/users_images',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 10},
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('img');

function uploadFile(req, res, newUser) {
    
    upload(req, null, async function (err) {
        if (req.file !== undefined)
            newUser.img = `/users_images/${req.file.filename}`;
        try {
            await newUser.save();
        } catch(e) {
            console.log(e);
        }
        res.redirect('/');
    });
}

// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb(null, false);
    }
}

userRouter.get('/deleteAll', async (req, res) => {
    await User.deleteMany({}, ()=>{});
    res.send(await User.find());
}); 

userRouter.get('/login', (req, res) => {
    const msg = req.flash('msg');
    let succ = false;
    let err = false;
    
    if (msg.length) {
        succ = msg[0].succ;
        err = msg[0].err;
    }

    res.render('user/login', {cancle: true, succ: succ, err: err})
});

userRouter.get('/sign_up', async (req, res) => {
    const msg = req.flash('msg');
    let succ = false;
    let err = false;
    
    if (msg.length) {
        succ = msg[0].succ;
        err = msg[0].err;
    }
        
    res.render('user/signup', {cancle: true, succ: succ, err: err})
});

userRouter.post('/login', async (req, res) => {
    const {username, password} = req.body
    try {
        const found = await User.findOne({name: username});
        
        if (found) {
            bcrypt.compare(password, found.password, function (err, result) {
                try {
                    if (result) {
                        res.cookie("userData", {id: found._id, name: found.name, img: found.img});
                        req.flash('msg', {succ: "Login in successfully!", err: false});
                        res.redirect('/');
                    } else {
                        req.flash('msg', {succ: false, err: "Username or password not correct!"});
                        res.redirect('/user/login');
                    }
                } catch (err) {
                    req.flash('msg', {succ: false, err: "Something went wrong!"});
                    res.redirect('/user/login');
                }
            });
        } else {
            req.flash('msg', {succ: false, err: "Username or password not correct!"});
            res.redirect('/user/login');
        }

    } catch(err) {
        res.send('error');
    }
});

userRouter.post('/sign_up', async (req, res) => {

    const {username, password, re_password, email} = req.body
    let error = false;
        
    const emailRex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!username) {
        req.flash('msg', {succ: false, err: "Username required!"});
        error = true;
    }
    else if (!emailRex.test(email)) {
        req.flash('msg', {succ: false, err: "Not vaild email!"});
        error = true;
    } else if (!password) {
        req.flash('msg', {succ: false, err: "Password required!"});
        error = true;
    } else if (password !== re_password) {
        req.flash('msg', {succ: false, err: "Password don't match!"});
        error = true;
    } 

    let hastPassword;
    
    try {
        hastPassword = await bcrypt.hash(password, saltRounds);
    } catch(err) {
        req.flash('msg', {succ: false, err: "Something went wrong!"});
        error = true;
    }
    
    let newUser = new User({
        name: username,
        password: hastPassword,
        email: email
    });

    if (!error) {
        try {
            await newUser.save();
            res.cookie("userData", {id: newUser._id, name: newUser.name, img: newUser.img});
            req.flash('msg', {succ: "You have been added!", err: false});
            res.redirect('/');
        } catch(err) {
            req.flash('msg', {succ: false, err: "Something went wrong!"});
            res.redirect('/user/sign_up');
        }
    } else {
        
        res.redirect('/user/sign_up');
    }
    
});

userRouter.post('/logout', (req, res) => {
    res.clearCookie('userData');
    res.redirect('/');
});

userRouter.get('/all', async (req, res) => {
    res.send(await User.find());
});

module.exports = userRouter;