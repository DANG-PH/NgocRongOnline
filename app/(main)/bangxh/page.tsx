"use client"
import React, { useState, useEffect } from 'react';

interface UserData {
  id?: string | number;
  auth_id?: number;
  username?: string;
  sucManh?: any;
  sucManhDeTu?: any;
  vang?: any;
  ngoc?: any;
  rank?: number;
  formattedSucManh?: string;
  formattedSucManhDeTu?: string;
  formattedVang?: string;
  formattedNgoc?: string;
}

type TabType = 'sucmanh' | 'vang';

function Bangxh() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('sucmanh');

  useEffect(() => {
    fetchApi();
  }, []);


  const getNumericValue = (value: any): number => {
    if (typeof value === 'number') return value;
    if (value && typeof value === 'object' && 'low' in value) {
      const low = value.low || 0;
      const high = value.high || 0;
      // Xử lý đúng cho số 64-bit: (high << 32) + (low & 0xFFFFFFFF)
      return (high * Math.pow(2, 32)) + (low >>> 0); // >>> 0 converts to unsigned
    }
    return 0;
  };

  const fetchApi = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Chỉ fetch 1 API duy nhất
      const response = await fetch('/api/top10-suc-manh', {
        method: 'GET',
        cache: 'no-store',
      });

      const data = await response.json();
      console.log('Data:', data);
      
      // Lấy array users từ response
      const userData: UserData[] = data.users || [];
      const processedData: UserData[] = userData.map((user, index) => {
        const sucManh = getNumericValue(user.sucManh);
        const sucManhDeTu = getNumericValue(user.sucManhDeTu);
        const vang = getNumericValue(user.vang);
        const ngoc = getNumericValue(user.ngoc);
        
        return {
          ...user,
          rank: index + 1,
          username: user.username || `Player ${user.auth_id || user.id}`, 
          formattedSucManh: formatNumber(sucManh),
          formattedSucManhDeTu: formatNumber(sucManhDeTu),
          formattedVang: formatNumber(vang),
          formattedNgoc: formatNumber(ngoc)
        };
      });
      
      setUsers(processedData);
    } catch (error) {
      console.error('API Error:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

  return (
    <div className="min-h-screen px-5 py-10 pb-[100px] bg-no-repeat bg-center bg-fixed bg-cover " style={{ backgroundImage: "url('/assets/br.jpg')" }}>
      {/* Logo Section */}
      <div className="text-center py-[30px] px-5 animate-[fadeInUp_0.8s_ease-out]">
        <img 
          src="/assets/2.png"
          alt="Beerus" 
          className="max-w-[280px] h-auto mx-auto transition-transform duration-400 hover:scale-110 hover:rotate-[-2deg]"
          style={{ filter: 'drop-shadow(0 10px 40px rgba(255, 215, 0, 0.4))' }}
        />
      </div>
      
      {/* Top Section */}
      <div className="max-w-[1400px] mx-auto mt-[60px] animate-[fadeInUp_1s_ease-out_0.2s_both]">
        {/* Tabs */}
        <div className="flex justify-center gap-5 mb-[60px] flex-wrap">
          <div 
            className={`relative px-10 py-[18px] rounded-[60px] font-bold cursor-pointer border-2 transition-all duration-[400ms] flex items-center gap-3 overflow-hidden
              ${activeTab === 'sucmanh' 
                ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-[#1a1a2e] border-yellow-500 shadow-[0_10px_35px_rgba(255,215,0,0.6),0_0_60px_rgba(255,215,0,0.4)] translate-y-[-4px] scale-110' 
                : 'bg-gradient-to-br from-[#2a2a40] to-[#1a1a2e] text-[#d0d0d0] border-[rgba(255,215,0,0.25)] shadow-[0_10px_25px_rgba(0,0,0,0.4)] hover:translate-y-[-4px] hover:scale-105 hover:border-yellow-500 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)]'
              }`}
            onClick={() => setActiveTab('sucmanh')}
          >
            <span className={`text-[22px] transition-transform duration-300 ${activeTab === 'sucmanh' ? 'scale-125 rotate-[15deg]' : ''}`}>⚔️</span>
            <span className="text-[15px] tracking-[0.8px]">TOP SỨC MẠNH</span>
          </div>
          
          <div 
            className={`relative px-10 py-[18px] rounded-[60px] font-bold cursor-pointer border-2 transition-all duration-[400ms] flex items-center gap-3 overflow-hidden
              ${activeTab === 'vang' 
                ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-[#1a1a2e] border-yellow-500 shadow-[0_10px_35px_rgba(255,215,0,0.6),0_0_60px_rgba(255,215,0,0.4)] translate-y-[-4px] scale-110' 
                : 'bg-gradient-to-br from-[#2a2a40] to-[#1a1a2e] text-[#d0d0d0] border-[rgba(255,215,0,0.25)] shadow-[0_10px_25px_rgba(0,0,0,0.4)] hover:translate-y-[-4px] hover:scale-105 hover:border-yellow-500 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)]'
              }`}
            onClick={() => setActiveTab('vang')}
          >
            <span className={`text-[22px] transition-transform duration-300 ${activeTab === 'vang' ? 'scale-125 rotate-[15deg]' : ''}`}>💰</span>
            <span className="text-[15px] tracking-[0.8px]">TOP ĐẠI GIA</span>
          </div>
          
          <div className="relative px-10 py-[18px] rounded-[60px] font-bold cursor-not-allowed border-2 transition-all duration-[400ms] flex items-center gap-3 overflow-hidden opacity-40 bg-gradient-to-br from-[#2a2a40] to-[#1a1a2e] text-[#d0d0d0] border-[rgba(255,215,0,0.25)] shadow-[0_10px_25px_rgba(0,0,0,0.4)]">
            <span className="text-[22px] transition-transform duration-300">🔒</span>
            <span className="text-[15px] tracking-[0.8px]">SẮP RA MẮT</span>
          </div>
        </div>
        
        {/* Podium - Top 3 */}
        <div className="flex justify-center items-end gap-10 mb-20 px-5 md:flex-row flex-col md:items-end items-center">
          {/* Rank 2 */}
          {users.length >= 2 && (
            <div className="relative text-center bg-gradient-to-br from-[rgba(42,42,64,0.95)] to-[rgba(26,26,46,0.9)] rounded-3xl p-10 pb-9 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-[rgba(255,215,0,0.35)] transition-all duration-500 min-w-[220px] max-w-[280px] md:mt-[30px] mt-0 w-full md:max-w-[280px] max-w-[350px] backdrop-blur-[15px] hover:translate-y-[-18px] hover:scale-110 hover:shadow-[0_30px_70px_rgba(0,0,0,0.6)] group md:order-1 order-2">
              <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 text-[38px] animate-[float_2.5s_ease-in-out_infinite] animate-delay-300" style={{ filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6))' }}>👑</div>
              <div className="w-[55px] h-[55px] rounded-full flex items-center justify-center text-white font-black text-[26px] mx-auto mb-6 shadow-[0_10px_25px_rgba(0,0,0,0.4)] relative z-10 bg-gradient-to-br from-[#E8E8E8] to-[#A8A8A8]">
                2
              </div>
              <div className="relative mb-5 inline-block">
                <img 
                  src="/assets/524.png"
                  className="w-[100px] h-[100px] rounded-full border-4 border-[#C0C0C0] object-cover transition-all duration-400 relative z-10 group-hover:scale-115 group-hover:rotate-[8deg]"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] h-[130px] rounded-full z-0 transition-transform duration-400 animate-[glow_2.5s_ease-in-out_infinite] group-hover:scale-130" style={{ background: 'radial-gradient(circle, rgba(192, 192, 192, 0.7) 0%, transparent 70%)' }}></div>
              </div>
              <div className="font-extrabold text-yellow-500 mb-5 text-xl tracking-wide" style={{ textShadow: '0 3px 12px rgba(255, 215, 0, 0.6)' }}>
                {users[1]?.username || 'N/A'}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center bg-[rgba(255,255,255,0.08)] px-[18px] py-[10px] rounded-xl border border-[rgba(255,215,0,0.15)]">
                  <span className="text-[13px] text-[#b0b0b0] font-semibold">
                    {activeTab === 'sucmanh' ? 'Sức mạnh' : 'Vàng'}
                  </span>
                  <span className="text-[15px] text-yellow-500 font-extrabold">
                    {activeTab === 'sucmanh' 
                      ? users[1]?.formattedSucManh 
                      : users[1]?.formattedVang || '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[rgba(255,255,255,0.08)] px-[18px] py-[10px] rounded-xl border border-[rgba(255,215,0,0.15)]">
                  <span className="text-[13px] text-[#b0b0b0] font-semibold">
                    {activeTab === 'sucmanh' ? 'Đệ tử' : 'Ngọc'}
                  </span>
                  <span className="text-[15px] text-yellow-500 font-extrabold">
                    {activeTab === 'sucmanh'
                      ? users[1]?.formattedSucManhDeTu
                      : users[1]?.formattedNgoc || '0'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Rank 1 */}
          {users.length >= 1 && (
            <div className="relative text-center bg-gradient-to-br from-[rgba(42,42,64,0.95)] to-[rgba(26,26,46,0.9)] rounded-3xl p-10 pb-9 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-[rgba(255,215,0,0.35)] transition-all duration-500 min-w-[220px] max-w-[280px] w-full md:max-w-[280px] max-w-[350px] backdrop-blur-[15px] hover:translate-y-[-18px] hover:scale-110 hover:shadow-[0_30px_70px_rgba(0,0,0,0.6)] group md:order-2 order-1">
              <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 text-[45px] animate-[float_2.5s_ease-in-out_infinite]" style={{ filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6))' }}>👑</div>
              <div className="w-[55px] h-[55px] rounded-full flex items-center justify-center text-white font-black text-[26px] mx-auto mb-6 shadow-[0_10px_25px_rgba(0,0,0,0.4)] relative z-10 bg-gradient-to-br from-yellow-500 to-orange-500">
                1
              </div>
              <div className="relative mb-5 inline-block">
                <img 
                  src="/assets/524.png"
                  className="w-[110px] h-[110px] rounded-full border-4 border-yellow-500 object-cover transition-all duration-400 relative z-10 group-hover:scale-115 group-hover:rotate-[8deg]"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] rounded-full z-0 transition-transform duration-400 animate-[glow_2.5s_ease-in-out_infinite] group-hover:scale-130" style={{ background: 'radial-gradient(circle, rgba(255, 215, 0, 0.7) 0%, transparent 70%)' }}></div>
              </div>
              <div className="font-extrabold text-yellow-500 mb-5 text-xl tracking-wide" style={{ textShadow: '0 3px 12px rgba(255, 215, 0, 0.6)' }}>
                {users[0]?.username || 'N/A'}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center bg-[rgba(255,255,255,0.08)] px-[18px] py-[10px] rounded-xl border border-[rgba(255,215,0,0.15)]">
                  <span className="text-[13px] text-[#b0b0b0] font-semibold">
                    {activeTab === 'sucmanh' ? 'Sức mạnh' : 'Vàng'}
                  </span>
                  <span className="text-[15px] text-yellow-500 font-extrabold">
                    {activeTab === 'sucmanh' 
                      ? users[0]?.formattedSucManh 
                      : users[0]?.formattedVang || '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[rgba(255,255,255,0.08)] px-[18px] py-[10px] rounded-xl border border-[rgba(255,215,0,0.15)]">
                  <span className="text-[13px] text-[#b0b0b0] font-semibold">
                    {activeTab === 'sucmanh' ? 'Đệ tử' : 'Ngọc'}
                  </span>
                  <span className="text-[15px] text-yellow-500 font-extrabold">
                    {activeTab === 'sucmanh'
                      ? users[0]?.formattedSucManhDeTu
                      : users[0]?.formattedNgoc || '0'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Rank 3 */}
          {users.length >= 3 && (
            <div className="relative text-center bg-gradient-to-br from-[rgba(42,42,64,0.95)] to-[rgba(26,26,46,0.9)] rounded-3xl p-10 pb-9 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-[rgba(255,215,0,0.35)] transition-all duration-500 min-w-[220px] max-w-[280px] md:mt-[30px] mt-0 w-full md:max-w-[280px] max-w-[350px] backdrop-blur-[15px] hover:translate-y-[-18px] hover:scale-110 hover:shadow-[0_30px_70px_rgba(0,0,0,0.6)] group md:order-3 order-3">
              <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 text-[38px] animate-[float_2.5s_ease-in-out_infinite] animate-delay-500" style={{ filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6))' }}>👑</div>
              <div className="w-[55px] h-[55px] rounded-full flex items-center justify-center text-white font-black text-[26px] mx-auto mb-6 shadow-[0_10px_25px_rgba(0,0,0,0.4)] relative z-10 bg-gradient-to-br from-[#CD7F32] to-[#B8860B]">
                3
              </div>
              <div className="relative mb-5 inline-block">
                <img 
                  src="/assets/524.png"
                  className="w-[100px] h-[100px] rounded-full border-4 border-[#CD7F32] object-cover transition-all duration-400 relative z-10 group-hover:scale-115 group-hover:rotate-[8deg]"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] h-[130px] rounded-full z-0 transition-transform duration-400 animate-[glow_2.5s_ease-in-out_infinite] group-hover:scale-130" style={{ background: 'radial-gradient(circle, rgba(205, 127, 50, 0.7) 0%, transparent 70%)' }}></div>
              </div>
              <div className="font-extrabold text-yellow-500 mb-5 text-xl tracking-wide" style={{ textShadow: '0 3px 12px rgba(255, 215, 0, 0.6)' }}>
                {users[2]?.username || 'N/A'}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center bg-[rgba(255,255,255,0.08)] px-[18px] py-[10px] rounded-xl border border-[rgba(255,215,0,0.15)]">
                  <span className="text-[13px] text-[#b0b0b0] font-semibold">
                    {activeTab === 'sucmanh' ? 'Sức mạnh' : 'Vàng'}
                  </span>
                  <span className="text-[15px] text-yellow-500 font-extrabold">
                    {activeTab === 'sucmanh' 
                      ? users[2]?.formattedSucManh 
                      : users[2]?.formattedVang || '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[rgba(255,255,255,0.08)] px-[18px] py-[10px] rounded-xl border border-[rgba(255,215,0,0.15)]">
                  <span className="text-[13px] text-[#b0b0b0] font-semibold">
                    {activeTab === 'sucmanh' ? 'Đệ tử' : 'Ngọc'}
                  </span>
                  <span className="text-[15px] text-yellow-500 font-extrabold">
                    {activeTab === 'sucmanh'
                      ? users[2]?.formattedSucManhDeTu
                      : users[2]?.formattedNgoc || '0'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Ranking Table */}
      <div className="max-w-[1200px] mx-auto bg-gradient-to-br from-[rgba(42,42,64,0.95)] to-[rgba(26,26,46,0.9)] backdrop-blur-[15px] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden border-2 border-[rgba(255,215,0,0.3)] animate-[fadeInUp_1.2s_ease-out_0.4s_both]">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-[#1a1a2e] grid grid-cols-[110px_1fr_180px_180px] md:grid-cols-[110px_1fr_180px_180px] sm:grid-cols-[70px_1fr_110px_110px] px-9 py-[22px] font-extrabold tracking-[1.2px]">
          <div className="text-center text-[15px] md:text-[15px] sm:text-xs uppercase">HẠNG</div>
          <div className="text-center text-[15px] md:text-[15px] sm:text-xs uppercase">NHÂN VẬT</div>
          <div className="text-center text-[15px] md:text-[15px] sm:text-xs uppercase">
            {activeTab === 'sucmanh' ? 'SỨC MẠNH' : 'VÀNG'}
          </div>
          <div className="text-center text-[15px] md:text-[15px] sm:text-xs uppercase">
            {activeTab === 'sucmanh' ? 'ĐỆ TỬ' : 'NGỌC'}
          </div>
        </div>
        
        <div className="max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-[rgba(0,0,0,0.3)] [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-yellow-500 [&::-webkit-scrollbar-thumb]:to-orange-500 [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb:hover]:from-orange-500 [&::-webkit-scrollbar-thumb:hover]:to-yellow-500">
          {users.length > 0 ? (
            users.map((user, index) => (
              <div key={user.id || index} className="relative grid grid-cols-[110px_1fr_180px_180px] md:grid-cols-[110px_1fr_180px_180px] sm:grid-cols-[55px_1fr_85px_85px] px-9 md:px-9 sm:px-3 py-5 md:py-5 sm:py-[15px] border-b border-[rgba(255,255,255,0.08)] last:border-b-0 items-center transition-all duration-300 hover:bg-[rgba(255,215,0,0.12)] hover:translate-x-2 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[5px] before:bg-gradient-to-b before:from-yellow-500 before:to-orange-500 before:scale-y-0 before:transition-transform before:duration-300 hover:before:scale-y-100 group">
                <div className="text-center">
                  {user.rank && user.rank <= 3 ? (
                    <div className={`w-[50px] md:w-[50px] sm:w-10 h-[50px] md:h-[50px] sm:h-10 rounded-full inline-flex items-center justify-center text-white font-black text-xl md:text-xl sm:text-base shadow-[0_6px_18px_rgba(0,0,0,0.4)] ${
                      user.rank === 1 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                      user.rank === 2 ? 'bg-gradient-to-br from-[#E8E8E8] to-[#A8A8A8]' :
                      'bg-gradient-to-br from-[#CD7F32] to-[#B8860B]'
                    }`}>
                      {user.rank}
                    </div>
                  ) : (
                    <div className="font-bold text-[#b0b0b0] text-xl md:text-xl sm:text-base">{user.rank}</div>
                  )}
                </div>
                <div className="flex items-center gap-[18px] md:gap-[18px] sm:gap-[10px] pl-5 md:pl-5 sm:pl-[5px]">
                  <div className="relative">
                    <img 
                      src="/assets/524.png"
                      className="w-[55px] h-[55px] md:w-[55px] md:h-[55px] sm:w-[38px] sm:h-[38px] rounded-full border-[3px] md:border-[3px] sm:border-2 border-[rgba(255,215,0,0.4)] object-cover transition-transform duration-300 group-hover:scale-115 group-hover:rotate-[5deg]"
                    />
                  </div>
                  <span className="font-bold text-[#e8e8e8] text-[17px] md:text-[17px] sm:text-[13px]">{user.username || `Player ${index + 1}`}</span>
                </div>
                <div className="text-yellow-500 text-center font-extrabold text-[17px] md:text-[17px] sm:text-xs" style={{ textShadow: '0 2px 8px rgba(255, 215, 0, 0.4)' }}>
                  {activeTab === 'sucmanh' 
                    ? user.formattedSucManh 
                    : user.formattedVang}
                </div>
                <div className="text-yellow-500 text-center font-extrabold text-[17px] md:text-[17px] sm:text-xs" style={{ textShadow: '0 2px 8px rgba(255, 215, 0, 0.4)' }}>
                  {activeTab === 'sucmanh'
                    ? user.formattedSucManhDeTu
                    : user.formattedNgoc || '0'}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 px-5 text-[#b0b0b0] text-xl font-semibold">
              <p>Không có dữ liệu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Bangxh;