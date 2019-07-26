import React, { Fragment } from 'react'
import './App.css';
import { withRouter } from 'react-router'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import RegistrationForm from './components/RegistrationForm'
import UploadFile from './components/UploadFile'
import UploadCSV from './components/UploadCSV'
import TransferForm from './components/TransferForm'
import DataTable from './components/DataTable'
const HeaderWithRouter = withRouter(Header)

function App() {
  return (
    <div>
      <Router>
        <Fragment>
          <HeaderWithRouter />
          <Route exact path="/" component={Home}/>
          <Route path="/registration" component={RegistrationForm}/>
          <Route path="/uploadFile" component={UploadFile}/>
          <Route path="/uploadCSV" component={UploadCSV}/>
          <Route path="/transfer" component={TransferForm}/>
          <DataTable />
        </Fragment>
      </Router>
    </div>
  )
}

export default App;
