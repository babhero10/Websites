const express = require('express');
const User = require('./../modules/user');
const multer = require('multer');
const path = require('path');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const saltRounds  = 10;

User.remove({}, ()=>{});

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

function uploadFile(req, res, next) {
    upload(req, null, function (err) {
        next()
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
    res.render('user/login', {cancle: true})
});

userRouter.get('/sign_up', async (req, res) => {
    res.render('user/signup', {cancle: true})
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
                        res.redirect('/');
                    } else {
                        res.redirect('/user/login');
                    }
                } catch (err) {
                    res.redirect('/user/login');
                }
            });
        } else {
            res.redirect('/user/login');
        }

    } catch(err) {
        res.send('error');
    }
});

userRouter.post('/sign_up', uploadFile, async (req, res) => {
    const {username, password, email} = req.body
    let hastPassword;

    try {
        hastPassword = await bcrypt.hash(password, saltRounds);
    } catch(err) {
        res.redirect('/user/sign_up')
    }
    
    let newUser = new User({
        name: username,
        password: hastPassword,
        email: email
    });
    
    
    if (req.file !== undefined)
        newUser.img = `/users_images/${req.file.filename}`;
    
    try {
        await newUser.save();
        res.cookie("userData", {id: newUser._id, name: newUser.name, img: newUser.img});
        res.redirect('/');
    } catch(err) {
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