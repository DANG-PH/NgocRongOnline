"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PayData {
  id: number;
  userId: number;
  tien: string;
  status: string;
  updatedAt: string;
}

interface PayResponse {
  pay: PayData;
  message: string;
}

interface QRResponse {
  qr: string;
  username: string;
}

interface WithdrawResponse {
  message: string;
  withdrawal?: any;
}

interface WithdrawItem {
  id: number;
  user_id: number;
  amount: number;
  bank_name: string;
  bank_number: string;
  bank_owner: string;
  status: string;
  request_at: string;
  success_at: string;
}

interface WithdrawHistoryResponse {
  withdraws: WithdrawItem[];
}

export default function Pay() {
  const router = useRouter();
  const [payData, setPayData] = useState<PayData | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // QR Modal states
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrData, setQrData] = useState<QRResponse | null>(null);
  const [qrError, setQrError] = useState("");
  const [amount, setAmount] = useState("50000");
  const [username, setUsername] = useState("");

  // Withdraw Modal states
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    bank_name: "",
    bank_number: "",
    bank_owner: "",
  });

  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchPayData();
    fetchWithdrawHistory();
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const userData = JSON.parse(stored);
      setUsername(userData.username || "");
    }
  }, []);

  const fetchPayData = async () => {
    try {
      setLoading(true);
      setError("");

      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        setError("Không tìm thấy thông tin đăng nhập");
        router.push("/login");
        return;
      }

      const userData = JSON.parse(stored);
      const accessToken = userData.access_token;
      const authId = userData.auth_id;

    

      const response = await fetch(`/api/pay?userId=${authId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

   

      const responseText = await response.text();
      let data: PayResponse;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {

        throw new Error("Server returned invalid JSON");
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setPayData(data.pay);
      setMessage(data.message);

    } catch (err) {
    
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawHistory = async () => {
    try {
      setHistoryLoading(true);

      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        router.push("/login");
        return;
      }

      const userData = JSON.parse(stored);
      const accessToken = userData.access_token;
      const authId = userData.auth_id;

     

      const response = await fetch(`/api/user-withdraw?userId=${authId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data: WithdrawHistoryResponse = await response.json();

      if (!response.ok) {
        throw new Error("Lỗi khi tải lịch sử rút tiền");
      }

      console.log("Withdraw history:", data);
      setWithdrawHistory(data.withdraws || []);

    } catch (err) {
      console.error("Withdraw history error:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const generateQR = async () => {
    try {
      setQrLoading(true);
      setQrError("");
      setQrData(null);

      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        router.push("/login");
        return;
      }

      const userData = JSON.parse(stored);
      const accessToken = userData.access_token;
      const authId = userData.auth_id;

    

      const response = await fetch(
        `/api/qr?userId=${authId}&amount=${amount}&username=${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Lỗi khi tạo mã QR");
      }


      setQrData(data);
    } catch (err) {
    
      setQrError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setQrLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setWithdrawLoading(true);
      setWithdrawError("");
      setWithdrawSuccess("");

      // Validate form
      if (!withdrawForm.amount || !withdrawForm.bank_name || !withdrawForm.bank_number || !withdrawForm.bank_owner) {
        setWithdrawError("Vui lòng điền đầy đủ thông tin");
        return;
      }

      if (parseInt(withdrawForm.amount) <= 0) {
        setWithdrawError("Số tiền phải lớn hơn 0");
        return;
      }

      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        router.push("/login");
        return;
      }

      const userData = JSON.parse(stored);
      const accessToken = userData.access_token;
      const authId = userData.auth_id;



      const response = await fetch("/api/create-withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          // user_id: authId,
          amount: parseInt(withdrawForm.amount),
          bank_name: withdrawForm.bank_name,
          bank_number: withdrawForm.bank_number,
          bank_owner: withdrawForm.bank_owner,
        }),
      });

      const data: WithdrawResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi tạo yêu cầu rút tiền");
      }

     
      setWithdrawSuccess(data.message || "Yêu cầu rút tiền đã được tạo thành công!");
      
      // Reset form
      setWithdrawForm({
        amount: "",
        bank_name: "",
        bank_number: "",
        bank_owner: "",
      });

      // Refresh data
      setTimeout(() => {
        fetchPayData();
        fetchWithdrawHistory();
        closeWithdrawModal();
      }, 2000);

    } catch (err) {

      setWithdrawError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setWithdrawLoading(false);
    }
  };

  const openQRModal = () => {
    setShowQRModal(true);
    setQrData(null);
    setQrError("");
    setAmount("50000");
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    setQrData(null);
    setQrError("");
  };

  const openWithdrawModal = () => {
    setShowWithdrawModal(true);
    setWithdrawError("");
    setWithdrawSuccess("");
    setWithdrawForm({
      amount: "",
      bank_name: "",
      bank_number: "",
      bank_owner: "",
    });
  };

  const closeWithdrawModal = () => {
    setShowWithdrawModal(false);
    setWithdrawError("");
    setWithdrawSuccess("");
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(typeof amount === "string" ? parseInt(amount) : amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
            Đang xử lý
          </span>
        );
      case "SUCCESS":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
            Thành công
          </span>
        );
      case "ERROR":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
            Thất bại
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin ví...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
          <div className="text-red-500 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold mb-2">Lỗi</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchPayData()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mt-4"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!payData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-600">Không tìm thấy thông tin ví</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Ví của tôi</h1>
              {message && (
                <p className="text-green-600 mt-1 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {message}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                fetchPayData();
                fetchWithdrawHistory();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Làm mới
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-2">Số dư hiện tại</p>
              <p className="text-4xl font-bold">{formatCurrency(payData.tien)}</p>
            </div>
            <div className="text-6xl opacity-50">💰</div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button 
            onClick={openQRModal}
            className="bg-white hover:bg-gray-50 border-2 border-blue-500 text-blue-500 font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nạp tiền
          </button>
          <button 
            onClick={openWithdrawModal}
            className="bg-white hover:bg-gray-50 border-2 border-red-500 text-red-500 font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
            Rút tiền
          </button>
        </div>

        {/* Withdraw History Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Lịch sử rút tiền
            </h2>
          </div>

          {historyLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải lịch sử...</p>
            </div>
          ) : withdrawHistory.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg">Chưa có lịch sử rút tiền</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngân hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số TK
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chủ TK
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {withdrawHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.bank_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {item.bank_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.bank_owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400">Yêu cầu:</span>
                          <span>{formatDate(item.request_at)}</span>
                          {item.status === "SUCCESS" && item.success_at && (
                            <>
                              <span className="text-xs text-gray-400 mt-1">Thành công:</span>
                              <span className="text-green-600">{formatDate(item.success_at)}</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* QR Modal */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">Nạp tiền qua QR</h2>
                <button
                  onClick={closeQRModal}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                {!qrData ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Tên tài khoản
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập tên tài khoản"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Số tiền (VND)
                      </label>
                      
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập số tiền"
                        min="1000"
                        step="1000"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {formatCurrency(amount)}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {["10000", "50000", "100000", "200000", "500000", "1000000"].map(
                        (value) => (
                          <button
                            key={value}
                            onClick={() => setAmount(value)}
                            className={`px-3 py-2 border rounded-lg text-sm font-medium transition ${
                              amount === value
                                ? "bg-blue-500 text-white border-blue-500"
                                : "border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {parseInt(value).toLocaleString("vi-VN")}đ
                          </button>
                        )
                      )}
                    </div>

                    {qrError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700 text-sm">{qrError}</p>
                      </div>
                    )}

                    <button
                      onClick={generateQR}
                      disabled={qrLoading || !username || !amount}
                      className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      {qrLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Đang tạo...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                          </svg>
                          Tạo mã QR
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-bold text-green-600 flex items-center justify-center gap-2">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Mã QR đã tạo thành công!
                    </h3>

                    <div className="bg-white p-4 rounded-lg border-2 border-blue-200 inline-block">
                      <img
                        src={qrData.qr}
                        alt="QR Code"
                        className="w-full max-w-sm mx-auto"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          setQrError('Không thể tải mã QR');
                        }}
                      />
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-gray-600 text-sm">Thông tin thanh toán:</p>
                      <p className="text-gray-800 font-semibold mt-1">
                        Tài khoản: <span className="text-blue-600">{qrData.username}</span>
                      </p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">
                        {formatCurrency(amount)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setQrData(null)}
                        className="flex-1 text-blue-500 hover:text-blue-600 font-medium px-4 py-2 border-2 border-blue-500 rounded-lg transition"
                      >
                        Tạo mã mới
                      </button>
                      <a
                        href={qrData.qr}
                        download="qr-payment.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-green-500 hover:text-green-600 font-medium px-4 py-2 border-2 border-green-500 rounded-lg transition text-center"
                      >
                        Tải xuống
                      </a>
                    </div>

                    <p className="text-xs text-gray-500">
                      Quét mã QR bằng ứng dụng ngân hàng để nạp tiền
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">Rút tiền</h2>
                <button
                  onClick={closeWithdrawModal}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Số tiền (VND) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={withdrawForm.amount}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập số tiền muốn rút"
                      min="1000"
                      step="1000"
                    />
                    {withdrawForm.amount && (
                      <p className="text-sm text-gray-500 mt-1">
                        {formatCurrency(withdrawForm.amount)}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {["50000", "100000", "200000", "500000", "1000000", "2000000"].map(
                      (value) => (
                        <button
                          key={value}
                          onClick={() => setWithdrawForm({ ...withdrawForm, amount: value })}
                          className={`px-3 py-2 border rounded-lg text-sm font-medium transition ${
                            withdrawForm.amount === value
                              ? "bg-red-500 text-white border-red-500"
                              : "border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {parseInt(value).toLocaleString("vi-VN")}đ
                        </button>
                      )
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Tên ngân hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawForm.bank_name}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, bank_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="VD: Vietinbank, Vietcombank, BIDV..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Số tài khoản <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawForm.bank_number}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, bank_number: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập số tài khoản"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Chủ tài khoản <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawForm.bank_owner}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, bank_owner: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="VD: NGUYEN VAN A"
                    />
                  </div>

                  {withdrawError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-700 text-sm">{withdrawError}</p>
                    </div>
                  )}

                  {withdrawSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-700 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {withdrawSuccess}
                      </p>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 text-xs">
                      <strong>Lưu ý:</strong> Yêu cầu rút tiền sẽ được xử lý trong vòng 24h. Vui lòng kiểm tra kỹ thông tin ngân hàng trước khi gửi.
                    </p>
                  </div>

                  <button
                    onClick={handleWithdraw}
                    disabled={withdrawLoading || !withdrawForm.amount || !withdrawForm.bank_name || !withdrawForm.bank_number || !withdrawForm.bank_owner}
                    className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {withdrawLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Xác nhận rút tiền
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}