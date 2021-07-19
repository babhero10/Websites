/* Global variables */
const port = 5000;

/* Set express app */
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.json());

/* Set routers */
app.get('/', (req, res) => {
    app.render('articles/index');
});

app.listen(port, () => {console.log(`Server running on port ${port}`)});
