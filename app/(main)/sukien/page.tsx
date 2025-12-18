"use client"
import React, { useState, useEffect } from 'react';

export interface Post {
  id: number;
  title: string;
  url_anh: string;
  content: string;
  editor_id: number;  
  editor_realname: string;
  status?: string;     
  create_at?: string;  
  update_at?: string; 
}

function Sukien() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        alert('Vui lòng đăng nhập!');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(stored);
      const response = await fetch('/api/all-posts', {
        headers: {
          'Authorization': `Bearer ${userData.access_token}`,
        },
      });

      const data = await response.json();
      console.log('Data from API:', data);
      
      if (data.posts && Array.isArray(data.posts)) {
        setPosts(data.posts);
        console.log('Posts set successfully:', data.posts);
      } else {
        console.log('No posts array found');
        setPosts([]);
      }
      
    } catch (error) {
      console.error('Error:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center mb-2">🎉 Sự Kiện</h1>
        <p className="text-center text-gray-600">Cập nhật những sự kiện mới nhất</p>
      </div>

      {/* Debug Info */}
      <div className="max-w-7xl mx-auto mb-4">
        <p className="text-sm text-gray-500">Số sự kiện: {posts?.length || 0}</p>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.url_anh || '/placeholder.jpg'} 
                  alt={post.title}
                  className="w-full h-80 object-cover object-top rounded-lg mb-6"
                />
                {post.status && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    {post.status}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 h-[60px]">{post.content}</p>

                {/* Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <span>✍️</span>
                    <span>{post.editor_realname}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>📅</span>
                    <span>{post.create_at ? new Date(post.create_at).toLocaleDateString('vi-VN') : 'N/A'}</span>
                  </span>
                </div>

                {/* Button */}
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors duration-300">
                  Xem chi tiết →
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-500 text-xl">📭 Chưa có sự kiện nào</p>
          </div>
        )}
      </div>

      {/* Modal Chi Tiết */}
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 text-3xl text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center"
              onClick={() => setSelectedPost(null)}
            >
              ✕
            </button>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image */}
              <img 
                src={selectedPost.url_anh || '/placeholder.jpg'} 
                alt={selectedPost.title}
                className="w-full h-80 object-cover object-top rounded-lg mb-6"
              />

              {/* Title */}
              <h2 className="text-3xl font-bold mb-4">{selectedPost.title}</h2>

              {/* Content */}
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <span className="flex items-center gap-2 text-gray-600">
                  <span>✍️</span>
                  <span className="font-medium">{selectedPost.editor_realname}</span>
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  <span>📅</span>
                  <span>
                    {selectedPost.create_at ? new Date(selectedPost.create_at).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </span>
                </span>
              </div>

              {/* Status */}
              {selectedPost.status && (
                <div className="mt-4 inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full">
                  {selectedPost.status}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sukien;