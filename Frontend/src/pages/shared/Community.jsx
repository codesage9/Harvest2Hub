import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Send, 
  Plus, 
  Filter, 
  Tag, 
  Sparkles, 
  Clock, 
  User,
  Users,
  ShieldCheck,
  Sprout
} from 'lucide-react';

export const Community = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // New Post Modal State
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Crop Advisory');
  const [submittingPost, setSubmittingPost] = useState(false);

  // Comment input state per post: { [postId]: commentText }
  const [commentsState, setCommentsState] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/community/posts', {
        params: { category, search }
      });
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching community posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    setSubmittingPost(true);

    try {
      await axios.post('/api/community/posts', {
        title: newTitle,
        content: newContent,
        category: newCategory
      });
      setNewTitle('');
      setNewContent('');
      setShowModal(false);
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`/api/community/posts/${postId}/like`);
      // Update local state
      setPosts(posts.map(p => {
        if (p._id === postId) {
          const isLiked = res.data.isLiked;
          const currentLikes = p.likes || [];
          return {
            ...p,
            likes: isLiked ? [...currentLikes, user?._id || 'user'] : currentLikes.filter(id => id !== (user?._id || 'user'))
          };
        }
        return p;
      }));
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentsState[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await axios.post(`/api/community/posts/${postId}/comment`, {
        content: text
      });
      setPosts(posts.map(p => {
        if (p._id === postId) {
          return { ...p, comments: res.data.comments };
        }
        return p;
      }));
      setCommentsState({ ...commentsState, [postId]: '' });
    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
            <Users className="w-3.5 h-3.5" /> Shared Farmer & Official Forum
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4D3E] font-['Manrope',sans-serif]">
            {t('community.title')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            {t('community.subtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#2D6A4F] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {t('community.create_post')}
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-stone-200">
        {['All', 'Crop Advisory', 'Procurement', 'MSP Query', 'Hub Feedback', 'Storage Tips'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              category === cat
                ? 'bg-[#1B4D3E] text-white'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="p-12 text-center text-sm text-stone-500">Loading discussions...</div>
      ) : posts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
          <p className="text-sm font-bold text-stone-800">No discussions found in this category.</p>
          <p className="text-xs text-stone-500">Be the first to share an advisory or question!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const isGov = post.authorRole === 'government' || post.authorRole === 'admin';
            const isLiked = post.likes?.includes(user?._id || 'user');

            return (
              <div
                key={post._id}
                className={`p-6 bg-white rounded-3xl border shadow-sm space-y-4 ${
                  isGov ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-stone-200'
                }`}
              >
                {/* Author Info & Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                        isGov ? 'bg-blue-700 text-white' : 'bg-emerald-700 text-white'
                      }`}
                    >
                      {post.authorName ? post.authorName[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900">{post.authorName}</span>
                        {isGov ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> Mandi / Institution
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                            Farmer
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {new Date(post.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-stone-900 font-['Manrope',sans-serif]">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Like & Comment Bar */}
                <div className="flex items-center gap-4 pt-2 border-t border-stone-100 text-xs text-stone-500">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-1.5 font-semibold transition ${
                      isLiked ? 'text-emerald-700 font-bold' : 'hover:text-stone-900'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-emerald-700' : ''}`} />
                    <span>{post.likes?.length || 0} Likes</span>
                  </button>

                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments?.length || 0} Comments</span>
                  </span>
                </div>

                {/* Comments Section */}
                {post.comments && post.comments.length > 0 && (
                  <div className="pt-2 space-y-2">
                    {post.comments.map((c, i) => (
                      <div key={i} className="p-3 bg-stone-50 rounded-xl text-xs space-y-1 border border-stone-100">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-800">{c.authorName}</span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-stone-600">{c.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input Box */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={commentsState[post._id] || ''}
                    onChange={(e) =>
                      setCommentsState({ ...commentsState, [post._id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(post._id);
                    }}
                    placeholder={t('community.write_comment')}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#1B4D3E] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddComment(post._id)}
                    className="px-3 py-2 bg-[#1B4D3E] text-white rounded-xl text-xs font-bold hover:bg-[#2D6A4F] transition flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Discussion Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 font-['Manrope',sans-serif]">
              {t('community.create_post')}
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t('community.category')}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-[#1B4D3E] bg-white"
                >
                  <option value="Crop Advisory">Crop Advisory</option>
                  <option value="Procurement">Procurement</option>
                  <option value="MSP Query">MSP Query</option>
                  <option value="Hub Feedback">Hub Feedback</option>
                  <option value="Storage Tips">Storage Tips</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t('community.post_title')}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Moisture deduction norms for Ludhiana hub"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1B4D3E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t('community.post_content')}
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe your query, experience, or grain quality observation..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#1B4D3E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPost}
                  className="px-5 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#2D6A4F] text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {submittingPost ? 'Publishing...' : 'Publish Discussion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
