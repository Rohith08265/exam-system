/**
 * Application Constants
 */

const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

const EXAM_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

const QUESTION_TYPES = {
  MCQ: 'mcq',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
};

const ATTEMPT_STATUS = {
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  AUTO_SUBMITTED: 'auto_submitted',
};

const PERMISSIONS = {
  [USER_ROLES.STUDENT]: [
    'view_exams',
    'attempt_exams',
    'view_results',
    'view_profile',
  ],
  [USER_ROLES.TEACHER]: [
    'create_exams',
    'edit_exams',
    'delete_exams',
    'view_questions',
    'add_questions',
    'edit_questions',
    'delete_questions',
    'view_results',
    'export_results',
    'view_students',
  ],
  [USER_ROLES.ADMIN]: [
    'manage_users',
    'manage_exams',
    'manage_questions',
    'view_all_results',
    'view_analytics',
    'export_data',
    'system_settings',
    'view_logs',
  ],
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports = {
  USER_ROLES,
  EXAM_STATUS,
  QUESTION_TYPES,
  ATTEMPT_STATUS,
  PERMISSIONS,
  HTTP_STATUS,
};
