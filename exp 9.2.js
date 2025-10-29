const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Hardcoded user for demo
const USER = {
  id: 1,
  username: 'testuser',
  password: 'password123'
};

const JWT_SECRET = 'your_jwt_secret'; // Use a strong, random string in production

// Login route to issue JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    // Create a JWT payload
    const payload = {
      id: USER.id,
      username: USER.username
    };
    // Sign token (expires in 1 hour)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// JWT Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token missing' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: 'Invalid or expired token' });
    req.user = user; // Optionally assign user object to request
    next();
  });
}

// Public route
app.get('/public', (req, res) => {
  res.json({ message: "This is a public route." });
});

// Protected route
app.get('/protected', authenticateToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route!",
    user: req.user
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
