//Imports
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
//Main SignIn Function
export default function SignIn({ setUserData, setIsLoggedIn }) {
    //Base Values
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState();
    //Boolean used for switching between SignIn and SignUp forms
    const [signIn, setSignIn] = useState(true);
    //Takes the Form Values and makes a Get login Request
    const signInHandler = async (e) => {
        //Prevent page reload.
        e.preventDefault();
        //Save user inputs
        let userCredentials = {
            username: username,
            password: password
        }
        //Save request options for login request
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userCredentials)
        }
        //Send login request to server
        const response = await fetch('http://localhost:8000/login', requestOptions);
        //Save data from response
        const jsonSignInData = await response.json();
        //When an error with the request occurs then make error = jsonSignInData
        if (!response.ok) {
            setError(jsonSignInData);
        }
        //When no error with the request occurs then
        if (response.ok) {
            //When the response.message includes the string 'Incorrect SignIn!':
            if (jsonSignInData.message.includes('Incorrect SignIn!')) {
                //Let error to the jsonSignInData's message/ 
                setError(jsonSignInData.message);
                //Error message timeout after 5 seconds
                setTimeout(() => { setError(null) }, 5000);
                //Login Failed
                setIsLoggedIn(false);
            } else {
                //Making error = null then setting isLoggedIn to true and then setting Userdata to the jsonSignInData
                setError(null);
                setIsLoggedIn(true);
                setUserData(jsonSignInData);
                window.localStorage.setItem('isLoggedIn', JSON.stringify(true));
                window.localStorage.setItem('userData', JSON.stringify(jsonSignInData));
            }
        }
    }
    //refresh Handler and makes a Get login Request post refresh
    const refreshHandler = async (e) => {
        //Prevent page reload.
        e.preventDefault();
        //Save user inputs
        let userCredentials = {
            username: window.localStorage.getItem('userdata').username,
            password: window.localStorage.getItem('password').password
        }
        //Save request options for login request
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userCredentials)
        }
        //Send login request to server
        const response = await fetch('http://localhost:8000/login', requestOptions);
        //Save data from response
        const jsonSignInData = await response.json();
        //When an error with the request occurs then make error = jsonSignInData
        if (!response.ok) {
            setError(jsonSignInData);
        }
        //When no error with the request occurs then
        if (response.ok) {
            //When the response.message includes the string 'Incorrect SignIn!':
            if (jsonSignInData.message.includes('Incorrect SignIn!')) {
                //Let error to the jsonSignInData's message/ 
                setError(jsonSignInData.message);
                //Error message timeout after 5 seconds
                setTimeout(() => { setError(null) }, 5000);
                //Login Failed
                setIsLoggedIn(false);
            } else {
                //Making error = null then setting isLoggedIn to true and then setting Userdata to the jsonSignInData
                setError(null);
                setIsLoggedIn(true);
                setUserData(jsonSignInData);
            }
        }
    }
    //Takes the Form Values and makes a Get register Request
    const signUpHandler = async (e) => {
        //Prevent page reload
        e.preventDefault();
        //Save user inputs
        let userCredentials = {
            username: username,
            password: password
        }
        //Save request options for register request
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userCredentials)
        }
        //Send register request server
        const response = await fetch('http://localhost:8000/register', requestOptions);
        //Save SignIn data from response
        const jsonSignUpData = await response.json();
        //When an error with the request occurs then Make error = jsonSignInData
        if (!response.ok) {
            setError(jsonSignUpData);
        }
        //When no error with the request occurs then..
        if (response.ok) {
            //When the success key is false
            if (!jsonSignUpData.successKey) {
                //Make error = message
                setError(jsonSignUpData.message);
                //Error message timeout after 5 seconds.
                setTimeout(() => { setError(null) }, 5000);
            }
            //When the success key is true
            if (jsonSignUpData.successKey) {
                //Make error = null, LoggedIn = true and userData = jsonSignInData
                setError(null);
                setIsLoggedIn(true);
                setUserData(jsonSignUpData);
                window.localStorage.setItem('isLoggedIn', true);
                window.localStorage.setItem('userData', JSON.stringify(jsonSignUpData));
            }
        }
    }
    //isLoggedIn state for refresh
    const isLoggedIn = window.localStorage.getItem('isLoggedIn');
    //When signIn = true then display the SignIn form
    if (signIn) {
        return (
            <div className="py-5 my-5" id="SignIn">
                <Container className="SignInForm mx-auto w-50">
                    <h4 className="text-center my-3 py-3 fw-bold" >User Sign In</h4>
                    {/*SignIn Form*/}
                    <Form onSubmit={signInHandler}>
                        {/*Username*/}
                        <Form.Group as={Row} className="my-3 pt-2 justify-content-center" controlId="formUsername">
                            <Form.Label column sm={3}>Enter Username:</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    onChange={e => setUsername((e.target.value))}
                                    value={username}
                                />
                            </Col>
                        </Form.Group>
                        {/*Password*/}
                        <Form.Group as={Row} className="my-3 pt-2 justify-content-center" controlId="formPassword">
                            <Form.Label column sm={3}>Enter Password:</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    name="password"
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                />
                            </Col>
                        </Form.Group>
                        {/*Sign In and Sign Up Buttons*/}
                        <Form.Group as={Row} className="my-3 justify-content-center" >
                            <Col sm={{ span: 6 }}>
                                <Button type="submit" className="my-4 SignInButton" variant="success">Sign In</Button>
                                <p onClick={() => setSignIn(false)}>No Account? click here to SignUp now</p>
                                {/*When error = true then display error below button*/}
                                {error &&
                                    <Container className="error border border-danger border-2">
                                        <Row>
                                            <Col className="text-end">
                                                <p className="closeButton" onClick={() => setError(null)}>
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
                            </Col>
                        </Form.Group>
                    </Form>
                </Container >
            </div>
        )
    } else {
        //when signIn = false then display the SignUp form
        return (
            <div className="py-5 my-5">
                <Container className="SignInForm mx-auto w-50">
                    <h4 className="text-center my-3 py-3 fw-bold">User Sign Up</h4>
                    {/*SignUp Form*/}
                    {!isLoggedIn? ( 
                    <Form onSubmit={signUpHandler}>
                        {/*Username*/}
                        <Form.Group as={Row} className="my-3 justify-content-center" controlId="formUsername">
                            <Form.Label column sm={3}>Enter Username:</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    onChange={e => setUsername(e.target.value)}
                                    value={username}
                                />
                            </Col>
                        </Form.Group>
                        {/*Password*/}
                        <Form.Group as={Row} className="my-3 pt-2 justify-content-center" controlId="formPassword">
                            <Form.Label column sm={3}>Enter Password:</Form.Label>
                            <Col sm={6}>
                                <Form.Control
                                    type="text"
                                    name="password"
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                />
                            </Col>
                        </Form.Group>
                        {/*SignUp and SignIn button*/}
                        <Form.Group as={Row} className="my-3 justify-content-center" >
                            <Col sm={{ span: 6 }}>
                                <Button type="submit" className="my-4 SignInButton" variant="success">SignUp</Button>
                                <p onClick={() => setSignIn(true)}>Go Back</p>
                                {/*When error = true then return message below button*/}
                                {error &&
                                    <Container className="error border border-danger border-2">
                                        <Row>
                                            <Col className="text-end">
                                                <p className="closeButton" onClick={() => setError(null)}>
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
                            </Col>
                        </Form.Group>
                    </Form>) : ({refreshHandler})}


                   
                </Container >
            </div>
        )
    }
}
