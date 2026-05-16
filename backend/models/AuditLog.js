const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
    resourceId: mongoose.Schema.Types.ObjectId,
    details: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
    statusCode: Number,
    errorMessage: String,
  },
  { timestamps: true, indexes: [{ user: 1 }, { action: 1 }, { createdAt: -1 }] }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
