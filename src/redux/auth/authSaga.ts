import { call, put, takeLatest, delay } from "redux-saga/effects";
import {
  requestOtpStart,
  requestOtpSuccess,
  requestOtpFail,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFail,
} from "./authSlice";
import { authApi } from "../../services/authApi";

function* handleRequestOtp(action: any): any {
  try {
    const { username } = action.payload;
    const res = yield call(authApi.requestOTP, username);

    if (res.success) {
      yield put(requestOtpSuccess());
    } else {
      yield put(requestOtpFail(res.message || "Không thể gửi OTP"));
    }
  } catch (err: any) {
    yield put(requestOtpFail(err.message));
  }
}

function* handleResetPassword(action: any): any {
  try {
    const res = yield call(authApi.resetPassword, action.payload);

    if (res.success) {
      yield put(resetPasswordSuccess());
    } else {
      yield put(resetPasswordFail(res.message || "Không thể reset mật khẩu"));
    }
  } catch (err: any) {
    yield put(resetPasswordFail(err.message));
  }
}

export default function* authSaga() {
  yield takeLatest(requestOtpStart.type, handleRequestOtp);
  yield takeLatest(resetPasswordStart.type, handleResetPassword);
}