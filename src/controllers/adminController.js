const jwt = require('jsonwebtoken');
const config = require('../config');

const login = (req, res) => {
  const { username, password } = req.body;
  if (username === config.admin.username && password === config.admin.password) {
    const token = jwt.sign({ username }, config.jwtSecret, { expiresIn: config.admin.jwtExpirationTime });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

const getDashboard = (req, res) => {
  // Implement dashboard data retrieval here
  res.json({ message: 'Dashboard data' });
};

module.exports = {
  login,
  getDashboard
};