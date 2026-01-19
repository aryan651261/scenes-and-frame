
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Serve Static Files
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGODB_URI);

// Auth Middleware
const auth = (role) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send();
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (role && decoded.role !== role) return res.status(403).send();
  req.user = decoded;
  next();
};

// API Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).send();
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ user, token });
});

// Admin Product Upload (Updated to accept FILE)
app.post('/api/admin/products', auth('admin'), upload.single('image'), async (req, res) => {
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  const p = new Product({
    ...req.body,
    images: [imageUrl]
  });
  await p.save();
  res.json(p);
});

// Custom Poster Submission
app.post('/api/custom-poster', auth(), upload.single('image'), async (req, res) => {
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  const poster = new CustomPoster({
    userId: req.user.id,
    image: imageUrl,
    customText: req.body.customText,
    status: 'Submitted'
  });
  await poster.save();
  res.json(poster);
});

app.get('/api/admin/custom-posters', auth('admin'), async (req, res) => {
  const posters = await CustomPoster.find().sort({ createdAt: -1 });
  res.json(posters);
});

app.put('/api/admin/custom-poster/:id/status', auth('admin'), async (req, res) => {
  const poster = await CustomPoster.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(poster);
});

app.listen(5000, () => console.log('Scenes & Frame Backend 2026 Online. Port 5000.'));
