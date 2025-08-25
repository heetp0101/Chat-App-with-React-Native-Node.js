const User = require('../models/User');

exports.list = async (req, res) => {
  try {
    // list all users except the current user
    const users = await User.find({ _id: { $ne: req.userId } })
      .select('_id name email online lastSeen')
      .sort({ online: -1, name: 1 });
    res.json(users);
  } catch (err) {
    console.error('user.list err:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
