import React, { useState } from "react";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Alert, Card, Form, Button } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faVk  } from '@fortawesome/free-brands-svg-icons'

function Login() {
    const { isDark } = useAuth();
    const { user, setUser } = useAuth();
    const [isError, setIsError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function resetForm () {
        setEmail('');
        setPassword('');
    }

    function doLogin() {
        axios.post("http://localhost:3000/login",{ email, password }, { withCredentials: true })
        .then(result => {
            if (result.status === 200) {
              setUser({
                name: result.data.name,
                role: result.data.role,
                id: result.data.id
            });
            } else {
                setIsError(true);
                resetForm();
            }
        }).catch(e => {
            console.log(e);
            setIsError(true);
            resetForm();
        });
    }

    if (user.role !== "guest") {
        return <Redirect to="/" />;
    }

    return (
        <div className="App">
            <Card className={"text-center mx-auto mt-4 "+(isDark ? "card-dark-mode" : "card-light-mode")}  border="dark" style={{ width: '23rem' }}>
                <h1>Sigh In</h1>
                <Form className = 'm-2'>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control type="email" value={email} placeholder="Email" onChange={e => {
                            setEmail(e.target.value);
                        }} />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={e => {
                            setPassword(e.target.value);
                        }}/>
                    </Form.Group>

                    { isError && <Alert variant={'danger'} className="mt-3" > Invalid username or password.</Alert> }

                    <Button onClick={doLogin}className='mb-2' variant="secondary" size="lg" block >Sign In</Button>
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
export default Login;