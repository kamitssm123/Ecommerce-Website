import {
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  Row,
  Container,
} from "react-bootstrap";
import { Link, useHistory, useParams } from "react-router-dom";
import Rating from "../components/Rating";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productActions, reviewActions } from "../store";
import Message from "../components/Message";
import Loader from "../components/Loader";

const ProductPage = (props) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const { product, error, loading } = useSelector((state) => state.product);
  const { userInfo } = useSelector((state) => state.user);
  const {
    success: successReview,
    error: errorReview,
    loading: loadingReview,
  } = useSelector((state) => state.review);

  useEffect(() => {
    if (successReview) {
      setRating(0);
      setComment("");
      dispatch(reviewActions.reviewReset());
    }

    dispatch(productActions.fetchSingleProduct(params.id));
  }, [dispatch, params.id, successReview]);

  const addToCartHandler = () => {
    history.push(`/cart/${params.id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      reviewActions.createReview({
        productId: params.id,
        review: { rating, comment },
      })
    );
  };

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>

      {error ? (
        <Message variant="danger">{error}</Message>
      ) : loading ? (
        <Loader />
      ) : (
        product && product.reviews && (
          <Container>
            <Row>
              <Col md={6}>
                <Image src={product.image} alt={product.name} fluid />
              </Col>

              <Col md={3} style={{ fontSize: "100%" }}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>{product.name}</h3>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                      color="#f8e825"
                    />
                  </ListGroup.Item>

                  <ListGroup.Item>Price: &#8377;{product.price}</ListGroup.Item>
                  <ListGroup.Item>
                    Description: {product.description}
                  </ListGroup.Item>
                </ListGroup>
              </Col>

              <Col md={3}>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>
                          <strong>&#8377;{product.price}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    {product.countInStock > 0 && (
                      <ListGroup.Item>
                        <Row>
                          <Col>Qty</Col>
                          <Col xs="auto" className="my-1">
                            <Form.Control
                              as="select"
                              value={qty}
                              onChange={(e) => setQty(Number(e.target.value))}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x, idx) => (
                                  <option key={idx}>{x + 1}</option>
                                )
                              )}
                            </Form.Control>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )}

                    <ListGroup.Item
                      className={`text-center ${
                        product.countInStock <= 0 ? "cursor-not" : null
                      }`}
                    >
                      <Button
                        type="button"
                        disabled={product.countInStock > 0 ? false : true}
                        className="btn-block"
                        onClick={addToCartHandler}
                      >
                        Add To Cart
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mt-4">
                <h4>Reviews</h4>
                {product.reviews.length === 0 && (
                  <Message variant="info">No Reviews Yet</Message>
                )}

                <ListGroup variant="flush">
                  {product.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} color="#f8e825" />
                      <p>
                        {new Date(review.createdAt).toLocaleDateString("en-IN")}
                      </p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item>
                    <h1>Write a Review</h1>

                    {loadingReview && <Loader />}
                    {successReview && (
                      <Message variant="success">Review Submitted</Message>
                    )}
                    {errorReview && <Message variant="danger">{errorReview}</Message>}

                    {userInfo ? (
                      <Form onSubmit={submitHandler}>
                        <Form.Group controlId="rating">
                          <Form.Label>Rating</Form.Label>
                          <Form.Control
                            as="select"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                          >
                            <option value="">Select...</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Satisfactory</option>
                            <option value="4">4 - Great</option>
                            <option value="5">5 - Excellent</option>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="comment">
                          <Form.Label>Review</Form.Label>
                          <Form.Control
                            as="textarea"
                            row={5}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          ></Form.Control>
                        </Form.Group>

                        <Button
                          disabled={loadingReview}
                          type="submit"
                          variant="primary"
                          className="mt-4"
                        >
                          Submit
                        </Button>
                      </Form>
                    ) : (
                      <Message variant="warning">
                        Please <Link to="/login">login</Link> to write a review.
                      </Message>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </Container>
        )
      )}
    </div>
  );
};

export default ProductPage;
