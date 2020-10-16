import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { Alert } from 'react-bootstrap';
import axios from 'axios';

import { Nav, Navbar, Form, Button } from 'react-bootstrap';

function NavBar() {
    const { user, setUser } = useAuth();
    const { isDark, setIsDark } = useAuth();
    const [isError, setIsError] = useState(false);

    const [sdata, setSdata] = useState([]);

    const history = useHistory();

    function doLogout(){
        axios.post("http://localhost:3000/logout", {}, { withCredentials: true })
        .then(result => {
            if (result.status === 200 && result.data.success) {
                setUser({ name: 'Guest', role: 'guest', id: -1});
            } else {
                setIsError(true);
            }
        }).catch(e => {
            setIsError(true);
        });
    }

    function doSearch(){
        axios.post("http://localhost:3000/search", { sdata }, { withCredentials: true })
        .then(result => {
            if (result.status === 200 && result.data.success) {
                history.push({
                    pathname: '/search',
                    state: result.data.sdata
                });
            } else {
                setIsError(true);
            }
        }).catch(e => {
            setIsError(true);
        });
    }

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">Home Page</Navbar.Brand>
                    <Form inline>
                        <Form.Control type="text" placeholder="Search" className="mr-sm-2" value={sdata} onChange={e => {
                                setSdata(e.target.value)
                            }}
                        />
                        <Button onClick={doSearch} variant="outline-info">Search</Button>
                    </Form>
                <Navbar.Collapse id="basic-navbar-nav" />

                <Nav className="mr-auto">
                    { user.role === 'guest' && <Button variant="secondary" href="/login" className="mr-1" >Login</Button> }
                    { user.role === 'guest' && <Button variant="secondary" href="/register" className="mr-2" >Register</Button> }
                    { user.role !== 'guest' ? <Button variant="secondary" onClick={doLogout} className="mr-1" >logout</Button> : null }
                    <Navbar.Text>Signed in as: <a href={"/users/id" + user.name} className="mr-2">{ user.role !== 'guest' ? user.name : 'Guest' }</a></Navbar.Text>
            
                    <div className='custom-control custom-switch m-auto switch'>
                        <input type='checkbox'
                        className='custom-control-input'
                        id='customSwitches'
                        onChange={ () => setIsDark(prev => !prev) }
                        checked={ isDark }
                        />
                        <label className='custom-control-label' htmlFor='customSwitches'></label>
                    </div>
                </Nav>
            </Navbar>
            { isError && <Alert variant={'danger'} className="mr-1 mb-0" > Something went wrong. Feel free to try again.</Alert> }
        </div>
    );
}
  
export default NavBar;