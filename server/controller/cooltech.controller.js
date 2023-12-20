//Imports
const jwt = require('jsonwebtoken');
const NewCredRepo = require('../model/newRepo');
const OUModel = require('../model/OU');
const Users = require('../model/user');
//Key config
let jwtSecretKey = process.env.JWT_SECRET_KEY || "secret";

//Main OU Functions
//POST request that adds new credential repo ininputation to a division in an OU
exports.addCredRepo = async function (req, res) {
    //Get user token
    const token = req.headers['authorization'].split(' ')[1];
    //Save inputs from input data from req.body
    let inputOuName = req.body.inputOuName;
    let inputDivisionName = req.body.inputDivisionName;
    let inputRepoName = req.body.inputRepoName;
    let inputRepoUsername = req.body.inputRepoUsername;
    let inputRepoEmail = req.body.inputRepoEmail;
    let inputRepoPassword = req.body.inputRepoPassword;
    //Save data sent to client
    let sendResponse;
    try {
        //Decoded token to get user Info
        const decoded = jwt.verify(token, jwtSecretKey);
        //Search the OU with the inputted OU name for validation.
        let fetchedOU = await OUModel.findOne({ ouName: inputOuName });
        //Variable used to store the division's index
        let iDivision = 0;
        //When the user is in the OU's ouUsers or are admin
        if ((fetchedOU.ouUsers.indexOf(decoded.username) > -1) || (decoded.role == 'admin')) {
            //Search for the inputDivisionName's index
            iDivision = fetchedOU.divisions.findIndex(div => div.divisionName == inputDivisionName);
            //When the user is in the OU's ouUsers or are admin
            if ((fetchedOU.divisions[iDivision].divisionUsers.indexOf(decoded.username) > -1) || (decoded.role == 'admin')) {
                //Make new credRepo object with repo data inputs 
                let newRepo = new NewCredRepo({
                    repoName: inputRepoName,
                    repoEmail: inputRepoEmail,
                    repoUsername: inputRepoUsername,
                    repoPassword: inputRepoPassword

                });
                //When Repo Name is left Blank send response
                if (newRepo.repoName === '') {
                    sendResponse = {
                        message: `Repo name field is empty. Please add repo name as it is required`,
                        successKey: false
                    }
                    res.send(sendResponse);
                } else {
                    //foundRepo variable set to false by default
                    let foundRepo = false;
                    //Loop the credRepos List at division's index to check if the repoName already exists
                    fetchedOU.divisions[iDivision].credentialRepos.forEach((repo) => {
                        //If repoName already exists, foundRepo is updated to true
                        if (repo.repoName === newRepo.repoName) {
                            foundRepo = true;
                        }
                    })
                    //When foundRepo = false
                    if (!foundRepo) {
                        //Update where the ouName and divisionName = inputs and add the newRepo to the credRepos array in the division
                        await OUModel.updateOne(
                            { 'ouName': inputOuName, 'divisions.divisionName': inputDivisionName },
                            { $push: { 'divisions.$.credentialRepos': newRepo } }
                        )
                        //Send send response
                        sendResponse = {
                            message: `Success! New Credential Repository added to ${inputOuName} in the '${inputDivisionName}' division`,
                            successKey: true
                        }
                        res.send(sendResponse);
                    } else {
                        //When foundRepo = true then send response that repo already exists
                        sendResponse = {
                            message: `Repo already exists. Please use a non existing repoName when adding credential repos`,
                            successKey: false
                        }
                        res.send(sendResponse);
                    }
                }
            } else {
                //When user is not in division then Send response that the user does not have access to the division
                sendResponse = {
                    message: `Failed! You do not have access to this Division please speak with an Admin`,
                    successKey: false
                }
                res.send(sendResponse);
            }

        } else {
            //Send response that the user does not have access to the OU.
            sendResponse = {
                message: `Failed! You do not have access to this OU please speak with an Admin`,
                successKey: false
            }
            res.send(sendResponse);
        }
    } catch (err) {
        //Catch JWT request errors and send send response.
        sendResponse = {
            message: 'bad JWT Unauthorized request - Error!',
            successKey: false
        }
        res.send(sendResponse);
    }
}
//PUT request that updates a credential repo in a specified division in an OU
exports.updateCredRepo = async function (req, res) {
    //Get user token 
    const token = req.headers['authorization'].split(' ')[1];
    //Save Inputs from Form data
    //Data that stays the same after update
    let inputRepoName = req.body.inputRepoName;
    let inputDivisionName = req.body.inputDivisionName;
    let inputOuName = req.body.inputOuName;
    //Data that Changes after update
    let inputRepoEmail = req.body.inputRepoEmail;
    let inputRepoUsername = req.body.inputRepoUsername;
    let inputRepoPassword = req.body.inputRepoPassword;
    //Response variable used to store data sent to client
    let sendResponse;
    try {
        //Decoded token to get user's ininputation
        const decoded = jwt.verify(token, jwtSecretKey);
        //Search the OU with the input given OU name.
        let fetchedOU = await OUModel.findOne({ ouName: inputOuName });
        //Variables used to store indexes of the found divisions and credRepos
        let iDivision = 0;
        let credRepoIndex = 0;
        //When the user is in the OU's ouUsers List or admin
        if ((fetchedOU.ouUsers.indexOf(decoded.username) > -1) || (decoded.role == 'admin')) {
            //Search index of the inputDivisionName
            iDivision = fetchedOU.divisions.findIndex(div => div.divisionName == inputDivisionName);
            //Search index of the inputRepoName in the division at the iDivision
            credRepoIndex = fetchedOU.divisions[iDivision].credentialRepos.findIndex(repo => repo.repoName === inputRepoName);
            //Only When user role is admin or management 
            if ((decoded.role == 'management') || (decoded.role == 'admin')) {
                //If inputs contain data, update the FoundOU's repo values at their correct position 
                if (inputRepoUsername) {
                    fetchedOU.divisions[iDivision].credentialRepos[credRepoIndex].repoUsername = inputRepoUsername;
                }
                if (inputRepoEmail) {
                    fetchedOU.divisions[iDivision].credentialRepos[credRepoIndex].repoEmail = inputRepoEmail;
                }
                if (inputRepoPassword) {
                    fetchedOU.divisions[iDivision].credentialRepos[credRepoIndex].repoPassword = inputRepoPassword;
                }
                //Save the updated FoundOU and send response
                fetchedOU.save(function (err) {
                    if (err) {
                        sendResponse = {
                            message: `Error! Failed to update data: \n ${err}`,
                            successKey: false
                        }
                        res.send(sendResponse);
                    }
                    else {
                        sendResponse = {
                            message: `Success! Updated Credential Repo Complete: '${inputRepoName}' in ${inputOuName}'s ${inputDivisionName} division`,
                            successKey: true
                        }
                        res.send(sendResponse);
                    }
                });
            } else {
                //When the user role is not admin or management then send send response
                sendResponse = {
                    message: `Failed! You do not have Access to credential repo update permissions please Contact Admin for Assistance`,
                    successKey: false
                }
                res.send(sendResponse);
            }
        }
    } catch (err) {
        //Catch JWT authorization errors and send response
        sendResponse = {
            message: 'Error! Unauthorized request',
            successKey: false
        }
        res.send(sendResponse);
    }
}
//PUT Request that removes a user from the OU's ouUsers List and all its divissionUsers List
exports.unassignOu = async function (req, res) {
    //Get user token
    const token = req.headers['authorization'].split(' ')[1];
    //Save Inputs from form data
    let userName = req.body.userName;
    let ouName = req.body.ouName;
    //Response Variable to send to client
    let sendResponse;
    try {
        //Decoded token to get user informatation
        const decoded = jwt.verify(token, jwtSecretKey);
        //When user is admin
        if (decoded.role === 'admin') {
            //Remove the user from the ouUsers list based on username
            await OUModel.updateMany({ ouName: ouName }, { $pull: { ouUsers: userName } });
            //User is removed from all divisionUsers lists that are in that OU based on username
            await OUModel.updateMany({ ouName: ouName }, { $pull: { "divisions.$[].divisionUsers": userName } });
            //Response sent to client
            sendResponse = { message: `Success! In the OU:${ouName} Username: ${userName} has been unassigned`, successKey: true }
            res.send(sendResponse);
        } else {
            //When the user's role is not admin send response
            sendResponse = { message: `Failed! Admin is the Only role with permissions to unassign users from OU`, successKey: false }
            res.send(sendResponse);
        }
    } catch (err) {
        //Catch JWT authorization errors and send send response
        sendResponse = { message: 'Error! bad JWT - Unauthorized request', successKey: false }
        res.send(sendResponse);
    }
}
//PUT Request that removes a user from a division within an OU 
exports.unassignDivision = async function (req, res) {
    //Get user token
    const token = req.headers['authorization'].split(' ')[1];
    let userName = req.body.userName;
    //Save Inputs from Form data
    let ouName = req.body.ouName;
    let divisionName = req.body.divisionName;
    //Response Variable to send to client
    let sendResponse;
    try {
        //Decoded token to get user information
        const decoded = jwt.verify(token, jwtSecretKey);
        //When user is admin
        if (decoded.role === 'admin') {
            //Remove user from the division Users List based on OU name and division name
            await OUModel.updateOne({ "ouName": ouName, "divisions.divisionName": divisionName }, { $pull: { "divisions.$.divisionUsers": userName } });
            //Response sent to client
            sendResponse = { message: `Success! In the Division:${divisionName} Username: ${userName} has been unassigned`, successKey: true }
            res.send(sendResponse);
        } else {
            //When the user's role is not admin send response
            sendResponse = { message: `Failed! Admin is the Only role with permissions to unassign users from Divisions`, successKey: false }
            res.send(sendResponse);
        }
    } catch (err) {
        //Catch JWT authorization errors and send send response
        sendResponse = { message: 'Error! bad JWT - Unauthorized request', successKey: false }
        res.send(sendResponse);
    }
}
//PUT Request that assigns a user to a OU and assign to a division inside OU
exports.assignToOU = async function (req, res) {
    // Get user token from req.headers.
    const token = req.headers['authorization'].split(' ')[1];
    //Save Inputs from input data
    let selectedUserName = req.body.selectedUserName;
    let selectedOU = req.body.selectedOU;
    let selectedDivision = req.body.selectedDivision;
    //Response to send to client
    let sendResponse;
    try {
        //Decoded token to get user's information
        const decoded = jwt.verify(token, jwtSecretKey);
        //Search the OU with the selectedOU name
        let fetchedOU = await OUModel.findOne({ ouName: selectedOU });
        //Variables used to store the found Division index
        let iDivision = 0;
        //When the user is admin
        if ((decoded.role == 'admin')) {
            //If the user exists in the OU and is not being assigned to a division
            if ((fetchedOU.ouUsers.includes(selectedUserName)) && (selectedDivision === 'none')) {
                //Send response user cannot be updated to same OU
                sendResponse = { message: `Failed! User is currently assigned to OU: '${fetchedOU.ouName}' Unable to assign to the same OU`, successKey: false }
                res.send(sendResponse);
            }
            //If the user exists in the OU and is only being assigned to a division
            else if ((fetchedOU.ouUsers.includes(selectedUserName)) && (selectedDivision != 'none')) {
                //Search for the index of inputDivisionName
                iDivision = fetchedOU.divisions.findIndex(div => div.divisionName == selectedDivision);
                //If the user exists in this division send response
                if (fetchedOU.divisions[iDivision].divisionUsers.includes(selectedUserName)) {
                    sendResponse = {
                        message: `Failed! User is already assigned to Division: '${fetchedOU.divisions[iDivision].divisionName}' in OU: '${fetchedOU.ouName}'. Cannot assign to same division.`,
                        successKey: false
                    }
                    res.send(sendResponse);
                }
                //If the selected user is not already assigned to this division 
                else {
                    //Add the userName to the selected Division's division Users List
                    fetchedOU.divisions[iDivision].divisionUsers.push(selectedUserName);
                    //Save the updated FoundOU with user added to division and send response
                    fetchedOU.save(function (err, data) {
                        if (err) {
                            sendResponse = {
                                message: `Error! Failed to update data: \n ${err}`,
                                successKey: false,
                            }
                            res.send(sendResponse);
                        }
                        else {
                            sendResponse = {
                                message: `Success! User is now in Division: '${selectedDivision}'. `,
                                successKey: true
                            }
                            res.send(sendResponse);
                        }
                    });
                }
            }
            //If the user being assigned to an OU only 
            else if ((!fetchedOU.ouUsers.includes(selectedUserName)) && (selectedDivision === 'none')) {
                //Add the user to the ouUsers list
                fetchedOU.ouUsers.push(selectedUserName);
                //Save updated fetchedOU to OU and send response
                fetchedOU.save(function (err, data) {
                    if (err) {
                        sendResponse = { message: `Error! Failed to save updated data: \n ${err}`, successKey: false }
                        res.send(sendResponse);
                    }
                    else {
                        sendResponse = { message: `Success! User is now in OU: '${fetchedOU.ouName}'. `, successKey: true }
                        res.send(sendResponse);
                    }
                });
            }
            //If the user is being assigned to both an OU and a Division    
            else if ((!fetchedOU.ouUsers.includes(selectedUserName)) && (selectedDivision != 'none')) {
                //Search for the index of inputDivisionName
                iDivision = fetchedOU.divisions.findIndex(div => div.divisionName == selectedDivision);
                //Add user to the ouUsers List
                fetchedOU.ouUsers.push(selectedUserName);
                //Add user to the selected Division's division Users List
                fetchedOU.divisions[iDivision].divisionUsers.push(selectedUserName);
                //Save the updated FoundOU with user added to both OU and Division then send response
                fetchedOU.save(function (err, data) {
                    if (err) {
                        sendResponse = { message: `Error! Failed to update data ${err}`, successKey: false }
                        res.send(sendResponse);
                    }
                    else {
                        sendResponse = {
                            message: `Success! User is assigned to OU: '${fetchedOU.ouName}' and Division: '${fetchedOU.divisions[iDivision].divisionName}'.`,
                            successKey: true
                        }
                        res.send(sendResponse);
                    }
                });
            }
            //In case unforseen errors are present
            else {
                sendResponse = { message: `An unkown error occured`, successKey: false }
                res.send(sendResponse);
            }
        } else {
            //If user is not admin send response denyning access
            sendResponse = {
                message: `Failed! This Could Be cause Some fields are left Open`,
                successKey: false
            }
            res.send(sendResponse);
        }
    } catch (err) {
         //Catch JWT authorization errors in a response
        sendResponse = { message: `Access Denied! Only admin have permissions to assign users to OUs and Divisions`, successKey: false }
        res.send(sendResponse);
    }
}
//Get Request that gets all OUs that the user is given access to
exports.getAllOUs = function (req, res) {
    //Get user token
    const token = req.headers['authorization'].split(' ')[1];
    //Empty sendResponse to store data sent to client
    let sendResponse;
    //List to store OUs.
    let OUsArray = [];
    try {
        //Decoded token for user data
        const decoded = jwt.verify(token, jwtSecretKey);
        //Search all OUs that the user has access to
        OUModel.find((err, OUs) => {
            //When there's an error, send response:
            if (err) {
                sendResponse = { message: 'Error! You do not have access to these OUs.', error: err }
            }
            else {
                //Loop all OUs:
                OUs.map((OU) => {
                    //Initialise empty object to store a All data from OU Model
                    let currentOU = new Object();
                    currentOU.ouName = '';
                    currentOU.divisions = [];
                    //When the user is in OU OR are admin then add the ouName to the currentOU   
                    if (OU.ouUsers.includes(decoded.username) || decoded.role == 'admin') {
                        currentOU.ouName = OU.ouName;
                    }
                    //Only Admin can see the ouUsers in each OU and add ouUsers to the currentOU object
                    if (decoded.role === 'admin') {
                        currentOU.ouUsers = OU.ouUsers;
                    }
                    //Each division found in the OU's divisions List  
                    OU.divisions.forEach((division) => {
                        //Empty object to store a current division's data
                        let currentDivision = new Object();
                        //When the user is admin 
                        if (decoded.role == 'admin') {
                            //Save the division Name, credRepos and division Users in the current Division
                            currentDivision.divisionName = division.divisionName;
                            currentDivision.divisionUsers = division.divisionUsers;
                            currentDivision.credentialRepos = [];
                            //Each repo found in this division's credRepos List
                            division.credentialRepos.forEach((repo) => {
                                //currentRepo variable used to save the repo data 
                                let currentRepo = new Object();
                                currentRepo.repoName = repo.repoName;
                                currentRepo.repoEmail = repo.repoEmail;
                                currentRepo.repoUsername = repo.repoUsername;
                                currentRepo.repoPassword = repo.repoPassword;
                                //Add the currentRepo to the currentDivision object's credRepos List
                                currentDivision.credentialRepos.push(currentRepo);
                            })
                            //Add the currentDivision object to the currentOU object's divisions List
                            currentOU.divisions.push(currentDivision);
                        }
                        //When the user is in the division Users List but not admin
                        else if (division.divisionUsers.includes(decoded.username) && decoded.role != 'admin') {
                            //Initialise Empty current Division object without division Users List
                            let currentDivision = new Object();
                            currentDivision.divisionName = division.divisionName;
                            currentDivision.credentialRepos = [];
                            //For Each credRepo an object is used to store the repo data and Add it to the division's credRepos List
                            division.credentialRepos.forEach((repo) => {
                                let currentRepo = new Object();
                                currentRepo.repoName = repo.repoName;
                                currentRepo.repoEmail = repo.repoEmail;
                                currentRepo.repoUsername = repo.repoUsername;
                                currentRepo.repoPassword = repo.repoPassword;
                                currentDivision.credentialRepos.push(currentRepo);
                            })
                            //Adds the currentDivision to the OU's divisions List.
                            currentOU.divisions.push(currentDivision);
                        }
                    })
                    //If the currentOU's ouName property is not Null then add it to the OuList
                    if (currentOU.ouName != '') {
                        OUsArray.push(currentOU);
                    }
                })
                //send response with user and OU data
                sendResponse = {
                    message: 'Success! Your JWT was verified and you have access to these OUs.',
                    username: decoded.username,
                    role: decoded.role,
                    OUs: OUsArray
                }
                //Send response to client
                res.send(sendResponse);
            }//While sorted in ascending order
        }).sort({ "_id": 1 })
    } catch (err) {
        //Catch errors in a send response
        sendResponse = {
            message: 'Error! Unauthorized request - bad JWT.',
            data: err
        }
        res.send(sendResponse);
    }
}
//Main User Functions
//Logs the user in after checking credentials
exports.userLogin = async function (req, res) {
    //Response object is used to store data sent to the client
    let customResponse = {};
    //Searches for user in the users table based on the username and password given
    const user = await Users.findOne({
        username: req.body.username,
        password: req.body.password
    });
    //If no user is found then send custom message
    if (!user) {
        customResponse = { 
            message: 'Incorrect Login! Unable to find user with credentials given'
        }
        res.send(customResponse);
    }
    //When the user is found
    else {
        //Give Payload the user's values  
        payload = { 
            'username': user.username, 
            'password': user.password, 
            'role': user.role 
        }
        // Generate token.
        const token = jwt.sign(JSON.stringify(payload), jwtSecretKey, { algorithm: 'HS256' });
        //Update SendResponse with data to sent to the client
        customResponse = { 
            message: 'User found!', 
            username: user.username, 
            password: user.password,
            token: 'Bearer ' + token 
        }
        res.send(customResponse);
    }
}
//Registers a new user after the credentials given are not in the DB already
exports.newUserRegister = async function (req, res) {
    //Response used to store data sent to the client
    let customResponse = {};
    //Searches for user in the users table based on the username and password given
    const userIsFound = await Users.findOne({
        username: req.body.username
    });
    //If user is found then send custom message
    if (userIsFound) {
        customResponse = {
            message: `User already exists. Please register with different credentials or login with existing credentials.`,
            successKey: false
        }
        res.send(customResponse);
    }
    //When there is no user Found
    else {
        //newUser with credentials given and the Role by default on New users are normal
        let newUser = new Users({
            username: req.body.username,
            password: req.body.password
        });
        //Save newUser to Users table and send response
        newUser.save(function (err, data) {
            if (err) {
                customResponse = { 
                    message: 'Error saving new user!', 
                    successKey: false, data: err 
                }
                res.send(customResponse);
            }
            else {
                //Give Payload the user's values 
                payload = { 'username': newUser.username, 'password': newUser.password, 'role': newUser.role }
                //Generate JWT token.
                const token = jwt.sign(JSON.stringify(payload), jwtSecretKey, { algorithm: 'HS256' });
                //Send response with newUser data
                customResponse = {
                    message: 'New user registered and found!', 
                    successKey: true,
                    username: newUser.username,
                    password: newUser.password, 
                    token: 'Bearer ' + token
                }
                res.send(customResponse);
            }
        })
    }
}
// Updates a user's role in the Users collection.
exports.updateUserRole = async function (req, res) {
    // Get user token from req.headers.
    const token = req.headers['authorization'].split(' ')[1];
    //fetch Inputs from the form data
    let selectedUserName = req.body.selectedUserName;
    let selectedRole = req.body.selectedRole;
    //Response used to stored data send to the client
    let customResponse;
    //Variable used to store previous user role for validation
    let oldUserRole;
    try {
        //Decode token to get user's Info
        const decoded = jwt.verify(token, jwtSecretKey);
        //When the user is admin    
        if (decoded.role === 'admin') {
            //Search for the selected user
            let fetchedUser = await Users.findOne({ username: selectedUserName });
            //Store the Found user's previous user role
            oldUserRole = fetchedUser.role;
            //If the previous role is the same as the selected role then send error response
            if (oldUserRole === selectedRole) {
                customResponse = {
                    message: `Failed! ${selectedUserName} is already '${selectedRole}'. Please select a different role.`,
                    successKey: false
                }
                res.send(customResponse);
            } else {
                ///update the foundUser's role to the selected Role
                fetchedUser.role = selectedRole;
                //Store the updated foundUser and send Data
                fetchedUser.save(function (err, data) {
                    if (err) {
                        customResponse = {
                            message: `Error! Failed to save updated user role: \n ${err}`,
                            successKey: false,
                        }
                        res.send(customResponse);
                    }
                    else {
                        customResponse = {
                            message: `Success! ${selectedUserName}'s role has been changed from '${oldUserRole}' to '${selectedRole}'.`,
                            successKey: true
                        }
                        res.send(customResponse);
                    }
                });
            }
        } else {
            //if the user's role is not admin send:
            customResponse = {
                message: `Failed! Your JWT was verified but you do not have access to the 'users' collection.`,
                successKey: false
            }
            res.send(customResponse);
        }

    } catch (err) {
        // Catch any JWT authorization errors for a custom response.
        customResponse = { message: 'Error! bad JWT - Unauthorized request', data: err, successKey: false }
        res.send(customResponse);
    }
}
//Get request that fetches All Users usernames and roles from users Table
exports.getAllUsers = async function (req, res) {
    // Get user token from req.headers.
    const token = req.headers['authorization'].split(' ')[1];
    //An empty Response used to store data sent to the client
    let customResponse;
    //Variable allUsersData to store arrays of user objects
    let allUsersData = { "normalUsers": [], "managementUsers": [], "adminUsers": [] }
    try {
        //Decoded token to get user information
        const decoded = jwt.verify(token, jwtSecretKey);
        //When the user is admin
        if (decoded.role === 'admin') {
        //Search all OUs that the admin has access to
            Users.find((err, users) => {
                //When an error, send response
                if (err) {
                    console.log(err);
                    customResponse = {
                        message: 'Error! Your JWT was verified, but you do not have access to this collection.',
                        error: err
                    }
                }
                else {
                    //Map Loop the users table and store user data base on users role. 
                    users.map((user) => {
                        //When user's role is 'normal', add fillUser to allUsersData's normalUsers array
                        if (user.role === 'normal') {
                            fillUser = {
                                "_id": user._id,
                                "username": user.username,
                                "role": user.role
                            }
                            allUsersData.normalUsers.push(fillUser);
                        }
                        //When user's role is 'management', add fillUser to allUsersData's managementUsers array
                        else if (user.role === 'management') {
                            fillUser = {
                                "_id": user._id,
                                "username": user.username,
                                "role": user.role
                            }
                            allUsersData.managementUsers.push(user);
                        }
                        //When user's role is 'admin', create and add fillUser to allUsersData's adminUsers array
                        else if (user.role === 'admin') {
                            fillUser = {
                                "_id": user._id,
                                "username": user.username,
                                "role": user.role
                            }
                            allUsersData.adminUsers.push(user);
                        }
                    })
                    //send custom response with users data
                    customResponse = {
                        message: 'Success! Your JWT was verified and you have access to the Users collection.',
                        username: decoded.username,
                        role: decoded.role,
                        usersData: allUsersData
                    }
                    res.send(customResponse);
                }
            })
        } else {
            //When the user's role is not admin send custom response
            customResponse = {
                message: `Failed! Your JWT was verified but you do not have access to the 'users' collection.`,
                successKey: false
            }
            res.send(customResponse);
        }
    } catch (err) {
        //Catch any JWT authorization errors and send custom response
        customResponse = {
            message: 'Error! Unauthorized request - bad JWT.',
            data: err,
            successKey: false
        }
        res.send(customResponse);
    }
}