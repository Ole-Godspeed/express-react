import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Route } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { AuthContext } from "./context/AuthContext";

import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import NavBar from './views/NavBar';
import Userpage from './views/Userpage';
import Collection from './views/Collection';
import Search from './views/Search';

function App() {
    const [user, setUser] = useState({ name: 'Guest', role: 'guest', id: -1});
    const [isError, setIsError] = useState(false);
    const [isDark, setIsDark] = useState(getInitialMode());

    useEffect(() => {
        axios.post("http://localhost:3000/getsession",{}, { withCredentials: true })
        .then(result => {
            if (result.status === 200) {
                setUser({
                    name: result.data.name,
                    role: result.data.role,
                    id: result.data.id
                });
            } else {
                setIsError(true);
            }
        }).catch(e => {
            setIsError(true);
            console.log(e)
        });
    }, []);

    function getInitialMode() {
        if ('darkmode' in localStorage) {
            return JSON.parse(localStorage.getItem('darkmode'));
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        } else {
            return false;
        }
    }

    useEffect(() => {
        localStorage.setItem('darkmode', JSON.stringify(isDark));
    }, [isDark])

    if (isDark) {
        document.body.className = 'dark-mode';
    } else {
        document.body.className = 'light-mode';
    }

    if (user.role === 'blocked') {
        return (
            <div className="App">
                <AuthContext.Provider value={ {user, setUser, isDark, setIsDark} }>
                    <NavBar />
                    <Alert variant={'danger'} className="mt-3 mx-auto" >User is blocked.</Alert>
                </AuthContext.Provider>
            </div>
        )
    } else {
        return (
            <div className="App">
                <AuthContext.Provider value={ {user, setUser, isDark, setIsDark} }>
                    <NavBar />
                    { isError && <Alert variant={'danger'} className="mt-3 mx-auto" > Something went wrong.</Alert> }
                    <Route exact path="/" component={Home} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/users/id:id" component={Userpage} />
                    <Route exact path="/users/id:id/c:col" component={Collection} />
                    <Route exact path="/search" component={Search} />
                </AuthContext.Provider>
            </div>
        )
    }
}

export default App;