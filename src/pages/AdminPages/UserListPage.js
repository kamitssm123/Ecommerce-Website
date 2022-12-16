import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminUserActions } from "../../store";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory } from "react-router";

const UserListPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const userList = useSelector((state) => state.adminUsersList);
  const { loading, error, users, success: successDelete } = userList;

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) dispatch(adminUserActions.adminUserGet());
    else history.replace("/login");
  }, [dispatch, history, successDelete, userInfo]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this user?"))
      dispatch(adminUserActions.adminUserDelete(id));
  };

  return (
    <div>
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped responsive hover bordered className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users && users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? (
                    <i
                      className="fas fa-check-square"
                      style={{ color: "green" }}
                    ></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fa fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="light"
                    className="btn-sm bg-danger btn-delete-hover"
                    onClick={() => deleteHandler(user._id)}
                    style={{ color: "whitesmoke" }}
                  >
                    <i className="fa fa-trash-alt"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserListPage;
