const { Schema, model, Types } = require('mongoose');

const messageSchema = new Schema(
  {
    sender:   { type: Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Types.ObjectId, ref: 'User', required: true },
    text:     { type: String, required: true, trim: true },
    status:   { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
    deliveredAt: { type: Date, default: null },
    readAt:      { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = model('Message', messageSchema);
