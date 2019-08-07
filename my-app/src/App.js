import React, { Fragment } from 'react';
import './App.css';
import { withRouter } from 'react-router';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import UploadFile from './components/UploadFile';
import UploadCSV from './components/UploadCSV';
import TransferForm from './components/TransferForm';
import Login from './components/Login/Login';

const HeaderWithRouter = withRouter(Header);

function App() {
  return (
    <div>
      <Router>
        <Fragment>
          <HeaderWithRouter />
          <Route exact path="/" component={Home} />
          <Route path="/registration" component={RegistrationForm} />
          <Route path="/uploadFile" component={UploadFile} />
          <Route path="/uploadCSV" component={UploadCSV} />
          <Route path="/transfer" component={TransferForm} />
          <Route path="/login" component={Login} />
        </Fragment>
      </Router>
    </div>
  );
}

export default App;
