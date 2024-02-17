import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

const initialState = {
  user: null,
  userRegister: null,
  userForgotPassword: null,
  userNewPassword: null,
  isError: false,
  isSucces: false,
  isLoading: false,
  // const: localStorage.getItem("isLogged", response.data?.data?.token?.token) || false,
  isLoggedIn:
    localStorage.getItem("isLoggedIn", JSON.stringify(false)) || false,
  message: "",
};

// function login
export const LoginUser = createAsyncThunk(
  "user/loginUser",
  async (user, thunkAPI) => {
    try {
      const API_URL = import.meta.env.VITE_API_KEY;
      const response = await axios.post(`${API_URL}/api/v1/auth/staff/login`, {
        staff_id: user.staff_id,
        email: user.email,
        password: user.password,
        // "g-recaptcha-response": user.captcha,
        device_id: null,
      });
      // withCredentials = false

      // console.log(response.data.data.payload.customer_account_id);
      // console.log(response.data?.data?.token);
      localStorage.setItem("token", response.data?.data?.token, true);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));

      return response.data;
    } catch (error) {
      if (error.response) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "red",
          customClass: {
            popup: "colored-toast",
          },
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "error",
          text: error.response.data.message,
        });
        const message = error.response.data.message;
        return thunkAPI.rejectWithValue(message);
      }
    }
  }
);
// close  function login

// function register
export const RegisterUser = createAsyncThunk(
  "user/RegisterUser",
  async (userRegister, thunkAPI) => {
    try {
      const API_URL = import.meta.env.VITE_API_KEY;
      const response = await axios.post(
        `${API_URL}/api/v1/auth/customer/register`,
        {
          email: userRegister.email,
          password: userRegister.password,
          phoneNumber: userRegister.phone_number,
        }
      );

      const Toast = Swal.mixin({
        toast: true,
        position: "top-right",
        iconColor: "green",
        customClass: {
          popup: "colored-toast",
        },
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "success",
        text: "Register Success",
      }).then(() => {
        // Setelah SweetAlert ditutup, muat ulang halaman
        window.location.reload();
      });
      // console.log(response);

      // return response.data;
    } catch (error) {
      if (error.response) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "red",
          customClass: {
            popup: "colored-toast",
          },
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "error",
          text: error.response.data.message,
        });
        const message = error.response.data.message;
        return thunkAPI.rejectWithValue(message);
      }
    }
  }
);
// close function register

// function forgotpassword
export const ForgotPasswordUser = createAsyncThunk(
  "user/ForgotPasswordUser",
  async (userForgotPassword, thunkAPI) => {
    try {
      const API_URL = import.meta.env.VITE_API_KEY;
      const response = await axios.post(
        `${API_URL}/api/v1/customer-account-noverify/forgot-password`,
        {
          email: userForgotPassword.email,
        }
      );
      // withCredentials = false
      const Toast = Swal.mixin({
        toast: true,
        position: "top-right",
        iconColor: "green",
        customClass: {
          popup: "colored-toast",
        },
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "success",
        text: "Success, Silahkan ganti password dengan yang baru",
      }).then(() => {
        // Setelah SweetAlert ditutup, muat ulang halaman
        window.location.replace("/new_Password");
      });
      // console.log(response.data.data.payload.customer_account_id);
      console.log(response.data?.data);
      localStorage.setItem("data", response.data?.data, true);
      // localStorage.setItem("user", response.data.data.payload.customer_account_id, true);
      // console.log("Bearer", response);
      // console.log(response.data);

      return response.data;
    } catch (error) {
      if (error.response) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "red",
          customClass: {
            popup: "colored-toast",
          },
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "error",
          text: error.response.data.message,
        });
        const message = error.response.data.message;
        return thunkAPI.rejectWithValue(message);
      }
    }
  }
);
// close function forgotpassword

// function newpassword
export const NewPasswordUser = createAsyncThunk(
  "user/NewPasswordUser",
  async (userNewPassword, thunkAPI) => {
    try {
      const token = localStorage.getItem("data");
      const API_URL = import.meta.env.VITE_API_KEY;
      const response = await axios.post(
        `${API_URL}/api/v1/customer-account/new-password`,
        {
          new_password: userNewPassword.new_password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // withCredentials = false
      const Toast = Swal.mixin({
        toast: true,
        position: "top-right",
        iconColor: "green",
        customClass: {
          popup: "colored-toast",
        },
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "success",
        text: "Success, Password Berhasil di Ubah",
      }).then(() => {
        // Setelah SweetAlert ditutup, muat ulang halaman
        localStorage.clear();
        window.location.replace("/");
      });

      // console.log(response);

      return response.data;
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "red",
          customClass: {
            popup: "colored-toast",
          },
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "error",
          text: error.response.data.message,
        });
        const message = error.response.data.message;
        return thunkAPI.rejectWithValue(message);
      }
    }
  }
);
// function newpassword

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return { isLoggedIn: true };
    case "LOGOUT":
      return { isLoggedIn: false };
    default:
      return state;
  }
};
export const UserLogOut = async function () {
  try {
    await Parse.User.logOut();
    // To verify that current user is now empty, currentAsync can be used
    const currentUser = await Parse.User.current();
    if (currentUser === null) {
      alert("Success! No user is logged in anymore!");
    }
    // Update state variable holding current user

    return true;
  } catch (error) {
    alert(`Error! ${error.message}`);
    return false;
  }
};
export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
  try {
    const API_URL = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/api/v1/rfid/getUserSignedIn`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data.msg;
      return thunkAPI.rejectWithValue(message);
    }
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    //LoginUser
    builder.addCase(LoginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(LoginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSucces = true;
      state.user = action.payload;
    });
    builder.addCase(LoginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    //RegisterUser
    builder.addCase(RegisterUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(RegisterUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSucces = true;
      state.user = action.payload;
    });
    builder.addCase(RegisterUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    //ForgotPasswordUser
    builder.addCase(ForgotPasswordUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(ForgotPasswordUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSucces = true;
      state.user = action.payload;
    });
    builder.addCase(ForgotPasswordUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    //NewPasswordUser
    builder.addCase(NewPasswordUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(NewPasswordUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSucces = true;
      state.user = action.payload;
    });
    builder.addCase(NewPasswordUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
    // get user Login
    builder.addCase(getMe.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getMe.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSucces = true;
      state.userRegister = action.payload;
    });
    builder.addCase(getMe.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
