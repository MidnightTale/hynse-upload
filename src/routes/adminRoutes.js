import express from 'express';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/authMiddleware';
import config from '../../config';

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === config.admin.username && password === config.admin.password) {
    const token = jwt.sign({ username }, config.secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

router.get('/config', authMiddleware, (req, res) => {
  res.json(config);
});

router.post('/config', authMiddleware, (req, res) => {
  // Update config logic here
  res.json({ message: 'Configuration updated' });
});

export default router;