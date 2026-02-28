const Question = require('../models/Question');
const Minor = require('../models/Minor');

exports.createQuestion = async (req, res, next) => {
  try {
    const { text, weights, options } = req.body;
    if (!text) return res.status(400).json({ message: 'Question text required' });
    const q = await Question.create({ text, weights, options });
    res.status(201).json(q);
  } catch (err) { next(err); }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!q) return res.status(404).json({ message: 'Question not found' });
    res.json(q);
  } catch (err) { next(err); }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

exports.createMinor = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const m = await Minor.create({ name, description });
    res.status(201).json(m);
  } catch (err) { next(err); }
};

exports.getMinors = async (req, res, next) => {
  try {
    const minors = await Minor.find();
    res.json(minors);
  } catch (err) { next(err); }
};
