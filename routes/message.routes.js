import express from 'express';
import Message from '../models/message.model.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Create message route
router.post('/create', auth, async (req, res) => {
  try {
    const { conversationId, sender, receiver, text } = req.body;
    const message = new Message({ conversationId, sender, receiver, text });
    await message.save();
    res.status(201).json({ message: 'Message created successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all messages route
// router.get('/', async (req, res) => {
//   try {
//     const messages = await Message.find();
//     res.status(200).json(messages);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Get messages by conversation ID route
router.get('/conversation/:conversationId', async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update message route
// router.put('/:id', auth, async (req, res) => {
//   try {
//     const { text } = req.body;
//     await Message.findByIdAndUpdate(req.params.id, { text });
//     res.status(200).json({ message: 'Message updated successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Delete message route
router.delete('/:id', auth, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
