
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to Scenes & Frame Database'))
    .catch(err => console.error('Database connection error:', err));

// Models would be imported here...
// const User = require('./models/User');
// const Product = require('./models/Product');
// const Order = require('./models/Order');

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        // const user = new User({ name, email, password: hashedPassword });
        // await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
    // Logic for finding user, comparing password, and generating JWT
});

// PRODUCT ROUTES
app.get('/api/products', async (req, res) => {
    const { category, sort, minPrice, maxPrice } = req.query;
    // Filtering logic...
});

app.post('/api/products', /* isAdminMiddleware, */ async (req, res) => {
    // Admin adding products
});

// ORDER ROUTES
app.post('/api/orders', /* isAuthMiddleware, */ async (req, res) => {
    // User creating order
});

app.get('/api/orders/me', /* isAuthMiddleware, */ async (req, res) => {
    // User getting their orders
});

// MESSAGING ROUTES
app.post('/api/orders/:id/messages', async (req, res) => {
    // Send message (user or admin)
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Scenes & Frame Backend running on port ${PORT} in 2026`));
