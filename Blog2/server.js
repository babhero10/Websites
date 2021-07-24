const port = 5000;

const express = require('express');
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello, World!");
});

app.listen(port, ()=>{console.log(`Server running on port ${port}`)});