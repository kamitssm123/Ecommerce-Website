import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../containers/FormContainer";
import { userActions } from "../store";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const history = useHistory();
  const redirect = query.get("redirect");

  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const { error, loading, userInfo } = userState;

  useEffect(() => {
    if (userInfo) {
      //console.log(history)
      history.replace(redirect || "/");
    }
  }, [history, userInfo, redirect]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    dispatch(userActions.userRegister({ name, email, password }));
  };

  return (
    <FormContainer>
      <h1 className="mb-5">Sign Up</h1>
      {message && <Message variant="warning">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={onSubmitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Enter Password Again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="my-3">
          Sign Up
        </Button>

        <Row className="py-3">
          <Col>
            Already Registered?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              Sign In
            </Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default RegisterPage;
