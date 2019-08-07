import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import './Login.css';
import { Divider, Button } from '@material-ui/core';

export default function Login() {
  const [values, setValues] = React.useState({
    email: '',
    password: '',
  });

  const handleChange = prop => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  return (
    <div className="card">
      <h2 className="title">LOGIN</h2>
      <form>
        <div className="text">
          <TextField
            id="email"
            variant="outlined"
            label="Email"
            value={values.email}
            onChange={handleChange('email')}
            placeholder="Email"
            InputProps={{
              startAdornment: <InputAdornment position="start">
                {' '}
                <EmailIcon />
                {' '}
              </InputAdornment>,
              name: 'user_email',
            }}
          />
        </div>
        <div className="text">
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            value={values.password}
            onChange={handleChange('password')}
            placeholder="Password"
            InputProps={{
              startAdornment: <InputAdornment position="start">
                {' '}
                <LockIcon />
                {' '}
              </InputAdornment>,
              name: 'password',
            }}
          />
        </div>
        <div>
          <Divider id="divider"/>
        </div>
        <div>
          <Button variant="contained" color="primary">
            LOGIN
          </Button>
        </div>
      </form>
    </div>
  );
}
