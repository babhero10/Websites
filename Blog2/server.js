/* Global variables */
const port = 5000;

/* Server */
// Express
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Ejs
app.set('view engine', 'ejs');

// Layout
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);


app.get('/', (req, res) => {
    res.send("Hello, World!");
});

app.listen(port, ()=>{console.log(`Server running on port ${port}`)});