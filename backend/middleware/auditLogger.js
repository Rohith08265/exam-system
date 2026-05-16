const AuditLog = require('../models/AuditLog');

/**
 * Middleware to log API requests for audit trail
 */
const auditLog = async (req, res, next) => {
  // Capture the original send function
  const originalSend = res.send;

  // Store response data
  let responseData;

  // Override send to capture response
  res.send = function (data) {
    responseData = data;
    return originalSend.call(this, data);
  };

  // After request completes, log it
  res.on('finish', async () => {
    try {
      const logEntry = {
        user: req.user?._id || null,
        action: `${req.method} ${req.path}`,
        resource: req.path,
        details: {
          method: req.method,
          url: req.originalUrl,
          query: req.query,
          body: req.body,
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        statusCode: res.statusCode,
      };

      if (res.statusCode >= 400) {
        logEntry.errorMessage = responseData?.message || 'Error occurred';
      }

      await AuditLog.create(logEntry);
    } catch (error) {
      console.error('Error creating audit log:', error);
    }
  });

  next();
};

module.exports = { auditLog };
