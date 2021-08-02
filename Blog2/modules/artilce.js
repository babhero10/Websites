const mongoose = require('mongoose');
const schema = mongoose.Schema;
const slugify = require('slugify');
const marked = require('marked');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

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
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitized: {
        type: String,
        required: true
    }
}, { timestamps: true });

articleSchema.pre('validate', function (next) {
    
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }

    if (this.markdown) {
        this.sanitized = DOMPurify.sanitize(marked(this.markdown));
    }

    next();
});

const Article = mongoose.model("article", articleSchema);
module.exports = Article;