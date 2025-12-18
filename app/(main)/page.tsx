"use client"

function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Video Background */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          preload="metadata"
          poster="/assets/head1.webp"
          className="absolute w-full h-[120%] object-cover brightness-90"
          style={{ animation: 'vid1 10s infinite' }}
        >
          <source src="/assets/head1.webm" type="video/webm" />
          <source src="/assets/head1.mp4" type="video/mp4" />
        </video>
        
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          preload="metadata"
          poster="/assets/head2.webp"
          className="absolute w-full h-full object-cover brightness-90"
          style={{ animation: 'vid2 10s infinite' }}
        >
          <source src="/assets/head2.webm" type="video/webm" />
          <source src="/assets/head2.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="relative h-96 overflow-hidden mb-10">
          <div className="relative w-full h-full flex items-center justify-center">
            
           
            
            <div className="relative z-20 text-center text-white">
              <div className="mb-5">
                <h1 className="text-5xl font-black m-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
                  DRAGON BALL LEGENDS
                </h1>
                <div className="w-48 h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 mx-auto mt-3 rounded animate-pulse"></div>
              </div>
              
              <div className="text-white">
                <p className="text-lg my-2 drop-shadow-md">
                  Trải nghiệm trận chiến Dragon Ball cực kỳ mãn nhãn
                </p>
                <p className="text-lg my-2 drop-shadow-md">
                  Với đồ họa tuyệt đẹp và gameplay hấp dẫn
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5">
          <div className="text-center mb-10">
            <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 text-white py-4 px-10 rounded-full text-2xl font-bold uppercase tracking-wider shadow-lg shadow-yellow-500/30 relative">
              <span>TẢI GAME</span>
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 rounded-full -z-10 animate-pulse opacity-80"></div>
            </div>
          </div>
          
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="min-w-[200px]">
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white cursor-pointer shadow-lg hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-600/40 transition-all duration-300">
                <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 5.45L9.5 4.5V11.5H3V5.45ZM3 12.5H9.5V19.5L3 18.55V12.5ZM10.5 4.25L21 2.5V11.5H10.5V4.25ZM21 12.5V21.5L10.5 19.75V12.5H21Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs opacity-80 mb-1">Tải cho</div>
                  <div className="text-lg font-bold">Windows</div>
                </div>
              </div>
            </div>

            <div className="min-w-[200px]">
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-black to-gray-800 text-white cursor-pointer shadow-lg hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300">
                <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.19 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs opacity-80 mb-1">Tải game</div>
                  <div className="text-lg font-bold">App Store</div>
                </div>
              </div>
            </div>

            <div className="min-w-[200px]">
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-green-600 to-blue-600 text-white cursor-pointer shadow-lg hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-600/40 transition-all duration-300">
                <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs opacity-80 mb-1">Tải game</div>
                  <div className="text-lg font-bold">Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`

        @keyframes vid1 {
          0% { opacity: 1; }
          33% { opacity: 0; }
          66% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes vid2 {
          0% { opacity: 0; }
          33% { opacity: 1; }
          66% { opacity: 1; }
          100% { opacity: 0; }
        }
        
      `}</style>
    </div>
  );
}

export default HomePage;