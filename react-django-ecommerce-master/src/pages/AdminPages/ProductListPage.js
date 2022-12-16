import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Table, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory, useLocation } from "react-router";
import { adminProductActions, productActions } from "../../store";
import Paginate from "../../components/Paginate";

const ProductListPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);
  const keyword = query.get("search") || "";
  const pageNo = +query.get("page") || 1;

  const productList = useSelector((state) => state.product);
  const { loading, error, products, pages, page } = productList;

  const productDelete = useSelector((state) => state.adminProductsList);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.adminProductsList.create);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(adminProductActions.adminProductReset());

    if (!userInfo.isAdmin) {
      history.replace("/login");
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(
        productActions.fetchProducts({
          keyword,
          pageNo,
        })
      );
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNo,
    keyword,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(adminProductActions.deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(adminProductActions.createProduct());
  };

  return (
    <div>
      <Row className="align-items-center text-start">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> &nbsp; Create Product
          </Button>
        </Col>
      </Row>

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}

      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Table striped responsive hover bordered className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {products &&
                products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>&#8377;{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>

                    <td>
                      <LinkContainer to={`/admin/product/${product._id}/edit`}>
                        <Button variant="light" className="btn-sm">
                          <i className="fa fa-edit"></i>
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="light"
                        className="btn-sm bg-danger btn-delete-hover"
                        onClick={() => deleteHandler(product._id)}
                        style={{ color: "whitesmoke" }}
                      >
                        <i className="fa fa-trash-alt"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>

          <Paginate page={page} pages={pages} isAdmin={true} />
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
