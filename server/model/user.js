//Imports
const mongoose = require('mongoose');
//Users schema
let usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "normal"
    }
});
//Exporting User model
let Users = mongoose.model('User', usersSchema);
module.exports = Users;