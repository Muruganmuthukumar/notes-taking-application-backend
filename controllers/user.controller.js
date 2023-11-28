import User from '../models/user.model.js'
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'
import Note from '../models/note.model.js';
import client from '../redis.js'
dotenv.config();
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user =await client.get('user')
    if (user != null) {
      res.json(JSON.parse(user));
    }
    else {
      const user = await User.findById(req.params.id);
      if (user) {
        await client.setEx('user',3600,JSON.stringify(user))
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { password, newPassword, ...otherDetails } = req.body;
    const user = await User.findById(req.params.id);
    if (newPassword) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid current password.' });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword; 
      await user.save();
    }

    if (Object.keys(otherDetails).length > 0) {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: req.params.id },
        otherDetails,
        { new: true }
      );
      res.json(updatedUser);
    } else {
      res.json({ message: 'No updates provided.' });
    }
    client.del("user")
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(400).json({ message: error.message });
  } 
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.json({ message: 'User deleted' });
      await Note.deleteMany({ userId: req.params.id });
      client.del("user")
      client.del('notes')
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const authenticateAdmin = (req, res, next) => {
  const user = req.user;

  if (user && user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};


