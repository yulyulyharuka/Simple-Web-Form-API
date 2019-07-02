import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'

const cardStyles = {
  width: '40%',
  marginLeft: 30,
  marginTop: 20,  
  alignItems: 'center'
}

class TransferForm extends Component {
  render(){
    return(
      <div style={{ display:'center', width: '60%', alignItems: 'center' }}>
        <Form>
          <Form.Group as={Row} controlId="Bank">
            <Form.Label column sm="4">
              Bank
            </Form.Label>
            <Col sm="8">
              <Form.Control as="select">
                <option>BCA</option>
                <option>BNI</option>
                <option>...</option>
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="AccountNumber">
            <Form.Label column sm="4">
              Account Number
            </Form.Label>
            <Col sm="8">
              <Form.Control type="text" placeholder="Account Number"/>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextPassword">
            <Form.Label column sm="4">
              Note
            </Form.Label>
            <Col sm="8">
              <Form.Control type="text" placeholder="Note"/>
            </Col>
          </Form.Group>
        </Form>
      </div>
    )
  }
}

export default TransferForm