import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { useAuth } from "../context/AuthContext";
import { Card } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function Search() {
    const { isDark } = useAuth();
    const location = useLocation();
    const [sdata, setSdata] = useState([]);

    useEffect(() => {
        setSdata(location.state);
     }, [location]);
  
    return (
        <div className="App m-2 text-center">
            <h1>Search Results:</h1>

            { sdata.length !== 0 ?
                <div className="card-grid mt-2">
                    {sdata.map((postData) => {
                        return (
                            <Card
                                as="a"
                                href={"/users/id" + postData.userID + "/c" + postData.id }
                                style={{ cursor: "pointer" }}
                                key={postData.id}
                                className={(isDark ? " ccard-dark-mode" : " ccard-light-mode")}
                            >
                                <Card.Body> 
                                    <Card.Subtitle>
                                        {postData.category}
                                    </Card.Subtitle>
                                    <Card.Title>
                                        {postData.name.length <= 13 ? postData.name : postData.name.substring(0,17)+".."}
                                    </Card.Title>
                                    <ReactMarkdown source={postData.description} />
                                </Card.Body>
                            </Card>
                        )
                    })}
                </div>
            : <p className="mt-3">Nothing was found.</p>
            }
        </div>
    );
}
  
export default Search;