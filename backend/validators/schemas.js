const Joi = require('joi');

/**
 * User registration validation schema
 */
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).max(30).required(),
  confirmPassword: Joi.ref('password'),
  role: Joi.string().valid('student', 'teacher').default('student'),
  phone: Joi.string().optional(),
  department: Joi.string().optional(),
  enrollmentNumber: Joi.string().optional(),
});

/**
 * User login validation schema
 */
const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

/**
 * Question creation validation schema
 */
const questionSchema = Joi.object({
  text: Joi.string().required(),
  type: Joi.string().valid('mcq', 'true_false', 'short_answer').required(),
  options: Joi.array().items(
    Joi.object({
      text: Joi.string().required(),
      isCorrect: Joi.boolean().required(),
    })
  ),
  correctAnswer: Joi.string().optional(),
  explanation: Joi.string().optional(),
  marks: Joi.number().min(0.5).max(10).default(1),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
  tags: Joi.array().items(Joi.string()).optional(),
});

/**
 * Exam creation validation schema
 */
const examSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  subject: Joi.string().required(),
  duration: Joi.number().min(1).required(),
  totalMarks: Joi.number().min(1).required(),
  passingMarks: Joi.number().min(0).required(),
  questions: Joi.array().items(Joi.string().required()).optional(),
  randomizeQuestions: Joi.boolean().default(false),
  randomizeOptions: Joi.boolean().default(false),
  showCorrectAnswers: Joi.boolean().default(true),
  allowReview: Joi.boolean().default(true),
  allowMultipleAttempts: Joi.boolean().default(false),
  maxAttempts: Joi.number().min(1).default(1),
  resultVisibility: Joi.string()
    .valid('immediate', 'scheduled', 'manual')
    .default('immediate'),
  resultRevealDate: Joi.date().optional(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  requiresAccessCode: Joi.boolean().default(false),
  enrolledStudents: Joi.array().items(Joi.string()).optional(),
});

/**
 * Answer submission validation schema
 */
const answerSubmissionSchema = Joi.object({
  question: Joi.string().required(),
  answer: Joi.string().required(),
});

/**
 * Password reset validation schema
 */
const passwordResetSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

/**
 * New password validation schema
 */
const newPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).max(30).required(),
  confirmPassword: Joi.ref('password'),
});

module.exports = {
  registerSchema,
  loginSchema,
  questionSchema,
  examSchema,
  answerSubmissionSchema,
  passwordResetSchema,
  newPasswordSchema,
};
