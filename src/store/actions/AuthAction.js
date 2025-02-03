import { API_BASE_URL } from '../../constants/Url';
import {
  SET_SIGNUP_INFO,
  VERIFY_OTP,
  LOGIN,
  LOGOUT,
  UPDATE_PROFILE,
} from '../actions/type';

export const signup = (name, mobile, password, ref_code) => {
  return async dispatch => {
    const response = await fetch(
      API_BASE_URL+'signup_otp.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          mobile: mobile,
          password: password,
          ref_code : ref_code   
        }),
      },
    );

    const resData = await response.json();

    if(resData.status == 401){
      throw new Error(resData.msg);
    }

    dispatch({
      type: SET_SIGNUP_INFO,
      name: name,
      mobile: mobile,
      password: password,
      ref_code: ref_code
    });
  };
};

export const updateProfileData = (name, mobile, password, email) => {

  return async dispatch => {
    const response = await fetch(
      API_BASE_URL+'updateProfileData.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          mobile: mobile,
          password: password,
          email: email,
        }),
      },
    );

    const resData = await response.json();

    if(resData.status == 401){
      throw new Error(resData.msg);
    }

    // console.log(resData);
    dispatch({
      type: UPDATE_PROFILE,
      name: name,
      mobile: mobile,
      password: '',
      token: resData.token,
    });
  };
};

export const verifyotp = (name, mobile, password, otp, fcmToken, ref_code) => {
  return async dispatch => {
    const response = await fetch(
      API_BASE_URL+'verify_signup_otp.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          mobile: mobile,
          password: password,
          otp: otp,
          fcmToken: fcmToken,
          ref_code: ref_code
        }),
      },
    );

    const resData = await response.json();

    if(resData.status == 401){
      throw new Error(resData.msg);
    }

    // console.log(resData);

    dispatch({
      type: VERIFY_OTP,
      name: name,
      mobile: mobile,
      password: password,
      token: resData.token,
      ref_code: ref_code
    });
  };
};

export const login = (mobile, password, fcmToken) => {
  return async dispatch => {
    const response = await fetch(
      API_BASE_URL+'login.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: mobile,
          password: password,
          fcmToken: fcmToken
        }),
      },
    );

    const resData = await response.json();

    if(resData.status == 401){
      throw new Error(resData.msg);
    }

    dispatch({
      type: LOGIN,
      name: resData.user.name,
      mobile: resData.user.mobile,
      password: resData.user.password,
      token: resData.token,
    });

  };
};

export const logout = () => {
  return {type: LOGOUT};
};

export const changePassword = (mobile, password, fcmToken) => {
  return async dispatch => {
    const response = await fetch(
      API_BASE_URL+'changePassword.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: mobile,
          password: password,
          fcmToken: fcmToken
        }),
      },
    );

    const resData = await response.json();

    if(resData.status == 401){
      throw new Error(resData.msg);
    }

    // console.log(resData.user.mobile);

    dispatch({
      type: LOGIN,
      name: resData.user.name,
      mobile: resData.user.mobile,
      password: resData.user.password,
      token: resData.token,
    });

  };
};