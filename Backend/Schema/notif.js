// ==============================
// 🔔 Schéma Notification
// ==============================
const notificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    time: { type: String, required: true },
    read: { type: Boolean, default: false },
  
    icon: { type: String, default: null },
    color: { type: String, default: null },
  
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    }
  }, { timestamps: true });