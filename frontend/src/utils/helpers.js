/**
 * Format date to readable format
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format time remaining
 */
export const formatTimeRemaining = (seconds) => {
  if (seconds <= 0) return 'Time up';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

/**
 * Get grade color
 */
export const getGradeColor = (grade) => {
  const colors = {
    'A': 'text-green-600',
    'B': 'text-blue-600',
    'C': 'text-yellow-600',
    'D': 'text-orange-600',
    'F': 'text-red-600',
  };
  return colors[grade] || 'text-gray-600';
};

/**
 * Get result status
 */
export const getResultStatus = (isPassed) => {
  return isPassed ? 'Passed' : 'Failed';
};

/**
 * Get result status color
 */
export const getResultStatusColor = (isPassed) => {
  return isPassed ? 'text-green-600' : 'text-red-600';
};

/**
 * Check if exam is available
 */
export const isExamAvailable = (exam) => {
  const now = new Date();
  const startDate = new Date(exam.startDate);
  const endDate = new Date(exam.endDate);
  
  return now >= startDate && now <= endDate && exam.status === 'published';
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (obtained, total) => {
  if (total === 0) return 0;
  return ((obtained / total) * 100).toFixed(2);
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password) => {
  const strength = {
    score: 0,
    feedback: [],
  };

  if (password.length >= 8) strength.score++;
  else strength.feedback.push('At least 8 characters');

  if (/[A-Z]/.test(password)) strength.score++;
  else strength.feedback.push('Include uppercase letter');

  if (/[a-z]/.test(password)) strength.score++;
  else strength.feedback.push('Include lowercase letter');

  if (/[0-9]/.test(password)) strength.score++;
  else strength.feedback.push('Include number');

  if (/[!@#$%^&*]/.test(password)) strength.score++;
  else strength.feedback.push('Include special character');

  return strength;
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent, filename = 'export.csv') => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};
