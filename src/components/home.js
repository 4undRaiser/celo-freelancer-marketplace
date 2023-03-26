import React, { useState } from "react";

import {
  Button,
  Modal,
  Form,
  FloatingLabel,
  Nav,
  Badge,
  Container,
  Navbar,
} from "react-bootstrap";

const Home = (props) => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");


  const isFormFilled = () => image && name && title && description && price;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="#home">FreeLancer Marketplace</Navbar.Brand>
          <Navbar.Toggle />
          <Nav className="me-auto">
            <Badge bg="secondary" className="ms-auto">
              Balance {props.cUSDBalance}cUSD
            </Badge>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <Button onClick={handleShow} variant="dark">
              <h5> New freelancer </h5>
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Freelancer</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputImage"
              label="Image"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setImage(e.target.value);
                }}
                placeholder="Image"
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="inputName"
              label="name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Enter name"
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="inputTitle"
              label="title"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="Enter Career title"
              />
            </FloatingLabel>
            

            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="Enter carrer description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>


            <FloatingLabel controlId="inputPrice" label="price" className="mb-3">
              <Form.Control
                type="number"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
                placeholder="Enter price per hour"
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              props.addFreelancer(image, name, title, description, price);
              handleClose();
            }}
          >
            Add new freelancer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Home;
