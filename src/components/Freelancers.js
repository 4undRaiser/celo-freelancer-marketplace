import React from "react";
import { useState } from "react";
import { Card, Badge, Col, Stack, Row } from "react-bootstrap";

export const Freelancers = (props) => {
  const [newPrice, setNewPrice] = useState("");
  const [hours, setHours] = useState("");
  const [newDescription, setNewDescription] = useState("");

  return (
    <Row xs={1} md={3} className="g-4">
      {props.freelancers.map((freelancer) => (
        <Col key={freelancer.index}>
          <Card className="h-100">
            <Card.Header>
              <Stack direction="horizontal" gap={2}>
                <Badge bg="secondary" className="ms-auto">
                  {freelancer.index} ID
                </Badge>

                <Badge bg="secondary" className="ms-auto">
                  {freelancer.price} cUSD per hour
                </Badge>

                <Badge bg="secondary" className="ms-auto">
                  {freelancer.noOfJobs} Jobs Done
                </Badge>
              </Stack>
            </Card.Header>

            <div className=" ratio ratio-4x3">
              <img
                src={freelancer.image}
                alt={freelancer.description}
                style={{ objectFit: "cover" }}
              />
            </div>

            <Card.Body className="d-flex  flex-column text-center">

            <Card.Title className="flex-grow-1">
              {freelancer.name}
              </Card.Title>
              <Card.Title className="flex-grow-1">
              {freelancer.title}
              </Card.Title>

              <Card.Text className="flex-grow-1">
                {freelancer.description}
              </Card.Text>
              <Badge bg="secondary" className="ms-auto">
                  {freelancer.available ? "Available for Hire" : "Not Available"} {freelancer.available}
                </Badge>



              { freelancer.freelancerAddress === props.walletAddress && (
              <button
                    type="button"
                    onClick={() => props.toggleAvailable(freelancer.index)}
                    class="btn btn-dark btn-sm mt-1"
                  >
                    {freelancer.available ? "Set to Not Available" : "Set to Available"}
                  </button>
              )}
           

         { freelancer.freelancerAddress !== props.walletAddress && freelancer.available === true && (
              <form>
                <div class="form-r">
                  <input
                    type="number"
                    class="form-control mt-3"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="enter duration in hours"
                  />
                  <button
                    type="button"
                    onClick={() => props.hireFreelancer(freelancer.index, hours)}
                    class="btn btn-dark mt-1"
                  >
                    Hire this freelancer
                  </button>
                </div>
              </form>
             )}

        { freelancer.freelancerAddress === props.walletAddress && (
              <form>
                <div class="form-r">
                  <input
                    type="number"
                    class="form-control mt-3"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="enter new price"
                  />

                  <button
                    type="button"
                    onClick={() => props.changePrice(freelancer.index, newPrice)}
                    class="btn btn-dark mt-1"
                  >
                    Update Hourly Rate
                  </button>
                </div>
              </form>
             )}

            { freelancer.freelancerAddress === props.walletAddress && (
              <form>
                <div class="form-r">
                  <input
                    type="text"
                    class="form-control mt-3"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="enter new description"
                  />

                  <button
                    type="button"
                    onClick={() => props.changeDescription(freelancer.index, newDescription)}
                    class="btn btn-dark mt-1"
                  >
                    Change Description
                  </button>
                </div>
              </form>
             )}

             
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
