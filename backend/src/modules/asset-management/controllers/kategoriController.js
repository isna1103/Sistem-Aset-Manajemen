const { Kategori } = require('../../shared/database');

exports.getAll = async (req, res) => {
  try {
    const data = await Kategori.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Kategori.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await Kategori.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await Kategori.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    await data.update(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const data = await Kategori.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    await data.destroy();
    res.json({ message: 'Kategori deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
