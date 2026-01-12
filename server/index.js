import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// JWT secrets
const ACCESS_TOKEN_SECRET = 'shop-access-secret-key-2024';
const REFRESH_TOKEN_SECRET = 'shop-refresh-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new Database(join(__dirname, 'database', 'shop.db'));

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    category TEXT,
    image TEXT,
    rating REAL DEFAULT 0,
    ratingCount INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 100
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(productId, userId),
    FOREIGN KEY(productId) REFERENCES products(id),
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    UNIQUE(userId, productId),
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(productId) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'completed',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    title TEXT NOT NULL,
    FOREIGN KEY(orderId) REFERENCES orders(id),
    FOREIGN KEY(productId) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    token TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  );
`);

// Seed default users
const seedUsers = async () => {
  const users = [
    { email: 'admin@shop.com', password: 'admin123', firstName: 'Prowadzący', lastName: 'Admin', role: 'admin' },
    { email: 'user1@shop.com', password: 'user123', firstName: 'Jan', lastName: 'Kowalski', role: 'user' },
    { email: 'user2@shop.com', password: 'user123', firstName: 'Anna', lastName: 'Nowak', role: 'user' },
    { email: 'user3@shop.com', password: 'user123', firstName: 'Piotr', lastName: 'Wiśniewski', role: 'user' },
  ];

  const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
  
  if (existingUsers.count === 0) {
    const insertUser = db.prepare('INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)');
    
    for (const user of users) {
      const hashedPassword = bcrypt.hashSync(user.password, 10);
      insertUser.run(user.email, hashedPassword, user.firstName, user.lastName, user.role);
    }
    console.log('Default users seeded');
  }
};

// Seed products from FakeStoreAPI
const seedProducts = async () => {
  const existingProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();
  
  if (existingProducts.count === 0) {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const products = await response.json();
      
      const insertProduct = db.prepare(`
        INSERT INTO products (id, title, price, description, category, image, rating, ratingCount, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      for (const product of products) {
        insertProduct.run(
          product.id,
          product.title,
          product.price,
          product.description,
          product.category,
          product.image,
          product.rating?.rate || 0,
          product.rating?.count || 0,
          Math.floor(Math.random() * 100) + 10
        );
      }
      console.log('Products seeded from FakeStoreAPI');
    } catch (error) {
      console.error('Error seeding products:', error);
    }
  }
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Optional auth middleware
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};

// Generate tokens
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

