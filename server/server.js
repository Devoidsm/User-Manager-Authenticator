//Imports
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();
const helmet = require("helmet");
//Controllers
const CoolTechController = require('./controller/cooltech.controller');
//port config
const port = process.env.PORT || 8000;
//App Config
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
//DB config
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);
const uri = "mongodb+srv://admin:admin123@capstonecluster.xb8ltuz.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri);
//Connections
mongoose.connection.once('open', function () {
    console.log("Server is connected to the database.");
})
mongoose.connection.on('error', function () {
    console.log('Connection to Mongo established.');
    console.log('Unable to connect to the database.');
    process.exit();
});
//Listening on port 8000
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})
//Routes
//OU Requests
//POST Request that adds new credential repo information to a division in an OU
app.post('/add-repo', CoolTechController.addCredRepo);
//PUT Request that updates a credential repo in a specified division in an OU
app.put('/update-repo', CoolTechController.updateCredRepo);
//PUT Request that removes a user from a division within an OU 
app.put('/unassign-division', CoolTechController.unassignDivision);
//PUT Request that removes a user from the OU's ouUsers array and all its divissionUsers array
app.put('/unassign-ou', CoolTechController.unassignOu);
//Get Request that gets all OUs that the user is given access to
app.get('/OU', CoolTechController.getAllOUs);
//PUT Request that assigns a user to a OU with the option to also assign to a division
app.put('/assign-user', CoolTechController.assignToOU);

//Users Requests
//POST Request that registers a new user after the credentials given are not in the DB already
app.post('/register', CoolTechController.newUserRegister);
//POST Request that logs the user in after checking credentials
app.post('/login', CoolTechController.userLogin);
//PUT Request that Updates a User's Role Users Table
app.put('/update-role-user', CoolTechController.updateUserRole);
//Get Request that fetches All Users usernames and roles from users Table
app.get('/allUsers', CoolTechController.getAllUsers);