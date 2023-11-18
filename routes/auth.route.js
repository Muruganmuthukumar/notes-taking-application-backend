import express from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const { userId, token } = await loginUser(username, password);
    res.status(200).json({ userId, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
});

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const { userId, token } = await registerUser(username, password, email); 
    res.status(201).json({ userId, token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(400).json({ message: 'Registration failed' });
  }
});

export default router;
