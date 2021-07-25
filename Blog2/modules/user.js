const mongoose = require('mongoose');
const schema = mongoose.Schema;

const User = schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})