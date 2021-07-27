const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        require: false
    },
    img: {
        type: String,
        default: "/users_images/defaultUser.jpg"
    }
});

const User = mongoose.model('users', userSchema);
module.exports = User;