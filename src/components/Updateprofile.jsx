import React, { useState, useRef, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContexts";
import {
  updateEmail as updateEmailAuth,
  sendEmailVerification,
} from "firebase/auth";

export default function UpdateProfile() {
  const { currentUser, changePassword, changeEmail ,navVisible,toogleNavbar} = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [success, setSuccess] = useState("");
  const [showStatus, setStatus] = useState(false);
  const navigate = useNavigate();

let isMounted
  useEffect(() => {
     isMounted = true;

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleEmailChange() {
    try {
      await sendEmailVerification(currentUser);
      setSuccess(`Verification email sent to : ${currentUser.email}`);
      setStatus(true);
    } catch (error) {
      setStatus(false);
      console.error("Error sending verification email", error);
      setError("Failed to send verification email");
    }
  }

  async function handleConfirmEmailChange() {
    try {
      if (!currentUser.emailVerified) {
        setStatus(true);
        throw new Error(
          "Email not verified. Please verify the new email before changing."
        );
      }

      await updateEmailAuth(currentUser, newEmail);
      setSuccess("Email updated successfully");
    } catch (error) {
      if (isMounted) {
        setStatus(false);
        console.error("Error updating email in Firebase", error);
        setError("Email doesn't Exist");
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setStatus(false);
      return setError("Passwords do not match");
    }
    toogleNavbar()


    const promises = [];
    if (emailRef.current.value && emailRef.current.value !== currentUser.email ) {
      console.log(emailRef.current.value)
        setNewEmail(emailRef.current.value);
      promises.push(handleEmailChange());
    }
    if (passwordRef.current.value) {
      promises.push(changePassword(passwordRef.current.value));
    }

    setIsLoading(true);
    setError("");

    Promise.all(promises)
      .then(() => {
        if (isMounted) {
          
          navigate("/");
        }
      })
      .catch((e) => {
        if (isMounted) {
          console.log(e);
          setStatus(false);
          setError("Failed to Update Account");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
      setStatus(false)
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
              <h2 className="text-center mb-4">Update Profile</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {showStatus && <Alert variant="success">{success}</Alert>}
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  ref={emailRef}
                  placeholder={currentUser.email}
                />
              </Form.Group>

              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  placeholder="Leave blank to keep the same "
                />
              </Form.Group>

              <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordConfirmRef}
                  placeholder="Leave blank to keep the same "
                />
              </Form.Group>
              <Button
                disabled={isLoading}
                type="submit"
                style={{ background: "#4A4E74" }}
                className="w-100 mt-3"
              >
                Update
              </Button>

              <Button
                onClick={handleConfirmEmailChange}
                style={{ background: "#4A4E74" }}
                className="w-100 mt-3"
              >
                Confirm Email Change
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <div className="w-100 text-center mt-2">
          <Link to="/">Cancel</Link>
        </div>
      </div>
    </Container>
  );
}
