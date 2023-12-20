//Imports
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
//Main AddRepoForm Function
export default function FormAddRepo({
    userData,
    orgData,
    setorgData,
    formOuName,
    setFormOuName,
    formDivisionName,
    setFormDivisionName,
    setFormRepoName,
    showAddRepoForm,
    setShowAddRepoForm
}) {
    //default error values
    const [error, setError] = useState();
    //default success values
    const [success, setSuccess] = useState();
    //AddRepoForm's inputs data to default values
    const [inputRepoUsername, setInputRepoUsername] = useState('');
    const [inputRepoEmail, setInputRepoEmail] = useState('');
    const [inputRepoPassword, setInputRepoPassword] = useState('');
    const [inputRepoName, setInputRepoName] = useState('');
    const [inputOuName, setInputOuName] = useState('');
    const [inputDivisionName, setInputDivisionName] = useState('');
    //Validates OuName and DivisionName to be sent to server so the repo sent to the correct division and OU
    useEffect(() => {
        //ForEach Loop OUs and their divisions
        orgData.OUs.forEach((OU) => {
            //When ouName and divisionName = the entered formOuName and formDivisionName then set them to these values.
            if (OU.ouName === formOuName) {
                OU.divisions.forEach((division) => {
                    if (division.divisionName === formDivisionName) {
                        setInputOuName(formOuName);
                        setInputDivisionName(formDivisionName);
                    }
                })
            }
        })
    }, [formDivisionName, formOuName, orgData.OUs])
    //Save token for requests Authorization
    const userToken = userData.token;
    // Hides success 'OK' button is used
    const successHideHandler = () => {
        setSuccess(null);
    }
    //Hides error when 'Ok' button is used
    const errorHideHandler = () => {
        setError(null);
    }
    //Adds new credential repo to a division within the OU
    const handleSubmit = async (e) => {
        //Stops page reload.
        e.preventDefault();
        //Save inputs data
        const repo = { inputOuName, inputDivisionName, inputRepoName, inputRepoUsername, inputRepoEmail, inputRepoPassword };
        //Save request Uses for Add Repo request
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(repo)
        };
        //Send POST Add Repo request to Server
        const response = await fetch('http://localhost:8000/add-repo', requestOptions);
        //Save JSON from response
        const jsonAddRepoData = await response.json();
        //When an error with the request then set error = jsonAddRepoData
        if (!response.ok) {
            setError(jsonAddRepoData);
        }
        //When there no error with the request
        if (response.ok) {
            //When jsonData successkey is false
            if (!jsonAddRepoData.successKey) {
                //Reset back to default so form can be re-used
                setInputOuName('');
                setSuccess(null);
                setInputRepoName('');
                setInputRepoUsername('');
                setInputDivisionName('');
                setInputRepoEmail('');
                setInputRepoPassword('');
                setFormOuName('');
                setFormDivisionName('');
                setFormRepoName('');
                //Let error to jsonData's message
                setError(jsonAddRepoData.message);
                //Error message timeout after 5 seconds
                setTimeout(() => {setError(null)}, 5000);
            } else {
                //When the successKey is true then reset states so form can be re-used
                setError(null);
                setInputOuName('');
                setInputDivisionName(''); 
                setInputRepoEmail('');
                setInputRepoPassword('');
                setFormOuName('');
                setFormDivisionName('');
                setFormRepoName('');
                setInputRepoUsername('');
                setInputRepoName('');
                //Save request Uses for OU request
                const getOUsRequestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: userToken
                    }
                }
                //Fetch all OUs again so that its the most recent version
                const response = await fetch('http://localhost:8000/OU', getOUsRequestOptions);
                const jsonorgData = await response.json();
                setorgData(jsonorgData);
                //Set success = jsonData's message
                setSuccess(jsonAddRepoData.message);
                //Success message timeout after 5 seconds.
                setTimeout(() => {setSuccess(null)}, 5000);
            }
        }
        //Reset showAddRepoForm to hide the form after use
        setShowAddRepoForm(false);
    }
    //Main return
    return (
        <>
            {/*Error/Success Container*/}
            <div className="addRepoFormMessages mx-auto">
                {/*When error occurs then an error message will be displayed above form*/}
                {error &&
                    <Container className="error border border-danger border-2">
                        <Row>
                            <Col className="text-end">
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
                {/*When success occurs then a success message will be displayed above form*/}
                {success &&
                    <Container className="success border border-success border-2">
                        <Row>
                            <Col className="text-end">
                                <p className="closeButton" onClick={successHideHandler}>
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
            </div>
            {/*Add Repo Form*/}
            {/*When showAddRepoForm is true then the AddRepoForm is shown*/}
            {showAddRepoForm &&
                <Card className="addRepoForm">
                    <Card.Header>Add a new credential repository:</Card.Header>
                    <Card.Body>
                        {/*Where repo will be added to*/}
                        <p className="text-muted">
                            Create a new Repo in {formOuName} OU in Division: {formDivisionName}
                        </p>
                        {/*Form for Repo details*/}
                        <Form onSubmit={handleSubmit} className="addRepoForm " >
                            {/*Repo Username*/}
                            <Form.Group as={Row} className="mb-2" controlId="formRepoUsername">
                                <Form.Label column sm={5}>User of New Repo:</Form.Label>
                                <Col sm={7}>
                                    <Form.Control
                                        type="text"
                                        name="repoUsername"
                                        onChange={e => setInputRepoUsername(e.target.value)}
                                        value={inputRepoUsername}
                                    />
                                </Col>
                            </Form.Group>
                            {/*Repo Name*/}
                            <Form.Group as={Row} className="mb-2" controlId="formRepoName">
                                <Form.Label column sm={5}>New Repo Name:</Form.Label>
                                <Col sm={7}>
                                    <Form.Control
                                        type="text"
                                        name="repoName"
                                        onChange={e => setInputRepoName(e.target.value)}
                                        value={inputRepoName}
                                    />
                                </Col>
                            </Form.Group>
                            {/*Repo Email*/}
                            <Form.Group as={Row} className="mb-2" controlId="formRepoEmail">
                                <Form.Label column sm={5}>New Repo Email:</Form.Label>
                                <Col sm={7}>
                                    <Form.Control
                                        type="text"
                                        name="repoEmail"
                                        onChange={e => setInputRepoEmail(e.target.value)}
                                        value={inputRepoEmail}
                                    />
                                </Col>
                            </Form.Group>
                            {/*Repo Password*/}
                            <Form.Group as={Row} className="mb-2" controlId="formRepoPassword">
                                <Form.Label column sm={5}>New Repo Password:</Form.Label>
                                <Col sm={7}>
                                    <Form.Control
                                        type="text"
                                        name="repoPassword"
                                        onChange={e => setInputRepoPassword(e.target.value)}
                                        value={inputRepoPassword}
                                    />
                                </Col>
                            </Form.Group>
                            {/*Form Submit button*/}
                            <Form.Group as={Row} >
                                <Col sm={{ span: 13 }}>
                                    <Button type="submit" className="my-2" variant="success">Add New Credential Repo</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            }
        </>
    )
}
