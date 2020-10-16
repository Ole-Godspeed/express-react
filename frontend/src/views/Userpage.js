import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { Alert, Button, Card, Form } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import ImageUploading from 'react-images-uploading';

import { useForm, useFieldArray} from 'react-hook-form'

function Userpage(props) {
    const { user, setUser } = useAuth();
    const { isDark } = useAuth();
    const [error, setError] = useState('');
    const [tab, setTab] = useState(false);

    const [pageuser, setPageuser] = useState('');
    const [pagerole, setPagerole] = useState('');

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setTopic] = useState('Books');

    const { register, control, reset, getValues } = useForm();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "itemFields"
    })
    
    const [cdata , setCdata] = useState('');
    const [images, setImages] = useState([]);

    const onChange = (imageList, addUpdateIndex) => {
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
      };

    useEffect(() => {
        axios.post("http://localhost:3000/users/id" + props.match.params.id,{ id : props.match.params.id }, { withCredentials: true })
        .then(result => {
            if (result.status === 200 && result.data.success) {
                setCdata(result.data.col);
                setPageuser(result.data.username);
                setPagerole(result.data.role);
            } else {
                setError(result.data.msg);
            }
        }).catch(e => {
            setError('Something went wrong.');
        });
    }, [tab]);

    function createCol() {
        if (name === '') {
            setError('Enter the name.');
        } else {
            axios.post("http://localhost:3000/users/id" + props.match.params.id + "/createcol", {
                name: name,
                desc: desc,
                category: category,
                images: images,
                itemFields: getValues().itemFields
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
                setError('Something went wrong.');
            });
        }
    }

    function resetForm() {
        setName('');
        setDesc('');
        setImages([]);
        reset();
    }

    function openTab() {
        resetForm();
        return setTab(prev => !prev);
    }

    if (tab && user.role !== 'guest') {
            
        return (
            <div>

                {error.length !== 0 ? <Alert variant={'warning'} className="mt-3" > {error}</Alert> : null}

                <Card className={"text-center mx-auto mt-4 "+(isDark ? "card-dark-mode" : null)}  border="dark" style={{ width: '23rem' }}>
                    <h1>New Collection</h1>
                    <Form className = 'm-2'>
                        <Form.Group controlId="ControlSelect">
                            <Form.Label>Category:</Form.Label>
                            <Form.Control as="select" onChange={e => { setTopic(e.target.value) }}> 
                                <option>Books</option>
                                <option>Movies</option>
                                <option>Alboms</option>
                                <option>Games</option>
                                <option>Alcohol</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formGroupName">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control value={name} onChange={e => { setName(e.target.value) }} />
                        </Form.Group>
        
                        <Form.Group controlId="ControlTextarea">
                            <Form.Label>Description:</Form.Label>
                            <Form.Control as="textarea" rows="3" value={desc} onChange={e => { setDesc(e.target.value) }}/>
                        </Form.Group>

                        <Form.Label>Custom fields:</Form.Label>
                        {fields.map(({ id }, index) => {
                            return (
                                <div key={id} className="m-1">
                                    <div className="row">
                                        <div className="col pr-0">  
                                            <Form.Control as="select" size="sm" ref={register()} name={`itemFields[${index}].type`} > 
                                                <option>Text</option>
                                                <option>String</option>
                                                <option>Integer</option>
                                                <option>Date</option>
                                                <option>Boolean</option>
                                            </Form.Control>
                                        </div>
                                        <div className="col pl-0">
                                            <Button className="m-0" variant="info" size='sm' block onClick={() => remove(index)}>remove</Button>
                                        </div>
                                    </div>
                                    <Form.Control ref={register()} defaultValue={"CustomField"+(index+1)} name={`itemFields[${index}].name`} />
                                </div>
                            )
                        })}
                        <Button className="m-2" variant="info" size='sm' onClick={() => append({})}>+ new custom field</Button>

                        <ImageUploading
                            value={images}
                            onChange={onChange}
                            dataURLKey="data_url"
                        >
                            {({
                                imageList,
                                onImageUpload,
                                onImageRemove,
                                isDragging,
                                dragProps,
                            }) => (
                                <div className="upload__image-wrapper">
                                    <Button
                                        className="m-2"
                                        variant="outline-info"
                                        size="lg"
                                        style={isDragging ? { color: 'red' } : undefined}
                                        onClick={onImageUpload}
                                        {...dragProps}
                                        >
                                        Click or Drop here
                                    </Button>
                                    &nbsp;
                                    {imageList.map((image, index) => (
                                        <div key={index} className="image-item">
                                            <img className="m-2" src={image['data_url']} alt="" width="100" />
                                            <div className="image-item__btn-wrapper">
                                                <Button className="m-2" variant="outline-info" onClick={() => onImageRemove(index)}>Remove</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ImageUploading>

                        <div className="row">
                            <div className="col pr-1">
                                <Button onClick={createCol} className="" variant="secondary" size="lg" block>+ Create</Button>  
                            </div>
                            <div className="col pl-1">
                                <Button onClick={openTab} variant="secondary" size="lg" block>Cancel</Button>  
                            </div>
                        </div>            
                    </Form> 

                </Card>
            </div> 
        )

    } else if (error.length !== 0) {

        return (
            <Alert variant={'warning'} className="mt-3" > {error}</Alert>
        )
        
    } else { // collections

        return (
            <div className="App m-2 text-center">
                <h1>User: {pageuser}</h1>
                <p>User's role: {pagerole}</p>
                {console.log(parseInt(props.match.params.id))}
                { (user.id === parseInt(props.match.params.id) || user.role === 'admin' ) &&
                    <Button onClick={openTab} variant="secondary" size="lg" >+ New Collection</Button> }

                { cdata.length !== 0 ?
                    <div className="card-grid mt-2">
                        {cdata.map((postData) => {
                            return (
                                <Card
                                    as="a"
                                    href={"/users/id" + postData.userID + "/c" + postData.id }
                                    style={{ cursor: "pointer" }}
                                    key={postData.id}
                                    className={(isDark ? " ccard-dark-mode" : " ccard-light-mode")}
                                >
                                    <Card.Img variant="top" src={postData.pic} />
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
                : <p className="mt-3">No collections yet.</p>
                }
            </div>
        )
    } 
}

export default Userpage;