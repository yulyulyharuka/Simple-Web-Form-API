import React, {Component} from 'react'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import Alert from 'react-bootstrap/Alert'
import '../App.css'


const cardStyles = {
    width: '80%',
    marginLeft: 30,
    marginTop: 20,   
}

class UploadFile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedFile: null,
            show: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0 
        })

        event.preventDefault()
    }

    handleSubmit(event) {
        const data = new FormData()
        const config = {     
            headers: { 'content-type': 'multipart/form-data' }
        }
        data.append('file', this.state.selectedFile, this.state.selectedFile.name)

        axios.post('http://localhost:4000/uploadFile', data, config)
        .then(res => {
            if (res.data.Status === "200"){
                this.setState({
                    show: true
                })
            }
        })
        event.preventDefault()
    }

    render() {
        const handleHide = () => this.setState({ show: false });
        const handleShow = () => this.setState({ show: true });

        return (
            <div>
                <Card bg="light" border="dark" style={cardStyles}>
                    <Card.Header>Upload Your CSV File Here</Card.Header>
                    <Card.Body>
                        <Card.Title>Upload Your File!</Card.Title>
                        <Card.Text>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group controlId="formBasicFile">
                                    <Form.Label>File</Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        name="file"
                                        className="csv-input"
                                        onChange={this.handleChange}
                                        accept=".csv"
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Upload
                                </Button>
                            </Form>
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Alert show={this.state.show} variant="success" style={cardStyles}>
                    <Alert.Heading>File Successfully Uploaded</Alert.Heading>
                    <p>
                        Your file is uploaded to our server!
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                    <Button onClick={handleHide} variant="outline-success">
                        Close me!
                    </Button>
                    </div>
                </Alert>
            </div>
        )
    }
}

export default UploadFile