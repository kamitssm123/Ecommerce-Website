import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import FormContainer from "../../containers/FormContainer";
import { adminUserActions, userDetailActions } from "../../store";

const UserEditPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const history = useHistory();
  const params = useParams();
  const userId = params.id;

  const dispatch = useDispatch();
  const userState = useSelector((state) => state.userDetail);
  const { error, loading, user } = userState;

  const userUpdate = useSelector((state) => state.userDetail.user);
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = userUpdate;

  const onSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(
      adminUserActions.adminUserPut({ _id: user._id, name, email, isAdmin })
    );
  };

  useEffect(() => {
    if (successUpdate) {
      dispatch(adminUserActions.adminUserGetReset());
      history.push("/admin/userlist");
    } else {
      if (!user.name || user._id !== +userId) {
        dispatch(userDetailActions.getUser(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, user, userId, successUpdate, history]);

  return (
    <div>
      <Link to="/admin/userlist">Go back</Link>

      <FormContainer>
        <h1 className="mb-5">Edit User</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={onSubmitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="isadmin">
              <Form.Check
                type="checkbox"
                label="Is Admin?"
                checked={isAdmin}
                className="mt-4"
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type="submit" variant="primary" className="my-3">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default UserEditPage;
