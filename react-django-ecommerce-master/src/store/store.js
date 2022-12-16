import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
import checkoutReducer from "./checkoutSlice";
import userDetailReducer from "./userSlices/userDetailSlice";
import userReducer from "./userSlices/userSlice";
import orderReducer from "./orderSlices/orderSlice";
import eachOrderReducer, {
  orderPayReducer,
} from "./orderSlices/eachOrderSlice";
import getAllOrdersReducer from "./orderSlices/getAllOrdersSlice";
import adminUserReducer from "./adminSlices/adminUserSlice";
import adminProductReducer from "./adminSlices/adminProductSlice";
import adminOrderReducer from "./adminSlices/adminOrderSlice";
import reviewReducer from "./reviewSlice";

const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    user: userReducer,
    userDetail: userDetailReducer,
    checkout: checkoutReducer,
    order: orderReducer,
    eachOrder: eachOrderReducer,
    orderPay: orderPayReducer,
    allOrders: getAllOrdersReducer,
    adminUsersList: adminUserReducer,
    adminProductsList: adminProductReducer,
    adminOrdersList: adminOrderReducer,
    review: reviewReducer,
  },
});

export default store;
