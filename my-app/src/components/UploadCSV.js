// reading csv files via react using "react-csv-reader" library
import React, { Component } from "react"
import CSVReader from 'react-csv-reader'
import Card from 'react-bootstrap/Card'
import '../App.css'

const cardStyles = {
    width: '80%',
    marginLeft: 30,
    marginTop: 20,   
}

class UploadCSV extends Component {
  constructor(props){
    super(props)
    
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(data){
    let key = []

    for (let x = 0; x < data[0].length; x++) {
      key.push(data[0][x]);
    }
    
    let arr = {};
    let result = [];

    for (let i = 1; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        arr[key[j]] = data[i][j];
      }
      result.push(JSON.stringify(arr))
    }

    console.log(result)
  }

  render() {
    return (
      <Card bg="light" border="dark" style={cardStyles}>
        <Card.Header>CSV Uploader</Card.Header>
        <Card.Body>
          <Card.Title>Upload Your File!</Card.Title>
          <Card.Text>
            <CSVReader
                cssClass="react-csv-input"
                label="Click this button to upload your csv file"
                onFileLoaded={this.handleSubmit}
            />  
          </Card.Text>
        </Card.Body>
      </Card>    
    )
  }
}

export default UploadCSV