// auth.controller.js

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/user.model.js';

dotenv.config();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.REGISTER_SECRET_TOKEN, { expiresIn: '1h' });
};
 
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

const loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      throw new Error('Incorrect password');
    }

    const token = generateToken(user._id);
    return { userId: user._id, token };
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw new Error('Authentication failed');
  }
};

const registerUser = async (username, password, email) => { 
  try {
    const hashedPassword = await hashPassword(password);
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      throw new Error('Username is already taken.');
    }

    const newUser = new User({ username, password: hashedPassword, email });
    const savedUser = await newUser.save();
    const token = generateToken(savedUser._id);

    return { userId: savedUser._id, token };
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Registration failed');
  }
};

export { loginUser, generateToken, registerUser };
