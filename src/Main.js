import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import logo from "./logo.png";
import "./Main.css";

function Main() {
  return (
    <div className="landing-page">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col md={6}>
            <img src={logo} alt="BlockPro Logo" className="landing-logo" />
            <h1>Welcome to BlockPro</h1>
            <p>Connect with professionals and build your blockchain profile.</p>
            <Link to="/signup">
              <Button variant="primary">Get Started</Button>
            </Link>
          </Col>
        </Row>
        <div>
          {/* Features */}
          <section className="features">
            <div className="container">
              <h2>Why BlockPro?</h2>
              <div className="feature-item">
                <h3>Decentralised Profiles</h3>
                <p>
                  Create and manage your profile securely on the blockchain.
                </p>
              </div>
              <div className="feature-item">
                <h3>Network with Professionals</h3>
                <p>
                  Connect with like-minded professionals in the blockchain
                  industry.
                </p>
              </div>
              <div className="feature-item">
                <h3>Discover Opportunities</h3>
                <p>
                  Explore job opportunities and collaborations in the blockchain
                  space.
                </p>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="testimonials">
            <div className="container">
              <h2>What Our Users Say</h2>
              <div className="testimonial">
                <p>
                  "BlockPro has revolutionized the way I showcase my skills and
                  connect with others in the blockchain community."
                </p>
                <span>- John Doe, Blockchain Developer</span>
              </div>
              <div className="testimonial">
                <p>
                  "I've found amazing job opportunities through BlockPro. It's a
                  game-changer!"
                </p>
                <span>- Jane Smith, Blockchain Enthusiast</span>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="cta">
            <div className="container">
              <h2>Ready to get started?</h2>
              <button className="btn btn-primary">Create Your Profile</button>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}

export default Main;
