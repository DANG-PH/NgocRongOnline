"use client"
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../src/redux/store";
import {
  requestOtpStart,
  resetPasswordStart,
  clearMessage,
} from "../../../src/redux/auth/authSlice";
import { useRouter } from "next/navigation";




export default function ResetPassword() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, message, step, username } = useSelector(
    (state: RootState) => state.auth
  );

  const [localUsername, setLocalUsername] = useState("");
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Auto clear message
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => dispatch(clearMessage()), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Request OTP
  const handleRequestOtp = (e: any) => {
    e.preventDefault();
    if (!localUsername) return;

    dispatch(requestOtpStart({ username: localUsername }));
  };

  // Reset password
  const handleResetPassword = (e: any) => {
    e.preventDefault();
    const { otp, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) return;

    dispatch(
      resetPasswordStart({
        username,
        otp,
        newPassword,
      })
    );
  };

  useEffect(() => {
    if (message.type === "success" && message.text === "Đặt lại mật khẩu thành công") {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold text-center mb-4">
          {step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
        </h2>

        {/* Message */}
        {message.text && (
          <div
            className={`p-3 rounded mb-4 ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp}>
            <input
              type="text"
              placeholder="Nhập username"
              value={localUsername}
              onChange={(e) => setLocalUsername(e.target.value)}
              className="border p-3 w-full rounded mb-4"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded"
            >
              {loading ? "Đang gửi..." : "Gửi OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <input
              type="text"
              value={username}
              readOnly
              className="border p-3 w-full rounded mb-4 bg-gray-100"
            />

            <input
              name="otp"
              placeholder="Nhập OTP"
              value={formData.otp}
              onChange={(e) =>
                setFormData({ ...formData, otp: e.target.value })
              }
              className="border p-3 w-full rounded mb-4"
            />

            <input
              name="newPassword"
              type="password"
              placeholder="Mật khẩu mới"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="border p-3 w-full rounded mb-4"
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              className="border p-3 w-full rounded mb-4"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded"
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}