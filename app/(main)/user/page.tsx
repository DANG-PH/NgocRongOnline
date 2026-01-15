"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  danhSachVatPhamWeb: any[];
  id: number;
  vang: { low: number; high: number; unsigned: boolean };
  ngoc: { low: number; high: number; unsigned: boolean };
  sucManh: { low: number; high: number; unsigned: boolean };
  vangNapTuWeb: { low: number; high: number; unsigned: boolean };
  ngocNapTuWeb: { low: number; high: number; unsigned: boolean };
  x: number;
  y: number;
  mapHienTai: string;
  daVaoTaiKhoanLanDau: boolean;
  coDeTu: boolean;
  auth_id: number;
}

interface ApiResponse {
  user: UserData;
}


const Icons = {
  Money: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Gem: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  Power: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Location: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
};

export default function User() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const refreshAccessToken = async (refreshToken: string) => {
    const res = await fetch("/api/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    const data = await res.json();
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    currentUser.access_token = data.access_token;
    currentUser.refresh_token = data.refresh_token;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    return data.access_token;
  };

  const fetchUserProfile = async (isRetry = false) => {
    setLoading(true);
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      alert("Lỗi đăng nhập")
      router.push("/login");
      return;
    }

    const userData = JSON.parse(stored);
    const authId = userData.auth_id;
    let accessToken = userData.access_token;
    const refreshToken = userData.refresh_token;

    const res = await fetch(`/api/profile/${authId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.status === 401 && !isRetry && refreshToken) {
      accessToken = await refreshAccessToken(refreshToken);
      return fetchUserProfile(true);
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setLoading(false);
      router.push("/login");
      return;
    }

    const data: ApiResponse = await res.json();
    if (data.user) {
      setUser(data.user);
    } else {
      router.push("/login");
    }

    setLoading(false);
  };

  // const formatNumber = (v: { low: number }) => v.low.toLocaleString();
  const formatNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (value && typeof value === 'object' && 'low' in value) {
      const low = value.low || 0;
      const high = value.high || 0;
      // Xử lý đúng cho số 64-bit: (high << 32) + (low & 0xFFFFFFFF)
      return (high * Math.pow(2, 32)) + (low >>> 0); // >>> 0 converts to unsigned
    }
    return 0;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-b-2 border-blue-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
  
    <div className="min-h-screen bg-[#f4f7fa] p-4 md:p-8 font-sans">
      
    
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-700">Thông tin nhân vật</h1>
                <p className="text-gray-400 text-sm mt-1">Hồ sơ người dùng</p>
            </div>
            
        
            <div className="flex gap-3">
                 <button
                    onClick={() => router.push("/acchistory")}
                    className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-500 px-4 py-2 rounded shadow-sm text-sm font-medium transition-colors"
                >
                    Lịch sử mua acc
                </button>
                <button
                     onClick={() => {
                        router.push("/shop");
                      }}
                    className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-500 px-4 py-2 rounded shadow-sm text-sm font-medium transition-colors"
                >
                   shop game
                </button>
                <button
                     onClick={() => {
                        router.push("/chatbot");
                      }}
                    className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-500 px-4 py-2 rounded shadow-sm text-sm font-medium transition-colors"
                >
                    chatbot
                </button>
                <button
                     onClick={() => {
                      router.push("/change-password");
                    }}
                    className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-500 px-4 py-2 rounded shadow-sm text-sm font-medium transition-colors"
                >
                     đổi mật khẩu
                </button>
                <button
                    onClick={() => router.push("/pay")}
                    className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-500 px-4 py-2 rounded shadow-sm text-sm font-medium transition-colors"
                >
                    Tài khoản
                </button>
                <button
                     onClick={() => {
                        localStorage.removeItem("currentUser"); 
                        router.push("/login");
                      }}
                    className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-500 px-4 py-2 rounded shadow-sm text-sm font-medium transition-colors"
                >
                    đăng xuất
                </button>

            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
      
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h3 className="font-semibold text-gray-700 uppercase text-sm tracking-wider">Thông tin chung</h3>
                    <Icons.User />
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <span className="text-gray-400 text-xs uppercase font-bold">ID Nhân vật</span>
                            <p className="text-lg font-medium text-gray-700">#{user.id}</p>
                        </div>
                        <div className="space-y-1">
                             <span className="text-gray-400 text-xs uppercase font-bold">Auth ID</span>
                             <p className="text-lg font-medium text-gray-700">{user.auth_id}</p>
                        </div>
                    </div>
                </div>
            </div>

        
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                 <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h3 className="font-semibold text-gray-700 uppercase text-sm tracking-wider">Trạng thái & Vị trí</h3>
                    <div className="flex gap-2">
                        <span className={`h-3 w-3 rounded-full ${user.daVaoTaiKhoanLanDau ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>
                </div>
                <div className="p-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                        {/* Location */}
                        <div>
                             <h4 className="flex items-center gap-2 text-gray-800 font-medium mb-4">
                                <span className="text-blue-500"><Icons.Location /></span> Vị trí hiện tại
                             </h4>
                             <ul className="space-y-3">
                                 <li className="flex justify-between text-sm">
                                     <span className="text-gray-500">Map:</span>
                                     <span className="font-semibold text-gray-700">{user.mapHienTai}</span>
                                 </li>
                                 <li className="flex justify-between text-sm">
                                     <span className="text-gray-500">Tọa độ:</span>
                                     <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">X: {user.x} | Y: {user.y}</span>
                                 </li>
                             </ul>
                        </div>

                        {/* Status */}
                        <div>
                             <h4 className="flex items-center gap-2 text-gray-800 font-medium mb-4">
                                <span className="text-blue-500"><Icons.Info /></span> Tình trạng
                             </h4>
                             <ul className="space-y-3">
                                 <li className="flex justify-between items-center text-sm">
                                     <span className="text-gray-500">Lần đầu đăng nhập:</span>
                                     <span className={`px-2 py-0.5 text-xs rounded font-medium ${user.daVaoTaiKhoanLanDau ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                         {user.daVaoTaiKhoanLanDau ? "Đã vào" : "Chưa vào"}
                                     </span>
                                 </li>
                                 <li className="flex justify-between items-center text-sm">
                                     <span className="text-gray-500">Đệ tử:</span>
                                     <span className={`px-2 py-0.5 text-xs rounded font-medium ${user.coDeTu ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                         {user.coDeTu ? "Đã có" : "Chưa có"}
                                     </span>
                                 </li>
                                 <li className="flex justify-between text-sm">
                                     <span className="text-gray-500">Vật phẩm Web:</span>
                                     <span className="font-semibold text-gray-700">{user.danhSachVatPhamWeb.length} món</span>
                                 </li>
                             </ul>
                        </div>
                     </div>
                </div>
            </div>
        </div>


        <div className="space-y-6">
            
 
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between transition hover:shadow-md">
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Tổng Vàng</p>
                    <h3 className="text-2xl font-bold text-blue-500">{formatNumber(user.vang)}</h3>
                    <p className="text-xs text-gray-400 mt-2">Nạp web: {formatNumber(user.vangNapTuWeb)}</p>
                </div>
                <div className="h-12 w-12 rounded bg-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <Icons.Money />
                </div>
            </div>

     
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between transition hover:shadow-md">
                 <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Tổng Ngọc</p>
                    <h3 className="text-2xl font-bold text-green-500">{formatNumber(user.ngoc)}</h3>
                    <p className="text-xs text-gray-400 mt-2">Nạp web: {formatNumber(user.ngocNapTuWeb)}</p>
                </div>
                <div className="h-12 w-12 rounded bg-green-400 flex items-center justify-center text-white shadow-lg shadow-green-200">
                     <Icons.Gem />
                </div>
            </div>

         
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between transition hover:shadow-md">
                 <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Sức mạnh</p>
                    <h3 className="text-2xl font-bold text-yellow-500">{formatNumber(user.sucManh)}</h3>
                     <p className="text-xs text-gray-400 mt-2">Chỉ số sức mạnh</p>
                </div>
                <div className="h-12 w-12 rounded bg-yellow-400 flex items-center justify-center text-white shadow-lg shadow-yellow-200">
                     <Icons.Power />
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}