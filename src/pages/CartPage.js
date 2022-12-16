import { useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import { cartActions } from "../store";

const CartPage = () => {
  const params = useParams();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const productId = params.id;
  const search = new URLSearchParams(location.search);
  const qty = Number(search.get("qty"));

  const { cartItems, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (productId) {
      dispatch(cartActions.addToCart({ id: productId, qty }));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(cartActions.removeFromCart(id));
  };

  const checkoutHandler = () => {
    history.push("/login?redirect=shipping");
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {error ? (
          <Message variant="danger">{error}</Message>
        ) : cartItems.length === 0 ? (
          <Message variant="info">
            Your Cart is empty. <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => {
              return (
                <ListGroup.Item key={item.product}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>&#8377;{item.price}</Col>
                    <Col md={3}>
                      <i
                        className="fas fa-chevron-down text-black-50"
                        style={{
                          position: "relative",
                          top: "2rem",
                          right: "1rem",
                          float: "right",
                        }}
                      ></i>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        className="cursor-pointer"
                        onChange={(e) =>
                          dispatch(
                            cartActions.addToCart({
                              id: item.product,
                              qty: parseInt(e.target.value),
                            })
                          )
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x, idx) => (
                          <option key={idx}>{x + 1}</option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={1}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal [{cartItems.reduce((acc, item) => acc + item.qty, 0)}]
                items
              </h2>
              ₹
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>

            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block w-100"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartPage;