// ============ AUTH ROUTES ============
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare('INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?)').run(email, hashedPassword, firstName, lastName);

    const user = { id: result.lastInsertRowid, email, firstName, lastName, role: 'user' };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    db.prepare('INSERT INTO refresh_tokens (userId, token) VALUES (?, ?)').run(user.id, refreshToken);

    res.status(201).json({ user, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const userData = { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role };
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    db.prepare('INSERT INTO refresh_tokens (userId, token) VALUES (?, ?)').run(user.id, refreshToken);

    res.json({ user: userData, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  const storedToken = db.prepare('SELECT * FROM refresh_tokens WHERE token = ?').get(refreshToken);
  if (!storedToken) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(refreshToken);
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const userData = { id: user.id, email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(userData);
    res.json({ accessToken: newAccessToken });
  });
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(refreshToken);
  }
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, email, firstName, lastName, role FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// ============ PRODUCT ROUTES ============
app.get('/api/products', (req, res) => {
  const { category, search, limit } = req.query;
  let query = 'SELECT * FROM products';
  const params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  if (search) {
    query += category ? ' AND' : ' WHERE';
    query += ' (title LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (limit) {
    query += ' LIMIT ?';
    params.push(parseInt(limit));
  }

  const products = db.prepare(query).all(...params);
  res.json(products);
});

app.get('/api/products/categories', (req, res) => {
  const categories = db.prepare('SELECT DISTINCT category FROM products').all();
  res.json(categories.map(c => c.category));
});

app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// ============ REVIEW ROUTES ============
app.get('/api/reviews/product/:productId', (req, res) => {
  const reviews = db.prepare(`
    SELECT r.*, u.firstName, u.lastName 
    FROM reviews r 
    JOIN users u ON r.userId = u.id 
    WHERE r.productId = ?
    ORDER BY r.createdAt DESC
  `).all(req.params.productId);
  res.json(reviews);
});

app.post('/api/reviews', authenticateToken, (req, res) => {
  const { productId, rating, comment } = req.body;

  if (!productId || !rating) {
    return res.status(400).json({ message: 'Product ID and rating are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const existingReview = db.prepare('SELECT * FROM reviews WHERE productId = ? AND userId = ?').get(productId, req.user.id);
  if (existingReview) {
    return res.status(400).json({ message: 'You have already reviewed this product' });
  }

  const result = db.prepare('INSERT INTO reviews (productId, userId, rating, comment) VALUES (?, ?, ?, ?)').run(productId, req.user.id, rating, comment);
  
  const review = db.prepare(`
    SELECT r.*, u.firstName, u.lastName 
    FROM reviews r 
    JOIN users u ON r.userId = u.id 
    WHERE r.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(review);
});

app.put('/api/reviews/:id', authenticateToken, (req, res) => {
  const { rating, comment } = req.body;
  const reviewId = req.params.id;

  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(reviewId);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  if (review.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to edit this review' });
  }

  db.prepare('UPDATE reviews SET rating = ?, comment = ? WHERE id = ?').run(rating, comment, reviewId);
  
  const updatedReview = db.prepare(`
    SELECT r.*, u.firstName, u.lastName 
    FROM reviews r 
    JOIN users u ON r.userId = u.id 
    WHERE r.id = ?
  `).get(reviewId);

  res.json(updatedReview);
});

app.delete('/api/reviews/:id', authenticateToken, (req, res) => {
  const reviewId = req.params.id;

  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(reviewId);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  if (review.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to delete this review' });
  }

  db.prepare('DELETE FROM reviews WHERE id = ?').run(reviewId);
  res.json({ message: 'Review deleted successfully' });
});

// ============ CART ROUTES ============
app.get('/api/cart', authenticateToken, (req, res) => {
  const items = db.prepare(`
    SELECT ci.*, p.title, p.price, p.image, p.stock
    FROM cart_items ci
    JOIN products p ON ci.productId = p.id
    WHERE ci.userId = ?
  `).all(req.user.id);
  res.json(items);
});

app.post('/api/cart', authenticateToken, (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const existingItem = db.prepare('SELECT * FROM cart_items WHERE userId = ? AND productId = ?').get(req.user.id, productId);
  
  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.stock) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQuantity, existingItem.id);
  } else {
    if (quantity > product.stock) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }
    db.prepare('INSERT INTO cart_items (userId, productId, quantity) VALUES (?, ?, ?)').run(req.user.id, productId, quantity);
  }

  const items = db.prepare(`
    SELECT ci.*, p.title, p.price, p.image, p.stock
    FROM cart_items ci
    JOIN products p ON ci.productId = p.id
    WHERE ci.userId = ?
  `).all(req.user.id);
  
  res.json(items);
});

app.put('/api/cart/:itemId', authenticateToken, (req, res) => {
  const { quantity } = req.body;
  const itemId = req.params.itemId;

  const item = db.prepare('SELECT ci.*, p.stock FROM cart_items ci JOIN products p ON ci.productId = p.id WHERE ci.id = ? AND ci.userId = ?').get(itemId, req.user.id);
  
  if (!item) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  if (quantity > item.stock) {
    return res.status(400).json({ message: 'Not enough stock available' });
  }

  if (quantity <= 0) {
    db.prepare('DELETE FROM cart_items WHERE id = ?').run(itemId);
  } else {
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, itemId);
  }

  const items = db.prepare(`
    SELECT ci.*, p.title, p.price, p.image, p.stock
    FROM cart_items ci
    JOIN products p ON ci.productId = p.id
    WHERE ci.userId = ?
  `).all(req.user.id);
  
  res.json(items);
});

app.delete('/api/cart/:itemId', authenticateToken, (req, res) => {
  const itemId = req.params.itemId;

  const item = db.prepare('SELECT * FROM cart_items WHERE id = ? AND userId = ?').get(itemId, req.user.id);
  if (!item) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  db.prepare('DELETE FROM cart_items WHERE id = ?').run(itemId);

  const items = db.prepare(`
    SELECT ci.*, p.title, p.price, p.image, p.stock
    FROM cart_items ci
    JOIN products p ON ci.productId = p.id
    WHERE ci.userId = ?
  `).all(req.user.id);
  
  res.json(items);
});

app.delete('/api/cart', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM cart_items WHERE userId = ?').run(req.user.id);
  res.json([]);
});

// ============ ORDER ROUTES ============
app.get('/api/orders', authenticateToken, (req, res) => {
  const orders = db.prepare(`
    SELECT o.*, 
           (SELECT COUNT(*) FROM order_items WHERE orderId = o.id) as itemCount
    FROM orders o
    WHERE o.userId = ?
    ORDER BY o.createdAt DESC
  `).all(req.user.id);
  res.json(orders);
});

app.get('/api/orders/:id', authenticateToken, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND userId = ?').get(req.params.id, req.user.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const items = db.prepare(`
    SELECT oi.*, p.image
    FROM order_items oi
    JOIN products p ON oi.productId = p.id
    WHERE oi.orderId = ?
  `).all(order.id);

  res.json({ ...order, items });
});

app.post('/api/orders', authenticateToken, (req, res) => {
  const cartItems = db.prepare(`
    SELECT ci.*, p.title, p.price, p.stock
    FROM cart_items ci
    JOIN products p ON ci.productId = p.id
    WHERE ci.userId = ?
  `).all(req.user.id);

  if (cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  // Check stock
  for (const item of cartItems) {
    if (item.quantity > item.stock) {
      return res.status(400).json({ message: `Not enough stock for ${item.title}` });
    }
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const orderResult = db.prepare('INSERT INTO orders (userId, total) VALUES (?, ?)').run(req.user.id, total);
  const orderId = orderResult.lastInsertRowid;

  const insertOrderItem = db.prepare('INSERT INTO order_items (orderId, productId, quantity, price, title) VALUES (?, ?, ?, ?, ?)');
  const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

  for (const item of cartItems) {
    insertOrderItem.run(orderId, item.productId, item.quantity, item.price, item.title);
    updateStock.run(item.quantity, item.productId);
  }

  // Clear cart
  db.prepare('DELETE FROM cart_items WHERE userId = ?').run(req.user.id);

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  const items = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(orderId);

  res.status(201).json({ ...order, items });
});

// ============ ADMIN ROUTES ============
app.get('/api/admin/reviews', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const reviews = db.prepare(`
    SELECT r.*, u.firstName, u.lastName, u.email, p.title as productTitle
    FROM reviews r
    JOIN users u ON r.userId = u.id
    JOIN products p ON r.productId = p.id
    ORDER BY r.createdAt DESC
  `).all();
  
  res.json(reviews);
});

app.get('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const users = db.prepare('SELECT id, email, firstName, lastName, role, createdAt FROM users').all();
  res.json(users);
});

// Start server
const startServer = async () => {
  await seedUsers();
  await seedProducts();
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
