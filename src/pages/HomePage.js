import { Col, Container, Row } from "react-bootstrap";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { productActions } from "../store";
import { useLocation } from "react-router";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";

const HomePage = () => {
  const { products, error, page, pages } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();
  const query = new URLSearchParams(useLocation().search);

  let keyword = query.get("search") || "";
  let pageNo = +query.get("page") || 1;

  useEffect(() => {
    dispatch(productActions.fetchProducts({ keyword, pageNo }));
  }, [dispatch, keyword, pageNo]);

  return (
    <div>
      {!keyword && <ProductCarousel />}

      <h1>Latest Products</h1>
      <Container>
        {error ? (
          <Message variant="danger">{error}</Message>
        ) : products.length > 0 ? (
          <div>
            <Row>
              {products.map((product, idx) => (
                <Col sm={12} md={6} lg={4} xl={3} key={idx}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>

            <Paginate page={page} pages={pages} keyword={keyword} />
          </div>
        ) : (
          <Loader />
        )}
      </Container>
    </div>
  );
};

export default HomePage;
