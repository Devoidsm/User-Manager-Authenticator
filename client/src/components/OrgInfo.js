//Imports
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
//main OrgInfo function
export default function OrgInfo({
    orgData,
    userData,
    setorgData,
    setFormOuName,
    setFormDivisionName,
    setFormRepoName,
    setShowAddRepoForm,
    setShowEditRepoForm
}) {
    //function used to Display the AddRepoForm to add new credential repos to the OU and Division selected
    const addRepoDisplayForm = async (divisionName, ouName) => {
        // Set form's OU and Division states to the inputted parameters.
        setFormDivisionName(divisionName);
        setFormOuName(ouName);
        // Set showAddRepoForm state to true (to display it in the Forms column).
        setShowAddRepoForm(true);
    }
    //Function used to Displays the EditRepoForm to edit the repo's data in the tables 
    const editRepoDisplayForm = async (repoName, divisionName, ouName) => {
        ///Set states to inputs
        setFormRepoName(repoName);
        setFormDivisionName(divisionName);
        setFormOuName(ouName);
        //make EditRepoForm visible
        setShowEditRepoForm(true);
    }
    //Function used to Removes a user from the OU's and from all its Divisions
    const unassignOU = async (userName, ouName) => {
        //Save token for CRUD request's Authorization
        const userToken = userData.token;
        //Request body variable for requestUse
        let requestBody = {
            "userName": userName,
            "ouName": ouName
        }
        //Request options for PUT Unassign user from OU request
        const requestUse = {
            method: 'PUT',
            headers: {
                Authorization: userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };
        //PUT Unassign OU request to server
        const response = await fetch('http://localhost:8000/unassign-ou', requestUse);
        //Save JSON data from response
        const jsonUnassignData = await response.json();
        //When an error occurs with the request then set error to jsonData
        if (!response.ok) { setError(jsonUnassignData); }
        // If there is no error with the fetch request:
        if (response.ok) {
            //When jsonData success = false
            if (!jsonUnassignData.successKey) {
                //Make success = null
                setSuccess(null);
                //Make error to jsonData's message.
                setError(jsonUnassignData.message);
                //Error message timeout after 5 seconds.
                setTimeout(() => { setError(null) }, 5000);
            } else {
                //success = true then set error = null
                setError(null);
                //Save requestUse for OU request
                const getOUsrequestUse = {
                    method: 'GET',
                    headers: {
                        Authorization: userToken
                    }
                }
                //Fetch all OU data again so that it is the most recent version
                const response = await fetch('http://localhost:8000/OU', getOUsrequestUse);
                const jsonOUsData = await response.json();
                setorgData(jsonOUsData);
                //Set success to jsonUnassignData's message
                setSuccess(jsonUnassignData.message);
                //Success message timeout after 5 seconds.
                setTimeout(() => { setSuccess(null) }, 5000);
            }
        }
    }
    //Function used to Remove a user from a division in an OU
    const unassignDivision = async (userName, ouName, divisionName) => {
        //Save token for request Authorization
        const userToken = userData.token;
        //Request body variable for requestUse
        let requestBody = {
            "userName": userName,
            "ouName": ouName,
            "divisionName": divisionName
        }
        //Save request uses for PUT Unassign Division request
        const requestUse = {
            method: 'PUT',
            headers: {
                Authorization: userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };
        //PUT Unassign Division request to Server
        const response = await fetch('http://localhost:8000/unassign-division', requestUse);
        //Save JSON data from response
        const jsonUnassignData = await response.json();
        //When an error with the request occurs then set error = jsonData
        if (!response.ok) { setError(jsonUnassignData); }
        //When no error with the fetch request:
        if (response.ok) {
            // If the jsonData successKey is false:
            if (!jsonUnassignData.successKey) {
                //Set success key = null
                setSuccess(null);
                //Make error = jsonData's message
                setError(jsonUnassignData.message);
                //Error message timeout after 5 seconds
                setTimeout(() => { setError(null) }, 5000);
            } else {
                //When success = true then set error = null
                setError(null);
                //Save request uses for GET OU request
                const getOUsrequestUse = {
                    method: 'GET',
                    headers: {
                        Authorization: userToken
                    }
                }
                //Fetch all OUs again so that it is in its most recent version
                const response = await fetch('http://localhost:8000/OU', getOUsrequestUse);
                const jsonOUsData = await response.json();
                setorgData(jsonOUsData);
                //Make success state = jsonUnassignData's message
                setSuccess(jsonUnassignData.message);
                //Success message timeout after 5 seconds
                setTimeout(() => { setSuccess(null) }, 5000);
            }
        }
    }
    //default success state
    const [success, setSuccess] = useState();
    //default error state
    const [error, setError] = useState();
    //When succes's 'OK' button is clicked it will remove the notification
    const successHideHanler = () => {
        setSuccess(null);
    }
    //When error's 'OK' button is clicked it will remove the notification
    const errorHideHandler = () => {
        setError(null);
    }
    //Main Return
    return (
        <>  {/*When success occurs then display success message above OU information*/}
            {success &&
                <Container className="successMessage border border-success border-3 mb-4">
                    <Row>
                        <Col className="text-end">
                            <p className="closeMessageButton" onClick={successHideHanler}>
                                close
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
            {/*When an error occurs then display error message above OU information*/}
            {error &&
                <Container className="errorMessage border border-error border-3 mb-4">
                    <Row>
                        <Col className="text-end">
                            <p className="closeButton" onClick={errorHideHandler}>
                                close
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
            {/*OU Information*/}
            {/*Map Loop OUs and return with OU information*/}
            {orgData.OUs.map((OU, iUnits) => {
                //assignedToDiv variable default set to false
                let assignedToDiv = false;
                //If the OU's divisions length is greater than 0 then the user is in that division
                if (OU.divisions.length > 0) {
                    assignedToDiv = true;
                }
                //When user is assigned to divisions in this OU, return all data
                if (assignedToDiv) {
                    return (
                        <Card key={iUnits} className="my-4 ms-4 me-3">
                            <Tabs defaultActiveKey="credentialRepos" className="tabs">
                                {/*Credential Repos Tab*/}
                                <Tab eventKey="credentialRepos" title="Repositories">
                                    <Card.Body key={iUnits} className="overviewDetails">
                                        {/* Credential Repos title. */}
                                        <Card.Title>Credential Repositories for: {OU.ouName}</Card.Title>
                                        {/*Map orUnit's divisions and return wrapper with division names with a table of credential repos for that division*/}
                                        {OU.divisions.map((division, divisionIndex) => {
                                            return (
                                                <Accordion defaultActiveKey="0" key={divisionIndex}>
                                                    <Accordion.Item eventKey={divisionIndex}>
                                                        {/*Name of Division*/}
                                                        <Accordion.Header>{division.divisionName}</Accordion.Header>
                                                        {/*Table of Repos for current division*/}
                                                        <Accordion.Body>
                                                            <Table striped bordered hover className="ouTable" >
                                                                <thead >
                                                                    <tr className="text-center">
                                                                        <th>Repo Name</th>
                                                                        <th>Username</th>
                                                                        <th>Email</th>
                                                                        <th>Password</th>
                                                                        {/*When user is not admin/management, hide Update Credentials button*/}
                                                                        {(orgData.role === 'admin' || orgData.role === 'management') &&
                                                                            <th>Update Credentials</th>
                                                                        }
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {/*Map Loop current division's credRepos and show data in table*/}
                                                                    {division.credentialRepos.map((repo, repoIndex) => {
                                                                        return (
                                                                            <tr key={repoIndex}>
                                                                                <td>{repo.repoName}</td>
                                                                                <td>{repo.repoUsername}</td>
                                                                                <td>{repo.repoEmail}</td>
                                                                                <td>{repo.repoPassword}</td>
                                                                                {/*If user is not admin/management, hide Update button for EditRepoForm*/}
                                                                                {(orgData.role === 'admin' || orgData.role === 'management') &&
                                                                                    <td>
                                                                                        <Button
                                                                                            variant="warning"
                                                                                            size="sm"
                                                                                            className="editRepoButton"
                                                                                            onClick={() => editRepoDisplayForm(
                                                                                                repo.repoName,
                                                                                                division.divisionName,
                                                                                                OU.ouName
                                                                                            )}
                                                                                        >
                                                                                            Edit
                                                                                        </Button>
                                                                                    </td>
                                                                                }
                                                                            </tr>
                                                                        )
                                                                    })}
                                                                    <tr>
                                                                        {/*Add CredRepo button that shows the addRepoDisplayForm*/}
                                                                        <td colSpan={5}>
                                                                            <Button
                                                                                variant="success"
                                                                                size="sm"
                                                                                className="addRepoButton"
                                                                                onClick={() => addRepoDisplayForm(
                                                                                    division.divisionName,
                                                                                    OU.ouName
                                                                                )}
                                                                            >
                                                                                Create new repo
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                </Accordion>
                                            )
                                        })}
                                    </Card.Body>
                                </Tab>
                                {/*OU Users Tab*/}
                                {/*Only when admin*/}
                                {orgData.role === 'admin' &&
                                    <Tab eventKey="ouUsersList" title="Org Users" className="ouUsersTab">
                                        <Card.Body key={iUnits} className="ouUsersDetails">
                                            {/*OU Users title*/}
                                            <Card.Title className="pt-2 pb-4">All Users assigned to {OU.ouName}</Card.Title>
                                            {/*OU Users Table*/}
                                            <Table striped bordered hover className="ouTable align-middle" >
                                                <thead >
                                                    <tr className="text-center">
                                                        <th>Username</th>
                                                        <th>Unassign from {OU.ouName}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/*Map Loop ouUsers to display username with an Unassign button for each user*/}
                                                    {OU.ouUsers.map((userName, userIndex) => {
                                                        return (
                                                            <tr key={userIndex}>
                                                                <td>{userName}</td>
                                                                <td><Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    className="unassignUserButton"
                                                                    onClick={() => unassignOU(userName, OU.ouName)}
                                                                >
                                                                    Unassign
                                                                </Button></td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                    </Tab>
                                }
                                {/*Division Users Tab*/}
                                {/*Only when admin*/}
                                {orgData.role === 'admin' &&
                                    <Tab eventKey="divisionUsersList" title="Div Users" className="divisionUsersTab">
                                        <Card.Body key={iUnits} className="divisionUsersDetails">
                                            {/*Division Users title*/}
                                            <Card.Title>Divisions of {OU.ouName}</Card.Title>
                                            {/*Map Loop divisions and return wrapper with table containing user data for that division*/}
                                            {OU.divisions.map((division, divisionIndex) => {
                                                return (
                                                    <Accordion defaultActiveKey="0" key={divisionIndex}>
                                                        <Accordion.Item eventKey={divisionIndex}>
                                                            {/*Division name*/}
                                                            <Accordion.Header>{division.divisionName}</Accordion.Header>
                                                            {/*Division Users table for this division*/}
                                                            <Accordion.Body>
                                                                <Table striped bordered hover className="ouTable align-middle">
                                                                    <thead >
                                                                        <tr className="text-center">
                                                                            <th>Username</th>
                                                                            <th>Unassign from {division.divisionName}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    {/*Map Loop Users to display username and Unassign button for each user*/}
                                                                    <tbody>
                                                                        {division.divisionUsers.map((userName, userIndex) => {
                                                                            return (
                                                                                <tr key={userIndex}>
                                                                                    <td>{userName}</td>
                                                                                    <td><Button
                                                                                        variant="danger"
                                                                                        size="sm"
                                                                                        className="addCredRepoButton"
                                                                                        onClick={
                                                                                            () => unassignDivision(
                                                                                                userName,
                                                                                                OU.ouName,
                                                                                                division.divisionName
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Unassign
                                                                                    </Button></td>
                                                                                </tr>
                                                                            )
                                                                        })}
                                                                    </tbody>
                                                                </Table>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </Accordion>
                                                )
                                            })}
                                        </Card.Body>
                                    </Tab>
                                }
                            </Tabs>
                        </Card>
                    )
                } else {
                    //When user is not assigned to divisions in this OU then return card with OU name and access denied message
                    return (
                        <Card key={iUnits} className="my-4">
                            <Tabs defaultActiveKey="overview" className="tabs">
                                {/*failed Division Tab*/}
                                <Tab eventKey="overview" title="Overview" className="overviewTab">
                                    <Card.Body className="overviewDetails">
                                        {/*OU name and message about divisions/crednetial repos access*/}
                                        <Card.Title>Organisational Unit: {OU.ouName}</Card.Title>
                                        <p className="text-center">
                                            You are in this Organisational Unit but cannot access any of its Divisions or Credentials Repositories, please speak with Admin about permissions
                                        </p>
                                    </Card.Body>
                                </Tab>
                            </Tabs>
                        </Card>
                    )
                }
            })}
        </>
    )
}



