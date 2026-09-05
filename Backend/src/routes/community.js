const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const { verifyToken } = require('../middleware/auth');

// GET /api/community/posts - List posts with filtering and search
router.get('/posts', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await CommunityPost.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching community posts.' });
  }
});

// POST /api/community/posts - Create a new post
router.post('/posts', verifyToken, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const newPost = new CommunityPost({
      authorId: req.user.id,
      authorName: req.user.name,
      authorRole: req.user.role,
      title,
      content,
      category: category || 'General',
      tags: tags || ['Farming', 'Harvest2Hub']
    });

    const savedPost = await newPost.save();
    res.status(201).json({ success: true, post: savedPost });
  } catch (err) {
    res.status(500).json({ message: 'Error creating community post.' });
  }
});

// POST /api/community/posts/:id/comment - Add comment/reply
router.post('/posts/:id/comment', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Comment content cannot be empty.' });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    post.comments.push({
      authorId: req.user.id,
      authorName: req.user.name,
      authorRole: req.user.role,
      content,
      createdAt: new Date()
    });

    await post.save();
    res.json({ success: true, comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment.' });
  }
});

// POST /api/community/posts/:id/like - Like or unlike a post
router.post('/posts/:id/like', verifyToken, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const userId = req.user.id;
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ success: true, likesCount: post.likes.length, isLiked: index === -1 });
  } catch (err) {
    res.status(500).json({ message: 'Error updating like status.' });
  }
});

module.exports = router;
