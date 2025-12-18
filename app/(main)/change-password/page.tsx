"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePassword() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.oldPassword || !formData.newPassword) {
      showMessage("Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }

    if (formData.newPassword.length < 6) {
      showMessage("Mật khẩu mới phải có ít nhất 6 ký tự!", "error");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      showMessage("Mật khẩu mới phải khác mật khẩu cũ!", "error");
      return;
    }

    // Get token from localStorage
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      showMessage("Vui lòng đăng nhập!", "error");
      router.push("/login");
      return;
    }

    const userData = JSON.parse(stored);
    const accessToken = userData.access_token;

    if (!accessToken) {
      showMessage("Token không hợp lệ!", "error");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showMessage("Đổi mật khẩu thành công!", "success");
        
        // Reset form
        setFormData({
          oldPassword: "",
          newPassword: "",
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          localStorage.removeItem("currentUser");
          router.push("/login");
        }, 2000);
      } else {
        throw new Error(data.error || "Đổi mật khẩu thất bại");
      }
    } catch (error: any) {
      console.error("Error:", error);
      showMessage(
        error.message || "Có lỗi xảy ra khi đổi mật khẩu!",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Đổi Mật Khẩu</h2>
          <p className="mt-2 text-gray-600">
            Vui lòng nhập mật khẩu cũ và mật khẩu mới
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
            {/* Old Password */}
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mật khẩu cũ <span className="text-red-500">*</span>
              </label>
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                value={formData.oldPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mật khẩu cũ"
              />
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Đang xử lý...
                </span>
              ) : (
                "Đổi mật khẩu"
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push("/user")}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Quay lại
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Lưu ý:</strong> Sau khi đổi mật khẩu thành công, bạn sẽ cần
            đăng nhập lại với mật khẩu mới.
          </p>
        </div>
      </div>
    </div>
  );
}