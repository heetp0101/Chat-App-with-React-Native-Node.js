const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    online: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null },
  },
  { timestamps: true }
);

// convenience — return public-safe fields
userSchema.methods.toPublic = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    online: this.online,
    lastSeen: this.lastSeen,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = model('User', userSchema);
