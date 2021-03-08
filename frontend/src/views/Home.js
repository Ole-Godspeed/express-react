import React, { useState, useEffect } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useAuth } from "../context/AuthContext";
import { Redirect } from 'react-router-dom';
import { Alert, Button, Card, Form, Table } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';

function Home() {

  const [udata, setUdata] = useState([]);
  const { isDark } = useAuth();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    axios.post("http://localhost:3000/home",{},{ withCredentials: true })
    .then(result => {
      if (result.status === 200) {
        setUdata(result.data.users);
      }
    }).catch(e => {
      console.log(e)
    });
  }, []);

  const nullChecker = cell => (!cell ? "-" : cell);

  const columns = [{
    dataField: 'id',
    text: 'ID'
  }, {
    dataField: 'username',
    text: 'Name',
    formatter: nullChecker
  }, {
    dataField: 'email',
    text: 'Email',
    formatter: nullChecker
  }];

  const tableRowEvents = {
    onClick: (e, row, rowIndex) => {
      setRedirect(row.id);
    },
    onMouseEnter: (e, row, rowIndex) => {
      // console.log(`enter on row with index: ${row.id}`);
    }
  }
  
  if (redirect !== false) {
    return <Redirect to={"/users/id"+redirect} />;
  }

  return (
    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        { udata.length !== 0 ?
          <BootstrapTable
            classes={'m-2 w-25 mr-auto '+(isDark ? "table-dark" : "table-active")}
            bordered
            hover
            keyField='id'
            data={ udata }
            columns={ columns }
            rowEvents={ tableRowEvents }/>
          : <p className="mt-3">No items yet.</p> }
    </div>
  );
}
  
export default Home;