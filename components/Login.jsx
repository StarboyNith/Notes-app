import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth } from "../AuthContexts";
import { Link, useNavigate } from "react-router-dom";

export function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login,signInWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    // Cleanup function to set isMounted to false when the component is unmounted
    return () => {
      isMounted.current = false;
    };
  }, []);

  const isMounted = useRef(true);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setIsLoading(true);

      // Check if the component is still mounted before updating the state
      if (isMounted.current) {
        await login(emailRef.current.value, passwordRef.current.value);
        history("/");
      }
    } catch {
      setError("Email or Password doesn't match");
    } finally {
      // Check if the component is still mounted before updating the state
      if (isMounted.current) {
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
              style={{ fontFamily: "'Karla', sans-serif" }}
            >
              <h2 className="text-center mb-4">Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  ref={emailRef}
                  placeholder="Enter Your Email"
                  required
                ></Form.Control>
              </Form.Group>

              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  placeholder="Enter Password"
                  required
                ></Form.Control>
              </Form.Group>

              <Button
                disabled={isLoading}
                type="submit"
                style={{ background: "#4A4E74" }}
                className="w-100 mt-3"
              >
                Login
              </Button>
              <hr />
            </Form>
              <Button
                disabled={isLoading}
                type="submit"
                style={{ borderRadius:"30px",background:"white",color:"black" }}
                className="w-100 mt-3"
                onClick={signInWithGoogle}
              >
                <img style={{ height:"25px",marginRight:"8px" }} src="../Google.png" alt="" />
                Sign In With Google
              </Button>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </Container>
  );
}
