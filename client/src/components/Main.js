//Imports
import React, { useState, useEffect } from 'react';
import OrgInfo from './OrgInfo';
import FormAddRepo from './formAddRepo';
import FormEditRepo from './formEditRepo';
import UsersInfo from './UsersInfo';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//Main App Functions
export default function Main({ isLoggedIn, orgData, setorgData, allUsersData, setAllUsersData }) {
    //Saving OU data from forms
    const [formOuName, setFormOuName] = useState();
    const [formDivisionName, setFormDivisionName] = useState();
    const [formRepoName, setFormRepoName] = useState();
    // For displaying AddRepo and EditRepo Forms
    const [showAddRepoForm, setShowAddRepoForm] = useState();
    const [showEditRepoForm, setShowEditRepoForm] = useState();
    //default error state
    const [error, setError] = useState();
    //Save user token for requests Authorization
    const userData = JSON.parse(window.localStorage.getItem('userData'));
    //Gets all OUs the user has rights to access
    useEffect(() => {
        const getAllOUs = async () => {
            //Save Request uses for OU request
            const requestOptions = {
                method: 'GET',
                headers: {
                    Authorization: userData.token
                }
            }
            //GET OU request to server
            const response = await fetch('http://localhost:8000/OU', requestOptions);
            //Save JSON data from response.
            const jsonData = await response.json();
            //When an error with the request occurs then let error = jsonData
            if (!response.ok) {
                setError(jsonData);
            }
            //When there no error with the request, let error = null and make orgData = jsonData
            if (response.ok) {
                setError(null);
                setorgData(jsonData);
            }
        }
        getAllOUs();
    }, [setorgData, setError, userData.token])
    //When OU contains data and user logged in then return the Main container with a welcome message based on the user's role
    if (isLoggedIn && orgData) {
        return (
            <div id="Main" className="my-5 py-3">
                {/*When error with the OU request occurs then it will display this*/}
                {error &&
                    <Container className="error border border-danger border-5">
                        <Row>
                            <Col>
                                <p>{error}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-end">
                                <p className="closeButton" onClick={() => setError(null)}>
                                    Ok
                                </p>
                            </Col>
                        </Row>
                    </Container>
                }
                {/*Welcome container*/}
                <Container fluid className="pt-5">
                    <Row >
                        <Col>
                            <h1>Hello {userData.username} This is your Repo Manager</h1>
                            <p>Your Current Role is {orgData.role}</p>
                        </Col>
                    </Row>
                </Container>
                {/*UserInfo, OrgInfo and Forms container*/}
                <Container fluid>
                    <Row className="mx-5">
                        <Col sm={5} id="formsColumn">
                            {/*Add New CredRepo Form*/}
                            <FormAddRepo
                                userData={userData}
                                orgData={orgData}
                                setorgData={setorgData}
                                formOuName={formOuName}
                                setFormOuName={setFormOuName}
                                formDivisionName={formDivisionName}
                                setFormDivisionName={setFormDivisionName}
                                setFormRepoName={setFormRepoName}
                                showAddRepoForm={showAddRepoForm}
                                setShowAddRepoForm={setShowAddRepoForm}
                            />
                            <br/>
                            {/*Update Credential Repo Form*/}
                            <FormEditRepo
                                userData={userData}
                                orgData={orgData}
                                setorgData={setorgData}
                                formOuName={formOuName}
                                setFormOuName={setFormOuName}
                                formDivisionName={formDivisionName}
                                setFormDivisionName={setFormDivisionName}
                                formRepoName={formRepoName}
                                setFormRepoName={setFormRepoName}
                                showEditRepoForm={showEditRepoForm}
                                setShowEditRepoForm={setShowEditRepoForm}
                            />
                            {/*Users Data info for Admin only*/}
                            <UsersInfo
                                orgData={orgData}
                                setorgData={setorgData}
                                userData={userData}
                                allUsersData={allUsersData}
                                setAllUsersData={setAllUsersData}
                            />
                        </Col>
                        {/*OU Data*/}
                        <Col sm={7}>
                            <div>
                                {/*OU Data Info*/}
                                <OrgInfo
                                    orgData={orgData}
                                    userData={userData}
                                    setorgData={setorgData}
                                    setFormOuName={setFormOuName}
                                    setFormDivisionName={setFormDivisionName}
                                    setFormRepoName={setFormRepoName}
                                    setShowAddRepoForm={setShowAddRepoForm}
                                    setShowEditRepoForm={setShowEditRepoForm}
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
