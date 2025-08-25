// server/src/server.js
require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

const User = require('./models/User');
const Message = require('./models/Message');

const PORT = process.env.PORT || 4000;

(async () => {
  // connect DB (if present)
  if (process.env.MONGO_URI) {
    await connectDB(process.env.MONGO_URI);
  } else {
    console.warn('⚠️  MONGO_URI not set - skipping DB connect');
  }

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: process.env.CORS_ORIGIN || '*', methods: ['GET', 'POST'] }
  });

  // Map userId -> Set(socketId)
  const userSockets = new Map();
  const addSocket = (uid, sid) => {
    if (!userSockets.has(uid)) userSockets.set(uid, new Set());
    userSockets.get(uid).add(sid);
  };
  const removeSocket = (uid, sid) => {
    const set = userSockets.get(uid);
    if (!set) return;
    set.delete(sid);
    if (set.size === 0) userSockets.delete(uid);
  };
  const socketsOf = (uid) => Array.from(userSockets.get(uid) || []);

  // Socket auth middleware: expects handshake.auth.token = '<JWT>'
  io.use((socket, next) => {
    const token = socket.handshake?.auth?.token || null;
    if (!token) return next(new Error('unauthorized: no token'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
      socket.userId = decoded.id;
      return next();
    } catch (err) {
      return next(new Error('unauthorized'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    addSocket(userId, socket.id);

    // Mark user online in DB + broadcast presence update
    try {
      await User.findByIdAndUpdate(userId, { online: true }, { new: true });
      io.emit('presence:update', { userId, online: true });
    } catch (e) {
      console.error('presence update error:', e.message);
    }

    // Clean up on disconnect
    socket.on('disconnect', async () => {
      removeSocket(userId, socket.id);
      if (socketsOf(userId).length === 0) {
        const lastSeen = new Date();
        try {
          await User.findByIdAndUpdate(userId, { online: false, lastSeen }, { new: true });
          io.emit('presence:update', { userId, online: false, lastSeen });
        } catch (e) {
          console.error('disconnect update error:', e.message);
        }
      }
    });

    // message:send — payload: { to, text, tempId? }
    socket.on('message:send', async (payload, cb) => {
      try {
        const { to, text, tempId } = payload || {};
        if (!to || !text) return cb && cb({ ok: false, error: 'to and text required' });

        // save message
        let msg = await Message.create({ sender: userId, receiver: to, text, status: 'sent' });

        // if recipient is online (has sockets), deliver
        const targets = socketsOf(to);
        if (targets.length) {
          targets.forEach(sid => io.to(sid).emit('message:new', msg));
          msg.status = 'delivered';
          msg.deliveredAt = new Date();
          await msg.save();
        }

        // echo to sender with tempId (so client can reconcile optimistic UI)
        io.to(socket.id).emit('message:new', Object.assign({}, msg.toObject(), { tempId }));

        cb && cb({ ok: true, messageId: msg._id, status: msg.status });
      } catch (err) {
        console.error('message:send error', err);
        cb && cb({ ok: false, error: 'failed to send' });
      }
    });

    // typing events: { to }
    socket.on('typing:start', ({ to }) => {
      socketsOf(to).forEach(sid => io.to(sid).emit('typing:start', { from: userId }));
    });
    socket.on('typing:stop', ({ to }) => {
      socketsOf(to).forEach(sid => io.to(sid).emit('typing:stop', { from: userId }));
    });

    // message read: { from } — mark all messages from "from" -> me as read
    socket.on('message:read', async ({ from }) => {
      try {
        await Message.updateMany(
          { sender: from, receiver: userId, status: { $ne: 'read' } },
          { $set: { status: 'read', readAt: new Date() } }
        );
        // notify sender's sockets
        socketsOf(from).forEach(sid => io.to(sid).emit('message:read', { by: userId }));
      } catch (err) {
        console.error('message:read error', err);
      }
    });

  }); // io.on connection

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server listening on http://0.0.0.0:${PORT}`);
  });
})();
