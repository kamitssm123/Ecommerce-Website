import { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import CheckoutSteps from "../components/CheckoutSteps";
import FormContainer from "../containers/FormContainer";
import { checkoutActions } from "../store";

const PaymentPage = () => {
  const ship = useSelector((state) => state.checkout.shippingAddress);
  const history = useHistory();
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState(
    JSON.parse(localStorage.getItem("paymentMethod")) || "PayPal"
  );

  if (!ship.city) {
    history.replace("/shipping");
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(checkoutActions.savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <Form onSubmit={submitHandler}>
        <Form.Group value={paymentMethod}>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="PayPal or Credit Card"
              value="PayPal"
              id="paypal"
              name="paymentMethod"
              checked={paymentMethod === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              type="radio"
              label="Cash on Delivery"
              value="Cash On Delivery"
              id="cod"
              name="paymentMethod"
              checked={paymentMethod === "Cash On Delivery"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-4">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentPage;
