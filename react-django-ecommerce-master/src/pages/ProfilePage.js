import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getAllOrdersActions, userDetailActions } from "../store";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const history = useHistory();

  const dispatch = useDispatch();
  const userDetail = useSelector((state) => state.userDetail);
  const { error, loading, user, success } = userDetail;

  const userLogin = useSelector((state) => state.user);
  const { userInfo } = userLogin;

  const allOrders = useSelector((state) => state.allOrders);
  const { loading: loadingOrders, error: errorOrders, orders } = allOrders;

  useEffect(() => {
    if (!userInfo) {
      //console.log(history)
      history.replace("/login");
    } else {
      if (!user || !user.name || success || userInfo._id !== +user._id) {
        dispatch(userDetailActions.getUser("profile"));
        dispatch(getAllOrdersActions.getAllOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [history, userInfo, dispatch, user, success]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (password != confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    } else {
      setMessage("");
      dispatch(
        userDetailActions.updateUser({ id: user._id, name, email, password })
      );
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
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
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password Again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="my-3">
            Update Profile
          </Button>
        </Form>
      </Col>

      <Col md={9}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : (
          <Table striped responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>View Order</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((orderItem) => (
                <tr key={orderItem._id}>
                  <td>{orderItem._id}</td>
                  <td>{orderItem.createdAt.slice(0, 10)}</td>
                  <td>&#8377;{orderItem.totalPrice}</td>
                  <td>
                    {orderItem.isPaid ? (
                      orderItem.paidAt.slice(0, 10)
                    ) : (
                      <i
                        className="fas fa-times-circle"
                        style={{ color: "red" }}
                      ></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${orderItem._id}`}>
                      <Button className="btn-sm">Details</Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfilePage;
