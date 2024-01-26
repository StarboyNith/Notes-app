import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth } from "../AuthContexts";
import { Link, useNavigate } from "react-router-dom";

export function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, signInWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useNavigate();
  let isMounted;
  useEffect(() => {
    // Add a variable to track component mount status
    isMounted = true;

    return () => {
      // Cleanup: Set the variable to false when the component is unmounted
      isMounted = false;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setIsLoading(true);

      // Check if the component is still mounted before updating the state
      if (isMounted) {
        await signup(emailRef.current.value, passwordRef.current.value);
        history("/");
      }
    } catch {
      setError("Failed to create Account");
    } finally {
      // Check if the component is still mounted before updating the state
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <Form
              onSubmit={handleSubmit}
              style={{
                fontFamily: "'Karla', sans-serif",
              }}
            >
              <h2 className="text-center mb-4">Sign Up</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  ref={emailRef}
                  placeholder="Enter Your Email"
                  required
                />
              </Form.Group>

              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  placeholder="Enter Password"
                  required
                />
              </Form.Group>

              <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordConfirmRef}
                  placeholder="Confirm Password"
                  required
                />
              </Form.Group>
              <Button
                disabled={isLoading}
                type="submit"
                style={{ background: "#4A4E74" }}
                className="w-100 mt-3"
              >
                Sign Up
              </Button>

              <hr />
              <Button
                disabled={isLoading}
                style={{ borderRadius: "30px", background: "white", color: "black" }}
                className="w-100 mt-3 "
                onClick={signInWithGoogle}
              >
                <img style={{ height: "25px", marginRight: "8px" }} src="../Google.png" alt="" />
                SignUp With Google
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <div className="w-100 text-center mt-2">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </Container>
  );
}
