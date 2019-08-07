/* eslint-disable linebreak-style */
import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import './Home.css';

function Home() {
  return (
    <div>
      <Jumbotron fluid>
        <Container>
          <h1>Welcome!</h1>
        </Container>
      </Jumbotron>
      <div className="content">
        <img
          src={`${process.env.PUBLIC_URL}assets/tasks_i.png`}
          alt="task"
          className="image"
        />
      </div>
      <div className="registerButton">
        <Button
          variant="warning"
          size="lg"
        >
          Register Here!
        </Button>
      </div>
    </div>
  );
}

export default Home;
