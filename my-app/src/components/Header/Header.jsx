import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

export default function Header(props) {
  const { location } = props;
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="#home">Hello</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav
          className="mr-auto"
          activeKey={location.pathname}
        >
          <Nav.Link exact href="/">Home</Nav.Link>
          <Nav.Link href="/registration">Registration</Nav.Link>
          <Nav.Link href="/uploadFile">Upload</Nav.Link>
          <Nav.Link href="/uploadCSV">Upload!</Nav.Link>
          <Nav.Link href="/transfer">Transfer</Nav.Link>
        </Nav>
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-info">Search</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}
