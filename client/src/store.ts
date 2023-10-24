import { configureStore } from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { combineReducers } from "redux";

import { userSigninReducer } from "./reducers/user-signin.reducer";

interface IState {
  user: {
    userInfo: object | null;
  };
  cart: {
    cartItems: object[];
    shippingAddress: object;
    paymentMethod: string;
  };
}

export const initialState: IState = {
  user: {
    userInfo: null,
  },
  cart: {
    cartItems: [],
    shippingAddress: {},
    paymentMethod: "",
  },
};

const reducer = combineReducers({
  userSignin: userSigninReducer,
});

const store: ToolkitStore = configureStore({
  reducer,
  preloadedState: initialState as unknown as object,
});

export default store;
