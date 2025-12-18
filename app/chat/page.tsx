'use client';

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const API_URL = 'http://localhost:3000';
const WS_URL = 'http://localhost:3000/ws-chat';

interface User {
  userId: number;
  realname: string;
  avatarUrl: string;
}

interface Friend {
  friendId: number;
  friendRealname: string;
  avatarUrl: string;
  status: number;
}

interface FriendRequest {
  relationId: number;
  friendId: number;
  friendRealname: string;
  avatarUrl: string;
  status: number;
  create_at: string;
}

interface Message {
  userId: number;
  friendId?: number;
  content: string;
  create_at: string;
  roomId?: string;
}

export default function SocialNetworkPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [chatPartner, setChatPartner] = useState<Friend | null>(null);
  const [showChatList, setShowChatList] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [roomId, setRoomId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        return parsed.access_token || null;
      } catch {
        return null;
      }
    }
    return null;
  };

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setCurrentUser({
          userId: parsed.auth_id,
          username: parsed.sessionId,
          realname: parsed.sessionId,
          role: parsed.role
        });
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    fetchAllUsers();
    fetchFriends();
    fetchSentRequests();
    fetchIncomingRequests();

    const token = getToken();
    if (!token) return;

    const socket = io(WS_URL, {
      auth: { token },
      extraHeaders: { 'authorization': `Bearer ${token}` },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ WebSocket connected');
    });

    socket.on('chatMessage', (data: any) => {
      setMessages(prev => [...prev, {
        userId: data.userId,
        content: data.content,
        create_at: data.timestamp || new Date().toISOString(),
        roomId: data.roomId,
      }]);
    });

    socket.on('connect_error', (error: any) => {
      console.error('❌ WebSocket error:', error);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/all-user`, { headers: getHeaders() });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setAllUsers(data.userTraVe || data.userTrade || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch(`${API_URL}/social_network/all-friend`, { headers: getHeaders() });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setFriends(data.friendInfo || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/social_network/sent-friend`, { headers: getHeaders() });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setSentRequests(data.relationFriendInfo || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchIncomingRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/social_network/incoming-friend`, { headers: getHeaders() });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setIncomingRequests(data.relationFriendInfo || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addFriend = async (friendId: number) => {
    try {
      const response = await fetch(`${API_URL}/social_network/add-friend`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ friendId }),
      });
      if (!response.ok) throw new Error('Failed');
      await fetchSentRequests();
      alert('Đã gửi lời mời kết bạn!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const acceptFriend = async (relationId: number) => {
    try {
      const response = await fetch(`${API_URL}/social_network/accept-friend`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ relationId }),
      });
      if (!response.ok) throw new Error('Failed');
      await fetchIncomingRequests();
      await fetchFriends();
      alert('Đã chấp nhận lời mời!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const rejectFriend = async (relationId: number) => {
    try {
      const response = await fetch(`${API_URL}/social_network/reject-friend`, {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify({ relationId }),
      });
      if (!response.ok) throw new Error('Failed');
      await fetchIncomingRequests();
      alert('Đã từ chối lời mời');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const unfriend = async (friendId: number) => {
    if (!confirm('Bạn có chắc muốn hủy kết bạn?')) return;
    try {
      const response = await fetch(`${API_URL}/social_network/unfriend`, {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify({ friendId }),
      });
      if (!response.ok) throw new Error('Failed');
      await fetchFriends();
      alert('Đã hủy kết bạn');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const startChat = async (friend: Friend) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/chat/1-1`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ friendId: friend.friendId }),
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      const newRoomId = data.roomId;
      
      setRoomId(newRoomId);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`room_${friend.friendId}`, newRoomId);
      }
      setChatPartner(friend);
      
      if (socketRef.current?.connected) {
        socketRef.current.emit('setActiveRoom', { roomId: newRoomId });
      }
      
      const messagesResponse = await fetch(`${API_URL}/chat/message?roomId=${newRoomId}`, {
        headers: getHeaders(),
      });
      
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData.message || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !socketRef.current || !roomId) return;
    socketRef.current.emit('chatMessage', {
      roomId: roomId,
      content: messageInput.trim(),
    });
    setMessageInput('');
  };

  const closeChat = () => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('setActiveRoom', { roomId: null });
    }
    setChatPartner(null);
    setMessages([]);
    setRoomId('');
  };

  const filteredUsers = allUsers.filter(user => 
    user.realname?.toLowerCase().includes(searchQuery.toLowerCase()) &&
    user.userId !== currentUser?.userId
  );

  const isFriend = (userId: number) => friends.some(f => f.friendId === userId);
  const hasSentRequest = (userId: number) => sentRequests.some(r => r.friendId === userId);

    if (chatPartner || showChatList) {
    return (
      <div style={{ height: '100vh', display: 'flex', backgroundColor: '#fff' }}>
        {/* Left Sidebar - Friends List */}
        <div style={{ 
          width: showChatList ? '30%' : '0',
          minWidth: showChatList ? '300px' : '0',
          maxWidth: showChatList ? '360px' : '0',
          borderRight: '1px solid #e4e6eb',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          transition: 'all 0.3s ease',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '16px',
            borderBottom: '1px solid #e4e6eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#050505' }}>Đoạn chat</h2>
            <button
              onClick={() => setShowChatList(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#050505">
                <path d="M18 6L6 18M6 6l12 12" stroke="#050505" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          
          <div style={{ 
            padding: '8px 16px',
            borderBottom: '1px solid #e4e6eb'
          }}>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: '#f0f2f5',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {friends.map((friend) => (
              <div
                key={friend.friendId}
                onClick={() => startChat(friend)}
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  backgroundColor: chatPartner?.friendId === friend.friendId ? '#e7f3ff' : 'transparent',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (chatPartner?.friendId !== friend.friendId) {
                    e.currentTarget.style.backgroundColor = '#f0f2f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (chatPartner?.friendId !== friend.friendId) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={friend.avatarUrl || 'https://via.placeholder.com/56'}
                    alt={friend.friendRealname}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '14px',
                    height: '14px',
                    backgroundColor: '#31a24c',
                    border: '2px solid #fff',
                    borderRadius: '50%'
                  }} />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '15px', 
                    fontWeight: chatPartner?.friendId === friend.friendId ? 600 : 500,
                    color: '#050505',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {friend.friendRealname}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '13px', 
                    color: '#65676b',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    Đang hoạt động
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
          {chatPartner ? (
            <>
              <div style={{ 
                backgroundColor: '#fff', 
                borderBottom: '1px solid #e4e6eb',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}>
                {!showChatList && (
                  <button
                    onClick={() => setShowChatList(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: '4px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12h18M3 6h18M3 18h18" stroke="#050505" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
                <img 
                  src={chatPartner.avatarUrl || 'https://via.placeholder.com/40'} 
                  alt={chatPartner.friendRealname}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#050505' }}>
                    {chatPartner.friendRealname}
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#65676b' }}>Đang hoạt động</p>
                </div>
                <button
                  onClick={closeChat}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#050505">
                    <path d="M18 6L6 18M6 6l12 12" stroke="#050505" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '16px',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#65676b', padding: '40px 20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
                    <p>Chưa có tin nhắn nào</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isOwn = msg.userId === currentUser?.userId;
                    return (
                      <div key={idx} style={{ 
                        display: 'flex', 
                        justifyContent: isOwn ? 'flex-end' : 'flex-start',
                        marginBottom: '4px'
                      }}>
                        <div style={{ 
                          maxWidth: '60%',
                          padding: '8px 12px',
                          borderRadius: '18px',
                          backgroundColor: isOwn ? '#0084ff' : '#e4e6eb',
                          color: isOwn ? '#fff' : '#050505',
                          fontSize: '15px',
                          lineHeight: '1.4',
                          wordBreak: 'break-word'
                        }}>
                          <p style={{ margin: 0 }}>{msg.content}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div style={{ 
                padding: '12px 16px',
                borderTop: '1px solid #e4e6eb',
                backgroundColor: '#fff',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Aa"
                  style={{ 
                    flex: 1,
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '20px',
                    backgroundColor: '#f0f2f5',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  style={{ 
                    background: 'none',
                    border: 'none',
                    cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: messageInput.trim() ? 1 : 0.5
                  }}
                >
                  <svg width="20" height="20" fill="#0084ff" viewBox="0 0 24 24">
                    <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,10.7464035 22.0274542,9.96491551 21.1140164,9.80781816 L4.13399899,1.01036432 C3.50612381,0.753266566 2.41,0.909764246 1.77946707,1.33966354 C0.994623095,1.96460548 0.8376543,3.05373336 1.15159189,3.83922031 L3.03521743,10.2802133 C3.03521743,10.4373107 3.19218622,10.5944081 3.50612381,10.5944081 L16.6915026,11.3798951 C16.6915026,11.3798951 17.7876301,11.3798951 17.7876301,12.4744748 C17.7876301,13.5690546 16.6915026,12.4744748 16.6915026,12.4744748 Z"/>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
              color: '#65676b'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
              <h3 style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 8px 0' }}>
                Chọn một cuộc trò chuyện
              </h3>
              <p style={{ fontSize: '14px', margin: 0 }}>
                Chọn một người bạn để bắt đầu nhắn tin
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ 
        backgroundColor: '#fff',
        borderBottom: '1px solid #e4e6eb',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', height: '56px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1877f2', margin: 0 }}>facebook</h1>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              backgroundColor: '#e4e6eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: '#050505'
            }}>
              {currentUser?.realname?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#050505' }}>
              {currentUser?.realname || 'User'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e4e6eb' }}>
            {[
              { id: 'friends', label: 'Bạn bè', count: friends.length },
              { id: 'discover', label: 'Khám phá', count: null },
              { id: 'requests', label: 'Lời mời', count: incomingRequests.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: activeTab === tab.id ? '#1877f2' : '#65676b',
                  borderBottom: activeTab === tab.id ? '3px solid #1877f2' : 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = '#f0f2f5';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {tab.label} {tab.count !== null && `(${tab.count})`}
              </button>
            ))}
          </div>

          <div style={{ padding: '16px' }}>
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  border: '3px solid #e4e6eb',
                  borderTopColor: '#1877f2',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto'
                }} />
              </div>
            )}

            {!loading && activeTab === 'friends' && (
              <div style={{ display: 'grid', gap: '8px' }}>
                {friends.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#65676b', padding: '40px' }}>Chưa có bạn bè</p>
                ) : (
                  friends.map((friend) => (
                    <div key={friend.friendId} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderRadius: '8px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={friend.avatarUrl || 'https://via.placeholder.com/60'} 
                          alt={friend.friendRealname}
                          style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#050505' }}>
                            {friend.friendRealname}
                          </h3>
                          <p style={{ margin: 0, fontSize: '13px', color: '#65676b' }}>Bạn bè</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => startChat(friend)}
                          style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: '#1877f2',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Nhắn tin
                        </button>
                        <button
                          onClick={() => unfriend(friend.friendId)}
                          style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: '#e4e6eb',
                            color: '#050505',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Hủy kết bạn
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {!loading && activeTab === 'discover' && (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm bạn bè..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: 'none',
                      borderRadius: '20px',
                      backgroundColor: '#f0f2f5',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {filteredUsers.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#65676b', padding: '40px' }}>
                      Không tìm thấy người dùng
                    </p>
                  ) : (
                    filteredUsers.map((user) => (
                      <div key={user.userId} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '12px',
                        borderRadius: '8px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={user.avatarUrl || 'https://via.placeholder.com/60'} 
                            alt={user.realname}
                            style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#050505' }}>
                              {user.realname}
                            </h3>
                            <p style={{ margin: 0, fontSize: '13px', color: '#65676b' }}>ID: {user.userId}</p>
                          </div>
                        </div>
                        <div>
                          {isFriend(user.userId) ? (
                            <span style={{ fontSize: '14px', color: '#65676b' }}>✓ Bạn bè</span>
                          ) : hasSentRequest(user.userId) ? (
                            <button
                              style={{
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '6px',
                                backgroundColor: '#e4e6eb',
                                color: '#050505',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'default'
                              }}
                            >
                              Đã gửi lời mời
                            </button>
                          ) : (
                            <button
                              onClick={() => addFriend(user.userId)}
                              style={{
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '6px',
                                backgroundColor: '#1877f2',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Thêm bạn bè
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {!loading && activeTab === 'requests' && (
              <div style={{ display: 'grid', gap: '8px' }}>
                {incomingRequests.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#65676b', padding: '40px' }}>
                    Không có lời mời kết bạn
                  </p>
                ) : (
                  incomingRequests.map((request) => (
                    <div key={request.relationId} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderRadius: '8px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={request.avatarUrl || 'https://via.placeholder.com/60'} 
                          alt={request.friendRealname}
                          style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#050505' }}>
                            {request.friendRealname}
                          </h3>
                          <p style={{ margin: 0, fontSize: '13px', color: '#65676b' }}>
                            {new Date(request.create_at).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => acceptFriend(request.relationId)}
                          style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: '#1877f2',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Xác nhận
                        </button>
                        <button
                          onClick={() => rejectFriend(request.relationId)}
                          style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: '#e4e6eb',
                            color: '#050505',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}