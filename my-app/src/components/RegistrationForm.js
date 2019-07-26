import React, {Component} from 'react'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

const cardStyles = {
    width: '80%',
    marginLeft: 30,
    marginTop: 20,   
}

class RegistrationForm extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            username: '',
            email: '',
            password: '', 
            selectedDate: new Date()
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChangeDate = this.handleChangeDate.bind(this)
    }

    handleChange(event) { 
        this.setState({ 
            [event.target.name]: event.target.value
        })
    }

    handleChangeDate(date) {
      this.setState({
        selectedDate: date
      });
      console.log(this.state.selectedDate)
    }

    handleSubmit(event) {
      // alert(this.state.username)
      axios.post('http://localhost:4000/submit', JSON.stringify(this.state))        
      .then(res => {
          if (res.data.Status === "Succesfully Registered") {
            console.log("Hello")
            this.props.history.push('/')
          }
      })
      .catch(error => {
          console.log(error.response.status)
      })
      event.preventDefault()
    }

    render() {
        const { selectedDate } = this.state;
        return (
            <Card bg="light" border="dark" style={cardStyles}>
              <Card.Header>Registration Here!</Card.Header>
              <Card.Body>
                <Card.Title>Register Yourself Here!</Card.Title>
                <Card.Text>
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>Username</Form.Label>
                      <Form.Control 
                          type="text" 
                          name="username"
                          placeholder="Enter username" 
                          value={this.state.username} 
                          onChange={this.handleChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="email"
                            placeholder="Enter email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicChecbox">
                      <Form.Label>Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        name="password"
                        placeholder="Password" 
                        value={this.state.password}
                        onChange={this.handleChange}/>
                    </Form.Group>

                    <DatePicker
                      selected={this.state.selectedDate}
                      onChange={this.handleChangeDate}
                    />

                    <div>
                      {selectedDate && <p>Day: {selectedDate.getMonth()}</p>}
                      {!selectedDate}
                      <DayPickerInput onDayChange={this.handleChangeDate} />
                    </div>

                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </Form>
                </Card.Text>
              </Card.Body>
            </Card>
        )
    }
}

export default RegistrationForm