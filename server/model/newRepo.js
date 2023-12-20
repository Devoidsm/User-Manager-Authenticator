//Imports
const mongoose = require('mongoose');
//Credential Repos schema
let credentialRepoSchema = new mongoose.Schema({
    repoName: {
        type: String,
        required: true
    },
    repoEmail: {
        type: String,
        required: true
    },
    repoUsername: {
        type: String,
        required: true
    },
    repoPassword: {
        type: String,
        required: true
    }
});
//Exporting CredRepo model.
let NewCredRepo = mongoose.model('NewCredentialRepo', credentialRepoSchema);
module.exports = NewCredRepo;