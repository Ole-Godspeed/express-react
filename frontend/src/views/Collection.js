import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';
import { Alert, Button, Card, Form, Table } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

function Userpage(props) {
    const { user, setUser } = useAuth();
    const { isDark } = useAuth();
    const [error, setError] = useState('');
    const [tab, setTab] = useState(false);

    const [pageuser, setPageuser] = useState('');

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');

    const [cdata , setCdata] = useState('');
    const [idata , setIdata] = useState('');

    const [customFields, setCustomFields] = useState([]);

    useEffect(() => {
        axios.post("http://localhost:3000/users/id" + props.match.params.id + "/c" + props.match.params.col,{
            userID : props.match.params.id,
            colID : props.match.params.col
        }, { withCredentials: true })
        .then(result => {
            if (result.status === 200 && result.data.success) {
                if (result.data.col.itemFields !== null) {
                    JSON.parse(result.data.col.itemFields).map((postData, index) => {
                        customFields[index] = { type: postData.type, name: '' };
                })
                }
                setCdata(result.data.col);
                setIdata(result.data.items);
                setPageuser(result.data.username);
            } else {
                setError(result.data.msg);
            }
        }).catch(e => {
            setError('Something went wrong.');
            console.log(e);
        });
    }, [tab] );

    function createItem() {
        if (name === '') {
            setError('Enter the name.');
        } else {
            axios.post("http://localhost:3000/users/id" + props.match.params.id + "/c" + props.match.params.col + "/createitem", {
                name: name,
                desc: desc,
                customFields: customFields
            }, {
                withCredentials: true
            })
            .then(result => {
                if (result.status === 200 && result.data.success) {
                    setTimeout( () => { setTab(false); }, 1000 );
                    resetForm();
                } else {
                    setError('Something went wrong.')
                }
            }).catch(e => {
                console.log(e);
                setError('Something went wrong.');
            });
        }
    }

    function resetForm() {
        setName('');
        setDesc(''); 
        customFields.map((postData, index) => {
            customFields[index] = { type: postData.type, name: '' };
        })
    }

    function openTab() {
        resetForm();
        return setTab(prev => !prev);
    }
 
    if (error.length !== 0) {
        return (
            <Alert variant={'warning'} className="mt-3" > {error}</Alert>
        )
    } else if (tab && user.role !== 'guest') {
        const cFields = JSON.parse(cdata.itemFields);
        return (
            <div>
                <Card className={"text-center mx-auto mt-4 "+(isDark ? "card-dark-mode" : null)}  border="dark" style={{ width: '23rem' }}>
                    <Form id="create-form" className = 'm-2'> 
                    <h1>New Item</h1>
                    
                    <Form.Group controlId="formGroupName">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control value={name} onChange={e => { setName(e.target.value) }} />
                    </Form.Group>
    
                    <Form.Group controlId="exampleForm.ControlTextarea">
                        <Form.Label>Description:</Form.Label>
                        <Form.Control as="textarea" rows="3" value={desc} onChange={e => { setDesc(e.target.value) }}/>
                    </Form.Group>

                    { cFields !== null && cFields.length !== 0 ?
                        <div className="card-grid mt-2">
                            {cFields.map((postData, index) => {
                                return (
                                    <div key={index}>
                                        <Form.Group controlId={"formGroupName"+index}>
                                            <Form.Label>{postData.name}:</Form.Label>
                                            <Form.Control
                                                onChange={e => {
                                                    customFields[index] = { type: postData.type, name: e.target.value };
                                                }
                                            }/>
                                        </Form.Group>
                                    </div>  
                                )
                            })}
                        </div>
                    : null
                    }

                    <div className="row">
                        <div className="col pr-1">
                            <Button onClick={createItem} className="" variant="secondary" size="lg" block>+ Create</Button>  
                        </div>
                        <div className="col pl-1">
                            <Button onClick={openTab} variant="secondary" size="lg" block>Cancel</Button>  
                        </div>
                    </div>   

                    </Form> 
                </Card>
            </div>
        )

    } else {
        return (
            <div className="App text-center">
                <Link className={isDark ? "link-dm" : "link-lm"} to={"/users/id" + props.match.params.id}>
                    <h1><u>User: {pageuser}</u></h1></Link>
                <h1>Collection: {cdata.name}</h1>
                <img src={cdata.pic}></img>
                <h2>Description: </h2>
                {cdata.description !== '' ? <ReactMarkdown source={cdata.description} /> : <p>None.</p>}
                { (user.id === parseInt(props.match.params.id) || user.role === 'admin') &&
                        <Button onClick={openTab} variant="secondary" size="lg" >+ New Item</Button> }
                { idata.length !== 0 ?
                    <div className="m-2"> 
                        <Table striped bordered hover size="sm" variant={isDark ? "dark" : null}> 
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    { cdata.itemFields !== null ?
                                        JSON.parse(cdata.itemFields).map((postData, index) => {
                                            return (
                                                <th key={'th' + index}>
                                                    {postData.name}
                                                </th>
                                            )
                                        })
                                    : null
                                    }    
                                </tr>
                            </thead>
                            <tbody>
                            {idata.map((postData) => {
                                return (
                                    <tr key={postData.id}>
                                        <td>{postData.id}</td>
                                        <td>{postData.name}</td>
                                        <td>{postData.description}</td>
                                        { postData.itemFields !== null ?
                                            JSON.parse(postData.customFields).map((postData, index) => {
                                                return (
                                                    <td key={'td' + index}>
                                                        {postData.name}
                                                    </td>
                                                )
                                            })
                                        : null
                                        }
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                            
                    </div>
                : <p className="mt-3">No items yet.</p> }
            </div>
        );
    } 
}
export default Userpage;