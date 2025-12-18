import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  username: string;
  step: number;
  loading: boolean;
  message: {
    text: string;
    type: "success" | "error" | "";
  };
}

const initialState: AuthState = {
  username: "",
  step: 1,
  loading: false,
  message: { text: "", type: "" },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    requestOtpStart: (
      state,
      action: PayloadAction<{ username: string }>
    ) => {
      state.loading = true;
      state.username = action.payload.username;
    },

    resetPasswordStart: (
      state,
      action: PayloadAction<{
        username: string;
        otp: string;
        newPassword: string;
      }>
    ) => {
      state.loading = true;
    },

    requestOtpSuccess: (state) => {
      state.loading = false;
      state.step = 2;
      state.message = { text: "Gửi OTP thành công", type: "success" };
    },

    resetPasswordSuccess: (state) => {
      state.loading = false;
      state.message = { text: "Đặt lại mật khẩu thành công", type: "success" };
    },

    authError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.message = { text: action.payload, type: "error" };
    },

     resetPasswordFail: (state, action) => {
      state.loading = false;
      state.message = { text: action.payload, type: "error" };
    },
     requestOtpFail: (state, action) => {
      state.loading = false;
      state.message = { text: action.payload, type: "error" };
    },


    clearMessage: (state) => {
      state.message = { text: "", type: "" };
    },
  },
});

export const {
  requestOtpStart,
  resetPasswordStart,
  requestOtpSuccess,
  resetPasswordSuccess,
  authError,
  clearMessage,
  requestOtpFail,
  resetPasswordFail,
} = authSlice.actions;

export default authSlice.reducer;