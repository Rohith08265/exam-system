const Result = require('../models/Result');
const Attempt = require('../models/Attempt');

/**
 * Get result by ID
 */
exports.getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.resultId)
      .populate('student', 'firstName lastName email')
      .populate('exam', 'title subject totalMarks')
      .populate({
        path: 'answerDetails.question',
        model: 'Question',
      });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Check authorization
    if (
      result.student._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'teacher' &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching result' });
  }
};

/**
 * Get student's results
 */
exports.getStudentResults = async (req, res) => {
  try {
    const { page = 1, limit = 20, examId } = req.query;

    let query = { student: req.user._id };
    if (examId) query.exam = examId;

    const skip = (page - 1) * limit;
    const results = await Result.find(query)
      .populate('exam', 'title subject totalMarks')
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt');

    const total = await Result.countDocuments(query);

    res.status(200).json({
      results,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results' });
  }
};

/**
 * Get exam results (Teacher/Admin)
 */
exports.getExamResults = async (req, res) => {
  try {
    const { examId } = req.params;
    const { page = 1, limit = 20, sort = '-marksObtained' } = req.query;

    const skip = (page - 1) * limit;
    const results = await Result.find({ exam: examId })
      .populate('student', 'firstName lastName enrollmentNumber email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sort);

    const total = await Result.countDocuments({ exam: examId });

    // Calculate statistics
    const stats = await Result.aggregate([
      { $match: { exam: require('mongoose').Types.ObjectId(examId) } },
      {
        $group: {
          _id: null,
          averageMarks: { $avg: '$marksObtained' },
          averagePercentage: { $avg: '$percentage' },
          passedCount: { $sum: { $cond: ['$isPassed', 1, 0] } },
          failedCount: { $sum: { $cond: ['$isPassed', 0, 1] } },
          highestMarks: { $max: '$marksObtained' },
          lowestMarks: { $min: '$marksObtained' },
        },
      },
    ]);

    res.status(200).json({
      results,
      statistics: stats[0] || {},
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching exam results:', error);
    res.status(500).json({ message: 'Error fetching exam results' });
  }
};

/**
 * Get leaderboard for exam
 */
exports.getExamLeaderboard = async (req, res) => {
  try {
    const { examId } = req.params;
    const { limit = 100 } = req.query;

    const leaderboard = await Result.find({ exam: examId })
      .populate('student', 'firstName lastName enrollmentNumber profileImage')
      .sort('-marksObtained')
      .limit(parseInt(limit))
      .lean();

    // Add rank
    const rankedLeaderboard = leaderboard.map((result, index) => ({
      ...result,
      rank: index + 1,
    }));

    res.status(200).json({
      leaderboard: rankedLeaderboard,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};

/**
 * Get analytics for exam
 */
exports.getExamAnalytics = async (req, res) => {
  try {
    const { examId } = req.params;

    const results = await Result.find({ exam: examId });

    const analytics = {
      totalAttempts: results.length,
      passedCount: results.filter((r) => r.isPassed).length,
      failedCount: results.filter((r) => !r.isPassed).length,
      averageMarks: (results.reduce((sum, r) => sum + r.marksObtained, 0) / results.length).toFixed(
        2
      ),
      averagePercentage: (results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(
        2
      ),
      highestMarks: Math.max(...results.map((r) => r.marksObtained)),
      lowestMarks: Math.min(...results.map((r) => r.marksObtained)),
      gradeDistribution: {
        A: results.filter((r) => r.grade === 'A').length,
        B: results.filter((r) => r.grade === 'B').length,
        C: results.filter((r) => r.grade === 'C').length,
        D: results.filter((r) => r.grade === 'D').length,
        F: results.filter((r) => r.grade === 'F').length,
      },
    };

    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

/**
 * Export results as CSV
 */
exports.exportResultsAsCSV = async (req, res) => {
  try {
    const { examId } = req.params;

    const results = await Result.find({ exam: examId })
      .populate('student', 'firstName lastName email enrollmentNumber')
      .populate('exam', 'title totalMarks');

    // Create CSV content
    let csv = 'Student Name,Email,Enrollment Number,Total Marks,Marks Obtained,Percentage,Grade,Status\n';

    results.forEach((result) => {
      csv += `"${result.student.firstName} ${result.student.lastName}","${result.student.email}","${result.student.enrollmentNumber}","${result.exam.totalMarks}","${result.marksObtained}","${result.percentage.toFixed(2)}","${result.grade}","${
        result.isPassed ? 'PASSED' : 'FAILED'
      }"\n`;
    });

    res.status(200).setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="exam-results.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting results' });
  }
};
