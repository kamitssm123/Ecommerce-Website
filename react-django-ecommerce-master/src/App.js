import { Container } from "react-bootstrap";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Footer from "./components/Footer";
import Header from "./components/Header";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PaymentPage from "./pages/PaymentPage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import ShippingPage from "./pages/ShippingPage";
import PlaceorderPage from "./pages/PlaceorderPage";
import OrderPage from "./pages/OrderPage";
import UserListPage from "./pages/AdminPages/UserListPage";
import UserEditPage from "./pages/AdminPages/UserEditPage";
import ProductListPage from "./pages/AdminPages/ProductListPage";
import ProductEditPage from "./pages/AdminPages/ProductEditPage";
import OrderListPage from "./pages/AdminPages/OrderListPage";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <main className="py-3">
          <Container>
            <Switch>
              <Route path="/" exact>
                <HomePage />
              </Route>
              <Route path="/product/:id">
                <ProductPage />
              </Route>
              <Route path="/cart/:id?">
                <CartPage />
              </Route>
              <Route path="/login">
                <LoginPage />
              </Route>
              <Route path="/register">
                <RegisterPage />
              </Route>
              <Route path="/profile">
                <ProfilePage />
              </Route>
              <Route path="/shipping">
                <ShippingPage />
              </Route>
              <Route path="/payment">
                <PaymentPage />
              </Route>
              <Route path="/placeorder">
                <PlaceorderPage />
              </Route>
              <Route path="/order/:id">
                <OrderPage />
              </Route>
              <Route path="/order/:id">
                <OrderPage />
              </Route>

              <Route path="/admin/userlist">
                <UserListPage />
              </Route>
              <Route path="/admin/user/:id/edit">
                <UserEditPage />
              </Route>

              <Route path="/admin/productlist">
                <ProductListPage />
              </Route>
              <Route path="/admin/product/:id/edit">
                <ProductEditPage />
              </Route>

              <Route path="/admin/orderlist">
                <OrderListPage />
              </Route>
            </Switch>
          </Container>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
