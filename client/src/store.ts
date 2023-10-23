import { Reducer, combineReducers, compose } from "redux";

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

const reducer: Reducer = combineReducers({});

const composeEnhancer =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
