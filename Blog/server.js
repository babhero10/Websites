/* Global variables */
const port = 5000;

/* Set express app */
const express = require('express');
const app = express();
const articleRouter = require('./routers/articles');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override')
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(expressLayout);
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/statics/', express.static('statics'));
app.use(methodOverride('_method'))

/* Set routers */
app.get('/', (req, res) => {
    res.send("hello");
    
});

app.use('/articles', articleRouter);

mongoose.connect("mongodb://localhost/articles", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(() => {
    app.listen(port, () => {console.log(`Server running on port ${port}`)})
})
.catch((err)=>{
    console.log(err);
});

