//Imports
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
//Main EditRepoForm Function
export default function FormEditRepo({
    formOuName,
    formRepoName,
    setFormRepoName,
    setFormDivisionName,
    userData,
    orgData,
    showEditRepoForm,
    setorgData,
    setFormOuName,
    formDivisionName,
    setShowEditRepoForm
}) {
    //default error values
    const [error, setError] = useState();
    //default success values
    const [success, setSuccess] = useState();
    //EditRepoForm's inputs data to default values
    const [inputRepoUsername, setInputRepoUsername] = useState('');
    const [inputRepoEmail, setInputRepoEmail] = useState('');
    const [inputRepoPassword, setInputRepoPassword] = useState('');
    const [inputRepoName, setInputRepoName] = useState('');
    const [inputOuName, setInputOuName] = useState('');
    const [inputDivisionName, setInputDivisionName] = useState('');
    //Validates OuName and DivisionName to be sent to server so the repo sent to the correct division and OU    
    useEffect(() => {
        // Loop through the OUs, their divisions and their credential repos.
        orgData.OUs.forEach((OU) => {
            //When ouName and divisionName = the entered formOuName and formDivisionName then set them to these values.
            if (OU.ouName === formOuName) {
                OU.divisions.forEach((division) => {
                    if (division.divisionName === formDivisionName) {
                        division.credentialRepos.forEach((repo) => {
                            if (repo.repoName === formRepoName) {
                                setInputOuName(formOuName);
                                setInputDivisionName(formDivisionName);
                                setInputRepoName(formRepoName);
                            }
                        })
                    }
                })
            }
        })
    }, [formDivisionName, formOuName, formRepoName, orgData.OUs])
    //Save token for requests Authorization
    const userToken = userData.token;
    //Hides success 'OK' button is used
    const successHideHandler = () => {
        setSuccess(null);
    }
    //Hides error when 'Ok' button is used
    const errorHideHandler = () => {
        setError(null);
    }
    //Updates credential repo in a division
    const handleSubmit = async (e) => {
        //Stops page reload.
        e.preventDefault();
        //Save inputs data
        const updatedRepo = { inputOuName, inputDivisionName, inputRepoName, inputRepoUsername, inputRepoEmail, inputRepoPassword };
        //Save request Uses for Add Repo request
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedRepo)
        };
        //Send POST Add Repo request to Server
        const response = await fetch(`http://localhost:8000/update-repo`, requestOptions);
        //Save JSON from response
        const jsonUpdateRepoData = await response.json();
        //When an error with the request then set error = jsonAddRepoData
        if (!response.ok) {
            setError(jsonUpdateRepoData);
        }
        //When there no error with the request
        if (response.ok) {
            //When jsonData successkey is false
            if (!jsonUpdateRepoData.successKey) {
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
                setError(jsonUpdateRepoData.message);
                //Error message timeout after 5 seconds
                setTimeout(() => { setError(null) }, 5000);
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
                const jsonOUsData = await response.json();
                setorgData(jsonOUsData);
                //Set success = jsonData's message
                setSuccess(jsonUpdateRepoData.message);
                //Success message timeout after 5 seconds.
                setTimeout(() => { setSuccess(null) }, 5000);
            }
        }
        //Reset showEditRepoForm to hide the form after use
        setShowEditRepoForm(false);
    }
    //Main return
    return (
        <>
            {/*Error/Success Container*/}
            <div className="editRepoFormMessages mx-auto">
                {/*When error occurs then an error message will be displayed above form*/}
                {error &&
                    <Container className="error border border-danger border-2">
                        <Row>
                            <Col className="text-end">
                                <p className="closeMessageButton" onClick={errorHideHandler}>
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
                                <p className="closeMessageButton" onClick={successHideHandler}>
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
            {/*Edit Repo Form*/}
            {/*When showEditRepoForm is true then the EditRepoForm is shown*/}
            {showEditRepoForm &&
                <Card className="addRepoForm">
                    <Card.Header>Update a credential repository:</Card.Header>
                    <Card.Body>
                        {/*OU and Division that repo will be added to*/}
                        <p className="text-muted">
                            Edit a Repo in {formOuName} OU in Division: {formDivisionName}
                            <br></br>
                            Repo Name is {formRepoName}
                        </p>
                        {/*Form for updating repo details*/}
                        <Form onSubmit={(handleSubmit)} className="editRepoForm " >
                            {/*Repo Email*/}
                            <Form.Group as={Row} className="mb-2" controlId="formRepoEmail">
                                <Form.Label column sm={5}>Update Email to:</Form.Label>
                                <Col sm={7}>
                                    <Form.Control
                                        type="text"
                                        name="repoEmail"
                                        value={inputRepoEmail}
                                        onChange={e => setInputRepoEmail(e.target.value)}
                                    />
                                </Col>
                            </Form.Group>
                            {/*Repo Username*/}
                            <Form.Group as={Row} className="mb-2" controlId="formRepoUsername">
                                <Form.Label column sm={5}>Update Username to:</Form.Label>
                                <Col sm={7}>
                                    <Form.Control
                                        type="text"
                                        name="repoUsername"
                                        value={inputRepoUsername}
                                        onChange={e => setInputRepoUsername(e.target.value)}
                                    />
                                </Col>
                            </Form.Group>
                            {/*Repo Password*/}
                            <Form.Group as={Row} className="mb-2" controlId="formRepoPassword">
                                <Form.Label column sm={5}>Update Password to:</Form.Label>
                                <Col sm={7}>
                                    <Form.Control
                                        type="text"
                                        name="repoPassword"
                                        value={inputRepoPassword}
                                        onChange={e => setInputRepoPassword(e.target.value)}
                                    />
                                </Col>
                            </Form.Group>
                            {/*Submit button*/}
                            <Form.Group as={Row} >
                                <Col sm={{ span: 12 }}>
                                    <Button type="submit" className="my-4" variant="success">Confirm Update</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            }
        </>
    )
}

