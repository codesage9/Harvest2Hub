import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Clock, 
  CheckCircle2, 
  User, 
  Building2,
  ShieldCheck,
  Search
} from 'lucide-react';

export const ChatEnquiry = () => {
  const { t } = useTranslation();
  const { user, isFarmer, isGov } = useAuth();

  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  // New Thread Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('Procurement');
  const [initialMsg, setInitialMsg] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchThreads = async () => {
    try {
      const res = await axios.get('/api/chat/threads');
      setThreads(res.data);
      if (res.data.length > 0 && !activeThreadId) {
        setActiveThreadId(res.data[0]._id);
        setActiveThread(res.data[0]);
      } else if (activeThreadId) {
        const updated = res.data.find(t => t._id === activeThreadId);
        if (updated) setActiveThread(updated);
      }
    } catch (err) {
      console.error('Error fetching chat threads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const handleSelectThread = (thread) => {
    setActiveThreadId(thread._id);
    setActiveThread(thread);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeThreadId) return;

    try {
      const res = await axios.post('/api/chat/send', {
        threadId: activeThreadId,
        text: messageText
      });

      if (res.data.success) {
        setMessageText('');
        fetchThreads();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newSubject || !initialMsg) return;
    setCreating(true);

    try {
      const res = await axios.post('/api/chat/create-thread', {
        subject: newSubject,
        category: newCategory,
        initialMessage: initialMsg
      });

      if (res.data.success) {
        setNewSubject('');
        setInitialMsg('');
        setShowNewModal(false);
        await fetchThreads();
        setActiveThreadId(res.data.thread._id);
        setActiveThread(res.data.thread);
      }
    } catch (err) {
      console.error('Create thread error:', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E] font-['Manrope',sans-serif]">
            {t('chat.title')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            {t('chat.subtitle')}
          </p>
        </div>

        {isFarmer && (
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#2D6A4F] text-white text-xs font-bold shadow-md transition flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            {t('chat.new_thread')}
          </button>
        )}
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        
        {/* Left Sidebar: Threads List */}
        <div className="lg:col-span-4 border-r border-stone-200 flex flex-col bg-stone-50/50">
          <div className="p-4 border-b border-stone-200 bg-white">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              {t('chat.all_threads')} ({threads.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
            {threads.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-400">
                No active inquiries. Click "Raise New Inquiry" to contact the procurement desk.
              </div>
            ) : (
              threads.map((thread) => {
                const isSelected = thread._id === activeThreadId;
                return (
                  <button
                    key={thread._id}
                    onClick={() => handleSelectThread(thread)}
                    className={`w-full text-left p-4 transition space-y-1.5 ${
                      isSelected ? 'bg-emerald-50 border-l-4 border-[#1B4D3E]' : 'hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-800 truncate max-w-[170px]">
                        {thread.subject}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-200/70 text-stone-700">
                        {thread.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {thread.lastMessage || 'No messages yet.'}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                      <span>{isFarmer ? thread.govName : thread.farmerName}</span>
                      <span>
                        {new Date(thread.lastMessageAt || thread.updatedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Area: Messages & Reply Box */}
        <div className="lg:col-span-8 flex flex-col bg-white">
          {activeThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-stone-200 bg-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-stone-900">{activeThread.subject}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {activeThread.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Category: <span className="font-semibold text-stone-700">{activeThread.category}</span> • 
                    Farmer: <span className="font-semibold text-stone-700">{activeThread.farmerName}</span>
                  </p>
                </div>

                <span className="text-xs text-stone-400 font-mono">
                  {new Date(activeThread.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-stone-50/30">
                {activeThread.messages?.map((m, i) => {
                  const isMe = m.senderId === (user?._id || user?.id);
                  const isSenderGov = m.senderRole === 'government' || m.senderRole === 'admin';

                  return (
                    <div
                      key={i}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mb-1">
                        <span className="font-bold text-stone-700">{m.senderName}</span>
                        {isSenderGov && (
                          <span className="text-[9px] bg-blue-100 text-blue-800 px-1 rounded font-semibold">
                            Official
                          </span>
                        )}
                        <span>•</span>
                        <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                          isMe
                            ? 'bg-[#1B4D3E] text-white rounded-br-none'
                            : isSenderGov
                            ? 'bg-blue-50 text-blue-950 border border-blue-200 rounded-bl-none font-medium'
                            : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-stone-200 bg-white flex gap-3">
                <input
                  type="text"
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={t('chat.type_message')}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1B4D3E] hover:bg-[#2D6A4F] text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('chat.send')}</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-stone-400">
              Select an inquiry thread from the left or raise a new query.
            </div>
          )}
        </div>
      </div>

      {/* New Enquiry Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 font-['Manrope',sans-serif]">
              {t('chat.new_thread')}
            </h3>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-[#1B4D3E] bg-white"
                >
                  <option value="Procurement">Procurement</option>
                  <option value="Payments">Payments & DBT Settlements</option>
                  <option value="Logistics">Logistics & Weighbridge Entry</option>
                  <option value="Quality Dispute">Quality Dispute</option>
                  <option value="General Enquiry">General Enquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t('chat.subject')}
                </label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Delay in DBT payment for Order #H2H-2026-001"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1B4D3E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Message Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={initialMsg}
                  onChange={(e) => setInitialMsg(e.target.value)}
                  placeholder="Describe your issue or question in detail for the procurement nodal officer..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1B4D3E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#2D6A4F] text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {creating ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
