const Talent = require('../models/Talent');

exports.getAll = async (req, res) => {
  try {
    const talents = await Talent.findAll();
    res.json({ success: true, data: talents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const talent = await Talent.create(req.body);
    res.status(201).json({ success: true, data: talent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
