import express from 'express';
import Notification from '../models/notification.model.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Get all notifications route
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update notification route
router.put('/:id', auth, async (req, res) => {
  try {
    const { read } = req.body;
    await Notification.findByIdAndUpdate(req.params.id, { read });
    res.status(200).json({ message: 'Notification updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete notification route
router.delete('/:id', auth, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
