import {
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT,
} from "../constants/user-signin.constants";

export const userSigninReducer = (
  state = {},
  action: { type: string; payload: object | string | null }
) => {
  switch (action.type) {
    case USER_SIGNIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case USER_SIGNIN_SUCCESS:
      return {
        ...state,
        loading: false,
        userInfo: action.payload,
      };
    case USER_SIGNIN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case USER_SIGNOUT:
      return {};
    default:
      return state;
  }
};
