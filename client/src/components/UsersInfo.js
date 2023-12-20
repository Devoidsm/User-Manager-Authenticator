//Imports
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';
//Main UserInfo
export default function UserInfo({ orgData, setorgData, userData, allUsersData, setAllUsersData }) {
    //Default success value
    const [error, setError] = useState();
    //Default success value
    const [success, setSuccess] = useState();
    //Data From forms
    const [selectedUserName, setSelectedUserName] = useState();
    const [selectedRole, setSelectedRole] = useState();
    const [selectedOU, setSelectedOU] = useState();
    const [selectedDivision, setSelectedDivision] = useState();
    //Save token for CRUD request Authorization
    const userToken = userData.token;
    //When user is admin then gets all Users Data
    useEffect(() => {
        const getAllUsers = async () => {
            //Save the user's role
            const userRole = orgData.role;
            //When the user is admin
            if (userRole === 'admin') {
                //Save request uses for AllUsers request
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: userToken
                    }
                }
                //Send AllUsers request to server
                const response = await fetch('http://localhost:8000/allUsers', requestOptions);
                //Save JSON data from response
                const ReceiveData = await response.json();
                //When an error occurs then error = ReceiveData
                if (!response.ok) {
                    setError(ReceiveData);
                }
                //When no error occurs in the response then let error = null and make all Users Data = usersData
                if (response.ok) {
                    setError(null);
                    setAllUsersData(ReceiveData.usersData);
                }
            }
        }
        getAllUsers();
    }, [orgData.role, setAllUsersData, userToken])
    //Hides message when 'OK' button used
    const successHideHanler = () => {
        setSuccess(null);
    }
    //Hides message when 'OK' button used
    const errorHideHandler = () => {
        setError(null);
    }
    //Updates the user's role after Change User Role form is submitted
    const roleChangeHandler = async (e) => {
        //Stops page reload.
        e.preventDefault();
        //Save selected user data.
        const selectedUserData = { selectedUserName, selectedRole };
        //Save request options for User Roles request
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedUserData)
        };
        //Send User Roles request to Server
        const response = await fetch(`http://localhost:8000/update-role-user`, requestOptions);
        //Save ReceiveData
        const ReceiveData = await response.json();
        //When an error with the request occurs then error = ReceiveData
        if (!response.ok) {
            setError(ReceiveData);
        }
        //When theres no error with the requests
        if (response.ok) {
            //When the successKey is false
            if (!ReceiveData.successKey) {
                //Reset values so form can be re-used
                setSelectedUserName('');
                setSelectedRole('');
                setSuccess(null);
                //making error = ReceiveData's message
                setError(ReceiveData.message);
                //Error message timeout after 5 seconds
                setTimeout(() => { setError(null) }, 5000);

            } else {
                //When the successKey is true, reset values so form can be re-used
                setSelectedUserName('');
                setSelectedRole('');
                setError(null);
                //Save request options for allUsers request
                const getUsersRequestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: userToken
                    }
                }
                //Fetch all users data again so that its most recent version
                const usersResponse = await fetch('http://localhost:8000/allUsers', getUsersRequestOptions);
                const usersReceiveData = await usersResponse.json();
                setAllUsersData(usersReceiveData.usersData);
                //Save request options for OU request
                const getOUsRequestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: userToken
                    }
                }
                //Fetch all OU again so that its most recent version
                const ouResponse = await fetch('http://localhost:8000/OU', getOUsRequestOptions);
                const ouReceiveData = await ouResponse.json();
                setorgData(ouReceiveData);
                //Make success = ReceiveData's message
                setSuccess(ReceiveData.message);
                //Success message timeout after 5 seconds.
                setTimeout(() => { setSuccess(null) }, 5000);
            }
        }
    }
    //Assigns the selected user to an OU or Division when the Assign Users to OUs and Divisions form is submitted
    const handleAssignOU = async (e) => {
        //Stops page reload
        e.preventDefault();
        //Save selected OU
        const assignorgData = { selectedUserName, selectedOU, selectedDivision };
        //Save request options for PUT Assign User request.
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(assignorgData)
        };
        //Send Assign User request to server
        const response = await fetch(`http://localhost:8000/assign-user`, requestOptions);
        //Save JSON data from response.
        const ReceiveData = await response.json();
        //An error occurs with the request then let error = ReceiveData
        if (!response.ok) {
            setError(ReceiveData);
        }
        //No error occurs with the request 
        if (response.ok) {
            //When the ReceiveData successKey = false
            if (!ReceiveData.successKey) {
                //Resetting values so form can be re-used
                setSuccess(null);
                setSelectedOU('');
                setSelectedDivision('');
                setSelectedUserName('');
                //Making error to ReceiveData's message
                setError(ReceiveData.message);
                //Error message timeout after 5 seconds
                setTimeout(() => { setError(null) }, 5000);
            } else {
                //When the successKey = true reset values so form can be re-used
                setError(null);
                setSelectedOU('');
                setSelectedDivision('');
                setSelectedUserName('');
                //Save request options for AllUsers request
                const getUsersRequestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: userToken
                    }
                }
                //Fetch all usersData again so that its the latest version
                const usersResponse = await fetch('http://localhost:8000/allUsers', getUsersRequestOptions);
                const usersReceiveData = await usersResponse.json();
                setAllUsersData(usersReceiveData.usersData);
                //Save request options for OU request
                const getOUsRequestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: userToken
                    }
                }
                //Fetch all OUs again so that its the latest version
                const ouResponse = await fetch('http://localhost:8000/OU', getOUsRequestOptions);
                const ouReceiveData = await ouResponse.json();
                setorgData(ouReceiveData);
                //Making success = ReceiveData's message
                setSuccess(ReceiveData.message);
                //Error message timeout after 5 seconds.
                setTimeout(() => { setSuccess(null) }, 5000);
            }
        }
    }
    //When the User is admin and Data is valid then return the Menu with users and forms to update user Roles, OUs or Divisions
    if (allUsersData && orgData.role === 'admin') {
        return (
            <Card className="my-3 ms-2 me-3">
                <Tabs defaultActiveKey="allUsers" className="tabs">
                    {/*All Users Tab*/}
                    <Tab eventKey="allUsers" title="All Users" >
                        <Card.Body>
                            {/*Headers*/}
                            <Card.Title>All Users by Role</Card.Title>
                            <Card.Subtitle className="py-3 text-center">
                                Select a dropdown to view users
                            </Card.Subtitle>
                            {/*Accordion for Each Role*/}
                            <Accordion key="0">
                                {/*Normal Users Table*/}
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Normal Users</Accordion.Header>
                                    <Accordion.Body>
                                        <Table striped bordered hover className="normalUsersTable" >
                                            <thead >
                                                <tr>
                                                    <th>Username</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allUsersData.normalUsers.map((normalUser, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>{normalUser.username}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </Accordion.Body>
                                </Accordion.Item>
                                {/*Management Users Table*/}
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>Management Team</Accordion.Header>
                                    <Accordion.Body>
                                        <Table striped bordered hover className="managerUsersTable" >
                                            <thead >
                                                <tr>
                                                    <th>Username</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allUsersData.managementUsers.map((managementUser, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>{managementUser.username}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </Accordion.Body>
                                </Accordion.Item>
                                {/*Admin Users Table*/}
                                <Accordion.Item eventKey="2">
                                    <Accordion.Header>Admins</Accordion.Header>
                                    <Accordion.Body>
                                        <Table striped bordered hover className="adminUsersTable" >
                                            <thead>
                                                <tr>
                                                    <th>Username</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allUsersData.adminUsers.map((adminUser, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>{adminUser.username}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Card.Body>
                    </Tab>
                    {/*User Options Tab*/}
                    <Tab eventKey="userOptions" title="Options">
                        <Card.Body>
                            <Card.Title>User Options</Card.Title>
                            <Accordion>
                                {/*Assign Users to OUs and Divisions*/}
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>Assign Users</Accordion.Header>
                                    <Accordion.Body>
                                        {/*How to use text*/}
                                        <p className="userOptionInstructions">
                                            Choose the username, Choose a OU name and a Division to be assigned
                                        </p>
                                        {/* When error = true then show message Above form*/}
                                        {error &&
                                            <Container className="error border border-danger border-2">
                                                <Row>
                                                    <Col>
                                                        <p className="closeButton" onClick={errorHideHandler}>
                                                            OK
                                                        </p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <p>{error}</p>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        }
                                        {/* When success = true then show message above form. */}
                                        {success &&
                                            <Container className="success border border-success border-2">
                                                <Row>
                                                    <Col>
                                                        <p className="closeMessageButton" onClick={successHideHanler}>
                                                            OK
                                                        </p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <p>{success}</p>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        }
                                        {/*Assign User Form*/}
                                        <Form onSubmit={handleAssignOU} className="mx-auto" >
                                            {/*Choose User*/}
                                            <Form.Group as={Row} className="mb-3" controlId="formUser">
                                                <Form.Label column sm={5}>Username:</Form.Label>
                                                <Col sm={7}>
                                                    <Form.Select
                                                        value={selectedUserName}
                                                        onChange={e => setSelectedUserName(e.target.value)}
                                                    >
                                                        <option>Choose user...</option>
                                                        {/*Map Loop normal Users in the dropdown*/}
                                                        {allUsersData.normalUsers.map((normalUser, normalUseri) => {
                                                            return (
                                                                <option value={normalUser.username} key={normalUseri}>
                                                                    {normalUser.username} - {normalUser.role} user
                                                                </option>
                                                            )
                                                        })}
                                                        {/* Map Loop managemen tUsers in the dropdown*/}
                                                        {allUsersData.managementUsers.map((managementUser, managementUseri) => {
                                                            return (
                                                                <option value={managementUser.username} key={managementUseri}>
                                                                    {managementUser.username} - {managementUser.role} user
                                                                </option>
                                                            )
                                                        })}
                                                        {/*Map Loop admin Users in the dropdown*/}
                                                        {allUsersData.adminUsers.map((adminUser, adminUseri) => {
                                                            return (
                                                                <option value={adminUser.username} key={adminUseri}>
                                                                    {adminUser.username} - {adminUser.role} user
                                                                </option>
                                                            )
                                                        })}
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>
                                            {/*Choose New OU user is assigned to*/}
                                            <Form.Group as={Row} className="mb-3" controlId="formOU">
                                                <Form.Label column sm={5}>Assign to OU:</Form.Label>
                                                <Col sm={7}>
                                                    <Form.Select
                                                        value={selectedOU}
                                                        onChange={e => setSelectedOU(e.target.value)}
                                                    >
                                                        <option>Choose OU...</option>
                                                        {/*Map Loop OUs in the dropdown*/}
                                                        {orgData.OUs.map((OU, iOU) => {
                                                            return (
                                                                <option value={OU.ouName} key={iOU}>
                                                                    {OU.ouName}
                                                                </option>
                                                            )
                                                        })}
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>
                                            {/*Choose New Division user is assigned to*/}
                                            <Form.Group as={Row} className="mb-3" controlId="formDivision">
                                                <Form.Label column sm={5}>Assign to Division:</Form.Label>
                                                <Col sm={7}>
                                                    <Form.Select
                                                        value={selectedDivision}
                                                        onChange={e => setSelectedDivision(e.target.value)}
                                                    >
                                                        <option>Choose Division...</option>
                                                        <option value="none">none</option>
                                                        {/*Map Loop OU's and divisions in the dropdown*/}
                                                        {orgData.OUs.map((OU, iOU) => {
                                                            //When OU name === selectedOU then return its divisions in the dropdown
                                                            if (OU.ouName === selectedOU) {
                                                                return (
                                                                    OU.divisions.map((division, iDivision) => {
                                                                        return (
                                                                            <option
                                                                                value={division.divisionName}
                                                                                key={iDivision}
                                                                            >
                                                                                {division.divisionName} (OU: {OU.ouName})
                                                                            </option>
                                                                        )
                                                                    })
                                                                )
                                                            } else {
                                                                //This is for the Warning: Array.prototype.map() expects a value to be returned at the end of arrow function
                                                                return (
                                                                    <option key={iOU} hidden>(OU: {OU.ouName})</option>
                                                                )
                                                            }
                                                        })}
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>
                                            {/*Submit form button*/}
                                            <Form.Group as={Row} >
                                                <Col sm={{ span: 12 }}>
                                                    <Button type="submit" className="my-4" variant="success">Assign User</Button>
                                                </Col>
                                            </Form.Group>
                                        </Form>
                                    </Accordion.Body>
                                </Accordion.Item>
                                {/*Switch User Roles*/}
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Switch a User Role</Accordion.Header>
                                    <Accordion.Body>
                                        {/*How to Use text*/}
                                        <p className="userOptionInstructions">
                                            Select the Username and select the new role you want to assign them to
                                        </p>
                                        {/*When error = true then show error message*/}
                                        {error &&
                                            <Container className="error border border-danger border-2">
                                                <Row>
                                                    <Col>
                                                        <p className="closeButton" onClick={errorHideHandler}>OK</p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <p> {error}</p>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        }
                                        {/* When success state is true, display success message. */}
                                        {success &&
                                            <Container className="success border border-success border-2">
                                                <Row>
                                                    <Col>
                                                        <p className="closeButton" onClick={successHideHanler}>OK</p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <p> {success}</p>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        }
                                        {/*Switch Roles Form*/}
                                        <Form onSubmit={roleChangeHandler} className="mx-auto" >
                                            {/*Choose User dropdown*/}
                                            <Form.Group as={Row} className="mb-4" controlId="formUser">
                                                <Form.Label column sm={5}>Username:</Form.Label>
                                                <Col sm={7}>
                                                    <Form.Select
                                                        value={selectedUserName}
                                                        onChange={e => setSelectedUserName(e.target.value)}
                                                    >
                                                        <option>Choose user...</option>
                                                        {/*Map Loop normalUsers in the dropdown menu*/}
                                                        {allUsersData.normalUsers.map((normalUser, normalUseri) => {
                                                            return (
                                                                <option value={normalUser.username} key={normalUseri}>
                                                                    {normalUser.username} - {normalUser.role} user
                                                                </option>
                                                            )

                                                        })}
                                                        {/*Map Loop managementUsers in the dropdown menu*/}
                                                        {allUsersData.managementUsers.map((managementUser, managementUseri) => {
                                                            return (
                                                                <option value={managementUser.username} key={managementUseri}>
                                                                    {managementUser.username} - {managementUser.role} user
                                                                </option>
                                                            )
                                                        })}
                                                        {/* Map Loop adminUsers in the dropdown menu*/}
                                                        {allUsersData.adminUsers.map((adminUser, adminUseri) => {
                                                            return (
                                                                <option value={adminUser.username} key={adminUseri}>
                                                                    {adminUser.username} - {adminUser.role} user
                                                                </option>
                                                            )
                                                        })}
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>
                                            {/*Choose New Role dropdown*/}
                                            <Form.Group as={Row} className="mb-4" controlId="formUser">
                                                <Form.Label column sm={5}>Switch Role To:</Form.Label>
                                                <Col sm={7}>
                                                    <Form.Select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
                                                        <option>Choose new role...</option>
                                                        <option value="admin">Admin</option>
                                                        <option value="management" >Management</option>
                                                        <option value="normal" >Normal</option>
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>
                                            {/*Submit button*/}
                                            <Form.Group as={Row} >
                                                <Col sm={{ span: 12 }}>
                                                    <Button type="submit" className="my-5" variant="success">Switch user role</Button>
                                                </Col>
                                            </Form.Group>
                                        </Form>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Card.Body>
                    </Tab>
                </Tabs>
            </Card>
        )
    }
}