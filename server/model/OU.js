//Imports
const mongoose = require('mongoose');
//Credential Repos schema.
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
// Divisions schema.
let divisionSchema = new mongoose.Schema({
    divisionName: {
        type: String,
        required: true
    },
    divisionUsers: [],
    credentialRepos: [credentialRepoSchema]
});
//OU schema.
let organisationalUnitSchema = new mongoose.Schema({
    ouName: {
        type: String,
        required: true
    },
    ouUsers: [],
    divisions: [divisionSchema]
});
//Exporting OU model
let OUmodel = mongoose.model('OrganisationalUnit', organisationalUnitSchema);
module.exports = OUmodel;