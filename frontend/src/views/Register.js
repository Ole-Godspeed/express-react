import React, { useState } from "react";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Alert, Card, Form, Button } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faVk  } from '@fortawesome/free-brands-svg-icons'

function Register() {
    const { isDark } = useAuth();
    const { user, setUser } = useAuth();
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    function resetForm() {
        setUsername('');
        setEmail('');
        setPassword1('');
        setPassword2('');
    }

    function doRegister() {

        if (username === '' || email === '' || password1 === '' || password2 === '') {
            setError('Fill in all the fields.');
        }
        else if (password1 !== password2) {
            setError('Passwords do not match.');
            resetForm();
        }
        else {
            axios.post("http://localhost:3000/register",{ username, password1, email }, { withCredentials: true })
            .then(result => {
                if (result.status === 200 && result.data.success) {
                    setUser(username);
                } else {
                    setError(result.data.msg);
                    resetForm();
                }
            }).catch(e => {
                setError(e);
                resetForm();
            });
        }
    }

    if (user.role !== "guest") {
        return <Redirect to="/" />;
    }
    if (isDark) {
        document.body.className = 'dark-mode';
    } else {
        document.body.className = 'light-mode';
    }

    return (
        <div className="App">
            <Card className={"text-center mx-auto mt-4 "+(isDark ? "card-dark-mode" : "card-light-mode")}  border="dark" style={{ width: '23rem' }}>
                <h1>Sigh Up</h1>
                <Form className = 'm-2'>
  
                    <Form.Group controlId="formGroupUsername">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control type="username" value={username} placeholder="Username" onChange={e => {
                            setUsername(e.target.value);
                        }} />
                    </Form.Group>

                    <Form.Group controlId="formGroupEmail">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control type="email" value={email} placeholder="Email" onChange={e => {
                            setEmail(e.target.value)
                        }} />
                    </Form.Group>

                    <Form.Group controlId="formGroupPassword">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password1} onChange={e => {
                            setPassword1(e.target.value);
                        }}/>
                    </Form.Group>

                    <Form.Group controlId="formGroupPassword">
                        <Form.Label>Confirm Password:</Form.Label>
                        <Form.Control type="password" placeholder="Confirm Password" value={password2} onChange={e => {
                            setPassword2(e.target.value);
                        }}/>
                    </Form.Group>

                    { error.length !== 0 && <Alert variant={'danger'} className="mt-3" > {error}</Alert> }

                    <Button onClick={doRegister} block className='mb-2' variant="secondary" size="lg" >Sign Up</Button>
                    <div className="row">
                        <div className="col pr-1">
                            <Button
                                href="http://localhost:3000/register/facebook/"
                                variant="secondary"
                                size="lg"
                                block>
                                <FontAwesomeIcon size="lg" icon={faFacebook}/>
                            </Button>
                        </div>
                        <div className="col pl-0">
                            <Button
                                href="http://localhost:3000/register/vk/"
                                variant="secondary"
                                size="lg"
                                block>
                                <FontAwesomeIcon size="lg" icon={faVk}/>
                            </Button>
                        </div>
                    </div>
              
                </Form> 
            </Card>
        </div>
    );
}

  
export default Register;