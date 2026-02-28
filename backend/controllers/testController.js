const Question = require('../models/Question');
const Response = require('../models/Response');
const Recommendation = require('../models/Recommendation');
const Minor = require('../models/Minor');

const labelFromScore = (score) => {
  if (score >= 8.0) return 'Eligible';
  if (score >= 6.0) return 'Potential';
  return 'Not Recommended';
};

exports.getQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) { next(err); }
};

exports.submitTest = async (req, res, next) => {
  try {
    const { answers } = req.body; // answers: [{ questionId, value }]
    if (!answers || !Array.isArray(answers)) return res.status(400).json({ message: 'Answers required' });

    // fetch questions and minors
    const questions = await Question.find({ _id: { $in: answers.map(a => a.questionId) } });
    const minors = await Minor.find();
    const minorNames = minors.map(m => m.name);

    // compute raw score per minor
    const raw = {}; // minor -> sum(answerValue * weight)
    const maxWeightPerMinor = {}; // minor -> sum(maxPossibleAnswer * weight), approximate
    minors.forEach(m => { raw[m.name] = 0; maxWeightPerMinor[m.name] = 0; });

    // assume answers value is numeric (e.g., 0-5)
    // for maxPossibleAnswer we'll derive from each question's option max or assume 5
    for (const q of questions) {
      const ansObj = answers.find(a => String(a.questionId) === String(q._id));
      const ansValue = ansObj ? Number(ansObj.value) : 0;
      // get max option value if available
      let maxOption = 5;
      if (q.options && q.options.length) {
        maxOption = Math.max(...q.options.map(o => o.value));
      }
      for (const [minor, w] of q.weights.entries()) {
        if (!raw[minor]) raw[minor] = 0;
        if (!maxWeightPerMinor[minor]) maxWeightPerMinor[minor] = 0;
        raw[minor] += ansValue * w;
        maxWeightPerMinor[minor] += maxOption * w;
      }
    }

    // compute normalized scores out of 10
    const scores = {};
    for (const minor of Object.keys(raw)) {
      const denom = maxWeightPerMinor[minor] || 1;
      const normalized = (raw[minor] / denom) * 10;
      // clamp 0..10
      scores[minor] = Math.max(0, Math.min(10, Number(normalized.toFixed(2))));
    }

    // create ranking
    const ranked = Object.entries(scores)
      .map(([minor, score]) => ({ minor, score, label: labelFromScore(score) }))
      .sort((a, b) => b.score - a.score);

    // save response & recommendation
    const responseDoc = await Response.create({
      userId: req.user ? req.user._id : null,
      answers,
      scores
    });

    const recommendation = await Recommendation.create({
      userId: req.user ? req.user._id : null,
      rankedMinors: ranked.slice(0, 10)
    });

    res.json({ responseId: responseDoc._id, recommendationId: recommendation._id, ranked });
  } catch (err) { next(err); }
};

exports.getRecommendationsForUser = async (req, res, next) => {
  try {
    const recs = await Recommendation.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(recs);
  } catch (err) { next(err); }
};
