"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './shop.scss';
import blackGoku from "../../public/assets/avt.png";
import trungdetu from "../../public/assets/trung_de_tu.png";
import aovaitho from "../../public/assets/ao.png";
import quanthanlinh from "../../public/assets/quan.png";
import gangvaitho from "../../public/assets/gang.png";
import giayvaitho from "../../public/assets/giay.png";
import rada from "../../public/assets/rada.png";
import { StaticImageData } from 'next/image';

interface Item {
  id: number;
  name: string;
  description: string;
  image: StaticImageData;
  price: number;
}

function Shop() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingItemId, setLoadingItemId] = useState<number | null>(null);

  const items: Item[] = [
    {
      id: 1,
      name: 'Cải trang black goku',
      description: 'Cải trang thành Super Black Goku',
      image: blackGoku,
      price: 10000,
    },
    {
      id: 2,
      name: 'Trứng đệ tử',
      description: 'giúp người chơi sở hữu đệ tử.',
      image: trungdetu,
      price: 20000,
    },
    {
      id: 3,
      name: 'Áo vải thô',
      description: 'Giúp giảm sát thương',
      image: aovaitho,
      price: 30000,
    },
    {
      id: 4,
      name: 'Quần thần linh',
      description: 'Giúp tăng HP',
      image: quanthanlinh,
      price: 40000,
    },
    {
      id: 5,
      name: 'Găng vải thô',
      description: 'Giúp tăng sức đánh',
      image: gangvaitho,
      price: 50000,
    },
    {
      id: 6,
      name: 'Giày vải thô',
      description: 'Giúp tăng MP',
      image: giayvaitho,
      price: 60000,
    },
    {
      id: 7,
      name: 'Rada',
      description: 'Giúp tăng Chí Mạng',
      image: rada,
      price: 70000,
    }
  ];

  const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  const handleBuyItem = async (itemId: number): Promise<void> => {
    try {
      const stored = localStorage.getItem("currentUser");
      
      if (!stored) {
        alert('Vui lòng đăng nhập để mua vật phẩm!');
        return;
      }

      const userData = JSON.parse(stored);
      const authId = userData.auth_id;
      const accessToken = userData.access_token;

      if (!authId || !accessToken) {
        alert('Thông tin đăng nhập không hợp lệ!');
        return;
      }

      setLoading(true);
      setLoadingItemId(itemId);

      const response = await fetch('/api/add-item-web', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'auth-id': authId.toString(),
        },
        body: JSON.stringify({
          itemId: itemId
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Mua vật phẩm thành công! Vào game để sử dụng.');
        console.log('Response:', data);
      } else {
        throw new Error(data.error || 'Không thể mua vật phẩm');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể mua vật phẩm';
      alert(errorMessage);
    } finally {
      setLoading(false);
      setLoadingItemId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/user')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Quay lại
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Shop Bán Vật Phẩm
          </h1>
          <p className="text-lg text-gray-600">
            Chọn và mua vật phẩm phù hợp với bạn
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-blue-100 p-6">
                <img 
                  src={item.image.src} 
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Info */}
              <div className="p-5 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                  {item.description}
                </p>
                
                {/* Price */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Giá</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(item.price)}
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleBuyItem(item.id)}
                  disabled={loading && loadingItemId === item.id}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && loadingItemId === item.id ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      Mua Ngay
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-gray-700 text-base">
              ⚠️ <strong>Lưu ý:</strong> Vật phẩm sẽ được thêm vào tài khoản của bạn sau khi thanh toán. 
              Vào game để kiểm tra và sử dụng!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;