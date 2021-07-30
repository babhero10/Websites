const mongoose = require('mongoose');
const schema = mongoose.Schema;

const articleSchema = schema({
    auther_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    markdown: {
        type: String,
        required: true
    }
});

const Article = mongoose.model("article", articleSchema);
module.exports = Article;