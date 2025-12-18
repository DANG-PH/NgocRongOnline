import React from "react";

function Footer() {
  return (
    <footer className="bg-[#152444] text-white py-10 mt-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto px-5 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-yellow-400 text-lg font-bold mb-4 uppercase relative pb-2">
              Về Chúng Tôi
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded"></span>
            </h3>
            <p className="text-blue-200 leading-relaxed mb-3">
              Trang web game hàng đầu Việt Nam với những trải nghiệm tuyệt vời nhất.
            </p>
            <ul className="space-y-2">
              <li className="text-blue-200 pl-4 relative hover:text-yellow-400 cursor-pointer transition">
                <span className="absolute left-0 text-yellow-400 text-xs">▶</span>
                Cập nhật tin tức game mới nhất
              </li>
              <li className="text-blue-200 pl-4 relative hover:text-yellow-400 cursor-pointer transition">
                <span className="absolute left-0 text-yellow-400 text-xs">▶</span>
                Cộng đồng game thủ sôi động
              </li>
              <li className="text-blue-200 pl-4 relative hover:text-yellow-400 cursor-pointer transition">
                <span className="absolute left-0 text-yellow-400 text-xs">▶</span>
                Hỗ trợ 24/7
              </li>
            </ul>
          </div>

      
          <div>
            <h3 className="text-yellow-400 text-lg font-bold mb-4 uppercase relative pb-2">
              Liên Kết
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded"></span>
            </h3>
            <ul className="space-y-2">
              <li className="text-blue-200 pl-4 relative hover:text-yellow-400 cursor-pointer transition">
                <span className="absolute left-0 text-yellow-400 text-xs">▶</span>
                Trang Chủ
              </li>
              <li className="text-blue-200 pl-4 relative hover:text-yellow-400 cursor-pointer transition">
                <span className="absolute left-0 text-yellow-400 text-xs">▶</span>
                Sự Kiện
              </li>
              <li className="text-blue-200 pl-4 relative hover:text-yellow-400 cursor-pointer transition">
                <span className="absolute left-0 text-yellow-400 text-xs">▶</span>
                Diễn Đàn
              </li>
              <li className="text-blue-200 pl-4 relative hover:text-yellow-400 cursor-pointer transition">
                <span className="absolute left-0 text-yellow-400 text-xs">▶</span>
                Vòng Quay
              </li>
              <li className="text-blue-200 pl-4 relative hover:text-yellow-400 cursor-pointer transition">
                <span className="absolute left-0 text-yellow-400 text-xs">▶</span>
                Bảng Xếp Hạng
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-yellow-400 text-lg font-bold mb-4 uppercase relative pb-2">
              Hỗ Trợ
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded"></span>
            </h3>
            <ul className="space-y-2">
              <li className="text-blue-200 pl-4 relative hover:text-yellow-400 cursor-pointer transition">
                <span className="absolute left-0 text-yellow-400 text-xs">▶</span>
                Trung tâm trợ giúp
              </li>
              <li className="text-blue-200 pl-4 relative hover:text-yellow-400 cursor-pointer transition">
                <span className="absolute left-0 text-yellow-400 text-xs">▶</span>
                Báo cáo lỗi
              </li>
              <li className="text-blue-200 pl-4 relative hover:text-yellow-400 cursor-pointer transition">
                <span className="absolute left-0 text-yellow-400 text-xs">▶</span>
                Điều khoản sử dụng
              </li>
              <li className="text-blue-200 pl-4 relative hover:text-yellow-400 cursor-pointer transition">
                <span className="absolute left-0 text-yellow-400 text-xs">▶</span>
                Chính sách bảo mật
              </li>
            </ul>
          </div>

    
          <div>
            <h3 className="text-yellow-400 text-lg font-bold mb-4 uppercase relative pb-2">
              Liên Hệ
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded"></span>
            </h3>
            <p className="text-blue-200 mb-2">📧 contact@nronline.com</p>
            <p className="text-blue-200 mb-2">📞 1900-xxxx</p>
            <p className="text-blue-200 mb-2">📍 Hà Nội, Việt Nam</p>
          </div>
        </div>

       
        <div className="border-t border-yellow-400/20 pt-5 text-center">
          <div className="text-yellow-400 font-bold text-lg uppercase tracking-widest mb-4">
            NR Online - Game Thủ Việt Nam
          </div>
          
      
          <div className="flex justify-center gap-4">
            <a 
              href="#" 
              className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400 border-2 border-transparent hover:bg-yellow-400 hover:text-slate-900 hover:border-yellow-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-400/30 transition-all"
            >
              📘
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400 border-2 border-transparent hover:bg-yellow-400 hover:text-slate-900 hover:border-yellow-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-400/30 transition-all"
            >
              📷
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400 border-2 border-transparent hover:bg-yellow-400 hover:text-slate-900 hover:border-yellow-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-400/30 transition-all"
            >
              🐦
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400 border-2 border-transparent hover:bg-yellow-400 hover:text-slate-900 hover:border-yellow-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-400/30 transition-all"
            >
              📺
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;